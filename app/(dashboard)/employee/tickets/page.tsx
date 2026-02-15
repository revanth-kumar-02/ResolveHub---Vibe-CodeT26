'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { storage } from '@/lib/storage';
import { Ticket } from '@/lib/types';
import { TicketTable } from '@/components/dashboard/TicketTable';

export default function EmployeeTicketsPage() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const allTickets = storage.getTickets();
            const myTickets = allTickets.filter(t => t.createdBy === user.id);
            setTickets(myTickets);
            setLoading(false);
        }
    }, [user]);

    if (loading) return <div className="p-8">Loading your tickets...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
                <p className="mt-1 text-sm text-gray-500">Track the status of your support requests.</p>
            </div>
            <TicketTable tickets={tickets} />
        </div>
    );
}
