import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitToEmail, SITE } from "@/lib/site";

export function LeadForm({
  subject,
  formType,
  cta = "Send Request",
  messageLabel = "How can we help?",
  extraFields = [],
}: {
  subject: string;
  formType: string;
  cta?: string;
  messageLabel?: string;
  extraFields?: { name: string; label: string; placeholder?: string }[];
}) {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();
    if (!get("name") || !get("email")) {
      toast.error("Name and email are required.");
      return;
    }
    const payload: Record<string, string> = {
      "Request Type": formType,
      "Full Name": get("name"),
      Email: get("email"),
      Phone: get("phone"),
      Company: get("company"),
      Country: get("country"),
      Message: get("message"),
      "Submitted From": SITE.url,
    };
    extraFields.forEach((f) => {
      payload[f.label] = get(f.name);
    });

    try {
      setSending(true);
      await submitToEmail(subject, payload);
      setDone(true);
      toast.success("Message sent. We'll be in touch shortly.");
    } catch {
      toast.error(`Could not send. Please email ${SITE.email}`);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-md border border-success/40 bg-success/5 p-8 text-center">
        <p className="font-display text-lg uppercase text-charcoal">Thank you</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Your request has been sent to our team. Expect a reply within one business day, usually
          much sooner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="lf-name">Full name *</Label>
        <Input id="lf-name" name="name" required maxLength={100} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="lf-email">Email *</Label>
        <Input id="lf-email" name="email" type="email" required maxLength={255} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="lf-phone">Phone / WhatsApp</Label>
        <Input id="lf-phone" name="phone" maxLength={40} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="lf-company">Company</Label>
        <Input id="lf-company" name="company" maxLength={120} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="lf-country">Country</Label>
        <Input id="lf-country" name="country" maxLength={80} />
      </div>
      {extraFields.map((f) => (
        <div key={f.name} className="space-y-1.5">
          <Label htmlFor={`lf-${f.name}`}>{f.label}</Label>
          <Input id={`lf-${f.name}`} name={f.name} placeholder={f.placeholder} maxLength={160} />
        </div>
      ))}
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="lf-message">{messageLabel}</Label>
        <Textarea id="lf-message" name="message" rows={5} maxLength={2000} />
      </div>
      <Button type="submit" disabled={sending} className="sm:col-span-2">
        {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {cta}
      </Button>
    </form>
  );
}