import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import Header from './components/Header';
import useAppData from './hooks/useAppData'; // Importamos useAppData
import Sidebar from './components/Sidebar'; // Importamos el Sidebar
import './styles/App.css'; // Estilos globales y de layout

function App() {
  const {
    tasks,
    projects,
    activeProjectId,
    loading,
    error,
    addTask,
    toggleComplete,
    deleteTask,
    editTask,
    addProject,
    selectProject,
    INBOX_PROJECT_ID,
  } = useAppData();

  const [filter, setFilter] = useState('all');

  // Filtrar tareas por el proyecto activo antes de aplicar el filtro de estado
  const getTasksForActiveProject = () => {
    if (activeProjectId === INBOX_PROJECT_ID) {
      return tasks.filter(task => task.projectId === null || task.projectId === undefined);
    }
    return tasks.filter(task => task.projectId === activeProjectId);
  };

  const tasksForActiveProject = getTasksForActiveProject();
  const pendingTasksCount = tasksForActiveProject.filter(task => !task.completed).length;


  const getFilteredTasks = () => {
    switch (filter) {
      case 'pending':
        return tasksForActiveProject.filter(task => !task.completed);
      case 'completed':
        return tasksForActiveProject.filter(task => task.completed);
      case 'all':
      default:
        return tasksForActiveProject;
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <>
      <Header /> {/* El Header siempre se renderiza */}
      <div className="main-layout">
        {/* El Sidebar siempre se renderiza */}
        <Sidebar
          projects={projects}
          activeProjectId={activeProjectId}
          selectProject={selectProject}
          addProject={addProject}
          INBOX_PROJECT_ID={INBOX_PROJECT_ID}
        />

        <div className="main-content-area">
          {loading ? (
            <p className="loading-message">Cargando tareas y proyectos...</p>
          ) : error ? (
            <p className="error-message">
              Error al cargar los datos: {error.message}. Por favor, verifica la consola para más detalles.
            </p>
          ) : (
            // Contenido principal de la aplicación cuando no hay carga ni error
            <>
              <div className="task-list-container">
                <div className="main-title-container">
                  {/* Mostrar el nombre del proyecto activo */}
                  <h1>
                    {activeProjectId === INBOX_PROJECT_ID
                      ? 'Bandeja de Entrada'
                      : projects.find(p => p.id === activeProjectId)?.name || 'Proyecto Desconocido'}
                  </h1>
                  {pendingTasksCount > 0 && (
                    <span className="pending-tasks-count">
                      {pendingTasksCount} pendientes
                    </span>
                  )}
                </div>

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
                    <p className="no-tasks">
                      {activeProjectId === INBOX_PROJECT_ID ?
                        '¡No hay tareas en la Bandeja de Entrada!' :
                        `¡No hay tareas en este proyecto (${
                          projects.find(p => p.id === activeProjectId)?.name || 'Desconocido'
                        })!`
                      }
                    </p>
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
              {/* El formulario flotante al final del main-content-area */}
              <div className="task-form-wrapper">
                {/* Pasar el activeProjectId al TaskForm para que las nuevas tareas se asignen al proyecto actual */}
                <TaskForm onAddTask={addTask} activeProjectId={activeProjectId} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;