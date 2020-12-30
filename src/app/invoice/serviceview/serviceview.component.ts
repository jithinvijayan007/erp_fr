import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ServerService } from '../../server.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {NgbModal,ModalDismissReasons,NgbActiveModal,} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-serviceview',
  templateUrl: './serviceview.component.html',
  styleUrls: ['./serviceview.component.css']
})
export class ServiceviewComponent implements OnInit {

  datFollowup
  intEstAmt = 0
  strFollowUpStatus = ""
  strRemarks = ""
  intDiscount = 0
  intAdvanceAmt = 0

  intFollowUpFlag = -1
  strFollowUpService = ''
  selectedDate
  nodeURL = ''

  intGDPFlag = -1
  strGDPService = ''

  dctData = {}

  objectKeys = Object.keys


  dctEnquiryDetails= {}
  dctMaster = {}

  enqKeys = []
  strGDPAdv=0

  salesRowId;
  salesStatus = localStorage.getItem('salesStatus');
  salesStatusNa = localStorage.getItem('salestatusname');

  fopSelected=null;
  datIssue;
  intAmount;
  intPaymentStatus = null;
  strPaytmRefereNumber='';
  strCardNumber = null;


  intPartialId ;
  deliveryStaffName;
  deliveryStaffUsername;
  
  form: FormGroup;
  message;

  image1;
  image2;
  image3;
  image4;
  image5;
  image6;

  public imagePath1;
  imgURL1: any;
  public imagePath2;
  imgURL2: any;
  public imagePath3;
  imgURL3: any;
  public imagePath4;
  imgURL4: any;
  public imagePath5;
  imgURL5: any;
  public imagePath6;
  imgURL6: any;
  
  @ViewChild('estAmtId') estAmtId: any;
  @ViewChild('discId') discId: any;
  @ViewChild('advanceAmtId') advanceAmtId: any;
  @ViewChild('file1') file1: any;
  @ViewChild('file2') file2: any;
  @ViewChild('file3') file3: any;
  @ViewChild('file4') file4: any;
  @ViewChild('file5') file5: any;
  @ViewChild('file6') file6: any;

  @ViewChild('issueDate') issueDate: any;
  @ViewChild('amountId') amountId: any;
  @ViewChild('paytmRefId') paytmRefId: any;



  showModalDeliveryStaff;
  lstDeliveryStaffs=[]
  selectedDeliveryStaff = '';
  deliveryStaffId ;
  strAssignedStaff;
  hostName
  lstBankNames = []
  intBankId;
  lstPayment=[]
  lstSpare = []

  searchDeliveryStaff: FormControl = new FormControl();

  constructor(private serviceObject: ServerService,
     public router: Router,
     private formBuilder: FormBuilder,
     private toastr: ToastrService,
     private modalService: NgbModal,
     ) { }

