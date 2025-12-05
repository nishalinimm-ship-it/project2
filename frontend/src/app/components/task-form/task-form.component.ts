import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
   imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  taskForm!: FormGroup;
  loading = false;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(): void {
    // Format the dueDate properly for the date input
    let formattedDueDate = '';
    if (this.task?.dueDate) {
      const date = new Date(this.task.dueDate);
      formattedDueDate = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    }

    this.taskForm = this.fb.group({
      title: [this.task?.title || '', [Validators.required, Validators.maxLength(200)]],
      description: [this.task?.description || ''],
      priority: [this.task?.priority || 'Medium', Validators.required],
      status: [this.task?.status || 'Pending', Validators.required],
      dueDate: [formattedDueDate],
      assignedTo: [this.task?.assignedTo || '', Validators.required]
    });
  }

  loadUsers(): void {
    const token = localStorage.getItem('token');
    this.http.get<any>('http://localhost:3000/api/users', {
      headers: { 'Authorization': token || '' }
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data;
          // Auto-select first user if creating new task and no user assigned
          if (!this.task && this.users.length > 0 && !this.taskForm.value.assignedTo) {
            this.taskForm.patchValue({ assignedTo: this.users[0].id });
          }
        }
      },
      error: () => {
        // Fallback: use hardcoded users
        this.users = [
          { id: 1, name: 'Admin User', email: 'admin@example.com' },
          { id: 2, name: 'Regular User', email: 'user@example.com' }
        ];
        // Auto-select first user if creating new task
        if (!this.task && this.users.length > 0 && !this.taskForm.value.assignedTo) {
          this.taskForm.patchValue({ assignedTo: this.users[0].id });
        }
      }
    });
  }

  get f() {
    return this.taskForm.controls;
  }
  onSubmit(): void {
    if (this.taskForm.invalid) {
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.controls[key].markAsTouched();
      });
      alert('Please fill all required fields (Title and Assigned To)');
      return;
    }

    this.loading = true;
    
    // Format the data to match Task model (camelCase)
    const formData: Partial<Task> = {
      title: this.taskForm.value.title.trim(),
      description: this.taskForm.value.description?.trim() || '',
      priority: this.taskForm.value.priority,
      status: this.taskForm.value.status,
      dueDate: this.taskForm.value.dueDate ? 
        new Date(this.taskForm.value.dueDate).toISOString() : null,
      assignedTo: Number(this.taskForm.value.assignedTo)
    };

    console.log('Form data being sent:', formData);

    if (this.task?.id) {
      // Update existing task
      this.taskService.updateTask(this.task.id, formData).subscribe({
        next: () => {
          this.loading = false;
          alert('Task updated Successfully!');
          this.saved.emit();
        },
        error: (error) => {
          console.error('Error updating task:', error);
          console.error('Error details:', error.error);
          alert('Failed to update task: ' + (error.error?.message || 'Unknown error'));
          this.loading = false;
        }
      });
    } else {
      // Create new task
      this.taskService.createTask(formData).subscribe({
        next: () => {
          this.loading = false;
          alert('Task created Successfully!');
          this.saved.emit();
        },
        error: (error) => {
          console.error('Error creating task:', error);
          console.error('Error details:', error.error);
          alert('Failed to create task: ' + (error.error?.message || 'Unknown error'));
          this.loading = false;
        }
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}