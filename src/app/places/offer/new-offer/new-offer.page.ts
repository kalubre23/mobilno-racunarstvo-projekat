import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonDatetime } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit, AfterViewInit {
  dateSelected: string = "";
  form: FormGroup | any;

  ngAfterViewInit() {
    //danasnji datum
    const today = new Date();
    //formatiranje
    const formattedDate = today.toISOString().split('T')[0];
    //dodjela
    this.dateSelected = formattedDate;
  }

  constructor(private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(150)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
    //povezati sad sa htmlom ovo
  }

  onCreateOffer(){
    if (!this.form.valid){
      console.log('Forma kod new offer nije validna', this.form);
      return;
    }
    this.placesService.addPlace(this.form.value.title,
      this.form.value.description,
      +this.form.value.price,
      new Date(this.form.value.dateFrom),
      new Date(this.form.value.dateTo)
    )
    this.form.reset();
    this.router.navigateByUrl('/places/tabs/offer');
  }

}
