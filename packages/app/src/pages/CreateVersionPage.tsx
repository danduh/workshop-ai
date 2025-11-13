import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Preview as PreviewIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { PageWrapper } from '../components/common';
import { usePrompt, useCreateVersion } from '../hooks/usePrompts';
import { PromptService } from '../services/promptService';
import { CreateVersionDto, ModelName } from '../types/api';

interface FormErrors {
  modelName?: string;
  content?: string;
  description?: string;
  createdBy?: string;
  version?: string;
  tags?: string;
}

type FormValues = CreateVersionDto;

const CreateVersionPage: React.FC = () => {
  const navigate = useNavigate();
  const { promptKey } = useParams<{ promptKey: string }>();
  const [previewMode, setPreviewMode] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const activePromptQuery = usePrompt(promptKey || '', !!promptKey);
  const createVersionMutation = useCreateVersion();

  const [formValues, setFormValues] = useState<FormValues>({
    version: '',
    modelName: 'GPT-4o',
    content: '',
    description: '',
    tags: [],
    createdBy: '',
    isActive: false,
  });

  // Load active prompt data when query succeeds (for cloning)
  useEffect(() => {
    if (activePromptQuery.data?.data) {
      const prompt = activePromptQuery.data.data;
      // Generate next version number
      const currentVersion = prompt.version;
      const nextVersion = generateNextVersion(currentVersion);
      
      setFormValues({
        version: nextVersion,
        modelName: prompt.modelName as ModelName,
        content: prompt.content,
        description: prompt.description || '',
        tags: prompt.tags || [],
        createdBy: prompt.createdBy,
        isActive: false, // New versions start inactive
      });
    }
  }, [activePromptQuery.data]);

  // Simple version increment logic
  const generateNextVersion = (currentVersion: string): string => {
    const parts = currentVersion.split('.');
    if (parts.length === 3) {
      const major = parseInt(parts[0]);
      const minor = parseInt(parts[1]);
      const patch = parseInt(parts[2]);
      return `${major}.${minor}.${patch + 1}`;
    }
    // Fallback
    return `${currentVersion}.1`;
  };

  // Available options
  const modelOptions = PromptService.getModelNames();
  const commonTags = [
    'support', 'customer-service', 'sales', 'marketing', 'development',
    'testing', 'documentation', 'training', 'analysis', 'creative',
  ];

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.version) {
      newErrors.version = 'Version is required';
    } else if (formValues.version.length > 50) {
      newErrors.version = 'Version must not exceed 50 characters';
    }

    if (!formValues.modelName) {
      newErrors.modelName = 'Model is required';
    }

    if (!formValues.content) {
      newErrors.content = 'Content is required';
    } else if (formValues.content.length > 50000) {
      newErrors.content = 'Content must not exceed 50,000 characters';
    }

    if (formValues.description && formValues.description.length > 1000) {
      newErrors.description = 'Description must not exceed 1,000 characters';
    }

    if (!formValues.createdBy) {
      newErrors.createdBy = 'Creator email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.createdBy)) {
      newErrors.createdBy = 'Please enter a valid email address';
    } else if (formValues.createdBy.length > 255) {
      newErrors.createdBy = 'Email must not exceed 255 characters';
    }

    if (formValues.tags && formValues.tags.length > 20) {
      newErrors.tags = 'Maximum 20 tags allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof FormValues, value: string | string[] | boolean) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Auto-save draft functionality
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      // Save to localStorage as draft
      if (formValues.version || formValues.content) {
        const draftKey = `prompt-version-draft-${promptKey}`;
        localStorage.setItem(draftKey, JSON.stringify(formValues));
      }
    }, 2000);

    setAutoSaveTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [formValues, autoSaveTimer, promptKey]);

  // Load draft on component mount
  useEffect(() => {
    if (promptKey) {
      const draftKey = `prompt-version-draft-${promptKey}`;
      const draft = localStorage.getItem(draftKey);
      if (draft && !activePromptQuery.data) { // Only load draft if we don't have server data yet
        try {
          const draftData = JSON.parse(draft);
          setFormValues(draftData);
        } catch (error) {
          console.error('Failed to load draft:', error);
        }
      }
    }
  }, [promptKey, activePromptQuery.data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !promptKey) {
      return;
    }

    try {
      const result = await createVersionMutation.mutateAsync({
        promptKey,
        data: formValues,
      });
      
      // Clear draft on success
      const draftKey = `prompt-version-draft-${promptKey}`;
      localStorage.removeItem(draftKey);
      
      navigate(`/prompts/${promptKey}/version/${result.data.version}`);
    } catch (error) {
      console.error('Failed to create version:', error);
    }
  };

  const handleCancel = () => {
    // Clear draft
    const draftKey = `prompt-version-draft-${promptKey}`;
    localStorage.removeItem(draftKey);
    navigate(`/prompts/${promptKey}`);
  };

  const handleTagsChange = (_: React.SyntheticEvent, value: string[]) => {
    handleFieldChange('tags', value);
  };

  const handleCopyFromActive = () => {
    if (activePromptQuery.data?.data) {
      const prompt = activePromptQuery.data.data;
      setFormValues(prev => ({
        ...prev,
        content: prompt.content,
        modelName: prompt.modelName as ModelName,
        description: prompt.description || '',
        tags: prompt.tags || [],
      }));
    }
  };

  // Loading state
  if (activePromptQuery.isLoading) {
    return (
      <PageWrapper>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={48} />
        </Box>
      </PageWrapper>
    );
  }

  // Error state
  if (activePromptQuery.error) {
    return (
      <PageWrapper>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load active prompt. Please try again.
        </Alert>
      </PageWrapper>
    );
  }

  const isSubmitting = createVersionMutation.isPending;
  const contentWordCount = formValues.content.split(/\s+/).filter((word: string) => word.length > 0).length;
  const contentCharCount = formValues.content.length;
  const isFormValid = Object.keys(errors).length === 0 && formValues.version && formValues.content && formValues.createdBy && formValues.modelName;

  const breadcrumbs = [
    { label: 'Prompt Library', path: '/' },
    { label: promptKey || 'Prompt', path: `/prompts/${promptKey}` },
    { label: 'Create Version', current: true },
  ];

  return (
    <PageWrapper 
      title="Create New Version"
      subtitle={`Creating a new version for ${promptKey}`}
      breadcrumbs={breadcrumbs}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto' }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Creating a new version based on the current active version ({activePromptQuery.data?.data.version}).
            You can modify any fields below.
          </Typography>
        </Alert>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Basic Information
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CopyIcon />}
              onClick={handleCopyFromActive}
            >
              Copy from Active
            </Button>
          </Box>
          
          {/* Read-only Prompt Key */}
          <TextField
            fullWidth
            label="Prompt Key"
            value={promptKey}
            disabled
            sx={{ mb: 2 }}
            helperText="This version will be created for the existing prompt"
          />

          {/* Version */}
          <TextField
            fullWidth
            label="Version"
            value={formValues.version}
            onChange={(e) => handleFieldChange('version', e.target.value)}
            error={!!errors.version}
            helperText={errors.version || "Version number for this new version (e.g., 1.0.1, 2.0.0)"}
            sx={{ mb: 2 }}
            placeholder="1.0.1"
          />

          {/* Model Name */}
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.modelName}>
            <InputLabel>Model</InputLabel>
            <Select
              value={formValues.modelName}
              label="Model"
              onChange={(e) => handleFieldChange('modelName', e.target.value)}
            >
              {modelOptions.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
            {errors.modelName && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                {errors.modelName}
              </Typography>
            )}
          </FormControl>

          {/* Creator Email */}
          <TextField
            fullWidth
            label="Creator Email"
            type="email"
            value={formValues.createdBy}
            onChange={(e) => handleFieldChange('createdBy', e.target.value)}
            error={!!errors.createdBy}
            helperText={errors.createdBy || "Email of the person creating this version"}
            sx={{ mb: 2 }}
          />
        </Paper>

        {/* Content Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Content
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={previewMode}
                  onChange={(e) => setPreviewMode(e.target.checked)}
                  icon={<PreviewIcon />}
                  checkedIcon={<PreviewIcon />}
                />
              }
              label="Preview Mode"
            />
          </Box>

          {previewMode ? (
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                mb: 2, 
                minHeight: 200,
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                bgcolor: 'grey.50'
              }}
            >
              {formValues.content || 'No content to preview'}
            </Paper>
          ) : (
            <TextField
              fullWidth
              multiline
              rows={12}
              label="Prompt Content"
              placeholder="Enter your prompt content here..."
              value={formValues.content}
              onChange={(e) => handleFieldChange('content', e.target.value)}
              error={!!errors.content}
              helperText={
                errors.content || 
                `${contentCharCount} characters, ${contentWordCount} words`
              }
              sx={{ mb: 2 }}
            />
          )}
        </Paper>

        {/* Additional Information */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Additional Information
          </Typography>

          {/* Description */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description (Optional)"
            placeholder="Brief description of what changed in this version..."
            value={formValues.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description || "Optional description of changes or improvements in this version"}
            sx={{ mb: 2 }}
          />

          {/* Tags */}
          <Autocomplete
            multiple
            options={commonTags}
            freeSolo
            value={formValues.tags || []}
            onChange={handleTagsChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Add tags..."
                error={!!errors.tags}
                helperText={errors.tags || "Tags to help categorize and find this prompt"}
              />
            )}
            sx={{ mb: 2 }}
          />

          {/* Active Status */}
          <FormControlLabel
            control={
              <Switch
                checked={formValues.isActive}
                onChange={(e) => handleFieldChange('isActive', e.target.checked)}
              />
            }
            label="Set as Active Version"
            sx={{ mt: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            If checked, this version will become the active version immediately upon creation
          </Typography>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!isFormValid || isSubmitting}
            sx={{ minWidth: 120 }}
          >
            {isSubmitting ? <CircularProgress size={20} /> : 'Create Version'}
          </Button>
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default CreateVersionPage;
