import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Collapse,
  Button,
  Autocomplete,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { PromptsQueryParams, SortField, SortOrder } from '../../types/api';
import { PromptService } from '../../services/promptService';

interface FilterPanelProps {
  filters: PromptsQueryParams;
  onFilterChange: <K extends keyof PromptsQueryParams>(
    key: K,
    value: PromptsQueryParams[K]
  ) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.promptKey || '');

  // Available options
  const modelOptions = PromptService.getModelNames();
  const sortFields = PromptService.getSortFields();
  const sortOrders = PromptService.getSortOrders();

  // Common tags (in a real app, this would come from the API)
  const commonTags = [
    'support',
    'customer-service',
    'sales',
    'marketing',
    'development',
    'testing',
    'documentation',
    'training',
    'analysis',
    'creative',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange('promptKey', searchTerm || undefined);
  };

  const handleTagsChange = (_: React.SyntheticEvent, value: string[]) => {
    onFilterChange('tags', value.length > 0 ? value : undefined);
  };

  const hasActiveFilters = Boolean(
    filters.promptKey ||
    filters.modelName ||
    (filters.tags && filters.tags.length > 0) ||
    filters.isActive !== undefined ||
    filters.createdBy ||
    filters.sortBy !== 'dateCreation' ||
    filters.sortOrder !== 'desc'
  );

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: expanded ? 2 : 0 }}>
        <FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Filters
        </Typography>
        
        {hasActiveFilters && (
          <Chip
            label={`${Object.values(filters).filter(v => v !== undefined).length} active`}
            size="small"
            color="primary"
            sx={{ mr: 1 }}
          />
        )}

        <Button
          size="small"
          onClick={onReset}
          startIcon={<ClearIcon />}
          disabled={!hasActiveFilters}
          sx={{ mr: 1 }}
        >
          Clear
        </Button>

        <IconButton onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Search bar - always visible */}
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{ display: 'flex', gap: 1, mb: expanded ? 2 : 0 }}
      >
        <TextField
          fullWidth
          placeholder="Search prompts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ minWidth: 'auto', px: 2 }}
        >
          Search
        </Button>
      </Box>

      {/* Expandable filters */}
      <Collapse in={expanded}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
          {/* Model Name */}
          <FormControl fullWidth size="small">
            <InputLabel>Model</InputLabel>
            <Select
              value={filters.modelName || ''}
              onChange={(e) => onFilterChange('modelName', e.target.value || undefined)}
              label="Model"
            >
              <MenuItem value="">All Models</MenuItem>
              {modelOptions.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Tags */}
          <Autocomplete
            multiple
            options={commonTags}
            value={filters.tags || []}
            onChange={handleTagsChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  size="small"
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Select tags"
                size="small"
              />
            )}
            size="small"
          />

          {/* Active Status */}
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.isActive === undefined ? '' : filters.isActive.toString()}
              onChange={(e) => {
                const value = e.target.value;
                onFilterChange(
                  'isActive',
                  value === '' ? undefined : value === 'true'
                );
              }}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>

          {/* Sort By */}
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy || 'dateCreation'}
              onChange={(e) => onFilterChange('sortBy', e.target.value as SortField)}
              label="Sort By"
            >
              {sortFields.map((field) => (
                <MenuItem key={field.value} value={field.value}>
                  {field.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sort Order */}
          <FormControl fullWidth size="small">
            <InputLabel>Order</InputLabel>
            <Select
              value={filters.sortOrder || 'desc'}
              onChange={(e) => onFilterChange('sortOrder', e.target.value as SortOrder)}
              label="Order"
            >
              {sortOrders.map((order) => (
                <MenuItem key={order.value} value={order.value}>
                  {order.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Created By */}
          <TextField
            fullWidth
            label="Created By"
            placeholder="Filter by creator email"
            value={filters.createdBy || ''}
            onChange={(e) => onFilterChange('createdBy', e.target.value || undefined)}
            size="small"
          />
        </Box>
      </Collapse>
    </Paper>
  );
};
