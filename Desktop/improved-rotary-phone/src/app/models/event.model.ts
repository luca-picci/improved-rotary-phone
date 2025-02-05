import { Venue } from './venue.model';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  venueId?: number; // Aggiungiamo l'ID del luogo
  venue?: Venue; // Dati del luogo (opzionali)
}
