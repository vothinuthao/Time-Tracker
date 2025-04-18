// frontend/src/components/Auth/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

export function Register({ onLoginClick }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const { register, loading, error } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Clear password error when typing
        if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
            setPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Mật khẩu không khớp');
            return;
        }

        const { name, email, password } = formData;
        await register({ name, email, password });
    };

    return (
        <Card className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký</h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

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

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        minLength="6"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                            passwordError ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                    />
                    {passwordError && (
                        <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                </Button>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Đã có tài khoản?{' '}
                        <button
                            type="button"
                            onClick={onLoginClick}
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                            Đăng nhập
                        </button>
                    </p>
                </div>
            </form>
        </Card>
    );
}