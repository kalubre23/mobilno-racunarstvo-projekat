import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonDatetime, LoadingController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { PlaceLocation } from '../../location.model';

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

  constructor(private placesService: PlacesService, 
    private router: Router, private loadingCtrl: LoadingController) { }

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
      location: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    //povezati sad sa htmlom ovo
  }

  onCreateOffer(){
    if (!this.form.valid){
      console.log('Forma kod new offer nije validna', this.form);
      return;
    }
    this.loadingCtrl.create({message: 'Creatig offer...'}).then(loadingEl => {
      loadingEl.present();
      this.placesService.addPlace(this.form.value.title,
        this.form.value.description,
        +this.form.value.price,
        new Date(this.form.value.dateFrom),
        new Date(this.form.value.dateTo),
        this.form.value.location
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigateByUrl('/places/tabs/offer');
      });
    });
  }

  onLocationPick(locaionPicked: PlaceLocation) {
    this.form.patchValue({ location: locaionPicked });
  }

}
