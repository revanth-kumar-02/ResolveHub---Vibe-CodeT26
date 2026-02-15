'use client';

import React from 'react';
import Link from 'next/link';
import { Ticket } from '@/lib/types';
import { cn, formatDate, STATUS_COLORS, PRIORITY_COLORS } from '@/lib/utils';
import { BadgeCheck, Clock, AlertTriangle } from 'lucide-react';

interface TicketListProps {
    tickets: Ticket[];
    title?: string;
    limit?: number;
    basePath?: string;
    viewAllHref?: string;
}

export function TicketList({ tickets, title = 'Recent Tickets', limit, basePath = '/tickets', viewAllHref }: TicketListProps) {
    const displayTickets = limit ? tickets.slice(0, limit) : tickets;

    if (tickets.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center bg-white shadow-sm">
                <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new support request.</p>
                <div className="mt-6">
                    <Link
                        href="/employee/new-ticket"
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                        Raise Ticket
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                {limit && tickets.length > limit && viewAllHref && (
                    <Link href={viewAllHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        View all
                    </Link>
                )}
            </div>
            <ul role="list" className="divide-y divide-gray-200">
                {displayTickets.map((ticket) => (
                    <li key={ticket.id}>
                        <Link
                            href={`${basePath}/${ticket.id}`}
                            className="block hover:bg-gray-50 transition-colors"
                        >
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center truncate">
                                        <p className="truncate text-sm font-medium text-indigo-600">{ticket.title}</p>
                                        <span
                                            className={cn(
                                                'ml-2 inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                                                STATUS_COLORS[ticket.status] || 'bg-gray-100 text-gray-800'
                                            )}
                                        >
                                            {ticket.status.replace('-', ' ')}
                                        </span>
                                    </div>
                                    <div className="ml-2 flex flex-shrink-0">
                                        <span
                                            className={cn(
                                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                                                PRIORITY_COLORS[ticket.priority] || 'bg-gray-100 text-gray-800'
                                            )}
                                        >
                                            {ticket.priority}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2 flex justify-between">
                                    <div className="flex items-center text-sm text-gray-500 gap-4">
                                        <p className="flex items-center">
                                            <Clock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                            <span suppressHydrationWarning>Created {formatDate(ticket.createdAt)}</span>
                                        </p>
                                        {ticket.slaDeadline && (
                                            <p className="flex items-center">
                                                <AlertTriangle className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                <span suppressHydrationWarning>Due {formatDate(ticket.slaDeadline)}</span>
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400">ID: {ticket.id}</p>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
