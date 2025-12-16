const getBaseUrl = () => {
  // Determine API base URL via env with fallback order:
  // REACT_APP_API_BASE -> REACT_APP_BACKEND_URL -> http://localhost:4000
  const { REACT_APP_API_BASE, REACT_APP_BACKEND_URL } = process.env;
  return (REACT_APP_API_BASE && REACT_APP_API_BASE.trim()) ||
    (REACT_APP_BACKEND_URL && REACT_APP_BACKEND_URL.trim()) ||
    "http://localhost:4000";
};

// Normalize a task object: ensure booleans and ISO strings for date fields
const normalizeTask = (task) => {
  if (!task || typeof task !== "object") return task;
  const normalized = { ...task };
  // Ensure completed is a boolean
  if (typeof normalized.completed !== "boolean") {
    // Convert typical truthy/falsey strings/numbers to boolean
    normalized.completed = normalized.completed === true ||
      normalized.completed === 1 ||
      normalized.completed === "1" ||
      normalized.completed === "true";
  }
  // Normalize common date fields if present
  ["createdAt", "updatedAt", "completedAt", "dueDate"].forEach((key) => {
    if (normalized[key]) {
      const d = new Date(normalized[key]);
      if (!isNaN(d.getTime())) {
        normalized[key] = d.toISOString();
      }
    }
  });
  return normalized;
};

// Normalize arrays of tasks
const normalizeTasks = (data) => {
  if (Array.isArray(data)) return data.map(normalizeTask);
  if (data && typeof data === "object") return normalizeTask(data);
  return data;
};

// PUBLIC_INTERFACE
export function apiBaseUrl() {
  /** Returns the API base URL used by the frontend, resolved from environment variables. */
  return getBaseUrl();
}

// PUBLIC_INTERFACE
export async function getTasks() {
  /** Fetch list of tasks (expects array), normalizes booleans and dates */
  const res = await fetch(`${getBaseUrl()}/api/tasks`);
  if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.status}`);
  const data = await res.json();
  return normalizeTasks(data);
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
  const data = await res.json();
  return normalizeTask(data);
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
  const data = await res.json();
  return normalizeTask(data);
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
