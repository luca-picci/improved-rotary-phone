import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from '../../models/event.model';
import { EventFormComponent } from '../event-form/event-form.component';
import { Venue } from '../../models/venue.model';
import { VenueService } from '../../services/venue.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, FormsModule, EventFormComponent],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchTerm: string = '';
  selectedEvent: Event | null = null;
  isEditing = false;
  venues: Venue[] = [];

  constructor(private eventService: EventService, private venueService: VenueService) { }

  ngOnInit(): void {
    this.loadVenues();
  }

  loadEvents(): void {
    this.eventService.getEventsWithVenues().subscribe(data => {
      this.events = data;
      this.filteredEvents = data;
    });
  }

  loadVenues(): void {
    this.venueService.getVenues().subscribe(venues => {
      this.venues = venues;
      this.loadEvents(); // Carica gli eventi *dopo* i venues
    });
  }

  onSearch(): void {
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      this.filteredEvents = this.events.filter(event =>
        event.title.toLowerCase().includes(term) ||
        (event.venue?.name?.toLowerCase().includes(term)) // Optional chaining
      );
    } else {
      this.filteredEvents = this.events;
    }
  }

  onEdit(event: Event): void {
    this.selectedEvent = { ...event }; // Clona l'evento
    this.isEditing = true;
  }

  onDelete(eventId: number): void {
    if (confirm('Sei sicuro di voler eliminare questo evento?')) {
      this.eventService.deleteEvent(eventId).subscribe(() => {
        this.loadEvents();
      });
    }
  }

  onSave(event: Event): void {
    console.log("Event before save:", event);

    if (!event.venue || !event.venue.id) {
      alert("Please select a venue.");
      return;
    }

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
        console.error("Error saving event:", error);
        alert(error.message);
      }
    });
  }
}