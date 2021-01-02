import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { HierarchyComponent } from './hierarchy/hierarchy.component'

const routes: Routes = [
  {
  path: 'add',
  component: AddComponent
  },
  {
    path: 'add-location',
    component: AddComponent
  }, {
    path: 'hierarachy',
    component: HierarchyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HierarchyRoutingModule { }
