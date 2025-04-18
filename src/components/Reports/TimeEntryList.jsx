import React, { useState } from 'react';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { formatDate, formatTime } from '../../utils/dateFormatter';
import { formatDuration } from '../../utils/timeCalculator';
import { Button } from '../UI/Button';

export function TimeEntryList() {
    const { timeEntries, deleteEntry } = useTimeEntries();
    const [filter, setFilter] = useState('all'); // 'all', 'today', 'week', 'month'

    if (!timeEntries || timeEntries.length === 0) {
        return (
            <div className="text-center py-6">
                <p className="text-gray-500">Chưa có dữ liệu chấm công nào.</p>
            </div>
        );
    }

    // Filter entries based on selected filter
    const filteredEntries = (() => {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        if (filter === 'today') {
            return timeEntries.filter(entry => entry.date === today);
        } else if (filter === 'week') {
            return timeEntries.filter(entry => entry.startTime >= oneWeekAgo);
        } else if (filter === 'month') {
            return timeEntries.filter(entry => entry.startTime >= firstDayOfMonth);
        }

        return timeEntries;
    })();

    // Sort entries by date (newest first)
    const sortedEntries = [...filteredEntries].sort(
        (a, b) => new Date(b.startTime) - new Date(a.startTime)
    );

    return (
        <div>
            {/* Filter buttons */}
            <div className="mb-4 flex flex-wrap gap-2">
                <Button
                    variant={filter === 'all' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('all')}
                    size="small"
                >
                    Tất cả
                </Button>
                <Button
                    variant={filter === 'today' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('today')}
                    size="small"
                >
                    Hôm nay
                </Button>
                <Button
                    variant={filter === 'week' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('week')}
                    size="small"
                >
                    Tuần này
                </Button>
                <Button
                    variant={filter === 'month' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('month')}
                    size="small"
                >
                    Tháng này
                </Button>
            </div>

            {/* Time entries table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 text-left">Ngày</th>
                        <th className="p-2 text-left">Dự án</th>
                        <th className="p-2 text-left">Bắt đầu</th>
                        <th className="p-2 text-left">Kết thúc</th>
                        <th className="p-2 text-left">Thời gian</th>
                        <th className="p-2 text-left">Ghi chú</th>
                        <th className="p-2"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedEntries.map(entry => (
                        <tr key={entry.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{formatDate(entry.startTime)}</td>
                            <td className="p-2 font-medium text-indigo-700">{entry.projectName}</td>
                            <td className="p-2">{formatTime(entry.startTime)}</td>
                            <td className="p-2">{formatTime(entry.endTime)}</td>
                            <td className="p-2 font-medium">{formatDuration(entry.duration)}</td>
                            <td className="p-2">
                                <div className="max-w-xs truncate">{entry.note || '-'}</div>
                            </td>
                            <td className="p-2 text-right">
                                <button
                                    onClick={() => deleteEntry(entry.id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Xóa"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}