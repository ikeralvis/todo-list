import React, { useState } from 'react'; // Importa useState
import './TaskItem.css';

function TaskItem({ task, onToggleComplete, onDeleteTask, onEditTask }) { // Añade onEditTask
  // Nuevo estado para el modo de edición
  const [isEditing, setIsEditing] = useState(false);
  // Nuevo estado para el texto editado
  const [editedText, setEditedText] = useState(task.text);

  const handleToggle = () => {
    onToggleComplete(task.id);
  };

  const handleDelete = () => {
    onDeleteTask(task.id);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Alta':
        return 'priority-high';
      case 'Media':
        return 'priority-medium';
      case 'Baja':
        return 'priority-low';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Manejador para iniciar la edición (doble click)
  const handleDoubleClick = () => {
    if (!task.completed) { // Solo permitir edición si la tarea no está completada
      setIsEditing(true);
    }
  };

  // Manejador para guardar los cambios al presionar Enter o perder el foco
  const handleEditSubmit = () => {
    if (editedText.trim() === '') {
      // Si el texto está vacío, podrías eliminar la tarea o revertir al texto original
      onDeleteTask(task.id); // Opción: eliminar si queda vacío
      // setEditedText(task.text); // O revertir
    } else if (editedText !== task.text) { // Solo actualizar si el texto ha cambiado
      onEditTask(task.id, editedText); // Llama a la función del padre
    }
    setIsEditing(false); // Sale del modo de edición
  };

  // Manejador para capturar la tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    }
  };

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''} ${getPriorityClass(task.priority)}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="task-checkbox"
        />
        {isEditing && !task.completed ? ( // Si está editando y no completada, muestra input
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleEditSubmit} // Guarda cuando el input pierde el foco
            onKeyDown={handleKeyDown} // Guarda al presionar Enter
            className="edit-task-input"
            autoFocus // Enfoca automáticamente el input al entrar en modo edición
          />
        ) : (
          // Si no está editando, muestra el span con el texto
          <span className="task-text" onDoubleClick={handleDoubleClick}>
            {task.text}
          </span>
        )}
      </div>
      <div className="task-meta">
        {task.priority && (
          <span className={`task-priority ${getPriorityClass(task.priority)}`}>
            {task.priority}
          </span>
        )}
        {task.dueDate && (
          <span className="task-due-date">
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
      <button onClick={handleDelete} className="delete-button">
        Eliminar
      </button>
    </li>
  );
}

export default TaskItem;