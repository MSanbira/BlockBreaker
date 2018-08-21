let gameWrapper = document.querySelector('.game-wrapper');
let blocksWrapper = document.querySelector('.blocks-wrapper');
let platform = document.querySelector('.platform');
let ballElement = document.querySelector('.ball');

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
        model.ball.top += model.ball.topMovment;
        model.ball.left += model.ball.leftMovment;
        ballElement.style.top = model.ball.top + 'px';
        ballElement.style.left = model.ball.left + 'px';
        if (model.ball.top <= 0) { ballHitTop(); }
        if (model.ball.left <= 0 || (model.ball.left + model.ball.width) >= 960) { ballHitLeft(); }
        if ((model.ball.top + model.ball.width) >= 500) { gameOver(); }
    }, 20);

    function gameOver() {
        ballElement.style.display = 'none';
        clearInterval(ballAnimation);
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

function init() {
    model.resetBlocks();
    createBlockes();
    gamePlay();
}

init();