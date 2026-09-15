import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "Shipping, Delivery & Returns Policy | Bitcoin Mining Depot" },
      {
        name: "description",
        content:
          "We ship from Hong Kong worldwide — USA, Canada, Europe and 100+ countries. Timeframes, insured freight, customs documents and the 30 day return policy.",
      },
      { property: "og:title", content: "Shipping & Returns Policy" },
      {
        property: "og:description",
        content:
          "How we ship mining hardware worldwide, and how returns, damage claims and refunds work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://bitcoinminingdepot.net/shipping-returns" },
    ],
    links: [{ rel: "canonical", href: "https://bitcoinminingdepot.net/shipping-returns" }],
  }),
  component: () => (
    <PolicyPage
      eyebrow="Policies"
      title="Shipping & Returns"
      subtitle="We ship from our Hong Kong head office to the USA, Canada, Europe and 100+ countries worldwide. Here is how your hardware gets to you, what to check on delivery, and what happens if something is wrong."
      sections={[
        {
          heading: "Where we ship from, and where we deliver",
          paras: [
            "All orders are dispatched from our Hong Kong head office at Tower 1, Times Square, 34號 Matheson St, Causeway Bay, Hong Kong Island — next to the freight corridor every major ASIC brand uses.",
            "We deliver worldwide. Our most common lanes are the United States and Canada (DHL/FedEx express air, typically 3–7 business days), the EU and UK via Rotterdam, Frankfurt and London hubs with VAT/EORI documentation support, and Asia, Australia, the Middle East, Latin America and Africa by air or consolidated sea freight for container-scale orders.",
          ],
          list: [
            "United States — express air freight, duties settled at customs clearance",
            "Canada — door-to-door delivery nationwide, including remote farm sites",
            "Europe & UK — VAT/EORI paperwork prepared with every shipment",
            "Worldwide — 100+ countries served across Asia, Oceania, MEA and LATAM",
          ],
        },
        {
          heading: "Dispatch times",
          paras: [
            "In-stock hardware is dispatched within one to three business days of cleared payment. Made-to-order items such as immersion systems and large wholesale lots ship on the lead time confirmed in your invoice, which we update in writing if anything changes.",
            "You receive a tracking number as soon as the carrier collects, along with a packing list and, for wholesale orders, a serial number manifest.",
          ],
        },
        {
          heading: "Transit and freight",
          paras: [
            "Shipments to the United States and Canada typically arrive within three to seven business days by express air freight. European deliveries typically take four to eight business days, and other worldwide destinations five to twelve business days depending on customs clearance.",
            "All shipments are fully insured for the invoice value. We prepare export documentation with correct HS codes and commercial invoices. Import duties, VAT and clearance fees at the destination are the buyer's responsibility unless we have agreed delivered-duty-paid terms in writing.",
          ],
        },
        {
          heading: "Inspection on delivery",
          paras: [
            "Inspect the outer packaging before signing for the shipment. If a carton is crushed, punctured or shows shock indicator activation, note it on the carrier's paperwork before signing and photograph the packaging from all sides.",
            "Report any transit damage to us within 48 hours of delivery with photographs. Claims submitted after that window are much harder to pursue with the carrier's insurer, and may be declined.",
          ],
        },
        {
          heading: "Returns",
          paras: [
            "Unopened, unused hardware may be returned within 30 days of delivery. Refunds are issued to the original payment method less outbound and return freight and a restocking fee, normally 10 percent.",
            "Hardware that has been powered on cannot be returned as new and is handled under warranty instead. This is standard across the industry: a mining machine that has run cannot be resold as new.",
          ],
          list: [
            "Contact us for a return authorisation number before shipping anything back",
            "Return items in original packaging with all accessories included",
            "Write the authorisation number clearly on the outer carton",
            "Refunds are processed within 10 business days of inspection",
          ],
        },
        {
          heading: "Non-returnable items",
          paras: [
            "Custom-built immersion systems, made-to-order electrical assemblies, opened dielectric fluid, and hosting service fees are non-returnable. Spare parts that have been installed are covered by warranty rather than the returns policy.",
          ],
        },
      ]}
    />
  ),
});