import { Component, OnInit , ViewChild} from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as moment from 'moment' ;
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { formatDate } from "@angular/common";
@Component({
  selector: 'app-addpayment',
  templateUrl: './addpayment.component.html',
  styleUrls: ['./addpayment.component.css']
})
export class AddpaymentComponent implements OnInit {

  showClosed

  objectKeys = Object.keys;
  fopSelected=''
  intPayeeType=null
  selectedBranch=''
  lstBranch=[]
  strCustomer=''
  lstCustomer=[]
  lstVentor = []
  strStaff=''
  lstStaff=[]
  strExpenses=''
  lstExpenses=[]
  intAmount=null
  strRemarks=''
  datIssue=new Date()
  saveDisable=false;

  searchStaff: FormControl = new FormControl();
  searchBranch: FormControl = new FormControl();
  searchCustomer: FormControl = new FormControl();
  searchVentor: FormControl = new FormControl();
  searchExpenses: FormControl = new FormControl();
  searchExpenseName: FormControl = new FormControl();

  selectedExpenseName
  intExpenseNameId=null
  lstExpenseName=[]
  strExpenseName=''

  selectedStaff=''
  selectedCustomer=''
  selectedExpenses=''
  intCustomerId

  intVentorId
  strVentor = ''
  selectedVentor = ''

  intStaffId=null
  intBranchId=null
  strBranch=''
  intExpensesId=null
  intContactNo = null
  lstReceipt= [];
  intReceiptTot = null;
  blnReceipt = false;

  lstBank = []
  intBank = null;
  lstNotes=[];
  lstDenominations=[]

  dataSource=new MatTableDataSource(this.lstDenominations)
  lstDisplayedColumns=['denomination','noNotes','total','action'];

  dataSource1=new MatTableDataSource(this.lstReceipt)
  lstDisplayedColumns1=['receiptName','receiptAmount','amount'];
  disableStatus=[]
  validationStatus=true;
  blnShowDenominations=false;
  strGroup = localStorage.getItem('group_name')
  dctContra;
  constructor(private serviceObject: ServerService,private toastr: ToastrService,private formBuilder: FormBuilder,public router: Router){ }

