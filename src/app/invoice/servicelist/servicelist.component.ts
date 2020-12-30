import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment' ;
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";



@Component({
  selector: 'app-servicelist',
  templateUrl: './servicelist.component.html',
  styleUrls: ['./servicelist.component.css']
})
export class ServicelistComponent implements OnInit {


 constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    public router: Router,) {
    // this.source = new LocalDataSource(this.data); // create the source
   }
       
   lstPermission=JSON.parse(localStorage.group_permissions)
   blnView=false

   previusUrl = localStorage.getItem('previousUrl');
  // source: LocalDataSource;
  data=[];
  // blnShowData=false;
  dataSource = new MatTableDataSource();
  blnShowData='none';

  
  displayedColumns = ['datBooked','vchr_job_num','strCustomer','strStaff', 'strItem', 'vchr_status', 'action'];
  blnFilterOn = false;
  selectedFrom;
  selectedTo;
  datTo;
  datFrom;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit() {
    let ToDate = new Date()
    let FromDate = new Date();
    this.datTo = ToDate
    this.datFrom = FromDate
    let requestHO=localStorage.getItem('requestHO');
    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Jobsheet List") {
        // this.dct_perms.ADD = item["ADD"];
        // this.blnEdit= item["EDIT"];
        // this.dct_perms.DELETE = item["DELETE"];
        this.blnView = item["VIEW"]
      }
    });
    // if(requestHO=='send'){
    //   Swal.fire({
    //     position: "center", 
    //     type: "error",
    //     allowOutsideClick: false,
    //     text: "Amounts are not tally, waiting for HO approval",
    //     showConfirmButton: true,  
    //   }).then(result => {
    //     if (result.value) {
    // localStorage.setItem('previousUrl','dayclosure/dayclosure');
          
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
    // localStorage.setItem('previousUrl','dayclosure/dayclosure');
          
    //     this.router.navigate(['dayclosure/dayclosure']);
    //     }
    //   }) 
     
    // }
    // else{

      this.getList(this.datFrom, this.datTo, 0,);
    // this.getData();
    // }
  }


  // settings = {
  //   actions: {
  //     add: false,
  //     edit: false,
  //     delete: false,
  //     custom: [
  //               { name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},
  //               { name: 'print', title: '<i class="fa fa-print"></i>'},
  //             ],

  //     position: 'right'
  //   },
   
  //   columns: {
  //     datBooked: {
  //       title: 'Date',
  //     },
  //     strCustomer: {
  //       title: 'Customer',
  //     },
  //     strStaff: {
  //       title: 'Staff',
  //     },
  //     strItem: {
  //       title: 'Item',
  //     },
  //     vchr_status:{
  //       title:'Status',
  //     }

     
  //   },
  // };

  getData()
  {
    let status =0
    let dctData={};
    let tempData
    // dctData['datFrom'] = moment(this.datFrom).format('YYYY-MM-DD');
    // dctData['datTo'] = moment(this.datTo).format('YYYY-MM-DD');

    if ((!this.datFrom && this.datTo) || (this.datFrom && !this.datTo)) {
      this.toastr.error('Please select From and To date', 'Error!');
      return false;
    }
    else if ((dctData['datFrom'] &&  dctData['datTo']) && ( dctData['datTo'] <  dctData['datFrom'])) {
      this.toastr.error('Please select correct date period', 'Error!');
      return false;
    }

    this.getList( 
        new Date(this.datFrom).toLocaleString('en-GB'),
        new Date(this.datTo).toLocaleString('en-GB'),
        1,
      );
  }
  getList(startDate, endDate, status){

    let d1 = this.datFrom;
    let d2 = this.datTo;
    let tempData;
    let data;
    let page_num = false;
     if (status === 0) {
      const urls = ['invoice/serviceview']

    //  if (this.previusUrl != '/crm/viewlead'  ) {
      if (!(urls.find( x => x === this.previusUrl))) {
          localStorage.removeItem('enquiryCustomerNumberStatus')
          localStorage.removeItem('enquiryRequestData')
          localStorage.removeItem('pagenumber')
     }
     if (localStorage.getItem('enquiryCustomerNumberStatus')) {
        tempData = JSON.parse(localStorage.getItem('enquiryRequestData'))
     
        d1 = tempData['start_date']
        d2 = tempData['end_date']
        status = 1
        localStorage.removeItem('enquiryCustomerNumberStatus')
        if (JSON.parse(localStorage.getItem('pagenumber'))){
          page_num = true;
        //  this.dataSource.paginator.pageSize = JSON.parse(localStorage.getItem('pagenumber'));
        }
        // localStorage.removeItem('pagenumber')
        // localStorage.removeItem('enquiryCustomerId')
        // localStorage.removeItem('enquiryCustomerNumber')
      }
    }
     else if (status === 1) {
      
      d1 = new Date(d1).toDateString();
      d2 = new Date(d2).toDateString();
      data = {start_date: d1, end_date: d2}
      page_num = false
      localStorage.setItem('enquiryRequestData', JSON.stringify(data))
      localStorage.setItem('pagenumber',JSON.stringify(this.paginator.pageSize));

    }

    const blnService = true;
    d1 =  moment(d1).format('YYYY-MM-DD');
    d2 =  moment(d2).format('YYYY-MM-DD');
    this.datFrom=d1
    this.datTo=d2
    let dctData={}
    dctData['datFrom'] =d1
    dctData['datTo']=d2
    dctData['blnService'] = blnService

    this.spinnerService.show();

    this.serviceObject.putData('invoice/sales_list/',dctData).subscribe(
      (response) => {
        this.spinnerService.hide();

          if (response.status == 1)
          {
            this.data=response['data'];
            
            if(this.data.length>0){
              // this.blnShowData=true;
              this.blnShowData='block';

            //  this.dataSource=this.data
              this.dataSource = new MatTableDataSource(this.data);
             
             this.dataSource.paginator = this.paginator;
             if (page_num){
              this.dataSource.paginator.pageSize = JSON.parse(localStorage.getItem('pagenumber'));
             }
             else{
              this.dataSource.paginator.firstPage();
             }
             this.dataSource.sort = this.sort;
            
             }
             else{
              // this.blnShowData=false;
              this.blnShowData='none';
              
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

  // onCustomAction(event)
  // {
  //   localStorage.setItem('salesRowId',event.data.intId);
  //   localStorage.setItem('salesStatus',event.data.sales_status);

   
  //   switch ( event.action) {
  //     case 'viewrecord':
  //       this.onView(event.data);
  //       break;
  //     case 'print':
  //       this.onPrint(event.data);
  //       break;
  //   }

    // }

    onView(item){
      
      localStorage.setItem('salesRowId',item.intId);
      localStorage.setItem('salesStatus',item.sales_status);
      localStorage.setItem('salestatusname',item.vchr_status);
      console.log()
      
      if(item.sales_status == 6 && item.vchr_status == 'MISSING' || item.sales_status == 6 && item.vchr_status == 'MISSING & PENDING' || item.sales_status == 6 && item.vchr_status == 'MISSING & APPROVED' || item.sales_status == 6 && item.vchr_status == 'MISSING & PAID'){
    localStorage.setItem('previousUrl','invoice/gdpserviceview');
       
        this.router.navigate(['invoice/gdpserviceview']);
      }
      
      else if(item.sales_status == 6 || item.sales_status ==7 || item.sales_status ==5 || item.sales_status == 10){
    localStorage.setItem('previousUrl','invoice/serviceview');
        
        this.router.navigate(['invoice/serviceview']);
      }
    
      else if(item.sales_status == 3){
    localStorage.setItem('previousUrl','invoice/serviceinvoiceview');
        
        this.router.navigate(['invoice/serviceinvoiceview']);
      }
    }
    onPrint(item){

      const intServiceId = item.int_service_id;
      const blnPrint = true;
      this.serviceObject.postData('receipt/add_receipt_api/',{int_service_id:intServiceId,blnPrint:blnPrint}).subscribe(
        (response) => {
            if (response.status == 1)
            {

              let fileURL = response['file_url'];
              window.open(fileURL, '_blank'); 
              
              // const file_data = response['file'].file[0];
              // const pdf = 'data:application/octet-stream;base64,' + file_data.substring(2, file_data.length - 1);
              // const dlnk = document.createElement('a');
              // dlnk.href = pdf;
              // dlnk.download = response['file'].file_name;
              // document.body.appendChild(dlnk);
              // dlnk.click();
              // dlnk.remove();
              // swal.fire('Success!','Successfully downloaded');

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

  
    applyFilter(filterValue: string) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
    }
    onPaginateChange(event){
      localStorage.setItem('pagenumber',JSON.stringify(event.pageSize));
    }   
}
