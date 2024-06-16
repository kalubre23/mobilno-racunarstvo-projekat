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
  offers: Place[] | undefined;
  private placesSub: Subscription | undefined; 

  constructor(private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
    //svaki put kad se update mjesta u servisu
    //update ce se i ovde jer si sub
    this.placesSub = this.placesService.places.subscribe(places => {
      this.offers = places;
    });
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
