import React, { useState, useEffect } from 'react';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { useSettings } from '../../hooks/useSettings';
import { useProjects } from '../../hooks/useProjects';
import { formatDuration } from '../../utils/timeCalculator';
import { Card } from '../UI/Card';

export function IncomeReport() {
    const { timeEntries, getCurrentMonthEntries } = useTimeEntries();
    const { settings, formatCurrency } = useSettings();
    const { projects } = useProjects();

    const [monthlyIncome, setMonthlyIncome] = useState({
        month: '',
        days: 0,
        totalMinutes: 0,
        income: { net: 0, contribution: 0, total: 0 }
    });

    const [yearlyIncome, setYearlyIncome] = useState({
        totalMinutes: 0,
        income: { net: 0, contribution: 0, total: 0 }
    });

    const [incomeByProject, setIncomeByProject] = useState([]);

    // const calculateIncomeForEntry = (entry, defaultRate = 0) => {
    //     if (!settings) return { net: 0, contribution: 0, total: 0 };
    //
    //     const project = projects.find(p => p.id === entry.projectId);
    //     const hourlyRate = (project && project.hourlyRate) || defaultRate;
    //
    //     const hours = entry.duration / 60;
    //     const total = hours * hourlyRate;
    //     const contribution = (total * settings.rates.contributionPercentage) / 100;
    //     const net = total - contribution;
    //
    //     return {
    //         net,
    //         contribution,
    //         total,
    //         currency: settings.rates.currency
    //     };
    // };
    const calculateIncomeForEntry = (entry) => {
        if (!settings) return { net: 0, contribution: 0, total: 0 };

        // Find project
        const project = projects.find(p => p.id === entry.projectId);
        // Use project rate or 0 if not available
        const hourlyRate = (project && project.hourlyRate) || 0;

        // Calculate income
        const hours = entry.duration / 60;
        const total = hours * hourlyRate;
        const contribution = (total * settings.rates.contributionPercentage) / 100;
        const net = total - contribution;

        return {
            net,
            contribution,
            total,
            currency: settings.rates.currency
        };
    };

    // Calculate total income for multiple entries
    // const calculateTotalIncome = (entries, defaultRate = 0) => {
    //     const result = entries.reduce((acc, entry) => {
    //         const income = calculateIncomeForEntry(entry, defaultRate);
    //         return {
    //             net: acc.net + income.net,
    //             contribution: acc.contribution + income.contribution,
    //             total: acc.total + income.total
    //         };
    //     }, { net: 0, contribution: 0, total: 0 });
    //
    //     return {
    //         ...result,
    //         currency: settings?.rates?.currency || 'VND'
    //     };
    // };
    const calculateTotalIncome = (entries) => {
        const result = entries.reduce((acc, entry) => {
            const income = calculateIncomeForEntry(entry);
            return {
                net: acc.net + income.net,
                contribution: acc.contribution + income.contribution,
                total: acc.total + income.total
            };
        }, { net: 0, contribution: 0, total: 0 });

        return {
            ...result,
            currency: settings?.rates?.currency || 'VND'
        };
    };

    // Calculate income data when entries or settings change
    useEffect(() => {
        if (!settings || !timeEntries.length) return;

        // Get current month data
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const currentMonthName = new Date(currentYear, currentMonth).toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
        const monthEntries = getCurrentMonthEntries();

        // Get unique days in the month with entries
        const uniqueDays = new Set(monthEntries.map(entry => entry.date)).size;

        // Calculate monthly duration
        const monthlyMinutes = monthEntries.reduce((total, entry) => total + entry.duration, 0);

        // Calculate monthly income
        const monthlyIncomeData = calculateTotalIncome(monthEntries);

        setMonthlyIncome({
            month: currentMonthName,
            days: uniqueDays,
            totalMinutes: monthlyMinutes,
            income: monthlyIncomeData
        });

        // Calculate yearly income
        const yearlyIncomeData = calculateTotalIncome(timeEntries);

        setYearlyIncome({
            totalMinutes: timeEntries.reduce((total, entry) => total + entry.duration, 0),
            income: yearlyIncomeData
        });

        // Calculate income by project
        const projectsMap = new Map();

        // Group entries by project and calculate total time per project
        timeEntries.forEach(entry => {
            if (!projectsMap.has(entry.projectId)) {
                const project = projects.find(p => p.id === entry.projectId);
                projectsMap.set(entry.projectId, {
                    id: entry.projectId,
                    name: entry.projectName,
                    color: entry.projectColor || '#4F46E5',
                    minutes: 0,
                    entries: [],
                    hourlyRate: project?.hourlyRate || 0
                });
            }

            const projectData = projectsMap.get(entry.projectId);
            projectData.minutes += entry.duration;
            projectData.entries.push(entry);
        });

        // Calculate income for each project
        const projectsIncomeData = Array.from(projectsMap.values()).map(project => {
            const income = calculateTotalIncome(project.entries, project.hourlyRate);

            // Calculate hourly average if there are any entries
            const hourlyAverage = project.minutes > 0 ?
                (income.total / (project.minutes / 60)) : project.hourlyRate;

            return {
                ...project,
                income,
                hourlyAverage
            };
        });

        // Sort by highest income
        projectsIncomeData.sort((a, b) => b.income.total - a.income.total);

        setIncomeByProject(projectsIncomeData);

    }, [timeEntries, settings, projects, getCurrentMonthEntries]);

    // Check if we have any projects with hourly rates set
    // const hasProjectsWithRates = projects.some(project => project.hourlyRate > 0);
    const hasProjectsWithRates = projects.some(project => project.hourlyRate > 0);

    if (!settings || !hasProjectsWithRates) {
        return (
            <Card>
                <div className="text-center py-8">
                    <p className="text-gray-500">Vui lòng thiết lập giá trị giờ làm việc cho các dự án trong mục "Dự Án" để xem báo cáo thu nhập.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Báo Cáo Thu Nhập">
            <div className="space-y-8">
                {/* Monthly income */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Thu Nhập Tháng {monthlyIncome.month}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                            <p className="text-sm text-indigo-700 mb-1">Thời Gian Làm Việc</p>
                            <p className="text-xl font-bold text-indigo-800">{formatDuration(monthlyIncome.totalMinutes)}</p>
                            <p className="text-xs text-indigo-600 mt-1">{monthlyIncome.days} ngày làm việc</p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <p className="text-sm text-purple-700 mb-1">Tổng Thu</p>
                            <p className="text-xl font-bold text-purple-800">{formatCurrency(monthlyIncome.income.total)}</p>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <p className="text-sm text-red-700 mb-1">Đóng Góp</p>
                            <p className="text-xl font-bold text-red-800">{formatCurrency(monthlyIncome.income.contribution)}</p>
                            <p className="text-xs text-red-600 mt-1">{settings.rates.contributionPercentage}% tổng thu</p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <p className="text-sm text-green-700 mb-1">Thực Nhận</p>
                            <p className="text-xl font-bold text-green-800">{formatCurrency(monthlyIncome.income.net)}</p>
                        </div>
                    </div>

                    {/* Progress toward goal */}
                    {settings.goals.monthly > 0 && (
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Tiến độ mục tiêu tháng</span>
                                <span className="text-gray-600">
                                    {formatDuration(monthlyIncome.totalMinutes)} / {formatDuration(settings.goals.monthly)}
                                    ({Math.round((monthlyIncome.totalMinutes / settings.goals.monthly) * 100)}%)
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 rounded-full"
                                    style={{ width: `${Math.min((monthlyIncome.totalMinutes / settings.goals.monthly) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Yearly income */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Tổng Thu Nhập</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                            <p className="text-sm text-indigo-700 mb-1">Tổng Thời Gian</p>
                            <p className="text-xl font-bold text-indigo-800">{formatDuration(yearlyIncome.totalMinutes)}</p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <p className="text-sm text-purple-700 mb-1">Tổng Thu</p>
                            <p className="text-xl font-bold text-purple-800">{formatCurrency(yearlyIncome.income.total)}</p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <p className="text-sm text-green-700 mb-1">Thực Nhận</p>
                            <p className="text-xl font-bold text-green-800">{formatCurrency(yearlyIncome.income.net)}</p>
                        </div>
                    </div>
                </div>

                {/* Income by project */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Thu Nhập Theo Dự Án</h3>

                    {incomeByProject.length > 0 ? (
                        <div className="space-y-3">
                            {incomeByProject.map(project => (
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
                                            <span className="text-gray-500 text-sm mr-2">{formatDuration(project.minutes)}</span>
                                            <span className="text-gray-800 font-semibold">{formatCurrency(project.income.total)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-3 text-sm">
                                        <div>
                                            <span className="text-gray-500">Giá theo giờ:</span>
                                            <span className="font-medium text-gray-800 ml-2">{formatCurrency(project.hourlyRate)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Tổng thu:</span>
                                            <span className="font-medium text-gray-800 ml-2">{formatCurrency(project.income.total)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Đóng góp:</span>
                                            <span className="font-medium text-gray-800 ml-2">{formatCurrency(project.income.contribution)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Thực nhận:</span>
                                            <span className="font-medium text-green-600 ml-2">{formatCurrency(project.income.net)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Chưa có dữ liệu thu nhập theo dự án</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}