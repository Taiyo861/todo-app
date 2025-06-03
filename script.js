const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const filters = document.getElementById("filters");

window.addEventListener("load", loadTasks);

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const task = input.value.trim();
  if (task === "") return;
  addTaskToDOM(task, false);
  saveTask(task, false);
  input.value = "";
});

function addTaskToDOM(taskText, completed) {
  const li = document.createElement("li");
  li.setAttribute("draggable", "true"); // ✅ Make draggable

  const span = document.createElement("span");
  span.textContent = taskText;
  if (completed) {
    span.classList.add("completed");
  }

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "✔️";
  completeBtn.classList.add("task-button", "complete");
  completeBtn.addEventListener("click", () => {
    span.classList.toggle("completed");
    updateTaskCompletion(taskText, span.classList.contains("completed"));
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("task-button", "delete");
  deleteBtn.addEventListener("click", () => {
    li.remove();
    removeTask(taskText);
  });

  const buttonContainer = document.createElement("div");
buttonContainer.classList.add("task-buttons");
buttonContainer.appendChild(completeBtn);
buttonContainer.appendChild(deleteBtn);

li.appendChild(span);
li.appendChild(buttonContainer);
list.appendChild(li);


  // 🧩 Drag-and-Drop Event Handlers
  li.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", taskText);
  });

  li.addEventListener("dragover", (e) => {
    e.preventDefault(); // Necessary to allow dropping
    li.style.borderTop = "2px solid blue"; // Visual cue
  });

  li.addEventListener("dragleave", () => {
    li.style.borderTop = "";
  });

  li.addEventListener("drop", (e) => {
    e.preventDefault();
    li.style.borderTop = "";
    const draggedTaskText = e.dataTransfer.getData("text/plain");
    if (draggedTaskText === taskText) return; // Ignore dropping on self
    const draggedLi = [...list.children].find(el => 
      el.querySelector("span").textContent === draggedTaskText
    );
    list.insertBefore(draggedLi, li); // Move dragged task above target
    saveCurrentOrder(); // Update localStorage
  });
}

function saveTask(taskText, completed) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, completed });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    addTaskToDOM(task.text, task.completed);
  });
}

function updateTaskCompletion(taskText, completed) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task => {
    if (task.text === taskText) {
      return { text: task.text, completed };
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ Save Current Order After Drag-and-Drop
function saveCurrentOrder() {
  const tasks = [...list.children].map(li => {
    return {
      text: li.querySelector("span").textContent,
      completed: li.querySelector("span").classList.contains("completed")
    };
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ Filter Buttons
filters.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  const filter = e.target.getAttribute("data-filter");
  applyFilter(filter);
});

function applyFilter(filter) {
  document.querySelectorAll("#filters button").forEach(btn => {
    btn.classList.remove("selected");
  });
  const activeButton = document.querySelector(`#filters button[data-filter="${filter}"]`);
  if (activeButton) activeButton.classList.add("selected");

  const tasks = list.querySelectorAll("li");
  tasks.forEach(li => {
    const isCompleted = li.querySelector("span").classList.contains("completed");
    if (filter === "all") {
      li.style.display = "";
    } else if (filter === "active") {
      li.style.display = isCompleted ? "none" : "";
    } else if (filter === "completed") {
      li.style.display = isCompleted ? "" : "none";
    }
  });
}


