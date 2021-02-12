import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from 'src/app/server.service';
// import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import Swal from "sweetalert2";
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-combo-off-list',
  templateUrl: './combo-off-list.component.html',
  styleUrls: ['./combo-off-list.component.css']
})
export class ComboOffListComponent implements OnInit {

  lstComboOff=[];
  dataSource= new MatTableDataSource(this.lstComboOff);
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:true}) sort: MatSort;
  displayedColumns=["code","name","datwork","datexpiry","mode","action"]
  lstSelectedUserId=[]
  strDepartment;
  blnHR=false;
  blnHOD=false;
  constructor(
    private serverService: ServerService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.strDepartment = localStorage.getItem('strDepartment');
    // if (this.strDepartment == 'HR & ADMIN' ){
    //   this.blnDeptShow =true;
    // }
    this.getComboList();
  }

  getComboList () {
    this.spinner.show();
    this.serverService.getData('combo_off/combo_list/').subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstComboOff=response['data'];
            this.blnHOD=response['blnHod'];
            this.blnHR=response['blnHr'];
            this.dataSource= new MatTableDataSource(this.lstComboOff);
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
      this.lstSelectedUserId.push(item.intComboUserId);
    }
    else{
      const index = this.lstSelectedUserId.indexOf(item.intComboUserId, 0);
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
    this.serverService.postData('combo_off/combo_list/',dctTempData)
    .subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status === 1) {
          Swal.fire('Data verified successfully');
          this.getComboList();

        } else if (response.status === 0) {
            Swal.fire("Error!",response['message'],"error");
        }

      },
    (error) => {
      this.spinner.hide()

    });
  }
  rejectComboOff () {
    let dctTempData={};
    if(this.lstSelectedUserId.length== 0){
      Swal.fire("Error!","Select atleast one employee","error");
      return false;
    }
    dctTempData['lstId']=this.lstSelectedUserId


    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure want to reject this comp off, You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reject!',
      cancelButtonText: "No, Don't Reject"
    }).then((result) => {
      if (result.value){
        this.spinner.show();
        this.serverService.patchData('combo_off/combo_list/',dctTempData)
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
              this.getComboList();

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
    this.lstComboOff=[];
  }


}
