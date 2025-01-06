export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  isPopular: boolean;
  image: string;
  category: {
    id: string;
    slug: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface HeroContent {
  title: string;
  subtitle?: string;
  description: string;
  images: string[];
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface ContactInfo {
  address: string;
  phone1: string;
  phone2: string | null;
  email: string;
  mapUrl: string;
  hours: {
    monday: BusinessHours;
    tuesday: BusinessHours;
    wednesday: BusinessHours;
    thursday: BusinessHours;
    friday: BusinessHours;
    saturday: BusinessHours;
    sunday: BusinessHours;
  };
}

export interface BusinessHours {
  open: string;
  close: string;
  isClosed: boolean;
}
