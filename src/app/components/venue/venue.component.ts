import { Component } from '@angular/core';
import { VenueService } from '../../services/venue.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-venue',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent {

  venues: any[] = [];
  filteredVenues: any[] = [];
  searchTerm: string = '';

  constructor(private venueService: VenueService) { }

  ngOnInit(): void {
    this.loadVenues();
  }

  loadVenues(): void {
    this.venueService.getVenues().subscribe(data => {
      this.venues = data;
      this.filteredVenues = data; 
    });
  }

  onSearch(): void {
    if (this.searchTerm) {
      this.filteredVenues = this.venues.filter(venue =>
        venue.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredVenues = this.venues;
    }
  }
}
