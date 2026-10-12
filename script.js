// Oddiy To-Do ilovasi
// Vazifalar brauzer xotirasida (localStorage) saqlanadi.

const STORAGE_KEY = "oddiy-todo-v1";

const form = document.getElementById("add-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const emptyMsg = document.getElementById("empty");
const counter = document.getElementById("counter");
const clearBtn = document.getElementById("clear-done");
const filterButtons = document.querySelectorAll(".filter");

let tasks = loadTasks();
let currentFilter = "all";

// --- Saqlash / o'qish ---
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// --- Ko'rsatish ---
function getVisibleTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.done);
  if (currentFilter === "done") return tasks.filter((t) => t.done);
  return tasks;
}

function render() {
  const visible = getVisibleTasks();
  list.innerHTML = "";

  visible.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;
    text.addEventListener("click", () => toggleTask(task.id));

    const del = document.createElement("button");
    del.className = "btn-delete";
    del.textContent = "✕";
    del.title = "O'chirish";
    del.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, text, del);
    list.appendChild(li);
  });

  emptyMsg.hidden = visible.length > 0;
  const activeCount = tasks.filter((t) => !t.done).length;
  counter.textContent = `${activeCount} ta bajarilmagan / ${tasks.length} ta`;
}

// --- Amallar ---
function addTask(text) {
  tasks.unshift({ id: Date.now().toString(), text, done: false });
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function clearDone() {
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  render();
}

// --- Hodisalar ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  addTask(value);
  input.value = "";
  input.focus();
});

clearBtn.addEventListener("click", clearDone);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// --- Bugungi sana ---
document.getElementById("today").textContent =
  new Date().toLocaleDateString("uz-UZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

render();