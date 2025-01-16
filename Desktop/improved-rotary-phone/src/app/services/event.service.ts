import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service'; // Importa il servizio di storage

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiURL = 'http://localhost:8080/events';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  getEvents(): Observable<any> {
    const token = this.storageService.getToken();

    if (!token) {
      throw new Error('No token found!');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiURL, { headers });
  }
}
