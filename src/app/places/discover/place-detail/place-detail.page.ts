import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place | any;
  private placeSub: Subscription | undefined;

  constructor(private route: ActivatedRoute, 
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private placesService: PlacesService,
    private actionSheetCtrl: ActionSheetController, 
    private bookingService: BookingService, private loadingCtrl: LoadingController) { }

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
        this.placeSub = this.placesService.getPlace(id).subscribe(place => {
          this.place = place;
        });
      }
    })
  }

  ngOnDestroy(): void {
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }

  onBookPlace() {
    //ovo prikazuje losu animaciju ako je stack stranica prazan
    // this.router.navigateByUrl('/places/tabs/discover');
    //this.navCtrl.navigateBack('/places/tabs/discover');
    this.actionSheetCtrl.create({
      header: 'Choose an action',
      buttons: [
        {
          text: 'Select date',
          handler: () => {this.openBookingModal('select')}
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
    
  }

  openBookingModal(mode: 'select') {
    console.log(mode);
    this.modalCtrl.create(
      {component: CreateBookingComponent, 
      componentProps: {selectedPlace: this.place}}
    ).then(modalEl => {
      modalEl.present();
      //on diddissmiss vraca obecanje tako da moze then
      return modalEl.onDidDismiss();
    }).then(resultData => {
      //console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm'){

        //console.log('BOOKED!!!!!!');
        this.loadingCtrl.create({message: 'Booking place...'}).then(loadingEl => {
          loadingEl.present();
          const data = resultData.data.bookingData;
          this.bookingService.addBooking(this.place.id, 
            this.place.title, 
            this.place.imageUrl, 
            data.firstName, 
            data.lastName, 
            data.guestNumber, data.startDate, data.endDate
          ).subscribe(() => {
            loadingEl.dismiss();
          });
 
        })

      }
    })
  }
}
