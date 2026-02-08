const canvas = document.querySelector('.preview');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

let tetrisBoard = null;
let renderRulesData = null;

class tetrisGame {
    constructor() {
        this.dimentions = {rows: 20, columns: 10};
        this.gameBoard = [];
        this.currentTetrisObject = null;
        this.eventLoopIdentifier = null;
        this.boardColor = 'white';
        this.updateSpeed = 800;
        this.currentBlock = null;
        this.nextBlock = null;
    }
}

class tetrisBlock {
    constructor(blockInfo, origin) {
        this.renderRules = structuredClone(blockInfo.renderRules);
        this.rotationRules = blockInfo.rotationRules;
        this.spawnRules = blockInfo.spawnRules;
        this.color = blockInfo.color;

        this.position = [0, 0];
        this.occupationSuccess = this.translate([origin[0], origin[1] + this.spawnRules]);

        this.previousPosition = [origin[0], origin[1] + this.spawnRules];

        this.previousRenderRules = [];
        for(let i = 0; i < this.renderRules.length; i++) {
            this.previousRenderRules.push([this.renderRules[i][0], this.renderRules[i][1]]);
        }
    }



    render(emptyCellColor, filledCellColor) {
        for(let i = 0; i < this.previousRenderRules.length; i++) {
            let xPrint = this.previousPosition[0] + this.previousRenderRules[i][0];
            let yPrint = this.previousPosition[1] + this.previousRenderRules[i][1];
            
            tetrisBoard.gameBoard[xPrint][yPrint].ref.style.backgroundColor = emptyCellColor;
        }

        this.previousPosition = [this.position[0], this.position[1]];
        for(let i = 0; i < this.previousRenderRules.length; i++) {
            this.previousRenderRules[i] = [this.renderRules[i][0], this.renderRules[i][1]];
        }

        for(let i = 0; i < this.renderRules.length; i++) {
            let xPrint = this.position[0] + this.renderRules[i][0];
            let yPrint = this.position[1] + this.renderRules[i][1];
            
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
                break;
            }

            if(tetrisBoard.gameBoard[xPlacement][yPlacement].occupied) {
                translationFail = true;
                break;
            }
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
                break;
            }
            
            if(tetrisBoard.gameBoard[attemptedXpos][attemptedYpos].occupied) {
                rotationFail = true;
                break;
            }
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
    keyDownEvent(e1);
});

function keyDownEvent(e1) {
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
                    startStopEventLoop(0);
                    tetrisBoard.currentTetrisObject.render(tetrisBoard.boardColor, tetrisBoard.currentTetrisObject.color);
                    startStopEventLoop(1);
                }
                break;
            case ('enter' === key):
                let attemptAgain = true;
                while (attemptAgain) {
                    if (!tetrisBoard.currentTetrisObject.translate([0, 1])) {
                        attemptAgain = false;
                    }
                }
                tetrisBoard.currentTetrisObject.render(tetrisBoard.boardColor, tetrisBoard.currentTetrisObject.color);

                startStopEventLoop(0);
                processPeiceSubmission();
                setTimeout(() => {
                    startStopEventLoop(1);
                    eventLoop();
                }, 200);
        }
    }
}

async function initializeBoard() {
    tetrisBoard = new tetrisGame();

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

    if (renderRulesData === null) {
        try {
            renderRulesData = await fetch('/game/renderRules.json').then((res) => { return res.json(); });

            startStopEventLoop(1);
        } catch (err) {
            console.error(`Failed initialization: ${err}`);
        }
    } else {
        startStopEventLoop(1);
    }
}

function eventLoop() {
    if (tetrisBoard.currentTetrisObject === null) {
        if (tetrisBoard.currentBlock === null) {
            tetrisBoard.currentBlock = Math.floor(Math.random() * (6 + 1));
        } else {
            tetrisBoard.currentBlock = tetrisBoard.nextBlock;
        }

        let randomNum = Math.floor(Math.random() * (6 + 1));
        let passer = true;
        while (passer) {
            if (randomNum !== tetrisBoard.currentBlock) {
                passer = false;
            } else {
                randomNum = Math.floor(Math.random() * (6 + 1));
            }
        }
        tetrisBoard.nextBlock = randomNum;
        
        tetrisBoard.currentTetrisObject = new tetrisBlock(renderRulesData[tetrisBoard.currentBlock], [4, 1], tetrisBoard.currentBlock);

        if (!tetrisBoard.currentTetrisObject.occupationSuccess) {
            startStopEventLoop(0);
            if (confirm('Game Over! Would you like to restart?')) {
                resetGame();
                return;
            } else {
                return;
            }
        }
        tetrisBoard.currentTetrisObject.render(tetrisBoard.boardColor, tetrisBoard.currentTetrisObject.color); 
    } else {
        if(tetrisBoard.currentTetrisObject.translate([0, 1])) {
            tetrisBoard.currentTetrisObject.render(tetrisBoard.boardColor, tetrisBoard.currentTetrisObject.color);
        } else {
            processPeiceSubmission();
            eventLoop();
        }
    }
}

function processPeiceSubmission() {
    tetrisBoard.currentTetrisObject.occupy();
    tetrisBoard.currentTetrisObject = null;

    let clearRows = [];
    for (let i1 = 0; i1 < tetrisBoard.dimentions.rows; i1++) {
        let fullRowCheck = true;

        for (let i2 = 0; i2 < tetrisBoard.dimentions.columns; i2++) {
            if (!tetrisBoard.gameBoard[i2][i1].occupied) {
                fullRowCheck = false;
                break;
            }
        }

        if (fullRowCheck) {
            clearRows.push(i1);
        }
    }

    if (clearRows.length !== 0) {
        for (let i1 = 0; i1 < tetrisBoard.dimentions.columns; i1++) {
            for (let i2 = 0; i2 < clearRows.length; i2++) {
                tetrisBoard.gameBoard[i1][clearRows[i2]].ref.style.backgroundColor = 'white';
                tetrisBoard.gameBoard[i1][clearRows[i2]].occupied = false;
            }
        }

        for (let i1 = 0; i1 < clearRows.length; i1++) {
            for (let i2 = 0; i2 < clearRows[i1]; i2++) {
                for (let i3 = 0; i3 < tetrisBoard.dimentions.columns; i3++) {
                    let rowRef = (clearRows[i1] - i2) - 1;

                    tetrisBoard.gameBoard[i3][rowRef + 1].occupied = tetrisBoard.gameBoard[i3][rowRef].occupied;
                    tetrisBoard.gameBoard[i3][rowRef + 1].ref.style.backgroundColor = tetrisBoard.gameBoard[i3][rowRef].ref.style.backgroundColor;
                }
            }
        }

        clearRows = [];
    }
}

function startStopEventLoop(operation) {
    if(operation === 1 && tetrisBoard.eventLoopIdentifier == null) {
        return tetrisBoard.eventLoopIdentifier = setInterval(eventLoop, tetrisBoard.updateSpeed);
    } else if (operation === 0 && tetrisBoard.eventLoopIdentifier != null) {
        clearInterval(tetrisBoard.eventLoopIdentifier);
        tetrisBoard.eventLoopIdentifier = null;
    }
}

function resetGame() {
    startStopEventLoop(0);
    document.querySelector('.board').innerHTML = '';
    initializeBoard();
}

initializeBoard();