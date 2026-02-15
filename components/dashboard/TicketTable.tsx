'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Ticket, Priority, TicketStatus } from '@/lib/types';
import { cn, formatDate, STATUS_COLORS, PRIORITY_COLORS } from '@/lib/utils';
import { SLAClock } from '@/components/dashboard/SLAClock';
import {
    ArrowUpDown,
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';

interface TicketTableProps {
    tickets: Ticket[];
    onStatusUpdate?: (ticketId: string, status: TicketStatus) => void;
}

export function TicketTable({ tickets, onStatusUpdate }: TicketTableProps) {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Ticket | 'sla'; direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });
    const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');
    const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Sorting and Filtering Logic
    const processedData = useMemo(() => {
        let data = [...tickets];

        // Filter
        if (filterStatus !== 'all') {
            data = data.filter(t => t.status === filterStatus);
        }
        if (filterPriority !== 'all') {
            data = data.filter(t => t.priority === filterPriority);
        }
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            data = data.filter(t =>
                t.title.toLowerCase().includes(lower) ||
                t.id.toLowerCase().includes(lower) ||
                t.createdBy.toLowerCase().includes(lower)
            );
        }

        // Sort
        data.sort((a, b) => {
            if (sortConfig.key === 'sla') {
                const dateA = new Date(a.slaDeadline).getTime();
                const dateB = new Date(b.slaDeadline).getTime();
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            if (sortConfig.key === 'createdAt') {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Default string comparison
            const valA = String(a[sortConfig.key] || '');
            const valB = String(b[sortConfig.key] || '');

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return data;
    }, [tickets, filterStatus, filterPriority, searchTerm, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const paginatedData = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (key: keyof Ticket | 'sla') => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    return (
        <div className="space-y-4">
            {/* Controls Bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border"
                        placeholder="Search tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 border bg-white"
                    >
                        <option value="all">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="waiting-for-user">Waiting</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>

                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value as any)}
                        className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 border bg-white"
                    >
                        <option value="all">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg bg-white">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer group" onClick={() => handleSort('id')}>
                                    <div className="flex items-center gap-2">ID <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" /></div>
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer group" onClick={() => handleSort('title')}>
                                    <div className="flex items-center gap-2">Subject <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" /></div>
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer group" onClick={() => handleSort('priority')}>
                                    <div className="flex items-center gap-2">Priority <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" /></div>
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer group" onClick={() => handleSort('status')}>
                                    <div className="flex items-center gap-2">Status <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" /></div>
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer group" onClick={() => handleSort('sla')}>
                                    <div className="flex items-center gap-2">SLA Timer <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" /></div>
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {paginatedData.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-indigo-600 sm:pl-6">
                                        <Link href={`/technician/tickets/${ticket.id}`} className="hover:underline">
                                            {ticket.id}
                                        </Link>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-xs truncate" title={ticket.title}>
                                        {ticket.title}
                                        <div className="text-xs text-gray-400" suppressHydrationWarning>{formatDate(ticket.createdAt)}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", PRIORITY_COLORS[ticket.priority])}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", STATUS_COLORS[ticket.status])}>
                                            {ticket.status.replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <SLAClock deadline={ticket.slaDeadline} status={ticket.status} />
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <div className="flex justify-end gap-2">
                                            {onStatusUpdate && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                                                <button
                                                    onClick={() => onStatusUpdate(ticket.id, 'resolved')}
                                                    className="text-green-600 hover:text-green-900 border border-green-200 bg-green-50 p-1.5 rounded-md"
                                                    title="Mark Resolved"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                            {onStatusUpdate && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                                                <button
                                                    onClick={() => onStatusUpdate(ticket.id, 'escalated')}
                                                    className="text-red-600 hover:text-red-900 border border-red-200 bg-red-50 p-1.5 rounded-md"
                                                    title="Escalate"
                                                >
                                                    <AlertTriangle className="h-4 w-4" />
                                                </button>
                                            )}
                                            <Link href={`/technician/tickets/${ticket.id}`} className="text-indigo-600 hover:text-indigo-900 p-1.5">
                                                View
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, processedData.length)}</span> of{' '}
                            <span className="font-medium">{processedData.length}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </button>

                            {/* Simplified pagination: just current/total */}
                            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                                Page {currentPage} of {Math.max(1, totalPages)}
                            </span>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}
