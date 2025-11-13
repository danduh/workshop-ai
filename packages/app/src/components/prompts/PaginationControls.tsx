import React from 'react';
import {
  Box,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import { PaginationDto } from '../../types/api';

interface PaginationControlsProps {
  pagination: PaginationDto;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
}) => {
  const { page, limit, total, totalPages } = pagination;

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const limitOptions = [10, 20, 50, 100];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        py: 2,
      }}
    >
      {/* Results info */}
      <Typography variant="body2" color="text.secondary">
        Showing {startItem}-{endItem} of {total} results
      </Typography>

      {/* Pagination controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Items per page */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Per page</InputLabel>
          <Select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            label="Per page"
          >
            {limitOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Page navigation */}
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
          />
        )}
      </Box>
    </Box>
  );
};
