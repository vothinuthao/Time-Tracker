// src/services/localStorageService.js

// Keys for localStorage
const STORAGE_KEYS = {
    PROJECTS: 'timetracker_projects',
    TIME_ENTRIES: 'timetracker_entries',
    ACTIVE_SESSION: 'timetracker_active_session',
    CURRENT_PROJECT: 'timetracker_current_project'
};

// Project functions
export const projectService = {
    getAll: () => {
        const projects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        return projects ? JSON.parse(projects) : [];
    },

    save: (projects) => {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    },

    create: (projectData) => {
        const projects = projectService.getAll();
        const newProject = {
            id: Date.now().toString(),
            ...projectData,
            createdAt: new Date().toISOString()
        };

        projects.push(newProject);
        projectService.save(projects);
        return newProject;
    },

    update: (id, updatedData) => {
        const projects = projectService.getAll();
        const updatedProjects = projects.map(project =>
            project.id === id ? { ...project, ...updatedData } : project
        );

        projectService.save(updatedProjects);
        return updatedProjects.find(project => project.id === id);
    },

    delete: (id) => {
        const projects = projectService.getAll();
        const filteredProjects = projects.filter(project => project.id !== id);
        projectService.save(filteredProjects);

        // Also clear current project if it was deleted
        const currentProject = localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT);
        if (currentProject === id) {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_PROJECT);
        }
    },

    getCurrent: () => {
        const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT);
        if (!currentId) return null;

        const projects = projectService.getAll();
        return projects.find(project => project.id === currentId) || null;
    },

    setCurrent: (id) => {
        localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, id);
    }
};

// Time entry functions
export const timeEntryService = {
    getAll: () => {
        const entries = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
        return entries ? JSON.parse(entries) : [];
    },

    save: (entries) => {
        localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(entries));
    },

    create: (entryData) => {
        const entries = timeEntryService.getAll();
        const newEntry = {
            id: Date.now().toString(),
            ...entryData,
            createdAt: new Date().toISOString()
        };

        entries.push(newEntry);
        timeEntryService.save(entries);
        return newEntry;
    },

    update: (id, updatedData) => {
        const entries = timeEntryService.getAll();
        const updatedEntries = entries.map(entry =>
            entry.id === id ? { ...entry, ...updatedData } : entry
        );

        timeEntryService.save(updatedEntries);
        return updatedEntries.find(entry => entry.id === id);
    },

    delete: (id) => {
        const entries = timeEntryService.getAll();
        const filteredEntries = entries.filter(entry => entry.id !== id);
        timeEntryService.save(filteredEntries);
    },

    saveActiveSession: (sessionData) => {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(sessionData));
    },

    getActiveSession: () => {
        const session = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
        return session ? JSON.parse(session) : null;
    },

    clearActiveSession: () => {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
};

// Data export and import functions
export const dataService = {
    exportData: () => {
        const data = {
            projects: projectService.getAll(),
            timeEntries: timeEntryService.getAll(),
            exportedAt: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

        const exportFileName = `timetracker_export_${new Date().toISOString().slice(0, 10)}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileName);
        linkElement.click();

        return true;
    },

    importData: (jsonData) => {
        try {
            const data = JSON.parse(jsonData);

            if (data.projects) {
                projectService.save(data.projects);
            }

            if (data.timeEntries) {
                timeEntryService.save(data.timeEntries);
            }

            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};