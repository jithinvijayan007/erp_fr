import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ServerService } from '../../server.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gdp-serviceview',
  templateUrl: './gdp-serviceview.component.html',
  styleUrls: ['./gdp-serviceview.component.css']
})
export class GdpServiceviewComponent implements OnInit {

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

  dctData = {}

  objectKeys = Object.keys


  dctEnquiryDetails= {}
  dctMaster = {}

  enqKeys = []

  salesRowId;
  theftId;
  
  form: FormGroup;
  message;

  image1;
  image2;
  image3;
  image4;
  image5;
  image6;

  imgPath= '';
  showModal = false

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
// receipt data
  fopSelected;
  intPaymentStatus;
  lstBankNames;
  strCardNumber;
  strPaytmRefereNumber;
  intBankId;
  intAmount=0;
  datIssue = new Date();;
  remarks;
  intReceiptType=8;

  constructor(
    private serviceObject: ServerService,
     public router: Router,
     private formBuilder: FormBuilder,
     private toastr: ToastrService,
  ) { }

  ngOnInit() {

    this.salesRowId = localStorage.getItem('salesRowId');
    
    this.nodeURL = this.serviceObject['url']

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
    for (const key in this.dctEnquiryDetails) {
      if (this.dctEnquiryDetails.hasOwnProperty(key)) {
        this.dctEnquiryDetails[key].forEach(element => {
          this.intAmount +=element['int_depreciation_amt']
        });
      }
    }
    
    this.enqKeys = Object.keys(this.dctEnquiryDetails)
    this.theftId = res['dct_enquiry_details'][this.enqKeys[0]][0]['theft_id'];
    }
  });
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
    form_data.append('theftId', this.theftId);
    form_data.append('gdot_pro_cert', this.form.get('img1').value);
    form_data.append('police_int_letter', this.form.get('img2').value);
    form_data.append('ntc_cert', this.form.get('img3').value);
    form_data.append('not_sub_letter', this.form.get('img4').value);
    form_data.append('id_proof', this.form.get('img5').value);
    form_data.append('dig_signature', this.form.get('img6').value);
    form_data.append('partialId',this.dctMaster['partial_id']);
 

    this.serviceObject.postData("invoice/theft_followup/", form_data).subscribe(response => {
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

  imagePopUp(key)
  {
    this.imgPath = key; 
    this.showModal = true;
    // document.getElementsByClassName("modal")[0].style.WebkitFilter = 'blur(4px)';
    document.getElementsByClassName("blur")[0]['style'].filter= 'blur(4px)';
    
   
  }
  hideModal()
  {

    this.showModal = false;
    document.getElementsByClassName("blur")[0]['style'].filter= '';
   
  }
  ClickedOut(event){
    if(event.target.className === "modal") {
      this.showModal = false;
      document.getElementsByClassName("blur")[0]['style'].filter= '';
    } 
  }
  paidDepreciationAmount(item){
    if(!this.fopSelected){
      this.toastr.error('Select valid FOP', 'Error!');
      return false;
    }   
    else if((this.fopSelected==2 || this.fopSelected == 3) && (this.strCardNumber == null || (this.strCardNumber.toString().length < 4 ) || (this.strCardNumber.toString().length > 4 ) )){
      this.toastr.error('Enter 4 Digits Card Number ', 'Error!');
      return false;
    }
    else if((this.fopSelected==2 || this.fopSelected == 3) && (this.strPaytmRefereNumber == '' || this.strPaytmRefereNumber == null)){
      this.toastr.error('Enter Reference Number', 'Error!');
      return false;
    }
    else if(this.fopSelected==7 && (this.strPaytmRefereNumber == '' || this.strPaytmRefereNumber == null) ){
      this.toastr.error('Enter Reference Number', 'Error!');
      return false;
    }
    else if(this.fopSelected==8 && (this.strPaytmRefereNumber == '' || this.strPaytmRefereNumber == null)){
      this.toastr.error('Enter Reference Number', 'Error!');
      return false;
    }
    else if(this.fopSelected==9 && (this.strPaytmRefereNumber == '' || this.strPaytmRefereNumber == null)){
      this.toastr.error('Enter Reference Number', 'Error!');
      return false;
    }
    else if ((this.fopSelected == 2 || this.fopSelected == 3) && this.intBankId == null){
      this.toastr.error('Select Bank', 'Error!');
      return false;
    }
    
    else if ((this.fopSelected == 4) && (this.strPaytmRefereNumber == '' || this.strPaytmRefereNumber == null)){
      this.toastr.error('Enter Cheque Number', 'Error!');
      return false;
    }else  if(!this.remarks || this.remarks == ''){
      this.toastr.error('Enter remarks', 'Error!');
      return false;
    } 
    const dctData = {};
        dctData['customerPhone'] = this.dctMaster['int_cust_mob'];
        dctData['intFop'] = this.fopSelected;
        dctData['datIssue'] = this.datIssue;
        dctData['amount'] = this.intAmount;
        dctData['remarks'] = this.remarks;
        dctData['intReceiptType'] = this.intReceiptType;
        dctData['intPaymentStatus'] = this.intPaymentStatus;
        dctData['intBankId'] = this.intBankId;
  
        if(this.fopSelected == 7 || this.fopSelected == 8 || this.fopSelected == 9 || this.fopSelected == 2 || this.fopSelected == 3){
          dctData['vchrReferenceNumber'] = this.strPaytmRefereNumber;
        }
        if(this.fopSelected == 2 || this.fopSelected == 3){
          dctData['vchrCardNUmber'] = this.strCardNumber;
        }
        if(this.fopSelected == 4){
          dctData['vchrReferenceNumber'] = this.strPaytmRefereNumber;
        }
    
    dctData['job_id'] = this.dctMaster['int_enq_master_id'];
    dctData['status'] = 'MISSING & PAID';
    
    this.serviceObject.postData("invoice/service_center_followup/", dctData).subscribe(response => {
      if (response.status == 1) {
        Swal.fire({
          title: 'Sucess',
          type: 'success',
          text: 'Depreciation amount paid successfully!',
          confirmButtonText: 'OK'
        });
        localStorage.setItem('previousUrl','invoice/servicelist');
        
        this.router.navigate(['invoice/servicelist'])
      }
    
    });
  }
fopchange(fop){
  this.intPaymentStatus = null;
  if(fop == 1 || fop ==2 || fop == 3 || fop ==7 || fop ==8 || fop ==9) {
    this.intPaymentStatus = 0;
    if (fop == 2 || fop == 3)
    {
      
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
}
