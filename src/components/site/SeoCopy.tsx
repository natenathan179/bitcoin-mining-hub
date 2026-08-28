export interface CopyBlock {
  heading: string;
  paras: string[];
}

/**
 * Compact editorial text block. Deliberately markup-light (one heading + plain
 * paragraphs) so pages carry a healthy text-to-HTML ratio for crawlers.
 */
export function SeoCopy({ title, blocks }: { title: string; blocks: CopyBlock[] }) {
  return (
    <section className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-[900px] px-4 py-12">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
          {title}
        </h2>
        {blocks.map((b) => (
          <div key={b.heading} className="mt-7">
            <h3 className="font-display text-base font-semibold uppercase tracking-wide text-charcoal">
              {b.heading}
            </h3>
            {b.paras.map((p, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
