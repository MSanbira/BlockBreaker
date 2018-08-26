const gameWrapper = document.querySelector('.game-wrapper');
const blocksWrapper = document.querySelector('.blocks-wrapper');
const platform = document.querySelector('.platform');
const ballElement = document.querySelector('.ball');
const scoreElement = document.querySelector('.score');
const topScoreElement = document.querySelector('.top-score');
const onOpen = document.querySelector('.on-open');
const gameOverElement = document.querySelector('.game-over');
const fireBallWrapper = document.querySelector('.fireball-wrapper');

let ballWidth = model.ball.width;
let isPressed = false;
let isPlatformHit = false;
let isMoreBlocks = false;
let bugCheck = 0;
let ballAnimation; let fireBallPump; let fireBallFall; let moveLeft; let moveRight;
let score = 0;
let topScore = 0;
let speed = 20;
let fireBall = false;
let fireBallDrop = false;

// blocks

function createBlockes() {
    blocksWrapper.innerHTML = '';
    for (const row of model.container.rows) {
        for (const block of row.blocks) {
            if (block != null) {
                let blockHTML = `<div class="block row-${row.num} ${fadeOutBlocks()}" style="top: ${row.topEdge}px; left: ${block.left}px" data-num="${row.num}, ${block.num}" data-fireball="${randomNumFire()}"></div>`;
                blocksWrapper.innerHTML += blockHTML;
            }
        }
    }
}

function randomNumFire() {
    if (Math.random() < 0.33) {
        return 1;
    }
    else {
        return 0;
    }
}

function findBlock(rowNum, blockNum) {
    return document.querySelector(`.block[data-num="${rowNum}, ${blockNum}"]`);
}

function fadeBlock(block) {
    block.classList.add('fade');
}

function fadeOutBlocks() {
    if (isMoreBlocks) {
        return 'fade';
    }
    else {
        return '';
    }
}

function fadeInBlocks() {
    isMoreBlocks = false;
    const blocks = document.querySelectorAll('.block');
    for (const block of blocks) {
        block.classList.remove('fade');
    }
}

// platform

function centerPlatform() {
    model.platform.left = 430;
    platform.style.left = model.platform.left + 'px';
}

document.addEventListener('keydown', (event) => {
    if (event.keyCode == 37 && !isPressed) { movePlatformLeft(); }
    if (event.keyCode == 39 && !isPressed) { movePlatformRight(); }
});

document.addEventListener('keyup', (event) => {
    if (event.keyCode == 37) {
        clearInterval(moveLeft);
        isPressed = false;
    }
    if (event.keyCode == 39) {
        clearInterval(moveRight);
        isPressed = false;
    }
});

function movePlatformLeft() {
    isPressed = true
    moveLeft = setInterval(function () {
        if (!(model.platform.left <= 10)) {
            model.platform.left -= model.platform.speed;
            platform.style.left = model.platform.left + 'px';
        }
        else {
            clearInterval(moveLeft);
        }
    }, 20);
}

function movePlatformRight() {
    isPressed = true
    moveRight = setInterval(function () {
        if (!((model.platform.left + model.platform.width) >= 945)) {
            model.platform.left += model.platform.speed;
            platform.style.left = model.platform.left + 'px';
        }
        else {
            clearInterval(moveRight);
        }
    }, 20);
}

function wigglePlatform() {
    platform.classList.add('wiggle');
    setTimeout('platform.classList.remove("wiggle")', 300);
}

// ball

function ballHitTop() {
    model.ball.topMovment = -model.ball.topMovment + (Math.random() * 0.05);
}

function ballHitLeft() {
    model.ball.leftMovment = -model.ball.leftMovment + (Math.random() * 0.05);
}

// fireball

function checkForFireBall(rowNum, blockNum) {
    if (findBlock(rowNum, blockNum).getAttribute('data-fireball') == 1) {
        createFireBall(rowNum, blockNum);
    }
}

function createFireBall(rowNum, blockNum) {
    fireBallDrop = true;
    let fireBallTop = model.container.rows[rowNum].bottomEdge;
    let fireBallLeft = model.container.rows[rowNum].blocks[blockNum].left + 30;
    fireBallHTML = `<div class="fireball" style="top: ${fireBallTop}px; left: ${fireBallLeft}px"></div>`;
    fireBallWrapper.innerHTML = fireBallHTML;
    fireBallElement = document.querySelector('.fireball');
    throwFireBall(fireBallElement, fireBallTop, fireBallLeft);
}

