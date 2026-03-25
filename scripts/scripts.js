let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* =========================
   NOTIFICATION
========================= */
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");

  notification.textContent = message;
  notification.className = `notification show ${type}`;

  setTimeout(() => {
    notification.classList.add("hide");

    setTimeout(() => {
      notification.className = "notification";
      notification.textContent = "";
    }, 400);

  }, 2500);
}

/* =========================
   SAVE
========================= */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* =========================
   ADD TASK
========================= */
function addTask() {
  try {
    const input = document.getElementById("taskInput");
    const category = document.getElementById("category").value;
    const value = input.value.trim();

    if (!value) {
      throw new Error("Task cannot be empty");
    }

    const task = {
      id: Date.now(),
      text: value,
      category: category,
      completed: false,
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss")
    };

    tasks.push(task);
    input.value = "";

    saveTasks();
    renderTasks();

    showNotification("Task added successfully!");

  } catch (error) {
    showNotification(error.message, "error");
  }
}

/* =========================
   TOGGLE
========================= */
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, completed: !task.completed }
      : task
  );

  saveTasks();
  renderTasks();
}

/* =========================
   DELETE
========================= */
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  renderTasks();

  showNotification("Task deleted!");
}

/* =========================
   EDIT
========================= */
function editTask(id) {
  const list = document.getElementById("taskList");

  const li = [...list.children].find(li =>
    li.querySelector("button[onclick*='" + id + "']")
  );

  const task = tasks.find(t => t.id === id);

  li.innerHTML = `
    <input type="text" id="editInput-${id}" value="${task.text}" />
    <div>
      <button onclick="saveEdit(${id})">💾</button>
      <button onclick="renderTasks()">❌</button>
    </div>
  `;
}

function saveEdit(id) {
  try {
    const input = document.getElementById(`editInput-${id}`);
    const newText = input.value.trim();

    if (!newText) {
      throw new Error("Task cannot be empty");
    }

    tasks = tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    );

    saveTasks();
    renderTasks();

    showNotification("Task updated!");

  } catch (error) {
    showNotification(error.message, "error");
  }
}

/* =========================
   FILTER
========================= */
function filterTasks(type) {
  currentFilter = type;
  renderTasks();
}

/* =========================
   CLEAR COMPLETED
========================= */
function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);

  saveTasks();
  renderTasks();

  showNotification("Completed tasks cleared!");
}

/* =========================
   RENDER
========================= */
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  } else if (currentFilter === "active") {
    filteredTasks = tasks.filter(t => !t.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.completed ? "completed" : ""}">
        ${task.text}
        <small>[${task.category}] (${task.createdAt})</small>
      </span>
      <div>
        <button id="good" onclick="toggleTask(${task.id})">✔</button>
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">❌</button>
      </div>
    `;

    list.appendChild(li);
  });
}

/* =========================
   RECURSION (REQUIREMENT)
========================= */
function countdownTasks(n) {
  if (n <= 0) {
    console.log("Done counting tasks!");
    return;
  }

  console.log("Tasks left:", n);
  countdownTasks(n - 1);
}

countdownTasks(3);

/* =========================
   INIT
========================= */
renderTasks();