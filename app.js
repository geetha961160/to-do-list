let tasks = [];

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionInput = document.getElementById('task-description');
const prioritySelect = document.getElementById('priority');
const dueDateInput = document.getElementById('due-date');
const searchInput = document.getElementById('search-input');

const openTaskForm = () => {
    document.getElementById('task-form-container').classList.remove('hidden');
};

const closeTaskForm = () => {
    document.getElementById('task-form-container').classList.add('hidden');
};

const addTask = (title, description, priority, dueDate) => {
    const newTask = {
        title,
        description,
        priority,
        dueDate,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    displayTasks(tasks);
    taskForm.reset();
};

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const loadTasks = () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks = storedTasks;
        displayTasks(tasks);
    }
};

const displayTasks = (tasksArray) => {
    taskList.innerHTML = '';
    tasksArray.forEach((task, index) => {
        const li = createTaskElement(task, index);
        taskList.appendChild(li);
    });
};

const createTaskElement = (task, index) => {
    const li = document.createElement('li');
    li.classList.add('task-card');
    if (task.completed) {
        li.classList.add('completed');
    }
    li.innerHTML = `
        <div>
            <p class="task-title">${task.title}</p>
            <p class="task-details">${task.description || 'No description'}</p>
            <p class="task-due">${task.dueDate ? `Due Date: ${task.dueDate}` : 'No due date'}</p>
            <p class="task-priority">Priority: ${task.priority}</p>
            <div>
                <button class="complete-btn" onclick="toggleTaskCompletion(${index})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="edit-btn" onclick="editTask(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </div>
        </div>
    `;
    return li;
};

const toggleTaskCompletion = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks(tasks);
};

const editTask = (index) => {
    const task = tasks[index];
    const newTitle = prompt('Enter new title:', task.title);
    if (newTitle) {
        task.title = newTitle;
        saveTasks();
        displayTasks(tasks);
    }
};

const deleteTask = (index) => {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        displayTasks(tasks);
    }
};

const searchTasks = () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm === '') {
        displayTasks(tasks); // Show all tasks if search input is empty
        return;
    }
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
    );
    displayTasks(filteredTasks);
};

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value.trim();
    addTask(title, description, priority, dueDate);
});

loadTasks();
