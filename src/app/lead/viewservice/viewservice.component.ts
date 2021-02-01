import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from 'src/app/global.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnotifyService } from 'ng-snotify';
import { TitleCasePipe } from '@angular/common';
import { ChatService } from '../../chat.service';
@Component({
  selector: 'app-viewservice',
  templateUrl: './viewservice.component.html',
  styleUrls: ['./viewservice.component.scss']
})
export class ViewserviceComponent implements OnInit {
  lstImages = []
  lstCompletedStatus = ['BOOKED', 'LOST'];
  userId = localStorage.getItem('userId');
  blnShowCustFullDetails = false;
  lstOffer = []
  minPrice: any = 'N/A';
  maxPrice: any = 'N/A';
  groupName = '';
  nodeHost = '';
  hostName = ''
  objectKeys;
  strService = '';
  key
  item
  lst_worked_on

  currentUserName = localStorage.getItem('username');
  intComputersFollowupId = -1;


  previousLocation = localStorage.getItem('previousUrl');
  vchr_offer = ''
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
  intFollowUpDiscount;
  intFollowUpAdvance;
  strFollowUpStatus;
  strFollowUpRemarks;
  strOfferService: '';
  datFollowup;
  date = new Date();
  lstImei = {};
  fltItemAmount = 0;
  invoiced_date;
  dctEnquiry = {
    vchr_enquiry_num: '',
    vchr_job_num:'',
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
    staff_full_name: '',
    dat_created_at: Date,
    time_created_at: '',
    status: '',
    total_amount: null,
    finance_id: null
  };

  dctEnquiryDetails = {};
  dctfinanceentry = {};
  bln_game = false;
  enqKeys = [];
  eligble = true;
  eligibleAmount = null;
  strEligibleRemarks = '';

  strCardName = '';
  strOrderNo = '';

  lstFollowUpStatus = [
    // 'NEW',
    // 'WORKING',
    // 'PROPOSAL SEND',
    // 'NEGOTIATING',
    // 'UNQUALIFIED',
    'PENDING',
    // 'BOOKED',
    'LOST',
    // 'OUT OF STOCK'
  ];
  timeDiff;
  dayDiff;
  int_GDP: null;
  int_GDEW: null;
  // strgdpRemarks:'';
  strgdpService: '';
  lstSchema = [];
  lstIdType = [
    "Licence", "Passport", "Aadhar", "Voter Id"
  ];
  intIdNumber: null;
  intPancardNo: null;
  vchr_bankname: null;
  intAccNo: null;
  vchr_branchname: '';
  strSchema: ''
  strIdType: '';
  intChequeNo: null;
  int_downpayment: null;
  payment_option = 'CASH';
  bln_checkDate = false;

  showModal = false
  imgPath='';
  hover = false;

  intGdpFollowUpFlag = -1;
  strGdpFollowUpService = '';
  intGdpComputersFollowupId = -1;
  strTransfer='mygcare'
  blnGdot=false
  blnHO=false

  intGdpMygCareFlag = -1;
  strGdpMygCareService = '';
  intGdpMygCareComputersFollowupId = -1;

  intMygServiceAmt=0
  
  constructor(
    private spinnerService: NgxSpinnerService,
    private serverService: ServerService,
    private dataService: DataService,
    public router: Router,
    private snotifyService: SnotifyService,
    private titlecasePipe: TitleCasePipe,
    private chatService: ChatService,

  ) { }

