import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ApprovalrequestsComponent} from './approvalrequests.component'
const routes: Routes = [
  {
    path:'',
    component : ApprovalrequestsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalrequestsRoutingModule { }
