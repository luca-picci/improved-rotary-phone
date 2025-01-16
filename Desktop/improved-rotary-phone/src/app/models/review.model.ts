import { User } from './user.model';
import { Event } from './event.model';

export interface Review {
  id: number;
  user: User; // Collegamento alla tabella User
  event: Event; // Collegamento alla tabella Event
  reviewText: string;
  rating: number; // Da 1 a 5, ad esempio
}
