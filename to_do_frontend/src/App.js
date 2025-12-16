import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  apiBaseUrl,
} from "./api/client";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";

// PUBLIC_INTERFACE
function App() {
  /** Root To‑Do app component: holds task state, handles CRUD, theme, and layout. */
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Load tasks on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    getTasks()
      .then((data) => {
        if (mounted) setTasks(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (mounted) setError(`Could not load tasks from ${apiBaseUrl()}`);
        // Keep empty list when backend is down
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle light/dark theme */
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const total = tasks.length;
  const completed = useMemo(
    () => tasks.filter((t) => !!t.completed).length,
    [tasks]
  );

  // Handlers
  const handleAdd = async (title) => {
    try {
      setError("");
      const created = await createTask({ title });
      setTasks((prev) => [...prev, created]);
    } catch (e) {
      setError("Failed to add task");
    }
  };

  const handleToggle = async (id, nextCompleted) => {
    try {
      setError("");
      const updated = await updateTask(id, { completed: nextCompleted });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setError("Failed to update task");
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      setError("");
      const updated = await updateTask(id, payload);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setError("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError("Failed to delete task");
    }
  };

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

      <Header total={total} completed={completed} />

      <main className="container">
        <div className="surface">
          {error && (
            <div className="alert error" role="alert">
              {error}
            </div>
          )}
          <TaskInput onAdd={handleAdd} />
          {loading ? <p>Loading…</p> : null}
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </div>
        <footer className="footer">
          <small className="muted">API: {apiBaseUrl()}</small>
        </footer>
      </main>
    </div>
  );
}

export default App;
