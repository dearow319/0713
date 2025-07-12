export function createChoiceButton(choice, onClick) {
    const button = document.createElement('button');
    button.style.display = 'block';
    button.style.width = '100%';
    button.style.textAlign = 'left';
    button.style.background = 'none';
    button.style.border = 'none';
    button.style.marginBottom = '10px';
    button.style.fontSize = '18px';
    button.style.padding = '0px 0';
    button.style.color = '#fff';
    button.style.cursor = 'pointer';
    button.onmouseover = () => button.style.background = '#222';
    button.onmouseout = () => button.style.background = 'none';
    button.disabled = false;
    button.addEventListener('click', onClick);
    return button;
}