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
  Typography
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

  const superadmin = members.find(m => m.email === 'superadmin@example.com');

  useEffect(() => {
    if (projectOption === 'existing' && selectedProject) {
      const project = projects.find(p => p.id === selectedProject);
      if (project) {
        const projectMembers = project.members
          .map(memberId => members.find(m => m.id === memberId))
          .filter(member => member && member.email !== 'superadmin@example.com');
        setAvailableMembers(projectMembers);
      } else {
        setAvailableMembers([]);
      }
    } else {
      setAvailableMembers(members.filter(member => member.email !== 'superadmin@example.com'));
    }
  }, [projectOption, selectedProject, projects, members]);

  const handleSubmit = async () => {
    setError('');
    const boardMembers = [...selectedMembers.map(m => m.id), superadmin.id];
  
    // Form validation
    if (!boardName.trim()) {
      setError('Board name is required');
      return;
    }
    if (projectOption === 'existing' && !selectedProject) {
      setError('Please select a project');
      return;
    }
    if (projectOption === 'new' && !newProjectName.trim()) {
      setError('New project name is required');
      return;
    }

    try {
      if (projectOption === 'existing' && selectedProject) {
        await onAddBoard(selectedProject, boardName, boardMembers);
      } else if (projectOption === 'new' && newProjectName) {
        await onAddBoard(null, boardName, boardMembers, newProjectName);
      }
    } catch (error) {
      console.error('Error creating new board or project:', error);
      setError('Failed to create board. Please try again.');
    } finally {
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setBoardName('');
    setProjectOption('existing');
    setSelectedProject('');
    setNewProjectName('');
    setSelectedMembers([]);
    setError('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{pt: "18px", pb: "0px"}}>Add New Board</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Board Name"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            fullWidth
            required
          />
          <FormControl fullWidth required>
            {/* <InputLabel>Project Option</InputLabel> */}
            <Select
              value={projectOption}
              onChange={(e) => setProjectOption(e.target.value)}
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
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              label="New Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              fullWidth
              required
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
      <DialogActions sx={{p: "24px"}}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Board
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewBoardPopup;