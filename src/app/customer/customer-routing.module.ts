import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { EditcustomerComponent } from './editcustomer/editcustomer.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'editcustomer',
        component: EditcustomerComponent,
        data: {
          title: 'Edit customer',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Edit customer' }
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
        path: 'history',
        component: HistoryComponent,
        data: {
          title: ' History',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: ' History' }
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
export class CustomerRoutingModule { }
