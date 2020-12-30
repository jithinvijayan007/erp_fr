import { Component, OnInit , ViewChild} from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as moment from 'moment' ;





@Component({
  selector: 'app-addreceipt',
  templateUrl: './addreceipt.component.html',
  styleUrls: ['./addreceipt.component.css']
})
export class AddreceiptComponent implements OnInit {
  searchProduct: FormControl = new FormControl();
  searchCustomer: FormControl = new FormControl();
  searchItemCategory: FormControl = new FormControl();

  selectedProduct;
  lstProduct = []
  IntProductId;
  strProduct;
  custName = ''

  lstCustomer = []
  IntCustomerId;
  strCustomer;
  selectedCustomer;
  strItemCategory;
  strSelectedItemCategory;
  lst_item_category = [];
  intItemCategoryId =null;
  strCardNumber = null;

  strReturnType = '1';
  fopSelected;
  intReceiptType=null;

  remarks = '';

  datIssue;
  intAmount;
  intPaymentStatus = null;

  blnEdit = false;
  editId = localStorage.getItem('editReceiptId')
  bln_AdvanceReceipt = localStorage.getItem('advanceReceiptPayment')
  strReceiptNumber= '';

  strPaytmRefereNumber='';
  strGroup = localStorage.getItem('group_name')
  lstBankNames = []
  intBankId

  strChequeNumber = '';
  saveDisable=false

  @ViewChild('customerId', { static: true }) customerId: any;
  @ViewChild('amountId', { static: true }) amountId: any;
  @ViewChild('issueDate') issueDate: any;
  @ViewChild('idName', { static: true }) idName: any;
  @ViewChild('idItemCategory') idItemCategory: any;
  @ViewChild('paytmRefId') paytmRefId: any;
  blnService: any;
  intDocumentId: any;
  blnCustAddDisabled = true;

  constructor(private serviceObject: ServerService,
    private toastr: ToastrService,
    public router: Router,

    ) { }

