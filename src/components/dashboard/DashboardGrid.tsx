import type { DashboardModuleSpec, ModuleLoadCtx } from '@/core/dashboard-registry';
import { ModuleFrame } from './ModuleFrame';

/**
 * Slot-based layout — takes an already-ordered module list and places it.
 * Reordering/hiding/pinning are changes to `modules`, not to this component.
 */
export function DashboardGrid({
  modules,
  ctx,
}: {
  modules: DashboardModuleSpec[];
  ctx: ModuleLoadCtx;
}) {
  const primary = modules.filter((m) => m.size === 'primary');
  const secondary = modules.filter((m) => m.size === 'secondary');

  return (
    <div className="flex flex-col gap-10">
      {primary.map((m) => (
        <ModuleFrame key={m.id} spec={m} ctx={ctx} />
      ))}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {secondary.map((m) => (
          <ModuleFrame key={m.id} spec={m} ctx={ctx} />
        ))}
      </div>
    </div>
  );
}
