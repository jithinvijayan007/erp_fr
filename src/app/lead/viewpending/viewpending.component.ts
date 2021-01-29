import { Component, OnInit } from '@angular/core';
import {ServerService} from 'src/app/server.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from 'src/app/global.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-viewpending',
  templateUrl: './viewpending.component.html',
  styleUrls: ['./viewpending.component.scss']
})
export class ViewpendingComponent implements OnInit {
  userId = localStorage.getItem('userId');

  lstCompletedStatus = ['BOOKED', 'UNQUALIFIED', 'LOST'];
  blnShowCustFullDetails = false;
  previousUrl = localStorage.getItem('previousUrl');
  currentUserName = localStorage.getItem('username');
  companyType = localStorage.getItem('company_type');

  intFollowUpFlag = -1;
  strFollowUpService = '';
  intDefaultIndex = 0;

  intFollowUpAmount = null;
  strFollowUpStatus;
  strFollowUpRemarks;

  // follow up ids
  intHotelFollowUpID = -1;
  intFlightFollowUpID = -1;
  intTrainFollowUpID = -1;
  intVisaFollowUpID = -1;
  intTravelInsuranceFollowUpID = -1;
  intForexFollowUpID = -1;
  intTransportFollowUpID = -1;
  intOtherFollowUpID = -1;
  intHolidayFollowUpId = -1;
  intKCTFollowUpId = -1;
  lstKCTList = [];
  lstKCTListSelected = [{}];

  id = 3;
  lstEnquiryStatus = [];
  lstDataList = [];
  dctEnquiry = {
    vchr_enquiry_num: '',
    cust_mobile: '',
    cust_email: '',
    cust_fname: '',
    cust_lname: '',
    cust_alternatemobile: '',
    cust_alternatemail: '',
    vchr_enquiry_source: '',
    // vchr_enquiry_priority: '',
    cust_contactsrc: '',
    bln_sms: false
  };
  lstFlightList = [];
  lstTrainList = [];
  lstForexList = [];
  lstOtherList = [];
  lstVisaList = [];
  lstTravelInsuranceList = [];
  lstTransportList = [];
  lstHotelList = [];
  lstPackageList = [];
  lstRoomList = [];

  lstFlightListSelected = [{ amount: null, status: '', remarks: '' }];
  lstTrainListSelected = [{ amount: null, status: '', remarks: '' }];
  lstForexListSelected = [{}];
  lstOtherListSelected = {};
  lstVisaListSelected = [{}];
  lstTravelInsuranceListSelected = [{}];
  lstTransportListSelected = [{}];
  lstHotelListSelected = [{}];
  lstPackageListSelected = [{}];
  lstFollowUpStatus = [
    'NEW',
    'WORKING',
    'PROPOSAL SEND',
    'NEGOTIATING',
    'UNQUALIFIED',
    'BOOKED',
    'LOST'
  ];

  lstEnquiryTrck = [];
  lstAccountingSoftware = [];
  lstHRSolutions = [];
  lstEmployeeManagement = [];

  constructor(
    private spinnerService: NgxSpinnerService,
    private serverService: ServerService,
    public router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.lstDataList = [];
    this.lstEnquiryStatus = [
      'New',
      'Working',
      'Proposal send',
      'Negotiating',
      'Unqualified',
      'Booked',
      'Lost'
    ];
    this.getCustomerData();

    if (localStorage.getItem('enquiryRequestData')) {
      localStorage.setItem('enquiryCustomerNumberStatus', '1');
    }
  }

  emptyData() {
    this.dctEnquiry = {
      vchr_enquiry_num: '',
      cust_mobile: '',
      cust_email: '',
      cust_fname: '',
      cust_lname: '',
      cust_alternatemobile: '',
      cust_alternatemail: '',
      vchr_enquiry_source: '',
      // vchr_enquiry_priority: '',
      cust_contactsrc: '',
      bln_sms: false
    };
  }

