import { Component, OnDestroy, OnInit } from '@angular/core';
import { Place } from '../../place.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  place: Place | undefined | any;
  private placeSub: Subscription | undefined;

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private placesService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/offer');
        return;
      }
      const id = paramMap.get('placeId');
      if(id === null){
        console.log('Id za edit je null u ponudi bookinga');
        return;
      }else {
        this.placeSub = this.placesService.getPlace(id).subscribe(place => {
          this.place = place;
        });
      }
    });
  }

  ngOnDestroy(): void {
    if(this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
