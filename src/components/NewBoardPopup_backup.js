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
  Box
} from '@mui/material';
import MemberSelection from './MemberSelection';
import { dummyMembers } from '../initialData';

function NewBoardPopup({ open, onClose, projects, onAddBoard, currentUser }) {
  const [boardName, setBoardName] = useState('');
  const [projectOption, setProjectOption] = useState('existing');
  const [selectedProject, setSelectedProject] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);

  useEffect(() => {
    if (projectOption === 'existing' && selectedProject) {
      const project = projects.find(p => p.id === selectedProject);
      setAvailableMembers(project ? project.members : []);
    } else {
      setAvailableMembers(dummyMembers.filter(member => member.email !== 'superadmin@example.com'));
    }
  }, [projectOption, selectedProject, projects]);

  const handleSubmit = () => {
    const boardMembers = [...selectedMembers, dummyMembers.find(m => m.email === 'superadmin@example.com')];
    if (projectOption === 'existing' && selectedProject && boardName) {
      onAddBoard(selectedProject, boardName, boardMembers);
    } else if (projectOption === 'new' && newProjectName && boardName) {
      onAddBoard(null, boardName, boardMembers, newProjectName);
    }
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setBoardName('');
    setProjectOption('existing');
    setSelectedProject('');
    setNewProjectName('');
    setSelectedMembers([]);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Board</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Board Name"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Project Option</InputLabel>
            <Select
              value={projectOption}
              onChange={(e) => setProjectOption(e.target.value)}
            >
              <MenuItem value="existing">Existing Project</MenuItem>
              <MenuItem value="new">New Project</MenuItem>
            </Select>
          </FormControl>
          {projectOption === 'existing' ? (
            <FormControl fullWidth>
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
            />
          )}
          <MemberSelection
            availableMembers={availableMembers}
            selectedMembers={selectedMembers}
            onChange={setSelectedMembers}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Board
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewBoardPopup;