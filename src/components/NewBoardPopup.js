// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Box,
//   Typography
// } from '@mui/material';
// import MemberSelection from './MemberSelection';
// import { useData } from '../contexts/DataContext';

// function NewBoardPopup({ open, onClose, projects, onAddBoard, currentUser }) {
//   const [boardName, setBoardName] = useState('');
//   const [projectOption, setProjectOption] = useState('existing');
//   const [selectedProject, setSelectedProject] = useState('');
//   const [newProjectName, setNewProjectName] = useState('');
//   const [selectedMembers, setSelectedMembers] = useState([]);
//   const [availableMembers, setAvailableMembers] = useState([]);
//   const [error, setError] = useState('');
//   const { members, addProject } = useData();

//   const superadmin = members.find(m => m.email === 'superadmin@example.com');

//   useEffect(() => {
//     if (projectOption === 'existing' && selectedProject) {
//       const project = projects.find(p => p.id === selectedProject);
//       if (project) {
//         const projectMembers = project.members
//           .map(memberId => members.find(m => m.id === memberId))
//           .filter(member => member && member.email !== 'superadmin@example.com');
//         setAvailableMembers(projectMembers);
//       } else {
//         setAvailableMembers([]);
//       }
//     } else {
//       setAvailableMembers(members.filter(member => member.email !== 'superadmin@example.com'));
//     }
//   }, [projectOption, selectedProject, projects, members]);

//   const handleSubmit = async () => {
//     setError('');
//     const boardMembers = [...selectedMembers.map(m => m.id), superadmin.id];
  
//     // Form validation
//     if (!boardName.trim()) {
//       setError('Board name is required');
//       return;
//     }
//     if (projectOption === 'existing' && !selectedProject) {
//       setError('Please select a project');
//       return;
//     }
//     if (projectOption === 'new' && !newProjectName.trim()) {
//       setError('New project name is required');
//       return;
//     }

//     try {
//       if (projectOption === 'existing' && selectedProject) {
//         await onAddBoard(selectedProject, boardName, boardMembers);
//       } else if (projectOption === 'new' && newProjectName) {
//         await onAddBoard(null, boardName, boardMembers, newProjectName);
//       }
//     } catch (error) {
//       console.error('Error creating new board or project:', error);
//       setError('Failed to create board. Please try again.');
//     } finally {
//       onClose();
//       resetForm();
//     }
//   };

//   const resetForm = () => {
//     setBoardName('');
//     setProjectOption('existing');
//     setSelectedProject('');
//     setNewProjectName('');
//     setSelectedMembers([]);
//     setError('');
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle sx={{pt: "18px", pb: "0px"}}>Add New Board</DialogTitle>
//       <DialogContent>
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
//           <TextField
//             label="Board Name"
//             value={boardName}
//             onChange={(e) => setBoardName(e.target.value)}
//             fullWidth
//             required
//           />
//           <FormControl fullWidth required>
//             {/* <InputLabel>Project Option</InputLabel> */}
//             <Select
//               value={projectOption}
//               onChange={(e) => setProjectOption(e.target.value)}
//             >
//               <MenuItem value="existing">Existing Project</MenuItem>
//               <MenuItem value="new">New Project</MenuItem>
//             </Select>
//           </FormControl>
//           {projectOption === 'existing' ? (
//             <FormControl fullWidth required>
//               <InputLabel>Select Project</InputLabel>
//               <Select
//                 value={selectedProject}
//                 onChange={(e) => setSelectedProject(e.target.value)}
//               >
//                 {projects.map((project) => (
//                   <MenuItem key={project.id} value={project.id}>
//                     {project.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           ) : (
//             <TextField
//               label="New Project Name"
//               value={newProjectName}
//               onChange={(e) => setNewProjectName(e.target.value)}
//               fullWidth
//               required
//             />
//           )}
//           <MemberSelection
//             availableMembers={availableMembers}
//             selectedMembers={selectedMembers}
//             onChange={setSelectedMembers}
//           />
//           {error && (
//             <Typography color="error" variant="body2">
//               {error}
//             </Typography>
//           )}
//         </Box>
//       </DialogContent>
//       <DialogActions sx={{p: "24px"}}>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleSubmit} variant="contained" color="primary">
//           Add Board
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default NewBoardPopup;
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Snackbar,
  Tooltip
} from '@mui/material';
import MemberSelection from './MemberSelection';
import { useData } from '../contexts/DataContext';

