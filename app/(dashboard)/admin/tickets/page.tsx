'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { storage } from '@/lib/storage';
import { Ticket } from '@/lib/types';
import { TicketTable } from '@/components/dashboard/TicketTable';

export default function AdminTicketsPage() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const allTickets = storage.getTickets();
            setTickets(allTickets);
            setLoading(false);
        }
    }, [user]);

    if (loading) return <div className="p-8">Loading tickets...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">All Tickets</h1>
                <p className="mt-1 text-sm text-gray-500">View and manage all system tickets.</p>
            </div>
            <TicketTable tickets={tickets} />
        </div>
    );
}
