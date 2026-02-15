'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { storage } from '@/lib/storage';
import { Ticket } from '@/lib/types';
import { TicketTable } from '@/components/dashboard/TicketTable';
import { clsx } from 'clsx';
import { useSearchParams } from 'next/navigation';

export default function TechnicianTicketsPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeTab, setActiveTab] = useState<'my' | 'queue' | 'all'>('my');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const all = storage.getTickets();
            setTickets(all);
            setLoading(false);

            // If searching, default to 'all' tab if not specifically looking for my items
            if (initialSearch) {
                setActiveTab('all');
            }
        }
    }, [user, initialSearch]);

    if (loading) return <div className="p-8">Loading tickets...</div>;

    const myTickets = tickets.filter(t => t.assignedTo === user?.id && t.status !== 'resolved' && t.status !== 'closed');
    const queue = tickets.filter(t => t.status === 'open' && !t.assignedTo);
    const allTickets = tickets;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Ticket Queue</h1>
                <p className="mt-1 text-sm text-gray-500">Manage support requests.</p>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {[
                        { id: 'my', name: 'My Active Tickets', count: myTickets.length },
                        { id: 'queue', name: 'Unassigned Queue', count: queue.length },
                        { id: 'all', name: 'All Tickets', count: allTickets.length },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={clsx(
                                activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
                            )}
                        >
                            {tab.name}
                            <span className={clsx(
                                activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                                'hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'
                            )}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            <TicketTable
                tickets={activeTab === 'my' ? myTickets : (activeTab === 'queue' ? queue : allTickets)}
            />
        </div>
    );
}
