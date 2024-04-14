export interface ProductBundleItem {
  image: string;
  title: string;
  sku: string;
}

export interface Product {
  slug: string;
  title: string;
  subtitle?: string;
  sku: string;
  price: number;
  tax: number;
  description: string;
  isBundle: boolean;
  bundleSlots?: number;
  bundleItems?: ProductBundleItem[];
  images: string[];
  maxQuantity?: number;
}
