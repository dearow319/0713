// 테트리스 게임 통합 모듈
export class TetrisGame {
    constructor(container, onGameEnd) {
        this.container = container;
        this.onGameEnd = onGameEnd;
        this.score = 0;
        this.isGameOver = false;
        this.board = [];
        this.current = null;
        this.timer = null;

        // 게임 설정
        this.ROWS = 20;
        this.COLS = 10;
        this.BLOCKS = {
            I: [
                [
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [3, 1]
                ],
                [
                    [2, 0],
                    [2, 1],
                    [2, 2],
                    [2, 3]
                ],
                [
                    [0, 2],
                    [1, 2],
                    [2, 2],
                    [3, 2]
                ],
                [
                    [1, 0],
                    [1, 1],
                    [1, 2],
                    [1, 3]
                ]
            ],
            O: [
                [
                    [1, 0],
                    [2, 0],
                    [1, 1],
                    [2, 1]
                ],
                [
                    [1, 0],
                    [2, 0],
                    [1, 1],
                    [2, 1]
                ],
                [
                    [1, 0],
                    [2, 0],
                    [1, 1],
                    [2, 1]
                ],
                [
                    [1, 0],
                    [2, 0],
                    [1, 1],
                    [2, 1]
                ]
            ],
            T: [
                [
                    [1, 0],
                    [0, 1],
                    [1, 1],
                    [2, 1]
                ],
                [
                    [1, 0],
                    [1, 1],
                    [2, 1],
                    [1, 2]
                ],
                [
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [1, 2]
                ],
                [
                    [1, 0],
                    [0, 1],
                    [1, 1],
                    [1, 2]
                ]
            ],
            S: [
                [
                    [1, 0],
                    [2, 0],
                    [0, 1],
                    [1, 1]
                ],
                [
                    [1, 0],
                    [1, 1],
                    [2, 1],
                    [2, 2]
                ],
                [
                    [1, 1],
                    [2, 1],
                    [0, 2],
                    [1, 2]
                ],
                [
                    [0, 0],
                    [0, 1],
                    [1, 1],
                    [1, 2]
                ]
            ],
            Z: [
                [
                    [0, 0],
                    [1, 0],
                    [1, 1],
                    [2, 1]
                ],
                [
                    [2, 0],
                    [1, 1],
                    [2, 1],
                    [1, 2]
                ],
                [
                    [0, 1],
                    [1, 1],
                    [1, 2],
                    [2, 2]
                ],
                [
                    [1, 0],
                    [0, 1],
                    [1, 1],
                    [0, 2]
                ]
            ],
            J: [
                [
                    [0, 0],
                    [0, 1],
                    [1, 1],
                    [2, 1]
                ],
                [
                    [1, 0],
                    [2, 0],
                    [1, 1],
                    [1, 2]
                ],
                [
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [2, 2]
                ],
                [
                    [1, 0],
                    [1, 1],
                    [0, 2],
                    [1, 2]
                ]
            ],
            L: [
                [
                    [2, 0],
                    [0, 1],
                    [1, 1],
                    [2, 1]
                ],
                [
                    [1, 0],
                    [1, 1],
                    [1, 2],
                    [2, 2]
                ],
                [
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [0, 2]
                ],
                [
                    [0, 0],
                    [1, 0],
                    [1, 1],
                    [1, 2]
                ]
            ]
        };
        this.COLORS = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

        this.init();
    }

    init() {
        this.createGameUI();
        this.initBoard();
        this.bindEvents();
        this.renderBoard();
    }

    createGameUI() {
        this.container.innerHTML = `
            <div class="tetris-container">
                <div class="tetris-info">
                    <div class="score-display">점수: <span id="gameScore">0</span></div>
                    <button id="startGameBtn" class="start-btn">게임 시작</button>
                </div>
                <div id="tetrisBoard" class="tetris-board"></div>
                <div id="gameOverMsg" class="game-over" style="display: none;">게임 오버!</div>
            </div>
        `;

        this.boardEl = this.container.querySelector('#tetrisBoard');
        this.scoreEl = this.container.querySelector('#gameScore');
        this.startBtn = this.container.querySelector('#startGameBtn');
        this.gameOverEl = this.container.querySelector('#gameOverMsg');
    }

