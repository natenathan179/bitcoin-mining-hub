import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { paymentMethodsQuery, type PaymentMethod } from "@/lib/data";
import { uploadProductImage } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  component: AdminPayments,
});

const EMPTY = {
  name: "",
  symbol: "",
  network: "",
  address: "",
  instructions: "",
  confirmations: "2",
  qr_image_url: "",
  kind: "crypto",
  handle: "",
  review_note: "",
};

const KINDS = [{ value: "crypto", label: "Crypto wallet (QR + address)" }];

function AdminPayments() {
  const queryClient = useQueryClient();
  const { data: methods = [] } = useQuery(paymentMethodsQuery());
  const [form, setForm] = useState({ ...EMPTY });
  const [uploading, setUploading] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["payment_methods"] });
  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("payment_methods" as never).insert({
        name: form.name.trim(),
        symbol: form.symbol.trim().toUpperCase(),
        network: form.network.trim(),
        address: form.address.trim(),
        instructions: form.instructions.trim(),
        confirmations: Number(form.confirmations) || 1,
        qr_image_url: form.qr_image_url,
        kind: form.kind,
        handle: form.handle.trim(),
        review_note: form.review_note.trim(),
        sort_order: methods.length + 1,
        active: true,
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Payment method created");
      setForm({ ...EMPTY });
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<PaymentMethod> }) => {
      const { error } = await supabase
        .from("payment_methods" as never)
        .update(patch as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Payment method updated");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("payment_methods" as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Payment method deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function handleUpload(file: File, onDone: (url: string) => void) {
    try {
      setUploading(true);
      onDone(await uploadProductImage(file));
      toast.success("QR code uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
          Payment methods
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          These are the crypto options customers can pay with at checkout. Each method shows its
          wallet address, network and QR code, and customers submit a transaction ID as proof of
          payment.
        </p>

        <div className="mt-6 space-y-4">
          {methods.length === 0 && (
            <p className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
              No payment methods yet. Create your first one using the form.
            </p>
          )}
          {methods.map((m) => (
            <div key={m.id} className="rounded-md border border-border bg-card p-4">
              <div className="flex flex-wrap items-start gap-4">
                {m.qr_image_url ? (
                  <img
                    src={m.qr_image_url}
                    alt={`${m.name} ${m.symbol} wallet QR code`}
                    className="h-24 w-24 rounded-md border border-border object-contain p-1"
                  />
                ) : (
                  <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-[10px] text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    Upload QR
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f)
                          handleUpload(f, (url) =>
                            update.mutate({ id: m.id, patch: { qr_image_url: url } }),
                          );
                      }}
                    />
                  </label>
                )}
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <select
                      aria-label="Payment method type"
                      value={m.kind}
                      onChange={(e) => update.mutate({ id: m.id, patch: { kind: e.target.value } })}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {KINDS.map((k) => (
                        <option key={k.value} value={k.value}>
                          {k.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    aria-label="Coin name"
                    defaultValue={m.name}
                    onBlur={(e) =>
                      e.target.value !== m.name &&
                      update.mutate({ id: m.id, patch: { name: e.target.value } })
                    }
                  />
                  <Input
                    aria-label="Symbol"
                    defaultValue={m.symbol}
                    onBlur={(e) =>
                      e.target.value !== m.symbol &&
                      update.mutate({ id: m.id, patch: { symbol: e.target.value.toUpperCase() } })
                    }
                  />
                  <Input
                    aria-label="Network"
                    defaultValue={m.network}
                    placeholder="Network (e.g. TRC-20)"
                    onBlur={(e) =>
                      e.target.value !== m.network &&
                      update.mutate({ id: m.id, patch: { network: e.target.value } })
                    }
                  />
                  <Input
                    aria-label="Required confirmations"
                    type="number"
                    min={1}
                    defaultValue={m.confirmations}
                    onBlur={(e) =>
                      Number(e.target.value) !== m.confirmations &&
                      update.mutate({
                        id: m.id,
                        patch: { confirmations: Number(e.target.value) || 1 },
                      })
                    }
                  />
                  <Input
                    aria-label="Wallet address"
                    className="sm:col-span-2 font-mono text-xs"
                    defaultValue={m.address}
                    placeholder="Wallet address"
                    onBlur={(e) =>
                      e.target.value !== m.address &&
                      update.mutate({ id: m.id, patch: { address: e.target.value } })
                    }
                  />
                  <Textarea
                    aria-label="Payment instructions"
                    className="sm:col-span-2"
                    rows={3}
                    defaultValue={m.instructions}
                    placeholder="Instructions shown to the customer"
                    onBlur={(e) =>
                      e.target.value !== m.instructions &&
                      update.mutate({ id: m.id, patch: { instructions: e.target.value } })
                    }
                  />
                  <Textarea
                    aria-label="Review note"
                    className="sm:col-span-2"
                    rows={2}
                    defaultValue={m.review_note}
                    placeholder="Short safety / review note shown in a highlighted box (optional)"
                    onBlur={(e) =>
                      e.target.value !== m.review_note &&
                      update.mutate({ id: m.id, patch: { review_note: e.target.value } })
                    }
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <label className="inline-flex items-center gap-2 text-charcoal">
                  <input
                    type="checkbox"
                    checked={m.active}
                    onChange={(e) => update.mutate({ id: m.id, patch: { active: e.target.checked } })}
                  />
                  Active at checkout
                </label>
                <div className="flex items-center gap-4">
                  {m.qr_image_url && (
                    <button
                      onClick={() => update.mutate({ id: m.id, patch: { qr_image_url: "" } })}
                      className="inline-flex items-center gap-1 text-muted-foreground"
                    >
                      <X className="h-3.5 w-3.5" /> Remove QR
                    </button>
                  )}
                  <button
                    onClick={() => confirm(`Delete ${m.name}?`) && remove.mutate(m.id)}
                    className="inline-flex items-center gap-1 text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="h-fit rounded-md border border-border bg-card p-6">
        <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">
          New payment method
        </h2>
        <form
          className="mt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name.trim() || !form.symbol.trim())
              return toast.error("Coin name and symbol are required");
            if (form.kind === "crypto" && !form.address.trim())
              return toast.error("Wallet address is required for crypto methods");
            create.mutate();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="p-name">Coin name</Label>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-kind">Method type</Label>
            <select
              id="p-kind"
              value={form.kind}
              onChange={(e) => set("kind", e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-name">Method name</Label>
            <Input
              id="p-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Bitcoin"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-symbol">Symbol</Label>
            <Input
              id="p-symbol"
              value={form.symbol}
              onChange={(e) => set("symbol", e.target.value)}
              placeholder="BTC"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-network">Network</Label>
            <Input
              id="p-network"
              value={form.network}
              onChange={(e) => set("network", e.target.value)}
              placeholder="Bitcoin / ERC-20 / TRC-20"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-address">Wallet address</Label>
            <Input
              id="p-address"
              className="font-mono text-xs"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-conf">Required confirmations</Label>
            <Input
              id="p-conf"
              type="number"
              min={1}
              value={form.confirmations}
              onChange={(e) => set("confirmations", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-instructions">Instructions for customer</Label>
            <Textarea
              id="p-instructions"
              rows={3}
              value={form.instructions}
              onChange={(e) => set("instructions", e.target.value)}
              placeholder="Send only BTC on the Bitcoin network. Order ships after 2 confirmations."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-review">Review / safety note</Label>
            <Textarea
              id="p-review"
              rows={2}
              value={form.review_note}
              onChange={(e) => set("review_note", e.target.value)}
              placeholder="Details are sent to you directly after review to protect you from payment fraud."
            />
          </div>
          <div className="space-y-1.5">
            <Label>QR code image</Label>
            {form.qr_image_url ? (
              <div className="flex items-center gap-3">
                <img
                  src={form.qr_image_url}
                  alt="Uploaded wallet QR code preview"
                  className="h-24 w-24 rounded-md border border-border object-contain p-1"
                />
                <button
                  type="button"
                  onClick={() => set("qr_image_url", "")}
                  className="text-xs text-destructive"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-xs text-muted-foreground">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Upload QR code image
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f, (url) => set("qr_image_url", url));
                  }}
                />
              </label>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={create.isPending || uploading}>
            Create payment method
          </Button>
        </form>
      </aside>
    </div>
  );
}
