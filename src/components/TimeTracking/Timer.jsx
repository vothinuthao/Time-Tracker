// components/TimeTracking/Timer.jsx
import React from 'react';
import { formatTime } from '../../utils/dateFormatter';

export function Timer({ isTracking, startTime, timer, projectName }) {
    return (
        <div className={`bg-white rounded-xl border ${isTracking ? 'border-green-200' : 'border-gray-200'} p-4 flex-grow flex flex-col items-center justify-center text-center`}>
            {isTracking ? (
                <>
                    <div className="text-green-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Đang làm việc từ</p>
                    <p className="text-lg font-medium mb-3">{startTime ? formatTime(startTime) : '--:--'}</p>

                    {projectName && (
                        <div className="bg-green-50 rounded-full px-4 py-2 text-green-700 text-xs font-medium mb-4">
                            {projectName}
                        </div>
                    )}

                    <div className="mt-2 text-4xl font-bold text-gray-800">
                        {timer}
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                        Nhấn "Kết Thúc Làm Việc" để lưu thời gian này
                    </div>
                </>
            ) : (
                <>
                    <div className="text-gray-400 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-base text-gray-500 mb-2">Chưa bắt đầu làm việc</p>
                    <p className="text-sm text-gray-400 max-w-xs mx-auto">
                        Chọn dự án và nhấn "Bắt Đầu Làm Việc" để bắt đầu tính thời gian
                    </p>
                </>
            )}
        </div>
    );
}