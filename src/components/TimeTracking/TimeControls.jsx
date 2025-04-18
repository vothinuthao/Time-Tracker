import React from 'react';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { Button } from '../UI/Button';
import { formatDuration } from '../../utils/timeCalculator';

export function TimeControls() {
    const { isTracking, startTracking, stopTracking, getTodayTrackedTime } = useTimeEntries();

    const todayTotal = formatDuration(getTodayTrackedTime());

    return (
        <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
                <p className="text-sm text-gray-600 mb-1">Thời gian làm việc hôm nay:</p>
                <p className="text-xl font-semibold text-gray-800">{todayTotal}</p>
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
        </div>
    );
}