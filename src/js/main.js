import { initializeTimer } from './timer.js';
import { initializeTodo } from './todo.js';

// Initialize all modules when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTimer();
    initializeTodo();
});
