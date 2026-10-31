import { useEffect, useState } from "react";
import { api } from "../api";

export default function TaskApp({ onSessionExpired }) {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [tab, setTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadTodos() {
      try {
        const data = await api("/todos");
        if (isActive) setTodos(data);
      } catch (err) {
        console.error("Failed to load todos:", err);
        if (err.status === 401) {
          if (isActive) onSessionExpired?.(); // login expired, so show the form
          return;
        }
        if (isActive) {
          setError("Could not load tasks. Check that the backend is running and try again.");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadTodos();
    return () => {
      isActive = false;
    };
  }, [onSessionExpired]);

  async function addTask(event) {
    event.preventDefault();
    const taskText = newTask.trim();
    if (!taskText) return;

    setError("");
    try {
      const createdTodo = await api("/todos", {
        method: "POST",
        body: { title: taskText },
      });
      setTodos((currentTodos) => [createdTodo, ...currentTodos]);
      setNewTask("");
    } catch (err) {
      console.error("Failed to add task:", err);
      if (err.status === 401) return onSessionExpired?.();
      setError("Could not add the task. Please try again.");
    }
  }

  const toggleTodo = async (todo) => {
    setError("");
    try {
      const updated = await api(`/todos/${todo._id}`, {
        method: "PATCH",
        body: { completed: !todo.completed },
      });
      setTodos((currentTodos) =>
        currentTodos.map((t) => (t._id === updated._id ? updated : t)),
      );
    } catch (err) {
      console.error("Failed to update todo:", err);
      if (err.status === 401) return onSessionExpired?.();
      setError("Could not update the task. Please try again.");
    }
  };

  const deleteTodo = async (id) => {
    setError("");
    try {
      await api(`/todos/${id}`, { method: "DELETE" });
      setTodos((currentTodos) => currentTodos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
      if (err.status === 401) return onSessionExpired?.();
      setError("Could not delete the task. Please try again.");
    }
  };

  const visibleTodos = todos.filter((todo) => {
    if (tab === "todo") return !todo.completed;
    if (tab === "completed") return todo.completed;
    return true;
  });

  return (
    <div>
      <form className="add-task" onSubmit={addTask}>
        <input
          type="text"
          aria-label="Task name"
          placeholder="Enter a task"
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
        />
        <button type="submit" disabled={!newTask.trim()}>
          Add task
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      <nav className="task-filters" aria-label="Filter tasks">
        {[
          ["all", "All"],
          ["todo", "To do"],
          ["completed", "Completed"],
        ].map(([name, label]) => (
          <button
            key={name}
            type="button"
            aria-pressed={tab === name}
            onClick={() => setTab(name)}
          >
            {label}
          </button>
        ))}
      </nav>

      {isLoading ? (
        <p role="status">Loading tasks...</p>
      ) : visibleTodos.length === 0 ? (
        <p>{todos.length === 0 ? "No tasks yet. Add one above." : "No tasks in this view."}</p>
      ) : (
        <ul className="task-list">
          {visibleTodos.map((todo) => (
            <li className={`task-row${todo.completed ? " completed" : ""}`} key={todo._id}>
              <input
                type="checkbox"
                aria-label={`Mark "${todo.title}" ${todo.completed ? "incomplete" : "complete"}`}
                checked={Boolean(todo.completed)}
                onChange={() => toggleTodo(todo)}
              />
              <span>{todo.title}</span>
              <button type="button" onClick={() => deleteTodo(todo._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}