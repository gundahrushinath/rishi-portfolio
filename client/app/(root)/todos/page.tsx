'use client';

import { useState, useEffect } from 'react';
import { todoService, TodoInput } from '@/lib/api';
import { Todo } from '@/models/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/lib/toast';
import { Plus, Trash2, Edit2, X, CheckSquare, Square, BarChart3, Calendar } from 'lucide-react';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent'] as const;
const STATUS_OPTIONS = ['Todo', 'In Progress', 'Completed', 'Cancelled'] as const;
const CATEGORY_OPTIONS = ['Work', 'Personal', 'Study', 'Health', 'Shopping', 'Other'] as const;

const PRIORITY_COLORS: Record<string, string> = {
  'Low': 'bg-blue-100 text-blue-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'High': 'bg-orange-100 text-orange-800',
  'Urgent': 'bg-red-100 text-red-800',
};

const STATUS_COLORS: Record<string, string> = {
  'Todo': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [formData, setFormData] = useState<TodoInput>({
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
  });

  const [tagInput, setTagInput] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');

  useEffect(() => {
    fetchTodos();
    fetchStatistics();
  }, [filterPriority, filterStatus, filterCategory]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (filterPriority) filters.priority = filterPriority;
      if (filterStatus) filters.status = filterStatus;
      if (filterCategory) filters.category = filterCategory;

      const response = await todoService.getAll(filters);
      setTodos(response.todos);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await todoService.getStatistics();
      setStatistics(response.statistics);
    } catch (error: any) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTodo) {
        const response = await todoService.update(editingTodo._id, formData);
        setTodos(todos.map(t => t._id === editingTodo._id ? response.todo : t));
        toast.success('Todo updated successfully!');
      } else {
        const response = await todoService.create(formData);
        setTodos([response.todo, ...todos]);
        toast.success('Todo created successfully!');
      }
      resetForm();
      fetchStatistics();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save todo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    try {
      await todoService.delete(id);
      setTodos(todos.filter(t => t._id !== id));
      toast.success('Todo deleted successfully!');
      fetchStatistics();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete todo');
    }
  };

  const handleSubtaskToggle = async (todoId: string, subtaskId: string, completed: boolean) => {
    try {
      const response = await todoService.updateSubtask(todoId, subtaskId, !completed);
      setTodos(todos.map(t => t._id === todoId ? response.todo : t));
      toast.success('Subtask updated!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update subtask');
    }
  };

  const handleStatusChange = async (todoId: string, newStatus: string) => {
    try {
      const response = await todoService.update(todoId, { status: newStatus });
      setTodos(todos.map(t => t._id === todoId ? response.todo : t));
      toast.success('Status updated!');
      fetchStatistics();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
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
    });
    setTagInput('');
    setSubtaskInput('');
    setEditingTodo(null);
    setShowForm(false);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      status: todo.status,
      category: todo.category,
      dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
      tags: todo.tags,
      subtasks: todo.subtasks.map(st => ({ title: st.title, completed: st.completed })),
      estimatedTime: todo.estimatedTime,
      actualTime: todo.actualTime,
      notes: todo.notes,
    });
    setShowForm(true);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || []
    });
  };

  const addSubtask = () => {
    if (subtaskInput.trim()) {
      setFormData({
        ...formData,
        subtasks: [...(formData.subtasks || []), { title: subtaskInput.trim(), completed: false }]
      });
      setSubtaskInput('');
    }
  };

  const toggleSubtaskInForm = (index: number) => {
    const updatedSubtasks = [...(formData.subtasks || [])];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    setFormData({ ...formData, subtasks: updatedSubtasks });
  };

  const removeSubtask = (index: number) => {
    setFormData({
      ...formData,
      subtasks: formData.subtasks?.filter((_, i) => i !== index) || []
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !['Completed', 'Cancelled'].includes(formData.status || '');
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">To-Do List</h2>
          <p className="text-muted-foreground">Manage your tasks efficiently</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowStats(!showStats)}>
            <BarChart3 className="mr-2 h-4 w-4" />
            {showStats ? 'Hide Stats' : 'Statistics'}
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {showForm ? 'Cancel' : 'New Todo'}
          </Button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      {showStats && statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Tasks</CardDescription>
              <CardTitle className="text-3xl">{statistics.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl text-green-600">{statistics.completed}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{statistics.inProgress}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Overdue</CardDescription>
              <CardTitle className="text-3xl text-red-600">{statistics.overdue}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Priority</Label>
          <select
            className="w-full px-3 py-2 border rounded-md mt-1"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            {PRIORITY_OPTIONS.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Status</Label>
          <select
            className="w-full px-3 py-2 border rounded-md mt-1"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Category</Label>
          <select
            className="w-full px-3 py-2 border rounded-md mt-1"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Todo Form */}
      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{editingTodo ? 'Edit Todo' : 'Create New Todo'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  placeholder="Describe the task..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  >
                    {PRIORITY_OPTIONS.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  >
                    {CATEGORY_OPTIONS.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedTime">Estimated Time (hours)</Label>
                  <Input
                    id="estimatedTime"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.estimatedTime || ''}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value ? parseFloat(e.target.value) : undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="actualTime">Actual Time (hours)</Label>
                  <Input
                    id="actualTime"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.actualTime || ''}
                    onChange={(e) => setFormData({ ...formData, actualTime: e.target.value ? parseFloat(e.target.value) : undefined })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subtasks">Subtasks</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="subtasks"
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                    placeholder="Add subtask and press Enter"
                  />
                  <Button type="button" onClick={addSubtask}>Add</Button>
                </div>
                <div className="space-y-2">
                  {formData.subtasks?.map((subtask, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSubtaskInForm(index)}
                        className="shrink-0"
                      >
                        {subtask.completed ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                      <span className={subtask.completed ? 'line-through text-muted-foreground' : ''}>
                        {subtask.title}
                      </span>
                      <X className="h-3 w-3 cursor-pointer ml-auto" onClick={() => removeSubtask(index)} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag and press Enter"
                  />
                  <Button type="button" onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full min-h-20 px-3 py-2 border rounded-md"
                  placeholder="Additional notes..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button type="submit">{editingTodo ? 'Update Todo' : 'Create Todo'}</Button>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Todos List */}
      {todos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No todos found. Create your first task!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {todos.map(todo => {
            const completedSubtasks = todo.subtasks.filter(st => st.completed).length;
            const totalSubtasks = todo.subtasks.length;
            const overdueFlag = todo.dueDate && new Date(todo.dueDate) < new Date() && !['Completed', 'Cancelled'].includes(todo.status);

            return (
              <Card key={todo._id} className={overdueFlag ? 'border-red-300' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={PRIORITY_COLORS[todo.priority]}>
                          {todo.priority}
                        </Badge>
                        <Badge className={STATUS_COLORS[todo.status]}>
                          {todo.status}
                        </Badge>
                        <Badge variant="outline">{todo.category}</Badge>
                        {overdueFlag && <Badge variant="destructive">Overdue</Badge>}
                      </div>
                      <CardTitle className="flex items-center gap-2">
                        {todo.title}
                        {todo.dueDate && (
                          <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(todo.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </CardTitle>
                      {todo.description && (
                        <CardDescription className="mt-2">{todo.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <select
                        className="text-sm px-2 py-1 border rounded"
                        value={todo.status}
                        onChange={(e) => handleStatusChange(todo._id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(todo)}
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(todo._id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {(todo.subtasks.length > 0 || todo.tags.length > 0 || todo.estimatedTime || todo.notes) && (
                  <CardContent className="space-y-3">
                    {todo.subtasks.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold mb-2">
                          Subtasks ({completedSubtasks}/{totalSubtasks})
                        </div>
                        <div className="space-y-1">
                          {todo.subtasks.map((subtask) => (
                            <div key={subtask._id} className="flex items-center gap-2">
                              <button
                                onClick={() => handleSubtaskToggle(todo._id, subtask._id!, subtask.completed)}
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
                      <div className="text-sm">
                        {todo.estimatedTime && <span>Est: {todo.estimatedTime}h</span>}
                        {todo.estimatedTime && todo.actualTime && <span> • </span>}
                        {todo.actualTime && <span>Actual: {todo.actualTime}h</span>}
                      </div>
                    )}

                    {todo.notes && (
                      <p className="text-sm text-muted-foreground">{todo.notes}</p>
                    )}

                    {todo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {todo.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
    </div>
  );
}
