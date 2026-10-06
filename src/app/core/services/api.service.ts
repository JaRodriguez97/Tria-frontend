import { Injectable, inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private transferState = inject(TransferState);
  private baseUrl = this.isBrowser ? environment.apiUrl : 'http://localhost:3000/api';

  private defaultOptions = {
    withCredentials: true,
  };

  get<T>(endpoint: string, params?: Record<string, string>): Observable<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    // Crear una llave única para el caché basada en el endpoint
    const key = makeStateKey<T>(`api-get-${endpoint}`);

    // Si estamos en el navegador y el servidor dejó la respuesta en el estado, úsala y no hagas petición
    if (this.isBrowser && this.transferState.hasKey(key)) {
      const cachedData = this.transferState.get(key, null);
      this.transferState.remove(key); // limpiar memoria
      if (cachedData !== null) {
        return of(cachedData as T);
      }
    }

    return this.http.get<T>(url, {
      ...this.defaultOptions,
      params,
    }).pipe(
      tap((data) => {
        // Si estamos en el servidor, guardamos la respuesta en el estado para el navegador
        if (!this.isBrowser) {
          this.transferState.set(key, data);
        }
      })
    );
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    return this.http.post<T>(url, body, this.defaultOptions);
  }

  put<T>(endpoint: string, body: unknown, headers?: HttpHeaders): Observable<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    return this.http.put<T>(url, body, {
      ...this.defaultOptions,
      headers,
    });
  }

  patch<T>(endpoint: string, body: unknown): Observable<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    return this.http.patch<T>(url, body, this.defaultOptions);
  }

  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    return this.http.delete<T>(url, this.defaultOptions);
  }
}
