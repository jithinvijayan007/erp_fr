import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddguestComponent } from './addguest/addguest.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'addguest',
        component: AddguestComponent,
        data: {
          title: 'add guest ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'add guest' }
          ]
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoutingModule { }
