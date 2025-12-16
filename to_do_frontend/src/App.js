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
import Sidebar from "./components/Sidebar";

// Debounce hook to avoid excessive re-renders on search input
function useDebounced(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// PUBLIC_INTERFACE
function App() {
  /** Root To‑Do app component: holds task state, handles CRUD, theme, and layout. */
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  // UI state: sidebar and filters
  const [sidebarOpen, setSidebarOpen] = useState(false); // for small screens
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // for desktop
  const [filter, setFilter] = useState("all");

  // Search state
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 200);

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
      .catch(() => {
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

  // Filtering logic: by sidebar selection first, then by search
  const filteredByStatus = useMemo(() => {
    if (filter === "completed") return tasks.filter((t) => !!t.completed);
    if (filter === "active") return tasks.filter((t) => !t.completed);
    return tasks;
  }, [tasks, filter]);

  const finalTasks = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return filteredByStatus;
    return filteredByStatus.filter((t) => (t.title || "").toLowerCase().includes(q));
  }, [filteredByStatus, debouncedSearch]);

  // Responsive: show hamburger in header on small screens (via prop)
  const handleSidebarToggle = () => setSidebarOpen((s) => !s);
  const handleCollapseToggle = () => setSidebarCollapsed((c) => !c);
  const handleSelectFilter = (key) => {
    setFilter(key === "about" ? "all" : key);
    setSidebarOpen(false);
  };

  return (
    <div className={`App ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        isOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onToggleOpen={handleSidebarToggle}
        onCollapseToggle={handleCollapseToggle}
        onSelectFilter={handleSelectFilter}
        activeFilter={filter}
      />

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

      <Header total={total} completed={completed} onSidebarToggle={handleSidebarToggle} />

      <main className="main">
        <div className="container">
          <div className="surface">
            {error && (
              <div className="alert error" role="alert">
                {error}
              </div>
            )}

            {/* Search bar */}
            <div className="search-row">
              <input
                aria-label="Search tasks"
                className="search-input"
                type="search"
                placeholder="Search tasks by title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <TaskInput onAdd={handleAdd} />
            {loading ? <p>Loading…</p> : null}
            <TaskList
              tasks={finalTasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </div>
          <footer className="footer">
            <small className="muted">API: {apiBaseUrl()}</small>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
