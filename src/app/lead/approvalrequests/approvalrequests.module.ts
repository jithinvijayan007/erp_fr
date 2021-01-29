import { CardModule } from './../../card.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalrequestsRoutingModule } from './approvalrequests-routing.module';
import { ApprovalrequestsComponent } from './approvalrequests.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter } from '@angular/material/core';
// import { DateAdapter } from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    ApprovalrequestsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    CardModule


  ],
  declarations: [ApprovalrequestsComponent]
})
export class ApprovalrequestsModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('en-in'); // DD/MM/YYYY
  }
 }
