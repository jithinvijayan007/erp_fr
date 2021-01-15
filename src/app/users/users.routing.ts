import { Routes } from '@angular/router';

// import { AdduserComponent } from './adduser/adduser.component';
// import { UserlistComponent } from './userlist/userlist.component';
import { ViewuserComponent } from './viewuser/viewuser.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { EdituserComponent } from './edituser/edituser.component';
import { UsergroupaddComponent } from './usergroupadd/usergroupadd.component';
// import { Addemployee1Component } from './addemployee1/addemployee1.component'
import { AddemployeeComponent } from './addemployee/addemployee.component';
import { ListemployeeComponent } from './listemployee/listemployee.component';
import { EditemployeeComponent } from './editemployee/editemployee.component';
import { ViewemployeeComponent } from './viewemployee/viewemployee.component';

// import { EditemployeeComponent } from './editemployee/editemployee.component';

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
        component: ListemployeeComponent,
        data: {
          title: 'employee list ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'employee list' }
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

  // {
  //   path: '',
  //   children: [
  //     {
  //       path: 'edituser',
  //       component: EdituserComponent,
  //       data: {
  //         title: 'user edit ',
  //         urls: [
  //           { title: 'Dashboard', url: '/dashboard' },
  //           { title: 'user edit' }
  //         ]
  //       }
  //     }
  //   ]
  // },

  {
    path: '',
    children: [
      {
        path: 'editemployee',
        component: EditemployeeComponent,
        data: {
          title: 'employee edit ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'employee edit' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'viewemployee',
        component: ViewemployeeComponent,
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
  
  
  


];
