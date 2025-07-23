import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import Header from './components/Header';
import useTasks from './hooks/useTasks';
import './styles/App.css';

function App() {
  const { tasks, loading, error, addTask, toggleComplete, deleteTask, editTask } = useTasks();

  const [filter, setFilter] = useState('all');

  // Calcula el número de tareas pendientes
  const pendingTasksCount = tasks.filter(task => !task.completed).length;

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

  const filteredTasks = getFilteredTasks();

  if (loading) {
    return (
      <>
        <Header />
        <div className="app-container">
          <p className="loading-message">Cargando tareas...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="app-container">
          <p className="error-message">
            Error al cargar las tareas: {error.message}. Por favor, verifica la consola para más detalles.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="app-container">
        <div className="main-title-container"> {/* Nuevo contenedor para el título y el contador */}
          <h1>Mi Lista de Tareas</h1>
          {/* Mostramos el contador solo si hay tareas pendientes */}
          {pendingTasksCount > 0 && (
            <span className="pending-tasks-count">
              {pendingTasksCount} pendientes
            </span>
          )}
        </div>
        <TaskForm onAddTask={addTask} />

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
          {filteredTasks.length === 0 ? (
            <p className="no-tasks">¡No hay tareas en esta vista!</p>
          ) : (
            <ul>
              {filteredTasks
                .sort((a, b) => {
                  if (a.completed !== b.completed) {
                    return a.completed - b.completed;
                  }
                  if (a.dueDate && b.dueDate) {
                    return new Date(a.dueDate) - new Date(b.dueDate);
                  }
                  if (a.dueDate) return 1;
                  if (b.dueDate) return -1;
                  const priorityOrder = { 'Alta': 3, 'Media': 2, 'Baja': 1 };
                  return priorityOrder[b.priority] - priorityOrder[a.priority];
                })
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleComplete}
                    onDeleteTask={deleteTask}
                    onEditTask={editTask}
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