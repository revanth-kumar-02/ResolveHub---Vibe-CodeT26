'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    // Role-based route protection
    useEffect(() => {
        if (!isLoading && user) {
            const isAdminRoute = pathname.startsWith('/admin');
            const isTechRoute = pathname.startsWith('/technician');

            if (isAdminRoute && user.role !== 'admin') {
                // Non-admins cannot access admin pages
                if (user.role === 'technician') router.push('/technician');
                else router.push('/employee');
            } else if (isTechRoute && user.role !== 'technician') {
                // Non-technicians cannot access technician pages
                if (user.role === 'admin') router.push('/admin');
                else router.push('/employee');
            }
        }
    }, [isLoading, user, pathname, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex flex-1 flex-col overflow-hidden transition-all duration-300">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
