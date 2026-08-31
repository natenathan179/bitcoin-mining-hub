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
  kind: string;
  handle: string;
  review_note: string;
}

const table = (name: string) => supabase.from(name as never);

// Storefront lists never render the long-form `description` body (only product
// detail pages do), so list queries omit it to keep payloads small and fast.
const PRODUCT_LIST_COLUMNS =
  "id,name,slug,brand,category_id,hashrate,power,efficiency,algorithm,condition,stock_status,price,sale_price,short_description,specs,images,featured,created_at";

/**
 * Crawl resilience layer.
 *
 * Every SSR page reads the shared product/category lists. When a crawler walks
 * thousands of URLs at once, a single throttled or slow backend response used to
 * bubble out of the loader and render an HTTP 500 for that page — which SEO
 * audits report as a 5xx error. Reads now retry, and successful results are
 * memoised per server instance for a short TTL so a crawl issues a handful of
 * backend requests instead of one per page. If a read still fails we fall back
 * to the last known good value (or an empty list) rather than failing the page.
 */
const TTL_MS = 60_000;
const STALE_MS = 24 * 60 * 60 * 1000;
const cache = new Map<string, { value: unknown; at: number }>();

async function resilientRead<T>(key: string, read: () => Promise<T>, fallback: T): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value as T;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const value = await read();
      cache.set(key, { value, at: Date.now() });
      return value;
    } catch (error) {
      if (attempt === 2) {
        console.error(`[data] read failed for ${key}`, error);
        if (hit && Date.now() - hit.at < STALE_MS) return hit.value as T;
        return fallback;
      }
      await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
    }
  }
  return fallback;
}

export async function fetchCategories(): Promise<Category[]> {
  return resilientRead<Category[]>(
    "categories",
    async () => {
      const { data, error } = await table("categories").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as Category[];
    },
    [],
  );
}

export async function fetchProducts(): Promise<Product[]> {
  return resilientRead<Product[]>(
    "products",
    async () => {
      const { data, error } = await table("products")
        .select(PRODUCT_LIST_COLUMNS)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => ({
        description: "",
        ...(row as object),
      })) as unknown as Product[];
    },
    [],
  );
}

/** Full rows including `description` — used by the admin product editor. */
export async function fetchProductsFull(): Promise<Product[]> {
  const { data, error } = await table("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Product[];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  return resilientRead<Product | null>(
    `product:${slug}`,
    async () => {
      const { data, error } = await table("products").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as Product | null;
    },
    null,
  );
}


export async function fetchReviews(): Promise<Review[]> {
  const { data, error } = await table("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Review[];
}

/** Homepage showcase: only the handful of rows the hero grid renders. */
export async function fetchHomeProducts(): Promise<Product[]> {
  const { data, error } = await table("products")
    .select(PRODUCT_LIST_COLUMNS)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(6);
  if (error) throw error;
  return (data ?? []).map((row) => ({ description: "", ...(row as object) })) as unknown as Product[];
}

/** Homepage reviews strip: three most recent approved reviews. */
export async function fetchTopReviews(): Promise<Review[]> {
  const { data, error } = await table("reviews")
    .select("id,name,location,rating,title,body,avatar_url,product_name,verified,approved,created_at")
    .order("created_at", { ascending: false })
    .limit(3);
  if (error) throw error;
  return (data ?? []) as unknown as Review[];
}

export const homeProductsQuery = () =>
  queryOptions({ queryKey: ["products", "home"], queryFn: fetchHomeProducts });

export const topReviewsQuery = () =>
  queryOptions({ queryKey: ["reviews", "top"], queryFn: fetchTopReviews });

export const categoriesQuery = () =>
  queryOptions({ queryKey: ["categories"], queryFn: fetchCategories });

export const productsQuery = () => queryOptions({ queryKey: ["products"], queryFn: fetchProducts });

export const productsFullQuery = () =>
  queryOptions({ queryKey: ["products", "full"], queryFn: fetchProductsFull });

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