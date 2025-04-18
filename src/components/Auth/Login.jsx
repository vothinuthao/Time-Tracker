// frontend/src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

export function Login({ onRegisterClick }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login, loading, error } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
    };

    return (
        <Card className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                </Button>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Chưa có tài khoản?{' '}
                        <button
                            type="button"
                            onClick={onRegisterClick}
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                            Đăng ký ngay
                        </button>
                    </p>
                </div>
            </form>
        </Card>
    );
}