// components/TimeTracking/TimeEntryDetailPanel.jsx
import React, { useState, useEffect } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { formatDate, formatTime } from '../../utils/dateFormatter';
import { formatDuration } from '../../utils/timeCalculator';
import { Button } from '../UI/Button';

export function TimeEntryDetailPanel({ entry, onClose }) {
    const { projects } = useProjects();
    const { editEntry, deleteEntry } = useTimeEntries();

    const [formData, setFormData] = useState({
        projectId: '',
        date: '',
        startTime: '',
        endTime: '',
        note: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    // Initialize form data when entry changes
    useEffect(() => {
        if (entry) {
            const startDate = new Date(entry.startTime);
            const endDate = new Date(entry.endTime);

            setFormData({
                projectId: entry.projectId,
                date: startDate.toISOString().split('T')[0],
                startTime: startDate.toTimeString().substring(0, 5),
                endTime: endDate.toTimeString().substring(0, 5),
                note: entry.note || '',
            });
        }
    }, [entry]);

    // Handle form data changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle save changes
    const handleSave = () => {
        if (!entry) return;

        const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

        const updatedEntry = {
            ...entry,
            projectId: formData.projectId,
            projectName: projects.find(p => p.id === formData.projectId)?.name || entry.projectName,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            note: formData.note,
            date: formData.date,
        };

        editEntry(entry.id, updatedEntry);
        setIsEditing(false);
    };

    // Handle delete entry
    const handleDelete = () => {
        if (!entry) return;

        if (isConfirmingDelete) {
            deleteEntry(entry.id);
            onClose();
        } else {
            setIsConfirmingDelete(true);
            // Auto reset confirmation after 3 seconds
            setTimeout(() => setIsConfirmingDelete(false), 3000);
        }
    };

    if (!entry) return null;

    return (
        <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Chi Tiết Chấm Công</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
                <div className="mb-6">
                    <div className="flex items-center mb-4">
                        <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{backgroundColor: entry.projectColor || '#4F46E5'}}
                        ></div>
                        <h4 className="text-xl font-semibold text-gray-800">{entry.projectName}</h4>
                    </div>

                    {!isEditing ? (
                        <>
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Ngày</p>
                                        <p className="font-medium">{formatDate(entry.startTime)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Tổng thời gian</p>
                                        <p className="font-medium text-indigo-600">{formatDuration(entry.duration)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Bắt đầu</p>
                                        <p className="font-medium">{formatTime(entry.startTime)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Kết thúc</p>
                                        <p className="font-medium">{formatTime(entry.endTime)}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h5 className="font-medium text-gray-700 mb-2">Ghi chú</h5>
                                <p className="text-gray-600 whitespace-pre-line">
                                    {entry.note || 'Không có ghi chú'}
                                </p>
                            </div>

                            <div className="mt-8 flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                    icon="edit"
                                >
                                    Chỉnh sửa
                                </Button>
                                <Button
                                    variant="danger"
                                    outlined={true}
                                    onClick={handleDelete}
                                    icon="delete"
                                >
                                    {isConfirmingDelete ? 'Xác nhận xóa?' : 'Xóa'}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="border-t border-gray-200 pt-4">
                            <h5 className="font-medium text-gray-700 mb-4">Chỉnh sửa mục này</h5>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                                    <input
                                        type="date"
                                        name="date"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dự án</label>
                                    <select
                                        name="projectId"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.projectId}
                                        onChange={handleChange}
                                    >
                                        {projects.map(project => (
                                            <option
                                                key={project.id}
                                                value={project.id}
                                            >
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kết thúc</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                                <textarea
                                    name="note"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    rows="4"
                                    value={formData.note}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div className="flex justify-between">
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleSave}
                                >
                                    Lưu thay đổi
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}