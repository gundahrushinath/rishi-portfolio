'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DiaryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  moodFilter: string;
  onMoodFilterChange: (value: string) => void;
  showFavorite: boolean;
  onShowFavoriteChange: (value: boolean) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  onClearFilters: () => void;
}

export function DiaryFilters({
  searchQuery,
  onSearchChange,
  moodFilter,
  onMoodFilterChange,
  showFavorite,
  onShowFavoriteChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
}: DiaryFiltersProps) {
  const hasActiveFilters = searchQuery || moodFilter !== 'all' || showFavorite;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            id="search-input"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Select value={moodFilter} onValueChange={onMoodFilterChange}>
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Mood" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Moods</SelectItem>
              <SelectItem value="Happy">Happy</SelectItem>
              <SelectItem value="Neutral">Neutral</SelectItem>
              <SelectItem value="Sad">Sad</SelectItem>
              <SelectItem value="Excited">Excited</SelectItem>
              <SelectItem value="Tired">Tired</SelectItem>
              <SelectItem value="Stressed">Stressed</SelectItem>
              <SelectItem value="Grateful">Grateful</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="createdAt">Created</SelectItem>
              <SelectItem value="updatedAt">Updated</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onSearchChange('')} />
            </Badge>
          )}
          {moodFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Mood: {moodFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onMoodFilterChange('all')} />
            </Badge>
          )}
          {showFavorite && (
            <Badge variant="secondary" className="gap-1">
              Favorites Only
              <X className="h-3 w-3 cursor-pointer" onClick={() => onShowFavoriteChange(false)} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-6 px-2 text-xs">
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
