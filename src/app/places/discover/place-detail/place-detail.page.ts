import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place | undefined | any;

  constructor(private route: ActivatedRoute, 
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private placesService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      const id = paramMap.get('placeId');
      if(id === null) {
         console.log('Id is null');
        return;
      } else {
        this.place = this.placesService.getPlace(id);
      }
    })
  }

  onBookPlace() {
    //ovo prikazuje losu animaciju ako je stack stranica prazan
    // this.router.navigateByUrl('/places/tabs/discover');
    //this.navCtrl.navigateBack('/places/tabs/discover');
    this.modalCtrl.create(
      {component: CreateBookingComponent, 
      componentProps: {selectedPlace: this.place}}
    ).then(modalEl => {
      modalEl.present();
      //on diddissmiss vraca obecanje tako da moze then
      return modalEl.onDidDismiss();
    }).then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm'){
        console.log('BOOKED!!!!!!');
      }
    })
  }
}
