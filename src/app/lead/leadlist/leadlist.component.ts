import { Component, OnInit, ViewChild, Pipe, PipeTransform, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { SharedService } from '../../layouts/shared-service';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';

// import {DataSource} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
// import {BehaviorSubject} from 'rxjs/BehaviorSubject';
// import {Observable} from 'rxjs/Observable';
import { ServerService } from 'src/app/server.service';
import { Router } from '@angular/router';
// import { log } from 'util';
import { TypeaheadService } from './../../typeahead.service';
import { DatePipe } from '@angular/common';
import { getLocaleDateTimeFormat } from '@angular/common';
import swal from 'sweetalert2'
import { debounceTime } from 'rxjs/operators';

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-leadlist',
  templateUrl: './leadlist.component.html',
  styleUrls: ['./leadlist.component.scss']
})
export class LeadlistComponent implements OnInit {

  @ViewChild('enqFilter') enqFilter: ElementRef;

  previusUrl = localStorage.getItem('previousUrl');
  intCompanyId = localStorage.getItem('companyId');
  userId = localStorage.getItem('userId');
  companyType = localStorage.getItem('company_type')
  groupName = localStorage.getItem('group_name').toUpperCase()

  searchMobile: FormControl = new FormControl();
  testpip: PipeTransform;
  datStartDate;
  datEndDate;

  lstMobileNumbers = [];
  pageTitle = 'Sorting table';
  displayedColumns = [
    'date',
    'enqNo',
    'branchName',
    'customerName',
    'staffName',
    'service',
    'status',
    'change'
  ];
  lstEnquiryList: any = [];
  strCustomerId;
  strSelectedMobileNumber = '';
  datepipe;
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  lstPermission = JSON.parse(localStorage.getItem('permission'));
  blnAdd = true;
  blnView = true;
  blnEdit = true;
  blnDelete = true;
  blnFollowupAdd = true;

