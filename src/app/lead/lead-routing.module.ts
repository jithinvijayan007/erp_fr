import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadlistComponent } from './leadlist/leadlist.component';
// import { ViewleadComponent } from './viewlead/viewlead.component';

const routes: Routes = [{
  path: 'lead-list',
  component:LeadlistComponent
}
// ,{
// path: 'lead-view',
//   component:ViewleadComponent
// 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadRoutingModule { }
