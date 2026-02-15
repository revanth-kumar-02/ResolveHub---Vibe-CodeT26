'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ticket, User, TicketStatus, Priority } from '@/lib/types';
import { formatDate, cn, STATUS_COLORS, PRIORITY_COLORS } from '@/lib/utils';
import { SLAClock } from '@/components/dashboard/SLAClock';
import { useAuth } from '@/lib/authContext';
import {
    ArrowLeft,
    Calendar,
    User as UserIcon,
    Clock,
    AlertTriangle,
    CheckCircle,
    MessageSquare,
    Shield
} from 'lucide-react';
import { storage } from '@/lib/storage'; // We might need to update ticket status

interface TicketDetailViewProps {
    ticket: Ticket;
    currentUser: User;
    onTicketUpdate?: (updatedTicket: Ticket) => void;
}

export function TicketDetailView({ ticket, currentUser, onTicketUpdate }: TicketDetailViewProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    // Actions based on role
    const canResolve = currentUser.role === 'technician' || currentUser.role === 'admin';
    const canEscalate = currentUser.role === 'technician' || currentUser.role === 'admin';
    const canClaim = currentUser.role === 'technician' && !ticket.assignedTo;

    const handleStatusUpdate = (newStatus: TicketStatus) => {
        setIsUpdating(true);
        // Simulate API call
        setTimeout(() => {
            const updated = { ...ticket, status: newStatus };
            // In a real app, this would happen in the parent or via a mutation
            if (onTicketUpdate) onTicketUpdate(updated);

            // Also update local storage directly for this demo since we don't have a real backend sync
            const allTickets = storage.getTickets();
            const idx = allTickets.findIndex(t => t.id === ticket.id);
            if (idx !== -1) {
                allTickets[idx] = updated;
                localStorage.setItem('it-portal-tickets', JSON.stringify(allTickets));
            }

            setIsUpdating(false);
        }, 500);
    };

    const handleClaim = () => {
        setIsUpdating(true);
        setTimeout(() => {
            const updated = { ...ticket, assignedTo: currentUser.id, status: 'in-progress' as TicketStatus };
            if (onTicketUpdate) onTicketUpdate(updated);
            // Sync storage
            const allTickets = storage.getTickets();
            const idx = allTickets.findIndex(t => t.id === ticket.id);
            if (idx !== -1) {
                allTickets[idx] = updated;
                localStorage.setItem('it-portal-tickets', JSON.stringify(allTickets));
            }
            setIsUpdating(false);
        }, 500);
    };

    const backLink = currentUser.role === 'admin' ? '/admin' :
        currentUser.role === 'technician' ? '/technician/tickets' :
            '/employee';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href={backLink}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                            <span className="font-mono text-gray-400">#{ticket.id}</span>
                            <span>•</span>
                            <span suppressHydrationWarning>Opened {formatDate(ticket.createdAt)}</span>
                            <span>•</span>
                            <span>{ticket.department}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {canClaim && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                            <button
                                onClick={handleClaim}
                                disabled={isUpdating}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Claim Ticket
                            </button>
                        )}
                        {canResolve && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                            <button
                                onClick={() => handleStatusUpdate('resolved')}
                                disabled={isUpdating}
                                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark Resolved
                            </button>
                        )}
                        {canEscalate && ticket.status !== 'escalated' && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                            <button
                                onClick={() => handleStatusUpdate('escalated')}
                                disabled={isUpdating}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                            >
                                <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                                Escalate
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Description</h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>{ticket.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* History / Activity Feed (Mocked for now as we don't strictly track history in mockData yet, or displayed from ID) */}
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Activity Log</h3>
                            <div className="flow-root">
                                <ul role="list" className="-mb-8">
                                    <li>
                                        <div className="relative pb-8">
                                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                            <div className="relative flex space-x-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
                                                    <Clock className="h-5 w-5 text-gray-500" aria-hidden="true" />
                                                </div>
                                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Ticket created</p>
                                                    </div>
                                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                        <time dateTime={ticket.createdAt} suppressHydrationWarning>{formatDate(ticket.createdAt)}</time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    {/* Mock resolution entry if resolved */}
                                    {(ticket.status === 'resolved' || ticket.status === 'closed') && (
                                        <li>
                                            <div className="relative pb-8">
                                                <div className="relative flex space-x-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 ring-8 ring-white">
                                                        <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
                                                    </div>
                                                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Ticket marked as resolved</p>
                                                        </div>
                                                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                            <time dateTime={ticket.updatedAt} suppressHydrationWarning>{formatDate(ticket.updatedAt)}</time>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900">Details</h3>
                        </div>
                        <div className="px-4 py-5 sm:p-6 space-y-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                                <span className={cn(
                                    "mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                                    STATUS_COLORS[ticket.status]
                                )}>
                                    {ticket.status.replace('-', ' ')}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Priority</p>
                                <span className={cn(
                                    "mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                                    PRIORITY_COLORS[ticket.priority]
                                )}>
                                    {ticket.priority}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">SLA Target</p>
                                <div className="mt-1">
                                    <SLAClock deadline={ticket.slaDeadline} status={ticket.status} />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Type</p>
                                <p className="mt-1 text-sm text-gray-900 capitalize">{ticket.type}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900">People</h3>
                        </div>
                        <div className="px-4 py-5 sm:p-6 space-y-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Reporter</p>
                                <div className="mt-2 flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                        {/* Mock avatar */}
                                        U
                                    </div>
                                    <span className="ml-2 text-sm text-gray-900">User {ticket.createdBy}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Assignee</p>
                                <div className="mt-2 flex items-center">
                                    {ticket.assignedTo ? (
                                        <>
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                                                T
                                            </div>
                                            <span className="ml-2 text-sm text-gray-900">Tech {ticket.assignedTo}</span>
                                        </>
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">Unassigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
