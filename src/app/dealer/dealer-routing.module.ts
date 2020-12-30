import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdddealerComponent} from './adddealer/adddealer.component'
import { DealerlistComponent } from './dealerlist/dealerlist.component';
import {EditdealerComponent} from './editdealer/editdealer.component'
import {ViewdealerComponent } from './viewdealer/viewdealer.component'
import {DealerhistoryComponent} from './dealerhistory/dealerhistory.component'
import { AuthGuard } from '../auth.guard';

export const DealerRoutes : Routes  = [
 {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'adddealer',
        component: AdddealerComponent,
        data: {
          title: 'add dealer ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'add dealer' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'dealerlist',
        component: DealerlistComponent,
        data: {
          title: 'dealer list',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'dealer list' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'editdealer',
        component: EditdealerComponent,
        data: {
          title: 'edit dealer',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'edit dealer' }
          ]
        }
      }
    ]
  },  
  {
    path: '',
    children: [
      {
        path: 'viewdealer',
        component: ViewdealerComponent,
        data: {
          title: 'view dealer',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'view dealer' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'dealerhistory',
        component: DealerhistoryComponent,
        data: {
          title: 'history dealer',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'history dealer' }
          ]
        }
      }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(DealerRoutes)],
  exports: [RouterModule]
})
export class DealerRoutingModule { }
