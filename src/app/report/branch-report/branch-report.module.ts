import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchReportRoutingModule } from './branch-report-routing.module';
import { BranchReportComponent } from './branch-report.component';
// import { CommoncomponentsModule } from '../../commoncomponents.module';

@NgModule({
  imports: [
    CommonModule,
    BranchReportRoutingModule,
    // CommoncomponentsModule
  ],
  declarations: [
    BranchReportComponent
  ]
})
export class BranchReportModule { }
