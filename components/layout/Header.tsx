'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { Menu as MenuIcon, Bell, User as UserIcon, Search, LogOut, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { clsx } from 'clsx';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [showToast, setShowToast] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        // Determine target based on role
        let basePath = '/dashboard';
        if (user.role === 'employee') basePath = '/employee/tickets';
        else if (user.role === 'technician') basePath = '/technician/tickets';
        else if (user.role === 'admin') basePath = '/admin/tickets';

        router.push(`${basePath}?search=${encodeURIComponent(searchTerm)}`);
    };

    const handleSettings = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <>
            <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={onMenuClick}
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none lg:hidden"
                    >
                        <MenuIcon className="h-6 w-6" />
                    </button>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative ml-4">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 bg-gray-50 border"
                                placeholder="Search by ID, Subject, or Status..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                        <Bell className="h-6 w-6" />
                    </button>

                    {/* Profile Dropdown */}
                    <Menu as="div" className="relative ml-3">
                        <div>
                            <Menu.Button className="flex items-center max-w-xs rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                <span className="sr-only">Open user menu</span>
                                <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                                        <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                                    </div>
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 ring-2 ring-white text-indigo-600 font-bold overflow-hidden">
                                        {user?.avatar && user.avatar.length <= 2 ? user.avatar : <img src={user?.avatar} alt="" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                                        {(!user?.avatar || user.avatar.length > 2) && <UserIcon className="h-5 w-5 absolute" />}
                                    </div>
                                </div>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={React.Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href="/profile"
                                            className={clsx(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 flex items-center')}
                                        >
                                            <UserCircle className="mr-2 h-4 w-4" />
                                            Your Profile
                                        </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={handleSettings}
                                            className={clsx(active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center')}
                                        >
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={logout}
                                            className={clsx(active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center')}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Sign out
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </header>

            {/* Toast notification for Settings */}
            {showToast && (
                <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
                        <Settings className="h-4 w-4 text-gray-300" />
                        <span>Settings page coming soon!</span>
                        <button onClick={() => setShowToast(false)} className="ml-2 text-gray-400 hover:text-white">✕</button>
                    </div>
                </div>
            )}
        </>
    );
}
