import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ projects, activeProjectId, selectProject, addProject, INBOX_PROJECT_ID }) {
  const [newProjectName, setNewProjectName] = useState('');
  const [showAddProjectInput, setShowAddProjectInput] = useState(false);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      setNewProjectName('');
      setShowAddProjectInput(false); // Opcional: ocultar después de añadir
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h2 className="sidebar-title">Vistas</h2>
        <ul>
          <li
            className={`sidebar-item ${activeProjectId === INBOX_PROJECT_ID ? 'active' : ''}`}
            onClick={() => selectProject(INBOX_PROJECT_ID)}
          >
            <i className="icon inbox-icon">📥</i>
            <span className="item-text">Bandeja de Entrada</span>
          </li>
        </ul>
      </div>

      <div className="sidebar-section projects-section">
        <h2 className="sidebar-title">Proyectos</h2>
        <ul>
          {projects.map(project => (
            <li
              key={project.id}
              className={`sidebar-item ${activeProjectId === project.id ? 'active' : ''}`}
              onClick={() => selectProject(project.id)}
            >
              <span className="project-color-dot" style={{ backgroundColor: project.color }}></span>
              <span className="item-text">{project.name}</span>
              {/* Aquí podríamos añadir un botón para editar/eliminar proyecto más adelante */}
            </li>
          ))}
        </ul>

        <div className="add-project-area">
          {!showAddProjectInput ? (
            <button
              className="add-project-button"
              onClick={() => setShowAddProjectInput(true)}
            >
              + Añadir Proyecto
            </button>
          ) : (
            <form onSubmit={handleAddProject} className="add-project-form">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Nombre del proyecto"
                className="add-project-input"
                autoFocus
              />
              <div className="add-project-actions">
                <button type="submit" className="add-project-confirm-button">Añadir</button>
                <button type="button" className="add-project-cancel-button" onClick={() => setShowAddProjectInput(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;