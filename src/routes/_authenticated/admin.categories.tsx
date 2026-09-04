import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { categoriesQuery } from "@/lib/data";
import { SITE } from "@/lib/site";
import { pingIndexNowUrls } from "@/lib/indexnow";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: AdminCategories,
});

function slugify(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function AdminCategories() {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useQuery(categoriesQuery());
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("cpu");
  const [description, setDescription] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    // Category changes alter the collection pages — re-announce them.
    void pingIndexNowUrls([
      `${SITE.url}/`,
      `${SITE.url}/products`,
      ...categories.map((c) => `${SITE.url}/collections/${c.slug}`),
    ]).catch(() => undefined);
  };


  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("categories" as never).insert({
        name,
        slug: slugify(name),
        description,
        icon,
        sort_order: categories.length + 1,
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category created");
      setName("");
      setDescription("");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async (row: { id: string; name: string; description: string }) => {
      const { error } = await supabase
        .from("categories" as never)
        .update({ name: row.name, description: row.description } as never)
        .eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category updated");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories" as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
          Categories
        </h1>
        <div className="mt-6 space-y-3">
          {categories.map((c) => (
            <div key={c.id} className="rounded-md border border-border bg-card p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  aria-label="Category name"
                  defaultValue={c.name}
                  onBlur={(e) =>
                    e.target.value !== c.name &&
                    update.mutate({ id: c.id, name: e.target.value, description: c.description })
                  }
                />
                <Input
                  aria-label="Category description"
                  defaultValue={c.description}
                  onBlur={(e) =>
                    e.target.value !== c.description &&
                    update.mutate({ id: c.id, name: c.name, description: e.target.value })
                  }
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>/{c.slug}</span>
                <button
                  onClick={() => confirm(`Delete ${c.name}?`) && remove.mutate(c.id)}
                  className="inline-flex items-center gap-1 text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="h-fit rounded-md border border-border bg-card p-6">
        <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">New category</h2>
        <form
          className="mt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return toast.error("Name is required");
            create.mutate();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="c-name">Name</Label>
            <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-icon">Icon</Label>
            <select
              id="c-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {["bitcoin", "cpu", "recycle", "layers", "plug", "snowflake", "server", "boxes", "wrench", "tag"].map(
                (i) => (
                  <option key={i}>{i}</option>
                ),
              )}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-desc">Description</Label>
            <Input id="c-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={create.isPending}>
            Create category
          </Button>
        </form>
      </aside>
    </div>
  );
}