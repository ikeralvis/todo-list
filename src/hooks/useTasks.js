import { useState, useEffect } from 'react';

// Función para obtener las tareas de localStorage (si existen)
// Opcionalmente, podemos cargar desde una API si localStorage está vacío
const getInitialTasks = async () => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    // Asegurarse de que las tareas cargadas tengan las propiedades por defecto si no las tenían
    return JSON.parse(savedTasks).map(task => ({
      ...task,
      priority: task.priority || 'Media',
      dueDate: task.dueDate || ''
    }));
  } else {
    // Si no hay tareas en localStorage, simular una carga desde API
    console.log("No tasks in localStorage, fetching from simulated API...");
    try {
      // Simular una latencia de red de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await fetch('/tasks.json'); // Ruta a tu JSON simulado
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Tasks loaded from simulated API:", data);
      // Asegurarse de que las tareas de la API tengan las propiedades por defecto
      return data.map(task => ({
        ...task,
        priority: task.priority || 'Media',
        dueDate: task.dueDate || ''
      }));
    } catch (error) {
      console.error("Error fetching initial tasks:", error);
      return []; // Retorna un array vacío en caso de error
    }
  }
};


function useTasks() {
  // Usamos un estado que se inicializa con una función asíncrona (más complejo)
  // O podemos inicializarlo a [] y luego cargar las tareas en un useEffect
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // Nuevo estado para indicar si estamos cargando
  const [error, setError] = useState(null); // Nuevo estado para errores

  // useEffect para cargar las tareas al inicio
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const initialTasks = await getInitialTasks();
        setTasks(initialTasks);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []); // Array de dependencias vacío para que se ejecute solo una vez al montar

  // useEffect para guardar las tareas en localStorage cada vez que `tasks` cambie
  useEffect(() => {
    if (!loading) { // Solo guardar si ya hemos terminado de cargar las tareas iniciales
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, loading]); // Depende de tasks y loading

  // Funciones de gestión de tareas
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

  const editTask = (id, newText) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  // Devolvemos el estado de las tareas y todas las funciones
  return {
    tasks,
    loading,
    error,
    addTask,
    toggleComplete,
    deleteTask,
    editTask,
  };
}

export default useTasks;