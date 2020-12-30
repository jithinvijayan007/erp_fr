import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaseclosureRoutingModule } from './caseclosure-routing.module';
import { CaseclosureDenominationComponent } from './caseclosure-denomination/caseclosure-denomination.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CashclosureListComponent } from './cashclosure-list/cashclosure-list.component';
import { CardModule } from '../card.module';



@NgModule({
  declarations: [CaseclosureDenominationComponent, CashclosureListComponent],
  imports: [
    CommonModule,
    CaseclosureRoutingModule,
    MatFormFieldModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    CardModule
  ]
})
export class CaseclosureModule { }
