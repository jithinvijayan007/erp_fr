import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { FormControl } from '@angular/forms';
import Swal from "sweetalert2";
import * as moment from "moment";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-shift-reports',
  templateUrl: './shift-reports.component.html',
  styleUrls: ['./shift-reports.component.css']
})
export class ShiftReportsComponent implements OnInit {

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

  constructor(
    private serverService: ServerService,
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
        //--------------------department list dropdown ----------------//
        this.serverService.getData('department/list_departments/').subscribe(
          (response) => {
              if (response.status == 1) {
                this.lstDepartments=response['lst_department'];
              }  
          },
          (error) => {   
            
          });
        //--------------------department list dropdown ends ----------------//
        //-------------------shift dropdown-------------------------//
        // this.serverService.getData('shift_schedule/list_shift/').subscribe(
        //   (response) => {
        //       if (response.status == 1) {
        //         this.lstShiftData=response['lst_shift_shedule'];
        //       }  
        //     },
        //     (error) => {   
        //   });
        //-------------------shift dropdown ends-------------------------//
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
        //-------------------Physical Location dropdown-------------------------//
        // this.serverService.getData('location/list_loc/').subscribe(
        //   (response) => {
        //       if (response.status == 1) {
        //         this.lstLocationData=response['lst_loc'];
        //       }  
        //     },
        //     (error) => {   
        //   });
        //-------------------Physical Location dropdown ends-------------------------//
        //--------------------branch list dropdown -------------------//
        this.serverService.getData('branch/add_branch/').subscribe(
          (response) => {
              if (response.status == 1) {
                this.lstBranches =response['lst_branch'];
              }  
            },
            (error) => {   
          });
      //--------------------branch list dropdown ends -------------------//
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
  }
  // addEmployee (event) {
  //   if (this.lstEmpSelected.filter(x => x.intId === event.intId).length === 0) {
  //     this.lstEmpSelected.push(event);
  //     this.lstSelectedEmpId.push(event.intId);
  //   }
  //   this.strEmployee = '';
  //   this.empId.nativeElement.value = '';
  //   this.lstEmployeeData=[];
  // }
  // removeEmployee(value) {
  //   console.log("removeEmployee");
    
  //   const index = this.lstEmpSelected.indexOf(value);
  //   const index2 = this.lstSelectedEmpId.indexOf(value.intId);
  // if (index > -1) {
  //   this.lstEmpSelected.splice(index, 1);
  // }
  // if (index2 > -1) {
  //   this.lstSelectedEmpId.splice(index2, 1);
  // }
  // this.lstEmployeeData=[];

  // }
  getShiftReportData() {
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
    this.spinner.show();
    this.serverService.postData('shift_allocation/shift_export/',dctData).subscribe(
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
  }
  clearFields() {
    this.datFrom=null;
    this.datTo=null;
    this.lstSelectedBranch=[];
    this.lstSelectedDeptNames=[];
    this.lstSelectedBrand=[];
    this.strEmployee=''
    this.selectedEmployee='';
    this.selectedEmployeeId=null;
    this.lstSelectedDesignation=[];
  }
  employeeChanged(item){

    
    
    this.selectedEmployee=item.strUserName;
    this.selectedEmployeeId=item.intId;

  }
  employeeChange(){  
    
    
    if(this.selectedEmployee!=this.strEmployee){
      this.selectedEmployee='';
      this.selectedEmployeeId=null;
    }
  }
}
