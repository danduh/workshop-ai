import React from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  AlertTitle,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/common';
import { PromptCard } from '../components/prompts/PromptCard';
import { FilterPanel } from '../components/prompts/FilterPanel';
import { PaginationControls } from '../components/prompts/PaginationControls';
import { usePrompts, usePromptFilters, useActivateVersion } from '../hooks/usePrompts';
import { PromptResponseDto } from '../types/api';

export const PromptLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { filters, updateFilter, resetFilters } = usePromptFilters();
  const { data, isLoading, error, isFetching } = usePrompts(filters);
  const activateVersionMutation = useActivateVersion();

  const handleCreatePrompt = () => {
    navigate('/prompts/create');
  };

  const handleViewPrompt = (prompt: PromptResponseDto) => {
    navigate(`/prompts/${prompt.promptKey}`);
  };

  const handleEditPrompt = (prompt: PromptResponseDto) => {
    navigate(`/prompts/${prompt.promptKey}/edit`);
  };

  const handleViewVersions = (prompt: PromptResponseDto) => {
    navigate(`/prompts/${prompt.promptKey}/versions`);
  };

  const handleCopyPrompt = (prompt: PromptResponseDto) => {
    // Show success message or toast
    console.log('Copied prompt:', prompt.promptKey);
  };

  const handleActivatePrompt = async (prompt: PromptResponseDto) => {
    try {
      await activateVersionMutation.mutateAsync({
        promptKey: prompt.promptKey,
        version: prompt.version,
      });
      // Success feedback is handled by the mutation's onSuccess callback
    } catch (error) {
      // Error feedback is handled by the mutation's onError callback
      console.error('Failed to activate prompt version:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <PageWrapper title="Prompt Library" showBreadcrumbs={false}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={48} />
        </Box>
      </PageWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <PageWrapper title="Prompt Library" showBreadcrumbs={false}>
        <Alert severity="error">
          <AlertTitle>Error Loading Prompts</AlertTitle>
          There was a problem loading the prompt library. Please try again later.
        </Alert>
      </PageWrapper>
    );
  }

  const prompts = data?.data || [];
  const pagination = data?.pagination;

  return (
    <PageWrapper
      title="Prompt Library"
      subtitle="Manage and organize your AI prompts"
      showBreadcrumbs={false}
    >
      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          {isFetching && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                Updating...
              </Typography>
            </Box>
          )}
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreatePrompt}
          size="large"
        >
          Create Prompt
        </Button>
      </Box>

      {/* Filters */}
      <FilterPanel
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      {/* Results */}
      {prompts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No prompts found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {Object.keys(filters).some(key => filters[key as keyof typeof filters] !== undefined) 
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by creating your first prompt.'
            }
          </Typography>
          {Object.keys(filters).length === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreatePrompt}
            >
              Create Your First Prompt
            </Button>
          )}
        </Box>
      ) : (
        <>
          {/* Prompt Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 2,
              mb: 3,
            }}
          >
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onView={handleViewPrompt}
                onEdit={handleEditPrompt}
                onCopy={handleCopyPrompt}
                onViewVersions={handleViewVersions}
                onActivate={handleActivatePrompt}
              />
            ))}
          </Box>

          {/* Pagination */}
          {pagination && (
            <PaginationControls
              pagination={pagination}
              onPageChange={(page) => updateFilter('page', page)}
              onLimitChange={(limit) => updateFilter('limit', limit)}
            />
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default PromptLibraryPage;
