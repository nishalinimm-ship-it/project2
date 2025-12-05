import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private platformId = inject(PLATFORM_ID);

  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.restoreSession();
  }

  /** LOGIN */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data.token, response.data.user);
            this.router.navigate(['/dashboard'], { replaceUrl: true });
          }
        })
      );
  }

  /** SAFE LOCAL STORAGE CHECK */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private setSession(token: string, user: User): void {
    if (!this.isBrowser()) return;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  private restoreSession(): void {
    if (!this.isBrowser()) return;

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch {
        this.logout();
      }
    }
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    this.currentUser.set(null);
    this.isAuthenticated.set(false);

    this.router.navigate(['/login'], { replaceUrl: true }); // CHANGED
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('token');
  }
  // <-- NEW exported helper for guards/components
  isLoggedIn(): boolean {
    // read current value of the signal (synchronous)
    return this.isAuthenticated();
  }
}
