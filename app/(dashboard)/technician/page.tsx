'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { storage } from '@/lib/storage';
import { Ticket, TicketStatus } from '@/lib/types';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TicketTable } from '@/components/dashboard/TicketTable';
import { Ticket as TicketIcon, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function TechnicianDashboard() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [myTickets, setMyTickets] = useState<Ticket[]>([]);
    const [openQueue, setOpenQueue] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = () => {
        if (!user) return;
        const allTickets = storage.getTickets();

        const my = allTickets.filter(t => t.assignedTo === user.id && t.status !== 'resolved' && t.status !== 'closed');
        const queue = allTickets.filter(t => t.status === 'open' && !t.assignedTo);

        // Sort by priority then date
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        queue.sort((a, b) => {
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

        setTickets(allTickets);
        setMyTickets(my);
        setOpenQueue(queue);
        setIsLoading(false);
    };

    const handleStatusUpdate = (ticketId: string, status: TicketStatus) => {
        if (!user) return;
        const ticket = storage.getTicket(ticketId);
        if (!ticket) return;

        const updatedTicket = {
            ...ticket,
            status,
            updatedAt: new Date().toISOString(),
            history: [
                ...ticket.history,
                {
                    id: `hist-${Date.now()}`,
                    action: status === 'resolved' ? 'RESOLVED' : 'STATUS_CHANGE',
                    timestamp: new Date().toISOString(),
                    actorId: user.id,
                    details: `Status updated to ${status}`
                }
            ]
        };

        if (status === 'escalated') {
            updatedTicket.priority = 'critical';
        }

        storage.updateTicket(updatedTicket);
        loadData(); // Refresh list
    };

    if (isLoading) return <div className="p-8">Loading workspace...</div>;

    const resolvedToday = tickets.filter(t =>
        (t.status === 'resolved' || t.status === 'closed') &&
        t.assignedTo === user?.id &&
        new Date(t.updatedAt).toDateString() === new Date().toDateString()
    ).length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Technician Workspace
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your queue and resolve issues efficiently.
                    </p>
                </div>
                <Link
                    href="/technician/performance"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-white border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <TrendingUp className="h-4 w-4 text-indigo-500" />
                    View Performance
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Assigned to Me"
                    value={myTickets.length}
                    icon={TicketIcon}
                    color="bg-indigo-500"
                />
                <StatsCard
                    title="Unassigned Queue"
                    value={openQueue.length}
                    icon={TicketIcon}
                    color="bg-blue-500"
                />
                <StatsCard
                    title="Resolved Today"
                    value={resolvedToday}
                    icon={CheckCircle}
                    color="bg-green-500"
                />
                <StatsCard
                    title="SLA Compliance"
                    value="98%"
                    icon={TrendingUp}
                    color="bg-teal-500"
                />
            </div>

            <div className="space-y-8">
                <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">My Active Tickets</h2>
                    <TicketTable tickets={myTickets} onStatusUpdate={handleStatusUpdate} />
                </div>

                <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Unassigned Queue</h2>
                    <TicketTable tickets={openQueue} />
                </div>
            </div>
        </div>
    );
}
