'use client';

import { UseFormReturn } from 'react-hook-form';
import { ResourceFormValues } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';

interface ResourceFormProps {
  methods: UseFormReturn<ResourceFormValues>;
  onSubmit: (values: ResourceFormValues) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}

export function ResourceForm({ methods, onSubmit, onCancel, isEditing }: ResourceFormProps) {
  if (!methods) {
    return <div className="p-4 text-red-500">Error: Form not initialized</div>;
  }
  const form = methods;

  return (
    <Card className="flex flex-col">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle>{isEditing ? 'Edit Resource' : 'Create New Resource'}</CardTitle>
                <CardDescription>
                  {isEditing ? 'Update your resource details below' : 'Fill in the details to add a new resource to your collection'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
                <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
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
                    <FormLabel>Resource Title <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Advanced React Patterns" {...field} />
                    </FormControl>
                    <FormDescription>{field.value.length}/200 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief description of the resource..." rows={4} className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>{field.value?.length || 0}/2000 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., React, TypeScript" {...field} />
                      </FormControl>
                      <FormDescription>Comma separated</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource URL <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Featured Resource
                      </FormLabel>
                      <FormDescription>
                        Display this resource in the featured section
                      </FormDescription>
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
