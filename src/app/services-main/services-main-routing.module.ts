import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddServiceComponent } from './add-service/add-service.component';
import { ListServiceComponent } from './list-service/list-service.component';
import { ViewServiceComponent } from './view-service/view-service.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  
  {
    path: 'add-service',
    component: AddServiceComponent,
  },
  {
    path: 'list-service',
    component: ListServiceComponent,
  },
  {
    path: 'view-service',
    component: ViewServiceComponent,
  } ,

  // {
  //   path: '',
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: 'add-service',
  //       component: AddServiceComponent,
  //       data: {
  //         title: 'Add Service',
  //         urls: [
  //           { title: 'Dashboard', url: '/dashboard' },
  //           { title: 'Add Service' }
  //         ]
  //       }
  //     },
  //   ]
  // },
  // {
  //   path: '',
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: 'list-service',
  //       component: AddServiceComponent,
  //       data: {
  //         title: 'Service List',
  //         urls: [
  //           { title: 'Dashboard', url: '/dashboard' },
  //           { title: 'Service List' }
  //         ]
  //       }
  //     },
  //   ]
  // },
  // {
  //   path: '',
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: 'view-service',
  //       component: AddServiceComponent,
  //       data: {
  //         title: 'View Service',
  //         urls: [
  //           { title: 'Dashboard', url: '/dashboard' },
  //           { title: 'View Service' }
  //         ]
  //       }
  //     },
  //   ]
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesMainRoutingModule { }
