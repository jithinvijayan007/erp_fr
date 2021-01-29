import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEnquiryComponent } from './add-enquiry/add-enquiry.component';
import { ViewmobileleadComponent } from './viewmobilelead/viewmobilelead.component';

const routes: Routes = [{
  path: 'add-enquiry',
  component:AddEnquiryComponent
},{
  path: 'view-enquiry',
  component:ViewmobileleadComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadMobileRoutingModule { }
