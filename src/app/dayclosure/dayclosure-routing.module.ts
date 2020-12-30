import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { DenominationComponent } from './denomination/denomination.component';
import { DayclosureListComponent } from './dayclosure-list/dayclosure-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dayclosure',
        component: DenominationComponent,
        data: {
          title: 'Day Closure',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Day Closure' }
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
        path: 'listdayclosure',
        component: DayclosureListComponent,
        data: {
          title: 'Day Closure List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Day Closure List' }
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
export class DayclosureRoutingModule { }
