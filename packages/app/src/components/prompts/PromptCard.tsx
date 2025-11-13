import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  History as VersionIcon,
  PlayArrow as ActivateIcon,
} from '@mui/icons-material';
import { PromptResponseDto } from '../../types/api';

interface PromptCardProps {
  prompt: PromptResponseDto;
  onEdit?: (prompt: PromptResponseDto) => void;
  onCopy?: (prompt: PromptResponseDto) => void;
  onViewVersions?: (prompt: PromptResponseDto) => void;
  onActivate?: (prompt: PromptResponseDto) => void;
  onView?: (prompt: PromptResponseDto) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onEdit,
  onCopy,
  onViewVersions,
  onActivate,
  onView,
}) => {
  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      if (onCopy) {
        onCopy(prompt);
      }
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(/[@.]/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: onView ? 'pointer' : 'default',
        transition: 'elevation 0.2s ease-in-out',
        '&:hover': {
          elevation: onView ? 4 : 1,
        },
      }}
      onClick={onView ? () => onView(prompt) : undefined}
    >
      {/* Active indicator */}
      {prompt.isActive && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: 'success.main',
            zIndex: 1,
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 600,
                lineHeight: 1.2,
                mb: 0.5,
                wordBreak: 'break-word',
              }}
            >
              {prompt.promptKey}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                v{prompt.version}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                •
              </Typography>
              <Chip
                label={prompt.modelName}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>

        {/* Description */}
        {prompt.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {prompt.description}
          </Typography>
        )}

        {/* Content Preview */}
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            bgcolor: 'grey.50',
            p: 1,
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.75rem',
          }}
        >
          {prompt.content}
        </Typography>

        {/* Tags */}
        {prompt.tags && prompt.tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {prompt.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
            {prompt.tags.length > 3 && (
              <Typography variant="caption" color="text.secondary">
                +{prompt.tags.length - 3} more
              </Typography>
            )}
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
            {getInitials(prompt.createdBy)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {prompt.createdBy}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {formatDate(prompt.dateCreation)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
        <Box>
          {onView && (
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onView(prompt);
              }}
            >
              View
            </Button>
          )}
        </Box>

        <Box>
          <Tooltip title="Copy content">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleCopyContent();
              }}
            >
              <CopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {onViewVersions && (
            <Tooltip title="View versions">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewVersions(prompt);
                }}
              >
                <VersionIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {onEdit && (
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(prompt);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {onActivate && !prompt.isActive && (
            <Tooltip title="Activate version">
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onActivate(prompt);
                }}
              >
                <ActivateIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};
