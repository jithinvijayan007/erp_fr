import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemgroupaddComponent } from './itemgroupadd.component';

const routes: Routes = [
  {
    path: '',
    component: ItemgroupaddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemgroupaddRoutingModule { }
