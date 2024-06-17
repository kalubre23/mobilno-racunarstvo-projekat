import { Component, OnDestroy, OnInit } from '@angular/core';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.page.html',
  styleUrls: ['./offer.page.scss'],
})
export class OfferPage implements OnInit, OnDestroy {
  offers: Place[] | any;
  isLoading: boolean = false;
  private placesSub: Subscription | undefined; 

  constructor(private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
    //svaki put kad se update mjesta u servisu
    //update ce se i ovde jer si sub
    this.placesSub = this.placesService.places.subscribe(places => {
      this.offers = places;
      if(!places){
        console.log('prazna mjesta u ngoninit');
      }
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    //znaci kad treba da udje onda ce da posalje get za sva mjesta
    //i update ce se u servisu a posto sam subscribovan u ngOnInit svakako ce se update i ovde
    console.log('usao u ionwievwillenter', this.offers);

    this.placesService.fetchPlaces().subscribe(
      () => {this.isLoading = false;}
    );
    console.log('izvrsio se fetch', this.offers);
  }

  //kada se izadje unsubscribe
  ngOnDestroy(): void {
    if(this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offer', 'edit', offerId]);
    console.log('editing offer', offerId);
  }

}
