import { SupabaseClient } from '@supabase/supabase-js';

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
}

export const TESTIMONIALS_DEFAULTS: Testimonial[] = [
  {
    quote: "Property Trader has completely transformed how I manage my central London portfolio. Their attention to detail is unparalleled.",
    author: "Alexandra Vane",
    role: "Portfolio Owner, Mayfair",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    quote: "The tenant screening process is rigorous and professional. I've had zero issues since switching to Property Trader.",
    author: "Marcus Thorne",
    role: "Property Investor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    quote: "Exceptional service from start to finish. The dashboard makes tracking my rental income and maintenance so easy.",
    author: "Elena Rossi",
    role: "Luxury Residential Owner",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200"
  }
];

interface TestimonialRecord {
  quote: string;
  author: string;
  role: string;
  image_url?: string;
}

export const getTestimonials = async (supabase?: SupabaseClient): Promise<Testimonial[]> => {
  try {
    let client = supabase;
    if (!client) {
      const { createClient } = await import('@/lib/supabase/client');
      client = createClient() as SupabaseClient;
    }

    const { data, error } = await client
      .from('testimonials')
      .select('*');

    if (error || !data || data.length === 0) return TESTIMONIALS_DEFAULTS;

    return (data as TestimonialRecord[]).map((t: TestimonialRecord) => ({
      quote: t.quote,
      author: t.author,
      role: t.role,
      image: t.image_url || TESTIMONIALS_DEFAULTS.find(d => d.author === t.author)?.image || ''
    }));
  } catch (err) {
    console.warn('Testimonial fetch failed, using defaults:', err);
    return TESTIMONIALS_DEFAULTS;
  }
};
