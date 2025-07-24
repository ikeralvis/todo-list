import React, { useState } from 'react';
import './TaskForm.css';

function TaskForm({ onAddTask }) {
  const [taskText, setTaskText] = useState('');
  const [priority, setPriority] = useState('Media');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (taskText.trim() === '') {
      return;
    }

    onAddTask(taskText, priority, dueDate);

    setTaskText('');
    setPriority('Media');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="task-input-group">
        <input
          type="text"
          placeholder="Añade una nueva tarea..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          className="task-input"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="task-input task-select" 
        >
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="task-input due-date-input" 
          title="Fecha de vencimiento"
        />
      </div>
      <button type="submit" className="add-task-button"> 
        Añadir Tarea
      </button>
    </form>
  );
}

export default TaskForm;