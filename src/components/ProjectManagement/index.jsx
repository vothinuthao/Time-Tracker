// src/components/ProjectManagement/index.jsx
import React, { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useSettings } from '../../hooks/useSettings';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { ProjectSettingsPopup } from './ProjectSettingsPopup';

export function ProjectManagement() {
    const { projects, addProject, deleteProject, updateProject, currentProject, selectProject } = useProjects();
    const { settings } = useSettings();
    const [projectName, setProjectName] = useState('');
    const [projectRate, setProjectRate] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [showSettingsPopup, setShowSettingsPopup] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (projectName.trim()) {
            // Create random color for the project
            const colors = ['#4F46E5', '#16A34A', '#EA580C', '#7C3AED', '#0369A1', '#BE123C'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            addProject({
                name: projectName,
                color,
                hourlyRate: parseFloat(projectRate) || 0,
                // Add default goals and rates from settings
                goals: {
                    daily: settings.goals.daily,
                    weekly: settings.goals.weekly,
                    monthly: settings.goals.monthly
                },
                rates: {
                    contributionPercentage: settings.rates.contributionPercentage,
                    currency: settings.rates.currency
                }
            });

            setProjectName('');
            setProjectRate('');
        }
    };

    const handleDeleteProject = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
            deleteProject(id);
        }
    };

    const handleProjectClick = (project) => {
        selectProject(project.id);
        setSelectedProject(project);
        setShowSettingsPopup(true);
    };

    const handleClosePopup = () => {
        setShowSettingsPopup(false);
        setSelectedProject(null);
    };

    const formatCurrency = (amount) => {
        if (!settings) return '0';
        return amount.toLocaleString('vi-VN') + ' ' + settings?.rates?.currency || 'VND';
    };

    return (
        <Card title="Quản Lý Dự Án">
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex-grow md:col-span-2">
                        <Input
                            label="Tên Dự Án Mới"
                            placeholder="Nhập tên dự án..."
                            value={projectName}
                            onChange={e => setProjectName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá theo giờ</label>
                        <input
                            type="number"
                            value={projectRate}
                            onChange={e => setProjectRate(e.target.value)}
                            className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Đơn giá/giờ"
                            min="0"
                        />
                    </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <Button type="submit" variant="primary" icon="add">
                        Thêm Dự Án
                    </Button>
                </div>
            </form>

            <div>
                <h3 className="font-medium text-gray-700 mb-3">Các Dự Án Của Bạn:</h3>
                {projects.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Chưa có dự án nào. Hãy tạo dự án đầu tiên của bạn.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {projects.map(project => (
                            <div
                                key={project.id}
                                className={`
                                    p-4 border rounded-lg transition-all relative
                                    ${currentProject === project.id
                                    ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                                    : 'hover:bg-gray-50 border-gray-200'}
                                `}
                            >
                                <div
                                    className="cursor-pointer flex items-center"
                                    onClick={() => handleProjectClick(project)}
                                >
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: project.color || '#4F46E5' }}
                                    ></div>
                                    <div className="flex-1">
                                        <h4 className={`font-medium ${currentProject === project.id ? 'text-indigo-700' : 'text-gray-800'}`}>
                                            {project.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Giá theo giờ: {formatCurrency(project.hourlyRate || 0)}
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute top-3 right-3 flex space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleProjectClick(project);
                                        }}
                                        className="text-gray-400 hover:text-indigo-500"
                                        title="Cài đặt dự án"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteProject(project.id);
                                        }}
                                        className="text-gray-400 hover:text-red-500"
                                        title="Xóa dự án"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Project Settings Popup */}
            {showSettingsPopup && selectedProject && (
                <ProjectSettingsPopup
                    project={selectedProject}
                    onClose={handleClosePopup}
                    onSave={(updatedProject) => {
                    }}
                />
            )}
        </Card>
    );
}