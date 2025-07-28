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
    showAlert("New todo created!", "success");
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





// let elForm = document.querySelector("form");
// let elList = document.querySelector(".list");

// elForm.addEventListener("submit", function(e) {
//     e.preventDefault();
//     const data = {
//         name: e.target.todo.value
//     };
//     fetch("http://localhost:3000/todos", {
//         method: "POST",
//         body: JSON.stringify(data),
//         headers: { "Content-type": "application/json" }
//     })
//     .then(() => getTodos().then(renderTodos));
// });

// async function getTodos() {
//     let res = await fetch("http://localhost:3000/todos");
//     let data = await res.json();
//     return data;
// }

// function renderTodos(todos) {
//     elList.innerHTML = null;
//     todos.map(item => {
//         let elItem = document.createElement("li");
//         elItem.innerHTML = `
//         <div class="flex justify-between items-center p-[5px] ">
//             <p class="border-[1px] w-[260px] rounded-[5px] p-[5px]">${item.name}</p>
//             <div>
//                 <button data-id="${item.id}" class="edit-btn w-[80px] border-[1px] border-blue-600 text-center bg-blue-600 text-white py-[5px] rounded-[5px] cursor-pointer hover:bg-transparent hover:border-[1px] hover:border-white hover:text-white duration-300">Edit</button>
//                 <button data-id="${item.id}" class="delete-btn w-[80px] border-[1px] border-red-600 text-center bg-red-600 text-white py-[5px] rounded-[5px] cursor-pointer hover:bg-transparent hover:border-[1px] hover:border-white hover:text-white duration-300">Delete</button>
//             </div>
//         </div>
//         `;
//         elList.append(elItem);
//     });
// }

// elList.addEventListener("click", function(e) {
//     if (e.target.classList.contains("delete-btn")) {
//         let id = e.target.dataset.id;
//         DeleteBtn(id).then(() => getTodos().then(renderTodos));
//     }

//     if (e.target.classList.contains("edit-btn")) {
//         let id = e.target.dataset.id;
//         UpdateBtn(id).then(() => getTodos().then(renderTodos));
//     }
// });

// function DeleteBtn(id) {
//     return fetch(`http://localhost:3000/todos/${id}`, {
//         method: "DELETE"
//     });
// }

// function UpdateBtn(id) {
//     let soz = prompt("Yangi so'z kiriting");
//     if (soz === null || soz.trim() === "") {
//         alert("Bo'sh qoldirish mumkun emas:");
//         return Promise.resolve(); 
//     }
//     return fetch(`http://localhost:3000/todos/${id}`, {
//         method: "PUT",
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({name: soz})
//     });
// }

// const API_URL = "http://localhost:3000/todos";

// let elForm = document.querySelector(".site-form");
// let elInput = document.querySelector(".form-input");
// let elList = document.querySelector(".todo-list");
// let elSearch = document.querySelector(".search-input");
// let elStats = document.querySelector(".todo-stats");
// let elClearBtn = document.querySelector(".clear-all-btn");

// let todos = [];
// let editId = null;
// let currentSearch = "";

// function fetchTodos() {
//   fetch(API_URL)
//     .then(res => res.json())
//     .then(data => {
//       todos = data;
//       renderTodos(todos, elList);
//     });
// }
// fetchTodos();

// elForm.addEventListener("submit", function (evt) {
//   evt.preventDefault();
//   let inputValue = elInput.value.trim();
//   if (!inputValue) return;

//   if (editId !== null) {
//     fetch(`${API_URL}/${editId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title: inputValue, completed: false })
//     })
//       .then(res => res.json())
//       .then(() => {
//         todos = todos.map(todo =>
//           todo.id === editId ? { ...todo, title: inputValue } : todo
//         );
//         showAlert("Todo edited successfully!", "success");
//         editId = null;
//         evt.target.reset();
//         renderTodos(todos, elList);
//       });
//   } else {
//     fetch(API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title: inputValue, completed: false })
//     })
//       .then(res => res.json())
//       .then(data => {
//         todos.push(data);
//         showAlert("New todo created!", "success");
//         evt.target.reset();
//         renderTodos(todos, elList);
//       });
//   }
// });

