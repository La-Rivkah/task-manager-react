import { useEffect, useState } from "react";

import Header from "./componentes/Header";
import TaskList from "./componentes/TaskList";
import TaskInput from "./componentes/TaskInput";
import Footer from "./componentes/Footer";
import EmptyState from "./componentes/EmptyState";

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const API = "http://localhost:3000";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //Obtener tareas
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/tasks`);
      const data = await res.json();

      setTasks(data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  //Crear tarea
  const addTask = async (text: string) => {
    try {
      await fetch(`${API}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      fetchTasks();
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  //Eliminar tarea
  const deleteTask = async (id: number) => {
    try {
      await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
      });

      fetchTasks();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  //Cambiar estado
  const toggleTask = async (task: Task) => {
    try {
      await fetch(`${API}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      fetchTasks();
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div className="app-container">
      <Header />

      <TaskInput addTask={addTask} />

      {/*Loading state */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <TaskList
          tasks={tasks}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
        />
      )}

      <Footer total={tasks.length} completed={completedTasks} />
    </div>
  );
}

export default App;