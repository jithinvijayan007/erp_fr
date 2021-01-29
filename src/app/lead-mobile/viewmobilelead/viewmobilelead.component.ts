import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../../global.service';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
//  impoty {NgxSpinnerService} from 
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// import { SnotifyService } from 'ng-snotify';
import { TitleCasePipe } from '@angular/common';
// import { ChatService } from '../../chat.service';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ToastrModule } from 'ngx-toastr';
import {range} from 'd3'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-viewmobilelead',
  templateUrl: './viewmobilelead.component.html',
  styleUrls: ['./viewmobilelead.component.scss']
})
export class ViewmobileleadComponent implements OnInit {
  lstImages=[]
  lstCompletedStatus = ['BOOKED', 'LOST'];
  userId = localStorage.getItem('userId');
  blnShowCustFullDetails = false;
  lstOffer=[]
  minPrice: any = 'N/A';
  maxPrice: any = 'N/A';
  groupName = '';
  nodeHost = '';

  currentUserName = localStorage.getItem('username');
  intComputersFollowupId = -1;


  previousLocation = localStorage.getItem('previousUrl');
  vchr_offer=''
  intFollowUpFlag = -1;
  intOfferFlag = -1;
  offer_id;
  intgdpFlag = -1;
  strFollowUpService = '';
  intFollowUpAmount = null;
  intFollowUpBuyBackAmount = null;
  intFollowUpDiscountAmount = null;
  intFollowUpQuantity = null;
  intGDP = null;
  intGDEW = null;

  strFollowUpStatus;
  strFollowUpRemarks;
  strOfferService:'';

  date= new Date();
  lstImei = {};
  fltItemAmount = 0;
  invoiced_date;
  dctEnquiry = {
    vchr_enquiry_num: '',
    cust_mobile: '',
    cust_email: '',
    cust_fname: '',
    cust_lname: '',
    cust_alternatemobile: '',
    cust_alternatemail: '',
    vchr_source_name: '',
    // vchr_priority_name: '',
    cust_contactsrc: '',
    bln_sms: false,
    vchr_name: '',
    staff_full_name:'',
    dat_created_at:Date,
    time_created_at:'',
    vchr_remarks:'',
    status:'',
    total_amount:null,
    finance_id: null
  };

  dctEnquiryDetails = {};
  dctfinanceentry = {};
  bln_game=false;
  enqKeys = [];
  eligble = true;
  eligibleAmount = null;
  strEligibleRemarks = '';

  strCardName = '';
  strOrderNo = '';

  blnBajajInvoiced=false
  dctBajajImages = [];
  blnAddRequest=false;
  blnShowPopup=false;
  blnImeiCheckPopup=false;
  intImeiNumber;
  intItemId;
  blnCheckImeiRequest=false;
  lstImeiNumbers=[];
  intItemQty=1;
  lstImeisToCheck=[];


  imgSrc;
  imgLocation;

  imgBillSrc;
  imgBillLocation;
  imgId1Src;
  imgId1Location;
  imgId2Src;
  imgId2Location;
  imgDeliverySrc;
  imgDeliveryLocation;

  imageBillSrc;
  imageIdOneSrc;
  imageIdTwoSrc;
  imageDeliverySrc;
  blnShowImage=false;


  lstFollowUpStatus = [
    'NEW',
    // 'WORKING',
    // 'PROPOSAL SEND',
    // 'NEGOTIATING',
    // 'UNQUALIFIED',
    'PENDING',
    'BOOKED',
    'LOST',
    'OUT OF STOCK'
  ];
  timeDiff;
  dayDiff;
  int_GDP=0;
  int_GDEW=0;
  // strgdpRemarks:'';
  strgdpService:'';
  lstSchema=[];
  lstIdType=[
    "Licence","Passport","Aadhar","Voter Id"
  ];
  bln_delivery_no=false;
  bln_name_card=false;

  intIdNumber:null;
  intPancardNo:null;
  vchr_bankname:null;
  intAccNo:null;
  vchr_branchname:'';
  strSchema:''
  strIdType:'';
  intChequeNo:null;
  // int_downpayment:null;
  payment_option= 'CASH';
  bln_checkDate=false;
  gdp = false;
  gdew = false;

  int_downpayment = 0;
  intMarginMoney = 0;
  intProsFee = 0;
  intdbd = 0;
  intLoanAmt = 0;
  intSerCharge = 0;
  bln_img_status = true

  blnCreditApprove=false;
  blnShowApproval=false;


  dctSmartchoice = {}

  smartchoiceKeys = [];

  strRejectRemark = '';
  blnRejectRequest =false;
  