  ngOnInit() {
    this.objectKeys = Object.keys;
    const date = new Date();
    this.datFollowup = new Date();
    this.nodeHost = this.chatService.url;
    this.hostName = this.serverService.hostAddress

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
      vchr_job_num:'',
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
      staff_full_name: '',
      dat_created_at: Date,
      time_created_at: '',
      status: '',
      total_amount: null,
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
    const jobId = localStorage.getItem('jobid');
  
    this.serverService
      .postData("service/service_view/", { job_id: jobId })
      .subscribe(
        response => {
          if (response.status === 0) {
            this.emptyData();
            if (response['dct_customer_data']) {
              this.dctEnquiry = response['dct_customer_data'];
            }
            this.invoiced_date = this.dctEnquiry['dat_created_at'];
            this.invoiced_date = new Date(this.invoiced_date);
            this.invoiced_date = this.invoiced_date.getDate() + '/' + ((this.invoiced_date.getMonth() + 1) < 10 ? '0' + (this.invoiced_date.getMonth() + 1) : (this.invoiced_date.getMonth() + 1)) + '/' + this.invoiced_date.getFullYear();
            this.invoiced_date = new Date(this.invoiced_date);
            this.timeDiff = Math.abs((this.invoiced_date.getTime()) - (this.date.getTime()));
            this.dayDiff = Math.ceil(this.timeDiff / (1000 * 3600 * 24))
            if (this.dayDiff <= 2) {
              this.bln_checkDate = true;
            }

            if (response['dct_customer_data']['financier_entry']) {
              if (response['dct_customer_data']['financier_entry']['status']) {
                this.dctfinanceentry = response['dct_customer_data']['financier_entry'];
              }

            }

            this.dctEnquiryDetails = {};

            this.dctEnquiryDetails = response['dct_enquiry_details'];
            this.blnGdot=response['bln_gdot']
            console.log("gdot", this.blnGdot)
            this.blnHO=response['bln_ho']
            this.strService = response['strService'];
            

            this.enqKeys = Object.keys(this.dctEnquiryDetails);
            for (let key of this.enqKeys) {
              for (let item of this.dctEnquiryDetails[key]) {
                // if(item['smartchoice']){
                //   this.lstImages=item['items']['images']['image'];
                // }
                if (item['vchr_enquiry_status'] == 'PARTIALLY PAID') {
                  this.bln_game = true
                }
              }

              if (this.bln_game) {
                this.serverService.getData('mobile/save_ball_game_amt/')
                  .subscribe(
                    (response) => {
                      this.spinnerService.hide();
                      if (response['status'] === 1) {
                        this.lstOffer = response['data']
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
            } else {
              this.eligble = false;
            }
          } else {
            this.dctEnquiry = {
              vchr_enquiry_num: '',
              vchr_job_num:'',
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
              staff_full_name: '',
              dat_created_at: Date,
              time_created_at: '',
              status: '',
              total_amount: null,
              finance_id: null
            };
            this.dctEnquiryDetails = {};
          }
        },
        error => { }
      );

  }

  checkArr(arr) {
    let status = false
    if (arr.length == 0) {
      status = true
    }
    arr.forEach(element => {
      if (element.trim() === '') {
        status = true
      }
    });
    return status
  }


  // finance details saving
  saveEligiblity() {

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
      } else if (this.eligibleAmount == 0) {
        swal.fire({
          title: 'Warning',
          type: 'warning',
          text: 'Amount should greater than 0 !',
          confirmButtonText: 'OK'
        });
        return false;
      }
      else {
        dctData['amount'] = this.eligibleAmount;
      }
    }
    else {
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
    this.serverService.postData("finance_enquiry/updateeligibility/", dctData).subscribe(response => {
      if (response.status == 1) {
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
  saveFollowup(id, index, product_name , amount){

    const pusheditems = {
      dat_followup: null,
      int_followup_id: null,
      int_followup_amount: null,
      vchr_followup_status: '',
      vchr_followup_remarks: ''
    };
    if (!this.datFollowup) {
      swal.fire({
        title: 'Date not selected',
        type: 'error',
        text: 'Please select date ',
        confirmButtonText: 'OK'
      });
      return false;
    }
    else if (this.intFollowUpAmount == null || this.intFollowUpAmount == 0) {
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Amount mandatory !',
        confirmButtonText: 'OK'
      });
      return false;
    }
    else if (this.strFollowUpStatus == null || this.strFollowUpStatus == '') {
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Status mandatory !',
        confirmButtonText: 'OK'
      });
      return false;
    } 
    else if (this.strFollowUpRemarks == null || this.strFollowUpRemarks == '') {
      swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Remarks mandatory !',
        confirmButtonText: 'OK'
      });
      return false;
    }
    else{

      pusheditems['dat_followup'] = this.datFollowup;
      pusheditems['int_followup_id'] = id;
      pusheditems['int_followup_amount'] = this.intFollowUpAmount;
      pusheditems['vchr_followup_status'] = this.strFollowUpStatus;
      pusheditems['vchr_followup_remarks'] = this.strFollowUpRemarks;
      if( this.intFollowUpDiscount)
      {
      pusheditems['service_discount'] = this.intFollowUpDiscount;
      }
      else{
      pusheditems['service_discount'] =0;
      }
      if( this.intFollowUpAdvance)
      {
      pusheditems['service_advance'] = this.intFollowUpAdvance;
      }
      else{
      pusheditems['service_advance'] =0;
      }
      this.serverService.postData("service/service_followup/", pusheditems).subscribe(response => {
        if (response.status === 1) {
          this.changeFollowUp(-1, '', 1,{});
          this.getCustomerData();
        }
      });
    }



  }

  // reverseLocation() {
  //   localStorage.removeItem('blankUrl');
  //   this.router.navigate([this.previousLocation]);
  // }

  downloadEnquiry(enqId) {
    const data = { userId: this.userId, enquiryId: enqId };
  
    this.serverService.postData("enquiry_print/download/", data).subscribe(response => {
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

  checkQuantity(index, quantity) {
    this.intFollowUpQuantity = quantity
    if ((Number(this.intFollowUpQuantity)) <= 0) {
      this.intFollowUpQuantity = 1;
    } if (!quantity) {
      this.intFollowUpAmount = 0;
      this.intFollowUpBuyBackAmount = 0;
      this.intFollowUpDiscountAmount = 0;
    }
    else {
      this.intFollowUpAmount = this.intFollowUpQuantity * this.fltItemAmount;
    }
  }

  checkAmount(index, quantity, product) {
    this.intFollowUpQuantity = quantity;
    const min_str = 'Estimated amount not in range';
    const max_str = 'Estimated amount not in range';
    if ((Number(this.intFollowUpAmount)) > (Number(this.dctEnquiryDetails[product][index].dbl_max_price * this.intFollowUpQuantity))) {
      this.snotifyService.error(max_str);
    } else if ((Number(this.intFollowUpAmount)) < (Number(this.dctEnquiryDetails[product][index].dbl_min_price * this.intFollowUpQuantity))) {
      this.snotifyService.error(min_str);
    } else {
      this.intFollowUpAmount = this.intFollowUpAmount;
    }
  }

  // finance approval
  saveFinanceApproval() {
    const enquiryId = localStorage.getItem('enqid');
    if (this.strCardName.trim() === '') {
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
    } else if (this.strOrderNo.trim() === '') {
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
  getSchemaList() {
    this.serverService.getData("finance_enquiry/addfinancecustomer/").subscribe(response => {
      if (response.status === 1) {
        this.lstSchema = response['data']

      }
    });
  }
  saveFinanceEntry() {
    if (!this.strSchema) {
      swal.fire({
        title: 'No Scheme selected',
        type: 'error',
        text: 'Select at least one scheme',
        confirmButtonText: 'OK'
      });
      return false;
    }
    else if (!this.strIdType) {
      swal.fire({
        title: 'No Id type selected',
        type: 'error',
        text: 'Select at least one id type',
        confirmButtonText: 'OK'
      });
      return false;
    }
    else if (!this.intIdNumber) {
      swal.fire('Error', 'Invalid Id Number', 'error')
      return false;
    }
    else if (!this.intPancardNo) {
      swal.fire('Error', 'Invalid Pancard Number', 'error')
      return false;
    }
    else if (!this.vchr_bankname) {
      swal.fire('Error', 'Invalid Bank Name', 'error')
      return false;
    }
    else if (!this.vchr_branchname) {
      swal.fire('Error', 'Invalid Branch Name', 'error')
      return false;
    }
    else if (!this.intAccNo) {
      swal.fire('Error', 'Invalid account number', 'error')
      return false;
    }
    else if (!this.intChequeNo) {
      swal.fire('Error', 'Invalid check number', 'error')
      return false;
    }
    else if (!this.int_downpayment) {
      swal.fire('Error', 'Invalid down payment', 'error')
      return false;
    }
    else {
      let dctfinancedata = {};
      dctfinancedata['schema'] = this.strSchema;
      dctfinancedata['idType'] = this.strIdType;
      dctfinancedata['idNo'] = this.intIdNumber;
      dctfinancedata['pancardNo'] = this.intPancardNo;
      dctfinancedata['bankName'] = this.vchr_bankname;
      dctfinancedata['branchName'] = this.vchr_branchname;
      dctfinancedata['chequeNo'] = this.intChequeNo;
      dctfinancedata['type'] = this.payment_option;
      dctfinancedata['downpayment'] = this.int_downpayment;
      dctfinancedata['accno'] = this.intAccNo;
      dctfinancedata['enqno'] = this.dctEnquiry.vchr_enquiry_num;
      this.serverService.postData("finance_enquiry/addfinancecustomer/", dctfinancedata).subscribe(response => {
        if (response.status === 1) {
          swal.fire('Success', 'Successfully saved !', 'success')
          this.getCustomerData();
        }
      });


    }
  }
  totalAmount(estimate_amt, buyback_amt, discount_amt, gdp, gdew) {
    let tot = estimate_amt - buyback_amt - discount_amt + gdp + gdew
    return tot
  }
  changeOffer(id, service, changeStatus, item) {
    console.log(this.lstOffer, "ofr")
    if (changeStatus === 0) {
      this.intOfferFlag = id;
      this.strOfferService = service;
    }
    else {
      this.strOfferService = '';
    }

  }
  saveOffer(serviceId, index, product_name, status) {
    if (!this.vchr_offer) {
      swal.fire({
        title: 'No Scheme selected',
        type: 'error',
        text: 'Select at least one offer',
        confirmButtonText: 'OK'
      });
      return false;
    }
    else {
      let data = {
        enquiry_id: serviceId,
        offer_id: this.offer_id,
      }
      this.serverService.postData('mobile/save_offer_details/', data)
        .subscribe(
          (response) => {
            this.spinnerService.hide();
            if (response['status'] === 1) {
              swal.fire('Success', 'Successfully saved !', 'success')
              this.router.navigate(['crm/enquirylist'])

            }
            else if (response['status'] === 0) {
              swal.fire('error', response['reason'], 'error');
            }
          },
          (error) => {
            this.spinnerService.hide();
          });
    }
  }

  changeGdpGdew(id, service, changeStatus, item) {

    if (changeStatus === 0) {
      this.intgdpFlag = id;
      this.strgdpService = service;
    }
    else {
      this.strgdpService = '';
    }
    this.int_GDP = item['dbl_gdp'];
    this.int_GDEW = item['dbl_gdew'];
  }
  saveGdpGdew(serviceId, index, product_name, amount) {

    if (!this.int_GDP) {
      swal.fire('Error', 'Invalid Gdp amount', 'error')
      return false
    }
    else if (Number(this.int_GDP) > amount) {
      swal.fire('Error', 'Invalid Gdp amount', 'error')
      return false
    }
    else if (!this.int_GDEW) {
      swal.fire('Error', 'Invalid Gdew amount', 'error')
      return false
    }
    else if (Number(this.int_GDEW) > amount) {
      swal.fire('Error', 'Invalid Gdew amount', 'error')
      return false
    }
    else {
      const pusheditems = {
        int_GDP: null,
        int_GDEW: null,
        int_service_id: null,
        int_type: null
     
     
     
     
     
     
     
     };
      pusheditems['int_GDP'] = this.int_GDP;
      pusheditems['int_GDEW'] = this.int_GDEW;
      pusheditems['int_service_id'] = serviceId;
      pusheditems['int_type'] = 3;

      pusheditems['vchr_gdp'] = this.int_GDP;
      pusheditems['vchr']
      this.serverService.postData('mobile/updategdp/', pusheditems).subscribe(
        response => {
          this.spinnerService.hide();
          if (response['status'] === 1) {
            swal.fire({
              title: 'Success',
              type: 'success',
              text: "GDP & GDEW updated successfully!",
              confirmButtonText: 'OK',
              timer: 2000,
            })
            this.int_GDP = null;
            this.int_GDEW = null;
            this.changeGdpGdew(-1, '', 1, {});
            this.getCustomerData();
          }
        },
        error => {
          this.spinnerService.hide();
        });
    }

  }
  triggerOffer(id) {
    this.offer_id = id;
  }
  changeFollowUp(id, service, changeStatus,item) {
    
    if (changeStatus === 0) {
      this.intFollowUpFlag = id;
      this.strFollowUpService = service;
    } else {
      this.intComputersFollowupId = -1;
      this.strFollowUpService = '';
    }
    this.datFollowup= item['dat_exp_delivery'];
    this.intFollowUpAmount = item['dbl_est_amt'];
    this.strFollowUpRemarks = item['vchr_remarks'];
    this.intFollowUpAdvance= item['dbl_advc_paid'];
    this.intFollowUpDiscount = item['dbl_discount'];
  }

  changeGdpFollowUp(id, service, changeStatus,item) {
    
    if(changeStatus === 0) {
      this.intGdpFollowUpFlag = id;
      this.strGdpFollowUpService = service;
    }
    else {
      this.intGdpComputersFollowupId = -1;
      this.strGdpFollowUpService = '';
    }
  }
  changeGdpMygCare(id, service, changeStatus,item) {
    
    if(changeStatus === 0) {
      this.intGdpMygCareFlag = id;
      this.strGdpMygCareService = service;
    }
    else {
      this.intGdpComputersFollowupId = -1;
      this.strGdpMygCareService = '';
    }
  }

  imagePopUp(key)
  {
    this.imgPath = key; 
    this.showModal = true;
    // console.log(document.getElementsByClassName("modal")[0]['style'].filter,'modal')
    // document.getElementsByClassName("modal")[0].style.WebkitFilter = 'blur(4px)';
    document.getElementsByClassName("blur")[0]['style'].filter= 'blur(4px)';
  }

  ClickedOut(event){
    if(event.target.className === "modal") {
      this.showModal = false;
      document.getElementsByClassName("blur")[0]['style'].filter= '';
    } 
  }
  saveGdpFollowup(pk_bint_id,tempId, key){
   let dctData={}
   dctData['service_id']=pk_bint_id
   if((this.strTransfer=='mygcare') && (this.strService == 'GDEW')){
    dctData['intStatus']='7'
   }
   else if(this.strTransfer=='mygcare'){
    dctData['intStatus']='5'

   }
   else if((this.strTransfer =='servicecenter') && (this.strService == 'GDEW')){
    dctData['intStatus']='8'
   }
   else{
    dctData['intStatus']='6'
   }

    this.serverService.postData('service/gdp_followup/',dctData).subscribe(
      response => {
        this.spinnerService.hide();
        if (response['status'] === 1) {
          swal.fire({
            title: 'Success',
            type: 'success',
            text: "Updated successfully!",
            confirmButtonText: 'OK',
            timer: 2000,
          })
          this.router.navigate(['crm/servicelist'])

        }
      },
      error => {
        this.spinnerService.hide();
      });
  }

  saveGdpMygCare(pk_bint_id,tempId, key){
    if(!this.intMygServiceAmt){
      swal.fire('Error', 'Invalid service amount', 'error')
      return false
    }
    else{
      let dctData={}
      dctData['service_id']=pk_bint_id
      dctData['service_amt']=this.intMygServiceAmt

       this.serverService.postData('service/gdp_followup/',dctData).subscribe(
         response => {
           this.spinnerService.hide();
           if (response['status'] === 1) {
             swal.fire({
               title: 'Success',
               type: 'success',
               text: "Updated successfully!",
               confirmButtonText: 'OK',
               timer: 2000,
             })
             this.router.navigate(['crm/servicelist'])
   
           }
         },
         error => {
           this.spinnerService.hide();
         });
    }
   
  }
  approve(){

    this.serverService.putData('service/assigned_service/',{'bln_confirm_forwarded_service':true,'jobId': this.dctEnquiry['job_id']}).subscribe(
      response => {
        this.spinnerService.hide();
        if (response['status'] === 1) {
          swal.fire({
            title: 'Success',
            type: 'success',
            text: "Updated successfully!",
            confirmButtonText: 'OK',
            timer: 2000,
          })
          this.router.navigate(['crm/servicelist'])

        }
      },
      error => {
        this.spinnerService.hide();
      });
  }
                    
}




