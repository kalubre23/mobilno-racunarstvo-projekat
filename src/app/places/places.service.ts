import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, delay, map, of, switchMap, take, tap } from 'rxjs';
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
    // return this.places.pipe(take(1), map(places => {
      //   return {...places.find(p => p.id === id)};
      // })
      // );
      //moze i da se proveri dal postoji mjesto lokalno prije nego salje request
    return this.http.get<placeData>(`https://mybookingapp-5d17b-default-rtdb.europe-west1.firebasedatabase.app/offer-booking/${id}.json`)
    .pipe(
      map(placeData => {
        return new Place(id, placeData.title, placeData.description, placeData.imageUrl, placeData.price, new Date(placeData.availableFrom), new Date(placeData.availableTo), placeData.userId)
      })
    );
  }

  //vraca se kao dictionary dje svaki key id koji je firebase napravio
  fetchPlaces(){
    console.log('usao je u fetch places');
    return this.http.get<{[key: string]: placeData}>('https://mybookingapp-5d17b-default-rtdb.europe-west1.firebasedatabase.app/offer-booking.json')
    .pipe(map(resData => {
      //trebao sam u tap() da console log al nema veze
      //console.log(resData);
      const places = [];
      for(const key in resData){
        if(resData.hasOwnProperty(key)){
          places.push(new Place(key, resData[key].title, resData[key].description,
            resData[key].imageUrl, resData[key].price, new Date(resData[key].availableFrom),
            new Date(resData[key].availableTo), resData[key].userId
          ));
        }
      }
      return places;
      //return [];
    }), tap(places => {
      console.log(places, 'vraceni od servera');
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
    //switch map prvo lokalno updatuje place pa onda vraca drugi observable koji je put request
    //i na kraju se u tap emituje promena
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1), switchMap(places => {
        if (!places || places.length <= 0){
          return this.fetchPlaces();
        } else { 
          return of(places);
        }
        
      }), switchMap(places => {
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
        return this.http.put(`https://mybookingapp-5d17b-default-rtdb.europe-west1.firebasedatabase.app/offer-booking/${placeId}.json`,
          { ...updatedPlaces[updatedPlacesIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
      );
  }
}
