let model = {

    container: {
        topEdge: 35,
        bottomEdge: 215,
        rows: []
    },

    ball: {
        width: 20,
        top: 400,
        left: 470,
        topMovment: -2.5,
        leftMovment: -2
    },

    platform: {
        width: 100,
        left: 430,
        speed: 15
    },

    resetBlocks: function () {
        model.container.rows = [];
        for (let i = 0; i < 6; i++) {
            let row = {
                num: i,
                topEdge: 35 + (30 * i),
                bottomEdge: 65 + (30 * i),
                blocks: []
            };
            for (let j = 0; j < 13; j++) {
                let block = {
                    num: j,
                    left: 30 + (70 * j),
                    right: 90 + (70 * j)
                };
                row.blocks.push(block);
            }
            model.container.rows.push(row);
        }
    },

    resetBall: function () {
        model.ball = {
            width: 20,
            top: 400,
            left: 470,
            topMovment: -2.5,
            leftMovment: -2
        }
    },

    findRow: function() {
        for (const row of model.container.rows) {
            if (model.ball.top <= row.bottomEdge && (model.ball.top + model.ball.width) >= row.topEdge) {
                return row.num;
                break;
            }
        }
    },

    deleteBlock: function (rowNum, blockNum) {
        model.container.rows[rowNum].blocks.splice(blockNum, 1, null);
        createBlockes();
    }
};