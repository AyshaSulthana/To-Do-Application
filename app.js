let taskId = 0;
let editingTask = null; // To track the task being edited
document.getElementById('addTaskBtn').addEventListener('click', handleTaskAction);
loadTasksFromLocalStorage();

function saveTasksToLocalStorage() {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.children).map(task => ({
        text: task.querySelector('span').textContent,
        completed: task.querySelector('.task-checkbox').checked,
        id: task.querySelector('.delete-btn').id,
        priority: task.querySelector('.prioritySelectSpan').textContent
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function handleTaskAction() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const taskValue = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (taskValue === '') {
        alert('Task cannot be empty!');
        return;
    }

    if (!priority) {
        alert('Please select a priority!');
        return;
    }

    if (editingTask) {
        // Update existing task
        editingTask.querySelector('span').textContent = taskValue;
        editingTask.querySelector('.prioritySelectSpan').textContent = priority;

        // Reset editing state
        editingTask = null;
        document.getElementById('addTaskBtn').textContent = 'Add';
    } else {
        // Add a new task
        const listItem = createTaskElement(taskValue, taskId++, priority);
        document.getElementById('taskList').appendChild(listItem);
    }

    // Reset input fields
    taskInput.value = '';
   // prioritySelect.value = '';

    // Save to local storage
    saveTasksToLocalStorage();
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach(task => {
        const listItem = createTaskElement(task.text, task.id, task.priority);
        document.getElementById('taskList').appendChild(listItem);

        if (task.completed) {
            const checkbox = listItem.querySelector('.task-checkbox');
            checkbox.checked = true;
            
            listItem.querySelector('.delete-btn').classList.add('disabled');
            listItem.querySelector('.edit-btn').classList.add('disabled');
            listItem.querySelector('.todotask').classList.add('completed');

        }
    });

    taskId = tasks.length > 0 ? Math.max(...tasks.map(task => parseInt(task.id, 10))) + 1 : 0;
}

function editTask(listItem) {
    const taskText = listItem.querySelector('span').textContent;
    const priority = listItem.querySelector('.prioritySelectSpan').textContent;

    // Populate input fields with the current task data
    document.getElementById('taskInput').value = taskText;
    document.getElementById('prioritySelect').value = priority;

    // Set editing state
    editingTask = listItem;
    document.getElementById('addTaskBtn').textContent = 'Save';
}

function deleteTask(listItem, id) {
    listItem.remove();
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(taskValue, id, priority) {
    const listItem = document.createElement('li');
    listItem.classList.add('task-item');

    listItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" />
        <span class="todotask">${taskValue}</span>
        <span class="prioritySelectSpan">${priority}</span>
        <div class="actions">
            <i class="edit-btn fas fa-edit"></i>
            <i class="delete-btn fas fa-trash-alt" id="${id}"></i>
        </div>
    `;

    const checkbox = listItem.querySelector('.task-checkbox');
    const editBtn = listItem.querySelector('.edit-btn');
    const deleteBtn = listItem.querySelector('.delete-btn');

    checkbox.addEventListener('change', () => toggleTaskCompletion(listItem, checkbox));
    editBtn.addEventListener('click', () => editTask(listItem));
    deleteBtn.addEventListener('click', () => deleteTask(listItem, id));

    return listItem;
}

function toggleTaskCompletion(listItem, checkbox) {
    console.log('listItem',  listItem);
    listItem.querySelector('.todotask').classList.toggle('completed', checkbox.checked);
    listItem.querySelector('.delete-btn').classList.toggle('disabled');
    listItem.querySelector('.edit-btn').classList.toggle('disabled');
    saveTasksToLocalStorage();
}