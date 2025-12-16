import React, { useState } from "react";

// PUBLIC_INTERFACE
export default function TaskInput({ onAdd }) {
  /** Input row for creating a new task. */
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = title.trim();
    if (!value) return;
    onAdd(value);
    setTitle("");
  };

  return (
    <form className="task-input" onSubmit={handleSubmit}>
      <input
        aria-label="Task title"
        className="input"
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn" type="submit">
        Add
      </button>
    </form>
  );
}
