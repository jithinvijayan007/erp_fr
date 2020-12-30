import { Component, OnInit , ViewChild} from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as moment from 'moment' ;
import { MatTableDataSource } from '@angular/material/table';
import Swal from "sweetalert2"

@Component({
  selector: 'app-editpayment',
  templateUrl: './editpayment.component.html',
  styleUrls: ['./editpayment.component.css']
})
export class EditpaymentComponent implements OnInit {

  showClosed

  fopSelected=''
  intPayeeType=null
  selectedBranch=''
  lstBranch=[]
  strCustomer=''
  lstCustomer=[]
  strStaff=''
  lstStaff=[]
  strExpenses=''
  lstExpenses=[]
  intAmount=null
  strRemarks=''
  datIssue=new Date()
  searchStaff: FormControl = new FormControl();
  searchBranch: FormControl = new FormControl();
  searchCustomer: FormControl = new FormControl();
  searchExpenses: FormControl = new FormControl();
  selectedStaff=''
  selectedCustomer=''
  selectedExpenses=''
  intCustomerId
  intStaffId=null
  intBranchId=null
  strBranch=''
  intExpensesId=null
  editId=localStorage.getItem('paymentEditId');
  data=[]
  lstReceipt = [];
  intReceiptTot = null;
  intContactNo = null;
  dctEnteredAmount = {}; 

  lstBank= []
  intBank = null
  lstNotes=[];
  lstDenominations=[]
  dataSource=new MatTableDataSource(this.lstDenominations)
  lstDisplayedColumns=['denomination','noNotes','total','action'];


  dataSource1=new MatTableDataSource(this.lstReceipt)
  lstDisplayedColumns1=['receiptName','receiptAmount','amount'];
  disableStatus=[]
  validationStatus=true;
  blnShowDenominations=false;
  blnReceipt =false;
  strGroup = localStorage.getItem('group_name')
  searchExpenseName: FormControl = new FormControl();
 
   selectedExpenseName
   intExpenseNameId=null
   lstExpenseName=[]
   strExpenseName=''
  
  constructor(private serviceObject: ServerService,private toastr: ToastrService,private formBuilder: FormBuilder,public router: Router){ }
  
  ngOnInit() {
    if (localStorage.getItem('paymentRequestData')) {
      localStorage.setItem('paymentCustomerNumberStatus', '1');
    }

    // List of Banks 
    this.serviceObject.getData('payment/bank_list/').subscribe(res => {
      if (res.status == 1) {
        this.lstBank = res['data']
      }
      else if (res.status == 0) {
        swal.fire('Error!', 'Something went wrong!!', 'error');
      }
    },
      (error) => {
        swal.fire('Error!', 'Server Error!!', 'error');
      });


    this.intBranchId =Number( localStorage.BranchId);
    this.strBranch = localStorage.BranchName;
    this.selectedBranch = localStorage.BranchName;
    this.searchStaff.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstStaff = [];
        } else {
          if (strData.length >= 1) {
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
      );
      this.searchCustomer.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstStaff = [];
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
      this.searchExpenseName.valueChanges
         .debounceTime(400)
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
      this.searchExpenses.valueChanges
      .debounceTime(400)
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
      this.searchBranch.valueChanges
      .debounceTime(400)
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
    this.getData()
      
  }

