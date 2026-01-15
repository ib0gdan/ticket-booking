import type { Seat } from './movies';

export interface BookingDetails {
  id: string;
  userId: number;
  movieSessionId: number;
  sessionId: number;
  bookedAt: Date;
  seats: Seat[];
  isPaid: boolean;
}

export interface ExtraInfoBookingDetails extends BookingDetails {
  startTime: string;
}
