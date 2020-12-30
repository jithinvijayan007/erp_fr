import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-offersaleslist',
  templateUrl: './offersaleslist.component.html',
  styleUrls: ['./offersaleslist.component.css']
})
export class OffersaleslistComponent implements OnInit {


  datStartDate;
  datEndDate;

  source: LocalDataSource;
  data;
  blnShowData=true;
  
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
      custom: [{ name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},],
      position: 'right'
    },
   
    columns: {
      datBooked: {
        title: 'Date',
      },
      strCustomer: {
        title: 'Customer',
      },
      strStaff: {
        title: 'Staff',
      },
      strItem: {
        title: 'Item',
      },
      job_status: {
        title: 'Status',
      },
    },
  };

  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,

    public router: Router,) {
      this.source = new LocalDataSource(this.data); 
     }

  ngOnInit() {

    this.datStartDate=new Date();
    this.datEndDate=new Date();
    
    // let requestHO=localStorage.getItem('requestHO');
    // if(requestHO=='send'){
    //   Swal.fire({
    //     position: "center", 
    //     type: "error",
    //     allowOutsideClick: false,
    //     text: "Amounts are not tally, waiting for HO approval",
    //     showConfirmButton: true,  
    //   }).then(result => {
    //     if (result.value) {
    //     this.router.navigate(['dayclosure/dayclosure']);
    //     }
    //   }) 
     
    // }
    // else if(requestHO=='reject'){
    //   Swal.fire({
    //     position: "center", 
    //     type: "error",
    //     allowOutsideClick: false,
    //     text: "Sorry, your request is rejected!",
    //     showConfirmButton: true,  
    //   }).then(result => {
    //     if (result.value) {
    //     this.router.navigate(['dayclosure/dayclosure']);
    //     }
    //   }) 
     
    // }
    // else{
    this.getData();
    // }
  }

   
  getData()
  {
    let dctData={};
    dctData['datFrom'] = moment(this.datStartDate).format('YYYY-MM-DD');
    dctData['datTo'] = moment(this.datEndDate).format('YYYY-MM-DD');

    if ((!this.datStartDate && this.datEndDate) || (this.datStartDate && !this.datEndDate)) {
      this.toastr.error('Please select From and To date', 'Error!');
      return false;
    }
    else if ((dctData['datFrom'] &&  dctData['datTo']) && ( dctData['datTo'] <  dctData['datFrom'])) {
      this.toastr.error('Please select correct date period', 'Error!');
      return false;
    }
  
    this.spinnerService.show();

    this.serviceObject.putData('invoice/list_ball_game/',dctData).subscribe(
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
           Swal.fire('Error!','Something went wrong!!', 'error');
          }
      },
      (error) => {   
       Swal.fire('Error','Something went wrong!!', 'error');
      });
  }
  onCustomAction(event)
  {    
    localStorage.setItem('salesRowId',event.data.intId);
    localStorage.setItem('salesStatus',event.data.sales_status);
    if((event.data.sales_status == 3) ||(event.data.sales_status == 4)){
    localStorage.setItem('previousUrl','invoice/serviceinvoiceview');
      
      this.router.navigate(['invoice/serviceinvoiceview']);
    }
    else if(event.data.job_status == 'BALL GAME' || event.data.job_status == 'OFFER ADDED' || event.data.job_status == 'PARTIAL AMOUNT ADDED'){
    localStorage.setItem('previousUrl','invoice/ballgameinvoice');
     
      this.router.navigate(['invoice/ballgameinvoice']);
    }
    else{
      localStorage.setItem('previousUrl','invoice/invoiceview');
    
      this.router.navigate(['invoice/invoiceview']);
       }
    }

}
