import React from 'react';

function Project({ project, onSelect }) {
  return (
    <div className="project" onClick={onSelect}>
      <h3>{project.name}</h3>
    </div>
  );
}

export default Project;