import { Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';

import { AddCompanyComponent } from './add-company/addcompany.component';

export const CompanyRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'addcompany',
        canActivate: [AuthGuard],
        component: AddCompanyComponent,
        data: {
          title: 'Company Add',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Company Add' }
          ]
        }
      }
    ]
  }
];
