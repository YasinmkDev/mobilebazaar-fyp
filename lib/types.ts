export interface Variant {
  sku: string;
  storageGb: number;
  ramGb: number;
  pricePkr: number;
  oldPricePkr?: number;
  stock: number;
}

export interface Phone {
  id: string;
  slug: string;
  brand: string;
  model: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  colours: string[];
  image?: string; // admin-uploaded device photo (data URL) for devices added in the panel
  hue: number; // CSS phone-visual backdrop hue until press images are added
  tags: string[]; // e.g. "gaming", "camera", "budget", "flagship"
  ptaApproved: boolean;
  warranty: string;
  specs: {
    display: string;
    refreshHz: number;
    chipset: string;
    mainCameraMp: number;
    selfieCameraMp: number;
    batteryMah: number;
    chargingW: number;
    fiveG: boolean;
    nfc: boolean;
    os: string;
  };
  variants: Variant[];
}

export const lowestPrice = (p: Phone) =>
  Math.min(...p.variants.map((v) => v.pricePkr));

export const emiMonthly = (pricePkr: number, months = 12) =>
  Math.round(pricePkr / months);
