import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlacesPage } from './places.page';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'tabs/discover',
  //   pathMatch: 'full'
  // },
  {
    path: 'tabs',
    component: PlacesPage,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'discover',
      //   pathMatch: 'full'
      // },
      {
        path: 'discover',
        loadChildren: () => import('./discover/discover.module').then( m => m.DiscoverPageModule)
      },
      {
        path: 'offer',
        loadChildren: () => import('./offer/offer.module').then( m => m.OfferPageModule)
      }
    ]
  },
  
  //{
  //    path: 'tabs',
  //    component: PlacesPage,
  //    children: [
  //     {
  //       path: 'discover',
  //       children: [
  //         {
  //           path: '',
  //           loadChildren: () => import('./discover/discover.module').then( m => m.DiscoverPageModule)
  //         },
  //         {
  //           path: ':placeId',
  //           loadChildren: () => import('./discover/place-detail/place-detail.module').then( m => m.PlaceDetailPageModule)
  //         }

  //       ]
  //     },
  //     {
  //       path: 'offers',
  //       children: [
  //         {
  //           path: '',
  //           loadChildren: () => import('./offer/offer.module').then( m => m.OfferPageModule)
  //         },
  //         {
  //           path: 'new',
  //           loadChildren: () => import('./new-offer/new-offer.module').then( m => m.NewOfferPageModule)
  //         }

  //       ]
  //     }
  //    ]
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacesPageRoutingModule {}
