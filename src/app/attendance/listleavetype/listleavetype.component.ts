import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ServerService } from '../../server.service'
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-listleavetype',
  templateUrl: './listleavetype.component.html',
  styleUrls: ['./listleavetype.component.css']
})
export class ListleavetypeComponent implements OnInit {

  lstLeaveType=[]
  dataSource=new MatTableDataSource(this.lstLeaveType);
  displayedColumns=["vchr_name","vchr_Year","int_leaves_per_year","int_leaves_per_month","action"]
  lstPermission=[];
  blnAdd=true;
  blnEdit=true;
  blnView=true;
  blnDelete=true;
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator

  constructor(
    private serverService: ServerService,
    public router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
      //_______________________setting up permissions___________________________
        this.lstPermission = JSON.parse(localStorage.getItem("permission"));    
        this.lstPermission.forEach((item, index, array) => {
        if (item["NAME"] == "Leave") {
          this.blnView = item["VIEW"];

          }
        });
    //_______________________setting up permissions___________________________
    this.getLeavetype();
    this.dataSource.paginator=this.paginator;
  }

  getLeavetype(){ //load leave type list data

    this.lstLeaveType=[];

    this.spinner.show();
    this.serverService.getData('leave_management/add_leavetype/').subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstLeaveType=response['lst_leave_type'];
            this.dataSource=new MatTableDataSource(this.lstLeaveType);
            if(this.lstLeaveType.length >0){
              console.log(this.dataSource)
              this.dataSource.paginator=this.paginator;
              this.dataSource.paginator.firstPage();
            this.dataSource.sort=this.sort;

            }
           
          }  
      },
      (error) => {  
        this.spinner.hide(); 
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }

  deleteLeave(id){
    let dctTempData={}
    // dctTempData['strName']=item.vchr_name;
    // dctTempData['strCode']=item.vchr_code;
    dctTempData['intId']=id;
    this.spinner.show();
    this.serverService.patchData('leave_management/add_leavetype/',dctTempData)
      .subscribe(
          (response) => {
            this.spinner.hide();
             if (response.status === 1) {
              Swal.fire('Leavetype deleted successfully');
              this.getLeavetype();
            }
           else if (response.status === 0) {
              Swal.fire('Leavetype deletion failed');
           }
        },
        (error) => {
          this.spinner.hide();
         // console.log('response');

      });

  }

  editLeave(id){
    let intLeaveId = id;
    localStorage.setItem("leaveAction","edit")
    localStorage.setItem("intLeaveTypeId",intLeaveId)
    this.router.navigate(["/attendance/leavetype"]); 

  }

}
