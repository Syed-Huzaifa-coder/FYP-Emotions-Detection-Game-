// Game Data
const emotions = {
    easy: [
        { name: "Happy", image: "images/easy/happy.png", sound: "sounds/happy.mp3" },
        { name: "Sad", image: "images/easy/sad.png", sound: "sounds/sad.mp3" },
        { name: "Angry", image: "images/easy/angry.png", sound: "sounds/angry.mp3" },
        { name: "Surprised", image: "images/easy/surprised.png", sound: "sounds/surprised.mp3" }
    ],
    medium: [
        { name: "Happy", image: "images/medium/happy-m.png", sound: "sounds/happy.mp3" },
        { name: "Sad", image: "images/medium/sad-m.png", sound: "sounds/sad.mp3" },
        { name: "Angry", image: "images/medium/angry-m.png", sound: "sounds/angry.mp3" },
        { name: "Surprised", image: "images/medium/surprised-m.png", sound: "sounds/surprised.mp3" },
        { name: "Scared", image: "images/medium/scared-m.png", sound: "sounds/scared.mp3" },
        { name: "Disgusted", image: "images/medium/disgusted-m.png", sound: "sounds/disgusted.mp3" },
        { name: "Confused", image: "images/medium/confused-m.png", sound: "sounds/confused.mp3" },
        { name: "Excited", image: "images/medium/excited-m.png", sound: "sounds/excited.mp3" }
    ],
    hard: [
        { name: "Happy", image: "images/hard/happy-real.png", sound: "sounds/happy.mp3" },
        { name: "Sad", image: "images/hard/sad-real.png", sound: "sounds/sad.mp3" },
        { name: "Angry", image: "images/hard/angry-real.png", sound: "sounds/angry.mp3" },
        { name: "Surprised", image: "images/hard/surprised-real.png", sound: "sounds/surprised.mp3" },
        { name: "Scared", image: "images/hard/scared-real.png", sound: "sounds/scared.mp3" },
        { name: "Disgusted", image: "images/hard/disgusted-real.png", sound: "sounds/disgusted.mp3" },
        { name: "Confused", image: "images/hard/confused-real.png", sound: "sounds/confused.mp3" },
        { name: "Excited", image: "images/hard/excited-real.png", sound: "sounds/excited.mp3" },
        { name: "Proud", image: "images/hard/proud-real.png", sound: "sounds/proud.mp3" },
        { name: "Embarrassed", image: "images/hard/embarrassed-real.png", sound: "sounds/embarrassed.mp3" }
    ]
};

const emojis = {
    "Happy": "😊",
    "Sad": "😢",
    "Angry": "😠",
    "Surprised": "😲",
    "Scared": "😨",
    "Disgusted": "🤢",
    "Confused": "😕",
    "Excited": "🤩",
    "Proud": "🦸",
    "Embarrassed": "😳"
};

// Game State
let currentLevel = 'easy';
let score = 0;
let currentQuestion = 0;
let questionsPerRound = 5;
let timer;
let timeLeft = 60;
let soundEnabled = true;
let musicEnabled = true;
let userType = '';
let userName = '';
let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
let correctEmotion = null;

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const gameScreen = document.getElementById('game-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const victoryScreen = document.getElementById('victory-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const userTypeSelect = document.getElementById('user-type');
const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('start-btn');
const levelDisplay = document.getElementById('level-display');
const playerNameDisplay = document.getElementById('player-name');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer');
const questionText = document.getElementById('question-text');
const emotionImage = document.getElementById('emotion-image');
const optionsContainer = document.getElementById('options-container');
const feedbackText = document.getElementById('feedback-text');
const feedbackEmoji = document.getElementById('feedback-emoji');
const nextBtn = document.getElementById('next-btn');
const soundToggle = document.getElementById('sound-toggle');
const musicToggle = document.getElementById('music-toggle');
const backToGameBtn = document.getElementById('back-to-game');
const continueBtn = document.getElementById('continue-btn');
const dashboardBtn = document.getElementById('dashboard-btn');
const childNameDisplay = document.getElementById('child-name');
const currentLevelDisplay = document.getElementById('current-level');
const accuracyDisplay = document.getElementById('accuracy');
const totalQuestionsDisplay = document.getElementById('total-questions');
const strengthsList = document.getElementById('strengths-list');
const weaknessesList = document.getElementById('weaknesses-list');
const recommendationText = document.getElementById('recommendation-text');
const progressChart = document.getElementById('progress-chart');
const levelUpContainer = document.getElementById('level-up-container');
const nextLevelDisplay = document.getElementById('next-level');
const levelUpBtn = document.getElementById('level-up-btn');
const character = document.getElementById('character');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const finalScoreDisplay = document.getElementById('final-score');
const gameoverTotalQuestions = document.getElementById('gameover-total-questions');
const tryAgainBtn = document.getElementById('try-again-btn');
const gameoverDashboardBtn = document.getElementById('gameover-dashboard-btn');

// Audio Elements
const backgroundMusic = document.getElementById('background-music');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const victorySound = document.getElementById('victory-sound');
const levelUpSound = document.getElementById('levelup-sound');
const gameoverSound = document.getElementById('gameover-sound');

// Event Listeners
startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', nextQuestion);
soundToggle.addEventListener('click', toggleSound);
musicToggle.addEventListener('click', toggleMusic);
backToGameBtn.addEventListener('click', () => {
    dashboardScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
});
continueBtn.addEventListener('click', continuePlaying);
dashboardBtn.addEventListener('click', showDashboard);
levelUpBtn.addEventListener('click', levelUp);
tryAgainBtn.addEventListener('click', tryAgain);
gameoverDashboardBtn.addEventListener('click', showDashboard);

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const level = btn.dataset.level;
        setDifficulty(level);
    });
});

