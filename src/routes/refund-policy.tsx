import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/site/PolicyPage";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy | Bitcoin Mining Depot" },
      {
        name: "description",
        content:
          "Refund policy for ASIC miner orders: eligibility, crypto and bank refund timelines, restocking fees, cancellations, DOA units and dispute resolution.",
      },
      { property: "og:title", content: "Refund Policy | Bitcoin Mining Depot" },
      {
        property: "og:description",
        content:
          "When refunds are approved, how crypto and bank refunds are paid out, and how long each takes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://bitcoinminingdepot.com/refund-policy" },
    ],
    links: [{ rel: "canonical", href: "https://bitcoinminingdepot.com/refund-policy" }],
  }),
  component: () => (
    <PolicyPage
      eyebrow="Policies"
      title="Refund Policy"
      subtitle="Exactly when a refund is approved, how it is paid out for crypto and bank payments, and how long each route takes. Read alongside our Shipping & Returns and Warranty policies."
      sections={[
        {
          heading: "Refund eligibility at a glance",
          paras: [
            "Refunds are issued where an order cannot be fulfilled, where a shipment is lost or damaged in transit, or where unopened hardware is returned within the 30 day return window. Hardware that has been powered on is handled under warranty repair or replacement rather than a cash refund — this is standard practice across the mining hardware industry, because a machine that has hashed cannot be resold as new.",
          ],
          list: [
            "Order cancelled before dispatch — full refund, no fees",
            "Stock unavailable or lead time no longer acceptable to you — full refund",
            "Shipment lost by the carrier or arriving damaged (reported within 48 hours) — full refund or free replacement",
            "Dead-on-arrival unit confirmed by our technicians — replacement, or full refund if no replacement stock exists",
            "Unopened, unused hardware returned within 30 days — refund less freight and restocking fee",
          ],
        },
        {
          heading: "Cancellations before dispatch",
          paras: [
            "You may cancel any order in writing before it leaves our Hong Kong warehouse and receive a full refund of the amount received, with no restocking fee. Custom-built immersion systems and made-to-order electrical assemblies are the exception: once fabrication has started we can refund only the portion not yet committed to parts and labour, and we will tell you that figure in writing before you decide.",
          ],
        },
        {
          heading: "Restocking and freight deductions",
          paras: [
            "For change-of-mind returns of unopened hardware within 30 days, we deduct outbound freight, return freight and a restocking fee of normally 10 percent of the invoice value. Nothing is deducted where the fault is ours — a wrong item shipped, a DOA unit, a lost parcel or a specification mismatch against your invoice is refunded in full including freight.",
          ],
        },
        {
          heading: "How crypto refunds are paid",
          paras: [
            "Crypto payments are refunded in the same coin and on the same network you paid with (for example BTC to BTC, USDT-TRC20 to USDT-TRC20). Send us the receiving address in writing and confirm the network — an address on the wrong network cannot be recovered once broadcast, and we cannot reverse it.",
            "Refunds are sent for the coin amount originally received, less any deductions above. Because crypto prices move, the fiat value at the time of your refund may differ from the fiat value at the time of purchase; we do not top up or claw back that difference. Network mining fees are borne by the refund.",
          ],
          list: [
            "Approved crypto refunds are broadcast within 3 business days of approval",
            "You receive the transaction ID so you can verify on-chain",
            "Same coin, same network, buyer-supplied address only",
          ],
        },
        {
          heading: "How CashApp, Chime and bank refunds are paid",
          paras: [
            "CashApp and Chime payments are refunded to the same handle or account that sent the funds, usually within 3 to 5 business days of approval. Bank wire and bank transfer refunds are returned to the originating account and typically settle in 5 to 10 business days, longer for international wires where correspondent banks are involved. Intermediary bank charges on international wires are deducted from the refunded amount.",
            "We do not send refunds to a third-party account, handle or wallet that did not make the original payment. This protects both sides against fraud and chargeback abuse.",
          ],
        },
        {
          heading: "Refund timeline",
          paras: [
            "Returned goods are inspected within 3 business days of arrival at our warehouse. Once inspection passes, the refund is approved and processed within 10 business days, and in most cases much sooner. For lost-parcel claims the refund follows the carrier's loss declaration, normally 10 to 21 days after the claim is filed. We keep you updated in writing at each step.",
          ],
        },
        {
          heading: "What is not refundable",
          paras: [
            "Some items and charges cannot be refunded once delivered or consumed.",
          ],
          list: [
            "Hosting service fees for periods already served",
            "Opened dielectric fluid and consumables",
            "Installed spare parts (covered by warranty instead)",
            "Custom-built immersion tanks and made-to-order assemblies after fabrication starts",
            "Import duties, VAT and customs clearance fees already paid to authorities",
            "Loss of mining revenue, electricity costs or profitability shortfalls — hardware is sold on specification, never on a yield guarantee",
          ],
        },
        {
          heading: "Disputes and how to request a refund",
          paras: [
            `To request a refund, email ${SITE.email} with your invoice number, the transaction ID or payment reference, photographs where relevant, and a short description of the issue. We reply within one business day and confirm in writing whether the refund is approved, what will be deducted, and the expected payout date.`,
            `If you disagree with an outcome, reply asking for escalation and a senior member of the team will review the file. We would far rather resolve a problem directly than see you open a payment dispute. Our head office is ${SITE.address}, and this policy is governed by the laws of Hong Kong.`,
          ],
        },
      ]}
    />
  ),
});
