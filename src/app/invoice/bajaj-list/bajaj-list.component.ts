import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalDataSource } from 'ng2-smart-table';
import { pbkdf2 } from 'crypto';

@Component({
  selector: 'app-bajaj-list',
  templateUrl: './bajaj-list.component.html',
  styleUrls: ['./bajaj-list.component.css']
})
export class BajajListComponent implements OnInit {

  datStartDate;
  datEndDate;
  data
  selectedFrom
  selectedTo
  source: LocalDataSource;
  blnShowData = false;
  lstPermission=JSON.parse(localStorage.group_permissions)
  previusUrl = localStorage.getItem('previousUrl'); 
  lstCustom=[]
  constructor(private serviceObject: ServerService, 
              private toastr: ToastrService,
              public router: Router
  ) { this.source = new LocalDataSource(this.data);}

  ngOnInit() {
    this.datStartDate = new Date();
    this.datEndDate = new Date();
    // this.getData();
    this.getList(this.datStartDate, this.datEndDate, 0,);
    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Online Sales") {
        // if (item["NAME"] == "Bajaj Finance") {
        dct_perms.ADD = item["ADD"];
        dct_perms.EDIT= item["EDIT"];
        dct_perms.DELETE = item["DELETE"];
        dct_perms.VIEW = item["VIEW"]
      }
    });
    if(dct_perms.VIEW==true ){
      this.lstCustom= [
      { name: 'viewrecord', title: '<i class="fa fa-eye"></i>' },
    ]
         
    }
    else{
      this.lstCustom= [ ]
    }
    this.settings.actions.custom = this.lstCustom
  }
  
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

  getData(){
    let status =0
    let dctData = {};
    // dctData['datFrom'] = moment(this.datStartDate).format('YYYY-MM-DD');
    // dctData['datTo'] = moment(this.datEndDate).format('YYYY-MM-DD');
    // dctData['blnBajaj'] = true
    this.selectedFrom = moment(this.datStartDate).format('YYYY-MM-DD')
    this.selectedTo = moment(this.datEndDate).format('YYYY-MM-DD')

     if (this.selectedFrom > this.selectedTo || (!this.selectedFrom) || (!this.selectedTo) )  {
      this.toastr.error('Please select correct date period', 'Error!');
        return false
      }
    
    this.getList( 
      new Date(this.datStartDate).toLocaleString('en-GB'),
      new Date(this.datEndDate).toLocaleString('en-GB'),
      1,
    );
    
    }
    getList (startDate, endDate, status) {
      let d1 = this.datStartDate
        let d2 = this.datEndDate;
        let tempData;
        let data;
        if (status === 0) {
          const urls = ['invoice/bajaj_view']
    
        //  if (this.previusUrl != '/crm/viewlead'  ) {
          if (!(urls.find( x => x === this.previusUrl))) {
           
              console.log(this.previusUrl)
              localStorage.removeItem('bajajListStatus')
              localStorage.removeItem('bajajListData')
         }
         if (localStorage.getItem('bajajListStatus')) {
           
            tempData = JSON.parse(localStorage.getItem('bajajListData'))
            console.log(tempData,"tempData");
            
    
            d1 = tempData['start_date']
            d2 = tempData['end_date']
            status = 1
            localStorage.removeItem('bajajListStatus')
            // localStorage.removeItem('enquiryCustomerId')
            // localStorage.removeItem('enquiryCustomerNumber')
          }
        }
         else if (status === 1) {
          
          
          
          d1 = new Date(d1).toDateString();
          d2 = new Date(d2).toDateString();
          data = {start_date: d1, end_date: d2 }
    
          localStorage.setItem('bajajListData', JSON.stringify(data))
    
        }
        d1 =  moment(d1).format('YYYY-MM-DD');
        d2 =  moment(d2).format('YYYY-MM-DD');
        this.datStartDate=d1
        this.datEndDate=d2
        let dctData={}
        dctData['blnBajaj'] = true
        dctData['datFrom'] =d1
        dctData['datTo']=d2
     
        this.serviceObject.putData('invoice/sales_list/', dctData).subscribe(
          (response) => {
            if (response.status == 1) {
              this.data = response['data'];
    
              if (this.data.length > 0) {
                this.blnShowData = true;
                this.source = new LocalDataSource(this.data);
              }
              else {
                this.blnShowData = false;
              }
            }
            else if (response.status == 0) {
              Swal.fire('Error!', 'Something went wrong!!', 'error');
            }
          },
          (error) => {
            Swal.fire('Error!', 'Something went wrong!!', 'error');
          });
     
        
    }
  onCustomAction(event) {
    localStorage.setItem('bajajId', event.data.intId);
    localStorage.setItem('previousUrl','invoice/bajaj_view');
    this.router.navigate(['invoice/bajaj_view']);
  }

}
