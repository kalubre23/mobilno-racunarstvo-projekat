import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent  implements OnInit, AfterViewInit {
  @ViewChild('map') mapElement: ElementRef | any;

  constructor(private modalCtrl: ModalController, private render: Renderer2) { }


  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getGoogleMaps().then(googleMaps => {
      const mapEl = this.mapElement.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        //fon 44.77276620846354, 20.475237754914435
        center: { lat: 44.77276620846354, lng: 20.475237754914435},
        zoom: 16
      });

      googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.render.addClass(mapEl, 'visible');
      });
    }).catch(err => {
      console.log(err);
    })
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
      script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAdPdSJSBHVg879UoNNs6YtyKueTIURlU4";
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
