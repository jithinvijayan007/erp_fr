import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import Swal from 'sweetalert2'
import { MatTableDataSource} from '@angular/material/table';
import { MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment' 
// import { Ng2SpinnerService } from 'ng2-spinner';
import { NgxSpinnerService } from "ngx-spinner";




@Component({
  selector: 'app-listemployee',
  templateUrl: './listemployee.component.html',
  styleUrls: ['./listemployee.component.css']
})
export class ListemployeeComponent implements OnInit {

  lstEmployeeData=[];
  displayedColumns = ['username',"fullname",'fk_department__vchr_name','fk_desig__vchr_name',"fk_branch__vchr_name","dat_doj","action"];
  lstPermission=[];
  blnAdd=true;
  blnEdit=true;
  blnDelete=true;
  blnView=true;
  popUp;
  dctResigData={}
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator
  @ViewChild(MatSort, {static: true}) sort: MatSort


  dataSource = new MatTableDataSource(this.lstEmployeeData);

  constructor(
    private serverService: ServerService,
    public router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService


  ) { 
    
  }

  ngOnInit() {

    //___________________________setting up permissions____________________
    // this.lstPermission = JSON.parse(localStorage.getItem("permission"));    
    // this.lstPermission.forEach((item, index, array) => {
    //   if (item["NAME"] == "Employee") {
    //     this.blnAdd = item["ADD"];
    //     this.blnView = item["VIEW"];
    //     this.blnEdit = item["EDIT"];
    //     this.blnDelete = item["DELETE"];
    //   }
    // });
    //_________________________setting up permissions__________________________
    this.getEmployeeList()
  }

  getEmployeeList(){ //load Employee list list data

    this.lstEmployeeData=[];

    this.spinner.show();
    this.serverService.getData('user/adduser/').subscribe(
      (response) => {
        this.spinner.hide();
        console.log(response);

        if (response['status'] == 1) {
          
          this.lstEmployeeData=response['lst_userdetailsview'];
          this.dataSource= new MatTableDataSource(this.lstEmployeeData);
          this.dataSource.paginator=this.paginator;
          this.dataSource.sort=this.sort;
          // this.dataSource.paginator.firstPage();

          }  
      },
      (error) => {  
        this.spinner.hide(); 
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }

  viewEmployee(id){
    let
    employeeId = id;
    // console.log (id);
    localStorage.setItem("intEmployeeId","edit")
    localStorage.setItem("intEmployeeId", employeeId);
    this.router.navigate(["/user/viewuser"]);
    
  }
  editEmployee(id){
    let employeeId = id;    
    localStorage.setItem("intEmployeeEditId",id);
    this.router.navigate(["/user/editemployee"]);
  }

  deleteEmployee(){
    let blnReflectGap=false;
    let dctTempData={}
    // dctTempData['strName']=item.vchr_name;
    // dctTempData['strCode']=item.vchr_code;
    if(!this.dctResigData['txtReason']){
      Swal.fire("Error!","Enter Reason","error");
      return false;
    }
    else if(!this.dctResigData['datResignation']) {
      Swal.fire("Error!","Enter Date of Resignation","error");
      return false;
    }
   
    
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to reflect this vacancy in the gap?",
      // icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        blnReflectGap=true;
        this.dctResigData['blnReflectGap']=blnReflectGap
        this.dctResigData['datResignation']=moment(this.dctResigData['datResignation']).format('YYYY-MM-DD')
        this.spinner.show();
        this.serverService.patchData('user/add_user/',this.dctResigData)
          .subscribe(
              (response) => {
                this.spinner.hide();
                 if (response.status === 1) {
                  this.hideModal();
                  Swal.fire('Success!','Employee deleted successfully','success');
                  this.getEmployeeList();
                }
               else if (response.status === 0) {
                  Swal.fire('Error!','Employee deletion failed','error');
          }
      },
      (error) => {
        this.spinner.hide();
        // console.log('response');
    
      });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        blnReflectGap=false;  
        this.dctResigData['blnReflectGap']=blnReflectGap
        this.dctResigData['datResignation']=moment(this.dctResigData['datResignation']).format('YYYY-MM-DD')
        this.spinner.show();
        this.serverService.patchData('user/add_user/',this.dctResigData)
          .subscribe(
              (response) => {
                this.spinner.hide();
                 if (response.status === 1) {
                  this.hideModal();
                  Swal.fire('Success!','Employee deleted successfully','success');
                  this.getEmployeeList();
                }
               else if (response.status === 0) {
                  Swal.fire('Error!','Employee deletion failed','error');
          }
      },
      (error) => {
        this.spinner.hide();
        // console.log('response');
    
      });
      }
    })
    
  
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  deletePopupModal(deletePopup,intId){

    this.dctResigData['intId']=intId;
    this.dctResigData['txtReason']=''
    // this.dctRejectPopup['strRemarks']='';
    this.popUp = this.modalService.open(deletePopup, { size: 'sm', windowClass: 'filteritemclass' });
  
  }
  hideModal (){
    this.dctResigData={};
    this.popUp.close();
  }

}
