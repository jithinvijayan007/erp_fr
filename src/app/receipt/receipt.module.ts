import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from '../card.module'

import { ReceiptRoutingModule } from './receipt-routing.module';
import { AddreceiptComponent } from './addreceipt/addreceipt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule } from '@angular/material/datepicker';
import { ListreceiptComponent } from './listreceipt/listreceipt.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ViewreceiptComponent } from './viewreceipt/viewreceipt.component';
import { NgxSpinnerModule } from "ngx-spinner";import { ReceiptOrderListComponent } from './receipt-order-list/receipt-order-list.component';
import { CreditsettlementComponent } from './creditsettlement/creditsettlement.component';




@NgModule({
  declarations: [AddreceiptComponent, ListreceiptComponent, ViewreceiptComponent, ReceiptOrderListComponent, CreditsettlementComponent],
  imports: [
    CommonModule,
    ReceiptRoutingModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    Ng2SmartTableModule,
    CardModule,
    NgxSpinnerModule,
    MatCheckboxModule
  ],
 
})
export class ReceiptModule { }
