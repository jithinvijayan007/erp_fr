import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { ListStockAckComponent } from './list-stock-ack/list-stock-ack.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewStockAckComponent } from './view-stock-ack/view-stock-ack.component';
import { ListBranchStockComponent } from './list-branch-stock/list-branch-stock.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StockPredictionComponent } from './stock-prediction/stock-prediction.component';
import { NonsalableComponent } from './nonsalable/nonsalable.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [
    ListStockAckComponent,
    ViewStockAckComponent,
    ListBranchStockComponent,
    StockPredictionComponent,
    NonsalableComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    MatDatepickerModule,
    MatInputModule,
    FormsModule, 
    Ng2SmartTableModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgbModule,
    MatChipsModule,
    DragDropModule,
    NgxSpinnerModule    // CdkDragDrop, 
    // moveItemInArray,
    //  transferArrayItem
    // MatNativeDateModule,

  ],
  // exports:[
  //   CdkDragDrop, 
  //   moveItemInArray,
  //   transferArrayItem
  // ]
})
export class StockModule { }
