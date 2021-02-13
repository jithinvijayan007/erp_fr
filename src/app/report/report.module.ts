import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { StockReportComponent } from './stock-report/stock-report.component';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import { MatChipInputEvent } from '@angular/material/chips';
import {MatListModule} from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { DateRangePicker3Component } from '../pages/date-range-picker-3/date-range-picker-3.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";import { ClientStatementComponent } from './client-statement/client-statement.component';
import { DetailsSalesreportComponent } from './details-salesreport/details-salesreport.component';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import { SmartChoiceReportComponent } from './smart-choice-report/smart-choice-report.component';
import { GdpGdewReportComponent } from './gdp-gdew-report/gdp-gdew-report.component';
import { RechargeProfitReportComponent } from './recharge-profit-report/recharge-profit-report.component';
import { ProductProfitReportComponent } from './product-profit-report/product-profit-report.component';
import { SmartChoiceSaleComponent } from './smart-choice-sale/smart-choice-sale.component';
import { StockHistoryComponent } from './stock-history/stock-history.component';
import { DetailedModelWiseSalesReportComponent } from './detailed-model-wise-sales-report/detailed-model-wise-sales-report.component';
import { CreditsalereportComponent } from './creditsalereport/creditsalereport.component';
import { EmisalesreportComponent } from './emisalesreport/emisalesreport.component';
import { DayclosurereportComponent } from './dayclosurereport/dayclosurereport.component';
import { BranchReportComponent } from './branch-report/branch-report.component';
import { MobilebranchsalesreportComponent } from './mobilebranchsalesreport/mobilebranchsalesreport.component';
import { ChartsModule } from 'ng2-charts';
// import { ChartsModule } from 'ng2-charts/ng2-charts';

import { ReportComponent } from './report.component';
import { ExcelService } from '../excel.service';
import { ProductReportSalesMobileComponent } from './product-report-sales-mobile/product-report-sales-mobile.component';
// import { ReportComponent } from './report2/report.component';
// import { from } from 'rxjs';
import { SalesproductivityreportComponent } from './salesproductivityreport/salesproductivityreport.component';



@NgModule({
  declarations: [
    
     
    BranchReportComponent,
    StockReportComponent,
    ClientStatementComponent,
    DetailsSalesreportComponent,
    SmartChoiceReportComponent,
    GdpGdewReportComponent,
    RechargeProfitReportComponent,
    ProductProfitReportComponent,
    PurchaseReportComponent,
    SmartChoiceSaleComponent,
    StockHistoryComponent,
    CreditsalereportComponent,
    DetailedModelWiseSalesReportComponent,
    EmisalesreportComponent,
    DayclosurereportComponent,
    MobilebranchsalesreportComponent,
    ReportComponent,
    DateRangePicker3Component,
    SalesproductivityreportComponent,
    ProductReportSalesMobileComponent
      ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SelectDropDownModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatRadioModule,
    MatIconModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    NgxSpinnerModule,
    CdkTableModule,
    CdkTreeModule,
    ChartsModule,
    NgxDaterangepickerMd.forRoot()
    // MatAutocomplete
    
  ],
  providers:[
    ReportComponent,
  ]
})
export class ReportModule { }
