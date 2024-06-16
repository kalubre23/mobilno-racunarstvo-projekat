import { Component, Input, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent  implements OnInit {
  @Input() selectedPlace: Place | any;
  //@ViewChild('dateFrom', { static: true }) dateFrom: IonDatetime | any;
  private dateFrom: Date | any;
  private dateTo: Date | any;
  isDateValid: boolean = false;

  constructor(private modalCtrl: ModalController) {
    
   }

  ngOnInit() {
    this.dateFrom = this.dateTo = this.selectedPlace.availableFrom;
    console.log(this.selectedPlace);
    console.log(this.dateFrom, this.dateTo);
  }

  onCancel(){
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBook(){
    this.modalCtrl.dismiss({message: 'Podaci iz modala'}, 'confirm');
  }

  onChangeDateFrom(event: CustomEvent) {
    this.dateFrom = new Date(event.detail.value);
    this.isDateValid = (this.dateTo > this.dateFrom);
    console.log(this.dateTo, this.dateFrom);
    console.log(this.isDateValid);
  }

  onChangeDateTo(event: CustomEvent){
    this.dateTo = new Date(event.detail.value);
    this.isDateValid = (this.dateTo > this.dateFrom);
    console.log(this.dateTo, this.dateFrom);
    console.log(this.isDateValid);
  }

  onBookPlace(form: NgForm){
    if (!form.valid || !this.isDateValid) {
      console.log('Forma nije validna!!!!!!!!!!');
      return;
    }
    this.modalCtrl.dismiss({
      bookingData:{
        firstName: form.value['first-name'],
        lastName: form.value['last-name'],
        guestNumber: +form.value['guest-number'],
        startDate: this.dateFrom,
        endDate: this.dateTo
      }
    }, 'confirm')
  }

}
