import React, { useState } from 'react';
import './TaskItem.css';

function TaskItem({ task, onToggleComplete, onDeleteTask, onEditTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    if (editedText.trim() === '') {
      alert('La descripción de la tarea no puede estar vacía.');
      setEditedText(task.text); // Vuelve al texto original
      setIsEditing(false);
      return;
    }
    // Llama a la función onEditTask del padre (App.jsx)
    // Pasamos todos los valores, incluso si no han cambiado, para simplificar.
    // onEditTask(id, newText, newPriority, newDueDate, newProjectId)
    onEditTask(task.id, editedText, editedPriority, editedDueDate, task.projectId); // Mantener el mismo projectId
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedText(task.text); // Vuelve al texto original si cancela
      setEditedPriority(task.priority); // Vuelve a la prioridad original
      setEditedDueDate(task.dueDate); // Vuelve a la fecha original
    }
  };

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="task-checkbox"
        />
        {isEditing ? (
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleEditSubmit} // Guarda al perder el foco
            onKeyDown={handleKeyDown}
            className="edit-task-input"
            autoFocus
          />
        ) : (
          <span className="task-text" onDoubleClick={handleDoubleClick}>
            {task.text}
          </span>
        )}
      </div>

      <div className="task-meta">
        {isEditing ? (
          <>
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={handleKeyDown}
              className="edit-task-select" // Nueva clase para el select de edición
            >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
            <input
              type="date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={handleKeyDown}
              className="edit-task-date-input" // Nueva clase para el input de fecha de edición
            />
          </>
        ) : (
          <>
            {task.priority && (
              <span className={`task-priority priority-${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            )}
            {task.dueDate && (
              <span className="task-due-date">
                {task.dueDate}
              </span>
            )}
          </>
        )}
      </div>

      <button onClick={() => onDeleteTask(task.id)} className="delete-button">
        Eliminar
      </button>
    </li>
  );
}

export default TaskItem;