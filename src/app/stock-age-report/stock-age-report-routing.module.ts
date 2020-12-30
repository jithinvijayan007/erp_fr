import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { StockAgeReportComponent } from './stock-age-report/stock-age-report.component';

const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'stockagereport',
        component:StockAgeReportComponent ,
        data: {
          title: 'stockagereport',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'stockagereport' }
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
export class StockAgeReportRoutingModule { }
