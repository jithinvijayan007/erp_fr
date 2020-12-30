import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { DailySalesReportComponent } from './daily-sales-report.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dailysalesreport',
        component: DailySalesReportComponent,
        data: {
          title: 'Daily Sales Report',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Daily Sales Report' }
          ]
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailySalesReportRoutingModule { }
