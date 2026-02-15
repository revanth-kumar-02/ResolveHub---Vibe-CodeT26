'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, Department } from './types';
import { storage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (user: User) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateProfile: (updates: Partial<User>) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('it-portal-user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            // Step 1: Try Supabase first
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', email)
                .eq('password', password)
                .single();

            if (data && !error) {
                const foundUser: User = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    role: data.role as Role,
                    department: data.department as Department,
                    avatar: data.avatar,
                    password: data.password,
                };
                setUser(foundUser);
                localStorage.setItem('it-portal-user', JSON.stringify(foundUser));
                return true;
            }

            // If Supabase returned a table-not-found or other error, log it quietly
            if (error && error.code !== 'PGRST116') {
                // PGRST116 = "no rows returned" (normal), anything else is a real issue
                console.warn('Supabase login lookup failed, falling back to local data:', error.message);
            }

            // Step 2: Fallback to local mock data (for pre-seeded demo users)
            const users = storage.getUsers();
            const localUser = users.find(u => u.email === email && u.password === password);
            if (localUser) {
                setUser(localUser);
                localStorage.setItem('it-portal-user', JSON.stringify(localUser));
                return true;
            }

            return false;
        } catch (err) {
            console.warn('Login: Supabase unreachable, using local data.');
            // Fallback to local on network error
            const users = storage.getUsers();
            const localUser = users.find(u => u.email === email && u.password === password);
            if (localUser) {
                setUser(localUser);
                localStorage.setItem('it-portal-user', JSON.stringify(localUser));
                return true;
            }
            return false;
        }
    };

    const signup = async (newUser: User): Promise<{ success: boolean; error?: string }> => {
        let supabaseAvailable = false;

        try {
            // Check if email already exists in Supabase
            const { data: existing, error: checkError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', newUser.email)
                .single();

            // If the table doesn't exist (404/PGRST205), skip Supabase entirely
            if (checkError && (checkError.code === 'PGRST205' || checkError.code === '42P01')) {
                console.warn('Supabase profiles table not found. Falling back to local storage.');
                supabaseAvailable = false;
            } else {
                supabaseAvailable = true;
                if (existing) {
                    return { success: false, error: 'Email already registered' };
                }
            }
        } catch {
            console.warn('Supabase unreachable during signup check.');
            supabaseAvailable = false;
        }

        if (supabaseAvailable) {
            try {
                // Insert into Supabase
                const { error } = await supabase
                    .from('profiles')
                    .insert({
                        id: newUser.id,
                        email: newUser.email,
                        name: newUser.name,
                        role: newUser.role,
                        department: newUser.department,
                        avatar: newUser.avatar,
                        password: newUser.password,
                    })
                    .select()
                    .single();

                if (error) {
                    console.error('Supabase signup insert error:', error);
                    // Fall through to local save
                }
            } catch (err) {
                console.warn('Supabase insert failed, saving locally:', err);
            }
        }

        // Also check local storage for duplicate emails
        const users = storage.getUsers();
        if (users.find(u => u.email === newUser.email)) {
            return { success: false, error: 'Email already registered' };
        }

        // Save locally for immediate use
        storage.saveUser(newUser);
        setUser(newUser);
        localStorage.setItem('it-portal-user', JSON.stringify(newUser));
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('it-portal-user');
    };

    const updateProfile = (updates: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('it-portal-user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
