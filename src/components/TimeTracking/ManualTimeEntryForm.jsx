// components/TimeTracking/ManualTimeEntryForm.jsx
import React, { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { calculateDuration } from '../../utils/timeCalculator';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';

export function ManualTimeEntryForm({ onCancel }) {
    const { projects, currentProject } = useProjects();
    const { addManualTimeEntry } = useTimeEntries();

    const [formData, setFormData] = useState({
        projectId: currentProject || '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00',
        note: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when field is updated
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.projectId) {
            newErrors.projectId = 'Vui lòng chọn dự án';
        }

        if (!formData.date) {
            newErrors.date = 'Vui lòng chọn ngày';
        }

        if (!formData.startTime) {
            newErrors.startTime = 'Vui lòng chọn thời gian bắt đầu';
        }

        if (!formData.endTime) {
            newErrors.endTime = 'Vui lòng chọn thời gian kết thúc';
        }

        // Check if end time is after start time
        if (formData.startTime && formData.endTime) {
            const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
            const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

            if (endDateTime <= startDateTime) {
                newErrors.endTime = 'Thời gian kết thúc phải sau thời gian bắt đầu';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

        // Calculate duration in minutes
        const duration = calculateDuration(startDateTime, endDateTime);

        // Find project name
        const project = projects.find(p => p.id === formData.projectId);
        const projectName = project ? project.name : 'Unknown Project';

        // Create time entry
        const timeEntry = {
            projectId: formData.projectId,
            projectName,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            duration,
            note: formData.note,
            date: formData.date,
        };

        // Add the time entry
        addManualTimeEntry(timeEntry);

        // Reset form or close
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <h3 className="font-medium text-indigo-700 mb-2">Thêm Thời Gian Thủ Công</h3>
            <p className="text-sm text-indigo-600 mb-4">Thêm thời gian làm việc của bạn bằng cách nhập thông tin dưới đây</p>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dự án</label>
                        <select
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors.projectId ? 'border-red-300' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Chọn dự án</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                        {errors.projectId && (
                            <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                        <Input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            error={errors.date}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu</label>
                            <Input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                error={errors.startTime}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kết thúc</label>
                            <Input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                error={errors.endTime}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả công việc</label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Mô tả công việc bạn đã làm..."
                        rows="2"
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        className="mr-2"
                    >
                        Hủy
                    </Button>
                    <Button type="submit" variant="primary">
                        Lưu
                    </Button>
                </div>
            </form>
        </div>
    );
}