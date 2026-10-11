import { Injectable, inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private transferState = inject(TransferState);
  private baseUrl = this.isBrowser ? environment.apiUrl : 'http://localhost:3000/api';

  private router = inject(Router);

  private defaultOptions = {
    withCredentials: true,
  };

  private isRedirectingToLogin = false;

  private clearClientSession(): void {
    if (this.isBrowser) {
      try {
        localStorage.removeItem('tria_user');
        sessionStorage.clear();
      } catch {}
    }
  }

  private handleError(error: HttpErrorResponse, endpoint?: string) {
    if (error.status === 401) {
      if (this.isBrowser) {
        // Eliminar inmediatamente todo lo referente a la sesión del navegador
        this.clearClientSession();

        const currentUrl = this.router.url;
        const isOnLoginPage = currentUrl.includes('/login');
        const isAuthEndpoint =
          endpoint?.includes('/auth/login') || endpoint?.includes('/auth/me');

        // Solo alertar y redirigir si no estamos ya en el login, no es petición de auth y no hay redirección en curso
        if (!isOnLoginPage && !isAuthEndpoint && !this.isRedirectingToLogin) {
          this.isRedirectingToLogin = true;
          alert('Sesión requerida o expirada. Por favor, inicia sesión de nuevo.');
          this.router.navigate(['/login']).finally(() => {
            setTimeout(() => {
              this.isRedirectingToLogin = false;
            }, 1000);
          });
        }
      } else {
        // En SSR (Server-Side Rendering) no tenemos las cookies, así que ignoramos el 401
        // y dejamos que el navegador haga la petición real.
        return of(null as any);
      }
    }
    return throwError(() => error);
  }

  get<T>(endpoint: string, params?: Record<string, string>): Observable<T> {
    // Para evitar peticiones 401 inútiles en SSR, deshabilitamos las peticiones API en el servidor.
    // Solo el navegador con cookies activas debe hacer consultas a rutas protegidas.
    if (!this.isBrowser) {
      return of(null as any);
    }

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    // Crear una llave única para el caché basada en el endpoint
    const key = makeStateKey<T>(`api-get-${endpoint}`);

    // Si estamos en el navegador y el servidor dejó la respuesta en el estado, úsala y no hagas petición
    if (this.transferState.hasKey(key)) {
      const cachedData = this.transferState.get(key, null);
      this.transferState.remove(key); // limpiar memoria
      if (cachedData !== null) {
        return of(cachedData as T);
      }
    }

    return this.http
      .get<T>(url, {
        ...this.defaultOptions,
        params,
      })
      .pipe(catchError((err) => this.handleError(err, endpoint)));
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    return this.http
      .post<T>(url, body, this.defaultOptions)
      .pipe(catchError((err) => this.handleError(err, endpoint)));
  }

  put<T>(endpoint: string, body: unknown, headers?: HttpHeaders): Observable<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    return this.http
      .put<T>(url, body, {
        ...this.defaultOptions,
        headers,
      })
      .pipe(catchError((err) => this.handleError(err, endpoint)));
  }

  patch<T>(endpoint: string, body: unknown): Observable<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    return this.http
      .patch<T>(url, body, this.defaultOptions)
      .pipe(catchError((err) => this.handleError(err, endpoint)));
  }

  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    return this.http
      .delete<T>(url, this.defaultOptions)
      .pipe(catchError((err) => this.handleError(err, endpoint)));
  }
}
