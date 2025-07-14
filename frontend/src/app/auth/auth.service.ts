import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router'; // <-- Needed for navigation

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ✅ Called once on app startup via APP_INITIALIZER
  initAuth(): Promise<void> {
    return new Promise((resolve) => {
      const tokenExists = this.hasToken();
      this.loggedInSubject.next(tokenExists); // sync observable state
      resolve();
    });
  }

  private hasToken(): boolean {
    return (
      typeof window !== 'undefined' && !!localStorage.getItem(this.tokenKey)
    );
  }

  API_BASE_URL = 'https://carwashwaterbilltracking.onrender.com';

  login(username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .post<{ token: string }>(`${this.API_BASE_URL}/api/auth/login`, {
          username,
          password,
        })
        .subscribe({
          next: (res) => {
            if (typeof window !== 'undefined') {
              localStorage.setItem(this.tokenKey, res.token);
              this.loggedInSubject.next(true);
            }
            resolve();
          },
          error: (err) => reject(err),
        });
    });
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      this.loggedInSubject.next(false);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isLoggedIn(): boolean {
    // ✅ Always read fresh from localStorage (important for AuthGuard)
    return (
      typeof window !== 'undefined' && !!localStorage.getItem(this.tokenKey)
    );
  }
}
