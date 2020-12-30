import { Routes } from '@angular/router';

import { AddsupplierComponent } from './addsupplier/addsupplier.component';
import { ListsupplierComponent } from './listsupplier/listsupplier.component';
import { ViewsupplierComponent } from './viewsupplier/viewsupplier.component';
import { EditsupplierComponent } from './editsupplier/editsupplier.component';
import { SupplierlogComponent } from './supplierlog/supplierlog.component';


export const SuppliersRoutes: Routes = [
 

  {
    path: '',
    children: [
      {
        path: 'addsupplier',
        component: AddsupplierComponent,
        data: {
          title: 'add supplier ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'add supplier' }
          ]
        }
      }
    ]
  },


  {
    path: '',
    children: [
      {
        path: 'listsupplier',
        component: ListsupplierComponent,
        data: {
          title: 'list supplier ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'list supplier' }
          ]
        }
      }
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'viewsupplier',
        component: ViewsupplierComponent,
        data: {
          title: 'view supplier ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'view supplier' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'editsupplier',
        component: EditsupplierComponent,
        data: {
          title: 'edit supplier ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'edit supplier' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'historylog',
        component: SupplierlogComponent,
        data: {
          title: 'log supplier ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'log supplier' }
          ]
        }
      }
    ]
  },

  


];
