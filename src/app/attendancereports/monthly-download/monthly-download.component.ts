import { Component, OnInit,ViewChild } from '@angular/core';

import { FormControl} from '@angular/forms';

import * as moment from 'moment';
import Swal from 'sweetalert2';
import { ServerService } from '../../server.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
@Component({
  selector: 'app-monthly-download',
  templateUrl: './monthly-download.component.html',
  styleUrls: ['./monthly-download.component.css']
})
export class MonthlyDownloadComponent implements OnInit {

  datFrom;
  datTo;

  blnSpinner = false;

  strBranchName = '';
  lstBranches = [];
  searchBranch : FormControl = new FormControl();
  selectedBranch='';
  selectedBranchId=null;
  lstSelectedBranch =[];

  strDepartmentName = '';
  lstDepartments = [];
  searchDepartment : FormControl = new FormControl();
  selectedDepartment='';
  selectedDepartmentId=null;
  lstSelectedDeptNames = [];


  searchBrand: FormControl = new FormControl();
  strBrandName='';
  intBrandId=null;
  selectedBrand='';
  selectedBrandId=null;
  lstBrand=[];
  lstSelectedBrand = [];


  lstEmployeeData=[];
  selectedEmployee='';
  strEmployee='';
  selectedEmployeeId=null;
  searchEmployee: FormControl = new FormControl();

  lstDesignationData;
  intSelectedDesignation;
  lstSelectedDesignation = [];

  showSpinner=false;

  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  lstAttendanceStatus=[];
  lsStatusData=[
    { 'value': "weekOff", 'name':"Week Off"},
    { 'value': "holiDay", 'name':"Holiday"},
    { 'value': "absent", 'name':"Absent"},
    { 'value': "leave", 'name':"Leave"},
    { 'value': "onDuty", 'name':"On Duty"},
    { 'value': "comboOff", 'name':"Compo Off"},
  ]
  @ViewChild('allSelected',{static:true}) private allSelected: MatOption;
  @ViewChild('select',{static:true}) select: MatSelect;
  blnAllSelected=false;
  constructor(private serverService:ServerService,
    private spinner: NgxSpinnerService) { }

    
  // showSpinner() {
  //   this.spinner.show();
  //   setTimeout(() => {
  //     this.spinner.hide();
  //   }, 5000);
  // }

  

  ngOnInit() {
    this.datFrom = new Date()
    this.datTo = new Date()

    
      
       //--------------------branch list typeahead -------------------//
       this.serverService.getData('branch/add_branch/').subscribe(
        (response) => {
            if (response.status == 1) {
              this.lstBranches =response['lst_branch'];
            }  
          },
          (error) => {   
        });
   //--------------------branch list typeahead ends -------------------//
   
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

    //-----------------------department start -----------------------------//

    this.serverService.getData('department/list_departments/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstDepartments=response['lst_department'];
          }  
      },
      (error) => {   
        
      });
    //--------------------department  ends ----------------//

    //---------------------brand start ---------------------//

    this.serverService.getData('brand/brand_list/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstBrand=response['lst_brand'];
          }  
        },
        (error) => {   
      });

      //----------------------brand ends -------------------//

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
  generateExcel(){
    
    const dctData = {}
    if (this.datFrom > this.datTo || (!this.datFrom) || (!this.datTo) )  {
  
      Swal.fire({
        position: "center",
        type: "error",
        text: "Please select correct date period",
        showConfirmButton: true,
      });
      return false;
    }
    dctData['datFrom'] =moment(this.datFrom).format('YYYY-MM-DD');
    dctData['datTo'] = moment(this.datTo).format('YYYY-MM-DD');
    if(this.lstSelectedBranch.length != 0){
      dctData['lstBranchId'] = this.lstSelectedBranch;
    }
    if(this.lstSelectedDeptNames.length !=0){
      dctData['lstDepartmentId'] = this.lstSelectedDeptNames;
    }
    if(this.lstSelectedBrand.length != 0){
      dctData['lstBrandId'] = this.lstSelectedBrand;
    }
    if(this.lstSelectedDesignation.length != 0){
      dctData['lstDesigId'] = this.lstSelectedDesignation;
    }
    if(this.strEmployee){
      if(this.strEmployee != this.selectedEmployee){
        Swal.fire('Error!','Select valid employee','error');
        return false;
      }
    }
    if(this.strEmployee){
      dctData['intEmployeeId'] = this.selectedEmployeeId;
    }
    if(this.blnAllSelected) {
      dctData['lstAttendanceStatus']=['all'];
    }
    else{
      dctData['lstAttendanceStatus']=this.lstAttendanceStatus;

    }
    this.spinner.show();
    this.serverService.postData('attendance/attendance_export/',dctData).subscribe(
      (response) => {
      
        this.spinner.hide();
        // this.showSpinner()
        this.showSpinner=true;

      

        if (response.status === 1) {
        
          this.showSpinner=false;

          const file_data = response['data'];
          const dlnk = document.createElement('a');
          dlnk.href = file_data;
          dlnk.download = file_data;
          document.body.appendChild(dlnk);
          dlnk.click();
          dlnk.remove();

        } else if(response.status === 0 && response['message']){
          this.showSpinner=false;

          Swal.fire('Error!',response['message'],'error');
       } else {
          this.showSpinner=false;

          Swal.fire('Error!','Download Failure','error');
        }
  },
  (error)=>{
    this.spinner.hide();
  }
  
    );
    // this.spinner.hide();

}
// toggleAllSelection() {
//   if (this.allSelected.selected) {
//     this.lstAttendanceStatus=["all"];
//   } else {
//     this.lstAttendanceStatus=[];
//   }
// }
// tosslePerOne(){ 
//   if (this.allSelected.selected) {  
//    this.allSelected.deselect();
//    return false;
// }
//  if(this.lstAttendanceStatus.length==this.lsStatusData.length)
//    this.allSelected.select();
// }
toggleAllSelection() {
  if (this.blnAllSelected) {
    this.select.options.forEach((item: MatOption) => item.select());
  } else {
    this.select.options.forEach((item: MatOption) => item.deselect());
  }
  
}
 optionClick() {
  let newStatus = true;
  this.select.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.blnAllSelected = newStatus;

}


}
