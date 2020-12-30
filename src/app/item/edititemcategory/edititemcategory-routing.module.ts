import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EdititemcategoryComponent } from './edititemcategory.component'
const routes: Routes = [
  {
    path:'',
    component: EdititemcategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EdititemcategoryRoutingModule { }
