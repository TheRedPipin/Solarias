/**
 * SETTINGS MODULE
 * Manages the settings modal and user preference controls.
 * Handles volume, ambience toggle, and game reset functionality.
 */

import { SETTINGS_KEY } from './state.js';

/**
 * Set up all settings modal controls and event listeners.
 * Wires up volume slider, ambience toggle, reset button, and modal open/close.
 * @param {Object} options - Configuration object containing:
 *   - settingsBtn: Button to open settings
 *   - closeSettingsBtn: Button to close settings
 *   - settingsModal: Modal container element
 *   - volumeSlider: Range input for volume control
 *   - ambienceToggle: Checkbox for ambience on/off
 *   - resetBtn: Button to reset game state
 *   - onSettingsChange: Callback when settings change
 *   - settings: Initial settings object
 * @returns {Object} Object with openSettings and closeSettings functions
 */
export function setupSettingsControls(options) {
    const {
        settingsBtn,
        closeSettingsBtn,
        settingsModal,
        volumeSlider,
        ambienceToggle,
        resetBtn,
        onSettingsChange,
        settings
    } = options;

    // Track current settings state
    let currentSettings = settings;

    /**
     * Open the settings modal.
     */
    const openSettings = () => {
        if (settingsModal) settingsModal.hidden = false;
    };

    /**
     * Close the settings modal.
     */
    const closeSettings = () => {
        if (settingsModal) settingsModal.hidden = true;
    };

    // Wire up open/close buttons
    if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    
    // Click outside modal to close
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettings();
        });
    }

    // Volume slider: update settings and trigger callback on change
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = Number(e.target.value);
            currentSettings = { ...currentSettings, volume };
            onSettingsChange(currentSettings); // Triggers save and audio update
        });
    }

    // Ambience toggle: update settings and trigger callback
    if (ambienceToggle) {
        ambienceToggle.addEventListener('change', (e) => {
            const ambienceEnabled = e.target.checked;
            currentSettings = { ...currentSettings, ambienceEnabled };
            onSettingsChange(currentSettings); // Triggers save and audio update
        });
    }

    // Reset button: clear all game data and reload page
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the game? This will clear all progress and settings.')) {
                // Clear all localStorage (settings and any future save data)
                localStorage.clear();
                location.reload(); // Restart with defaults
            }
        });
    }

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsModal && !settingsModal.hidden) {
            closeSettings();
        }
    });

    // Return public API
    return { openSettings, closeSettings };
}
