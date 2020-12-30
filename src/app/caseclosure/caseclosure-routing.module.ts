import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CaseclosureDenominationComponent } from './caseclosure-denomination/caseclosure-denomination.component';
import { AuthGuard } from '../auth.guard';
import { CashclosureListComponent } from './cashclosure-list/cashclosure-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'caseclosure',
        component: CaseclosureDenominationComponent,
        data: {
          title: 'Case Closure',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Case Closure' }
          ]
        }
      },
      {
        path: 'cashclosure-list',
        component: CashclosureListComponent,
        data: {
          title: 'Cash Closure List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Cash Closure List' }
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
export class CaseclosureRoutingModule { }
