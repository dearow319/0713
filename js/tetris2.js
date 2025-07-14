// tetris2.js - 네모 블럭만 나오는 테트리스

const tetris2Board = document.getElementById("tetris2-board");
const tetris2ScoreDisplay = document.getElementById("tetris2-score");

const ROWS = 20;
const COLS = 10;
let tetris2Grid = [];
let tetris2Score = 0;
let tetris2CurrentBlock;
let tetris2Interval;

function createTetris2Grid() {
    tetris2Grid = [];
    tetris2Board.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        const row = [];
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement("div");
            cell.className = "tetris-cell";
            tetris2Board.appendChild(cell);
            row.push(cell);
        }
        tetris2Grid.push(row);
    }
}

function generateOBlock() {
    return {
        shape: [
            [1, 1],
            [1, 1]
        ],
        row: 0,
        col: Math.floor(COLS / 2) - 1
    };
}

function drawBlock(block, value) {
    for (let r = 0; r < block.shape.length; r++) {
        for (let c = 0; c < block.shape[r].length; c++) {
            if (block.shape[r][c]) {
                const cell = tetris2Grid[block.row + r]?.[block.col + c];
                if (cell) {
                    cell.className = value ? "tetris-cell O" : "tetris-cell";
                }
            }
        }
    }
}

function moveBlockDown() {
    drawBlock(tetris2CurrentBlock, false);
    tetris2CurrentBlock.row++;
    if (isValidPosition(tetris2CurrentBlock)) {
        drawBlock(tetris2CurrentBlock, true);
    } else {
        tetris2CurrentBlock.row--;
        drawBlock(tetris2CurrentBlock, true);
        mergeBlock(tetris2CurrentBlock);
        clearLines();
        tetris2CurrentBlock = generateOBlock();
        if (!isValidPosition(tetris2CurrentBlock)) {
            clearInterval(tetris2Interval);
            alert("Game Over");
        }
    }
}

function isValidPosition(block) {
    for (let r = 0; r < block.shape.length; r++) {
        for (let c = 0; c < block.shape[r].length; c++) {
            if (
                block.shape[r][c] &&
                (block.row + r >= ROWS ||
                    block.col + c < 0 ||
                    block.col + c >= COLS ||
                    tetris2Grid[block.row + r][block.col + c].classList.contains("filled"))
            ) {
                return false;
            }
        }
    }
    return true;
}

function mergeBlock(block) {
    for (let r = 0; r < block.shape.length; r++) {
        for (let c = 0; c < block.shape[r].length; c++) {
            if (block.shape[r][c]) {
                const cell = tetris2Grid[block.row + r][block.col + c];
                cell.classList.add("filled", "O");
            }
        }
    }
}

function clearLines() {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (tetris2Grid[r].every(cell => cell.classList.contains("filled"))) {
            for (let rr = r; rr > 0; rr--) {
                for (let c = 0; c < COLS; c++) {
                    tetris2Grid[rr][c].className = tetris2Grid[rr - 1][c].className;
                }
            }
            for (let c = 0; c < COLS; c++) {
                tetris2Grid[0][c].className = "tetris-cell";
            }
            r++; // 재확인
            tetris2Score += 100;
            tetris2ScoreDisplay.textContent = tetris2Score;
        }
    }
}

function startTetris2() {
    createTetris2Grid();
    tetris2Score = 0;
    tetris2ScoreDisplay.textContent = tetris2Score;
    tetris2CurrentBlock = generateOBlock();
    drawBlock(tetris2CurrentBlock, true);
    clearInterval(tetris2Interval);
    tetris2Interval = setInterval(moveBlockDown, 500);
}
