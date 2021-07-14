canvas = document.getElementById('snake')
ctx = canvas.getContext('2d')

canvas.width = 400
canvas.height = 400

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let speed = 7;
let tileCount = 20;
let tileSize = canvas.width / tileCount - tileCount / 10;
let headX = (canvas.width + canvas.height) / 80;
let headY = (canvas.width + canvas.height) / 80;
let xVelocity = 0;
let yVelocity = 0;

let score = 0;

let snakeParts = [];
let tailLength = 2;

const gulpSound = new Audio('gulp.mp3')
const gameOverSound = new Audio('gameOver.mp3')

let appleX = Math.floor(Math.random() * tileCount);
let appleY = Math.floor(Math.random() * tileCount);

const drawGame = () => {
    changeSnakePosition();
    if (isGameOver()) return;
    clearScreen();
    checkAppleCollision();
    drawApple();
    drawSnake();
    drawScore();
    setTimeout(drawGame, 1000 / speed);
}

const isGameOver = () => {
    if (yVelocity === 0 && xVelocity === 0) return false

    if (headX < 0) {
        loss()
        return true
    } else if (headX === tileCount) {
        loss()
        return true
    } else if (headY < 0) {
        loss()
        return true
    } else if (headY === tileCount) {
        loss()
        return true
    }

    // forEach doesn't work for some reason so I used a for loop instead

    // snakeParts.forEach(part => {
    //     if (part.x === headX && part.y === headY) {
    //         loss()
    //         return true
    //     }
    // })

    for (let i = 2; i < snakeParts.length; i++) {
        if (snakeParts[i].x === headX && snakeParts[i].y === headY) {
            loss()
            return true
        }
    }

    return false
}

const loss = () => {
    gameOverSound.play()
    ctx.fillStyle = 'rgba(255,0,0,0.2)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'white';
    ctx.font = `${(canvas.width + canvas.height) / 16}px Verdana`
    ctx.fillText('Game Over', canvas.width / 7, canvas.height / 2)

    // Play again button
    // Box
    ctx.fillStyle = 'blue'
    ctx.fillRect(canvas.width / 2.9, canvas.height / 1.8, (canvas.width + canvas.height) / 6, (canvas.width + canvas.height) / 20)
    // Text
    ctx.fillStyle = 'white'
    ctx.font = `${(canvas.width + canvas.height) / 40}px Verdana`
    ctx.fillText('Play again', canvas.width / 2.6, canvas.height / 1.6)
    const playAgainButton = {
        x: canvas.width / 2.9,
        y: canvas.height / 1.8,
        width: (canvas.width + canvas.height) / 6,
        height: (canvas.width + canvas.height) / 20
    }

    canvas.addEventListener('click', event => {
        const mousePos = getMousePos(canvas, event);
        if (isInside(mousePos, playAgainButton)) {
            speed = 7;
            headX = (canvas.width + canvas.height) / 80;
            headY = (canvas.width + canvas.height) / 80;
            xVelocity = 0;
            yVelocity = 0;

            score = 0;

            snakeParts = [];
            tailLength = 2;
            drawGame();
        }
    }, false)
}

const getMousePos = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

const isInside = (pos, rect) => {
    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
}


const drawScore = () => {
    ctx.fillStyle = 'white';
    ctx.font = `${(canvas.width + canvas.height) / 80}px Verdana`
    ctx.fillText('Score ' + score, canvas.width - canvas.width / 8, canvas.height / 25)
}

const clearScreen = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const drawSnake = () => {
    ctx.fillStyle = 'green'
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i]
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }

    snakeParts.push(new SnakePart(headX, headY))


    while (snakeParts.length > tailLength) {
        snakeParts.shift()
    }

    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)
    // ctx.fillStyle = 'red';
    // ctx.fillRect(headX * tileCount, headY * tileCount, tileSize / 5, tileSize / 1.5)
}

const changeSnakePosition = () => {
    headX += xVelocity;
    headY += yVelocity;
}

const drawApple = () => {

    // Check if the apple is drawn on top of the snake, in case of that change the position
    let appleIsOnSnake = true
    while (appleIsOnSnake) {
        appleIsOnSnake = false

        for (let i = 0; i < snakeParts.length; i++) {
            if (snakeParts[i].x === appleX && snakeParts[i].y === appleY) {
                appleIsOnSnake = true
                appleX = Math.floor(Math.random() * 20)
                appleY = Math.floor(Math.random() * 20)
            }
        }
    }

    // Draw apple
    ctx.fillStyle = 'red'
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}

const checkAppleCollision = () => {
    if (appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * 20)
        appleY = Math.floor(Math.random() * 20)
        tailLength++
        score++
        gulpSound.play()
    }
}

const move = event => {
    switch (event.keyCode) {
        case 38:
            if (yVelocity == 1) break
            // UP
            yVelocity = -1;
            xVelocity = 0;
            break;
        case 40:
            if (yVelocity == -1) break
            // DOWN
            yVelocity = 1;
            xVelocity = 0;
            break;
        case 37:
            if (xVelocity == 1) break
            // LEFT
            yVelocity = 0;
            xVelocity = -1;
            break;
        case 39:
            if (xVelocity == -1) break
            //RIGHT
            yVelocity = 0;
            xVelocity = 1;
            break;
        default:
            break;
    }
}

document.body.addEventListener('keydown', move)



drawGame();