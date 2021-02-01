import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchReportRoutingModule } from './branch-report-routing.module';
import { BranchReportComponent } from './branch-report.component';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
// import { LogoComponent } from 'src/app/a2-components/logo/logo.component';
// import { CommoncomponentsModule } from '../../commoncomponents.module';

@NgModule({
  imports: [
    CommonModule,
    BranchReportRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
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
    MatChipsModule,
    // CommoncomponentsModule
  ],
  declarations: [
    BranchReportComponent,
    // LogoComponent
  ]
})
export class BranchReportModule { }
