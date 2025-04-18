import React, { useState, useEffect } from 'react';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { formatDuration } from '../../utils/timeCalculator';
import { getCurrentMonthName } from '../../utils/dateFormatter';
import { IncomeReport } from './IncomeReport';

export function Reports() {
    const [activeTab, setActiveTab] = useState('time');
    const { timeEntries } = useTimeEntries();
    const [monthlyData, setMonthlyData] = useState({});
    const [projectData, setProjectData] = useState({});
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthYearKey());

    // Calculate reports data
    useEffect(() => {
        const monthlyTotals = {};
        const projectTotals = {};

        timeEntries.forEach(entry => {
            // Get month-year string (e.g., "4/2023")
            const date = new Date(entry.startTime);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

            // Initialize month data if not exists
            if (!monthlyTotals[monthYear]) {
                monthlyTotals[monthYear] = {
                    totalMinutes: 0,
                    totalEntries: 0,
                    projects: {}
                };
            }

            // Add entry duration to month total
            monthlyTotals[monthYear].totalMinutes += entry.duration;
            monthlyTotals[monthYear].totalEntries += 1;

            // Initialize project data for this month if not exists
            if (!monthlyTotals[monthYear].projects[entry.projectId]) {
                monthlyTotals[monthYear].projects[entry.projectId] = {
                    id: entry.projectId,
                    name: entry.projectName,
                    color: entry.projectColor || '#4F46E5',
                    totalMinutes: 0,
                    entries: 0
                };
            }

            // Add entry duration to project total for this month
            monthlyTotals[monthYear].projects[entry.projectId].totalMinutes += entry.duration;
            monthlyTotals[monthYear].projects[entry.projectId].entries += 1;

            // Initialize overall project data if not exists
            if (!projectTotals[entry.projectId]) {
                projectTotals[entry.projectId] = {
                    id: entry.projectId,
                    name: entry.projectName,
                    color: entry.projectColor || '#4F46E5',
                    totalMinutes: 0,
                    entries: 0
                };
            }

            // Add entry duration to overall project total
            projectTotals[entry.projectId].totalMinutes += entry.duration;
            projectTotals[entry.projectId].entries += 1;
        });

        setMonthlyData(monthlyTotals);
        setProjectData(projectTotals);
    }, [timeEntries]);

    // Get available months
    const availableMonths = Object.keys(monthlyData).sort((a, b) => {
        const [aMonth, aYear] = a.split('/').map(Number);
        const [bMonth, bYear] = b.split('/').map(Number);
        if (aYear !== bYear) return bYear - aYear;
        return bMonth - aMonth;
    });

    // Get formatted month name
    function getMonthName(monthYearKey) {
        const [month, year] = monthYearKey.split('/').map(Number);
        const date = new Date(year, month - 1, 1);
        return date.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
    }

    // Get current month/year in the right format
    function getCurrentMonthYearKey() {
        const now = new Date();
        return `${now.getMonth() + 1}/${now.getFullYear()}`;
    }

    // Get data for the selected month
    const selectedMonthData = monthlyData[selectedMonth] || { totalMinutes: 0, totalEntries: 0, projects: {} };

    // Sort projects by total minutes (descending)
    const sortedProjects = Object.values(selectedMonthData.projects).sort((a, b) => b.totalMinutes - a.totalMinutes);

    // Calculate percentage for each project
    const totalMinutes = selectedMonthData.totalMinutes || 0;
    sortedProjects.forEach(project => {
        project.percentage = totalMinutes > 0 ? (project.totalMinutes / totalMinutes) * 100 : 0;
    });

    // Render the appropriate report based on active tab
    const renderReport = () => {
        switch (activeTab) {
            case 'time':
                return (
                    <Card title="Báo Cáo Thời Gian">
                        {/* Month selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chọn tháng</label>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {availableMonths.length > 0 ? (
                                    availableMonths.map(monthYear => (
                                        <option key={monthYear} value={monthYear}>
                                            {getMonthName(monthYear)}
                                        </option>
                                    ))
                                ) : (
                                    <option value={getCurrentMonthYearKey()}>
                                        {getMonthName(getCurrentMonthYearKey())}
                                    </option>
                                )}
                            </select>
                        </div>

                        {/* Monthly summary */}
                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Tổng Kết Tháng {getMonthName(selectedMonth)}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                    <p className="text-sm text-indigo-700 mb-1">Tổng Thời Gian</p>
                                    <p className="text-2xl font-bold text-indigo-800">{formatDuration(totalMinutes)}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <p className="text-sm text-green-700 mb-1">Số Mục Chấm Công</p>
                                    <p className="text-2xl font-bold text-green-800">{selectedMonthData.totalEntries}</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                    <p className="text-sm text-purple-700 mb-1">Dự Án Hoạt Động</p>
                                    <p className="text-2xl font-bold text-purple-800">{Object.keys(selectedMonthData.projects).length}</p>
                                </div>
                            </div>

                            {/* Project breakdown */}
                            <h4 className="font-medium text-gray-700 mb-3">Phân Bổ Theo Dự Án</h4>
                            {sortedProjects.length > 0 ? (
                                <div className="space-y-4">
                                    {sortedProjects.map(project => (
                                        <div key={project.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-3 h-3 rounded-full mr-2"
                                                        style={{ backgroundColor: project.color }}
                                                    ></div>
                                                    <h5 className="font-medium text-gray-800">{project.name}</h5>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-gray-800 font-semibold">{formatDuration(project.totalMinutes)}</span>
                                                    <span className="text-gray-500 text-sm ml-2">({project.percentage.toFixed(1)}%)</span>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${project.percentage}%`,
                                                        backgroundColor: project.color
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">Không có dữ liệu cho tháng này</p>
                                </div>
                            )}
                        </div>
                    </Card>
                );
            case 'income':
                return <IncomeReport />;
            default:
                return <div>Báo cáo không tồn tại</div>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Report tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex space-x-2">
                    <Button
                        variant={activeTab === 'time' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('time')}
                    >
                        Báo Cáo Thời Gian
                    </Button>
                    <Button
                        variant={activeTab === 'income' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('income')}
                    >
                        Báo Cáo Thu Nhập
                    </Button>
                </div>
            </div>

            {/* Render the active report */}
            {renderReport()}
        </div>
    );
}