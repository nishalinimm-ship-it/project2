import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router , RouterModule} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule ,RouterModule],
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
    //load task to calculate
    this.taskService.getTasks().subscribe();
  }
 // ---------- Navigation ----------
  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }
  logout(): void {
    if (confirm('Are you sure you want to logout?')){
    this.authService.logout();
    this.router.navigate(['/login'], {replaceUrl:true});
  }
}

 // ✅ REQUIRED BY TEMPLATE
  recentTasks(): Task[] {
    const allTasks = this.taskService.tasks() || [];
    return allTasks.slice(-5).reverse(); // last 5 recent tasks
  }

  // ✅ REQUIRED BY TEMPLATE
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium':return 'priority-medium';
      case 'Low':return 'priority-low';
      default:return '';
    }
  }

  // ✅ REQUIRED BY TEMPLATE
  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':return 'status-completed';
      case 'In Progress':return 'status-in-progress';
      case 'Pending':return 'status-pending';
      default:return '';
    }
  }
}


//   openAddTask(): void {
//     const modal = document.getElementById('addTaskModal');
//     if (modal) modal.style.display = 'block';
//   }
// }
 // Helper method for priority badge styling
