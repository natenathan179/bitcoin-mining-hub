import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { categoriesQuery, productsFullQuery, type Product } from "@/lib/data";
import { uploadProductImage } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/products/$id")({
  component: ProductEditor,
});

type FormState = {
  name: string;
  slug: string;
  brand: string;
  category_id: string;
  hashrate: string;
  power: string;
  efficiency: string;
  algorithm: string;
  condition: string;
  stock_status: string;
  price: string;
  sale_price: string;
  short_description: string;
  description: string;
  featured: boolean;
};

const EMPTY: FormState = {
  name: "",
  slug: "",
  brand: "",
  category_id: "",
  hashrate: "",
  power: "",
  efficiency: "",
  algorithm: "SHA-256",
  condition: "New",
  stock_status: "In Stock",
  price: "",
  sale_price: "",
  short_description: "",
  description: "",
  featured: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ProductEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery(categoriesQuery());
  const { data: products = [] } = useQuery(productsFullQuery());
  const existing = products.find((p) => p.id === id);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setForm({
      name: existing.name,
      slug: existing.slug,
      brand: existing.brand,
      category_id: existing.category_id ?? "",
      hashrate: existing.hashrate,
      power: existing.power,
      efficiency: existing.efficiency,
      algorithm: existing.algorithm,
      condition: existing.condition,
      stock_status: existing.stock_status,
      price: String(existing.price ?? ""),
      sale_price: existing.sale_price != null ? String(existing.sale_price) : "",
      short_description: existing.short_description,
      description: existing.description,
      featured: existing.featured,
    });
    setImages(existing.images ?? []);
    const entries = Object.entries(existing.specs ?? {});
    setSpecs(entries.length ? entries.map(([key, value]) => ({ key, value: String(value) })) : [{ key: "", value: "" }]);
  }, [existing]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        brand: form.brand,
        category_id: form.category_id || null,
        hashrate: form.hashrate,
        power: form.power,
        efficiency: form.efficiency,
        algorithm: form.algorithm,
        condition: form.condition,
        stock_status: form.stock_status,
        price: Number(form.price) || 0,
        sale_price: form.sale_price ? Number(form.sale_price) : null,
        short_description: form.short_description,
        description: form.description,
        featured: form.featured,
        images,
        specs: Object.fromEntries(
          specs.filter((s) => s.key.trim()).map((s) => [s.key.trim(), s.value]),
        ),
      };
      if (isNew) {
        const { error } = await supabase.from("products" as never).insert(payload as never);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("products" as never)
          .update(payload as never)
          .eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(isNew ? "Product created" : "Product updated");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      // Tell Bing & co. about the new/updated page right away (best effort).
      const slug = form.slug || slugify(form.name);
      void pingIndexNowUrls([`${SITE.url}/products/${slug}`, `${SITE.url}/products`]).catch(
        () => undefined,
      );
      navigate({ to: "/admin" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is larger than 10MB`);
          continue;
        }
        urls.push(await uploadProductImage(file));
      }
      setImages((prev) => [...prev, ...urls]);
      if (urls.length) toast.success(`${urls.length} image(s) uploaded`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  if (!isNew && !existing && products.length > 0) {
    return (
      <div className="rounded-md border border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">This product no longer exists.</p>
        <Link to="/admin" className="mt-4 inline-block text-sm font-semibold text-primary">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>
      <h1 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
        {isNew ? "New product" : `Edit: ${form.name}`}
      </h1>

      <form
        className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name.trim()) {
            toast.error("Product name is required");
            return;
          }
          save.mutate();
        }}
      >
        <div className="space-y-6">
          <section className="rounded-md border border-border bg-card p-6">
            <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">Basics</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="p-name">Product name *</Label>
                <Input
                  id="p-name"
                  value={form.name}
                  onChange={(e) => {
                    set("name", e.target.value);
                    if (isNew) set("slug", slugify(e.target.value));
                  }}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-slug">URL slug</Label>
                <Input
                  id="p-slug"
                  value={form.slug}
                  onChange={(e) => set("slug", slugify(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-brand">Brand</Label>
                <Input id="p-brand" value={form.brand} onChange={(e) => set("brand", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-cat">Category</Label>
                <select
                  id="p-cat"
                  value={form.category_id}
                  onChange={(e) => set("category_id", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-stock">Stock status</Label>
                <select
                  id="p-stock"
                  value={form.stock_status}
                  onChange={(e) => set("stock_status", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {["In Stock", "Low Stock", "Pre-Order", "Made To Order", "Out of Stock", "Available"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="p-short">Short description</Label>
                <Textarea
                  id="p-short"
                  rows={2}
                  value={form.short_description}
                  onChange={(e) => set("short_description", e.target.value)}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="p-desc">Full description</Label>
                <Textarea
                  id="p-desc"
                  rows={8}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Separate paragraphs with a blank line."
                />
              </div>
            </div>
          </section>

          <section className="rounded-md border border-border bg-card p-6">
            <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">
              Performance
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["hashrate", "Hashrate", "e.g. 234 TH/s"],
                  ["power", "Power draw", "e.g. 3510W"],
                  ["efficiency", "Efficiency", "e.g. 15 J/TH"],
                  ["algorithm", "Algorithm", "e.g. SHA-256"],
                ] as const
              ).map(([key, label, ph]) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`p-${key}`}>{label}</Label>
                  <Input
                    id={`p-${key}`}
                    placeholder={ph}
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <Label htmlFor="p-cond">Condition</Label>
                <select
                  id="p-cond"
                  value={form.condition}
                  onChange={(e) => set("condition", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {["New", "Refurbished", "Used"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-md border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">
                Specifications
              </h2>
              <button
                type="button"
                onClick={() => setSpecs((s) => [...s, { key: "", value: "" }])}
                className="text-xs font-semibold uppercase text-primary"
              >
                Add row
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {specs.map((row, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    aria-label="Specification name"
                    placeholder="Cooling"
                    value={row.key}
                    onChange={(e) =>
                      setSpecs((s) => s.map((r, j) => (j === i ? { ...r, key: e.target.value } : r)))
                    }
                  />
                  <Input
                    aria-label="Specification value"
                    placeholder="Air"
                    value={row.value}
                    onChange={(e) =>
                      setSpecs((s) =>
                        s.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)),
                      )
                    }
                  />
                  <button
                    type="button"
                    aria-label="Remove specification"
                    onClick={() => setSpecs((s) => s.filter((_, j) => j !== i))}
                    className="px-2 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-md border border-border bg-card p-6">
            <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">Pricing</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="p-price">Price (USD)</Label>
                <Input
                  id="p-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-sale">Sale price (optional)</Label>
                <Input
                  id="p-sale"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.sale_price}
                  onChange={(e) => set("sale_price", e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                />
                Feature on homepage
              </label>
            </div>
          </section>

          <section className="rounded-md border border-border bg-card p-6">
            <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">Images</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload image files from your computer. First image is used as the main product photo.
            </p>
            <label className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed border-border py-8 text-sm text-muted-foreground hover:border-primary">
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
              {uploading ? "Uploading..." : "Choose images"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
            </label>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {images.map((src) => (
                <div key={src} className="relative rounded-md border border-border p-1">
                  <img src={src} alt="" className="h-20 w-full object-contain" />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => setImages((prev) => prev.filter((i) => i !== src))}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <Button type="submit" className="w-full" disabled={save.isPending || uploading}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isNew ? "Create product" : "Save changes"}
          </Button>
        </aside>
      </form>
    </div>
  );
}