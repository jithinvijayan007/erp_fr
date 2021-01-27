
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from 'app/a2-components/badge/badge.component';
import { AlertComponent } from 'app/a2-components/alert/alert.component';
// import { AddcustomerModule } from 'app/console/contact/addcustomer/addcustomer.module';
// import { PageAddcustomerComponent } from 'app/console/contact/addcustomer/addcustomer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatSelectModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatTableModule,
  MatPaginatorModule,
  MatRadioModule,
  MatSortModule,
  MatTooltipModule,
  DateAdapter,
  MatProgressSpinnerModule,
} from '@angular/material';
import { CardModule } from 'app/card.module';
import { EllipsisPipe } from './console/ellipsis.pipe';
import { CeilPipe } from './console/ceil.pipe';
import { Daterangepicker } from 'ng2-daterangepicker';
import { DateRangePicker3Component } from './pages/date-range-picker-3/date-range-picker-3.component';
import { ChartsModule } from 'ng2-charts';
import { StarRatingModule } from 'angular-star-rating';
import { RangePipe } from './console/range.pipe';
import { MapToArray } from './console/maptoarray.pipe';
import { NgxEchartsModule } from 'ngx-echarts';
import { PaseFloatPipe } from './console/pase-float.pipe';
import { SpinnerComponent } from './console/spinner/spinner/spinner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    CardModule,
    MatButtonModule,
    Daterangepicker,
    MatChipsModule,
    MatAutocompleteModule,
    ChartsModule,
    MatTableModule,
    MatPaginatorModule,
    StarRatingModule,
    NgxEchartsModule,
    MatRadioModule,
    MatSortModule,
    MatProgressSpinnerModule
    
  ],
  declarations: [
    BadgeComponent,
    AlertComponent,
    // PageAddcustomerComponent,
    EllipsisPipe,
    CeilPipe,
    RangePipe,
    MapToArray,
    DateRangePicker3Component,
    PaseFloatPipe,
    SpinnerComponent

  ],
  exports: [
    BadgeComponent,
    AlertComponent,
    // PageAddcustomerComponent,
    EllipsisPipe,
    CeilPipe,
    RangePipe,
    MapToArray,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    Daterangepicker,
    DateRangePicker3Component,
    MatAutocompleteModule,
    ChartsModule,
    CardModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    StarRatingModule,
    NgxEchartsModule,
    MatRadioModule,
    MatSortModule,
    MatTooltipModule,
    SpinnerComponent

  ]
})
export class CommoncomponentsModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('en-in'); // DD/MM/YYYY
  }
}