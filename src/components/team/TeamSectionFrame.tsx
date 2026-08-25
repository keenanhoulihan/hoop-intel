import { Suspense } from 'react';
import type { TeamSectionCtx, TeamSectionSpec } from '@/core/team-section-registry';

/**
 * Same contract as the dashboard's ModuleFrame: own Suspense fallback, own
 * try/catch around the data call so a broken section degrades itself, not
 * the page. Kept as a separate component (not a re-export of ModuleFrame)
 * because the two registries carry different context shapes.
 */
export function TeamSectionFrame({ spec, ctx }: { spec: TeamSectionSpec; ctx: TeamSectionCtx }) {
  return (
    <Suspense fallback={<Shell title={spec.title}><Skeleton /></Shell>}>
      <Body spec={spec} ctx={ctx} />
    </Suspense>
  );
}

async function Body({ spec, ctx }: { spec: TeamSectionSpec; ctx: TeamSectionCtx }) {
  let data: unknown;
  let failed = false;
  try {
    data = await spec.dataDependency(ctx);
  } catch {
    failed = true;
  }
  const Component = spec.Component;
  return <Shell title={spec.title}>{failed ? <ErrorState title={spec.title} /> : <Component data={data} />}</Shell>;
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  const id = `sec-${title.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="mb-4 font-serif text-[18px] font-semibold text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-2" aria-hidden>
      <div className="h-14 rounded bg-bone-lo" />
      <div className="h-14 rounded bg-bone-lo" />
    </div>
  );
}

function ErrorState({ title }: { title: string }) {
  return (
    <p className="rounded border border-dashed border-clay bg-clay-wash px-3 py-4 text-[12.5px] text-bark">
      {title} isn&rsquo;t available right now.
    </p>
  );
}
