import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import * as moment from 'moment' ;
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-listreceipt',
  templateUrl: './listreceipt.component.html',
  styleUrls: ['./listreceipt.component.css']
})
export class ListreceiptComponent implements OnInit {


  selectedFrom
  selectedTo
  source;
  data = [];
  blnHo = false;
  dataLoaded = false;
  lstPermission=JSON.parse(localStorage.group_permissions)
  previusUrl = localStorage.getItem('previousUrl'); 
  lstCustom=[]
  dctDelete={}
  datTo;
  datFrom;
  blnExport = false;
  exportDateFrom =null; 
  exportDateTo =null;
  exportBranch =null;
  constructor(private serviceObject: ServerService,  
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,

    public router: Router,) { 
      this.source = new LocalDataSource(this.data);
    }

  ngOnInit() {
    localStorage.setItem('advanceReceiptPayment',String(false));
    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "List Receipt") {
        dct_perms.ADD = item["ADD"];
        dct_perms.EDIT= item["EDIT"];
        dct_perms.DELETE = item["DELETE"];
        dct_perms.VIEW = item["VIEW"]
      }
    });
    
    if(dct_perms.VIEW==true && dct_perms.EDIT==true ){
      this.lstCustom= [

        { name: 'editrecord', title: '<i class="ti-pencil text-info m-r-10" title="Edit"></i>' },
        { name: 'viewrecord', title: '<i class="fa fa-eye m-r-10 text-warning" title="View Details"></i>' },
        { name: 'printrecord', title: '<i class="fa fa-print m-r-10 text-primary" title="Print Details"></i>' },
      ]
    }
    else if(dct_perms.VIEW==false && dct_perms.EDIT==true ){
      this.lstCustom= [
        { name: 'editrecord', title: '<i class="ti-pencil text-info m-r-10" title="Edit"></i>' },
        { name: 'printrecord', title: '<i class="fa fa-print m-r-10 text-primary" title="Print Details"></i>' },
       
      ]
    }
    else if(dct_perms.VIEW==true && dct_perms.EDIT==false ){
      this.lstCustom= [
        { name: 'viewrecord', title: '<i class="fa fa-eye m-r-10 text-warning" title="View Details"></i>' },
        { name: 'printrecord', title: '<i class="fa fa-print m-r-10 text-primary" title="Print Details"></i>' },

      ]
    }
    else{
      this.lstCustom= [

        { name: 'printrecord', title: '<i class="fa fa-print m-r-10 text-primary" title="Print Details"></i>' },
      ]
    }

    if(dct_perms.DELETE==true){
      this.dctDelete= {
        confirmDelete: true,
        deleteButtonContent: '<i class="ti-trash text-danger m-r-10" title="Delete"></i>',
        saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
        cancelButtonContent: '<i class="ti-close text-danger"></i>',
        position:'right',
  
      }
      this.settings.delete=this.dctDelete
    }
    else{
      this.settings.actions['delete']=false
    }
    
    this.settings.actions.custom = this.lstCustom
    this.getList(this.datFrom, this.datTo, 0,);
 
  }

  settings = {
  //  hideSubHeader: true,
   delete:this.dctDelete,
    actions: {
      add: false,
      edit: false,
      delete: false,
      custom:this.lstCustom,
      position: 'right'
    },
    // edit: {
    //   confirmSave: true,
    //   editButtonContent: '<i class="ti-pencil text-info m-r-10"></i>',
    //   saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
    //   cancelButtonContent: '<i class="ti-close text-danger"></i>'
    // },
    columns: {
      dat_issue: {
        title: 'Date',
      },
      fk_branch__vchr_name: {
        title: 'Branch',
      },
      fk_customer_id__vchr_name: {
        title: 'Name',
      },
     
      dbl_amount:{
        title: 'Amount',
      },
      vchr_fop:{
        title: 'Mode',
      },
      vchr_payment_status:{
        title: 'Status',
      },  
    },
  };
  getListData()
  {
    let status =0
    let dctData={};
    let tempData
    this.selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
    this.selectedTo = moment(this.datTo).format('YYYY-MM-DD')

     if (this.selectedFrom > this.selectedTo || (!this.selectedFrom) || (!this.selectedTo) )  {
      this.toastr.error('Please select correct date period', 'Error!');
        return false
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
    if (status === 0) {
      const urls = ['receipt/receiptactions']

    //  if (this.previusUrl != '/crm/viewlead'  ) {
      if (!(urls.find( x => x === this.previusUrl))) {
          localStorage.removeItem('receiptCustomerNumberStatus')
          localStorage.removeItem('receiptRequestData')
     }
     if (localStorage.getItem('receiptCustomerNumberStatus')) {
       
        tempData = JSON.parse(localStorage.getItem('receiptRequestData'))
        // console.log("inside",tempData);

        d1 = tempData['start_date']
        d2 = tempData['end_date']
        status = 1
        localStorage.removeItem('receiptCustomerNumberStatus')
        // localStorage.removeItem('enquiryCustomerId')
        // localStorage.removeItem('enquiryCustomerNumber')
      }
    }
     else if (status === 1) {
      
      
      
      d1 = new Date(d1).toDateString();
      d2 = new Date(d2).toDateString();
      data = {start_date: d1, end_date: d2 }

      localStorage.setItem('receiptRequestData', JSON.stringify(data))

    }
    d1 =  moment(d1).format('YYYY-MM-DD');
    d2 =  moment(d2).format('YYYY-MM-DD');
    this.datFrom=d1
    this.datTo=d2
    let dctData={}
    dctData['datFrom'] =d1
    dctData['datTo']=d2
    this.exportDateFrom = dctData['datFrom'] ;
    this.exportDateTo = dctData['datTo'] ;

    this.spinnerService.show();

    this.serviceObject.postData('receipt/list_receipt/',dctData).subscribe(
      (response) => {
        this.spinnerService.hide();

          if (response.status == 1) {
            this.dataLoaded =true;
            this.data=response['data'];
            if(this.data.length>0){
              this.blnExport = true;
            }
            else{
              this.blnExport = false;
            }
            if(this.data.length==0){
              this.dataLoaded = false;
            }
           this.source = new LocalDataSource(this.data); // create the source
           

          }  
          else if (response.status == 0) {
            this.dataLoaded =false;
            swal.fire('Error!','Something went wrong!!', 'error');
          }
      },
      (error) => {
        this.dataLoaded =false;
        this.spinnerService.hide(); 
        swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }

  onDeleteConfirm(event) {
    let dctData={}
      dctData['receiptId']=event.data['pk_bint_id']

    swal.fire({
      title: 'Delete',
      text: "Are you sure want to delete ?" ,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes, Delete it!",
    }).then(result => {
      if (result.value) {
        this.serviceObject.patchData('receipt/add/',dctData).subscribe(
          (response) => {
              if (response.status == 1) {
                
                swal.fire({
                  position: "center", 
                  type: "success",
                  text: "Data Deleted successfully",
                  showConfirmButton: true,  
                });
                this.getListData();     
              }  
              else if (response.status == 0) {
                swal.fire('Error!',response['data'], 'error');          
              }
          },
          (error) => {   
            swal.fire('Error!','Something went wrong!!', 'error');
          });
        };

      });
  }

  onEdit(data){
   
    
   
    if(data.vchr_payment_status=='RECEIVED'){
        this.toastr.error("Advance Received,can't be edit" ,'Error!');
    }
    else{
      localStorage.setItem('editReceiptId',data.pk_bint_id);
  localStorage.setItem('previousUrl','receipt/receiptactions');
      
      this.router.navigate(['receipt/addreceipt']);
    }
  
    
  }
  onView(data){
    localStorage.setItem('receiptId',data.pk_bint_id);
  localStorage.setItem('previousUrl','receipt/receiptactions');
    
    this.router.navigate(['receipt/viewreceipt']);
  }

  customAction(event) {
    
    switch ( event.action) {
      case 'viewrecord':
        this.onView(event.data);
        break;
      case 'editrecord':
        this.onEdit(event.data);
        break;
      case 'printrecord':
      this.printReciept(event.data)

    }
  }
  printReciept(data) {
    let dctData={receiptId:data.pk_bint_id};


    this.serviceObject.postData('receipt/print_receipt/',dctData).subscribe(
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



          // let file=response['data']
          // let link=this.serviceObject.hostAddress+file;

          // var a = document.createElement('a');
          // document.body.appendChild(a);
          // a.href = link;
          // a.download = "report.xlsx";
          // a.click();
          // window.URL.revokeObjectURL(link);
          // a.remove();

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
    console.log('exportBln',this.blnExport);
    
    if (!this.blnExport){
      swal.fire('Error!','Empty Data!', 'error'); 
      return false;
    }
    
    
    dctData['datFrom'] = this.exportDateFrom
    dctData['datTo']= this.exportDateTo
   
    this.spinnerService.show();
    this.serviceObject.putData('receipt/list_receipt/',dctData).subscribe(
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
