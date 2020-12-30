
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { PurchaserequestRoutingModule } from './purchaserequest-routing.module';
import { PurchaserequestComponent } from './purchaserequest/purchaserequest.component';

@NgModule({
  declarations: [PurchaserequestComponent],
  imports: [
    CommonModule,
    PurchaserequestRoutingModule,
    MatDatepickerModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    MatTableModule
  ]
})
export class PurchaserequestModule { }
