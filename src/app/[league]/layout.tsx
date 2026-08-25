import { notFound } from 'next/navigation';
import { SubNav } from '@/components/shell/SubNav';
import { ORGS } from '@/core/fixtures';
import { getLeague } from '@/leagues';

export default async function LeagueLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ league: string }>;
}) {
  const { league: id } = await params;
  const league = getLeague(id);
  if (!league) notFound();

  return (
    <>
      <SubNav league={{ id: league.id, shortName: league.shortName }} orgs={ORGS[league.id] ?? []} />
      {children}
    </>
  );
}
