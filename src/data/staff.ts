import { SupabaseClient } from '@supabase/supabase-js';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
}

export const STAFF_DEFAULTS: StaffMember[] = [
  {
    id: 'mohammed',
    name: "Mohammed Athar Rashid",
    role: "Property Manager - CEO",
    description: "Expert property manager with over 25 years of experience in the UK property market.",
    image: "/uk_properties_hero_v2.png" // Using the branded asset as default if needed
  },
  {
    id: 'zarqa',
    name: "Zarqa Arshad",
    role: "Sales Manager",
    description: "Specializing in residential sales and client relationship management.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'jangir',
    name: "Jangir Kanth",
    role: "Legal Team I/A Alphine Solicitors",
    description: "Legal specialist in property conveyancing and regulatory compliance.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'khalid',
    name: "Khalid Ghennai",
    role: "Residential Sales Team",
    description: "Passionate about residential sales and localized property sourcing.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
  }
];

interface StaffRecord {
  id: string;
  id_slug?: string;
  name: string;
  role: string;
  description: string;
  image_url?: string;
}

export const getStaff = async (supabase?: SupabaseClient): Promise<StaffMember[]> => {
  try {
    let client = supabase;
    if (!client) {
      const { createClient } = await import('@/lib/supabase/client');
      client = createClient() as SupabaseClient;
    }

    const { data, error } = await client
      .from('staff')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) return STAFF_DEFAULTS;

    return (data as StaffRecord[]).map((m: StaffRecord) => ({
      id: m.id_slug || m.id,
      name: m.name,
      role: m.role,
      description: m.description,
      image: m.image_url || STAFF_DEFAULTS.find(d => d.id === m.id_slug)?.image || ''
    }));
  } catch (err) {
    console.warn('Staff fetch failed, using defaults:', err);
    return STAFF_DEFAULTS;
  }
};
