import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-editshift',
  templateUrl: './editshift.component.html',
  styleUrls: ['./editshift.component.css']
})
export class EditshiftComponent implements OnInit {

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
  strRemarks;
  intShiftId=null;
  lstShiftDetails=[]

  tabIndex=0;
  // time shift...
  strTimeShitfCode='';
  strTimeShiftName='';
  strTimeShiftRangeType='';
  intTimeRange=null;
  strTimeRemarks=''


  constructor(
    private serverService:ServerService,
    public router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.intShiftId=localStorage.getItem("intShiftEditId");
    this.getShiftDetails();
  }

  getShiftDetails(){

    this.lstShiftDetails=[];
    this.spinner.show();
    this.serverService.getData('shift_schedule/add_shift/?id='+this.intShiftId).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstShiftDetails=response['lst_shift_shedule'];

            if(this.lstShiftDetails[0].bln_time_shift){
              this.tabIndex=1
              this.strTimeShiftName=this.lstShiftDetails[0].vchr_name;
              this.strTimeShitfCode=this.lstShiftDetails[0].vchr_code;
              this.strTimeRemarks=this.lstShiftDetails[0].vchr_remark;
              this.intTimeRange=this.lstShiftDetails[0].time_full_day;
              this.strTimeShiftRangeType=this.lstShiftDetails[0].str_shift_type;


            }
            else{
              this.tabIndex=0;
              this.strShiftName=this.lstShiftDetails[0].vchr_name;
              this.strShiftCode=this.lstShiftDetails[0].vchr_code;
              this.blnNightShift=this.lstShiftDetails[0].bln_night;
              this.timeShiftfrom=this.lstShiftDetails[0].time_shift_from;
              this.timeShiftTo=this.lstShiftDetails[0].time_shift_to;
              this.timeBreakFrom=this.lstShiftDetails[0].time_break_from;
              this.timeBreakTo=this.lstShiftDetails[0].time_break_to;
              this.timeBreakHrs=this.lstShiftDetails[0].time_break_hrs;
              this.timeShedHrs=this.lstShiftDetails[0].time_shed_hrs;
              this.timeFullDay=this.lstShiftDetails[0].time_full_day;
              this.timeHalfDay=this.lstShiftDetails[0].time_half_day;
              this.blnAllowances=this.lstShiftDetails[0].bln_allowance;
              this.intAllowanceAmount=this.lstShiftDetails[0].dbl_allowance_amt;
              this.strRemarks=this.lstShiftDetails[0].vchr_remark;
            }








          }  
      },
      (error) => {  
        this.spinner.hide(); 
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });

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
  // else if(!this.timeBreakHrs){
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
  if(this.blnAllowances && !this.intAllowanceAmount) {
    Swal.fire('Error!', 'Enter Allowances amount', 'error');
    return false;
  }
  if(this.timeBreakFrom==''){ this.timeBreakFrom=null; };
  if(this.timeBreakTo==''){ this.timeBreakTo=null };
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
  dctTempData['intId']=this.intShiftId;




  this.spinner.show();
  this.serverService.putData('shift_schedule/add_shift/',dctTempData)
  .subscribe(
    (response) => {
      this.spinner.hide();
      if (response.status === 1) {
        Swal.fire('Shift edited successfully');
        this.router.navigate(["/attendance/listshift"]);

      } else if (response.status === 0) {
          Swal.fire("Error!",response['message'],"error");
      }

    },
  (error) => {
    this.spinner.hide();

  });
}
clearFields(){
  this.router.navigate(["/attendance/listshift"]);

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
  dctTempData['intId']=this.intShiftId;



  this.spinner.show();
  this.serverService.putData('shift_schedule/add_shift/',dctTempData)
  .subscribe(
    (response) => {
      this.spinner.hide();
      if (response.status === 1) {
        Swal.fire('Shift edited successfully');
        this.router.navigate(["/attendance/listshift"]);

      } else if (response.status === 0) {
          Swal.fire("Error!",response['message'],"error");
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
