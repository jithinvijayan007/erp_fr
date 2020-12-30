import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockrequestComponent } from './stockrequest/stockrequest.component';
import { AuthGuard } from '../auth.guard';
import { StockrequestlistComponent } from './stockrequestlist/stockrequestlist.component';
import { StockrequestviewComponent } from './stockrequestview/stockrequestview.component';
import { RequestedlistComponent } from './requestedlist/requestedlist.component';


export const StockRequestRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'stockrequest',
        component: StockrequestComponent,
        data: {
          title: 'Stock Request',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Stock Request' }
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
        path: 'stockrequestlist',
        component: StockrequestlistComponent,
        data: {
          title: 'Stock Request',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Stock Request' }
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
        path: 'stockrequestview',
        component: StockrequestviewComponent,
        data: {
          title: 'Stock Request',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Stock Request' }
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
        path: 'requestedlist',
        component: RequestedlistComponent,
        data: {
          title: 'Stock Request',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Stock Request' }
          ]
        }
      },
    ]
  },
  // {
  //   path: 'stockrequest',
  //   component: StockrequestComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'stockrequestlist',
  //   component: StockrequestlistComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'stockrequestview',
  //   component: StockrequestviewComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'requestedlist',
  //   component: RequestedlistComponent,
  //   canActivate: [AuthGuard],
  // }
];
@NgModule({
  imports: [RouterModule.forChild(StockRequestRoutes)],
  exports: [RouterModule]
})
export class StockrequestRoutingModule { }
