document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const pagination = document.getElementById('pagination');
    const tasksPerPage = 10;

    // Load tasks from local storage
    loadTasks();

    // Add a new task
    addTaskBtn.addEventListener('click', () => {
        if (taskInput.value.trim() !== '') {
            addTask(taskInput.value.trim());
            taskInput.value = '';
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && taskInput.value.trim() !== '') {
            addTask(taskInput.value.trim());
            taskInput.value = '';
        }
    });

    // Add task function
    function addTask(task) {
        const taskCounter = getNextTaskNumber(); // Get next task number
        const li = document.createElement('li');
        li.innerHTML = `<span>${taskCounter}. ${task}</span> <button onclick="removeTask(this)">Delete</button>`;
        taskList.appendChild(li);

        saveTask(taskCounter, task);
        updatePagination();
    }

    // Get the next task number
    function getNextTaskNumber() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        return tasks.length ? tasks[tasks.length - 1].counter + 1 : 1;
    }

    // Save task to local storage
    function saveTask(taskCounter, task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ counter: taskCounter, task: task });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from local storage
    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(({ counter, task }) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${counter}. ${task}</span> <button onclick="removeTask(this)">Delete</button>`;
            taskList.appendChild(li);
        });
        updatePagination();
    }

    // Remove task function
    window.removeTask = function(button) {
        const li = button.parentElement;
        const taskText = li.querySelector('span').textContent;
        li.remove();
        removeTaskFromStorage(taskText);
        updateTaskNumbers();
        updatePagination();
    }

    // Remove task from local storage
    function removeTaskFromStorage(taskText) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => `${t.counter}. ${t.task}` !== taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Update task numbers after removal
    function updateTaskNumbers() {
        const tasks = document.querySelectorAll('#task-list li');
        tasks.forEach((task, index) => {
            const span = task.querySelector('span');
            const taskText = span.textContent.split('. ')[1];
            span.innerHTML = `${index + 1}. ${taskText}`;
        });

        // Update local storage with new numbers
        updateLocalStorageWithNewNumbers();
    }

    // Update local storage with new task numbers
    function updateLocalStorageWithNewNumbers() {
        const tasks = document.querySelectorAll('#task-list li');
        let updatedTasks = [];
        tasks.forEach((task, index) => {
            const span = task.querySelector('span');
            const taskText = span.textContent.split('. ')[1];
            updatedTasks.push({ counter: index + 1, task: taskText });
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    // Update pagination controls
    function updatePagination() {
        const tasks = document.querySelectorAll('#task-list li');
        const numPages = Math.ceil(tasks.length / tasksPerPage);

        pagination.innerHTML = '';
        for (let i = 1; i <= numPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.addEventListener('click', () => showPage(i));
            pagination.appendChild(button);
        }

        showPage(1); // Show the first page by default
    }

    // Show a specific page of tasks
    function showPage(page) {
        const tasks = document.querySelectorAll('#task-list li');
        const startIndex = (page - 1) * tasksPerPage;
        const endIndex = startIndex + tasksPerPage;

        tasks.forEach((task, index) => {
            if (index >= startIndex && index < endIndex) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    }
});
