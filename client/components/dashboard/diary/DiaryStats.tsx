'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Smile, Calendar } from 'lucide-react';

interface DiaryStatsProps {
  stats: {
    totalEntries: number;
    moodStats: { _id: string; count: number }[];
    entriesThisMonth: number;
  } | null;
  isLoading: boolean;
}

export function DiaryStats({ stats, isLoading }: DiaryStatsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-4 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded mb-1" />
              <div className="h-3 w-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const mostFrequentMood = stats.moodStats.length > 0 
    ? stats.moodStats.reduce((prev, current) => (prev.count > current.count) ? prev : current)._id 
    : 'None';

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          <Book className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEntries}</div>
          <p className="text-xs text-muted-foreground">
            Lifetime diary entries
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.entriesThisMonth}</div>
          <p className="text-xs text-muted-foreground">
            Entries written this month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dominant Mood</CardTitle>
          <Smile className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mostFrequentMood}</div>
          <p className="text-xs text-muted-foreground">
            Most frequent mood
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