  ngOnInit() {  
    if (localStorage.getItem('enquiryRequestData')) {
      localStorage.setItem('enquiryCustomerNumberStatus', '1');
    }
    this.datIssue = new Date()

    this.salesRowId = localStorage.getItem('salesRowId');
    
    this.nodeURL = this.serviceObject.url    
    this.hostName = this.serviceObject.hostAddress
    // this.hostName = 'http://192.168.0.108:8080/'


    this.form = this.formBuilder.group({
      img1: [''],
      img2: [''],
      img3: [''],
      img4:[''],
      img5:[''],
      img6: ['']
});

    
    
    this.serviceObject.postData('invoice/add_followup/', { 'partial_id': this.salesRowId}).subscribe(res => {
      
      if (res.status == 1){
        this.dctMaster = res['dct_customer']
        this.dctEnquiryDetails = res['dct_enquiry_details']
        this.lstPayment = res['lst_payment']; 
        // console.log( this.lstPayment ," this.lstPayment ");
        
        this.lstSpare = res['dct_spare']
        this.enqKeys = Object.keys(this.dctEnquiryDetails)
        this.intPartialId = res['dct_customer']['partial_id'];
        this.strAssignedStaff = this.dctEnquiryDetails[this.enqKeys[0]][0];
        
        this.intAdvanceAmt = this.dctEnquiryDetails[this.enqKeys[0]][0]['dbl_advc_paid']

        if((this.dctEnquiryDetails[this.enqKeys[0]][0]['vchr_job_status']=="GDP NORMAL NEW") || (this.dctEnquiryDetails[this.enqKeys[0]][0]['vchr_job_status']=="GDEW NEW" )) 
           this.strGDPAdv= this.dctEnquiryDetails[this.enqKeys[0]][0]['int_adv_amount'] 
        }
        
      });

      this.searchDeliveryStaff.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstDeliveryStaffs = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('payment/staff_typeahead/',{term:strData,blnBranch:true})
              .subscribe(
                (response) => {
                  this.lstDeliveryStaffs = response['data'];
  
                }
              );
            }
          }
        }
      );
        
  }

  saveFollowup(item_code,service_id) {

    this.intAdvanceAmt=+this.intAdvanceAmt;
    
    let dat_current = moment(new Date()).format('YYYY-MM-DD')
    this.selectedDate =  moment(this.datFollowup).format('YYYY-MM-DD')
    console.log(this.fopSelected);
    
    // if (!this.datFollowup) {
    //   Swal.fire({
    //     title: 'Date not selected',
    //     type: 'error',
    //     text: 'Please select date ',
    //     confirmButtonText: 'OK'
    //   });
    //   return false;
    // }
    // else if (this.selectedDate < dat_current) {
    //   Swal.fire({
    //     title: 'Invalid date',
    //     type: 'error',
    //     text: 'Please select valid date ',
    //     confirmButtonText: 'OK'
    //   });
    //   return false;
    // }
    // else if (this.intEstAmt == null || this.intEstAmt == 0) {
    //   Swal.fire({
    //     title: 'Warning',
    //     type: 'warning',
    //     text: 'Amount mandatory !',
    //     confirmButtonText: 'OK'
    //   });
    //   this.estAmtId.nativeElement.focus();
    //   return false;
    
    if (this.intDiscount && this.intEstAmt < this.intDiscount) {

      Swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Enter valid discount amount !',
        confirmButtonText: 'OK'
      });
      this.discId.nativeElement.focus();
      return false;
    }
    else if (this.intAdvanceAmt && this.intEstAmt - this.intDiscount < this.intAdvanceAmt) {
      Swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Enter valid advance amount !',
        confirmButtonText: 'OK'
      });
      this.advanceAmtId.nativeElement.focus();
      return false;
    }

    else if (this.strFollowUpStatus == null || this.strFollowUpStatus == '') {
      Swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Status mandatory !',
        confirmButtonText: 'OK'
      });
      return false;
    }

//receipt
    if(this.strFollowUpStatus != 'LOST'){
     if(!this.fopSelected){
      this.toastr.error('Select valid FOP', 'Error!');
      return false;
    }
    else if((this.fopSelected==2 || this.fopSelected == 3) && this.strCardNumber == ''){
      this.toastr.error('Enter Card Number', 'Error!');
      return false;
    }
    else if((this.fopSelected==2 || this.fopSelected == 3) && this.strCardNumber.length < 4 || this.strCardNumber.length >4 ){
      this.toastr.error('Enter 4 Digits for Credit Card', 'Error');
      return false;

     }
    else if(this.fopSelected==7 && this.strPaytmRefereNumber == ''){
      this.toastr.error('Enter Reference Number', 'Error!');
      return false;
    }
    else if(this.fopSelected==8 && this.strPaytmRefereNumber == ''){
      this.toastr.error('Enter Reference Number', 'Error!');
      return false;
    }
    else if(this.fopSelected==9 && this.strPaytmRefereNumber == ''){
      this.toastr.error('Enter Reference Number', 'Error!');
      return false;
    }
    else if((this.fopSelected==2 || this.fopSelected == 3) && this.strPaytmRefereNumber == ''){
      this.toastr.error('Enter Reference Number', 'Error!');
      return false;
    }
    else if ((this.fopSelected == 2 || this.fopSelected == 3) && this.intBankId == null) {
      this.toastr.error('Select Bank', 'Error!');
      return false;
    }
   
    else if(!this.intAmount){
      this.amountId.nativeElement.focus();
      this.toastr.error('Enter Amount', 'Error!');
      return false;
    }
    else if(Math.floor(this.intAmount)!=Math.floor(this.intAdvanceAmt)){
      this.amountId.nativeElement.focus();
      this.toastr.error('Advance paid and Amount are not equal', 'Error!');
      return false;
    }

    // else if(!this.datIssue){
    //   this.issueDate.nativeElement.focus();
    //   this.toastr.error('Select Date Issue', 'Error!');
    //   return false;
    // }
  }
