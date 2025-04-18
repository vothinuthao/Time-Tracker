// components/TimeTracking/TimeEntryList.jsx
import React, { useState } from 'react';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { formatDate, formatTime } from '../../utils/dateFormatter';
import { formatDuration } from '../../utils/timeCalculator';
import { TimeEntryDetailPanel } from './TimeEntryDetailPanel';

export function TimeEntryList({
                                  limit = null,
                                  showHeader = true,
                                  showToolbar = true,
                                  showPagination = true,
                                  filter = 'all',
                                  onViewAll = null,
                                  title = "Lịch Sử Chấm Công"
                              }) {
    const { timeEntries, searchEntries } = useTimeEntries();
    const [searchText, setSearchText] = useState('');
    const [projectFilter, setProjectFilter] = useState('');
    const [dateFilter, setDateFilter] = useState(filter);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [showDetailPanel, setShowDetailPanel] = useState(false);

    const itemsPerPage = 10;

    // Handle entry click
    const handleEntryClick = (entry) => {
        setSelectedEntry(entry);
        setShowDetailPanel(true);
    };

    // Close detail panel
    const closeDetailPanel = () => {
        setShowDetailPanel(false);
        setTimeout(() => setSelectedEntry(null), 300); // Clear after animation
    };

    // Apply filters to get filtered entries
    const getFilteredEntries = () => {
        let filtered = searchText ? searchEntries(searchText) : [...timeEntries];

        // Apply project filter
        if (projectFilter) {
            filtered = filtered.filter(entry => entry.projectId === projectFilter);
        }

        // Apply date filter
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        if (dateFilter === 'today') {
            filtered = filtered.filter(entry => entry.date === today.split('T')[0]);
        } else if (dateFilter === 'yesterday') {
            filtered = filtered.filter(entry => entry.date === yesterday.split('T')[0]);
        } else if (dateFilter === 'week') {
            filtered = filtered.filter(entry => new Date(entry.startTime) >= new Date(startOfWeek));
        } else if (dateFilter === 'month') {
            filtered = filtered.filter(entry => new Date(entry.startTime) >= new Date(startOfMonth));
        }

        // Sort entries by date (newest first)
        filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        return filtered;
    };

    const filteredEntries = getFilteredEntries();

    // Pagination
    const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
    const paginatedEntries = showPagination
        ? filteredEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : limit
            ? filteredEntries.slice(0, limit)
            : filteredEntries;

    // Handle page change
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {showHeader && (
                <div className="border-b border-gray-100">
                    <div className="px-6 py-4 flex justify-between items-center flex-wrap gap-2">
                        <h2 className="text-lg font-bold text-gray-800">{title}</h2>

                        {onViewAll && (
                            <button
                                onClick={onViewAll}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                            >
                                Xem tất cả
                            </button>
                        )}

                        {showToolbar && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setDateFilter('all')}
                                    className={`py-1.5 px-3 text-sm font-medium rounded-lg ${
                                        dateFilter === 'all'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Tất cả
                                </button>
                                <button
                                    onClick={() => setDateFilter('today')}
                                    className={`py-1.5 px-3 text-sm font-medium rounded-lg ${
                                        dateFilter === 'today'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Hôm nay
                                </button>
                                <button
                                    onClick={() => setDateFilter('week')}
                                    className={`py-1.5 px-3 text-sm font-medium rounded-lg ${
                                        dateFilter === 'week'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Tuần này
                                </button>
                                <button
                                    onClick={() => setDateFilter('month')}
                                    className={`py-1.5 px-3 text-sm font-medium rounded-lg ${
                                        dateFilter === 'month'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Tháng này
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showToolbar && (
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        <div className="relative flex-grow max-w-md">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="pl-10 py-2 pr-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Tìm kiếm..."
                            />
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={projectFilter}
                                onChange={(e) => setProjectFilter(e.target.value)}
                                className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Tất cả dự án</option>
                                {/* Project options would be populated here */}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                {filteredEntries.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-50">
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dự án</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi chú</th>
                            <th className="py-3 px-4"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedEntries.map(entry => (
                            <tr
                                key={entry.id}
                                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleEntryClick(entry)}
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
                                <td className="py-3 px-4 text-right">
                                    <button
                                        className="text-gray-400 hover:text-gray-500"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEntryClick(entry);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-300 mb-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <p className="text-gray-500">Không tìm thấy mục chấm công nào</p>
                        <p className="text-sm text-gray-400 mt-1">Hãy thử thay đổi bộ lọc hoặc thêm mục chấm công mới</p>
                    </div>
                )}
            </div>

            {showPagination && totalPages > 1 && (
                <div className="flex justify-between items-center p-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                        Hiển thị {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredEntries.length)} trong tổng số {filteredEntries.length} mục
                    </div>

                    <div className="flex space-x-1">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 border border-gray-300 rounded-md ${
                                currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            Trước
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                            // Display 5 pages at most, centered around current page
                            let pageToShow;
                            if (totalPages <= 5) {
                                pageToShow = i + 1;
                            } else if (currentPage <= 3) {
                                pageToShow = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageToShow = totalPages - 4 + i;
                            } else {
                                pageToShow = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageToShow}
                                    onClick={() => goToPage(pageToShow)}
                                    className={`px-3 py-1 border rounded-md ${
                                        currentPage === pageToShow
                                            ? 'bg-indigo-50 text-indigo-600 font-medium border-indigo-300'
                                            : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {pageToShow}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 border border-gray-300 rounded-md ${
                                currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}

            {/* Detail panel sliding from right */}
            <div className={`fixed top-0 right-0 h-full w-full md:w-1/3 max-w-md bg-white shadow-xl z-20 transform transition-transform duration-300 ease-in-out ${showDetailPanel ? 'translate-x-0' : 'translate-x-full'}`}>
                {selectedEntry && (
                    <TimeEntryDetailPanel
                        entry={selectedEntry}
                        onClose={closeDetailPanel}
                    />
                )}
            </div>

            {/* Overlay when detail panel is open */}
            {showDetailPanel && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-10"
                    onClick={closeDetailPanel}
                ></div>
            )}
        </div>
    );
}