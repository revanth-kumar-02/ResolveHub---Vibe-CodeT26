'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { User, Role } from '@/lib/types';
import { UserCircle, Save, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatar: '',
    });
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                avatar: user.avatar || '',
            });
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        updateProfile({
            name: formData.name,
            // email: formData.email, // Simulated immutable for now or handled carefully
            avatar: formData.avatar,
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your Profile</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Avatar Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Photo</label>
                            <div className="mt-2 flex items-center gap-x-3">
                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-gray-400">
                                    {formData.avatar.length <= 2 ? (
                                        <span className="text-lg font-bold text-gray-500">{formData.avatar || user.name[0]}</span>
                                    ) : (
                                        <img src={formData.avatar} alt="Profile" className="h-full w-full object-cover" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                                        setFormData({ ...formData, avatar: initials });
                                    }}
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Use Initials
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' })}
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Use Demo Image
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Display Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email URL (Read-only)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        disabled
                                        className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm text-gray-600 capitalize">
                                    {user.role}
                                </div>
                            </div>

                            <div className="sm:col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Department
                                </label>
                                <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                                    {user.department}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-x-4 border-t border-gray-900/10 pt-4">
                            {success && (
                                <div className="flex items-center text-green-600 text-sm">
                                    <CheckCircle className="mr-1.5 h-4 w-4" />
                                    Saved successfully
                                </div>
                            )}
                            <button
                                type="submit"
                                className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                <Save className="mr-1.5 h-4 w-4" />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
