import { Routes } from '@angular/router';

import { AddcouponComponent } from './addcoupon/addcoupon.component';
import { ListcouponComponent } from './listcoupon/listcoupon.component';
import { ViewcouponComponent } from './viewcoupon/viewcoupon.component';
import { EditcouponComponent } from './editcoupon/editcoupon.component';
import { AuthGuard } from '../auth.guard';



export const CouponRoutes: Routes = [
 

  {
    path: '',
    children: [
      {
        path: 'addcoupon',
        canActivate: [AuthGuard],
        component: AddcouponComponent,
        data: {
          title: 'add coupon ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'add coupon' }
          ]
        }
      }
    ]
  },


  {
    path: '',
    children: [
      {
        path: 'listcoupon',
        component: ListcouponComponent,
        data: {
          title: 'list coupon ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'list coupon' }
          ]
        }
      }
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'viewcoupon',
        component: ViewcouponComponent,
        data: {
          title: 'view coupon ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'view coupon' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'editcoupon',
        component: EditcouponComponent,
        data: {
          title: 'edit coupon ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'edit coupon' }
          ]
        }
      }
    ]
  },
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: 'historylog',
  //       component: SupplierlogComponent,
  //       data: {
  //         title: 'log supplier ',
  //         urls: [
  //           { title: 'Dashboard', url: '/dashboard' },
  //           { title: 'log supplier' }
  //         ]
  //       }
  //     }
  //   ]
  // },

  


];
