import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import Header from './components/Header';
import './styles/App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks
      ? JSON.parse(savedTasks).map(task => ({
          ...task,
          priority: task.priority || 'Media',
          dueDate: task.dueDate || ''
        }))
      : [];
  });

  // Nuevo estado para el filtro actual, por defecto 'all'
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text, priority, dueDate) => {
    const newId = Date.now() + Math.random();
    const newTask = {
      id: newId,
      text: text,
      completed: false,
      priority: priority,
      dueDate: dueDate,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const toggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Función para filtrar las tareas según el estado `filter`
  const getFilteredTasks = () => {
    switch (filter) {
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'all':
      default:
        return tasks;
    }
  };

  const editTask = (id, newText) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };


  // Obtenemos las tareas filtradas antes de ordenar y mapear
  const filteredTasks = getFilteredTasks();

  return (
    <>
      <Header />
      <div className="app-container">
        <h1>Mi Lista de Tareas</h1>
        <TaskForm onAddTask={addTask} />

        {/* Controles de filtro */}
        <div className="filter-controls">
          <button
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button
            className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pendientes
          </button>
          <button
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completadas
          </button>
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? ( // Usamos filteredTasks aquí
            <p className="no-tasks">¡No hay tareas en esta vista!</p>
          ) : (
            <ul>
              {filteredTasks // Usamos filteredTasks aquí
                .sort((a, b) => {
                  if (a.completed !== b.completed) {
                    return a.completed - b.completed;
                  }
                  if (a.dueDate && b.dueDate) {
                    return new Date(a.dueDate) - new Date(b.dueDate);
                  }
                  if (a.dueDate) return -1;
                  if (b.dueDate) return 1;
                  const priorityOrder = { 'Alta': 3, 'Media': 2, 'Baja': 1 };
                  return priorityOrder[b.priority] - priorityOrder[a.priority];
                })
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleComplete}
                    onDeleteTask={deleteTask}
                    onEditTask={editTask} // Añade la función de edición
                  />
                ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default App;