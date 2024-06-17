import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, delay, map, switchMap, take, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//kao place samo bez id koji rucno dodam i napravim Place
interface placeData{
  availableFrom: string,
  availableTo: string,
  description: string,
  imageUrl: string,
  price: number,
  title: string,
  userId: string
}


// new Place('p1',
//   'Beograd na vodi',
//   'beograd na vodi povoljno',
//   'https://eminentnekretnine.rs/slike/izdavanje-kuca-beograd-EwstDDpDSC.jpg',
//   150,
//   new Date('2024-01-01'),
//   new Date('2024-12-31'),
//   'aa'
// ),
//   new Place('p2',
//     'Mirijevo',
//     'after je u mirijevu',
//     'https://eminentnekretnine.rs/slike/izdavanje-kuca-beograd-EwstDDpDSC.jpg',
//     420,
//     new Date('2024-01-01'),
//     new Date('2024-12-31'),
//     'u1'
//   ),
//   new Place('p3',
//     'Vracar stan',
//     'historical',
//     'https://eminentnekretnine.rs/slike/izdavanje-kuca-beograd-EwstDDpDSC.jpg',
//     69,
//     new Date('2024-01-01'),
//     new Date('2024-12-31'),
//     'u1'
//   ),
  


@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  
  //vraca objekat na koji se subskrajbujes
  get places(){
    return this._places.asObservable();
  }
  //treba za userId auth servis
  constructor(private authService: AuthService, private http: HttpClient) { }

  //uzima mjesta i prosledjuje map metodi koja vraca to mjesto kao observable
  //ovo je nesta kao yield u python
  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(p => p.id === id)};
    })
    );
  }

  //vraca se kao dictionary dje svaki key id koji je firebase napravio
  fetchPlaces(){
    console.log('usao je u fetch places');
    return this.http.get<{[key: string]: placeData}>('https://mybookingapp-5d17b-default-rtdb.europe-west1.firebasedatabase.app/offer-booking.json')
    .pipe(map(resData => {
      console.log(resData);
      const places = [];
      for(const key in resData){
        if(resData.hasOwnProperty(key)){
          places.push(new Place(key, resData[key].title, resData[key].description,
            resData[key].imageUrl, resData[key].price, new Date(resData[key].availableFrom),
            new Date(resData[key].availableTo), resData[key].userId
          ));
        }
      }
      console.log(places);
      return places;
      //return [];
    }), tap(places => {
      console.log('aaa');
      console.log(places);
      this._places.next(places);
    })
  );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date,
    dateTo: Date
  ) {
    //neki dummy id
    //hard kodovana slika
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(), 
      title, 
      description,
      'https://eminentnekretnine.rs/slike/izdavanje-kuca-beograd-EwstDDpDSC.jpg', 
      price, 
      dateFrom, 
      dateTo, 
      this.authService.userId
    );

    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Access-Control-Allow-Origin': '*'
    // });

    console.log(newPlace);
    return this.http.post<{ name: string }>('https://mybookingapp-5d17b-default-rtdb.europe-west1.firebasedatabase.app/offer-booking.json', { ...newPlace, id: null }).pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }), take(1), tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
    //uzme mjesta tako sto se subskrajbuje ali tako da samo jednom
    //uzme i onda canceluje subskripciju i onda se pozove funkcija
    //koja emituje novi događaj tj vraca stari niz+novo mjesto
    //svima koji su subskrajbovani
    // this.places.pipe(take(1)).subscribe((places) => {

    //   this._places.next(places.concat(newPlace));

    // })
  }

  updatePlace(placeId: string, title: string, description: string){
    //stavio sam kao fake delay 1s da bi se pokazao loading ctrl
    return this.places.pipe(take(1), delay(1000),
     tap(places => {
      const updatedPlacesIndex = places.findIndex(pl => pl.id === placeId);
      const updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlacesIndex];
      updatedPlaces[updatedPlacesIndex] = new Place(oldPlace.id, 
        title, 
        description, 
        oldPlace.imageUrl, 
        oldPlace.price, 
        oldPlace.availableFrom, 
        oldPlace.availableTo, 
        oldPlace.userId);
      this._places.next(updatedPlaces);
    }))
  }
}