function throwFireBall(fireBallElement, fireBallTop, fireBallLeft) {
    fireBallPump = setInterval(function () {
        fireBallElement.classList.toggle('pump');
    }, 500);
    fireBallFall = setInterval(function () {
        fireBallTop += 2;
        fireBallElement.style.top = fireBallTop + 'px';
        if (fireBallTop >= 450) {
            checkForFireBallHit(fireBallLeft);
        }
    }, 20);
}

function checkForFireBallHit(fireBallLeft) {
    if ((fireBallLeft + 10) >= model.platform.left && (fireBallLeft - 10) <= (model.platform.left + model.platform.width)) {
        activateFireBall(true);
    }
    else {
        activateFireBall(false);
    }
}

function activateFireBall(activ) {
    if (activ) {
        fireBall = true;
        ballElement.classList.add('fire');
        setTimeout('fireBall = false', 3000);
        setTimeout("ballElement.classList.remove('fire')", 3000);
    }
    setTimeout('fireBallDrop = false', 3000);
    fireBallWrapper.innerHTML = '';
    clearInterval(fireBallPump);
    clearInterval(fireBallFall);
}

// game play

function gamePlay() {
    ballAnimation = setInterval(function () {
        model.ball.top += model.ball.topMovment;
        model.ball.left += model.ball.leftMovment;
        ballElement.style.top = model.ball.top + 'px';
        ballElement.style.left = model.ball.left + 'px';
        if (model.ball.top <= model.container.bottomEdge && (model.ball.top + ballWidth) >= model.container.topEdge) {
            testCollision();
        }
        if (model.ball.top <= 0) {
            ballHitTop();
            bugCheck++
        }
        if (model.ball.left <= 0 || (model.ball.left + ballWidth) >= 960) {
            ballHitLeft();
            bugCheck--;
        }
        if (!isPlatformHit && (model.ball.top + ballWidth) > 450 && (model.ball.top + ballWidth) < 455 && (model.ball.left + ballWidth) >= model.platform.left && model.ball.left <= (model.platform.left + model.platform.width)) {
            isPlatformHit = true;
            setTimeout('isPlatformHit = false', 50);
            if ((model.ball.left < (model.platform.left + 10) && model.ball.leftMovment > 0) || (model.ball.left > (model.platform.left + model.platform.width - 20) && model.ball.leftMovment < 0)) {
                ballHitLeft();
                ballHitTop();
            }
            else {
                ballHitTop();
            }
            wigglePlatform();
            bugCheck++;
        }
        if ((model.ball.top + ballWidth) >= 500) {
            clearInterval(ballAnimation);
            gameOver();
        }
        if (bugCheck > 200 || bugCheck < -200) {
            model.resetBall();
            bugCheck = 0;
        }
    }, speed);
}

function testCollision() {
    let rowNum = model.findRow();
    for (const block of model.container.rows[rowNum].blocks) {
        if (block != null && (model.ball.left + ballWidth) >= block.left && model.ball.left <= block.right) {
            registerHit(rowNum, block.num);
            break;
        }
    }
}

function registerHit(rowNum, blockNum) {
    if (!fireBallDrop) {
        checkForFireBall(rowNum, blockNum);
    }
    model.deleteBlock(rowNum, blockNum);
    fadeBlock(findBlock(rowNum, blockNum));
    setTimeout(createBlockes, 300);
    let rowTop = model.container.rows[rowNum].topEdge;
    let rowBottom = model.container.rows[rowNum].bottomEdge;
    if (!fireBall) {
        if ((model.ball.top + (ballWidth / 2)) < (rowBottom) && (model.ball.top + (ballWidth / 2)) > (rowTop)) {
            ballHitLeft();
        }
        else {
            ballHitTop();
        }
    }
    score++;
    updateScore();
    fasterGame();
    if (score % 78 == 0) {
        moreBlockes();
    }
}

function fasterGame() {
    clearInterval(ballAnimation);
    if (speed > 10) {
        speed -= 0.1;
    }
    gamePlay();
}

function moreBlockes() {
    model.resetBall();
    centerPlatform();
    model.resetBlocks();
    isMoreBlocks = true;
    createBlockes();
    setTimeout(fadeInBlocks, 100);
    bugCheck = 0;
}

function updateScore() {
    scoreElement.innerHTML = `score: ${score}`;
}

// game over

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
    centerPlatform();
    model.resetBall();
    ballElement.classList.remove('fire');
    ballElement.style.display = 'block';
    gameOverElement.classList.remove('triger');
    gameOverElement.classList.remove('show');
    score = 0;
    speed = 20;
    bugCheck = 0;
    fireBall = false;
    fireBallDrop = false;
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