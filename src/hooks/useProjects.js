// src/hooks/useProjects.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { projectApi } from '../utils/api';
import { useAuth } from './useAuth'; // Bạn cần tạo hook này

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { isAuthenticated } = useAuth();

    // Load projects from API
    useEffect(() => {
        if (isAuthenticated) {
            fetchProjects();
        }
    }, [isAuthenticated]);

    // Fetch projects from API
    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await projectApi.getAll();
            setProjects(response.data);

            // Restore current project from localStorage if available
            const savedProject = localStorage.getItem('current_project');
            if (savedProject) {
                setCurrentProject(savedProject);
            }

            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.msg || 'Có lỗi xảy ra khi tải dự án');
            setLoading(false);
        }
    };

    // Add a new project
    const addProject = async (projectData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await projectApi.create(projectData);
            setProjects([...projects, response.data]);

            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.msg || 'Có lỗi xảy ra khi tạo dự án');
            setLoading(false);
            return null;
        }
    };

    // Update a project
    const updateProject = async (id, updatedData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await projectApi.update(id, updatedData);
            setProjects(projects.map(project =>
                project._id === id ? response.data : project
            ));

            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.msg || 'Có lỗi xảy ra khi cập nhật dự án');
            setLoading(false);
            return null;
        }
    };

    // Delete a project
    const deleteProject = async (id) => {
        try {
            setLoading(true);
            setError(null);

            await projectApi.delete(id);
            setProjects(projects.filter(project => project._id !== id));

            if (currentProject === id) {
                setCurrentProject(null);
                localStorage.removeItem('current_project');
            }

            setLoading(false);
            return true;
        } catch (err) {
            setError(err.response?.data?.msg || 'Có lỗi xảy ra khi xóa dự án');
            setLoading(false);
            return false;
        }
    };

    // Select a project as current
    const selectProject = (id) => {
        setCurrentProject(id);
        localStorage.setItem('current_project', id);
    };

    // Get current project data
    const getCurrentProject = () => {
        return projects.find(project => project._id === currentProject) || null;
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
        getCurrentProject
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