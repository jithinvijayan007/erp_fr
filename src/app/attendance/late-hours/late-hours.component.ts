import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import Swal from "sweetalert2";
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-late-hours',
  templateUrl: './late-hours.component.html',
  styleUrls: ['./late-hours.component.css']
})
export class LateHoursComponent implements OnInit {

  lstLateHrDetails=[];
  dataSource=new MatTableDataSource(this.lstLateHrDetails);
  lstYear=[2019,2020,2021];
  lstMonths = [
    'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
  ];
  lstMonthYear = [];
  intCurYear = new Date().getFullYear();
  intCurMonth = new Date().getMonth()+1;
  intMonthYear = null;
  lstDepartment=[];
  strDepartment;
  blnShowFilter=false;
  intDepartmentId=null;
  lstToBeRegularised=[];
  lstNotRegularised=[];
  displayedColumns=['blnRegularize','strEmpName','strEmpDesig','durLessHour'];

  @ViewChild(MatSort,{static:true}) sort: MatSort;
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;

  constructor(
    private serverService: ServerService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.strDepartment = localStorage.getItem('strDepartment');
    if (this.strDepartment == 'HR & ADMIN'){
      this.blnShowFilter = true;
    //   this.displayedColumns=['Regularize','strEmpName','durLessHour']
    }
    // else{
    //   // this.displayedColumns=[]
    // }
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
  }

  getLateHrsList() {
    this.lstLateHrDetails=[];
    let dctTempData={};
    dctTempData['intMonthYear']=this.intMonthYear;
    if(this.intDepartmentId){
      dctTempData['intDepartmentId']=this.intDepartmentId;
    }    
    this.spinner.show();
    this.serverService.postData('less_hour_deduction/regularize_list/',dctTempData).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstLateHrDetails=response['data'];
            this.dataSource= new MatTableDataSource(this.lstLateHrDetails);
            this.dataSource.paginator=this.paginator;
            this.dataSource.sort=this.sort;
            // this.dataSource.paginator.firstPage();

          }
          else{
            Swal.fire("Error!",response['reason'],"error");
          }  
      },
      (error) => { 
        this.spinner.hide();  
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }
  regularizeValidation() {
    let blnStatus=true;
    for(let item of this.lstLateHrDetails){
      if(!item.blnRegularize){
        blnStatus=false;
      }
    }
    if(!blnStatus){
      Swal.fire({
        title: 'Are you sure?',
        text: "Some users data still not regularised!",
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Continue!'
      }).then((result) => {
        if (result.value) {
          this.regularizeData();
        }
      })
    }
    else{
      this.regularizeData();
    }


   }
   regularizeData(){
    let dctTempData={}
    if(this.lstToBeRegularised.length == 0){
      Swal.fire("Error!",'Select atleast one employee',"error");
      return;
    }
    dctTempData['lstLessId']=this.lstToBeRegularised;
    
    // dctTempData['lstData']=this.lstLateHrDetails;
    this.spinner.show();
    this.serverService.patchData('less_hour_deduction/regularize_list/',dctTempData)
    .subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status === 1) {
          Swal.fire("Success!",'Data saved successfully',"success");
          this.getLateHrsList();

          // localStorage.setItem("groupAction","save");
          // this.router.navigate(["/attendance/manualattendancelist"]);

        } else if (response.status === 0) {
            Swal.fire("Error!",response['reason'],"error");
        }

      },
    (error) => {
      this.spinner.hide();

    });
   }
   
   toBeRegularizedChanged(event,row){

     if(event){
       this.lstToBeRegularised.push(row.intLessId);
       this.lstNotRegularised.splice(this.lstNotRegularised.indexOf(row.intLessId), 1);

     }
     else if(!event){
       this.lstToBeRegularised.splice(this.lstToBeRegularised.indexOf(row.intLessId), 1);
       this.lstNotRegularised.push(row.intLessId)
     }
     
     
   }
   convertAsLOP() {
     let dctTempData={};
     dctTempData['intMonthYear']=this.intMonthYear;

     let blnStatus=true;
     for(let item of this.lstLateHrDetails){
       if(!item.blnRegularize){
         blnStatus=false;
       }
     }
     if(!blnStatus){
       Swal.fire("Error!","Some datas are not regularised","error");
       return false;
     }
     this.spinner.show();
     this.serverService.postData('less_hour_deduction/add_to_lop/',dctTempData)
     .subscribe(
       (response) => {
         this.spinner.hide();
         if (response.status === 1) {
           Swal.fire('Data saved successfully');
           this.getLateHrsList();
 
           // localStorage.setItem("groupAction","save");
           // this.router.navigate(["/attendance/manualattendancelist"]);
 
         } else if (response.status === 0) {
             Swal.fire("Error!",response['reason'],"error");
         }
 
       },
     (error) => {
       this.spinner.hide();
 
     });
     
   }
   clearFields(){
    this.intMonthYear = this.lstMonthYear[0]['value'];
    this.intDepartmentId=null;
    this.strDepartment=''
   }

}
