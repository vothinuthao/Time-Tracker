import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export function Header({ setCurrentTab }) {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <header className="bg-indigo-800 text-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src="/images/logo_time_tracker.png"
                        alt="Freelance Time Tracker"
                        className="h-10 w-auto mr-3"
                    />
                    <h1 className="text-xl font-bold">Time Tracker</h1>
                </div>

                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <button className="flex items-center text-indigo-200 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                                Cài đặt
                            </button>
                            <div className="h-6 w-px bg-indigo-500"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium mr-2">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="text-sm hidden md:inline">{user?.name || 'User'}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setCurrentTab('login')}
                                className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                            >
                                Đăng nhập
                            </button>
                            <button
                                onClick={() => setCurrentTab('register')}
                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
                            >
                                Đăng ký
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;