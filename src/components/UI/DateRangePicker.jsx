// components/UI/DateRangePicker.jsx
import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export function DateRangePicker({
                                    initialStartDate = null,
                                    initialEndDate = null,
                                    onApply,
                                    onCancel
                                }) {
    const [startDate, setStartDate] = useState(initialStartDate || new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(initialEndDate || new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    // Reset error when dates change
    useEffect(() => {
        setError('');
    }, [startDate, endDate]);

    // Handle date changes
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    // Apply date range
    const handleApply = () => {
        // Validate date range
        if (new Date(startDate) > new Date(endDate)) {
            setError('Ngày bắt đầu phải trước ngày kết thúc');
            return;
        }

        onApply({ startDate, endDate });
    };

    // Apply preset ranges
    const applyPresetRange = (days) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);

        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
    };

    return (
        <div className="w-80">
            <h3 className="font-medium text-gray-700 mb-3">Chọn Khoảng Thời Gian</h3>

            <div className="mb-4">
                <div className="flex space-x-2 mb-3">
                    <button
                        onClick={() => applyPresetRange(7)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        7 ngày
                    </button>
                    <button
                        onClick={() => applyPresetRange(14)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        14 ngày
                    </button>
                    <button
                        onClick={() => applyPresetRange(30)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        30 ngày
                    </button>
                    <button
                        onClick={() => applyPresetRange(90)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        90 ngày
                    </button>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
            </div>

            <div className="flex justify-between">
                <Button
                    variant="secondary"
                    onClick={onCancel}
                    size="small"
                >
                    Hủy
                </Button>
                <Button
                    variant="primary"
                    onClick={handleApply}
                    size="small"
                >
                    Áp Dụng
                </Button>
            </div>
        </div>
    );
}