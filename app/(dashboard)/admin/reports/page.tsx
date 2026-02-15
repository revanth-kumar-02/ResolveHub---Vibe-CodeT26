'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { storage } from '@/lib/storage';
import { Ticket, User } from '@/lib/types';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { Download } from 'lucide-react';

export default function AdminReportsPage() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setTickets(storage.getTickets());
            setUsers(storage.getUsers());
            setLoading(false);
        }
    }, [user]);

    const downloadCSV = (filename: string, csvContent: string) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const exportTicketsCSV = () => {
        const headers = ['ID', 'Title', 'Type', 'Priority', 'Status', 'Created By', 'Assigned To', 'Created At', 'SLA Deadline', 'Department'];
        const rows = tickets.map(t => [
            t.id,
            `"${t.title.replace(/"/g, '""')}"`,
            t.type,
            t.priority,
            t.status,
            t.createdBy,
            t.assignedTo || 'Unassigned',
            t.createdAt,
            t.slaDeadline,
            t.department || ''
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        downloadCSV(`tickets_export_${new Date().toISOString().split('T')[0]}.csv`, csv);
    };

    const exportUsersCSV = () => {
        const headers = ['ID', 'Name', 'Email', 'Role', 'Department'];
        const rows = users.map(u => [
            u.id,
            `"${u.name.replace(/"/g, '""')}"`,
            u.email,
            u.role,
            u.department
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        downloadCSV(`users_export_${new Date().toISOString().split('T')[0]}.csv`, csv);
    };

    if (loading) return <div className="p-8">Loading reports...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">System Reports</h1>
                <p className="mt-1 text-sm text-gray-500">Detailed analytics and performance metrics.</p>
            </div>

            {/* Reuse the Analytics Component */}
            <AnalyticsCharts tickets={tickets} />

            <div className="mt-8 bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Export Data</h3>
                <p className="text-sm text-gray-500 mb-4">Download system data for offline analysis.</p>
                <div className="flex gap-4">
                    <button
                        onClick={exportTicketsCSV}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export Tickets (CSV)
                    </button>
                    <button
                        onClick={exportUsersCSV}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export Users (CSV)
                    </button>
                </div>
            </div>
        </div>
    );
}
