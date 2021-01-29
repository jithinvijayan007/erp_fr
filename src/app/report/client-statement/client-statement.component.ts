
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit,ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import * as moment from 'moment' ;
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Observable} from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-client-statement',
  templateUrl: './client-statement.component.html',
  styleUrls: ['./client-statement.component.css']
})
export class ClientStatementComponent implements OnInit {

  date
  selectedDate;

  lstPermission=JSON.parse(localStorage.group_permissions)
  blnDownload=false;

  constructor(
    private serverService: ServerService,
    public router: Router,
    private fb: FormBuilder,
    public toastr: ToastrService,
    // private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private spinnerService: NgxSpinnerService,
  ) { }


  lstBranch=[]
  branchOptions=[]
  branchConfig = {displayKey:"name",search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Branch',searchOnKey: 'name',clearOnSelection: true  }


  searchCustomer: FormControl = new FormControl();
  lstCustomer = []
  intCustomerId;
  strCustomer;
  strSelectedCustomer;
  currentCustomer='';
  intCustomerMobNumber = null;

  lstCustomerType = ['ALL','CASH','CREDIT','CESS','CORPORATE'];

  blnShowData = false;
  strCustomerType = 'ALL';
  intCustomerType = -3;
  blnBranch = false;
  dctData = {};
  intDebitTotal = null;
  intCreditTotal=null;
  intBalance = null;
  blnCreditFooter =false;
  blnDebitFooter = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  lstData=[];
  dataSource;
  lstDisplayedColumns = ['customer','branch','debit','credit'];

  ngOnInit() {

    this.date = new Date();
    this.dataSource = new MatTableDataSource(
      this.lstData
    );

    this.lstPermission.forEach(item=> {

      if (item["NAME"] == "Client Outstanding Report") {
        this.blnDownload = item["DOWNLOAD"]
      }
    });
    
    this.searchCustomer.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCustomer = [];
      } else {
        if (strData.length >= 7) {
          
          this.serverService
            .postData('reports/customer_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstCustomer = response['data'];
                
              }
            );
          }
        }
      }
    );

    this.branchFilterCheck()
  }

  clientStatementSearch(){

  this.dctData = {};

 if(this.strSelectedCustomer){
   if(this.strSelectedCustomer != this.currentCustomer){
    this.toastr.error('Valid Customer Name is required', 'Error!');
    return ; 
   }
 }
 this.dctData['datAsOn'] = moment(this.date).format('YYYY-MM-DD');
 this.dctData['intCustType'] = this.intCustomerType;
 if(this.blnBranch){
  if(this.lstBranch.length>0){
    let lstData=[]
    this.lstBranch.forEach(element => {
      lstData.push(element.id)
    });
    this.dctData['lstBranchId'] = lstData;
  }
 }
 if(this.strSelectedCustomer){
  this.dctData['intMobileNo'] = this.intCustomerMobNumber;
 }
 

  

  this.spinnerService.show();

  this.serverService.postData('reports/client_outstanding_report/',this.dctData).subscribe(
    (response) => {
  
    
      this.spinnerService.hide();
        if (response.status == 1)
        {
          this.blnShowData = true;
          this.lstData = response['data'];
          this.intCreditTotal = response['int_credit_total'];
          this.intDebitTotal = response['int_debit_total'];
          if(this.intCreditTotal > this.intDebitTotal){
            this.intBalance = (this.intCreditTotal - this.intDebitTotal).toFixed(2);
            this.blnCreditFooter = true;
          }
          else{
            this.intBalance = (this.intDebitTotal - this.intCreditTotal).toFixed(2);
            this.blnDebitFooter = true;
          }
    
          
          this.dataSource = new MatTableDataSource(
            this.lstData
          );
          this.dataSource.paginator = this.paginator;
          // this.dataSource.paginator.firstPage();
          this.dataSource.sort = this.sort;
         

        }  
        
        else if (response.status == 0) 
        {
         this.blnShowData=false;
         swal.fire('Error!',response['reason'], 'error');
        }
    },
    (error) => {   
      this.spinnerService.hide();

     swal.fire('Error!','Something went wrong!!', 'error');
    });

  }


 customerNgModelChanged(event){
  if(this.currentCustomer!=this.strSelectedCustomer){
    this.intCustomerId = null;
    this.strCustomer = '';
  }
}
customerChanged(item)
{
 this.currentCustomer = item.name;
 this.intCustomerId = item.id;
 this.strCustomer = item.name;
 this.strSelectedCustomer = item.name;
 this.intCustomerMobNumber = item.phone;

}

customerTypeChange(customer){
 if(customer == 'ALL'){
   this.intCustomerType = -3;
 }
 else if(customer == 'CASH'){
   this.intCustomerType =  4  
 }
 else if(customer == 'CREDIT'){
   this.intCustomerType = 2;
 }
 else if(customer == 'CESS'){
  this.intCustomerType = 3 ; 
 }
 else if(customer == 'CORPORATE'){
  this.intCustomerType = 1;
 }

  
}
branchFilterCheck(){
  const dctData = {'onLoad':true}

  this.serverService.postData('reports/client_outstanding_report/',dctData).subscribe(
    (response) => {
     
        if (response.status == 1)
        {
          this.blnBranch = response['bln_show_all'];
          this.branchOptions = response['branch'];
          // this.branchOptions = [{'id':30,'name':'koratty'},{'id':15,'name':'chalakkudy'},{'id':28,'name':'valapara'}];

        }  
        
    },
    (error) => {   
     swal.fire('Error!','Something went wrong!!', 'error');
    });

}
exportData(){
  if(this.lstData.length>0){
    this.dctData['blnExport']=true;
    this.dctData['tabledata']=this.lstData;

    this.serverService.postData('reports/client_outstanding_report/',this.dctData).subscribe(
      (response) => {
          if (response.status == 1)
          { 

            var a = document.createElement('a');
            document.body.appendChild(a);
            a.href = response['export'];
            a.download = 'report.xlsx';
            a.click();
            // window.URL.revokeObjectURL(this.dctReportData);
            a.remove();
                
            // this.snotifyService.success('Successfully Exported');  
            this.toastr.success('Successfully Exported', 'Success!');
             
            // this.blnExported = true;
            // this.downloadLog(dctJsonData)
          }  
          
          else if (response.status == 0) 
          {
          //  this.blnShowData=false;
           swal.fire('Error!',response['reason'], 'error');
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
      });
  }
  else{
    this.toastr.error('No Data Found');
    
  }
}
applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();

  // if (this.dataSource.paginator) {
  //   // this.dataSource.paginator.firstPage();
  // }
}


}
