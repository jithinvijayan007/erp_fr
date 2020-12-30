import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseOrderViewComponent } from './purchase-order-view/purchase-order-view.component';
import { PurchaselistComponent } from './purchaselist/purchaselist.component';
import { PurchaselistViewComponent } from './purchaselist-view/purchaselist-view.component';
import { PurchaseVoucherComponent } from './purchase-voucher/purchase-voucher.component';
import { AuthGuard } from '../auth.guard';
import { ImeiLookupComponent } from './imei-lookup/imei-lookup.component';
import { GrnpurchaseComponent } from './grnpurchase/grnpurchase.component';

const routes: Routes = [

  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'purchaseorder',
        component: PurchaseOrderComponent,
        data: {
          title: 'Purchase Order',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Purchase Order' }
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
        path: 'purchaseorderlist',
        component: PurchaseOrderListComponent,
        data: {
          title: 'Purchase Order List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Purchase Order List' }
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
        path: 'purchase',
        component: PurchaseComponent,
        data: {
          title: 'Add GRN',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Add GRN' }
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
        path: 'purchaseorderview',
        component: PurchaseOrderViewComponent,
        data: {
          title: 'Purchase Order View',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Purchase Order View' }
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
        path: 'purchaselist',
        component: PurchaselistComponent,
        data: {
          title: 'GRN List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'GRN List' }
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
        path: 'purchaselistview',
        component: PurchaselistViewComponent,
        data: {
          title: 'GRN List View',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'GRN List View' }
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
        path: 'purchasevoucher',
        component: PurchaseVoucherComponent,
        data: {
          title: 'Purchase Voucher',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Purchase Voucher' }
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
        path: 'imeilookup',
        component: ImeiLookupComponent,
        data: {
          title: 'IMEI Lookup',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'IMEI Lookup' }
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
        path: 'grn',
        component: GrnpurchaseComponent,
        data: {
          title: 'GRN',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'GRN' }
          ]
        }
      },
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
