import React, { useState } from 'react';
import Project from './Project';

function ProjectList({ projects, addProject, selectProject }) {
  const [newProjectName, setNewProjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      setNewProjectName('');
    }
  };

  return (
    <div className="project-list">
      <h2>Projects</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New project name"
        />
        <button type="submit">Add Project</button>
      </form>
      {projects.map(project => (
        <Project 
          key={project.id} 
          project={project} 
          onSelect={() => selectProject(project.id)}
        />
      ))}
    </div>
  );
}

export default ProjectList;