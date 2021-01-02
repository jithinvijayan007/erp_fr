import { Routes } from '@angular/router';

import { AdduserComponent } from './adduser/adduser.component';
import { UserlistComponent } from './userlist/userlist.component';
import { ViewuserComponent } from './viewuser/viewuser.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { EdituserComponent } from './edituser/edituser.component';
import { UsergroupaddComponent } from './usergroupadd/usergroupadd.component';
// import { Addemployee1Component } from './addemployee1/addemployee1.component'
import { AddemployeeComponent } from './addemployee/addemployee.component';

export const UsersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'adduser',
        component: AddemployeeComponent,
        data: {
          title: 'user Add',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'user Add' }
          ]
        }
      }
    ]
  },
  
  {
    path: '',
    children: [
      {
        path: 'listuser',
        component: UserlistComponent,
        data: {
          title: 'user list ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'user list' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'usergroupadd',
        component: UsergroupaddComponent,
        data: {
          title: 'add user group ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'add user group' }
          ]
        }
      }
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'viewuser',
        component: ViewuserComponent,
        data: {
          title: 'user view ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'user view' }
          ]
        }
      }
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'changeuserpass',
        component: ChangepasswordComponent,
        data: {
          title: 'user change password ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'user change password ' }
          ]
        }
      }
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'edituser',
        component: EdituserComponent,
        data: {
          title: 'user edit ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'user edit' }
          ]
        }
      }
    ]
  }
  


];
