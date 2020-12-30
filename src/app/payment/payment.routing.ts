import { Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AddpaymentComponent } from './addpayment/addpayment.component';
import { ListpaymentComponent } from './listpayment/listpayment.component';
import { ViewpaymentComponent } from './viewpayment/viewpayment.component';
import { EditpaymentComponent } from './editpayment/editpayment.component';


export const PaymentRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'addpayment',
        component: AddpaymentComponent,
        data: {
          title: 'add payment ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'add payment' }
          ]
        }
      },
      {
        path: 'listpayment',
        component: ListpaymentComponent,
        data: {
          title: 'payment list',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'payment list' }
          ]
        }
      },
      {
        path: 'viewpayment',
        component: ViewpaymentComponent,
        data: {
          title: 'view payment',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'view payment' }
          ]
        }
      },
      {
        path: 'editpayment',
        component: EditpaymentComponent,
        data: {
          title: 'edit payment',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'edit payment' }
          ]
        }
      },
    ]
  },
];