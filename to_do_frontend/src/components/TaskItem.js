import React, { useState } from "react";

// PUBLIC_INTERFACE
export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  /** Renders a single task row with complete, edit, and delete actions. */
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const handleSave = () => {
    const next = draft.trim();
    if (!next || next === task.title) {
      setIsEditing(false);
      setDraft(task.title);
      return;
    }
    onUpdate(task.id, { title: next });
    setIsEditing(false);
  };

  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={!!task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
          aria-label={`Mark ${task.title} ${task.completed ? "incomplete" : "complete"}`}
        />
        <span className="checkmark" />
      </label>

      {isEditing ? (
        <input
          className="task-title edit"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setIsEditing(false);
              setDraft(task.title);
            }
          }}
          autoFocus
        />
      ) : (
        <span className="task-title" onDoubleClick={() => setIsEditing(true)}>
          {task.title}
        </span>
      )}

      <div className="actions">
        {isEditing ? (
          <button className="btn small" onClick={handleSave} aria-label="Save task">
            Save
          </button>
        ) : (
          <button
            className="btn secondary small"
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
          >
            Edit
          </button>
        )}
        <button
          className="btn danger small"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
