// src/components/ProjectManagement/ProjectSettingsPopup.jsx
import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useProjects } from '../../hooks/useProjects';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { formatDuration } from '../../utils/timeCalculator';

export function ProjectSettingsPopup({ project, onClose, onSave }) {
    const { settings } = useSettings();
    const { updateProject } = useProjects();

    const [formData, setFormData] = useState({
        name: project.name,
        color: project.color || '#4F46E5',
        hourlyRate: project.hourlyRate || 0,
        goals: {
            daily: (project.goals?.daily || settings.goals.daily) / 60, // Convert minutes to hours for display
            weekly: (project.goals?.weekly || settings.goals.weekly) / 60,
            monthly: (project.goals?.monthly || settings.goals.monthly) / 60
        },
        rates: {
            contributionPercentage: project.rates?.contributionPercentage || settings.rates.contributionPercentage,
            currency: project.rates?.currency || settings.rates.currency
        }
    });

    // Update form when project changes
    useEffect(() => {
        setFormData({
            name: project.name,
            color: project.color || '#4F46E5',
            hourlyRate: project.hourlyRate || 0,
            goals: {
                daily: (project.goals?.daily || settings.goals.daily) / 60,
                weekly: (project.goals?.weekly || settings.goals.weekly) / 60,
                monthly: (project.goals?.monthly || settings.goals.monthly) / 60
            },
            rates: {
                contributionPercentage: project.rates?.contributionPercentage || settings.rates.contributionPercentage,
                currency: project.rates?.currency || settings.rates.currency
            }
        });
    }, [project, settings]);

    // Form change handler
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('goals.')) {
            const goalField = name.split('.')[1];
            setFormData({
                ...formData,
                goals: {
                    ...formData.goals,
                    [goalField]: value
                }
            });
        } else if (name.startsWith('rates.')) {
            const rateField = name.split('.')[1];
            setFormData({
                ...formData,
                rates: {
                    ...formData.rates,
                    [rateField]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Save handler
    const handleSave = () => {
        // Convert hours back to minutes for storage
        const updatedProject = {
            ...project,
            name: formData.name,
            color: formData.color,
            hourlyRate: parseFloat(formData.hourlyRate) || 0,
            goals: {
                daily: formData.goals.daily * 60,
                weekly: formData.goals.weekly * 60,
                monthly: formData.goals.monthly * 60
            },
            rates: {
                contributionPercentage: parseFloat(formData.rates.contributionPercentage) || 10,
                currency: formData.rates.currency
            }
        };

        updateProject(project.id, updatedProject);

        if (onSave) {
            onSave(updatedProject);
        }

        onClose();
    };

    // Format currency helper
    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN') + ' ' + formData.rates.currency;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            Cài Đặt Dự Án
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <div className="border-b border-gray-200 pb-4 mb-4">
                        <h3 className="font-medium text-gray-700 mb-3">Thông Tin Cơ Bản</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên dự án</label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="color"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        className="h-10 w-10 rounded border"
                                    />
                                    <span className="text-sm text-gray-500">{formData.color}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 pb-4 mb-4">
                        <h3 className="font-medium text-gray-700 mb-3">Mục Tiêu Thời Gian</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu hàng ngày (giờ)</label>
                                <Input
                                    type="number"
                                    name="goals.daily"
                                    value={formData.goals.daily}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.5"
                                />
                                {settings.goals.daily > 0 && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Mặc định: {formatDuration(settings.goals.daily)}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu hàng tuần (giờ)</label>
                                <Input
                                    type="number"
                                    name="goals.weekly"
                                    value={formData.goals.weekly}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.5"
                                />
                                {settings.goals.weekly > 0 && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Mặc định: {formatDuration(settings.goals.weekly)}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu hàng tháng (giờ)</label>
                                <Input
                                    type="number"
                                    name="goals.monthly"
                                    value={formData.goals.monthly}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.5"
                                />
                                {settings.goals.monthly > 0 && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Mặc định: {formatDuration(settings.goals.monthly)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 pb-4 mb-4">
                        <h3 className="font-medium text-gray-700 mb-3">Tính Tiền Dự Kiến</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị mỗi giờ</label>
                                <Input
                                    type="number"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                    min="0"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Nhập mức lương/giờ của dự án này
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phần trăm đóng góp (%)</label>
                                <Input
                                    type="number"
                                    name="rates.contributionPercentage"
                                    value={formData.rates.contributionPercentage}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Ví dụ: thuế, bảo hiểm, quỹ,...
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tiền tệ</label>
                                <select
                                    name="rates.currency"
                                    value={formData.rates.currency}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="VND">VND (₫)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            </div>
                        </div>

                        {/* Example calculation */}
                        {formData.hourlyRate > 0 && (
                            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-3">Ví dụ tính tiền cho 8 giờ làm việc:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-1">Tổng thu:</p>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {formatCurrency(formData.hourlyRate * 8)}
                                        </p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-1">Đóng góp ({formData.rates.contributionPercentage}%):</p>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {formatCurrency((formData.hourlyRate * 8 * formData.rates.contributionPercentage) / 100)}
                                        </p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-1">Thực nhận:</p>
                                        <p className="text-lg font-semibold text-green-600">
                                            {formatCurrency(formData.hourlyRate * 8 * (1 - formData.rates.contributionPercentage / 100))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                        >
                            Lưu Thay Đổi
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}