  getData()
  {
    
    this.serviceObject.postData('payment/view_payment/',{'strDocNo':this.editId}).subscribe(
      (response) => {
          if (response.status == 1)
          {
            this.data=response['data'][0];

            
            this.datIssue = this.data['dat_payment']
 

            this.fopSelected = this.data['int_fop']
            this.intPayeeType = this.data['int_payee_type']

            this.selectedBranch = this.data['fk_branch__vchr_name']
            this.intBranchId = this.data['fk_branch_id']
            this.strBranch = this.data['fk_branch__vchr_name']
          
            if(this.intPayeeType==1)
            {
              this.intCustomerId = this.data['fk_payee_id']
              this.strCustomer = this.data['str_payee_name']
              this.selectedCustomer= this.data['str_payee_name']
              this.intContactNo = this.data['str_cust_mobile'];
              this.lstReceipt = this.data['lst_receipt'];
              this.blnReceipt = this.data['bln_receipt'];
              this.dataSource1 = new MatTableDataSource(this.lstReceipt);

            }
            else if(this.intPayeeType==2)
            {
              this.intStaffId = this.data['fk_payee_id']
            this.strStaff = this.data['str_payee_name']
            this.selectedStaff = this.data['str_payee_name']
            }
            else if(this.intPayeeType == 3)
            {
              this.intExpensesId = this.data['fk_payee_id']
              this.strExpenses =this.data['str_payee_name']
              this.selectedExpenses =this.data['str_payee_name']
              this.selectedExpenseName=this.data['fk_accounts_map__vchr_category']
            }
            else{
              this.intBank = this.data['fk_payee_id']
              this.lstDenominations = this.data['dct_denomination'];
              this.dataSource=new MatTableDataSource(this.lstDenominations)
              this.blnShowDenominations=true;
              this.payeeTypeChanged();
            }
            

            this.intAmount = this.data['dbl_amount']
            this.strRemarks = this.data['vchr_remarks']
            // this.receiptList(this.intContactNo);
            

          }  
          else if (response.status == 0) 
          {
         
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
      });
  }

  fopchange(fopSelected){

  }

  BranchChanged(item){
    this.intBranchId = item.id;
    this.strBranch = item.name;
    this.selectedBranch== item.name;
    this.selectedExpenseName=''
    this.intExpenseNameId=null
    this.lstExpenseName=[]
    this.strExpenseName=''
  }
  
   expenseNameChanged(item){
     this.intExpenseNameId = item.pk_bint_id;
     this.strExpenseName= item.vchr_category;
 
 
   }
  CustomerChanged(item){
    
    this.intCustomerId = item.id;
    this.strCustomer = item.name;
    this.intStaffId = null;
    this.intExpensesId = null;
    this.strExpenses = '';
    this.selectedStaff =  '';
    this.selectedExpenses = '';
    this.intContactNo = item.phone;

   this.receiptList(this.intContactNo);


    
  }

  StaffChanged(item){
    this.intStaffId = item.id;
    this.strStaff = item.name;
    this.intCustomerId = null;
    this.strCustomer = '';
    this.intExpensesId = null;
    this.strExpenses = '';
    this.selectedCustomer = '';
    this.selectedExpenses = '';
    
  }
  
  ExpensesChanged(item){
    this.intExpensesId = item.id;
    this.strExpenses = item.name;
    this.intCustomerId = null;
    this.strCustomer = '';
    this.intStaffId = null;
    this.selectedStaff =  '';
    this.selectedCustomer = '';
    
  }
    
  updatePayment(){
    let date = moment(this.datIssue).format('YYYY-MM-DD')
    let dctData = {}
    let error = false
    if (!this.datIssue) {
      this.toastr.error('Select a date', 'Error!');
      // this.idEfectiveDate.nativeElement.focus();
      error = true
      return false;
    }
    else if (!this.fopSelected) {
      this.toastr.error('Select a FOP', 'Error!');
      // this.idEfectiveDate.nativeElement.focus();
      error = true
      return false;
    }
    else if (!this.intPayeeType) {
      this.toastr.error('Select a payee type ', 'Error!');
      error = true
    }
    else if (!this.selectedBranch || this.selectedBranch != this.strBranch) {
      this.toastr.error('Valid branch is required ', 'Error!');
      error = true
      this.intBranchId = null
      this.selectedBranch = ''
      this.strBranch = ''
      return;
    }
    else if (this.intPayeeType) {

      if(this.intPayeeType==4 ){
        this.Validatedenomination();
        
        if(!this.validationStatus){
          error=true;
          return;
        }
        else{
          error=false;
          
        }
      }
      if (this.intPayeeType == 1 && ((!this.selectedCustomer || this.strCustomer != this.selectedCustomer))) {
        this.toastr.error('Valid customer is required ', 'Error!');
        error = true
        this.intCustomerId = null
        this.strCustomer = ''
        this.selectedCustomer = ''
        return;
      }
      else if (this.intPayeeType == 2 && ((!this.selectedStaff || this.strStaff != this.selectedStaff))) {
        this.toastr.error('Valid staff name is required ', 'Error!');
        error = true
        this.intStaffId = null
        this.strStaff = ''
        this.selectedStaff = ''
        return;
      }
      else if (this.intPayeeType == 3 && ((!this.selectedExpenses || this.strExpenses != this.selectedExpenses))) {
        this.toastr.error('Valid Payee is required ', 'Error!');
        error = true
        this.intExpensesId = null
        this.strExpenses = ''
        this.selectedExpenses = ''
        return;
      }
      else if (this.intPayeeType == 4 && (!this.intBank || this.intBank == null)) {
        this.toastr.error('Valid Bank is required ', 'Error!');
        error = true
        this.intBank = null
        return;
      }
      else if (this.intPayeeType==3 && ((!this.selectedExpenseName || this.strExpenseName!= this.selectedExpenseName))){
        this.toastr.error('Valid Expense Name is required ','Error!');
        error=true
        this.intExpenseNameId = null
        this.strExpenseName = ''
        this.selectedExpenseName=''
        return;
      }
      else if (!this.intAmount || this.intAmount < 0) {
        this.toastr.error('Valid Amount is required ', 'Error!');
        error = true
        return
      }
      else if (this.fopSelected=='1' && this.intAmount>10000) {
        this.toastr.error('Cash Amount Limited to 10000', 'Error!');
        // this.toastr.error('Valid Amount is required ','Error!');
        error=true
        return
      }
      else if (!this.strRemarks) {
        this.toastr.error('Remarks is required ', 'Error!');
        error = true
        return;
      }

      else if (!error) {
        dctData['intPayeeType'] = this.intPayeeType
        dctData['intAmount'] = this.intAmount
        dctData['strRemarks'] = this.strRemarks

        if (this.intPayeeType == 1) {
          dctData['intPayeeId'] = this.intCustomerId
        }
        else if (this.intPayeeType == 2) {
          dctData['intPayeeId'] = this.intStaffId
        }
        else if (this.intPayeeType == 3) {
          dctData['intPayeeId'] = this.intExpensesId
        }
        else if (this.intPayeeType == 4) {
          dctData['intPayeeId'] = this.intBank;
          dctData['lstDenominations'] =this.lstDenominations
        }

        dctData['intBranchId'] = this.intBranchId
        dctData['strBranch'] = this.strBranch
        dctData['fopSelected'] = this.fopSelected
        dctData['date'] = date
        dctData['strDocNo'] = this.editId

        if(this.intPayeeType == 1){
          dctData['lstReceipt'] = this.lstReceipt;
        }

        if(this.intPayeeType == 3){
            dctData['intAccountsMapId'] =  this.intExpenseNameId;
        }

        this.serviceObject.putData('payment/add_payment/', dctData).subscribe(res => {
          if (res.status == 1) {

            swal.fire({
              position: "center",
              type: "success",
              text: "Data updated successfully",
              showConfirmButton: true,
            });
    localStorage.setItem('previousUrl','payment/listpayment');
            
            this.router.navigate(['payment/listpayment']);

          }
          else if (res.status == 0) {
            swal.fire('Error!', 'Something went wrong!!', 'error');
          }
        },
          (error) => {
            swal.fire('Error!', 'Server Error!!', 'error');
          });
      }

    }
      
  }
  clearFields(){
    localStorage.setItem('previousUrl','payment/paymentactions');
    
    this.router.navigate(['payment/listpayment']);
  }

  payeeTypeChanged(){

    
    if(this.intPayeeType==4){
      this.blnShowDenominations=true;
      // this.intAmount=0;
      this.lstNotes=[]
      this.serviceObject.getData('payment/denomination_list/').subscribe(res => {
        
        this.lstNotes = res['data'];
        //   this.lstDenominations.push({
        //     count:0,
        //     total:0
        // }); 
      // this.dataSource = new MatTableDataSource(this.lstDenominations);

        
      });
    }
    else {
      this.blnShowDenominations=false;
    }
    
  }
  calcTotal(index,event){
  
    if(event.keyCode==189||event.keyCode==187){      
      this.lstDenominations[index].count='';
      return;
    }
  let lstLen= this.lstDenominations.length-1;
  let errorMsg;
  // if(this.lstDenominations[index].note==this.currentNote && index!=this.currentIndex){
    
  //   errorMsg='Please fill correctly';
  //   this.disableStatus[index]=true;
  //   this.showErrorMessage(errorMsg);
  //   return;
  // }
  if(this.lstDenominations[index].intContraId==null){
    this.disableStatus[index]=true;
    Swal.fire("Error!","Please select a denomination","error")
    return;
  }
  // else{
  //   this.disableStatus[index]=false;
  // }
  this.lstDenominations[index].total=0;
  this.lstDenominations[index].total=this.lstDenominations[index].count*this.lstDenominations[index].note;
  this.intAmount=0;
  for(let item of this.lstDenominations){
    this.intAmount=this.intAmount+item.total
  }
  
  }

  denominationChanged(note,index1){
    let errorMsg;
    // console.log("$$$this.lstDenominations",this.lstDenominations);
    // this.currentIndex=index1;
    // this.currentNote=note;
    for (let index = 0; index < this.lstDenominations.length; index++) {

      if(this.lstDenominations[index].note==note && index!=index1){
        errorMsg="This denomination already choosen";
        this.disableStatus[index+1]=true;
        Swal.fire("Error!",errorMsg,"error");
        this.lstDenominations.splice(index1,1);
        this.dataSource = new MatTableDataSource(
          this.lstDenominations
        );
        
        return;
      }
      else{
        this.disableStatus[index+1]=false;
      }
    }
    // let lstLen= this.lstDenominations.length-1;
    this.lstDenominations[index1].note=note; 
    this.calcTotal(index1,event);
  }

  addRow(){
    this.Validatedenomination();
    let lstLen = this.lstDenominations.length-1;
    if(this.validationStatus==false){
      return;
    }
    let errorMsg;
    
    // for (let index = 0; index < this.lstDenominations.length; index++) {
      
    // //  if(this.disableStatus[index]){
    //   if(this.lstDenominations[index].note==this.currentNote && index!=this.currentIndex && index!=lstLen){
        
    //   errorMsg='Please fill correctly';
    //   this.disableStatus[index]=true;
    //   this.showErrorMessage(errorMsg);
    //   return;
  
    // }
    // }
  
    this.lstDenominations.push({
        count:0,
        total:0
    });
    this.dataSource = new MatTableDataSource(
      this.lstDenominations
    );
    }
  
  
    deleteData(indexId){
      this.disableStatus.splice(indexId,1);
      
      let lstLen;
       lstLen=this.lstDenominations.length;
       if(!(lstLen==1)){
         this.lstDenominations.splice(indexId,1);
  
       }
       else{
        this.lstDenominations=[];
        this.lstDenominations.push({
          count:0,
          total:0
        });  
        }
  
        this.dataSource = new MatTableDataSource(
          this.lstDenominations
        );

        this.intAmount=0;
        for(let item of this.lstDenominations){
          this.intAmount=this.intAmount+item.total
        }
  
      }

      Validatedenomination(){
        this.validationStatus=true;
        let errorMsg;
         for (var data in this.lstDenominations) {
           let rawNum=Number(data)+1;
           if(this.lstDenominations[data]['intContraId']==null){
             this.validationStatus=false;
             errorMsg='Please select a denomination of raw '+rawNum;
             Swal.fire("Error!",errorMsg,"error");
             return;
           }
           if(this.lstDenominations[data]['count']==0 || this.lstDenominations[data]['count']==null){
             this.validationStatus=false;
             errorMsg='Please enter no. of notes of raw '+rawNum;
             Swal.fire("Error!",errorMsg,"error");
             return;
           }
           else if(this.lstDenominations[data]['count']<0){
            this.validationStatus=false;
            errorMsg='Please enter valid no. of notes of raw '+rawNum;
            Swal.fire("Error!",errorMsg,"error");
            return;
          }
         }
        }

        receiptList(mob){
          let dctReceiptData = {}
          dctReceiptData['intCustomerMob']=this.intContactNo;
          this.serviceObject.postData('receipt/receipt_list/',dctReceiptData).subscribe(res => {
      
            if (res.status == 1)
            {
            this.blnReceipt = res['bln_receipt'];
            // this.blnReceiptDisable = res['bln_receipt'];
            this.lstReceipt = res['lst_receipt'];
            this.intReceiptTot = res['receipt_tot'];
            this.dataSource1 = new MatTableDataSource(this.lstReceipt);
      
            }
            else if (res.status == 0) {
              swal.fire('Error!','Something went wrong!!', 'error');
              // this.lstItemDetails=[]
              // this.preItemList=[];
             }
         },
         (error) => {
          swal.fire('Error!','Server Error!!', 'error');
         });
        }

        amountChanged(index,item){
          this.intAmount = 0;
          if(item.amount_entered > 10000  && this.fopSelected=='1'){
            this.toastr.error('Cash Amount Limited to 10000')
            return
          }
          if(item.amount_entered > item.dbl_amount ){
            this.toastr.error('Entered amount is  greater than receipt amount')
            return
          }
           this.lstReceipt.forEach(element => {
             this.intAmount += element.amount_entered;
            
          });
        
          

        }

}
