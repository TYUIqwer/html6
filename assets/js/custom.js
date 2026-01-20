document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.getElementById('game-board');
  const difficultySelect = document.getElementById('difficulty');
  const startBtn = document.getElementById('start-btn');
  const restartBtn = document.getElementById('restart-btn');
  const movesDisplay = document.getElementById('moves');
  const matchesDisplay = document.getElementById('matches');
  const timerDisplay = document.getElementById('timer');
  const winMessage = document.getElementById('win-message');
  const bestEasyDisplay = document.getElementById('best-easy');
  const bestHardDisplay = document.getElementById('best-hard');

  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let seconds = 0;
  let gameActive = false;
  let currentDifficulty = 'easy';
  let timerInterval = null;

  const cardData = [
    '🍎', '🍌', '🍒', '🍇', '🍊', '🍓',
    '🍑', '🍍', '🥝', '🥥', '🍉', '🍋'
  ];

  function loadBestScores() {
    const bestEasy = localStorage.getItem('memory-best-easy');
    const bestHard = localStorage.getItem('memory-best-hard');
    bestEasyDisplay.textContent = bestEasy ? bestEasy : '–';
    bestHardDisplay.textContent = bestHard ? bestHard : '–';
  }

  function saveBestScore(difficulty, moves) {
    const key = difficulty === 'easy' ? 'memory-best-easy' : 'memory-best-hard';
    const currentBest = localStorage.getItem(key);
    if (!currentBest || moves < parseInt(currentBest)) {
      localStorage.setItem(key, moves.toString());
      loadBestScores();
    }
  }

  function resetTimer() {
    if (timerInterval) clearInterval(timerInterval);
    seconds = 0;
    timerDisplay.textContent = '0s';
  }

  function initGame() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameActive = true;
    movesDisplay.textContent = '0';
    matchesDisplay.textContent = '0';
    winMessage.classList.add('hidden');

    resetTimer();

    const numPairs = currentDifficulty === 'easy' ? 6 : 12;
    const selectedIcons = cardData.slice(0, numPairs);
    const gameIcons = [...selectedIcons, ...selectedIcons];
    const shuffled = [...gameIcons].sort(() => Math.random() - 0.5);

    gameBoard.innerHTML = '';
    gameBoard.className = 'game-board ' + (currentDifficulty === 'easy' ? 'easy-mode' : 'hard-mode');

    shuffled.forEach(icon => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.icon = icon;
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">?</div>
          <div class="card-back">${icon}</div>
        </div>
      `;
      card.addEventListener('click', flipCard);
      gameBoard.appendChild(card);
    });

    timerInterval = setInterval(() => {
      seconds++;
      timerDisplay.textContent = seconds + 's';
    }, 1000);
  }

  function flipCard() {
    if (!gameActive) return;
    if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      moves++;
      movesDisplay.textContent = moves;

      const [card1, card2] = flippedCards;
      const isMatch = card1.dataset.icon === card2.dataset.icon;

      if (isMatch) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        matchesDisplay.textContent = matchedPairs;
        flippedCards = [];

        const totalPairs = currentDifficulty === 'easy' ? 6 : 12;
        if (matchedPairs === totalPairs) {
          gameActive = false;
          clearInterval(timerInterval);
          winMessage.classList.remove('hidden');
          saveBestScore(currentDifficulty, moves);
        }
      } else {
        setTimeout(() => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          flippedCards = [];
        }, 1000);
      }
    }
  }

  difficultySelect.addEventListener('change', (e) => {
    currentDifficulty = e.target.value;
    if (gameActive) initGame();
  });

  startBtn.addEventListener('click', () => {
    currentDifficulty = difficultySelect.value;
    initGame();
  });

  restartBtn.addEventListener('click', () => {
    currentDifficulty = difficultySelect.value;
    initGame();
  });

  loadBestScores();
});