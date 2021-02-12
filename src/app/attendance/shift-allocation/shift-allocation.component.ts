import { Component, OnInit } from '@angular/core';
import { ServerService } from "../../server.service";
import Swal from 'sweetalert2';
import * as moment from 'moment'
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-shift-allocation',
  templateUrl: './shift-allocation.component.html',
  styleUrls: ['./shift-allocation.component.css']
})
export class ShiftAllocationComponent implements OnInit {

  datShiftFrom=null;
  datShiftTo=null;
  intShiftId=null;
  lstShiftData=[];
  strShift='';
  selectedShift='';
  selectedShiftId=null;
  lstSelectedEmployees=[];
  lstEmployeeData=[];
  constructor(
    private serverService: ServerService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {

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
  }

  shiftChanged(item){
  
    this.selectedShift=item.vchr_name;
    this.selectedShiftId=item.fk_employee__user_ptr_id;

  }
  shiftChange(event){
    let dctData={};
    this.lstEmployeeData


    this.intShiftId=event

    if(!this.intShiftId){
      Swal.fire('Error!', 'Select shift', 'error');
      return false;
    }
    dctData['intShiftId']=event;
    

    this.spinner.show();
    this.serverService.postData('shift_allocation/list_employee/', dctData).subscribe(
      (response) => {
        this.spinner.hide();
        if (response['status'] == 1){
        this.lstEmployeeData = response['lst_employee'];
        }
        else if(response['status'] == 0){
          if(response.hasOwnProperty('reason')){
            Swal.fire(response['reason']);
          }
          else if(response.hasOwnProperty('message')){
            Swal.fire(response['message']);
          }
        }
      },
      (error) => {
        this.spinner.hide();
        Swal.fire('Error!', 'error', 'error');

      });
    
  }

saveShiftAllocated(){
  let dctTempData={}
  
  if(!this.datShiftFrom){
    Swal.fire('Error!', 'Select from date', 'error');
    return false;
  }
  else if(!this.datShiftTo){
    Swal.fire('Error!', 'Select to date', 'error');
    return false;
  }
  else if(this.datShiftFrom>this.datShiftTo){
    Swal.fire('Error!', 'From date should be less than To date', 'error');
    return false;
  }
  else if(!this.intShiftId){
    Swal.fire('Error!', 'Select shift', 'error');
    return false;
  }
  else if(this.lstSelectedEmployees.length==0){
    Swal.fire('Error!', 'Select atleast one employee', 'error');
    return false;
  }


  dctTempData['intShiftId']=this.intShiftId;
  // dctTempData['datFrom']=this.datShiftFrom;
  dctTempData['datFrom']=moment(this.datShiftFrom).format('YYYY-MM-DD')
  dctTempData['datTo']=moment(this.datShiftTo).format('YYYY-MM-DD')

  // dctTempData['datTo']=this.datShiftTo;
  dctTempData['lstEmployee']=this.lstSelectedEmployees;

  this.spinner.show();
  this.serverService.postData('shift_allocation/allocate/',dctTempData)
  .subscribe(
    (response) => {
      this.spinner.hide();
      if (response.status === 1) {
        Swal.fire('Shift allocated successfully');
      } else if (response.status === 0) {
        if(response.hasOwnProperty('reason')){
          Swal.fire(response['reason']);
        }
        else if(response.hasOwnProperty('message')){
          Swal.fire(response['message']);
        }      }

    },
  (error) => {
    this.spinner.hide();

  });

}

clearFields(){
  this.datShiftFrom=null;
  this.datShiftTo=null;
  this.intShiftId=null;
  this.strShift='';
  this.selectedShift='';
  this.selectedShiftId=null;
  this.lstSelectedEmployees=[];
}

}
