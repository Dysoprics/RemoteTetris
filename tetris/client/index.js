const tetrisBoard = {
    dimentions: {rows: 20, columns: 10},
    gameBoard: [],
    currentTetrisObject: null,
    eventLoopIdentifier: null,
    boardColor: 'white'
}

class tetrisBlock {
    constructor(blockType, origin) {
        if (blockType === 0) {
            this.renderRules = [[-1, 0], [0, 0], [1, 0], [2, 0]]; //Peice:⠸
            this.rotationRules = 0;
            this.color = 'cyan';

        } else if (blockType === 1) {
            this.renderRules = [[-1, -1], [-1, 0], [0, 0], [1, 0]]; //Peice: ⠧
            this.rotationRules = 0;
            this.color = 'blue';

        } else if (blockType === 2) {
            this.renderRules = [[-1, 0], [0, 0], [1, 0], [1, -1]]; //Peice: ⠏
            this.rotationRules = 0;
            this.color = 'orange';

        } else if (blockType === 3) {
            this.renderRules = [[0, 0], [1, 0], [0, -1], [1, -1]]; //Peice: ⠛
            this.rotationRules = 1;
            this.color = 'yellow';

        } else if (blockType === 4) {
            this.renderRules = [[-1, 0], [0, 0], [0, -1], [1, -1]]; //Peice: ⠳
            this.rotationRules = 0;
            this.color = 'green';

        } else if (blockType === 5) {
            this.renderRules = [[-1, 0], [0, -1], [0, 0], [1, 0]]; //Peice: ⠺
            this.rotationRules = 0;
            this.color = 'purple';

        } else if (blockType === 6) {
            this.renderRules = [[-1, -1], [0, -1], [0, 0], [1, 0]]; //Peice: ⠞
            this.rotationRules = 0;
            this.color = 'red';
            
        } else {
            this.renderRules = [[0, 0]];
            this.rotationRules = 0;
            this.color = '#ff5454';
        }

        this.position = [0, 0];
        this.translate([origin[0], origin[1]]);

        this.previousPosition = [origin[0], origin[1]];

        this.previousRenderRules = [];
        for(let i = 0; i < this.renderRules.length; i++) {
            this.previousRenderRules.push([this.renderRules[i][0], this.renderRules[i][1]]);
        }
    }



    render(emptyCellColor, filledCellColor) {
        for(let i = 0; i < this.previousRenderRules.length; i++) {
            let xPrint = this.previousPosition[0] + this.previousRenderRules[i][0];
            let yPrint = this.previousPosition[1] + this.previousRenderRules[i][1];
            
            tetrisBoard.gameBoard[xPrint][yPrint].occupied = false;
            tetrisBoard.gameBoard[xPrint][yPrint].ref.style.backgroundColor = emptyCellColor;
        }

        this.previousPosition = [this.position[0], this.position[1]];
        for(let i = 0; i < this.previousRenderRules.length; i++) {
            this.previousRenderRules[i] = [this.renderRules[i][0], this.renderRules[i][1]];
        }

        for(let i = 0; i < this.renderRules.length; i++) {
            let xPrint = this.position[0] + this.renderRules[i][0];
            let yPrint = this.position[1] + this.renderRules[i][1];
            
            tetrisBoard.gameBoard[xPrint][yPrint].occupied = true;
            tetrisBoard.gameBoard[xPrint][yPrint].ref.style.backgroundColor = filledCellColor;
        }
    }
    translate(translationVector) {
        let attemptedXpos = this.position[0] + translationVector[0];
        let attemptedYpos = this.position[1] + translationVector[1];

        let translationFail = false;

        for(let i = 0; i < this.renderRules.length; i++) {
            let xPlacement = attemptedXpos + this.renderRules[i][0];
            let yPlacement = attemptedYpos + this.renderRules[i][1];

            if(xPlacement < 0 || xPlacement >= tetrisBoard.dimentions.columns || yPlacement < 0 || yPlacement >= tetrisBoard.dimentions.rows) {
                translationFail = true;
            }
            // FOR LOOP DETECT NEARBY OCCUPANCY
        } 

        if (translationFail) {
            return false; 
        } else {
            this.position = [attemptedXpos, attemptedYpos];
            return true; 
        }
    }
    rotate(clockwise) {
        let attemptedRenderRules = [];

        if (this.rotationRules === 0) {
            if(clockwise) {
                for(let i1 = 0; i1 < this.renderRules.length; i1++) {
                    attemptedRenderRules.push([-this.renderRules[i1][1], this.renderRules[i1][0]]);
                }
            } else {
                for(let i1 = 0; i1 < this.renderRules.length; i1++) {
                    attemptedRenderRules.push([this.renderRules[i1][1], -this.renderRules[i1][0]]);
                }
            }
        }

        let rotationFail = false;

        for(let i1 = 0; i1 < attemptedRenderRules.length; i1++) {
            let attemptedXpos = this.position[0] + attemptedRenderRules[i1][0];
            let attemptedYpos = this.position[1] + attemptedRenderRules[i1][1];

            if(attemptedXpos < 0 || attemptedXpos >= tetrisBoard.dimentions.columns || attemptedYpos < 0 || attemptedYpos >= tetrisBoard.dimentions.rows) {
                rotationFail = true;
            }
            // FOR LOOP DETECT NEARBY OCCUPANCY
        }

        if (rotationFail) {
            return false; 
        } else {
            for(let i = 0; i < attemptedRenderRules.length; i++) {
                this.renderRules[i] = [attemptedRenderRules[i][0], attemptedRenderRules[i][1]];
            }
            return true; 
        }
    }
    occupy() {
        for (let i1 = 0; i1 < this.renderRules.length; i1++) {
            let occupyX = this.position[0] + this.renderRules[i1][0];
            let occupyY = this.position[1] + this.renderRules[i1][1];

            tetrisBoard.gameBoard[occupyX][occupyY].occupied = true;
        }
    }
}

