let playerScore = 0;
let computerScore = 0;
let roundWinner = '';

function playRound(playerSelection, computerSelection) {
  if (playerSelection === computerSelection) {
    roundWinner = 'tie';
  }
  if (
    (playerSelection === 'ROCK' && computerSelection === 'SCISSORS') ||
    (playerSelection === 'SCISSORS' && computerSelection === 'PAPER') ||
    (playerSelection === 'PAPER' && computerSelection === 'ROCK')
  ) {
    playerScore++;
    roundWinner = 'player';
  }
  if (
    (computerSelection === 'ROCK' && playerSelection === 'SCISSORS') ||
    (computerSelection === 'SCISSORS' && playerSelection === 'PAPER') ||
    (computerSelection === 'PAPER' && playerSelection === 'ROCK')
  ) {
    computerScore++;
    roundWinner = 'computer';
  }
  updateScoreMessage(roundWinner, playerSelection, computerSelection);
}

function getRandomChoice() {
  const randomNumber = Math.floor(Math.random() * 3);
  return ['ROCK', 'PAPER', 'SCISSORS'][randomNumber];
}

function isGameOver() {
  return playerScore === 5 || computerScore === 5;
}

// UI

const scoreInfo = document.getElementById('scoreInfo');
const scoreMessage = document.getElementById('scoreMessage');
const playerScorePara = document.getElementById('playerScore');
const computerScorePara = document.getElementById('computerScore');
const playerSign = document.getElementById('playerSign');
const computerSign = document.getElementById('computerSign');
const rockBtn = document.getElementById('rockBtn');
const paperBtn = document.getElementById('paperBtn');
const scissorsBtn = document.getElementById('scissorsBtn');
const endgameModal = document.getElementById('endgameModal');
const endgameMsg = document.getElementById('endgameMsg');
const overlay = document.getElementById('overlay');
const restartBtn = document.getElementById('restartBtn');

rockBtn.addEventListener('click', () => handleClick('ROCK'));
paperBtn.addEventListener('click', () => handleClick('PAPER'));
scissorsBtn.addEventListener('click', () => handleClick('SCISSORS'));
restartBtn.addEventListener('click', restartGame);
overlay.addEventListener('click', closeEndgameModal);

function handleClick(playerSelection) {
  if (isGameOver()) {
    openEndgameModal();
    return;
  }

  const computerSelection = getRandomChoice();
  playRound(playerSelection, computerSelection);
  updateChoices(playerSelection, computerSelection);
  updateScore();

  if (isGameOver()) {
    openEndgameModal();
    setFinalMessage();
    if (playerScore > computerScore) {
      showConfetti(); // Trigger confetti on win
    }
  }
}

function updateChoices(playerSelection, computerSelection) {
  const signs = { ROCK: '✊', PAPER: '✋', SCISSORS: '✌' };
  playerSign.textContent = signs[playerSelection];
  computerSign.textContent = signs[computerSelection];
}

function updateScore() {
  scoreInfo.textContent = roundWinner === 'tie' ? "It's a tie!" : roundWinner === 'player' ? 'You won!' : 'You lost!';
  playerScorePara.textContent = `Player: ${playerScore}`;
  computerScorePara.textContent = `Computer: ${computerScore}`;
}

function updateScoreMessage(winner, playerSelection, computerSelection) {
  const action = winner === 'player' ? 'beats' : 'is beaten by';
  scoreMessage.textContent =
    winner === 'tie'
      ? `${capitalize(playerSelection)} ties with ${computerSelection.toLowerCase()}`
      : `${capitalize(playerSelection)} ${action} ${computerSelection.toLowerCase()}`;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function openEndgameModal() {
  endgameModal.classList.add('active');
  overlay.classList.add('active');
}

function closeEndgameModal() {
  endgameModal.classList.remove('active');
  overlay.classList.remove('active');
}

function setFinalMessage() {
  endgameMsg.textContent = playerScore > computerScore ? 'You won!' : 'You lost...';
}

function restartGame() {
  playerScore = 0;
  computerScore = 0;
  scoreInfo.textContent = 'Choose your weapon';
  scoreMessage.textContent = 'First to score 5 points wins the game';
  playerScorePara.textContent = 'Player: 0';
  computerScorePara.textContent = 'Computer: 0';
  playerSign.textContent = '❔';
  computerSign.textContent = '❔';
  endgameModal.classList.remove('active');
  overlay.classList.remove('active');
}

function showConfetti() {
  const confettiCount = 150;
  const canvas = document.getElementById('world');
  const context = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: confettiCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    dx: Math.random() * 3 - 1.5,
    dy: Math.random() * 3 + 2,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    size: Math.random() * 5 + 2,
  }));

  function drawConfetti() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      context.fillStyle = p.color;
      context.fillRect(p.x, p.y, p.size, p.size);
      p.x += p.dx;
      p.y += p.dy;
      if (p.y > canvas.height) p.y = -p.size;
      if (p.x > canvas.width) p.x = -p.size;
    });
    requestAnimationFrame(drawConfetti);
  }

  drawConfetti();
}