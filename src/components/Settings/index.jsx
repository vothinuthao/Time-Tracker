import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { formatDuration } from '../../utils/timeCalculator';

export function Settings() {
    const { settings, updateGoals, updateRates, resetSettings } = useSettings();

    const [goalsForm, setGoalsForm] = useState({
        daily: 0,
        weekly: 0,
        monthly: 0
    });

    const [ratesForm, setRatesForm] = useState({
        hourlyRate: 0,
        contributionPercentage: 10,
        currency: 'VND'
    });

    const [successMessage, setSuccessMessage] = useState('');

    // Load current settings into form when settings loaded
    React.useEffect(() => {
        if (settings) {
            setGoalsForm({
                daily: settings.goals.daily / 60, // Convert minutes to hours for display
                weekly: settings.goals.weekly / 60,
                monthly: settings.goals.monthly / 60
            });

            setRatesForm({
                hourlyRate: settings.rates.hourlyRate,
                contributionPercentage: settings.rates.contributionPercentage,
                currency: settings.rates.currency
            });
        }
    }, [settings]);

    // Handle goals form changes
    const handleGoalsChange = (e) => {
        const { name, value } = e.target;
        setGoalsForm({
            ...goalsForm,
            [name]: parseFloat(value) || 0
        });
    };

    // Handle rates form changes
    const handleRatesChange = (e) => {
        const { name, value } = e.target;
        setRatesForm({
            ...ratesForm,
            [name]: name === 'currency' ? value : (parseFloat(value) || 0)
        });
    };

    // Save goals settings
    const saveGoals = (e) => {
        e.preventDefault();

        // Convert hours to minutes for storage
        const goalsInMinutes = {
            daily: goalsForm.daily * 60,
            weekly: goalsForm.weekly * 60,
            monthly: goalsForm.monthly * 60
        };

        const success = updateGoals(goalsInMinutes);

        if (success) {
            setSuccessMessage('Đã lưu mục tiêu thành công!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    // Save rates settings
    const saveRates = (e) => {
        e.preventDefault();

        const success = updateRates(ratesForm);

        if (success) {
            setSuccessMessage('Đã lưu thông tin tính tiền thành công!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    // Reset all settings
    const handleResetSettings = () => {
        if (window.confirm('Bạn có chắc chắn muốn khôi phục cài đặt mặc định?')) {
            resetSettings();
            setSuccessMessage('Đã khôi phục cài đặt mặc định!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    // If settings not loaded yet
    if (!settings) {
        return (
            <Card title="Cài Đặt">
                <div className="text-center py-8">
                    <p className="text-gray-500">Đang tải cài đặt...</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Success message */}
            {successMessage && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-100">
                    <p>{successMessage}</p>
                </div>
            )}

            {/* Goals settings */}
            <Card title="Mục Tiêu Thời Gian">
                <form onSubmit={saveGoals}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu hàng ngày (giờ)</label>
                            <Input
                                type="number"
                                name="daily"
                                value={goalsForm.daily}
                                onChange={handleGoalsChange}
                                min="0"
                                step="0.5"
                            />
                            {settings.goals.daily > 0 && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Hiện tại: {formatDuration(settings.goals.daily)}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu hàng tuần (giờ)</label>
                            <Input
                                type="number"
                                name="weekly"
                                value={goalsForm.weekly}
                                onChange={handleGoalsChange}
                                min="0"
                                step="0.5"
                            />
                            {settings.goals.weekly > 0 && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Hiện tại: {formatDuration(settings.goals.weekly)}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu hàng tháng (giờ)</label>
                            <Input
                                type="number"
                                name="monthly"
                                value={goalsForm.monthly}
                                onChange={handleGoalsChange}
                                min="0"
                                step="0.5"
                            />
                            {settings.goals.monthly > 0 && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Hiện tại: {formatDuration(settings.goals.monthly)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" variant="primary">
                            Lưu Mục Tiêu
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Income settings */}
            <Card title="Tính Tiền Dự Kiến">
                <form onSubmit={saveRates}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị mỗi giờ</label>
                            <Input
                                type="number"
                                name="hourlyRate"
                                value={ratesForm.hourlyRate}
                                onChange={handleRatesChange}
                                min="0"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Nhập mức lương/giờ của bạn
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phần trăm đóng góp (%)</label>
                            <Input
                                type="number"
                                name="contributionPercentage"
                                value={ratesForm.contributionPercentage}
                                onChange={handleRatesChange}
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
                                name="currency"
                                value={ratesForm.currency}
                                onChange={handleRatesChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="VND">VND (₫)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" variant="primary">
                            Lưu Cài Đặt Tính Tiền
                        </Button>
                    </div>
                </form>

                {/* Example calculation */}
                {ratesForm.hourlyRate > 0 && (
                    <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-700 mb-3">Ví dụ tính tiền cho 8 giờ làm việc:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Tổng thu:</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {(ratesForm.hourlyRate * 8).toLocaleString('vi-VN')} {ratesForm.currency}
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Đóng góp ({ratesForm.contributionPercentage}%):</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {((ratesForm.hourlyRate * 8 * ratesForm.contributionPercentage) / 100).toLocaleString('vi-VN')} {ratesForm.currency}
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Thực nhận:</p>
                                <p className="text-lg font-semibold text-green-600">
                                    {(ratesForm.hourlyRate * 8 * (1 - ratesForm.contributionPercentage / 100)).toLocaleString('vi-VN')} {ratesForm.currency}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Reset settings */}
            <Card>
                <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-medium text-red-600 mb-2">Khôi phục cài đặt mặc định</h3>
                    <p className="text-gray-600 mb-4">
                        Đặt lại tất cả cài đặt về giá trị mặc định. Hành động này không ảnh hưởng đến dữ liệu chấm công của bạn.
                    </p>

                    <Button
                        variant="danger"
                        onClick={handleResetSettings}
                    >
                        Khôi phục cài đặt mặc định
                    </Button>
                </div>
            </Card>
        </div>
    );
}