import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from '../card.module'
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxSpinnerModule } from "ngx-spinner";import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LedgerRoutingModule } from './ledger-routing.module';
import { LedgerStatementComponent } from './ledger-statement/ledger-statement.component';
import {MatDatepickerModule } from '@angular/material/datepicker';
import { LedgerRoutes } from './ledger-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { CashBookComponent } from './cash-book/cash-book.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [LedgerStatementComponent,CashBookComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    Ng2SmartTableModule,
    MatCheckboxModule,
    RouterModule.forChild(LedgerRoutes),
    CardModule,
    NgxSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class LedgerModule { }
