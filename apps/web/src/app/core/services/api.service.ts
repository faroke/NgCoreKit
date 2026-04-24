import { HttpClient } from '@angular/common/http';
import { InjectionToken, Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:3001/api',
});

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = inject(API_URL);

  get<T>(path: string) {
    return firstValueFrom(this.http.get<T>(`${this.baseUrl}${path}`));
  }

  post<T>(path: string, body: unknown) {
    return firstValueFrom(this.http.post<T>(`${this.baseUrl}${path}`, body));
  }

  patch<T>(path: string, body: unknown) {
    return firstValueFrom(this.http.patch<T>(`${this.baseUrl}${path}`, body));
  }

  delete<T>(path: string) {
    return firstValueFrom(this.http.delete<T>(`${this.baseUrl}${path}`));
  }

  deleteWithBody<T>(path: string, body: unknown) {
    return firstValueFrom(this.http.delete<T>(`${this.baseUrl}${path}`, { body }));
  }
}
