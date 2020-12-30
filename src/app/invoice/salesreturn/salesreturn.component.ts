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
import { setFlagsFromString } from 'v8';

@Component({
  selector: 'app-salesreturn',
  templateUrl: './salesreturn.component.html',
  styleUrls: ['./salesreturn.component.css']
})
export class SalesreturnComponent implements OnInit {
  searchBranch: FormControl = new FormControl();
  intBranchId: null;
  lstBranch = [];
  selectedBranch = '';
  strSelectedInvoiceNo;
  constructor(private modalService: NgbModal,private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private fullObject: FullComponent,
    private spinner: NgxSpinnerService,
  ){}

  blnCustAddDisabled = true;
  ngOnInit() {
    this.searchBranch.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        
        if (strData === undefined || strData === null || strData ==='') {          
          this.lstBranch = [];
          this.intBranchId=null;
        } else {
          if (strData.length >= 2) {
            this.serviceObject
            .putData('user/get_branch_list/', { strData: strData })
            .subscribe(
              (response) => {
                this.lstBranch = response['data'];

              }
            );

          }
        }
      }
      );
    this.searchCustomerNo.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCustomerNumber = [];
      } else {
        if (strData.length >= 1) {
          const dctData = {}
          dctData['term'] = strData;
          dctData['blnCustAdd'] =true;
          this.serviceObject
            .postData('customer/add_customer_pos/',dctData)
            .subscribe(
              (response) => {
                this.lstCustomerNumber = response['data'];
                if(this.lstCustomerNumber.length==0 && strData.length >= 6)
                {
                  // console.log('7')
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
  }
  blnAddButton = false;
strReturnType = '1';
strReturnImei = '';
strInvoiceNo:'';
datReturnFrom = null;
datReturnTo = null;
selectedReturnCustomer;
lstReturnCustomer = [];
selectedReturnCustomerPhno = '';
strReturnCustomerName=''
selectedReturnCustomerId = '';
lstReturnItems = [];
lstReturnQty = [];
showModalReturn;
dctReturnId={}  

selecetedCustName = '';
selecetedCustEmail = '';
selecetedCustCity = '';
selecetedCustState = '';
selecetedCustGst = '';
selecetedCustAddress = '';
selecetedCustId :'';

blnAll=false
blnReturnData = false;
dctReturn={}
lstcheckReturn=[]
intdblReceiptAmount ;
intContactNo = null;
searchCustomerNo: FormControl = new FormControl();
  lstCustomerNumber = []
  selecetedCustNumber = '';


customerChanged(event) {
  if (event === undefined || event === null) {
  this.lstReturnCustomer = [];
  } else {
  if (event.length >= 7) {
    this.serviceObject
      .postData('salesreturn/get_details_customer/', {str_search: event})
      .subscribe(
        (response) => {
          this.strSelectedInvoiceNo='';
          this.lstReturnCustomer = response['customer_list'];
        }
      );
  }
  }
}
SetSelectAll(){
  if(this.blnAll){
    this.lstReturnItems.forEach(item=>{
      item.bln_true=true
      item.bln_check=true
    })
  }
  else{
    this.lstReturnItems.forEach(item=>{
      item.bln_true=false;
      item.bln_check=false}
    )
  }
  
}

setAll(item,i,event){
//  console.log("s",this.lstReturnItems[i])
  if(this.lstReturnItems[i].bln_true){
       if(this.strSelectedInvoiceNo && this.strSelectedInvoiceNo!=this.lstReturnItems[i].enquiry_num){
            this.toastr.error('Can`t Select Different invoices');
            // this.lstReturnItems[i].bln_true=false;
            item.bln_true=false;
            event.checked=false;
            event.source.checked=false;
            return;
          }
      
    this.lstReturnItems[i].bln_check=true
    this.strSelectedInvoiceNo = this.lstReturnItems[i].enquiry_num;
  }
  else{
        let blnAllFalse=true;
    this.lstReturnItems.forEach(element=>{
      if(element.bln_true==true){
        blnAllFalse=false;
      }
    })
    if(blnAllFalse){
      this.strSelectedInvoiceNo = '';      
    }

    this.lstReturnItems[i].bln_check=false
    
  }

  let blnCheck=true
  this.lstReturnItems.forEach(element=>{
    if(element.bln_true==false){
      blnCheck=false
    }
  })

  this.blnAll=blnCheck
}
  radioChange(){
    this.blnReturnData = true;
    this.lstReturnItems =[];
    this.lstReturnQty = [];
    this.strReturnImei=''
    this.strInvoiceNo =''
    this.datReturnFrom=null
    this.datReturnTo=null
    this.selectedReturnCustomer=''
    this.selectedReturnCustomer= ''
    this.selectedReturnCustomerId = ''
    this.intContactNo=null;
    this.intBranchId=null;
    this.selectedBranch=null;
  }
  customerNumberChanged(item){
    // this.selecetedCustNumber = item.
    this.blnAddButton = true;
    this.selecetedCustNumber = item.intContactNo;
    this.selecetedCustName = item.strCustName
    this.selecetedCustEmail = item.strCustEmail
    this.selecetedCustCity = item.strLocation
    this.selecetedCustState = item.strState
    this.selecetedCustGst = item.strGSTNo
    this.selecetedCustAddress = item.txtAddress
    this.selecetedCustId = item.intCustId
    localStorage.setItem('intContactNo',this.selecetedCustNumber);
    localStorage.setItem('intCustId',this.selecetedCustId);
    localStorage.setItem('strCustName',this.selecetedCustName);
    localStorage.setItem('strCustEmail',this.selecetedCustEmail);
    localStorage.setItem('strLocation',this.selecetedCustCity);
    localStorage.setItem('strState',this.selecetedCustState);
    localStorage.setItem('strGSTNo',this.selecetedCustGst);
    localStorage.setItem('txtAddress',this.selecetedCustAddress);
    this.router.navigate(['invoice/salesreturnview']);
  }
  customerNumberModelChange(event){
    // if(this.intContactNo!=this.selecetedCustNumber){
    //   this.intContactNo = null;
    //   // this.strCustomer = '';
    // }
    if(this.intContactNo!=this.selecetedCustNumber){
      localStorage.setItem('intContactNo','');
      localStorage.setItem('intCustId','');
      localStorage.setItem('strCustName','');
      localStorage.setItem('strCustEmail','');
      localStorage.setItem('strLocation','');
      localStorage.setItem('strState','');
      localStorage.setItem('strGSTNo','');
      localStorage.setItem('txtAddress','');
    }
    
  }
  opencustomeredit(){
    // localStorage.setItem('intContactNo',this.selecetedCustNumber);
    // localStorage.setItem('intCustId',this.selecetedCustId);
    // localStorage.setItem('strCustName',this.selecetedCustName);
    // localStorage.setItem('strCustEmail',this.selecetedCustEmail);
    // localStorage.setItem('strLocation',this.selecetedCustCity);
    // localStorage.setItem('strState',this.selecetedCustState);
    // localStorage.setItem('strGSTNo',this.selecetedCustGst);
    // localStorage.setItem('txtAddress',this.selecetedCustAddress);
    this.router.navigate(['invoice/salesreturnview'],{ queryParams: { page: "invoice/salesreturn" } });
  }
  CustomerClicked(item) {
  this.selectedReturnCustomerId = item.pk_bint_id;
  this.selectedReturnCustomerPhno = item.int_mobile;
  this.strReturnCustomerName = item.vchr_name;

  }
  getInvoice() {
  this.blnReturnData = true;
  this.lstReturnItems =[];
  this.lstReturnQty = [];
  const dct_data = {};

  if (this.strReturnImei === '' && this.strReturnType === '1') {
    this.toastr.error('Enter imei ');
    return;
  }
  if (this.strInvoiceNo === '' && this.strReturnType === '3') {
    this.toastr.error('Enter invoice No ');
    return;
  }

  if (this.strReturnType === '2' && (this.selectedReturnCustomerId === '' || this.selectedReturnCustomer!= this.strReturnCustomerName)) {
    this.toastr.error('Valid customer is required ');
    this.selectedReturnCustomerId = null
    this.selectedReturnCustomer = ''
    this.strReturnCustomerName=''
    return;
  }
  if(this.strReturnType === '5' && this.intBranchId ==null){
    this.toastr.error('Branch is required ');
    return;
  }
  if(this.intBranchId !=null){
    dct_data['intBranch'] = this.intBranchId;
  }
  if (this.strReturnImei !== '') {
    dct_data['imei'] = this.strReturnImei;
  }
  if (this.strInvoiceNo !== '') {
    dct_data['invoiceNo'] = this.strInvoiceNo;
  }
  if (this.datReturnFrom !== null && this.datReturnTo !== null) {
    const datReturnFrom = moment(this.datReturnFrom).format('YYYY-MM-DD');
    const datReturnTo = moment(this.datReturnTo).format('YYYY-MM-DD');
    dct_data['datFrom'] = datReturnFrom;
    dct_data['datTo'] = datReturnTo;
  }
  if (this.selectedReturnCustomerId !== ''){
    dct_data['int_customer'] = this.selectedReturnCustomerId;
  }
  this.serviceObject
    .postData('salesreturn/get_return_details/', dct_data)
        .subscribe(
          (response) => {
            if(response.status==1){
              this.strSelectedInvoiceNo='';
              this.lstReturnItems = response['data'];
              this.lstReturnQty = response['data_qty'];
              let blnCheck=true
              this.lstReturnItems.forEach(element=>{
                if(element.bln_true==false){
                  blnCheck=false
                }
              })
          
              this.blnAll=blnCheck
            }
            else if(response.status==0){
              this.toastr.error(response['message'],'Error!');
              this.lstReturnItems =[]
            }
          }
        );
  }

  returnItem(item) {
    let lstReturnId = []
    let lstReturn = []
    let lstReturnImei = []
    let blnCustWholeInvoice =true;
    // let count=0
    console.log(this.strSelectedInvoiceNo);
    
    this.lstReturnItems.forEach(element=>{
      if(this.strReturnType=='2'&& element.bln_true==false && element.enquiry_num== this.strSelectedInvoiceNo){
        blnCustWholeInvoice=false
      }
      if(element.bln_true==true){
      //   if(element.item_code=='GDC00001' || element.item_code=='GDC00002')
      // {
      //   count=count+1
      // }
        lstReturnId.push(element.int_id)
        lstReturnImei.push(element.imei)
        // lstReturn['id']=element.int_id
        // lstReturn['imei']=element.imei
        let dctData={}
        dctData['id']=element.int_id
        dctData['imei']=element.imei
        lstReturn.push(dctData)

      }
    })
    // console.log(lstReturn.length)

    if (lstReturn.length == 0 ) {
      this.toastr.error('Select return Item');
      return;
    }
    // if (lstReturn.length == count) {
    //   this.toastr.error("You Can't Return Insurance Only");
    //   return;
    // }
    // let lstInsurance=[]
    // this.lstReturnItems.forEach(element1=>{
    //   lstReturn.forEach(element=>{
    //     let dctData={}
    //     if (element1.item_code=='GDC00001' && element1.imei==element.imei && element1.bln_true==false || element1.item_code=='GDC00002' && element1.imei==element.imei && element1.bln_true==false){
    //     dctData['id']=element1.int_id
    //     dctData['imei']=element1.imei
    //     lstInsurance.push(dctData)
    //     }
    //   })
   
      // if(element.item_code=='GDC00001'  imei|| element.item_code=='GDC00002')
      // {
      //   count=count+1
      // }

    // })
//     let distinct = []
// for (var i = 0; i < lstInsurance.length; i++){


//    if (!(lstInsurance[i]  in distinct)){
//       distinct.push(lstInsurance[i])
//    }
//     }
    // console.log("dsfdsa",distinct['id'])
    // lstReturn.push(...distinct)
    // lstReturnId.push(...distinct['id'])
    // lstReturnImei.push(...distinct['imei'])
    localStorage.setItem('salesReturnId',JSON.stringify(lstReturnId));
    localStorage.setItem('salesReturnImei',JSON.stringify(lstReturnImei));
    localStorage.setItem('salesReturn',JSON.stringify(lstReturn));
       if(this.strReturnType=='3' && this.blnAll){
            localStorage.setItem('blnSalesReturnAll',JSON.stringify(true));
          }else if (this.strReturnType=='2' && blnCustWholeInvoice){
            localStorage.setItem('blnSalesReturnAll',JSON.stringify(true));
          }else{
            localStorage.setItem('blnSalesReturnAll',JSON.stringify(false));
          }
    // localStorage.setItem('salesReturnId',item.int_id);
    // localStorage.setItem('salesReturnImei',item.imei);
    localStorage.setItem('previousUrl','invoice/returninvoice');
    
    this.router.navigate(['invoice/returninvoice']);
  }
  BranchChanged (item) {
    this.intBranchId = item.id;
  }
}
