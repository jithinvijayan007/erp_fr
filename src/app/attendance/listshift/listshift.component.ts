import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service'
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-listshift',
  templateUrl: './listshift.component.html',
  styleUrls: ['./listshift.component.css']
})
export class ListshiftComponent implements OnInit {

  lstShiftData=[]

  dataSource = new MatTableDataSource(this.lstShiftData);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator
  @ViewChild(MatSort, {static: true}) sort: MatSort
  displayedColumns=['vchr_code','vchr_name','time_shift_from','time_shift_to','time_shed_hrs','action']
  lstPermission=[];
  blnAdd=true;
  blnView=true;
  blnEdit=true;
  blnDelete=true;
  
  constructor(
    private serverService:ServerService,
    public router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {

      //_______________________setting up permissions___________________________
        this.lstPermission = JSON.parse(localStorage.getItem("permission"));    
        this.lstPermission.forEach((item, index, array) => {
        if (item["NAME"] == "Shift") {
          this.blnAdd = item["ADD"];
          this.blnView = item["VIEW"];
          this.blnEdit = item["EDIT"];
          this.blnDelete = item["DELETE"];
          }
        });
    //_______________________setting up permissions___________________________
    this.getShiftList()
  }

  getShiftList(){ //load Shift list data

    this.lstShiftData=[];

    this.spinner.show();
    this.serverService.getData('shift_schedule/list_shift/').subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstShiftData=response['lst_shift_shedule'];
            this.dataSource= new MatTableDataSource(this.lstShiftData);
            this.dataSource.paginator=this.paginator;
            this.dataSource.sort=this.sort
            // this.dataSource.paginator.firstPage();

          }  
      },
      (error) => {   
        this.spinner.hide();
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }

  viewShift(id){
    let intshiftId = id;
    localStorage.setItem("intShiftId",intshiftId)
    this.router.navigate(["/attendance/viewshift"]);
    
  }
  editShift(id){
    let intshiftId = id;
    localStorage.setItem("intShiftEditId",intshiftId)
    this.router.navigate(["/attendance/editshift"]); 
  }

  deleteShift(id){
    // console.log("item",item);

    let dctTempData={}
    // dctTempData['strName']=item.vchr_name;
    // dctTempData['strCode']=item.vchr_code;
    dctTempData['id']=id;
    this.spinner.show();
    this.serverService.patchData('shift_schedule/add_shift/',dctTempData)
      .subscribe(
          (response) => {
            this.spinner.hide();
             if (response.status === 1) {
              Swal.fire('Shift deleted successfully');
              this.getShiftList();
            }
           else if (response.status === 0) {
              Swal.fire('Shift deletion failed');
      }
  },
  (error) => {
    this.spinner.hide();
    // console.log('response');

  });
  
  
}

}
