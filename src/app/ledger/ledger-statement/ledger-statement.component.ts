
import {debounceTime} from 'rxjs/operators';
// import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment' ;
import { CustomValidators } from 'ng2-validation';
import Swal from 'sweetalert2';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
const mob = new FormControl('');
const dupmobile = new FormControl('', CustomValidators.equalTo(mob));


@Component({
  selector: 'app-ledger-statement',
  templateUrl: './ledger-statement.component.html',
  styleUrls: ['./ledger-statement.component.css']
})
export class LedgerStatementComponent implements OnInit {
  searchStaff: FormControl = new FormControl();
  searchCustomer: FormControl = new FormControl();
  searchSystemAcName: FormControl = new FormControl();
  searchExpenses: FormControl = new FormControl();
  searchExpenseName: FormControl = new FormControl();
  intType=null;
  selectedSystemAcName
  selectedExpenseName
  intSystemAcNameId=null
  intExpenseNameId=null
  intExpensesId=null
  lstExpenseName=[]
  strExpenseName=''
  strSystemAcName=''
  strExpenses=''
  lstExpenses=[]
  lstSystemAc=[]
  lstStaff = []
  intStaffId;
  strStaff;
  strSelectedStaff;
  currentStaff='';
  strSelectedExpense;
  currentExpense='';
  strSelectedSystemAc;
  currentSystemAc='';
  strSelectedCustomer;
  currentCustomer='';
  lstCustom=[]
  datStartDate;
  datEndDate;
  custName = ''

  lstCustomer = []
  IntCustomerId;
  strCustomer;
  selectedCustomer;
  lstOBData=[];
  blnShowOB=true;
  dblTotOBCrDr=0
  blnOBIsCredit=false;

  strGroup = localStorage.getItem('group_name')



  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  public form: FormGroup;
  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,

    public router: Router,) {
    this.source = new LocalDataSource(this.data); // create the source
      
  }
  intBranchId=null
  source: LocalDataSource;
  data;
  blnShowData=false;
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
      // custom: [{ name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},{ name: 'downloadrecord', title: '&nbsp;&nbsp;<i class="fas fa-print"></i>'},],
      position: 'right'
    },
    rowClassFunction: (row) =>{
      if(row.data.datDate == 'Closing Balance' || row.data.datDate == 'Opening Balance'){
        return 'total';
      }else{
        return 'other';
      }
      
    },
    // valuePrepareFunction : (cell, row) => {
    //   return '<span class="align">${cell}</span>';
    //   },
    columns: {
      datDate: {
        title: 'Date',
      },
      strName: {
        title: 'Name',
      },
      dblDebit: {
        title: 'Debit',
        type:'html',
         valuePrepareFunction: function(value){
          return '<div class="text-right"> ' + value + ' </div>'
         }
      },
      dblCredit: {
        title: 'Credit',
        type:'html',
         valuePrepareFunction: function(value){
          return '<div class="text-right"> ' + value + ' </div>'
         }
      },
      strDocNumber: {
        title: 'Ref Doc No',
      },
      // fk_item__fk_product__vchr_name: {
      //   title: 'Product',
      // },
     
    },
    pager:{
      display:true,
      perPage:1000
      }
  };
  dblCredit = 0;
  dblDebit = 0;
  strTotal = '';
  ngOnInit() {
    this.dblCredit = 0;
    this.dblDebit = 0;
    this.intBranchId =Number( localStorage.BranchId);

    this.searchCustomer.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCustomer = [];
      } else {
        if (strData.length >= 7) {
          this.serviceObject
            .postData('customer/customerTypeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstCustomer = response['data'];
              }
            );

        }
      }
    }
    );
    this.searchStaff.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstStaff = [];
      } 
      else {

        if (strData.length >= 1) {
          if( this.strGroup == 'ADMIN'){


              this.serviceObject
              .postData('payment/staff_typeahead/',{term:strData,blnBranch: false })
              .subscribe(
                (response) => {
                  this.lstStaff = response['data'];
                }
              );

          }
          else {

          this.serviceObject
            .postData('payment/staff_typeahead/',{term:strData,blnBranch: this.intBranchId })
            .subscribe(
              (response) => {
                this.lstStaff = response['data'];
              }
            );
          }
      
        }
      }
    }
    );
    this.searchExpenses.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstExpenses = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('payment/expenses_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstExpenses = response['data'];
              }
            );

        }
      }
    }
    );
    this.searchExpenseName.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstExpenses = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('payment/expenses_list/',{term:strData,int_branch_id:this.intBranchId})
            .subscribe(
              (response) => {
                this.lstExpenseName = response['data'];
              }
            );

        }
      }
    }
    );
    this.searchSystemAcName.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstSystemAc = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('ledger/system_ac_typeahead/',{term:strData,int_branch_id:this.intBranchId})
            .subscribe(
              (response) => {
               
                this.lstSystemAc = response['data'];
                // console.log(this.lstSystemAc,"this.lstSystemAc")
              }
            );

        }
      }
    }
    );
  
    

    this.datStartDate=new Date();
    this.datEndDate=new Date();
    
    
    // }
  }
  CustomerChanged(item) {

    this.IntCustomerId = item.id;
    this.strCustomer = item.name;
    this.strSelectedCustomer = item.name;
  this.currentCustomer = item.name;
  }
  staffNgModelChanged(event){
    if(this.currentStaff!=this.strSelectedStaff){
      this.intStaffId = null;
      this.strStaff = '';
    }
  }
  expenseNgModelChanged(event){
    if(this.currentExpense!=this.strSelectedExpense){
      this.intExpenseNameId = null;
      this.strExpenseName=''
    }
  }

  customerNgModelChanged(event){
    if(this.currentCustomer!=this.strSelectedCustomer){
      this.IntCustomerId = null;
      this.strCustomer=''
    }
  }
  systemAcNgModelChanged(event){
    if(this.currentSystemAc!=this.strSelectedSystemAc){
      this.intSystemAcNameId = null;
      this.strSystemAcName = ''
    }
  }
  TypeChanged(item){
    if(item == 1){
      this.selectedExpenseName=''
      this.selectedSystemAcName=''
      this.strSelectedStaff =  '';
      }
    if(item== 2){
      this.selectedCustomer=''
      this.selectedExpenseName=''
      this.selectedSystemAcName=''
    }
    if(item== 3){
      this.selectedCustomer=''
      this.selectedSystemAcName=''
     
      this.strSelectedStaff =  '';
 
      }
      if(item == 4){
        this.selectedCustomer=''
        this.selectedExpenseName=''
        
        this.strSelectedStaff =  '';
        }

  }
  StaffChanged(item)
  {
   this.currentStaff = item.name;
   this.intStaffId = item.id;
   this.strStaff = item.name;
   this.strSelectedStaff = item.name;
  
    // this.selectedExpenses = '';
 
 }
