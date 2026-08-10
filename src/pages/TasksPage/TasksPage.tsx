import { Box, Typography, Button, Alert, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTasksPage } from './hooks/useTasksPage';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import TaskFormDialog from './TaskFormDialog';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Loader from '@/components/common/Loader';

export default function TasksPage() {
  const {
    tasks,
    status,
    error,
    isAdmin,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedUsers,
    setSelectedUsers,
    sortBy,
    setSortBy,
    formOpen,
    editingTask,
    deleteOpen,
    tabCounts,
    filteredTasks,
    hasActiveFilters,
    handleClearFilters,
    handleClearError,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleCloseForm,
    handleCloseDelete,
    handleToggleStatus,
    handleFormSubmit,
    handleDeleteConfirm,
  } = useTasksPage();

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Project Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage, organize, and track your ongoing project tasks.
          </Typography>
        </Box>
        <Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Create Task
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={handleClearError} sx={{ mb: 3, borderRadius: 1 }}>
          {error}
        </Alert>
      )}

      <Tabs
        value={statusFilter}
        onChange={(_, newValue) => setStatusFilter(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab
          label={`All (${tabCounts.all})`}
          value="all"
          sx={{ fontWeight: 600, textTransform: 'none' }}
        />
        <Tab
          label={`TODO (${tabCounts.pending})`}
          value="pending"
          sx={{ fontWeight: 600, textTransform: 'none' }}
        />
        <Tab
          label={`In Progress (${tabCounts['in-progress']})`}
          value="in-progress"
          sx={{ fontWeight: 600, textTransform: 'none' }}
        />
        <Tab
          label={`Completed (${tabCounts.completed})`}
          value="completed"
          sx={{ fontWeight: 600, textTransform: 'none' }}
        />
      </Tabs>

      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        isAdmin={isAdmin}
        selectedUsers={selectedUsers}
        onSelectedUsersChange={setSelectedUsers}
      />

      {status === 'loading' && tasks.length === 0 ? (
        <Loader />
      ) : (
        <TaskList
          tasks={filteredTasks}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onToggleStatus={handleToggleStatus}
          onClearFilters={handleClearFilters}
          isFiltered={hasActiveFilters}
        />
      )}

      <TaskFormDialog
        open={formOpen}
        task={editingTask}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isLoading={status === 'loading'}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action is permanent and cannot be undone."
        onConfirm={handleDeleteConfirm}
        onClose={handleCloseDelete}
        isLoading={status === 'loading'}
      />
    </Box>
  );
}
