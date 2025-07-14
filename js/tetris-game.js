export class TetrisGame {
    constructor(container, onGameEnd, mode = 'normal') {
        this.container = container;
        this.onGameEnd = onGameEnd;
        this.score = 0;
        this.isGameOver = false;
        this.board = [];
        this.current = null;
        this.timer = null;

        this.ROWS = 20;
        this.COLS = 10;

        this.BLOCKS = {
            I: [
                [
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [3, 1],
                ],
                [
                    [2, 0],
                    [2, 1],
                    [2, 2],
                    [2, 3],
                ],
                [
                    [0, 2],
                    [1, 2],
                    [2, 2],
                    [3, 2],
                ],
                [
                    [1, 0],
                    [1, 1],
                    [1, 2],
                    [1, 3],
                ],
            ],
            O: [
                [
                    [1, 0],
                    [2, 0],
                    [1, 1],
                    [2, 1],
                ],
                [
                    [1, 0],
                    [2, 0],
                    [1, 1],
                    [2, 1],
                ],
                [
                    [1, 0],
                    [2, 0],
                    [1, 1],
                    [2, 1],
                ],
                [
                    [1, 0],
                    [2, 0],
                    [1, 1],
                    [2, 1],
                ],
            ],
            T: [
                [
                    [1, 0],
                    [0, 1],
                    [1, 1],
                    [2, 1],
                ],
                [
                    [1, 0],
                    [1, 1],
                    [2, 1],
                    [1, 2],
                ],
                [
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [1, 2],
                ],
                [
                    [1, 0],
                    [0, 1],
                    [1, 1],
                    [1, 2],
                ],
            ],
            S: [
                [
                    [1, 0],
                    [2, 0],
                    [0, 1],
                    [1, 1],
                ],
                [
                    [1, 0],
                    [1, 1],
                    [2, 1],
                    [2, 2],
                ],
                [
                    [1, 1],
                    [2, 1],
                    [0, 2],
                    [1, 2],
                ],
                [
                    [0, 0],
                    [0, 1],
                    [1, 1],
                    [1, 2],
                ],
            ],
            Z: [
                [
                    [0, 0],
                    [1, 0],
                    [1, 1],
                    [2, 1],
                ],
                [
                    [2, 0],
                    [1, 1],
                    [2, 1],
                    [1, 2],
                ],
                [
                    [0, 1],
                    [1, 1],
                    [1, 2],
                    [2, 2],
                ],
                [
                    [1, 0],
                    [0, 1],
                    [1, 1],
                    [0, 2],
                ],
            ],
            J: [
                [
                    [0, 0],
                    [0, 1],
                    [1, 1],
                    [2, 1],
                ],
                [
                    [1, 0],
                    [2, 0],
                    [1, 1],
                    [1, 2],
                ],
                [
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [2, 2],
                ],
                [
                    [1, 0],
                    [1, 1],
                    [0, 2],
                    [1, 2],
                ],
            ],
            L: [
                [
                    [2, 0],
                    [0, 1],
                    [1, 1],
                    [2, 1],
                ],
                [
                    [1, 0],
                    [1, 1],
                    [1, 2],
                    [2, 2],
                ],
                [
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [0, 2],
                ],
                [
                    [0, 0],
                    [1, 0],
                    [1, 1],
                    [1, 2],
                ],
            ],
        };

        this.COLORS = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        this.mode = mode;

        this.next = this.randomBlock();

        this.init();
    }

    init() {
        this.createGameUI();
        this.initBoard();
        this.bindEvents();

        this.hideGameUI();
    }

    createGameUI() {
        this.container.innerHTML = `
        <div class="tetris-container">
          <div class="tetris-info">
            <div class="score-display">SCORE<br><span id="gameScore">0</span></div>
            <button id="startGameBtn" class="start-btn">START</button>
          </div>
          <div id="tetrisBoard" class="tetris-board"></div>
          <div class="next-display">
            <div style="margin-bottom:4px;">NEXT</div>
            <div id="nextBlock"></div>
          </div>
          <div id="gameOverMsg" class="game-over" style="display:none;">GAME<br>OVER</div>
        </div>
      `;

        this.boardEl = this.container.querySelector('#tetrisBoard');
        this.scoreEl = this.container.querySelector('#gameScore');
        this.startBtn = this.container.querySelector('#startGameBtn');
        this.clearScoresBtn = this.container.querySelector('#clearScoresBtn');
        this.gameOverEl = this.container.querySelector('#gameOverMsg');
        this.nextBlockEl = this.container.querySelector('#nextBlock');
    }

    hideGameUI() {
        this.startBtn.style.display = 'block';
        this.scoreEl.parentElement.style.display = 'none';
        this.boardEl.style.display = 'none';
        this.nextBlockEl.parentElement.style.display = 'none';
        this.gameOverEl.style.display = 'none';
        if (this.clearScoresBtn) this.clearScoresBtn.style.display = 'none';
    }

    showGameUI() {
        this.startBtn.style.display = 'none';
        this.scoreEl.parentElement.style.display = 'block';
        this.boardEl.style.display = 'grid';
        this.nextBlockEl.parentElement.style.display = 'block';
        if (this.clearScoresBtn) this.clearScoresBtn.style.display = 'inline-block';
    }

    initBoard() {
        this.board = Array.from({ length: this.ROWS }, () =>
            Array(this.COLS).fill('')
        );
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => {
            this.showGameUI();
            this.startGame();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
            }
            if (this.isGameOver || !this.current) return;
            switch (e.key) {
                case 'ArrowLeft':
                    this.move(-1, 0, false);
                    break;
                case 'ArrowRight':
                    this.move(1, 0, false);
                    break;
                case 'ArrowDown':
                    this.move(0, 1, false);
                    break;
                case 'ArrowUp':
                    this.move(0, 0, true);
                    break;
                case ' ':
                    this.hardDrop();
                    break;
            }
        });
    }

    randomBlock() {
        if (this.mode === 'o-only') {
            const type = 'O';
            return {
                type,
                dir: 0,
                shape: this.BLOCKS[type][0],
                x: 3,
                y: -2,
            };
        }
        const type =
            this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
        return {
            type,
            dir: 0,
            shape: this.BLOCKS[type][0],
            x: 3,
            y: -2,
        };
    }

    newBlock() {
        const block = this.next;
        this.next = this.randomBlock();
        return block;
    }

    isValid(pos) {
        return pos.shape.every(([dx, dy]) => {
            const x = pos.x + dx;
            const y = pos.y + dy;
            if (x < 0 || x >= this.COLS || y >= this.ROWS) return false;
            if (y < 0) return true;
            return !this.board[y][x];
        });
    }

    fixBlock() {
        this.current.shape.forEach(([dx, dy]) => {
            const x = this.current.x + dx;
            const y = this.current.y + dy;
            if (y >= 0 && y < this.ROWS && x >= 0 && x < this.COLS) {
                this.board[y][x] = this.current.type;
            }
        });
    }

    clearLines() {
        let lines = 0;
        for (let y = this.ROWS - 1; y >= 0; y--) {
            if (this.board[y].every((cell) => cell)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.COLS).fill(''));
                lines++;
                y++;
            }
        }
        if (lines > 0) {
            this.score += lines * 100;
            this.scoreEl.textContent = this.score;
        }
    }

    checkGameOver() {
        if (!this.isValid(this.current)) {
            this.isGameOver = true;
            clearInterval(this.timer);
            this.gameOverEl.style.display = 'block';
            if (this.scoreManager) this.scoreManager.saveScore('default', this.score);
            this.onGameEnd(this.score);
            this.current = null;
        }

        if (this.board[0].some((cell) => cell)) {
            this.isGameOver = true;
            clearInterval(this.timer);
            this.gameOverEl.style.display = 'block';
            if (this.scoreManager) this.scoreManager.saveScore('default', this.score);
            this.onGameEnd(this.score);
            this.current = null;
        }
    }

    move(dx, dy, rotate) {
        if (!this.current) return false;
        let next = {
            ...this.current,
            x: this.current.x + dx,
            y: this.current.y + dy,
            dir: this.current.dir,
            shape: this.current.shape,
        };
        if (rotate) {
            next.dir = (this.current.dir + 1) % 4;
            next.shape = this.BLOCKS[this.current.type][next.dir];
        }
        if (this.isValid(next)) {
            this.current = next;
            this.renderBoard();
            return true;
        }
        return false;
    }

    tick() {
        if (!this.move(0, 1, false)) {
            this.fixBlock();
            this.clearLines();

            // 점수 5000점 단위로 속도 증가
            const speedFactor = Math.floor(this.score / 5000);
            const baseSpeed = 400;
            const newInterval = Math.max(100, baseSpeed - speedFactor * 30);
            clearInterval(this.timer);
            this.timer = setInterval(() => this.tick(), newInterval);

            this.current = this.newBlock();
            this.checkGameOver();
        }
        this.renderBoard();
    }

    hardDrop() {
        if (!this.current) return;
        while (this.move(0, 1, false)) {
            this.score += 2;
        }
        this.scoreEl.textContent = this.score;
        this.tick();
    }

    startGame() {
        this.scoreManager = this.scoreManager || new ScoreManager();

        this.score = 0;
        this.isGameOver = false;
        this.gameOverEl.style.display = 'none';
        this.scoreEl.textContent = '0';
        this.initBoard();
        this.current = this.newBlock();
        this.renderBoard();

        clearInterval(this.timer);
        this.timer = setInterval(() => this.tick(), 400);
    }

    renderBoard() {
        this.boardEl.innerHTML = '';
        for (let y = 0; y < this.ROWS; y++) {
            for (let x = 0; x < this.COLS; x++) {
                const cell = document.createElement('div');
                cell.className = 'tetris-cell';
                if (this.board[y][x]) {
                    cell.classList.add('filled', this.board[y][x]);
                }
                this.boardEl.appendChild(cell);
            }
        }
        if (this.current) {
            this.current.shape.forEach(([dx, dy]) => {
                const x = this.current.x + dx;
                const y = this.current.y + dy;
                if (y >= 0 && y < this.ROWS && x >= 0 && x < this.COLS) {
                    const idx = y * this.COLS + x;
                    this.boardEl.children[idx].classList.add(
                        'filled',
                        this.current.type
                    );
                }
            });
        }
        this.renderNextBlock();
    }

    renderNextBlock() {
        if (!this.nextBlockEl || !this.next) return;
        let html = '';
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                let filled = false;
                for (const [dx, dy] of this.next.shape) {
                    if (x === dx && y === dy) filled = true;
                }
                html += `<div class="tetris-cell${
            filled ? ' filled ' + this.next.type : ''
          }" style="width:16px;height:16px;display:inline-block;margin:0;padding:0;"></div>`;
            }
            html += '<br>';
        }
        this.nextBlockEl.innerHTML = html;
    }
}

// ScoreManager는 따로 import해서 사용하세요.
export class ScoreManager {
    constructor() {
        this.scores = this.loadScores();
    }

    loadScores() {
        const saved = localStorage.getItem('tetrisScores');
        return saved ? JSON.parse(saved) : {};
    }

    saveScore(key, score) {
        if (!this.scores[key] || this.scores[key] < score) {
            this.scores[key] = score;
            localStorage.setItem('tetrisScores', JSON.stringify(this.scores));
        }
    }

    getScore(key) {
        return this.scores[key] || 0;
    }

    getAllScores() {
        return this.scores;
    }

    clearScores() {
        this.scores = {};
        localStorage.removeItem('tetrisScores');
    }
}