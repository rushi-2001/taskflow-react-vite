import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { seedUsers } from '@/api/mock/seedData';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  isAdmin: boolean;
  selectedUsers: string[];
  onSelectedUsersChange: (users: string[]) => void;
}

export default function TaskFilters({
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
  isAdmin,
  selectedUsers,
  onSelectedUsersChange,
}: TaskFiltersProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <TextField
        placeholder="Search tasks..."
        size="small"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ flexGrow: 1, minWidth: '200px' }}
      />

      {isAdmin && (
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="user-filter-label">Filter by User</InputLabel>
          <Select
            labelId="user-filter-label"
            multiple
            value={selectedUsers}
            onChange={(e) =>
              onSelectedUsersChange(
                typeof e.target.value === 'string'
                  ? e.target.value.split(',')
                  : (e.target.value as string[])
              )
            }
            input={<OutlinedInput label="Filter by User" />}
            renderValue={(selected) => {
              if (selected.length === seedUsers.length) return 'All Users';
              if (selected.length === 0) return 'No Users';
              return selected
                .map((uid) => seedUsers.find((u) => u.id === uid)?.name || uid)
                .join(', ');
            }}
          >
            {seedUsers.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                <Checkbox size="small" checked={selectedUsers.indexOf(u.id) > -1} />
                <ListItemText primary={u.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="sort-by-label">Sort By</InputLabel>
        <Select
          labelId="sort-by-label"
          value={sortBy}
          label="Sort By"
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <MenuItem value="createdAt_desc">Newest First</MenuItem>
          <MenuItem value="createdAt_asc">Oldest First</MenuItem>
          <MenuItem value="dueDate_asc">Due Date (Soonest)</MenuItem>
          <MenuItem value="dueDate_desc">Due Date (Latest)</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
