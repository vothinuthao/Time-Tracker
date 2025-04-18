// components/TimeTracking/HistoryView.jsx
import React, { useState } from 'react';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { TimeEntryList } from './TimeEntryList';
import { Card } from '../UI/Card';
import { DateRangePicker } from '../UI/DateRangePicker';

export function HistoryView() {
    const { timeEntries, getEntriesInRange } = useTimeEntries();
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Handle date range selection
    const handleDateRangeChange = (range) => {
        setDateRange(range);
        setShowDatePicker(false);
    };

    // Toggle date picker visibility
    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
    };

    // Calculate summary data
    const calculateSummary = () => {
        let entries = timeEntries;

        // Apply date range filter if set
        if (dateRange.startDate && dateRange.endDate) {
            entries = getEntriesInRange(dateRange.startDate, dateRange.endDate);
        }

        // Calculate total time
        const totalTime = entries.reduce((total, entry) => total + entry.duration, 0);

        // Group by project
        const projectTotals = {};
        entries.forEach(entry => {
            if (!projectTotals[entry.projectId]) {
                projectTotals[entry.projectId] = {
                    name: entry.projectName,
                    color: entry.projectColor || '#4F46E5',
                    totalTime: 0
                };
            }
            projectTotals[entry.projectId].totalTime += entry.duration;
        });

        return {
            totalEntries: entries.length,
            totalTime,
            projectTotals
        };
    };

    const summary = calculateSummary();

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-indigo-100 text-sm font-medium">Tổng số mục</h3>
                            <p className="text-3xl font-bold mt-1">{summary.totalEntries}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-green-100 text-sm font-medium">Tổng thời gian</h3>
                            <p className="text-3xl font-bold mt-1">
                                {Math.floor(summary.totalTime / 60)}h {Math.round(summary.totalTime % 60)}m
                            </p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-purple-100 text-sm font-medium">Dự án hoạt động</h3>
                            <p className="text-3xl font-bold mt-1">{Object.keys(summary.projectTotals).length}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters & Date Range */}
            <Card>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                        <h3 className="font-medium text-gray-700 mb-2">Lọc Theo Khoảng Thời Gian</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={toggleDatePicker}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                {dateRange.startDate && dateRange.endDate
                                    ? `${dateRange.startDate.slice(0, 10)} - ${dateRange.endDate.slice(0, 10)}`
                                    : 'Chọn khoảng thời gian'}
                            </button>

                            {dateRange.startDate && dateRange.endDate && (
                                <button
                                    onClick={() => setDateRange({ startDate: null, endDate: null })}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        {showDatePicker && (
                            <div className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                                <DateRangePicker
                                    initialStartDate={dateRange.startDate}
                                    initialEndDate={dateRange.endDate}
                                    onApply={handleDateRangeChange}
                                    onCancel={() => setShowDatePicker(false)}
                                />
                            </div>
                        )}
                    </div>

                    {Object.keys(summary.projectTotals).length > 0 && (
                        <div>
                            <h3 className="font-medium text-gray-700 mb-2">Phân Bổ Theo Dự Án</h3>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(summary.projectTotals).map(project => (
                                    <div
                                        key={project.name}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                                        style={{ backgroundColor: `${project.color}20`, color: project.color }}
                                    >
                                        <div
                                            className="w-2 h-2 rounded-full mr-1.5"
                                            style={{ backgroundColor: project.color }}
                                        ></div>
                                        <span className="font-medium">{project.name}</span>
                                        <span className="ml-1.5">
                      {Math.floor(project.totalTime / 60)}h {Math.round(project.totalTime % 60)}m
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Time Entries */}
            <TimeEntryList
                showHeader={true}
                showToolbar={true}
                showPagination={true}
                title="Lịch Sử Chấm Công Chi Tiết"
            />
        </div>
    );
}