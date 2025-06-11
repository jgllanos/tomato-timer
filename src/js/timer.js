import { toggleAnimation, resetAnimation, showAnimation } from './animations.js';

let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let currentTimerType = 'work'; // 'work', 'shortBreak', or 'longBreak'

const timerDisplay = document.querySelector('.timer-display');
const dingSound = document.getElementById('dingSound');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerDisplay.textContent = timeString;
    document.title = `(${timeString}) - Tomato Timer`;
}

export function startTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            toggleAnimation(currentTimerType);
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                dingSound.play();
                resetAnimation();
            }
        }, 1000);
    }
}

export function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    resetAnimation();
}

export function resetTimer() {
    stopTimer();
    // Reset to the current timer type's duration
    switch(currentTimerType) {
        case 'work':
            timeLeft = 25 * 60;
            break;
        case 'shortBreak':
            timeLeft = 5 * 60;
            break;
        case 'longBreak':
            timeLeft = 15 * 60;
            break;
    }
    updateDisplay();
}

export function setTimer(minutes, type) {
    stopTimer();
    timeLeft = minutes * 60;
    currentTimerType = type;
    showAnimation(type);
    updateDisplay();
    resetAnimation();
}

// Initialize event listeners
export function initializeTimer() {
    document.getElementById('start').addEventListener('click', startTimer);
    document.getElementById('stop').addEventListener('click', stopTimer);
    document.getElementById('reset').addEventListener('click', resetTimer);
    document.getElementById('work').addEventListener('click', () => setTimer(25, 'work'));
    document.getElementById('shortBreak').addEventListener('click', () => setTimer(5, 'shortBreak'));
    document.getElementById('longBreak').addEventListener('click', () => setTimer(15, 'longBreak'));
}
