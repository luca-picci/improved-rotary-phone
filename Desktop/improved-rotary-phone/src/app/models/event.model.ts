import { Venue } from "./venue.model";

export interface Event {
    id: number;
    title: string;
    date: string; 
    venue: Venue;
    description: string; 
  }
  