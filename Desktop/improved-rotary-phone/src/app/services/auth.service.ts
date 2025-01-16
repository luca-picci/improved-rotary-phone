import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiURL = 'http://localhost:8080/auth';

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiURL}/login`, credentials).pipe(
      tap((response: any) => {
        if (response?.token) {
          this.localStorage.store('access_token', response.token);
        }
      })
    );
  }

  logout(): void {
    this.localStorage.clear('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.localStorage.retrieve('access_token');
  }

  getToken(): string | null {
    return this.localStorage.retrieve('access_token');
  }
}
