import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SeoCopy } from "@/components/site/SeoCopy";
import { PAGE_COPY } from "@/lib/page-copy";

const FAQS = [
  {
    q: "Are your miners genuine and new?",
    a: "All new hardware is bought through authorised distribution channels, arrives in original manufacturer packaging and can be registered for factory warranty. Used and refurbished machines are clearly labelled as such, graded after bench testing, and sold with our own warranty.",
  },
  {
    q: "How do I place an order?",
    a: "Add hardware to your cart and submit the checkout form, or use the Request a Quote button on any product page. Your request goes straight to our sales desk and we reply with confirmed stock, freight cost and a formal invoice. No payment is taken on the website.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Bank wire transfer, major credit cards for smaller orders, and cryptocurrency including BTC and USDT. Escrow can be arranged for first-time large orders. Payment details always come on a formal invoice from our domain — never act on payment details received any other way.",
  },
  {
    q: "How long does shipping take?",
    a: "In-stock units normally dispatch within one to three business days. Transit is typically two to five days within North America and five to twelve days internationally depending on destination and customs. Every shipment is insured and tracked door to door.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, to more than 100 countries. We prepare export documentation with correct HS codes and can work with your customs broker. Import duties and taxes at the destination are the buyer's responsibility unless otherwise agreed in writing.",
  },
  {
    q: "What warranty do you provide?",
    a: "New miners carry the manufacturer warranty, normally 12 months. Refurbished and used units carry a 6 month Bitcoin Mining Depot warranty. Repair work is warranted for 90 days on the specific fault repaired. Full terms are on our warranty page.",
  },
  {
    q: "Can I return a miner?",
    a: "Unopened, unused hardware can be returned within 30 days of delivery for a refund less freight and a restocking fee. Machines that have been powered on are handled under warranty rather than returns, because used mining hardware cannot be resold as new.",
  },
  {
    q: "Do you offer wholesale pricing?",
    a: "Yes. Tiered pricing starts at 10 units and improves substantially at 50, 200 and 1,000 units. Wholesale orders include serial manifests, pre-shipment inspection windows and container freight quotes.",
  },
  {
    q: "Can you host the miners for me?",
    a: "Yes. We place hardware in tier-grade North American facilities with industrial power rates, 24/7 monitoring and on-site technicians. Minimum five machines for new hosting clients. We can also buy and deploy hardware directly so it never passes through your hands.",
  },
  {
    q: "What power supply and electrical service do I need?",
    a: "Most modern air-cooled ASIC miners need 200-240V at roughly 16 to 20 amps each, so a standard residential 120V outlet is not sufficient. Hydro and immersion machines often require three-phase distribution and plumbing. Send us your electrical details and we will confirm what your service supports.",
  },
  {
    q: "How noisy are these machines?",
    a: "A typical air-cooled miner runs at 72 to 80 decibels, comparable to a vacuum cleaner running permanently. That is not suitable for a living space. Hydro and immersion machines are near-silent, which is why home and small-office deployments increasingly choose them.",
  },
  {
    q: "Do you help with setup and pool configuration?",
    a: "Yes, at no extra cost. Our support team will help you configure firmware, pool endpoints, worker names and monitoring, and will stay on the call until your machine is hashing at rated speed.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Bitcoin Miner FAQ | Shipping, Warranty & Payment Questions" },
      {
        name: "description",
        content:
          "Answers to common questions about buying ASIC bitcoin miners: ordering, payment methods, worldwide shipping, warranty terms, returns, hosting and electrical requirements.",
      },
      { property: "og:title", content: "Bitcoin Mining Depot FAQ" },
      {
        property: "og:description",
        content: "Ordering, payment, shipping, warranty, hosting and setup questions answered.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://bitcoinminingdepot.net/faq" },
    ],
    links: [{ rel: "canonical", href: "https://bitcoinminingdepot.net/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Support"
        title="Frequently Asked Questions"
        subtitle="Everything buyers ask us before placing an order — hardware authenticity, payment, freight, warranty, hosting and electrical requirements."
      />
      <div className="mx-auto max-w-[860px] px-4 py-12">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold text-charcoal">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <SeoCopy title={PAGE_COPY.faq.title} blocks={PAGE_COPY.faq.blocks} />
    </SiteLayout>
  );
}