// Initialize the game
function init() {
    const savedGame = JSON.parse(localStorage.getItem('gameState')) || {};
    currentLevel = savedGame.level || 'easy';
    score = savedGame.score || 0;
    userName = savedGame.userName || '';
    userType = savedGame.userType || 'child';
    soundEnabled = savedGame.soundEnabled !== false;
    musicEnabled = savedGame.musicEnabled !== false;
    
    updateSoundIcons();
    if (userName) usernameInput.value = userName;
    if (userType) userTypeSelect.value = userType;
    
    setActiveDifficultyButton();
}

function startGame() {
    userType = userTypeSelect.value;
    userName = usernameInput.value.trim();
    
    if (!userName) {
        alert("Please enter your name");
        return;
    }
    
    const gameState = {
        userName,
        userType,
        level: currentLevel,
        score: 0,
        soundEnabled,
        musicEnabled
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
    
    playerNameDisplay.textContent = userName;
    
    if (userType === 'child') {
        loginScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        startRound();
    } else {
        loginScreen.classList.add('hidden');
        dashboardScreen.classList.remove('hidden');
        showDashboard();
    }
    
    if (musicEnabled) {
        backgroundMusic.volume = 0.3;
        backgroundMusic.play().catch(e => console.log("Audio play prevented:", e));
    }
}

function setDifficulty(level) {
    currentLevel = level;
    levelDisplay.textContent = level.charAt(0).toUpperCase() + level.slice(1);
    setActiveDifficultyButton();
    
    const gameState = JSON.parse(localStorage.getItem('gameState')) || {};
    gameState.level = level;
    localStorage.setItem('gameState', JSON.stringify(gameState));
    
    startRound();
}

function setActiveDifficultyButton() {
    difficultyBtns.forEach(btn => {
        if (btn.dataset.level === currentLevel) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function startRound() {
    score = 0;
    currentQuestion = 0;
    updateScore();
    startTimer();
    showQuestion();
}

function startTimer() {
    timeLeft = currentLevel === 'easy' ? 60 : currentLevel === 'medium' ? 45 : 30;
    updateTimer();
    
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            showGameOver();
        }
    }, 1000);
}

function showQuestion() {
    const levelEmotions = emotions[currentLevel];
    correctEmotion = levelEmotions[Math.floor(Math.random() * levelEmotions.length)];
    
    const wrongOptionsCount = currentLevel === 'easy' ? 3 : 4;
    let wrongOptions = levelEmotions.filter(e => e.name !== correctEmotion.name);
    wrongOptions = shuffleArray(wrongOptions).slice(0, wrongOptionsCount);
    
    const options = shuffleArray([correctEmotion, ...wrongOptions]);
    
    questionText.textContent = "How is this person feeling?";
    emotionImage.src = correctEmotion.image;
    emotionImage.alt = correctEmotion.name;
    
    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = `${option.name} ${emojis[option.name] || ''}`;
        button.addEventListener('click', () => checkAnswer(option.name === correctEmotion.name, correctEmotion));
        optionsContainer.appendChild(button);
    });
    
    nextBtn.classList.add('hidden');
    feedbackText.textContent = '';
    feedbackText.className = '';
    feedbackEmoji.textContent = '';
    
    character.classList.remove('animate__bounce', 'animate__shakeX');
    void character.offsetWidth;
    character.classList.add('animate__bounce');
}