  lstBranches = [];
  searchBranch: FormControl = new FormControl();
  branchCode = '';
  branchName = '';
  selectedBranch = '';
  checkedStatus = 'All';
  branchId: number;
  constructor(
    private _sharedService: SharedService,
    private serverService: ServerService,
    private typeServ: TypeaheadService,
    private router: Router
  ) {
    this._sharedService.emitChange(this.pageTitle);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  groupname=localStorage.getItem('group_name');

  ngOnInit() {

    if(this.groupname ==='FINANCIER')
    {

      this.displayedColumns.splice(2,1);
    }

    if (!localStorage.getItem('Tokeniser')) {
      this.router.navigate(['/user/sign-in']);
    }
    const date = new Date();
    this.datStartDate = date.toDateString();
    this.datEndDate = date.toDateString();
    // this.getMobileTypehead();
    this.getEnquiry(this.datStartDate, this.datEndDate, 0,this.checkedStatus);
    // this.lstPermission.forEach((item, index, array) => {
    //   if (item['NAME'] === 'ENQUIRY') {
    //     this.blnAdd = item['ADD'];
    //     this.blnView = item['VIEW'];
    //     this.blnEdit = item['EDIT'];
    //     this.blnDelete = item['DELETE'];
    //   }
    //   if (item['NAME'] === 'FOLLOWUP') {
    //   this.blnFollowupAdd = item['ADD'];
    //   }
    // });

    this.searchBranch.valueChanges
      .pipe(debounceTime(400))
      .subscribe((data: string) => {
        if (data === undefined || data == null || data === '') {
        } else {
          if (data.length > 2) {
            this.lstBranches = [];
            this.typeServ
              .searchBranch(data)
              .subscribe(
              (response: {
                status: string;
                data: Array<{
                  account: string;
                  accountId: number;
                  accountCode: string;
                }>;
              }) => {
                this.lstBranches.push(...response.data);

              }
              );
          }
        }
      });
     
      this.searchMobile.valueChanges
      .pipe(debounceTime(400))
      .subscribe((strData: string) => {
        if (strData === undefined) {
        } else {
          if (strData.length > 6) {
            this.lstMobileNumbers = [];
            this.typeServ
              .search_customer(strData)
              .subscribe(
                (response: {
                  status: string;
                  data: Array<{
                    mobile: number;
                    fname: string;
                    lname: string;
                    id: number;
                    email: string;
                    salutation: string;
                  }>;
                }) => {
                  this.lstMobileNumbers.push(...response.data);
                }
              );
          }
        }
      });

  }

  BranchChanged(item) {

    this.branchId = item.id;
    this.selectedBranch = item.name;
  }
  branchNameChanged(event){
    // console.log(this.selectedBranch,'branch change')
    if (event != this.selectedBranch) {
      this.branchId = null;
      this.selectedBranch = '';
    }
  }

  // getMobileTypehead() {
  //   this.searchMobile.valueChanges
  //     .debounceTime(400)
  //     .subscribe((strData: string) => {
  //       if (strData === undefined) {
  //       } else {
  //         if (strData.length > 3) {
  //           this.lstMobileNumbers = [];
  //           this.typeServ
  //             .search_customer(strData)
  //             .subscribe(
  //               (response: {
  //                 status: string;
  //                 data: Array<{
  //                   mobile: number;
  //                   fname: string;
  //                   lname: string;
  //                   id: number;
  //                   email: string;
  //                   salutation: string;
  //                 }>;
  //               }) => {
  //                 this.lstMobileNumbers.push(...response.data);
  //               }
  //             );
  //         }
  //       }
  //     });
  // }
  getEnquiry(startDate, endDate, status,vchr_enquiry_status) {
    let d1 = this.datStartDate;
    let d2 = this.datEndDate;
    let tempData;
    let data;
    
    // console.log(localStorage.enquiryRequestData,'requestdata');
    

     if (status === 0) {
      const urls = ['/crm/followup', '/crm/viewmobilelead'];
     
    //  if (this.previusUrl != '/crm/viewlead'  ) {
      if (!(urls.find( x => x === this.previusUrl))) {
          localStorage.removeItem('enquiryCustomerNumberStatus')
          localStorage.removeItem('enquiryRequestData')
     }
     if (localStorage.getItem('enquiryCustomerNumberStatus')) {
        tempData = JSON.parse(localStorage.getItem('enquiryRequestData'))
        // this.datStartDate = new Date( tempData['start_date'])
        // this.datEndDate = new Date(tempData['start_date'])
        this.strCustomerId = Number(tempData['custId']);
        this.strSelectedMobileNumber = tempData['mobileNumber'];
      
        
        // if(this.strCustomerId != NaN){
          this.lstMobileNumbers = tempData['lstMobile'];
        // }
        // else {
          
        // }
        this.branchId = Number(tempData['branchId']);
        this.branchName = tempData['branchName'];
        // this.lstBranches = tempData['lstBranches'];
        this.selectedBranch = tempData['branchName'];
        d1 = tempData['start_date']
        d2 = tempData['end_date']
        status = 1
        localStorage.removeItem('enquiryCustomerNumberStatus')
        // localStorage.removeItem('enquiryCustomerId')
        // localStorage.removeItem('enquiryCustomerNumber')
      }
     
      else if(localStorage.enquiryRequestData){
        tempData = JSON.parse(localStorage.getItem('enquiryRequestData'));
        this.branchId = Number(tempData['branchId']);
        this.branchName = tempData['branchName'];
        this.selectedBranch = tempData['branchName'];
        this.lstBranches = tempData['lstBranches'];
        // this.strSelectedMobileNumber = tempData['mobileNumber']

      }
    } else if (status === 1) {

      d1 = new Date(d1).toDateString();
      d2 = new Date(d2).toDateString();
      data = {start_date: d1, end_date: d2}

      if (this.strCustomerId) {
        data['custId'] =  this.strCustomerId
        data['mobileNumber'] = this.strSelectedMobileNumber;
        data['lstMobile'] = this.lstMobileNumbers;
      }
       if (this.branchId) {
         data['branchId'] = this.branchId;
         data['branchName'] = this.branchName;
         data['lstBranches'] = this.lstBranches;
        //  data['branchId'] = null;
       }
     
      localStorage.setItem('enquiryRequestData', JSON.stringify(data))

    }
     data = {
      start_date: d1,
      end_date: d2,
      custId: this.strCustomerId,
      _status: status,
      company_id: this.intCompanyId,
      branchId: this.branchId,
      int_pending:0

    }

//     this.serverService
//       .listEnquiry(
//         JSON.stringify(data)
//       )
//       .subscribe(
//         response => {

//           this.lstEnquiryList = response['data'];
//           this.strCustomerId = null;
//           // this.branchId = null;
//           if (!response['data'][0].enquiry) {
//             this.lstEnquiryList = [];
//           }

//           this.dataSource = new MatTableDataSource(this.lstEnquiryList);
//           this.dataSource.paginator = this.paginator;
//           if (status === 1) {
//             this.datStartDate = new Date(data['start_date'])
//             this.datEndDate = new Date(data['end_date'])
//           }
//         },
//         error => {
//           this.router.navigate(['/user/page-500']);
//         }
//       );

//edited
// console.log(this.strCustomerId,this.branchId,'beforerequest')
this.serverService
.postData("enquiry/list/",data)
.subscribe(
  response => {
    
    this.lstEnquiryList = response['data'];
    
    // console.log(this.strCustomerId,this.branchId,'responce')
    if (!response['data'][0].enquiry) {
      
      this.lstEnquiryList = [];
    }

    this.dataSource = new MatTableDataSource(this.lstEnquiryList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (status === 1) {
      this.datStartDate = new Date(data['start_date'])
      this.datEndDate = new Date(data['end_date'])
    }

    if(localStorage.getItem('blnShowOnlyBooked')){
      // this.enqFilter.nativeElement.value = "Booked"
      this.applyFilter('booked')
    }
    localStorage.removeItem('blnShowOnlyBooked')
  },
  error => {
    // this.router.navigate(['/user/page-500']);
  }
);
    if (status === 0) {
      const date = new Date();
      this.datStartDate = new Date();
      this.datEndDate = new Date();

      if (tempData) {
        this.datStartDate = new Date( tempData['start_date'])
        this.datEndDate = new Date(tempData['end_date'])
      }
    }
  }
  detailEnquiry(enquiryId) {
    localStorage.setItem('enqid', enquiryId);
    if (this.companyType === 'MOBILE') {

      this.lstEnquiryList.map((item) => {
        if (item['enquiry_id'] === enquiryId ) {
          if (item['status'].includes('To Process')||item['status'].includes('Imei Pending') 
          || item['status'].includes('Imei Rejected')|| item['status'].includes('Imei Requested')) {
            this.router.navigate(['/crm/viewmobilelead']);
        } else if (item['status'].includes('Booked') && (item['branch_name'].toUpperCase() == 'PATTOM' || item['branch_name'].toUpperCase() == 'PAZHAVANGADI' || item['branch_name'].toUpperCase() == 'NAGAMPADAM')) {
          this.router.navigate(['/crm/invoice']);
        }
          else if  (item['status'].includes('Ball Game')) {
            this.router.navigate(['/crm/invoice']);
            }
          else if  (item['status'].includes('Offer Added')) {
              this.router.navigate(['/crm/invoice']);
           }
          else {
            this.router.navigate(['/crm/viewmobilelead']);
          }
        }

      })
      // this.router.navigate(['/crm/viewmobilelead']);
    } else if (this.companyType === 'AUTOMOBILE') {
      this.router.navigate(['/crm/viewautomobilelead']);
    } else if (this.companyType === 'MAINTENANCE') {
      this.router.navigate(['/crm/viewmaintenancelead']);
    }else if (this.companyType === 'SOLAR') {
      this.router.navigate(['/crm/viewsolarlead']);
    }
     else {
    this.router.navigate(['/enquiry/view-enquiry']);
    }
  }
  FollowUpHistory(enquiryId) {
    localStorage.setItem('enqid', enquiryId);
    this.router.navigate(['/crm/followup']);
  }
  onChangeStatus(startDate, endDate,event){
    this.searchEnquiryList(startDate, endDate,this.checkedStatus)
  }
  searchEnquiryList(startDate, endDate,status='All') {

    if (startDate.value === '') {
      swal.fire({
        title: 'From date not selected',
        type: 'error',
        text: 'Please select From date for search',
        confirmButtonText: 'OK'
      });
      return false;
    }
    if (endDate.value === '') {
      swal.fire({
        title: 'To date not selected',
        type: 'error',
        text: 'Please select To date for search',
        confirmButtonText: 'OK'
      });
      return false;
    }

    // if(endDate.value < startDate.value) {
    if (this.datEndDate < this.datStartDate) {


      swal.fire({
        title: 'Invalid date period',
        type: 'error',
        text: 'Please select correct date period' + startDate.value ,
        confirmButtonText: 'OK'
      });
      return false;
    }

    // if (this.strSelectedMobileNumber === '') {
    //   swal({
    //     title: 'Mobile number not selected',
    //     type: 'error',
    //     text: 'Please select Mobile number for search',
    //     confirmButtonText: 'OK'
    //   });
    //   return false;
    // }

    
    // if(this.strSelectedMobileNumber != '' || this.strSelectedMobileNumber != undefined ){
      // console.log('dsdsds')
      this.populateFields();
    // }
   

    this.getEnquiry(
                    new Date(this.datStartDate).toLocaleString('en-GB'),
                    new Date(this.datEndDate).toLocaleString('en-GB'),
                    1,
                    status
                  );
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  populateFields() {
    
    if(this.lstMobileNumbers == undefined){
      this.lstMobileNumbers = [];
    }
    
    const intSelectedIndex = this.lstMobileNumbers.findIndex(
      elem => elem.mobile === this.strSelectedMobileNumber
    );
    if (intSelectedIndex > -1) {
      this.strCustomerId = this.lstMobileNumbers[intSelectedIndex].id;

    } else {
      this.lstMobileNumbers = [];
      this.strCustomerId = null;
    }
    // console.log(this.strCustomerId,'customerID')
  }
downloadEnquiry(enqId) {
    const data = {userId: this.userId, enquiryId: enqId};
    // this.serverService.downloadEnquiryPDF(data).subscribe(
    //   (response) => {
    //     if (response.status === 'success') {
    //       const file_data = response.file;
    //       const pdf = 'data:application/octet-stream;base64,' + file_data.substring(2, file_data.length - 1);
    //       const dlnk = document.createElement('a');
    //       dlnk.href = pdf;
    //       dlnk.download = response.file_name + '.pdf';
    //       document.body.appendChild(dlnk);
    //       dlnk.click();
    //       dlnk.remove();
    //     } else {
    //       swal({
    //         title: 'Download Failure',
    //         type: 'error',
    //         text: response.reason,
    //         showConfirmButton: false,
    //         timer: 2000
    //       });
    //     }
    //   }
    // );

    //edited

    this.serverService.postData("enquiry_print/download/",data).subscribe(
      (response) => {
        if (response.status === 1) {
          const file_data = response['file'];
          const pdf = 'data:application/octet-stream;base64,' + file_data.substring(2, file_data.length - 1);
          const dlnk = document.createElement('a');
          dlnk.href = pdf;
          dlnk.download = response['file_name'] + '.pdf';
          document.body.appendChild(dlnk);
          dlnk.click();
          dlnk.remove();
        } else {
          swal.fire({
            title: 'Download Failure',
            type: 'error',
            text: response['reason'],
            showConfirmButton: false,
            timer: 2000
          });
        }
      }
    );
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
    }else if (localStorage.getItem('company_type') === 'SOLAR') {
      this.router.navigate(['/crm/adduser']);
    }
  }
}
