import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseOrderViewComponent } from './purchase-order-view/purchase-order-view.component';
import { PurchaselistComponent } from './purchaselist/purchaselist.component';
import { PurchaselistViewComponent } from './purchaselist-view/purchaselist-view.component';
import { PurchaseVoucherComponent } from './purchase-voucher/purchase-voucher.component';
import { ImeiLookupComponent } from './imei-lookup/imei-lookup.component';
import { GrnpurchaseComponent } from './grnpurchase/grnpurchase.component';

@NgModule({
  declarations: [
    PurchaseOrderComponent,
    PurchaseOrderListComponent,
    PurchaseComponent,
    PurchaseOrderViewComponent,
    PurchaselistComponent,
    PurchaselistViewComponent,
    PurchaseVoucherComponent,
    ImeiLookupComponent,
    GrnpurchaseComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    Ng2SmartTableModule,
    MatRadioModule,
    MatTableModule
  ]
})
export class PurchaseModule { }