function checkAnswer(isCorrect, emotion) {
    clearInterval(timer);
    recordAttempt(isCorrect, emotion.name);
    
    if (isCorrect) {
        score++;
        updateScore();
        feedbackText.textContent = `Correct! This person is feeling ${emotion.name}.`;
        feedbackText.className = 'correct-feedback';
        feedbackEmoji.textContent = emojis[emotion.name] || '👍';
        
        if (soundEnabled && emotion.sound) {
            const sound = new Audio(emotion.sound);
            sound.volume = 0.5;
            sound.play();
        } else if (soundEnabled) {
            correctSound.play();
        }
        
        character.src = "images/character-happy.png";
        character.classList.remove('animate__bounce');
        character.classList.add('animate__tada');
    } else {
        feedbackText.textContent = `Almost! This person is actually feeling ${emotion.name}.`;
        feedbackText.className = 'wrong-feedback';
        feedbackEmoji.textContent = emojis[emotion.name] || '👎';
        
        if (soundEnabled) wrongSound.play();
        
        character.src = "images/character-sad.png";
        character.classList.remove('animate__bounce');
        character.classList.add('animate__shakeX');
    }
    
    nextBtn.classList.remove('hidden');
}

function recordAttempt(isCorrect, emotion) {
    gameHistory.push({
        date: new Date().toISOString(),
        level: currentLevel,
        emotion,
        correct: isCorrect,
        timeSpent: (currentLevel === 'easy' ? 60 : currentLevel === 'medium' ? 45 : 30) - timeLeft
    });
    
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < questionsPerRound) {
        startTimer();
        showQuestion();
    } else {
        endRound();
    }
}

function endRound() {
    clearInterval(timer);
    const accuracy = Math.round((score / questionsPerRound) * 100);
    let readyForNextLevel = false;
    let nextLevel = '';
    
    if (accuracy >= 80) {
        if (currentLevel === 'easy') {
            readyForNextLevel = true;
            nextLevel = 'medium';
        } else if (currentLevel === 'medium') {
            readyForNextLevel = true;
            nextLevel = 'hard';
        }
    }
    
    gameScreen.classList.add('hidden');
    victoryScreen.classList.remove('hidden');
    
    const victoryMessage = document.getElementById('victory-message');
    victoryMessage.textContent = `You got ${score} out of ${questionsPerRound} correct! (${accuracy}%)`;
    
    const stars = document.querySelectorAll('.star');
    const starsToShow = Math.floor((score / questionsPerRound) * 3);
    stars.forEach((star, index) => {
        star.style.display = index < starsToShow ? 'inline' : 'none';
    });
    
    if (readyForNextLevel) {
        levelUpContainer.classList.remove('hidden');
        nextLevelDisplay.textContent = nextLevel.charAt(0).toUpperCase() + nextLevel.slice(1);
        if (soundEnabled) levelUpSound.play();
    } else {
        levelUpContainer.classList.add('hidden');
    }
    
    if (soundEnabled) victorySound.play();
    character.src = "images/character-happy.png";
    character.className = "character";
}

function showGameOver() {
    clearInterval(timer);
    gameScreen.classList.add('hidden');
    gameoverScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = score;
    gameoverTotalQuestions.textContent = questionsPerRound;
    
    if (soundEnabled) {
        gameoverSound.play();
    }
}

function tryAgain() {
    gameoverScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startRound();
}

function continuePlaying() {
    victoryScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startRound();
}

function levelUp() {
    if (currentLevel === 'easy') {
        currentLevel = 'medium';
    } else if (currentLevel === 'medium') {
        currentLevel = 'hard';
    }
    
    const gameState = JSON.parse(localStorage.getItem('gameState')) || {};
    gameState.level = currentLevel;
    localStorage.setItem('gameState', JSON.stringify(gameState));
    
    victoryScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startRound();
}

