export const CommandType = {
    DO: 'Do',
    SAY: 'Say'
};

export const SETTINGS_KEY = 'solarias-settings';

export const DEFAULT_SETTINGS = {
    volume: 50,
    ambienceEnabled: true
};

export function loadSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return { ...DEFAULT_SETTINGS };
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (err) {
        console.warn('Failed to load settings, using defaults', err);
        return { ...DEFAULT_SETTINGS };
    }
}

export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (err) {
        console.warn('Failed to save settings', err);
    }
}
