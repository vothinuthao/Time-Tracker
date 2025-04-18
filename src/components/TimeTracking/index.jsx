// components/TimeTracking/TimeTracking.jsx
import React, { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { formatTime, formatDate } from '../../utils/dateFormatter';
import { formatDuration, getElapsedTime } from '../../utils/timeCalculator';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { ManualTimeEntryForm } from './ManualTimeEntryForm';
import { Timer } from './Timer';

export function TimeTracking() {
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [timer, setTimer] = useState('00:00:00');

    const { projects, currentProject, selectProject, getCurrentProject } = useProjects();
    const {
        isTracking,
        startTime,
        currentNote,
        startTracking,
        stopTracking,
        updateNote,
        getTodayTrackedTime
    } = useTimeEntries();

    // Handle timer updates
    React.useEffect(() => {
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

    // Get the current selected project
    const currentProjectData = getCurrentProject();
    const todayTrackedTime = formatDuration(getTodayTrackedTime());

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
                    <ManualTimeEntryForm onCancel={() => setShowManualEntry(false)} />
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
                                    <span className="text-lg font-bold text-gray-800">{todayTrackedTime}</span>
                                </div>

                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full"
                                        style={{width: `${Math.min((getTodayTrackedTime() / 480) * 100, 100)}%`}}
                                    ></div>
                                </div>

                                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                    <span>Mục tiêu: 8h</span>
                                    <span>{Math.round((getTodayTrackedTime() / 480) * 100)}% hoàn thành</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}