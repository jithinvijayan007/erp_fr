import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ServerService } from '../../server.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {FormControl} from '@angular/forms';
import {TooltipPosition} from '@angular/material/tooltip';
import { ExcelServicesService } from "../../services/excel-services.service";
import { TitleCasePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';


@Component({
  selector: 'app-emp-attendance',
  templateUrl: './emp-attendance.component.html',
  styleUrls: ['./emp-attendance.component.css']
})
export class EmpAttendanceComponent implements OnInit {
  constructor( 
    private serverService: ServerService,
    private modalService: NgbModal,
    private excelService: ExcelServicesService,
    private titlecasePipe:TitleCasePipe,
    private spinner: NgxSpinnerService
    ) { }

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[1]);
  datAttendance = new Date;
  lstData = [];
  dataSource=new MatTableDataSource(this.lstData);
  displayedColumns=['code','name','branch','in','out','duration','strRemarks','icon'];
  modalRef;
  lstTimeDetails = [];
  strShiftStart = '';
  strShiftEnd = '';
  strEmpStatus = '';
  lstSelectedDept = [];
  lstDepartment = [];
  lstLocationData = [];
  lstSelectedLocation;
  searchEmployee: FormControl = new FormControl();
  lstEmployeeData=[];
  selectedEmployee='';
  strEmployee='';
  selectedEmployeeId=null;
  strDepartment;
  strDesignation;
  blnShowFilter = false;
  dctExportData={};
  lstSelectedDeptNames=[];
  lstSelectedLocaionNames=[];
  lstBrandData=[];
  intSelectedBrandId=null;
  strSelectedBrand=''
  
  lstBranchData=[];
  intSelectedBranchId=null;
  strSelectedBranch='';
  lstSelectedBranchData = [];
  lstSelectedBranchNames=[];

  lstDesignationData=[];
  lstSelectedDesignationData = [];
  lstSelectedDesigNames=[];
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
  dctFilters = {
    'blnDept':false,
    'blnPhysicalLoc':false,
    'blnEmployee':false,
    'blnBrand':false,
    'blnBranch':false,
    'blnDesignation':false
  };

  // @ViewChild(MatSort, {static: true}) sort: MatSort;
  // @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator; 
  ngOnInit() {
    this.strDepartment = localStorage.getItem('strDepartment');
    this.strDesignation = localStorage.getItem('strDesignation');
    if (this.strDepartment == 'HR & ADMIN' || this.strDepartment == 'INTERNAL AUDIT'
    || (this.strDepartment == 'IT PROJECTS' && this.strDesignation == 'HEAD- INFORMATION TECHNOLOGY')){
      this.blnShowFilter = true;
    }
    this.showData();
        //--------------------department  ----------------//
        this.serverService.getData('department/list_departments/').subscribe(
          (response) => {
              if (response.status == 1) {
                this.lstDepartment=response['lst_department'];
              }  
          },
          (error) => {   
            
          });
        //--------------------department  ends ----------------//
         //-------------------Physical Location -------------------------//
         this.serverService.getData('location/list_loc/').subscribe(
          (response) => {
              if (response.status == 1) {
                this.lstLocationData=response['lst_loc'];
              }  
            },
            (error) => {   
          });
    //-------------------Physical Location  ends-------------------------//
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
    //-------------------Brand dropdown-------------------------//
    this.serverService.getData('brands/add_brands/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstBrandData=response['lst_brand'];
          }  
        },
        (error) => {   
      });
//-------------------designation dropdown ends-------------------------//

//-------------------Branch dropdown-------------------------//
    this.serverService.getData('branch/branchapi/').subscribe(
  (response) => {
      if (response.status == 1) {
        this.lstBranchData = response['lst_branch'];
      }  
    },
    (error) => {   
  });
//-------------------branch dropdown ends-------------------------//

//-------------------Branch dropdown-------------------------//
    this.serverService.getData('user_groups/grouplist/').subscribe(
  (response) => {
      if (response.status == 1) {
        this.lstDesignationData=response['lst_job_position'];
      }  
    },
    (error) => {   
  });
