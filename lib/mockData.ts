import { User, Ticket, Role, Department, Priority, TicketStatus, TicketType, TicketHistory, PRIORITY_SLA } from './types';

const DEPARTMENTS: Department[] = ['Engineering', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations', 'Legal', 'IT'];
const ROLES: Role[] = ['employee', 'manager', 'admin', 'technician'];
const TICKET_TYPES: TicketType[] = ['hardware', 'software', 'network', 'security', 'access', 'other'];
const STATUSES: TicketStatus[] = ['open', 'in-progress', 'waiting-for-user', 'escalated', 'resolved', 'closed'];

// Helper to generate random dates within last 30 days
const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate Users
export const generateUsers = (count: number = 30): User[] => {
    const users: User[] = [];

    // Specific Admin User
    users.push({
        id: 'u-admin-1',
        name: 'Pratheep (Admin)',
        email: 'imposterz.pratheep06@gmail.com',
        role: 'admin',
        department: 'IT',
        avatar: 'PA',
        password: 'pratheep_imposterz',
    });

    // Specific Admin User 2
    users.push({
        id: 'u-admin-2',
        name: 'Revanth (Admin)',
        email: 'revanthp0201@gmail.com',
        role: 'admin',
        department: 'IT',
        avatar: 'RA',
        password: 'revanth(p)',
    });

    // Specific Technician User
    users.push({
        id: 'u-tech-1',
        name: 'Suji (Technician)',
        email: 'imposterz.suji07@gmail.com',
        role: 'technician',
        department: 'IT',
        avatar: 'ST',
        password: 'suji_imposterz',
    });

    // Specific Employee User
    users.push({
        id: 'u-emp-1',
        name: 'Rev (Employee)',
        email: 'imposterz.rev006@gmail.com',
        role: 'employee',
        department: 'Sales',
        avatar: 'RE',
        password: 'rev_imposterz',
    });

    for (let i = 0; i < count; i++) {
        const role = i < 5 ? 'technician' : (i < 8 ? 'manager' : 'employee');
        const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
        const firstName = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth'][Math.floor(Math.random() * 10)];
        const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'][Math.floor(Math.random() * 10)];

        users.push({
            id: `u-${i + 1}`,
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@enterprise.com`,
            role,
            department: dept,
            avatar: `${firstName[0]}${lastName[0]}`,
            password: 'password123', // Default for generated users
        });
    }
    return users;
};

export const USERS = generateUsers(30);

// Generate Tickets
export const generateTickets = (users: User[], count: number = 50): Ticket[] => {
    const tickets: Ticket[] = [];
    const technicians = users.filter(u => u.role === 'technician');

    for (let i = 0; i < count; i++) {
        const creator = users[Math.floor(Math.random() * users.length)];
        const type = TICKET_TYPES[Math.floor(Math.random() * TICKET_TYPES.length)];
        const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
        const priority = (['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)]) as Priority;

        const createdDate = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
        const slaHours = PRIORITY_SLA[priority];
        const slaDeadline = new Date(createdDate.getTime() + slaHours * 60 * 60 * 1000).toISOString();

        const assignedTo = (status !== 'open' && technicians.length > 0)
            ? technicians[Math.floor(Math.random() * technicians.length)].id
            : undefined;

        tickets.push({
            id: `TKT-${1000 + i}`,
            title: `${type.charAt(0).toUpperCase() + type.slice(1)} Issue: ${['Slow Performance', 'Login Failed', 'Hardware Broken', 'Access Denied', 'VPN Down', 'Email Sync Error'][Math.floor(Math.random() * 6)]}`,
            description: 'System is not behaving as expected. Please investigate ASAP. Steps to reproduce: 1. Login. 2. Click button. 3. Crash.',
            type,
            priority,
            status,
            createdBy: creator.id,
            assignedTo,
            createdAt: createdDate.toISOString(),
            updatedAt: createdDate.toISOString(), // simplified
            slaDeadline,
            history: [],
            department: creator.department,
        });
    }
    return tickets;
};

export const TICKETS = generateTickets(USERS, 50);
