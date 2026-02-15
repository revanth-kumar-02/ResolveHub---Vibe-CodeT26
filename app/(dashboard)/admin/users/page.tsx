'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { storage } from '@/lib/storage';
import { User } from '@/lib/types';
import { UserTable } from '@/components/dashboard/UserTable';

export default function AdminUsersPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setUsers(storage.getUsers());
            setLoading(false);
        }
    }, [user]);

    if (loading) return <div className="p-8">Loading users...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="mt-1 text-sm text-gray-500">View and manage system users.</p>
            </div>
            <UserTable users={users} />
        </div>
    );
}
