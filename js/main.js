import { pages } from './pages.js';
import { typeText, typeTextToButton } from './typewriter.js';
import { createChoiceButton } from './choices.js';
import { TetrisGame, ScoreManager } from './tetris-game.js';

let currentPageIndex = 0;
let scoreManager = new ScoreManager();
let isTetrisGameActive = false;
let currentTetrisGame;

function processPageFromObject(page) {
    const container = document.getElementById('typewriter-container');
    const nextPageElement = document.getElementById('next-page');
    container.innerHTML = '';
    nextPageElement.style.display = 'none';

    if (page.image) {
        const img = document.createElement('img');
        img.src = page.image;
        img.alt = "Page Image";
        img.className = 'page-image';
        container.appendChild(img);
    }

    if (page.type === 'tetris') {
        isTetrisGameActive = true;
        const textElement = document.createElement('div');
        textElement.className = 'typewriter-text';
        container.appendChild(textElement);

        typeText(textElement, page.content, () => {
            const gameContainer = document.createElement('div');
            gameContainer.id = 'tetris-game-container';
            container.appendChild(gameContainer);

            currentTetrisGame = new TetrisGame(gameContainer, (score) => {
                if (page.scoreKey) {
                    scoreManager.saveScore(page.scoreKey, score);
                }

                const passScore = page.passScore || 700;

                if (score >= passScore) {
                    isTetrisGameActive = false;
                    setTimeout(() => {
                        nextPageElement.style.display = 'block';
                    }, 2000);
                } else {
                    alert("오스월드 : 마음에 들지 않는 점수군요. 최소 " + passScore + "점은 넘을 수 있도록 다시 한 번 시도 해봐야겠습니다.");
                    // ❗ 현재 페이지에서 다시 시작
                    processPageFromObject(pages[currentPageIndex]);
                }
            });
        });
        return;
    }

    const textElement = document.createElement('div');
    textElement.className = 'typewriter-text';
    container.appendChild(textElement);

    if (page.type === 'choice') {
        let choicesContainer = document.createEleme
