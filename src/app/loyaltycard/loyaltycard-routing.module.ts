import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AddloyaltycardComponent } from './addloyaltycard/addloyaltycard.component';
import { ViewloyalitypointComponent } from './viewloyalitypoint/viewloyalitypoint.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'addloyaltycard',
        component: AddloyaltycardComponent,
        data: {
          title: 'Add Loyalty Card',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Add Loyalty Card' }
          ]
        }
      },
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'viewloyaltypoint',
        component: ViewloyalitypointComponent,
        data: {
          title: 'View Loyalty Point',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'View Loyalty Point' }
          ]
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoyaltycardRoutingModule { }
