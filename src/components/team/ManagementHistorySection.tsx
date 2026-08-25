import { EmptyState } from '@/components/dashboard/EmptyState';

/**
 * Validates the section's shape ahead of real data, per the brief — this
 * would be a StoryEvent spine exactly like Career journey (same table,
 * team-scoped instead of player-scoped), but no front-office/coaching
 * regime events are modeled yet.
 */
export function ManagementHistorySection() {
  return <EmptyState label="No front-office or coaching regime history on file yet." />;
}
