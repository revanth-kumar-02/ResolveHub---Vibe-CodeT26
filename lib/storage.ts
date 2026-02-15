'use client';

import { Ticket, User } from './types';
import { TICKETS, USERS } from './mockData';

const STORAGE_KEYS = {
    TICKETS: 'it-portal-tickets',
    USERS: 'it-portal-users',
};

export const storage = {
    getTickets: (): Ticket[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEYS.TICKETS);
        if (!stored) {
            localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(TICKETS));
            return TICKETS;
        }
        return JSON.parse(stored);
    },

    getTicket: (id: string): Ticket | undefined => {
        const tickets = storage.getTickets();
        return tickets.find((t) => t.id === id);
    },

    createTicket: (ticket: Ticket): void => {
        const tickets = storage.getTickets();
        tickets.unshift(ticket);
        localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    },

    updateTicket: (updatedTicket: Ticket): void => {
        const tickets = storage.getTickets();
        const index = tickets.findIndex((t) => t.id === updatedTicket.id);
        if (index !== -1) {
            tickets[index] = updatedTicket;
            localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
        }
    },

    getUsers: (): User[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEYS.USERS);
        if (!stored) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(USERS));
            return USERS;
        }
        return JSON.parse(stored);
    },

    saveUser: (user: User): void => {
        const users = storage.getUsers();
        users.push(user);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    },
};
