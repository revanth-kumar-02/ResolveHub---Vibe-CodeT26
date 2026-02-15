import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        positive: boolean;
    };
    color?: string; // Tailwind color class for icon background
}

export function StatsCard({ title, value, icon: Icon, trend, color = 'bg-blue-500' }: StatsCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
                </div>
                <div className={`rounded-full p-3 ${color} bg-opacity-10`}>
                    <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={trend.positive ? 'text-green-600' : 'text-red-600'}>
                        {trend.value}
                    </span>
                    <span className="ml-2 text-gray-400">vs last month</span>
                </div>
            )}
        </div>
    );
}