//  ExpensesChanged(item){
//   this.intExpensesId = item.id;
//   this.strExpenses = item.name;

// }
expenseNameChanged(item){
  this.intExpenseNameId = item.pk_bint_id;
  this.strExpenseName= item.vchr_category;
  this.strSelectedExpense = item.vchr_category;
  this.currentExpense = item.vchr_category;
}
SystemAcChanged(item){
  this.intSystemAcNameId = item.pk_bint_id;
  this.strSystemAcName= item.vchr_acc_name;
  this.strSelectedSystemAc = item.vchr_acc_name;
  this.currentSystemAc= item.vchr_acc_name;
  
}
  
  // clearData(){

  //   if(this.mobileNumber==null){
  //     this.showData=false;
  //     return;
  //   }
  // }
  
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
    this.dblCredit = 0;
    this.dblDebit = 0;
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
    else if(!this.intType){
      this.toastr.error('Please select a Type', 'Error!');
      return false;
      
    }
    else if(this.intType==1 && !this.IntCustomerId ){
      this.toastr.error('Enter Valid Customer ', 'Error!');
      return false;
      
    }
    else if(this.intType==2 && !this.intStaffId){
      this.toastr.error('Enter Valid Staff ', 'Error!');
      return false;
      
    }
    else if(this.intType==3 && !this.intExpenseNameId ){
      this.toastr.error('Enter Valid Expense Name ', 'Error!');
      return false;
      
    }
    else if(this.intType==4 && !this.intSystemAcNameId){
      this.toastr.error('Enter Valid System A/c ', 'Error!');
      return false;
      
    }
    dctData['intType']=this.intType;
    if(this.intType == 1){
      dctData['userId']=this.IntCustomerId;
      }
    if(this.intType == 2){
      
    dctData['userId']=this.intStaffId
    }
    if(this.intType == 3){
      dctData['userId']=this.intExpenseNameId
      }
      if(this.intType == 4){
        dctData['userId']=this.intSystemAcNameId
        }
      
    this.spinnerService.show();

    this.serviceObject.postData('ledger/ledger_view/',dctData).subscribe(
      (response) => {
        this.spinnerService.hide();

          if (response.status == 1)
          {
            this.data=[];
            this.lstOBData =[];
            this.dblTotOBCrDr = response['dblTotCrDr'];
            this.blnOBIsCredit = response['bln_ob_is_credit'];
            if(this.blnOBIsCredit == true &&  this.dblTotOBCrDr!=0 ){
              this.lstOBData = [{strDocNumber:'',dblCredit:this.dblTotOBCrDr+" Cr",dblDebit:'',datDate:'Opening Balance',strName:''}]
            }else if (this.blnOBIsCredit == false &&  this.dblTotOBCrDr!=0){
              this.lstOBData = [{strDocNumber:'',dblCredit:'',dblDebit:this.dblTotOBCrDr+" Dr",datDate:'Opening Balance',strName:''}];
            }
            if(this.blnShowOB){
              this.data =this.lstOBData.concat(response['data']);
            }else{
              this.data =response['data'];
            }
            if(this.data.length>0){
              this.blnShowData=true;
              this.dblCredit = 0;
              this.dblDebit = 0;
              this.data.forEach(element => {
                if(element['datDate']!='Opening Balance'){
                  this.dblCredit += element['dblCredit']
                  this.dblDebit += element['dblDebit']
                }
                
              });
              if(this.blnOBIsCredit == true && this.blnShowOB){
                this.dblCredit +=this.dblTotOBCrDr
              }else if(this.blnOBIsCredit == false && this.blnShowOB){
                this.dblDebit +=this.dblTotOBCrDr
              }
             let dblTotalAmt = 0;
             dblTotalAmt = Number((this.dblCredit-this.dblDebit).toFixed(2));

             if(dblTotalAmt>0){
               
               this. strTotal = '';
               this.strTotal = dblTotalAmt+" Cr"

               this.data.push({strDocNumber:'',dblCredit:this.strTotal,dblDebit:'',datDate:'Closing Balance',strName:''})
             } else if(dblTotalAmt<0){
              this.strTotal = Math.abs(dblTotalAmt)+" Dr"
              this.data.push({strDocNumber:'',dblCredit:'',dblDebit:this.strTotal,datDate:'Closing Balance',strName:''})
             } else{
              this.strTotal = "";
             }
      console.log(this.strTotal,"3d");
             
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
showOB(){
  this.blnShowOB!=this.blnShowOB;
  if(this.blnShowOB== false && this.lstOBData.length!=0){
    this.data.splice(0, 1);
    this.data.splice((this.data.length-1), 1);
    if(this.data.length>0){
    let dblTotalAmt = 0;
    
    dblTotalAmt =Number((this.dblCredit-this.dblDebit).toFixed(2));
    if(dblTotalAmt>0){
      this. strTotal = '';      
      this.strTotal = dblTotalAmt+" Cr"
      this.data.push({strDocNumber:'',dblCredit:this.strTotal,dblDebit:'',datDate:'Closing Balance',strName:''})
    } else if(dblTotalAmt<0){
    this.strTotal = Math.abs(dblTotalAmt)+" Dr"
    this.data.push({strDocNumber:'',dblCredit:'',dblDebit:this.strTotal,datDate:'Closing Balance',strName:''})
    } else{
    this.strTotal = "";
    }
    console.log(this.strTotal,"1d");
  }
    this.source = new LocalDataSource(this.data); 
  }else if(this.blnShowOB== true && this.lstOBData.length!=0){
    this.data.splice((this.data.length-1), 1);
    this.data =this.lstOBData.concat(this.data);
    this.dblCredit = 0;
    this.dblDebit = 0;
    this.data.forEach(element => {
      if(element['datDate']!='Opening Balance'){
        this.dblCredit += element['dblCredit']
        this.dblDebit += element['dblDebit']
      }
      
    });
    if(this.blnOBIsCredit == true && this.blnShowOB){
      this.dblCredit +=this.dblTotOBCrDr
    }else if(this.blnOBIsCredit == false && this.blnShowOB){
      this.dblDebit +=this.dblTotOBCrDr
    }
   let dblTotalAmt = 0;
   dblTotalAmt = Number((this.dblCredit-this.dblDebit).toFixed(2));
   if(dblTotalAmt>0){
    this. strTotal = '';     
     this.strTotal = dblTotalAmt+" Cr"

     this.data.push({strDocNumber:'',dblCredit:this.strTotal,dblDebit:'',datDate:'Closing Balance',strName:''})
   } else if(dblTotalAmt<0){
    this.strTotal = Math.abs(dblTotalAmt)+" Dr"
    this.data.push({strDocNumber:'',dblCredit:'',dblDebit:this.strTotal,datDate:'Closing Balance',strName:''})
   } else{
    this.strTotal = "";
   }
   console.log(this.strTotal,"2d");

    this.source = new LocalDataSource(this.data); 
  }
  
}
}
