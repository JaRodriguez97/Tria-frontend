import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: string;
  permissions: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('tria_user');
      if (stored) {
        try {
          this.currentUserSubject.next(JSON.parse(stored));
          this.isAuthenticatedSubject.next(true);
        } catch {
          localStorage.removeItem('tria_user');
        }
        // Solo validamos la sesión contra el servidor si hay indicios de login previo
        this.checkSession();
      }
    }
  }

  checkSession(): void {
    this.api.get<{ data: { user: UserProfile } }>('/auth/me').subscribe({
      next: (res) => {
        if (res?.data?.user) {
          this.currentUserSubject.next(res.data.user);
          this.isAuthenticatedSubject.next(true);
          if (typeof window !== 'undefined') {
            localStorage.setItem('tria_user', JSON.stringify(res.data.user));
          }
        }
      },
      error: () => {},
    });
  }

  login(email: string, password?: string): Observable<boolean> {
    const pwd = password || email;

    return this.api
      .post<{ data: { user: UserProfile; token: string } }>('/auth/login', {
        email,
        password: pwd,
      })
      .pipe(
        tap((res) => {
          if (res?.data?.user) {
            this.currentUserSubject.next(res.data.user);
            this.isAuthenticatedSubject.next(true);
            if (typeof window !== 'undefined') {
              localStorage.setItem('tria_user', JSON.stringify(res.data.user));
            }
          }
        }),
        map(() => true),
        catchError(() => {
          return of(false);
        }),
      );
  }

  logout(): void {
    this.api.post('/auth/logout', {}).subscribe({
      next: () => {},
      error: () => {},
    });
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('tria_user');
    }
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
}
