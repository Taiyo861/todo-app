const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");

// Load tasks from localStorage on startup
window.addEventListener("load", loadTasks);

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const task = input.value.trim();

  if (task === "") return;

  addTaskToDOM(task, false); // Add task with default 'not completed' status
  saveTask(task, false); // Save new task to localStorage

  input.value = "";
});

function addTaskToDOM(taskText, completed) {
  const li = document.createElement("li");
  
  // container for task text and buttons
  const span = document.createElement("span");
  span.textContent = taskText;
  if (completed) {
    span.classList.add("completed");
  }

  // complete button
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "✔️";
  completeBtn.classList.add("task-button", "complete");
  completeBtn.addEventListener("click", () => {
    span.classList.toggle("completed");
    updateTaskCompletion(taskText,span.classList.contains("completed"));
  });

  // create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("task-button", "delete");
  deleteBtn.addEventListener("click", () => {
    li.remove();
    removeTask(taskText);
  });
  
    // Append everything to <li>
    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
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



