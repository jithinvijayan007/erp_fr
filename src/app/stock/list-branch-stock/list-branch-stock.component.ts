
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelServicesService } from "../../services/excel-services.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-list-branch-stock',
  templateUrl: './list-branch-stock.component.html',
  styleUrls: ['./list-branch-stock.component.css']
})
export class ListBranchStockComponent implements OnInit {
  
  source = [];
  data = [];

  blnExport=false;
  blnBranch=false;

  showAction=false;

  searchBranch: FormControl = new FormControl();
  searchItem: FormControl = new FormControl();
  searchProduct: FormControl = new FormControl();
  searchBrand: FormControl = new FormControl();
  searchItemGroup: FormControl = new FormControl();

  lstBranch = []
  IntBranchId;
  strBranch;
  selectedBranch;

  strProduct='';
  selectedProduct = '';
  intProductId;
  blnProduct=false;
  lst_product = [];

  blnBrand=false;
  lst_brand = [];
  strBrand='';
  intBrandId;
  selectedBrand='';

  lstItem = []
  IntItemId;
  strItem;
  selectedItem;
  dctExportData={}


  lstItemGroup = []
  IntItemGroupId;
  strItemGroup;
  selectedItemGroup;





  lstImei=[{
    imei:null,
    status:null
  }];
  lstPermission=JSON.parse(localStorage.group_permissions)
  blnAdd = false;
  blnEdit = false;
  blnDelete = false;
  blnView = false;
  blnDownload = false;
  lstItems=[];
  showModalImei;
  currentBranchId=Number(localStorage.BranchId)
  groupName=localStorage.group_name

  branchType=localStorage.BranchType;

  @ViewChild('branchId', { static: true }) branchId: any;
  @ViewChild('itemId', { static: true }) itemId: any;

  constructor(private serviceObject: ServerService,
              private toastr: ToastrService,
              private spinnerService: NgxSpinnerService,
              private excelService: ExcelServicesService,
              private modalService: NgbModal
              ) { 
                // this.source = new LocalDataSource(this.data);
              }

  ngOnInit() {
    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "List Branch Stock") {
        this.blnAdd = item["ADD"];
        this.blnEdit= item["EDIT"];
        this.blnDelete = item["DELETE"];
        this.blnView = item["VIEW"]
        this.blnDownload = item["DOWNLOAD"]
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

      this.searchItem.valueChanges.pipe(
      debounceTime(400))
      .subscribe((strData: string) => {

        if (this.selectedItemGroup  != this.strItemGroup|| !this.selectedItemGroup)
        {
         this.IntItemGroupId=null
         this.strItemGroup=''
         this.selectedItemGroup=''        }
        
         if (strData === undefined || strData === null) {
          this.lstItem = [];
        }
        else if(this.strProduct == ''){
          this.toastr.error('Select Product', 'Error!');
          return;
        }
        else if(this.strProduct != this.selectedProduct){
          this.toastr.error('Invalid Product', 'Error!');
          return;
        }
        else if(this.strBrand == ''){
          this.toastr.error('Select Brand', 'Error!');
          return;
        }
        else if(this.strBrand != this.selectedBrand){
          this.toastr.error('Invalid Brand', 'Error!');
          return;
        }
        else if (strData === undefined || strData === null) {
          this.lstItem = [];
        } else {
          if (strData.length >= 1) {
            let dctData={}
            if(this.intProductId){
              dctData['intProductId']=this.intProductId
              dctData['term']=strData
              
            }
            if(this.intBrandId){
              dctData['intBrandId']=this.intBrandId
              
            }

            console.log(this.IntItemGroupId)
            if (this.IntItemGroupId){
              dctData['IntItemGroupId']=this.IntItemGroupId
            }
            this.serviceObject
              .postData('itemcategory/item_typeahead/',dctData)
              .subscribe(
                (response) => {
                  this.lstItem =JSON.parse(JSON.stringify(response['data']))
              }
            );
          }
        }
      }
    ); 
      
  this.searchProduct.valueChanges.pipe(
  debounceTime(400))
  .subscribe((strData: string) => {
    if (strData === undefined || strData === null) {
      this.lst_product = [];
    } else {
      if (strData.length >= 1) {
        this.serviceObject
          .postData('products/product_typeahead/', { term: strData })
          .subscribe(
            (response) => {
              this.lst_product = response['data'];

            }
          );
      }
    }
  }); 

  this.searchItemGroup.valueChanges.pipe(
  debounceTime(400))
  .subscribe((strData: string) => {
    if (strData === undefined || strData === null) {
      this.lstItemGroup = [];
    } else {
      if (strData.length >= 1) {
        this.serviceObject
          .postData('itemgroup/item_group_typeahead/', { term: strData })
          .subscribe(
            (response) => {
              this.lstItemGroup = response['data'];

            }
          );
      }
    }
  }


); 
  
this.searchBrand.valueChanges.pipe(
debounceTime(400))
.subscribe((strData: string) => {
  if (strData === undefined || strData === null) {
    this.lst_brand = [];
  } else {
    if (strData.length >= 1) {
      this.serviceObject
        .postData('brands/brands_typeahead/', { term: strData })
        .subscribe(
          (response) => {
            this.lst_brand = response['data'];

          }
        );
    }
  }
}
);

  }

