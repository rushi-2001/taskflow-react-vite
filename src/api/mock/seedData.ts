import type { Task } from '@/types/task.types';
import { ADMIN_CREDENTIALS, USER_CREDENTIALS } from '@/utils/config';

export const seedUsers = [
  {
    id: 'u1',
    name: 'Admin User',
    email: ADMIN_CREDENTIALS.email,
    password: ADMIN_CREDENTIALS.password,
    role: 'admin' as const,
  },
  {
    id: 'u2',
    name: 'Standard User',
    email: USER_CREDENTIALS.email,
    password: USER_CREDENTIALS.password,
    role: 'user' as const,
  },
];

// Helper to generate ISO dates relative to now
const getDateDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

const getDateDaysAhead = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const seedTasks: Task[] = [
  {
    id: 't1',
    title: 'Design Database Schema',
    description: 'Create initial PostgreSQL database schema and design relations.',
    status: 'completed',
    ownerId: 'u2', // Standard User
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: getDateDaysAgo(2),
  },
  {
    id: 't2',
    title: 'Setup API Gateway',
    description: 'Implement auth verification middleware and route forwarding.',
    status: 'in-progress',
    ownerId: 'u2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: getDateDaysAhead(2),
  },
  {
    id: 't3',
    title: 'Write API Documentation',
    description: 'Document endpoints, payload structures, and error codes in Swagger.',
    status: 'pending',
    ownerId: 'u2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: getDateDaysAhead(5),
  },
  {
    id: 't4',
    title: 'Refactor Auth Slice',
    description: 'Replace legacy session state logic with Redux Toolkit async thunks.',
    status: 'pending',
    ownerId: 'u2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: getDateDaysAgo(1), // Overdue!
  },
  {
    id: 't5',
    title: 'Deploy to Staging Environment',
    description: 'Configure AWS ECS pipeline to build and deploy docker container.',
    status: 'completed',
    ownerId: 'u1', // Admin User
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: getDateDaysAgo(3),
  },
  {
    id: 't6',
    title: 'Perform Security Vulnerability Audit',
    description: 'Scan dependency tree for packages with known CVEs and update them.',
    status: 'in-progress',
    ownerId: 'u1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: getDateDaysAhead(1),
  },
  {
    id: 't7',
    title: 'Design Analytics Dashboard',
    description: 'Draft UI wireframes for dashboard reports and chart selections.',
    status: 'pending',
    ownerId: 'u1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: getDateDaysAhead(10),
  },
];
