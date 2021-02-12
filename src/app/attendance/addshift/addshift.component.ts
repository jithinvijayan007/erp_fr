import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-addshift',
  templateUrl: './addshift.component.html',
  styleUrls: ['./addshift.component.css']
})
export class AddshiftComponent implements OnInit {

  strShiftName='';
  strShiftCode='';
  blnNightShift=false;
  timeShiftfrom;
  timeShiftTo;
  timeBreakFrom;
  timeBreakTo;
  timeBreakHrs;
  timeShedHrs;
  timeFullDay;
  timeHalfDay
  blnAllowances=false;
  intAllowanceAmount=null;
  strRemarks
  tabIndex=0;
  // time shift...
  strTimeShitfCode='';
  strTimeShiftName='';
  strTimeShiftRangeType='';
  intTimeRange=null;
  strTimeRemarks=''

  
  constructor(
    private serverService: ServerService,
    public router: Router,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit() {
  }

  saveShift(){



    
    let dctTempData={}
    if(!this.strShiftCode){
      Swal.fire('Error!', 'Enter Shift Code', 'error');
      return false;
    }
    else if ( this.strShiftName == null || this.strShiftName.trim() === '') {
      Swal.fire('Error!', 'Enter Shift Name', 'error');
      return false
    } 
    else if(!this.timeShiftfrom){
      Swal.fire('Error!', 'Enter Valid Shift Start time', 'error');
      return false;
    }
    else if(this.timeShiftfrom==undefined){
      Swal.fire('Error!', 'Enter Valid Shift Start time', 'error');
      return false;
    }
    else if(!this.timeShiftTo){
      Swal.fire('Error!', 'Enter Valid Shift End time', 'error');
      return false;
    }
    else if(this.timeShiftTo==undefined){
      Swal.fire('Error!', 'Enter Valid Shift End time', 'error');
      return false;
    }
    else if(this.timeShiftfrom<"15:00" && this.timeShiftfrom>this.timeShiftTo){
      Swal.fire('Error!', 'Enter valid shift start time and end time', 'error');
      return false;

    }
    else if(this.timeShiftfrom>"15:00" && this.timeShiftTo>"10:00"){
      Swal.fire('Error!', 'Enter valid shift start time and end time', 'error');
      return false;
    }
    else if(!this.timeBreakFrom && this.timeBreakTo){
      Swal.fire('Error!', 'Enter Valid Break Start time', 'error');
      return false;
    }
    else if(!this.timeBreakTo && this.timeBreakFrom){
      Swal.fire('Error!', 'Enter Valid Break End time', 'error');
      return false;
    }
    if(this.timeBreakFrom && this.timeBreakTo){
      if(this.timeBreakFrom<"23:00" && this.timeBreakFrom>this.timeBreakTo){
        Swal.fire('Error!', 'Enter Valid Break Start time and End time', 'error');
        return false;
      }
    }

    // if(!this.timeBreakHrs){
    //   Swal.fire('Error!', 'Enter Valid  Break Hours', 'error');
    //   return false;
    // }
    // else if(!this.timeShedHrs){
    //   Swal.fire('Error!', 'Enter Valid  Scheduled Hours', 'error');
    //   return false;
    // }
    // else if(!this.timeFullDay){
    //   Swal.fire('Error!', 'Enter Valid Full Day Hours', 'error');
    //   return false;
    // }
    // else if(!this.timeHalfDay){
    //   Swal.fire('Error!', 'Enter Valid  Half Day Hours', 'error');
    //   return false;
    // }
    else if(this.blnAllowances && !this.intAllowanceAmount) {
      Swal.fire('Error!', 'Enter Allowances amount', 'error');
      return false;
    }
    
    dctTempData['strName']=this.strShiftName;
    dctTempData['strCode']=this.strShiftCode;
    dctTempData['blnNight']=this.blnNightShift;
    dctTempData['timeShiftfrom']=this.timeShiftfrom;
    dctTempData['timeShiftTo']=this.timeShiftTo;
    dctTempData['timeBreakFrom']=this.timeBreakFrom;
    dctTempData['timeBreakTo']=this.timeBreakTo;
    dctTempData['timeBreakHrs']=this.timeBreakHrs;
    dctTempData['timeShedHrs']=this.timeShedHrs;
    dctTempData['timeFullDay']=this.timeFullDay
    dctTempData['timeHalfDay']=this.timeHalfDay
    dctTempData['blnAllowance']=this.blnAllowances;
    dctTempData['dblAllowance']=this.intAllowanceAmount;
    dctTempData['strRemark']=this.strRemarks;




    this.spinner.show();
    this.serverService.postData('shift_schedule/add_shift/',dctTempData)
    .subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status === 1) {
          Swal.fire("Success!",'Shift added successfully',"success");
          // localStorage.setItem("groupAction","save");
          this.router.navigate(["/attendance/listshift"]);

        } else if (response.status === 0) {
            Swal.fire(response['message']);
        }

      },
    (error) => {
      this.spinner.hide();

    });
    
  }
  clearFields(){
    
    this.strShiftName='';
    this.strShiftCode='';
    this.blnNightShift=false;
    this.timeShiftfrom=null;
    this.timeShiftTo=null;
    this.timeBreakFrom=null;
    this.timeBreakTo=null;
    this.timeBreakHrs=null;
    this.timeShedHrs=null;
    this.timeFullDay=null;
    this.timeHalfDay=null;
    this.blnAllowances=false;
    this.intAllowanceAmount=null;
    this.strRemarks='';
    this.strTimeShitfCode='';
    this.strTimeShiftName='';
    this.strTimeShiftRangeType='';
    this.intTimeRange=null;
    this.strTimeRemarks=''
  }
  saveTimeShift() {
    let dctTempData={};

    if(!this.strTimeShitfCode){
      Swal.fire("Error!","Enter Time Shift Code","error");
      return false;
    }
    else if(!this.strTimeShiftName) {
      Swal.fire("Error!","Enter Time Shift Name","error");
      return false;
    }
    else if(!this.strTimeShiftRangeType) {
      Swal.fire("Error!","Enter Time Shift Range Type","error");
      return false;
    }
    else if(!this.intTimeRange) {
      Swal.fire("Error!","Enter  Shift Hrs","error");
      return false;
    }
    if(this.tabIndex==0){
      dctTempData['blnTimeShift']=false;
    }
    else{
      dctTempData['blnTimeShift']=true;
    }
    dctTempData['strCode']=this.strTimeShitfCode;
    dctTempData['strName']=this.strTimeShiftName;
    dctTempData['strTimeShiftRangeType']=this.strTimeShiftRangeType;
    dctTempData['timeFullDay']=this.intTimeRange;
    dctTempData['strRemark']=this.strTimeRemarks;

    console.log(dctTempData,this.tabIndex);

    this.spinner.show();
    this.serverService.postData('shift_schedule/add_shift/',dctTempData)
    .subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status === 1) {
          Swal.fire("Success!",'Shift added successfully',"success");
          // localStorage.setItem("groupAction","save");
          this.router.navigate(["/attendance/listshift"]);

        } else if (response.status === 0) {
            Swal.fire(response['message']);
        }

      },
    (error) => {
      this.spinner.hide();

    });
    
  }

  tabChanged(event) {
    this.tabIndex=event;
  }

}
