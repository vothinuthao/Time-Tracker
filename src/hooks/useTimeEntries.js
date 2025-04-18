// src/hooks/useTimeEntries.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useProjects } from './useProjects';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { calculateDuration } from '../utils/timeCalculator';

const TimeEntriesContext = createContext();

export function TimeEntriesProvider({ children }) {
    const [timeEntries, setTimeEntries] = useState([]);
    const [isTracking, setIsTracking] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [currentNote, setCurrentNote] = useState('');
    const [monthSummary, setMonthSummary] = useState({});

    const { currentProject, getCurrentProject, projects } = useProjects();

    // Load time entries from storage on initial render
    useEffect(() => {
        const savedEntries = loadFromStorage('time_entries');
        if (savedEntries && savedEntries.length > 0) {
            setTimeEntries(savedEntries);
        }

        // Check if there's an active tracking session
        const activeSession = loadFromStorage('active_session');
        if (activeSession) {
            setIsTracking(true);
            setStartTime(new Date(activeSession.startTime));
            setCurrentNote(activeSession.note || '');
        }
    }, []);

    // Save time entries to storage whenever they change
    useEffect(() => {
        saveToStorage('time_entries', timeEntries);
        calculateMonthSummary();
    }, [timeEntries]);

    // Save active session whenever tracking state changes
    useEffect(() => {
        if (isTracking && startTime) {
            saveToStorage('active_session', {
                projectId: currentProject,
                startTime: startTime.toISOString(),
                note: currentNote
            });
        } else {
            // Remove active session if not tracking
            localStorage.removeItem('active_session');
        }
    }, [isTracking, startTime, currentProject, currentNote]);

    // Calculate monthly summary
    const calculateMonthSummary = () => {
        const summary = {};

        timeEntries.forEach(entry => {
            const date = new Date(entry.startTime);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

            if (!summary[monthYear]) {
                summary[monthYear] = {
                    totalMinutes: 0,
                    projects: {}
                };
            }

            summary[monthYear].totalMinutes += entry.duration;

            if (!summary[monthYear].projects[entry.projectId]) {
                summary[monthYear].projects[entry.projectId] = {
                    name: entry.projectName,
                    totalMinutes: 0
                };
            }

            summary[monthYear].projects[entry.projectId].totalMinutes += entry.duration;
        });

        setMonthSummary(summary);
    };

    // Start time tracking
    const startTracking = () => {
        if (!currentProject) return false;

        setIsTracking(true);
        setStartTime(new Date());
        return true;
    };

    // Update note during tracking
    const updateNote = (note) => {
        setCurrentNote(note);
    };

    // Stop time tracking and save entry
    const stopTracking = () => {
        if (!isTracking || !startTime || !currentProject) return false;

        const endTime = new Date();
        const project = getCurrentProject();

        if (!project) return false;

        const duration = calculateDuration(startTime, endTime);

        const newEntry = {
            id: Date.now().toString(),
            projectId: currentProject,
            projectName: project.name,
            projectColor: project.color || '#4F46E5',
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration: duration,
            note: currentNote,
            date: endTime.toISOString().split('T')[0]
        };

        setTimeEntries(prev => [...prev, newEntry]);
        setIsTracking(false);
        setStartTime(null);
        setCurrentNote('');

        return newEntry;
    };

    // Add a manual time entry
    const addManualTimeEntry = (entryData) => {
        // Generate ID if not provided
        if (!entryData.id) {
            entryData.id = Date.now().toString();
        }

        // Ensure projectColor is set
        if (!entryData.projectColor) {
            const project = projects.find(p => p.id === entryData.projectId);
            entryData.projectColor = project?.color || '#4F46E5';
        }

        setTimeEntries(prev => [...prev, entryData]);
        return entryData;
    };

    // Delete a time entry
    const deleteEntry = (id) => {
        setTimeEntries(prev => prev.filter(entry => entry.id !== id));
    };

    // Edit a time entry
    const editEntry = (id, updatedData) => {
        setTimeEntries(prev =>
            prev.map(entry => {
                if (entry.id === id) {
                    const updated = { ...entry, ...updatedData };

                    // Recalculate duration if start or end time changed
                    if (updatedData.startTime || updatedData.endTime) {
                        const start = new Date(updatedData.startTime || entry.startTime);
                        const end = new Date(updatedData.endTime || entry.endTime);
                        updated.duration = calculateDuration(start, end);
                    }

                    // Update project color if project changed
                    if (updatedData.projectId && updatedData.projectId !== entry.projectId) {
                        const project = projects.find(p => p.id === updatedData.projectId);
                        updated.projectColor = project?.color || '#4F46E5';
                    }

                    return updated;
                }
                return entry;
            })
        );
    };

    // Get current month entries
    const getCurrentMonthEntries = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return timeEntries.filter(entry => {
            const entryDate = new Date(entry.startTime);
            return entryDate.getMonth() === currentMonth &&
                entryDate.getFullYear() === currentYear;
        });
    };

    // Get entries for a specific day
    const getDayEntries = (date) => {
        const dayString = typeof date === 'string' ? date : date.toISOString().split('T')[0];

        return timeEntries.filter(entry => {
            return entry.date === dayString;
        });
    };

    // Get tracked time for today
    const getTodayTrackedTime = () => {
        const today = new Date().toISOString().split('T')[0];

        return timeEntries
            .filter(entry => entry.date === today)
            .reduce((total, entry) => total + entry.duration, 0);
    };

    // Get entries for a date range
    const getEntriesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return timeEntries.filter(entry => {
            const entryDate = new Date(entry.startTime);
            return entryDate >= start && entryDate <= end;
        });
    };

    // Search entries by text in project name or note
    const searchEntries = (searchText) => {
        if (!searchText) return timeEntries;

        const lowerCaseQuery = searchText.toLowerCase();

        return timeEntries.filter(entry =>
            entry.projectName.toLowerCase().includes(lowerCaseQuery) ||
            (entry.note && entry.note.toLowerCase().includes(lowerCaseQuery))
        );
    };

    const value = {
        timeEntries,
        isTracking,
        startTime,
        currentNote,
        monthSummary,
        startTracking,
        stopTracking,
        updateNote,
        addManualTimeEntry,
        deleteEntry,
        editEntry,
        getCurrentMonthEntries,
        getDayEntries,
        getTodayTrackedTime,
        getEntriesInRange,
        searchEntries
    };

    return (
        <TimeEntriesContext.Provider value={value}>
            {children}
        </TimeEntriesContext.Provider>
    );
}

export function useTimeEntries() {
    const context = useContext(TimeEntriesContext);
    if (!context) {
        throw new Error('useTimeEntries must be used within a TimeEntriesProvider');
    }
    return context;
}