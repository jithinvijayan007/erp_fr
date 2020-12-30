import { Routes } from '@angular/router';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AuthGuard } from '../auth.guard';



export const CategoryRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'addcategory',
        component: AddCategoryComponent,
        data: {
          title: 'Category',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Category' }
          ]
        }
      },
    ]
  }
];