function NewBoardPopup({ open, onClose, projects, onAddBoard, currentUser }) {
  const [boardName, setBoardName] = useState('');
  const [projectOption, setProjectOption] = useState('existing');
  const [selectedProject, setSelectedProject] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [error, setError] = useState('');
  const { members, addProject } = useData();

  // Set default project when projects or projectOption change
  useEffect(() => {
    if (projects.length > 0 && projectOption === 'existing' && !selectedProject) {
      setSelectedProject(projects[0].id);
    } else if (projectOption === 'existing' && projects.length === 0) {
      setSelectedProject(''); // Clear if no projects
    }
  }, [projects, projectOption, selectedProject]);

  // Update available members
  useEffect(() => {
    if (projectOption === 'existing' && selectedProject) {
      const project = projects.find(p => p.id === selectedProject);
      if (project) {
        const projectMembers = project.members
          .map(memberId => members.find(m => m.id === memberId))
          .filter(member => member && member.id !== currentUser?.id);
        setAvailableMembers(projectMembers);
      } else {
        setAvailableMembers([]);
      }
    } else {
      setAvailableMembers(members.filter(member => member.id !== currentUser?.id));
    }
  }, [projectOption, selectedProject, projects, members, currentUser]);

  const handleSubmit = async () => {
    setError('');

    // Form validation
    if (!currentUser) {
      setError('User not logged in');
      return;
    }
    if (!boardName.trim()) {
      setError('Board name is required');
      return;
    }
    if (projectOption === 'existing' && !selectedProject && projects.length > 0) {
      setError('Please select a project');
      return;
    }
    if (projectOption === 'new' && !newProjectName.trim()) {
      setError('New project name is required');
      return;
    }

    // Debug: Log disabled conditions
    console.log('Form state:', {
      boardName: boardName.trim(),
      projectOption,
      selectedProject,
      newProjectName: newProjectName.trim(),
      currentUser,
      projectsLength: projects.length,
    });

    try {
      const boardMembers = [...selectedMembers.map(m => m.id), currentUser.id];

      if (projectOption === 'existing') {
        if (projects.length === 0) {
          setError('No projects available to select');
          return;
        }
        await onAddBoard(selectedProject, boardName, boardMembers);
      } else {
        const newProject = {
          name: newProjectName,
          members: boardMembers,
          boards: [],
        };
        const projectId = await addProject(newProject);
        await onAddBoard(projectId, boardName, boardMembers);
      }
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating board or project:', error);
      setError(`Failed to create board: ${error.message}`);
    }
  };

  const resetForm = () => {
    setBoardName('');
    setProjectOption('existing');
    setSelectedProject(projects.length > 0 ? projects[0].id : '');
    setNewProjectName('');
    setSelectedMembers([]);
    setError('');
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  // Determine why button is disabled
  const getDisabledTooltip = () => {
    if (!currentUser) return 'User not logged in';
    if (!boardName.trim()) return 'Board name is required';
    if (projectOption === 'existing' && !selectedProject && projects.length > 0) return 'Please select a project';
    if (projectOption === 'existing' && projects.length === 0) return 'No projects available';
    if (projectOption === 'new' && !newProjectName.trim()) return 'New project name is required';
    return '';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pt: '18px', pb: '0px' }}>Add New Board</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Board Name"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            fullWidth
            required
            error={!!error && !boardName.trim()}
            helperText={error && !boardName.trim() ? 'Board name is required' : ''}
          />
          <FormControl fullWidth required>
            <InputLabel>Project Option</InputLabel>
            <Select
              value={projectOption}
              onChange={(e) => {
                setProjectOption(e.target.value);
                setSelectedProject(projects.length > 0 ? projects[0].id : '');
              }}
              label="Project Option"
            >
              <MenuItem value="existing">Existing Project</MenuItem>
              <MenuItem value="new">New Project</MenuItem>
            </Select>
          </FormControl>
          {projectOption === 'existing' ? (
            <FormControl fullWidth required>
              <InputLabel>Select Project</InputLabel>
              <Select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                label="Select Project"
                disabled={projects.length === 0}
              >
                {projects.length === 0 ? (
                  <MenuItem value="" disabled>
                    No projects available
                  </MenuItem>
                ) : (
                  projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          ) : (
            <TextField
              label="New Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              fullWidth
              required
              error={!!error && !newProjectName.trim()}
              helperText={error && !newProjectName.trim() ? 'New project name is required' : ''}
            />
          )}
          <MemberSelection
            availableMembers={availableMembers}
            selectedMembers={selectedMembers}
            onChange={setSelectedMembers}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '24px' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Tooltip title={getDisabledTooltip()}>
          <span>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={
                !boardName.trim() ||
                (projectOption === 'existing' && !selectedProject && projects.length > 0) ||
                (projectOption === 'new' && !newProjectName.trim()) ||
                !currentUser
              }
            >
              Add Board
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#d32f2f',
          },
        }}
      />
    </Dialog>
  );
}

export default NewBoardPopup;