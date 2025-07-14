import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // <-- Import environment

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return (
      typeof window !== 'undefined' && !!localStorage.getItem(this.tokenKey)
    );
  }

  // ✅ Called once on app startup via APP_INITIALIZER
  initAuth(): Promise<void> {
    return new Promise((resolve) => {
      const tokenExists = this.hasToken();
      this.loggedInSubject.next(tokenExists);
      resolve();
    });
  }

  login(username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .post<{ token: string }>(`${environment.apiUrl}/auth/login`, {
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
    return (
      typeof window !== 'undefined' && !!localStorage.getItem(this.tokenKey)
    );
  }
}
