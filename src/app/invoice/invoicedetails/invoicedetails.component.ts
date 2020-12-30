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
  selector: 'app-invoicedetails',
  templateUrl: './invoicedetails.component.html',
  styleUrls: ['./invoicedetails.component.css']
})
export class InvoicedetailsComponent implements OnInit {


  intId=localStorage.getItem('intId')
  
  blnJioInvoice=localStorage.getItem('blnJioInvoice')
  blnReturn=Number(localStorage.getItem('blnReturn'))
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
 getData(){
  let putData = {}
  var boolValue = JSON.parse(this.blnJioInvoice);
  putData = {'intId':this.intId,'blnJioInvoice':boolValue,'blnReturn':this.blnReturn}
  this.serviceObject.putData('invoice/invoice_list/',putData).subscribe(
    (response) => {
        if (response.status == 1)
        {
          this.dctDetails=response['details'];
          this.lstPayment = response['lst_payment'];
          // console.log("@@@@@this.lstPayment",this.lstPayment);
          
          this.dctMaster=response['master']['0'];
          this.dct_finance=response['dct_finance'];
          if (this.objectKeys(this.dct_finance).length > 0) {
            this.blnFinance = true
          }
          this.dctMaster['staff_name']=this.dctMaster['fk_staff__first_name'] +' '+this.dctMaster['fk_staff__last_name']
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
 // Zoom image modal

openzoomimage(zoomimage,image) {
  this.imageUrl=image
  this.showModalZoom= this.modalService.open(zoomimage, { size: 'lg' })
}

}
