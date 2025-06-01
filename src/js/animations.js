// Animation elements
const workAnimation = document.getElementById('workAnimation');
const shortBreakAnimation = document.getElementById('shortBreakAnimation');
const longBreakAnimation = document.getElementById('longBreakAnimation');

// Work animation elements
const workTomato1 = document.getElementById('workTomato1');
const workTomato2 = document.getElementById('workTomato2');

// Short break animation elements
const shortBreakTomato1 = document.getElementById('shortBreakTomato1');
const shortBreakTomato2 = document.getElementById('shortBreakTomato2');

// Long break animation elements
const longBreakTomato1 = document.getElementById('longBreakTomato1');
const longBreakTomato2 = document.getElementById('longBreakTomato2');

let isTomato1Visible = true;

export function toggleAnimation(currentTimerType) {
    switch(currentTimerType) {
        case 'work':
            if (isTomato1Visible) {
                workTomato1.style.display = 'none';
                workTomato2.style.display = 'block';
            } else {
                workTomato1.style.display = 'block';
                workTomato2.style.display = 'none';
            }
            break;
        case 'shortBreak':
            if (isTomato1Visible) {
                shortBreakTomato1.style.display = 'none';
                shortBreakTomato2.style.display = 'block';
            } else {
                shortBreakTomato1.style.display = 'block';
                shortBreakTomato2.style.display = 'none';
            }
            break;
        case 'longBreak':
            if (isTomato1Visible) {
                longBreakTomato1.style.display = 'none';
                longBreakTomato2.style.display = 'block';
            } else {
                longBreakTomato1.style.display = 'block';
                longBreakTomato2.style.display = 'none';
            }
            break;
    }
    isTomato1Visible = !isTomato1Visible;
}

export function resetAnimation() {
    // Reset all animations to their first frame
    workTomato1.style.display = 'block';
    workTomato2.style.display = 'none';
    shortBreakTomato1.style.display = 'block';
    shortBreakTomato2.style.display = 'none';
    longBreakTomato1.style.display = 'block';
    longBreakTomato2.style.display = 'none';
    isTomato1Visible = true;
}

export function showAnimation(type) {
    // Hide all animations
    workAnimation.style.display = 'none';
    shortBreakAnimation.style.display = 'none';
    longBreakAnimation.style.display = 'none';
    
    // Show the appropriate animation
    switch(type) {
        case 'work':
            workAnimation.style.display = 'block';
            break;
        case 'shortBreak':
            shortBreakAnimation.style.display = 'block';
            break;
        case 'longBreak':
            longBreakAnimation.style.display = 'block';
            break;
    }
}
