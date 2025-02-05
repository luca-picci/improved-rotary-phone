import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Venue } from '../models/venue.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  private apiURL = 'http://localhost:8080/venues';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  getVenues(): Observable<Venue[]> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Venue[]>(this.apiURL, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getVenueById(id: number): Observable<Venue | null> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Venue>(`${this.apiURL}/${id}`, { headers }).pipe(
      catchError(this.handleError),
      map(venue => venue ? venue : null) // Gestisci undefined
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Venue Service Error:', error);
    let errorMessage = 'An error occurred while fetching venues.';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}