import React from 'react';
import { useProjects } from '../../hooks/useProjects';

export function ProjectList() {
    const { projects, currentProject, selectProject } = useProjects();

    if (projects.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Chưa có dự án nào. Hãy tạo dự án đầu tiên của bạn.</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="font-medium text-gray-700 mb-3">Các Dự Án Của Bạn:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {projects.map(project => (
                    <div
                        key={project.id}
                        onClick={() => selectProject(project.id)}
                        className={`
              p-4 border rounded-lg cursor-pointer transition-all
              ${currentProject === project.id
                            ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                            : 'hover:bg-gray-50 border-gray-200'}
            `}
                    >
                        <h4 className={`font-medium ${currentProject === project.id ? 'text-indigo-700' : 'text-gray-800'}`}>
                            {project.name}
                        </h4>
                    </div>
                ))}
            </div>
        </div>
    );
}