  constructor(
    private spinnerService: NgxSpinnerService,
    private serverService: ServerService,
    private dataService: DataService,
    public router: Router,
    // private snotifyService: SnotifyService,
    private titlecasePipe: TitleCasePipe,
    // private chatService: ChatService,
    public toastr: ToastrModule,

    vcr: ViewContainerRef

  ) {
    // this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    // this.nodeHost = this.chatService.url;
    // this.nodeHost = this.serverService.hostAddress ;

    this.getCustomerData();
    this.getSchemaList();
    if (localStorage.getItem('enquiryRequestData')) {
      localStorage.setItem('enquiryCustomerNumberStatus', '1');
    }
    this.groupName = localStorage.getItem('group_name');
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
      vchr_source_name: '',
      // vchr_priority_name: '',
      cust_contactsrc: '',
      bln_sms: false,
      vchr_name: '',
      staff_full_name:'',
      dat_created_at:Date,
      time_created_at:'',
      vchr_remarks:'',
      status:'',
      total_amount:null,
      finance_id: null
    };
  }

  validate(event) {

     if (
      event.target.value.length >= 20
    ) {
      return false;
    }
  }
  setImeiData() {
    this.lstImei = {};
    for (let i = 0; i < this.intFollowUpQuantity; i++) {
      this.lstImei[i] = '';
    }
  }
  getCustomerData() {
    const enquiryId = localStorage.getItem('enqid');
    // this.serverService
    //   .viewEnquiry(
    //     JSON.stringify({
    //       enquiry_id: enquiryId
    //     })
    //   )
    //   .subscribe(
    //     response => {
    //       if (response.status === '0') {
    //         this.emptyData();
    //         if (response['dct_customer_data']) {
    //           this.dctEnquiry = response['dct_customer_data'];
    //         }
    //           this.dctEnquiryDetails = {};
    //           this.dctEnquiryDetails = response['dct_enquiry_details'];
    //           this.enqKeys = Object.keys(this.dctEnquiryDetails);

    //       } else {
    //         this.dctEnquiry = {
    //           vchr_enquiry_num: '',
    //           cust_mobile: '',
    //           cust_email: '',
    //           cust_fname: '',
    //           cust_lname: '',
    //           cust_alternatemobile: '',
    //           cust_alternatemail: '',
    //           vchr_source_name: '',
    //           vchr_priority_name: '',
    //           cust_contactsrc: '',
    //           bln_sms: false,
    //           vchr_name: ''
    //         };
    //         this.dctEnquiryDetails = {};
    //       }
    //     },
    //     error => {}
    //   );

      //edited
      this.emptyData();
      this.serverService
      .postData( "enquiry/enquiry_view/",{enquiry_id: enquiryId})
      .subscribe(
        response => {
          if (response.status === 0) {

            if (response['dct_customer_data']) {
              this.dctEnquiry = response['dct_customer_data'];
            }
            this.blnCreditApprove=response['bln_edit_approve']

              // this.ImageSrc = this.serviceObject.hostAddress + 'media/' + this.userdetails['userlist'][0].vchr_profile_pic;

            this.dctBajajImages = response['lst_enq_fin_image'];
            if(this.dctBajajImages.length>0){

              this.imageBillSrc=this.nodeHost+this.dctBajajImages[0][1];
              this.imageDeliverySrc=this.nodeHost+this.dctBajajImages[0][2];
              this.imageIdOneSrc=this.nodeHost+this.dctBajajImages[0][3];
              this.imageIdTwoSrc=this.nodeHost+this.dctBajajImages[0][4];
              this.blnShowImage=true;
            }

            // =============================================================
            // this.invoiced_date=this.dctEnquiry['dat_created_at'];
            // this.invoiced_date=new Date(this.invoiced_date);
            // this.invoiced_date = this.invoiced_date.getDate()+'/'+ ((this.invoiced_date.getMonth()+1)<10?'0'+(this.invoiced_date.getMonth()+1):(this.invoiced_date.getMonth()+1))+'/'+ this.invoiced_date.getFullYear();
            // this.invoiced_date=new Date(this.invoiced_date);
            // this.timeDiff=Math.abs((this.invoiced_date.getTime())-(this.date.getTime()));
            // this.dayDiff=Math.ceil(this.timeDiff/(1000*3600*24))
            this.invoiced_date=this.dctEnquiry['dat_created_at'];
            this.invoiced_date=this.invoiced_date.split("/").reverse().join("/");
            this.invoiced_date=new Date(this.invoiced_date);
            this.timeDiff=Math.abs((this.invoiced_date.getTime())-(this.date.getTime()));
            this.dayDiff=Math.ceil(this.timeDiff/(1000*3600*24))
            if(this.dayDiff<=2){
              this.bln_checkDate=true;
            }
            if(response['dct_customer_data']['vchr_name_in_card']){
              this.strCardName = response['dct_customer_data']['vchr_name_in_card'];

            }
            if(response['dct_customer_data']['vchr_delivery_order_no']){
              this.strOrderNo = response['dct_customer_data']['vchr_delivery_order_no'];

            }
            if (response['dct_customer_data']['financier_entry']) {
              if (response['dct_customer_data']['financier_entry']['status']) {
              this.dctfinanceentry = response['dct_customer_data']['financier_entry'];
              this.strCardName = response['dct_customer_data']['financier_entry']['vchr_name_in_card'];
              this.strOrderNo = response['dct_customer_data']['financier_entry']['vchr_delivery_order_no'];

              }

            }
              this.dctEnquiryDetails = {};
              this.dctSmartchoice = {}
              this.smartchoiceKeys = [];
              this.dctEnquiryDetails = response['dct_enquiry_details'];
              this.dctSmartchoice = response['dct_smartchoice'];
              // console.log('this.dctEnquiryDetails',this.dctEnquiryDetails);

              this.smartchoiceKeys =Object.keys(this.dctSmartchoice)
              // console.log(this.smartchoiceKeys,'smart');
              


              this.enqKeys = Object.keys(this.dctEnquiryDetails);
              for(let key of this.enqKeys){
                for(let item of this.dctEnquiryDetails[key]){
                  // if(item['smartchoice']){
                  //   this.lstImages=item['items']['images']['image'];
                  // }

                  if (item['vchr_enquiry_status'] != 'IMAGE PENDING' ){
                    this.bln_img_status = false
                  }

                  if (item['vchr_enquiry_status'] == 'INVOICED' ){
                    this.blnBajajInvoiced = true;
                  }


                  if(item['vchr_enquiry_status'] == 'PARTIALLY PAID'){
                    this.bln_game=true
                  }
                  if(item['vchr_enquiry_status'] == 'CREDIT PURCHASE'){
                    this.blnShowApproval=true;
                  }

                }

                  if(this.bln_game){
                    this.serverService.getData('mobile/save_ball_game_amt/')
                    .subscribe(
                      (response) => {
                        this.spinnerService.hide();
                        if (response['status'] === 1) {
                          this.lstOffer=response['data']
                        }
                        else if (response['status'] === 0) {
                          swal.fire('error', response['reason'], 'error');
                        }
                      },
                      (error) => {
                      });
                  }
              }
              this.eligibleAmount = response['dct_customer_data']['dbl_amount'];
              this.strEligibleRemarks = response['dct_customer_data']['remark'];
              if (this.dctEnquiry['status'] === 'ELIGIBLE') {
                this.eligble = true;
              }else{
                this.eligble = false;
              }
          } else {
            this.dctEnquiry = {
              vchr_enquiry_num: '',
              cust_mobile: '',
              cust_email: '',
              cust_fname: '',
              cust_lname: '',
              cust_alternatemobile: '',
              cust_alternatemail: '',
              vchr_source_name: '',
              // vchr_priority_name: '',
              cust_contactsrc: '',
              bln_sms: false,
              vchr_name: '',
              staff_full_name:'',
              dat_created_at:Date,
              time_created_at:'',
              vchr_remarks:'',
              status:'',
              total_amount:null,
              finance_id: null
            };
            this.dctEnquiryDetails = {};
          }
        },
        error => {}
      );

  }

  checkArr(arr){
    let status = false
    if(arr.length==0){
      status = true
    }
    arr.forEach(element => {
      if (element.trim() === ''){
        status = true
      }
    });
    return status
  }

  saveFollowUp(serviceId, index, product_name , quantity) {
    this.intFollowUpQuantity = quantity;
    // let min_price = 0;
    // let max_price = 0;

    // min_price = this.dctEnquiryDetails[product_name][index].dbl_min_price * this.intFollowUpQuantity;
    // max_price = this.dctEnquiryDetails[product_name][index].dbl_max_price * this.intFollowUpQuantity;

    if(this.intFollowUpAmount <this.intFollowUpBuyBackAmount ){
      swal.fire('Error','Invalid Buy back amount','error')
      return
    }

    if(this.intFollowUpAmount < this.intFollowUpDiscountAmount ) {
      swal.fire('Error','Invalid  Discount amount','error')
      return
    }


    const pusheditems = {
      vchr_servicetype: '',
      int_service_id: null,
      vchr_current_user_name: '',
      int_followup_amount: null,
      vchr_followup_status: '',
      vchr_followup_remarks: ''
    };
    pusheditems['vchr_servicetype'] = this.strFollowUpService;
    pusheditems['int_service_id'] = serviceId;
    pusheditems['vchr_current_user_name'] = this.currentUserName;
    pusheditems['int_followup_quantity'] = this.intFollowUpQuantity;
    pusheditems['int_followup_amount'] = this.intFollowUpAmount;
    pusheditems['int_followup_buyback_amount'] = this.intFollowUpBuyBackAmount;
    pusheditems['dbl_gdp'] = this.intGDP;
    pusheditems['dbl_gdew'] =this.intGDEW ;
    if ((this.intGDP == '' && this.intGDEW == '') || (this.intGDP == 0 && this.intGDEW == 0)) {
      pusheditems['int_type'] = 0;
    } else if((this.intGDP != '' && this.intGDEW == '') || (this.intGDP != 0 && this.intGDEW == 0)) {
      pusheditems['int_type'] = 1;
    } else if((this.intGDP == '' && this.intGDEW != '') || (this.intGDP == 0 && this.intGDEW != 0)) {
      pusheditems['int_type'] = 2;
    } else if((this.intGDP != '' && this.intGDEW != '') || (this.intGDP != 0 && this.intGDEW != 0)) {
      pusheditems['int_type'] = 3;
    }
    pusheditems['int_followup_discount_amount'] = this.intFollowUpDiscountAmount;
    pusheditems['vchr_followup_status'] = this.strFollowUpStatus;
    pusheditems['vchr_followup_remarks'] = this.strFollowUpRemarks;
    pusheditems['lst_imei'] = this.lstImei;
    let lst_iemi_status = this.checkArr(pusheditems['lst_imei'])
    let blnFollowflag = true;
    if (pusheditems['int_followup_quantity'] == null || pusheditems['int_followup_quantity'] == 0) {
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Quantity mandatory !',
        confirmButtonText: 'OK'
      });
      blnFollowflag = false;
      return false;
    } else if (pusheditems['int_followup_amount'] == null || pusheditems['int_followup_amount'] == 0) {
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Amount mandatory !',
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
    }
    //  else if(lst_iemi_status && pusheditems['vchr_followup_status'] === 'BOOKED' && product_name !== 'Sim' && product_name !== 'Service' && product_name !== 'Recharges' ){
    //   swal.fire({
    //     title: 'Warning',
    //     type: 'warning',
    //     text: 'Imei mandatory 1!',
    //     confirmButtonText: 'OK'
    //   });
    //   blnFollowflag = false;
    //   return false;
    // }

    else if(lst_iemi_status && pusheditems['vchr_followup_status'] === 'BOOKED' && (product_name === 'Mobiles' || product_name === 'Tablets')){

      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Imei mandatory !',
        confirmButtonText: 'OK'
      });
      blnFollowflag = false;
      return false;
    }
    else if (pusheditems['vchr_followup_status'] === 'BOOKED' && (product_name === 'Mobiles' || product_name === 'Tablets' ) && pusheditems['lst_imei'].length != pusheditems['int_followup_quantity']) {

      if (pusheditems['lst_imei'].length>pusheditems['int_followup_quantity']) {
          pusheditems['lst_imei'] = pusheditems['lst_imei'].filter((x,i) => {
                      if (i<pusheditems['int_followup_quantity']) {
                        return x
                      }

            } )
        } else{
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Imei mandatory !',
        confirmButtonText: 'OK'
      });
      blnFollowflag = false;
      return false;
      }
    } else if (pusheditems['vchr_followup_remarks'] === '' ||pusheditems['vchr_followup_remarks'].trim()==='' ) {
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Remarks mandatory !',
        confirmButtonText: 'OK'
      });
      blnFollowflag = false;
      return false;
    }
    if (blnFollowflag === true) {
        this.spinnerService.show();
        this.serverService
          .postData('mobile_followup/add_followup/',pusheditems)
          .subscribe(
            response => {
              this.spinnerService.hide();
              if (response['status'] === 1) {

                  if (response['change'] === 1) {
                  this.strFollowUpService = this.titlecasePipe.transform(this.strFollowUpService);
                  this.dctEnquiryDetails[this.strFollowUpService][index].vchr_enquiry_status =
                    response['followup'];
                  this.dctEnquiryDetails[this.strFollowUpService][index].dbl_amount = response['amount'];
                  this.dctEnquiryDetails[this.strFollowUpService][index].vchr_remarks = response['remarks'];
                  this.dctEnquiryDetails[this.strFollowUpService][index].int_quantity = response['int_quantity'];
                  this.dctEnquiryDetails[this.strFollowUpService][index].dbl_buyback_amount = this.intFollowUpBuyBackAmount;
                  this.dctEnquiryDetails[this.strFollowUpService][index].dbl_discount_amount = this.intFollowUpDiscountAmount;
                  this.dctEnquiryDetails[this.strFollowUpService][index].dbl_gdp = this.intGDP;
                  this.dctEnquiryDetails[this.strFollowUpService][index].dbl_gdew = this.intGDEW;
                  if ((this.intGDP == '' && this.intGDEW == '') || (this.intGDP == 0 && this.intGDEW == 0)) {
                    this.dctEnquiryDetails[this.strFollowUpService][index]['int_type'] = 0;
                  } else if((this.intGDP != '' && this.intGDEW == '') || (this.intGDP != 0 && this.intGDEW == 0)) {
                    this.dctEnquiryDetails[this.strFollowUpService][index]['int_type'] = 1;
                  } else if((this.intGDP == '' && this.intGDEW != '') || (this.intGDP == 0 && this.intGDEW != 0)) {
                    this.dctEnquiryDetails[this.strFollowUpService][index]['int_type'] = 2;
                  } else if((this.intGDP != '' && this.intGDEW != '') || (this.intGDP != 0 && this.intGDEW != 0)) {
                    this.dctEnquiryDetails[this.strFollowUpService][index]['int_type'] = 3;
                  }
                  if(this.lstImei)
                  this.dctEnquiryDetails[this.strFollowUpService][index]['dbl_imei_json']['imei'] = this.lstImei;
                } else {
                    swal.fire({
                      title: 'Not Approved',
                      type: 'error',
                      text: 'Followup has not been approved'
                    });
                  }
                  this.getCustomerData();
                }
                if (
                  pusheditems['vchr_followup_status'] === 'Booked' ||
                  // pusheditems['vchr_followup_status'] === 'Unqualified' ||
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
              })
                .then(res => {
                  // if (res.value || res.dismiss) {
                    this.changeFollowUp(-1, '', 1,{});
                  // }
                })
                ;
            },
            error => {
              this.spinnerService.hide();
            }
          );
    }
  }
  // finance details saving
  saveEligiblity(){

    let dctData = {};

    if (this.eligble) {
      if (!this.eligibleAmount) {
        swal.fire({
          title: 'Warning',
          type: 'warning',
          text: 'Amount mandatory !',
          confirmButtonText: 'OK'
        });
        return false;
      } else if (this.eligibleAmount == 0){
        swal.fire({
          title: 'Warning',
          type: 'warning',
          text: 'Amount should greater than 0 !',
          confirmButtonText: 'OK'
        });
        return false;
      }
      else{
        dctData['amount'] = this.eligibleAmount;
      }
    }
    else{
      this.eligibleAmount = null;
      if (!this.strEligibleRemarks) {
        swal.fire({
          title: 'Warning',
          type: 'warning',
          text: 'Remark mandatory !',
          confirmButtonText: 'OK'
        });
        return false;
      }
    }
    dctData['eligible'] = this.eligble;
    dctData['remark'] = this.strEligibleRemarks;
    dctData['intEnquiryFinance'] = this.dctEnquiry.finance_id;
    this.serverService.postData("finance_enquiry/updateeligibility/",dctData).subscribe(response => {
      if (response['status'] == 1) {
        swal.fire({
          title: 'Success',
          type: 'success',
          text: 'Successfully saved !',
          confirmButtonText: 'OK'
        });
        this.router.navigate([this.previousLocation]);
      }
    });
  }

  changeFollowUp(id, service, changeStatus,item) {

    if (changeStatus === 0) {
      this.intFollowUpFlag = id;
      this.strFollowUpService = service;
    } else {
      this.intComputersFollowupId = -1;
      this.strFollowUpService = '';
    }
    this.intFollowUpAmount = item['dbl_amount'];
    this.intFollowUpBuyBackAmount = item['dbl_buyback_amount'];
    this.intFollowUpDiscountAmount = item['dbl_discount_amount'];
    this.strFollowUpStatus = item['vchr_enquiry_status'];
    this.intGDP = item['dbl_gdp'];
    this.intGDEW = item['dbl_gdew'];

    this.strFollowUpRemarks = '';
    this.intFollowUpQuantity = null;
    this.lstImei = []
    this.fltItemAmount = item['dbl_amount']/item['int_quantity'];
  }

  reverseLocation() {
    localStorage.removeItem('blankUrl');
    this.router.navigate([this.previousLocation]);
  }

  downloadEnquiry(enqId) {
    const data = { userId: this.userId, enquiryId: enqId };
    // this.serverService.downloadEnquiryPDF(data).subscribe(response => {
    //   if (response.status === 'success') {
    //     const file_data = response.file;
    //     localStorage.setItem(
    //       'print',
    //       file_data.substring(2, file_data.length - 1)
    //     );
    //     this.router.navigate(['/print']);
    //   }
    // });

    //edited

    this.serverService.postData("enquiry_print/download/",data).subscribe(response => {
      if (response.status === 1) {
        const file_data = response['file'];
        localStorage.setItem(
          'print',
          file_data.substring(2, file_data.length - 1)
        );
        this.router.navigate(['/print']);
      }
    });
  }

  checkQuantity(index,quantity) {
    this.intFollowUpQuantity = quantity
    if ((Number(this.intFollowUpQuantity)) <= 0) {
      this.intFollowUpQuantity = 1;
    }if (!quantity) {
      this.intFollowUpAmount = 0;
      this.intFollowUpBuyBackAmount = 0;
      this.intFollowUpDiscountAmount = 0;
    }
    else{
      this.intFollowUpAmount = this.intFollowUpQuantity * this.fltItemAmount;
    }
  }

  checkAmount(index, quantity, product) {
    this.intFollowUpQuantity = quantity;
    const min_str = 'Estimated amount not in range';
    const max_str = 'Estimated amount not in range';
    if ((Number(this.intFollowUpAmount)) > (Number(this.dctEnquiryDetails[product][index].dbl_max_price * this.intFollowUpQuantity))) {
      // this.snotifyService.error(max_str);
      swal.fire('Error!',  max_str);

    } else if ((Number(this.intFollowUpAmount)) < (Number(this.dctEnquiryDetails[product][index].dbl_min_price * this.intFollowUpQuantity))) {
      // this.snotifyService.error(min_str);
      swal.fire('Error!', min_str);

    } else {
      this.intFollowUpAmount = this.intFollowUpAmount;
    }
  }

  // finance approval
  saveFinanceApproval() {
    if(this.bln_name_card && this.bln_delivery_no){
      const enquiryId = localStorage.getItem('enqid');
      if(this.strCardName.trim() === '') {
        swal.fire({
          title: 'Warning',
          type: 'warning',
          text: 'Card Name mandatory !',
          confirmButtonText: 'OK'
        });
        return false;
      } else if (!/^[a-zA-Z\s ]*$/g.test(this.strCardName)) {
        swal.fire({
          title: 'Warning',
          type: 'warning',
          text: 'Card Name contains invalid characters !',
          confirmButtonText: 'OK'
        });
        return false;
      } else if(this.strOrderNo.trim() === '') {
        swal.fire({
          title: 'Warning',
          type: 'warning',
          text: 'Delivery Order No. mandatory !',
          confirmButtonText: 'OK'
        });
        return false;
      } else {
        const pusheditems = {};
        pusheditems['strCardName'] = this.strCardName.trim();
        pusheditems['strOrderNo'] = this.strOrderNo.trim();
        pusheditems['idEnquiry'] = enquiryId;
        this.serverService
          .postData('finance_enquiry/updatefinance/', pusheditems)
          .subscribe(
          response => {
            this.spinnerService.hide();
            if (response['status'] === 1) {
              swal.fire({
                title: 'Success',
                type: 'success',
                text: response['data'],
                confirmButtonText: 'OK',
                timer: 2000
              });
              this.getCustomerData();
              this.strCardName = '';
              this.strOrderNo = '';
            } else {
              swal.fire('Error', response['data'], 'error');
            }

          },
          error => {
            this.spinnerService.hide();
            swal.fire('Error', error, 'error');
          }
          );
      }
    }
    else{
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Verify both field',
        confirmButtonText: 'OK'
      });
      return false;
    }

  }
  getSchemaList(){
    this.serverService.getData("finance_enquiry/addfinancecustomer/").subscribe(response => {
      if (response.status == 1)
      {
        this.lstSchema=response['data']

      }
    });
  }
  saveFinanceEntry(){
    if(this.strCardName.trim() === '') {
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Card Name mandatory !',
        confirmButtonText: 'OK'
      });
      return false;
    } else if (!/^[a-zA-Z\s ]*$/g.test(this.strCardName)) {
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Card Name contains invalid characters !',
        confirmButtonText: 'OK'
      });
      return false;
    } else if(this.strOrderNo.trim() === '') {
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Delivery Order No. mandatory !',
        confirmButtonText: 'OK'
      });
      return false;
    } else if(this.intLoanAmt === 0) {
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Net loan amount is mandatory !',
        confirmButtonText: 'OK'
      });
      return false;
    }

    // else if(!this.strIdType){
    //   swal.fire({
    //     title: 'No Id type selected',
    //     type: 'error',
    //     text: 'Select at least one id type',
    //     confirmButtonText: 'OK'
    //   });
    //   return false;
    // }
    // else if(!this.intIdNumber){
    //   swal.fire('Error','Invalid Id Number','error')
    //   return false;
    // }
    // else if(!this.intPancardNo){
    //   swal.fire('Error','Invalid Pancard Number','error')
    //   return false;
    // }
    // else if(!this.vchr_bankname){
    //   swal.fire('Error','Invalid Bank Name','error')
    //   return false;
    // }
    // else if(!this.vchr_branchname){
    //   swal.fire('Error','Invalid Branch Name','error')
    //   return false;
    // }
    // else if(!this.intAccNo){
    //   swal.fire('Error','Invalid account number','error')
    //   return false;
    // }
    // else if(!this.intChequeNo){
    //   swal.fire('Error','Invalid check number','error')
    //   return false;
    // }

    // else if(!this.int_downpayment){
    //   swal.fire('Error','Invalid down payment','error')
    //   return false;
    // }
    else{

      let dctfinancedata={
        idNo:null,
        pancardNo:null,
        bankName:'',
        branchName:'',
        accno:null,
        chequeNo:null,
        idType:'',
        schema:'',
        nameOnCard:'',
        deliveryNo:'',
        type:'',
        downpayment:null,
        enqno:null,
        financeId:null
      };


   if(this.intIdNumber)
   {
    dctfinancedata['idNo']=this.intIdNumber;
   }
   if(this.intPancardNo)
   {
    dctfinancedata['pancardNo']=this.intPancardNo;
   }
   if(this.vchr_bankname)
   {
    dctfinancedata['bankName']=this.vchr_bankname;
   }
   if(this.vchr_branchname)
   {
    dctfinancedata['branchName']=this.vchr_branchname;
    }
   if(this.intAccNo)
   {
    dctfinancedata['accno']=this.intAccNo;
    }
   if(this.intChequeNo)
   {
    dctfinancedata['chequeNo']=this.intChequeNo;
   }
   if(this.strIdType)
   {
    dctfinancedata['idType']=this.strIdType;
   }


      dctfinancedata['schema'] = this.strSchema;

      // dctfinancedata['schema']=this.dctEnquiry['schema_id'];
      dctfinancedata['nameOnCard']=this.strCardName;
      dctfinancedata['deliveryNo']=this.strOrderNo;
      dctfinancedata['type']=this.payment_option;
      dctfinancedata['downpayment']=this.int_downpayment;
      dctfinancedata['enqno']=this.dctEnquiry.vchr_enquiry_num;
      dctfinancedata['financeId']=this.dctEnquiry.finance_id;

      dctfinancedata['marginMoney']=this.intMarginMoney
      dctfinancedata['processfee']=this.intProsFee
      dctfinancedata['dbdCharge']=this.intdbd
      dctfinancedata['loanAmt']=this.intLoanAmt
      dctfinancedata['serCharge']=this.intSerCharge
      dctfinancedata['total_amount'] = this.dctEnquiry['total_amount']


      this.serverService.postData("finance_enquiry/addfinancecustomer/",dctfinancedata).subscribe(response => {
          if (response.status == 1)
          {
            swal.fire('Success','Successfully saved !','success')
             this.getCustomerData();
          }
        });


    }
  }
  totalAmount(estimate_amt,buyback_amt,discount_amt,gdp,gdew){
    let tot=estimate_amt-buyback_amt-discount_amt+gdp+gdew
    return tot
  }
  changeOffer(id, service, changeStatus,item){
    if (changeStatus === 0) {
      this.intOfferFlag = id;
      this.strOfferService = service;
    }
    else {
      this.strOfferService = '';
    }

  }
  saveOffer(serviceId, index, product_name,status ){
    if(!this.vchr_offer){
      swal.fire({
        title: 'No Scheme selected',
        type: 'error',
        text: 'Select at least one offer',
        confirmButtonText: 'OK'
      });
      return false;
    }
    else{
      this.offer_id = Number(this.vchr_offer)
      let data = {
        enquiry_id: serviceId,
        offer_id:  this.offer_id,
      }
      this.serverService.postData('mobile/save_offer_details/',data)
      .subscribe(
        (response) => {
          this.spinnerService.hide();
          if (response['status'] == 1) {
            swal.fire('Success','Successfully saved !','success')
            this.router.navigate(['crm/enquirylist'])

          }
          else if (response['status'] == 0) {
            swal.fire('error', response['reason'], 'error');
          }
        },
        (error) => {
          this.spinnerService.hide();
        });
    }
  }

  changeGdpGdew(id, service, changeStatus,item){

    if (changeStatus === 0) {
      this.intgdpFlag = id;
      this.strgdpService = service;
    }
    else {
      this.strgdpService = '';
    }

    if(item['dbl_gdp']){
      this.int_GDP = item['dbl_gdp'];
    }
    if(item['dbl_gdew']){
      this.int_GDEW = item['dbl_gdew'];
    }
    if (item['int_type'] == 0 || item['int_type'] == 1) {
      this.gdew = true
    }
    if (item['int_type'] == 0 || item['int_type'] == 2) {
      this.gdp = true
    }

  }
  saveGdpGdew(serviceId, index, product_name , amount){

    if(this.gdp && this.gdew && this.int_GDP==0 && this.int_GDEW==0){
      swal.fire('Error','Invalid Gdp or Gdew','error')
      return false
    } else if(this.gdp && !this.gdew && this.int_GDP==0){
      swal.fire('Error','Invalid Gdp','error')
      return false
    } else if(this.gdew && !this.gdp && this.int_GDEW==0){
      swal.fire('Error','Invalid Gdew','error')
      return false
    }
    if(Number(this.int_GDP) > amount){
      swal.fire('Error','Invalid Gdp amount','error')
      return false
    }
    // else if(this.int_GDEW==0){
    //   swal.fire('Error','Invalid Gdew amount','error')
    //   return false
    // }
    else if(Number(this.int_GDEW) > amount){
      swal.fire('Error','Invalid Gdew amount','error')
      return false
    }
    else{

      const pusheditems = {
        int_GDP: 0,
        int_GDEW: 0,
        int_service_id:null,
        int_type:null
      };

      if(this.int_GDP){
        pusheditems['int_GDP'] = this.int_GDP;
      }
      if(this.int_GDEW){
        pusheditems['int_GDEW'] = this.int_GDEW;
      }
      pusheditems['int_service_id'] = serviceId;
      if(this.int_GDP && this.int_GDEW){
        pusheditems['int_type'] = 3;
      } else if(this.int_GDP){
        pusheditems['int_type'] = 1;
      } else if(this.int_GDEW){
        pusheditems['int_type'] = 2;
      }

      // pusheditems['vchr_gdp']=this.int_GDP;
      this.serverService.postData('mobile/updategdp/',pusheditems).subscribe(
        response => {
          this.spinnerService.hide();
          if (response['status'] == 1)
          {
            swal.fire({
              title: 'Success',
              type: 'success',
              text: "GDP & GDEW updated successfully!",
              confirmButtonText: 'OK',
              timer: 2000,
            })
            this.int_GDP=0;
            this.int_GDEW=0;
            this.changeGdpGdew(-1, '', 1,{});
            this.getCustomerData();
          }
        },
        error => {
          this.spinnerService.hide();
        });
    }

  }
  triggerOffer(id){
    this.offer_id=id;
  }
  addRequest() {
    let dctTemp={}
    for(let num of this.lstImeiNumbers){
      if(num.imei==null){
    swal.fire({
        title: 'Fill every fields',
        type: 'error',
        confirmButtonText: 'OK',
        timer: 2000
      });
      return;
      }
      else if(num.imei==''){
        swal.fire({
            title: 'Fill every fields',
            type: 'error',
            confirmButtonText: 'OK',
            timer: 2000
          });
          return;
          }
      else if (!/^[0-9a-zA-Z\s ]*$/g.test(num.imei)) {
        swal.fire({
          title: 'Warning',
          type: 'warning',
          text: 'Invalid characters !',
          confirmButtonText: 'OK'
        });
        return false;
    }
  }
    dctTemp['imeinumbers']=this.lstImeiNumbers;
    dctTemp['item_pk_bint_id']=this.intItemId;

    this.serverService.postData('mobile/add_imei/',dctTemp).subscribe(
      result => {
        // this.spinnerService.hide();
        if(result.status==1){
          swal.fire({
            title: 'IMEI Number Added',
            type: 'success',
            confirmButtonText: 'OK',
            timer: 2000
          });
          this.getCustomerData();

        }
        else{
          this.blnShowPopup = false;
          swal.fire({
            title: result['message'],
            type: 'error',
            confirmButtonText: 'OK',
            timer: 2000
          }).then(result1 => {
            if (result1.value) {
            }
          });

        }
      },
      (error) => {
        // this.toastr.error(error);
        swal.fire(error )
      });

  }
  clearFields() {
    for(let item of this.lstImeiNumbers){
      item.imei=null;
    }
  }
  hideModal(){
    this.blnShowPopup=false;
    this.blnImeiCheckPopup=false;
  }
  checkImeiRequest(itemId,imeinumbers){
    let lstTemp=[]
    this.blnImeiCheckPopup=true;
    this.intItemId=itemId;
    this.lstImeisToCheck=[];
    lstTemp = Object.keys(imeinumbers);

    for(let key of lstTemp){
      this.lstImeisToCheck.push(imeinumbers[key]);
    }




  }
  checkClickRequest(itemId,intItemQty){
    this.lstImeiNumbers=[];
    this.blnShowPopup=true;
    this.intItemId=itemId;
    this.intItemQty=intItemQty;
    for(let i in range(this.intItemQty)){
      this.lstImeiNumbers.push({imei:null})
    }
  }
  processRequest(response){
    let dctTemp={}

    dctTemp['imeinumbers']=this.lstImeisToCheck;
    dctTemp['item_pk_bint_id']=this.intItemId;
    dctTemp['request_response']=response;
    
    if(response=='Reject'){
      swal.fire({  //Confirmation before save
        title: 'Reject',
        input: 'text',
        text: "Are you sure want to reject ?" ,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: 'Cancel',
        confirmButtonText: "Yes, Reject it!",
        inputPlaceholder: 'Enter Reason!',
        inputValidator: (text) => {
          this.strRejectRemark = text;
        return !text && 'You need to write something!'
     },
      }).then(result => {
        if (result.value) {
          // event.confirm.resolve();
    
        dctTemp['strRemark']=this.strRejectRemark;
          
          this.serverService.postData('mobile/add_imei/',dctTemp).subscribe(
            result => {
              if(result.status==1){
                this.blnImeiCheckPopup=false;
                swal.fire({
                  title: 'IMEI Number '+result['message'],
                  type: 'success',
                  confirmButtonText: 'OK',
                  timer: 2000
                });
                this.blnRejectRequest = false;
                this.strRejectRemark = '';
                this.getCustomerData();
              }
              else{
                this.blnImeiCheckPopup = false;
                this.blnRejectRequest = false;
                this.strRejectRemark = '';
                swal.fire({
                  title: result['message'],
                  type: 'error',
                  confirmButtonText: 'OK',
                }).then(result1 => {
                  if (result1.value) {
                  }
                });
      
              }
      
            },
            (error) => {
              // this.toastr.error(error);
              swal.fire('Error!', 'error', error);
            });
    
        }
      })

}
else{
  this.serverService.postData('mobile/add_imei/',dctTemp).subscribe(
    result => {
      if(result.status==1){
        this.blnImeiCheckPopup=false;
        swal.fire({
          title: 'IMEI Number '+result['message'],
          type: 'success',
          confirmButtonText: 'OK',
          timer: 2000
        });
        this.blnRejectRequest = false;
        this.strRejectRemark = '';
        this.getCustomerData();
      }
      else{
        this.blnImeiCheckPopup = false;
        this.blnRejectRequest = false;
        this.strRejectRemark = '';
        swal.fire({
          title: result['message'],
          type: 'error',
          confirmButtonText: 'OK',
        }).then(result1 => {
          if (result1.value) {
          }
        });

      }

    },
    (error) => {
      // this.toastr.error(error);
      swal.fire('Error!', 'error', error);
    });

}






    
    // if(!this.strRejectRemark){
    //   this.toastr.error("Enter remarks");
      
    //   return false
      
    // }
    // if(this.blnRejectRequest){
    //   dctTemp['strRemark']=this.strRejectRemark;
    // }

  

  }

  onChange(event: any,imgType) {
    console.log("image event",event);
    console.log("image size",event.target.files[0].size);

   if(imgType=='Bill'){

      const imgs0=event.target.files[0];
      this.imgBillSrc=imgs0;
      this.imgBillLocation=event.target.files[0];
      status=this.checkImage();
    }
    else if(imgType=='idFirst'){
      const imgs1=event.target.files[0];
      this.imgId1Src=imgs1;
      this.imgId1Location=event.target.files[0];
      status=this.checkImage();
    }
    else if(imgType=='idSecond'){
      const imgs2=event.target.files[0];
      this.imgId2Src=imgs2;
      this.imgId2Location=event.target.files[0];
      status=this.checkImage();
    }
    else if(imgType=='Delivery'){
      const imgs3=event.target.files[0];
      this.imgDeliverySrc=imgs3;
      this.imgDeliveryLocation=event.target.files[0];
      status=this.checkImage();

    }

    // const imgs = event.target.files[0];
    // this.imgSrc = imgs;
    // this.imgLocation = event.target.files[0];
    // status = this.checkImage();
  }
  checkImage() {
    if (this.imgBillSrc) {
      const img_up_0 = new Image;
      const  img_ratio_up = 0;
      img_up_0.onload = () => {
        //   if (this.ImageLocation['size'] >= 25600 && this.ImageLocation['size'] <= 307200){
        //   this.ImageSrc = img_up.src;
        // } else {
        //   this.eventImg.nativeElement.value = null;
        //   this.ImageSrc = '';
        //   swal.fire('Error', 'Image size between 30KB and 300KB', 'error');
        // }
      };
        img_up_0.src = window.URL.createObjectURL(this.imgBillSrc);
        return status;
    }
   if (this.imgId1Src) {
    const img_up_1 = new Image;
    const  img_ratio_up = 0;
    img_up_1.onload = () => {
    };
      img_up_1.src = window.URL.createObjectURL(this.imgId1Src);
      return status;
  }

  if (this.imgId2Src) {
    const img_up_2 = new Image;
    const  img_ratio_up = 0;
    img_up_2.onload = () => {
    };
      img_up_2.src = window.URL.createObjectURL(this.imgId2Src);
      return status;
  }
  if(this.imgDeliverySrc){
    const img_up_3 = new Image;
    const  img_ratio_up = 0;
    img_up_3.onload = () => {
    };
      img_up_3.src = window.URL.createObjectURL(this.imgDeliverySrc);
      return status;

  }
}
addImages(){
  const enquiryId = localStorage.getItem('enqid');


  if(!this.imgBillSrc){
    swal.fire({
      title: 'Warning',
      type: 'warning',
      text: 'Bill Image is not Uploaded !',
      confirmButtonText: 'OK'
    });
    return false;
  }
  else if(this.imgBillSrc.size>100000){
    swal.fire({
      title: 'Warning',
      type: 'warning',
      text: 'Bill Image size should be less than 100kb',
      confirmButtonText: 'OK'
    });
    return false;
  }
  else if(!this.imgDeliverySrc){
    swal.fire({
      title: 'Warning',
      type: 'warning',
      text: 'Delivery Image is not Uploaded !',
      confirmButtonText: 'OK'
    });
    return false;
  }
  else if(this.imgDeliveryLocation.size >100000){
    swal.fire({
      title: 'Warning',
      type: 'warning',
      text: 'Delivery Image size should be less than 100kb',
      confirmButtonText: 'OK'
    });
    return false;
  }
  else if(!this.imgId1Src){
    swal.fire({
      title: 'Warning',
      type: 'warning',
      text: 'ID Proof is not Uploaded !',
      confirmButtonText: 'OK'
    });
    return false;
  }
  else if(this.imgId1Src.size>100000){
    swal.fire({
      title: 'Warning',
      type: 'warning',
      text: 'ID proof size should be less than 100kb',
      confirmButtonText: 'OK'
    });
    return false;
  }
  else if(this.imgId2Src){
    if(this.imgId2Src.size>100000){
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'ID proof size should be less than 100kb',
        confirmButtonText: 'OK'
      });
      return false;
    }
  }


  const formAddImageData= new FormData;
  formAddImageData.append('bill_image', this.imgBillLocation);
  formAddImageData.append('delivery_image',this.imgDeliveryLocation);
  formAddImageData.append('img_proof1',this.imgId1Location);
  formAddImageData.append('img_proof2',this.imgId2Location);
  formAddImageData.append('fk_enquiry_master_id',enquiryId)


  this.serverService.postData("mobile/enquiry_finance_image/",formAddImageData).subscribe(response => {
    if (response.status == 1) {
      swal.fire({
        title: 'Success',
        type: 'success',
        text: 'Successfully saved !',
        confirmButtonText: 'OK'
      });
      this.getCustomerData()
      // this.router.navigate([this.previousLocation]);
    }
    else{
      swal.fire({
        title: 'Error',
        type: 'error',
        confirmButtonText: 'OK',
      }).then(result1 => {
        if (result1.value) {
        }
      });

    }
  });



}
creditApproval(){
  let dctTemp={}
  const enquiryId = localStorage.getItem('enqid');

  dctTemp['intItemEnqId']=enquiryId;

  this.serverService.postData('mobile/book_credit_enquiry/',dctTemp).subscribe(
    result => {
      if(result.status==1){
        swal.fire({
          title: 'Success',
          type: 'success',
          confirmButtonText: 'OK',
          timer: 2000
        });
        this.router.navigate(['crm/enquirylist'])

      }
      else{
        swal.fire({
          title: result['message'],
          type: 'error',
          confirmButtonText: 'OK',
        }).then(result1 => {
          if (result1.value) {
          }
        });

      }

    },
    (error) => {
      // this.toastr.error(error);
      swal.fire('Error!', 'error', error);
    });

}



  OnKeyPress(item, event: any) {

    let e = <KeyboardEvent>event;
    if (item){
      if ( item.length > 21) {
        e.preventDefault();
      }
    }
  }
  RejectRequest(){

     this.blnRejectRequest = true;
  }
  cancelRejectRequest(){
    this.blnRejectRequest =  false;
  }

}
