import { createClient } from '@/lib/supabase/client';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin?: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  type: 'listing' | 'service';
  name: string;
  price: string;
  detail: string;
  date: string;
  status: 'active' | 'pending' | 'completed';
  formData?: Record<string, string>;
  formType?: string;
  pdfUrl?: string;
}

export async function getUser(): Promise<User | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, phone, is_admin, created_at')
    .eq('id', user.id)
    .single();
  if (!profile) return null;
  return {
    id: user.id,
    name: profile.name,
    email: user.email!,
    phone: profile.phone ?? undefined,
    isAdmin: profile.is_admin ?? false,
    createdAt: profile.created_at,
  };
}

export async function signIn(
  email: string,
  password: string,
  captchaToken?: string | null,
): Promise<{ error?: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, captchaToken }),
  });
  const data = await res.json() as { error?: string };
  if (!res.ok) return { error: data.error ?? 'Sign in failed.' };
  return {};
}

export async function signUp(
  name: string,
  email: string,
  phone: string,
  password: string,
  captchaToken?: string | null,
): Promise<{ error?: string; needsConfirmation?: boolean }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, password, captchaToken }),
  });
  const data = await res.json() as { error?: string; needsConfirmation?: boolean };
  if (!res.ok) return { error: data.error ?? 'Registration failed.' };
  return { needsConfirmation: data.needsConfirmation };
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getOrders(): Promise<Order[]> {
  const res = await fetch('/api/orders');
  if (!res.ok) return [];
  const data = await res.json();
  return (data.orders ?? []).map((o: Record<string, unknown>) => ({
    id: o.id,
    type: o.type,
    name: o.name,
    price: o.price,
    detail: o.detail ?? '',
    date: o.date ?? '',
    status: o.status ?? 'pending',
    formType: o.form_type ?? undefined,
    formData: o.form_data ?? undefined,
    pdfUrl: o.pdf_url ?? undefined,
  }));
}

export async function addOrder(order: Omit<Order, 'id' | 'date'>): Promise<Order> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  return res.json();
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<void> {
  await fetch(`/api/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}
