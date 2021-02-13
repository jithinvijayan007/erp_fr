import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelServicesService } from "../../services/excel-services.service";
import { TitleCasePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-monthlyattendance',
  templateUrl: './monthlyattendance.component.html',
  styleUrls: ['./monthlyattendance.component.css']
})
export class MonthlyattendanceComponent implements OnInit {

  constructor(
    private serverService: ServerService,
    private modalService: NgbModal,
    private excelService: ExcelServicesService,
    private titlecasePipe:TitleCasePipe,
    private spinner: NgxSpinnerService
    ) { }
  datAttendance = new Date;
  lstData = [];
  dataSource=new MatTableDataSource(this.lstData);
  displayedColumns=['date','in','out','duration','strStatus','icon'];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[1]);
  // @ViewChild(MatSort, {static: true}) sort: MatSort;
  // @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator; 

  searchEmployee: FormControl = new FormControl();
  strEmpName = null;
  intEmpId;
  strEmpNameSelected;
  lstEmployees = [];
  lstMonths = [
    {'name':'January','value':1},
    {'name':'February','value':2},
    {'name':'March','value':3},
    {'name':'April','value':4},
    {'name':'May','value':5},
    {'name':'June','value':6},
    {'name':'July','value':7},
    {'name':'August','value':8},
    {'name':'September','value':9},
    {'name':'October','value':10},
    {'name':'November','value':11},
    {'name':'December','value':12},
  ];
  lstYears = [
    {'name':'2018','value':2018},
    {'name':'2019','value':2019},
    {'name':'2020','value':2020},
  ];
  months=[
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',]
  intYear = new Date().getFullYear();
  intMonth = new Date().getMonth()+1;
  modalRef;
  lstTimeDetails = [];
  strShiftStart = '';
  strShiftEnd = '';
  strEmpStatus = '';
  dctExportData={};
  dctFilters = {
    'blnEmployee':false,
    
  };
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
  blnAllSelected=false
  
  ngOnInit() {
    //Employee list typeahead
    this.searchEmployee.valueChanges
      // .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstEmployees = [];
        } else {
          if (strData.length >= 3) {
            this.serverService
              .postData('user/user_typeahead/', { strTerms: strData })
              .subscribe(
                (response) => {
                  this.lstEmployees = response['data'];

                }
              );
          }
        }
      }
      ); 
    //Employee list typeahead ends
    this.showData(false);
  }

  showData(item) {
    this.dctExportData={}

    if(item){
      if(this.dctFilters['blnEmployee']){
        if(this.intEmpId == null) {
          Swal.fire('Error','Select Employee','error');
          return;
        }
      }
     
    }
    
   

      this.dctExportData['intMonth']=this.months[this.intMonth-1];
      this.dctExportData['intYear']=this.intYear;
      if(item){
         if( this.dctFilters['blnEmployee'])
         {
          this.dctExportData['strEmployee']=this.searchEmployee.value;
        }
      }
      
      

    
    this.lstData = [];
    let dct_data = {
      'intEmpId':this.intEmpId,
      'intMonth':this.intMonth,
      'intYear':this.intYear,    };
    if(this.blnAllSelected) {
      dct_data['lstAttendanceStatus']=['all'];
    }
    else{
      dct_data['lstAttendanceStatus']=this.lstAttendanceStatus;

    }
    this.spinner.show();
    this.serverService.postData('attendance/attendance_details/',dct_data).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstData=response['data'];
            this.dctFilters = response['filters'];
            this.dataSource=new MatTableDataSource(this.lstData);
            // if(this.lstData.length >0){
              // this.dataSource.paginator=this.paginator;
              // this.dataSource.paginator.firstPage();
            // this.dataSource.sort=this.sort;

            // }
           
          }  
      },
      (error) => {   
        this.spinner.hide();
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }
  empChanged(item){
    this.strEmpNameSelected = item.strUserName;
    this.intEmpId = item.intId ;
  }
  empChange(){
    if(this.strEmpName != this.strEmpNameSelected){
      this.intEmpId = null;
    }
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
  generateExcel(){

    if(this.lstData.length==0){
      Swal.fire("Error!","No Data to Export","error");
      return false;
    }
    else{
      let lstTempData=[];
      for(let item of this.lstData){
        
        let dctTable={};
        dctTable['Date']=item['datPunch'];
        dctTable['In']=item['timFirstPunch'];
        dctTable['Out']=item['timLastPunch'];
        dctTable['No_of_Hours']=item['strDuration'];
        dctTable['Status']=item['strStatus'];
        lstTempData.push(dctTable);
      }
      
      // this.excelService.exportAsMonthlyAttendanceExcel(lstTempData,this.dctExportData);//commented for o2force
    }    
  }





// '  toggleAllSelection() {
//     if (this.allSelected.selected) {
//       this.lsStatusData.map((item) =>{
//         if(!this.lstAttendanceStatus.includes(item.value)){
//           console.log("hello");
          
//           this.lstAttendanceStatus.push(item.value)
//         }
//       })
//     } else {
//       this.lstAttendanceStatus=[];
//     }
//     console.log(this.lstAttendanceStatus);
    
//   }
//   tosslePerOne(){ 
//     if (this.allSelected.selected) {  
//      this.allSelected.deselect();
//      return false;
//  }
//    if(this.lstAttendanceStatus.length==this.lsStatusData.length)
//      this.allSelected.select(); 
//  }'

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
