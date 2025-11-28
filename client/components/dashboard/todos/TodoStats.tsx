import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TodoStatsProps {
  statistics: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    byPriority: Record<string, number>;
    byCategory: Record<string, number>;
  } | null;
  showDetails: boolean;
}

export function TodoStats({ statistics, showDetails }: TodoStatsProps) {
  if (!statistics) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-3xl">{statistics.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-600">{statistics.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{statistics.inProgress}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue</CardDescription>
            <CardTitle className="text-3xl text-red-600">{statistics.overdue}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {showDetails && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>By Priority</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {Object.entries(statistics.byPriority).map(([priority, count]) => (
                <div key={priority} className="flex justify-between">
                  <span>{priority}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>By Category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {Object.entries(statistics.byCategory).map(([category, count]) => (
                <div key={category} className="flex justify-between">
                  <span>{category}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
