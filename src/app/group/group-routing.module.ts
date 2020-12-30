import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddgroupComponent } from './addgroup/addgroup.component';
import { ListgroupComponent } from './listgroup/listgroup.component';
import { ViewgroupComponent } from './viewgroup/viewgroup.component';
import { EditgroupComponent } from './editgroup/editgroup.component';
import { AuthGuard } from '../auth.guard';
const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'addgroup',
        component: AddgroupComponent,
        data: {
          title: 'add group ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'add group' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'listgroup',
        component: ListgroupComponent,
        data: {
          title: 'list group ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'list group' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'viewgroup',
        component: ViewgroupComponent,
        data: {
          title: 'view group ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'view group' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'editgroup',
        component: EditgroupComponent,
        data: {
          title: 'edit group ',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'edit group' }
          ]
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
