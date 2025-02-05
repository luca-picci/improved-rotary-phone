import { Venue } from './venue.model';

/**
 * Interfaccia che definisce la struttura di un oggetto Evento.
 */
export interface Event {
  id: number; // Identificativo univoco dell'evento
  title: string; // Titolo dell'evento
  description: string; // Descrizione dell'evento
  date: string; // Data dell'evento (formato ISO 8601: YYYY-MM-DD)
  venueId?: number; // Identificativo del luogo dell'evento (chiave esterna)
  venue?: Venue; // Oggetto Venue completo (opzionale, caricato tramite relazione)
  type: string; // Tipologia dell'evento (es. "Concerto", "Teatro", "Workshop")
  capacity: number; // Numero massimo di posti disponibili
  bookedSeats: number; // Numero di posti già prenotati
}