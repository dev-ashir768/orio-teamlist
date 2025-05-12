import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import { Add as AddIcon } from '@mui/icons-material';

function Column({ column, onTaskClick, onAddCard, onDeleteCard, onDeleteColumn, onEditColumnName }) {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        width: 280,
        mr: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {column.title}
      </Typography>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              minHeight: 100,
              flexGrow: 1,
              overflowY: 'auto',
              backgroundColor: snapshot.isDraggingOver ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
            }}
          >
            {column.tasks.map((task, index) => (
              <Task 
                key={task.id} 
                task={task} 
                index={index}
                onTaskClick={onTaskClick}
                onDeleteTask={() => onDeleteCard(task.id)}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      <Button 
        fullWidth 
        variant="text" 
        startIcon={<AddIcon />} 
        onClick={onAddCard}
        sx={{ mt: 2 }}
      >
        Add Task
      </Button>
    </Paper>
  );
}

export default Column;