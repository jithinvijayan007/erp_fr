import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';

import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-leavereport',
  templateUrl: './leavereport.component.html',
  styleUrls: ['./leavereport.component.css']
})
export class LeavereportComponent implements OnInit {
  lstLeaveData=[];
  displayedColumns = ['str_emp_code','str_emp_name','str_emp_degn','str_emp_branch','dat_from','str_leave_type','str_hier_degn','str_hier_name','dat_approved','str_status'];
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator
  @ViewChild(MatSort, {static: true}) sort: MatSort
  lstDesignationData=[];
  intSelectedDesigId;
  dataSource = new MatTableDataSource(this.lstLeaveData);
  lstBranches=[];
  searchBranch: FormControl = new FormControl();
  selectedBranch='';
  selectedBranchId=null;
  strBranchName='';
  intType=0;
  lstDepartment=[];
  intDepartmentId=null;
  lstLeaveTypes=[];
  intLeaveTypeId;
  datLeaveFrom;
  datLeaveTo;
  strDepartment;
  blnDeptShow = false;
  lstEmployeeData=[];
  selectedEmployee='';
  selectedEmployeeId=null;
  lstEmpSelected=[];
  lstSelectedEmpId=[];
  strEmployee='';
  searchEmployee: FormControl = new FormControl();
  @ViewChild('empId',{'static':true}) empId: ElementRef;
  branchConfig = {displayKey:'vchr_name',search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Branch',searchOnKey: 'vchr_name',clearOnSelection: true  }
  strBranch;
  strExpLink = '';


  constructor(
    private serverService: ServerService,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit() {
    this.datLeaveFrom = new Date();
    this.datLeaveTo = new Date();
    this.strDepartment = localStorage.getItem('strDepartment');
    if (this.strDepartment == 'HR & ADMIN' ){
      this.blnDeptShow =true;
    }
     //--------------------branch list typeahead -------------------//
     this.searchBranch.valueChanges
     // .debounceTime(400)
     .subscribe((strData: string) => {
      this.lstBranches = [];
       if (strData === undefined || strData === null) {
         this.lstBranches = [];
       } else {
         if (strData.length >= 1) {
           this.serverService
             .postData('branch/branch_typeahead/', { term: strData })
             .subscribe(
               (response) => {
                 this.lstBranches = response['data'];

               }
             );
         }
       }
     }
     ); 
 //--------------------branch list typeahead ends -------------------//
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
//  --------------------Leave Types-------------------
 this.serverService.getData('leave_management/leave_list/').subscribe(
  (response) => {
      if (response.status == 1) {

        this.lstLeaveTypes=response['lst_leavetypes'];
      }  
  },
  (error) => {   
    
  });
//  --------------------Leave Types-------------------
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
    this.getDetails();
    this.dataSource.paginator=this.paginator;
  }

  getDetails(){
    this.lstLeaveData=[];
    this.dataSource = new MatTableDataSource(this.lstLeaveData);
    let dctData = {}
    if(this.intLeaveTypeId == 0) {
      dctData['strLeaveType'] = 'COMBO'
    }
    if(this.intLeaveTypeId == -1) {
      dctData['strLeaveType'] = 'ONDUTY'
    }
    if(this.intLeaveTypeId == -2) {
      dctData['strLeaveType'] = 'WEEKOFF'
    }
    if(this.datLeaveFrom){
      dctData['datLeaveFrom'] = this.datLeaveFrom
    }
    if(this.datLeaveTo){
      dctData['datLeaveTo'] = this.datLeaveTo
    }
    if(this.datLeaveFrom>this.datLeaveTo){
      Swal.fire("Error!","Select Valid From Date and To Date");
      return false;
    }
    if(this.selectedBranchId){
      dctData['intBranchId'] = this.selectedBranchId
    }
    if(this.intDepartmentId && this.intDepartmentId !=0) {
      dctData['intDepartmentId'] = this.intDepartmentId
    }
    if(this.intSelectedDesigId && this.intSelectedDesigId !=0) {
      dctData['intDesigId'] = this.intSelectedDesigId;
    }
    if(this.intType) {
      dctData['intType'] = this.intType
    }
    if(this.intLeaveTypeId) {
      dctData['intLeaveTypeId'] = this.intLeaveTypeId
    }
    if(this.lstSelectedEmpId.length>0){
      dctData['lstSelectedEmpId'] = this.lstSelectedEmpId
    }
    dctData['datLeaveFrom']=moment(dctData['datLeaveFrom']).format('YYYY-MM-DD')
    dctData['datLeaveTo']=moment(dctData['datLeaveTo']).format('YYYY-MM-DD')
    this.spinner.show();
    this.serverService.postData('leave_management/leave_list/', dctData).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstLeaveData=response['lst_leave'];
            this.strExpLink=response['data']

            this.dataSource= new MatTableDataSource(this.lstLeaveData);
            if (this.lstLeaveData.length >0){
              this.dataSource.paginator=this.paginator;
              // this.dataSource.paginator.firstPage();
              this.dataSource.sort=this.sort;
              
            }
            
          }
          else{
            Swal.fire('Error!',response['reason'], 'error');
            return false;
          }  
      },
      (error) => {   
        this.spinner.hide(); 
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }
  branchChanged(item){
    this.selectedBranch=item.name;
    this.selectedBranchId=item.id;

  }
  branchChange(){
    if(this.selectedBranch!=this.strBranchName){
      this.selectedBranch='';
      this.selectedBranchId=null;
    }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  reset(){
    this.lstLeaveData=[];
    this.dataSource = new MatTableDataSource(this.lstLeaveData);
    this.selectedBranchId=null;
    this.strBranchName = '';
    this.intType=0;
    this.intDepartmentId=null;
    this.intLeaveTypeId = null;
    this.datLeaveFrom = new Date();
    this.datLeaveTo = new Date();
    this.lstSelectedEmpId=[];
    this.lstEmpSelected=[];
    this.strEmployee='';
    // this.selectedBranchId=null;
    // this.strBranch=null;
    // this.branchConfig.searchOnKey='';
    // this.branchConfig.displayKey='';
    // this.branchConfig = {displayKey:'vchr_name',search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Branch',searchOnKey: 'vchr_name',clearOnSelection: true  }


  }
  addEmployee (event) {
    if (this.lstEmpSelected.filter(x => x.intId === event.intId).length === 0) {
      this.lstEmpSelected.push(event);
      this.lstSelectedEmpId.push(event.intId);
    }
    this.strEmployee = '';
    this.empId.nativeElement.value = '';
    this.lstEmployeeData=[];
  }
  removeEmployee(value) {
    console.log("removeEmployee");
    
    const index = this.lstEmpSelected.indexOf(value);
    const index2 = this.lstSelectedEmpId.indexOf(value.intId);
  if (index > -1) {
    this.lstEmpSelected.splice(index, 1);
  }
  if (index2 > -1) {
    this.lstSelectedEmpId.splice(index2, 1);
  }
  this.lstEmployeeData=[];

  }
  branchChangedNgx(event){
    // console.log(this.strBranch,"strbranchngx");
    // console.log("event",event);
    if(this.strBranch){
      this.selectedBranchId = this.strBranch['pk_bint_id'];
    }
    else{
      this.selectedBranchId = null;
    }
    
  }
  generateExcel(){
    const file_data=this.strExpLink;
    const dlnk = document.createElement('a');
    dlnk.href = file_data;
    dlnk.download = file_data;
    document.body.appendChild(dlnk);
    dlnk.click();
    dlnk.remove();
  }
  departmentChanged() { //designation list based on department
    this.lstDesignationData=[];
    
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
