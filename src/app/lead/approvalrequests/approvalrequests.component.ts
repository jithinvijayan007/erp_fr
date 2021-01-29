import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../layouts/shared-service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';


import { NgxSpinnerService } from 'ngx-spinner';

// import {DataSource} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
// import {BehaviorSubject} from 'rxjs/BehaviorSubject';
// import {Observable} from 'rxjs/Observable';
import { ServerService } from 'src/app/server.service';
import swal from 'sweetalert2';
import { DataService } from 'src/app/global.service';
import { Router } from '@angular/router';
const COLORS = [
  'maroon',
];
const NAMES = [
  'Flight'
];
@Component({
  selector: 'app-approvalrequests',
  templateUrl: './approvalrequests.component.html',
  styleUrls: ['./approvalrequests.component.scss']
})
export class ApprovalrequestsComponent implements OnInit {
  pageTitle = 'Sorting table';
  displayedColumns = [
    'date',
    'enquiryNo',
    'service',
    'estimateAmt',
    'status',
    'staff',
    'remarks',
    'action'
  ];
  // dataSource: ExampleDataSource | null;
  lstPendingFolloeupList = [];
  companyType = localStorage.getItem('company_type');
  userId = localStorage.getItem('userId');

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(this.lstPendingFolloeupList);
  constructor(
    private spinnerService: NgxSpinnerService,
    private _sharedService: SharedService,
    private serverService: ServerService,
    private dataService: DataService,
    private router: Router
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    this.getFollowupList();
    // this.dataSource = new ExampleDataSource(this.exampleDatabase, this.sort, this.paginator);
    // this.dataSource.getPaginateData();
    // this.dataSource1 = new ExampleDataSource1(this.exampleDatabase, this.paginator);
  }
  getFollowupList() {
    if (this.companyType === 'TRAVEL AND TOURISM') {
      // this.serverService
      //   .getPendingFollowupList(JSON.stringify({ int_staff_id: this.userId }))
      //   .subscribe(
      //     response => {
      //       if (response['status'] === 'success') {
      //         this.dataService.pendingEnquiryNotification('yes');
      //         this.lstPendingFolloeupList = response['data'];
      //         this.dataSource = new MatTableDataSource(
      //           this.lstPendingFolloeupList
      //         );
      //         this.dataSource.paginator = this.paginator;
      //         this.dataSource.sort = this.sort;
      //       }
      //       //  swal({
      //       //   title: 'test',
      //       //   text: 'sample message',
      //       //   type: 'success',
      //       //   timer: 2000
      //       // });
      //     },
      //     error => {}
      //   );

      //edited

      this.serverService
        .postData("followup/pending_followup/",{ int_staff_id: this.userId })
        .subscribe(
          response => {
            if (response['status'] === 1) {
              this.dataService.pendingEnquiryNotification('yes');
              this.lstPendingFolloeupList = response['data'];
              this.dataSource = new MatTableDataSource(
                this.lstPendingFolloeupList
              );
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
            //  swal({
            //   title: 'test',
            //   text: 'sample message',
            //   type: 'success',
            //   timer: 2000
            // });
          },
          error => {}
        );
    } else if (this.companyType === 'SOFTWARE') {
      // this.serverService.getSoftwarePendingFollowupList(
      //     JSON.stringify({ int_staff_id: this.userId })
      //   )
      //   .subscribe(
      //     response => {
      //       if (response['status'] === 'success') {
      //         this.lstPendingFolloeupList = response['data'];
      //         this.dataSource = new MatTableDataSource(
      //           this.lstPendingFolloeupList
      //         );
      //         this.dataSource.paginator = this.paginator;
      //         this.dataSource.sort = this.sort;
      //       }
      //       //  swal({
      //       //   title: 'test',
      //       //   text: 'sample message',
      //       //   type: 'success',
      //       //   timer: 2000
      //       // });
      //     },
      //     error => {}
      //   );

      //edited

      this.serverService.postData("software_followup/followup_approve_list/",{ int_staff_id: this.userId })
      .subscribe(
        response => {
          if (response['status'] === 1) {
            this.lstPendingFolloeupList = response['data'];
            this.dataSource = new MatTableDataSource(
              this.lstPendingFolloeupList
            );
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
          //  swal({
          //   title: 'test',
          //   text: 'sample message',
          //   type: 'success',
          //   timer: 2000
          // });
        },
        error => {}
      );
    } else if (this.companyType === 'MOBILE') {
      this.serverService
        .postData('mobile_followup/followup_approve_list/',
          { int_staff_id: this.userId }
        )
        .subscribe(
          response => {
            if (response['status'] === 1) {
              this.lstPendingFolloeupList = response['data'];
              this.dataSource = new MatTableDataSource(
                this.lstPendingFolloeupList
              );
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
            //  swal({
            //   title: 'test',
            //   text: 'sample message',
            //   type: 'success',
            //   timer: 2000
            // });
          },
          error => {}
        );
    } else if (this.companyType === 'MAINTENANCE') {
      this.serverService
        .postData('maintenance_followup/followup_approve_list/',
          { int_staff_id: this.userId })
        .subscribe(
          response => {
            if (response['status'] === 1) {
              this.lstPendingFolloeupList = response['data'];
              this.dataSource = new MatTableDataSource(
                this.lstPendingFolloeupList
              );
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
            //  swal({
            //   title: 'test',
            //   text: 'sample message',
            //   type: 'success',
            //   timer: 2000
            // });
          },
          error => { }
        );
    }
  }
  followupChange(
    strServiceName,
    intServiceId,
    strServiceStatus,
    status,
    dbl_amount,
    remarks
  ) {
    strServiceName =
      strServiceName === 'Kerala City Tour' ? 'KCT' : strServiceName;
    const data = {
      vchr_service: strServiceName,
      int_service_id: intServiceId,
      int_service_status: status,
      int_staff_id: localStorage.getItem('userId'),
      vchr_service_status: strServiceStatus,
      int_estimated_amount: dbl_amount,
      vchr_remarks : remarks
    };
    if (this.companyType === 'TRAVEL AND TOURISM') {
      this.spinnerService.show();

      // this.serverService.changePendingFollowup(JSON.stringify(data)).subscribe(
      //   response => {
      //     this.spinnerService.hide();
      //     if (response['operation'] === 'Approve') {
      //       swal({
      //         title: 'Success',
      //         text: 'Followup approved successfully',
      //         type: 'success',
      //         timer: 2000
      //       });
      //     } else if (response['operation'] === 'Reject') {
      //       swal({
      //         title: 'Success',
      //         text: 'Followup rejected successfully',
      //         type: 'success',
      //         timer: 2000
      //       });
      //     }

      //     this.getFollowupList();
      //   },
      //   error => {
      //     this.spinnerService.hide();
      //   }
      // );

      //edited

      this.serverService.postData("followup/change_followup/",data).subscribe(
        response => {
          this.spinnerService.hide();
          if (response['operation'] === 'Approve') {
            swal.fire({
              title: 'Success',
              text: 'Followup approved successfully',
              type: 'success',
              timer: 2000
            });
          } else if (response['operation'] === 'Reject') {
            swal.fire({
              title: 'Success',
              text: 'Followup rejected successfully',
              type: 'success',
              timer: 2000
            });
          }

          this.getFollowupList();
        },
        error => {
          this.spinnerService.hide();
        }
      );
    } else if (this.companyType === 'SOFTWARE') {
      this.spinnerService.show();
      // this.serverService.changeSoftwarePendingFollowup(JSON.stringify(data)).subscribe(
      //     response => {
      //     this.spinnerService.hide();
      //       if (response['operation'] === 'Approve') {
      //         swal({
      //           title: 'Success',
      //           text: 'Followup approved successfully',
      //           type: 'success',
      //           timer: 2000
      //         });
      //       } else if (response['operation'] === 'Reject') {
      //         swal({
      //           title: 'Success',
      //           text: 'Followup rejected successfully',
      //           type: 'success',
      //           timer: 2000
      //         });
      //       }

      //       this.getFollowupList();
      //     },
      //     error => {
      //     this.spinnerService.hide();
      //     }
      //   );

      //edited

      this.serverService.postData("software_followup/followup_update/",data).subscribe(
        response => {
        this.spinnerService.hide();
          if (response['operation'] === 'Approve') {
            swal.fire({
              title: 'Success',
              text: 'Followup approved successfully',
              type: 'success',
              timer: 2000
            });
          } else if (response['operation'] === 'Reject') {
            swal.fire({
              title: 'Success',
              text: 'Followup rejected successfully',
              type: 'success',
              timer: 2000
            });
          }

          this.getFollowupList();
        },
        error => {
        this.spinnerService.hide();
        }
      );
    } else if (this.companyType === 'MOBILE') {
      this.spinnerService.show();
      this.serverService
        .postData('mobile_followup/followup_update/',data)
        .subscribe(
          response => {
          this.spinnerService.hide();
            if (response['operation'] === 'Approve') {
              swal.fire({
                title: 'Success',
                text: 'Followup approved successfully',
                type: 'success',
                timer: 2000
              });
            } else if (response['operation'] === 'Reject') {
              swal.fire({
                title: 'Success',
                text: 'Followup rejected successfully',
                type: 'success',
                timer: 2000
              });
            }

            this.getFollowupList();
          },
          error => {
          this.spinnerService.hide();
          }
        );
    } else if (this.companyType === 'MAINTENANCE') {
      this.spinnerService.show();
      this.serverService
        .postData('maintenance_followup/followup_update/',data)
        .subscribe(
          response => {
            if (response['operation'] === 'Approve') {
              swal.fire({
                title: 'Success',
                text: 'Followup approved successfully',
                type: 'success',
                timer: 2000
              });
            } else if (response['operation'] === 'Reject') {
              swal.fire({
                title: 'Success',
                text: 'Followup rejected successfully',
                type: 'success',
                timer: 2000
              });
            }

            this.getFollowupList();
          },
          error => {
          this.spinnerService.hide();
           }
        );
    }
  }
  addEnquiryRouting() {
    if (localStorage.getItem('company_type') === 'TRAVEL AND TOURISM') {
      this.router.navigate(['/crm/addtravellead']);
    } else if (localStorage.getItem('company_type') === 'SOFTWARE') {
      this.router.navigate(['/crm/addsoftwarelead']);
    } else if (localStorage.getItem('company_type') === 'MOBILE') {
      this.router.navigate(['/crm/addmobilelead']);
    } else if (localStorage.getItem('company_type') === 'MAINTENANCE') {
      this.router.navigate(['/crm/addmaintenancelead']);
    }
  }
  // followupReject(strServiceName, intServiceId) {

  // }
}
