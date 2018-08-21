let gameWrapper = document.querySelector('.game-wrapper');
let blocksWrapper = document.querySelector('.blocks-wrapper');
let platform = document.querySelector('.platform');
let ball = {
    element: document.querySelector('.ball'),
    width: 30,
    top: 400,
    left: 470,
    topMovment: -2.5,
    leftMovment: -2
}

function createBlockes() {
    for (const row of model.container.rows) {
        for (const block of row.blocks) {
            let blockHTML = `<div class="block" style="top: ${row.topEdge}px; left: ${block.left}px"></div>`;
            blocksWrapper.innerHTML += blockHTML;
        }
    }
}

function gamePlay() {
    let ballAnimation = setInterval(function () {
        ball.top += ball.topMovment;
        ball.left += ball.leftMovment;
        ball.element.style.top = ball.top + 'px';
        ball.element.style.left = ball.left + 'px';
        if (ball.top <= 0 || (ball.top + ball.width) >= 500) { ballHitTop(); }
        if (ball.left <= 0 || (ball.left + ball.width) >= 960) { ballHitLeft(); }
    }, 10);
}

function ballHitTop() {
    ball.topMovment = -ball.topMovment + (Math.random() * 0.1);
}

function ballHitLeft() {
    ball.leftMovment = -ball.leftMovment + (Math.random() * 0.1);
}

function init() {
    model.resetBlocks();
    createBlockes();
    gamePlay();
}

init();