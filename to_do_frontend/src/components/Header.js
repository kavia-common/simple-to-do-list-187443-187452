import React from "react";

// PUBLIC_INTERFACE
export default function Header({ total, completed, onSidebarToggle }) {
  /** Header component showing title and task counters. */
  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="brand">
          <span className="brand-accent">To‑Do</span> List
        </h1>

        <div className="stats" aria-label="task-counters">
          <span className="badge total" title="Total tasks">
            Total: {total}
          </span>
          <span className="badge completed" title="Completed tasks">
            Done: {completed}
          </span>
        </div>

        {/* Off-canvas sidebar toggle */}
        <button
          className="btn small"
          style={{ marginLeft: 12 }}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
          onClick={onSidebarToggle}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
