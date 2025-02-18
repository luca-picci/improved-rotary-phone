import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Event } from '../models/event.model';
import { Venue } from '../models/venue.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventsApiURL = 'http://localhost:8080/events'; // URL dell'API per gli eventi
  private venuesApiURL = 'http://localhost:8080/venues'; // URL dell'API per i luoghi

  constructor(private http: HttpClient, private storageService: StorageService) { }

  /**
   * Recupera gli eventi con i relativi luoghi.
   * @param type (opzionale) Tipologia di evento per filtrare i risultati.
   * @returns Observable<Event[]>
   */
  getEventsWithVenues(type: string = ''): Observable<Event[]> {
    const token = this.storageService.getToken(); // Recupera il token JWT dallo storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let params = new HttpParams(); // Parametri di ricerca per l'URL
    if (type) {
      params = params.set('type', type);
    }

    const events$ = this.http.get<Event[]>(this.eventsApiURL, { headers, params }); // Richiesta GET per gli eventi
    const venues$ = this.http.get<Venue[]>(this.venuesApiURL, { headers }); // Richiesta GET per i luoghi

    return forkJoin([events$, venues$]).pipe( // Esegue le due richieste in parallelo
      map(([events, venues]) => {
        return events.map((event) => ({ // Mappa gli eventi con i relativi luoghi
          ...event,
          venue: venues.find((venue) => venue.id === event.venueId) || { // Trova il luogo corrispondente
            id: 0,
            name: 'Non specificato',
            address: 'Non specificato',
            description: '',
          },
          capacity: event.capacity || 0, // Gestione di capacity null
          bookedSeats: event.bookedSeats || 0, // Gestione di bookedSeats null
          type: event.type || '' // Gestione di type null
        }));
      }),
      catchError(this.handleError) // Gestione degli errori
    );
  }

  /**
   * Crea un nuovo evento.
   * @param event Dati dell'evento da creare.
   * @returns Observable<Event>
   */
  createEvent(event: Event): Observable<Event> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });

    const eventData = { // Dati da inviare al backend
      title: event.title,
      description: event.description,
      date: event.date,
      venueId: event.venueId ?? event.venue?.id ?? null,
      type: event.type,
      capacity: event.capacity,
      bookedSeats: event.bookedSeats
    };

    return this.http.post<Event>(this.eventsApiURL, eventData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Aggiorna un evento esistente.
   * @param event Dati dell'evento da aggiornare.
   * @returns Observable<Event>
   */
  updateEvent(event: Event): Observable<Event> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });

    const eventData = {
      title: event.title,
      description: event.description,
      date: event.date,
      venueId: event.venueId ?? event.venue?.id ?? null, // 🛠️ Usa venueId
      type: event.type,
      capacity: event.capacity,
      bookedSeats: event.bookedSeats
    };

    return this.http.put<Event>(`${this.eventsApiURL}/${event.id}`, eventData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }


  /**
   * Elimina un evento.
   * @param eventId Identificativo dell'evento da eliminare.
   * @returns Observable<void>
   */
  deleteEvent(eventId: number): Observable<void> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.eventsApiURL}/${eventId}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Gestisce gli errori delle richieste HTTP.
   * @param error Errore di tipo HttpErrorResponse.
   * @returns Observable<never>
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message); // Errore lato client
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error // Errore lato server
      );
      if (error.error && error.error.message) {
        console.error('Backend message:', error.error.message);
        return throwError(() => new Error(error.error.message)); // Restituisce il messaggio del backend
      }
    }
    return throwError(() => new Error('Something bad happened; please try again later.')); // Errore generico
  }
}
