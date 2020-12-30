import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AddreceiptComponent } from './addreceipt/addreceipt.component';
import { ListreceiptComponent } from './listreceipt/listreceipt.component';
import { ViewreceiptComponent } from './viewreceipt/viewreceipt.component';
import { ReceiptOrderListComponent } from './receipt-order-list/receipt-order-list.component';
import { CreditsettlementComponent } from './creditsettlement/creditsettlement.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'addreceipt',
        component: AddreceiptComponent,
        data: {
          title: 'Receipt',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Receipt' }
          ]
        }
      },
      {
        path: 'listreceipt',
        component: ListreceiptComponent,
        data: {
          title: 'Receipt List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Receipt List' }
          ]
        }
      },
      {
        path: 'viewreceipt',
        component: ViewreceiptComponent,
        data: {
          title: 'Receipt View',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Receipt View' }
          ]
        }
      },
      {
        path: 'receipt-order-list',
        component: ReceiptOrderListComponent ,
        data: {
          title: 'Receipt Order List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Receipt Order List' }
          ]
        }
      },
      {
        path: 'credit-settlement',
        component: CreditsettlementComponent ,
        data: {
          title: 'Credit Settlement',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Credit Settlement' }
          ]
        }
      },
 
    ]
  }
];
;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptRoutingModule { }
