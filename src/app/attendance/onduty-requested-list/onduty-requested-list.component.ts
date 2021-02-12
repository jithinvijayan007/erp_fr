import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import Swal from "sweetalert2";
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-onduty-requested-list',
  templateUrl: './onduty-requested-list.component.html',
  styleUrls: ['./onduty-requested-list.component.css']
})
export class OndutyRequestedListComponent implements OnInit {

  lstRequestedData=[];
  lstSelectedId=[];
  strDepartment;
  blnShowFilter=false;
  displayedColumns=["select","fk_requested__vchr_employee_code","full_name","dat_request","str_day_type","vchr_remarks"]
  dataSource = new MatTableDataSource(this.lstRequestedData);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator
  @ViewChild(MatSort, {static: true}) sort: MatSort
  constructor(
    private serverService: ServerService,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit() {
    if (this.strDepartment == 'HR & ADMIN'){
      this.blnShowFilter = true;
    }
    this.getRequestedData();
  }

  getRequestedData(){

    this.spinner.show();
    this.serverService.getData('on_duty_request/add_request/').subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstRequestedData=response['data'];
            this.dataSource= new MatTableDataSource(this.lstRequestedData);
            this.dataSource.paginator=this.paginator;
            this.dataSource.sort=this.sort;
          }  
      },
      (error) => {   
        this.spinner.hide()
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });

   }
   checkBoxChange(event,item){     
    if(event){
      this.lstSelectedId.push(item.pk_bint_id);
    }
    else{
      const index = this.lstSelectedId.indexOf(item.pk_bint_id, 0);
        if (index > -1) {
          this.lstSelectedId.splice(index, 1);
         }
    }
    
    
    
  }
  saveProceed() {
    let dctTempData={};
    dctTempData['lstId']=this.lstSelectedId


    this.spinner.show();
    this.serverService.postData('on_duty_request/verify_request/',dctTempData)
    .subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status === 1) {
          Swal.fire('Data verified successfully');
          this.getRequestedData();

          // localStorage.setItem("groupAction","save");
          // this.router.navigate(["/attendance/manualattendancelist"]);

        } else if (response.status === 0) {
            Swal.fire("Error!",response['message'],"error");
        }

      },
    (error) => {
      this.spinner.hide();

    });
  }
  saveReject () {
    let dctTempData={};
    if(this.lstSelectedId.length== 0){
      Swal.fire("Error!","Select atleast one employee","error");
      return false;
    }
    dctTempData['lstId']=this.lstSelectedId

    Swal.fire({
      title: 'Are you sure you want to continue',
      // text: "Candidate has not completed Level 2 and Level 3!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Continue!'
    }).then((result) => {
      if (result.value){
        this.spinner.show();
        this.serverService.patchData('on_duty_request/verify_request/',dctTempData)
        .subscribe(
          (response) => {
            this.spinner.hide();
            if (response.status === 1) {
              Swal.fire({
                title:'Selected employees are rejected',
                showConfirmButton: false,
                type: 'success',
                timer: 1500,
              });
              this.getRequestedData();

            } else if (response.status === 0) {
                Swal.fire("Error!",response['message'],"error");
            }
          },
        (error) => {
          this.spinner.hide()

        });
      }      
    });
  }
  clearFields() {
    for(let row of this.lstRequestedData){
      row['blnSelect']=false;
    }
    this.dataSource= new MatTableDataSource(this.lstRequestedData);
    this.dataSource.paginator=this.paginator;
    this.dataSource.sort=this.sort;
    
    
  }
  

}
