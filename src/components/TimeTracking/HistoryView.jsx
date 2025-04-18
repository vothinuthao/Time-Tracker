import React, { useState } from 'react';
import { useTimeEntries } from '../../hooks/useTimeEntries';
import { useProjects } from '../../hooks/useProjects';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { formatDate, formatTime } from '../../utils/dateFormatter';
import { formatDuration } from '../../utils/timeCalculator';

export function HistoryView() {
    const { timeEntries, deleteEntry, editEntry } = useTimeEntries();
    const { projects } = useProjects();
    const [searchText, setSearchText] = useState('');
    const [projectFilter, setProjectFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        projectId: '',
        date: '',
        startTime: '',
        endTime: '',
        note: ''
    });

    const itemsPerPage = 10;

    // Apply filters to get filtered entries
    const getFilteredEntries = () => {
        let filtered = [...timeEntries];

        // Apply search filter
        if (searchText) {
            const lowerCaseQuery = searchText.toLowerCase();
            filtered = filtered.filter(entry =>
                entry.projectName.toLowerCase().includes(lowerCaseQuery) ||
                (entry.note && entry.note.toLowerCase().includes(lowerCaseQuery))
            );
        }

        // Apply project filter
        if (projectFilter) {
            filtered = filtered.filter(entry => entry.projectId === projectFilter);
        }

        // Apply date filter
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString().split('T')[0];
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        if (dateFilter === 'today') {
            filtered = filtered.filter(entry => entry.date === today);
        } else if (dateFilter === 'yesterday') {
            filtered = filtered.filter(entry => entry.date === yesterday);
        } else if (dateFilter === 'week') {
            filtered = filtered.filter(entry => new Date(entry.date) >= startOfWeek);
        } else if (dateFilter === 'month') {
            filtered = filtered.filter(entry => new Date(entry.date) >= startOfMonth);
        }

        // Sort entries by date (newest first)
        filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        return filtered;
    };

    const filteredEntries = getFilteredEntries();

    // Pagination
    const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
    const paginatedEntries = filteredEntries.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle page change
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // View entry details
    const handleViewEntry = (entry) => {
        setSelectedEntry(entry);

        // Format date and times for the form
        const startDate = new Date(entry.startTime);
        const endDate = new Date(entry.endTime);

        setEditForm({
            projectId: entry.projectId,
            date: startDate.toISOString().split('T')[0],
            startTime: startDate.toTimeString().substring(0, 5),
            endTime: endDate.toTimeString().substring(0, 5),
            note: entry.note || ''
        });

        setIsEditing(false);
    };

    // Delete entry
    const handleDeleteEntry = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
            deleteEntry(id);
            setSelectedEntry(null);
        }
    };

    // Edit entry
    const handleEditSubmit = (e) => {
        e.preventDefault();

        if (!selectedEntry) return;

        const startDateTime = new Date(`${editForm.date}T${editForm.startTime}`);
        const endDateTime = new Date(`${editForm.date}T${editForm.endTime}`);

        if (endDateTime <= startDateTime) {
            alert('Thời gian kết thúc phải sau thời gian bắt đầu');
            return;
        }

        const project = projects.find(p => p.id === editForm.projectId);

        const updatedEntry = {
            ...selectedEntry,
            projectId: editForm.projectId,
            projectName: project ? project.name : selectedEntry.projectName,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            date: editForm.date,
            note: editForm.note
        };

        editEntry(selectedEntry.id, updatedEntry);
        setSelectedEntry(updatedEntry);
        setIsEditing(false);
    };

    // Handle edit form changes
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: value
        });
    };

    return (
        <div className="space-y-6">
            <Card title="Lịch Sử Chấm Công">
                {/* Filters */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-grow">
                        <div className="relative">
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
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={projectFilter}
                            onChange={(e) => setProjectFilter(e.target.value)}
                            className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Tất cả dự án</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>

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
                    </div>
                </div>

                {/* Time entries table */}
                <div className="overflow-x-auto">
                    {filteredEntries.length > 0 ? (
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
                            {paginatedEntries.map(entry => (
                                <tr key={entry.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => handleViewEntry(entry)}>
                                    <td className="p-2">{formatDate(entry.startTime)}</td>
                                    <td className="p-2 font-medium text-indigo-700">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: entry.projectColor || '#4F46E5'}}></div>
                                            {entry.projectName}
                                        </div>
                                    </td>
                                    <td className="p-2">{formatTime(entry.startTime)}</td>
                                    <td className="p-2">{formatTime(entry.endTime)}</td>
                                    <td className="p-2 font-medium">{formatDuration(entry.duration)}</td>
                                    <td className="p-2">
                                        <div className="max-w-xs truncate">{entry.note || '-'}</div>
                                    </td>
                                    <td className="p-2 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteEntry(entry.id);
                                            }}
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4">
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
            </Card>

            {/* Entry details modal */}
            {selectedEntry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {isEditing ? 'Chỉnh Sửa Mục Chấm Công' : 'Chi Tiết Chấm Công'}
                                </h2>
                                <button
                                    onClick={() => setSelectedEntry(null)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleEditSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Dự án</label>
                                            <select
                                                name="projectId"
                                                value={editForm.projectId}
                                                onChange={handleEditFormChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            >
                                                {projects.map(project => (
                                                    <option key={project.id} value={project.id}>{project.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={editForm.date}
                                                onChange={handleEditFormChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu</label>
                                            <input
                                                type="time"
                                                name="startTime"
                                                value={editForm.startTime}
                                                onChange={handleEditFormChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian kết thúc</label>
                                            <input
                                                type="time"
                                                name="endTime"
                                                value={editForm.endTime}
                                                onChange={handleEditFormChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                                        <textarea
                                            name="note"
                                            value={editForm.note}
                                            onChange={handleEditFormChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button variant="secondary" onClick={() => setIsEditing(false)}>
                                            Hủy
                                        </Button>
                                        <Button type="submit" variant="primary">
                                            Lưu Thay Đổi
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <div className="flex items-center mb-3">
                                            <div
                                                className="w-3 h-3 rounded-full mr-2"
                                                style={{ backgroundColor: selectedEntry.projectColor || '#4F46E5' }}
                                            ></div>
                                            <h3 className="text-lg font-semibold text-gray-800">{selectedEntry.projectName}</h3>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày</p>
                                                <p className="font-medium">{formatDate(selectedEntry.startTime)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Thời gian</p>
                                                <p className="font-medium">{formatDuration(selectedEntry.duration)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Bắt đầu</p>
                                                <p className="font-medium">{formatTime(selectedEntry.startTime)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Kết thúc</p>
                                                <p className="font-medium">{formatTime(selectedEntry.endTime)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-700 mb-2">Ghi chú</h4>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            {selectedEntry.note ? (
                                                <p className="text-gray-700">{selectedEntry.note}</p>
                                            ) : (
                                                <p className="text-gray-400">Không có ghi chú</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Chỉnh sửa
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeleteEntry(selectedEntry.id)}
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}