import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service'

import Swal from 'sweetalert2';
import { Router } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-jobpositionlist',
  templateUrl: './jobpositionlist.component.html',
  styleUrls: ['./jobpositionlist.component.css']
})
export class JobpositionlistComponent implements OnInit {

  lstJobPositionData=[];
  lstPermission=[];
  blnAdd=true;
  blnView=true;
  blnEdit=true;
  blnDelete=true;
  displayedColumns=['name','desig','area','action'];
  dataSource = new MatTableDataSource(this.lstJobPositionData);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor(
    private serverService: ServerService,
    public router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {

        //_______________________setting up permissions___________________________
        this.lstPermission = JSON.parse(localStorage.getItem("permission"));    
        this.lstPermission.forEach((item, index, array) => {
          if (item["NAME"] == "Designation ") {
            this.blnAdd = item["ADD"];
            this.blnView = item["VIEW"];
            this.blnEdit = item["EDIT"];
            this.blnDelete = item["DELETE"];
          }
        });
        //_______________________setting up permissions___________________________
    this.getJobPositiondata();
  }

  getJobPositiondata(){
    this.lstJobPositionData=[];

    this.spinner.show();
    this.serverService.getData('job_position/add_job/').subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstJobPositionData=response['lst_job_position'];
            this.dataSource = new MatTableDataSource(this.lstJobPositionData);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
          else if(response.status == 0){
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
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });

  }

  deleteJob(item){
    let dctTempData={}
    dctTempData['intJobId']=item.pk_bint_id;
    this.spinner.show();
    this.serverService.patchData('job_position/add_job/',dctTempData)
      .subscribe(
          (response) => {
            this.spinner.hide();
             if (response.status === 1) {
              Swal.fire('Job deleted successfully');
              this.getJobPositiondata();
            }
           else if (response.status === 0) {
              Swal.fire('Job deletion failed');
            }
          },
          (error) => {
            this.spinner.hide();
            // console.log('response');
          });
  }
  editJob(item){
    let intJobId
    intJobId = item.pk_bint_id;
    localStorage.setItem("intJobId", intJobId);
    this.router.navigate(["/jobposition/jobpositionedit"]);
  }
  applyFilter(filterValue: string){
    filterValue = filterValue.trim() // remove whitespace
    filterValue = filterValue.toLowerCase() // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;    
  }
}
