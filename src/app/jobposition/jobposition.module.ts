import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobpositionRoutingModule } from './jobposition-routing.module';
import { JobpositionComponent } from './jobposition/jobposition.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobpositionlistComponent } from './jobpositionlist/jobpositionlist.component';
import { JobpositioneditComponent } from './jobpositionedit/jobpositionedit.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [JobpositionComponent,JobpositionlistComponent,JobpositioneditComponent],
  imports: [
    CommonModule,
    JobpositionRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NgxSpinnerModule,
  ]
})
export class JobpositionModule { }
