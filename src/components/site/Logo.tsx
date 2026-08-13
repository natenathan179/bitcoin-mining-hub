import { Link } from "@tanstack/react-router";

import logoMark from "@/assets/logo-mark.webp";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img
        src={logoMark}
        alt="Bitcoin Mining Depot logo"
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 object-contain"
      />
      <span className="font-display leading-none tracking-wide">
        <span
          className={`block text-xl font-bold uppercase ${tone === "dark" ? "text-charcoal" : "text-charcoal-foreground"}`}
        >
          Bitcoin
        </span>
        <span className="block text-sm font-semibold uppercase text-primary">Mining Depot</span>
      </span>
    </Link>
  );
}