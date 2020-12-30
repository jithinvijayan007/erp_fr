import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-listgroup',
  templateUrl: './listgroup.component.html',
  styleUrls: ['./listgroup.component.css']
})
export class ListgroupComponent implements OnInit {
  id;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns = [
    "name",
    "addPermission",
    "editPermission",
    "viewPermission",
    "deletePermission",
    "downloadPermission",
    "action"
  ];
  lstPermission=JSON.parse(localStorage.group_permissions)
  blnAdd = false;
  blnEdit = false;
  blnDelete = false;
  blnView = false;
  lstGroupList: any = [];
  dataSource = new MatTableDataSource(this.lstGroupList);
  constructor(
    private serverService: ServerService,
    private spinnerService: NgxSpinnerService,

    public router: Router,
  ) { }

  ngOnInit() {
    if (!localStorage.getItem("Tokeniser")) {
    localStorage.setItem('previousUrl','/user/sign-in');
      
      this.router.navigate(["/user/sign-in"]);
    }
    this.getGroup();
    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Group List") {
        this.blnAdd = item["ADD"];
        this.blnEdit= item["EDIT"];
        this.blnDelete = item["DELETE"];
        this.blnView = item["VIEW"]
      }
    });
  }
  getGroup() {
    const data = { company_id: Number(localStorage.getItem("companyId")) };
    this.spinnerService.show();

    this.serverService
      .postData('user_groups/grouplist/',data)
      .subscribe(
        res => {
          this.spinnerService.hide();

          if (res.status === 1) {
            this.lstGroupList = res['data'];
            this.dataSource = new MatTableDataSource(this.lstGroupList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.paginator.firstPage();
            this.dataSource.sort = this.sort;
          } else {
            swal.fire("Group List Error", res['data'], "error");
          }
        },
        error => {
          this.spinnerService.hide();

          // this.router.navigate(["/user/page-500"]);
        }
      );


  }
  editGroup(pk_bint_id) {
    this.id = pk_bint_id;
    localStorage.setItem("groupId", pk_bint_id);
    localStorage.setItem('previousUrl','/group/editgroup');
    
    this.router.navigate(["/group/editgroup"]);
  }
  viewGroup(pk_bint_id) {
    localStorage.setItem("groupId", pk_bint_id);
    localStorage.setItem('previousUrl','/group/viewgroup');
    
    this.router.navigate(["/group/viewgroup"]);
  }
  deleteGroup(pk_bint_id) {
    swal.fire({
      title: "Confirm",
      text: "Do you want to delete the group?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then(result1 => {
      if (result1.value) {
       let p = {}
        p['pk_bint_id'] = pk_bint_id;
        this.serverService.postData('user_groups/delete_group/',p).subscribe(result => {
          // const result = res.json();
          if (result.status === 0) {
            swal.fire("Group Delete", result['data'], "success");
            this.getGroup();
          } else {
            swal.fire("Group Delete", result['data'], "error");
            this.getGroup();
          }
        });


      }
    });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
