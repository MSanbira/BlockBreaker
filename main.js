const gameWrapper = document.querySelector('.game-wrapper');
const blocksWrapper = document.querySelector('.blocks-wrapper');
const platform = document.querySelector('.platform');
const ballElement = document.querySelector('.ball');
const scoreElement = document.querySelector('.score');
const topScoreElement = document.querySelector('.top-score');
const onOpen = document.querySelector('.on-open');
const gameOverElement = document.querySelector('.game-over');
let ballAnimation;
let score = 0;
let topScore = 0;
let speed = 20;

function createBlockes() {
    blocksWrapper.innerHTML = '';
    for (const row of model.container.rows) {
        for (const block of row.blocks) {
            if (block != null) {
                let blockHTML = `<div class="block row-${row.num}" style="top: ${row.topEdge}px; left: ${block.left}px" data-num="${row.num}, ${block.num}"></div>`;
                blocksWrapper.innerHTML += blockHTML;
            }
        }
    }
}

function ballHitTop() {
    model.ball.topMovment = -model.ball.topMovment + (Math.random() * 0.05);
}

function ballHitLeft() {
    model.ball.leftMovment = -model.ball.leftMovment + (Math.random() * 0.05);
}

document.addEventListener('keydown', (event) => {
    if (event.keyCode == 37) { movePlatformLeft(); }
    if (event.keyCode == 39) { movePlatformRight(); }
});

function movePlatformLeft() {
    if (!(model.platform.left <= 10)) {
        model.platform.left -= model.platform.speed;
        platform.style.left = model.platform.left + 'px';
    }
}

function movePlatformRight() {
    if (!((model.platform.left + model.platform.width) >= 946)) {
        model.platform.left += model.platform.speed;
        platform.style.left = model.platform.left + 'px';
    }
}

function findBlock(rowNum, blockNum) {
    return document.querySelector(`.block[data-num="${rowNum}, ${blockNum}"]`);
}

function fadeBlock(block) {
    block.classList.add('fade');
}

function wigglePlatform() {
    platform.classList.add('wiggle');
    setTimeout('platform.classList.remove("wiggle")', 300);
}

function gamePlay() {
    ballAnimation = window.setInterval(function () {
        model.ball.top += model.ball.topMovment;
        model.ball.left += model.ball.leftMovment;
        ballElement.style.top = model.ball.top + 'px';
        ballElement.style.left = model.ball.left + 'px';
        if (model.ball.top <= 0) { ballHitTop(); }
        if (model.ball.left <= 0 || (model.ball.left + model.ball.width) >= 960) { ballHitLeft(); }
        if ((model.ball.top + model.ball.width) > 450 && (model.ball.top + model.ball.width) < 453 && (model.ball.left + model.ball.width) >= model.platform.left && model.ball.left <= (model.platform.left + model.platform.width)) {
            ballHitTop();
            wigglePlatform();
        }
        if ((model.ball.top + model.ball.width) >= 500) {
            clearInterval(ballAnimation);
            gameOver();
        }
        if (model.ball.top <= model.container.bottomEdge && (model.ball.top + model.ball.width) >= model.container.topEdge) {
            testCollision();
        }
    }, speed);
}

function testCollision() {
    let rowNum = model.findRow();
    for (const block of model.container.rows[rowNum].blocks) {
        if (block != null && (model.ball.left + model.ball.width) >= block.left && model.ball.left <= block.right) {
            registerHit(rowNum, block.num);
            break;
        }
    }
}

function registerHit(rowNum, blockNum) {
    model.deleteBlock(rowNum, blockNum);
    fadeBlock(findBlock(rowNum, blockNum));
    setTimeout(createBlockes, 300);
    if ((model.ball.top + (model.ball.width / 2)) <= model.container.rows[rowNum].bottomEdge && (model.ball.top + (model.ball.width / 2)) >= model.container.rows[rowNum].topEdge) {
        ballHitLeft();
    }
    else {
        ballHitTop();
    }
    score++;
    updateScore();
    clearInterval(ballAnimation);
    speed -= 0.1;
    gamePlay();
    if (score % 78 == 0) {
        moreBlockes();
    }
}

function moreBlockes() {
    model.resetBall();
    model.platform.left = 440;
    movePlatformLeft();
    model.resetBlocks();
    createBlockes();
}

function updateScore() {
    scoreElement.innerHTML = `score: ${score}`;
}

function gameOver() {
    gameOverScreen();
    checkForTopScore();
}

function gameOverScreen() {
    ballElement.style.display = 'none';
    gameOverElement.classList.add('show');
    setTimeout('gameOverElement.classList.add("triger")', 1000);
}

function resetGame() {
    model.resetBlocks();
    createBlockes();
    model.platform.left = 440;
    movePlatformLeft();
    model.resetBall();
    ballElement.style.display = 'block';
    gameOverElement.classList.remove('triger');
    gameOverElement.classList.remove('show');
    score = 0;
    speed = 20;
    updateScore();
    setTimeout(gamePlay, 0);
}

function checkForTopScore() {
    if (score > topScore) {
        window.localStorage.setItem('score', score);
    }
    if (window.localStorage.getItem('score') != null) {
        topScore = window.localStorage.getItem('score');
        topScoreElement.innerHTML = `Top score: ${topScore}`;
    }
}

window.addEventListener('keydown', (event) => {
    if (gameOverElement.classList.contains('triger')) {
        resetGame();
    }
    if (onOpen.classList.contains('show') && event.keyCode == 13) {
        onOpen.classList.remove('show');
        gamePlay();
    }
})

function init() {
    model.resetBlocks();
    createBlockes();
    checkForTopScore();
}

init();