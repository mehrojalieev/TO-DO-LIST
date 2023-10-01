const todolistForm = document.querySelector("#todolist__form");
const todolistAdderInput = document.querySelector(".todolist__adder");
const clearInputBtn = document.querySelector("#clear-input");
const todolistTaskContainer = document.querySelector(".todolist__task-container");
const todolistDeleteAll = document.querySelector("#delete-all");
const sortTodoSelect = document.querySelector("#sort-todo");
const deleteBtn = document.querySelector("#delete-btn");
const searchInput = document.querySelector("#search-input");
const searchTaskClose = document.querySelector("#search-task-close")

todolistForm.addEventListener("submit", createNewTask);

let ALL_TASKS = [];

function createNewTask(e){
  // submitda refreshni oldini olish
  e.preventDefault();
  if(todolistAdderInput.value.trim().length > 0){
    const time = new Date();

    let newTask = {
      taskName: todolistAdderInput.value,
      hour: time.getHours(),
      minute: time.getMinutes(),
      date: time.getDate(),
      month: time.getMonth() + 1,
      year: time.getFullYear(),
      generalTime: time.getTime(),
      isCompleted: false,
      isEdited: false
    }
    ALL_TASKS.unshift(newTask);
    renderTasks(ALL_TASKS)
    
  }
  // inputni tozalash
  todolistAdderInput.value = "";
  todolistAdderInput.focus();
}

function renderTasks(tasks){
  const taskFragment = document.createDocumentFragment();
  while(todolistTaskContainer.firstChild){
    todolistTaskContainer.firstChild.remove()
  }
  if(ALL_TASKS.length > 0){
    tasks.forEach((taskItem, index) => {
      const taskItemElement = document.createElement("div");
      taskItemElement.className = "todolist__item";
      taskItemElement.setAttribute("data-item-index", index);
      taskItemElement.innerHTML = `
        <strong class="${taskItem.isCompleted ? "completed-item" : ""}">${taskItem.taskName}</strong>
        <div class="todolist__item-btns">
          <button class="complete-btn"> <i class="bi bi-check-circle-fill"></i> Complete </button>
          <button class="edit-btn"> <i class="bi bi-pencil-square"></i> Edit </button>
          <button class="time-btn"> <i class="bi bi-clock-fill"></i> <div class="item-date">${addZeroToTime(taskItem.date)}/${addZeroToTime(taskItem.month)}/${taskItem.year}</div> ${addZeroToTime(taskItem.hour)} : ${addZeroToTime(taskItem.minute)} </button>
          <button class="delete-btn"> <i class="bi bi-trash"></i> Delete </button>
        </div>
      `
      taskFragment.appendChild(taskItemElement);
    })
  
    todolistTaskContainer.appendChild(taskFragment);
  }
  else{
    todolistTaskContainer.innerHTML = "<b>NO TASKS YET</b>";
  }
}

renderTasks(ALL_TASKS);

function addZeroToTime(time){
  return String(time).padStart(2, "0")
}

todolistDeleteAll.addEventListener("click", () => {
  // delete all tasks
  if(ALL_TASKS.length > 0){
    var userAgree = confirm("Are you sure to delete all tasks?")
  }
  else{
    alert("You don't have any tasks for deleting!")
  }

  if(userAgree){
    ALL_TASKS.splice(0, ALL_TASKS.length);
    renderTasks(ALL_TASKS);
  }
});



sortTodoSelect.addEventListener("change", () => {
  let sortedList;
  if(sortTodoSelect.value == "a-z"){
    sortedList = ALL_TASKS.sort((a, b) => {
      if(a.taskName < b.taskName){
        return -1
      }
    })
  }
  else if(sortTodoSelect.value == "z-a"){
    sortedList = ALL_TASKS.sort((a, b) => {
      if(a.taskName > b.taskName){
        return -1
      }
    })
  }
  else if(sortTodoSelect.value == "newest"){
    sortedList = ALL_TASKS.sort((a, b) => {
      if(a.generalTime > b.generalTime){
        return -1
      }
    })
  }
  else{
    sortedList = ALL_TASKS.sort((a, b) => {
      if(a.generalTime < b.generalTime){
        return -1
      }
    })
  }
  ALL_TASKS = sortedList;
  renderTasks(sortedList);
})

todolistTaskContainer.addEventListener("click", (e) => {
  let indexOfItem = +e.target.closest("button").parentElement.parentElement.getAttribute("data-item-index")
  if(e.target.closest(".delete-btn")){
    let userAgree = confirm("Are you sure to delete this task?")
    if(userAgree){
        ALL_TASKS.splice(indexOfItem, 1);
        renderTasks(ALL_TASKS);
    }
  }
  else if(e.target.closest(".complete-btn")){
    ALL_TASKS[indexOfItem].isCompleted = !ALL_TASKS[indexOfItem].isCompleted;
    renderTasks(ALL_TASKS);
  }
})

searchInput.addEventListener("input", () => {
  const allStrongs = document.querySelectorAll(".todolist__item > strong");
  let inpValue = searchInput.value.toLowerCase()
  allStrongs.forEach(itemName => {
    if(itemName.textContent.toLowerCase().indexOf(inpValue) == -1){
      itemName.parentElement.style.display = "none"
    }
    else{
      itemName.parentElement.style.display = "block"
    }
  })
})

clearInputBtn.addEventListener("click", () => {
  todolistAdderInput.value = "";
})

searchTaskClose.addEventListener("click", (e) => {
    console.log(e.target);
    searchInput.value = ""
})