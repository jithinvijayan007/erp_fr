import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-specialsaleslist',
  templateUrl: './specialsaleslist.component.html',
  styleUrls: ['./specialsaleslist.component.css']
})
export class SpecialsaleslistComponent implements OnInit {

  datStartDate;
  datEndDate;
  lstPermission=JSON.parse(localStorage.group_permissions)
  lstCustom=[];

  previusUrl = localStorage.getItem('previousUrl');

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
    pager:{
      display:true,
      perPage:500
      }
  };

  constructor(private serviceObject: ServerService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    public router: Router,) {
    this.source = new LocalDataSource(this.data)  }

  ngOnInit() {
    this.datStartDate=new Date();
    this.datEndDate=new Date();
    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstCustom=[{ name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},]
   
    this.settings.actions.custom = this.lstCustom     
    this.getData();

  }

  getData()
  {

    let dctData={};

    dctData['datFrom'] =moment(this.datStartDate).format('YYYY-MM-DD');
    dctData['datTo']=moment(this.datEndDate).format('YYYY-MM-DD');

    this.spinnerService.show();

    this.serviceObject.putData('special_sales/view_list/',dctData).subscribe(
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
    localStorage.setItem('specialSalesId',event.data.intId);
    localStorage.setItem('salesStatus',event.data.sales_status);
    localStorage.setItem('exchangeSalesId','');
   
    this.router.navigate(['invoice/specialinvoice']);
  }
    
    
}
