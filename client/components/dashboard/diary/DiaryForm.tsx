'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { diaryFormSchema, DiaryFormValues } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DiaryFormProps {
  defaultValues?: Partial<DiaryFormValues>;
  onSubmit: (values: DiaryFormValues) => Promise<void>;
  isSubmitting?: boolean;
  onCancel: () => void;
  isEditing: boolean;
}

export function DiaryForm({ defaultValues, onSubmit, isSubmitting, onCancel, isEditing }: DiaryFormProps) {
  const form = useForm<DiaryFormValues>({
    resolver: zodResolver(diaryFormSchema),
    defaultValues: {
      title: '',
      content: '',
      mood: 'Neutral',
      tags: '',
      date: new Date().toISOString().split('T')[0],
      isFavorite: false,
      ...defaultValues,
    },
  });

  const handleSubmit = async (values: DiaryFormValues) => {
    await onSubmit(values);
  };

  const saving = isSubmitting || form.formState.isSubmitting;

  return (
    <Card className="flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>{isEditing ? 'Edit Entry' : 'Create New Entry'}</CardTitle>
                <CardDescription>
                  {isEditing
                    ? 'Update how you felt and what happened during the day.'
                    : 'Capture today’s thoughts, feelings, and memorable moments.'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? 'Update Entry' : 'Create Entry'}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pb-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Diary entry title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mood</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mood" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Happy">Happy</SelectItem>
                        <SelectItem value="Neutral">Neutral</SelectItem>
                        <SelectItem value="Sad">Sad</SelectItem>
                        <SelectItem value="Excited">Excited</SelectItem>
                        <SelectItem value="Tired">Tired</SelectItem>
                        <SelectItem value="Stressed">Stressed</SelectItem>
                        <SelectItem value="Grateful">Grateful</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="personal, wins, reflections" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your thoughts..."
                      className="min-h-[220px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFavorite"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mark as Favorite</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
