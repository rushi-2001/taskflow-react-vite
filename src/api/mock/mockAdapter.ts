import MockAdapter from 'axios-mock-adapter';
import { axiosClient } from '../axiosClient';
import { seedUsers, seedTasks } from './seedData';
import type { Task } from '@/types/task.types';

// Helper to safely extract payload whether passed as an object or JSON string
function parsePayload<T extends Record<string, unknown>>(data: unknown): Partial<T> {
  if (!data) return {};
  if (typeof data === 'object' && data !== null) return data as Partial<T>;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Partial<T>;
    } catch {
      return {};
    }
  }
  return {};
}

export function bootstrapMockApi() {
  const mock = new MockAdapter(axiosClient, { delayResponse: 300 });

  let mockTasks: Task[] = [...seedTasks];

  const getAuthUser = (headers: Record<string, unknown> | undefined) => {
    let authHeader: unknown = null;
    if (headers) {
      if (typeof headers.get === 'function') {
        authHeader =
          (headers as { get: (k: string) => unknown }).get('Authorization') ||
          (headers as { get: (k: string) => unknown }).get('authorization');
      } else {
        authHeader =
          headers.Authorization ||
          headers.authorization ||
          headers['Authorization'] ||
          headers['authorization'];
      }
    }
    if (!authHeader || typeof authHeader !== 'string') return null;

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token.startsWith('mock_token_for_')) return null;

    const userId = token.replace('mock_token_for_', '');
    const user = seedUsers.find((u) => u.id === userId);
    return user || null;
  };

  mock.onPost('/auth/login').reply((config) => {
    try {
      const data = parsePayload<{ email?: string; password?: string }>(config.data);
      const { email, password } = data;

      if (!email || !password) {
        return [400, { message: 'Email and password are required.' }];
      }

      const user = seedUsers.find((u) => u.email === email && u.password === password);

      if (!user) {
        return [401, { message: 'Invalid email or password.' }];
      }

      const token = `mock_token_for_${user.id}`;
      const { id, name, role } = user;
      const userWithoutPassword = { id, name, email: user.email, role };

      return [
        200,
        {
          user: userWithoutPassword,
          token,
        },
      ];
    } catch {
      return [400, { message: 'Invalid request payload.' }];
    }
  });

  mock.onGet('/tasks').reply((config) => {
    const user = getAuthUser(config.headers as Record<string, unknown>);
    if (!user) {
      return [401, { message: 'Unauthorized. Token missing or invalid.' }];
    }

    let userTasks = mockTasks;
    if (user.role !== 'admin') {
      userTasks = mockTasks.filter((t) => t.ownerId === user.id);
    }

    return [200, userTasks];
  });

  mock.onPost('/tasks').reply((config) => {
    const user = getAuthUser(config.headers as Record<string, unknown>);
    if (!user) {
      return [401, { message: 'Unauthorized.' }];
    }

    try {
      const data = parsePayload<Partial<Task>>(config.data);

      if (!data.title || !data.description) {
        return [400, { message: 'Missing required task fields.' }];
      }

      const newTask: Task = {
        id: `t_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: data.title,
        description: data.description,
        status: data.status || 'pending',
        ownerId: user.role === 'admin' && data.ownerId ? data.ownerId : user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: data.dueDate || undefined,
      };

      mockTasks.push(newTask);

      return [201, newTask];
    } catch {
      return [400, { message: 'Invalid request payload.' }];
    }
  });

  mock.onPut(/\/tasks\/.*/).reply((config) => {
    const user = getAuthUser(config.headers as Record<string, unknown>);
    if (!user) {
      return [401, { message: 'Unauthorized.' }];
    }

    const urlParts = config.url?.split('?')[0].split('/').filter(Boolean) || [];
    const taskId = urlParts[urlParts.length - 1];

    const taskIndex = mockTasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      return [404, { message: 'Task not found.' }];
    }

    const task = mockTasks[taskIndex];

    if (user.role !== 'admin' && task.ownerId !== user.id) {
      return [403, { message: 'Forbidden. You do not own this task.' }];
    }

    try {
      const data = parsePayload<Partial<Task>>(config.data);

      const updatedTask: Task = {
        ...task,
        title: data.title !== undefined ? data.title : task.title,
        description: data.description !== undefined ? data.description : task.description,
        status: data.status !== undefined ? data.status : task.status,
        dueDate: data.dueDate !== undefined ? data.dueDate : task.dueDate,
        ownerId: user.role === 'admin' && data.ownerId !== undefined ? data.ownerId : task.ownerId,
        updatedAt: new Date().toISOString(),
      };

      mockTasks[taskIndex] = updatedTask;

      return [200, updatedTask];
    } catch {
      return [400, { message: 'Invalid request payload.' }];
    }
  });

  mock.onDelete(/\/tasks\/.*/).reply((config) => {
    const user = getAuthUser(config.headers as Record<string, unknown>);
    if (!user) {
      return [401, { message: 'Unauthorized.' }];
    }

    const urlParts = config.url?.split('?')[0].split('/').filter(Boolean) || [];
    const taskId = urlParts[urlParts.length - 1];

    const taskIndex = mockTasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      return [404, { message: 'Task not found.' }];
    }

    const task = mockTasks[taskIndex];

    if (user.role !== 'admin' && task.ownerId !== user.id) {
      return [403, { message: "Forbidden. You cannot delete someone else's task." }];
    }

    mockTasks = mockTasks.filter((t) => t.id !== taskId);

    return [200, { message: 'Task deleted successfully.', id: taskId }];
  });

  return mock;
}


