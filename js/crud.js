let elForm = document.querySelector(".site-form");
let elInput = document.querySelector(".form-input");
let elList = document.querySelector(".todo-list");
let elSearch = document.querySelector(".search-input");
let elFilterBtns = document.querySelectorAll(".filter-buttons button");
let elStats = document.querySelector(".todo-stats");
let elClearBtn = document.querySelector(".clear-all-btn");


let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editId = null;
let currentFilter = "all";
let currentSearch = "";

renderTodos(todos, elList);

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  let inputValue = elInput.value.trim();
  if (!inputValue) return;

  if (editId !== null) {
    let todoEdit = todos.find(todo => todo.id === editId);
    if (todoEdit) {
      todoEdit.value = inputValue;
      showAlert("Todo edited successfully!", "success");
    }
    editId = null;
  } else {
    todos.push({
      id: Date.now(),
      value: inputValue,
      isCompleted: false
    });
    showAlert("New todo added!", "success");
  }

  evt.target.reset();
  updateLocalStorage();
  renderTodos(todos, elList);
});

function renderTodos(arr, list) {
  let filtered = arr
    .filter(todo => todo.value.toLowerCase().includes(currentSearch.toLowerCase()))
    .filter(todo => {
      if (currentFilter === "completed") return todo.isCompleted;
      if (currentFilter === "uncompleted") return !todo.isCompleted;
      return true;
    });

  list.innerHTML = "";

  filtered.forEach((item, index) => {
    let elItem = document.createElement("li");
    elItem.innerHTML = `
      <div class="w-[500px] mx-auto px-[20px] py-[10px] flex justify-between items-center border-t border-gray-500 ${item.isCompleted ? 'bg-green-700' : 'bg-[#555555]'}">
        <strong class="text-white ${item.isCompleted ? 'line-through' : ''}">${index + 1}. ${item.value}</strong>
        <div class="flex gap-2">
          <button data-id="${item.id}" data-action="complete" class="text-white bg-blue-500 px-3">✔</button>
          <button data-id="${item.id}" data-action="edit" class="bg-yellow-300 px-3">Edit</button>
          <button data-id="${item.id}" data-action="delete" class="bg-red-400 px-3">Delete</button>
        </div>
      </div>
    `;
    list.appendChild(elItem);
  });

  updateStats();
}

elList.addEventListener("click", function (evt) {
  const btn = evt.target;
  const id = Number(btn.dataset.id);

  if (btn.matches("[data-action='delete']")) {
    todos = todos.filter(todo => todo.id !== id);
    showAlert("Todo deleted.", "error");
  }

  if (btn.matches("[data-action='edit']")) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      elInput.value = todo.value;
      editId = id;
    }
  }

  if (btn.matches("[data-action='complete']")) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.isCompleted = !todo.isCompleted;
      showAlert("Todo status changed.", "info");
    }
  }

  updateLocalStorage();
  renderTodos(todos, elList);
});

elFilterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTodos(todos, elList);
  });
});

elSearch.addEventListener("input", () => {
  currentSearch = elSearch.value;
  renderTodos(todos, elList);
});

elClearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all todos?")) {
    todos = [];
    updateLocalStorage();
    renderTodos(todos, elList);
    showAlert("All todos cleared.", "error");
  }
});

function updateLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(message, type = "info") {
  const alertContainer = document.querySelector(".alert-container");
  const div = document.createElement("div");

  const bgColors = {
    info: "bg-blue-500",
    success: "bg-green-500",
    error: "bg-red-500"
  };

  div.className = `${bgColors[type] || bgColors.info} text-white px-4 py-2 rounded shadow`;
  div.textContent = message;

  alertContainer.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}

function updateStats() {
  const total = todos.length;
  const completed = todos.filter(t => t.isCompleted).length;
  const uncompleted = total - completed;
  elStats.textContent = `Total: ${total} | Completed: ${completed} | Uncompleted: ${uncompleted}`;
}
