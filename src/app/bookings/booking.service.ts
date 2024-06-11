import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  //inicijalizovan na prazan niz
  private _bookings: Booking[] = [
    new Booking('b1', 'p1', 'u1', 'Beograd na vodi', 2),
    new Booking('b2', 'p2', 'u2', 'Mirijevo', 4)
  ];

  get bookings() {
    return [...this._bookings];
  }
  constructor() { }
}
