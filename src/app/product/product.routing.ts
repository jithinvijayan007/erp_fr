import { Routes } from '@angular/router';

import { AddproductComponent } from './addproduct/addproduct.component';
import { ListproductComponent } from './listproduct/listproduct.component';
import { AuthGuard } from '../auth.guard';


export const ProductRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'addproduct',
        component: AddproductComponent,
        data: {
          title: 'Product',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Product' }
          ]
        }
      },
      {
        path: 'productlist',
        component: ListproductComponent,
        data: {
          title: 'Product List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Product List' }
          ]
        }
      },
    ]
  }
];
