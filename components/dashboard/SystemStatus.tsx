'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Activity, Server, Shield } from 'lucide-react';

export function SystemStatus() {
    // In a real app, this would be fetched from an API
    const systems = [
        { name: 'Core API', status: 'operational', icon: Server },
        { name: 'Database', status: 'operational', icon: Activity },
        { name: 'Auth Service', status: 'degraded', icon: Shield },
        { name: 'Email Gateway', status: 'operational', icon: CheckCircle },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational': return 'text-green-500 bg-green-50';
            case 'degraded': return 'text-yellow-500 bg-yellow-50';
            case 'critical': return 'text-red-500 bg-red-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    const statusLabel = (status: string) => {
        switch (status) {
            case 'operational': return 'Operational';
            case 'degraded': return 'Degraded Performance';
            case 'critical': return 'Critical Outage';
            default: return 'Unknown';
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-500" />
                System Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {systems.map((sys) => {
                    const Icon = sys.icon;
                    const colorClass = getStatusColor(sys.status);
                    return (
                        <div key={sys.name} className={`flex items-center justify-between p-3 rounded-lg border border-gray-100 ${colorClass}`}>
                            <div className="flex items-center gap-3">
                                <Icon className="h-5 w-5 opacity-80" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{sys.name}</p>
                                    <p className="text-xs opacity-80 capitalize">{statusLabel(sys.status)}</p>
                                </div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-current" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
