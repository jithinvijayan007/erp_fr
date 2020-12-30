import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment' ;
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";




@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.css']
})
export class QuotationListComponent implements OnInit {

  lstCustom=[]
  datStartDate;
  datEndDate;
  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,

    public router: Router,) {
    this.source = new LocalDataSource(this.data); // create the source
      
  }
  source: LocalDataSource;
  data;
  blnShowData=true;
  datTo;
  intPhone=null;
  datFrom;
  selectedFrom;
  selectedTo;

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
      // custom: this.lstCustom,
      custom: [{ name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},{ name: 'downloadrecord', title: '&nbsp;&nbsp;<i class="fas fa-print"></i>'},],
      position: 'right'
    },
   
    columns: {
      dat_created_formated: {
        title: 'Date',
      },
      vchr_doc_num: {
        title: 'Quotation No',
      },
      fk_branch__vchr_name: {
        title: 'Branch',
      },
      vchr_cust_name: {
        title: 'Customer',
      },
      vchr_staff_name: {
        title: 'Staff',
      },
      // fk_item__fk_product__vchr_name: {
      //   title: 'Product',
      // },
     
    },
  };

  ngOnInit() {

    this.datStartDate=new Date();
    this.datEndDate=new Date();
    
    this.getData();
    // }
  }

  downloadRecord(event){
    // let id={quotationId:this.quotationId};


    this.serviceObject.postData('quotation/print/',{id:event.data.pk_bint_id}).subscribe(
      response => {

        if(response['status']==1){
          let fileURL = response['file_url'];
          window.open(fileURL, '_blank');
          localStorage.setItem('previousUrl','invoice/quotationlist');
          // this.router.navigate(['invoice/listinvoice']);
          this.router.navigate(['invoice/quotationlist']);
          

        }
        else {
          swal.fire('Error!',response['message'], 'error');
          return false;
        }


      },
      error => {
        alert(error);
      }
    );

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

    this.serviceObject.postData('quotation/list/',dctData).subscribe(
      (response) => {
        this.spinnerService.hide();

          if (response.status == 1)
          {
            this.data=response['lst_data'];

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
       swal.fire('Error','Something went wrong!!', 'error');
      });
  }
  onCustomAction(event)
  {  
      
    console.log(event,"event");
  switch ( event.action) {
    case 'viewrecord':
       localStorage.setItem('quotationRowId',event.data.pk_bint_id);
       localStorage.setItem('previousUrl','invoice/quotationlist');
       this.router.navigate(['invoice/quotationview']);
        break;
   
    case 'downloadrecord':
      this.downloadRecord(event);  
  }

}
}
