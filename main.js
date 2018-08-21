const gameWrapper = document.querySelector('.game-wrapper');
const blocksWrapper = document.querySelector('.blocks-wrapper');
const platform = document.querySelector('.platform');
const ballElement = document.querySelector('.ball');
const scoreElement = document.querySelector('.score');
const topScoreElement = document.querySelector('.top-score');
const gameOverElement = document.querySelector('.game-over');
let score = 0;
let topScore = 0;

function createBlockes() {
    blocksWrapper.innerHTML = '';
    for (const row of model.container.rows) {
        for (const block of row.blocks) {
            if (block != null) {
                let blockHTML = `<div class="block" style="top: ${row.topEdge}px; left: ${block.left}px"></div>`;
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
    if (!((model.platform.left + model.platform.width) >= 950)) {
        model.platform.left += model.platform.speed;
        platform.style.left = model.platform.left + 'px';
    }
}

function gamePlay() {
    let ballAnimation = window.setInterval(function () {
        model.ball.top += model.ball.topMovment;
        model.ball.left += model.ball.leftMovment;
        ballElement.style.top = model.ball.top + 'px';
        ballElement.style.left = model.ball.left + 'px';
        if (model.ball.top <= 0) { ballHitTop(); }
        if (model.ball.left <= 0 || (model.ball.left + model.ball.width) >= 960) { ballHitLeft(); }
        if ((model.ball.top + model.ball.width) > 450 && (model.ball.top + model.ball.width) < 455 && (model.ball.left + model.ball.width) >= model.platform.left && model.ball.left <= (model.platform.left + model.platform.width)) {
            ballHitTop();
        }
        if ((model.ball.top + model.ball.width) >= 500) {
            clearInterval(ballAnimation);
            gameOver();
        }
        if (model.ball.top <= model.container.bottomEdge && (model.ball.top + model.ball.width) >= model.container.topEdge) {
            testCollision();
        }
    }, 20);
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
    if ((model.ball.top + (model.ball.width / 2)) < model.container.rows[rowNum].bottomEdge && (model.ball.top + (model.ball.width / 2)) > model.container.rows[rowNum].topEdge) {
        ballHitLeft();
    }
    else {
        ballHitTop();
    }
    score++;
    updateScore();
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
}

function resetGame() {
    model.resetBlocks();
    createBlockes();
    model.platform.left = 440;
    movePlatformLeft();
    model.resetBall();
    ballElement.style.display = 'block';
    gameOverElement.classList.remove('show');
    score = 0;
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

gameOverElement.addEventListener('click', (event) => {
    resetGame();
})

function init() {
    model.resetBlocks();
    createBlockes();
    checkForTopScore();
    gamePlay();
}

init();