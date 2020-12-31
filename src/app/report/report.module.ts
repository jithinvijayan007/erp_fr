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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

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



@NgModule({
  declarations: [StockReportComponent, ClientStatementComponent, DetailsSalesreportComponent, SmartChoiceReportComponent, GdpGdewReportComponent, RechargeProfitReportComponent, ProductProfitReportComponent,PurchaseReportComponent,SmartChoiceSaleComponent,StockHistoryComponent, CreditsalereportComponent,DetailedModelWiseSalesReportComponent, EmisalesreportComponent, DayclosurereportComponent],
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
  ]
})
export class ReportModule { }