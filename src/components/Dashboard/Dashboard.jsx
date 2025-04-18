import React from 'react';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { Card } from '../UI/Card';
import { TimeEntryList } from '../TimeTracking/TimeEntryList';
import { formatDuration } from '../../utils/timeCalculator';

export function Dashboard() {
    const { timeEntries, getTodayTrackedTime, getCurrentMonthEntries } = useTimeEntries();

    // Calculate summary data
    const todayTime = getTodayTrackedTime();
    const currentMonthEntries = getCurrentMonthEntries();
    const monthTime = currentMonthEntries.reduce((total, entry) => total + entry.duration, 0);

    // Calculate progress percentage (based on 8 hours daily goal)
    const todayProgress = Math.min(Math.round((todayTime / 480) * 100), 100);

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
                            <span>Mục tiêu: 8h</span>
                            <span>{todayProgress}%</span>
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
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Mục tiêu</span>
                            <span>160h / tháng</span>
                        </div>
                    </div>
                </Card>

                <Card className="bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Tổng mục</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{timeEntries.length}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Tỷ lệ hoàn thành</span>
                            <span>95%</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Time Entries */}
            <TimeEntryList
                limit={5}
                showToolbar={false}
                showPagination={false}
                title="Chấm Công Gần Đây"
                onViewAll={() => alert('Chuyển đến tab Lịch Sử')}
            />
        </div>
    );
}

export default Dashboard;