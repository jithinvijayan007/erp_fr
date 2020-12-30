import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dayclosure-list',
  templateUrl: './dayclosure-list.component.html',
  styleUrls: ['./dayclosure-list.component.css']
})
export class DayclosureListComponent implements OnInit {

  displayedColumns = ["date","time","branch","staff","total","short/excess","amount","action"];
  dataSource = new MatTableDataSource();

  datTo;
  datFrom;
  selectedFrom
  selectedTo
  lstData = []
  popUp;

  strGroupname;
  
  // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(private serviceObject: ServerService,
    public router: Router,
    private modalService: NgbModal) { }
    
    ngOnInit() {
    this.strGroupname = localStorage.getItem("group_name")

    let ToDate = new Date()
    let FromDate = new Date();
    this.datTo = ToDate
    this.datFrom = FromDate
    this.getData()
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getData(){

    let dctData = {}
    this.selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
    this.selectedTo = moment(this.datTo).format('YYYY-MM-DD')
    dctData['datFrom'] = this.selectedFrom
    dctData['datTo'] = this.selectedTo

    if (this.datFrom > this.datTo) {

      Swal.fire({
        position: "center",
        type: "error",
        text: "Please select correct date period",
        showConfirmButton: true,
      });
      return false;
    }
    this.serviceObject.postData('dayclosure/dayclosure_list/', dctData ).subscribe(
      (response) => {
        if (response.status == 1) {
          this.lstData = response['data']

          this.dataSource = new MatTableDataSource(this.lstData);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        }
        else{
          this.lstData = []
        }
       
      },
      (error) => {
        this.lstData = []
      }
    );
 

  }

  // viewData(id) {
  //   localStorage.setItem('idDayclosure', id);
  //   this.router.navigate(['dayclosure/viewdayclosure']);
  // }
  dctItem = {}

  openfilteritem(filteritem,item) {
    this.dctItem = item
    this.popUp = this.modalService.open(filteritem, { size: 'lg', windowClass: 'filteritemclass' });
  }

  ApproveDayclosure(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Approve'
    }).then((result) => {
      if (result.value) {
        this.serviceObject.putData('dayclosure/dayclosure_list/', { 'id': id, 'check': 'approve' }).subscribe(
          (response) => {
            if (response.status == 1) {
              Swal.fire('Success', 'Successfully Approved', 'success');
              this.getData()
            }
          },
          (error) => {

          }
        );
      }
    })
  }






  RejectDayclosure(id) {

    Swal.fire({
      title: 'Are you sure?',
      text: "",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Reject'
    }).then((result) => {
      if (result.value) {
        this.serviceObject.putData('dayclosure/dayclosure_list/', { 'id': id, 'check': 'reject' }).subscribe(
          (response) => {
            if (response.status == 1) {
              Swal.fire('Success', 'Successfully Rejected', 'success');
              this.getData()
            }
          },
          (error) => {

          }
        );
      }
    })
  }


}
