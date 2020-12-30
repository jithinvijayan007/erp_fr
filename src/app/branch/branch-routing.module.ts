import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddbranchComponent} from '././addbranch/addbranch.component'
import {BranchlistComponent} from '././branchlist/branchlist.component';
import { EditbranchComponent} from './editbranch/editbranch.component'

// const routes: Routes = [];

export const BranchRoutes: Routes = [
  {
    path: 'addbranch',
    component: AddbranchComponent
  },

  // {
  //   path: 'addbranch',
  //   // loadChildren: './addbranch/addbranch.module#AddbranchModule
  // },
  {
    path: 'branchlist',
    // loadChildren: './branchlist/branchlist.module#BranchlistModule'
    component: BranchlistComponent
  },
  {
    path: 'editbranch',
    // loadChildren: './editbranch/editbranch.module#EditbranchModule
    component:EditbranchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(BranchRoutes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
