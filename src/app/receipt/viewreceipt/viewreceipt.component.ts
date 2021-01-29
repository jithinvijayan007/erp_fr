
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-viewreceipt',
  templateUrl: './viewreceipt.component.html',
  styleUrls: ['./viewreceipt.component.css']
})
export class ViewreceiptComponent implements OnInit {
  viewId = localStorage.getItem('receiptId');
  receipt = localStorage.getItem('invoiceReceipt');
  previousUrl = localStorage.getItem('previousUrl')
  blnHo=false;
  
  strTransactionId = null;
  datTransaction ;

  strCustomerName = '';
  strReceiptType ='';
  intReceiptType = null;
  intNumber = null;
  searchBank: FormControl = new FormControl();

  selectedProduct;
  lstProduct = []
  IntProductId;
  strProduct;

  selectedBank;
  lstBank = []
  IntBankId;
  strBank= '';

  strFop = '';
  intAmount =null;
  datIssue = '';
  strRemarks = '';
  strItem = '';
  intCustomerId =null;
  dataLoaded = false;
  intPaymentStatus = null;
  strReceiptNumber ='';
  strPaytmReferenceNum = '';
  strBankName = '';
  dateApprove = '';
  strCardNumber = null;

  @ViewChild('bankId') bankId: any;
  @ViewChild('transactionId') transactionId: any;
  @ViewChild('DateId') DateId: any;

  constructor(
    private serviceObject: ServerService,
    private toastr: ToastrService,
    public router: Router,
  ) { }

  ngOnInit() {
    if (localStorage.getItem('receiptRequestData')) {
      localStorage.setItem('receiptCustomerNumberStatus', '1');
    }
    this.getData(this.viewId)
    
    this.searchBank.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstBank = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('receipt/banktypeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstBank = response['data'];
              }
            );

        }
      }
    }
    );
 
  }

  bankChanged(item) {

    this.IntBankId = item.id;
    this.strBank = item.name;
  }
  getData(receiptId){
    this.serviceObject.getData('receipt/add/?receiptId='+receiptId).subscribe(
      (response) => {
          if (response.status == 1) {
            this.dataLoaded = true;
          this.intCustomerId = response['data'][0]['fk_customer_id'];
          // this.strCustomer = response['data'][0]['fk_customer_id__vchr_name'];
          this.strCustomerName = response['data'][0]['fk_customer_id__vchr_name'];
          this.intNumber = response['data'][0]['fk_customer_id__int_mobile'];

          this.strFop = response['data'][0]['vchr_fop'];          
          this.datIssue = response['data'][0]['dat_issue'];
          this.intAmount = response['data'][0]['dbl_amount'];
          this.strRemarks = response['data'][0]['vchr_remarks'];
          this.strReceiptType = response['data'][0]['vchr_receipt_type'];
          this.intReceiptType = response['data'][0]['int_receipt_type'];
          this.strItem = response['data'][0]['fk_item__vchr_name'];
          this.blnHo = response['data'][0]['bln_ho'];
          this.intPaymentStatus = response['data'][0]['int_pstatus'];
          this.strReceiptNumber = response['data'][0]['vchr_receipt_num'];
          if(response['data'][0]['vchr_transaction_id']){
            this.strPaytmReferenceNum = response['data'][0]['vchr_transaction_id']
          }
            if (response['data'][0]['fk_bank__vchr_name']){
            this.strBankName = response['data'][0]['fk_bank__vchr_name']
          }
          if(response['data'][0]['dat_approval']){
            this.dateApprove = response['data'][0]['dat_approval']
          }
          if(response['data'][0]['vchr_card_num']){
            this.strCardNumber = Number(response['data'][0]['vchr_card_num']);
          }


            
          }  
          else if (response.status == 0) {
           this.dataLoaded = false;
           swal.fire('Error!',response['data'], 'error');
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
        
      });

  }

  ApproveReceipt(){
     
    if (!this.strBank || !this.IntBankId || this.selectedBank != this.strBank) {
      this.bankId.nativeElement.focus();
      this.toastr.error('Enter valid bank name', 'Error!');
      return false;
    }
    else if(!this.strTransactionId){
      this.transactionId.nativeElement.focus();
      this.toastr.error('Enter Transaction Id', 'Error!');
      return false;
    }
    else if(!this.datTransaction){
      this.DateId.nativeElement.focus();
      this.toastr.error('Select Date', 'Error!');
      return false;

  }
  else{
    let dctData = {}
      dctData['intreceiptId'] = this.viewId;
      dctData['strBank'] = this.strBank;
      dctData['intBankId'] = this.IntBankId;
      
      dctData['strTransactionId'] = this.strTransactionId;
      dctData['dateTransaction']  = this.datTransaction;
      dctData['intPaymentStatus'] = 0;

      this.serviceObject.postData('receipt/approve/', dctData).subscribe(
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
  clearFields(){
    this.strBank = '';
    this.strTransactionId = '';
    this.datTransaction='';

  }

}
