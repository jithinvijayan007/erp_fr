import { StocktransferComponent } from './stocktransfer/stocktransfer.component';
import { AuthGuard } from './../auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoodsretunlistComponent } from './goodsretunlist/goodsretunlist.component';
import { GoodsreturnviewComponent } from './goodsreturnview/goodsreturnview.component';
import { AddgoodsreturnComponent } from './addgoodsreturn/addgoodsreturn.component';

const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'stocktransfer',
        component: StocktransferComponent,
        data: {
          title: 'Stock Transfer',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Stock Transfer' }
          ]
        }
      },
      {
        path: 'goodsreturnlist',
        component: GoodsretunlistComponent,
        data: {
          title: 'Goods Return List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Goods Return List' }
          ]
        }
      },
      {
        path: 'goodsreturnview',
        component: GoodsreturnviewComponent,
        data: {
          title: 'Goods Return View',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Goods Return View' }
          ]
        }
      },
      {
        path: 'goodsreturn',
        component: AddgoodsreturnComponent,
        data: {
          title: 'Goods Return Add',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Goods Return Add' }
          ]
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewstocktransferRoutingModule { }
