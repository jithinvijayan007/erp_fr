import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyPermissionsComponent } from './company-permissions.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'companypermissions',
        component: CompanyPermissionsComponent,
        data: {
          title: 'company permissions',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'company permissions' }
          ]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyPermissionsRoutingModule { }
