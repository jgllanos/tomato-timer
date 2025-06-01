const todoList = document.getElementById('todoList');
const newTodoInput = document.getElementById('newTodo');
const listTitle = document.getElementById('listTitle');

function createTodoItem(text) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
        li.classList.toggle('completed');
    });
    
    const span = document.createElement('span');
    span.textContent = text;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => {
        li.remove();
    });
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    return li;
}

function addTodo() {
    const text = newTodoInput.value.trim();
    if (text) {
        todoList.appendChild(createTodoItem(text));
        newTodoInput.value = '';
    }
}

export function initializeTodo() {
    // Add todo event listeners
    document.getElementById('addTodo').addEventListener('click', addTodo);
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    document.getElementById('newList').addEventListener('click', () => {
        if (confirm('Are you sure you want to create a new list? This will clear the current list.')) {
            todoList.innerHTML = '';
            listTitle.value = 'My Tasks';
        }
    });
}
