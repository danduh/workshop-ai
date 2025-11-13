import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle as ActiveIcon,
  RadioButtonUnchecked as InactiveIcon,
  ArrowBack as BackIcon,
  PlayArrow as ActivateIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/common';
import { useVersions, useActivateVersion } from '../hooks/usePrompts';
import { PromptResponseDto } from '../types/api';

export const PromptFamilyPage: React.FC = () => {
  const { promptKey } = useParams<{ promptKey: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isFetching } = useVersions(promptKey || '', { page, limit: 20 });
  const activateVersionMutation = useActivateVersion();

  const handleBack = () => {
    navigate('/');
  };

  const handleCreateVersion = () => {
    navigate(`/prompts/${promptKey}/create-version`);
  };

  const handleViewPrompt = (prompt: PromptResponseDto) => {
    navigate(`/prompts/${promptKey}/version/${prompt.version}`);
  };

  const handleEditPrompt = (prompt: PromptResponseDto) => {
    navigate(`/prompts/${promptKey}/version/${prompt.version}/edit`);
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
      <PageWrapper title="Loading..." showBreadcrumbs={false}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={48} />
        </Box>
      </PageWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <PageWrapper title="Error" showBreadcrumbs={false}>
        <Alert severity="error">
          <AlertTitle>Error Loading Prompt Family</AlertTitle>
          There was a problem loading the prompt versions. Please try again later.
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleBack}
          >
            Back to Library
          </Button>
        </Box>
      </PageWrapper>
    );
  }

  const versions = data?.data || [];
  const pagination = data?.pagination;
  const activeVersion = versions.find(v => v.isActive);

  return (
    <PageWrapper
      title={`Prompt Family: ${promptKey}`}
      subtitle={`All versions of the "${promptKey}" prompt`}
      showBreadcrumbs={false}
    >
      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={handleBack}
        >
          Back to Library
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isFetching && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                Updating...
              </Typography>
            </Box>
          )}
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateVersion}
          >
            Create New Version
          </Button>
        </Box>
      </Box>

      {/* Active Version Summary */}
      {activeVersion && (
        <Card sx={{ mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <ActiveIcon />
              <Typography variant="h6">
                Currently Active Version: {activeVersion.version}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {activeVersion.description || 'No description provided'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {activeVersion.tags.map((tag) => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  size="small" 
                  variant="outlined"
                  sx={{ color: 'inherit', borderColor: 'currentColor' }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Versions List */}
      {versions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No versions found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This shouldn't happen. There might be an issue with the prompt key.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleBack}
          >
            Back to Library
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            All Versions ({pagination?.total || versions.length})
          </Typography>
          
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
            }}
          >
            {versions.map((version) => (
              <Card 
                key={version.id}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: version.isActive ? 2 : 1,
                  borderColor: version.isActive ? 'success.main' : 'divider',
                }}
              >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {version.isActive ? (
                        <ActiveIcon color="success" />
                      ) : (
                        <InactiveIcon color="disabled" />
                      )}
                      <Typography variant="h6" component="h3">
                        v{version.version}
                      </Typography>
                      {version.isActive && (
                        <Chip 
                          label="Active" 
                          color="success" 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Model: {version.modelName}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Created: {new Date(version.dateCreation).toLocaleDateString()}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      By: {version.createdBy}
                    </Typography>

                    {version.description && (
                      <>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {version.description}
                        </Typography>
                      </>
                    )}

                    {version.tags.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                        {version.tags.slice(0, 3).map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                        {version.tags.length > 3 && (
                          <Chip 
                            label={`+${version.tags.length - 3} more`} 
                            size="small" 
                            variant="outlined"
                            color="primary"
                          />
                        )}
                      </Box>
                    )}
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewPrompt(version)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditPrompt(version)}
                    >
                      Edit
                    </Button>
                    {!version.isActive && (
                      <Button
                        size="small"
                        startIcon={<ActivateIcon />}
                        onClick={() => handleActivatePrompt(version)}
                        color="primary"
                        variant="outlined"
                      >
                        Activate
                      </Button>
                    )}
                  </CardActions>
                </Card>
            ))}
          </Box>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Typography sx={{ mx: 2, alignSelf: 'center' }}>
                Page {page} of {pagination.totalPages}
              </Typography>
              <Button
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </Box>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default PromptFamilyPage;
