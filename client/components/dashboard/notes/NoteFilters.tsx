"use client";

import { NOTE_CATEGORY_OPTIONS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Archive, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NoteCategoryFilter = (typeof NOTE_CATEGORY_OPTIONS)[number] | 'all';
export type NotePinnedFilter = 'all' | 'pinned' | 'unpinned';

interface NoteFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: NoteCategoryFilter;
  onCategoryChange: (value: NoteCategoryFilter) => void;
  pinnedFilter: NotePinnedFilter;
  onPinnedChange: (value: NotePinnedFilter) => void;
  showArchived: boolean;
  onArchivedChange: (value: boolean) => void;
}

export function NoteFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  pinnedFilter,
  onPinnedChange,
  showArchived,
  onArchivedChange,
}: NoteFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="search-input"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search notes..."
          className="pl-9"
        />
      </div>

      <Select
        value={categoryFilter}
        onValueChange={(value) => onCategoryChange(value as NoteCategoryFilter)}
      >
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {NOTE_CATEGORY_OPTIONS.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={pinnedFilter}
        onValueChange={(value) => onPinnedChange(value as NotePinnedFilter)}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="All Notes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Notes</SelectItem>
          <SelectItem value="pinned">Pinned Only</SelectItem>
          <SelectItem value="unpinned">Unpinned Only</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant={showArchived ? 'default' : 'outline'}
        onClick={() => onArchivedChange(!showArchived)}
        className={cn('w-full md:w-auto', showArchived && 'bg-primary/90 text-primary-foreground')}
      >
        <Archive className="mr-2 h-4 w-4" />
        {showArchived ? 'Show Active Notes' : 'Show Archived Notes'}
      </Button>
    </div>
  );
}
