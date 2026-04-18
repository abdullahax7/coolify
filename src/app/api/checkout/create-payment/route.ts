import { NextRequest, NextResponse } from 'next/server';
import { squareClient, SQUARE_LOCATION_ID } from '@/lib/square';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Fetch profile for customer name/phone
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, phone')
    .eq('id', user.id)
    .single();

  const { sourceId, amount, currency = 'GBP', orderDetails, pdfData } = await req.json();
  if (!sourceId || !amount) {
    return NextResponse.json({ error: 'Missing sourceId or amount' }, { status: 400 });
  }

  const locationId = (SQUARE_LOCATION_ID ?? '').trim();
  const amountPence = Math.round(amount * 100);

  // ── 0. Handle PDF Upload if present ───────────────────────────────────
  let finalPdfUrl: string | null = null;
  const orderId = `ORD-${Date.now()}`;

  if (pdfData && typeof pdfData === 'string') {
    try {
      const base64Content = pdfData.split(',')[1] || pdfData;
      const buffer = Buffer.from(base64Content, 'base64');
      const filePath = `${user.id}/${orderId}.pdf`;

      const { data: uploadData, error: uploadError } = await admin.storage
        .from('pdfs')
        .upload(filePath, buffer, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (uploadError) {
        console.error('[checkout] PDF upload error:', uploadError.message);
      } else {
        const { data: signedData, error: signError } = await admin.storage
          .from('pdfs')
          .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10); // 10 years
        
        if (signError) {
          console.error('[checkout] PDF sign error:', signError.message);
        } else {
          finalPdfUrl = signedData?.signedUrl ?? null;
        }
      }
    } catch (e) {
      console.error('[checkout] PDF processing error:', e);
    }
  }

  // ── 1. Charge via Square ──────────────────────────────────────────────
  let squarePaymentId: string | undefined;
  try {
    const response = await squareClient.payments.create({
      sourceId,
      idempotencyKey: crypto.randomUUID(),
      locationId,
      amountMoney: { amount: BigInt(amountPence), currency },
      note: orderDetails?.name ?? 'Property Trader order',
      referenceId: user.id,
      buyerEmailAddress: user.email ?? undefined,
    });
    squarePaymentId = response.payment?.id;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[checkout] Square error:', msg, { locationId, amountPence });
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  // ── 2. Persist order to Supabase ─────────────────────────────────────
  const orderRow = {
    id: orderId,
    user_id: user.id,
    type: orderDetails?.type ?? 'service',
    name: orderDetails?.name ?? 'Property Service',
    price: orderDetails?.price ?? `£${amount}`,
    detail: orderDetails?.detail ?? '',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'active',
    square_payment_id: squarePaymentId ?? null,
    form_type: orderDetails?.formType || null,
    form_data: orderDetails?.formData || null,
    pdf_url: finalPdfUrl,
    customer_name: profile?.name ?? '',
    customer_email: user.email ?? '',
    customer_phone: profile?.phone ?? '',
  };

  const { error: dbError } = await supabase.from('orders').insert(orderRow);
  if (dbError) {
    // Payment succeeded but DB write failed — log it so admin can recover
    console.error('[checkout] DB insert failed:', dbError.message, { squarePaymentId, userId: user.id });
    // Still return success to the client since money was taken
    return NextResponse.json({
      paymentId: squarePaymentId,
      status: 'COMPLETED',
      orderDetails,
      pdfUrl: finalPdfUrl,
      warning: 'Payment succeeded but order record could not be saved. Please contact support.',
    });
  }

  return NextResponse.json({
    paymentId: squarePaymentId,
    status: 'COMPLETED',
    orderDetails,
    orderId: orderRow.id,
    pdfUrl: finalPdfUrl,
  });
}
