import React from 'react';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { useProjects } from '../../hooks/useProjects';
import { formatDuration } from '../../utils/timeCalculator';
import { getCurrentMonthYear } from '../../utils/dateFormatter';

export function MonthSummary() {
    const { monthSummary, getCurrentMonthEntries } = useTimeEntries();
    const { projects } = useProjects();

    const currentMonthEntries = getCurrentMonthEntries();
    const currentMonthKey = getCurrentMonthYear();
    const currentMonthData = monthSummary[currentMonthKey];

    if (!currentMonthEntries || currentMonthEntries.length === 0) {
        return (
            <div className="text-center py-6">
                <p className="text-gray-500">Chưa có dữ liệu chấm công nào trong tháng này.</p>
            </div>
        );
    }

    // Calculate total duration for current month
    const totalDuration = currentMonthEntries.reduce(
        (total, entry) => total + entry.duration,
        0
    );

    return (
        <div>
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-center text-gray-700 mb-1">Tổng thời gian làm việc:</p>
                <p className="text-center text-3xl font-bold text-indigo-700">
                    {formatDuration(totalDuration)}
                </p>
            </div>

            {currentMonthData && Object.keys(currentMonthData.projects).length > 0 && (
                <div>
                    <h3 className="font-medium text-gray-700 mb-3">Thời gian theo dự án:</h3>

                    <div className="space-y-3">
                        {Object.entries(currentMonthData.projects).map(([projectId, data]) => (
                            <div
                                key={projectId}
                                className="flex justify-between py-2 px-3 border-b border-gray-200"
                            >
                                <span className="font-medium">{data.name}</span>
                                <span className="text-gray-700">{formatDuration(data.totalMinutes)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}