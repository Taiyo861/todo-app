const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const task = input.value.trim();

    if (task === "") return;

    const li = document.createElement("li");
    li.textContent = task;

    // toggle complete on click
    li.addEventListener("click", () => {
        li.classList.toggle("completed");
    });

    // right click to delete
    li.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        li.remove();
    });

    list.appendChild(li);
    input.value = ""; // clear input
});