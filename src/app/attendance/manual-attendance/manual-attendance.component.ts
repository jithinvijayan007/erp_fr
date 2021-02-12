import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { FormControl } from '@angular/forms';
import Swal from "sweetalert2";
import { Router  } from "@angular/router";
import * as moment from "moment";
import { NgxSpinnerService } from 'ngx-spinner';
// import {OWL_DATE_TIME_FORMATS, DateTimeAdapter,OWL_DATE_TIME_LOCALE} from "ng-pick-datetime";
// import { MomentDateTimeAdapter } from "ng-pick-datetime-moment";

// export const MY_CUSTOM_FORMATS = {
//   parseInput: 'LL LT',
//   fullPickerInput: 'LL LT',
//   datePickerInput: 'LL',
//   timePickerInput: 'LT',
//   monthYearLabel: 'MMM YYYY',
//   dateA11yLabel: 'LL',
//   monthYearA11yLabel: 'MMMM YYYY',
// };

@Component({
  selector: 'app-manual-attendance',
  templateUrl: './manual-attendance.component.html',
  styleUrls: ['./manual-attendance.component.css'],
  providers: [ 
    // { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    // {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
],
})
export class ManualAttendanceComponent implements OnInit {


  manualAttendanceAction='save';
  intEmployeeId=null;
  timePunchStart;
  timePunchEnd;
  datOfAttendance;
  lstEmployeeData=[];
  selectedEmployee='';
  strEmployee='';
  selectedEmployeeId=null;
  strReason;
  searchEmployee: FormControl = new FormControl();

  constructor(
    private serverService: ServerService,
    public router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {

    //--------------------employee list typeahead -------------------//
    this.searchEmployee.valueChanges
      // .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstEmployeeData = [];
        } else {
          if (strData.length >= 1) {
            this.serverService
              .postData('attendance_fix/user_typeahead/', { strTerm: strData })
              .subscribe(
                (response) => {
                  this.lstEmployeeData = response['data'];
                }
              );
          }
        }
      }
      ); 
    //--------------------employee list typeahead ends -------------------//
  }



  employeeChanged(item){

    
    
    this.selectedEmployee=item.strUserCode;
    this.selectedEmployeeId=item.intId;

  }
  employeeChange(){  
    
    
    if(this.selectedEmployee!=this.strEmployee){
      this.selectedEmployee='';
      this.selectedEmployeeId=null;
    }
  }

  saveAttendance() {
    let dctTempData={};
    let datCurrent= new Date;    

    if(!this.selectedEmployeeId){
      Swal.fire("Error!","Select Employee","error");
      return false;
    }
    else if(!this.datOfAttendance) {
      Swal.fire("Error!","Select Date","error");
      return false;
    }
    else if(this.datOfAttendance>datCurrent){
      Swal.fire("Error!","Select Valid Date","error");
      return false;
    }
    else if(!this.timePunchStart){
      Swal.fire("Error!","Select Valid Punch In Time","error");
      return false;
    }
    else if(!this.timePunchEnd){
      Swal.fire("Error!","Select Valid Punch Out Time","error");
      return false;
    }
    else if(this.timePunchStart>this.timePunchEnd){
      Swal.fire("Error!","Start time should be less than end time","error");
      return false;
    }
    else if(!this.strReason){
      Swal.fire("Error!","Enter reason","error");
      return false;
    }

    dctTempData['intEmployeeId']=this.selectedEmployeeId;
    dctTempData['timeStart']=this.timePunchStart;
    dctTempData['timeEnd']=this.timePunchEnd;
    dctTempData['datAttendance']=moment(this.datOfAttendance).format('YYYY-MM-DD');
    dctTempData['strReason']=this.strReason;

    this.spinner.show();
    this.serverService.postData('attendance_fix/fix/',dctTempData)
    .subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status === 1) {
          Swal.fire('Data saved successfully');

          // localStorage.setItem("groupAction","save");
          this.router.navigate(["/attendance/manualattendancelist"]);

        } else if (response.status === 0) {
            Swal.fire("Error!",response['reason'],"error");
        }

      },
    (error) => {
      this.spinner.hide();

    });

  }

  clearFields() {
    this.intEmployeeId=null;
    this.timePunchStart=null;
    this.timePunchEnd=null;
    this.datOfAttendance=null;
    this.lstEmployeeData=[];
    this.selectedEmployee='';
    this.strEmployee='';
    this.selectedEmployeeId=null;
    this.strReason=''
  }

}
