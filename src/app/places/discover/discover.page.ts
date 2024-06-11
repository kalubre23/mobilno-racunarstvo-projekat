import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { SegmentChangeEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[] | undefined;

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
  }

  onFilterUpdate(event: Event) {
    //mora cast jer nece implicitno da se Event castuje u CustomEvent
    const customEvt = event as CustomEvent<SegmentChangeEventDetail>;
    console.log(customEvt.detail.value);
    console.log('Usao je u filter update');
  }

}
