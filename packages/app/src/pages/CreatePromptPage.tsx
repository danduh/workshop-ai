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
  Divider,
  Autocomplete,
} from '@mui/material';
import {
  Save as SaveIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/common';
import { useCreatePrompt } from '../hooks/usePrompts';
import { PromptService } from '../services/promptService';
import { CreatePromptDto } from '../types/api';

interface FormErrors {
  promptKey?: string;
  modelName?: string;
  content?: string;
  description?: string;
  createdBy?: string;
  version?: string;
  tags?: string;
}

type FormValues = CreatePromptDto;

const CreatePromptPage: React.FC = () => {
  const navigate = useNavigate();
  const [previewMode, setPreviewMode] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const createPromptMutation = useCreatePrompt();

  const [formValues, setFormValues] = useState<FormValues>({
    promptKey: '',
    version: '1.0.0',
    modelName: 'GPT-4o',
    content: '',
    description: '',
    tags: [],
    createdBy: '',
    isActive: false,
  });

  // Available options
  const modelOptions = PromptService.getModelNames();
  const commonTags = [
    'support', 'customer-service', 'sales', 'marketing', 'development',
    'testing', 'documentation', 'training', 'analysis', 'creative',
  ];

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.promptKey) {
      newErrors.promptKey = 'Prompt key is required';
    } else if (formValues.promptKey.length < 3) {
      newErrors.promptKey = 'Prompt key must be at least 3 characters';
    } else if (formValues.promptKey.length > 100) {
      newErrors.promptKey = 'Prompt key must not exceed 100 characters';
    } else if (!/^[A-Z0-9_]+$/.test(formValues.promptKey)) {
      newErrors.promptKey = 'Prompt key must contain only uppercase letters, numbers, and underscores';
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

    if (formValues.version && formValues.version.length > 50) {
      newErrors.version = 'Version must not exceed 50 characters';
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
      if (formValues.promptKey || formValues.content) {
        localStorage.setItem('prompt-draft', JSON.stringify(formValues));
      }
    }, 2000);

    setAutoSaveTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [formValues, autoSaveTimer]);

  // Load draft on component mount
  useEffect(() => {
    const draft = localStorage.getItem('prompt-draft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        setFormValues(draftData);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await createPromptMutation.mutateAsync(formValues);
      localStorage.removeItem('prompt-draft'); // Clear draft on success
      navigate(`/prompts/${result.data.promptKey}`);
    } catch (error) {
      console.error('Failed to create prompt:', error);
    }
  };

  const handleCancel = () => {
    // Clear draft
    localStorage.removeItem('prompt-draft');
    navigate('/');
  };

  const handleTagsChange = (_: React.SyntheticEvent, value: string[]) => {
    handleFieldChange('tags', value);
  };

  const isSubmitting = createPromptMutation.isPending;
  const contentWordCount = formValues.content.split(/\s+/).filter((word: string) => word.length > 0).length;
  const contentCharCount = formValues.content.length;
  const isFormValid = Object.keys(errors).length === 0 && formValues.promptKey && formValues.content && formValues.createdBy && formValues.modelName;

  const breadcrumbs = [
    { label: 'Prompt Library', path: '/' },
    { label: 'Create Prompt', current: true },
  ];

  return (
    <PageWrapper
      title="Create New Prompt"
      subtitle="Create a new AI prompt for your library"
      breadcrumbs={breadcrumbs}
    >
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Prompt Key *"
              name="promptKey"
              value={formValues.promptKey}
              onChange={(e) => handleFieldChange('promptKey', e.target.value)}
              error={Boolean(errors.promptKey)}
              helperText={
                errors.promptKey || 'Unique identifier (e.g., CUSTOMER_SUPPORT_AGENT)'
              }
              placeholder="CUSTOMER_SUPPORT_AGENT"
            />

            <TextField
              fullWidth
              label="Version"
              name="version"
              value={formValues.version}
              onChange={(e) => handleFieldChange('version', e.target.value)}
              error={Boolean(errors.version)}
              helperText={errors.version}
              placeholder="1.0.0"
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth error={Boolean(errors.modelName)}>
              <InputLabel>Model *</InputLabel>
              <Select
                label="Model *"
                name="modelName"
                value={formValues.modelName}
                onChange={(e) => handleFieldChange('modelName', e.target.value)}
              >
                {modelOptions.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Created By *"
              name="createdBy"
              type="email"
              value={formValues.createdBy}
              onChange={(e) => handleFieldChange('createdBy', e.target.value)}
              error={Boolean(errors.createdBy)}
              helperText={errors.createdBy}
              placeholder="your.email@company.com"
            />
          </Box>
        </Paper>

        {/* Content */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Prompt Content
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PreviewIcon />}
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
          </Box>

          {previewMode ? (
            <Box
              sx={{
                backgroundColor: 'grey.50',
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200',
                minHeight: 200,
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              <Typography variant="body2" component="pre">
                {formValues.content || 'No content to preview...'}
              </Typography>
            </Box>
          ) : (
            <TextField
              fullWidth
              multiline
              rows={12}
              label="Prompt Content *"
              name="content"
              value={formValues.content}
              onChange={(e) => handleFieldChange('content', e.target.value)}
              error={Boolean(errors.content)}
              helperText={errors.content}
              placeholder="You are a helpful AI assistant that..."
              sx={{
                '& .MuiInputBase-input': {
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                },
              }}
            />
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Words: {contentWordCount} | Characters: {contentCharCount} / 50,000
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Auto-saved as draft
            </Typography>
          </Box>
        </Paper>

        {/* Additional Details */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Additional Details
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            name="description"
            value={formValues.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            error={Boolean(errors.description)}
            helperText={errors.description}
            placeholder="Brief description of what this prompt does..."
            sx={{ mb: 2 }}
          />

          <Autocomplete
            multiple
            options={commonTags}
            freeSolo
            value={formValues.tags || []}
            onChange={handleTagsChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Add tags..."
                helperText="Press Enter to add custom tags"
                error={Boolean(errors.tags)}
              />
            )}
          />

          <Divider sx={{ my: 2 }} />

          <FormControlLabel
            control={
              <Switch
                checked={formValues.isActive}
                onChange={(e) => handleFieldChange('isActive', e.target.checked)}
              />
            }
            label="Set as active version"
          />
        </Paper>

        {/* Form Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? 'Creating...' : 'Create Prompt'}
          </Button>
        </Box>

        {/* Error Display */}
        {createPromptMutation.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {(createPromptMutation.error as Error & { response?: { data?: { message?: string } } })
              ?.response?.data?.message || 'Failed to create prompt. Please try again.'}
          </Alert>
        )}
      </form>
    </PageWrapper>
  );
};

export default CreatePromptPage;
