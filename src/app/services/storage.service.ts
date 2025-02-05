import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(
    private localStorage: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getToken(): string | null {
    return this.isBrowser() ? this.localStorage.retrieve('access_token') : null;
  }

  setToken(token: string): void {
    if (this.isBrowser()) {
      this.localStorage.store('access_token', token);
    }
  }

  clearToken(): void {
    if (this.isBrowser()) {
      this.localStorage.clear('access_token');
    }
  }
}