    initBoard() {
        this.board = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(''));
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

        // 현재 블록 표시
        if (this.current) {
            this.current.shape.forEach(([dx, dy]) => {
                const x = this.current.x + dx;
                const y = this.current.y + dy;
                if (y >= 0 && y < this.ROWS && x >= 0 && x < this.COLS) {
                    const idx = y * this.COLS + x;
                    this.boardEl.children[idx].classList.add('filled', this.current.type);
                }
            });
        }
    }

    newBlock() {
        const type = this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
        return {
            type,
            dir: 0,
            shape: this.BLOCKS[type][0],
            x: 3,
            y: -2
        };
    }

    isValid(pos) {
        const result = pos.shape.every(([dx, dy]) => {
            const x = pos.x + dx;
            const y = pos.y + dy;
            if (x < 0 || x >= this.COLS || y >= this.ROWS) return false;
            if (y < 0) return true;
            return !this.board[y][x];
        });

        console.log('isValid 체크:', {
            pos: pos,
            result: result,
            shape: pos.shape
        });

        return result;
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
            if (this.board[y].every(cell => cell)) {
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
        // 새로운 블록이 보드 위에 생성될 수 없으면 게임 오버
        if (!this.isValid(this.current)) {
            console.log('게임 오버 조건 확인:', {
                current: this.current,
                isValid: this.isValid(this.current),
                boardTop: this.board[0]
            });

            this.isGameOver = true;
            clearInterval(this.timer);
            this.gameOverEl.style.display = 'block';
            console.log('게임 오버! 최종 점수:', this.score);
            this.onGameEnd(this.score);
        }

        // 추가 게임 오버 조건: 보드의 맨 위 줄이 가득 찬 경우
        if (this.board[0].some(cell => cell)) {
            console.log('보드 맨 위가 가득 참 - 게임 오버');
            this.isGameOver = true;
            clearInterval(this.timer);
            this.gameOverEl.style.display = 'block';
            console.log('게임 오버! 최종 점수:', this.score);
            this.onGameEnd(this.score);
        }
    }

    move(dx, dy, rotate) {
        if (!this.current) return;
        let next = {
            ...this.current,
            x: this.current.x + dx,
            y: this.current.y + dy,
            dir: this.current.dir,
            shape: this.current.shape
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
            this.current = this.newBlock();
            console.log('새 블록 생성:', this.current);
            this.checkGameOver();
        }
        this.renderBoard();
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());

        document.addEventListener('keydown', (e) => {
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
                    this.move(0, 0, true); // 회전
                    break;
                case ' ': // Space - 하드 드롭
                    this.hardDrop();
                    break;
            }
        });
    }

    // 하드 드롭 기능 추가
    hardDrop() {
        if (!this.current) return;

        // 블록이 더 이상 아래로 이동할 수 없을 때까지 이동
        while (this.move(0, 1, false)) {
            // 점수 보너스 (하드 드롭 시 추가 점수)
            this.score += 2;
            this.scoreEl.textContent = this.score;
        }

        // 마지막으로 한 번 더 이동 시도하여 블록 고정
        this.tick();
    }

    startGame() {
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

    destroy() {
        clearInterval(this.timer);
        this.container.innerHTML = '';
    }
}

// 점수 저장 관리
export class ScoreManager {
    constructor() {
        this.scores = this.loadScores();
    }

    loadScores() {
        const saved = localStorage.getItem('tetrisScores');
        return saved ? JSON.parse(saved) : {};
    }

    saveScore(key, score) {
        this.scores[key] = score;
        localStorage.setItem('tetrisScores', JSON.stringify(this.scores));
    }

    getScore(key) {
        return this.scores[key] || 0;
    }

    getAllScores() {
        return this.scores;
    }
}