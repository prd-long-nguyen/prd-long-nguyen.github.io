// Quiz data
const quizData = [
    { answer: "Thái độ", scramble: "đ/á/i/h/ộ/t" },
    { answer: "Xây dựng", scramble: "n/g/ự/y/â/d/x" },
    { answer: "Từ thiện", scramble: "t/h/ừ/i/n/ệ/t" },
    { answer: "Ngựa ô", scramble: "ự/a/g/ô/n" },
    { answer: "Cá mè", scramble: "m/á/c/è" },
    { answer: "Con cua", scramble: "a/c/c/o/u/n" },
    { answer: "Ăn chắc mặc dày", scramble: "mặc/ăn/dày/chắc" },
    { answer: "Ăn kĩ no lâu, cầy sâu tốt lúa", scramble: "cầy/kĩ/ăn/tốt/no/sâu/lúa/lâu" },
    { answer: "Ngựa chạy có bầy chim bay có bạn", scramble: "bầy/chim/bay/có/ngựa/bầy/có/bạn" },
    { answer: "No mất ngon, giận mất khôn", scramble: "khôn/no/ngon/giận/mất/mất" }
];

// State management
let currentLevel = 0;
let currentState = 'start'; // 'start' | 'question' | 'reveal' | 'transition' | 'end'

// DOM elements
const tilesContainer = document.getElementById('tilesContainer');
const answerContainer = document.getElementById('answerContainer');
const answerText = document.getElementById('answerText');
const levelBadge = document.getElementById('levelBadge');
const timelineFill = document.getElementById('timelineFill');

// Screens
const startScreen = document.getElementById('startScreen');
const gameContent = document.getElementById('gameContent');
const endScreen = document.getElementById('endScreen');

// Buttons
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

// Navigation
function showScreen(screenName) {
    // Hide all
    startScreen.classList.remove('active');
    gameContent.classList.remove('active');
    endScreen.classList.remove('active');
    
    // Show target
    if (screenName === 'start') startScreen.classList.add('active');
    if (screenName === 'game') gameContent.classList.add('active');
    if (screenName === 'end') endScreen.classList.add('active');
}

// Initialize the quiz
function init() {
    currentLevel = 0;
    currentState = 'start';
    showScreen('start');
    loadLevel(currentLevel);
}

function startGame() {
    currentState = 'question';
    showScreen('game');
}

// Load a specific level
function loadLevel(levelIndex) {
    if (levelIndex >= quizData.length) {
        showEndScreen();
        return;
    }

    const data = quizData[levelIndex];
    const tiles = data.scramble.split('/');

    // Update UI
    levelBadge.textContent = `Câu ${levelIndex + 1} / ${quizData.length}`;
    updateProgress(levelIndex);


    // Clear and populate tiles
    tilesContainer.innerHTML = '';
    tiles.forEach((tile, index) => {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        tileElement.textContent = tile;
        tileElement.style.animationDelay = `${index * 0.1}s`;
        tilesContainer.appendChild(tileElement);
    });

    // Set answer text but hide it
    answerText.textContent = data.answer;
    answerContainer.classList.remove('visible');

    currentState = 'question';
}

// Update timeline
function updateProgress(levelIndex) {
    const percentage = ((levelIndex) / quizData.length) * 100;
    timelineFill.style.width = `${percentage}%`;
}

// Reveal the answer
function revealAnswer() {
    answerContainer.classList.add('visible');
    currentState = 'reveal';
}

// Go to next level
function nextLevel() {
    currentState = 'transition';
    
    // Add fade out animation
    tilesContainer.classList.add('fade-out');
    answerContainer.classList.add('fade-out');

    setTimeout(() => {
        tilesContainer.classList.remove('fade-out');
        answerContainer.classList.remove('fade-out');
        currentLevel++;
        loadLevel(currentLevel);
    }, 400);
}

// Show end screen
function showEndScreen() {
    currentState = 'end';
    showScreen('end');
    updateProgress(quizData.length);
}

// Go back to previous level or previous state
function goBack() {
    if (currentState === 'transition' || currentState === 'start' || currentState === 'end') return;

    // If answer is revealed, hide it (go back to question state)
    if (currentState === 'reveal') {
        answerContainer.classList.remove('visible');
        currentState = 'question';
        return;
    }

    // If in question state, go back to previous level
    if (currentState === 'question' && currentLevel > 0) {
        currentState = 'transition';
        tilesContainer.classList.add('fade-out');
        // answerContainer is already hidden in 'question' state

        setTimeout(() => {
            tilesContainer.classList.remove('fade-out');
            currentLevel--;
            loadLevel(currentLevel);
        }, 400);
    }
}

// Handle progression
function handleProgression() {
    if (currentState === 'transition') return;

    if (currentState === 'question') {
        revealAnswer();
    } else if (currentState === 'reveal') {
        nextLevel();
    }
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault();
        handleProgression();
    } else if (e.code === 'ArrowLeft' || e.code === 'Backspace') {
        e.preventDefault();
        goBack();
    }
});

document.addEventListener('click', (e) => {
    // Global click disabled for progression
    // Only specific buttons trigger actions now
    return;
});

startBtn.addEventListener('click', () => {
     startGame();
});

restartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Reset and go to game
    init();
    startGame();
});

// Start the quiz
init();
