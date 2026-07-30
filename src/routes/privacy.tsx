import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/site/PolicyPage";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Bitcoin Mining Depot" },
      {
        name: "description",
        content:
          "How Bitcoin Mining Depot collects, uses, stores and protects personal information submitted through enquiry, quote, checkout and newsletter forms.",
      },
      { property: "og:title", content: "Privacy Policy | Bitcoin Mining Depot" },
      {
        property: "og:description",
        content: "What data we collect, why we collect it and how we protect it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PolicyPage
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="We collect the minimum information needed to quote, ship and support your order — nothing more."
      sections={[
        {
          heading: "Information we collect",
          paras: [
            "When you submit an enquiry, quote request, order request or newsletter signup we collect the details you enter: name, email address, phone number, company, country, shipping address and the content of your message.",
            "We do not process card payments on this website, so no card data is ever entered here or stored by us. Invoices and payment instructions are issued separately by our sales team.",
          ],
        },
        {
          heading: "How we use your information",
          paras: ["Your information is used only to:"],
          list: [
            "Respond to your enquiry and prepare a quote or invoice",
            "Arrange freight, customs documentation and delivery",
            "Provide warranty, RMA and technical support",
            "Send newsletter updates where you have opted in",
            "Meet legal, tax and export compliance obligations",
          ],
        },
        {
          heading: "Sharing",
          paras: [
            "We share information with freight carriers and customs brokers strictly as needed to deliver your order, and with hosting facility operators where you have contracted hosting services. We do not sell, rent or trade personal information to anyone, ever.",
          ],
        },
        {
          heading: "Retention and security",
          paras: [
            "Enquiry and order records are retained for as long as needed to support the purchase and to meet tax and warranty obligations, then deleted. Access to customer information is restricted to staff who need it to perform their role.",
          ],
        },
        {
          heading: "Your rights and contact",
          paras: [
            `You can request a copy of the information we hold about you, ask for corrections, or ask us to delete it where we are not legally required to keep it. Newsletter emails can be unsubscribed at any time using the link in the message.`,
            `For any privacy question, contact ${SITE.email} or write to ${SITE.address}.`,
          ],
        },
      ]}
    />
  ),
});