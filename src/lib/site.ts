export const SITE = {
  name: "Bitcoin Mining Depot",
  domain: "bitcoinminingdepot.com",
  url: "https://bitcoinminingdepot.com",
  email: "sales@bitcoinminingdepot.com",
  phone: "+1 587-315-9294",
  whatsapp: "15873159294",
  address: "Calgary Trl NW, Edmonton, AB T2P 1J9, Canada",
  tagline: "Powering the Future of Bitcoin Mining.",
};

export const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${SITE.email}`;

export async function submitToEmail(subject: string, payload: Record<string, string>) {
  const res = await fetch(FORMSUBMIT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: subject,
      _template: "table",
      _captcha: "false",
      ...payload,
    }),
  });
  if (!res.ok) throw new Error("Submission failed. Please try again or email us directly.");
  return res.json();
}

export function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return "Request Quote";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}