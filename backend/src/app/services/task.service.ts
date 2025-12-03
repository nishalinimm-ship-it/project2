import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task, TaskResponse, TaskStats } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;
  tasks = signal<Task[]>([]);
  stats = signal<TaskStats>({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getTasks(): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        tap(response => {
          if (response.success && Array.isArray(response.data)) {
            this.tasks.set(response.data);
            this.calculateStats(response.data);
          }
        })
      );
  }

  getTask(id: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // FIXED: Changed from Task to Partial<Task>
  createTask(task: Partial<Task>): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.apiUrl, task, { headers: this.getHeaders() })
      .pipe(tap(() => this.getTasks().subscribe()));
  }

  updateTask(id: number, task: Partial<Task>): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/${id}`, task, { headers: this.getHeaders() })
      .pipe(tap(() => this.getTasks().subscribe()));
  }

  updateTaskStatus(id: number, status: string): Observable<TaskResponse> {
    return this.http.patch<TaskResponse>(`${this.apiUrl}/${id}/status`, { status }, { headers: this.getHeaders() })
      .pipe(tap(() => this.getTasks().subscribe()));
  }

  deleteTask(id: number): Observable<TaskResponse> {
    return this.http.delete<TaskResponse>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(tap(() => this.getTasks().subscribe()));
  }

  private calculateStats(tasks: Task[]): void {
    const stats: TaskStats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      completed: tasks.filter(t => t.status === 'Completed').length
    };
    this.stats.set(stats);
  }
}