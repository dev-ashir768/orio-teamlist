import React, { useState, useCallback, useRef, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DragDropContext } from 'react-beautiful-dnd';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Board from './components/Board';
import Login from './components/Login';
import { initialProjects, dummyMembers, dummyLabels } from './initialData';

// ... rest of your App.js file


const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // indigo
    },
    secondary: {
      main: '#f50057', // pink
    },
    background: {
      default: '#f5f5f5', // light grey
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
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
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
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const selectedProjectRef = useRef(null);
  const selectedBoardRef = useRef(null);
  const [user, setUser] = useState(null); 

  const updateSelectedRefs = useCallback(() => {
    selectedProjectRef.current = projects.find(p => p.id === selectedProjectId) || null;
    selectedBoardRef.current = selectedProjectRef.current
      ? selectedProjectRef.current.boards.find(b => b.id === selectedBoardId)
      : null;
  }, [projects, selectedProjectId, selectedBoardId]);

  const selectProject = useCallback((projectId) => {
    setSelectedProjectId(projectId);
    setSelectedBoardId(null);
    updateSelectedRefs();
  }, [updateSelectedRefs]);

  const selectBoard = useCallback((boardId) => {
    const project = projects.find(p => p.boards.some(b => b.id === boardId));
    if (project) {
      setSelectedProjectId(project.id);
      setSelectedBoardId(boardId);
      updateSelectedRefs();
    }
  }, [projects, updateSelectedRefs]);

  const handleSaveBoard = (updatedBoard) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => ({
        ...project,
        boards: project.boards.map(board => 
          board.id === updatedBoard.id ? updatedBoard : board
        )
      }));
    });
    updateSelectedRefs();
  };

  const onDragEnd = useCallback((result) => {
    const { source, destination, draggableId } = result;
    if (!destination) {
      return;
    }

    const [sourceBoardId, sourceColId] = source.droppableId.split(':');
    const [destBoardId, destColId] = destination.droppableId.split(':');

    setProjects(prevProjects => {
      const newProjects = JSON.parse(JSON.stringify(prevProjects));
      const project = newProjects.find(p => p.boards.some(b => b.id === sourceBoardId));
      const board = project.boards.find(b => b.id === sourceBoardId);

      const sourceColumn = board.columns.find(col => col.id === sourceColId);
      const destColumn = board.columns.find(col => col.id === destColId);

      const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
      destColumn.tasks.splice(destination.index, 0, movedTask);

      return newProjects;
    });

    updateSelectedRefs();
  }, [updateSelectedRefs]);

  updateSelectedRefs();

  const handleAddBoard = useCallback((projectId, boardName, boardMembers, newProjectName = null) => {
    setProjects(prevProjects => {
      const newProjects = JSON.parse(JSON.stringify(prevProjects));
      const superadmin = dummyMembers.find(m => m.email === 'superadmin@example.com');
      
      if (newProjectName) {
        // Create a new project with the new board
        const newProject = {
          id: `project-${Date.now()}`,
          name: newProjectName,
          members: [...boardMembers, superadmin],
          boards: [{
            id: `board-${Date.now()}`,
            name: boardName,
            members: [...boardMembers, superadmin],
            columns: [
              { id: 'todo', title: 'To Do', tasks: [] },
              { id: 'inprogress', title: 'In Progress', tasks: [] },
              { id: 'done', title: 'Done', tasks: [] },
            ]
          }]
        };
        newProjects.push(newProject);
      } else {
        // Add new board to existing project
        const project = newProjects.find(p => p.id === projectId);
        if (project) {
          project.boards.push({
            id: `board-${Date.now()}`,
            name: boardName,
            members: [...boardMembers, superadmin],
            columns: [
              { id: 'todo', title: 'To Do', tasks: [] },
              { id: 'inprogress', title: 'In Progress', tasks: [] },
              { id: 'done', title: 'Done', tasks: [] },
            ]
          });
        }
      }
      
      return newProjects;
    });
  }, []);


  const filteredProjects = useMemo(() => {
    if (!user) return [];
    if (user.email === 'superadmin@example.com') return projects;
    return projects.filter(project => 
      project.members.some(member => member.id === user.id)
    );
  }, [user, projects]);

  ////

  // Get the current board's members
  const boardMembers = useMemo(() => {
    if (selectedBoardRef.current) {
      return selectedBoardRef.current.members || [];
    }
    return [];
  }, [selectedBoardRef.current]);

  // Use dummyLabels as availableLabels, or you can define a more specific set of labels if needed
  const availableLabels = dummyLabels;


  ////

  const handleUpdateBoardName = (boardId, newName) => {
    setProjects(prevProjects => 
      prevProjects.map(project => ({
        ...project,
        boards: project.boards.map(board => 
          board.id === boardId ? { ...board, name: newName } : board
        )
      }))
    );
  };




  const handleDeleteProject = (projectId) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
      setSelectedBoardId(null);
    }
  };
  
  const handleDeleteBoard = (boardId) => {
    setProjects(prevProjects => 
      prevProjects.map(project => ({
        ...project,
        boards: project.boards.filter(board => board.id !== boardId)
      }))
    );
    if (selectedBoardId === boardId) {
      setSelectedBoardId(null);
    }
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setSelectedProjectId(null);
    setSelectedBoardId(null);
  };

  
  const handleLogout = () => {
    setUser(null);
    setSelectedProjectId(null);
    setSelectedBoardId(null);
  };

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header 
        selectedBoard={selectedBoardRef.current} 
        projects={filteredProjects}
        onAddBoard={handleAddBoard}
        onLogout={handleLogout}
        user={user}
        onUpdateBoardName={handleUpdateBoardName}
      />
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar
          projects={filteredProjects}
          selectProject={selectProject}
          selectBoard={selectBoard}
          selectedProject={selectedProjectRef.current}
          selectedBoard={selectedBoardRef.current}
          onDeleteProject={handleDeleteProject}
          onDeleteBoard={handleDeleteBoard}
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
              {selectedBoardRef.current ? (
              <Board 
                key={`${selectedBoardRef.current.id}-${Date.now()}`} 
                board={selectedBoardRef.current} 
                onSaveBoard={handleSaveBoard}
                boardMembers={boardMembers}
                availableLabels={availableLabels}
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
    </ThemeProvider>
  );
}

export default App;