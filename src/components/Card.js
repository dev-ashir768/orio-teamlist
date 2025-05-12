import React, { forwardRef } from 'react';
import { Card as MuiCard, CardContent, Typography, IconButton, Box, Avatar, Chip, AvatarGroup } from '@mui/material';
import { Delete as DeleteIcon, Visibility as VisibilityIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';
import { useData } from '../contexts/DataContext';

const Card = forwardRef(({ task, index, onTaskClick, onDeleteCard, isDragging, ...props }, ref) => {
  const { labels, members } = useData();

  console.log('Card props:', props);
  console.log('Task:', task);
  console.log('Is dragging:', isDragging);

  if (!task) {
    console.error('Card component received undefined task');
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getLabel = (labelId) => {
    const label = labels.find(label => label.id === labelId) || {};
    console.log(`Getting label for ID ${labelId}:`, label);
    return label;
  };

  const getMember = (memberId) => {
    const member = members.find(member => member.id === memberId) || {};
    console.log(`Getting member for ID ${memberId}:`, member);
    return member;
  };

  return (
    <MuiCard
      ref={ref}
      {...props}
      onClick={() => console.log('Card clicked')}
      sx={{ 
        mb: 2, 
        '&:hover': { boxShadow: 3 }, 
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column',
        opacity: isDragging ? 0.6 : 1,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        transition: 'opacity 0.2s, transform 0.2s',
        background:"#f5f5f5"
      }}
    >
      <div {...props.dragHandleProps}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {task.content}
            </Typography>
            <Box>
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`View details clicked for task:`, task);
                  onTaskClick(task);
                }}
                title="View Details"
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Delete clicked for task:`, task);
                  onDeleteCard(task.id);
                }}
                title="Delete Task"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          {task.labels && task.labels.length > 0 && (
            <Box mb={1} display="flex" flexWrap="wrap" gap={0.5}>
              {task.labels.map((labelId) => {
                const label = getLabel(labelId);
                return (
                  <Chip
                    key={labelId}
                    label={label.name}
                    size="small"
                    sx={{
                      backgroundColor: label.color,
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                    }}
                  />
                );
              })}
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" alignItems="center">
            {task.dueDate && (
              <Box display="flex" alignItems="center">
                <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(task.dueDate)}
                </Typography>
              </Box>
            )}

            {task.members && task.members.length > 0 && (
              <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.8rem' } }}>
                {task.members.map((memberId) => {
                  const member = getMember(memberId);
                  return (
                    <Avatar 
                      key={memberId} 
                      alt={member.name} 
                      src={member.imageUrl}
                      title={member.name}
                    />
                  );
                })}
              </AvatarGroup>
            )}
          </Box>
        </CardContent>
      </div>
    </MuiCard>
  );
});

export default Card;