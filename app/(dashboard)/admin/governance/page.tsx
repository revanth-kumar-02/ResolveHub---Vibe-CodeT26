'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { storage } from '@/lib/storage';
import { Ticket, User } from '@/lib/types';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AlertOctagon, TrendingDown, Clock, AlertTriangle } from 'lucide-react';
import { TicketList } from '@/components/dashboard/TicketList';

export default function AdminGovernancePage() {
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

    if (loading) return <div className="p-8">Loading governance data...</div>;

    // SLA Calculations
    const totalTickets = tickets.length;
    const slaBreached = tickets.filter(t => {
        if (t.status === 'resolved' || t.status === 'closed') return false;
        return new Date(t.slaDeadline) < new Date();
    }).length;
    const slaComplianceRate = totalTickets > 0 ? ((totalTickets - slaBreached) / totalTickets) * 100 : 100;

    // Identify High-Volume Users (Potential Abuse/Training Need)
    const userTicketCounts = users.reduce((acc, u) => {
        const count = tickets.filter(t => t.createdBy === u.id).length;
        if (count > 0) acc.push({ user: u, count });
        return acc;
    }, [] as { user: User; count: number }[]);

    // Sort by count desc
    const frequentRequesters = userTicketCounts.sort((a, b) => b.count - a.count).slice(0, 5);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">IT Governance</h1>
                <p className="mt-1 text-sm text-gray-500">Compliance monitoring and risk assessment.</p>
            </div>

            {/* Compliance Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="SLA Compliance"
                    value={`${slaComplianceRate.toFixed(1)}%`}
                    icon={TrendingDown}
                    color={slaComplianceRate > 90 ? "bg-green-500" : "bg-red-500"}
                />
                <StatsCard
                    title="Active Breaches"
                    value={slaBreached}
                    icon={AlertOctagon}
                    color="bg-red-500"
                />
                <StatsCard
                    title="Critical Issues"
                    value={tickets.filter(t => t.priority === 'critical' && t.status !== 'closed').length}
                    icon={AlertTriangle}
                    color="bg-orange-500"
                />
                <StatsCard
                    title="Avg Resolution"
                    value="4h 12m"
                    icon={Clock}
                    color="bg-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Frequent Requesters */}
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Frequent Requesters</h3>
                        <div className="mt-4 flow-root">
                            <ul role="list" className="-my-5 divide-y divide-gray-200">
                                {frequentRequesters.map(({ user, count }) => (
                                    <li key={user.id} className="py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                                                    <span className="text-xs font-medium leading-none text-indigo-700">{user.avatar}</span>
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="truncate text-sm text-gray-500">{user.department}</p>
                                            </div>
                                            <div>
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                    {count} Tickets
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* SLA Risk List */}
                <div className="bg-white shadow sm:rounded-lg pb-4">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">At Risk (SLA &lt; 2h)</h3>
                    </div>
                    <TicketList
                        tickets={tickets.filter(t => {
                            if (t.status === 'resolved' || t.status === 'closed') return false;
                            const hoursLeft = (new Date(t.slaDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60);
                            return hoursLeft > 0 && hoursLeft < 2;
                        })}
                        limit={5}
                        title=""
                        basePath="/admin/tickets"
                    />
                </div>
            </div>
        </div>
    );
}
