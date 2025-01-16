import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from '../../models/event.model';  // Importa Event
import { Venue } from '../../models/venue.model';  // Importa Venue

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {

  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchTerm: string = '';

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(data => {
      this.events = data.map((event: Event) => ({
        ...event,
        venue: event.venue || { id: 0, name: 'Non specificato', address: '', description: '' } as Venue
      }));
      this.filteredEvents = this.events;
    });
  }

  onSearch(): void {
    if (this.searchTerm) {
      this.filteredEvents = this.events.filter(event => 
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        event.venue.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredEvents = this.events;
    }
  }
}
