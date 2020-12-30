import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { CouponRoutes } from './coupon.routing';



import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {MatDatepickerModule } from '@angular/material/datepicker';
// import {MatNativeDateModule} from '@angular/material';
import { AddcouponComponent } from './addcoupon/addcoupon.component';
import { ListcouponComponent } from './listcoupon/listcoupon.component';
import { ViewcouponComponent } from './viewcoupon/viewcoupon.component';
import { EditcouponComponent } from './editcoupon/editcoupon.component';
import { NgxSpinnerModule } from "ngx-spinner";






@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    RouterModule.forChild(CouponRoutes),     
    NgMultiSelectDropDownModule.forRoot(),
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    // MatNativeDateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatRadioModule,
    NgxSpinnerModule,
    Ng2SmartTableModule
   


  ],
  declarations: [
    
  AddcouponComponent,
    
  ListcouponComponent,
    
  ViewcouponComponent,
    
  EditcouponComponent]
})
export class CouponModule {}
