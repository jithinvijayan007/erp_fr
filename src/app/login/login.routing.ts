import { Routes } from '@angular/router';
import { UserloginComponent } from './userlogin/userlogin.component';



export const LoginRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'userlogin',
        component: UserloginComponent,
        data: {
          title: 'Login',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Login' }
          ]
        }
      },
    ]
  }
];
