export interface Property {
  id: string;
  image: string;
  gallery: string[];
  videoUrl: string;
  mapEmbedUrl: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  listingType: 'Sale' | 'Rent';
  sector: 'Residential' | 'Commercial';
  description: string;
  features: string[];
  detailedInfo: {
    interior: string;
    exterior: string;
    neighbourhood: string;
  };
  amenities: { icon: string; label: string; }[];
  agent: {
    name: string;
    role: string;
    image: string;
    phone: string;
  };
}

export const PROPERTIES: Property[] = [];
