import type { Product, ProductBundleItem } from './product';

export interface BasketItem {
  id: string;
  product: Product;
  quantity: number;
  bundleItems?: ProductBundleItem[];
}

export interface Basket {
  items: BasketItem[];
  shippingCosts: number;
  subtotal: number;
  total: number;
  tax: number;
}
