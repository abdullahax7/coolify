import { NextRequest, NextResponse } from 'next/server';
import { squareClient, SQUARE_LOCATION_ID } from '@/lib/square';
import { createClient, createAdminClient } from '@/lib/supabase/server';

interface OrderDetails {
  type?: 'service' | 'listing';
  name?: string;
  price?: string;
  detail?: string;
  formType?: string;
  formData?: Record<string, unknown>;
  plan?: string;
  listingType?: 'sell' | 'let';
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { orderId: existingOrderId, service, formData, pdfDraft } = body;

  // ── 0. Handle Post-Purchase Update Case ──────────────────────────────
  if (existingOrderId) {
    // 1. Verify ownership
    const { data: existingOrder } = await supabase.from('orders').select('user_id').eq('id', existingOrderId).single();
    if (!existingOrder || existingOrder.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Handle PDF upload if provided
    let updatedPdfUrl = null;
    if (pdfDraft) {
      try {
        const base64Content = pdfDraft.split(',')[1] || pdfDraft;
        const buffer = Buffer.from(base64Content, 'base64');
        const filePath = `${user.id}/${existingOrderId}.pdf`;
        await admin.storage.from('pdfs').upload(filePath, new Uint8Array(buffer), { contentType: 'application/pdf', upsert: true });
        const { data: signed } = await admin.storage.from('pdfs').createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10);
        updatedPdfUrl = signed?.signedUrl;
      } catch (e) { console.error('Update PDF upload failed', e); }
    }

    // 3. Update Order
    const { error: updateError } = await supabase.from('orders').update({
      form_data: formData,
      pdf_url: updatedPdfUrl || undefined
    }).eq('id', existingOrderId);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    // 4. Update wales_forms
    await supabase.from('wales_forms').update({
      form_data: formData,
      pdf_url: updatedPdfUrl || undefined
    }).eq('form_type', service).eq('user_email', user.email);

    return NextResponse.json({ success: true, orderId: existingOrderId, pdfUrl: updatedPdfUrl });
  }

  // Fetch profile for customer name/phone
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, phone')
    .eq('id', user.id)
    .single();

  const sourceId = body.sourceId;
  const amount = body.amount;
  const currency = body.currency || 'GBP';
  const orderDetails = body.orderDetails as OrderDetails | undefined;
  const pdfData = body.pdfData as string | undefined;

  if (!sourceId && amount > 0) {
    return NextResponse.json({ error: 'Missing sourceId' }, { status: 400 });
  }

  const locationId = (SQUARE_LOCATION_ID ?? '').trim();
  const amountPence = Math.round(amount * 100);

  // ── 1. Handle PDF Upload if present ───────────────────────────────────
  let finalPdfUrl: string | null = null;
  const orderId = `ORD-${Date.now()}`;

  if (pdfData && typeof pdfData === 'string') {
    try {
      const base64Content = pdfData.split(',')[1] || pdfData;
      const buffer = Buffer.from(base64Content, 'base64');
      const filePath = `${user.id}/${orderId}.pdf`;

      const { error: uploadError } = await admin.storage
        .from('pdfs')
        .upload(filePath, new Uint8Array(buffer), {
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

  // ── 2. Charge via Square (Skip if Free Plan) ──────────────────────────
  let squarePaymentId: string | undefined;
  
  if (amountPence > 0) {
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
  } else {
    squarePaymentId = `FREE-${Date.now()}`;
  }

  // ── 3. Persist order to Supabase ─────────────────────────────────────
  const orderRow = {
    id: orderId,
    user_id: user.id,
    type: orderDetails?.type ?? 'service',
    name: orderDetails?.name ?? 'Property Service',
    price: orderDetails?.price ?? `£${amount}`,
    detail: orderDetails?.detail ?? '',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: (orderDetails?.formType?.startsWith('Form RHW') || orderDetails?.formType?.includes('Tenancy') || orderDetails?.formType?.includes('Contract')) ? 'pending' : 'active',
    square_payment_id: squarePaymentId ?? null,
    form_type: orderDetails?.formType || null,
    form_data: orderDetails?.formData || null,
    pdf_url: finalPdfUrl,
    customer_name: profile?.name ?? '',
    customer_email: user.email ?? '',
    customer_phone: profile?.phone ?? '',
    expires_at: calculateExpiry(orderDetails),
  };

  function calculateExpiry(details: OrderDetails | undefined) {
    if (!details || details.type !== 'listing') return null;
    const plan = details.plan;
    const lType = details.listingType; // 'sell' or 'let'
    
    let days = 121; // Default 4 months
    if (lType === 'let') {
      days = 121; // 4 months
    } else if (lType === 'sell') {
      if (plan === 'Basic') days = 182; // 6 months (3+3)
      else if (plan === 'Silver' || plan === 'Gold') days = 365; // 1 year
      else if (plan === 'Ultimate') days = 3650; // 10 years
      else days = 182; // Default sell
    }
    
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  }

  const { error: dbError } = await supabase.from('orders').insert(orderRow);

  // ── 4. Also persist to wales_forms table for admin tracking ──────────
  if (!dbError && (orderDetails?.formType?.startsWith('Form RHW') || orderDetails?.formType === 'Fixed Term Standard Occupation Contract' || orderDetails?.formType === 'Tenancy Agreements')) {
    try {
      // Fetch if admin for admin_email column
      const { data: adminProfile } = await admin.from('profiles').select('is_admin').eq('id', user.id).single();
      
      await admin.from('wales_forms').insert({
        form_type: orderDetails.formType,
        client_name: profile?.name || orderRow.customer_name,
        client_email: user.email,
        client_phone: profile?.phone || orderRow.customer_phone,
        notes: orderDetails.detail || '',
        form_data: orderDetails.formData,
        pdf_url: finalPdfUrl,
        user_email: user.email,
        admin_email: adminProfile?.is_admin ? user.email : null,
        status: 'pending'
      });
    } catch (e) {
      console.error('[checkout] Failed to sync to wales_forms:', e);
    }
  }

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
