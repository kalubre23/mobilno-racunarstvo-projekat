import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  place: Place | undefined | any;
  form: FormGroup | any;

  constructor(private route: ActivatedRoute, private placesService: PlacesService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/offer');
        return;
      }
      const id = paramMap.get('placeId');
      if(id === null) {
        console.log('Id za edit je null');
        return;
      } else {
        this.place = this.placesService.getPlace(id);
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
          updateOn: 'blur',
          validators: [Validators.required]
          }),
          description: new FormControl(this.place.description, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(150)]
          }),
        })
      }
    });
  }

  onUpdateOffer(){
    if(!this.form.valid){
      return;
    }
    console.log(this.form);
  }

}
