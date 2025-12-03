import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  showForm = signal<boolean>(false);
  editingTask = signal<Task | null>(null);
  searchQuery = signal<string>('');
  filterStatus = signal<string>('All');
  filterPriority = signal<string>('All');

  constructor(
    public authService: AuthService,
    public taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe();
  }

  get filteredTasks(): Task[] {
    let tasks = this.taskService.tasks();

    if (this.searchQuery()) {
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(this.searchQuery().toLowerCase())
      );
    }

    if (this.filterStatus() !== 'All') {
      tasks = tasks.filter(task => task.status === this.filterStatus());
    }

    if (this.filterPriority() !== 'All') {
      tasks = tasks.filter(task => task.priority === this.filterPriority());
    }

    return tasks;
  }

  openAddForm(): void {
    this.editingTask.set(null);
    this.showForm.set(true);
  }

  openEditForm(task: Task): void {
    this.editingTask.set(task);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingTask.set(null);
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          alert('Task deleted successfully!');
        },
        error: (error) => {
          alert('Failed to delete task: ' + error.error?.message);
        }
      });
    }
  }

  updateStatus(id: number, status: string): void {
    this.taskService.updateTaskStatus(id, status).subscribe({
      error: (error) => {
        alert('Failed to update status: ' + error.error?.message);
      }
    });
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}