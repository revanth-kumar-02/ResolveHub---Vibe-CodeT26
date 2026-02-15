import React from 'react';
import { NewTicketForm } from '@/components/dashboard/NewTicketForm';

export default function NewTicketPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Raise a New Ticket</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Submit a new support request. Our team will review and assign it to a technician based on priority.
                </p>
            </div>
            <NewTicketForm />
        </div>
    );
}
