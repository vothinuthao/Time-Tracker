// src/components/TimeTracking/TimeControls.jsx
import React from 'react';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { useProjects } from '../../hooks/useProjects';
import { Button } from '../UI/Button';
import { formatDuration } from '../../utils/timeCalculator';

export function TimeControls() {
    const { isTracking, startTracking, stopTracking, getTodayTrackedTime } = useTimeEntries();
    const { getCurrentProject } = useProjects();

    const todayTotal = getTodayTrackedTime();
    const currentProject = getCurrentProject();

    // Get daily goal from the current project if it exists, otherwise use default
    const dailyGoal = currentProject?.goals?.daily || 480; // Default 8 hours
    const dailyProgress = Math.min(Math.round((todayTotal / dailyGoal) * 100), 100);

    return (
        <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
                <p className="text-sm text-gray-600 mb-1">Thời gian làm việc hôm nay:</p>
                <p className="text-xl font-semibold text-gray-800">{formatDuration(todayTotal)}</p>
            </div>

            <div>
                {isTracking ? (
                    <Button
                        onClick={stopTracking}
                        variant="danger"
                        icon="stop"
                    >
                        Kết Thúc Làm Việc
                    </Button>
                ) : (
                    <Button
                        onClick={startTracking}
                        variant="success"
                        icon="play"
                    >
                        Bắt Đầu Làm Việc
                    </Button>
                )}
            </div>

            {/* Daily progress bar using project-specific goal */}
            <div className="mt-2 w-full">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Mục tiêu: {formatDuration(dailyGoal)}</span>
                    <span>{dailyProgress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{width: `${dailyProgress}%`}}
                    ></div>
                </div>
            </div>
        </div>
    );
}