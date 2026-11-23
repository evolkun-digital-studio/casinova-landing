import { Plus } from "lucide-react";
import { faqs } from "@/lib/content";
import { Reveal, SectionTitle } from "./ui";

export function Faq() {
  return (
    <section id="faq" className="relative py-20 sm:py-28" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <SectionTitle eyebrow="FAQ">
            <span id="faq-title">Good to know</span>
          </SectionTitle>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="divide-y divide-line rounded-3xl border border-line bg-panel/50">
            {faqs.map((f) => (
              <details key={f.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold sm:text-lg">
                  {f.q}
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition group-open:rotate-45 group-open:border-pink/50 group-open:text-pink">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-3 pr-12 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
