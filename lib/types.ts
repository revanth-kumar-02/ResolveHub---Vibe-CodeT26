export type Role = 'employee' | 'technician' | 'admin' | 'manager';

export type Department = 'Engineering' | 'HR' | 'Finance' | 'Sales' | 'Marketing' | 'Operations' | 'Legal' | 'IT';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: Department;
  avatar: string; // URL or placeholder
  password?: string;
};

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type TicketStatus = 'open' | 'in-progress' | 'waiting-for-user' | 'escalated' | 'resolved' | 'closed';

export type TicketType = 'hardware' | 'software' | 'network' | 'security' | 'access' | 'other';

export type TicketHistory = {
  id: string;
  action: string;
  timestamp: string;
  actorId: string;
  details?: string;
};

export type Ticket = {
  id: string;
  title: string;
  description: string;
  type: TicketType;
  priority: Priority;
  status: TicketStatus;
  createdBy: string; // User ID
  assignedTo?: string; // Technician ID
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  slaDeadline: string; // ISO string
  history: TicketHistory[];
  department?: Department; // Originating department
};

export const PRIORITY_SLA: Record<Priority, number> = {
  low: 48,      // hours
  medium: 24,   // hours
  high: 8,      // hours
  critical: 2,  // hours
};
