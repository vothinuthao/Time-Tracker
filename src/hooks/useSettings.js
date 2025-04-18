// src/hooks/useSettings.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { settingsService } from '../services/settingsService';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load settings on initial render
    useEffect(() => {
        const loadedSettings = settingsService.getSettings();
        setSettings(loadedSettings);
        setLoading(false);
    }, []);

    // Update goals
    const updateGoals = (newGoals) => {
        if (!settings) return false;

        const success = settingsService.updateSettings('goals', newGoals);

        if (success) {
            setSettings({
                ...settings,
                goals: {
                    ...settings.goals,
                    ...newGoals
                }
            });
        }

        return success;
    };

    // Update rates
    const updateRates = (newRates) => {
        if (!settings) return false;

        const success = settingsService.updateSettings('rates', newRates);

        if (success) {
            setSettings({
                ...settings,
                rates: {
                    ...settings.rates,
                    ...newRates
                }
            });
        }

        return success;
    };

    // Update display settings
    const updateDisplay = (newDisplay) => {
        if (!settings) return false;

        const success = settingsService.updateSettings('display', newDisplay);

        if (success) {
            setSettings({
                ...settings,
                display: {
                    ...settings.display,
                    ...newDisplay
                }
            });
        }

        return success;
    };

    // Reset all settings to default
    const resetSettings = () => {
        const defaultSettings = settingsService.resetSettings();
        setSettings(defaultSettings);
        return true;
    };

    // Calculate income for given minutes
    const calculateIncome = (minutes) => {
        if (!settings) return { net: 0, contribution: 0, total: 0 };

        const hours = minutes / 60;
        const { hourlyRate, contributionPercentage } = settings.rates;

        const total = hours * hourlyRate;
        const contribution = (total * contributionPercentage) / 100;
        const net = total - contribution;

        return {
            net,
            contribution,
            total,
            currency: settings.rates.currency
        };
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (!settings) return '0';

        // Simple thousand separator formatting
        return amount.toLocaleString('vi-VN') + ' ' + settings.rates.currency;
    };

    const value = {
        settings,
        loading,
        updateGoals,
        updateRates,
        updateDisplay,
        resetSettings,
        calculateIncome,
        formatCurrency
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}