import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = "http://localhost:8080/events";

  constructor(private http: HttpClient, private authService: AuthService) { }

  bookEvent(eventId: number, body: any): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No token provided');
      return throwError('No token provided');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    })
    console.log("Invio richiesta di prenotazione...");
    console.log("Token inviato: ", token);

    return this.http.post(`${this.apiUrl}/${eventId}/book`, body, { headers }).pipe(
      tap(res => console.log("Risposta del server:", res)),
      catchError(err => {
        console.error("Errore durante la prenotazione:", err);
        return throwError(() => new Error("Errore nella richiesta"));
      })
    )
  }


}
