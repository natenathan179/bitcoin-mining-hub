import { Star } from "lucide-react";

export function Stars({ rating = 5, className = "h-4 w-4" }: { rating?: number; className?: string }) {
  return (
    <div className="flex gap-0.5 text-[oklch(0.78_0.16_80)]" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${className} ${i < rating ? "fill-current" : "text-silver"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}