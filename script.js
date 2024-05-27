let box_height = 500;
let box_width = 800;

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
ctx.fillStyle = "red";
let snakeCells = [[0, 0]];
let cell = 25;
let count = 0;

let direction = "right";
let gameOver = false;

let currentScore = 0;
let highScore = localStorage.getItem("highScore") || 0;

// Function to update the score
function updateScore() {
  currentScore++;
  if (currentScore > highScore) {
    highScore = currentScore;
    localStorage.setItem("highScore", highScore);
  }
}

// Function to draw the score on the canvas
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + currentScore, 10, 30);
  ctx.fillText("High Score: " + highScore, 10, 60);
}

let foodCell = generateRandomCell();
let id = setInterval(() => {
  draw();
  update();
}, 100);

document.addEventListener("keydown", (e) => {
  if (
    (e.key === "ArrowDown" && direction !== "up") ||
    (e.key === "ArrowUp" && direction !== "down") ||
    (e.key === "ArrowLeft" && direction !== "right") ||
    (e.key === "ArrowRight" && direction !== "left")
  ) {
    if (e.key === "ArrowDown") {
      direction = "down";
    } else if (e.key === "ArrowUp") {
      direction = "up";
    } else if (e.key === "ArrowLeft") {
      direction = "left";
    } else {
      direction = "right";
    }
  }
});

function draw() {
  if (gameOver) {
    clearInterval(id);
    ctx.fillText("Game Over", 50, 100);
    return;
  }
  ctx.clearRect(0, 0, box_width, box_height);
  drawScore();
  for (let i = 0; i < snakeCells.length - 1; i++) {
    ctx.fillStyle = "black"; // Body color
    ctx.fillRect(snakeCells[i][0], snakeCells[i][1], cell, cell);
  }
  let headX = snakeCells[snakeCells.length - 1][0];
  let headY = snakeCells[snakeCells.length - 1][1];
  ctx.fillStyle = "green"; // Head color
  ctx.fillRect(headX, headY, cell, cell);

  // Draw eyes on snake's head
  ctx.fillStyle = "white"; // Eye color
  if (direction === "right") {
    // Eyes when moving right
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.25,
      headY + cell * 0.35,
      cell * 0.15,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.25,
      headY + cell * 0.65,
      cell * 0.15,
      0,
      Math.PI * 2
    );
    ctx.fill();
    // Black dots
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.3,
      headY + cell * 0.35,
      cell * 0.05,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.3,
      headY + cell * 0.65,
      cell * 0.05,
      0,
      Math.PI * 2
    );
    ctx.fill();
  } else if (direction === "up") {
    // Eyes when moving up
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.35,
      headY + cell * 0.25,
      cell * 0.15,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.65,
      headY + cell * 0.25,
      cell * 0.15,
      0,
      Math.PI * 2
    );
    ctx.fill();
    // Black dots
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.35,
      headY + cell * 0.3,
      cell * 0.05,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.65,
      headY + cell * 0.3,
      cell * 0.05,
      0,
      Math.PI * 2
    );
    ctx.fill();
  } else if (direction === "left") {
    // Eyes when moving left
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.75,
      headY + cell * 0.35,
      cell * 0.15,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.75,
      headY + cell * 0.65,
      cell * 0.15,
      0,
      Math.PI * 2
    );
    ctx.fill();
    // Black dots
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.7,
      headY + cell * 0.35,
      cell * 0.05,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.7,
      headY + cell * 0.65,
      cell * 0.05,
      0,
      Math.PI * 2
    );
    ctx.fill();
  } else {
    // Eyes when moving down
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.35,
      headY + cell * 0.75,
      cell * 0.15,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.65,
      headY + cell * 0.75,
      cell * 0.15,
      0,
      Math.PI * 2
    );
    ctx.fill();
    // Black dots
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.35,
      headY + cell * 0.7,
      cell * 0.05,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      headX + cell * 0.65,
      headY + cell * 0.7,
      cell * 0.05,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.fillStyle = "red"; // Food color
  ctx.fillRect(foodCell[0], foodCell[1], cell, cell);
}

function update() {
  let headX = snakeCells[snakeCells.length - 1][0];
  let headY = snakeCells[snakeCells.length - 1][1];

  let newX;
  let newY;

  if (direction === "right") {
    newX = headX + cell;
    newY = headY;
    if (newX === box_width) {
      gameOver = true;
    }
  } else if (direction === "up") {
    newX = headX;
    newY = headY - cell;
    if (newY < 0) {
      gameOver = true;
    }
  } else if (direction === "left") {
    newX = headX - cell;
    newY = headY;
    if (newX < 0) {
      gameOver = true;
    }
  } else {
    newX = headX;
    newY = headY + cell;
    if (newY === box_height) {
      gameOver = true;
    }
  }
  if(snakeCollision(newX, newY)){
    gameOver = true;
  }
  if (gameOver == true) {
    playCollisionSound();
    backgroundMusic.pause();
  } else {
    backgroundMusic.play();
  }

  snakeCells.push([newX, newY]);

  if (newX === foodCell[0] && newY === foodCell[1]) {
    playEatSound();
    eatSound.volume = 0.8;
    foodCell = generateRandomCell();
    count++;
  } else {
    snakeCells.shift();
  }
}

function snakeCollision(x, y) {
  for (let cell of snakeCells) {
    if (cell[0] === x && cell[1] === y) {
      return true;
    }
  }
  return false;
}

function generateRandomCell() {
  return [
    Math.round((Math.random() * 750) / cell) * cell,
    Math.round((Math.random() * 450) / cell) * cell,
  ];
}

//.................................Sound Effect...............
// JavaScript
// Define audio elements
const eatSound = new Audio("eat.mp3"); // Sound for eating food
const collisionSound = new Audio("collision.mp3"); // Sound for colliding with obstacles
const backgroundMusic = new Audio("background_music.mp3"); // Background music
// Play eat sound when snake eats food
function playEatSound() {
  eatSound.play();
}

// Play collision sound when snake collides with obstacles
function playCollisionSound() {
  collisionSound.play();
}

// Play background music
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5; // Adjust volume as needed
// backgroundMusic.play();

//.................................Sound Effect...............
