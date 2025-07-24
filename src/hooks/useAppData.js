import { useState, useEffect, useCallback } from 'react';

// ID especial para la Bandeja de Entrada (Inbox)
const INBOX_PROJECT_ID = 'inbox'; // Usamos un string para diferenciarlo de IDs numéricos de proyectos

// Función para obtener los datos iniciales (tareas y proyectos)
const getInitialData = async () => {
  const savedTasks = localStorage.getItem('tasks');
  const savedProjects = localStorage.getItem('projects');

  let initialTasks = [];
  let initialProjects = [];

  // Intenta cargar desde localStorage primero
  if (savedTasks) {
    try {
      initialTasks = JSON.parse(savedTasks).map(task => ({
        ...task,
        priority: task.priority || 'Media',
        dueDate: task.dueDate || '',
        projectId: task.projectId === undefined ? null : task.projectId // Asegura projectId
      }));
    } catch (e) {
      console.error("Error parsing saved tasks from localStorage", e);
      initialTasks = [];
    }
  }

  if (savedProjects) {
    try {
      initialProjects = JSON.parse(savedProjects);
    } catch (e) {
      console.error("Error parsing saved projects from localStorage", e);
      initialProjects = [];
    }
  }

  // Si localStorage está vacío o hay un error, carga desde los JSON simulados
  if (initialTasks.length === 0 || initialProjects.length === 0) {
    console.log("No tasks or projects in localStorage, fetching from simulated API...");
    try {
      // Simular latencia de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      const tasksResponse = await fetch('/tasks.json');
      const projectsResponse = await fetch('/projects.json');

      if (!tasksResponse.ok) throw new Error(`HTTP error! status: ${tasksResponse.status} for tasks`);
      if (!projectsResponse.ok) throw new Error(`HTTP error! status: ${projectsResponse.status} for projects`);

      const tasksData = await tasksResponse.json();
      const projectsData = await projectsResponse.json();

      initialTasks = tasksData.map(task => ({
        ...task,
        priority: task.priority || 'Media',
        dueDate: task.dueDate || '',
        projectId: task.projectId === undefined ? null : task.projectId
      }));
      initialProjects = projectsData;

      console.log("Data loaded from simulated API:", { initialTasks, initialProjects });

    } catch (error) {
      console.error("Error fetching initial data:", error);
      return { tasks: [], projects: [], error: error.message }; // Retorna error para que el hook lo maneje
    }
  }

  return { tasks: initialTasks, projects: initialProjects, error: null };
};


function useAppData() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(INBOX_PROJECT_ID); // Estado para el proyecto activo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar tareas y proyectos al inicio
  useEffect(() => {
    const loadData = async () => {
      try {
        const { tasks, projects, error } = await getInitialData();
        if (error) {
          setError(new Error(error));
        } else {
          setTasks(tasks);
          setProjects(projects);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); // Se ejecuta solo una vez al montar


  // Guardar tareas en localStorage cada vez que `tasks` cambie
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  // Guardar proyectos en localStorage cada vez que `projects` cambie
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects, loading]);

  // --- Funciones de Gestión de Tareas ---

  const addTask = useCallback((text, priority, dueDate, projectId = null) => {
    const newId = Date.now() + Math.random();
    const newTask = {
      id: newId,
      text: text,
      completed: false,
      priority: priority,
      dueDate: dueDate,
      projectId: projectId, // Incluye el projectId
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }, []); // Dependency array for useCallback

  const toggleComplete = useCallback((id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  const editTask = useCallback((id, newText, newPriority, newDueDate, newProjectId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              text: newText !== undefined ? newText : task.text,
              priority: newPriority !== undefined ? newPriority : task.priority,
              dueDate: newDueDate !== undefined ? newDueDate : task.dueDate,
              projectId: newProjectId !== undefined ? newProjectId : task.projectId,
            }
          : task
      )
    );
  }, []);

  // --- Funciones de Gestión de Proyectos ---

  const addProject = useCallback((name, color = '#cccccc') => {
    const newId = Date.now(); // Simple ID para proyectos
    const newProject = { id: newId, name, color };
    setProjects((prevProjects) => [...prevProjects, newProject]);
    return newProject; // Devuelve el nuevo proyecto por si se necesita
  }, []);

  const deleteProject = useCallback((projectId) => {
    // Eliminar el proyecto y reasignar las tareas a la Bandeja de Entrada
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.projectId === projectId ? { ...task, projectId: null } : task
      )
    );
    // Si el proyecto activo es el eliminado, cambiar a la Bandeja de Entrada
    if (activeProjectId === projectId) {
      setActiveProjectId(INBOX_PROJECT_ID);
    }
  }, [activeProjectId]);

  // --- Funciones de Filtrado/Selección ---

  const selectProject = useCallback((projectId) => {
    setActiveProjectId(projectId);
  }, []);

  // Retornar todos los estados y funciones que los componentes necesitarán
  return {
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
    deleteProject,
    selectProject,
    INBOX_PROJECT_ID, // Exportar el ID de la bandeja de entrada para usarlo en otros componentes
  };
}

export default useAppData;