const todoList = document.getElementById('todoList');
const newTodoInput = document.getElementById('newTodo');
const listTitle = document.getElementById('listTitle');

let draggedItem = null;

function createTodoItem(text) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.draggable = true;
    
    // Add drag event listeners
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragend', handleDragEnd);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('dragenter', handleDragEnter);
    li.addEventListener('dragleave', handleDragLeave);
    li.addEventListener('drop', handleDrop);
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
        li.classList.toggle('completed');
        if (li.classList.contains('completed')) {
            // Move to bottom when completed
            todoList.appendChild(li);
        } else {
            // Move back to top when uncompleted
            const firstCompleted = todoList.querySelector('.completed');
            if (firstCompleted) {
                todoList.insertBefore(li, firstCompleted);
            } else {
                todoList.insertBefore(li, todoList.firstChild);
            }
        }
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

// Drag and Drop Event Handlers
function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.todo-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (this !== draggedItem) {
        const rect = this.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        const threshold = rect.height / 2;
        
        if (mouseY < threshold) {
            this.classList.add('drag-over-top');
        } else {
            this.classList.remove('drag-over-top');
        }
    }
    return false;
}

function handleDragEnter(e) {
    if (this !== draggedItem) {
        const rect = this.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        const threshold = rect.height / 2;
        
        this.classList.add('drag-over');
        if (mouseY < threshold) {
            this.classList.add('drag-over-top');
        } else {
            this.classList.remove('drag-over-top');
        }
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
    this.classList.remove('drag-over-top');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (this !== draggedItem) {
        // Get the mouse position relative to the target item
        const rect = this.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        const threshold = rect.height / 2;
        
        // If mouse is in the top half, insert before the target
        // If mouse is in the bottom half, insert after the target
        if (mouseY < threshold) {
            this.parentNode.insertBefore(draggedItem, this);
        } else {
            this.parentNode.insertBefore(draggedItem, this.nextSibling);
        }
    }
    return false;
}

function addTodo() {
    const text = newTodoInput.value.trim();
    if (text) {
        const newItem = createTodoItem(text);
        const firstCompleted = todoList.querySelector('.completed');
        if (firstCompleted) {
            todoList.insertBefore(newItem, firstCompleted);
        } else {
            // Find the last unchecked item
            const uncheckedItems = Array.from(todoList.children).filter(item => !item.classList.contains('completed'));
            if (uncheckedItems.length > 0) {
                const lastUnchecked = uncheckedItems[uncheckedItems.length - 1];
                todoList.insertBefore(newItem, lastUnchecked.nextSibling);
            } else {
                todoList.appendChild(newItem);
            }
        }
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
