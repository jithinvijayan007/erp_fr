import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesListComponent } from './sales-list/sales-list.component';
import { SalesviewComponent } from './salesview/salesview.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'listsales',
        component: SalesListComponent,
        data: {
          title: 'list sales ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'list sales' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'viewsales',
        component: SalesviewComponent,
        data: {
          title: 'view sales ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'view sales' }
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
export class SalesReturnRoutingModule { }
