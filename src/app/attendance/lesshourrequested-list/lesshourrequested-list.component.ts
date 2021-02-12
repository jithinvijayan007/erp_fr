import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
// import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-lesshourrequested-list',
  templateUrl: './lesshourrequested-list.component.html',
  styleUrls: ['./lesshourrequested-list.component.css']
})
export class LesshourrequestedListComponent implements OnInit {
  intRequestId;
  strRemarks;
  lstData = []
  popUp;
  dataSource=new MatTableDataSource(this.lstData);
  displayedColumns=["vchr_name","str_status","dat_requested"]

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator
  constructor(
    public serverService:ServerService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
    ) { }
  ngOnInit() {
    this.getData();
  }
  getData(){
    let strListType = 'REQUESTED';
    this.spinner.show();
    this.serverService.getData("less_hour_deduction/late_hour/?listType="+strListType).subscribe(
      (response) => {
        this.spinner.hide();
        if(response['status']==1){
        this.lstData = response['data']
        this.dataSource=new MatTableDataSource(this.lstData);
        this.dataSource.paginator=this.paginator
        }
      },
      (error) => {
        this.spinner.hide();
  
      });
  }
}
