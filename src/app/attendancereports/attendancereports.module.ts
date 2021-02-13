import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

import { AttendancereportsRoutingModule } from './attendancereports-routing.module';
import { EmpAttendanceComponent } from './emp-attendance/emp-attendance.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MonthlyattendanceComponent } from './monthlyattendance/monthlyattendance.component';
import { AuditorAttendanceComponent } from './auditor-attendance/auditor-attendance.component';
import { MonthlyDownloadComponent } from './monthly-download/monthly-download.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EarlyLateComingReportComponent } from './early-late-coming-report/early-late-coming-report.component';
import { ShiftReportsComponent } from './shift-reports/shift-reports.component';
import { ComboOffReportComponent } from './combo-off-report/combo-off-report.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [EmpAttendanceComponent, MonthlyattendanceComponent, AuditorAttendanceComponent,MonthlyDownloadComponent, EarlyLateComingReportComponent, ShiftReportsComponent, ComboOffReportComponent],
  imports: [
    CommonModule,
    AttendancereportsRoutingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatOptionModule,
    MatSelectModule,
    // MatTabsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    // MatRadioModule,
    MatTooltipModule,
    MatSortModule,
    NgxSpinnerModule,
    MatChipsModule,
    MatIconModule
  ],
  providers:[TitleCasePipe]
})
export class AttendancereportsModule { }
