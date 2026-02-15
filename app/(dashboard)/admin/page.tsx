'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { storage } from '@/lib/storage';
import { Ticket, User } from '@/lib/types';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { TicketList } from '@/components/dashboard/TicketList';
import { Activity, Users, AlertOctagon, TrendingDown, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setTickets(storage.getTickets());
            setUsers(storage.getUsers());
            setIsLoading(false);
        }
    }, [user]);

    const handleResetData = () => {
        localStorage.removeItem('it-portal-tickets');
        localStorage.removeItem('it-portal-users');
        window.location.reload();
    };

    if (isLoading) return <div className="p-8">Loading analytics...</div>;

    // KPIs
    const totalTickets = tickets.length;
    const slaBreached = tickets.filter(t => {
        if (t.status === 'resolved' || t.status === 'closed') return false;
        return new Date(t.slaDeadline) < new Date();
    }).length;
    const slaComplianceRate = totalTickets > 0 ? ((totalTickets - slaBreached) / totalTickets) * 100 : 100;

    // Governance: Flag Users with > 3 tickets of same type
    const userFlags: { user: User; count: number; type: string }[] = [];
    users.forEach(u => {
        const userTickets = tickets.filter(t => t.createdBy === u.id);
        const typeCounts = userTickets.reduce((acc, t) => {
            acc[t.type] = (acc[t.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        Object.entries(typeCounts).forEach(([type, count]) => {
            if (count > 3) {
                userFlags.push({ user: u, count, type });
            }
        });
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        IT Governance & Analytics
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        System oversight and performance metrics.
                    </p>
                </div>
                <button
                    onClick={handleResetData}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset Simulation
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Tickets"
                    value={totalTickets}
                    icon={Activity}
                    color="bg-indigo-500"
                />
                <StatsCard
                    title="SLA Breaches"
                    value={slaBreached}
                    icon={AlertOctagon}
                    color="bg-red-500"
                />
                <StatsCard
                    title="SLA Compliance"
                    value={`${slaComplianceRate.toFixed(1)}%`}
                    icon={TrendingDown} // Should be TrendingUp if high, but using generic icon
                    color={slaComplianceRate > 90 ? "bg-green-500" : "bg-yellow-500"}
                />
                <StatsCard
                    title="Active Users"
                    value={users.length}
                    icon={Users}
                    color="bg-blue-500"
                />
            </div>

            {/* Governance Alerts */}
            {userFlags.length > 0 && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
                    <div className="flex items-center mb-4">
                        <AlertOctagon className="h-6 w-6 text-yellow-600 mr-2" />
                        <h3 className="text-lg font-medium text-yellow-800">Governance Alerts: High Frequency Users</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userFlags.map((flag, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg border border-yellow-100 shadow-sm">
                                <p className="font-medium text-gray-900">{flag.user.name}</p>
                                <p className="text-sm text-gray-500">{flag.user.department}</p>
                                <p className="text-xs text-red-600 mt-1 font-semibold">
                                    {flag.count} {flag.type} tickets (Potential Training Need)
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Analytics Charts */}
            <div className="pt-4">
                <AnalyticsCharts tickets={tickets} />
            </div>

            {/* Recent Escalations */}
            <div className="pt-4">
                <TicketList
                    tickets={tickets.filter(t => t.priority === 'critical' || t.status === 'escalated')}
                    title="Critical & Escalated Issues"
                    limit={5}
                    basePath="/admin/tickets"
                    viewAllHref="/admin/tickets"
                />
            </div>
        </div>
    );
}
