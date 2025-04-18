import React, { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';

export function Auth({ initialTab = 'login' }) {
    const [activeTab, setActiveTab] = useState(initialTab);

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="flex justify-center mb-6">
                <div className="bg-white rounded-lg shadow-sm p-1 flex space-x-1">
                    <button
                        className={`px-4 py-2 rounded ${
                            activeTab === 'login'
                                ? 'bg-indigo-500 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab('login')}
                    >
                        Đăng nhập
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${
                            activeTab === 'register'
                                ? 'bg-indigo-500 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab('register')}
                    >
                        Đăng ký
                    </button>
                </div>
            </div>

            {activeTab === 'login' ? (
                <Login onRegisterClick={() => setActiveTab('register')} />
            ) : (
                <Register onLoginClick={() => setActiveTab('login')} />
            )}
        </div>
    );
}

export default Auth;