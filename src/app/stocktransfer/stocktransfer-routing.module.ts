import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { StocktransferComponent } from './stocktransfer/stocktransfer.component';
import { TransferlistComponent } from './transferlist/transferlist.component';
import { TransferredlistComponent } from './transferredlist/transferredlist.component';
import { TransferviewComponent } from './transferview/transferview.component';
import { RequestTransferComponent } from './request-transfer/request-transfer.component';
import { ImeiScanComponent } from './imei-scan/imei-scan.component';
import { ImeiBatchScanComponent } from './imei-batch-scan/imei-batch-scan.component';
import { DirectTransferViewComponent } from './direct-transfer-view/direct-transfer-view.component';
import { DirectTransferListComponent } from './direct-transfer-list/direct-transfer-list.component';
import { StocktransferReportComponent } from './stocktransfer-report/stocktransfer-report.component';

export const StockTransferRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'stocktransfer',
        component: StocktransferComponent,
        data: {
          title: 'Stock Transfer',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Stock Transfer' }
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
        path: 'transferlist',
        component: TransferlistComponent,
        data: {
          title: 'Stock Transfer',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Stock Transfer' }
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
        path: 'transferredlist',
        component: TransferredlistComponent,
        data: {
          title: 'Stock Transfer',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Stock Transfer' }
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
        path: 'transferview',
        component: TransferviewComponent,
        data: {
          title: 'Stock Transfer',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Stock Transfer' }
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
        path: 'requesttransfer',
        component: RequestTransferComponent,
        data: {
          title: 'Request Transfer',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Request Transfer' }
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
        path: 'directtransferlist',
        component: DirectTransferListComponent,
        data: {
          title: 'Direct Transfer List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Direct Transfer List' }
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
        path: 'directtransferview',
        component: DirectTransferViewComponent,
        data: {
          title: 'Direct Transfer View',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Direct Transfer View' }
          ]
        }
      },
    ]
  },
  {
    path: 'imei_scan',
    component: ImeiScanComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quick_transfer',
    component: ImeiBatchScanComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'stock_transfer_report',
    component: StocktransferReportComponent,
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'transferlist',
  //   component: TransferlistComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'transferredlist',
  //   component: TransferredlistComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'transferview',
  //   component: TransferviewComponent,
  //   canActivate: [AuthGuard],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(StockTransferRoutes)],
  exports: [RouterModule]
})
export class StocktransferRoutingModule { }
