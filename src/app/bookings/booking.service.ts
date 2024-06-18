import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject, delay, map, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

interface bookingData {
  bookedFrom: string,
  bookedTo: string,
  firstName: string,
  guestNumber: number,
  lastName: string,
  placeId: string,
  placeImage: string,
  placeTitle: string,
  userId: string
}


@Injectable({
  providedIn: 'root'
})
export class BookingService {
  //inicijalizovan na prazan niz
  private _bookings= new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }
  constructor(private authService: AuthService, private http: HttpClient) { }

  addBooking(placeId: string, 
    placeTitle: string, 
    placeImage: string, 
    firstName: string, 
    lastName: string, 
    guestNumber: number, 
    dateFrom: Date, 
    dateTo: Date)
    {
      let generatedId: string;
      const newBooking = new Booking(Math.random().toString(),
      placeId, this.authService.userId, placeTitle, placeImage, firstName, lastName,
      guestNumber, dateFrom, dateTo);

    return this.http.post<{name: string}>('https://mybookingapp-5d17b-default-rtdb.europe-west1.firebasedatabase.app/bookings.json', {...newBooking, id:null})
    .pipe(switchMap(resData => {
      generatedId = resData.name;
      return this.bookings;
    }), take(1), tap(bookings => {
      newBooking.id = generatedId;
      this._bookings.next(bookings.concat(newBooking));
    })
  );
    
  }

  cancelBooking(bookingId: string){
    return this.bookings.pipe(take(1), delay(1000), tap(bookings => {
      this._bookings.next(bookings.filter(b => b.id !== bookingId))
    }));
  }


  fetchBookings(){
    //treba da vrati samo bookinge koje je korisnik kreirao preko url parametara
    return this.http.get<{[key: string]: bookingData}>(`https://mybookingapp-5d17b-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`)
    .pipe(map(
      bookingData => {
        const bookings = [];
        for (const key in bookingData) {
          if (bookingData.hasOwnProperty(key)) {
            bookings.push(new Booking(key, 
              bookingData[key].placeId, bookingData[key].userId, 
              bookingData[key].placeTitle, 
              bookingData[key].placeImage, 
              bookingData[key].firstName, 
              bookingData[key].lastName, 
              bookingData[key].guestNumber,
              new Date(bookingData[key].bookedFrom), new Date(bookingData[key].bookedTo)))
          }
        }
        return bookings;
      }
    ), tap(bookings => {
      this._bookings.next(bookings);
    }));
  }
}
