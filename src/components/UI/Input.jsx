import React from 'react';

export function Input({
                          label,
                          id,
                          type = 'text',
                          className = '',
                          error = null,
                          ...props
                      }) {
    // Generate a unique ID if one isn't provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                </label>
            )}

            <input
                id={inputId}
                type={type}
                className={`
          w-full py-2 px-3 rounded-lg border 
          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${className}
        `}
                {...props}
            />

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}