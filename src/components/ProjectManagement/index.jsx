import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';

export function ProjectManagement() {
    const { projects, addProject, deleteProject, currentProject, selectProject } = useProjects();
    const [projectName, setProjectName] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (projectName.trim()) {
            addProject(projectName);
            setProjectName('');
        }
    };

    const handleDeleteProject = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
            deleteProject(id);
        }
    };

    return (
        <Card title="Quản Lý Dự Án">
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex flex-col md:flex-row md:items-end gap-3">
                    <div className="flex-grow">
                        <Input
                            label="Tên Dự Án Mới"
                            placeholder="Nhập tên dự án..."
                            value={projectName}
                            onChange={e => setProjectName(e.target.value)}
                            required
                        />
                    </div>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                                    onClick={() => selectProject(project.id)}
                                >
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: project.color || '#4F46E5' }}
                                    ></div>
                                    <h4 className={`font-medium ${currentProject === project.id ? 'text-indigo-700' : 'text-gray-800'}`}>
                                        {project.name}
                                    </h4>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteProject(project.id);
                                    }}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                    title="Xóa dự án"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}