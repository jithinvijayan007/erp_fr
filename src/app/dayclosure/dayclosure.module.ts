import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DayclosureRoutingModule } from './dayclosure-routing.module';
import { DenominationComponent } from './denomination/denomination.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DayclosureListComponent } from './dayclosure-list/dayclosure-list.component';
import { CardModule } from '../card.module';

import { PositivePipe } from './positive.pipe';

@NgModule({
  declarations: [DenominationComponent, DayclosureListComponent,PositivePipe],
  imports: [
    CommonModule,
    DayclosureRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatDatepickerModule,
    CardModule
    
  ],

})
export class DayclosureModule { }
