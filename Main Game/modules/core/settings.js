export const SETTINGS_KEY = 'solarias-settings';

export const DEFAULT_SETTINGS = { volume: 50, ambienceEnabled: true };

export function loadSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return { ...DEFAULT_SETTINGS };
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
}

export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
}

export function setupSettingsControls(options) {
    const {
        settingsBtn, closeSettingsBtn, settingsModal,
        volumeSlider, ambienceToggle, resetBtn,
        onSettingsChange, settings
    } = options;

    let currentSettings = settings;

    const openSettings = () => { if (settingsModal) settingsModal.hidden = false; };
    const closeSettings = () => { if (settingsModal) settingsModal.hidden = true; };

    if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) closeSettings(); });
    }
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            currentSettings = { ...currentSettings, volume: Number(e.target.value) };
            onSettingsChange(currentSettings);
        });
    }
    if (ambienceToggle) {
        ambienceToggle.addEventListener('change', (e) => {
            currentSettings = { ...currentSettings, ambienceEnabled: e.target.checked };
            onSettingsChange(currentSettings);
        });
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the game? This will clear all progress and settings.')) {
                localStorage.clear();
                location.reload();
            }
        });
    }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && settingsModal && !settingsModal.hidden) closeSettings(); });

    return { openSettings, closeSettings };
}