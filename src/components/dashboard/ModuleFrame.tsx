import { Suspense } from 'react';
import Link from 'next/link';
import type { DashboardModuleSpec, ModuleLoadCtx } from '@/core/dashboard-registry';

/**
 * The module contract, enforced structurally: every module gets its own
 * loading fallback (Suspense), its own error isolation (try/catch around
 * `load` — a rejected provider call renders this module's error state, not
 * a page-level crash), and a "see more" affordance if the spec declares one.
 */
export function ModuleFrame({ spec, ctx }: { spec: DashboardModuleSpec; ctx: ModuleLoadCtx }) {
  return (
    <Suspense fallback={<ModuleShell title={spec.title}><ModuleSkeleton /></ModuleShell>}>
      <ModuleBody spec={spec} ctx={ctx} />
    </Suspense>
  );
}

async function ModuleBody({ spec, ctx }: { spec: DashboardModuleSpec; ctx: ModuleLoadCtx }) {
  let data: unknown;
  let failed = false;
  try {
    data = await spec.load(ctx);
  } catch {
    failed = true;
  }

  const href = spec.seeMoreHref?.(ctx);
  const Component = spec.Component;

  return (
    <ModuleShell title={spec.title} href={!failed ? href : undefined}>
      {failed ? <ModuleError title={spec.title} /> : <Component data={data} />}
    </ModuleShell>
  );
}

function ModuleShell({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  const id = `mod-${title.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <section aria-labelledby={id}>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 id={id} className="font-[family-name:var(--serif)] text-[17px] font-semibold text-[var(--ink)]">
          {title}
        </h2>
        {href && (
          <Link href={href} className="text-[11.5px] font-semibold text-[var(--bark)] hover:text-[var(--walnut)]">
            See more →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function ModuleSkeleton() {
  return (
    <div className="animate-pulse space-y-2" aria-hidden>
      <div className="h-16 rounded-[3px] bg-[var(--bone-lo)]" />
      <div className="h-16 rounded-[3px] bg-[var(--bone-lo)]" />
    </div>
  );
}

function ModuleError({ title }: { title: string }) {
  return (
    <p className="rounded-[2px] border border-dashed border-[var(--clay)] bg-[var(--clay-lo)] px-3 py-4 text-[12.5px] text-[var(--bark)]">
      {title} isn&rsquo;t available right now.
    </p>
  );
}
