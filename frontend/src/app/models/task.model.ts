import { User } from './user.model';

export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate?: string | null;
  assignedTo?: number;
    assignedUser?: {
    id: number;
    name: string;
    email: string;
  };
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface TaskResponse {
  success: boolean;
  data: Task | Task[];
  message?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}