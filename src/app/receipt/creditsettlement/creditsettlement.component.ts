import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
@Component({
  selector: 'app-creditsettlement',
  templateUrl: './creditsettlement.component.html',
  styleUrls: ['./creditsettlement.component.css']
})
export class CreditsettlementComponent implements OnInit {
  searchCustomer: FormControl = new FormControl();
  lstCustomer=[];
  selectedCustomer;
  IntCustomerId;
  strCustomer;
  intReceiptType=7;
  fopSelected;
  intPaymentStatus;
  lstBankNames;
  strCardNumber;
  strPaytmRefereNumber;
  intBankId;
  intAmount=0;
  datIssue;
  remarks;
  lstInvoice=[];
  intInvoiceAmount=0;
  intInvoiceId;
  strGroup;
  @ViewChild('customerId', { static: true }) customerId: any;
  @ViewChild('amountId', { static: true }) amountId: any;
  @ViewChild('issueDate') issueDate: any;
  @ViewChild('idName', { static: true }) idName: any;
  @ViewChild('idItemCategory') idItemCategory: any;
  @ViewChild('paytmRefId') paytmRefId: any;
  constructor(private serviceObject: ServerService,
    private toastr: ToastrService,
    public router: Router,) { }

  ngOnInit() {
    this.datIssue = new Date();
    this.searchCustomer.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCustomer = [];
      } else {
        if (strData.length >= 7) {
          this.serviceObject
            .postData('receipt/creditCustTypeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstCustomer = response['data'];
                
              }
            );

        }
      }
    }
    );
  }
  CustomerChanged(item) {

    this.IntCustomerId = item.id;
    this.strCustomer = item.name;
    if (this.lstCustomer[0]['lst_invoice']){
      this.lstCustomer[0]['lst_invoice'].forEach(element => {
        element['checked']= false;
      });
      this.lstInvoice = this.lstCustomer[0]['lst_invoice'];
      
      }
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
   AddReceipt(){
   
    if (!this.strCustomer || !this.IntCustomerId || this.selectedCustomer != this.strCustomer) {
      this.customerId.nativeElement.focus();
      this.toastr.error('Enter valid customer name', 'Error!');
      return false;
    }
    else if(!this.intReceiptType){
      this.toastr.error('Select valid Receipt Type', 'Error!');
      return false;
    }
    else if(!this.fopSelected){
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
    }
    else if(!this.intAmount || this.intAmount==0 ){
      this.amountId.nativeElement.focus();
      this.toastr.error('Enter Amount', 'Error!');
      return false;
    } else if(!this.intInvoiceId){
      this.toastr.error('Select one Invoice', 'Error!');
      return false;
    }
    else if(this.intAmount < 0){
      this.amountId.nativeElement.focus();
      this.toastr.error('Enter  Valid Amount', 'Error!');
      return false;
    }
    else if(!this.datIssue){
      this.issueDate.nativeElement.focus();
      this.toastr.error('Select Date Issue', 'Error!');
      return false;
    }
    else if(!this.remarks || this.remarks==''){
      this.idName.nativeElement.focus();
      this.toastr.error('Enter Remarks', 'Error!');
      return false;
    }
    
    else{
      
      let dctData = {}
      dctData['customerId'] = this.IntCustomerId;
      dctData['intFop'] = this.fopSelected;
      dctData['datIssue'] = this.datIssue;
      dctData['amount'] = this.intAmount;
      dctData['remarks'] = this.remarks;
      dctData['intReceiptType'] = this.intReceiptType;
      dctData['intPaymentStatus'] = this.intPaymentStatus;
      dctData['intBankId'] = this.intBankId;

      dctData['intInvoiceId'] = this.intInvoiceId;
      if(this.fopSelected == 7 || this.fopSelected == 8 || this.fopSelected == 9 || this.fopSelected == 2 || this.fopSelected == 3){
        dctData['vchrReferenceNumber'] = this.strPaytmRefereNumber;
      }
      if(this.fopSelected == 2 || this.fopSelected == 3){
        dctData['vchrCardNUmber'] = this.strCardNumber;
      }
      if(this.fopSelected == 4){
        dctData['vchrReferenceNumber'] = this.strPaytmRefereNumber;
      }
    

      
        
        this.serviceObject.postData('receipt/credit_settlement/', dctData).subscribe(
          (response) => {
              if (response.status == 1) {
                swal.fire({
                  position: "center", 
                  type: "success",
                  text: "Data saved successfully",
                  showConfirmButton: true,  
                });      
 
            
                  localStorage.setItem('previousUrl','receipt/listreceipt');
                this.router.navigate(['receipt/listreceipt']);
                  
              }  
              else {
                swal.fire('Error!', response['data'], 'error');
    
              }
          },
          (error) => {   
           swal.fire('Error!','Something went wrong!!', 'error');
            
          });
     
      
    }
  }
  invoiceSelected(item){
    this.intInvoiceAmount = item.credit_amount;
    this.intInvoiceId = item.invoice_id;
    this.lstInvoice.forEach(element => {
      if(element.invoice_id != item.invoice_id){
        element.checked = false;
      }
    });
  }
  amountValidate(){
    if(this.intInvoiceAmount == 0 || !this.intInvoiceId){
      this.toastr.error('Select one invoice', 'Error!');
      return;
    }
     if(this.intAmount < 0 || this.intAmount>this.intInvoiceAmount){
      this.amountId.nativeElement.focus();
      this.toastr.error('Enter  Valid Amount', 'Error!');
    }    
  }
}
