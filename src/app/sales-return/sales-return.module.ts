import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesReturnRoutingModule } from './sales-return-routing.module';
import { SalesListComponent } from './sales-list/sales-list.component';
import { SalesviewComponent } from './salesview/salesview.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [SalesListComponent, SalesviewComponent],
  imports: [
    CommonModule,
    SalesReturnRoutingModule,
    MatRadioModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatMenuModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule
    
  ]
})
export class SalesReturnModule { }
