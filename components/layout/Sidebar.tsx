'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
    LayoutDashboard,
    PlusCircle,
    Ticket,
    Users,
    BarChart,
    Settings,
    LogOut,
    AlertOctagon
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const getLinks = () => {
        switch (user.role) {
            case 'employee':
                return [
                    { name: 'Dashboard', href: '/employee', icon: LayoutDashboard },
                    { name: 'Raise Ticket', href: '/employee/new-ticket', icon: PlusCircle },
                    { name: 'My Tickets', href: '/employee/tickets', icon: Ticket },
                ];
            case 'technician':
                return [
                    { name: 'Work Queue', href: '/technician', icon: LayoutDashboard },
                    { name: 'All Tickets', href: '/technician/tickets', icon: Ticket },
                    { name: 'Performance', href: '/technician/performance', icon: BarChart },
                ];
            case 'manager':
                return [
                    { name: 'Dashboard', href: '/employee', icon: LayoutDashboard },
                    { name: 'Raise Ticket', href: '/employee/new-ticket', icon: PlusCircle },
                    { name: 'My Tickets', href: '/employee/tickets', icon: Ticket },
                ];
            case 'admin':
                return [
                    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
                    { name: 'All Tickets', href: '/admin/tickets', icon: Ticket },
                    { name: 'Users', href: '/admin/users', icon: Users },
                    { name: 'Reports', href: '/admin/reports', icon: BarChart },
                    { name: 'Governance', href: '/admin/governance', icon: AlertOctagon },
                ];
            default:
                return [];
        }
    };

    const links = getLinks();

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 z-20 bg-gray-900/50 transition-opacity lg:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-900 text-white transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-16 items-center justify-center border-b border-gray-800">
                    <h1 className="text-xl font-bold tracking-wider">IT PORTAL</h1>
                </div>

                <nav className="mt-6 flex-1 px-4 space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx(
                                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                )}
                                onClick={() => onClose()} // Close on mobile navigation
                            >
                                <Icon className="h-5 w-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-gray-800 p-4">
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
}
