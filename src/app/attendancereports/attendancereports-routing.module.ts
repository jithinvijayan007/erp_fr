import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpAttendanceComponent } from './emp-attendance/emp-attendance.component';
import { MonthlyattendanceComponent } from './monthlyattendance/monthlyattendance.component';
import { AuthGuard } from "../auth.guard";
import { AuditorAttendanceComponent } from './auditor-attendance/auditor-attendance.component';
import { MonthlyDownloadComponent } from './monthly-download/monthly-download.component';
import { EarlyLateComingReportComponent } from "./early-late-coming-report/early-late-coming-report.component";
import { ShiftReportsComponent } from './shift-reports/shift-reports.component';
import { ComboOffReportComponent } from './combo-off-report/combo-off-report.component';
const routes: Routes = [
  {
    path: 'dailyattendance',
    canActivate: [AuthGuard],
    component: EmpAttendanceComponent
  },
  {
    path: 'monthlyattendance',
    canActivate: [AuthGuard],
    component: MonthlyattendanceComponent
  },
  {
    path: 'auditorattendance',
    canActivate: [AuthGuard],
    component: AuditorAttendanceComponent
  },
  {
    path: 'monthlydownload',
    // canActivate: [AuthGuard],
    component: MonthlyDownloadComponent
  },
  {
    path: 'earlylatecomingreport',
    canActivate: [AuthGuard],
    component: EarlyLateComingReportComponent
  },
  {
    path: 'shift-reports',
    canActivate: [AuthGuard],
    component: ShiftReportsComponent
  },
  {
    path: 'combo-off-report',
    // canActivate: [AuthGuard],
    component: ComboOffReportComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendancereportsRoutingModule { }
