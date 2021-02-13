import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-make-leave',
  templateUrl: './make-leave.component.html',
  styleUrls: ['./make-leave.component.css']
})
export class MakeLeaveComponent implements OnInit {
  lstYear=[2019,2020,2021];
  lstMonths = [
    'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
  ];
  lstMonthYear = [];
  intCurYear = new Date().getFullYear();
  intCurMonth = new Date().getMonth()+1;
  intMonthYear = null;  
  lstDepartment=[];
  intDepartmentId=null;
  lstDesignationData=[];
  intSelectedDesignationData=[];
  lstBranchData=[];
  intSelectedBranchData=[];
  lstDates=[];
  lstAttendanceData=[];
  dctLeaveData={};
  dctPresentData={};
  dctWeekOffData={};
  constructor(
    private serverService: ServerService,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit() {
    // ---------month year descending--------------------------------
    let curMonth = this.intCurMonth-1;
    // To get list of next one year Month&Year values
        for (let i = 0; i < 12; i++) {
          this.lstMonthYear.push(
            {
              name:this.lstMonths[curMonth]+" '"+String(this.intCurYear).substr(2,2),
              value:(curMonth+1)+'-'+this.intCurYear
            })              
            curMonth=curMonth-1;
            if(curMonth === -1){
              curMonth = 11
              this.intCurYear=this.intCurYear-1
            }
        }
        this.intMonthYear = this.lstMonthYear[0]['value'];
    // ---------month year ends---------------------------

  //--------------------department list dropdown ----------------//
  this.serverService.getData('department/list_departments/').subscribe(
    (response) => {
        if (response.status == 1) {
          this.lstDepartment=response['lst_department'];
        }  
    },
    (error) => {   
      
    });
  //--------------------department list dropdown ends ----------------// 
  //-------------------designation dropdown-------------------------//
    this.serverService.getData('job_position/add_job/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstDesignationData=response['lst_job_position'];
          }  
        },
        (error) => {   
      });
  //-------------------designation dropdown ends-------------------------//
  //-------------------Branch dropdown-------------------------//
    this.serverService.getData('branch/add_branch/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstBranchData=response['lst_branch'];
          }  
        },
        (error) => {   
      });
  //-------------------branch dropdown ends-------------------------//
  }
  getEmployeeData(){
    let dctTempData={};
    if(!this.intMonthYear){
      Swal.fire("Error!","Select Month and Year","error");
      return false;
    }
    if(!this.intDepartmentId){
      Swal.fire("Error!","Select Department","error");
      return false;
    }
   
    // if(!this.intSelectedDesignationData){
    //   Swal.fire("Error!","Select Designation","error");
    //   return false;
    // }
    dctTempData['intMonthYear']=this.intMonthYear;
    dctTempData['intDepartmentId']=this.intDepartmentId;
    dctTempData['intDesignation']=this.intSelectedDesignationData;
    dctTempData['intBranch']=this.intSelectedBranchData;
    
    this.spinner.show();
    this.serverService.postData('attendance_fix/monthly_manual_attendance/',dctTempData).subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status == 1) {
          this.lstDates=response['data']['lst_dates'];
          this.lstAttendanceData=response['data']['lst_attendance'];
        } else{
          Swal.fire('Warning!','No Data', 'warning');
        }
      },
      (error) => {   
        this.spinner.hide();
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });   
  }
  makeLOP(indexOfDate,indexOfEmp,intType){
    let intEmpId=this.lstAttendanceData[indexOfEmp]['intId'];
    // let blnStatus=this.lstAttendanceData[indexOfEmp][this.lstDates[indexOfDate]]['blnClicked']
    let datAttendance =this.lstAttendanceData[indexOfEmp][this.lstDates[indexOfDate]]['datAttendance'];
    // this.lstAttendanceData[indexOfEmp][this.lstDates[indexOfDate]]['blnClicked']=!blnStatus;
    // if(this.lstAttendanceData[indexOfEmp][this.lstDates[indexOfDate]]['intType']==1 && this.dctLeaveData.hasOwnProperty(intEmpId)){
    //   this.dctLeaveData[intEmpId].push(datAttendance)
    // }else if(this.lstAttendanceData[indexOfEmp][this.lstDates[indexOfDate]]['intType']==1){
    //   this.dctLeaveData[intEmpId] = [];
    //   this.dctLeaveData[intEmpId].push(datAttendance)
    // }
    // if(this.lstAttendanceData[indexOfEmp][this.lstDates[indexOfDate]]['intType']==2 && this.dctLeaveData.hasOwnProperty(intEmpId)){
    //   this.dctPresentData[intEmpId].push(datAttendance)
    // }else if(this.lstAttendanceData[indexOfEmp][this.lstDates[indexOfDate]]['intType']==2){
    //   this.dctPresentData[intEmpId] = [];
    //   this.dctPresentData[intEmpId].push(datAttendance)
    // }
    // if(this.lstAttendanceData[indexOfEmp][this.lstDates[indexOfDate]]['intType']==0 && this.dctLeaveData.hasOwnProperty(intEmpId)){
    //  let index=this.dctLeaveData[intEmpId].indexOf(datAttendance);
    //   if(index != -1){
    //     this.dctLeaveData[intEmpId].splice(index, 1);
    //    }
    //    if(this.dctLeaveData[intEmpId].length == 0){
    //     delete this.dctLeaveData[intEmpId];
    //    }
    // }
    // if(this.lstAttendanceData[indexOfEmp][this.lstDates[indexOfDate]]['intType']==0 && this.dctPresentData.hasOwnProperty(intEmpId)){
    //   let index=this.dctPresentData[intEmpId].indexOf(datAttendance);
    //    if(index != -1){
    //      this.dctPresentData[intEmpId].splice(index, 1);
    //     }
    //     if(this.dctPresentData[intEmpId].length == 0){
    //      delete this.dctPresentData[intEmpId];
    //     }
    //  }

    //  ////
    if(intType==1){
      if(this.dctLeaveData.hasOwnProperty(intEmpId)){
        this.dctLeaveData[intEmpId].push(datAttendance)
      }else {
        this.dctLeaveData[intEmpId] = [];
        this.dctLeaveData[intEmpId].push(datAttendance)
      }
      if(this.dctPresentData.hasOwnProperty(intEmpId)){
        let index=this.dctPresentData[intEmpId].indexOf(datAttendance);
         if(index != -1){
           this.dctPresentData[intEmpId].splice(index, 1);
          }
          if(this.dctPresentData[intEmpId].length == 0){
           delete this.dctPresentData[intEmpId];
          }
       }
       if(this.dctWeekOffData.hasOwnProperty(intEmpId)){
        let index=this.dctWeekOffData[intEmpId].indexOf(datAttendance);
         if(index != -1){
           this.dctWeekOffData[intEmpId].splice(index, 1);
          }
          if(this.dctWeekOffData[intEmpId].length == 0){
           delete this.dctWeekOffData[intEmpId];
          }
       }
    }else if(intType==2){
      if(this.dctPresentData.hasOwnProperty(intEmpId)){
        this.dctPresentData[intEmpId].push(datAttendance)
      }else {
        this.dctPresentData[intEmpId] = [];
        this.dctPresentData[intEmpId].push(datAttendance)
      }
      if(this.dctLeaveData.hasOwnProperty(intEmpId)){
        let index=this.dctLeaveData[intEmpId].indexOf(datAttendance);
         if(index != -1){
           this.dctLeaveData[intEmpId].splice(index, 1);
          }
          if(this.dctLeaveData[intEmpId].length == 0){
           delete this.dctLeaveData[intEmpId];
          }
       }
       if(this.dctWeekOffData.hasOwnProperty(intEmpId)){
        let index=this.dctWeekOffData[intEmpId].indexOf(datAttendance);
         if(index != -1){
           this.dctWeekOffData[intEmpId].splice(index, 1);
          }
          if(this.dctWeekOffData[intEmpId].length == 0){
           delete this.dctWeekOffData[intEmpId];
          }
       }
    }else if(intType==3){
      if(this.dctWeekOffData.hasOwnProperty(intEmpId)){
        this.dctWeekOffData[intEmpId].push(datAttendance)
      }else {
        this.dctWeekOffData[intEmpId] = [];
        this.dctWeekOffData[intEmpId].push(datAttendance)
      }
      if(this.dctLeaveData.hasOwnProperty(intEmpId)){
        let index=this.dctLeaveData[intEmpId].indexOf(datAttendance);
         if(index != -1){
           this.dctLeaveData[intEmpId].splice(index, 1);
          }
          if(this.dctLeaveData[intEmpId].length == 0){
           delete this.dctLeaveData[intEmpId];
          }
       }
       if(this.dctPresentData.hasOwnProperty(intEmpId)){
        let index=this.dctPresentData[intEmpId].indexOf(datAttendance);
         if(index != -1){
           this.dctPresentData[intEmpId].splice(index, 1);
          }
          if(this.dctPresentData[intEmpId].length == 0){
           delete this.dctPresentData[intEmpId];
          }
       }
    }else if(intType==0){
      if(this.dctLeaveData.hasOwnProperty(intEmpId)){
        let index=this.dctLeaveData[intEmpId].indexOf(datAttendance);
         if(index != -1){
           this.dctLeaveData[intEmpId].splice(index, 1);
          }
          if(this.dctLeaveData[intEmpId].length == 0){
           delete this.dctLeaveData[intEmpId];
          }
       }
       if(this.dctPresentData.hasOwnProperty(intEmpId)){
         let index=this.dctPresentData[intEmpId].indexOf(datAttendance);
          if(index != -1){
            this.dctPresentData[intEmpId].splice(index, 1);
           }
           if(this.dctPresentData[intEmpId].length == 0){
            delete this.dctPresentData[intEmpId];
           }
        }
        if(this.dctWeekOffData.hasOwnProperty(intEmpId)){
          let index=this.dctWeekOffData[intEmpId].indexOf(datAttendance);
           if(index != -1){
             this.dctWeekOffData[intEmpId].splice(index, 1);
            }
            if(this.dctWeekOffData[intEmpId].length == 0){
             delete this.dctWeekOffData[intEmpId];
            }
         }
    }
    
  }
  saveData(){
    if(Object.keys(this.dctLeaveData).length === 0 && Object.keys(this.dctPresentData).length === 0 && Object.keys(this.dctWeekOffData).length === 0){
      Swal.fire('Error!','Select atleast one employee', 'error');
      return;
    }
   
    this.spinner.show();
    this.serverService.putData('attendance_fix/monthly_manual_attendance/',{dctLeaveData:this.dctLeaveData,dctPresentData:this.dctPresentData,dctWeekoffData:this.dctWeekOffData,intMonthYear:this.intMonthYear}).subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status == 1) {
          if(response['str_exclude_weekoff']==''){
            Swal.fire('Success',"Successfull", 'success');
            this.clearData();
          }else{
            Swal.fire('Success',"Can't set week off for "+response['str_exclude_weekoff'], 'warning');
            this.clearData();
          }
          
        } else{
          Swal.fire('Error!',response['reason'], 'error');
        }
      },
      (error) => { 
        this.spinner.hide();  
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });   
  }
  clearData(){
    this.getEmployeeData();
    this.dctLeaveData={};
    this.dctPresentData={};
    this.dctWeekOffData={};
  }
  clearFields(){
    this.intMonthYear = this.lstMonthYear[0]['value'];
    this.intDepartmentId =null;
    this.intSelectedDesignationData =null;
    this.intSelectedBranchData = null;
    this.dctLeaveData={};
    this.dctPresentData={};   
    this.dctWeekOffData={}; 
  }
  departmentChanged() { //designation list based on department
    this.lstDesignationData=[];
    this.intSelectedDesignationData=[];
    this.serverService.postData('job_position/list/',{'intDepartmentId':this.intDepartmentId}).subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstDesignationData=response['lst_job_position'];
          }  
      },
      (error) => {   
        
      });
  }
}
