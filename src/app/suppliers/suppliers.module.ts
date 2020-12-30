import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SuppliersRoutes } from './suppliers.routing';



import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
// import { ListCompanyComponent } from './list-company/list-company.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {MatDatepickerModule } from '@angular/material/datepicker';
// import {MatNativeDateModule} from '@angular/material';
import { AddsupplierComponent } from './addsupplier/addsupplier.component';
import { ListsupplierComponent } from './listsupplier/listsupplier.component';
import { ViewsupplierComponent } from './viewsupplier/viewsupplier.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { EditsupplierComponent } from './editsupplier/editsupplier.component';
import { SupplierlogComponent } from './supplierlog/supplierlog.component';






@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    RouterModule.forChild(SuppliersRoutes),     
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
    Ng2SmartTableModule


  ],
  declarations: [
    
  AddsupplierComponent,
    
  ListsupplierComponent,
    
  ViewsupplierComponent,
    
  EditsupplierComponent,
    
  SupplierlogComponent]
})
export class SuppliersModule {}
