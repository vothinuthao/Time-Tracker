﻿// src/components/TimeTracking/TimeTracking.jsx
import React, { useState, useEffect } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { useSettings } from '../../hooks/useSettings';
import { formatDuration } from '../../utils/timeCalculator';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Timer } from './Timer';

export function TimeTracking() {
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [timer, setTimer] = useState('00:00:00');
    const [manualFormData, setManualFormData] = useState({
        projectId: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00',
        note: '',
    });

    const { projects, currentProject, selectProject, getCurrentProject } = useProjects();
    const {
        isTracking,
        startTime,
        currentNote,
        startTracking,
        stopTracking,
        updateNote,
        getTodayTrackedTime,
        addManualTimeEntry
    } = useTimeEntries();

    const { settings } = useSettings();

    // Handle timer updates
    useEffect(() => {
        let intervalId;

        if (isTracking && startTime) {
            // Update timer every second
            intervalId = setInterval(() => {
                const elapsed = new Date() - new Date(startTime);
                const seconds = Math.floor((elapsed / 1000) % 60);
                const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
                const hours = Math.floor(elapsed / (1000 * 60 * 60));

                setTimer(
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                );
            }, 1000);
        } else {
            setTimer('00:00:00');
        }

        return () => clearInterval(intervalId);
    }, [isTracking, startTime]);

    // Toggle between manual entry and automatic tracking
    const toggleManualEntry = () => {
        setShowManualEntry(!showManualEntry);
    };

    // Handle manual form changes
    const handleManualFormChange = (e) => {
        const { name, value } = e.target;
        setManualFormData({
            ...manualFormData,
            [name]: value
        });
    };

    // Submit manual time entry
    const handleManualSubmit = (e) => {
        e.preventDefault();

        if (!manualFormData.projectId) {
            alert('Vui lòng chọn dự án');
            return;
        }

        const startDateTime = new Date(`${manualFormData.date}T${manualFormData.startTime}`);
        const endDateTime = new Date(`${manualFormData.date}T${manualFormData.endTime}`);

        if (endDateTime <= startDateTime) {
            alert('Thời gian kết thúc phải sau thời gian bắt đầu');
            return;
        }

        // Find project
        const project = projects.find(p => p.id === manualFormData.projectId);
        if (!project) return;

        // Calculate duration
        const durationMs = endDateTime - startDateTime;
        const durationMinutes = Math.round(durationMs / 1000 / 60);

        // Create entry
        const newEntry = {
            projectId: manualFormData.projectId,
            projectName: project.name,
            projectColor: project.color || '#4F46E5',
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            duration: durationMinutes,
            note: manualFormData.note,
            date: manualFormData.date
        };

        addManualTimeEntry(newEntry);

        // Reset form
        setManualFormData({
            projectId: '',
            date: new Date().toISOString().split('T')[0],
            startTime: '09:00',
            endTime: '17:00',
            note: '',
        });

        setShowManualEntry(false);
    };

    // Get the current selected project
    const currentProjectData = getCurrentProject();
    const todayTrackedTime = getTodayTrackedTime();

    // Get daily goal from current project if available, otherwise from settings
    const dailyGoal = currentProjectData?.goals?.daily || settings?.goals?.daily || 480; // Default 8 hours
    const dailyProgress = Math.min(Math.round((todayTrackedTime / dailyGoal) * 100), 100);

    return (
        <Card title="Chấm Công">
            <div className="px-1">
                <div className="flex justify-end mb-4">
                    <Button
                        variant="outline"
                        size="small"
                        onClick={toggleManualEntry}
                    >
                        {showManualEntry ? 'Bấm giờ tự động' : 'Thêm thủ công'}
                    </Button>
                </div>

                {showManualEntry ? (
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                        <h3 className="font-medium text-indigo-700 mb-2">Thêm Thời Gian Thủ Công</h3>
                        <p className="text-sm text-indigo-600 mb-4">Thêm thời gian làm việc của bạn bằng cách nhập thông tin dưới đây</p>

                        <form onSubmit={handleManualSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dự án</label>
                                    <select
                                        name="projectId"
                                        value={manualFormData.projectId}
                                        onChange={handleManualFormChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    >
                                        <option value="">Chọn dự án</option>
                                        {projects.map(project => (
                                            <option key={project.id} value={project.id}>{project.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={manualFormData.date}
                                        onChange={handleManualFormChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu</label>
                                        <input
                                            type="time"
                                            name="startTime"
                                            value={manualFormData.startTime}
                                            onChange={handleManualFormChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kết thúc</label>
                                        <input
                                            type="time"
                                            name="endTime"
                                            value={manualFormData.endTime}
                                            onChange={handleManualFormChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả công việc</label>
                                <textarea
                                    name="note"
                                    value={manualFormData.note}
                                    onChange={handleManualFormChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Mô tả công việc bạn đã làm..."
                                    rows="2"
                                ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowManualEntry(false)}
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
                ) : (
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-2/3">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dự án</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                                            <div className="flex items-center">
                                                <div
                                                    className="w-3 h-3 rounded-full mr-2"
                                                    style={{backgroundColor: project.color || '#4F46E5'}}
                                                ></div>
                                                <h4 className={`font-medium ${currentProject === project.id ? 'text-indigo-700' : 'text-gray-800'}`}>
                                                    {project.name}
                                                </h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {isTracking && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ghi chú công việc
                                    </label>
                                    <textarea
                                        value={currentNote}
                                        onChange={(e) => updateNote(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        rows="3"
                                        placeholder="Mô tả công việc bạn đang làm..."
                                    ></textarea>
                                </div>
                            )}

                            <div className="flex items-center mt-4">
                                {currentProject ? (
                                    isTracking ? (
                                        <Button
                                            onClick={stopTracking}
                                            variant="danger"
                                            icon="stop"
                                            size="large"
                                        >
                                            Kết Thúc Làm Việc
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={startTracking}
                                            variant="success"
                                            icon="play"
                                            size="large"
                                        >
                                            Bắt Đầu Làm Việc
                                        </Button>
                                    )
                                ) : (
                                    <div className="text-gray-500">
                                        Vui lòng chọn một dự án để bắt đầu chấm công
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="md:w-1/3 flex flex-col">
                            <Timer
                                isTracking={isTracking}
                                startTime={startTime}
                                timer={timer}
                                projectName={currentProjectData?.name}
                            />

                            <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-medium text-gray-600">Hôm nay</span>
                                    <span className="text-lg font-bold text-gray-800">{formatDuration(todayTrackedTime)}</span>
                                </div>

                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full"
                                        style={{width: `${dailyProgress}%`}}
                                    ></div>
                                </div>

                                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                    <span>Mục tiêu: {formatDuration(dailyGoal)}</span>
                                    <span>{dailyProgress}% hoàn thành</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}