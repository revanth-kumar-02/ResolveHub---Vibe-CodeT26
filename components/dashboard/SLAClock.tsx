'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SLAClockProps {
    deadline: string;
    status: string;
}

export function SLAClock({ deadline, status }: SLAClockProps) {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isBreached, setIsBreached] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            if (status === 'resolved' || status === 'closed') {
                setTimeLeft('Stopped');
                return;
            }

            const end = new Date(deadline).getTime();
            const now = new Date().getTime();
            const diff = end - now;

            if (diff <= 0) {
                setIsBreached(true);
                setTimeLeft('BREACHED');
            } else {
                setIsBreached(false);
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours}h ${minutes}m`);
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [deadline, status]);

    if (status === 'resolved' || status === 'closed') {
        return (
            <div className="flex items-center text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                SLA Met
            </div>
        );
    }

    return (
        <div className={cn(
            "flex items-center px-3 py-1 rounded-full text-xs font-bold transition-colors animate-pulse",
            isBreached
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
        )}>
            {isBreached ? (
                <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
            ) : (
                <Clock className="mr-1.5 h-3.5 w-3.5" />
            )}
            {isBreached ? 'SLA BREACHED' : `${timeLeft} remaining`}
        </div>
    );
}
