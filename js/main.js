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

    // 'tetris'와 'tetris2' 모두 여기서 처리
    if (page.type === 'tetris' || page.type === 'tetris2') {
        isTetrisGameActive = true;

        const textElement = document.createElement('div');
        textElement.className = 'typewriter-text';
        container.appendChild(textElement);

        typeText(textElement, page.content, () => {
            const gameContainer = document.createElement('div');
            gameContainer.id = 'tetris-game-container';
            container.appendChild(gameContainer);

            // 'tetris2'면 'o-only' 모드, 아니면 기본
            const mode = page.type === 'tetris2' ? 'o-only' : 'normal';
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
                    processPageFromObject(pages[currentPageIndex]);
                }
            }, mode);
        });
        return;
    }

    if (page.image) {
        const img = document.createElement('img');
        img.src = page.image;
        img.alt = "Page Image";
        img.className = 'page-image';
        container.appendChild(img);
    }

    const textElement = document.createElement('div');
    textElement.className = 'typewriter-text';
    container.appendChild(textElement);

    if (page.type === 'choice') {
        const choicesContainer = document.createElement('div');
        choicesContainer.className = 'choices-container';
        container.appendChild(choicesContainer);

        const resultArea = document.createElement('div');
        resultArea.className = 'choice-result-area';
        container.appendChild(resultArea);

        typeText(textElement, page.content, () => {
            createChoicesSequentially(page.choices, choicesContainer, resultArea, nextPageElement);
        });
    } else {
        let content = page.content;

        if (content.includes('[(여기에 아까 작성한 점수를 띄우고 싶습니다)]')) {
            const savedScores = scoreManager.getAllScores();
            let scoreToShow = 0;

            if (currentPageIndex === 5) {
                scoreToShow = savedScores.oswaldFirstScore || 0;
            } else if (currentPageIndex === 8) {
                scoreToShow = savedScores.oswaldSecondScore || 0;
            } else if (currentPageIndex === 0) {
                scoreManager.clearScores();
            }

            content = content.replace('[(여기에 아까 작성한 점수를 띄우고 싶습니다)]', scoreToShow);
        }

        typeText(textElement, content, () => {
            if (currentPageIndex < pages.length - 1) {
                nextPageElement.style.display = 'block';
            }
        });
    }
}

function createChoicesSequentially(choices, container, resultArea, nextPageElement, index = 0) {
    if (index >= choices.length) return;

    const choice = choices[index];
    const button = createChoiceButton(choice, () => {
        resultArea.innerHTML = '';

        if (typeof choice.result === 'string') {
            const resultText = document.createElement('div');
            resultText.className = 'typewriter-result';
            typeText(resultText, choice.result, () => {
                nextPageElement.style.display = 'block';
            });
            resultArea.appendChild(resultText);
        } else if (typeof choice.result === 'object') {
            processSubChoice(choice.result, resultArea, nextPageElement);
        }
    });

    container.appendChild(button);
    typeTextToButton(button, choice.text, () => {
        setTimeout(() => {
            createChoicesSequentially(choices, container, resultArea, nextPageElement, index + 1);
        }, 300);
    });
}

function processSubChoice(subPage, resultArea, nextPageElement) {
    resultArea.innerHTML = '';

    if (subPage.content) {
        const subTextElement = document.createElement('div');
        subTextElement.className = 'typewriter-text';
        typeText(subTextElement, subPage.content, () => {
            if (subPage.choices && subPage.choices.length > 0) {
                const subChoicesContainer = document.createElement('div');
                subChoicesContainer.className = 'choices-container';
                resultArea.appendChild(subChoicesContainer);
                createSubChoicesSequentially(subPage.choices, subChoicesContainer, resultArea, nextPageElement);
            }
        });
        resultArea.appendChild(subTextElement);
    } else if (subPage.choices && subPage.choices.length > 0) {
        const subChoicesContainer = document.createElement('div');
        subChoicesContainer.className = 'choices-container';
        resultArea.appendChild(subChoicesContainer);
        createSubChoicesSequentially(subPage.choices, subChoicesContainer, resultArea, nextPageElement);
    }
}

function createSubChoicesSequentially(choices, container, resultArea, nextPageElement, index = 0) {
    if (index >= choices.length) return;

    const choice = choices[index];
    const button = createChoiceButton(choice, () => {
        resultArea.innerHTML = '';

        if (typeof choice.result === 'string') {
            const resultText = document.createElement('div');
            resultText.className = 'typewriter-result';
            typeText(resultText, choice.result, () => {
                nextPageElement.style.display = 'block';
            });
            resultArea.appendChild(resultText);
        } else if (typeof choice.result === 'object') {
            processSubChoice(choice.result, resultArea, nextPageElement);
        }
    });

    container.appendChild(button);
    typeTextToButton(button, choice.text, () => {
        setTimeout(() => {
            createSubChoicesSequentially(choices, container, resultArea, nextPageElement, index + 1);
        }, 300);
    });
}

function skipAllTyping() {
    document.querySelectorAll('.typewriter-text, .typewriter-result, .choices-container button').forEach(el => {
        if (typeof el._skipTyping === 'function') el._skipTyping();
    });
}

function isAnyTyping() {
    let typing = false;
    document.querySelectorAll('.typewriter-text, .typewriter-result, .choices-container button').forEach(el => {
        if (typeof el._skipTyping === 'function') typing = true;
    });
    return typing;
}

document.addEventListener('DOMContentLoaded', () => {
    const nextPageElement = document.getElementById('next-page');
    processPageFromObject(pages[0]);
    currentPageIndex = 0;

    nextPageElement.addEventListener('click', () => {
        if (isAnyTyping()) {
            skipAllTyping();
        } else {
            currentPageIndex++;
            if (currentPageIndex < pages.length) {
                processPageFromObject(pages[currentPageIndex]);
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            // 현재 페이지가 테트리스(혹은 테트리스2)면 무시
            const page = pages[currentPageIndex];
            if (page && (page.type === 'tetris' || page.type === 'tetris2')) return;
            e.preventDefault();
            if (isAnyTyping()) {
                skipAllTyping();
            } else {
                if (page && page.type === 'choice') return;
                currentPageIndex++;
                if (currentPageIndex < pages.length) {
                    processPageFromObject(pages[currentPageIndex]);
                }
            }
        }
    });
});