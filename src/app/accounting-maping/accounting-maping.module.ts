import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountingMapingRoutingModule } from './accounting-maping-routing.module';
import { AddAccoutingComponent } from './add-accouting/add-accouting.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ListAccoutingComponent } from './list-accouting/list-accouting.component';
import { EditAccountingComponent } from './edit-accounting/edit-accounting.component';

@NgModule({
  declarations: [AddAccoutingComponent, ListAccoutingComponent, EditAccountingComponent],
  imports: [
    CommonModule,
    AccountingMapingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MatInputModule, MatButtonModule, MatSelectModule, MatIconModule,
    MatAutocompleteModule,
    MatTableModule
  ]
})
export class AccountingMapingModule { }
