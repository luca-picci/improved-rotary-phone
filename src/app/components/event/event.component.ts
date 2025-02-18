import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { VenueService } from '../../services/venue.service';
import { Event } from '../../models/event.model';
import { Venue } from '../../models/venue.model';
import { EventFormComponent } from '../event-form/event-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingService} from '../../services/booking.service';

@Component({
  selector: 'app-event',
  imports: [CommonModule, EventFormComponent, FormsModule],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: Event[] = [];
  venues: Venue[] = [];
  filteredEvents: Event[] = [];
  eventTypes: string[] = ['Concerto', 'Teatro', 'Workshop', 'Convegno'];
  searchTerm: string = '';
  selectedType: string = '';
  selectedEvent: Event | null = null;
  isEditing = false;
  loading: boolean = false;
  message: string = '';

  constructor(private eventService: EventService, private venueService: VenueService, private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadVenues();
    this.loadEvents();
  }

  loadVenues(): void {
    this.venueService.getVenues().subscribe({
      next: (venues) => this.venues = venues,
      error: (error) => console.error("Errore nel caricamento delle venues", error)
    });
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getEventsWithVenues().subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = data; // Inizializza con tutti gli eventi
        this.loading = false;
      },
      error: (error) => {
        console.error("Errore nel caricamento degli eventi:", error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.filteredEvents = this.events.filter(event => {
      const matchesTitle = event.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesVenue = event.venue?.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.selectedType ? event.type === this.selectedType : true;
      return (matchesTitle || matchesVenue) && matchesType;
    });
  }

  onEdit(event: Event): void {
    this.selectedEvent = { ...event };
    this.isEditing = true;
  }

  onDelete(eventId: number): void {
    if (confirm('Sei sicuro di voler eliminare questo evento?')) {
      this.eventService.deleteEvent(eventId).subscribe(() => this.loadEvents());
    }
  }

  onSave(event: Event): void {
    const saveObservable = event.id ?
      this.eventService.updateEvent(event) :
      this.eventService.createEvent(event);

    saveObservable.subscribe({
      next: () => {
        this.loadEvents();
        this.isEditing = false;
        this.selectedEvent = null;
      },
      error: (error) => {
        console.error("Errore durante il salvataggio dell'evento", error);
        alert(error.message);
      }
    });
  }

  onBook(id: number): void {
    this.message = '';

    const token = localStorage.getItem('access_token');
    if (!token) {
      this.message = 'Devi essere autenticato per prenotare un evento';
      return;
    }

    const body = {};
    this.bookingService.bookEvent(id, body).subscribe({
      next: (res: any) => {
        console.log('Prenotazione effettuata:', res);
        this.message = 'Prenotazione effettuata con successo!';
        this.loadEvents();
      },
      error: (err: any) => {
        console.error("Errore prenotazione", err);

        if (err.status === 400) {
          this.message = 'L\'evento è al completo';
        } else if (err.status === 404) {
          this.message = 'Evento non trovato';
        } else if (err.status === 401) {
          this.message = 'Sessione scaduta. Effettua di nuovo il login';
          localStorage.removeItem('access_token');
        } else {
          this.message = 'Errore durante la prenotazione. Riprova più tardi.';
        }
      }
    })
  }
}
