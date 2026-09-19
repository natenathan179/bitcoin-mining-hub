import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from "react";

import { SITE } from "@/lib/site";

const [EMAIL_USER, EMAIL_DOMAIN] = SITE.email.split("@") as [string, string];

/**
 * Renders the sales email address without a scrapable "user@domain" string or a
 * mailto: href in the server-rendered HTML — on-page SEO tools flag plain-text
 * emails as spam-scraper bait, and a literal mailto: href is the most common
 * signal harvesters grep for. The address stays fully visible and readable to
 * every visitor (nothing hidden, no CSS tricks); only the mailto: link itself is
 * attached after hydration, once a real browser is confirmed to be running the
 * page, and the display text is split across a sibling element so it never
 * appears as one contiguous "user@domain" run in the raw HTML source either.
 */
export function ObfuscatedEmail({
  className,
  children,
  ...rest
}: { className?: string; children?: ReactNode } & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className" | "children"
>) {
  const [href, setHref] = useState<string | undefined>(undefined);
  useEffect(() => {
    setHref(`mailto:${EMAIL_USER}@${EMAIL_DOMAIN}`);
  }, []);

  return (
    <a href={href} className={className} {...rest}>
      {children ?? (
        <>
          {EMAIL_USER}
          <span aria-hidden="true">&#64;</span>
          {EMAIL_DOMAIN}
        </>
      )}
    </a>
  );
}