//-------------------branch dropdown ends-------------------------//
    
  }
  showData() {
    this.lstData = [];
    this.dctExportData={}

    let datAttendance = moment(this.datAttendance).format('YYYY-MM-DD')
    let dct_data = {'datAttendance':datAttendance};
    if(this.lstSelectedDept) {
      dct_data['lstSelectedDept'] = this.lstSelectedDept;
    }    
    if (this.lstSelectedLocation){
      let lstLocation = []
    for (let index = 0; index < this.lstSelectedLocation.length; index++) {
      lstLocation.push(String(this.lstSelectedLocation[index]))
      
    }
      dct_data['lstSelectedLocation'] = lstLocation;
      if(this.lstSelectedLocation.length>0){
        this.dctExportData['lstLocation']=this.lstSelectedLocaionNames;
      }
      else {
        this.dctExportData['lstLocation']=['ALL'];
      }
    }
    if (this.selectedEmployeeId) {
      dct_data['intEmployeeId'] = this.selectedEmployeeId;
      this.dctExportData['strEmployee']=this.strEmployee;
    }
    if(this.intSelectedBrandId){
      dct_data['intBrandId']=this.intSelectedBrandId;
      this.dctExportData['strBrand']=this.strSelectedBrand;
    }
    if(this.lstSelectedDept.length>0){
      this.dctExportData['lstDepartment']=this.lstSelectedDeptNames;
    }
    if(this.lstSelectedBranchData.length>0){
      dct_data['lstSelectedBranch']=this.lstSelectedBranchData
      this.dctExportData['lstBranch'] = this.lstSelectedBranchNames;
    }
    if(this.lstSelectedDesignationData.length >0){
      dct_data['lstSelectedDesig']=this.lstSelectedDesignationData
      this.dctExportData['lstDesignation'] = this.lstSelectedDesigNames;
    }
    this.dctExportData['date']=moment(this.datAttendance).format('DD-MM-YYYY');
    this.dctExportData['attendanceStatus']=this.lstAttendanceStatus;
    if(this.blnAllSelected) {
      dct_data['lstAttendanceStatus']=['all'];
    }
    else{
      dct_data['lstAttendanceStatus']=this.lstAttendanceStatus;

    }
    this.spinner.show();
    this.serverService.postData('attendance/punch_log_details/',dct_data).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstData=response['data'];
            this.dctFilters = response['filters'];
            this.dataSource=new MatTableDataSource(this.lstData);
            if(this.lstData.length >0){
              // this.dataSource.paginator=this.paginator;
              // this.dataSource.paginator.firstPage();
            // this.dataSource.sort=this.sort;

            }
           
          }  
      },
      (error) => { 
        this.spinner.hide();  
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }
  openModal(modalTimeDetails,intLogId){
    this.lstTimeDetails = [];
    this.spinner.show();
    this.serverService.putData('attendance/punch_log_details/',{'intLogId':intLogId}).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstTimeDetails = response['data'];
            let dct_shift = response['dct_shift'];
            this.strEmpStatus = dct_shift['strEmpStatus'];
            this.strShiftStart = dct_shift['strShiftStart'];
            this.strShiftEnd = dct_shift['strShiftEnd'];
          }  
      },
      (error) => {   
        this.spinner.hide();
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
   this.modalRef = this.modalService.open(modalTimeDetails, { size: 'sm', windowClass: 'filteritemclass' });
  }
  closeModal() {
    this.modalRef.close();
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
  generateExcel(){

    if(this.lstData.length==0){
      Swal.fire("Error!","No Data to Export","error");
      return false;
    }
    else{
      let lstTempData=[];
      for(let item of this.lstData){
        let dctTable={};
        dctTable['Code']=item['strEMPCode'];
        dctTable['Name']=item['strEMPName'];
        dctTable['Branch']= this.titlecasePipe.transform(item['strBranchName']);
        dctTable['In_Location']=item['strInLocation'];
        dctTable['Out_Location']=item['strOutLocation'];
        dctTable['In']=item['timFirstPunch'];
        dctTable['Out']=item['timLastPunch'];
        dctTable['No_of_Hours']=item['strDuration'];
        dctTable['Remarks']=item['strRemarks']
        lstTempData.push(dctTable);
      }
      
      this.excelService.exportAsAyttendanceExcel(lstTempData,this.dctExportData);
    }    
  }

  departmentChanged(event) { //gettting department names
    if(event.source.selected){
      this.lstSelectedDeptNames.push(event.source.viewValue)
    }
    else {
      let index = this.lstSelectedLocaionNames.indexOf(event.source.viewValue)
      this.lstSelectedDeptNames.splice(index,1)
    }
    
  }
  locationChanged(event){  //for getting location names
    if(event.source.selected){
      this.lstSelectedLocaionNames.push(event.source.viewValue)
    }
    else {
      let index = this.lstSelectedLocaionNames.indexOf(event.source.viewValue)
      this.lstSelectedLocaionNames.splice(index,1)
    }
  }
  brandChanged(event) {
    if(event.isUserInput){
      this.strSelectedBrand=event.source.viewValue;
    }
    
  }
  branchChanged(event){
    
    if(event.source.selected){
      this.lstSelectedBranchNames.push(event.source.viewValue)
    }
    else {
      let index = this.lstSelectedBranchNames.indexOf(event.source.viewValue)
      this.lstSelectedBranchNames.splice(index,1)
    }
    
  }
  designationChanged(event){
    if(event.source.selected){
      this.lstSelectedDesigNames.push(event.source.viewValue)
    }
    else {
      let index = this.lstSelectedDesigNames.indexOf(event.source.viewValue)
      this.lstSelectedDesigNames.splice(index,1);
    }
    
  }  
//   toggleAllSelection() {
//     if (this.allSelected.selected) {
//       this.lstAttendanceStatus=["all"];
//     } else {
//       this.lstAttendanceStatus=[];
//     }
//   }
//   tosslePerOne(){ 
//     if (this.allSelected.selected) {  
//      this.allSelected.deselect();
//      return false;
//  }
//    if(this.lstAttendanceStatus.length==this.lsStatusData.length)
//      this.allSelected.select(); 
//  }

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
