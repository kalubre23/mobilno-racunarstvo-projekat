import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, of, switchMap, tap } from 'rxjs';
import { PlaceLocation } from '../../../places/location.model';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent  implements OnInit {
  selectedLocationImage: string = '';
  isLoading = false;

  constructor(private modalCtrl: ModalController, private http: HttpClient) { }

  ngOnInit() {}

  onPickLocation(){
    this.modalCtrl.create({
      component: MapModalComponent
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        //console.log(modalData.data);
        if(!modalData){
          return;
        }
        const pickedLocation: PlaceLocation = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
          address: '',
          mapImage: ''
        };
        this.isLoading = true;
        this.getAddress(modalData.data.lat, modalData.data.lng).pipe(
          switchMap(address => {
            pickedLocation.address = address;
            return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14))
          })
        ).subscribe(mapImageUrl => {
          //mapImageUrl je slika koja je vracena
          pickedLocation.mapImage = mapImageUrl;
          this.selectedLocationImage = mapImageUrl;
          this.isLoading = false;
          console.log('adresa', pickedLocation.address);
          console.log(pickedLocation.mapImage);
        });
      });
      modalEl.present();
    });
  }

  private getAddress(lat: number, lng: number){
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApi}`)
    .pipe(map(geoData => {
      if(!geoData || !geoData.results || geoData.results.length === 0) {
        console.log('Adresa je null u getAdress');
        return null;
      }
      console.log(geoData.results[0].formatted_address);
      return geoData.results[0].formatted_address;
    }));
  }


  private getMapImage(lat: number, lng: number, zoom: number){
    //ne mora da se salje request za ovo jer je ovo slika, ne ocekujem JSOn podatke
    return `https://maps.googleapis.com/maps/api/staticmap?${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
            &markers=color:blue%7Clabel:Place%7C${lat},${lng}
            &key=${environment.googleMapsApi}`;
            //&signature=${environment.signatureKey}`;
  }

}
