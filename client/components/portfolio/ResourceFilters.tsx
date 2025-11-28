'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface ResourceFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  showFeatured: boolean;
  onShowFeaturedChange: (value: boolean) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
}

export function ResourceFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  showFeatured,
  onShowFeaturedChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: ResourceFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10 py-4 -mx-4 px-4 md:-mx-6 md:px-6 border-b mb-4 md:mb-6">
      <div className="relative w-full sm:w-72 lg:w-96">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="search-input"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[130px] h-9 text-xs">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Tutorial">Tutorial</SelectItem>
            <SelectItem value="Article">Article</SelectItem>
            <SelectItem value="Video">Video</SelectItem>
            <SelectItem value="Course">Course</SelectItem>
            <SelectItem value="Tool">Tool</SelectItem>
            <SelectItem value="Documentation">Documentation</SelectItem>
            <SelectItem value="Library">Library</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3 text-xs">
              <Filter className="h-3.5 w-3.5 mr-2" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>View Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={showFeatured} onCheckedChange={onShowFeaturedChange}>
              Featured Only
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSortByChange('createdAt')}>
              Date Created {sortBy === 'createdAt' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortByChange('title')}>
              Title {sortBy === 'title' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortByChange('category')}>
              Category {sortBy === 'category' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}>
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'} Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
