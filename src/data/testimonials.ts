export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
}

export const TESTIMONIALS: Testimonial[] = [
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
