const getBaseUrl = () => {
  // Determine API base URL via env with fallback order:
  // REACT_APP_API_BASE -> REACT_APP_BACKEND_URL -> http://localhost:4000
  const { REACT_APP_API_BASE, REACT_APP_BACKEND_URL } = process.env;
  return (REACT_APP_API_BASE && REACT_APP_API_BASE.trim()) ||
    (REACT_APP_BACKEND_URL && REACT_APP_BACKEND_URL.trim()) ||
    "http://localhost:4000";
};

// PUBLIC_INTERFACE
export function apiBaseUrl() {
  /** Returns the API base URL used by the frontend, resolved from environment variables. */
  return getBaseUrl();
}

// PUBLIC_INTERFACE
export async function getTasks() {
  /** Fetch list of tasks */
  const res = await fetch(`${getBaseUrl()}/api/tasks`);
  if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.status}`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function createTask(payload) {
  /** Create a task with shape: { title: string } */
  const res = await fetch(`${getBaseUrl()}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to create task: ${res.status}`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function updateTask(id, payload) {
  /** Update a task by id with partial fields, e.g., { title, completed } */
  const res = await fetch(`${getBaseUrl()}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to update task: ${res.status}`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function deleteTask(id) {
  /** Delete a task by id */
  const res = await fetch(`${getBaseUrl()}/api/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete task: ${res.status}`);
  return true;
}
