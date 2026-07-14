let currentFilter = "all";
let tasks = [];
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function showAll() {
    currentFilter = "all";
    renderTasks();
}

function showCompleted() {
    currentFilter = "completed";
    renderTasks();
}

function showPending() {
    currentFilter = "pending";
    renderTasks();
}
function addTask() {
    let input = document.getElementById("taskInput");
    let task = input.value;
    if (task === "") {
        alert("Enter a task");
        return;
    }
   tasks.push({
    text: task,
    completed: false,
    dueDate: document.getElementById("dueDate").value,
    priority: document.getElementById("priority").value
});
    saveTasks();
    renderTasks();
    input.value = "";
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}
function clearAll() {
    if (confirm("Delete all tasks?")) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}
function editTask(index) {
    let newTask = prompt(
        "Edit task",
        tasks[index].text
    );

    if (newTask !== null && newTask.trim() !== "") {
        tasks[index].text = newTask;
        saveTasks();
        renderTasks();
    }
}
function updateTaskCount() {
    let completed = tasks.filter(task => task.completed).length;
    let pending = tasks.length - completed;

    document.getElementById("taskCount").innerText =
        `Completed: ${completed} | Pending: ${pending} | Total: ${tasks.length}`;
}
function renderTasks(search = "") {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((taskObj, index) => {

        // Search Filter
        if (!taskObj.text.toLowerCase().includes(search)) {
            return;
        }

        // Completed Filter
        if (
            currentFilter === "completed" &&
            !taskObj.completed
        ) {
            return;
        }

        // Pending Filter
        if (
            currentFilter === "pending" &&
            taskObj.completed
        ) {
            return;
        }

        let li = document.createElement("li");

if (taskObj.priority === "High") {
    li.classList.add("high");
} else if (taskObj.priority === "Medium") {
    li.classList.add("medium");
} else {
    li.classList.add("low");
}

li.innerHTML = `
    <span class="${taskObj.completed ? "completed" : ""}">
        ${taskObj.text}
        <br>
        <small>📅 ${taskObj.dueDate || "No Date"}</small>
        <br>
        <small>⭐ ${taskObj.priority}</small>
    </span>

    <div>
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
    </div>
`;

        li.querySelector("span").addEventListener("click", function () {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks(
                document.getElementById("searchInput").value.toLowerCase()
            );
        });

        taskList.appendChild(li);
    });

    updateTaskCount();
}
function toggleDarkMode() {
    document.body.classList.toggle("dark");

    let btn = document.getElementById("themeBtn");

    if (document.body.classList.contains("dark")) {
        btn.innerText = "☀️ Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        btn.innerText = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
    }
}
window.onload = function () {
    let savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
    let btn = document.getElementById("themeBtn");
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        btn.innerText = "☀️ Light Mode";
    }
    else {
        btn.innerText = "🌙 Dark Mode";
    }
};
document.getElementById("taskInput")
.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});
document.getElementById("searchInput")
.addEventListener("input", function () {
    renderTasks(this.value.toLowerCase());
});
