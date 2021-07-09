var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;
var tasks = [];

// When form button is submitted
var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    if (!taskNameInput || !taskTypeInput) {
      alert("You need to fill out the task form!");
      return false;
    }

    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");

    if (isEdit) {
      var taskId = formEl.getAttribute("data-task-id");
      completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {
      var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
      };
      createTaskEl(taskDataObj);
    }
}

// Create a new task
var createTaskEl = function(taskDataObj) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    listItemEl.setAttribute("data-task-id", taskIdCounter);

    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3> <span class='task-type'>" + taskDataObj.type +"</span>"; 
    
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    tasksToDoEl.appendChild(listItemEl);

    // Add task to array
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    taskIdCounter++;
}

// Create buttons for each task
var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // Edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // Delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // Status select dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    statusSelectEl.className = "select-status";

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
}

// Delete task
var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();
}

// Prepare to  edit task
var editTask = function(taskId) {
  // get the names from the tasks
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  
  // load the form 
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);
};

// Save edited task
var completeEditTask = function(taskName, taskType, taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  // Update task object
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      task[i].name = taskName;
      task[i].type = taskType;
    }
  };

  alert("Task updated");
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
};

// When a task status is changed
var taskStatusChangeHandler = function(event) {
  var taskId = event.target.getAttribute("data-task-id");

  var statusValue = event.target.value.toLowerCase();

  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  
  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  // Update task object
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }
};

// When a task action (edit/delete) is clicked
var taskButtonHandler = function(event) {
  var targetEl = event.target;

  // Edit button
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } 
  // delete button
  else if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

// Event listeners
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
formEl.addEventListener("submit", taskFormHandler);