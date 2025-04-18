import React, { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useSettings } from '../../hooks/useSettings';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';

export function ProjectManagement() {
    const { projects, addProject, deleteProject, updateProject, currentProject, selectProject } = useProjects();
    const { settings } = useSettings();
    const [projectName, setProjectName] = useState('');
    const [projectRate, setProjectRate] = useState('');
    const [editMode, setEditMode] = useState(null);
    const [editData, setEditData] = useState({
        name: '',
        hourlyRate: 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (projectName.trim()) {
            // Create random color for the project
            const colors = ['#4F46E5', '#16A34A', '#EA580C', '#7C3AED', '#0369A1', '#BE123C'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            addProject({
                name: projectName,
                color,
                hourlyRate: parseFloat(projectRate) || 0
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

    const startEditProject = (project) => {
        setEditMode(project.id);
        setEditData({
            name: project.name,
            hourlyRate: project.hourlyRate || 0
        });
    };

    const handleUpdateProject = () => {
        if (editMode && editData.name.trim()) {
            updateProject(editMode, {
                name: editData.name,
                hourlyRate: parseFloat(editData.hourlyRate) || 0
            });
            setEditMode(null);
        }
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
                                {editMode === project.id ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="md:col-span-2">
                                            <Input
                                                placeholder="Tên dự án"
                                                value={editData.name}
                                                onChange={(e) => setEditData({...editData, name: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                type="number"
                                                placeholder="Giá theo giờ"
                                                value={editData.hourlyRate}
                                                onChange={(e) => setEditData({...editData, hourlyRate: e.target.value})}
                                                min="0"
                                            />
                                        </div>
                                        <div className="col-span-full flex justify-end space-x-2 mt-2">
                                            <Button
                                                variant="secondary"
                                                size="small"
                                                onClick={() => setEditMode(null)}
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="small"
                                                onClick={handleUpdateProject}
                                            >
                                                Lưu
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div
                                            className="cursor-pointer flex items-center"
                                            onClick={() => selectProject(project.id)}
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
                                                    startEditProject(project);
                                                }}
                                                className="text-gray-400 hover:text-indigo-500"
                                                title="Chỉnh sửa dự án"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
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
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}