import { useCallback, useEffect, useState } from 'react';
import { todoService, Todo, TodoInput } from '@/lib/api';
import { toast } from '@/lib/toast';
import { usePermission } from '@/hooks/use-permission';
import { Permission } from '@/models/user';
import { TODO_CATEGORY_OPTIONS, TODO_PRIORITY_OPTIONS, TODO_STATUS_OPTIONS } from '@/lib/constants';

interface TodoStatistics {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
}

type PriorityFilter = (typeof TODO_PRIORITY_OPTIONS)[number] | 'all';
type StatusFilter = (typeof TODO_STATUS_OPTIONS)[number] | 'all';
type CategoryFilter = (typeof TODO_CATEGORY_OPTIONS)[number] | 'all';

export function useTodos() {
  const canRead = usePermission(Permission.TODO_READ);
  const canCreate = usePermission(Permission.TODO_CREATE);
  const canUpdate = usePermission(Permission.TODO_UPDATE);
  const canDelete = usePermission(Permission.TODO_DELETE);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [statistics, setStatistics] = useState<TodoStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const fetchTodos = useCallback(async () => {
    if (!canRead) return;
    try {
      setIsLoading(true);
      const filters: Record<string, string> = {};
      if (priorityFilter !== 'all') filters.priority = priorityFilter;
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (categoryFilter !== 'all') filters.category = categoryFilter;

      const response = await todoService.getAll(filters);
      setTodos(response.todos);
    } catch (error: any) {
      if (error.response?.status !== 403) {
        toast.error(error.response?.data?.message || 'Failed to fetch todos');
      }
    } finally {
      setIsLoading(false);
    }
  }, [canRead, categoryFilter, priorityFilter, statusFilter]);

  const fetchStatistics = useCallback(async () => {
    if (!canRead) return;
    try {
      const response = await todoService.getStatistics();
      setStatistics(response.statistics);
    } catch (error: any) {
      if (error.response?.status !== 403) {
        console.error('Failed to fetch todo statistics:', error);
      }
    }
  }, [canRead]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const createTodo = async (values: TodoInput) => {
    const response = await todoService.create(values);
    setTodos((prev) => [response.todo, ...prev]);
    toast.success('Todo created successfully!');
    fetchStatistics();
  };

  const updateTodo = async (todoId: string, values: TodoInput) => {
    const response = await todoService.update(todoId, values);
    setTodos((prev) => prev.map((todo) => (todo._id === todoId ? response.todo : todo)));
    toast.success('Todo updated successfully!');
    fetchStatistics();
  };

  const deleteTodo = async (todoId: string) => {
    await todoService.delete(todoId);
    setTodos((prev) => prev.filter((todo) => todo._id !== todoId));
    toast.success('Todo deleted successfully!');
    fetchStatistics();
  };

  const updateTodoStatus = async (todoId: string, status: Todo['status']) => {
    const response = await todoService.update(todoId, { status });
    setTodos((prev) => prev.map((todo) => (todo._id === todoId ? response.todo : todo)));
    toast.success('Status updated!');
    fetchStatistics();
  };

  const toggleSubtask = async (todoId: string, subtaskId: string, completed: boolean) => {
    const response = await todoService.updateSubtask(todoId, subtaskId, !completed);
    setTodos((prev) => prev.map((todo) => (todo._id === todoId ? response.todo : todo)));
    toast.success('Subtask updated!');
  };

  return {
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
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    updateTodoStatus,
    toggleSubtask,
  };
}
