'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, File, Star, TrendingUp } from 'lucide-react';
import { Resource } from '@/lib/api';

interface ResourceStatsProps {
  resources: Resource[];
}

export function ResourceStats({ resources }: ResourceStatsProps) {
  const total = resources.length;
  const videos = resources.filter(r => r.category === 'Video' || r.category === 'Course').length;
  const articles = resources.filter(r => r.category === 'Article' || r.category === 'Documentation').length;
  const featured = resources.filter(r => r.isFeatured).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            Total Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Video className="h-4 w-4 text-blue-500" />
            Videos/Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{videos}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <File className="h-4 w-4 text-green-500" />
            Articles/Docs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{articles}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Featured
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{featured}</div>
        </CardContent>
      </Card>
    </div>
  );
}
