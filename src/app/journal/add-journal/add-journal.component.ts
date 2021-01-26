
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit , ViewChild ,HostListener} from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as moment from 'moment' ;
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-journal',
  templateUrl: './add-journal.component.html',
  styleUrls: ['./add-journal.component.css']
})
export class AddJournalComponent implements OnInit {

  datIssue ;

  searchBranch: FormControl = new FormControl();
  selectedBranch='';
  lstBranch=[];
  intBranchId=null;
  strBranch='';

  searchCreditBranch: FormControl = new FormControl();
  lstCreditBranch = []
  intCreditBranchId = null;
  strCreditBranch = '';
  selectedCreditBranch = '';
  
  saveDisable=false;

  strDebitAccount = '';
  strCreditAccount = '';
  intAmount = null;
  strRemarks = '';
  intDebitType = null;
  intCreditType = null;


  searchExpenseName: FormControl = new FormControl();
  selectedExpenseName = '';
  intExpenseNameId=null
  lstExpenseName=[]
  strExpenseName=''

  searchCreditExpenseName: FormControl = new FormControl();
  selectedCreditExpenseName = ''
  intCreditExpenseNameId=null
  lstCreditExpenseName=[]
  strCreditExpenseName=''


  searchExpenses: FormControl = new FormControl();
  selectedExpenses=''
  strExpenses=''
  lstExpenses=[];
  intExpensesId=null

  searchCreditExpenses: FormControl = new FormControl();
  selectedCreditExpenses=''
  strCreditExpenses=''
  lstCreditExpenses=[];
  intCreditExpensesId=null

  searchCustomer: FormControl = new FormControl();
  selectedCustomer='';
  intCustomerId = null;
  strCustomer=''
  lstCustomer=[];

  searchCreditCustomer: FormControl = new FormControl();
  selectedCreditCustomer='';
  intCreditCustomerId = null;
  strCreditCustomer=''
  lstCreditCustomer=[];

  searchVentor: FormControl = new FormControl();
  intVentorId = null;
  strVentor = '';
  selectedVentor = '';
  lstVentor = [];


  searchCreditVentor: FormControl = new FormControl();
  intCreditVentorId = null;
  strCreditVentor = '';
  selectedCreditVentor = '';
  lstCreditVentor = [];

  searchStaff: FormControl = new FormControl();
  lstStaff = []
  intStaffId;
  strStaff = '';
  strSelectedStaff = '';
  currentStaff='';

  searchCreditStaff: FormControl = new FormControl();
  lstCreditStaff = []
  intCreditStaffId;
  strCreditStaff = '';
  strSelectedCreditStaff = '';
  currentCreditStaff='';

  // SYSTEM ACCOUNT DEBIT
  intDebitSystemAcNameId = null
  strDebitSystemAcName = ''
  strDebitSelectedSystemAc ;
  currentDebitSystemAc= ''
  lstDebitSystemAc = []
  searchDebitSystemAcName: FormControl = new FormControl();

  intCreditSystemAcNameId = null
  strCreditSystemAcName= ''
  strCreditSelectedSystemAc ;
  currentCreditSystemAc= ''
  lstCreditSystemAc = [];
  searchCreditSystemAcName: FormControl = new FormControl();




