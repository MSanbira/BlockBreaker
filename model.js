let model = {

    container: {
        topEdge: 35,
        bottomEdge: 270,
        rows: []
    },

    resetBlocks: function () {
        for (let i = 0; i < 6; i++) {
            let row = {
                num: i,
                topEdge: 35 + (30 * i),
                bottomEdge: 65 + (30 * i),
                blocks: []
            };
            for (let j = 0; j < 13; j++) {
                let block = {
                    left: 30 + (70 * j),
                    right: 90 + (70 * j)
                };
                row.blocks.push(block);
            }
            model.container.rows.push(row);
        }
    }
};