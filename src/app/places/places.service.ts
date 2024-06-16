import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, delay, map, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place('p1',
      'Beograd na vodi',
      'beograd na vodi povoljno',
      'https://eminentnekretnine.rs/slike/izdavanje-kuca-beograd-EwstDDpDSC.jpg',
      150,
      new Date('2024-01-01'),
      new Date('2024-12-31'),
      'u1'
    ),
    new Place('p2',
      'Mirijevo',
      'after je u mirijevu',
      'https://eminentnekretnine.rs/slike/izdavanje-kuca-beograd-EwstDDpDSC.jpg',
      420,
      new Date('2024-01-01'),
      new Date('2024-12-31'),
      'u1'
    ),
    new Place('p3',
      'Vracar stan',
      'historical',
      'https://eminentnekretnine.rs/slike/izdavanje-kuca-beograd-EwstDDpDSC.jpg',
      69,
      new Date('2024-01-01'),
      new Date('2024-12-31'),
      'u1'
    ),
  ]);
  //vraca objekat na koji se subskrajbujes
  get places(){
    return this._places.asObservable();
  }
  //treba za userId auth servis
  constructor(private authService: AuthService) { }

  //uzima mjesta i prosledjuje map metodi koja vraca to mjesto kao observable
  //ovo je nesta kao yield u python
  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(p => p.id === id)};
    }))
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date,
    dateTo: Date
  ) {
    //neki dummy id
    //hard kodovana slika
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
    console.log(newPlace);
    //uzme mjesta tako sto se subskrajbuje ali tako da samo jednom
    //uzme i onda canceluje subskripciju i onda se pozove funkcija
    //koja emituje novi događaj tj vraca stari niz+novo mjesto
    //svima koji su subskrajbovani
    this.places.pipe(take(1)).subscribe((places) => {

      this._places.next(places.concat(newPlace));

    })
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
