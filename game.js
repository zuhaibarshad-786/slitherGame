const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Snake setup
let snake = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 2,
  body: [],
  maxLength: 100, // how many segments (will increase as we grow)
};

// Mouse setup
let mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Distance helper
function getDistance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

// Food pellet setup
const foodCount = 50;
let foodList = [];

// Generate random food pellets
function spawnFood() {
  for (let i = 0; i < foodCount; i++) {
    foodList.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 5,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
    });
  }
}
spawnFood();


function draw() {
  // Clear background
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Move snake head toward mouse
  let angle = Math.atan2(mouse.y - snake.y, mouse.x - snake.x);
  let distance = getDistance(snake.x, snake.y, mouse.x, mouse.y);

  if (distance > 1) {
    snake.x += Math.cos(angle) * snake.speed;
    snake.y += Math.sin(angle) * snake.speed;
  }

  // Save head position to body array
  snake.body.unshift({ x: snake.x, y: snake.y });

  // Limit tail length
  if (snake.body.length > snake.maxLength) {
    snake.body.pop();
  }

  // --- 🍎 Draw Food Pellets ---
  for (let i = foodList.length - 1; i >= 0; i--) {
    let food = foodList[i];

    // Draw pellet
    ctx.beginPath();
    ctx.fillStyle = food.color;
    ctx.arc(food.x, food.y, food.radius, 0, Math.PI * 2);
    ctx.fill();

    // Check collision with snake head
    if (getDistance(snake.x, snake.y, food.x, food.y) < snake.radius + food.radius) {
      // Remove food
      foodList.splice(i, 1);
      // Add more length
      snake.maxLength += 10;
    }
  }

  // --- 🐍 Draw Snake Body ---
  for (let i = 0; i < snake.body.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = `hsl(${i * 2}, 100%, 50%)`;
    ctx.arc(snake.body[i].x, snake.body[i].y, snake.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}


draw();
