import React from 'react';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { useSettings } from '../../hooks/useSettings';
import { Card } from '../UI/Card';
import { formatDuration } from '../../utils/timeCalculator';
import { formatDate, formatTime } from '../../utils/dateFormatter';

export function Dashboard() {
    const { timeEntries, getTodayTrackedTime, getCurrentMonthEntries } = useTimeEntries();
    const { settings, calculateIncome, formatCurrency } = useSettings();

    // Calculate summary data
    const todayTime = getTodayTrackedTime();
    const currentMonthEntries = getCurrentMonthEntries();
    const monthTime = currentMonthEntries.reduce((total, entry) => total + entry.duration, 0);

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
    const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    const startOfWeek = new Date(now);
    const daysSinceMonday = (currentDay === 0) ? 6 : currentDay - 1;
    startOfWeek.setDate(now.getDate() - daysSinceMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate week time
    const weekTime = timeEntries
        .filter(entry => new Date(entry.startTime) >= startOfWeek)
        .reduce((total, entry) => total + entry.duration, 0);

    // Get goals if settings exist
    const dailyGoal = settings?.goals?.daily || 480; // Default 8 hours
    const weeklyGoal = settings?.goals?.weekly || 2400; // Default 40 hours
    const monthlyGoal = settings?.goals?.monthly || 10080; // Default 168 hours

    // Calculate progress percentages
    const todayProgress = Math.min(Math.round((todayTime / dailyGoal) * 100), 100);
    const weekProgress = Math.min(Math.round((weekTime / weeklyGoal) * 100), 100);
    const monthProgress = Math.min(Math.round((monthTime / monthlyGoal) * 100), 100);

    // Get recent entries (last 5)
    const recentEntries = [...timeEntries]
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
        .slice(0, 5);

    // Calculate income if hourly rate is set
    const hasIncomeSettings = settings?.rates?.hourlyRate > 0;
    const monthlyIncome = hasIncomeSettings ? calculateIncome(monthTime) : null;

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Hôm nay</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{formatDuration(todayTime)}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{width: `${todayProgress}%`}}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>Mục tiêu: {formatDuration(dailyGoal)}</span>
                            <span>{todayProgress}%</span>
                        </div>
                    </div>
                </Card>

                <Card className="bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Tuần này</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{formatDuration(weekTime)}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-500 rounded-full"
                                style={{width: `${weekProgress}%`}}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>Mục tiêu: {formatDuration(weeklyGoal)}</span>
                            <span>{weekProgress}%</span>
                        </div>
                    </div>
                </Card>

                <Card className="bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Tháng này</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{formatDuration(monthTime)}</p>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{width: `${monthProgress}%`}}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>Mục tiêu: {formatDuration(monthlyGoal)}</span>
                            <span>{monthProgress}%</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Income Summary (if hourly rate is set) */}
            {hasIncomeSettings && monthlyIncome && (
                <Card title="Thu Nhập Tháng Này">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <p className="text-sm text-green-700 mb-1">Thực Nhận</p>
                            <p className="text-2xl font-bold text-green-800">{formatCurrency(monthlyIncome.net)}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <p className="text-sm text-red-700 mb-1">
                                Đóng Góp ({settings.rates.contributionPercentage}%)
                            </p>
                            <p className="text-2xl font-bold text-red-800">{formatCurrency(monthlyIncome.contribution)}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <p className="text-sm text-purple-700 mb-1">Tổng Thu</p>
                            <p className="text-2xl font-bold text-purple-800">{formatCurrency(monthlyIncome.total)}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Recent Time Entries */}
            <Card title="Chấm Công Gần Đây">
                {recentEntries.length === 0 ? (
                    <div className="text-center py-6">
                        <p className="text-gray-500">Chưa có dữ liệu chấm công nào.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-gray-50">
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dự án</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi chú</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentEntries.map(entry => (
                                <tr
                                    key={entry.id}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            <div
                                                className="w-2 h-2 rounded-full mr-2"
                                                style={{backgroundColor: entry.projectColor || '#4F46E5'}}
                                            ></div>
                                            <span className="font-medium text-gray-900">{entry.projectName}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(entry.startTime)}</td>
                                    <td className="py-3 px-4 text-sm text-gray-500">
                                        {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                                    </td>
                                    <td className="py-3 px-4 font-medium">{formatDuration(entry.duration)}</td>
                                    <td className="py-3 px-4 text-sm text-gray-500">
                                        <div className="max-w-xs truncate">{entry.note || '-'}</div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}