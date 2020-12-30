import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CmRequestViewComponent } from './cm-request-view/cm-request-view.component';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestViewComponent } from './request-view/request-view.component';
const routes: Routes = [
  {
    path: 'request-list',
    component: RequestListComponent,
  },
  {
    path: 'request-view',
    component: RequestViewComponent,
  },
  {
    path: 'cm-request-view',
    component: CmRequestViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpareRequestRoutingModule { }
