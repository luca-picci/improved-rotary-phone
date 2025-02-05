import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Event } from '../models/event.model';
import { Venue } from '../models/venue.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventsApiURL = 'http://localhost:8080/events';
  private venuesApiURL = 'http://localhost:8080/venues';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  getEventsWithVenues(): Observable<Event[]> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const events$ = this.http.get<Event[]>(this.eventsApiURL, { headers });
    const venues$ = this.http.get<Venue[]>(this.venuesApiURL, { headers });

    return forkJoin([events$, venues$]).pipe(
      map(([events, venues]) => {
        return events.map((event) => ({
          ...event,
          venue: venues.find((venue) => venue.id === event.venueId) || {
            id: 0,
            name: 'Non specificato',
            address: 'Non specificato',
            description: '',
          },
        }));
      }),
      catchError(this.handleError)
    );
  }

  createEvent(event: Event): Observable<Event> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });

    const eventData = {
      title: event.title,
      description: event.description,
      date: event.date,
      venue: event.venue && event.venue.id ? { id: event.venue.id } : null
    };

    return this.http.post<Event>(this.eventsApiURL, eventData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateEvent(event: Event): Observable<Event> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });

    const eventData = {
      title: event.title,
      description: event.description,
      date: event.date,
      venue: event.venue && event.venue.id ? { id: event.venue.id } : null
    };

    return this.http.put<Event>(`${this.eventsApiURL}/${event.id}`, eventData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteEvent(eventId: number): Observable<void> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.eventsApiURL}/${eventId}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error
      );
      if (error.error && error.error.message) {
        console.error('Backend message:', error.error.message);
        return throwError(() => new Error(error.error.message)); // Usa il messaggio del backend
      }
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}