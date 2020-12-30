import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-creditapprovalslist',
  templateUrl: './creditapprovalslist.component.html',
  styleUrls: ['./creditapprovalslist.component.css']
})
export class CreditapprovalslistComponent implements OnInit {

  datStartDate;
  datEndDate;
  lstPermission=JSON.parse(localStorage.group_permissions)
  lstCustom=[]

  constructor(private serviceObject: ServerService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    public router: Router,) {
    this.source = new LocalDataSource(this.data); // create the source
      
  }
  previusUrl = localStorage.getItem('previousUrl');

  ngOnInit(){

    
    this.datStartDate=new Date();
    this.datEndDate=new Date();
     let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Sales Order List") {
        dct_perms.ADD = item["ADD"];
        dct_perms.EDIT= item["EDIT"];
        dct_perms.DELETE = item["DELETE"];
        dct_perms.VIEW = item["VIEW"]
      }
    });
    
    if(dct_perms.VIEW==true  ){
      this.lstCustom=[{ name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},]
    }
    else{
      this.lstCustom =[]
    }
    this.settings.actions.custom = this.lstCustom
    let requestHO=localStorage.getItem('requestHO'); 
    this.getList(this.datStartDate, this.datEndDate, 0,);
  }
  source: LocalDataSource;
  data;
  blnShowData=true;
  
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
     
      custom: this.lstCustom,
      position: 'right'
   
    },
   
    columns: {
      datBooked: {
        title: 'Date',
      },
      strEnqNo: {
        title: 'Enquiry No.',
      },
      strCustomer: {
        title: 'Customer',
      },
      strStaff: {
        title: 'Staff',
      },
      branch: {
        title: 'Branch',
      },
      strItem: {
        title: 'Item',
      },
     
    },
  };
  getData()
  {
    let status =0
    let dctData={};
    let tempData
    if ((!this.datStartDate && this.datEndDate) || (this.datStartDate && !this.datEndDate)) {
      this.toastr.error('Please select From and To date', 'Error!');
      return false;
    }
    else if ((dctData['datFrom'] &&  dctData['datTo']) && ( dctData['datTo'] <  dctData['datFrom'])) {
      this.toastr.error('Please select correct date period', 'Error!');
      return false;
    }

    this.getList( 
        new Date(this.datStartDate).toLocaleString('en-GB'),
        new Date(this.datEndDate).toLocaleString('en-GB'),
        1,
      );
  }
  getList(startDate, endDate, status){

    let d1 = this.datStartDate;
    let d2 = this.datEndDate;
    let tempData;
    let data;
     if (status === 0) {
      const urls = ['invoice/invoiceview']

      if (!(urls.find( x => x === this.previusUrl))) {
          localStorage.removeItem('enquiryCustomerNumberStatus')
          localStorage.removeItem('enquiryRequestData')
     }
     if (localStorage.getItem('enquiryCustomerNumberStatus')) {
        tempData = JSON.parse(localStorage.getItem('enquiryRequestData'))
     
        d1 = tempData['start_date']
        d2 = tempData['end_date']
        status = 1
        localStorage.removeItem('enquiryCustomerNumberStatus')
      }
    }
     else if (status === 1) {

      d1 = new Date(d1).toDateString();
      d2 = new Date(d2).toDateString();
      data = {start_date: d1, end_date: d2}

      localStorage.setItem('enquiryRequestData', JSON.stringify(data))

    }


    d1 =  moment(d1).format('YYYY-MM-DD');
    d2 =  moment(d2).format('YYYY-MM-DD');
    this.datStartDate=d1
    this.datEndDate=d2
    let dctData={}
    dctData['datFrom'] =d1
    dctData['datTo']=d2

    this.spinnerService.show();

    this.serviceObject.putData('invoice/credit_settlement/',dctData).subscribe(
      (response) => {
        this.spinnerService.hide();

          if (response.status == 1)
          {
            this.data=response['data'];

            if(this.data.length>0){
              this.blnShowData=true;
             this.source = new LocalDataSource(this.data); 
             }
             else{
              this.blnShowData=false;
             }
          }  
          else if (response.status == 0) 
          {
           swal.fire('Error!','Something went wrong!!', 'error');
          }
      },
      (error) => { 
        this.spinnerService.hide();
       swal.fire('Error!','Something went wrong!!', 'error');
      });

  }

  onCustomAction(event)
  {
    localStorage.setItem('salesRowId',event.data.intId);
    localStorage.setItem('salesStatus',event.data.sales_status);
    localStorage.setItem('exchangeSalesId','');
    if((event.data.sales_status == 3) ||(event.data.sales_status == 4)){
      localStorage.setItem('previousUrl','invoice/serviceinvoiceview');
      this.router.navigate(['invoice/serviceinvoiceview']);
    }
    else{
      localStorage.setItem('previousUrl','invoice/invoiceview');
      this.router.navigate(['invoice/invoiceview']);
       }
    }
    
}
