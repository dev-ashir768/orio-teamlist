import React, { useState, useCallback, useEffect } from "react";
import { Paper, Typography, Box, IconButton, TextField } from "@mui/material";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Card from "./Card";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useData } from "../contexts/DataContext";

const Column = React.memo(
  ({
    column,
    tasks,
    boardId,
    onTaskClick,
    onDeleteCard,
    onDeleteColumn,
    onEditColumnName,
  }) => {
    const { addTask } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(column.title);

    useEffect(() => {
      console.log(`Column ${column.id} rendering:`);
      console.log(`- taskIds:`, column.taskIds);
      console.log(
        `- tasks:`,
        tasks.map((t) => ({
          id: t.id,
          content: t.content,
          columnId: t.columnId,
        }))
      );
      console.log(`- Mismatch between taskIds and tasks:`, {
        tasksNotInTaskIds: tasks
          .filter((t) => !column.taskIds.includes(t.id))
          .map((t) => t.id),
        taskIdsNotInTasks: column.taskIds.filter(
          (id) => !tasks.find((t) => t.id === id)
        ),
      });
    }, [column, tasks]);

    const handleEditClick = useCallback(() => {
      setIsEditing(true);
    }, []);

    const handleSaveClick = useCallback(() => {
      if (editedName.trim() !== "") {
        console.log(
          `Saving new name for column ${column.id}:`,
          editedName.trim()
        );
        onEditColumnName(column.id, editedName.trim());
        setIsEditing(false);
      }
    }, [column.id, editedName, onEditColumnName]);

    const handleNameChange = useCallback((event) => {
      setEditedName(event.target.value);
    }, []);

    const handleAddCard = useCallback(() => {
      console.log(`Adding new card to column ${column.id}`);
      const newTask = {
        content: "New Task",
        description: "",  
        boardId: boardId,
        columnId: column.id,
        members: [],
        labels: [],
        dueDate: null,
        checklist: [],
      };
      addTask(column.id, newTask);
    }, [column.id, boardId, addTask]);

    const handleDeleteColumn = useCallback(() => {
      console.log(`Deleting column ${column.id}`);
      onDeleteColumn(column.id);
    }, [column.id, onDeleteColumn]);

    return (
      <Paper
        elevation={2}
        sx={{
          p: 2,
          minWidth: 280,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          maxHeight: "100%",
          borderRadius: 2,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          {isEditing ? (
            <Box display="flex" alignItems="center" width="100%">
              <TextField
                value={editedName}
                onChange={handleNameChange}
                variant="standard"
                fullWidth
                autoFocus
                onBlur={handleSaveClick}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSaveClick();
                  }
                }}
              />
              <IconButton onClick={handleSaveClick} size="small">
                <SaveIcon style={{ width: "18px", height: "18px" }} />
              </IconButton>
            </Box>
          ) : (
            <>
              <Typography variant="h6">{column.title}</Typography>
              <Box>
                <IconButton
                  onClick={handleAddCard}
                  size="small"
                  title="Add Card"
                >
                  <AddIcon style={{ width: "18px", height: "18px" }} />
                </IconButton>
                <IconButton
                  onClick={handleEditClick}
                  size="small"
                  title="Edit Column"
                >
                  <EditIcon style={{ width: "18px", height: "18px" }} />
                </IconButton>
                <IconButton
                  onClick={handleDeleteColumn}
                  size="small"
                  title="Delete Column"
                >
                  <DeleteIcon style={{ width: "18px", height: "18px" }} />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ flexGrow: 1, overflowY: "auto" }}
            >
              {column.taskIds.map((taskId, index) => {
                const task = tasks.find((t) => t.id === taskId);
                if (!task) return null;
                return (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        task={task}
                        index={index}
                        onTaskClick={onTaskClick}
                        onDeleteCard={() => onDeleteCard(task.id)}
                        isDragging={snapshot.isDragging}
                      />
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Paper>
    );
  }
);

export default Column;
