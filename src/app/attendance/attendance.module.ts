import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddshiftComponent } from './addshift/addshift.component';
import { ListshiftComponent } from './listshift/listshift.component';
import { ViewshiftComponent } from './viewshift/viewshift.component';
import { EditshiftComponent } from './editshift/editshift.component';
import { AddleavetypeComponent } from './addleavetype/addleavetype.component';
import { ListleavetypeComponent } from './listleavetype/listleavetype.component';
import { ShiftAllocationComponent } from './shift-allocation/shift-allocation.component';
import { ManualAttendanceComponent } from './manual-attendance/manual-attendance.component';
import { ManualAttendanceListComponent } from './manual-attendance-list/manual-attendance-list.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
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
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { ShiftExemptionComponent } from './shift-exemption/shift-exemption.component';
import { ShiftExemptionListComponent } from './shift-exemption-list/shift-exemption-list.component';
import { ShiftExemptionViewComponent } from './shift-exemption-view/shift-exemption-view.component';
import { ComboOffListComponent } from './combo-off-list/combo-off-list.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { WeekOffListComponent } from './week-off-list/week-off-list.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [
    AddshiftComponent,
    ListshiftComponent,
    ViewshiftComponent,
    EditshiftComponent,
    AddleavetypeComponent,
    ListleavetypeComponent,
    ShiftAllocationComponent,
    ManualAttendanceComponent,
    ManualAttendanceListComponent,
    LateHoursComponent,
    ComboOffComponent,
    LeavereportComponent,
    ShiftAllocationNewComponent,
    ShiftAllocationNewListComponent,
    LesshourrequestComponent,
    LesshourrequestListComponent,
    LesshourrequestedListComponent,
    OndutyRequestedListComponent,
    MakeLeaveComponent,
    ShiftExemptionComponent,
    ShiftExemptionListComponent,
    ShiftExemptionViewComponent,
    ComboOffListComponent,
    WeekOffListComponent
  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    MatTabsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatChipsModule,
    MatIconModule,
    SelectDropDownModule,
    NgxSpinnerModule

  ],
  exports:[
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
  ]
})
export class AttendanceModule { }
