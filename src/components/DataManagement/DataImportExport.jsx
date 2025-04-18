import React, { useState, useRef } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { dataService } from '../../services/localStorageService';

export function DataImportExport() {
    const [importStatus, setImportStatus] = useState(null);
    const [exportStatus, setExportStatus] = useState(null);
    const fileInputRef = useRef(null);

    const { refreshProjects } = useProjects();

    // Handle export
    const handleExport = () => {
        try {
            dataService.exportData();
            setExportStatus({ success: true, message: 'Dữ liệu đã được xuất thành công!' });
        } catch (error) {
            setExportStatus({ success: false, message: 'Có lỗi khi xuất dữ liệu: ' + error.message });
        }
    };

    // Handle import
    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = dataService.importData(e.target.result);

                if (result) {
                    setImportStatus({ success: true, message: 'Dữ liệu đã được nhập thành công!' });
                    // Refresh projects and time entries
                    refreshProjects();
                    // Navigate to dashboard after successful import
                    window.location.reload();
                } else {
                    setImportStatus({ success: false, message: 'Có lỗi khi nhập dữ liệu.' });
                }
            } catch (error) {
                setImportStatus({ success: false, message: 'Có lỗi khi nhập dữ liệu: ' + error.message });
            }
        };
        reader.readAsText(file);
    };

    // Trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Clear all data
    const handleClearData = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể khôi phục!')) {
            // Clear all data from localStorage
            localStorage.removeItem('timetracker_projects');
            localStorage.removeItem('timetracker_entries');
            localStorage.removeItem('timetracker_active_session');
            localStorage.removeItem('timetracker_current_project');

            // Reload the page to reset state
            window.location.reload();
        }
    };

    return (
        <div className="space-y-6">
            <Card title="Quản lý Dữ liệu">
                <div className="space-y-8">
                    {/* Export section */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Xuất Dữ Liệu</h3>
                        <p className="text-gray-600 mb-4">
                            Lưu dữ liệu của bạn vào tệp JSON để sao lưu hoặc chuyển sang thiết bị khác.
                        </p>

                        <Button
                            variant="primary"
                            onClick={handleExport}
                            icon="download"
                        >
                            Xuất Dữ Liệu
                        </Button>

                        {exportStatus && (
                            <div className={`mt-3 p-3 rounded-lg ${exportStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {exportStatus.message}
                            </div>
                        )}
                    </div>

                    {/* Import section */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Nhập Dữ Liệu</h3>
                        <p className="text-gray-600 mb-4">
                            Nhập dữ liệu từ tệp JSON đã xuất trước đó. Lưu ý: Dữ liệu hiện tại sẽ được ghi đè.
                        </p>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={triggerFileInput}
                                icon="upload"
                            >
                                Chọn Tệp Dữ Liệu
                            </Button>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".json"
                                onChange={handleImport}
                            />
                        </div>

                        {importStatus && (
                            <div className={`mt-3 p-3 rounded-lg ${importStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {importStatus.message}
                            </div>
                        )}
                    </div>

                    {/* Clear data section */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-red-600 mb-2">Xóa Tất Cả Dữ Liệu</h3>
                        <p className="text-gray-600 mb-4">
                            Xóa tất cả dữ liệu dự án và chấm công. Hành động này không thể khôi phục!
                        </p>

                        <Button
                            variant="danger"
                            onClick={handleClearData}
                            icon="delete"
                        >
                            Xóa Toàn Bộ Dữ Liệu
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}