"use client";

import { useEffect, useState } from 'react';
import { TodoInput } from '@/lib/api';
import { TODO_CATEGORY_OPTIONS, TODO_PRIORITY_OPTIONS, TODO_STATUS_OPTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckSquare, Square, X } from 'lucide-react';

const DEFAULT_VALUES: TodoInput = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Todo',
  category: 'Personal',
  dueDate: '',
  tags: [],
  subtasks: [],
  estimatedTime: undefined,
  actualTime: undefined,
  notes: '',
};

interface TodoFormProps {
  initialData?: TodoInput;
  onSubmit: (values: TodoInput) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting?: boolean;
}

export function TodoForm({ initialData, onSubmit, onCancel, isEditing, isSubmitting }: TodoFormProps) {
  const [formData, setFormData] = useState<TodoInput>({ ...DEFAULT_VALUES, ...initialData });
  const [tagInput, setTagInput] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');

  useEffect(() => {
    setFormData({ ...DEFAULT_VALUES, ...initialData });
  }, [initialData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      ...formData,
      tags: formData.tags || [],
      subtasks: formData.subtasks || [],
    });
  };

  const addTag = () => {
    const cleaned = tagInput.trim();
    if (!cleaned) return;
    if (formData.tags?.includes(cleaned)) {
      setTagInput('');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), cleaned],
    }));
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((value) => value !== tag) || [],
    }));
  };

  const addSubtask = () => {
    const cleaned = subtaskInput.trim();
    if (!cleaned) return;
    setFormData((prev) => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), { title: cleaned, completed: false }],
    }));
    setSubtaskInput('');
  };

  const toggleSubtask = (index: number) => {
    setFormData((prev) => {
      const next = [...(prev.subtasks || [])];
      next[index] = { ...next[index], completed: !next[index].completed };
      return { ...prev, subtasks: next };
    });
  };

  const removeSubtask = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks?.filter((_, idx) => idx !== index) || [],
    }));
  };

  return (
    <Card className="flex flex-col">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle>{isEditing ? 'Edit Todo' : 'Create New Todo'}</CardTitle>
              <CardDescription>
                {isEditing ? 'Update your task details below.' : 'Add a new task to your to-do list.'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isEditing ? 'Update Todo' : 'Create Todo'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-6">
          <div className="space-y-2">
            <Label htmlFor="todo-title" className="text-sm font-semibold">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="todo-title"
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              required
              placeholder="Enter a clear task title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="todo-description" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="todo-description"
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              className="min-h-[120px] resize-none"
              placeholder="Describe the task in detail..."
            />
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="todo-priority" className="text-sm font-semibold">
                Priority
              </Label>
              <Select
                value={formData.priority || TODO_PRIORITY_OPTIONS[1]}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger id="todo-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {TODO_PRIORITY_OPTIONS.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="todo-status" className="text-sm font-semibold">
                Status
              </Label>
              <Select
                value={formData.status || 'Todo'}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger id="todo-status">
                  <SelectValue placeholder="Select status" />
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

            <div className="space-y-2">
              <Label htmlFor="todo-category" className="text-sm font-semibold">
                Category
              </Label>
              <Select
                value={formData.category || TODO_CATEGORY_OPTIONS[0]}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="todo-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {TODO_CATEGORY_OPTIONS.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="todo-dueDate" className="text-sm font-semibold">
                Due Date
              </Label>
              <Input
                id="todo-dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(event) => setFormData((prev) => ({ ...prev, dueDate: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="todo-est-time" className="text-sm font-semibold">
                Estimated Time (hours)
              </Label>
              <Input
                id="todo-est-time"
                type="number"
                min="0"
                step="0.5"
                value={formData.estimatedTime ?? ''}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    estimatedTime: event.target.value ? parseFloat(event.target.value) : undefined,
                  }))
                }
                placeholder="0.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="todo-actual-time" className="text-sm font-semibold">
                Actual Time (hours)
              </Label>
              <Input
                id="todo-actual-time"
                type="number"
                min="0"
                step="0.5"
                value={formData.actualTime ?? ''}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    actualTime: event.target.value ? parseFloat(event.target.value) : undefined,
                  }))
                }
                placeholder="0.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="todo-subtasks" className="text-sm font-semibold">
              Subtasks
            </Label>
            <div className="flex gap-2">
              <Input
                id="todo-subtasks"
                value={subtaskInput}
                onChange={(event) => setSubtaskInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addSubtask();
                  }
                }}
                placeholder="Type a subtask and press Enter"
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={addSubtask}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {formData.subtasks && formData.subtasks.length > 0 && (
              <div className="space-y-2 pt-2">
                {formData.subtasks.map((subtask, index) => (
                  <div key={`${subtask.title}-${index}`} className="flex items-center gap-2 bg-muted/50 p-2 rounded">
                    <button type="button" onClick={() => toggleSubtask(index)} className="shrink-0">
                      {subtask.completed ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                    <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {subtask.title}
                    </span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                      onClick={() => removeSubtask(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="todo-tags" className="text-sm font-semibold">
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                id="todo-tags"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type a tag and press Enter"
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={addTag}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                    {tag}
                    <X
                      className="ml-2 h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="todo-notes" className="text-sm font-semibold">
              Additional Notes
            </Label>
            <Textarea
              id="todo-notes"
              value={formData.notes}
              onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
              className="min-h-20 resize-none"
              placeholder="Add any additional notes or reminders for this task..."
            />
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
