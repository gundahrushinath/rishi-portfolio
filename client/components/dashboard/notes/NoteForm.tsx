"use client";

import { useEffect, useMemo, useState } from 'react';
import { NoteInput } from '@/lib/api';
import { NOTE_CATEGORY_OPTIONS } from '@/lib/constants';
import { NOTE_COLORS } from '@/lib/theme-colors';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

const DEFAULT_VALUES: NoteInput = {
  title: '',
  content: '',
  category: NOTE_CATEGORY_OPTIONS[0],
  tags: [],
  color: NOTE_COLORS[0].light,
  isPinned: false,
  isArchived: false,
};

interface NoteFormProps {
  initialData?: NoteInput;
  onSubmit: (values: NoteInput) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting?: boolean;
}

export function NoteForm({ initialData, onSubmit, onCancel, isEditing, isSubmitting }: NoteFormProps) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<NoteInput>({ ...DEFAULT_VALUES, ...initialData });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    setFormData({ ...DEFAULT_VALUES, ...initialData });
  }, [initialData]);

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      ...formData,
      tags: formData.tags || [],
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

  const selectedColor = (colorValue: string) => {
    const color = NOTE_COLORS.find((c) => c.light === colorValue || c.dark === colorValue) || NOTE_COLORS[0];
    return isDark ? color.dark : color.light;
  };

  return (
    <Card className="flex flex-col">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle>{isEditing ? 'Edit Note' : 'Create New Note'}</CardTitle>
              <CardDescription>
                {isEditing
                  ? 'Update your note details below.'
                  : 'Capture ideas, meeting notes, or personal reminders.'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isEditing ? 'Update Note' : 'Create Note'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-6">
            <div className="space-y-2">
              <Label htmlFor="note-title" className="text-sm font-semibold">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="note-title"
                value={formData.title}
                onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                required
                placeholder="Enter note title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note-content" className="text-sm font-semibold">
                Content
              </Label>
              <Textarea
                id="note-content"
                value={formData.content}
                onChange={(event) => setFormData((prev) => ({ ...prev, content: event.target.value }))}
                className="min-h-[200px] resize-none"
                placeholder="Write your note content here..."
              />
              <p className="text-xs text-muted-foreground">Share ideas, meeting notes, or reminders.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="note-category" className="text-sm font-semibold">
                  Category
                </Label>
                <Select
                  value={formData.category || NOTE_CATEGORY_OPTIONS[0]}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger id="note-category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTE_CATEGORY_OPTIONS.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Note Color</Label>
                <div className="flex flex-wrap gap-2">
                  {NOTE_COLORS.map((colorOption) => {
                    const current = selectedColor(colorOption.light);
                    const isSelected =
                      formData.color === colorOption.light || formData.color === colorOption.dark;
                    return (
                      <button
                        key={colorOption.label}
                        type="button"
                        title={colorOption.label}
                        className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                          isSelected
                            ? 'border-primary ring-2 ring-primary/30 scale-110'
                            : 'border-border hover:border-primary/50'
                        }`}
                        style={{ backgroundColor: current }}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, color: isDark ? colorOption.dark : colorOption.light }))
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note-tags" className="text-sm font-semibold">
                Tags
              </Label>
              <div className="flex gap-2">
                <Input
                  id="note-tags"
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

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="note-pinned"
                  checked={Boolean(formData.isPinned)}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isPinned: Boolean(checked) }))
                  }
                />
                <Label htmlFor="note-pinned" className="cursor-pointer">
                  Pin this note
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="note-archived"
                  checked={Boolean(formData.isArchived)}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isArchived: Boolean(checked) }))
                  }
                />
                <Label htmlFor="note-archived" className="cursor-pointer">
                  Archive note
                </Label>
              </div>
            </div>
          </CardContent>
      </form>
    </Card>
  );
}
