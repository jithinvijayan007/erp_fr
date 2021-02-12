import { log } from 'util';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
// import { SharedService } from '../../../layouts/shared-service';
// import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';


// import {DataSource} from '@angular/cdk/collections';
// import {BehaviorSubject} from 'rxjs/BehaviorSubject';
// import {Observable} from 'rxjs/Observable';

import { ServerService} from '../../server.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
// import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));


@Component({
  selector: "app-customerlist",
  templateUrl: "./customerlist.component.html",
  styleUrls: ["./customerlist.component.scss"]
})
export class PageCustomerlistComponent implements OnInit, AfterViewInit {
  companyId = Number(localStorage.getItem("companyId"));
  pageTitle: string = "Sorting table";
  displayedColumns = ["Name", "email", "Number", "Location", "Actions"];
  customerList = [];
  sortedCustomerList = [];
  sortedCustomerListLength = 0;
  rdobtnType = true;
  btnFilter = false;
  imagepath = "choose a file";
  dataSource2 = new MatTableDataSource(this.sortedCustomerList);
  lstPermission = JSON.parse(localStorage.getItem("permission"));
  blnAdd = true;
  blnView = true;
  blnEdit = true;
  blnDelete = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    // private _sharedService: SharedService,
    private serverService: ServerService,
    public router: Router
  ) {
    // this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    if (!localStorage.getItem("Tokeniser")) {
      // this.router.navigate(['/user/sign-in']);
      this.router.navigate(["/user/landing"]);
    }
    localStorage.removeItem("custid");
    localStorage.removeItem("customerCallSource");

    this.getCustomerList();
    this.lstPermission.forEach((item, index, array) => {
      if (item["NAME"] == "CUSTOMER") {
        this.blnAdd = item["ADD"];
        this.blnView = item["VIEW"];
        this.blnEdit = item["EDIT"];
        this.blnDelete = item["DELETE"];
      }
    });
    // this.PaginationSort();
    // swal('error','sample','question').then((result) =>{if(result.value){swal(
    //   'Deleted!',
    //   'Your file has been deleted.',
    //   'success'
    // )} else {
    //   swal(
    //     'Cancelled',
    //     'Your imaginary file is safe :)',
    //     'error'
    //   )
    // }});
  }
  getCustomerList() {

    // this.serverService.getCustomer(this.companyId).subscribe(
    //   response => {
    //     this.customerList = this.sortedCustomerList = response;
    //     // this.sortedCustomerList = []
    //     this.dataSource2 = new MatTableDataSource(this.sortedCustomerList);
    //     this.sortedCustomerListLength = this.sortedCustomerList.length;
    //     this.PaginationSort();
    //   },
    //   error => {}
    // );

    //me

    this.serverService.getData("customer/getcustomerlist/?id="+this.companyId).subscribe(
      (response) => {  
            this.customerList = this.sortedCustomerList = response['lst_cust'];
            // this.sortedCustomerList = []
            this.dataSource2 = new MatTableDataSource(this.sortedCustomerList);
            this.sortedCustomerListLength = this.sortedCustomerList.length;
            this.PaginationSort();
          },
          error => {}
        );

  }
  PaginationSort() {
    this.dataSource2.paginator = this.paginator;
    this.dataSource2.paginator.firstPage();
    this.dataSource2.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }
  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator;
    this.dataSource2.sort = this.sort;
  }
  viewCustomerDetails(id) {
    localStorage.setItem("custid", id);
    console.log(id);
    
    this.router.navigate(["/customer/viewcustomer"]);
  }
  editCustomerDetails(itemId) {
    // let editData = this.customerList.find(x => x.id == itemId);
    // localStorage.setItem('id', JSON.stringify(editData));
    localStorage.setItem("custid", itemId);
    this.router.navigate(["/customer/editcustomer"]);
  }
  deleteCustomerDetails(itemId) {
    swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        const data = { id: itemId, cust_activestate: "False" };
        

        // this.serverService.deleteCustomer(JSON.stringify(data)).subscribe(
        //   response => {
        //     // swal(
        //     //   'Deleted!',
        //     //   'Your file has been deleted.',
        //     //   'success'
        //     // );
        //     swal({
        //       position: "center",
        //       type: "success",
        //       title: "Your file has been deleted.",
        //       showConfirmButton: false,
        //       timer: 1000
        //     });
        //     this.getCustomerList();
        //   },
        //   error => {
        //     // swal(
        //     //   'Cancelled',
        //     //   'Something went wrong',
        //     //   'error'
        //     // )
        //     // swal({
        //     //   position: 'top-end',
        //     //   type: 'success',
        //     //   title: 'Your work has been saved',
        //     //   showConfirmButton: false,
        //     //   timer: 1000
        //     // })
        //   }
        // );

        //edited

        this.serverService.postData("customer/removecustomerdata/",data).subscribe(
          response => {
            // swal(
            //   'Deleted!',
            //   'Your file has been deleted.',
            //   'success'
            // );
            swal.fire({
              position: "center",
              type: "success",
              title: "Your file has been deleted.",
              showConfirmButton: false,
              timer: 1000
            });
            this.getCustomerList();
          },
          error => {
            // swal(
            //   'Cancelled',
            //   'Something went wrong',
            //   'error'
            // )
            // swal({
            //   position: 'top-end',
            //   type: 'success',
            //   title: 'Your work has been saved',
            //   showConfirmButton: false,
            //   timer: 1000
            // })
          }
        );
      } else {
        // swal(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
        swal.fire({
          position: "center",
          type: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  }
  searchData() {
    alert(this.rdobtnType);
  }
  dataUpload(event) {
    let input = document.getElementById("dataInput");
    const files = event.target.value;
    // let book = excel.Workbooks.open
    alert(input[0]);
  }

  redirectTo() {
    localStorage.setItem("customerCallSource", "0");
    this.router.navigate(["/crm/addcustomer"]);
  }
}
