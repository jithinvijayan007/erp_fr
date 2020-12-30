import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cashclosure-list',
  templateUrl: './cashclosure-list.component.html',
  styleUrls: ['./cashclosure-list.component.css']
})
export class CashclosureListComponent implements OnInit {

  displayedColumns = ["date","time","branch","staff","total","short/excess","amount","action"];
  dataSource = new MatTableDataSource();

  datTo;
  datFrom;
  selectedFrom;
  selectedTo;
  lstData = [];
  popUp;

  constructor(
    private serviceObject: ServerService,
    public router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
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
    this.serviceObject.postData('case_closure/case_closure_list/', dctData ).subscribe(
      (response) => {
        if (response.status == 1) {
          this.lstData = response['lst_dayclosure_details']
          // this.lstData = [{'dat_time':'11/10/2019','branch_name':'chalakkudy','staff_name':'manu','total_amount':100,'json_data':[{'note':200,'count':5,'total':1000}]},
          // {'dat_time':'11/10/2019','branch_name':'chalakkudy','staff_name':'thomas','total_amount':100,'json_data':[{'note':200,'count':5,'total':1000}]}];
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
  dctItem = {}

  openfilteritem(filteritem,item) {
    this.dctItem = item
    this.popUp = this.modalService.open(filteritem, { size: 'lg', windowClass: 'filteritemclass' });
  }

}
