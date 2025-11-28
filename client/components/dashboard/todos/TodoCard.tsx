"use client";

import { Todo } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRIORITY_BADGE_COLORS, STATUS_BADGE_COLORS, CATEGORY_BADGE_COLORS } from '@/lib/theme-colors';
import { Calendar, CheckSquare, Edit2, Square, Trash2 } from 'lucide-react';
import { TODO_STATUS_OPTIONS } from '@/lib/constants';

interface TodoCardProps {
  todo: Todo;
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: (todo: Todo) => void;
  onDeleteRequest: (todo: Todo) => void;
  onStatusChange: (todoId: string, status: Todo['status']) => void;
  onSubtaskToggle: (todoId: string, subtaskId: string, completed: boolean) => void;
}

export function TodoCard({
  todo,
  canUpdate,
  canDelete,
  onEdit,
  onDeleteRequest,
  onStatusChange,
  onSubtaskToggle,
}: TodoCardProps) {
  const completedSubtasks = todo.subtasks.filter((subtask) => subtask.completed).length;
  const overdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !['Completed', 'Cancelled'].includes(todo.status);

  return (
    <Card className={overdue ? 'border-red-300' : ''}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className={PRIORITY_BADGE_COLORS[todo.priority] || PRIORITY_BADGE_COLORS['Medium']}>
                {todo.priority}
              </Badge>
              <Badge className={STATUS_BADGE_COLORS[todo.status] || STATUS_BADGE_COLORS['Todo']}>
                {todo.status}
              </Badge>
              <Badge className={CATEGORY_BADGE_COLORS[todo.category] || CATEGORY_BADGE_COLORS['Other']}>
                {todo.category}
              </Badge>
              {overdue && <Badge variant="destructive">Overdue</Badge>}
            </div>
            <CardTitle className="flex flex-wrap items-center gap-2">
              {todo.title}
              {todo.dueDate && (
                <span className="text-sm font-normal text-muted-foreground inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}
            </CardTitle>
            {todo.description && <p className="text-sm text-muted-foreground mt-2">{todo.description}</p>}
          </div>
          <TooltipProvider>
            <div className="flex gap-1">
              {canUpdate && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="min-w-[120px]">
                        <Select value={todo.status} onValueChange={(value) => onStatusChange(todo._id, value as Todo['status'])}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TODO_STATUS_OPTIONS.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Change status</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => onEdit(todo)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}

              {canDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={() => onDeleteRequest(todo)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {todo.subtasks.length > 0 && (
          <div>
            <div className="text-sm font-semibold mb-2">
              Subtasks ({completedSubtasks}/{todo.subtasks.length})
            </div>
            <div className="space-y-1">
              {todo.subtasks.map((subtask) => (
                <div key={subtask._id || subtask.title} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSubtaskToggle(todo._id, subtask._id!, subtask.completed)}
                    className="shrink-0"
                  >
                    {subtask.completed ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                  <span className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(todo.estimatedTime || todo.actualTime) && (
          <div className="text-sm text-muted-foreground">
            {todo.estimatedTime && <span>Est: {todo.estimatedTime}h</span>}
            {todo.estimatedTime && todo.actualTime && <span> • </span>}
            {todo.actualTime && <span>Actual: {todo.actualTime}h</span>}
          </div>
        )}

        {todo.notes && <p className="text-sm text-muted-foreground">{todo.notes}</p>}

        {todo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {todo.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