// function renderTodos(arr, list) {
//   let filtered = arr.filter(todo =>
//     todo.title.toLowerCase().includes(currentSearch.toLowerCase())
//   );

//   list.innerHTML = "";

//   filtered.forEach((item, index) => {
//     let elItem = document.createElement("li");
//     elItem.innerHTML = `
//       <div class="w-full px-[20px] py-[10px] flex justify-between items-center border-t border-gray-500 ${item.completed ? 'bg-green-700' : 'bg-[#333]'}">
//         <strong class="${item.completed ? 'line-through' : ''}">${index + 1}. ${item.title}</strong>
//         <div class="flex gap-2">
//           <button data-id="${item.id}" data-action="complete" class="bg-blue-500 px-3 py-1 rounded">✔</button>
//           <button data-id="${item.id}" data-action="edit" class="bg-yellow-300 text-black px-3 py-1 rounded">Edit</button>
//           <button data-id="${item.id}" data-action="delete" class="bg-red-400 px-3 py-1 rounded">Delete</button>
//         </div>
//       </div>
//     `;
//     list.appendChild(elItem);
//   });

//   updateStats();
// }

// elList.addEventListener("click", function (evt) {
//   const btn = evt.target;
//   const id = Number(btn.dataset.id);

//   if (btn.matches("[data-action='delete']")) {
//     fetch(`${API_URL}/${id}`, {
//       method: "DELETE"
//     })
//       .then(res => {
//         if (res.ok) {
//           todos = todos.filter(todo => todo.id !== id);
//           showAlert("Todo deleted.", "error");
//           renderTodos(todos, elList);
//         }
//       });
//   }

//   if (btn.matches("[data-action='edit']")) {
//     const todo = todos.find(t => t.id === id);
//     if (todo) {
//       elInput.value = todo.title;
//       editId = id;
//     }
//   }

//   if (btn.matches("[data-action='complete']")) {
//     const todo = todos.find(t => t.id === id);
//     if (todo) {
//       const newStatus = !todo.completed;
//       fetch(`${API_URL}/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ completed: newStatus })
//       })
//         .then(res => res.json())
//         .then(() => {
//           todo.completed = newStatus;
//           showAlert("Todo status changed.", "info");
//           renderTodos(todos, elList);
//         });
//     }
//   }
// });


// elSearch.addEventListener("input", () => {
//   currentSearch = elSearch.value;
//   renderTodos(todos, elList);
// });


// elClearBtn.addEventListener("click", () => {
//   if (confirm("Are you sure you want to delete all todos?")) {
//     Promise.all(
//       todos.map(todo =>
//         fetch(`${API_URL}/${todo.id}`, { method: "DELETE" })
//       )
//     ).then(() => {
//       todos = [];
//       renderTodos(todos, elList);
//       showAlert("All todos cleared.", "error");
//     });
//   }
// });

// function showAlert(message, type = "info") {
//   const alertContainer = document.querySelector(".alert-container");
//   const div = document.createElement("div");

//   const bgColors = {
//     info: "bg-blue-500",
//     success: "bg-green-500",
//     error: "bg-red-500"
//   };

//   div.className = `${bgColors[type]} text-white px-4 py-2 rounded shadow`;
//   div.textContent = message;

//   alertContainer.appendChild(div);

//   setTimeout(() => {
//     div.remove();
//   }, 3000);
// }

// function updateStats() {
//   const total = todos.length;
//   const completed = todos.filter(t => t.completed).length;
//   const uncompleted = total - completed;
//   elStats.textContent = `Total: ${total} | Completed: ${completed} | Uncompleted: ${uncompleted}`;
// }




