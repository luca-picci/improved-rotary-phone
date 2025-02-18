import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, startWith, map } from 'rxjs';
import { Event as EventModel } from '../../models/event.model';
import { Venue } from '../../models/venue.model';
import { VenueService } from '../../services/venue.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-event-form',
  standalone: true,
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatOptionModule
  ]
})
export class EventFormComponent implements OnInit {
  @Input() event: EventModel | null = null;
  @Input() venues: Venue[] = [];
  @Output() saveEvent = new EventEmitter<EventModel>();
  @Output() cancel = new EventEmitter<void>();

  eventForm: EventModel = {
    id: 0,
    title: '',
    description: '',
    date: '',
    venueId: undefined,
    venue: undefined,
    type: '',
    capacity: 0,
    bookedSeats: 0
  };

  venueSearchControl = new FormControl<Venue | string>('');
  filteredVenues: Venue[] = [];
  loadingVenue: boolean = false;

  constructor(private venueService: VenueService) { }

  ngOnInit(): void {
    this.syncForm();
    this.venueSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterVenues(typeof value === 'string' ? value : value?.name || ''))
    ).subscribe(filtered => this.filteredVenues = filtered);
  }

  private syncForm(): void {
    if (this.event) {
      this.eventForm = { ...this.event };
      this.eventForm.venueId = this.event.venue ? this.event.venue.id : undefined;
      this.venueSearchControl.setValue(this.event.venue ? this.event.venue.name : '');
    } else {
      this.eventForm = {
        id: 0,
        title: '',
        description: '',
        date: '',
        venueId: undefined,
        venue: undefined,
        type: '',
        capacity: 0,
        bookedSeats: 0
      };
      this.venueSearchControl.setValue('');
    }
  }

  private filterVenues(value: string): Venue[] {
    if (!value) return this.venues;
    const filterValue = value.toLowerCase();
    return this.venues.filter(venue => venue.name.toLowerCase().includes(filterValue));
  }

  onVenueSelect(event: any): void {
    const selectedVenue = event.option.value as Venue; // Cast esplicito

    if (!selectedVenue || !selectedVenue.name) return;

    if (selectedVenue.id !== 0) {
      // Se esiste già
      this.eventForm.venue = selectedVenue;
      this.eventForm.venueId = selectedVenue.id;
      this.venueSearchControl.setValue(selectedVenue.name);
    } else {
      // Verifichiamo se esiste già una venue con lo stesso nome
      const existingVenue = this.venues.find(v => v.name.toLowerCase() === selectedVenue.name.toLowerCase());

      if (existingVenue) {
        this.eventForm.venue = existingVenue;
        this.eventForm.venueId = existingVenue.id;
        this.venueSearchControl.setValue(existingVenue);
        return;
      }

      // Creiamo la nuova venue
      this.createNewVenue(selectedVenue.name);
    }
  }

  addNewVenue() {
    const venueName = this.venueSearchControl.value?.toString().trim();
    if (venueName) { // Check if venueName is not null or empty after trimming.
      this.createNewVenue(venueName);
    }
  }

  private createNewVenue(name: string): void {
    const newVenue: Venue = { id: 0, name, address: '', description: '' };

    this.loadingVenue = true;
    this.venueService.createVenue(newVenue).subscribe({
      next: (createdVenue) => {
        console.log('Nuova venue creata:', createdVenue);
        this.venues.push(createdVenue);
        this.eventForm.venue = createdVenue;
        this.eventForm.venueId = createdVenue.id;
        this.venueSearchControl.setValue(createdVenue);
        this.filteredVenues.push(createdVenue) // Refresh the list of venues
        this.loadingVenue = false;
      },
      error: (err) => {
        console.error('Errore nel salvataggio della venue:', err);
        this.loadingVenue = false;
      }
    });
  }

  // Metodo per visualizzare correttamente il nome della venue nell'input
  displayVenue(venue: string | Venue): string {
    return typeof venue === 'string' ? venue : venue?.name || '';
  }

  onSubmit(): void {
    if (!this.eventForm.title || !this.eventForm.date) {
      console.error('Errore: Titolo e data sono obbligatori!');
      return;
    }

    const selectedVenue = this.venues.find(v => v.name === this.venueSearchControl.value);
    if (selectedVenue) {
      this.eventForm.venueId = selectedVenue.id;
    }

    console.log('Evento salvato:', this.eventForm);
    this.saveEvent.emit(this.eventForm);
  }


}
