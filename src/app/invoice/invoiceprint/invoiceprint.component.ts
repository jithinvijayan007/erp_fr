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


@Component({
  selector: 'app-invoiceprint',
  templateUrl: './invoiceprint.component.html',
  styleUrls: ['./invoiceprint.component.css']
})
export class InvoiceprintComponent implements OnInit {


  constructor(private modalService: NgbModal,private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private fullObject: FullComponent,
    private spinner: NgxSpinnerService,
  ){}


  ngOnInit() {
    this.previousPage = localStorage.getItem('previousUrl')

    if(this.branch_type == '2' ||this.branch_type == '3' || this.strGroup == 'ADMIN'){

      this.blnShowPrefix = false
      
     }


  }
  previousPage=''
  strImei = '';
  strInvoiceNo:'';
  datFrom = null;
  datTo = null;
  selectedCustomer;
  lstCustomer = [];
  selectedCustomerPhno = '';
  strCustomerName=''
  selectedCustomerId = '';
  lstItems = [];
  lstQty = [];
  showModal;
  dctId={};
  strInvoiceCode = 'I';
  strBranchCode = localStorage.getItem('BranchCode');
  
  blnData = false;
  dct={}
  strType = '1';
  lstcheck=[]
  dctDetail ={}
  Id;
  strGroup = localStorage.getItem('group_name')
  branch_type = localStorage.getItem('BranchType')
  blnShowPrefix = true;

  radioChange(){
    this.blnData = true;
    this.lstItems =[];
    this.lstQty = [];
    this.strImei=''
    this.strInvoiceNo =''
    this.datFrom=null
    this.datTo=null
    this.selectedCustomer=''
    this.selectedCustomer= ''
  }
  CustomerClicked(item) {
    this.selectedCustomerId = item.pk_bint_id;
    this.selectedCustomerPhno = item.int_mobile;
    this.strCustomerName = item.vchr_name;
  
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
            }
          );
      }
      }
  }
  getInvoice() {
    this.blnData = true;
    this.lstItems =[];
    this.lstQty = [];
    const dct_data = {};
  
    if (this.strImei === '' && this.strType === '1') {
      this.toastr.error('Enter imei ');
      return;
    }
    if (this.strInvoiceNo === '' && this.strType === '3') {
      this.toastr.error('Enter invoice No ');
      return ;
    }
  
    if (this.strType === '2' && (this.selectedCustomerId === '' || this.selectedCustomer!= this.strCustomerName)) {
      this.toastr.error('Valid customer number is required ');
      this.selectedCustomerId = null
      this.selectedCustomer = ''
      this.strCustomerName=''
      return;
    }
    if (this.strImei !== '') {
      dct_data['imei'] = this.strImei;
    }
    if (this.strInvoiceNo !== '') {

      if(this.branch_type == '2' ||this.branch_type == '3' || this.strGroup == 'ADMIN'){

        dct_data['invoiceNo'] = String(this.strInvoiceNo).trim();
        
       }
      else{

      dct_data['invoiceNo'] = 'I-'+this.strBranchCode.toUpperCase()+'-'+String(this.strInvoiceNo).trim();

      }
    }
    if (this.datFrom !== null && this.datTo !== null) {
      
      if (this.datFrom > this.datTo) {
  
        swal.fire({
          position: "center",
          type: "error",
          text: "Please select correct date period",
          showConfirmButton: true,
        });
        return false;
      }
      else{
        const datFrom = moment(this.datFrom).format('YYYY-MM-DD');
        const datTo = moment(this.datTo).format('YYYY-MM-DD');
  
        dct_data['datFrom'] = datFrom;
        dct_data['datTo'] = datTo;
      }
     
    }
    // if (this.selectedCustomerId !== '') {
      // dct_data['intCustomer'] = this.selectedCustomerId;
    // }
    this.serviceObject
          .postData('invoice/invoice_print_list/', dct_data)
          .subscribe(
            (response) => {
              if(response.status==1){
                this.lstItems = response['data'];
                this.lstQty = response['data_qty'];
              }
              else{
                this.lstItems =[]
                
              }
            }
          );
    }
    printInvoice(id){
      this.serviceObject
      .postData('invoice/invoice_print/',{invoiceId:id,blnDuplicate:true})
      .subscribe(
        (response) => {
          if (response.status === 1) {
            // download
            // const file_data = response['file'];
            // const pdf =
            //   'data:application/octet-stream;base64,' +
            //   file_data.substring(2, file_data.length - 1);
            // const dlnk = document.createElement('a');
            // dlnk.href = pdf;
            // dlnk.download = response['file_name'] + '.pdf';
            // document.body.appendChild(dlnk);
            // dlnk.click();
            // dlnk.remove();
            
            // download ends

            // Preview 
            let fileURL = response['file_url'];
            window.open(fileURL, '_blank');
            // let fileURLT = window.URL.createObjectURL(response['file']);
            // console.log(fileURLT)
           
            // localStorage.setItem('previousUrl','/invoice/invoiceprint');
            // localStorage.removeItem('printData');
            // localStorage.setItem('printData',response['file'].substring(2, response['file'].length - 1))
            // this.router.navigate(['/print']);
            // 
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
}
