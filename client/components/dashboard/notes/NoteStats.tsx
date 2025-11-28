import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NoteStatsProps {
  stats: {
    total: number;
    pinned: number;
    categories: Record<string, number>;
  };
  showArchived: boolean;
}

export function NoteStats({ stats, showArchived }: NoteStatsProps) {
  const topCategory = Object.entries(stats.categories)
    .sort(([, a], [, b]) => b - a)
    .at(0);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{showArchived ? 'Archived Notes' : 'Active Notes'}</CardDescription>
          <CardTitle className="text-3xl">{stats.total}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {showArchived
              ? 'Archived notes available for reference.'
              : 'Notes currently available for quick access.'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Pinned</CardDescription>
          <CardTitle className="text-3xl">{stats.pinned}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Pinned notes stay at the top for fast recall.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Top Category</CardDescription>
          <CardTitle className="text-3xl">
            {topCategory ? topCategory[0] : '—'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {topCategory ? `${topCategory[1]} note${topCategory[1] === 1 ? '' : 's'} in this category.` : 'No category data yet.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
