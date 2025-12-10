/**
 * STATE MODULE
 * Manages application state, constants, and localStorage persistence.
 * Handles user settings (volume, ambience) with fallback defaults.
 */

// Command type constants for the prompt input mode
export const CommandType = {
    DO: 'Do',    // Action commands (move, examine, take)
    SAY: 'Say'   // Dialogue commands (speak, ask, tell)
};

// localStorage key for persisting user settings
export const SETTINGS_KEY = 'solarias-settings';

// Default settings applied on first load or error
export const DEFAULT_SETTINGS = {
    volume: 50,              // Audio volume (0-100)
    ambienceEnabled: true    // Background audio toggle
};

/**
 * Load user settings from localStorage with fallback to defaults.
 * Merges saved settings with defaults to handle new settings keys.
 * @returns {Object} Settings object with volume and ambienceEnabled
 */
export function loadSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return { ...DEFAULT_SETTINGS };
        const parsed = JSON.parse(raw);
        // Merge with defaults to ensure all keys exist
        return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (err) {
        console.warn('Failed to load settings, using defaults', err);
        return { ...DEFAULT_SETTINGS };
    }
}

/**
 * Persist settings to localStorage.
 * @param {Object} settings - Settings object to save
 */
export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (err) {
        console.warn('Failed to save settings', err);
    }
}
