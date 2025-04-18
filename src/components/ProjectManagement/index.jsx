import React from 'react';
import { ProjectForm } from './ProjectForm';
import { ProjectList } from './ProjectList';
import { Card } from '../UI/Card';

export function ProjectManagement() {
    return (
        <Card title="Quản Lý Dự Án">
            <ProjectForm />
            <ProjectList />
        </Card>
    );
}