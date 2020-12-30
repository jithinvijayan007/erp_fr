import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment' ;
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quotation-view',
  templateUrl: './quotation-view.component.html',
  styleUrls: ['./quotation-view.component.css']
})
export class QuotationViewComponent implements OnInit {


  intId=localStorage.getItem('quotationRowId')
  // blnJioInvoice=localStorage.getItem('blnJioInvoice')
  // blnReturn=Number(localStorage.getItem('blnReturn'))
  data=[]
  dctMaster={}
  dctDetails=[]
  hostname = '';
  url='';
  dctExchangeImage={}
  showModalZoom;
  blnShowData=false;
  imageUrl=''
  lstPayment = []
  objectKeys;
  dct_finance={}
  blnFinance = false

  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public router: Router,) {
      
  }
 

  ngOnInit() {
    if (localStorage.getItem('invoiceRequestData')) {
      localStorage.setItem('invoiceCustomerNumberStatus', '1');
    }
    this.hostname = this.serviceObject.hostAddress
    this.hostname = this.hostname.slice(0, this.hostname.length - 1)
    this.url = this.serviceObject.url
    this.objectKeys = Object.keys;
    
    
   this.getData();

  }
  blnIGST=true
 getData(){
  let putData = {}
  // var boolValue = JSON.parse(this.blnJioInvoice);
  // putData = {'intId':this.intId,'blnJioInvoice':boolValue,'blnReturn':this.blnReturn}
  this.serviceObject.postData('quotation/list/',{'id':this.intId}).subscribe(
    (response) => {
        if (response.status == 1)
        {
          this.dctDetails=response['lst_data']['0']['jsn_data']['lstItemDetails'];
          // this.lstPayment = response['lst_payment'];
          this.dctMaster=response['lst_data']['0'];
          this.blnIGST=response['lst_data']['0']['jsn_data']['blnCheckIGST'];
          // this.dct_finance=response['dct_finance'];
          // if (this.objectKeys(this.dct_finance).length > 0) {
          //   this.blnFinance = true
          // }
          // this.dctMaster['staff_name']=this.dctMaster['fk_staff__first_name'] +' '+this.dctMaster['fk_staff__last_name']
        }  
        else if (response.status == 0) 
        {
         swal.fire('Error!','Something went wrong!!', 'error');
        }
    },
    (error) => {   
     swal.fire('Error!','Something went wrong!!', 'error');
    });
 }

}
