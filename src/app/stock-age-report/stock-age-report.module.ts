import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockAgeReportRoutingModule } from './stock-age-report-routing.module';
import { StockAgeReportComponent } from './stock-age-report/stock-age-report.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [StockAgeReportComponent],
  imports: [
    CommonModule,
    StockAgeReportRoutingModule,
     MatDatepickerModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatRadioModule, MatAutocompleteModule, MatCheckboxModule, MatChipsModule,MatTableModule,
     FormsModule, ReactiveFormsModule
  ]
})
export class StockAgeReportModule { }
