import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place('p1', 
      'Beograd na vodi', 
      'beograd na vodi povoljno', 
      'https://eminentnekretnine.rs/slike/izdavanje-kuca-beograd-EwstDDpDSC.jpg',
      150
    ),
    new Place('p2', 
      'Mirijevo', 
      'after je u mirijevu', 
      'https://eminentnekretnine.rs/slike/izdavanje-kuca-beograd-EwstDDpDSC.jpg',
      420
    ),
    new Place('p3', 
      'Vracar stan', 
      'historical', 
      'https://eminentnekretnine.rs/slike/izdavanje-kuca-beograd-EwstDDpDSC.jpg',
      69
    ),
  ];

  get places(){
    return [...this._places];
  }

  constructor() { }
}
