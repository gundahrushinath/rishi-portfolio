'use client';

import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/lib/validation';
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

interface ProjectFormProps {
  form: UseFormReturn<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}

export function ProjectForm({ form, onSubmit, onCancel, isEditing }: ProjectFormProps) {
  return (
    <Card className="flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle>{isEditing ? 'Edit Project' : 'Create New Project'}</CardTitle>
                <CardDescription>
                  {isEditing ? 'Update your project details below' : 'Fill in the details to add a new project to your portfolio'}
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
                    <FormLabel>Project Title <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., E-commerce Platform" {...field} />
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
                      <Textarea placeholder="Describe your project..." rows={4} className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>{field.value?.length || 0}/2000 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="progress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Progress (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Web, Mobile, API" {...field} />
                      </FormControl>
                      <FormDescription>Separate with commas</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., React, Node.js, MongoDB" {...field} />
                      </FormControl>
                      <FormDescription>Separate with commas</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://github.com/username/repo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="liveUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live Demo URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Link</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional notes about this project..." rows={4} className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>{field.value?.length || 0}/5000 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Mark as Featured</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isArchived"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Archive this project</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
        </form>
      </Form>
    </Card>
  );
}
