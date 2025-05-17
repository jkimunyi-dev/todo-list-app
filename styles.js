// JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // State
    let todos = [];
    let currentFilter = 'all';
    
    // Load todos from localStorage
    function loadTodos() {
        const storedTodos = localStorage.getItem('todos');
        todos = storedTodos ? JSON.parse(storedTodos) : [];
        renderTodos();
    }
    
    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    // Render todos based on current filter
    function renderTodos() {
        todoList.innerHTML = '';
        
        const filteredTodos = filterTodos();
        
        if (filteredTodos.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No todos to display';
            todoList.appendChild(emptyState);
            return;
        }
        
        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.setAttribute('data-id', todo.id);
            
            // Checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => toggleComplete(todo.id));
            
            // Todo content container
            const todoContent = document.createElement('div');
            todoContent.className = 'todo-content';
            
            // Todo text
            const todoText = document.createElement('p');
            todoText.className = 'todo-text';
            todoText.textContent = todo.text;
            todoText.addEventListener('dblclick', () => startEditing(todo.id));
            
            todoContent.appendChild(todoText);
            
            // Action buttons
            const actions = document.createElement('div');
            actions.className = 'actions';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'action-btn edit-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => startEditing(todo.id));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
            
            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            
            // Append all elements
            todoItem.appendChild(checkbox);
            todoItem.appendChild(todoContent);
            todoItem.appendChild(actions);
            
            todoList.appendChild(todoItem);
        });
    }
    
    // Filter todos based on currentFilter
    function filterTodos() {
        switch(currentFilter) {
            case 'active':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    }
    
    // Add new todo
    function addTodo() {
        const text = todoInput.value.trim();
        if (text === '') return;
        
        const newTodo = {
            id: Date.now().toString(),
            text: text,
            completed: false
        };
        
        todos.unshift(newTodo);
        saveTodos();
        renderTodos();
        
        todoInput.value = '';
        todoInput.focus();
    }
    
    // Toggle todo complete status
    function toggleComplete(id) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos();
    }
    
    // Start editing todo
    function startEditing(id) {
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        const todoContent = todoItem.querySelector('.todo-content');
        const todoText = todoContent.querySelector('.todo-text');
        const text = todoText.textContent;
        
        todoContent.innerHTML = '';
        
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';
        editInput.value = text;
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveEdit(id, editInput.value);
            } else if (e.key === 'Escape') {
                cancelEdit();
            }
        });
        
        const actions = todoItem.querySelector('.actions');
        actions.innerHTML = '';
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'action-btn save-btn';
        saveBtn.textContent = 'Save';
        saveBtn.addEventListener('click', () => saveEdit(id, editInput.value));
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'action-btn cancel-btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', cancelEdit);
        
        actions.appendChild(saveBtn);
        actions.appendChild(cancelBtn);
        
        todoContent.appendChild(editInput);
        editInput.focus();
        editInput.select();
    }
    
    // Save edited todo
    function saveEdit(id, newText) {
        newText = newText.trim();
        if (newText === '') return;
        
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, text: newText } : todo
        );
        saveTodos();
        renderTodos();
    }
    
    // Cancel editing
    function cancelEdit() {
        renderTodos();
    }
    
    // Delete todo
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }
    
    // Set up event listeners
    addButton.addEventListener('click', addTodo);
    
    todoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.getAttribute('data-filter');
            renderTodos();
        });
    });
    
    // Initial load
    loadTodos();
});