import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { IfStmt } from '@angular/compiler';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-addleavetype',
  templateUrl: './addleavetype.component.html',
  styleUrls: ['./addleavetype.component.css']
})
export class AddleavetypeComponent implements OnInit {

  strLeaveName='';
  strLeaveCode='';
  intLeavePYear=null;
  intMaxLeavePMonth=null;
  strRemarks='';
  intLeaveTypeId=null;
  leaveAction='save';
  lstLeaveDetails=[];
  lstPermission=[];
  blnView=true;
  lstYears = [
    {'name':'2018','value':2018},
    {'name':'2019','value':2019},
    {'name':'2020','value':2020},
    {'name':'2021','value':2021},

  ];
  intYear=null;
  constructor(
    private serverService: ServerService,
    public router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
      //_______________________setting up permissions___________________________
        this.lstPermission = JSON.parse(localStorage.getItem("permission"));    
        this.lstPermission.forEach((item, index, array) => {
        if (item["NAME"] == "Leave") {
          this.blnView = item["VIEW"];

          }
        });
    //_______________________setting up permissions___________________________
    this.intLeaveTypeId=localStorage.getItem('intLeaveTypeId');
    let strleaveAction=localStorage.getItem('leaveAction');
    if(strleaveAction=='edit'){
      this.leaveAction='edit'
    }
    if(this.leaveAction=='edit'){
      this.getLeaveTypeDetails();
    }
  }
  getLeaveTypeDetails(){

    this.lstLeaveDetails=[];
    this.spinner.show();
    this.serverService.getData('leave_management/add_leavetype/?id='+this.intLeaveTypeId).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstLeaveDetails=response['lst_leave_type'];
            this.strLeaveName=this.lstLeaveDetails[0].vchr_name;
            // this.strLeaveCode=this.lstLeaveDetails[0].vchr_code;
            this.intYear=this.lstLeaveDetails[0].int_year;
            this.intLeavePYear=this.lstLeaveDetails[0].dbl_leaves_per_year;
            this.intMaxLeavePMonth=this.lstLeaveDetails[0].dbl_leaves_per_month;
            this.strRemarks=this.lstLeaveDetails[0].vchr_remarks;
            localStorage.setItem("leaveAction","save");

          }  
      },
      (error) => {   
        this.spinner.hide();
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });

  }

  saveLeaveType(){
    if(!this.strLeaveName){
      Swal.fire('Error!', 'Enter Leave Type', 'error');
      return false
    }
    // else if(!this.strLeaveCode){
    //   Swal.fire('Error!', 'Enter Leave Code',"error");
    //   return false;
    // }
    else if(!this.intYear){
      Swal.fire('Error!', 'Select Year',"error");
      return false;
    }
    else if(!this.intLeavePYear){
      Swal.fire('Error!', 'Enter No of Leaves per Year',"error");
      return false;
    }
    else if(!this.intMaxLeavePMonth){
      Swal.fire('Error!','Enter Maximum Leave per Month',"error");
      return false;
    }

    if(this.leaveAction=='save'){
      let dctTempData={}

      dctTempData['strLeaveName']=this.strLeaveName;
      // dctTempData['strLeaveCode']=this.strLeaveCode;
      dctTempData['intYear']=this.intYear;
      dctTempData['intLeavePYear']=this.intLeavePYear;
      dctTempData['intMaxLeavePMonth']=this.intMaxLeavePMonth;
      dctTempData['strRemarks']=this.strRemarks;
  
      this.spinner.show();
      this.serverService.postData('leave_management/add_leavetype/',dctTempData)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.status === 1) {
            Swal.fire('leave type added successfully');
            localStorage.setItem("leaveAction","save");
            if(this.blnView){
              this.router.navigate(["/attendance/listleavetype"]);
            }
            else{
              this.clearFields();
            }
  
          } else if (response.status === 0) {
              Swal.fire("Error!",response['reason'],"error");
          }
        },
      (error) => {
        this.spinner.hide();
        // console.log('response');
      });
    }
    else if(this.leaveAction=='edit'){
      let dctTempData={}

      dctTempData['strLeaveName']=this.strLeaveName;
      // dctTempData['strLeaveCode']=this.strLeaveCode;
      dctTempData['intYear']=this.intYear;
      dctTempData['intLeavePYear']=this.intLeavePYear;
      dctTempData['intMaxLeavePMonth']=this.intMaxLeavePMonth;
      dctTempData['strRemarks']=this.strRemarks;
      dctTempData['intId']=this.intLeaveTypeId;
  
      this.spinner.show();
      this.serverService.putData('leave_management/add_leavetype/',dctTempData)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.status === 1) {
            Swal.fire('leave type edited successfully');
            localStorage.setItem("leaveAction","save");
            if(this.blnView){
              this.router.navigate(["/attendance/listleavetype"]);
            }
            else{
              this.clearFields();
            }
  
          } else if (response.status === 0) {
              Swal.fire("Error!",response['reason'],"error");
          }
        },
      (error) => {
        this.spinner.hide();
        // console.log('response');
      });
    }


  }
  clearFields(){

    if(this.leaveAction=='save'){
      this.strLeaveName='';
      // this.strLeaveCode='';
      this.intLeavePYear=null;
      this.intMaxLeavePMonth=null;
      this.strRemarks='';
      this.intLeaveTypeId=null;
      this.intYear=null;
      localStorage.setItem("leaveAction","save");
    }
    else if(this.leaveAction=='edit'){
      localStorage.setItem("leaveAction","save");
      this.router.navigate(["/attendance/listleavetype"]);

    }


  }

}
