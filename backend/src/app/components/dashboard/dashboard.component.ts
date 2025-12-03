import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }
}