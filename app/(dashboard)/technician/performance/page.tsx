'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { storage } from '@/lib/storage';
import { Ticket } from '@/lib/types';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { Activity, Award, Clock, CheckCircle } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function PerformancePage() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setTickets(storage.getTickets());
            setLoading(false);
        }
    }, [user]);

    if (loading) return <div className="p-8">Loading metrics...</div>;
    if (!user) return null;

    // Filter tickets relevant to this technician
    const myResolved = tickets.filter(t => (t.status === 'resolved' || t.status === 'closed') && t.assignedTo === user.id);
    const myTotal = tickets.filter(t => t.assignedTo === user.id);

    // 1. Avg Resolution Time (Simulated)
    const avgResolutionHours = 4.2;

    // 2. SLA Compliance Rate
    const breached = myTotal.filter(t => new Date(t.slaDeadline) < new Date());
    const complianceRate = myTotal.length > 0 ? ((myTotal.length - breached.length) / myTotal.length) * 100 : 100;

    // 3. Resolution Trend (Last 7 Days)
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        // Randomize simulation
        trendData.push({
            date: dateStr,
            resolved: Math.floor(Math.random() * 8)
        });
    }

    // 4. Ticket Types Resolved
    const typeCounts = myResolved.reduce((acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.keys(typeCounts).map(type => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: typeCounts[type]
    }));

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Performance Metrics</h1>
                <p className="mt-1 text-sm text-gray-500">Track your efficiency and impact.</p>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden rounded-lg shadow border border-gray-200 p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Award className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Performance Score</dt>
                                <dd className="text-2xl font-semibold text-gray-900">92/100</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden rounded-lg shadow border border-gray-200 p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Resolved</dt>
                                <dd className="text-2xl font-semibold text-gray-900">{myResolved.length}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden rounded-lg shadow border border-gray-200 p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Clock className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Avg Resolution</dt>
                                <dd className="text-2xl font-semibold text-gray-900">{avgResolutionHours} hrs</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden rounded-lg shadow border border-gray-200 p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Activity className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">SLA Compliance</dt>
                                <dd className="text-2xl font-semibold text-gray-900">{complianceRate.toFixed(1)}%</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Resolution Trend */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Resolution Trend (7 Days)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="resolved" stroke="#6366f1" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Issue Types Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Expertise Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
