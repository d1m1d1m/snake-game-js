const board = document.createElement('canvas');
const ctx = board.getContext('2d');

board.width = 400;
board.height = 400;

document.body.appendChild(board)

const gridUnit = 20;
let snake = [];
snake[0] = { x: 10 * gridUnit, y: 10 * gridUnit };

// Génère une nourriture
let food = {
    x: Math.floor(Math.random() * 15 + 1) * gridUnit,
    y: Math.floor(Math.random() * 15 + 1) * gridUnit
};

let score = 0;
let direction = null;

document.body.addEventListener('keydown', directionHandler);

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
};

function draw() {
    console.log('tic tac')
    ctx.clearRect(0,0,board.width,board.height);

    // Dessiner le snake
    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i==0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, gridUnit, gridUnit);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, gridUnit, gridUnit);
    };

    // Dessiner la nourriture
    ctx.fillStyle = "orange";
    ctx.fillRect(food.x, food.y, gridUnit, gridUnit);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    console.log('Première fois : ' + snakeX + "/" + snakeY)

    if(direction === "TOP") {
        snakeY -= gridUnit;
    }
    if(direction === "BOTTOM") {
        snakeY += gridUnit;
    }
    if(direction === "LEFT") {
        snakeX -= gridUnit;
    }
    if(direction === "RIGHT") {
        snakeX += gridUnit;
    }

    if(snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 15 + 1) * gridUnit,
            y: Math.floor(Math.random() * 15 + 1) * gridUnit
        };
    }
    else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    console.log(newHead)

    if(snakeX < 0 || snakeY < 0 || snakeX > 19 * gridUnit || snakeY > 19 * gridUnit || collision(newHead, snake)) {
        clearInterval(game);
    }

    snake.unshift(newHead);

    ctx.fillStyle = 'red';
    ctx.font = "30px Arial";
    ctx.fillText(snake.length - 1, 2*gridUnit, 1.6*gridUnit);

    console.log(snake)

    const frame =  requestAnimationFrame((t) => console.log(t));
    console.log(frame)
};

function collision(head, snake) {
    for(let g = 0; g < snake.length; g++) {
        if(head.x === snake[g].x && head.y === snake[g].y) {
            return true
        }
        return false
    }
}

const game = setInterval(draw, 100)