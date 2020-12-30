import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-direct-transfer-list',
  templateUrl: './direct-transfer-list.component.html',
  styleUrls: ['./direct-transfer-list.component.css']
})
export class DirectTransferListComponent implements OnInit {

  data;
  pur_list_source: LocalDataSource;
  blnShowData=false;
  selectedFrom;
  selectedTo;
  datTo;
  datFrom;
  settings = {
    delete: {
      confirmDelete: true,
      deleteButtonContent: '<i class="ti-trash text-danger m-r-10"></i>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>',
      position: 'right'
    },
    actions: {
      add: false,
      edit:false,
      delete:false,
      custom: [{ name: 'ourCustomAction', title: '<i class="ti-eye text-info m-r-10"></i>' }],
      position: 'right'
      
      },
    columns: {
      vchr_purchase_num: {
        title: 'Order Number ', 
      },
      date_purchase: {
        title: 'Purchase Date',
       
      },
      fk_supplier__vchr_name: {
        title: 'Supplier',
       
      },
      fk_branch__vchr_name: {
        title: 'Branch',
       
      },
      dbl_total: {
        title: 'Total Amount',
       
      },
    },
    pager:{
      display:true,
      perPage:500
      },
  };

  constructor(
    private serviceObject:ServerService,
    private toastr: ToastrService,    
    public router: Router
    ) {
      this.pur_list_source=new LocalDataSource(this.data);
     }
     previusUrl = localStorage.getItem('previousUrl');

  ngOnInit() {
    let ToDate = new Date()
    let FromDate = new Date();
    this.datTo = ToDate
    this.datFrom = FromDate
    this.getData(this.datFrom, this.datTo,0);
  }

  // onEdit(event)
  // {
  //   localStorage.setItem('rowId',event.data.id);
  //   localStorage.setItem('action','edit');
  // localStorage.setItem('previousUrl','purchase/purchaseorder');
    
  //   this.router.navigate(['purchase/purchaseorder']);
  // }

  getData(startDate, endDate,status){
    console.log(startDate, endDate,status,this.previusUrl,"startDate, endDate,status");
    
    let dctData={};
    let tempData;
    let d1 = this.datFrom;
    let d2 = this.datTo;
    let data;

    
    if ((!this.datFrom && this.datTo) || (this.datFrom && !this.datTo)) {
      this.toastr.error('Please select From and To date', 'Error!');
      return false;
    }
    else if ((this.datFrom  &&  this.datTo) && ( this.datTo <  this.datFrom )) {
      this.toastr.error('Please select correct date period', 'Error!');
      return false;
    }

    if (status === 0) {
      console.log("fgdg");
      
      const urls = ['stocktransfer/directtransferlist']

    //  if (this.previusUrl != '/crm/viewlead'  ) {
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
        // localStorage.removeItem('enquiryCustomerId')
        // localStorage.removeItem('enquiryCustomerNumber')
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
    this.datFrom=d1
    this.datTo=d2
    dctData['datFrom'] =d1
    dctData['datTo']=d2

    this.serviceObject.putData('purchase/direct_transfer/',dctData).subscribe(
      (response) => {
          if (response.status == 1) {
           this.data=response['data'];
           if(this.data.length>0){
            this.blnShowData=true;
           this.pur_list_source = new LocalDataSource(this.data); 
           }
           else{
            this.blnShowData=false;
           }
          }  
          else {
            this.blnShowData=false;
            Swal.fire('Error!','error', 'error');
          }
      },
      (error) => {   
        Swal.fire('Error!','error', 'error');
        
      });
  }
  onCustomAction(event) {
      
    localStorage.setItem('intMasterId', event.data.pk_bint_id);
  localStorage.setItem('previousUrl','stocktransfer/directtransferlist');
    
    this.router.navigate(['stocktransfer/directtransferview']);
  }
}
