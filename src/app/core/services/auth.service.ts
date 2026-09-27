import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check if there's a fake token in localStorage on init (only in browser)
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('tria_mock_token');
      if (token) {
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  login(pin: string): boolean {
    // Mock login logic: accept '1234' or any 4 digit pin as valid for demo
    if (pin && pin.length >= 4) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('tria_mock_token', 'mock_token_123');
      }
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('tria_mock_token');
    }
    this.isAuthenticatedSubject.next(false);
  }
}
