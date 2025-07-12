// ScoreManager.js
export class ScoreManager {
    constructor() {
        this.scores = this.loadScores();
    }

    loadScores() {
        const saved = localStorage.getItem('tetrisScores');
        return saved ? JSON.parse(saved) : {};
    }

    saveScore(name, score) {
        if (!this.scores[name] || this.scores[name] < score) {
            this.scores[name] = score;
            localStorage.setItem('tetrisScores', JSON.stringify(this.scores));
        }
    }

    getScore(name) {
        return this.scores[name] || 0;
    }

    getAllScores() {
        return this.scores;
    }
}