import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from "sweetalert2";
import { ServerService } from "../../server.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-auditor-attendance',
  templateUrl: './auditor-attendance.component.html',
  styleUrls: ['./auditor-attendance.component.css']
})
export class AuditorAttendanceComponent implements OnInit {


  intMonth;
  intYear;
  lstMonths = [
    {'name':'January','value':1},
    {'name':'February','value':2},
    {'name':'March','value':3},
    {'name':'April','value':4},
    {'name':'May','value':5},
    {'name':'June','value':6},
    {'name':'July','value':7},
    {'name':'August','value':8},
    {'name':'September','value':9},
    {'name':'October','value':10},
    {'name':'November','value':11},
    {'name':'December','value':12},
  ];
  lstYears = [
    {'name':'2018','value':2018},
    {'name':'2019','value':2019},
    {'name':'2020','value':2020},
  ];
  displayedColumns=["EmpCode","EmpName","DurActive"]
  lstReportData=[]
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource=new MatTableDataSource(this.lstReportData);
  constructor(
    private serverService: ServerService,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit() {
    this.dataSource.sort=this.sort;
    this.dataSource.paginator=this.paginator;
  }

  showData(){
    this.lstReportData = [];
    if(!this.intMonth){
      Swal.fire("Error!","Select Month","error");
      return false;
    }
    else if(!this.intYear){
      Swal.fire("Error!","Select Year","error");
      return false;
    }
    let dct_data = {
      'int_month':this.intMonth,
      'int_year':this.intYear
    };
    this.spinner.show();
    this.serverService.postData('attendance/audit_month_wise/',dct_data).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstReportData=response['lst_audit'];
            this.dataSource=new MatTableDataSource(this.lstReportData);
            if(this.lstReportData.length >0){
              this.dataSource.paginator=this.paginator;
              // this.dataSource.paginator.firstPage();
            this.dataSource.sort=this.sort;

            }
           
          }
          else{
            Swal.fire("Error!",response['reason'],"error")
          }  
      },
      (error) => { 
        this.spinner.hide(); 
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }

}
