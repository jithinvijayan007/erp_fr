import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaserequestComponent } from './purchaserequest/purchaserequest.component';
import { AuthGuard } from '../auth.guard';
const routes: Routes = [

  {
    path: '',
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'request',
        component: PurchaserequestComponent,
        data: {
          title: 'Purchase Request',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Purchase Request' }
          ]
        }
      },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaserequestRoutingModule { }
