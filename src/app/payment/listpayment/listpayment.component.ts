
import {debounceTime} from 'rxjs/operators';
// import * as tableData from './../../table/smart-table/smart-data-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import * as moment from 'moment' ;
import { NgxSpinnerService } from "ngx-spinner";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-listpayment',
  templateUrl: './listpayment.component.html',
  styleUrls: ['./listpayment.component.css']
})
export class ListpaymentComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,

    public router: Router,) {
    // this.source = new LocalDataSource(this.data); // create the source
      
  }
  selectedFrom
  selectedTo
  datTo;
  datFrom;
  lstPermission=JSON.parse(localStorage.group_permissions)
  previusUrl = localStorage.getItem('previousUrl'); 
  blnView=false
  blnEdit=false  
  searchBranch: FormControl = new FormControl();
  selectedBranch;
  lstBranch = []
  IntBranchId;
  strBranch;
  currentBranch='';
  blnBranchilter=false
  branchType=localStorage.getItem('BranchType'); 
  groupName=localStorage.getItem('group_name'); 
  blnExport = false;

  exportDateFrom =null; 
  exportDateTo =null;
  exportBranch =null;

  // dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false,'HISTORY':false}
  ngOnInit(){
    this.dataSource = new MatTableDataSource(this.data);
    let ToDate = new Date()
    let FromDate = new Date();
    this.datTo = ToDate
    this.datFrom = FromDate
    if (this.branchType == '2' ||this.branchType == '3' || this.groupName == 'ADMIN')
    {
      this.blnBranchilter=true
    }
    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "List Payment") {
        // this.dct_perms.ADD = item["ADD"];
        this.blnEdit= item["EDIT"];
        // this.dct_perms.DELETE = item["DELETE"];
        this.blnView = item["VIEW"]
      }
    });
    this.searchBranch.valueChanges.pipe(
      debounceTime(400))
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstBranch = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('branch/branch_typeahead/', { term: strData })
              .subscribe(
                (response) => {
                  this.lstBranch = response['data'];
                 
                  

                }
              );
          }
        }
      }
      ); 
    this.getList(this.datFrom, this.datTo, 0,);
    // this.getData()
  }
  // source: LocalDataSource;
  data;
  blnShowData=false;
  displayedColumns = ['date', 'vchr_doc_num','fk_branch__vchr_name','fk_accounts_map_id__fk_coa_id__vchr_acc_name','dbl_amount','action'];
 
  dataSource;
  blnHo=false


  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
      custom: [ 
        { name: 'viewrecord', title: '<i class="fa fa-eye"></i>'},
        { name: 'editrecord', title: '<i class="ti-pencil text-info m-r-10"></i>' }],
      position: 'right'
    },
   
    columns: {
      dat_payment: {
        title: 'Date',
       
      },
      vchr_doc_num: {
        title: 'Doc No',
      },
      fk_branch__vchr_name: {
        title: 'Branch',
        // valuePrepareFunction: (cell,data) => { console.log(data,"sssss"); return data.toString().replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ))},
      },
      dbl_amount: {
        title: 'Amount',
      },
      
    },
  };
  BranchChanged(item) {
    this.currentBranch = item.name;
    this.IntBranchId = item.id;
    this.strBranch = item.name;
    this.selectedBranch = item.name;
  }
