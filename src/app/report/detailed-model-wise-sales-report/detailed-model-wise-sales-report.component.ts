
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { ExcelServicesService } from "../../services/excel-services.service";
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment' ;
import swal from 'sweetalert2';
@Component({
  selector: 'app-detailed-model-wise-sales-report',
  templateUrl: './detailed-model-wise-sales-report.component.html',
  styleUrls: ['./detailed-model-wise-sales-report.component.css']
})
export class DetailedModelWiseSalesReportComponent implements OnInit {

  datFrom;
  datTo;

  lstBranch=[]
  branchOptions=[]
  branchConfig = {displayKey:"Name",search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Branch',searchOnKey: 'Name',clearOnSelection: true  }

  lstPermission=JSON.parse(localStorage.group_permissions)
  blnDownload=false;
  searchCustomer: FormControl = new FormControl();
  lstCustomer = []
  intCustomerId;
  strCustomer;
  strSelectedCustomer;
  currentCustomer='';

  searchStaff: FormControl = new FormControl();
  lstStaff = []
  intStaffId;
  strStaff;
  strSelectedStaff;
  currentStaff='';
  lstBrand=[]
  brandOptions=[]
  brandConfig = {displayKey:"name", height: '200px',search:true ,customComparator: ()=>{} ,placeholder:'Brand',searchOnKey: 'name',clearOnSelection: true }

  lstItemCategory=[]
  itemCategoryOptions=[]
  itemCategoryConfig = {displayKey:"name", height: '200px',search:true ,customComparator: ()=>{} ,placeholder:'Item Category',searchOnKey: 'name',clearOnSelection: true}
    
  lstItemGroup=[]
  itemGroupOptions=[]
  itemGroupConfig = {displayKey:"name", height: '200px',customComparator: ()=>{} ,search:true ,placeholder:'Item Group',searchOnKey: 'name',clearOnSelection: true  }

  lstProduct=[]
  productOptions=[]
  productConfig = {
    displayKey:"name", //if objects array passed which key to be displayed defaults to description
    search:true ,//true/false for the search functionlity defaults to false,
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder:'Product',// text to be displayed when no item is selected defaults to Select,
    selectAll: 'true', // Should enable select all feature for multiple select items
    selectAllText: 'Select All',
    customComparator: ()=>{} ,// a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    // limitTo: Options.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    // moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    // noResultsFound: 'No results found!' ,// text to be displayed when no items are found while searching
    // searchPlaceholder:'Search' ,// label thats displayed in search input,
    searchOnKey: 'name', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: true // clears search criteria when an option is selected if set to true, default is false
  }

  lstItem = [];
  searchItem: FormControl = new FormControl();
  intItemId;
  strSelectedItem = '';
  selectedDate;
  strItem='';
  currentItem='';

  dctData = {}
  blnSmartChoice=false;
  blnService =false;
  constructor(
    private serviceObject: ServerService,
              private toastr: ToastrService,
              private spinnerService: NgxSpinnerService,
              private excelService: ExcelServicesService,
              
  ) { }

  ngOnInit() {
    this.datFrom = new Date();
    this.datTo = new Date();

    

    this.lstPermission.forEach(item=> {

      if (item["NAME"] == "Detailed Sales Report") {
        this.blnDownload = item["DOWNLOAD"]
      }
    });

    this.getBranch()
    this.searchStaff.valueChanges
    .debounceTime(400)
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

    this.searchCustomer.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstStaff = [];
      } else {
        if (strData.length >= 7) {
          
          this.serviceObject
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
    this.searchItem.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstItem = [];
      } else {
        if (strData.length >= 3) {
          this.serviceObject
            .postData('itemcategory/item_typeahead/', { term: strData })
            .subscribe(
              (response) => {
                this.lstItem = response['data'];

              }
            );
        }
      }
    }
    );
    this.getFilterData()

  }
  exportData(){
    let dctData = {};
    let fromDate = moment(this.datFrom).format('YYYY-MM-DD');
    let toDate   = moment(this.datTo).format('YYYY-MM-DD');

    dctData['datFrom'] = fromDate;
    dctData['datTo'] = toDate;
    let branch = [];
    this.lstBranch.forEach(element => {
        branch.push(element.Id);   
    });
    dctData['lstBranch'] = branch;
    if(this.strSelectedItem){
      if (this.strSelectedItem != this.strItem|| !this.strSelectedItem)
        {
        this.toastr.error('Valid Item Name is required', 'Error!');
        this.intItemId = null
        this.strItem = ''
        this.strSelectedItem=''
        return false;
        }
     }
     if(this.strSelectedItem){
    dctData['lstItem'] = [this.intItemId];
    }

    if(this.lstProduct.length>0)
    {
      let lstData=[]
      this.lstProduct.forEach(element => {
        lstData.push(element.id)
      });

      dctData['lstProduct'] = lstData;
    }

    if(this.lstBrand.length>0){
      let lstData=[]
      this.lstBrand.forEach(element => {
        lstData.push(element.id)
      });
      dctData['lstBrand'] = lstData;
    }

    if(this.lstItemCategory.length>0){
      let lstData=[]
      this.lstItemCategory.forEach(element => {
        lstData.push(element.id)
      });
      dctData['lstItemCategory'] = lstData;
    }

    if(this.lstItemGroup.length>0){
      let lstData=[]
      this.lstItemGroup.forEach(element => {
        lstData.push(element.id)
      });
      dctData['lstItemGroup'] = lstData;
    }
     
      if(this.strSelectedStaff){
        if (this.strSelectedStaff != this.strStaff)
          {
          this.intStaffId = null
          this.strStaff = ''
          this.strSelectedStaff=''
          this.toastr.error('Valid Staff Name is required', 'Error!');
          return;
          }
      }
      if(this.strSelectedCustomer){
        if (this.strSelectedCustomer != this.strCustomer)
          {
          this.intCustomerId = null
          this.strCustomer = ''
          this.strSelectedCustomer=''
          this.toastr.error('Valid Customer Name is required', 'Error!');
          return;
          }
      }
      if(this.strStaff)
      {
        dctData['intStaffId']=this.intStaffId
        // this.dctExportData['staff']=this.strStaff
      }
      if(this.strCustomer)
      {
        dctData['intCustomerId']=this.intCustomerId;
        // this.dctExportData['customer']=this.strCustomer
        
      }

      dctData['bln_smart_choice'] = this.blnSmartChoice;
      dctData['bln_service'] = this.blnService;

    this.spinnerService.show();
    
    this.serviceObject.postData('detailed_model/detailed_model_wise_sales_report/',dctData).subscribe(
      (response) => {
          if (response.status == 1)
          { 
            this.spinnerService.hide();
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.href = response['file'];
            a.download = 'report.xlsx';
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
           Swal.fire('Error!',response['message'], 'error');
          }
      },
      (error) => { 
        this.spinnerService.hide();  
       Swal.fire('Error!','Something went wrong!!', 'error');
      });
  }

  getBranch(){

    this.serviceObject.getData('reports/detailed_sales_report/').subscribe(
      (response) => {
          if (response.status == 1)
          { 
          this.branchOptions =  response['data'];
    
          }  
          
          else if (response.status == 0) 
          {
          //  this.blnShowData=false;
           Swal.fire('Error!',response['reason'], 'error');
          }
      },
      (error) => {   
       Swal.fire('Error!','Something went wrong!!', 'error');
      });
    
  }
  staffNgModelChanged(event){
    if(this.currentStaff!=this.strSelectedStaff){
      this.intStaffId = null;
      this.strStaff = '';
    }
  }
  staffChanged(item)
  {
   this.currentStaff = item.strUserName;
   this.intStaffId = item.intId;
   this.strStaff = item.strUserName;
   this.strSelectedStaff = item.strUserName;
 
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

}
itemChanged(item){
  this.intItemId = item.id;
  this.strItem = item.code_name;
  this.currentItem= item.code_name;
  this.strSelectedItem = item.code_name;

}
itemNgModelChanged(event){
  if(this.currentItem!=this.strSelectedItem){
    this.intItemId = null;
    this.strItem = '';
  }
}
getFilterData(){
  console.log("flkjfk", this.lstProduct,);
  
  this.selectedDate = moment(this.datFrom).format('YYYY-MM-DD')


      if(this.lstProduct.length>0)
      {
        let lstData=[]
        this.lstProduct.forEach(element => {
          lstData.push(element.id)
        });

        this.dctData['lstProduct'] = lstData;
      }

      if(this.lstBrand.length>0){
        let lstData=[]
        this.lstBrand.forEach(element => {
          lstData.push(element.id)
        });
        this.dctData['lstBrand'] = lstData;
      }

      if(this.lstItemCategory.length>0){
        let lstData=[]
        this.lstItemCategory.forEach(element => {
          lstData.push(element.id)
        });
        this.dctData['lstItemCategory'] = lstData;
      }

      if(this.lstItemGroup.length>0){
        let lstData=[]
        this.lstItemGroup.forEach(element => {
          lstData.push(element.id)
        });
        this.dctData['lstItemGroup'] = lstData;
      }

      this.dctData['lst_more_filter'] = ["Product", "Brand"]
      this.dctData['blnCheck']=true
      this.dctData['date'] = this.selectedDate;
      this.dctData['blnExport']=false
      
      this.spinnerService.show();
      
  
      this.serviceObject.postData('reports/daily_branch_stock_report/',this.dctData).subscribe(
        (response) => {
        this.spinnerService.hide();
        
          
            if (response.status == 1)
            {
              // if(response.hasOwnProperty('bln_branch')){

              //   this.blnBranch=response['bln_branch']
              //   if(this.blnBranch)
              //   {
              //    this.lstFiltersData.push('Branch')
              //   }
              // }

              this.productOptions=response['dct_data']['product']
              this.brandOptions=response['dct_data']['brand']
              this.itemCategoryOptions=response['dct_data']['item_category']
              this.itemGroupOptions=response['dct_data']['item_group']
            

            }  
            
            else if (response.status == 0) 
            {
             swal.fire('Error!',response['reason'], 'error');
            }
        },
        (error) => {   
          this.spinnerService.hide();
         swal.fire('Error!','Something went wrong!!', 'error');
        });
    // }

  }

}
