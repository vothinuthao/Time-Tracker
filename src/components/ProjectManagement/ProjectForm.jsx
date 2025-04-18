// src/components/ProjectManagement/ProjectForm.jsx
import React, { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';

export function ProjectForm() {
    const [projectName, setProjectName] = useState('');
    const { addProject } = useProjects();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (projectName.trim()) {
            addProject(projectName);
            setProjectName('');
        }
    };

    return (
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
                <Button type="submit" variant="primary">
                    Thêm Dự Án
                </Button>
            </div>
        </form>
    );
}