// Local state array to hold task items before connecting to the backend API
let tasks = [
  { id: '1', title: 'Setup PostgreSQL Database', description: 'Install PostgreSQL or spin up Docker container.', status: 'todo' },
  { id: '2', title: 'Build Express REST API', description: 'Create task endpoints for CRUD operations.', status: 'in_progress' },
  { id: '3', title: 'Design Frontend UI', description: 'HTML, CSS, and Drag-and-Drop JS.', status: 'done' }
];

// DOM Elements
const todoList = document.getElementById('todo-list');
const inProgressList = document.getElementById('in-progress-list');
const doneList = document.getElementById('done-list');
const addTaskBtn = document.getElementById('add-task-btn');

// Render all tasks onto the board
function renderTasks() {
  todoList.innerHTML = '';
  inProgressList.innerHTML = '';
  doneList.innerHTML = '';

  let counts = { todo: 0, in_progress: 0, done: 0 };

  tasks.forEach(task => {
    const card = createTaskCard(task);
    counts[task.status]++;

    if (task.status === 'todo') todoList.appendChild(card);
    else if (task.status === 'in_progress') inProgressList.appendChild(card);
    else if (task.status === 'done') doneList.appendChild(card);
  });

  // Update counts
  document.getElementById('todo-count').textContent = counts.todo;
  document.getElementById('in-progress-count').textContent = counts.in_progress;
  document.getElementById('done-count').textContent = counts.done;
}

// Create individual draggable HTML Task Card
function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.draggable = true;
  card.dataset.id = task.id;

  card.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
  `;

  // HTML5 Drag Events
  card.addEventListener('dragstart', () => {
    card.classList.add('dragging');
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
  });

  return card;
}

// Setup Column Dropzones
const columns = document.querySelectorAll('.column');

columns.forEach(column => {
  column.addEventListener('dragover', (e) => {
    e.preventDefault(); // Required to allow dropping
  });

  column.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggingCard = document.querySelector('.dragging');
    if (!draggingCard) return;

    const taskId = draggingCard.dataset.id;
    const newStatus = column.dataset.status;

    // Update local state
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      renderTasks();
    }
  });
});

// Add Task Button Placeholder
addTaskBtn.addEventListener('click', () => {
  const title = prompt('Enter Task Title:');
  const description = prompt('Enter Task Description:');

  if (title) {
    const newTask = {
      id: Date.now().toString(),
      title,
      description: description || '',
      status: 'todo'
    };
    tasks.push(newTask);
    renderTasks();
  }
});

// Initial Render
renderTasks();