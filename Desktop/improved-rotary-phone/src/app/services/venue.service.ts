import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venue } from '../models/venue.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  private apiURL = 'http://localhost:8080/venues';

  constructor(private http: HttpClient, private storageService: StorageService) {}

  getVenues(): Observable<Venue[]> {
    const token = this.storageService.getToken();

    if (!token) {
      throw new Error('No token found!');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Venue[]>(this.apiURL, { headers });
  }
}
