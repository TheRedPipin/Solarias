/**
 * UI MODULE
 * Handles DOM manipulation, element initialization, and visual updates.
 * Manages message display, image loading, animations, and settings application.
 */

import { CommandType } from './state.js';

/**
 * Initialize and validate all required DOM element references.
 * @returns {Object|null} Object containing element references, or null if any are missing
 */
export function initElements() {
    const elements = {
        typeBtn: document.getElementById('typeSelect'),        // Command type toggle button
        promptBox: document.getElementById('promptBox'),       // Command input field
        descPanel: document.querySelector('#descriptionPanel .panel-content'), // Narrative text area
        viewPanel: document.querySelector('#viewPanel .view-content'),         // Visual display area
        playerName: document.getElementById('playerName')      // Player info display
    };

    // Check for missing elements and log errors
    const missing = Object.entries(elements)
        .filter(([, el]) => !el)
        .map(([name]) => name);

    if (missing.length > 0) {
        console.error('Missing required elements:', missing);
        return null;
    }

    return elements;
}

/**
 * Toggle between Do and Say command modes.
 * @param {Object} elements - DOM element references
 */
export function toggleCommandType(elements) {
    const currentType = elements.typeBtn.textContent;
    // Switch between Do and Say modes
    elements.typeBtn.textContent =
        currentType === CommandType.DO ? CommandType.SAY : CommandType.DO;
    // Keep focus on input for continuous typing
    elements.promptBox.focus();
}

/**
 * Add a message to the description panel with typewriter effect and auto-scroll.
 * @param {Object} elements - DOM element references
 * @param {string} message - The message text to display
 * @param {string} className - Optional CSS class for styling (e.g., 'command-echo', 'system-message')
 * @param {boolean} instant - Skip typewriter effect if true
 */
export function addMessage(elements, message, className = '', instant = false) {
    // Create new message line
    const line = document.createElement('div');
    if (className) line.className = className;
    
    // Append to panel
    elements.descPanel.appendChild(line);
    
    // Skip typewriter for empty messages or instant mode
    if (!message || instant) {
        line.textContent = message;
        elements.descPanel.parentElement.scrollTop =
            elements.descPanel.parentElement.scrollHeight;
        return;
    }
    
    // Typewriter effect
    let charIndex = 0;
    const typeSpeed = className === 'command-echo' ? 20 : 15; // Faster for commands
    
    const typeChar = () => {
        if (charIndex < message.length) {
            line.textContent += message[charIndex];
            charIndex++;
            
            // Auto-scroll as text appears
            elements.descPanel.parentElement.scrollTop =
                elements.descPanel.parentElement.scrollHeight;
            
            setTimeout(typeChar, typeSpeed);
        }
    };
    
    typeChar();
}

/**
 * Load a new image into the view panel with transition effects.
 * @param {string} src - Image source path
 * @param {string} alt - Alt text for accessibility
 * @param {boolean} glitchEffect - Whether to apply glitch effect for creepy rooms
 */
export function loadViewImage(src, alt = 'Game view', glitchEffect = false, forceTransition = false) {
    // Validate image path exists (basic check for relative paths)
        if (!src || typeof src !== 'string') {
            console.error('Invalid image source provided:', src);
            return;
        }
        
        // Check if path appears to be valid (has file extension)
        if (!src.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            console.warn('Image source may not be a valid image file:', src);
        }
    const viewContent = document.querySelector('#viewPanel .view-content');
    if (!viewContent) return;
    
    let img = viewContent.querySelector('img');
    
    const sameImage = img && img.src.endsWith(src.split('/').pop());

    // If same image and no forced transition, just add glitch if requested
    if (sameImage && !forceTransition) {
        if (glitchEffect) {
            img.classList.add('glitch');
            setTimeout(() => img.classList.remove('glitch'), 900);
        }
        return;
    }
    
    if (img) {
        // Fade out current image
        img.style.opacity = '0';
        
        setTimeout(() => {
            img.src = src;
            img.alt = alt;
            img.className = 'view-image show';
            img.style.opacity = '1';
            
            // Apply glitch effect for special rooms
            if (glitchEffect) {
                img.classList.add('glitch');
                setTimeout(() => img.classList.remove('glitch'), 900);
            }
        }, 300);
    } else {
        // Create new image element
        img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.className = 'view-image';
        viewContent.appendChild(img);
        
        // Trigger show animation
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

/**
 * Display goal text with typewriter animation that auto-disappears.
 * Shows text for ~3.8s then fades out, followed by initial image reveal.
 * @param {string} text - The goal text to display
 */
export function displayGoalText(text = 'Find the sun...') {
    const goalDiv = document.createElement('div');
    goalDiv.className = 'goal-text'; // CSS handles typewriter + fade animation
    goalDiv.textContent = text;
    document.body.appendChild(goalDiv);

    // Remove goal text after animation completes
    setTimeout(() => {
        goalDiv.remove();
        // Delay before showing initial image
        setTimeout(() => {
            const initialImg = document.querySelector('#viewPanel .view-image');
            if (initialImg) {
                initialImg.classList.add('show'); // Triggers fade-in animation
            }
        }, 500); // 500ms gap between goal disappear and image appear
    }, 3800); // 3.8s total animation duration
}

/**
 * Apply settings to UI controls and audio element.
 * Syncs saved settings with slider values, checkboxes, and audio state.
 * @param {Object} settings - Settings object with volume and ambienceEnabled
 * @param {Object} controls - Object containing DOM references for controls and audio
 */
export function applySettings(settings, controls) {
    const { ambienceAudio, breathingAudio, volumeSlider, volumeValue, ambienceToggle } = controls;
    // Clamp volume to valid range (0-100)
    const clampedVolume = Math.min(100, Math.max(0, Number(settings.volume)));

    // Update UI controls
    if (volumeSlider) volumeSlider.value = clampedVolume;
    if (volumeValue) volumeValue.textContent = clampedVolume + '%';
    if (ambienceToggle) ambienceToggle.checked = !!settings.ambienceEnabled;

    // Apply to both audio elements
    const audioElements = [ambienceAudio, breathingAudio].filter(Boolean);
    audioElements.forEach(audio => {
        audio.volume = clampedVolume / 100; // Convert to 0-1 range
        if (settings.ambienceEnabled) {
            // Attempt to play, handle autoplay restrictions
            audio.play().catch(err => console.log('Audio playback failed:', err));
        } else {
            audio.pause();
        }
    });
}
