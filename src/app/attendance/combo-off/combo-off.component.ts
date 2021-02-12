import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ServerService } from "../../server.service";
import Swal from 'sweetalert2';
import * as moment from 'moment'
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-combo-off',
  templateUrl: './combo-off.component.html',
  styleUrls: ['./combo-off.component.css']
})
export class ComboOffComponent implements OnInit {
  constructor(
    private serverService: ServerService,
    private spinner: NgxSpinnerService
    ) { }


  datStart=null;
  datExpire=null;
  minDate=new Date();

  strRemarks:''
  intEmployeeId=null;
  lstEmployeeData=[];
  selectedEmployee='';
  selectedEmployeeId=null;
  lstSelectedEmployees=[];
  strCompoDayType='full';
  intType=1; // 1-Combo Off ,2-Marriage Leave

  searchEmployee : FormControl= new FormControl();
  lstEmployeeChip=[];
  lstEmpSelected=[];
  lstSelectedEmpId=[];
  strEmployee='';
  @ViewChild('empId',{'static':false}) empId: ElementRef;

  strDepartment
  blnShow=false;
  ngOnInit() {

    this.strDepartment = localStorage.getItem('strDepartment');
    let Name =localStorage.getItem('Name')
    if (this.strDepartment == 'HR & ADMIN' ||  Name=='Super User'){
      this.blnShow =true;
    }

    //-------------------shift dropdown-------------------------//
    this.serverService.getData('combo_off/list_user/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstEmployeeData=response['lst_data'];
          }  
        },
        (error) => {   
      });
    //-------------------shift dropdown ends-------------------------//

  //--------------------employee list typeahead -------------------//
    this.searchEmployee.valueChanges
    // .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstEmployeeChip = [];
      } else {
        if (strData.length >= 1) {
          this.serverService
            .postData('attendance_fix/user_typeahead/', { strTerm: strData })
            .subscribe(
              (response) => {
                this.lstEmployeeChip = response['data'];
              }
            );
        }
      }
    }
    ); 
  //--------------------employee list typeahead ends -------------------//
}


saveComboOff(){
  if(this.intType==2){
    this.datStart=new Date();
  }
  let dctTempData={}
  if( this.intType==1 &&  this.lstSelectedEmpId.length==0){
    Swal.fire('Error!', 'Select atleast one employee', 'error');
    return false;
  }
  if( (this.intType==2 || this.intType==3) &&  this.lstSelectedEmpId.length==0){
    Swal.fire('Error!', 'Select atleast one employee', 'error');
    return false;
  }
  else if(this.intType ==1 && !this.datStart){
    Swal.fire('Error!', 'Select worked date', 'error');
    return false;
  }
  else if(!this.datExpire){
    Swal.fire('Error!', 'Select Expire date', 'error');
    return false;
  }
  else if(this.datStart>this.datExpire){
    Swal.fire('Error!', 'Worked date should be less than Expire date', 'error');
    return false;
  }
  else if(!this.strRemarks){
    Swal.fire('Error!', 'Enter Remarks', 'error');
    return false;
  }

  else{
    if(this.intType==1){
    dctTempData['startDate']= moment(this.datStart).format('YYYY-MM-DD')
    dctTempData['expireDate']=moment(this.datExpire).format('YYYY-MM-DD')
    dctTempData['strRemark']=this.strRemarks
    // dctTempData['lstEmployee']=this.lstSelectedEmployees
    dctTempData['lstEmployee']=this.lstSelectedEmpId
    dctTempData['strCompoDayType']=this.strCompoDayType;
    
    

    this.spinner.show();
    this.serverService.postData('combo_off/add_combo_off/',dctTempData).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            Swal.fire('Success!', 'Combo Off Added Successfully', 'success');
            this.clearFields()
          }
          else if(response.status == 0) {
            Swal.fire('Error!', response['reason'], 'error');
            return false;
          }  
        },
        (error) => {
          this.spinner.hide();   
      });
    }else{
      dctTempData['datExpire']=moment(this.datExpire).format('YYYY-MM-DD')
      dctTempData['strRemark']=this.strRemarks
      dctTempData['lstEmployee']=this.lstSelectedEmpId;
      if(this.intType==2){
        dctTempData['blnMarriage']=true;
      }
      else{
        dctTempData['blnMarriage']=false;
      }
      
      

      this.spinner.show();
      this.serverService.postData('leave_management/set_leave/',dctTempData).subscribe(
        (response) => {
          this.spinner.hide();
            if (response.status == 1) {
              Swal.fire('Success!', 'Added Successfully', 'success');
              this.clearFields()
            }  else{
              Swal.fire('Error!', response['message'], 'warning');
            }
          },
          (error) => {   
            this.spinner.hide();
        });
    }
  }

}


addEmployee (event) {
  if (this.lstEmpSelected.filter(x => x.intId === event.intId).length === 0) {
    this.lstEmpSelected.push(event);
    this.lstSelectedEmpId.push((event.intId).toString());
  }
  this.strEmployee = '';
  this.empId.nativeElement.value = '';
  this.lstEmployeeData=[];
  
}
removeEmployee(value) {
  
  const index = this.lstEmpSelected.indexOf(value);
  const index2 = this.lstSelectedEmpId.indexOf((value.intId).toString());
if (index > -1) {
  this.lstEmpSelected.splice(index, 1);
}
if (index2 > -1) {
  this.lstSelectedEmpId.splice(index2, 1);
}
this.lstEmployeeData=[];
}

clearFields(){

  this.datStart=null;
  this.datExpire=null;
  this.strRemarks=''
  this.intEmployeeId=null;
  this.selectedEmployee='';
  this.selectedEmployeeId=null;
  this.lstSelectedEmployees=[];
  this.strCompoDayType='full';
  this.lstEmployeeChip=[];
  this.lstEmpSelected=[];
  this.lstSelectedEmpId=[];
  this.intType=1;
}

leaveTypeChanged () {
  this.selectedEmployee='';
  this.intEmployeeId=null;
  this.selectedEmployeeId=null;
  this.lstSelectedEmployees=[];

  this.lstEmployeeChip=[];
  this.lstEmpSelected=[];
  this.lstSelectedEmpId=[];

  this.strEmployee='';

}

}
