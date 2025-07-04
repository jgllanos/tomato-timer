import { toggleAnimation, resetAnimation, showAnimation } from './animations.js';

const DISPLAY_UPDATE_INTERVAL = 100; // Update display every 100ms
const ANIMATION_INTERVAL = 1000; // Animate every 1000ms (1 second)

let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let currentTimerType = 'work'; // 'work', 'shortBreak', or 'longBreak'
let startTime = null;
let expectedTimeLeft = null;
let lastAnimationTime = 0;

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
        startTime = Date.now();
        lastAnimationTime = startTime;
        expectedTimeLeft = timeLeft;
        
        timerId = setInterval(() => {
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            timeLeft = Math.max(0, expectedTimeLeft - elapsedSeconds);
            
            updateDisplay();
            
            // Animate every second based on elapsed time
            if (currentTime - lastAnimationTime >= ANIMATION_INTERVAL) {
                toggleAnimation(currentTimerType);
                lastAnimationTime = currentTime;
            }
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                dingSound.play();
                resetAnimation();
                // Trigger confetti if work timer finished
                if (currentTimerType === 'work' && window.confetti) {
                    confetti({
                        particleCount: 200,
                        spread: 90,
                        origin: { y: 0.6 },
                        zIndex: 9999
                    });
                }
            }
        }, DISPLAY_UPDATE_INTERVAL);
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
    const startStopButton = document.getElementById('startStop');
    startStopButton.addEventListener('click', () => {
        if (timerId === null) {
            startTimer();
            startStopButton.textContent = 'Stop';
            startStopButton.classList.add('stopping');
        } else {
            stopTimer();
            startStopButton.textContent = 'Start';
            startStopButton.classList.remove('stopping');
        }
    });
    document.getElementById('reset').addEventListener('click', () => {
        resetTimer();
        startStopButton.textContent = 'Start';
        startStopButton.classList.remove('stopping');
    });
    document.getElementById('work').addEventListener('click', () => {
        setTimer(25, 'work');
        startStopButton.textContent = 'Start';
        startStopButton.classList.remove('stopping');
    });
    document.getElementById('shortBreak').addEventListener('click', () => {
        setTimer(5, 'shortBreak');
        startStopButton.textContent = 'Start';
        startStopButton.classList.remove('stopping');
    });
    document.getElementById('longBreak').addEventListener('click', () => {
        setTimer(15, 'longBreak');
        startStopButton.textContent = 'Start';
        startStopButton.classList.remove('stopping');
    });
    // Add confetti trigger for YAY! button
    document.getElementById('yay').addEventListener('click', () => {
        if (window.confetti) {
            confetti({
                particleCount: 200,
                spread: 90,
                origin: { y: 0.6 },
                zIndex: 9999
            });
        }
    });
}
