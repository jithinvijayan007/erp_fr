import {NgbModal,ModalDismissReasons,NgbActiveModal,} from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit,ElementRef ,ViewChildren, HostListener, Input} from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FullComponent } from 'src/app/layouts/full/full.component';

import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ChangeDetectionStrategy } from '@angular/core';
import { element } from 'protractor';
import Swal from 'sweetalert2';
import { json } from 'd3';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  constructor(private modalService: NgbModal,private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private fullObject: FullComponent,
    private spinner: NgxSpinnerService,
  ){}
  selectedCustomer;
  lstCustomer = [];
  selectedCustomerPhno = '';
  strCustomerName=''
  selectedCustomerId = '';
  branchCode=localStorage.BranchCode
  dataSource;
  data=[]
  displayedColumns = ['date', 'details','action'];
  blnShowData=false
  showModalDetails

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

  strReceiptType ='';
  intReceiptType = null;
  intNumber = null;
  ngOnInit() {
    let  tempData;
    if( localStorage.getItem('previousUrl') == 'customer/historys'){
    tempData = JSON.parse(localStorage.getItem('customerHistoryData'))
    this.selectedCustomerId=tempData['selectedCustomerId'];
    this.selectedCustomerPhno=tempData['selectedCustomerPhno'];
    this.strCustomerName=tempData['strCustomerName'];
    this.selectedCustomer = this.strCustomerName;
    localStorage.setItem('previousUrl','customer/history')
    }
    else{
      localStorage.removeItem('customerHistoryData')
    }

      this.getDetails();
    

  }
  

  customerChanged(event) {
    if (event === undefined || event === null) {
    this.lstCustomer = [];
    } else {
    if (event.length >= 7) {
      this.serviceObject
        .postData('salesreturn/get_details_customer/', {str_search: event})
        .subscribe(
          (response) => {
            this.lstCustomer = response['customer_list'];
            localStorage.setItem('previousUrl','customer/history')
          }
        );
    }
    }
  }
  CustomerClicked(item) {
    this.selectedCustomerId = item.pk_bint_id;
    this.selectedCustomerPhno = item.int_mobile;
    this.strCustomerName = item.vchr_name;
  
    }
    getDetails(){
      // if( localStorage.getItem('previousUrl') == 'customer/historys'){
      // this.selectedCustomerId=localStorage.getItem('selectedCustomerId');
      // this.selectedCustomerPhno=localStorage.getItem('selectedCustomerPhno');
      // this.strCustomerName=localStorage.getItem('strCustomerName');
      // }
      if(this.strCustomerName == ''){
          return false;
      }

      else if(this.selectedCustomerId === '' || this.selectedCustomer!= this.strCustomerName){
         this.toastr.error('Valid customer is required ');
      }
      else{
        
        this.serviceObject
        .postData('customer/customer_details/', {id: this.selectedCustomerId })
            .subscribe(
              (response) => {
                if(response.status==1){
                  this.data=response['lst_data']
                  if(this.data.length>0){
                    this.blnShowData=true
                    this.dataSource=this.data
                  }
                  else{
                    this.blnShowData=false
                  }
                }
                else{
                 
                }
              }
            );
      // }
    
    }
}
openView(element,item,index){
  console.log('a',item,"",element)
  let data;
   data = {selectedCustomerId: this.selectedCustomerId,selectedCustomerPhno:this.selectedCustomerPhno, strCustomerName:this.strCustomerName}
  localStorage.setItem('customerHistoryData', JSON.stringify(data))

  if(element.bln_receipt_view==true){
    localStorage.setItem('receiptId',element.lst_receipt_id[index]);
    localStorage.setItem('invoiceReceipt',item)
    localStorage.setItem('previousUrl','customer/historys');
    // localStorage.setItem('selectedCustomerId',this.selectedCustomerId)
    // localStorage.setItem('selectedCustomerPhno',this.selectedCustomerPhno)
    // localStorage.setItem('strCustomerName',this.strCustomerName)
    this.router.navigate(['receipt/viewreceipt']);

  }
  if(element.bln_invoice_view==true){
    localStorage.setItem('intId',element.lst_sales_id[index]);
    // localStorage.setItem('blnReturn',event.data.blnReturn);
    // localStorage.setItem('blnJioInvoice',event.data.blnJioInvoice);
    localStorage.setItem('previousUrl','customer/historys');
    // localStorage.setItem('selectedCustomerId',this.selectedCustomerId)
    // localStorage.setItem('selectedCustomerPhno',this.selectedCustomerPhno)
    // localStorage.setItem('strCustomerName',this.strCustomerName)
    this.router.navigate(['invoice/invoicedetails']);
  }
  if(element.bln_return_view==true){
    localStorage.setItem('intId',element.lst_return_id[index]);
    // localStorage.setItem('blnReturn',event.data.blnReturn);
    // localStorage.setItem('blnJioInvoice',event.data.blnJioInvoice);
    localStorage.setItem('previousUrl','customer/historys');
    // localStorage.setItem('selectedCustomerId',this.selectedCustomerId)
    // localStorage.setItem('selectedCustomerPhno',this.selectedCustomerPhno)
    // localStorage.setItem('strCustomerName',this.strCustomerName)
    this.router.navigate(['invoice/invoicedetails']);
  }
  
  
}
clickView(content,receiptId) {
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
          // this.blnHo = response['data'][0]['bln_ho'];
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

  this.showModalDetails= this.modalService.open(content, { centered: true, size: 'sm' });
}

}