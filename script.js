document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('addTaskButton');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    let editingItem = null;

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskElement = createTaskElement(task.text, task.id, task.completed);
            taskList.appendChild(taskElement);
        });
    }

    // Save tasks to localStorage
    function saveTasks() {
        const tasks = Array.from(taskList.children).map(li => {
            return {
                id: li.getAttribute('data-id'),
                text: li.querySelector('.task-text').textContent.trim(),
                completed: li.querySelector('.checkbox').checked
            };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function createTaskElement(taskText, id, completed = false) {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-id', id);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = completed;

        const taskTextNode = document.createElement('span');
        taskTextNode.textContent = taskText;
        taskTextNode.className = 'task-text';

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', () => editTask(id));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => deleteTask(id));

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';
        buttonsContainer.appendChild(editButton);
        buttonsContainer.appendChild(deleteButton);

        listItem.appendChild(checkbox);
        listItem.appendChild(taskTextNode);
        listItem.appendChild(buttonsContainer);

        if (completed) {
            listItem.classList.add('completed');
            editButton.disabled = true;
            deleteButton.disabled = true;
        }

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                listItem.classList.add('completed');
                editButton.disabled = true;
                deleteButton.disabled = true;
            } else {
                listItem.classList.remove('completed');
                editButton.disabled = false;
                deleteButton.disabled = false;
            }
            saveTasks();
        });

        return listItem;
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const id = Date.now();
        const taskElement = createTaskElement(taskText, id);
        taskList.appendChild(taskElement);
        taskInput.value = '';
        saveTasks();
    }

    function editTask(id) {
        const itemToEdit = document.querySelector(`li[data-id='${id}']`);
        taskInput.value = itemToEdit.querySelector('.task-text').textContent.trim();
        editingItem = itemToEdit;
    }

    function updateTask() {
        if (!editingItem) return;

        const newTaskText = taskInput.value.trim();
        if (newTaskText === '') return;

        editingItem.querySelector('.task-text').textContent = newTaskText;
        taskInput.value = '';
        editingItem = null;
        saveTasks();
    }

    function deleteTask(id) {
        const itemToDelete = document.querySelector(`li[data-id='${id}']`);
        taskList.removeChild(itemToDelete);
        saveTasks();
    }

    addTaskButton.addEventListener('click', () => {
        if (editingItem) {
            updateTask();
        } else {
            addTask();
        }
    });
    loadTasks();
});