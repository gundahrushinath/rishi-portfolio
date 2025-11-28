"use client";

import { TODO_CATEGORY_OPTIONS, TODO_PRIORITY_OPTIONS, TODO_STATUS_OPTIONS } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type TodoPriorityFilter = (typeof TODO_PRIORITY_OPTIONS)[number] | 'all';
export type TodoStatusFilter = (typeof TODO_STATUS_OPTIONS)[number] | 'all';
export type TodoCategoryFilter = (typeof TODO_CATEGORY_OPTIONS)[number] | 'all';

interface TodoFiltersProps {
  priorityFilter: TodoPriorityFilter;
  onPriorityChange: (value: TodoPriorityFilter) => void;
  statusFilter: TodoStatusFilter;
  onStatusChange: (value: TodoStatusFilter) => void;
  categoryFilter: TodoCategoryFilter;
  onCategoryChange: (value: TodoCategoryFilter) => void;
}

export function TodoFilters({
  priorityFilter,
  onPriorityChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
}: TodoFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Select value={priorityFilter} onValueChange={(value) => onPriorityChange(value as TodoPriorityFilter)}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="All Priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          {TODO_PRIORITY_OPTIONS.map((priority) => (
            <SelectItem key={priority} value={priority}>
              {priority}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as TodoStatusFilter)}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {TODO_STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={categoryFilter} onValueChange={(value) => onCategoryChange(value as TodoCategoryFilter)}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {TODO_CATEGORY_OPTIONS.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
