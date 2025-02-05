import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from '../../models/event.model';
import { Venue } from '../../models/venue.model';
import { VenueService } from '../../services/venue.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, OnChanges {
  @Input() event: Event = {
    id: 0,
    title: '',
    description: '',
    date: '',
    venue: undefined,
    venueId: undefined
  };
  @Input() venues: Venue[] = [];
  @Output() saveEvent = new EventEmitter<Event>();
  loadingVenue: boolean = false;

  constructor(private venueService: VenueService) { }

  ngOnInit(): void {
    this.syncVenue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event'] && !changes['event'].firstChange) {
      this.syncVenue();
    }
  }

  private syncVenue(): void {
    if (this.event.venueId && this.venues && this.venues.length > 0) {
      this.event.venue = this.venues.find(v => v.id === this.event.venueId) || undefined;
    } else {
      this.event.venue = undefined;
    }
  }

  onVenueSelect(venueId: number | null): void {
    this.event.venueId = venueId === null ? undefined : venueId;
    this.syncVenue();
    console.log("Selected Venue:", this.event.venue);
  }

  onSubmit(): void {
    if (this.event.venueId) {
      this.loadingVenue = true;
      this.venueService.getVenueById(this.event.venueId).subscribe({
        next: (venue) => {
          this.event.venue = venue || undefined; // Gestisci null esplicitamente
          this.saveEvent.emit(this.event);
        },
        error: (error) => {
          console.error("Error fetching venue:", error);
          alert("Error fetching venue. Please try again.");
        },
        complete: () => this.loadingVenue = false
      });
    } else {
      this.event.venue = undefined;
      this.saveEvent.emit(this.event);
    }
  }
}