  @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
    this.disableScroll(event);
  }

  @HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: any) {
    this.disableScroll(event);
  }

  @HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: any) {
    this.disableScroll(event);
  }

  constructor(
    private serviceObject: ServerService,
    private toastr: ToastrService,
    public router: Router,
  ) { }

  ngOnInit() {

    this.datIssue=new Date();


    this.searchBranch.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstBranch = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('branch/branch_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstBranch = response['data'];
              }
            );

        }
      }
    }
    );
    //credit branch
    this.searchCreditBranch.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCreditBranch = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('branch/branch_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstCreditBranch = response['data'];
              }
            );

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

    this.searchCreditExpenses.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCreditExpenses = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('payment/expenses_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstCreditExpenses = response['data'];
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
        this.lstExpenseName = [];
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


    this.searchCreditExpenseName.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCreditExpenseName = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('payment/expenses_list/',{term:strData,int_branch_id:this.intBranchId})
            .subscribe(
              (response) => {
                this.lstCreditExpenseName = response['data'];
              }
            );

        }
      }
    }
    );

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


    this.searchCreditCustomer.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCreditCustomer = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('customer/customerTypeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstCreditCustomer = response['data'];
              }
            );

        }
      }
    }
    );


    this.searchVentor.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstVentor = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('supplier/supplier_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstVentor = response['data'];
              }
            );

        }
      }
    }
    );

    this.searchCreditVentor.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCreditVentor = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('supplier/supplier_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstCreditVentor = response['data'];
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
      } else {
        if (strData.length >= 1) {
       
          this.serviceObject
            .postData('user/user_typeahead/',{terms:strData})
            .subscribe(
              (response) => {
                this.lstStaff = response['data'];
              }
            );
          }
        }
      }
    );
      //JOURNAL NEW CHANGE
    this.searchDebitSystemAcName.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstDebitSystemAc = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('ledger/system_ac_typeahead/',{term:strData,int_branch_id:this.intBranchId})
            .subscribe(
              (response) => {
               
                this.lstDebitSystemAc = response['data'];
                // console.log(this.lstSystemAc,"this.lstSystemAc")
              }
            );

        }
      }
    }
    );

    this.searchCreditSystemAcName.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCreditSystemAc = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('ledger/system_ac_typeahead/',{term:strData,int_branch_id:this.intBranchId})
            .subscribe(
              (response) => {
               
                this.lstCreditSystemAc = response['data'];
                // console.log(this.lstSystemAc,"this.lstSystemAc")
              }
            );

        }
      }
    }
    );


    this.searchCreditStaff.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCreditStaff = [];
      } else {
        if (strData.length >= 1) {
       
          this.serviceObject
            .postData('user/user_typeahead/',{terms:strData})
            .subscribe(
              (response) => {
                this.lstCreditStaff = response['data'];
              }
            );
          }
        }
      }
    );
  }


  BranchChanged(item){
    this.intBranchId = item.id;
    this.strBranch = item.name;
    this.selectedBranch== item.name;
  
  }

  //new feature credit branch

  BranchChangedCredit(item){
    this.intCreditBranchId = item.id;
    this.strCreditBranch = item.name;
    this.selectedCreditBranch== item.name;
  
  }

  debitTypeChanged(){

  }

  creditTypeChanged(){

  }

  disableScroll(event: any) {
    if (event.srcElement.type === "number")
        event.preventDefault();
  }

  expenseNameChanged(item){
    this.intExpenseNameId = item.pk_bint_id;
    this.strExpenseName= item.vchr_category;
   
    
  }
  creditExpenseNameChanged(item){
    this.intCreditExpenseNameId = item.pk_bint_id;
    this.strCreditExpenseName= item.vchr_category;
  }

  ExpensesChanged(item){
    this.intExpensesId = item.id;
    this.strExpenses = item.name;
    // this.intCustomerId = null;
    // this.strCustomer = '';
    // this.intStaffId = null;
    // this.selectedStaff =  '';
    // this.selectedCustomer = '';
    
  }
  creditExpensesChanged(item){
    this.intCreditExpensesId = item.id;
    this.strCreditExpenses = item.name;
    // this.intCustomerId = null;
    // this.strCustomer = '';
    // this.intStaffId = null;
    // this.selectedStaff =  '';
    // this.selectedCustomer = '';
    
  }


  CustomerChanged(item){
    
    this.intCustomerId = item.id;
    this.strCustomer = item.name;
    // this.intStaffId = null;
    // this.intExpensesId = null;
    // this.strExpenses = '';
    // this.selectedStaff =  '';
    // this.selectedExpenses = '';
    // this.intContactNo = item.phone;

  //   if (this.intPayeeType == 1) {
      
  //     let dctReceiptData = {}
  //     dctReceiptData['intCustomerMob']=this.intContactNo;
  //     this.serviceObject.postData('receipt/receipt_list/',dctReceiptData).subscribe(res => {

  //       if (res.status == 1)
  //       {
  //       this.blnReceipt = res['bln_receipt'];
  //       // this.blnReceiptDisable = res['bln_receipt'];
  //       this.lstReceipt = res['lst_receipt'];
  //       // this.intReceiptTot = res['receipt_tot'];
  //       this.dataSource1 = new MatTableDataSource(this.lstReceipt);
  //       if (!this.blnReceipt){
  //         this.toastr.warning('Customer has no any receipt exists', 'Warning!'); 
  //       }

  //       }
  //       else if (res.status == 0) {
  //         swal.fire('Error!','Something went wrong!!', 'error');
  //         // this.lstItemDetails=[]
  //         // this.preItemList=[];
  //       }
  //   },
  //   (error) => {
  //     swal.fire('Error!','Server Error!!', 'error');
  //   });

  //  }



  }
  // ----------------------journal new features------------------------------------------------
  //DEBIT TYPE
  SystemDebitAcChanged(item){
    this.intDebitSystemAcNameId = item.pk_bint_id;
    this.strDebitSystemAcName= item.vchr_acc_name;
    this.strDebitSelectedSystemAc = item.vchr_acc_name;
    this.currentDebitSystemAc= item.vchr_acc_name;
    
  }

  systemAcNgModelChangedDebit(event){
    if(this.currentDebitSystemAc!=this.strDebitSelectedSystemAc){
      this.intDebitSystemAcNameId = null;
      this.strDebitSystemAcName = ''
    }
  }
  //CREDIT TYPE
  SystemCreditAcChanged(item){
    this.intCreditSystemAcNameId = item.pk_bint_id;
    this.strCreditSystemAcName= item.vchr_acc_name;
    this.strCreditSelectedSystemAc = item.vchr_acc_name;
    this.currentCreditSystemAc= item.vchr_acc_name;
    
  }

  systemAcNgModelChangedCredit(event){
    if(this.currentDebitSystemAc!=this.strDebitSelectedSystemAc){
      this.intDebitSystemAcNameId = null;
      this.strDebitSystemAcName = ''
    }
  }


  



  // -------------------------------------------------------------------------------------------

  creditCustomerChanged(item){
    this.intCreditCustomerId = item.id;
    this.strCreditCustomer = item.name;
  }

  VentorChanged(item){
    
    this.intVentorId = item.id;
    this.strVentor = item.name;
    // this.intStaffId = null;
    this.intExpensesId = null;
    this.strExpenses = '';
    // this.selectedStaff =  '';
    this.selectedExpenses = '';
    // this.intContactNo = null;
    this.selectedCustomer = '';
    this.selectedExpenses = '';

  }
  creditVentorChanged(item){
    this.intCreditVentorId = item.id;
    this.strCreditVentor = item.name;
    // this.intStaffId = null;
    this.intCreditExpensesId = null;
    this.strCreditExpenses = '';
    // this.selectedStaff =  '';
    this.selectedCreditExpenses = '';
    // this.intContactNo = null;
    this.selectedCreditCustomer = '';
    this.selectedCreditExpenses = '';
  }

  StaffNgModelChanged(event){
    if(this.currentStaff!=this.strSelectedStaff){
      this.intStaffId = null;
      this.strStaff = '';
    }
  }
  StaffChanged(item)
  {
   this.currentStaff = item.strUserName;
   this.intStaffId = item.intId;
   this.strStaff = item.strUserName;
   this.strSelectedStaff = item.strUserName;
 
 }


 creditStaffNgModelChanged(event){
  if(this.currentCreditStaff!=this.strSelectedCreditStaff){
    this.intCreditStaffId = null;
    this.strCreditStaff = '';
  }
}
creditStaffChanged(item)
{
 this.currentCreditStaff = item.strUserName;
 this.intCreditStaffId = item.intId;
 this.strCreditStaff = item.strUserName;
 this.strSelectedCreditStaff = item.strUserName;

}


  saveJournal(){

    this.saveDisable=true;

    const dctData = {};
    let blnError = false;
    let date = moment(this.datIssue).format('YYYY-MM-DD')

    if(this.selectedCreditBranch == this.selectedBranch){
      if(this.intDebitType == 5 && this.intCreditType == 5){
        this.toastr.error('Cannot choose same debit source and credit source', 'Error!');
        blnError = true;
        this.saveDisable=false;
        return false;
      }
      if(this.intDebitType == 6 && this.intCreditType == 6){
        this.toastr.error('Cannot choose same debit source and credit source', 'Error!');
        blnError = true;
        this.saveDisable=false;
        return false;
      }
      if(this.intDebitType == 7 && this.intCreditType == 7){
        if(this.intCreditSystemAcNameId == this.intDebitSystemAcNameId){
          this.toastr.error('Cannot choose same debit source and credit source', 'Error!');
          blnError = true;
          this.saveDisable=false;
          return false;
        }
        }
      if(this.intDebitType == 1 && this.intCreditType == 1){
        if(this.intCreditCustomerId == this.intCustomerId){
          this.toastr.error('Cannot choose same debit source and credit source', 'Error!');
          blnError = true;
          this.saveDisable=false;
          return false;
        }
      }
      if(this.intDebitType == 2 && this.intCreditType == 2){
        if(this.intCreditStaffId == this.intStaffId){
          this.toastr.error('Cannot choose same debit source and credit source', 'Error!');
          blnError = true;
          this.saveDisable=false;
          return false;
        }
      }
      if(this.intDebitType == 3 && this.intCreditType == 3){
        if(this.intExpenseNameId == this.intCreditExpenseNameId){
          this.toastr.error('Cannot choose same debit source and credit source', 'Error!');
          blnError = true;
          this.saveDisable=false;
          return false;
        }
      }
      if(this.intDebitType == 4 && this.intCreditType == 4){
        if(this.intCreditVentorId == this.intVentorId){
          this.toastr.error('Cannot choose same debit source and credit source', 'Error!');
          blnError = true;
          this.saveDisable=false;
          return false;
        }
      }
        
    }
    

    if(this.selectedBranch == ''){
      this.toastr.error('Valid branch is required', 'Error!');
      blnError = true;
      this.saveDisable=false;
      return false;
    }
     if(this.selectedBranch && (this.strBranch != this.selectedBranch)){
      this.toastr.error('Valid branch is required', 'Error!');
      blnError = true;
      this.saveDisable=false;
      return false;
    }
    //credit branch
    if(this.selectedCreditBranch == ''){
      this.toastr.error('Valid branch is required', 'Error!');
      blnError = true;
      this.saveDisable=false;
      return false;
    }
     if(this.selectedCreditBranch && (this.strCreditBranch != this.selectedCreditBranch)){
      this.toastr.error('Valid branch is required', 'Error!');
      blnError = true;
      this.saveDisable=false;
      return false;
    }
    if(this.intDebitType == null){
       this.toastr.error('Select valid debit type', 'Error!');
       blnError = true;
       this.saveDisable=false;
        return false;
    }

    if(this.intDebitType == 3){
        if(this.selectedExpenseName == ''){
          this.toastr.error('Valid debit expense name is required', 'Error!');
          blnError = true;
          this.saveDisable=false;
          return false;
        }
        else if(this.selectedExpenseName && (this.selectedExpenseName != this.strExpenseName)){
          this.toastr.error('Valid debit expense name is required', 'Error!');
          blnError = true;
          this.saveDisable=false;
          return false;
        }
        // else if(this.selectedExpenses == ''){
        //   this.toastr.error('Valid Debit payee is required', 'Error!');
        //   blnError = true;
        //   return false;
        // }
     }
     if(this.intDebitType == 1){
       if(this.selectedCustomer  == ''){
        this.toastr.error('Valid customer name is required', 'Error!');
        blnError = true;
        this.saveDisable=false;
        return false;
       }
       else if(this.selectedCustomer && (this.selectedCustomer != this.strCustomer )){
        this.toastr.error('Valid customer name is required', 'Error!');
        blnError = true;
        this.saveDisable=false;
        return false;
       }
     }
     if(this.intDebitType == 4){
      if(this.selectedVentor  == ''){
        this.toastr.error('Valid vendor name is required', 'Error!');
        blnError = true;
        this.saveDisable=false;
        return false;
       }
       else if(this.selectedVentor && (this.selectedVentor != this.strVentor )){
        this.toastr.error('Valid vendor name is required', 'Error!');
        blnError = true;
        this.saveDisable=false;
        return false;
       }

     }
    if(this.intDebitType == 2){
      if(this.strSelectedStaff  == ''){
        this.toastr.error('Valid staff name is required', 'Error!');
        blnError = true;
        this.saveDisable=false;
        return false;
       }
       else if(this.strSelectedStaff && (this.strSelectedStaff != this.strStaff )){
        this.toastr.error('Valid staff name is required', 'Error!');
        blnError = true;
        this.saveDisable=false;
        return false;
       }

     }
     //new debit type System A/c
     if(this.intDebitType == 7){
      if(this.strDebitSelectedSystemAc  == ''){
        this.toastr.error('Valid vendor name is required', 'Error!');
        blnError = true;
        this.saveDisable=false;
        return false;
       }
       else if(this.strDebitSelectedSystemAc && (this.strDebitSelectedSystemAc != this.strDebitSystemAcName )){
        this.toastr.error('Valid vendor name is required', 'Error!');
        blnError = true;
        this.saveDisable=false;
        return false;
       }

     }
    if(this.intCreditType == null){
      this.toastr.error('Select valid credit type', 'Error!');
      blnError = true;
      this.saveDisable=false;
       return false;
    }
    if(this.intCreditType == 3){
      if(this.selectedCreditExpenseName == ''){
        this.toastr.error('Valid credit expense name is required', 'Error!');
        blnError = true;
        this.saveDisable=false;
        return false;
      }
      else if(this.selectedCreditExpenseName && (this.selectedCreditExpenseName != this.strCreditExpenseName)){
        this.toastr.error('Valid credit expense name is required', 'Error!');
        blnError = true;
        this.saveDisable=false;
        return false;
      }
      // else if(this.selectedExpenses == ''){
      //   this.toastr.error('Valid credit payee is required', 'Error!');
      //   blnError = true;
      //   return false;
      // }
   }
    if(this.intCreditType == 1){
    if(this.selectedCreditCustomer  == ''){
     this.toastr.error('Valid Credit customer name is required', 'Error!');
     blnError = true;
     this.saveDisable=false;
     return false;
    }
    else if(this.selectedCreditCustomer && (this.selectedCreditCustomer != this.strCreditCustomer )){
     this.toastr.error('Valid Credit customer name is required', 'Error!');
     blnError = true;
     this.saveDisable=false;
     return false;
    }
  }
   if(this.intCreditType == 4){
    if(this.selectedCreditVentor  == ''){
      this.toastr.error('Valid Credit vendor name is required', 'Error!');
      blnError = true;
      this.saveDisable=false;
      return false;
     }
     else if(this.selectedCreditVentor && (this.selectedCreditVentor != this.strCreditVentor )){
      this.toastr.error('Valid Credit vendor name is required', 'Error!');
      blnError = true;
      this.saveDisable=false;
      return false;
     }

   }
   if(this.intCreditType == 2){
    if(this.strSelectedCreditStaff  == ''){
      this.toastr.error('Valid staff name is required', 'Error!');
      blnError = true;
      this.saveDisable=false;
      return false;
     }
     else if(this.strSelectedCreditStaff && (this.strSelectedCreditStaff != this.strCreditStaff )){
      this.toastr.error('Valid staff name is required', 'Error!');
      blnError = true;
      this.saveDisable=false;
      return false;
     }

   }
  //  credit- system a/c
   if(this.intCreditType == 7){
    if(this.strCreditSelectedSystemAc  == ''){
      this.toastr.error('Valid vendor name is required', 'Error!');
      blnError = true;
      this.saveDisable=false;
      return false;
     }
     else if(this.strCreditSelectedSystemAc && (this.strCreditSelectedSystemAc != this.strCreditSystemAcName )){
      this.toastr.error('Valid vendor name is required', 'Error!');
      blnError = true;
      this.saveDisable=false;
      return false;
     }

   }

   



     if(this.intAmount == null){
      this.toastr.error('Amount is required', 'Error!');
      blnError = true;
      this.saveDisable=false;
      return false;
    }
   
    else if(this.strRemarks == ''){
      this.toastr.error('Remarks is required', 'Error!');
      blnError = true;
      this.saveDisable=false;
      return false;
    }

    // if(blnError){
      dctData['datJournal'] = date;
      dctData['intDebitBranchId'] = this.intBranchId;
      dctData['intDebitType'] = this.intDebitType;
      dctData['intCreditBranchId'] = this.intCreditBranchId;
      dctData['intCreditType'] = this.intCreditType;
      dctData['intAmount'] = this.intAmount;
      dctData['strRemarks'] = this.strRemarks;
      if(this.intDebitType == 3){
      
        dctData['intDebitId'] = this.intExpenseNameId;
        // dctData['intDebitExpensePayeeId'] = this.intExpensesId;
      }
      if(this.intDebitType ==1){
       
        dctData['intDebitId'] = this.intCustomerId;
      }
      if(this.intDebitType ==4){
        dctData['intDebitId'] = this.intVentorId;
      }
      if(this.intDebitType ==2){
        dctData['intDebitId'] = this.intStaffId;
      }if(this.intDebitType == 5 || this.intDebitType == 6){
        dctData['intDebitId'] = null;
      }
      if(this.intDebitType ==7){
        dctData['intDebitId'] = this.intDebitSystemAcNameId;
      }

      //credit data
      if(this.intCreditType == 3){
      
        dctData['intCreditId'] = this.intCreditExpenseNameId;
        // dctData['intCreditExpensePayeeId'] = this.intCreditExpensesId;
      }
      if(this.intCreditType ==1){
       
        dctData['intCreditId'] = this.intCreditCustomerId;
      }
      if(this.intCreditType ==4){
        dctData['intCreditId'] = this.intCreditVentorId;
      }
      if(this.intCreditType ==2){
        dctData['intCreditId'] = this.intCreditStaffId;
      }
      if(this.intCreditType ==5 || this.intCreditType ==6){
        dctData['intCreditId'] = null;
      }
      if(this.intCreditType ==7){
        dctData['intCreditId'] = this.intCreditSystemAcNameId;
      }
  


   this.serviceObject.postData('transaction/journal/',dctData).subscribe(res => {

          if (res.status == 1)
          {
            swal.fire('Success','Journal successfully added', 'success');
            this.router.navigate(['journal/listjournal']);
  
          }
          else if (res.status == 0) {
            this.saveDisable=false;
            swal.fire('Error!','Something went wrong!!', 'error');
       
          }
      },
      (error) => {
        this.saveDisable=false;
        swal.fire('Error!','Server Error!!', 'error');
      });
   


  }

  clearFields(form: NgForm){
    this.strBranch = '';
    this.selectedBranch = '';
    this.intBranchId = null;
    this.intDebitType = null;
    this.strDebitAccount = '';
    this.intCreditType = null;
    this.strCreditAccount = '';
    this.intAmount = null;
    this.strRemarks = '';

    form.resetForm();
    this.datIssue = new Date()
  }

}
