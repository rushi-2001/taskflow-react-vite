# TaskFlow – Task & Analytics Dashboard

TaskFlow is a role-based task management and analytics web application built with React, TypeScript, Vite, Material UI (MUI), and Redux Toolkit.

---

## 1. Get Started

### Install Dependencies
```bash
npm install
```

### Run in Development
Runs the app locally using the Vite dev server with in-memory mock API adapter active.
```bash
npm run dev
```

### Production Build
Compiles TypeScript and bundles static assets for production deployment.
```bash
npm run build
```

### Code Quality Check (Linting)
Runs ESLint audits over the codebase.
```bash
npm run lint
```

---

## 2. Demo Credentials

The in-memory mock API is pre-seeded with two accounts for testing roles and privileges:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@taskflow.com` | `admin123` | Can view all tasks, create tasks, view global statistics, and access the user breakdown dashboard. |
| **Standard User** | `user@taskflow.com` | `user123` | Can view, create, edit, toggle, and delete their own tasks. Restricted from accessing admin-only views. |

---

## 3. Architecture & Tech Stack Choices

- **HTTP client**: **Axios** only. Centralized in `src/api/axiosClient.ts`. Includes interceptors that automatically inject JWT bearer authorization headers and normalize error shapes to `{ message, status }` for unified downstream processing.
- **Mock Layer**: **axios-mock-adapter** in development. Seamlessly intercepts Axios requests inside `src/api/mock/mockAdapter.ts`. Uses seed data defined in `src/api/mock/seedData.ts`. It runs completely in-memory, avoiding stale localStorage state during schema revisions.
- **Domain State**: **Redux Toolkit**. Handles domain models (`auth` and `tasks`) inside `src/features/*`. Utilizes async thunks for mutations and memoized `createSelector` hooks for dashboard metrics calculations.
- **UI State**: **Context API + useReducer**. Configured in `src/context/UIContext.tsx`. Manages ephemeral presentational state:
  - Sidebar drawer collapse state.
  - Global snackbar notification queue (toats stack).
- **Forms & Validation**: **Formik + Yup**. Bound using schemas colocated with forms (e.g. `loginValidationSchema.ts`, `taskValidationSchema.ts`).
- **Data Visualization**: **Recharts**. Displays donut pie charts reflecting status breakdown metrics.
- **Styling & Theme**: **Material UI v9 (pre-release type-compatible)** + **Emotion**. Custom CSS design tokens are centralized in `src/theme/theme.ts`.
- **Code Optimization**: Wrapped `TaskItem` inside `React.memo` and bound callbacks inside `TasksPage` using `useCallback` to avoid unnecessary list re-renders. Filter queries are optimized with a `useMemo` filter block debounced by 300ms.

---

## 4. Scalability Verification (Requirement 5.4)

TaskFlow is designed to transition from mock-mode to a real back-end with **zero code modifications** in the API files (`authApi.ts` and `taskApi.ts`):
1. Open `.env.development` or `.env.production`.
2. Toggle `VITE_USE_MOCK_API=false`.
3. Set `VITE_API_BASE_URL` to point to the address of your real gateway host.
4. Restart the development server. The dynamic loader in `src/main.tsx` will bypass the mock registration, letting all calls route directly to your real server.

---

## 5. Concept to Code Traceability

| Concept | File Location |
|---|---|
| JSX / component architecture | Global layout under `src/components/`, pages colocated under `src/pages/` |
| Props & state | Typing interfaces in components (e.g., `TaskFormProps`); Formik form state |
| `useState` | Local visibility flags (e.g., in `LoginPage`, dialog toggles in `TasksPage`) |
| `useEffect` | Bootstrap session checks in thunks; task fetching on page mount |
| `useContext` | Shared UI toggles and snackbars (`src/context/UIContext.tsx`) |
| `useReducer` | Sidebar and snackbar reducer triggers (`src/context/UIContext.tsx`) |
| Domain state library | Slices and thunks (`src/features/auth/authSlice.ts`, `src/features/tasks/taskSlice.ts`) |
| `useMemo` | Filtering/sorting list values in `TasksPage.tsx`; statistics computed in thunks/selectors |
| `useCallback` | CRUD handler callbacks in `TasksPage.tsx` passed down to `TaskList` / `TaskItem` |
| Custom hooks | Debouncing query states (`src/hooks/useDebouncedValue.ts`); Typed selectors (`src/app/hooks.ts`) |
| React Router / protected routes | Guards and router declaration (`src/routes/ProtectedRoute.tsx`, `src/routes/RoleRoute.tsx`) |
| Controlled forms & validation | Formik forms with Yup validation (`src/pages/LoginPage/*`, `src/pages/TasksPage/TaskFormDialog.tsx`) |
| Error Boundaries | Class-based component layout (`src/components/common/ErrorBoundary.tsx`) |
| Code splitting / lazy loading | Lazy load pages inside router layout (`src/routes/AppRoutes.tsx`) |
| API integration & async | AxiosClient instance config (`src/api/axiosClient.ts`) |
| Data visualization | Recharts pie chart representation (`src/pages/DashboardPage/TaskStatusChart.tsx`) |
