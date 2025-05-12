import React, { useState, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DragDropContext } from 'react-beautiful-dnd';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Board from './components/Board';
import Login from './components/Login';
import { DataProvider, useData } from './contexts/DataContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#182600',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.8rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <DataProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </DataProvider>
  );
}

function AppContent() {
  const { 
    currentUser,
    login,
    logout,
    getUserProjects,
    getUserBoards,
    getUserColumns,
    getUserTasks,
    addProject, 
    updateProject, 
    deleteProject, 
    addBoard, 
    updateBoard, 
    deleteBoard,
    addColumn,
    updateColumn,
    deleteColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    members,
    labels
  } = useData();

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  const userProjects = getUserProjects();
  const userBoards = getUserBoards();
  const userColumns = getUserColumns();
  const userTasks = getUserTasks();

  const selectedProject = userProjects.find(p => p.id === selectedProjectId);
  const selectedBoard = userBoards.find(b => b.id === selectedBoardId);

  const selectProject = useCallback((projectId) => {
    setSelectedProjectId(projectId);
    setSelectedBoardId(null);
  }, []);

  const selectBoard = useCallback((boardId) => {
    const board = userBoards.find(b => b.id === boardId);
    if (board) {
      setSelectedProjectId(board.projectId);
      setSelectedBoardId(boardId);
    }
  }, [userBoards]);

  const handleSaveBoard = useCallback((updatedBoard) => {
    updateBoard(updatedBoard.id, updatedBoard);
  }, [updateBoard]);

  const onDragEnd = useCallback((result) => {
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

    if (type === 'COLUMN') {
      // Handle column reordering here if needed
      return;
    }

    moveTask(draggableId, source.droppableId, destination.droppableId, destination.index);
  }, [moveTask]);

  const handleAddBoard = useCallback(async (projectId, boardName, boardMembers, newProjectName = null) => {
    try {
      let targetProjectId = projectId;
  
      if (newProjectName) {
        const newProject = {
          name: newProjectName,
          members: boardMembers,
        };
        const addedProject = await addProject(newProject);
        targetProjectId = addedProject.id;
      }
  
      const newBoard = {
        name: boardName,
        projectId: targetProjectId,
        members: boardMembers,
      };
      const addedBoard = await addBoard(targetProjectId, newBoard);
  
      const defaultColumns = [
        { title: 'To Do', boardId: addedBoard.id },
        { title: 'In Progress', boardId: addedBoard.id },
        { title: 'Done', boardId: addedBoard.id }
      ];
  
      for (const column of defaultColumns) {
        await addColumn(addedBoard.id, column);
      }
  
      selectBoard(addedBoard.id);
    } catch (error) {
      console.error('Error creating new board:', error);
    }
  }, [addProject, addBoard, addColumn, selectBoard]);

  const handleUpdateBoardName = useCallback((boardId, newName) => {
    updateBoard(boardId, { name: newName });
  }, [updateBoard]);

  const handleDeleteProject = useCallback((projectId) => {
    deleteProject(projectId);
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
      setSelectedBoardId(null);
    }
  }, [deleteProject, selectedProjectId]);

  const handleDeleteBoard = useCallback((boardId) => {
    deleteBoard(boardId);
    if (selectedBoardId === boardId) {
      setSelectedBoardId(null);
    }
  }, [deleteBoard, selectedBoardId]);

  const handleAddColumn = useCallback((boardId, newColumn) => {
    addColumn(boardId, newColumn);
  }, [addColumn]);

  const handleUpdateColumn = useCallback((columnId, updatedData) => {
    updateColumn(columnId, updatedData);
  }, [updateColumn]);

  const handleDeleteColumn = useCallback((columnId) => {
    deleteColumn(columnId);
  }, [deleteColumn]);

  const handleLogin = useCallback((loggedInUser) => {
    login(loggedInUser);
    setSelectedProjectId(null);
    setSelectedBoardId(null);
  }, [login]);

  const handleLogout = useCallback(() => {
    logout();
    setSelectedProjectId(null);
    setSelectedBoardId(null);
  }, [logout]);

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header 
        selectedBoard={selectedBoard}
        projects={userProjects}
        onAddBoard={handleAddBoard}
        onLogout={handleLogout}
        user={currentUser}
        onUpdateBoardName={handleUpdateBoardName}
      />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar
          projects={userProjects}
          boards={userBoards}
          selectProject={selectProject}
          selectBoard={selectBoard}
          selectedProject={selectedProject}
          selectedBoard={selectedBoard}
          onDeleteProject={handleDeleteProject}
          onDeleteBoard={handleDeleteBoard}
          onLogout={handleLogout}
        />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            display: 'flex',
            flexDirection: 'column',
            backgroundImage: 'url(https://teamlist.team/images/innerbg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundBlendMode: 'overlay',
            overflowY: 'auto',
            p: 2,
          }}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            {selectedBoard ? (
              <Board 
                key={`${selectedBoard.id}-${Date.now()}`} 
                board={selectedBoard} 
                columns={userColumns.filter(c => c.boardId === selectedBoard.id)}
                tasks={userTasks.filter(t => t.boardId === selectedBoard.id)}
                onSaveBoard={handleSaveBoard}
                boardMembers={members.filter(m => selectedBoard.members.includes(m.id))}
                availableLabels={labels}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onAddColumn={handleAddColumn}
                onUpdateColumn={handleUpdateColumn}
                onDeleteColumn={handleDeleteColumn}
              />
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%' 
                }}
              >
                <Typography variant="h6" align="center" sx={{ color: 'text.secondary' }}>
                  Please select a project board to use Teamlist
                </Typography>
              </Box>
            )}
          </DragDropContext>
        </Box>
      </Box>
    </Box>
  );
}

export default App;