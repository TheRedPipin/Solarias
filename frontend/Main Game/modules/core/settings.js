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
    let currentSettings = settings;
    const openSettings = () => {
        if (settingsModal) settingsModal.hidden = false;
    };
    const closeSettings = () => {
        if (settingsModal) settingsModal.hidden = true;
    };

    if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettings();
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = Number(e.target.value);
            currentSettings = { ...currentSettings, volume };
            onSettingsChange(currentSettings);
        });
    }

    if (ambienceToggle) {
        ambienceToggle.addEventListener('change', (e) => {
            const ambienceEnabled = e.target.checked;
            currentSettings = { ...currentSettings, ambienceEnabled };
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
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsModal && !settingsModal.hidden) {
            closeSettings();
        }
    });

    return { openSettings, closeSettings };
}
