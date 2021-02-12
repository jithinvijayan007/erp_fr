import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddshiftComponent} from './addshift/addshift.component';
import { ListshiftComponent } from './listshift/listshift.component';
import { EditshiftComponent } from './editshift/editshift.component'
import { ViewshiftComponent } from './viewshift/viewshift.component'
import { AddleavetypeComponent } from './addleavetype/addleavetype.component';
import { ListleavetypeComponent } from './listleavetype/listleavetype.component';
import { ShiftAllocationComponent } from "./shift-allocation/shift-allocation.component";
import { AuthGuard } from "../auth.guard";
import { ManualAttendanceComponent } from './manual-attendance/manual-attendance.component';
import { ManualAttendanceListComponent } from './manual-attendance-list/manual-attendance-list.component';
import { LateHoursComponent } from './late-hours/late-hours.component';
import { ComboOffComponent } from './combo-off/combo-off.component';
import { LeavereportComponent } from './leavereport/leavereport.component';
import { ShiftAllocationNewComponent } from './shift-allocation-new/shift-allocation-new.component';
import { ShiftAllocationNewListComponent } from './shift-allocation-new-list/shift-allocation-new-list.component';
import { LesshourrequestComponent } from './lesshourrequest/lesshourrequest.component';
import { LesshourrequestListComponent } from './lesshourrequest-list/lesshourrequest-list.component';
import { LesshourrequestedListComponent } from './lesshourrequested-list/lesshourrequested-list.component';
import { OndutyRequestedListComponent } from './onduty-requested-list/onduty-requested-list.component';
import { MakeLeaveComponent } from './make-leave/make-leave.component';
import { ShiftExemptionComponent } from './shift-exemption/shift-exemption.component';
import { ShiftExemptionListComponent } from './shift-exemption-list/shift-exemption-list.component';
import { ShiftExemptionViewComponent } from './shift-exemption-view/shift-exemption-view.component';
import { ComboOffListComponent } from './combo-off-list/combo-off-list.component';
import { WeekOffListComponent } from './week-off-list/week-off-list.component';
const routes: Routes = [
  {
    path: 'addshift',
    canActivate: [AuthGuard],
    component: AddshiftComponent,
  },
  {
    path: 'listshift',
    canActivate: [AuthGuard],
    component: ListshiftComponent,
  },
  {
    path: 'viewshift',
    canActivate: [AuthGuard],
    component: ViewshiftComponent,
  },
  {
    path: 'editshift',
    canActivate: [AuthGuard],
    component: EditshiftComponent,
  },
  {
    path: 'leavetype',
    canActivate: [AuthGuard],
    component: AddleavetypeComponent
  },
  {
    path: 'listleavetype',
    canActivate: [AuthGuard],
    component: ListleavetypeComponent
  },
  {
    path: 'shiftallocation',
    canActivate: [AuthGuard],
    component: ShiftAllocationComponent
  },
  {
    path: 'shiftallocation-new',
    canActivate: [AuthGuard],
    component: ShiftAllocationNewComponent
  },
  {
    path: 'manualattendance',
    canActivate: [AuthGuard],
    component: ManualAttendanceComponent
  },
  {
    path: 'manualattendancelist',
    canActivate: [AuthGuard],
    component: ManualAttendanceListComponent
  },
  {
    path: 'late-hours',
    canActivate: [AuthGuard],
    component: LateHoursComponent
  },
  {
    path: 'combooff',
    canActivate: [AuthGuard],
    component: ComboOffComponent
  },
  {
    path: 'leavelist',
    canActivate: [AuthGuard],
    component: LeavereportComponent
  },
  {
    path:'shiftallocationlist',
    canActivate:[AuthGuard],
    component:ShiftAllocationNewListComponent
  },
  {
    path:'late_hour_request',
    // canActivate:[AuthGuard],
    component:LesshourrequestComponent
  },
  {
    path:'late_hour_request_list',
    // canActivate:[AuthGuard],
    component:LesshourrequestListComponent
  },
  {
    path:'late_hour_requested_list',
    // canActivate:[AuthGuard],
    component:LesshourrequestedListComponent
  },
  {
    path:'onduty-requested-list',
    // canActivate:[AuthGuard],
    component:OndutyRequestedListComponent
  },
  {
    path:'make-attendance',
    // canActivate:[AuthGuard],
    component:MakeLeaveComponent
  },
  {
    path:'shift-exemption',
    // canActivate:[AuthGuard],
    component:ShiftExemptionComponent
  },
  {
    path:'shift-exemption-list',
    // canActivate:[AuthGuard],
    component:ShiftExemptionListComponent
  },
  {
    path:'shift-exemption-view',
    // canActivate:[AuthGuard],
    component:ShiftExemptionViewComponent
  },
  {
    path:'combo-off-list',
    // canActivate:[AuthGuard],
    component:ComboOffListComponent
  },
  {
    path:'week-off-list',
    // canActivate:[AuthGuard],
    component:WeekOffListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
