import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  AlertTitle,
  CircularProgress,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  History as VersionIcon,
  Add as AddIcon,
  PlayArrow as ActivateIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/common';
import { usePrompt, usePromptVersion, useActivateVersion } from '../hooks/usePrompts';

export const PromptDetailPage: React.FC = () => {
  const { promptKey, version } = useParams<{ promptKey: string; version?: string }>();
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState(false);

  // Use different hooks based on whether version is provided
  const activePromptQuery = usePrompt(promptKey || '', !!promptKey && !version);
  const versionQuery = usePromptVersion(promptKey || '', version || '', !!promptKey && !!version);
  
  // Use the appropriate query result
  const { data, isLoading, error } = version ? versionQuery : activePromptQuery;
  const activateVersionMutation = useActivateVersion();

  const prompt = data?.data;

  const handleEdit = () => {
    if (version) {
      navigate(`/prompts/${promptKey}/version/${version}/edit`);
    } else {
      navigate(`/prompts/${promptKey}/edit`);
    }
  };

  const handleCreateVersion = () => {
    navigate(`/prompts/${promptKey}/create-version`);
  };

  const handleViewVersions = () => {
    navigate(`/prompts/${promptKey}`);
  };

  const handleActivate = async () => {
    if (prompt && promptKey) {
      await activateVersionMutation.mutateAsync({
        promptKey,
        version: prompt.version,
      });
    }
  };

  const handleCopyContent = async () => {
    if (prompt?.content) {
      try {
        await navigator.clipboard.writeText(prompt.content);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy content:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <PageWrapper>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={48} />
        </Box>
      </PageWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <PageWrapper>
        <Alert severity="error">
          <AlertTitle>Error Loading Prompt</AlertTitle>
          {(error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message || 'Prompt not found or could not be loaded.'}
        </Alert>
      </PageWrapper>
    );
  }

  if (!prompt) {
    return (
      <PageWrapper>
        <Alert severity="warning">
          <AlertTitle>Prompt Not Found</AlertTitle>
          The requested prompt could not be found.
        </Alert>
      </PageWrapper>
    );
  }

  const breadcrumbs = [
    { label: 'Prompt Library', path: '/' },
    { label: prompt.promptKey, current: true },
  ];

  return (
    <PageWrapper
      title={prompt.promptKey}
      subtitle={prompt.description}
      breadcrumbs={breadcrumbs}
    >
      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`v${prompt.version}`}
            color={prompt.isActive ? 'success' : 'default'}
            variant={prompt.isActive ? 'filled' : 'outlined'}
          />
          <Chip label={prompt.modelName} color="primary" variant="outlined" />
          {prompt.isActive && (
            <Chip label="Active" color="success" size="small" />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={copySuccess ? 'Copied!' : 'Copy content'}>
            <IconButton onClick={handleCopyContent} color={copySuccess ? 'success' : 'default'}>
              <CopyIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="outlined"
            startIcon={<VersionIcon />}
            onClick={handleViewVersions}
          >
            {version ? 'Back to Family' : 'View All Versions'}
          </Button>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleCreateVersion}
          >
            New Version
          </Button>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit
          </Button>

          {!prompt.isActive && (
            <Button
              variant="contained"
              color="success"
              startIcon={<ActivateIcon />}
              onClick={handleActivate}
              disabled={activateVersionMutation.isPending}
            >
              {activateVersionMutation.isPending ? 'Activating...' : 'Activate'}
            </Button>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Prompt Content
        </Typography>
        
        <Box
          sx={{
            backgroundColor: 'grey.50',
            p: 2,
            borderRadius: 1,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Typography variant="body2" component="pre">
            {prompt.content}
          </Typography>
        </Box>

        {/* Tags */}
        {prompt.tags && prompt.tags.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {prompt.tags.map((tag) => (
                <Chip key={tag} label={tag} variant="outlined" size="small" />
              ))}
            </Box>
          </>
        )}
      </Paper>

      {/* Metadata */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Details
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Created By
            </Typography>
            <Typography variant="body1">{prompt.createdBy}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Created Date
            </Typography>
            <Typography variant="body1">{formatDate(prompt.dateCreation)}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Model
            </Typography>
            <Typography variant="body1">{prompt.modelName}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <Typography variant="body1">
              {prompt.isActive ? 'Active' : 'Inactive'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Version
            </Typography>
            <Typography variant="body1">{prompt.version}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Prompt ID
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {prompt.id}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </PageWrapper>
  );
};

export default PromptDetailPage;
