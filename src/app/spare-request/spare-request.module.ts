import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpareRequestRoutingModule } from './spare-request-routing.module';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestViewComponent } from './request-view/request-view.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import {MatTabsModule} from '@angular/material/tabs';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
// import { ServerService } from '../../server.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { CmRequestViewComponent } from './cm-request-view/cm-request-view.component';


@NgModule({
  declarations: [RequestListComponent, RequestViewComponent, CmRequestViewComponent],
  imports: [
    CommonModule,
    SpareRequestRoutingModule,
    FormsModule,
    NgxDaterangepickerMd.forRoot(),
    MatTabsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
    // MatTableDataSource,
    // MatSort,
    // DatePipe,
    // Router,
    // NgxSpinnerService,
    
  ]
})
export class SpareRequestModule { }
