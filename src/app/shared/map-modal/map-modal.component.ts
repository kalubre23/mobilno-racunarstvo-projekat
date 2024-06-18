import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapElement: ElementRef | any;
  @Input() center = { lat: 44.77276620846354, lng: 20.475237754914435 };
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  clickListener: any;
  googleMaps: any;

  constructor(private modalCtrl: ModalController, private render: Renderer2) { }


  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getGoogleMaps().then(googleMaps => {
      this.googleMaps = googleMaps;
      const mapEl = this.mapElement.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        //fon 44.77276620846354, 20.475237754914435
        center: this.center,
        zoom: 16
      });

      googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.render.addClass(mapEl, 'visible');
      });

      if(this.selectable){
        this.clickListener = map.addListener('click', (mapsMouseEvent: { latLng: { lat: () => any; lng: () => any; }; }) => {
          const selectedCoords = { lat: mapsMouseEvent.latLng.lat(), lng: mapsMouseEvent.latLng.lng() };
          this.modalCtrl.dismiss(selectedCoords);
        });
      } else {
        const marker = new googleMaps.Marker({
          position: this.center,
          map: map,
          title: 'Picked location'
        });
        marker.setMap(map);
      }
    }).catch(err => {
      console.log(err);
    })
  }

  ngOnDestroy(): void {
    if(this.clickListener){
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }

  onCancel(){
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if(googleModule && googleModule.maps){
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://maps.googleapis.com/maps/api/js?key=" + environment.googleMapsApi;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Goole maps not available!');
        }
      }
    })
  }

}
