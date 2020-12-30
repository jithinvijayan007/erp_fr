import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListStockAckComponent } from './list-stock-ack/list-stock-ack.component';
import { ViewStockAckComponent } from './view-stock-ack/view-stock-ack.component';
import { ListBranchStockComponent } from './list-branch-stock/list-branch-stock.component';
import { StockPredictionComponent } from './stock-prediction/stock-prediction.component';
import { NonsalableComponent } from './nonsalable/nonsalable.component';

const routes: Routes = [
  {
    path: 'list_stock',
    component: ListStockAckComponent
  },
  {
    path: 'view_stock_ack',
    component: ViewStockAckComponent
  },
  {
    path: 'list_branch_stock',
    component: ListBranchStockComponent
  },
  {
    path: 'stock_prediction_report',
    component: StockPredictionComponent
  },  
  {
    path: 'nonsalable',
    component: NonsalableComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { 
  
}
