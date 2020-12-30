import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceviewComponent } from './invoiceview/invoiceview.component';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceRoutes } from './invoice.routing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SaleslistComponent } from './saleslist/saleslist.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ListinvoiceComponent } from './listinvoice/listinvoice.component';
import { InvoicedetailsComponent } from './invoicedetails/invoicedetails.component';
import { JioinvoiceviewComponent } from './jioinvoiceview/jioinvoiceview.component';
import { InvoiceprintComponent } from './invoiceprint/invoiceprint.component';
import { BallgameinvoiceComponent } from './ballgameinvoice/ballgameinvoice.component';
import { OffersaleslistComponent } from './offersaleslist/offersaleslist.component';
import { ServiceviewComponent } from './serviceview/serviceview.component';
import { ServicelistComponent } from './servicelist/servicelist.component';
import { GdpServiceviewComponent } from './gdp-serviceview/gdp-serviceview.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
// import { OnlyNumber } from '.././onlynumber.directive';
// import { OnlyInteger } from '.././onlyinteger.directive';
// import { OnlyAlphaNum } from '.././onlyalphanum.directive';
import { SalesreturnComponent } from './salesreturn/salesreturn.component';
import { ReturninvoiceComponent } from './returninvoice/returninvoice.component';
import { CardModule } from '../card.module';
import { InvoicecustomerComponent } from './invoicecustomer/invoicecustomer.component'
import { BajajListComponent } from './bajaj-list/bajaj-list.component';
import { BajajViewComponent } from './bajaj-view/bajaj-view.component';

import { ExchangeListComponent } from './exchange-list/exchange-list.component';
import { ExchangeViewComponent } from './exchange-view/exchange-view.component';
import { SalesReturnListComponent } from './sales-return-list/sales-return-list.component';
import { SalesreturnviewComponent } from './salesreturnview/salesreturnview.component';
import { ApproveListComponent } from './approve-list/approve-list.component';
import { NgxSpinnerModule } from "ngx-spinner";import { QuotationPrintComponent } from './quotation-print/quotation-print.component';
import { QuotationListComponent } from './quotation-list/quotation-list.component';
import { QuotationViewComponent } from './quotation-view/quotation-view.component';
import { ServiceinvoicelistComponent } from './serviceinvoicelist/serviceinvoicelist.component';
import { CreditapprovalslistComponent } from './creditapprovalslist/creditapprovalslist.component';
import { SezInvoiceComponent } from './sez-invoice/sez-invoice.component';
import { SpecialsaleslistComponent } from './specialsaleslist/specialsaleslist.component';
import { SpecialinvoiceviewComponent } from './specialinvoiceview/specialinvoiceview.component';
import { OnlinesalesorderlistComponent } from './onlinesalesorderlist/onlinesalesorderlist.component';
import { OnlinesalesviewComponent } from './onlinesalesview/onlinesalesview.component';

@NgModule({
    declarations: [InvoiceviewComponent, SaleslistComponent, ListinvoiceComponent, InvoicedetailsComponent, JioinvoiceviewComponent, InvoiceprintComponent, BallgameinvoiceComponent, OffersaleslistComponent, ServiceviewComponent, ServicelistComponent, GdpServiceviewComponent, SalesreturnComponent, ReturninvoiceComponent, InvoicecustomerComponent, ExchangeListComponent, ExchangeViewComponent, BajajListComponent, BajajViewComponent, SalesReturnListComponent, SalesreturnviewComponent, ApproveListComponent, QuotationPrintComponent, QuotationListComponent, QuotationViewComponent, ServiceinvoicelistComponent, CreditapprovalslistComponent, SezInvoiceComponent, SpecialsaleslistComponent, SpecialinvoiceviewComponent, OnlinesalesorderlistComponent, OnlinesalesviewComponent],
  imports: [
    NgxSpinnerModule,
    CommonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatMenuModule,
    Ng2SmartTableModule,
    RouterModule.forChild(InvoiceRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTableModule,
    // MatTableDataSource,
    MatPaginatorModule,
    MatSortModule,
    CardModule,
    // OnlyNumber,
    // OnlyInteger
  ],
  exports: [
    // OnlyNumber,
    // OnlyInteger,
    // OnlyAlphaNum
],

})
export class InvoiceModule { }
