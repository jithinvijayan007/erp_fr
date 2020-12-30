import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PricelistComponent } from './pricelist/pricelist.component';
import { AddpriceComponent } from './addprice/addprice.component';
import { EditpriceComponent } from './editprice/editprice.component';
import { PriceListReportComponent } from './price-list-report/price-list-report.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'listprice',
        component: PricelistComponent,
        data: {
          title: 'list price ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'list price' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'addprice',
        component: AddpriceComponent,
        data: {
          title: 'add price ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'add price' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'editprice',
        component: EditpriceComponent,
        data: {
          title: 'edit price ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'edit price' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'price-list-report',
        component: PriceListReportComponent,
        data: {
          title: 'price list report',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'price list report' }
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
export class PriceRoutingModule { }
