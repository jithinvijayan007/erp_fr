import { Component, OnInit } from '@angular/core';
import { ServerService } from "../../server.service";
import Swal from 'sweetalert2';
import * as moment from 'moment'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-shift-allocation-new',
  templateUrl: './shift-allocation-new.component.html',
  styleUrls: ['./shift-allocation-new.component.css']
})
export class ShiftAllocationNewComponent implements OnInit {

  lstWeekOffData = [];

  lstShiftData = [];
  selectedShift;
  selectedShiftId;
  lstDayMonth =[];
  intMonth = 1;
  intYear = 2019;
  lstDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  datShiftFrom=null;
  datShiftTo=null;
  todate;
  fromDate;
  validationShiftDate ;
  shiftName;
  lstBranchData=[];
  intSelectedBranchId=null;
  intSelectedDesigantionId=null;
  lstDesignationData=[];

  constructor(
    private serverService: ServerService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
        this.getFilterData()
  
  }

  // shiftChanged(shift,allDates,selectedIndex,k){

    
  //   if(selectedIndex != 0){
  //     if(allDates[selectedIndex-1].intShiftId == null || allDates[selectedIndex-1].intShiftId == 0){
  //       this.lstWeekOffData[k]["lst_all_dates"][selectedIndex].strShiftId = null;
  //       Swal.fire('select shift on ' + allDates[selectedIndex-1].date);

  //       return false;
  //     }
      
  //   }
   


  // }
  shiftClick(allDates,selectedIndex){    
    
   
    if(selectedIndex != 0){
      if(allDates[selectedIndex-1].intShiftId == null){
        allDates[selectedIndex].blnShift = false;
        Swal.fire('select shift on ' + allDates[selectedIndex-1].date);

        return false;
      }
      else{
        allDates[selectedIndex].blnShift = true;
      }
      
    }
    else{
      allDates[selectedIndex].blnShift = true;
    }
    

  }


  getData(){
    
    

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
    else{
      this.todate =moment(this.datShiftTo).format('DD-MM-YYYY');
      this.fromDate = moment(this.datShiftFrom).format('DD-MM-YYYY');
      this.todate = Number(this.todate.split("-", 1));
      this.fromDate = Number(this.fromDate.split("-", 1));
      if(this.todate - this.fromDate >= 7){
        Swal.fire('Error!', 'Date range greater than one week', 'error');
        return false;   
      }
    }
    const dctTempdata = {}
    dctTempdata['dateFrom'] = moment(this.datShiftFrom).format('YYYY-MM-DD');
    dctTempdata['dateTo'] =   moment(this.datShiftTo).format('YYYY-MM-DD');
    dctTempdata['intBranchId']=this.intSelectedBranchId;  
    dctTempdata['intDesigId']=this.intSelectedDesigantionId;
    this.lstWeekOffData=[];
    this.spinner.show();
    this.serverService.postData('shift_allocation/employee_shift_list/',dctTempdata).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            if(response['lst_data'].length>0){
              this.lstDayMonth=response['lst_data'][0]['lst_all_dates'];
              this.lstWeekOffData=response['lst_data']
            }
            // this.getEmployees();
          }  
      },
      (error) => {  
        this.spinner.hide(); 
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });


  }

  saveShiftAllocated(){
    // for(let emp of this.lstWeekOffData){
    //   let intWeekCount=0;
    //   for(let date of emp.lst_all_dates) {
    //     if(date.intShiftId==0){
    //       intWeekCount=intWeekCount+1;
    //     }
    //   }
    //   if(intWeekCount>1){
    //     Swal.fire("Error!","More than one weekoff for "+emp.strName,"error");
    //     return false;
    //   }
    // }
    const dctTempdata = {};
    dctTempdata['lstWeekOffData'] = this.lstWeekOffData;
    // dctTempdata['intId'] = this.lstWeekOffData[0].intId;
    this.spinner.show();
    this.serverService.postData('shift_allocation/shift_allocate/',dctTempdata).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
           Swal.fire('Success!','Shift successfully allocated',"success");
            // this.getEmployees();
          this.lstWeekOffData = [];
          this.clearFields();
          }
          else if(response.hasOwnProperty('message')) {
            Swal.fire("Error!",response['message'],"error");
          }
          else{
            Swal.fire("Error","Error!","error");
          }  
      },
      (error) => {   
        this.spinner.hide();
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
    

  }
  clearFields(){
    this.datShiftFrom = null;
    this.datShiftTo = null;
    this.lstWeekOffData = [];
    this.intSelectedBranchId=null;
    this.intSelectedDesigantionId=null;
  }
  shiftChanged(itemData,shiftId) {

    if(shiftId==0){
      itemData.blnWeekOff=true;
    }
    else{
      itemData.blnWeekOff=false;
    }
  }
  getFilterData() {
    this.spinner.show();
    this.serverService.getData('shift_allocation/employee_shift_list/').subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstBranchData=response['lst_branch'];
            this.lstDesignationData=response['lst_desig']
            // this.lstDayMonth=response['lst_data'][0]['lst_all_dates'];
            // this.lstWeekOffData=response['lst_data']
            // this.getEmployees();
          }  
      },
      (error) => {   
        this.spinner.hide();
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }

}
