import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import Column from "./Column";
import TaskPopup from "./TaskPopup";
import { Add as AddIcon } from "@mui/icons-material";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useData } from "../contexts/DataContext";

const Board = React.memo(
  ({
    board,
    columns,
    tasks,
    onSaveBoard,
    boardMembers,
    availableLabels,
    onAddTask,
    onUpdateTask,
    onDeleteTask,
    onAddColumn,
    onUpdateColumn,
    onDeleteColumn,
  }) => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState("");
    const { moveTask, reorderColumns, reorderTasksInColumn } = useData();

    useEffect(() => {
      console.log("Board rendered with:", { board, columns, tasks });
    }, [board, columns, tasks]);

    const sortedColumns = useMemo(() => {
      return [...columns].sort((a, b) => a.order - b.order);
    }, [columns]);

    const handleTaskClick = useCallback((task) => {
      setSelectedTask(task);
    }, []);

    const handleClosePopup = useCallback(() => {
      setSelectedTask(null);
    }, []);

    const handleSaveTask = useCallback(
      (updatedTask) => {
        onUpdateTask(updatedTask.id, updatedTask);
        setSelectedTask(null);
      },
      [onUpdateTask]
    );

    const handleAddColumn = useCallback(() => {
      setIsAddColumnDialogOpen(true);
    }, []);

    const handleAddColumnSubmit = useCallback(() => {
      if (newColumnTitle.trim()) {
        const newColumn = {
          title: newColumnTitle.trim(),
          boardId: board.id,
          taskIds: [],
          order: sortedColumns.length,
        };
        onAddColumn(board.id, newColumn);
        setNewColumnTitle("");
        setIsAddColumnDialogOpen(false);
      }
    }, [board.id, newColumnTitle, onAddColumn, sortedColumns.length]);

    const handleAddCard = useCallback(
      (columnId) => {
        const newTask = {
          id: `task-${Date.now()}`,
          content: "New Task",
          boardId: board.id,
          columnId: columnId,
          members: [],
          labels: [],
          dueDate: null,
          checklist: [],
        };
        onAddTask(columnId, newTask);
      },
      [board.id, onAddTask]
    );

    const handleDeleteCard = useCallback(
      (columnId, taskId) => {
        onDeleteTask(taskId);
      },
      [onDeleteTask]
    );

    const handleDeleteColumn = useCallback(
      (columnId) => {
        onDeleteColumn(columnId);
      },
      [onDeleteColumn]
    );

    const handleEditColumnName = useCallback(
      (columnId, newName) => {
        onUpdateColumn(columnId, { title: newName });
      },
      [onUpdateColumn]
    );

    const onDragEnd = useCallback(
      (result) => {
        const { source, destination, draggableId, type } = result;

        if (!destination) {
          return;
        }

        if (
          source.droppableId === destination.droppableId &&
          source.index === destination.index
        ) {
          return;
        }

        if (type === "COLUMN") {
          const newColumnOrder = Array.from(sortedColumns);
          const [reorderedColumn] = newColumnOrder.splice(source.index, 1);
          newColumnOrder.splice(destination.index, 0, reorderedColumn);
          const newOrder = newColumnOrder.map((column, index) => ({
            id: column.id,
            order: index,
          }));
          reorderColumns(board.id, newOrder);
          return;
        }

        if (source.droppableId === destination.droppableId) {
          // Task reordered within the same column
          const column = columns.find((col) => col.id === source.droppableId);
          const newTaskIds = Array.from(column.taskIds);
          newTaskIds.splice(source.index, 1);
          newTaskIds.splice(destination.index, 0, draggableId);
          reorderTasksInColumn(column.id, newTaskIds);
        } else {
          // Task moved to a different column
          moveTask(
            draggableId,
            source.droppableId,
            destination.droppableId,
            destination.index
          );
        }
      },
      [
        moveTask,
        reorderColumns,
        reorderTasksInColumn,
        board.id,
        sortedColumns,
        columns,
      ]
    );


    const memoizedColumns = useMemo(
      () =>
        sortedColumns.map((column, index) => {
          const columnTasks = tasks.filter(
            (task) => task.columnId === column.id
          );
          return (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasks}
              boardId={board.id}
              onTaskClick={handleTaskClick}
              onAddCard={() => handleAddCard(column.id)}
              onDeleteCard={(taskId) => handleDeleteCard(column.id, taskId)}
              onDeleteColumn={() => handleDeleteColumn(column.id)}
              onEditColumnName={handleEditColumnName}
              index={index}
            />
          );
        }),
      [
        sortedColumns,
        tasks,
        board.id,
        handleTaskClick,
        handleAddCard,
        handleDeleteCard,
        handleDeleteColumn,
        handleEditColumnName,
      ]
    );

    if (!board || columns.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={board.id} type="COLUMN" direction="horizontal">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                flexGrow: 1,
                p: 3,
                overflowX: "auto",
                display: "flex",
                gap: 3,
              }}
            >
              {memoizedColumns}
              {provided.placeholder}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddColumn}
                sx={{ minWidth: 200, height: "fit-content" }}
              >
                Add Column
              </Button>
            </Box>
          )}
        </Droppable>
        {selectedTask && (
          <TaskPopup
            open={!!selectedTask}
            onClose={handleClosePopup}
            task={selectedTask}
            onSave={handleSaveTask}
            boardMembers={boardMembers}
            availableLabels={availableLabels}
          />
        )}
        <Dialog
          open={isAddColumnDialogOpen}
          onClose={() => setIsAddColumnDialogOpen(false)}
        >
          <DialogTitle>Add New Column</DialogTitle>
          <DialogContent>
            <Box width={400}>
              <TextField
                autoFocus
                margin="dense"
                label="Column Title"
                type="text"
                fullWidth
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddColumnDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddColumnSubmit}>Add</Button>
          </DialogActions>
        </Dialog>
      </DragDropContext>
    );
  }
);

export default Board;
