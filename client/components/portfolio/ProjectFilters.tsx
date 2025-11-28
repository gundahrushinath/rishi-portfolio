'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  priorityFilter: string;
  onPriorityChange: (value: string) => void;
  showArchived: boolean;
  onShowArchivedChange: (value: boolean) => void;
  showFeatured: boolean;
  onShowFeaturedChange: (value: boolean) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
}

export function ProjectFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  showArchived,
  onShowArchivedChange,
  showFeatured,
  onShowFeaturedChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10 py-4 -mx-4 px-4 md:-mx-6 md:px-6 border-b mb-4 md:mb-6">
      <div className="relative w-full sm:w-72 lg:w-96">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="search-input"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[130px] h-9 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-[130px] h-9 text-xs">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
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
            <DropdownMenuCheckboxItem checked={showArchived} onCheckedChange={onShowArchivedChange}>
              Show Archived
            </DropdownMenuCheckboxItem>
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
            <DropdownMenuItem onClick={() => onSortByChange('dueDate')}>
              Due Date {sortBy === 'dueDate' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortByChange('priority')}>
              Priority {sortBy === 'priority' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortByChange('status')}>
              Status {sortBy === 'status' && '✓'}
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
