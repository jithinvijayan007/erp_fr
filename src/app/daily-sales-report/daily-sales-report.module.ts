import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailySalesReportRoutingModule } from './daily-sales-report-routing.module';
import { DailySalesReportComponent } from './daily-sales-report.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {MatChipsModule} from '@angular/material/chips';
import { MatChipInputEvent } from '@angular/material/chips';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatListModule} from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
// import { TitleCasePipe } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";import { SelectDropDownModule } from 'ngx-select-dropdown'



@NgModule({
  declarations: [DailySalesReportComponent],
  imports: [
    CommonModule,
    DailySalesReportRoutingModule,
    MatRadioModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatDatepickerModule,
    MatSelectModule,
    // TitleCasePipe,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    MatChipsModule,
    CdkTableModule,
    CdkTreeModule,
    MatListModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    NgxSpinnerModule,
    SelectDropDownModule
  ]
})
export class DailySalesReportModule { }