  BranchChanged(item) {
    this.IntBranchId = item.id;
    this.strBranch = item.name;
  }

  ItemChanged(item) {
    this.IntItemId = item.id;
    this.strItem = item.code_name;
  }

  ItemGroupChanged(item) {
    this.IntItemGroupId = item.id;
    this.strItemGroup = item.name;
  }


  productChanged(item){
    this.intProductId = item.id;
    this.strProduct = item.name;
     
  }

  brandChanged(item){
    this.intBrandId = item.id;
    this.strBrand = item.name;

  }

  getListData() {

    this.blnExport =false; 

    this.showAction=false;

    this.dctExportData={}

    if (this.selectedBranch != this.strBranch) {
      this.IntBranchId = null
      this.strBranch = ''
      if (this.selectedBranch) {
        this.toastr.error('Invalid Branch', 'Error!');
        this.branchId.nativeElement.focus();
        return false;
      }
    }

    if (this.selectedItem != this.strItem) {
      this.IntItemId = null
      this.strItem = ''
      if (this.selectedItem) {
        this.toastr.error('Invalid Item', 'Error!');
        this.itemId.nativeElement.focus();
        return false;
      }
      this.selectedItem = ''
    }
    if(this.selectedItem ==this.strItem){
      this.dctExportData['strItem']=this.selectedItem;

    }
    if(this.selectedItemGroup ==this.strItemGroup){
      this.dctExportData['strItemGroup']=this.selectedItemGroup;

    }
    if(this.selectedItemGroup != ''){
      if(this.selectedItemGroup == ''){
        this.toastr.error('Invalid ItemGroup', 'Error!');
        return;
      }
      else if(this.strItemGroup != this.selectedItemGroup){
        this.toastr.error('Invalid ItemGroup', 'Error!');
        return;
      }
    }

    if(this.selectedBranch ==this.strBranch){
      this.dctExportData['strBranch']=this.selectedBranch;

    }

    this.dctExportData['strItemGroup']=this.selectedItemGroup;

    

    
    if(this.selectedProduct != ''){
      if(this.strProduct == ''){
        this.toastr.error('Invalid Product', 'Error!');
        return;
      }
      else if(this.strProduct != this.selectedProduct){
        this.toastr.error('Invalid Product', 'Error!');
        return;
      }
    }
    if(this.selectedBrand != ''){
      if(this.strBrand == ''){
        this.toastr.error('Invalid Brand', 'Error!');
        return;
      }
      else if(this.strBrand != this.selectedBrand){
        this.toastr.error('Invalid Brand', 'Error!');
        return;
      }
    }


    // if (this.selectedBranch  != this.strBranch|| !this.selectedBranch)
    // {
 
    //  // this.nameId.first.nativeElement.focus();
    //  this.toastr.error('Branch is required', 'Error!');
    //  this.branchId=null
    //  this.strBranch=''
    //  this.selectedBranch=''
    //  return false;
    // }

    if (this.selectedProduct  != this.strProduct|| !this.selectedProduct)
    {
     this.toastr.error('Product is required', 'Error!');
     this.intProductId=null
     this.strProduct=''
     this.selectedProduct=''
     return false;
    }

    if (this.selectedBrand  != this.strBrand|| !this.selectedBrand)
    {
     this.toastr.error('Brand is required', 'Error!');
     this.intBrandId=null
     this.strBrand=''
     this.selectedBrand=''
     return false;
    }
    if (this.selectedItemGroup  != this.strItemGroup|| !this.selectedItemGroup)
    {
     this.IntItemGroupId=null
     this.strItemGroup=''
     this.selectedItemGroup=''
    }

    let dctData = {}
    dctData['IntBranchId'] = this.IntBranchId
    dctData['IntItemId'] = this.IntItemId

    console.log(this.strItemGroup,this.selectedItemGroup)
    if(this.selectedItemGroup){
      dctData['IntItemGroupId'] = this.IntItemGroupId
    }

    if(this.selectedBrand){
      dctData['IntBrandId'] = this.intBrandId
    }
    if(this.selectedProduct){
      dctData['IntProductId'] = this.intProductId
    }
    this.dctExportData['strProduct']=this.selectedProduct;
    this.dctExportData['strBrand']=this.selectedBrand;
    
    this.spinnerService.show();

    this.serviceObject.postData('branch_stock/listbranchstock/', dctData).subscribe(
      (response) => {
        this.spinnerService.hide();

        if (response.status == 1) {
          this.source = response['lst_data'];
          this.lstItems=response['data'];

          // this.source.map(item=>{
          //   if((item.fk_details__fk_master_id__fk_branch_id!=this.currentBranchId)){              
          //     this.blnExport =false;  
          //     return;
          //   }
            // else{
            //   this.blnExport =true;  

            // }
          // })          
          // this.source = new LocalDataSource(this.data); // create the source
          let count=0
          for(let i=0;i<this.source.length;i++){
            if((this.source[i].fk_details__fk_master_id__fk_branch_id==this.currentBranchId && this.source[i].imei.length>0)){              
             count=count+1
            }
            
      }
      // console.log("count",count,"f",this.selectedBranch)
      if(count>0 &&  this.selectedBranch!=undefined && this.selectedBranch!=''){
        this.blnExport =true;  
      }
      else{
                this.blnExport =false;  
                
              }
          // for(let i=0;i< count;i++){
          //       if((this.source[i].fk_details__fk_master_id__fk_branch_id==this.currentBranchId && this.source[i].imei.length>0)){              
          //         this.blnExport =true;
          //         break;
          //       }
          //       else{
          //         this.blnExport =false;  
          //         break;
          //       }
          // }
          if(this.groupName=='ADMIN' || this.branchType==2 || this.branchType==3){
            this.blnBranch = true;
          }
          
        }
        else if (response.status == 0) {
          Swal.fire('Error!', 'error', 'error');
        }
      },
      (error) => {
        this.spinnerService.hide();

        Swal.fire('Error!', 'error', 'error');

      });

  }

