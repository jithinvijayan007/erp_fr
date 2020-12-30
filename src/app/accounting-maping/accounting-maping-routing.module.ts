import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAccoutingComponent } from './add-accouting/add-accouting.component';
import { ListAccoutingComponent } from './list-accouting/list-accouting.component';
import { EditAccountingComponent } from './edit-accounting/edit-accounting.component';


const routes: Routes = [
  {
    path: 'addaccouting',
    component: AddAccoutingComponent
  },
  {
    path: 'listaccouting',
    component: ListAccoutingComponent
  },
  {
    path: 'editaccounting',
    component: EditAccountingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingMapingRoutingModule { }
