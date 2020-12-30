import { Component, OnInit ,ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment' ;
import { ServerService } from '../../server.service';
import { NgxSpinnerService } from "ngx-spinner";

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-exchange-list',
  templateUrl: './exchange-list.component.html',
  styleUrls: ['./exchange-list.component.css']
})
export class ExchangeListComponent implements OnInit {

  datFrom;
  datTo;
  selectedFrom
  selectedTo
  blnExport ;

  blnFilterOn = false;


  searchProduct: FormControl = new FormControl();
  lstProduct = []
  intProductId;
  strProduct;
  strSelectedProduct='';
  currentProduct='';

  searchBrand: FormControl = new FormControl();
  lstBrand = []
  intBrandId;
  strBrand;
  strSelectedBrand='';
  currentBrand='';
  


  searchItem: FormControl = new FormControl();
  lstItem = []
  intItemId;
  strItem;
  strSelectedItem='';
  currentItem='';


  searchImei: FormControl = new FormControl();
  lstImei = []
  intImeiId;
  strImei;
  strSelectedImei='';
  currentImei='';

  lstBranch=[];
  selectedBranch ='';
  intBranchId;
  strBranch= '' ;
  searchBranch: FormControl = new FormControl();
  currentBranch='';


  dataSource = new MatTableDataSource();
  blnShowData='none';
  data = []

  displayedColumns = ['date','brand','strItem','imei','age','rate', 'action'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private serviceObject: ServerService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    public router: Router,
  ) { }
  previusUrl = localStorage.getItem('previousUrl'); 

  lstPermission=JSON.parse(localStorage.group_permissions)
  blnView=false  
  ngOnInit() {
    this.datFrom = new Date();
    this.datTo = new Date();


    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "Exchange List") {
        // this.dct_perms.ADD = item["ADD"];
        // this.blnEdit= item["EDIT"];
        // this.dct_perms.DELETE = item["DELETE"];
        this.blnView = item["VIEW"]
      }
    });

    this.searchProduct.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstProduct = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('products/product_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstProduct = response['data'];
              }
            );
          }
        }
      }
    );

    this.searchBrand.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstBrand = [];
      } else {
        if (strData.length >= 1) {
   
          
          
            this.serviceObject
            .postData('brands/brands_typeahead/',{'term':strData})
            .subscribe(
              (response) => {
                this.lstBrand = response['data'];
              }
            );
          // }
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
        if (strData.length >= 1) {
      
            this.serviceObject
            .postData('itemcategory/item_typeahead/',{'term':strData})
            .subscribe(
              (response) => {
                this.lstItem = response['data'];
              }
            );
          // }
          }
        }
      }
    );

    this.searchImei.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstImei = [];
      } else {
        if (strData.length >= 5) {
      
            this.serviceObject
            .postData('exchange_sales/imei_typeahead/',{'term':strData})
            .subscribe(
              (response) => {
                this.lstImei = response['data'];
              }
            );
          // }
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
            .postData('exchange_sales/exchange_branch_typeahead/',{term:strData})
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
  BranchChanged(item){
    this.intBranchId = item.id;
    this.strBranch = item.branchname;
    this.selectedBranch=item.branchname;
    this.currentBranch=item.branchname;
  }  
  branchNgModelChanged(event){
    if(this.currentBranch!=this.selectedBranch){
      this.intBranchId = null;
        this.strBranch = '';
   }
  } 

  getData()
  {
    this.blnExport =false
    console.log('getdata entered ')
    let dctData={}
    // this.selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
    // this.selectedTo = moment(this.datTo).format('YYYY-MM-DD')
    // dctData['datFrom'] = this.selectedFrom
    // dctData['datTo'] = this.selectedTo
    // dctData['blnService'] = blnService
    this.selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
    this.selectedTo = moment(this.datTo).format('YYYY-MM-DD')
    if(this.selectedBranch){
      if (this.selectedBranch != this.strBranch)
        {
          
        this.intBranchId = null
        this.strBranch = ''
        this.selectedBranch=''
        this.toastr.error('Valid Branch Name is required', 'Error!');
        }
    }
     if (this.selectedFrom > this.selectedTo || (!this.selectedFrom) || (!this.selectedTo) )  {
    

      Swal.fire({
        position: "center",
        type: "error",
        text: "Please select correct date period",
        showConfirmButton: true,
      });
      return false;
    }
    this.getList( 
      new Date(this.datFrom).toLocaleString('en-GB'),
      new Date(this.datTo).toLocaleString('en-GB'),
      1
    );
   
  }

  exportData()
  {
    this.blnExport=true
    let dctData={}
    // this.selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
    // this.selectedTo = moment(this.datTo).format('YYYY-MM-DD')
    // dctData['datFrom'] = this.selectedFrom
    // dctData['datTo'] = this.selectedTo
    // dctData['blnService'] = blnService
    this.selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
    this.selectedTo = moment(this.datTo).format('YYYY-MM-DD')

     if (this.selectedFrom > this.selectedTo || (!this.selectedFrom) || (!this.selectedTo) )  {
    

      Swal.fire({
        position: "center",
        type: "error",
        text: "Please select correct date period",
        showConfirmButton: true,
      });
      return false;
    }
    this.getList( 
      new Date(this.datFrom).toLocaleString('en-GB'),
      new Date(this.datTo).toLocaleString('en-GB'),
      1,
    );
   
  }

  

  getList (startDate, endDate, status) {
    let d1 = this.datFrom;
      let d2 = this.datTo;
      let tempData;
      let data;
      if (status === 0) {
        const urls = ['invoice/invoiceview/']
      
      //  if (this.previusUrl != '/crm/viewlead'  ) {
        if (!(urls.find( x => x === this.previusUrl))) {
          
            // console.log(this.previusUrl)
            localStorage.removeItem('exchangeListStatus')
            localStorage.removeItem('exchangeListData')
       }
       if (localStorage.getItem('exchangeListStatus')) {
         
          tempData = JSON.parse(localStorage.getItem('exchangeListData'))
          // console.log(tempData,"tempData");
          
  
          d1 = tempData['start_date']
          d2 = tempData['end_date']
          this.blnFilterOn=tempData['blnFilter']

          this.intProductId = tempData['productId']
          this.strProduct= tempData['productName']
          this.strSelectedProduct= tempData['productName']
          this.currentProduct= tempData['productName']

          this.intBrandId = tempData['brandId']
          this.strBrand= tempData['brandName']
          this.strSelectedBrand= tempData['brandName']
          this.currentBrand=tempData['brandName']

          this.intItemId = tempData['itemId']
          this.strItem= tempData['itemName']
          this.strSelectedItem= tempData['itemName']
          this.currentItem= tempData['itemName']

          this.intImeiId = tempData['imeiId']
          this.strImei= tempData['imeiName']
          this.strSelectedImei= tempData['imeiName']
          this.currentImei= tempData['imeiName']
          status = 1
          localStorage.removeItem('exchangeListStatus')
          // localStorage.removeItem('enquiryCustomerId')
          // localStorage.removeItem('enquiryCustomerNumber')
        }
      }
       else if (status === 1) {
        
        // console.log("status1");
        
        d1 = new Date(d1).toDateString();
        d2 = new Date(d2).toDateString();
        data = {start_date: d1, end_date: d2,productId:this.intProductId,productName:this.strProduct,brandId:this.intBrandId,brandName:this.strBrand,itemId:this.intItemId,itemName:this.strItem,imeiId:this.intImeiId,imeiname:this.strImei,blnFilter:this.blnFilterOn }
  
        localStorage.setItem('exchangeListData', JSON.stringify(data))
  
      }
      d1 =  moment(d1).format('YYYY-MM-DD');
      d2 =  moment(d2).format('YYYY-MM-DD');
      this.datFrom=d1
      this.datTo=d2
      let dctData={}
      dctData['datFrom'] =d1
      dctData['datTo']= d2
      dctData['blnExport'] = this.blnExport
    //   dctData['datFrom'] = moment(this.datFrom).format('YYYY-MM-DD')
    // dctData['datTo'] = moment(this.datTo).format('YYYY-MM-DD')
    if(this.strSelectedProduct){
      dctData['intProductId'] = this.intProductId;

    }
    if(this.strSelectedBrand){
      dctData['intBrandId'] = this.intBrandId
    }
    if(this.strSelectedItem){
      dctData['intItemId'] = this.intItemId;
    }
    if(this.strSelectedImei){
      dctData['strImei'] = this.currentImei;
    }
    if(this.intBranchId){
      dctData['intBranchId']=this.intBranchId
    }
    this.spinnerService.show();

    this.serviceObject.postData('exchange_sales/exchange_sales/',dctData).subscribe(
      (response) => {
        this.spinnerService.hide();

          if (response.status == 1)
          {
            this.data=response['lst_exchange'];

            if(this.data.length>0){
              // this.blnShowData=true;
              this.blnShowData='block';

            //  this.dataSource=this.data
              this.dataSource = new MatTableDataSource(this.data);
             
             this.dataSource.paginator = this.paginator;
             this.dataSource.paginator.firstPage();
             this.dataSource.sort = this.sort;
            //  #===========
            if (this.blnExport)
             { var a = document.createElement('a');
              document.body.appendChild(a);
              a.href = response['export_data'];
              a.download = 'report.xlsx';
              a.click();
              // window.URL.revokeObjectURL(this.dctReportData);
              a.remove();
              this.toastr.success('Successfully Exported', 'Success!');
            }
                  
              // this.snotifyService.success('Successfully Exported');  
              
            // #============== 
             }
             else{
              // this.blnShowData=false;
              this.blnShowData='none';
              
             }
          }  
          else if (response.status == 0) 
          {
           Swal.fire('Error!','Something went wrong!!', 'error');
          }
      },
      (error) => {   
        this.spinnerService.hide();
       Swal.fire('Error!','Something went wrong!!', 'error');

      });
     
  }

  onView(row){
    localStorage.setItem('exchangeSalesId',row.fk_sales_details_id);
    localStorage.setItem('salesRowId','')
    localStorage.setItem('previousUrl','invoice/exchangelist/')
    this.router.navigate(['invoice/invoiceview/'])

  }

  productNgModelChanged(event){
    if(this.currentProduct!=this.strSelectedProduct){
      this.intProductId = null;
        this.strProduct = '';
    }
  }

  productChanged(item)
   {
    this.currentProduct= item.name
    this.intProductId = item.id;
    this.strProduct = item.name;
    this.strSelectedProduct = item.name;


  }
   brandNgModelChanged(event){
    if(this.currentBrand!=this.strSelectedBrand){
      this.intBrandId = null;
      this.strBrand = '';
    }
  }
  brandChanged(item)
   {
      this.currentBrand = item.name;
      this.intBrandId = item.id;
      this.strBrand = item.name;
      this.strSelectedBrand = item.name;
      
  }
  itemNgModelChanged(event){
    if(this.currentItem!=this.strSelectedItem){
      this.intItemId = null;
      this.strItem = '';
    }
  }
  itemChanged(item)
   {
      this.currentItem= item.code_name;
      this.intItemId = item.id;
      this.strItem = item.code_name;
      this.strSelectedItem = item.code_name;
   
  }
  imeiNgModelChanged(event){
    if(this.currentImei!=this.strSelectedImei){
      this.strImei = '';
    }
  }
  imeiChanged(item)
  {
   this.currentImei = item.imei;
   this.strImei = item.imei;
   this.strSelectedImei = item.imei;
 
 }

 filterClick(){
  this.blnFilterOn =  !this.blnFilterOn;
}
filterClickOff(){
  this.blnFilterOn = false;   
  if (this.strSelectedProduct || this.strSelectedBrand ||this.strSelectedItem ||this.strSelectedImei) {

    this.intProductId= null;
    this.strProduct = '';
    this.strSelectedProduct = '';

    this.intBrandId= null;
    this.strBrand = '';
    this.strSelectedBrand = '';

    this.intItemId= null;
    this.strItem = '';
    this.strSelectedItem = '';

    this.intImeiId= null;
    this.strImei = '';
    this.strSelectedImei = '';

   

    this.getData();
  }

  
}
applyFilter(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  this.dataSource.filter = filterValue;
}
}
