# TaskFlow – Task & Analytics Dashboard

~ Rushi Patel

> **React Capstone Project Submission**  
> A role-based task management and analytics web application built with **React 19**, **TypeScript**, **Vite**, **Material UI (MUI v9)**, **Redux Toolkit**, and **Recharts**.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Demo Credentials](#-demo-credentials)
- [Technology Stack](#-technology-stack)
- [System Architecture & State Management](#-system-architecture--state-management)
- [Concept-to-Code Traceability Matrix](#-concept-to-code-traceability-matrix)
- [Backend Migration & Environment Setup](#-backend-migration--environment-setup)
- [Getting Started & Local Execution](#-getting-started--local-execution)
- [Project Structure](#-project-structure)
- [Quality Assurance & Build Scripts](#-quality-assurance--build-scripts)

---

## 🎯 Overview

**TaskFlow** is a modern, enterprise-grade task management and analytics dashboard designed to help teams organize, track, and analyze work efficiently. It provides **Role-Based Access Control (RBAC)**, real-time analytics visualizations, debounced filtering, full CRUD capabilities for tasks, and global notification handling.

The application is architected with a decoupled networking layer that uses **Axios** and **axios-mock-adapter** for in-memory API simulation during development, enabling zero-code transition to a live REST gateway.

---

## ✨ Key Features

- 🔐 **Role-Based Access Control (RBAC)**
  - Protected routes (`/dashboard`, `/tasks`) accessible only to authenticated users.
  - Restricted admin routes (`/admin`) guarded by role checks (`RoleRoute.tsx`).
  - Contextual UI element visibility based on permissions (e.g., global owner filters, system-wide user breakdowns).

- 📊 **Interactive Analytics Dashboard**
  - KPI summary cards tracking total tasks, in-progress items, completion rates, and overdue items.
  - Interactive status distribution pie chart built with **Recharts**.
  - User breakdown statistics table detailing tasks assigned per team member.

- ✅ **Comprehensive Task Management (CRUD)**
  - Create, view, edit status/details, and delete tasks.
  - Fast inline status toggling (Pending, In Progress, Completed).
  - Validation-backed dialog forms (Formik + Yup).

- 🔍 **Advanced Filtering & Search**
  - Real-time task search with 300ms debouncing (`useDebouncedValue`).
  - Status filters (All, Pending, In Progress, Completed).
  - Sorting by Due Date, Title, Status, or Created Date.
  - Owner-specific filters for administrator views.

- 🔔 **Global Ephemeral UI & Notifications**
  - Context API + `useReducer` managing sidebar drawer state and a non-intrusive snackbar toast queue.
  - Class-based React Error Boundary for resilient runtime error recovery.
  - Custom themed components with dark/light mode foundations powered by MUI v9 and Emotion.

---

## 🔑 Demo Credentials

The in-memory mock API adapter is pre-seeded with two demo user accounts representing distinct roles:

| Role                 | Email                | Password   | Allowed Privileges & Scope                                                                                                            |
| :------------------- | :------------------- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| 🛡️ **Administrator** | `admin@taskflow.com` | `admin123` | Full system access: view global metrics, manage all user tasks, access Admin metrics page (`/admin`), and view user breakdown tables. |
| 👤 **Standard User** | `user@taskflow.com`  | `user123`  | Restricted access: view, create, edit, and delete personal tasks (`/tasks`, `/dashboard`). Restricted from accessing `/admin`.        |

> 💡 **Developer Helper**: On the Login page (`/login`), click the **Info icon** in the top-right corner to open the **Dev Credentials** popup, which includes quick "Fill Credentials" auto-fill buttons.

---

## 🛠️ Technology Stack

| Layer                     | Technology / Library                            | Purpose                                                                                   |
| :------------------------ | :---------------------------------------------- | :---------------------------------------------------------------------------------------- |
| **Core Framework**        | React 19, TypeScript 6, Vite 8                  | Fast SPA rendering, strong type-safety, and modern HMR developer environment.             |
| **Domain State**          | Redux Toolkit (`@reduxjs/toolkit`), React Redux | Centralized domain state (`auth`, `tasks`), async thunks, and memoized selectors.         |
| **UI State**              | React Context API + `useReducer`                | Light-weight presentational state for sidebar navigation and global snackbar toast stack. |
| **UI Components & Theme** | Material UI (MUI v9), Emotion                   | Enterprise component library, responsive layout grids, custom CSS design tokens.          |
| **Forms & Validation**    | Formik, Yup                                     | Controlled form handling, dynamic input validation schemas.                               |
| **Data Visualization**    | Recharts                                        | Responsive SVG charts (Status distribution pie chart).                                    |
| **HTTP & API Mocking**    | Axios, `axios-mock-adapter`                     | Centralized API client with JWT bearer interceptors and in-memory REST simulation.        |
| **Routing**               | React Router v7                                 | Declarative SPA routing, code splitting (`React.lazy`), and route authorization guards.   |
| **Date Utilities**        | Day.js                                          | Date formatting, parsing, and relative due-date calculations.                             |

---

## 🏗️ System Architecture & State Management

TaskFlow separates state concerns into two explicit layers:

```
                  ┌──────────────────────────────────────────────┐
                  │                 React App                    │
                  └──────┬────────────────────────────────┬──────┘
                         │                                │
         ┌───────────────┴───────────────┐ ┌──────────────┴──────────────┐
         │ Redux Toolkit (Domain State)  │ │ Context API + useReducer    │
         │ - Auth Slice (User & JWT)     │ │   (Ephemeral UI State)      │
         │ - Task Slice (CRUD & Thunks)  │ │ - Sidebar Open/Collapse     │
         └───────────────┬───────────────┘ │ - Global Snackbar Toasts    │
                         │                 └─────────────────────────────┘
                         ▼
        ┌──────────────────────────────────┐
        │ Axios Client (src/api/axios.ts)  │
        │ - Inject Authorization Header    │
        │ - Standardize Error Payload      │
        └────────────────┬─────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │      VITE_USE_MOCK_API?       │
         ├────────────────┬──────────────┤
     true│                │false         │
         ▼                ▼              │
┌──────────────────┐   ┌─────────────────┐
│ axios-mock-      │   │ Real Backend    │
│ adapter (In-Mem) │   │ REST Gateway    │
└──────────────────┘   └─────────────────┘
```

1. **Domain State (Redux Toolkit)**: Global business entity data stored in slices (`authSlice`, `taskSlice`). Mutations are driven through `createAsyncThunk` routines with pending/fulfilled/rejected status handling.
2. **UI State (Context API + `useReducer`)**: Presentational transient state managed in `UIContext.tsx` (toast notifications and drawer toggle).
3. **Data Access Layer**: HTTP queries execute exclusively via the centralized Axios client (`src/api/axiosClient.ts`).

---

## 🗺️ Concept-to-Code Traceability Matrix

This table maps core React, Redux, and Web Development concepts to their exact implementation within the codebase for review and marking evaluation:

| Concept / Requirement                      | Implementation File(s)                                                                                                                                                                                                                                                                                                                                                                                                  | Key Highlights                                                                                        |
| :----------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| **JSX & Component Hierarchy**              | [`src/components/layout/AppLayout.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/components/layout/AppLayout.tsx), [`src/pages/TasksPage/TasksPage.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/pages/TasksPage/TasksPage.tsx)                                                                                                        | Clean layout structure, modular single-responsibility components.                                     |
| **Props & Component Interfaces**           | [`src/components/common/StatCard.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/components/common/StatCard.tsx), [`src/pages/TasksPage/TaskItem.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/pages/TasksPage/TaskItem.tsx)                                                                                                            | Explicit TypeScript interface definitions (`StatCardProps`, `TaskItemProps`).                         |
| **`useState` & Local State**               | [`src/pages/LoginPage/DevCredentialsInfo.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/pages/LoginPage/DevCredentialsInfo.tsx), [`src/pages/TasksPage/TasksPage.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/pages/TasksPage/TasksPage.tsx)                                                                                          | Modal visibility, popover anchor targets, dynamic form dialog controls.                               |
| **Context API & `useReducer`**             | [`src/context/UIContext.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/context/UIContext.tsx), [`src/context/uiReducer.ts`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/context/uiReducer.ts)                                                                                                                                              | Custom state reducer for sidebar toggling and toast snackbar message stack.                           |
| **Redux Toolkit & Async Thunks**           | [`src/store/auth/authSlice.ts`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/store/auth/authSlice.ts), [`src/store/tasks/taskSlice.ts`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/store/tasks/taskSlice.ts)                                                                                                                                  | Async thunks (`login`, `fetchTasks`, `createTask`, `updateTask`, `deleteTask`).                       |
| **Performance: `useMemo` & `useCallback`** | [`src/pages/TasksPage/TasksPage.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/pages/TasksPage/TasksPage.tsx), [`src/pages/TasksPage/TaskItem.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/pages/TasksPage/TaskItem.tsx)                                                                                                              | `React.memo` on `TaskItem`, `useCallback` on CRUD handlers, `useMemo` for heavy metrics calculations. |
| **Custom Hooks**                           | [`src/hooks/useDebouncedValue.ts`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/hooks/useDebouncedValue.ts), [`src/store/hooks.ts`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/store/hooks.ts)                                                                                                                                                | Custom debouncing hook for search queries; strongly typed `useAppDispatch` & `useAppSelector`.        |
| **React Router & Route Guards**            | [`src/routes/AppRoutes.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/routes/AppRoutes.tsx), [`src/routes/ProtectedRoute.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/routes/ProtectedRoute.tsx), [`src/routes/RoleRoute.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/routes/RoleRoute.tsx) | Code splitting (`lazy`/`Suspense`), protected routes, role authorization guards (`RoleRoute`).        |
| **Controlled Forms & Yup**                 | [`src/pages/LoginPage/LoginForm.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/pages/LoginPage/LoginForm.tsx), [`src/pages/TasksPage/TaskFormDialog.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/pages/TasksPage/TaskFormDialog.tsx)                                                                                                  | Formik forms integrated with Yup schemas (`loginValidationSchema`, `taskValidationSchema`).           |
| **Data Visualization**                     | [`src/pages/DashboardPage/TaskStatusChart.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/pages/DashboardPage/TaskStatusChart.tsx)                                                                                                                                                                                                                                               | Custom tooltips, legends, responsive container pie chart using Recharts.                              |
| **Error Handling & Resilience**            | [`src/components/common/ErrorBoundary.tsx`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/components/common/ErrorBoundary.tsx), [`src/api/axiosClient.ts`](file:///Users/tirth_rushi/workspace/personal/xoriant/react-capstone-taskflow/src/api/axiosClient.ts)                                                                                                                      | Class-based error boundary catch block and unified Axios error normalization.                         |

---

## ⚡ Backend Migration & Environment Setup

TaskFlow is engineered to switch seamlessly between the **in-memory mock adapter** and a **live REST API gateway** without modifying single lines of API integration logic.

### Environment Flags

- `.env.development`

  ```env
  VITE_API_BASE_URL=/api
  VITE_USE_MOCK_API=true
  ```

- `.env.production`
  ```env
  VITE_API_BASE_URL=https://api.taskflow.example.com
  VITE_USE_MOCK_API=false
  ```

### How to Switch to a Real Backend Server

1. Open `.env.development` (or create a `.env.local` file).
2. Set `VITE_USE_MOCK_API=false`.
3. Update `VITE_API_BASE_URL` to point to your backend API URL (e.g. `http://localhost:8080/api`).
4. Restart the development server (`npm run dev`). The bootstrapper in `src/main.tsx` will automatically bypass `mockAdapter` registration, sending real HTTP requests over the wire.

---

## 🚀 Getting Started & Local Execution

### Prerequisites

- **Node.js**: `v18.0.0` or higher (recommended: `v20.x`)
- **npm**: `v9.0.0` or higher

### Installation Steps

1. **Install the Project**

   ```bash
   cd react-capstone-taskflow
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

   Open your browser and navigate to `http://localhost:5173`.

4. **Build for Production**

   ```bash
   npm run build
   ```

5. **Preview Production Bundle**
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```
react-capstone-taskflow/
├── public/                 # Static assets & favicon
├── src/
│   ├── api/                # Axios instance & Mock API configuration
│   │   ├── mock/           # axios-mock-adapter routes and seed dataset
│   │   │   ├── mockAdapter.ts
│   │   │   └── seedData.ts
│   │   ├── authApi.ts      # Authentication API service calls
│   │   ├── axiosClient.ts  # Axios client configuration & interceptors
│   │   └── taskApi.ts      # Task management API service calls
│   ├── components/         # Reusable presentation components
│   │   ├── common/         # StatCard, StatusChip, ErrorBoundary, Loader, etc.
│   │   └── layout/         # AppLayout, Header, Sidebar navigation
│   ├── context/            # Context API + useReducer for presentational UI state
│   │   ├── UIContext.tsx   # Context provider & useUI hook
│   │   └── uiReducer.ts    # Reducer state & action handler
│   ├── hooks/              # Custom React hooks (e.g. useDebouncedValue)
│   ├── pages/              # Application views & pages
│   │   ├── AdminPage/      # Restricted system analytics view (Admin only)
│   │   ├── DashboardPage/  # Main analytics dashboard & chart view
│   │   ├── LoginPage/      # Login view with Dev Credentials popover
│   │   ├── TasksPage/      # Task list, search, filtering & CRUD dialogs
│   │   ├── NotFoundPage.tsx
│   │   └── UnauthorizedPage.tsx
│   ├── routes/             # Navigation routes & security guards
│   │   ├── AppRoutes.tsx   # Lazy routing definitions
│   │   ├── ProtectedRoute.tsx # Authentication guard
│   │   └── RoleRoute.tsx   # Role-based authorization guard
│   ├── theme/              # MUI v9 custom theme & design tokens
│   │   └── theme.ts
│   ├── types/              # TypeScript interfaces (Task, User, API shapes)
│   ├── utils/              # Helper utilities & configuration constants
│   ├── App.tsx             # Main provider wrapper & theme setup
│   └── main.tsx            # Application entrypoint & mock bootstrap
├── .env.development        # Development environment variables
├── .env.production         # Production environment variables
├── eslint.config.js        # ESLint rule configuration
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build tool configuration
```

---

## 🧪 Quality Assurance & Build Scripts

- **`npm run dev`**: Launches Vite dev server with Hot Module Replacement (HMR).
- **`npm run build`**: Runs TypeScript type checking (`tsc -b`) and bundles for production via Vite.
- **`npm run lint`**: Executes ESLint checking across all TS/TSX source files.
- **`npm run preview`**: Serves the locally generated production build in `dist/`.

---
