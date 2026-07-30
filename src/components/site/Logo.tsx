import { Link } from "@tanstack/react-router";
import { Bitcoin } from "lucide-react";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Bitcoin className="h-5 w-5" aria-hidden="true" />
      </span>
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