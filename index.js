// Get the elements
const taskInput = document.getElementById('taskInput');
const categoryInput = document.getElementById('categoryInput');
const reminderInput = document.getElementById('reminderInput');
const descriptionInput = document.getElementById('descriptionInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

// Check local storage for existing tasks
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to update tasks in local storage
function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to create a new task
function createTask(taskText, category, reminder, description) {
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
    date: new Date().toLocaleString(),
    category: category || '', // Use user input or an empty string
    reminder: reminder || '', // Use user input or an empty string
    description: description || '' // Use user input or an empty string
  };
  tasks.push(newTask);
  updateLocalStorage();
  if (newTask.reminder !== '') {
    setReminder(newTask);
  }
  return newTask;
}

// Function to set a reminder with an alert
function setReminder(task) {
  const reminderTime = new Date(task.reminder).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = reminderTime - currentTime;

  if (timeDifference > 0) {
    setTimeout(() => {
      alert(`Reminder: It's time to complete your task "${task.text}" in the category "${task.category}"!`);
    }, timeDifference);
  }
}

// Function to show a pop-up message for task completion
function showCompletionMessage() {
  const completionMessage = "You have completed your task!";
  alert(completionMessage);
}

// Function to render tasks
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const taskItem = document.createElement('li');

    taskItem.innerHTML = `
      <div class="${task.completed ? 'completed' : ''}" data-id="${task.id}">
        <strong>${task.text}</strong><br>
        <span class="date">Added: ${task.date}</span><br>
        <span class="category">Category: ${task.category}</span><br>
        <span class="reminder">Reminder: ${task.reminder}</span><br>
        <span class="description">Description: ${task.description}</span><br>
        <span class="current-time">Current Time (CT): ${getCurrentTime()}</span>
      </div>
      <button class="completeBtn" data-id="${task.id}">Complete</button>
    `;
    taskList.appendChild(taskItem);
  });
}

// Function to get the current time in Central Time (CT)
function getCurrentTime() {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    timeZone: 'America/Chicago', // Central Time (CT)
    hour12: true
  });
  return currentTime;
}

// Function to mark a task as completed
function markCompleted(id) {
  const taskIndex = tasks.findIndex(task => task.id == id);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    updateLocalStorage();
    renderTasks();

    // Show a pop-up message when a task is marked as completed
    if (tasks[taskIndex].completed) {
      showCompletionMessage();
    }
  }
}

// Function to remove a specific task
function removeTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  updateLocalStorage();
  renderTasks();
}

// Function to clear all tasks
function clearAllTasks() {
  tasks = [];
  updateLocalStorage();
  renderTasks();
}

// Event listener for adding a new task
addBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  const category = categoryInput.value.trim();
  const reminder = reminderInput.value.trim();
  const description = descriptionInput.value.trim();
  
  if (taskText !== '') {
    createTask(taskText, category, reminder, description);
    renderTasks();
    taskInput.value = '';
    categoryInput.value = '';
    reminderInput.value = '';
    descriptionInput.value = '';
  }
});

// Event listener for pressing Enter to add a task
taskInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    const taskText = taskInput.value.trim();
    const category = categoryInput.value.trim();
    const reminder = reminderInput.value.trim();
    const description = descriptionInput.value.trim();
    
    if (taskText !== '') {
      createTask(taskText, category, reminder, description);
      renderTasks();
      taskInput.value = '';
      categoryInput.value = '';
      reminderInput.value = '';
      descriptionInput.value = '';
    }
  }
});

// Event listener for marking a task as completed
taskList.addEventListener('click', (e) => {
  if (e.target.classList.contains('completeBtn')) {
    const taskId = e.target.getAttribute('data-id');
    markCompleted(taskId);
  }
});

// Event listener for clearing completed tasks
clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  updateLocalStorage();
  renderTasks();
});

// Event listener for clearing all tasks
clearAllBtn.addEventListener('click', clearAllTasks);

// Initial rendering of tasks
renderTasks();
