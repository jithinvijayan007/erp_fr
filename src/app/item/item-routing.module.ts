import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdditemcategoryComponent} from '././additemcategory/additemcategory.component'
import { ItemcategorylistComponent } from '././itemcategorylist/itemcategorylist.component';
import { ItemgroupaddComponent } from './itemgroupadd/itemgroupadd.component'
import { ItemgrouplistComponent } from './itemgrouplist/itemgrouplist.component'
import { from } from 'rxjs';
export const ItemRoutes: Routes = [
  {
    path: 'additemcategory',
    loadChildren: './additemcategory/additemcategory.module#AdditemcategoryModule'
  },
  {
    path: 'additemgroup',
    loadChildren: './itemgroupadd/itemgroupadd.module#ItemgroupaddModule'
  },
  {
    path: 'additem',
    loadChildren: './additem/additem.module#AdditemModule'
  },
  {
    path: 'itemgrouplist',
    component: ItemgrouplistComponent
  },
  {
    path: 'itemcategorylist',
    loadChildren: './itemcategorylist/itemcategorylist.module#ItemcategorylistModule'
  },
  {
    path: 'edititemcategory',
    loadChildren: './edititemcategory/edititemcategory.module#EdititemcategoryModule'
  },
  {
    path: 'itemlist',
    loadChildren: './itemlist/itemlist.module#ItemlistModule'
  },

];


@NgModule({
  imports: [RouterModule.forChild(ItemRoutes)],
  exports: [RouterModule]
})
export class ItemRoutingModule { }
