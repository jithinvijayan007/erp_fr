import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-early-late-coming-report',
  templateUrl: './early-late-coming-report.component.html',
  styleUrls: ['./early-late-coming-report.component.css']
})
export class EarlyLateComingReportComponent implements OnInit {

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
  lstShiftData=[];
  intShiftId=null;
  lstSelectedDesignation=[]
  lstDesignationData=[];
  lstLocationData=[];
  lstSelectedLocation=[];
  searchEmployee: FormControl = new FormControl();
  lstEmployeeData=[];
  selectedEmployee='';
  selectedEmployeeId=null;
  lstEmpSelected=[];
  lstSelectedEmpId=[];
  strEmployee='';
  @ViewChild('empId',{'static':true}) empId: ElementRef;
  constructor(
    private serverService: ServerService,
    private spinner: NgxSpinnerService
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
      //-------------------shift dropdown-------------------------//
      this.serverService.getData('shift_schedule/list_shift/').subscribe(
        (response) => {
            if (response.status == 1) {
              this.lstShiftData=response['lst_shift_shedule'];
            }  
          },
          (error) => {   
        });
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
        this.serverService.getData('location/list_loc/').subscribe(
          (response) => {
              if (response.status == 1) {
                this.lstLocationData=response['lst_loc'];
              }  
            },
            (error) => {   
          });
        //-------------------Physical Location dropdown ends-------------------------//
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
  getTimingData() {
    let dctTempData={};
    if(!this.intMonthYear){
      Swal.fire("Error!","Select Month and Year","error");
      return false;
    }
    
    dctTempData['intMonthYear']=this.intMonthYear;
    dctTempData['intDepartmentId']=this.intDepartmentId;
    dctTempData['intShiftId']=this.intShiftId;
    dctTempData['lstDesignation']=this.lstSelectedDesignation;
    dctTempData['lstLocation']=this.lstSelectedLocation;
    dctTempData['lstEmployee']=this.lstSelectedEmpId;
    
    this.spinner.show();
    this.serverService.postData('less_hour_deduction/less_hour_report/',dctTempData).subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status == 1) {
          const file_data = response['data'];
          const dlnk = document.createElement('a');
          dlnk.href = file_data;
          dlnk.download = file_data;
          document.body.appendChild(dlnk);
          dlnk.click();
          dlnk.remove();
          this.clearFields();
        } else if(response.status === 0 && response['message']){
          Swal.fire('Error!',response['message'],'error');
       }
       else if(response.status === 0 && response['reason']){
        Swal.fire('Error!',response['reason'],'error');
       } 
       else {
          Swal.fire('Error!','Download Failure','error');
        }  
      },
      (error) => {   
        this.spinner.hide();
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });   
  }
  employeeChanged(item){
    this.selectedEmployee=item.strUserName;
    this.selectedEmployeeId=item.intId;

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
  clearFields() {

    this.intMonthYear=null;
    this.intDepartmentId=null;
    this.intShiftId=null;
    this.lstSelectedDesignation=[];
    this.lstSelectedLocation=[];
    this.lstSelectedEmpId=[];    
  }

}