  ngOnInit() {
    this.saveDisable=false
    if (localStorage.getItem('receiptRequestData')) {
      localStorage.setItem('receiptCustomerNumberStatus', '1');
    }
    if (localStorage.getItem('enquiryReceiptRequestData')) {
      localStorage.setItem('enquiryCustomerReceiptStatus', '1');
    }
    this.datIssue = new Date()

    if (this.editId) {
      this.blnEdit = true;
      this.getDataById();
    }
    this.fopSelected = null;
 
    this.searchCustomer.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCustomer = [];
      } else {
        if (strData.length >= 7 && strData.length<14) {
          this.serviceObject
            .postData('customer/customerTypeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstCustomer = response['data'];
                if(this.lstCustomer.length==0 && strData.length >= 6)
                {
                  
                  this.blnCustAddDisabled = false;
                }
                else{
                  this.blnCustAddDisabled = true;
                }
              }
            );

        }
      }
    }
    );
  
    
    this.searchProduct.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstProduct = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('products/product_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstProduct = response['data'];
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
  itemcategoryChanged(item){
    this.intItemCategoryId = item.id;
    this.strItemCategory = item.code_name;

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
    else if(this.intReceiptType ==2 && !this.blnService &&(this.selectedProduct != this.strProduct || !this.selectedProduct) ){
      this.toastr.error('Select Product', 'Error!');
      return false;
    }
    else if(this.intReceiptType ==2 && !this.blnService  && (this.strItemCategory != this.strSelectedItemCategory || !this.strSelectedItemCategory)){
      this.toastr.error('Select Item', 'Error!');
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
    else if(!this.intAmount || this.intAmount=='' ){
      this.amountId.nativeElement.focus();
      this.toastr.error('Enter Amount', 'Error!');
      return false;
    }
    else if(this.intAmount < 0 ){
      this.amountId.nativeElement.focus();
      this.toastr.error('Enter Valid Amount', 'Error!');
      return false;
    }
    else if(this.intAmount > 200000 && this.fopSelected==1){
      this.amountId.nativeElement.focus();
      this.toastr.error('Amount should be less than 2 lakh', 'Error!');
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
      if(this.intItemCategoryId){
        // dctData['fk_product'] = this.IntProductId;
        dctData['fk_item'] = this.intItemCategoryId;
      }
      dctData['customerId'] = this.IntCustomerId;
      dctData['intFop'] = this.fopSelected;
      dctData['datIssue'] = this.datIssue;
      dctData['amount'] = this.intAmount;
      dctData['remarks'] = this.remarks;
      dctData['intReceiptType'] = this.intReceiptType;
      dctData['intPaymentStatus'] = this.intPaymentStatus;
      dctData['intBankId'] = this.intBankId;
      dctData['partialId'] = this.intDocumentId;
      dctData['blnService'] = this.blnService;

      dctData['vchrReceiptNum'] = this.strReceiptNumber;
      if(this.fopSelected == 7 || this.fopSelected == 8 || this.fopSelected == 9 || this.fopSelected == 2 || this.fopSelected == 3){
        dctData['vchrReferenceNumber'] = this.strPaytmRefereNumber;
      }
      if(this.fopSelected == 2 || this.fopSelected == 3){
        dctData['vchrCardNUmber'] = this.strCardNumber;
      }
      if(this.fopSelected == 4){
        dctData['vchrReferenceNumber'] = this.strPaytmRefereNumber;
      }
    

      if (!this.blnEdit) {
        this.saveDisable=true
        this.serviceObject.postData('receipt/add/', dctData).subscribe(
          (response) => {
              if (response.status == 1) {
                swal.fire({
                  position: "center", 
                  type: "success",
                  text: "Data saved successfully",
                  showConfirmButton: true,  
                });    
                this.saveDisable=true;
                  
 
            
                  localStorage.setItem('previousUrl','receipt/listreceipt');
                this.router.navigate(['receipt/listreceipt']);
                  
              }  
              else {
                swal.fire('Error!', response['data'], 'error');
                this.saveDisable=false;
    
              }
          },
          (error) => {   
           swal.fire('Error!','Something went wrong!!', 'error');
           this.saveDisable=false;
           
            
          });
      }else{
        dctData['receiptId'] = this.editId;
        this.saveDisable=true;
        
        if (this.bln_AdvanceReceipt=='true'){
          this.serviceObject.postData('receipt/add/', dctData).subscribe(
            (response) => {
                if (response.status == 1) {
                  swal.fire({
                    position: "center", 
                    type: "success",
                    text: "Data saved successfully",
                    showConfirmButton: true,  
                  });
                this.saveDisable=true;
                  
                  if (this.bln_AdvanceReceipt=='true'){
                    localStorage.setItem('advanceReceiptPayment',String(false));
                    this.router.navigate(['receipt/listreceipt']);
                    
                      }
                      else{
                      localStorage.setItem('previousUrl','receipt/receiptactions');
                    this.router.navigate(['receipt/listreceipt']);
                      }      
      
                }  
                else {
                  swal.fire('Error!', response['data'], 'error');
                  this.saveDisable=false;
                  
                }
            },
            (error) => {   
             swal.fire('Error!','Something went wrong!!', 'error');
             this.saveDisable=false;
            
            });}
        
        else{
     
        
          this.saveDisable=true;
        
        this.serviceObject.putData('receipt/add/', dctData).subscribe(
          (response) => {
              if (response.status == 1) {
                swal.fire({
                  position: "center", 
                  type: "success",
                  text: "Data saved successfully",
                  showConfirmButton: true,  
                });      
  localStorage.setItem('previousUrl','receipt/receiptactions');
                
                this.router.navigate(['receipt/listreceipt/']);
    
              }  
              else {
                swal.fire('Error!', response['data'], 'error');
                this.saveDisable=false;
                
              }
          },
          (error) => {   
           swal.fire('Error!','Something went wrong!!', 'error');
           this.saveDisable=false;
          
          });}
      }
      
    }
  }


  clearFields(){
  // localStorage.setItem('previousUrl','receipt/listreceipt');
    
    this.router.navigate(['receipt/listreceipt']);
  }

  getDataById(){
    let url
    if (this.bln_AdvanceReceipt=='true'){
      url='receipt/receipt_order_list/?receiptId='
      localStorage.setItem('previousUrl','receipt/receipt-order-list');
    }
    else{
      url='receipt/add/?receiptId='
    }
    localStorage.setItem('editReceiptId','');
    this.serviceObject.getData(url+this.editId).subscribe(
      (response) => {
          if (response.status == 1) {
          this.IntCustomerId = response['data'][0]['fk_customer_id'];
          this.strCustomer = response['data'][0]['fk_customer_id__vchr_name'];
          this.selectedCustomer = response['data'][0]['fk_customer_id__vchr_name'];
          this.fopSelected = response['data'][0]['int_fop'];          
          this.datIssue = response['data'][0]['dat_issue_edit'];
          this.intAmount = response['data'][0]['dbl_amount'];
          this.remarks = response['data'][0]['vchr_remarks'];
          this.intDocumentId = response['data'][0]['int_document_id'];
          this.blnService = response['data'][0]['bln_service'];
          if (this.bln_AdvanceReceipt=='true'){
            this.intReceiptType = 2;}

          else{
          this.intReceiptType = response['data'][0]['int_receipt_type'];}
          this.IntProductId = response['data'][0]['fk_item_id__fk_product_id'];
          this.strProduct = response['data'][0]['fk_item_id__fk_product_id__vchr_name'];
          this.selectedProduct = response['data'][0]['fk_item_id__fk_product_id__vchr_name'];
          this.intItemCategoryId = response['data'][0]['fk_item_id'];
          this.strItemCategory = response['data'][0]['fk_item__vchr_name'];
          this.strSelectedItemCategory = response['data'][0]['fk_item__vchr_name'];
          this.intPaymentStatus = response['data'][0]['int_pstatus'];
          this.strReceiptNumber = response['data'][0]['vchr_receipt_num'];
          this.strPaytmRefereNumber = response['data'][0]['vchr_transaction_id'];
          // this.strChequeNumber = response['data'][0]['vchr_cheque_number'];
         
            
          }  
          else if (response.status == 0) {
           swal.fire('Error!',response['data'], 'error');
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }
  ChangeAddreceipt(){
    localStorage.setItem('editReceiptId','');
    this.blnEdit = false;
    this.IntCustomerId= null;
    this.fopSelected=null;
    this.datIssue='';
    this.intAmount=null
    this.remarks='';
    this.intReceiptType=null;
    this.intPaymentStatus=null;
    this.strReceiptNumber='';
    this.intItemCategoryId = null;
    this.strCustomer ='';
    this.selectedCustomer = '';
    this.IntProductId = null;
  }
  ProductChanged(item) {

    this.IntProductId = item.id;
    this.strProduct = item.name;
  }
  itemTypeahead(){
// this.searchItemCategory.valueChanges
// .debounceTime(400)
// .subscribe((strData: string) => {
  
  if (this.strSelectedItemCategory === undefined || this.strSelectedItemCategory === null) {
    this.lst_item_category = [];
  } else {
    if(this.strSelectedItemCategory.length >= 1 && !this.IntProductId){
      this.toastr.error('Select product', 'Error!');
        return false;
    }
    if (this.strSelectedItemCategory.length >= 3 && this.IntProductId) {
      this.serviceObject
        .postData('itemcategory/item_typeahead_product/', { strItem: this.strSelectedItemCategory,intProductId:this.IntProductId })
        .subscribe(
          (response) => {
            this.lst_item_category = response['data'];

          }
        );
    }
  }
// }
// );
  }
  opencustomeredit(){
    this.router.navigate(['invoice/salesreturnview'],{ queryParams: { page: "receipt/addreceipt",ph:this.selectedCustomer } });
  }
}


