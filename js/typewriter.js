// **로 묶인 문자열을 HTML로 변환하는 함수 (타이핑용 파싱)
function parseHighlightSegments(text) {
    // 결과: [{text, highlight: true|false} ...]
    const result = [];
    let i = 0;
    let inHighlight = false;
    let buffer = '';
    while (i < text.length) {
        if (text.slice(i, i + 2) === '**') {
            if (inHighlight) {
                // 하이라이트 종료
                result.push({ text: buffer, highlight: true });
                buffer = '';
                inHighlight = false;
            } else {
                // 하이라이트 시작
                if (buffer) result.push({ text: buffer, highlight: false });
                buffer = '';
                inHighlight = true;
            }
            i += 2;
        } else {
            buffer += text[i];
            i++;
        }
    }
    if (buffer) result.push({ text: buffer, highlight: inHighlight });
    return result;
}

// typeText: 각 엘리먼트별로 타이핑 상태/스킵 관리
export function typeText(element, text, onComplete) {
    let localTimeoutId = null;
    let localSkipTyping = false;
    let segments = parseHighlightSegments(typeof text === 'string' ? text : '');
    let segIdx = 0,
        charIdx = 0;
    element.innerHTML = '';
    let currentSpan = null;

    element._skipTyping = () => {
        localSkipTyping = true;
        // 전체를 한 번에 출력
        element.innerHTML = segments.map(seg => seg.highlight ? `<span class="highlight-text">${seg.text.replace(/\n/g, '<br>')}</span>` : seg.text.replace(/\n/g, '<br>')).join('');
        delete element._skipTyping;
        if (onComplete) onComplete();
    };

    function typeChar() {
        if (localSkipTyping) return;
        // 모두 출력 완료
        if (segIdx >= segments.length) {
            delete element._skipTyping;
            if (onComplete) onComplete();
            return;
        }
        // 현재 span이 없으면 새로 생성
        if (charIdx === 0) {
            if (segments[segIdx].highlight) {
                currentSpan = document.createElement('span');
                currentSpan.className = 'highlight-text';
                element.appendChild(currentSpan);
            } else {
                currentSpan = element;
            }
        }
        // 한 글자 추가
        const ch = segments[segIdx].text[charIdx];
        if (ch === '\n') {
            if (currentSpan === element) {
                element.appendChild(document.createElement('br'));
            } else {
                currentSpan.appendChild(document.createElement('br'));
            }
        } else {
            currentSpan.appendChild(document.createTextNode(ch));
        }
        charIdx++;
        if (charIdx >= segments[segIdx].text.length) {
            segIdx++;
            charIdx = 0;
            currentSpan = null;
        }
        localTimeoutId = setTimeout(typeChar, 80);
    }
    typeChar();
}

export function typeTextToButton(button, text, onComplete) {
    // 버튼에는 하이라이트 적용 안 함 (기존대로)
    let localTimeoutId = null;
    let localSkipTyping = false;
    let idx = 0;
    let safeText = (typeof text === 'string') ? text : '';
    button.textContent = '';

    button._skipTyping = () => {
        localSkipTyping = true;
        if (localTimeoutId) clearTimeout(localTimeoutId);
        button.textContent = safeText;
        delete button._skipTyping;
        if (onComplete) onComplete();
    };

    function typeChar() {
        if (localSkipTyping) return;
        if (idx < safeText.length) {
            button.textContent += safeText.charAt(idx);
            idx++;
            localTimeoutId = setTimeout(typeChar, 10);
        } else {
            delete button._skipTyping;
            if (onComplete) onComplete();
        }
    }
    typeChar();
}