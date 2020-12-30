import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'userlog',
      component: UserListComponent,
      data: {
        title: 'User Tracker',
        urls: [
          { title: 'Dashboard', url: '/dashboard' },
          { title: 'User Tracker' }
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
export class UserTrackRoutingModule { }