//receipt end



     if (this.strRemarks == null || this.strRemarks == '') {
      Swal.fire({
        title: 'Warning',
        type: 'warning',
        text: 'Remarks mandatory !',
        confirmButtonText: 'OK'
      });
      return false;
    }
    else {

      let pusheditems = {}

      pusheditems['dat_followup'] = this.selectedDate;
      pusheditems['int_followup_amount'] = this.intEstAmt;
      pusheditems['vchr_followup_status'] = this.strFollowUpStatus;
      pusheditems['vchr_followup_remarks'] = this.strRemarks;

      pusheditems['partial_id'] = this.dctMaster['partial_id'];
      pusheditems['int_service_id'] = service_id;
      pusheditems['int_item_code'] = item_code;

      if (this.intDiscount) {
        pusheditems['service_discount'] = this.intDiscount;
      }
      else {
        pusheditems['service_discount'] = 0;
      }
      if (this.intAdvanceAmt) {
        pusheditems['service_advance'] = this.intAdvanceAmt;
      }
      else {
        pusheditems['service_advance'] = 0;
      }

      //receipt
      if(this.strFollowUpStatus != 'LOST'){
      pusheditems['intFop'] = this.fopSelected;
      // pusheditems['datIssue'] = this.datIssue;
      pusheditems['amount'] = this.intAmount;
      pusheditems['intPaymentStatus'] = this.intPaymentStatus;
      if(this.fopSelected == 7 || this.fopSelected == 8  || this.fopSelected == 9  || this.fopSelected == 2 || this.fopSelected == 3){
        pusheditems['vchrReferenceNumber'] = this.strPaytmRefereNumber;
      }
      if(this.fopSelected == 2 || this.fopSelected == 3){
        pusheditems['vchrCardNUmber'] = this.strCardNumber;
        pusheditems['intBankId'] = this.intBankId;
      }
    }
      //receipt

      // console.log("pusheditems",pusheditems);
      

      // return;
// ===================
      this.serviceObject.postData("receipt/add_receipt_pending/", pusheditems).subscribe(response => {
        if (response.status == 1) {
          Swal.fire({
            title: 'Sucess',
            type: 'success',
            text: 'Followup successfully!',
            confirmButtonText: 'OK'
          });
    localStorage.setItem('previousUrl','invoice/servicelist');
          
          this.router.navigate(['invoice/servicelist'])
        }
      else{
        Swal.fire({
          title: 'Error',
          type: 'error',
          text: response['data'],
          confirmButtonText: 'OK'
        });
      }
      });
    }                                          

  }
  saveGDPFollowup(partial_id, id,item_code){
    console.log();
    

    this.strGDPAdv=+this.strGDPAdv;


    
      if (!this.strGDPAdv) {
        Swal.fire({
          title: 'Warning',
          type: 'warning',
          text: 'Enter valid advance amount !',
          confirmButtonText: 'OK'
        });
      return false;
    }

    //receipt
    if(this.strFollowUpStatus!='LOST'){
    console.log("jjhjhjh");
    
     if(!this.fopSelected){
      this.toastr.error('Select valid FOP', 'Error!');
      return false;
    }
    else if((this.fopSelected==2 || this.fopSelected == 3) && this.strCardNumber == null){
      this.toastr.error('Enter Card Number', 'Error!');
      return false;
    }
    else if((this.fopSelected==2 || this.fopSelected == 3) && this.strCardNumber.length < 4 || this.strCardNumber.length >4 ){
      this.toastr.error('Enter 4 Digits for Credit Card', 'Error');
      return false;

    }
    else if(this.fopSelected==7 && this.strPaytmRefereNumber == ''){
      this.toastr.error('Enter Reference Number', 'Error!');
      return false;
    }
    else if(this.fopSelected==8 && this.strPaytmRefereNumber == ''){
      this.toastr.error('Enter Reference Number', 'Error!');
      return false;
    }
    else if(this.fopSelected==9 && this.strPaytmRefereNumber == ''){
      this.toastr.error('Enter Reference Number', 'Error!');
      return false;
    }
    else if((this.fopSelected==2 || this.fopSelected == 3) && this.strPaytmRefereNumber == ''){
      this.toastr.error('Enter Reference Number', 'Error!');
      return false;
    }

    else if ((this.fopSelected == 2 || this.fopSelected == 3) && this.intBankId == null) {
      this.toastr.error('Select Bank', 'Error!');
      return false;
    }
   
    else if(!this.intAmount){
      this.amountId.nativeElement.focus();
      this.toastr.error('Enter Amount', 'Error!');
      return false;
    }


    else if(Math.floor(this.intAmount)!=Math.floor(this.strGDPAdv)){
      this.amountId.nativeElement.focus();
      this.toastr.error('Advance paid and Amount are not equal', 'Error!');
      return false;
    }
    else if(!this.datIssue){
      this.issueDate.nativeElement.focus();
      this.toastr.error('Select Date Issue', 'Error!');
      return false;
    }
  // }
//receipt end

    // else{
      console.log("jjhjhghghghghjh");

        let pusheditems={};
        pusheditems['int_item_code'] = item_code;
        //receipt
        pusheditems['partial_id'] = partial_id;
        pusheditems['int_adv_amount'] = this.strGDPAdv;

        pusheditems['intFop'] = this.fopSelected;
        // pusheditems['datIssue'] = this.datIssue;
        pusheditems['amount'] = this.intAmount;
        pusheditems['intPaymentStatus'] = this.intPaymentStatus;

        if(this.fopSelected == 7 || this.fopSelected == 8 || this.fopSelected == 9 || this.fopSelected == 2 || this.fopSelected == 3){
          pusheditems['vchrReferenceNumber'] = this.strPaytmRefereNumber;
        }
        if(this.fopSelected == 2 || this.fopSelected == 3){
          pusheditems['vchrCardNUmber'] = this.strCardNumber;
          pusheditems['intBankId'] = this.intBankId;
        }
      
        //receipt


      this.serviceObject.postData("invoice/gdp_normal/", pusheditems).subscribe(response => {
        if (response.status == 1) {
          Swal.fire({
            title: 'Sucess',
            type: 'success',
            text: 'Followup successfully!',
            confirmButtonText: 'OK'
          });
    localStorage.setItem('previousUrl','invoice/servicelist');
          
          this.router.navigate(['invoice/servicelist'])
        }
      
      });
    }

  }
  RejectGDPFollowup(){
    this.intGDPFlag = -1;
    this.strGDPService = '';
  }
  changeFollowUp(id, service, changeStatus, item) {

    if (changeStatus === 0) {
      this.intFollowUpFlag = id;
      this.strFollowUpService = service;
    } else {
      this.intFollowUpFlag = -1;
      this.strFollowUpService = '';
    }

    this.datFollowup = new Date(item['dat_exp_delivery'])
    this.intEstAmt = item['dbl_est_amt'];
    this.strRemarks = item['vchr_remarks'];
    this.intAdvanceAmt = item['dbl_advc_paid'];
    this.intDiscount = item['dbl_discount'];

    this.strFollowUpStatus = "";
    // this.intAdvanceAmt = 0;
    this.fopSelected=null;
    this.strCardNumber = '';
    this.strPaytmRefereNumber='';
    this.intAmount=null;
    // this.datIssue=null;
    this.intBankId == null

  }                        

  changeGDP(id, service, changeStatus, item) {

    if (changeStatus === 0) {
      this.intGDPFlag = id;
      this.strGDPService = service;
    } else {
      this.intGDPFlag = -1;
      this.strGDPService = '';
    }

    this.datFollowup = new Date(item['dat_exp_delivery'])

    this.strFollowUpStatus = "";
    // this.intAdvanceAmt = 0;
    this.fopSelected=null;
    this.strCardNumber = '';
    this.strPaytmRefereNumber='';
    this.intAmount=null;
    // this.datIssue=null;


  }

  RejectFollowup(){

    this.intFollowUpFlag = -1
    this.strFollowUpService = ''

  }

  Preview1(files, event) {
    if (files.length === 0)
      return;
    this.image1 = files
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    const img_files = event.target.files;
    const file = img_files[0];
    this.image1 = file;

    if (this.image1) {

      const img_up = new Image;
      let img_ratio_up = 0;
      img_up.onload = () => {
        const width_up = img_up.width;
        const height_up = img_up.height;

        img_ratio_up = width_up / height_up;
        img_ratio_up = Math.floor(img_ratio_up * 10) / 10;

        if (img_ratio_up >= 1 && img_ratio_up <= 10) {

          // for preview
          var reader = new FileReader();
          this.imagePath1 = files;
          reader.readAsDataURL(files[0]);
          reader.onload = () => {
            this.imgURL1 = reader.result;
          }
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.image1 = file
            this.form.get('img1').setValue(file);
            
           
          }

        } else {
          $('.error1').fadeIn(400).delay(3000).fadeOut(400);
          this.file1.nativeElement.value = null;
          Swal.fire("Error", 'Print Logo ratio must be 4:1', "error");
          this.file1.nativeElement.value = "";
          this.imgURL1 = null
          this.form.get('img1').setValue('')
        }
      };
      img_up.src = window.URL.createObjectURL(this.image1);
      // return status
    }

  }
  Preview2(files, event) {
    if (files.length === 0)
      return;
    this.image2 = files
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    const img_files = event.target.files;
    const file = img_files[0];
    this.image2 = file;

    if (this.image2) {

      const img_up = new Image;
      let img_ratio_up = 0;
      img_up.onload = () => {
        const width_up = img_up.width;
        const height_up = img_up.height;

        img_ratio_up = width_up / height_up;
        img_ratio_up = Math.floor(img_ratio_up * 10) / 10;

        if (img_ratio_up >= 1 && img_ratio_up <= 10) {

          // for preview
          var reader = new FileReader();
          this.imagePath2 = files;
          reader.readAsDataURL(files[0]);
          reader.onload = () => {
            this.imgURL2 = reader.result;
          }
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.image2 = file
            this.form.get('img2').setValue(file);
            
           
          }

        } else {
          $('.error1').fadeIn(400).delay(3000).fadeOut(400);
          this.file2.nativeElement.value = null;
          Swal.fire("Error", 'Print Logo ratio must be 4:1', "error");
          this.file2.nativeElement.value = "";
          this.imgURL2 = null
          this.form.get('img2').setValue('')
        }
      };
      img_up.src = window.URL.createObjectURL(this.image2);
      // return status
    }

  }
  Preview3(files, event) {
    if (files.length === 0)
      return;
    this.image3 = files
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    const img_files = event.target.files;
    const file = img_files[0];
    this.image3 = file;

    if (this.image3) {

      const img_up = new Image;
      let img_ratio_up = 0;
      img_up.onload = () => {
        const width_up = img_up.width;
        const height_up = img_up.height;

        img_ratio_up = width_up / height_up;
        img_ratio_up = Math.floor(img_ratio_up * 10) / 10;

        if (img_ratio_up >= 1 && img_ratio_up <= 10) {

          // for preview
          var reader = new FileReader();
          this.imagePath3 = files;
          reader.readAsDataURL(files[0]);
          reader.onload = () => {
            this.imgURL3 = reader.result;
          }
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.image3 = file
            this.form.get('img3').setValue(file);
            
           
          }

        } else {
          $('.error1').fadeIn(400).delay(3000).fadeOut(400);
          this.file3.nativeElement.value = null;
          Swal.fire("Error", 'Print Logo ratio must be 4:1', "error");
          this.file3.nativeElement.value = "";
          this.imgURL3 = null
          this.form.get('img3').setValue('')
        }
      };
      img_up.src = window.URL.createObjectURL(this.image3);
      // return status
    }

  }
  Preview4(files, event) {
    if (files.length === 0)
      return;
    this.image4 = files
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    const img_files = event.target.files;
    const file = img_files[0];
    this.image4 = file;

    if (this.image4) {

      const img_up = new Image;
      let img_ratio_up = 0;
      img_up.onload = () => {
        const width_up = img_up.width;
        const height_up = img_up.height;

        img_ratio_up = width_up / height_up;
        img_ratio_up = Math.floor(img_ratio_up * 10) / 10;

        if (img_ratio_up >= 1 && img_ratio_up <= 10) {

          // for preview
          var reader = new FileReader();
          this.imagePath4 = files;
          reader.readAsDataURL(files[0]);
          reader.onload = () => {
            this.imgURL4 = reader.result;
          }
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.image4 = file
            this.form.get('img4').setValue(file);
            
           
          }

        } else {
          $('.error1').fadeIn(400).delay(3000).fadeOut(400);
          this.file4.nativeElement.value = null;
          Swal.fire("Error", 'Print Logo ratio must be 4:1', "error");
          this.file4.nativeElement.value = "";
          this.imgURL4 = null
          this.form.get('img4').setValue('')
        }
      };
      img_up.src = window.URL.createObjectURL(this.image4);
      // return status
    }

  }

  Preview5(files, event) {
    if (files.length === 0)
      return;
    this.image5 = files
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    const img_files = event.target.files;
    const file = img_files[0];
    this.image5 = file;

    if (this.image5) {

      const img_up = new Image;
      let img_ratio_up = 0;
      img_up.onload = () => {
        const width_up = img_up.width;
        const height_up = img_up.height;

        img_ratio_up = width_up / height_up;
        img_ratio_up = Math.floor(img_ratio_up * 10) / 10;

        if (img_ratio_up >= 1 && img_ratio_up <= 10) {

          // for preview
          var reader = new FileReader();
          this.imagePath5 = files;
          reader.readAsDataURL(files[0]);
          reader.onload = () => {
            this.imgURL5 = reader.result;
          }
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.image5 = file
            this.form.get('img5').setValue(file);
            
           
          }

        } else {
          $('.error1').fadeIn(400).delay(3000).fadeOut(400);
          this.file5.nativeElement.value = null;
          Swal.fire("Error", 'Print Logo ratio must be 4:1', "error");
          this.file5.nativeElement.value = "";
          this.imgURL5 = null
          this.form.get('img5').setValue('')
        }
      };
      img_up.src = window.URL.createObjectURL(this.image5);
      // return status
    }

  }
  Preview6(files, event) {
    if (files.length === 0)
      return;
    this.image6 = files
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    const img_files = event.target.files;
    const file = img_files[0];
    this.image6 = file;

    if (this.image6) {

      const img_up = new Image;
      let img_ratio_up = 0;
      img_up.onload = () => {
        const width_up = img_up.width;
        const height_up = img_up.height;

        img_ratio_up = width_up / height_up;
        img_ratio_up = Math.floor(img_ratio_up * 10) / 10;

        if (img_ratio_up >= 1 && img_ratio_up <= 10) {

          // for preview
          var reader = new FileReader();
          this.imagePath6 = files;
          reader.readAsDataURL(files[0]);
          reader.onload = () => {
            this.imgURL6 = reader.result;
          }
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.image6= file
            this.form.get('img6').setValue(file);
            
           
          }

        } else {
          $('.error1').fadeIn(400).delay(3000).fadeOut(400);
          this.file6.nativeElement.value = null;
          Swal.fire("Error", 'Print Logo ratio must be 4:1', "error");
          this.file6.nativeElement.value = "";
          this.imgURL6 = null
          this.form.get('img6').setValue('')
        }
      };
      img_up.src = window.URL.createObjectURL(this.image6);
      // return status
    }

  }
  uploadDocument(itemImei,itemCode){
    if(!this.form.get('img1').value){
      this.toastr.error('GDOT Protection Certificate is required', 'Error!');
      this.file1.nativeElement.focus();
      return false;
    }
    else if(!this.form.get('img2').value){
      this.toastr.error('Police Intimation Letter', 'Error!');
      this.file2.nativeElement.focus();
      return false;
    }
    else if(!this.form.get('img3').value){
      this.toastr.error('NTC Certificate', 'Error!');
      this.file3.nativeElement.focus();
      return false;
    }
    else if(!this.form.get('img4').value){
      this.toastr.error('Notary Subgration Letter', 'Error!');
      this.file4.nativeElement.focus();
      return false;
    }
    else if(!this.form.get('img5').value){
      this.toastr.error('ID Proof', 'Error!');
      this.file5.nativeElement.focus();
      return false;
    }
    else if(!this.form.get('img6').value){
      this.toastr.error('Digital Signature', 'Error!');
      this.file6.nativeElement.focus();
      return false;
    }
    
    const form_data = new FormData;
    form_data.append('itemImei', itemImei);
    form_data.append('itemCode', itemCode);
    form_data.append('gdot_pro_cert', this.form.get('img1').value);
    form_data.append('police_int_letter', this.form.get('img2').value);
    form_data.append('ntc_cert', this.form.get('img3').value);
    form_data.append('not_sub_letter', this.form.get('img4').value);
    form_data.append('id_proof', this.form.get('img5').value);
    form_data.append('dig_signature', this.form.get('img6').value);

    this.serviceObject.postData("receipt/add_receipt_api/", form_data).subscribe(response => {
      if (response.status == 1) {
        Swal.fire({
          title: 'Sucess',
          type: 'success',
          text: 'Followup successfully!',
          confirmButtonText: 'OK'
        });
    localStorage.setItem('previousUrl','invoice/servicelist');
        
        this.router.navigate(['invoice/servicelist'])
      }
    
    });
   
  }
  saveNotService() {

    Swal.fire({  //Confirmation before save
      title: 'Save',
      text: "Are sure to sure want to continue ?" ,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes, Save it!",
    }).then(result => {
      if (result.value) {
        this.serviceObject.getData("invoice/service_advc_return/?id="+this.salesRowId).subscribe(response => {
          if (response.status == 1) {
            Swal.fire({
              title: 'Sucess',
              type: 'success',
              text: 'Followup successfully!',
              confirmButtonText: 'OK'
            });
            this.router.navigate(['invoice/servicelist'])
          }
        
        });
      };

});

  }
  changeStatus(){
    this.intDiscount=0
    // this.intAdvanceAmt=0
  }

 
  assignDelivery(content1) {
    this.selectedDeliveryStaff = ''
    this.lstDeliveryStaffs = [];
    this.showModalDeliveryStaff= this.modalService.open(content1, { centered: true, size: 'sm' });
  }
  deliveryStaffChanged(item){
    this.deliveryStaffId = item.id;
    this.deliveryStaffName = item.name;
    this.deliveryStaffUsername = item.username;

  }
  saveDeliveryStaffAssign(){
    if(this.selectedDeliveryStaff == ''){
      this.toastr.error('Select valid Staff', 'Error!');
      return false;
    }
    else if(this.selectedDeliveryStaff != this.deliveryStaffName){
      this.toastr.error('Select valid Staff', 'Error!');
      return false;
    }
    const postData= {}
    // const jobId = localStorage.getItem('jobid');
    
  
    postData['id'] = this.deliveryStaffId;
    // postData['jobId'] = jobId;
    postData['partialId'] = this.intPartialId;
    postData['username'] = this.deliveryStaffUsername;
    postData['name'] = this.deliveryStaffName;
  
    
    this.serviceObject
    .postData("invoice/service_add_assigned/",postData)
    .subscribe(
      response => {
        if (response.status === 1) {
          Swal.fire('Success', 'Delivery succesfully assigned', 'success')
       
          this.showModalDeliveryStaff.close();
    localStorage.setItem('previousUrl','invoice/servicelist');
          
          this.router.navigate(["invoice/servicelist"]);
        
        }
      },
      error => { }
    );
    

  }

  cancelDeliveryStaffAssign(){
    this.selectedDeliveryStaff = '';
    this.deliveryStaffName = '';
    this.showModalDeliveryStaff.close();
  }
  saveAlertService(){
    const postData = {};
    postData['job_id'] = this.dctMaster['int_enq_master_id'];
    postData['status'] = 'SERVICED';
    this.serviceObject
    .postData("invoice/service_center_followup/",postData)
    .subscribe(
      response => {
        if (response.status === 1) {
          Swal.fire('Success', 'Alert sent Successfully', 'success')
    localStorage.setItem('previousUrl','invoice/servicelist');
          
          this.router.navigate(["invoice/servicelist"]);
        
        }
      },
      error => { }
    );
  }
  saveService(){
    const postData = {};
    postData['job_id'] = this.dctMaster['int_enq_master_id'];
    postData['status'] = 'SERVICED & DELIVERED';
    this.serviceObject
    .postData("invoice/service_center_followup/",postData)
    .subscribe(
      response => {
        if (response.status === 1) {
          Swal.fire('Success', 'Successfully Delivered', 'success')
    localStorage.setItem('previousUrl','invoice/servicelist');
          
          this.router.navigate(["invoice/servicelist"]);
        
        }
      },
      error => { }
    );
  }

  fopchange(fop){

   
    
    this.intPaymentStatus = null;
    if(fop == 1 || fop ==2 || fop == 3 || fop ==7 || fop ==8) {
      this.intPaymentStatus = 0;
      if (fop == 2 || fop == 3) {

        this.lstBankNames = []
        this.serviceObject.getData('invoice/bank_typeahead/').subscribe(res => {

          this.lstBankNames = res['data'];
        });

      }
    }
    else{
      this.intPaymentStatus = 1;
    }
   
    
   }
   saveAlertGdpNormal(){
    const postData = {};
    postData['job_id'] = this.dctMaster['int_enq_master_id'];
    postData['bln_sent_mail'] = true;
    postData['status'] = 'SERVICED & ALERT SENT';
    
    this.serviceObject
    .postData("invoice/service_center_followup/",postData)
    .subscribe(
      response => {
        if (response.status === 1) {
          Swal.fire('Success', 'Successfully Send Mail To Customer', 'success')
    localStorage.setItem('previousUrl','invoice/servicelist');
          
          this.router.navigate(["invoice/servicelist"]);
        
        }
      },
      error => { }
    );
  }
}
