import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentComponent } from "./department/department.component";
import { AuthGuard } from "../auth.guard";
const routes: Routes = [
  {
    path: 'department',
    canActivate: [AuthGuard],
    component: DepartmentComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
