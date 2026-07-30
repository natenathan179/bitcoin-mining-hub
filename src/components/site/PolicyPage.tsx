import { SiteLayout, PageHero } from "./SiteLayout";

export interface PolicySection {
  heading: string;
  paras: string[];
  list?: string[];
}

export function PolicyPage({
  eyebrow,
  title,
  subtitle,
  sections,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: PolicySection[];
}) {
  return (
    <SiteLayout>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="mx-auto max-w-[860px] px-4 py-12">
        {sections.map((s) => (
          <section key={s.heading} className="mb-10">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-charcoal">
              {s.heading}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {s.paras.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {s.list && (
                <ul className="list-disc space-y-1.5 pl-5">
                  {s.list.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>
    </SiteLayout>
  );
}