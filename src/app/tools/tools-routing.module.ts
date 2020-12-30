import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetToolsComponent } from './set-tools/set-tools.component';
import { ToolsListComponent } from './tools-list/tools-list.component';
import { ViewToolsComponent } from './view-tools/view-tools.component';
import { AuthGuard } from '../auth.guard';
import { SetAddDeductComponent } from './set-add-deduct/set-add-deduct.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'list-tools',
        component: ToolsListComponent,
        data: {
          title: 'Admin Setting',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Admin Setting' }
          ]
        }
      },
      {
        path: 'set-tools',
        component: SetToolsComponent,
        data: {
          title: 'Set Tools',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Set Tools' }
          ]
        }
      },
      {
        path: 'view-tools',
        component: ViewToolsComponent,
        data: {
          title: 'View Tools',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'View Tools' }
          ]
        }
      },
      {
        path: 'set-add-deduct',
        component: SetAddDeductComponent,
        data: {
          title: 'Set Addition Deduction',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Set Addition Deduction' }
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
export class ToolsRoutingModule { }
