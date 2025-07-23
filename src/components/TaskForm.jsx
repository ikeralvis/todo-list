import './TaskForm.css';
import { useState } from "react";

function TaskForm({ onAddTask }) {
    const [taskText, setTaskText] = useState("");

    const [priority, setPriority] = useState("Media");

    const [dueDate, setDueDate] = useState('');

    //Maneja el cambio en el campo de texto
    const handleSubmit = (e) => {
        e.preventDefault();

        //Evita que se envíe el formulario si el campo de texto está vacío
        if (taskText.trim() === "") {
            return;
        }

        //Llama a la función onAddTask con el texto de la tarea
        onAddTask(taskText, priority, dueDate);

        //Limpia el campo de texto
        setTaskText("");

        setPriority("Media"); // Resetea la prioridad a "Media" después de añadir la tarea
        setDueDate(''); // Resetea la fecha de vencimiento
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input
                type="text"
                placeholder="Añadir nueva tarea"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)} // Actualiza el estado con el valor del campo de texto
                className="task-input"
            />
            <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="priority-select"
            >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
            </select>
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="due-date-input"
                title="Fecha de vencimiento" // Un tooltip útil
            />
            <button type="submit" className='add-button'>Añadir tarea</button>
        </form>
    );
}

export default TaskForm;