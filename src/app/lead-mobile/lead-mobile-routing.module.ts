import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEnquiryComponent } from './add-enquiry/add-enquiry.component';

const routes: Routes = [{
  path: 'add-enquiry',
  component:AddEnquiryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadMobileRoutingModule { }
