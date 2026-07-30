import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { reviewsQuery } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/site/Stars";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: AdminReviews,
});

function AdminReviews() {
  const queryClient = useQueryClient();
  const { data: reviews = [] } = useQuery(reviewsQuery());
  const [form, setForm] = useState({
    name: "",
    location: "",
    rating: 5,
    title: "",
    body: "",
    avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
    product_name: "",
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["reviews"] });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("reviews" as never).insert(form as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review published");
      setForm({ ...form, name: "", location: "", title: "", body: "", product_name: "" });
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews" as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
          Reviews ({reviews.length})
        </h1>
        <div className="mt-6 space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="flex gap-4 rounded-md border border-border bg-card p-4">
              <img src={r.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-charcoal">
                  {r.name} <span className="text-xs text-muted-foreground">{r.location}</span>
                </p>
                <Stars rating={r.rating} className="h-3.5 w-3.5" />
                <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">{r.product_name}</p>
              </div>
              <button
                onClick={() => confirm("Delete this review?") && remove.mutate(r.id)}
                aria-label="Delete review"
                className="h-fit text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <aside className="h-fit rounded-md border border-border bg-card p-6">
        <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">Add review</h2>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name.trim() || !form.body.trim())
              return toast.error("Name and review text are required");
            create.mutate();
          }}
        >
          {(
            [
              ["name", "Reviewer name"],
              ["location", "Location"],
              ["title", "Headline"],
              ["product_name", "Product"],
              ["avatar_url", "Avatar URL"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`r-${key}`}>{label}</Label>
              <Input
                id={`r-${key}`}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label htmlFor="r-rating">Rating</Label>
            <select
              id="r-rating"
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} stars
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="r-body">Review</Label>
            <Textarea
              id="r-body"
              rows={4}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            />
          </div>
          <Button type="submit" className="w-full" disabled={create.isPending}>
            Publish review
          </Button>
        </form>
      </aside>
    </div>
  );
}