import React from 'react';

export function Card({
                         children,
                         title = null,
                         className = '',
                         ...props
                     }) {
    return (
        <div
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 ${className}`}
            {...props}
        >
            {title && (
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
}
