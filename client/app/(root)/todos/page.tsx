'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NoAccess } from '@/components/auth/NoAccess';
import { Permission } from '@/models/user';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, BarChart3 } from 'lucide-react';
import { useTodos } from '@/hooks/use-todos';
import { Todo } from '@/lib/api';
import { TodoForm } from '@/components/dashboard/todos/TodoForm';
import { TodoFilters } from '@/components/dashboard/todos/TodoFilters';
import { TodoStats } from '@/components/dashboard/todos/TodoStats';
import { TodoCard } from '@/components/dashboard/todos/TodoCard';
import { TodoInput } from '@/lib/api';

export default function TodoPage() {
  const { loading: authLoading } = useAuth();
  const {
    todos,
    statistics,
    isLoading,
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    createTodo,
    updateTodo,
    deleteTodo,
    updateTodoStatus,
    toggleSubtask,
  } = useTodos();

  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'n' && canCreate) {
        event.preventDefault();
        setShowForm(true);
      }
      if (event.key === 'Escape' && showForm) {
        event.preventDefault();
        resetForm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForm, canCreate]);

  const resetForm = () => {
    setEditingTodo(null);
    setShowForm(false);
  };

  const handleCreate = async (values: TodoInput) => {
    try {
      setIsSubmitting(true);
      await createTodo(values);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (values: TodoInput) => {
    if (!editingTodo) return;
    try {
      setIsSubmitting(true);
      await updateTodo(editingTodo._id, values);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!todoToDelete) return;
    await deleteTodo(todoToDelete._id);
    setTodoToDelete(null);
  };

  const editingDefaults: TodoInput | undefined = useMemo(() => {
    if (!editingTodo) return undefined;
    return {
      title: editingTodo.title,
      description: editingTodo.description,
      priority: editingTodo.priority,
      status: editingTodo.status,
      category: editingTodo.category,
      dueDate: editingTodo.dueDate ? editingTodo.dueDate.split('T')[0] : '',
      tags: editingTodo.tags,
      subtasks: editingTodo.subtasks.map((subtask) => ({ title: subtask.title, completed: subtask.completed })),
      estimatedTime: editingTodo.estimatedTime,
      actualTime: editingTodo.actualTime,
      notes: editingTodo.notes,
    };
  }, [editingTodo]);

  if (authLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!canRead) {
    return <NoAccess feature="Todos" permission={Permission.TODO_READ} />;
  }

  const initialLoading = isLoading && todos.length === 0 && !showForm;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">To-Do List</h1>
            <p className="text-sm md:text-base text-muted-foreground">Plan, execute, and track every task.</p>
          </div>
          {canCreate && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Todo
            </Button>
          )}
        </div>

        {!showForm && (
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{todos.length}</span> task{todos.length === 1 ? '' : 's'}
            </p>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => setShowDetails((prev) => !prev)}>
              <BarChart3 className="mr-2 h-4 w-4" />
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        )}

        {!showForm && <TodoStats statistics={statistics} showDetails={showDetails} />}

        {!showForm && (
          <TodoFilters
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />
        )}

        {showForm && (
          <TodoForm
            initialData={editingDefaults}
            onSubmit={editingTodo ? handleUpdate : handleCreate}
            onCancel={resetForm}
            isEditing={Boolean(editingTodo)}
            isSubmitting={isSubmitting}
          />
        )}

        {!showForm && (
          <>
            {initialLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <Card key={item}>
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-14 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : todos.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center space-y-2">
                  <p className="text-muted-foreground">No todos found. Create your first task!</p>
                  {canCreate && (
                    <Button variant="outline" onClick={() => setShowForm(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Todo
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {todos.map((todo) => (
                  <TodoCard
                    key={todo._id}
                    todo={todo}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                    onEdit={(item) => {
                      setEditingTodo(item);
                      setShowForm(true);
                    }}
                    onDeleteRequest={setTodoToDelete}
                    onStatusChange={updateTodoStatus}
                    onSubtaskToggle={toggleSubtask}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog open={Boolean(todoToDelete)} onOpenChange={(open) => !open && setTodoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The task "{todoToDelete?.title}" will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