document.addEventListener('keydown', (e1) => {
    if(tetrisBoard.currentTetrisObject != null && tetrisBoard.eventLoopIdentifier != null) {
        let key = e1.key.toLowerCase();
        switch(true) {
            case ('arrowleft' === key || 'a' === key):
                if(tetrisBoard.currentTetrisObject.translate([-1, 0])) {
                    tetrisBoard.currentTetrisObject.render(tetrisBoard.boardColor, tetrisBoard.currentTetrisObject.color);
                }
                break;
            case ('arrowright' === key || 'd' === key):
                if(tetrisBoard.currentTetrisObject.translate([1, 0])) {
                    tetrisBoard.currentTetrisObject.render(tetrisBoard.boardColor, tetrisBoard.currentTetrisObject.color);
                }
                break;
            case ('arrowup' === key || 'w' === key):
                if(tetrisBoard.currentTetrisObject.rotate(true)) {
                    tetrisBoard.currentTetrisObject.render(tetrisBoard.boardColor, tetrisBoard.currentTetrisObject.color);
                }
                break;
            case ('arrowdown' === key || 's' === key):
                if(tetrisBoard.currentTetrisObject.translate([0, 1])) {
                    tetrisBoard.currentTetrisObject.render(tetrisBoard.boardColor, tetrisBoard.currentTetrisObject.color);
                } else {
                    // ADD LOGIC FOR REACHING BOTTOM
                }
                break;
        }
    }
});

function initializeBoard() {
    boardHtmlConstruct = '';

    for(let rows = 0; rows < tetrisBoard.dimentions.rows; rows++) {
        boardHtmlConstruct += `<div class="board-r board-r${rows}">\n`
        for(let cols = 0; cols < tetrisBoard.dimentions.columns; cols++) {
            boardHtmlConstruct += `<div class="board-c board-r${rows}-c${cols}"></div>\n`
        }
        boardHtmlConstruct += '</div>\n';
    }

    document.querySelector('.board').innerHTML = boardHtmlConstruct;

    for(let x = 0; x < tetrisBoard.dimentions.columns; x++) {
        tetrisBoard.gameBoard.push([]);
        for(let y = 0; y < tetrisBoard.dimentions.rows; y++) {
            tetrisBoard.gameBoard[x].push({occupied: false, ref: document.querySelector(`.board-r${y}-c${x}`)});
        }
    }
}

function eventLoop() {
    if(tetrisBoard.currentTetrisObject === null) {
        tetrisBoard.currentTetrisObject = new tetrisBlock(Math.floor(Math.random() * (6 + 1)), [4, 1]);
        tetrisBoard.currentTetrisObject.render(tetrisBoard.boardColor, tetrisBoard.currentTetrisObject.color); 
    } else {
        if(tetrisBoard.currentTetrisObject.translate([0, 1])) {
            tetrisBoard.currentTetrisObject.render(tetrisBoard.boardColor, tetrisBoard.currentTetrisObject.color);
        } else {
            tetrisBoard.currentTetrisObject.occupy();
            tetrisBoard.currentTetrisObject = null;
        }
    }
}

function startStopEventLoop(operation) {
    if(operation === 1 && tetrisBoard.eventLoopIdentifier == null) {
        tetrisBoard.eventLoopIdentifier = setInterval(eventLoop, 1000);
    } else if (operation === 0 && tetrisBoard.eventLoopIdentifier != null) {
        clearInterval(tetrisBoard.eventLoopIdentifier);
        tetrisBoard.eventLoopIdentifier = null;
    }
}

function runtime() {
    initializeBoard();
    startStopEventLoop(1);
}

runtime();