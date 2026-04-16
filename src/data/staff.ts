export interface StaffMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
}

export const STAFF: StaffMember[] = [
  {
    id: 'mohammed',
    name: "Mohammed Athar Rashid",
    role: "Property Manager - CEO",
    description: "Expert property manager with over 25 years of experience in the UK property market.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"
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