  ngOnInit() {

    this.intBranchId =Number( localStorage.BranchId);
    this.strBranch = localStorage.BranchName;
    this.selectedBranch = localStorage.BranchName;

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
      this.searchVentor.valueChanges
      .debounceTime(400)
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

  CustomerChanged(item){
    
    this.intCustomerId = item.id;
    this.strCustomer = item.name;
    this.intStaffId = null;
    this.intExpensesId = null;
    this.strExpenses = '';
    this.selectedStaff =  '';
    this.selectedExpenses = '';
    this.intContactNo = item.phone;

    if (this.intPayeeType == 1) {
      
      let dctReceiptData = {}
      dctReceiptData['intCustomerMob']=this.intContactNo;
      this.serviceObject.postData('receipt/receipt_list/',dctReceiptData).subscribe(res => {

        if (res.status == 1)
        {
        this.blnReceipt = res['bln_receipt'];
        // this.blnReceiptDisable = res['bln_receipt'];
        this.lstReceipt = res['lst_receipt'];
        // this.intReceiptTot = res['receipt_tot'];
        this.dataSource1 = new MatTableDataSource(this.lstReceipt);
        if (!this.blnReceipt){
          this.toastr.warning('Customer has no any receipt exists', 'Warning!'); 
        }

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
  }

  VentorChanged(item){
    
    this.intVentorId = item.id;
    this.strVentor = item.name;
    this.intStaffId = null;
    this.intExpensesId = null;
    this.strExpenses = '';
    this.selectedStaff =  '';
    this.selectedExpenses = '';
    this.intContactNo = null;
    this.selectedCustomer = '';
    this.selectedExpenses = '';

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
  expenseNameChanged(item){
    this.intExpenseNameId = item.pk_bint_id;
    this.strExpenseName= item.vchr_category;
   
    
  }
  AddPayment(){
    let date = moment(this.datIssue).format('YYYY-MM-DD')
    let dctData={}
    let error=false
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
    else if(this.intPayeeType)
    {

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
         if(this.intPayeeType==1 && ((!this.selectedCustomer || this.strCustomer!= this.selectedCustomer))){
            this.toastr.error('Valid customer is required ','Error!'); 
            error=true
            this.intCustomerId = null
            this.strCustomer = ''
            this.selectedCustomer=''
            return;
          }
         else if(this.intPayeeType==5 && ((!this.selectedCustomer || this.strCustomer!= this.selectedCustomer))){
            this.toastr.error('Valid customer is required ','Error!'); 
            error=true
            this.intCustomerId = null
            this.strCustomer = ''
            this.selectedCustomer=''
            return;
          }
         else if(this.intPayeeType==6 && ((!this.selectedVentor || this.strVentor!= this.selectedVentor))){
            this.toastr.error('Valid ventor is required ','Error!'); 
            error=true
            this.intVentorId = null
            this.strVentor = ''
            this.selectedVentor=''
            return;
          }
          else if(this.intPayeeType==2 && ((!this.selectedStaff || this.strStaff!= this.selectedStaff))){
            this.toastr.error('Valid staff name is required ','Error!');
            error=true
            this.intStaffId = null
            this.strStaff = ''
            this.selectedStaff=''
            return;
          }
          else if (this.intPayeeType==3 && ((!this.selectedExpenses || this.strExpenses!= this.selectedExpenses))){
            this.toastr.error('Valid Payee is required ','Error!');
            error=true
            this.intExpensesId = null
            this.strExpenses = ''
            this.selectedExpenses=''
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
         else if (this.intPayeeType == 4 && (!this.intBank || this.intBank == null) ){
            this.toastr.error('Valid Bank is required ','Error!');
            error=true
            this.intBank = null
            return;
          }
          
          else if (!this.intAmount || this.intAmount<0) {
            this.toastr.error('Valid Amount is required ','Error!');
            error=true
            return
          }
          else if (this.fopSelected=='1' && this.intAmount>10000 && this.intPayeeType!=4) {
            this.toastr.error('Cash Amount Limited to 10000', 'Error!');
            // this.toastr.error('Valid Amount is required ','Error!');
            error=true
            return
          }
          else if (!this.strRemarks) {
            this.toastr.error('Remarks is required ','Error!');
            error=true
            return ;
          }
          // else if(this.intPayeeType==4 && this.lstDenominations.length<){
          //   this.toastr.error('Select atleast one denomination',"Error!");
          //   error=true;
          //   return;
          // }
         

         
          else if(!error){
            dctData['intPayeeType']=this.intPayeeType
            dctData['intAmount']=this.intAmount
            dctData['strRemarks']=this.strRemarks

           if (this.intPayeeType == 1){
              dctData['intPayeeId']=this.intCustomerId
            }
           else if (this.intPayeeType == 5){
              dctData['intPayeeId']=this.intCustomerId

            }
           else if (this.intPayeeType == 6){
              dctData['intPayeeId']=this.intVentorId

            }
           else if (this.intPayeeType == 2){
              dctData['intPayeeId']=this.intStaffId
            }
           else if (this.intPayeeType == 3){
              dctData['intPayeeId']=this.intExpensesId
            }
           else if (this.intPayeeType == 4){
             dctData['intPayeeId'] = this.intBank;
             dctData['lstDenominations']=this.lstDenominations;
            }

            dctData['intBranchId']=this.intBranchId
            dctData['strBranch']=this.strBranch
            dctData['fopSelected']=this.fopSelected
            dctData['date']=date;
            if(this.intPayeeType == 1){
            dctData['lstReceipt'] = this.lstReceipt;
          }
          if(this.intPayeeType == 3){
            dctData['intAccountsMapId'] =  this.intExpenseNameId;
          }
          let text="Do you want to proceed?"
          if (this.intPayeeType==4 && (this.objectKeys(this.dctContra).length>0)) {
            const formattedDate = formatDate(this.dctContra['dat_created'],'medium','en-IN');
            text="Contra has been made with "+this.dctContra['dbl_amount']  +" amount by "+ this.dctContra['name'] +" at "+formattedDate+". Do you want to proceed ";
          }
          swal.fire({
            title: "Confirm",
            text: text,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, proceed it!",
            cancelButtonText: "Cancel"
          }).then(result1 => {
            if (result1.value) {
           this.saveDisable=true;
              
            this.serviceObject.postData('payment/add_payment/',dctData).subscribe(res => {
              if (res.status == 1)
              {
      
                swal.fire({
                  position: "center",
                  type: "success",
                  text: "Data saved successfully",
                  showConfirmButton: true,
                });
           this.saveDisable=true;
                
    localStorage.setItem('previousUrl','payment/listpayment');
                
        this.router.navigate(['payment/listpayment']);
                
              }
              else if (res.status == 0) {
                swal.fire('Error!','Something went wrong!!', 'error');
               this.saveDisable=false;
                
              }
          },
          (error) => {
            swal.fire('Error!','Server Error!!', 'error');
           this.saveDisable=false;
            
          });

      }
    });
          }
           
    }
     
      

      
      
  }
  clearFields(){
     this.intPayeeType=null
     this.fopSelected=''
    //  this.selectedBranch=''
    //  this.lstBranch=[]
     this.strCustomer=''
     this.lstCustomer=[]
     this.strStaff=''
     this.lstStaff=[]
     this.strExpenses=''
     this.lstExpenses=[]
     this.intAmount=null
     this.strRemarks=''
     this.datIssue=new Date()
     this.selectedStaff=''
     this.selectedCustomer=''
     this.selectedExpenses=''
     this.intCustomerId
     this.intStaffId=null
    //  this.intBranchId=null
    //  this.strBranch=''
     this.intExpensesId=null;
     this.lstDenominations=[];
     this.blnShowDenominations=false;
     this.blnReceipt = false;
     this.lstReceipt = [];
     
  }

  payeeTypeChanged(){
    if(this.intPayeeType==4){
      this.intAmount=0;
      this.lstNotes=[];
      this.lstBank.forEach(element => {
       if(element.vchr_name == "SIB" || element.vchr_name.toUpperCase() == 'SOUTH INDIAN BANK'){
         this.intBank = element.pk_bint_id;
       }        
      });
      // this.intBank = 
      this.lstDenominations=[];
      this.serviceObject.getData('payment/denomination_list/').subscribe(res => {
        if(res.status==1){
          this.blnShowDenominations=true;
          this.lstNotes = res['data'];
          this.dctContra = res['contra_data'];
          if(this.lstDenominations.length==0){
            this.lstDenominations.push({
              count:0,
              total:0
          }); 
          } 
        this.dataSource = new MatTableDataSource(this.lstDenominations);
        }
        
      });
    }
    else {
      this.intAmount=0;
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

        amountChanged(index,item){
          this.intAmount = 0;
          if(item.amount_entered > 10000  && this.fopSelected=='1' && this.intPayeeType!=4){
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
        bankInformationClick(){
          
        }

}
