// src/services/settingsService.js

// Key for localStorage
const SETTINGS_KEY = 'timetracker_settings';

// Default settings
const DEFAULT_SETTINGS = {
    goals: {
        daily: 480, // 8 hours in minutes
        weekly: 2400, // 40 hours in minutes
        monthly: 10080, // 168 hours in minutes
    },
    rates: {
        hourlyRate: 0, // Default hourly rate
        contributionPercentage: 10, // Default contribution percentage
        currency: 'VND', // Default currency
    },
    display: {
        language: 'vi', // Default language
        startDayOfWeek: 1, // 0 = Sunday, 1 = Monday
    }
};

// Settings service
export const settingsService = {
    // Get all settings
    getSettings: () => {
        const settings = localStorage.getItem(SETTINGS_KEY);
        if (!settings) {
            // If no settings exist yet, save and return defaults
            settingsService.saveSettings(DEFAULT_SETTINGS);
            return DEFAULT_SETTINGS;
        }

        try {
            return JSON.parse(settings);
        } catch (error) {
            console.error('Error parsing settings:', error);
            return DEFAULT_SETTINGS;
        }
    },

    // Save all settings
    saveSettings: (settings) => {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    },

    // Update specific settings section
    updateSettings: (section, newValues) => {
        const currentSettings = settingsService.getSettings();

        const updatedSettings = {
            ...currentSettings,
            [section]: {
                ...currentSettings[section],
                ...newValues
            }
        };

        return settingsService.saveSettings(updatedSettings);
    },

    // Reset settings to default
    resetSettings: () => {
        return settingsService.saveSettings(DEFAULT_SETTINGS);
    }
};