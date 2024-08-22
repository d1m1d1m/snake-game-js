class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  };
};

class Snake {
  constructor(board, initialPos) {
    this.board = board;
    this.tail = [board.grid.createVector2D(initialPos.x, initialPos.y)];

    this.drawSnake();
  };

  drawSnake() {
    const { ctx, grid } = this.board;

    ctx.fillStyle = "red";

    for( let tailBlock = 0; tailBlock < this.tail.length; tailBlock++ ) {
      const currentTailPart = this.tail[tailBlock];
      ctx.fillRect(currentTailPart.x, currentTailPart.y, grid.cellSize, grid.cellSize);
    }
  }
};

class Food {
  constructor(board, initialPos) {
    this.board = board;
    this.position = this.board.grid.createVector2D(initialPos.x, initialPos.y);

    this.drawFood();
  };

  drawFood() {
      const { ctx, grid } = this.board;

      ctx.fillStyle = "orange";
      ctx.fillRect(this.position.x, this.position.y, grid.cellSize, grid.cellSize)
  };
};

class GridTemplate {
  constructor(board, cellSize) {
    this.board = board;
    this.cellSize = cellSize;

    /* Grid metrics */
    this.columns = Math.floor(board.canvas.width / cellSize) - 2;
    this.rows = Math.floor(board.canvas.height / cellSize) - 2;
    this.width = this.columns * cellSize;
    this.height = this.rows * cellSize;
    this.marginX = board.canvas.width - this.columns * cellSize;
    this.marginY = board.canvas.height - this.rows * cellSize;

    const marginLeft = Math.ceil(this.marginX / 2) - 0.5;
    const marginTop = Math.ceil(this.marginY / 2) - 0.5;

    this.margin = {
        left: marginLeft,
        right: board.canvas.width - this.columns * cellSize - marginLeft,
        top: marginTop,
        bottom: board.canvas.height - this.rows * cellSize - marginTop
    }
  }

  drawGrid() {
    const { cellSize, margin } = this;
    const { ctx, canvas } = this.board;

    ctx.strokeStyle = "lightgrey";
    ctx.beginPath();

    for ( let col = margin.left; col <= canvas.width - margin.right; col += cellSize ) {
      ctx.moveTo(col, margin.top);
      ctx.lineTo(col, canvas.height - margin.bottom);
    }

    for ( let row = margin.top; row <= canvas.height - margin.bottom; row+= cellSize ) {
      ctx.moveTo(this.margin.left, row);
      ctx.lineTo(canvas.width - margin.right, row);
    }

    ctx.stroke();
  };

  createVector2D(x,y) {
    return new Vector2D(x * this.cellSize + this.margin.left, y * this.cellSize + this.margin.top);
  };
};

class Board {
  constructor(gameId, width, height, cellSize) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.id = gameId;
    this.canvas.width = width;
    this.canvas.height = height;

    this.grid = new GridTemplate(this, cellSize);

    /* Monter le canvas dans le DOM. */
    document.body.appendChild(this.canvas);
    this.grid.drawGrid();
  }
}

const gameBoard = new Board("dimitri", 400, 600, 28);
const affiliateSnake = new Snake(gameBoard, new Vector2D(0,0));
const affiliateFood = new Food(gameBoard, new Vector2D(10,12))

// Génère une nourriture
let food = {
  x: Math.floor(Math.random() * 15 + 1) * gridUnit,
  y: Math.floor(Math.random() * 15 + 1) * gridUnit,
};

let score = 0;
let direction = null;

document.body.addEventListener("keydown", directionHandler);

function directionHandler(event) {
  switch (event.code) {
    case "KeyW":
      direction = "TOP";
      break;
    case "KeyS":
      direction = "BOTTOM";
      break;
    case "KeyA":
      direction = "LEFT";
      break;
    case "KeyD":
      direction = direction = "RIGHT";
      break;
  }
}

function draw() {
  console.log("tic tac");
  ctx.clearRect(0, 0, board.width, board.height);

  // Dessiner le snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "green" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, gridUnit, gridUnit);

    ctx.strokeStyle = "red";
    ctx.strokeRect(snake[i].x, snake[i].y, gridUnit, gridUnit);
  }

  // Dessiner la nourriture
  ctx.fillStyle = "orange";
  ctx.fillRect(food.x, food.y, gridUnit, gridUnit);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  console.log("Première fois : " + snakeX + "/" + snakeY);

  if (direction === "TOP") {
    snakeY -= gridUnit;
  }
  if (direction === "BOTTOM") {
    snakeY += gridUnit;
  }
  if (direction === "LEFT") {
    snakeX -= gridUnit;
  }
  if (direction === "RIGHT") {
    snakeX += gridUnit;
  }

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 15 + 1) * gridUnit,
      y: Math.floor(Math.random() * 15 + 1) * gridUnit,
    };
  } else {
    snake.pop();
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  console.log(newHead);

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX > 19 * gridUnit ||
    snakeY > 19 * gridUnit ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
  }

  snake.unshift(newHead);

  ctx.fillStyle = "red";
  ctx.font = "30px Arial";
  ctx.fillText(snake.length - 1, 2 * gridUnit, 1.6 * gridUnit);

  console.log(snake);

  const frame = requestAnimationFrame((t) => console.log(t));
  console.log(frame);
}

function collision(head, snake) {
  for (let g = 0; g < snake.length; g++) {
    if (head.x === snake[g].x && head.y === snake[g].y) {
      return true;
    }
    return false;
  }
}

// const game = setInterval(draw, 100);