getData()
  {
    console.log("getdata",this.datFrom,this.datTo);
    
    let status =0
    let dctData={};
    let tempData

    // if ((!this.datFrom && this.datTo) || (this.datFrom && !this.datTo)) {
    //     this.toastr.error('Please select From and To date', 'Error!');
    //   return false;
    // }
    // else if ((dctData['datFrom'] &&  dctData['datTo']) && ( dctData['datTo'] <  dctData['datFrom'])) {
    //   this.toastr.error('Please select correct date period', 'Error!');
    //   return false;
    // }
    this.selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
    this.selectedTo = moment(this.datTo).format('YYYY-MM-DD')

     if (this.selectedFrom > this.selectedTo || (!this.selectedFrom) || (!this.selectedTo) )  {
      this.toastr.error('Please select correct date period', 'Error!');
        // swal.fire({
        //   position: "center",
        //   type: "error",
        //   text: "Please select correct date period",
        //   showConfirmButton: true,
        // });
        return false
      }

    //  tempData['datTo']= moment(this.datTo).format('DD-MM-YYYY')

    this.getList( 
      new Date(this.datFrom).toLocaleString('en-GB'),
      new Date(this.datTo).toLocaleString('en-GB'),
      1,
    );
  }
  branchNgModelChanged(event){
    if(this.currentBranch!=this.selectedBranch){
      this.strBranch = '';
      this.IntBranchId = null;
    }
  }
  getList(startDate, endDate, status){
    let d1 = this.datFrom;
    let d2 = this.datTo;
    if ((!this.datFrom && this.datTo) || (this.datFrom && !this.datTo)) {
      this.toastr.error('Please select From and To date', 'Error!');
    return false;
  }
    let tempData;
    let data;
    if (status === 0) {
      const urls = ['payment/paymentactions']

    //  if (this.previusUrl != '/crm/viewlead'  ) {
      if (!(urls.find( x => x === this.previusUrl))) {
          localStorage.removeItem('paymentCustomerNumberStatus')
          localStorage.removeItem('paymentRequestData')
     }
     if (localStorage.getItem('paymentCustomerNumberStatus')) {
       
        tempData = JSON.parse(localStorage.getItem('paymentRequestData'))
 

        d1 = tempData['start_date']
        d2 = tempData['end_date']
        this.IntBranchId = tempData['branchId']
        this.strBranch= tempData['branchname']
        this.selectedBranch= tempData['branchname']
        this.currentBranch=tempData['branchname']
        status = 1
        localStorage.removeItem('paymentCustomerNumberStatus')
        // localStorage.removeItem('enquiryCustomerId')
        // localStorage.removeItem('enquiryCustomerNumber')
      }
    }
     else if (status === 1) {
      
      
      
      d1 = new Date(d1).toDateString();
      d2 = new Date(d2).toDateString();
      data = {start_date: d1, end_date: d2,branchId:this.IntBranchId,branchname:this.strBranch }

      localStorage.setItem('paymentRequestData', JSON.stringify(data))

    }
    d1 =  moment(d1).format('YYYY-MM-DD');
    d2 =  moment(d2).format('YYYY-MM-DD');
    this.datFrom=d1
    this.datTo=d2
    let dctData={}
    dctData['datFrom'] =d1
    dctData['datTo']=d2
    dctData['intBranchId']=this.IntBranchId
    this.exportDateFrom = dctData['datFrom'] ;
    this.exportDateTo = dctData['datTo'] ;
    this.exportBranch = dctData['intBranchId'];
    this.spinnerService.show();
    this.serviceObject.postData('payment/payment_list/',dctData).subscribe(
      (response) => {
        this.spinnerService.hide();

          if (response.status == 1)
          {
            this.data=response['lst_invoice'];
            this.blnHo=response['bln_ho'];
            
            if(this.data.length>0){
              this.blnShowData=true;
             }
             else{
              this.blnShowData=false;
             }

            if(this.data.length>0)
            { 
              this.blnExport = true;
              this.data.forEach(element => {
                element.fk_branch__vchr_name=element.fk_branch__vchr_name.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ))
              

                if(element.int_approved==0)
                {
                    element.blnShowApprove=true
                    element.blnShowEdit=true
                }
                else{
                  element.blnShowApprove=false
                  element.blnShowEdit=false
                }

              });

              // this.source = new LocalDataSource(this.data); 
             }
             else{
              this.blnExport = false;
              // this.blnShowData=false;
             }
            this.dataSource=this.data
            this.dataSource = new MatTableDataSource(this.data);
            this.dataSource.paginator = this.paginator;
            // this.dataSource.paginator.firstPage();
            // this.dataSource.sort = this.sort;
             
          }  
          else if (response.status == 0) 
          {
           swal.fire('Error!','Something went wrong!!', 'error');
           this.data=[];

           if(this.data.length>0){
             this.blnShowData=true;
            }
            else{
             this.blnShowData=false;
            }
          }
      },
      (error) => {   
        this.spinnerService.hide();

       swal.fire('Error!','Something went wrong!!', 'error');
      });
  }
   onView(docno)
  {
    localStorage.setItem('paymentId',docno);
    localStorage.setItem('previousUrl','payment/paymentactions');
    
    this.router.navigate(['payment/viewpayment']);
  }
  onEdit(docno)
  {
    
    localStorage.setItem('paymentEditId',docno);
    localStorage.setItem('previousUrl','payment/paymentactions');
    
    this.router.navigate(['payment/editpayment']);
  }
  onApprove(id)
  {
    
    this.serviceObject.patchData('payment/add_payment/',{'id':id}).subscribe(
      (response) => {
          if (response.status == 1)
          {
            swal.fire('Success!','Successfully approved', 'success');
           
            this.data.forEach(element => {
              if(element.pk_bint_id==id){
                element.int_approved=1
              }
              if(element.int_approved==0)
              {
                  element.blnShowApprove=true
                  element.blnShowEdit=true
              }
              else{
                element.blnShowApprove=false
                element.blnShowEdit=false
              }
            });
            this.dataSource=this.data
            this.blnShowData=true;

          }  
          else if (response.status == 0) 
          {
            swal.fire('Error!','Something went wrong!!', 'error');
            this.data=[];
 
            if(this.data.length>0){
              this.blnShowData=true;
             }
             else{
              this.blnShowData=false;
             }
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

  onPrint(id) {
    let dctData={paymentId:id};


    this.serviceObject.postData('payment/view_payment/',dctData).subscribe(
      response => {

        if(response['status']==1){

          let fileURL = response['file_url'];
          window.open(fileURL, '_blank');

          //  const file_data = response['file_name']['file'][0];
          //  const pdf = 'data:application/octet-stream;base64,' + file_data.substring(2, file_data.length - 1);
          //  const dlnk = document.createElement('a');
          //  dlnk.href = pdf;
          //  dlnk.download = response['file_name']['file_name'];
          //  document.body.appendChild(dlnk);
          //  dlnk.click();
          //  dlnk.remove();
          //  swal.fire('Success!','Successfully downloaded');



         

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

  exportPayment(){
    let dctData = {};
    // console.log('blnExport',this.blnExport);
    
    if (!this.blnExport){
      swal.fire('Error!','Empty Data!', 'error'); 
      return false;
    }
    
    dctData['datFrom'] = this.exportDateFrom
    dctData['datTo']= this.exportDateTo
    dctData['intBranchId']= this.exportBranch
    this.spinnerService.show();
    this.serviceObject.putData('payment/payment_list/',dctData).subscribe(
      (response) => {
        if (response.status == 1)
        { 
          this.spinnerService.hide();
          var a = document.createElement('a');
          document.body.appendChild(a);
          a.href = response['file'];
          a.download = 'paymentlist.xlsx';
          a.click();
          // window.URL.revokeObjectURL(this.dctReportData);
          a.remove();
              
          // this.snotifyService.success('Successfully Exported');  
          this.toastr.success('Successfully Exported', 'Success!');
           
         
        }  
        
        else if (response.status == 0) 
        {
          this.spinnerService.hide();
        //  this.blnShowData=false;
          swal.fire('Error!',response['message'], 'error');
        }

      },
      (error) => {   
        this.spinnerService.hide();
        swal.fire('Error!','Something went wrong!!', 'error');
       })
  }
}
