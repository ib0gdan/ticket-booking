import type { Session } from './common';

export interface Movie {
  id: number;
  title: string;
  description: string;
  year: number;
  lengthMinutes: number;
  formattedLength: string;
  posterImage: string;
  rating: number;
}

export interface MovieSession extends Session {
  seats: {
    rows: number;
    seatsPerRow: number;
  };
  bookedSeats: number[];
}
