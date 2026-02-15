'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { storage } from '@/lib/storage';
import { TicketType, Priority, Ticket, PRIORITY_SLA } from '@/lib/types';
import { AlertCircle, FileText, Monitor, Shield, HelpCircle, Server, Lock } from 'lucide-react';

const TICKET_TYPES: { type: TicketType; icon: any; label: string }[] = [
    { type: 'hardware', icon: Monitor, label: 'Hardware Issue' },
    { type: 'software', icon: FileText, label: 'Software/App' },
    { type: 'network', icon: Server, label: 'Network/VPN' },
    { type: 'security', icon: Shield, label: 'Security Incident' },
    { type: 'access', icon: Lock, label: 'Access Request' },
    { type: 'other', icon: HelpCircle, label: 'Other Inquiry' },
];

export function NewTicketForm() {
    const router = useRouter();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<TicketType>('hardware');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [calculatedPriority, setCalculatedPriority] = useState<Priority>('medium');

    // Auto-calculate priority based on user role and ticket type
    useEffect(() => {
        if (!user) return;

        let priority: Priority = 'low';

        // Role-based baseline
        if (user.role === 'admin' || user.role === 'manager') priority = 'high';
        else priority = 'medium';

        // Type-based overrides
        if (type === 'security') priority = 'critical';
        if (type === 'access' && priority === 'low') priority = 'medium';
        if (type === 'other') priority = 'low';

        setCalculatedPriority(priority);
    }, [type, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const slaHours = PRIORITY_SLA[calculatedPriority];
        const createdDate = new Date();
        const slaDeadline = new Date(createdDate.getTime() + slaHours * 60 * 60 * 1000).toISOString();

        const newTicket: Ticket = {
            id: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
            title,
            description,
            type,
            priority: calculatedPriority,
            status: 'open', // Initial status
            createdBy: user.id,
            department: user.department,
            createdAt: createdDate.toISOString(),
            updatedAt: createdDate.toISOString(),
            slaDeadline,
            history: [
                {
                    id: `hist-${Math.random().toString(36).substr(2, 9)}`,
                    action: 'CREATED',
                    timestamp: createdDate.toISOString(),
                    actorId: user.id,
                    details: 'Ticket created via portal',
                },
            ],
        };

        storage.createTicket(newTicket);
        router.push('/employee');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 bg-white p-8 shadow-sm rounded-lg border border-gray-200">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Issue Details</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Provide as much detail as possible to help us resolve your issue efficiently.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Subject / Title
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                                placeholder="Brief summary of the issue"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <div className="mt-1">
                            <select
                                id="type"
                                name="type"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                                value={type}
                                onChange={(e) => setType(e.target.value as TicketType)}
                            >
                                {TICKET_TYPES.map((t) => (
                                    <option key={t.type} value={t.type}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                                placeholder="Explain the issue, steps to reproduce, and any error messages..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                            <p className="text-sm text-blue-700">
                                Based on your role and this issue type, this ticket will be assigned{' '}
                                <span className="font-bold uppercase">{calculatedPriority}</span> priority.
                            </p>
                            <p className="mt-3 text-sm md:mt-0 md:ml-6">
                                <span className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                                    Target Resolution: {PRIORITY_SLA[calculatedPriority]}h
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                </div>
            </div>
        </form>
    );
}
