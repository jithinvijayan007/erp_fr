import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

// import { PriceRoutes } from './price.routing';



import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule } from '@angular/material/datepicker';
// import {MatNativeDateModule} from '@angular/material';                                                                                                                          
import { PricelistComponent } from './pricelist/pricelist.component';
import { PriceRoutingModule } from './price-routing.module';
import { AddpriceComponent,HistoryDialog } from './addprice/addprice.component';
import { EditpriceComponent,HistoryDialog1} from './editprice/editprice.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import { NgxSpinnerModule } from "ngx-spinner";import { PriceListReportComponent } from './price-list-report/price-list-report.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
// import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    PriceRoutingModule,
    // RouterModule.forChild(PriceRoutes),     
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
    Ng2SmartTableModule,
    MatDialogModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
    NgxSpinnerModule,
    NgbPaginationModule,
    CdkTreeModule,
    NgbModule

  ],
  entryComponents: [AddpriceComponent, HistoryDialog,HistoryDialog1],
  declarations: [    
    PricelistComponent, AddpriceComponent, EditpriceComponent,HistoryDialog,HistoryDialog1, PriceListReportComponent  
],
bootstrap: [AddpriceComponent],

})
export class PriceModule {}
