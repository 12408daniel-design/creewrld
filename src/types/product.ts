export const PRODUCT_CATEGORIES = [
  'All',
  'Sneakers',
  'Streetwear',
  'Old Money',
  'Y2K',
  'Men',
  'Women',
] as const;

export type FilterCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductCategory = Exclude<FilterCategory, 'All'>;

export interface Product {
  id: string;
  title: string;
  category: ProductCategory | string;
  price_ksh: number;
  size: string;
  condition: string;
  image_url: string;
  created_at: string;
}

export interface NewProductInput {
  title: string;
  category: ProductCategory;
  price_ksh: number;
  size: string;
  condition: string;
}
