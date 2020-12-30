import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdditemcategoryComponent } from './additemcategory.component'
const routes: Routes = [
  {
    path: '',
    component: AdditemcategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdditemcategoryRoutingModule { }
