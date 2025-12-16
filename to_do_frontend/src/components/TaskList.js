import React from "react";
import TaskItem from "./TaskItem";

// PUBLIC_INTERFACE
export default function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  /** List wrapper for rendering TaskItem entries. */
  if (!tasks.length) {
    return <p className="empty">No tasks yet. Add your first task!</p>;
  }
  return (
    <ul className="task-list">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
