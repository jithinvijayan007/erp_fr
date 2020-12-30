import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LedgerStatementComponent } from "./ledger-statement/ledger-statement.component";
import { AuthGuard } from '../auth.guard';
import { CashBookComponent } from './cash-book/cash-book.component';

export const LedgerRoutes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'ledgerstatement',
        component: LedgerStatementComponent,
        data: {
          title: 'Ledger Statement',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Ledger Statement' }
          ]
        }
      }]
    },
    {
      path: '',
      // canActivate: [AuthGuard],
      children: [
        {
          path: 'cashbook',
          component: CashBookComponent,
          data: {
            title: 'Cash Book',
            urls: [
              { title: 'Dashboard', url: '/dashboard' },
              { title: 'Cash Book' }
            ]
          }
        }]
      }
];



export class LedgerRoutingModule { }
