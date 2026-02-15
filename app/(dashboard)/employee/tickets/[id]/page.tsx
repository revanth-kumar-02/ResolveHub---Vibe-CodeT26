'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { storage } from '@/lib/storage';
import { Ticket } from '@/lib/types';
import { TicketDetailView } from '@/components/dashboard/TicketDetailView';

export default function EmployeeTicketPage() {
    const params = useParams();
    const { user } = useAuth();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id && user) {
            const allTickets = storage.getTickets();
            const found = allTickets.find(t => t.id === params.id);
            setTicket(found || null);
            setLoading(false);
        }
    }, [params.id, user]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading ticket details...</div>;
    }

    if (!ticket) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-900">Ticket Not Found</h2>
                <p className="mt-2 text-gray-500">The ticket you are looking for does not exist or you do not have permission to view it.</p>
            </div>
        );
    }

    return <TicketDetailView ticket={ticket} currentUser={user!} />;
}
