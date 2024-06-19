//constant resources
let inputDir = {x:0 , y:0};
const foodsound = new Audio('food.mp3')
const movesound = new Audio('move.mp3')

const gameoversound = new Audio('gameover.mp3')
let score = 0;
let highscoreval = 0;





//board
let blockSize = 20;

let rows = 20;
let cols = 20;
let board;
let context; 

//snake head
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

let velocityX = 0;
let velocityY = 0;

let snakeBody = [];

//food
let foodX;
let foodY;

let gameOver = false;



window.onload = function() {
    board = document.getElementById("board");
    board.height = rows* blockSize;
    board.width =  cols* blockSize;
    context = board.getContext("2d"); //used for drawing on the board

    placeFood();
    document.addEventListener("keyup", changeDirection);
    // update();
    setInterval(update, 1000/10); //100 milliseconds
}

function update() {
    if (gameOver) {
        return;
    }

    context.fillStyle="black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle="red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        foodsound.play();
        snakeBody.push([foodX, foodY]);
        score += 1;
        if(score>hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        
        scoreBox.innerHTML = "Score: " + score;
        placeFood();
    }

    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle="lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    //game over conditions
    if (snakeX < 0 || snakeX >= cols*blockSize || snakeY < 0 || snakeY >= rows*blockSize) {
        gameOver = true;
        gameoversound.play();
        alert("Game Over");
        
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            gameoversound.play();
            alert("Game Over");
        }
    }
}

let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
        movesound.play();
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
        movesound.play();
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
        movesound.play();
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
        movesound.play();
    }
}


function placeFood() {
    //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}


let direction = { x: 0, y: 0 };
let lastTouchPosition = { x: 0, y: 0 };
const touchThreshold = 30; // Minimum movement in pixels to consider as a swipe
let gameStarted = false;

// Function to start the game
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        document.getElementById('startScreen').style.display = 'none';
        // Your existing game initialization code here
    }
}

function handleKeyPress(event) {
    if (!gameStarted) startGame();

    switch (event.key) {
        case "ArrowUp":
            direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            direction = { x: 1, y: 0 };
            break;
    }
}

function handleTouchStart(event) {
    if (!gameStarted) startGame();

    const touch = event.touches[0];
    lastTouchPosition = { x: touch.clientX, y: touch.clientY };
}

function handleTouchMove(event) {
    if (event.touches.length > 1) return; // Ignore multi-touch events

    const touch = event.touches[0];
    const deltaX = touch.clientX - lastTouchPosition.x;
    const deltaY = touch.clientY - lastTouchPosition.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > touchThreshold) {
            direction = { x: 1, y: 0 }; // Right swipe
        } else if (deltaX < -touchThreshold) {
            direction = { x: -1, y: 0 }; // Left swipe
        }
    } else {
        // Vertical swipe
        if (deltaY > touchThreshold) {
            direction = { x: 0, y: 1 }; // Down swipe
        } else if (deltaY < -touchThreshold) {
            direction = { x: 0, y: -1 }; // Up swipe
        }
    }

    lastTouchPosition = { x: touch.clientX, y: touch.clientY }; // Update the last touch position
}

document.addEventListener("keydown", handleKeyPress);
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);

// Start the game when the screen is touched
document.querySelector('.body').addEventListener('touchstart', startGame);

