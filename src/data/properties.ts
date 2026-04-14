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

export const PROPERTIES: Property[] = [
  {
    id: 'azure-penthouse',
    image: '/images/prop_1.png',
    gallery: [
      '/images/prop_1.png',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200'
    ],
    videoUrl: 'https://www.youtube.com/embed/v7739Y1feyo', // Luxury penthouse tour
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.540422170321!2d-0.12165242338162!3d51.50332401033261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d26973%3A0x4291f3172409ea92!2sLastminute.com%20London%20Eye!5e0!3m2!1sen!2suk!4v1712123456789!5m2!1sen!2suk&maptype=satellite',
    title: 'The Azure Penthouse',
    location: '12-14 High Street, London, EC1',
    price: '£3,250,000',
    beds: 4,
    baths: 3,
    sqft: 2850,
    type: 'Penthouse',
    listingType: 'Sale',
    sector: 'Residential',
    description: 'A masterpiece of modern engineering and design, the Azure Penthouse offers panoramic views of the city skyline. Featuring floor-to-ceiling windows, a private elevator, and a 1,000 sqft terrace, this residence defines luxury living.',
    features: ['Private Terrace', 'Smart Home Integration', '24/7 Concierge', 'Valet Parking', 'Wine Cellar'],
    detailedInfo: {
      interior: 'The interior spans over 2,800 sqft of pure luxury. Italian marble flooring throughout, bespoke joinery, and a chef-grade Gaggenau kitchen. The master suite features an automated skylight and a spa-like bathroom with a solid stone bathtub overlooking the Thames.',
      exterior: 'Constructed with a triple-glazed curtain wall system for ultimate thermal and acoustic insulation. The private wraparound terrace was designed by world-renowned landscape architect Piet Oudolf, featuring native plants and an automated irrigation system.',
      neighbourhood: 'Situated in the historic core of London, the neighbourhood is a blend of architectural heritage and modern convenience. Within a 5-minute walk, you will find Michelin-starred restaurants, elite private galleries, and the global headquarters of major financial institutions.'
    },
    amenities: [
      { icon: '🏊‍♂️', label: 'Infinity Pool' },
      { icon: '🏋️‍♀️', label: 'Private Gym' },
      { icon: '🎥', label: 'Cinema Room' },
      { icon: '🍷', label: 'Wine Cellar' },
      { icon: '🅿️', label: 'Valet Parking' },
      { icon: '🧘', label: 'Yoga Studio' }
    ],
    agent: {
      name: 'Sarah Jenkins',
      role: 'Senior Portfolio Manager',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
      phone: '+44 20 7946 0123'
    }
  },
  {
    id: 'sunset-villa',
    image: '/images/prop_2.png',
    gallery: [
      '/images/prop_2.png',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.540422170321!2d-0.12165242338162!3d51.50332401033261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d26973%3A0x4291f3172409ea92!2sLastminute.com%20London%20Eye!5e0!3m2!1sen!2suk!4v1712123456789!5m2!1sen!2suk&maptype=satellite',
    title: 'Modern Sunset Villa',
    location: '67 Oak Avenue, Richmond, TW1',
    price: '£1,850,000',
    beds: 5,
    baths: 4,
    sqft: 4200,
    type: 'Villa',
    listingType: 'Sale',
    sector: 'Residential',
    description: 'Nestled in the heart of Richmond, this contemporary villa combines organic materials with bold architectural lines. The open-plan living area flows seamlessly into the landscaped gardens, making it perfect for entertaining.',
    features: ['Infinity Pool', 'Home Cinema', 'Landscaped Gardens', 'Underfloor Heating', 'Solar Arrays'],
    detailedInfo: {
      interior: '4,200 sqft of open-plan living. High-performance solar gain windows, polished concrete floors, and a double-height atrium. The kitchen features custom walnut cabinetry and an integrated herb garden under automated UV lighting.',
      exterior: 'A blend of local stone and sustainable cedar cladding. The grounds feature a zero-edge infinity pool, an outdoor kitchen with integrated pizza oven, and a private yoga deck overlooking the Richmond valley.',
      neighbourhood: 'Richmond is renowned for its parks and elite schools. The villa is moments away from Richmond Park and features excellent connectivity to Central London while maintaining a tranquil, leafy character.'
    },
    amenities: [
      { icon: '🏊‍♂️', label: 'Infinity Pool' },
      { icon: '🎥', label: 'Home Cinema' },
      { icon: '🔥', label: 'Outdoor Firepit' },
      { icon: '🍷', label: 'Wine Cellar' },
      { icon: '🅿️', label: 'Double Garage' },
      { icon: '☀️', label: 'Solar Arrays' }
    ],
    agent: {
      name: 'Michael Chen',
      role: 'Luxury Specialist',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
      phone: '+44 20 7946 0456'
    }
  },
  {
    id: 'imperial-gardens',
    image: '/images/hero_ready.png',
    gallery: [
      '/images/hero_ready.png',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1200'
    ],
    videoUrl: '',
    mapEmbedUrl: '',
    title: 'Imperial Gardens',
    location: 'Mayfair, London, W1K',
    price: '£5,450,000',
    beds: 5,
    baths: 5,
    sqft: 4100,
    type: 'Estate',
    listingType: 'Sale',
    sector: 'Residential',
    description: 'An unparalleled opportunity to acquire a historic Mayfair estate, fully renovated for the 21st century. This property features original Victorian details merged with Italian marble finishes and bespoke cabinetry.',
    features: ['Grade II Listed', 'Private Spa', 'Library', 'Commercial Kitchen', 'Double Garage'],
    detailedInfo: {
      interior: 'Fully renovated historic interiors with original Victorian features preserved. Italian marble finishes and bespoke cabinetry throughout.',
      exterior: 'Grade II listed Victorian facade with a private gated driveway and a rooftop terrace overlooking Mayfair.',
      neighbourhood: 'The pinnacle of London living. Mayfair offers immediate access to the world\'s most exclusive retail, dining, and art institutions.'
    },
    amenities: [
      { icon: '🏛️', label: 'Historic Architecture' },
      { icon: '🧖‍♀️', label: 'Private Spa' },
      { icon: '📚', label: 'Library' },
      { icon: '🍳', label: 'Commercial Kitchen' },
      { icon: '🅿️', label: 'Double Garage' }
    ],
    agent: {
      name: 'James Radcliffe',
      role: 'Partner',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
      phone: '+44 20 7946 0888'
    }
  },
  {
    id: 'zenith-loft',
    image: '/images/prop_1.png',
    gallery: ['/images/prop_1.png'],
    videoUrl: '',
    mapEmbedUrl: '',
    title: 'The Zenith Loft',
    location: 'Shoreditch, London, E1',
    price: '£4,500 /mo',
    beds: 2,
    baths: 2,
    sqft: 1600,
    type: 'Loft',
    listingType: 'Rent',
    sector: 'Residential',
    description: 'Located in the vibrant heart of Shoreditch, the Zenith Loft features exposed brickwork, original warehouse beams, and contemporary industrial finishes. The triple-height ceilings create a vast sense of space and light.',
    features: ['Exposed Brick', 'Industrial Finishes', 'Rooftop Access', 'Open Plan', 'Mezzanine Study'],
    detailedInfo: {
      interior: 'Industrial loft aesthetic with exposed brick and warehouse beams. Triple-height ceilings and a custom steel mezzanine study.',
      exterior: 'Original warehouse conversion with industrial windows and private rooftop access.',
      neighbourhood: 'The creative heart of London. Shoreditch offers an eclectic mix of tech hubs, street art galleries, and craft beverage houses.'
    },
    amenities: [
        { icon: '🧱', label: 'Exposed Brick' },
        { icon: '🪟', label: 'Industrial Windows' },
        { icon: '🪴', label: 'Rooftop Access' },
        { icon: '🏢', label: 'Open Plan' },
        { icon: '🏢', label: 'Mezzanine Study' }
      ],
    agent: {
      name: 'Elena Rossi',
      role: 'Urban Specialist',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
      phone: '+44 20 7946 0222'
    }
  },
  {
     id: 'canary-office',
     image: '/images/prop_2.png',
     gallery: ['/images/prop_2.png'],
     videoUrl: '',
     mapEmbedUrl: '',
     title: 'Canary Wharf Executive Suite',
     location: 'One Canada Square, London, E14',
     price: '£120,000 /yr',
     beds: 0,
     baths: 2,
     sqft: 5000,
     type: 'Office',
     listingType: 'Rent',
     sector: 'Commercial',
     description: 'A premium executive office suite in the iconic Canary Wharf tower. Features high-speed fiber internet, private meeting rooms, and access to a shared business lounge.',
     features: ['A-Grade Office', 'Full Serviced', 'Central Cooling', 'Fiber Internet', 'Security'],
     detailedInfo: {
      interior: 'A-Grade corporate interior with private meeting rooms and high-speed fiber backbone.',
      exterior: 'Iconic skyscraper construction with 24/7 security and executive parking access.',
      neighbourhood: 'Global financial district with unparalleled transport connectivity and world-class commercial amenities.'
    },
    amenities: [
        { icon: '🏙️', label: 'Executive Suite' },
        { icon: '🔒', label: '24/7 Security' },
        { icon: '🌐', label: 'Fiber Internet' },
        { icon: '🅿️', label: 'Executive Parking' },
        { icon: '🌬️', label: 'Central Cooling' }
      ],
     agent: {
        name: 'James Radcliffe',
        role: 'Partner',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
        phone: '+44 20 7946 0888'
     }
  }
];
