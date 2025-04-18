import React from 'react';

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 border-t border-gray-200 py-4">
            <div className="max-w-5xl mx-auto px-4 text-center text-gray-600 text-sm">
                <p>© {year} Freelance Time Tracker. Tất cả các quyền được bảo lưu.</p>
            </div>
        </footer>
    );
}