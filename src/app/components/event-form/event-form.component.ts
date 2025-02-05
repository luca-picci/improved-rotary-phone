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
  @Input() event: Event | null = null;
  @Input() venues: Venue[] = [];
  @Output() saveEvent = new EventEmitter<Event>();
  loadingVenue: boolean = false;
  eventForm: Event = {
    id: 0,
    title: '',
    description: '',
    date: '',
    venue: undefined,
    venueId: undefined,
    type: '',
    capacity: 0,
    bookedSeats: 0
  };

  constructor(private venueService: VenueService) { }

  ngOnInit(): void {
    this.syncForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event']) {
      this.syncForm();
    }
  }

  private syncForm(): void {
    if (this.event) {
      Object.assign(this.eventForm, this.event);
    } else {
      this.eventForm = {
        id: 0,
        title: '',
        description: '',
        date: '',
        venue: undefined,
        venueId: undefined,
        type: '',
        capacity: 0,
        bookedSeats: 0
      };
    }
  }

  onVenueSelect(venueId: number | null): void {
    this.eventForm.venueId = venueId === null ? undefined : venueId;
    this.syncVenue();
  }

  private syncVenue(): void {
    if (this.eventForm.venueId && this.venues && this.venues.length > 0) {
      this.eventForm.venue = this.venues.find(v => v.id === this.eventForm.venueId) || undefined;
    } else {
      this.eventForm.venue = undefined;
    }
  }

  onSubmit(): void {
    this.saveEvent.emit(this.eventForm);
  }
}