  viewData(content,index) {

    this.lstImei=[];
    
    this.lstImei.push(...this.source[index]['imei']);  
    console.log(this.lstImei);
    

    this.showModalImei= this.modalService.open(content, { centered: true, size: 'sm' });
  }

  exportData(){

    let count=1
    if(this.lstItems.length==0){
      Swal.fire("Error!","No Data to Export","error");
      return false;
    }
    else{
      let lstTempData=[];
      for(let item of this.lstItems){
        let dctTable={};
        for(let imei of item['imei']){
          // console.log(imei,"imei");
          dctTable['Sno']=count;
          dctTable['Code']=item['fk_details__fk_item_id__vchr_item_code'];
          dctTable['Name']=item['fk_details__fk_item_id__vchr_name'];
          dctTable['Branch']=item['fk_details__fk_master_id__fk_branch_id__vchr_name'];
          // dctTable['In Transist']=item['tranfer_count'];

          // if((this.groupName!='ADMIN') && (this.currentBranchId==item['fk_details__fk_master_id__fk_branch_id'])){
          //   dctTable['Imei/Batch No.']=JSON.parse(JSON.stringify(imei['imei']))
          // }
          // else if((this.groupName!='ADMIN') && (this.currentBranchId!=item['fk_details__fk_master_id__fk_branch_id'])){
          //   dctTable['Imei/Batch No.']=''
          // }

          // if(this.groupName=='ADMIN'){
          //   dctTable['Imei/Batch No.']=JSON.parse(JSON.stringify(imei['imei']))
          // }
          
          dctTable['Imei/Batch No.']=JSON.parse(JSON.stringify(imei['imei']))
          dctTable['Total Ageing'] = item['item_age'];
          dctTable['Branch Ageing'] = item['branch_age'];
          lstTempData.push(JSON.parse(JSON.stringify(dctTable)));
          count=count+1
        }
   
      }
      // console.log(lstTempData,this.dctExportData,"lstTempData,this.dctExportData",);
      
      let header=[];
      let lstTemp=[];

      lstTempData.forEach(d => {    
        let lstData=[];
        header=[];
          for(let key in d){     

              header.push(key);

            lstData.push(d[key]);
          }

          count++;
          lstTemp.push(lstData);
      }
      );

      let filters=[];

      filters.push(["Product:",this.dctExportData['strProduct'],"","Brand:",this.dctExportData['strBrand']]);

      if(this.dctExportData['strItem'] && !this.dctExportData['strBranch'] && !this.dctExportData['strItemGroup']){
        filters.push(["Item:",this.dctExportData['strItem'],"","",""]);
      }
      else if(this.dctExportData['strBranch'] && !this.dctExportData['strItem'] && ! this.dctExportData['strItemGroup']){
        
        filters.push(["Branch:",this.dctExportData['strBranch'],"","",""]);
      }
      else if(!this.dctExportData['strBranch'] && !this.dctExportData['strItem'] && this.dctExportData['strItemGroup']){
        
        filters.push(["Item Group:",this.dctExportData['strItemGroup'],"","",""]);
      }

      else if(this.dctExportData['strBranch'] && this.dctExportData['strItem'] && !this.dctExportData['strItemGroup']){
        
        filters.push(["Branch:",this.dctExportData['strBranch'],"","Item:",this.dctExportData['strItem']]);  
      }
      else if(this.dctExportData['strBranch'] && !this.dctExportData['strItem'] && this.dctExportData['strItemGroup']){
        
        filters.push(["Branch:",this.dctExportData['strBranch'],"","Item Group:",this.dctExportData['strItemGroup']]);  
      }
      else if(!this.dctExportData['strBranch'] && this.dctExportData['strItem'] && this.dctExportData['strItemGroup']){
        
        filters.push(["Item:",this.dctExportData['strItem'],"","Item Group:",this.dctExportData['strItemGroup']]);  
      }
      else if(this.dctExportData['strBranch'] && this.dctExportData['strItem'] && this.dctExportData['strItemGroup']){
        
        filters.push(["Item:",this.dctExportData['strItem'],"","Item:",this.dctExportData['strItem'],"","Item Group:",this.dctExportData['strItemGroup']]);  
      }


         

      let lstFooter=[];

       //dictionary to pass datas to excel service

      let dctTemp={
        title:'Branch Stock Report',
        fromDat:this.dctExportData['datFrom'],
        toDat:this.dctExportData['datTo'],
        filters:filters,
        header:header,
        data:lstTemp,
        footer:lstFooter
      }

      //this.excelService.generateExcelJs(dctTemp);
      
       this.excelService.exportAsAyttendanceExcel(lstTempData,this.dctExportData);
    }    
  }

}
