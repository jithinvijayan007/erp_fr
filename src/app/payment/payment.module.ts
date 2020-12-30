import { NgModule } from '@angular/core';
import {AddpaymentComponent} from './addpayment/addpayment.component'
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PaymentRoutes } from './payment.routing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ListpaymentComponent } from './listpayment/listpayment.component';
import { ViewpaymentComponent } from './viewpayment/viewpayment.component';
import { EditpaymentComponent } from './editpayment/editpayment.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [AddpaymentComponent, ListpaymentComponent, ViewpaymentComponent, EditpaymentComponent],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    Ng2SmartTableModule,
    RouterModule.forChild(PaymentRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,    
  ]
})
export class PaymentModule { }
