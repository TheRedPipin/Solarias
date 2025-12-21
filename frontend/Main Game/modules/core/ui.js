import { CommandType } from './state.js';

export function initElements() {
    const elements = {
        typeBtn: document.getElementById('typeSelect'),
        promptBox: document.getElementById('promptBox'),
        descPanel: document.querySelector('#descriptionPanel .panel-content'),
        viewPanel: document.querySelector('#viewPanel .view-content'),
        playerName: document.getElementById('playerName')
    };
    const missing = Object.entries(elements)
        .filter(([, el]) => !el)
        .map(([name]) => name);
    if (missing.length > 0) {
        console.error('Missing required elements:', missing);
        return null;
    }
    return elements;
}

export function toggleCommandType(elements) {
    const currentType = elements.typeBtn.textContent;
    elements.typeBtn.textContent =
        currentType === CommandType.DO ? CommandType.SAY : CommandType.DO;
    elements.promptBox.focus();
}

export function addMessage(elements, message, className = '', instant = false) {
    const line = document.createElement('div');
    if (className) line.className = className;
    elements.descPanel.appendChild(line);
    if (!message || instant) {
        line.textContent = message;
        elements.descPanel.parentElement.scrollTop =
            elements.descPanel.parentElement.scrollHeight;
        return;
    }

    let charIndex = 0;
    const typeSpeed = 5;
    
    const typeChar = () => {
        if (charIndex < message.length) {
            line.textContent += message[charIndex];
            charIndex++;
            elements.descPanel.parentElement.scrollTop =
                elements.descPanel.parentElement.scrollHeight;
            
            setTimeout(typeChar, typeSpeed);
        }
    };
    
    typeChar();
}

export function loadViewImage(src, alt = 'Game view', glitchEffect = false, forceTransition = false) {
        if (!src || typeof src !== 'string') {
            console.error('Invalid image source provided:', src);
            return;
        }
        if (!src.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            console.warn('Image source may not be a valid image file:', src);
        }
    const viewContent = document.querySelector('#viewPanel .view-content');
    if (!viewContent) return;
    let img = viewContent.querySelector('img');
    const sameImage = img && img.src.endsWith(src.split('/').pop());
    if (sameImage && !forceTransition) {
        if (glitchEffect) {
            img.classList.add('glitch');
            setTimeout(() => img.classList.remove('glitch'), 900);
        }
        return;
    }
    
    if (img) {
        img.style.opacity = '0';
        setTimeout(() => {
            img.src = src;
            img.alt = alt;
            img.className = 'view-image show';
            img.style.opacity = '1';
            
            if (glitchEffect) {
                img.classList.add('glitch');
                setTimeout(() => img.classList.remove('glitch'), 900);
            }
        }, 300);
    } else {
        img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.className = 'view-image';
        viewContent.appendChild(img);
        setTimeout(() => {
            img.classList.add('show');
            
            if (glitchEffect) {
                setTimeout(() => {
                    img.classList.add('glitch');
                    setTimeout(() => img.classList.remove('glitch'), 400);
                }, 100);
            }
        }, 50);
    }
}

export function displayGoalText(text = 'Find the sun...') {
    const goalDiv = document.createElement('div');
    goalDiv.className = 'goal-text';
    goalDiv.textContent = text;
    document.body.appendChild(goalDiv);

    setTimeout(() => {
        goalDiv.remove();
        setTimeout(() => {
            const initialImg = document.querySelector('#viewPanel .view-image');
            if (initialImg) {
                initialImg.classList.add('show');
            }
        }, 500);
    }, 3800);
}

export function applySettings(settings, controls) {
    const { ambienceAudio, breathingAudio, volumeSlider, volumeValue, ambienceToggle } = controls;
    const clampedVolume = Math.min(100, Math.max(0, Number(settings.volume)));
    if (volumeSlider) volumeSlider.value = clampedVolume;
    if (volumeValue) volumeValue.textContent = clampedVolume + '%';
    if (ambienceToggle) ambienceToggle.checked = !!settings.ambienceEnabled;
    const audioElements = [ambienceAudio, breathingAudio].filter(Boolean);
    audioElements.forEach(audio => {
        audio.volume = clampedVolume / 100;
        if (settings.ambienceEnabled) {
            audio.play().catch(err => console.log('Audio playback failed:', err));
        } else {
            audio.pause();
        }
    });
}