  getCustomerData() {
    const enquiryId = localStorage.getItem('enqid');
    // this.serverService
    //   .viewPendingEnquiry(
    //     JSON.stringify({
    //       enquiry_id: enquiryId,
    //       company_type: this.companyType
    //     })
    //   )
    //   .subscribe(
    //     response => {
    //       if (response.status === '0') {
    //         this.lstDataList = response;
    //         this.dctEnquiry = response['enquiry_Data'][0];
    //         if (this.companyType === 'SOFTWARE') {
    //           this.lstEnquiryTrck = response['enquiry_track'];
    //           this.lstAccountingSoftware = response['accounting_software'];
    //           this.lstHRSolutions = response['hr_solutions'];
    //           this.lstEmployeeManagement = response['employee_management'];
    //         } else if (this.companyType === 'TRAVEL AND TOURISM') {
    //           this.lstFlightList = response['flights'];
    //           this.lstTrainList = response['train'];
    //           this.lstForexList = response['forex'];
    //           this.lstOtherList = response['other'];
    //           this.lstVisaList = response['visa'];
    //           this.lstTravelInsuranceList = response['travel_insurance'];
    //           this.lstTransportList = response['transport'];
    //           this.lstHotelList = response['hotel'];
    //           this.lstRoomList = response['rooms'];
    //           this.lstPackageList = response['package'];
    //           this.lstKCTList = response['kct'];
    //         }
    //       } else {
    //         this.lstDataList = [];
    //         this.dctEnquiry = {
    //           vchr_enquiry_num: '',
    //           cust_mobile: '',
    //           cust_email: '',
    //           cust_fname: '',
    //           cust_lname: '',
    //           cust_alternatemobile: '',
    //           cust_alternatemail: '',
    //           vchr_enquiry_source: '',
    //           vchr_enquiry_priority: '',
    //           cust_contactsrc: '',
    //           bln_sms: false
    //         };
    //         this.lstFlightList = [];
    //         this.lstTrainList = [];
    //         this.lstForexList = [];
    //         this.lstOtherList = [];
    //         this.lstVisaList = [];
    //         this.lstTravelInsuranceList = [];
    //         this.lstTransportList = [];
    //         this.lstHotelList = [];
    //         this.lstRoomList = [];
    //         this.lstPackageList = [];
    //         this.lstKCTList = [];
    //       }
    //     },
    //     error => {}
    //   );

    //edited

    this.serverService
      .postData(
        "enquiry/pending_enquiry_view/",{
          enquiry_id: enquiryId,
          company_type: this.companyType
        })
      .subscribe(
        response => {
          if (response.status === 0) {
            this.lstDataList = response['data'];
            this.dctEnquiry = response['enquiry_Data'][0];
            if (this.companyType === 'SOFTWARE') {
              this.lstEnquiryTrck = response['enquiry_track'];
              this.lstAccountingSoftware = response['accounting_software'];
              this.lstHRSolutions = response['hr_solutions'];
              this.lstEmployeeManagement = response['employee_management'];
            } else if (this.companyType === 'TRAVEL AND TOURISM') {
              this.lstFlightList = response['flights'];
              this.lstTrainList = response['train'];
              this.lstForexList = response['forex'];
              this.lstOtherList = response['other'];
              this.lstVisaList = response['visa'];
              this.lstTravelInsuranceList = response['travel_insurance'];
              this.lstTransportList = response['transport'];
              this.lstHotelList = response['hotel'];
              this.lstRoomList = response['rooms'];
              this.lstPackageList = response['package'];
              this.lstKCTList = response['kct'];
            }
          } else {
            this.lstDataList = [];
            this.dctEnquiry = {
              vchr_enquiry_num: '',
              cust_mobile: '',
              cust_email: '',
              cust_fname: '',
              cust_lname: '',
              cust_alternatemobile: '',
              cust_alternatemail: '',
              vchr_enquiry_source: '',
              // vchr_enquiry_priority: '',
              cust_contactsrc: '',
              bln_sms: false
            };
            this.lstFlightList = [];
            this.lstTrainList = [];
            this.lstForexList = [];
            this.lstOtherList = [];
            this.lstVisaList = [];
            this.lstTravelInsuranceList = [];
            this.lstTransportList = [];
            this.lstHotelList = [];
            this.lstRoomList = [];
            this.lstPackageList = [];
            this.lstKCTList = [];
          }
        },
        error => {}
      );
  }
  saveFollowUp(serviceId, index) {

    const pusheditems = {
      vchr_servicetype: '',
      int_service_id: null,
      vchr_current_user_name: '',
      int_followup_amount: null,
      vchr_followup_status: '',
      vchr_followup_remarks: ''
    };
    // pusheditems['servicetype'] = servicetype;
    // pusheditems['serviceId'] = serviceId;
    // pusheditems['currentUserName'] = this.currentUserName;
    // pusheditems['service_Type']['intFollowUpAmount'] = this.intFollowUpAmount;
    // pusheditems['intFollowUpStatus'] = this.strFollowUpStatus;
    // pusheditems['intFollowUpRemarks'] = this.strFollowUpRemarks;
    pusheditems['vchr_servicetype'] = this.strFollowUpService;
    pusheditems['int_service_id'] = serviceId;
    pusheditems['vchr_current_user_name'] = this.currentUserName;
    pusheditems['int_followup_amount'] = this.intFollowUpAmount;
    pusheditems['vchr_followup_status'] = this.strFollowUpStatus;
    pusheditems['vchr_followup_remarks'] = this.strFollowUpRemarks;
    // pusheditems['servicetype'] = this.strFollowUpService;
    // pusheditems['serviceId'] = serviceId;
    // pusheditems['currentUserName'] = this.currentUserName;
    // pusheditems['intFollowUpAmount'] = this.intFollowUpAmount;
    // pusheditems['intFollowUpStatus'] = this.strFollowUpStatus;
    // pusheditems['intFollowUpRemarks'] = this.strFollowUpRemarks;
    let blnFollowflag = true;
    if (pusheditems['vchr_followup_remarks'] === '') {
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Remarks mandatory !',
        confirmButtonText: 'OK'
      });
      blnFollowflag = false;
      return false;
    } else if (pusheditems['vchr_followup_status'] === '') {
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Status mandatory !',
        confirmButtonText: 'OK'
      });
      blnFollowflag = false;
      return false;
    } else if (pusheditems['int_followup_amount'] == null) {
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Amount mandatory !',
        confirmButtonText: 'OK'
      });
      blnFollowflag = false;
      return false;
    }
    if (blnFollowflag === true) {
      if (this.companyType === 'SOFTWARE') {
        this.spinnerService.show();
        // this.serverService.addSoftwareFollowup(JSON.stringify(pusheditems)).subscribe(
        //     response => {
        //       this.spinnerService.hide();
        //       if (response['status'] === 'success') {

        //         if (response['change'] === 1) {
        //           if (this.strFollowUpService === 'enquiry track') {
        //             // index = this.lstEnquiryTrck.findIndex(elem => elem.pk_bint_id === serviceId )
        //             this.lstEnquiryTrck[index].vchr_enquiry_status =
        //               response.followup;
        //             this.lstEnquiryTrck[index].dbl_amount =
        //               '' + response.amount;
        //           }
        //           if (this.strFollowUpService === 'accounting software') {
        //             // index = this.lstAccountingSoftware.findIndex(elem => elem.pk_bint_id === serviceId )
        //             this.lstAccountingSoftware[index].vchr_enquiry_status =
        //               response.followup;
        //             this.lstAccountingSoftware[index].dbl_amount =
        //               response.amount;
        //           }
        //           if (this.strFollowUpService === 'hr solutions') {
        //             // index = this.lstHRSolutions.findIndex(elem => elem.pk_bint_id === serviceId )
        //             this.lstHRSolutions[index].vchr_enquiry_status =
        //               response.followup;
        //             this.lstHRSolutions[index].dbl_amount = response.amount;
        //           }
        //           if (this.strFollowUpService === 'employee management') {
        //             // index = this.lstEmployeeManagement.findIndex(elem => elem.pk_bint_id === serviceId )
        //             this.lstEmployeeManagement[index].vchr_enquiry_status =
        //               response.followup;
        //             this.lstEmployeeManagement[index].dbl_amount =
        //               response.amount;
        //           }
        //         }
        //       if (
        //         pusheditems['vchr_followup_status'] === 'Booked' ||
        //         pusheditems['vchr_followup_status'] === 'Unqualified' ||
        //         pusheditems['vchr_followup_status'] === 'Lost'
        //       ) {
        //         this.dataService.pendingEnquiryNotification('yes');
        //       }
        //       swal({
        //         title: 'Success',
        //         type: 'success',
        //         text: response['value'],
        //         confirmButtonText: 'OK',
        //         timer: 2000
        //       }).then(
        //         (res) => {
        //           if (res.value || res.dismiss) {
        //             if (
        //               ['PROPOSAL SEND', 'BOOKED'].indexOf(response.followup) > -1
        //             ) {
        //               swal({
        //                 title: 'Enquiry Print',
        //                 type: 'question',
        //                 text:
        //                   'Do you want to print the enquiry?',
        //                 showCancelButton: true,
        //                 confirmButtonText: 'Yes',
        //                 cancelButtonText: 'No'
        //               }).then(result => {
        //                 if (result.value && response.change === 1) {
        //                   this.downloadEnquiry(response.enqId);
        //                 } else if (result.value && response.change === 0) {
        //                   swal({
        //                     title: 'Not Approved',
        //                     type: 'error',
        //                     text: 'Followup has not been approved'
        //                   });
        //                 }
        //               });
        //             }
        //             this.changeFollowUp(-1, '', 1);
        //           }
        //         }
        //       );
        //       }
        //     },
        //     error => {
        //       this.spinnerService.hide();
        //     }
        //   );

        //edited

        this.serverService.postData("software_followup/add_followup/",pusheditems).subscribe(
          response => {
            this.spinnerService.hide();
            if (response['status'] === 1) {

              if (response['change'] === 1) {
                if (this.strFollowUpService === 'enquiry track') {
                  // index = this.lstEnquiryTrck.findIndex(elem => elem.pk_bint_id === serviceId )
                  this.lstEnquiryTrck[index].vchr_enquiry_status =
                    response['followup'];
                  this.lstEnquiryTrck[index].dbl_amount =
                    '' + response['amount'];
                }
                if (this.strFollowUpService === 'accounting software') {
                  // index = this.lstAccountingSoftware.findIndex(elem => elem.pk_bint_id === serviceId )
                  this.lstAccountingSoftware[index].vchr_enquiry_status =
                    response['followup'];
                  this.lstAccountingSoftware[index].dbl_amount =
                    response['amount'];
                }
                if (this.strFollowUpService === 'hr solutions') {
                  // index = this.lstHRSolutions.findIndex(elem => elem.pk_bint_id === serviceId )
                  this.lstHRSolutions[index].vchr_enquiry_status =
                    response['followup'];
                  this.lstHRSolutions[index].dbl_amount = response['amount'];
                }
                if (this.strFollowUpService === 'employee management') {
                  // index = this.lstEmployeeManagement.findIndex(elem => elem.pk_bint_id === serviceId )
                  this.lstEmployeeManagement[index].vchr_enquiry_status =
                    response['followup'];
                  this.lstEmployeeManagement[index].dbl_amount =
                    response['amount'];
                }
              }
            if (
              pusheditems['vchr_followup_status'] === 'Booked' ||
              pusheditems['vchr_followup_status'] === 'Unqualified' ||
              pusheditems['vchr_followup_status'] === 'Lost'
            ) {
              this.dataService.pendingEnquiryNotification('yes');
            }
            swal.fire({
              title: 'Success',
              type: 'success',
              text: response['value'],
              confirmButtonText: 'OK',
              timer: 2000
            }).then(
              (res) => {
                if (res.value || res.dismiss) {
                  if (
                    ['PROPOSAL SEND', 'BOOKED'].indexOf(response['followup']) > -1
                  ) {
                    swal.fire({
                      title: 'Enquiry Print',
                      type: 'question',
                      text:
                        'Do you want to print the enquiry?',
                      showCancelButton: true,
                      confirmButtonText: 'Yes',
                      cancelButtonText: 'No'
                    }).then(result => {
                      if (result.value && response['change'] === 1) {
                        this.downloadEnquiry(response['enqId']);
                      } else if (result.value && response['change'] === 0) {
                        swal.fire({
                          title: 'Not Approved',
                          type: 'error',
                          text: 'Followup has not been approved'
                        });
                      }
                    });
                  }
                  this.changeFollowUp(-1, '', 1);
                }
              }
            );
            }
          },
          error => {
            this.spinnerService.hide();
          }
        );
      } else if (this.companyType === 'TRAVEL AND TOURISM') {
        this.spinnerService.show();

        // this.serverService.addfollowup(JSON.stringify(pusheditems)).subscribe(
        //   response => {
        //     this.spinnerService.hide();
        //     if (response['status'] === 'success') {
        //       if (response['change'] === 1) {
        //         if (this.strFollowUpService === 'flight') {
        //           index = this.lstFlightList.findIndex(
        //             elem => elem.pk_bint_id === serviceId
        //           );
        //           this.lstFlightList[index].vchr_enquiry_status =
        //             response.followup;
        //           this.lstFlightList[index].dbl_estimated_amount =
        //             response.amount;
        //         }
        //         if (this.strFollowUpService === 'train') {
        //           index = this.lstTrainList.findIndex(
        //             elem => elem.pk_bint_id === serviceId
        //           );
        //           this.lstTrainList[index].vchr_enquiry_status =
        //             response.followup;
        //           this.lstTrainList[index].dbl_estimated_amount =
        //             response.amount;
        //         }
        //         if (this.strFollowUpService === 'hotel') {
        //           index = this.lstHotelList.findIndex(
        //             elem => elem.pk_bint_id === serviceId
        //           );
        //           this.lstHotelList[index].vchr_enquiry_status =
        //             response.followup;
        //           this.lstHotelList[index].dbl_estimated_amount =
        //             response.amount;
        //         }
        //         if (this.strFollowUpService === 'visa') {
        //           index = this.lstVisaList.findIndex(
        //             elem => elem.pk_bint_id === serviceId
        //           );
        //           this.lstVisaList[index].vchr_enquiry_status =
        //             response.followup;
        //           this.lstVisaList[index].dbl_estimated_amount =
        //             response.amount;
        //         }
        //         if (this.strFollowUpService === 'travelinsurance') {
        //           index = this.lstTravelInsuranceList.findIndex(
        //             elem => elem.pk_bint_id === serviceId
        //           );
        //           this.lstTravelInsuranceList[index].vchr_enquiry_status =
        //             response.followup;
        //           this.lstTravelInsuranceList[index].dbl_estimated_amount =
        //             response.amount;
        //         }
        //         if (this.strFollowUpService === 'forex') {
        //           index = this.lstForexList.findIndex(
        //             elem => elem.pk_bint_id === serviceId
        //           );
        //           this.lstForexList[index].vchr_enquiry_status =
        //             response.followup;
        //           this.lstForexList[index].dbl_estimated_amount =
        //             response.amount;
        //         }
        //         if (this.strFollowUpService === 'transport') {
        //           index = this.lstTransportList.findIndex(
        //             elem => elem.pk_bint_id === serviceId
        //           );
        //           this.lstTransportList[index].vchr_enquiry_status =
        //             response.followup;
        //           this.lstTransportList[index].dbl_estimated_amount =
        //             response.amount;
        //         }
        //         if (this.strFollowUpService === 'other') {
        //           index = this.lstOtherList.findIndex(
        //             elem => elem.pk_bint_id === serviceId
        //           );
        //           this.lstOtherList[index].vchr_enquiry_status =
        //             response.followup;
        //           this.lstOtherList[index].dbl_estimated_amount =
        //             response.amount;
        //         }
        //         if (this.strFollowUpService === 'holiday') {
        //           index = this.lstPackageList.findIndex(
        //             elem => elem.pk_bint_id === serviceId
        //           );
        //           this.lstPackageList[index].vchr_enquiry_status =
        //             response.followup;
        //           this.lstPackageList[index].dbl_estimated_amount =
        //             response.amount;
        //         }
        //         if (this.strFollowUpService === 'kct') {
        //           index = this.lstKCTList.findIndex(
        //             elem => elem.pk_bint_id === serviceId
        //           );
        //           this.lstKCTList[index].vchr_enquiry_status =
        //             response.followup;
        //           this.lstKCTList[index].dbl_estimated_amount = response.amount;
        //         }
        //       }
        //       if (
        //         pusheditems['vchr_followup_status'] === 'Booked' ||
        //         pusheditems['vchr_followup_status'] === 'Unqualified' ||
        //         pusheditems['vchr_followup_status'] === 'Lost'
        //       ) {
        //         this.dataService.pendingEnquiryNotification('yes');
        //       }
        //           swal({
        //             title: 'Success',
        //             type: 'success',
        //             text: response['value'],
        //             confirmButtonText: 'OK',
        //             timer: 2000
        //           }).then(res => {

        //             if (res.value || res.dismiss) {
        //               if (
        //                 ['PROPOSAL SEND', 'BOOKED'].indexOf(response.followup) > -1
        //               ) {
        //                 swal({
        //                   title: 'Enquiry Print',
        //                   type: 'question',
        //                   text:
        //                     'Do you want to print the enquiry?',
        //                   showCancelButton: true,
        //                   confirmButtonText: 'Yes',
        //                   cancelButtonText: 'No'
        //                 }).then(result => {
        //                   if (result.value && response.change === 1) {
        //                     this.downloadEnquiry(response.enqId);
        //                   } else if (result.value && response.change === 0) {
        //                     swal({
        //                       title: 'Not Approved',
        //                       type: 'error',
        //                       text: 'Followup has not been approved'
        //                     });
        //                   }
        //                 });
        //               }
        //               this.changeFollowUp(-1, '', 1);
        //             }
        //           });
        //     }
        //   },
        //   error => {
        //     this.spinnerService.hide();
        //     swal({
        //       title: 'Error',
        //       type: 'error',
        //       text: error,
        //       confirmButtonText: 'OK'
        //     });
        //   }
        // );

        //edited

        this.serverService.postData( "followup/add_followup/",pusheditems).subscribe(
          response => {
            this.spinnerService.hide();
            if (response['status'] === 1) {
              if (response['change'] === 1) {
                if (this.strFollowUpService === 'flight') {
                  index = this.lstFlightList.findIndex(
                    elem => elem.pk_bint_id === serviceId
                  );
                  this.lstFlightList[index].vchr_enquiry_status =
                    response['followup'];
                  this.lstFlightList[index].dbl_estimated_amount =
                    response['amount'];
                }
                if (this.strFollowUpService === 'train') {
                  index = this.lstTrainList.findIndex(
                    elem => elem.pk_bint_id === serviceId
                  );
                  this.lstTrainList[index].vchr_enquiry_status =
                    response['followup'];
                  this.lstTrainList[index].dbl_estimated_amount =
                    response['amount'];
                }
                if (this.strFollowUpService === 'hotel') {
                  index = this.lstHotelList.findIndex(
                    elem => elem.pk_bint_id === serviceId
                  );
                  this.lstHotelList[index].vchr_enquiry_status =
                    response['followup'];
                  this.lstHotelList[index].dbl_estimated_amount =
                    response['amount'];
                }
                if (this.strFollowUpService === 'visa') {
                  index = this.lstVisaList.findIndex(
                    elem => elem.pk_bint_id === serviceId
                  );
                  this.lstVisaList[index].vchr_enquiry_status =
                    response['followup'];
                  this.lstVisaList[index].dbl_estimated_amount =
                    response['amount'];
                }
                if (this.strFollowUpService === 'travelinsurance') {
                  index = this.lstTravelInsuranceList.findIndex(
                    elem => elem.pk_bint_id === serviceId
                  );
                  this.lstTravelInsuranceList[index].vchr_enquiry_status =
                    response['followup'];
                  this.lstTravelInsuranceList[index].dbl_estimated_amount =
                    response['amount'];
                }
                if (this.strFollowUpService === 'forex') {
                  index = this.lstForexList.findIndex(
                    elem => elem.pk_bint_id === serviceId
                  );
                  this.lstForexList[index].vchr_enquiry_status =
                    response['followup'];
                  this.lstForexList[index].dbl_estimated_amount =
                    response['amount'];
                }
                if (this.strFollowUpService === 'transport') {
                  index = this.lstTransportList.findIndex(
                    elem => elem.pk_bint_id === serviceId
                  );
                  this.lstTransportList[index].vchr_enquiry_status =
                    response['followup'];
                  this.lstTransportList[index].dbl_estimated_amount =
                    response['amount'];
                }
                if (this.strFollowUpService === 'other') {
                  index = this.lstOtherList.findIndex(
                    elem => elem.pk_bint_id === serviceId
                  );
                  this.lstOtherList[index].vchr_enquiry_status =
                    response['followup'];
                  this.lstOtherList[index].dbl_estimated_amount =
                    response['amount'];
                }
                if (this.strFollowUpService === 'holiday') {
                  index = this.lstPackageList.findIndex(
                    elem => elem.pk_bint_id === serviceId
                  );
                  this.lstPackageList[index].vchr_enquiry_status =
                    response['followup'];
                  this.lstPackageList[index].dbl_estimated_amount =
                    response['amount'];
                }
                if (this.strFollowUpService === 'kct') {
                  index = this.lstKCTList.findIndex(
                    elem => elem.pk_bint_id === serviceId
                  );
                  this.lstKCTList[index].vchr_enquiry_status =
                    response['followup'];
                  this.lstKCTList[index].dbl_estimated_amount = response['amount'];
                }
              }
              if (
                pusheditems['vchr_followup_status'] === 'Booked' ||
                pusheditems['vchr_followup_status'] === 'Unqualified' ||
                pusheditems['vchr_followup_status'] === 'Lost'
              ) {
                this.dataService.pendingEnquiryNotification('yes');
              }
                  swal.fire({
                    title: 'Success',
                    type: 'success',
                    text: response['value'],
                    confirmButtonText: 'OK',
                    timer: 2000
                  }).then(res => {

                    if (res.value || res.dismiss) {
                      if (
                        ['PROPOSAL SEND', 'BOOKED'].indexOf(response['followup']) > -1
                      ) {
                        swal.fire({
                          title: 'Enquiry Print',
                          type: 'question',
                          text:
                            'Do you want to print the enquiry?',
                          showCancelButton: true,
                          confirmButtonText: 'Yes',
                          cancelButtonText: 'No'
                        }).then(result => {
                          if (result.value && response['change'] === 1) {
                            this.downloadEnquiry(response['enqId']);
                          } else if (result.value && response['change'] === 0) {
                            swal.fire({
                              title: 'Not Approved',
                              type: 'error',
                              text: 'Followup has not been approved'
                            });
                          }
                        });
                      }
                      this.changeFollowUp(-1, '', 1);
                    }
                  });
            }
          },
          error => {
            this.spinnerService.hide();
            swal.fire({
              title: 'Error',
              type: 'error',
              text: error,
              confirmButtonText: 'OK'
            });
          }
        );
      }
    }
  }
  funcShowError(title, text) {
    swal.fire({
      title: title,
      type: 'error',
      text: text,
      confirmButtonText: 'OK'
    });
  }
  changeFollowUp(id, service, changeStatus) {
    if (changeStatus === 0) {
      this.intFollowUpFlag = id;
      this.strFollowUpService = service;
    } else {
      this.intFlightFollowUpID = -1;
      this.strFollowUpService = '';
    }
    this.intFollowUpAmount = null;
    this.strFollowUpStatus = '';
    this.strFollowUpRemarks = '';
  }
  indexRefresh(status) {
    this.intDefaultIndex = status === 0 ? 0 : this.intDefaultIndex + 1;
  }
downloadEnquiry(enqId) {
    const data = { userId: this.userId, enquiryId: enqId };
    // this.serverService.downloadEnquiryPDF(data).subscribe(response => {
    //   if (response.status === 'success') {
    //      const file_data = response.file;
    //      localStorage.setItem('print', file_data.substring(2, file_data.length - 1));
    //      this.router.navigate(['/print']);
    //   }
    // });

    //edited

    this.serverService.postData("enquiry_print/download/",data).subscribe(response => {
      if (response.status === 1) {
         const file_data = response['file'];
         localStorage.setItem('print', file_data.substring(2, file_data.length - 1));
         this.router.navigate(['/print']);
      }
    });
  }
}
