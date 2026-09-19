import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/site/PolicyPage";
import { ObfuscatedEmail } from "@/components/site/ObfuscatedEmail";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Bitcoin Mining Depot" },
      {
        name: "description",
        content:
          "Terms and conditions governing quotes, orders, pricing, payment, delivery, risk transfer, warranty and liability for hardware purchased from Bitcoin Mining Depot.",
      },
      { property: "og:title", content: "Terms & Conditions | Bitcoin Mining Depot" },
      {
        property: "og:description",
        content: "The commercial terms that apply to quotes, orders and deliveries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://bitcoinminingdepot.net/terms" },
    ],
    links: [{ rel: "canonical", href: "https://bitcoinminingdepot.net/terms" }],
  }),
  component: () => (
    <PolicyPage
      eyebrow="Legal"
      title="Terms & Conditions"
      subtitle="The commercial terms that apply when you request a quote or place an order with us."
      sections={[
        {
          heading: "Quotes and orders",
          paras: [
            "Prices shown on this website are indicative and subject to confirmation. A binding contract is formed only when we issue a written invoice and you accept it by payment. Quotes are valid for the period stated on the quote, normally 48 to 72 hours, because hardware pricing moves with market conditions.",
            "We reserve the right to decline or cancel any order, including where stock is unexpectedly unavailable, where pricing was published in error, or where export compliance checks are not satisfied. In those cases any payment received is refunded in full.",
          ],
        },
        {
          heading: "Payment",
          paras: [
            "Accepted methods are bank wire, card for smaller orders, and cryptocurrency including BTC and USDT. Orders are released for dispatch once funds have cleared. Payment details are only ever issued on an invoice from our own domain; always verify banking details by phone before sending funds.",
          ],
        },
        {
          heading: "Delivery and risk",
          paras: [
            "Delivery dates are estimates given in good faith and are not guaranteed, as freight and customs are outside our control. Risk passes to the buyer on delivery by the carrier. Title passes when payment has cleared in full.",
          ],
        },
        {
          heading: "Warranty and liability",
          paras: [
            "Hardware is covered by the warranty terms published on our warranty page. To the fullest extent permitted by law our total liability in connection with any order is limited to the amount paid for the affected goods.",
            "We are not liable for indirect or consequential loss, including lost mining revenue, lost profit, downtime, changes in network difficulty, changes in the price of bitcoin, or losses arising from electricity supply, hosting facility interruption or pool outages.",
          ],
        },
        {
          heading: "Acceptable use and compliance",
          paras: [
            "You are responsible for ensuring that operating mining hardware is lawful in your jurisdiction, that your electrical installation meets local code, and that you comply with all applicable import, export and sanctions regulations. We will not ship to sanctioned destinations or restricted parties.",
          ],
        },
        {
          heading: "Contact",
          paras: [
            <>
              Questions about these terms can be sent to <ObfuscatedEmail /> or posted to {SITE.address}.
            </>,
          ],
        },
      ]}
    />
  ),
});