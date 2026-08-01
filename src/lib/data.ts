import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category_id: string | null;
  hashrate: string;
  power: string;
  efficiency: string;
  algorithm: string;
  condition: string;
  stock_status: string;
  price: number;
  sale_price: number | null;
  short_description: string;
  description: string;
  specs: Record<string, string>;
  images: string[];
  featured: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  avatar_url: string;
  product_name: string;
  verified: boolean;
  approved: boolean;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  symbol: string;
  network: string;
  address: string;
  qr_image_url: string;
  instructions: string;
  confirmations: number;
  sort_order: number;
  active: boolean;
}

const table = (name: string) => supabase.from(name as never);

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await table("categories").select("*").order("sort_order");
  if (error) throw error;
  return (data ?? []) as unknown as Category[];
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await table("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Product[];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await table("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as Product | null;
}

export async function fetchReviews(): Promise<Review[]> {
  const { data, error } = await table("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Review[];
}

export const categoriesQuery = () =>
  queryOptions({ queryKey: ["categories"], queryFn: fetchCategories });

export const productsQuery = () => queryOptions({ queryKey: ["products"], queryFn: fetchProducts });

export const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => fetchProductBySlug(slug) });

export const reviewsQuery = () => queryOptions({ queryKey: ["reviews"], queryFn: fetchReviews });

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  const { data, error } = await table("payment_methods")
    .select("*")
    .order("sort_order")
    .order("name");
  if (error) throw error;
  return (data ?? []) as unknown as PaymentMethod[];
}

export const paymentMethodsQuery = () =>
  queryOptions({ queryKey: ["payment_methods"], queryFn: fetchPaymentMethods });

export function productImage(product: Pick<Product, "images">, fallback: string) {
  return product.images?.[0] || fallback;
}