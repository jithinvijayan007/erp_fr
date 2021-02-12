import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from "sweetalert2";
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-week-off-list',
  templateUrl: './week-off-list.component.html',
  styleUrls: ['./week-off-list.component.css']
})
export class WeekOffListComponent implements OnInit {

  lstWeekOff=[];
  dataSource= new MatTableDataSource(this.lstWeekOff);
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:true}) sort: MatSort;
  displayedColumns=["strEMPCode","strFullName","datFrom","datTo","action"]
  lstSelectedUserId=[]
  strDepartment;
  constructor(
    private serverService: ServerService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.strDepartment = localStorage.getItem('strDepartment');
  
    this.getWeekoffList();
  }

  getWeekoffList () {
    this.spinner.show();
    this.serverService.getData('dutyroster/weekoff_approve/').subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstWeekOff=response['lst_employee'];
            
            this.dataSource= new MatTableDataSource(this.lstWeekOff);
            this.dataSource.paginator=this.paginator;
            this.dataSource.sort=this.sort;
          }  
      },
      (error) => {   
        this.spinner.hide();
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }
  checkBoxChange(event,item){
    if(event){
      this.lstSelectedUserId.push(item.intWeekoffId);
    }
    else{
      const index = this.lstSelectedUserId.indexOf(item.intWeekoffId, 0);
        if (index > -1) {
          this.lstSelectedUserId.splice(index, 1);
         }
    }
  }
  saveProceed () {
    let dctTempData={};
    if(this.lstSelectedUserId.length== 0){
      Swal.fire("Error!","Select atleast one employee","error");
      return false;
    }
    dctTempData['lstId']=this.lstSelectedUserId


    this.spinner.show();
    this.serverService.postData('dutyroster/weekoff_approve/',dctTempData)
    .subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status === 1) {
          Swal.fire('Data verified successfully');
          this.getWeekoffList();

        } else if (response.status === 0) {
            Swal.fire("Error!",response['message'],"error");
        }

      },
    (error) => {
      this.spinner.hide()

    });
  }
  saveReject () {
    let dctTempData={};
    if(this.lstSelectedUserId.length== 0){
      Swal.fire("Error!","Select atleast one employee","error");
      return false;
    }
    dctTempData['lstId']=this.lstSelectedUserId

    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure want to reject this week off, You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reject!',
      cancelButtonText: "No, Don't Reject"
    }).then((result) => {
      if (result.value){
        this.spinner.show();
        this.serverService.patchData('dutyroster/weekoff_approve/',dctTempData)
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
              this.getWeekoffList();

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

  clearFields () {
    this.lstWeekOff=[];
  }


}
