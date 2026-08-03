import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
}

export default function TaskFilters({
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
}: TaskFiltersProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
        p: 2,
        borderRadius: 3,
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
