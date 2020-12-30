import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StocktransferRoutingModule } from './stocktransfer-routing.module';
import { StocktransferComponent } from './stocktransfer/stocktransfer.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TransferlistComponent } from './transferlist/transferlist.component';
import { TransferredlistComponent } from './transferredlist/transferredlist.component';
import { TransferviewComponent } from './transferview/transferview.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import {Observable} from 'rxjs/Observable'
import { NgxSpinnerModule } from "ngx-spinner";import { RequestTransferComponent } from './request-transfer/request-transfer.component';
import { ImeiScanComponent } from './imei-scan/imei-scan.component';
import { ImeiBatchScanComponent } from './imei-batch-scan/imei-batch-scan.component';
import { DirectTransferListComponent } from './direct-transfer-list/direct-transfer-list.component';
import { DirectTransferViewComponent } from './direct-transfer-view/direct-transfer-view.component';
import { StocktransferReportComponent } from './stocktransfer-report/stocktransfer-report.component';
import { SelectDropDownModule } from 'ngx-select-dropdown'
@NgModule({
  declarations: [StocktransferComponent, TransferlistComponent, TransferredlistComponent, TransferviewComponent, RequestTransferComponent, ImeiScanComponent, ImeiBatchScanComponent, DirectTransferListComponent, DirectTransferViewComponent, StocktransferReportComponent],
  imports: [
    CommonModule,
    StocktransferRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    Ng2SmartTableModule,
    MatTableModule,
    MatRadioModule,
    MatCheckboxModule,
    NgxSpinnerModule,
    SelectDropDownModule
  ]
})
export class StocktransferModule { }
