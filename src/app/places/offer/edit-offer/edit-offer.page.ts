import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { LoadingController, NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place | undefined | any;
  form: FormGroup | any;
  private placeSub: Subscription | undefined;
  isLoading: boolean = false;
  placeId: string = '';

  constructor(private route: ActivatedRoute, private placesService: PlacesService,
    private navCtrl: NavController, private router: Router, private loadingCtrl: LoadingController
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
        this.placeId = id;
        this.isLoading = true;
        this.placeSub = this.placesService.getPlace(id).subscribe(place => {
          this.place = place;
          //ova forma zavisi od mjesta tako da treba da i ona bude u sibscribe
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
          this.isLoading = false;
        });
      }
    });
  }

  ngOnDestroy(): void {
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }

  onUpdateOffer(){
    if(!this.form.valid){
      return;
    }
    console.log(this.form);
    this.loadingCtrl.create({
      message: 'Updating place...',
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updatePlace(this.place.id, 
        this.form.value.title, 
        this.form.value.description).subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigateByUrl('/places/tabs/offer');
        });
    })
  }

}
