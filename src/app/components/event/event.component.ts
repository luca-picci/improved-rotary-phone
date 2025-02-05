import { Component, OnInit } from '@angular/core';
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
export class EventComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchTerm: string = '';
  selectedEvent: Event | null = null; // Importante: può essere null
  isEditing = false;
  venues: Venue[] = [];
  selectedType: string = '';
  eventTypes: string[] = ['Concerto', 'Teatro', 'Workshop', 'Convegno'];
  loading: boolean = false;

  constructor(private eventService: EventService, private venueService: VenueService) { }

  ngOnInit(): void {
    this.loadVenues();
  }

  loadEvents(type: string = ''): void {
    this.loading = true;
    this.eventService.getEventsWithVenues(type).subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = data;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading events:", error);
        this.loading = false;
      }
    });
  }

  loadVenues(): void {
    this.venueService.getVenues().subscribe(venues => {
      this.venues = venues;
      this.loadEvents();
    });
  }

  onSearch(): void {
    let filtered = this.events;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(term) ||
        (event.venue?.name?.toLowerCase().includes(term))
      );
    }

    if (this.selectedType) {
      filtered = filtered.filter(event => event.type === this.selectedType);
    }

    this.filteredEvents = filtered;
  }

  onEdit(event: Event): void {
    this.selectedEvent = { ...event }; // Clonazione per evitare modifiche dirette
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