function showDashboard() {
    gameScreen.classList.add('hidden');
    victoryScreen.classList.add('hidden');
    gameoverScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
    
    childNameDisplay.textContent = `${userName}'s Progress`;
    currentLevelDisplay.textContent = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
    
    const attempts = gameHistory;
    const correctAttempts = attempts.filter(a => a.correct).length;
    const totalAttempts = attempts.length;
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
    
    accuracyDisplay.textContent = `${accuracy}%`;
    totalQuestionsDisplay.textContent = totalAttempts;
    
    const emotionStats = {};
    attempts.forEach(attempt => {
        if (!emotionStats[attempt.emotion]) {
            emotionStats[attempt.emotion] = { correct: 0, total: 0 };
        }
        emotionStats[attempt.emotion].total++;
        if (attempt.correct) emotionStats[attempt.emotion].correct++;
    });
    
    const sortedEmotions = Object.entries(emotionStats)
        .map(([emotion, stats]) => ({
            emotion,
            accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
            total: stats.total
        }))
        .sort((a, b) => b.accuracy - a.accuracy);
    
    strengthsList.innerHTML = '';
    sortedEmotions
        .filter(item => item.total >= 5)
        .slice(0, 3)
        .forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="emotion-name">${item.emotion} ${emojis[item.emotion] || ''}</span>
                           <span class="emotion-accuracy">${item.accuracy}%</span>`;
            strengthsList.appendChild(li);
        });
    
    weaknessesList.innerHTML = '';
    sortedEmotions
        .filter(item => item.total >= 5)
        .slice(-3)
        .reverse()
        .forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="emotion-name">${item.emotion} ${emojis[item.emotion] || ''}</span>
                           <span class="emotion-accuracy">${item.accuracy}%</span>`;
            weaknessesList.appendChild(li);
        });
    
    const currentLevelAttempts = attempts.filter(a => a.level === currentLevel);
    const currentLevelCorrect = currentLevelAttempts.filter(a => a.correct).length;
    const currentLevelAccuracy = currentLevelAttempts.length > 0 
        ? Math.round((currentLevelCorrect / currentLevelAttempts.length) * 100) 
        : 0;
    
    let recommendation = '';
    if (currentLevel === 'easy' && currentLevelAccuracy >= 80 && currentLevelAttempts.length >= 10) {
        recommendation = `Based on ${currentLevelAttempts.length} attempts with ${currentLevelAccuracy}% accuracy, 
                         ${userName} is ready for the Medium level!`;
    } else if (currentLevel === 'medium' && currentLevelAccuracy >= 80 && currentLevelAttempts.length >= 10) {
        recommendation = `Based on ${currentLevelAttempts.length} attempts with ${currentLevelAccuracy}% accuracy, 
                         ${userName} is ready for the Hard level!`;
    } else if (currentLevel === 'hard' && currentLevelAccuracy >= 80) {
        recommendation = `${userName} is doing great with the Hard level! Keep practicing to maintain ${currentLevelAccuracy}% accuracy.`;
    } else if (currentLevelAttempts.length > 0) {
        recommendation = `Based on ${currentLevelAttempts.length} attempts with ${currentLevelAccuracy}% accuracy, 
                         we recommend continuing with the ${currentLevel} level. 
                         ${userName} should aim for 80% accuracy before moving up.`;
    } else {
        recommendation = `Not enough data yet. Keep playing to get a level recommendation!`;
    }
    
    recommendationText.textContent = recommendation;
    updateProgressChart();
}

function updateProgressChart() {
    const dateMap = {};
    gameHistory.forEach(attempt => {
        const date = attempt.date.split('T')[0];
        if (!dateMap[date]) {
            dateMap[date] = { correct: 0, total: 0 };
        }
        dateMap[date].total++;
        if (attempt.correct) dateMap[date].correct++;
    });
    
    const dates = Object.keys(dateMap).sort();
    const accuracies = dates.map(date => {
        const stats = dateMap[date];
        return Math.round((stats.correct / stats.total) * 100);
    });
    
    const ctx = progressChart.getContext('2d');
    
    if (window.progressChartInstance) {
        window.progressChartInstance.destroy();
    }
    
    window.progressChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Daily Accuracy (%)',
                data: accuracies,
                borderColor: '#4a6fa5',
                backgroundColor: 'rgba(74, 111, 165, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#4a6fa5',
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Accuracy (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const date = context.label;
                            const stats = dateMap[date];
                            return `Correct: ${stats.correct}/${stats.total}`;
                        }
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    updateSoundIcons();
    
    const gameState = JSON.parse(localStorage.getItem('gameState')) || {};
    gameState.soundEnabled = soundEnabled;
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    updateSoundIcons();
    
    if (musicEnabled) {
        backgroundMusic.play().catch(e => console.log("Audio play prevented:", e));
    } else {
        backgroundMusic.pause();
    }
    
    const gameState = JSON.parse(localStorage.getItem('gameState')) || {};
    gameState.musicEnabled = musicEnabled;
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function updateSoundIcons() {
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    musicToggle.textContent = musicEnabled ? '🎵' : '🎵❌';
}

function updateScore() {
    scoreDisplay.textContent = score;
}

function updateTimer() {
    timerDisplay.textContent = timeLeft;
    
    if (timeLeft <= 10) {
        timerDisplay.style.color = '#e74c3c';
        timerDisplay.classList.add('pulse');
    } else {
        timerDisplay.style.color = '#e67e22';
        timerDisplay.classList.remove('pulse');
    }
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

document.addEventListener('DOMContentLoaded', init);