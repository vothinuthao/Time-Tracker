﻿import React, { createContext, useState, useContext, useEffect } from 'react';
import { projectService } from '../services/localStorageService';

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load projects from localStorage on initial render
    useEffect(() => {
        loadProjects();
    }, []);

    // Load projects from localStorage
    const loadProjects = () => {
        try {
            setLoading(true);

            // Get projects from localStorage
            const savedProjects = projectService.getAll();
            setProjects(savedProjects || []);

            // Get current project from localStorage
            const currentProjectId = localStorage.getItem('timetracker_current_project');
            if (currentProjectId) {
                setCurrentProject(currentProjectId);
            }

            setLoading(false);
        } catch (err) {
            setError('Error loading projects from localStorage');
            setLoading(false);
        }
    };

    // Add a new project
    const addProject = (projectName) => {
        try {
            setLoading(true);

            // Create project color (random or predefined)
            const colors = ['#4F46E5', '#16A34A', '#EA580C', '#7C3AED', '#0369A1', '#BE123C'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            const newProject = projectService.create({
                name: projectName,
                color,
                createdAt: new Date().toISOString()
            });

            setProjects([...projects, newProject]);
            setLoading(false);

            return newProject;
        } catch (err) {
            setError('Error adding project');
            setLoading(false);
            return null;
        }
    };

    // Update a project
    const updateProject = (id, updatedData) => {
        try {
            setLoading(true);

            const updatedProject = projectService.update(id, updatedData);

            setProjects(projects.map(project =>
                project.id === id ? updatedProject : project
            ));

            setLoading(false);
            return updatedProject;
        } catch (err) {
            setError('Error updating project');
            setLoading(false);
            return null;
        }
    };

    // Delete a project
    const deleteProject = (id) => {
        try {
            setLoading(true);

            projectService.delete(id);
            setProjects(projects.filter(project => project.id !== id));

            if (currentProject === id) {
                setCurrentProject(null);
            }

            setLoading(false);
            return true;
        } catch (err) {
            setError('Error deleting project');
            setLoading(false);
            return false;
        }
    };

    // Select a project as current
    const selectProject = (id) => {
        setCurrentProject(id);
        projectService.setCurrent(id);
    };

    // Get current project data
    const getCurrentProject = () => {
        return projects.find(project => project.id === currentProject) || null;
    };

    const value = {
        projects,
        currentProject,
        loading,
        error,
        addProject,
        updateProject,
        deleteProject,
        selectProject,
        getCurrentProject,
        refreshProjects: loadProjects
    };

    return (
        <ProjectsContext.Provider value={value}>
            {children}
        </ProjectsContext.Provider>
    );
}

export function useProjects() {
    const context = useContext(ProjectsContext);
    if (!context) {
        throw new Error('useProjects must be used within a ProjectsProvider');
    }
    return context;
}