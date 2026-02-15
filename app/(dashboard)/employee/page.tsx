'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { storage } from '@/lib/storage';
import { Ticket } from '@/lib/types';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TicketList } from '@/components/dashboard/TicketList';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { Ticket as TicketIcon, Clock, AlertTriangle, CheckCircle, Plus } from 'lucide-react';

export default function EmployeeDashboard() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const allTickets = storage.getTickets();
            const userTickets = allTickets.filter(t => t.createdBy === user.id);
            userTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setTickets(userTickets);
            setIsLoading(false);
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    const openTickets = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
    const criticalTickets = tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved' && t.status !== 'closed').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Welcome back, {user?.name.split(' ')[0]}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Here's what's happening with your support requests.
                    </p>
                </div>
                <Link
                    href="/employee/new-ticket"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <Plus className="h-4 w-4" />
                    Raise New Ticket
                </Link>
            </div>

            <SystemStatus />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Open Tickets"
                    value={openTickets}
                    icon={TicketIcon}
                    color="bg-blue-500"
                />
                <StatsCard
                    title="Avg. Response"
                    value="2h 15m"
                    icon={Clock}
                    color="bg-purple-500"
                />
                <StatsCard
                    title="Critical Issues"
                    value={criticalTickets}
                    icon={AlertTriangle}
                    color="bg-red-500"
                />
                <StatsCard
                    title="Resolved (All Time)"
                    value={resolvedTickets}
                    icon={CheckCircle}
                    color="bg-green-500"
                />
            </div>

            {/* SLA Warning Banner if Critical Tickets exist */}
            {criticalTickets > 0 && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Attention Needed</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>You have {criticalTickets} critical issue(s) pending resolution. Our team is prioritizing these requests.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <TicketList
                    tickets={tickets}
                    limit={5}
                    title="Recent Requests"
                    basePath="/employee/tickets"
                    viewAllHref="/employee/tickets"
                />
            </div>
        </div>
    );
}
