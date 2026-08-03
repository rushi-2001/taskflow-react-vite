import MockAdapter from 'axios-mock-adapter';
import { axiosClient } from '../axiosClient';
import { seedUsers, seedTasks } from './seedData';
import type { Task } from '@/types/task.types';

export function bootstrapMockApi() {
  const mock = new MockAdapter(axiosClient, { delayResponse: 500 });

  // In-memory data store for tasks (clears on page reload)
  let mockTasks: Task[] = [...seedTasks];

  // Helper to extract user from Authorization header
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAuthUser = (headers: any) => {
    let authHeader: unknown = null;
    if (headers) {
      if (typeof headers.get === 'function') {
        authHeader = headers.get('Authorization') || headers.get('authorization');
      } else {
        authHeader = headers.Authorization || headers.authorization;
      }
    }
    if (!authHeader || typeof authHeader !== 'string') return null;

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token.startsWith('mock_token_for_')) return null;

    const userId = token.replace('mock_token_for_', '');
    const user = seedUsers.find((u) => u.id === userId);
    return user || null;
  };

  // Helper to inject random failure (5% chance)
  const shouldFailRandomly = (chance = 0.05): boolean => {
    return Math.random() < chance;
  };

  // --- AUTH LOGIN ---
  mock.onPost('/auth/login').reply((config) => {
    if (shouldFailRandomly()) {
      return [500, { message: 'Internal server error: Simulated transient API failure.' }];
    }

    try {
      const { email, password } = JSON.parse(config.data || '{}');
      const user = seedUsers.find((u) => u.email === email && u.password === password);

      if (!user) {
        return [401, { message: 'Invalid email or password.' }];
      }

      // Return user profile and a simulated token
      const token = `mock_token_for_${user.id}`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

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

  // --- GET TASKS ---
  mock.onGet('/tasks').reply((config) => {
    const user = getAuthUser(config.headers);
    if (!user) {
      return [401, { message: 'Unauthorized. Token missing or invalid.' }];
    }

    // Filter by role/ownerId
    let userTasks = mockTasks;
    if (user.role !== 'admin') {
      userTasks = mockTasks.filter((t) => t.ownerId === user.id);
    }

    return [200, userTasks];
  });

  // --- CREATE TASK ---
  mock.onPost('/tasks').reply((config) => {
    if (shouldFailRandomly(0.05)) {
      return [500, { message: 'Failed to create task due to a simulated database lock.' }];
    }

    const user = getAuthUser(config.headers);
    if (!user) {
      return [401, { message: 'Unauthorized.' }];
    }

    try {
      const data = JSON.parse(config.data || '{}');

      if (!data.title || !data.description || !data.priority) {
        return [400, { message: 'Missing required task fields.' }];
      }

      const newTask: Task = {
        id: `t_${Date.now()}`,
        title: data.title,
        description: data.description,
        status: data.status || 'pending',
        priority: data.priority,
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

  // --- UPDATE TASK ---
  mock.onPut(/\/tasks\/.*/).reply((config) => {
    if (shouldFailRandomly(0.05)) {
      return [500, { message: 'Simulated connection failure during update operation.' }];
    }

    const user = getAuthUser(config.headers);
    if (!user) {
      return [401, { message: 'Unauthorized.' }];
    }

    // Extract taskId from URL like /tasks/t1
    const urlParts = config.url?.split('/') || [];
    const taskId = urlParts[urlParts.length - 1];

    const taskIndex = mockTasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      return [404, { message: 'Task not found.' }];
    }

    const task = mockTasks[taskIndex];

    // Check permissions: Standard user can only update their own tasks
    if (user.role !== 'admin' && task.ownerId !== user.id) {
      return [403, { message: 'Forbidden. You do not own this task.' }];
    }

    try {
      const data = JSON.parse(config.data || '{}');

      const updatedTask: Task = {
        ...task,
        title: data.title !== undefined ? data.title : task.title,
        description: data.description !== undefined ? data.description : task.description,
        status: data.status !== undefined ? data.status : task.status,
        priority: data.priority !== undefined ? data.priority : task.priority,
        dueDate: data.dueDate !== undefined ? data.dueDate : task.dueDate,
        updatedAt: new Date().toISOString(),
      };

      mockTasks[taskIndex] = updatedTask;

      return [200, updatedTask];
    } catch {
      return [400, { message: 'Invalid request payload.' }];
    }
  });

  // --- DELETE TASK ---
  mock.onDelete(/\/tasks\/.*/).reply((config) => {
    if (shouldFailRandomly(0.05)) {
      return [500, { message: 'Simulated error deleting task.' }];
    }

    const user = getAuthUser(config.headers);
    if (!user) {
      return [401, { message: 'Unauthorized.' }];
    }

    // Extract taskId from URL like /tasks/t1
    const urlParts = config.url?.split('/') || [];
    const taskId = urlParts[urlParts.length - 1];

    const taskIndex = mockTasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      return [404, { message: 'Task not found.' }];
    }

    const task = mockTasks[taskIndex];

    // Check permissions
    if (user.role !== 'admin' && task.ownerId !== user.id) {
      return [403, { message: "Forbidden. You cannot delete someone else's task." }];
    }

    mockTasks = mockTasks.filter((t) => t.id !== taskId);

    return [200, { message: 'Task deleted successfully.', id: taskId }];
  });

  return mock;
}
