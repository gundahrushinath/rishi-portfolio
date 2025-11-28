'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface ProjectStats {
  total: number;
  byStatus: {
    Active: number;
    'In Progress': number;
    Completed: number;
    'On Hold': number;
    Cancelled: number;
  };
  featured: number;
  avgProgress: number;
}

interface ProjectStatsProps {
  stats: ProjectStats;
}

export function ProjectStats({ stats }: ProjectStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            Total Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground mt-1">{stats.featured} featured</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byStatus.Completed}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.total > 0 ? Math.round((stats.byStatus.Completed / stats.total) * 100) : 0}% completion rate
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            In Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byStatus['In Progress']}</div>
          <p className="text-xs text-muted-foreground mt-1">{stats.byStatus.Active} active</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            Avg Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgProgress}%</div>
          <Progress value={stats.avgProgress} className="mt-2 h-1" />
        </CardContent>
      </Card>
    </div>
  );
}
