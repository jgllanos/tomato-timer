const todoList = document.getElementById('todoList');
const newTodoInput = document.getElementById('newTodo');
const listTitle = document.getElementById('listTitle');

let draggedItem = null;

function updateCurrentTaskHighlight() {
    // Remove current-task class from all items
    document.querySelectorAll('.todo-item').forEach(item => {
        item.classList.remove('current-task');
    });
    
    // Find the first incomplete task
    const firstIncomplete = Array.from(todoList.children).find(item => 
        !item.classList.contains('completed')
    );
    
    // Add current-task class to the first incomplete task
    if (firstIncomplete) {
        firstIncomplete.classList.add('current-task');
    }
}

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
        updateCurrentTaskHighlight();
    });
    
    const span = document.createElement('span');
    span.textContent = text;
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = '✎';
    editBtn.addEventListener('click', () => {
        startEditing(li, span, text);
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => {
        li.remove();
        updateCurrentTaskHighlight();
    });
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    return li;
}

function startEditing(li, span, originalText) {
    // Create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalText;
    input.className = 'edit-input';
    
    // Replace span with input
    span.replaceWith(input);
    input.focus();
    input.select();
    
    // Store original text for cancel
    li.dataset.originalText = originalText;
    
    // Add event listeners for editing
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveEdit(li, input);
        } else if (e.key === 'Escape') {
            cancelEdit(li, input, originalText);
        }
    });
    
    input.addEventListener('blur', () => {
        saveEdit(li, input);
    });
}

function saveEdit(li, input) {
    const newText = input.value.trim();
    if (newText) {
        const span = document.createElement('span');
        span.textContent = newText;
        input.replaceWith(span);
        
        // Remove old edit button and create new one
        const oldEditBtn = li.querySelector('.edit-btn');
        if (oldEditBtn) oldEditBtn.remove();
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = '✎';
        editBtn.addEventListener('click', () => {
            startEditing(li, span, newText);
        });
        
        // Insert before delete button
        const deleteBtn = li.querySelector('.delete-btn');
        li.insertBefore(editBtn, deleteBtn);
        updateCurrentTaskHighlight();
    } else {
        cancelEdit(li, input, li.dataset.originalText);
    }
}

function cancelEdit(li, input, originalText) {
    const span = document.createElement('span');
    span.textContent = originalText;
    input.replaceWith(span);
    
    // Remove old edit button and create new one
    const oldEditBtn = li.querySelector('.edit-btn');
    if (oldEditBtn) oldEditBtn.remove();
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = '✎';
    editBtn.addEventListener('click', () => {
        startEditing(li, span, originalText);
    });
    
    // Insert before delete button
    const deleteBtn = li.querySelector('.delete-btn');
    li.insertBefore(editBtn, deleteBtn);
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
        updateCurrentTaskHighlight();
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
        updateCurrentTaskHighlight();
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

    document.getElementById('clearList').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the list? This will delete all the current tasks.')) {
            todoList.innerHTML = '';
            updateCurrentTaskHighlight();
        }
    });
    
    // Update highlight on initial load if there are existing tasks
    updateCurrentTaskHighlight();
}
