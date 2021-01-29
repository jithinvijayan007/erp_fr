// import { element } from '@angular/core/src/render3';
import { Component, OnInit,ChangeDetectorRef,HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { IfStmt } from '@angular/compiler';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-request-transfer',
  templateUrl: './request-transfer.component.html',
  styleUrls: ['./request-transfer.component.css']
})
export class RequestTransferComponent implements OnInit {

  blnSaveDisable=false;
  intBranchId: null;
  datTransfer;
  lstBranch = [];
  strRemarks = '';
  selectedBranch = '';
  selectedRemarks = '';
  stockOrderNo = '';
  lstItemIdExist=[]
  modelopen;
  lstItems = [];
  lstItemsList = [];
  searchBranch: FormControl = new FormControl();
  searchBranchFrom: FormControl = new FormControl();
  searchImei :FormControl = new FormControl();
  closeResult: string;
  lst_imei = [];
  lst_imeiEntered = [];
  lst_imeiEntered1 = [];
  indexOfImei;
  intStockRequestId;
  blnImeiEntered = false;
  batch = '';
  dctImeiAvail = {};
  lstImeiAvial = [];
  lstImeilist =[];
  dctImeiEntered = {};
  lst_batch = [];
  dctBatchnoAvail = {};
  dctBatchNoEntered = {};
  dctAge={}
  lstAgeKeys = [];
  dctAgeNew ={};
  selectedBranchFrom;
  intBranchFromId;
  blnItemHasImei = false;
  blnGetImei = false;
  // blnDisabled = false;
  tempIndex=0
  plusCheck = true; 
  strBrand = '';
  lstBrandList = [];
  lstBatchAvail = [];
  selectedBrand ;
  intBrandId ;
  intTotalQty=0;
  intTotalTableAmount = 0;
  intTotalTableQnty =0;

  strProduct = '';
  lstProductList = [];
  selectedProduct ;
  intProductId ;
  selectedImei = '';
  blnImeiAdd = true;
  strGroup = localStorage.getItem('group_name')
  branch_type = localStorage.getItem('BranchType')
  lstItemsCopy = [];
  blnMoreTransfer=false
  lstSelectedBatch=[]
  dctSelectedBatch={}
  blnBatchSaveDisable=true
  blnCheck=0

  selectedBatchIndex

  selectedAge = '';
  selectedBatchGrn = '';


  @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
    this.disableScroll(event);
  }

  @HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: any) {
    this.disableScroll(event);
  }

  @HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: any) {
    this.disableScroll(event);
  }

  constructor(private serviceObject: ServerService,
    private toastr: ToastrService, public modalService: NgbModal, public router: Router,
    public cdref: ChangeDetectorRef, ) { }

  ngOnInit() {
    if (localStorage.getItem('stockRequestData')) {
     
      localStorage.setItem('stockRequestStatus', '1');
    }
      const dctItem = {
        item_name: null,
        bln_product_disabled:false,        
        qtyDisabled:false,        
        fk_item_id: null,
        product_name: null,
        fk_product_id: null,
        brand_name:null,
        fk_brand_id:null,
        int_qty: null,
        imei: null,
        lst_imei: null,
        flt_price: null,
        flt_total: null,
        bnt_bchno: null,
        dct_bchno:null,
        lst_all_imei: null,
        fk_item__imei_status : false,
      };
      const dctImei ={
        lst_entered_imei :[]
      }
      this.lstItems.push(dctItem);
  
      
      this.lst_imeiEntered1.push(dctImei);
      this.clearAll();
      this.datTransfer = new Date();
      this.stockOrderNo = localStorage.getItem('stockRequestNo');
    this.selectedBranchFrom = localStorage.getItem('BranchName');
    this.intBranchFromId = localStorage.getItem('BranchId');
    this.branch_type = localStorage.getItem('BranchType')
    localStorage.removeItem('stockRequestNo');

     if (this.branch_type=='1') {
      this.plusCheck=false;
     }

     if(this.branch_type == '2' ||this.branch_type == '3'){
      this.blnMoreTransfer=true
     }
console.log(this.branch_type,this.blnMoreTransfer,"type");

      if (this.stockOrderNo) {
        // this.blnDisabled = true;
        if (this.branch_type=='1') {  
        this.plusCheck=false;
        }
          this.getDocData();
      }
      console.log(this.plusCheck,"pluscheck");
      

    this.searchBranch.valueChanges
      .pipe(debounceTime(400))
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null || strData ==='') {
          this.lstBranch = [];
          this.intBranchId=null;

        } else {
          if (strData.length >= 2) {
            this.serviceObject
              .postData('internalstock/get_details/', {str_search: strData})
              .subscribe(
                (response) => {
                  this.lstBranch = response['branch_list'];
                }
              );

          }
        }
      }
      );
      this.searchBranchFrom.valueChanges
        .pipe(debounceTime(400))
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstBranch = [];
        } else {
          if (strData.length >= 2) {
            this.serviceObject
              .postData('internalstock/get_details/', {str_search: strData})
              .subscribe(
                (response) => {
                  this.lstBranch = response['branch_list'];
                }
              );

          }
        }
      }
      );
      this.searchImei.valueChanges
        .pipe(debounceTime(400))
      .subscribe((strData: string) => {
        this.lstImeilist = [];
    
        
        
        if (strData === undefined || strData === null || strData === '') {
          this.lstImeilist = [];
        } else {
          if (strData.length >= 2) {
           
            
            this.lstImeiAvial.forEach(element => {
              if (element.includes(strData)) { 
                this.lstImeilist.push(element);
              }
            
              
            });

          }
        }
      }
      );


  }

  getDocData() {
    this.intStockRequestId = null;

  this.serviceObject
  .postData('internalstock/getdetailsbynumber/', {'vchr_request_num': this.stockOrderNo})
  .subscribe(
    (response) => {
      if (response.status === 1) {
        const dctMasterData = response['request_data'][0];
        this.selectedBranch = dctMasterData['fk_from__vchr_name'];
        this.selectedRemarks = dctMasterData['vchr_remarks'];
        if (dctMasterData){
        }
        this.lstItems = response['details_data'];
        for(let i=0;i<this.lstItems.length;i++){
          this.lstItems[i]['flt_total']=this.lstItems[i]['int_qty'] * this.lstItems[i]['flt_price'];
          this.lstItems[i]['blnDisabled'] =true;
          this.intTotalQty=this.intTotalQty+this.lstItems[i]['int_qty']
        }
        this.lstItems.forEach(element => {
          element['lst_imei'] = null;
          element['lst_all_imei'] = null;          
        });
        this.lst_imeiEntered1 = [];
        for(let i=0; i < this.lstItems.length ; i++){
          const dctImei ={
            lst_entered_imei :[]
          }
          this.lst_imeiEntered1.push(dctImei);
        }
        this.lstItemsCopy = JSON.parse(JSON.stringify(this.lstItems));
        this.intBranchId = dctMasterData['fk_from_id'];
        this.intStockRequestId = dctMasterData['pk_bint_id'];
        
        this.tableGrandTotalCalculation(this.lstItems);

      } else {
        this.toastr.error(response['reason']);
      }
    }
  );
  }
  BranchChanged (item) {
    this.intBranchId = item.pk_bint_id;
  }
  itemSearched(data, index) {
    this.lstItemsList = [];
    if (data === null || data === '') {
      this.lstItemsList = [];
      this.lstItems[index]['intId'] = null;
    }

    if(this.lstItems[index]['product_name']){
     if(this.lstItems[index]['product_name'] != this.selectedProduct){
      this.toastr.error('Select valid product');
      return false;
    }
    }

    // if(this.lstItems[index]['brand_name']){
    //   if(this.lstItems[index]['brand_name'] != this.selectedBrand){
    //     this.toastr.error('Select valid brand');
    //     return false;
    //   }
    // }

    if (data !== null && data.length >= 2) {
      const postData = {}
      // if(this.lstItems[index]['product_name'] && this.lstItems[index]['brand_name']){
      //   postData['term'] = data;
      //   postData['intProduct'] = this.lstItems[index]['fk_product_id'];
      //   // postData['intBrand'] = this.lstItems[index]['fk_brand_id'];
      // }
      // else if(this.lstItems[index]['brand_name']){
      //   postData['term'] = data;
      //   postData['intBrand'] = this.lstItems[index]['fk_brand_id'];
      // }
       if(this.lstItems[index]['product_name']){
        postData['term'] = data;
        postData['intProduct'] = this.lstItems[index]['fk_product_id'];
      }
      else{
        postData['term'] = data;
      }
    this.serviceObject.postData('purchase/item_typeahead/', postData).subscribe(
      (response) => {
        this.lstItemsList = response['data'];
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');
      }
      );
    }
  }
  // brandSearched(data){
  //   this.lstBrandList = [];
  //   if (data === null || data === '') {
  //     this.lstBrandList = [];
  //     }
  //   if (data !== null && data.length >= 2) {
  //   this.serviceObject.postData('brands/brands_typeahead/', {term: data}).subscribe(
  //     (response) => {
  //       this.lstBrandList = response['data'];
  //     },
  //     (error) => {
  //       Swal.fire('Error!', 'error', 'error');
  //     }
  //     );
  //   }
  // }
  productSearched(data){
   

    
    this.lstProductList = [];
    if (data === null || data === '') {
      this.lstProductList = [];
      }
    if (data !== null && data.length >= 2) {
    this.serviceObject.postData('products/product_typeahead/', {term: data}).subscribe(
      (response) => {
        this.lstProductList = response['data'];
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');
      }
      );
    }
  }
  getImei(index) {
    let lstAllBatchNo=[]
    let lstSelectedAllBatchNo=[]

    this.blnGetImei = false;
     if (this.lstItems[index]['fk_item_id'] == null) {
      this.toastr.error('Enter item name of row ' + (index + 1) );
      return;
    } else if (this.lstItems[index]['int_qty'] === null || this.lstItems[index]['int_qty'] === undefined) {
      this.toastr.error('Enter item quantity of row ' + (index + 1) );
      return;
    }
    const dct_data = {
      fk_item_id: this.lstItems[index]['fk_item_id'],
    };
    if (this.intBranchId) {
      dct_data['fk_branch_id'] = this.intBranchId;
    }
    this.lstBatchAvail = [];
    this.lstImeiAvial = [];
    this.lstAgeKeys = [];
    this.serviceObject.postData('internalstock/getimei/', dct_data).subscribe(
      (response) => {
          this.blnGetImei = true;
                        console.log(this.blnItemHasImei,'imei');
                        
                        this.dctImeiAvail = response['dct_imei'];  
                        this.dctBatchnoAvail = response['dct_batch'];
                        if(this.blnItemHasImei){
                          this.dctAge = response['dct_age'];
                        }
                        else{
                          this.dctAge = response['dct_batch_age'];
                        }
                        

                        this.lstAgeKeys = Object.keys(this.dctAge);

                        for(let key in this.dctImeiAvail){
                       
                          this.dctImeiAvail[key].forEach(element => {
                            this.lstImeiAvial.push(element)
                            
                          });
                        }

                        // for(let key in this.dctBatchnoAvail){
                       
                        //   this.dctBatchnoAvail[key].forEach(element => {
                        //     if(!this.lstSelectedBatch.includes(element)){
                        //       this.lstBatchAvail.push(element)
                        //     }
                            
                        //   });
                        // }

                     
                      for(let key in this.dctSelectedBatch){
                          lstSelectedAllBatchNo.push(this.dctSelectedBatch[key]);
                      }
                      for(let key in this.dctBatchnoAvail){
                          this.dctBatchnoAvail[key].forEach(element => {
                            lstAllBatchNo.push(element);
                          });
                      }
                      if(lstSelectedAllBatchNo.length>0){
                        this.lstBatchAvail = lstAllBatchNo.filter(x => lstSelectedAllBatchNo.every(y => y !== x));
                      }
                      else{
                        this.lstBatchAvail = lstAllBatchNo;
                      }
                        

                        // if(this.lstBatchAvail.length==0 && !this.lstItems[index]['fk_item__imei_status']){
                        //     this.lstItems[index]['item_qty'] = 0;
                        //     this.lstItems[index]['int_qty'] = 0;
                            

                        //   }
                          
                     

                           
                         
                        for(let index = 0 ; index< this.lstImeiAvial.length ; index++){
                          this.lstImeiAvial[index] = {'imei':this.lstImeiAvial[index],'blnChecked':true}
                        }

                     
                        // for(let index = 0 ; index< this.lstBatchAvail.length ; index++){
                        //   this.lstBatchAvail[index] = {'batch':this.lstBatchAvail[index],'blnChecked':true}
                        //  }

                         for(let index = 0 ; index< this.lstBatchAvail.length ; index++){
                          for(let ageIndex =index+1 ;ageIndex <= this.lstAgeKeys.length ; ageIndex ++){
      
                            
                            if(this.lstBatchAvail[index]==this.dctAge[this.lstAgeKeys[ageIndex-1]]['batch']){
                              this.lstBatchAvail[index] = {'batch':this.lstBatchAvail[index],'blnChecked':true,'age':this.dctAge[this.lstAgeKeys[ageIndex-1]].int_age,'qnty':this.dctAge[this.lstAgeKeys[ageIndex-1]].int_qty,'batch_grn':this.lstAgeKeys[ageIndex-1]};
                              break;
                            }
                          }
                        }
                      
                 
                   
                        
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');
      }
      );
  
  }
  itemSelected(item, index,event) {
    // console.log("event",event);
    
    let addItemStatus = false;
    // console.log(this.blnDisabled,"this.blnDisabled");


    if(!this.plusCheck){
      this.lstItems.forEach(element=>{
        if(!this.lstItemIdExist.includes(element.fk_item_id) && element.fk_item_id){
          this.lstItemIdExist.push( element.fk_item_id)
        }
          
        if(element.fk_item_id===item.id && element.fk_item__imei_status === false){
          addItemStatus = true;
        }
        if(element.fk_item_id!=item.id){
          addItemStatus = true;
        }
      })
      
      if(addItemStatus){
        this.lstItems[index]['fk_item_id'] = item.id;
        this.lstItems[index]['fk_item__imei_status'] = item.imei_status;
        this.lstItemsList = [];
        this.lstItems[index]['flt_price'] = item.rate;
        // this.lstItems[index]['brand_name'] = item.brand_name;
        this.lstItems[index]['product_name'] = item.product_name;
        // this.lstItems[index]['intBrand'] = item.brand_id;
        this.lstItems[index]['intProduct'] = item.product_id;
        this.selectedProduct = item.product_name;
        // this.selectedBrand = item.brand_id;
        
        

        // this.lstItems.forEach(element => 
        //   {
        //   if(element.fk_item_id===item.id && this.lstItemIdExist.includes(item.id) ){
        //     this.lstItems[index]['item_qty'] = element.item_qty-element.int_qty;
        //   }
        //   else{
        //     this.lstItems[index]['item_qty'] = item.item_qty;
        //   }
        //  });
        for(let i=0;i<this.lstItems.length;i++){
  
          if(this.lstItemIdExist.includes(item.id)  && this.lstItems[i].fk_item_id===item.id){
            // this.lstItems[index]['item_qty'] = this.lstItems[i].item_qty-this.lstItems[i].int_qty;
            break
          }
          else{
            this.lstItems[index]['item_qty'] = item.item_qty;
          }
         }
      

      this.lstItemIdExist.push( item.id)
        
      }
      else{
        event.source.value=null;
        this.lstItems[index]['fk_item_id'] = null;
        this.lstItems[index]['fk_item__imei_status'] = null;
        this.lstItems[index]['flt_price'] = null;
        this.lstItems[index]['item_qty'] = null;
        this.lstItems[index]['brand_name'] = null;
        this.lstItems[index]['product_name'] =null;
        // this.lstItems[index]['intBrand'] = null;
        this.lstItems[index]['intProduct'] = null;
        this.selectedProduct =null;
        // this.selectedBrand = null;
        this.lstItemsList = [];

        this.toastr.error('Only same item with different batch can add');
        return
      }
    }
    else{
      let status=true

      this.lstItems.forEach(element=>{
        this.lstItemIdExist.push( element.fk_item_id)
      
         if(element.fk_item_id===item.id ){
           status=false
           if(element.fk_item__imei_status === false){
             addItemStatus = true;
           }
        }
      })
      if(status==true){
        addItemStatus=true
      }
      if(addItemStatus){
        this.lstItems[index]['fk_item_id'] = item.id;
        this.lstItems[index]['fk_item__imei_status'] = item.imei_status;
        this.lstItemsList = [];
        this.lstItems[index]['flt_price'] = item.rate;
        // this.lstItems[index]['brand_name'] = item.brand_name;
        this.lstItems[index]['product_name'] = item.product_name;
        // this.lstItems[index]['intBrand'] = item.brand_id;
        this.lstItems[index]['intProduct'] = item.product_id;
        this.selectedProduct = item.product_name;
        // this.selectedBrand = item.brand_id;
        

      //   this.lstItems.forEach(element => 
      //     {
      //     if(element.fk_item_id===item.id && this.lstItemIdExist.includes(item.id) ){
      //       this.lstItems[index]['item_qty'] = element.item_qty-element.int_qty;
      //     }
      //     else{
      //       this.lstItems[index]['item_qty'] = item.item_qty;
      //     }
      //  });
      for(let i=0;i<this.lstItems.length;i++){
  
        if(this.lstItemIdExist.includes(item.id)  && this.lstItems[i].fk_item_id===item.id){
          // this.lstItems[index]['item_qty'] = this.lstItems[i].item_qty-this.lstItems[i].int_qty;
          break
        }
        else{
          this.lstItems[index]['item_qty'] = item.item_qty;
        }
       }
    
      this.lstItemIdExist.push( item.id)
      }
      else{
        event.source.value=null;
        this.lstItems[index]['fk_item_id'] = null;
        this.lstItems[index]['fk_item__imei_status'] = null;
        this.lstItems[index]['flt_price'] = null;
        this.lstItems[index]['item_qty'] = null;
        this.lstItems[index]['brand_name'] = null;
        this.lstItems[index]['product_name'] =null;
        // this.lstItems[index]['intBrand'] = null;
        this.lstItems[index]['intProduct'] = null;
        this.selectedProduct =null;
        // this.selectedBrand = null;
        
        this.lstItemsList = [];
        this.toastr.error('Only same item with different batch can add');
        return
      }
    }
  }
  // brandSelected(item,index){
  //   this.selectedBrand = item.name;
  //   this.lstItems[index]['fk_brand_id'] = item.id;
  // }
  productSelected(item,index){
    this.selectedProduct = item.name;
    this.lstItems[index]['fk_product_id'] = item.id;

    this.lstItems[index]['fk_item_id'] = null;
    this.lstItems[index]['fk_item__imei_status'] = null;
    this.lstItems[index]['flt_price'] = null;
    this.lstItems[index]['item_qty'] = null;
    this.lstItems[index]['lst_all_imei'] = null;
    this.lstItems[index]['bnt_bchno'] = null;
    this.lstItems[index]['flt_total'] = null;
    this.lstItems[index]['flt_price'] = null;
    this.lstItems[index]['lst_imei'] = null;
    this.lstItems[index]['imei'] = null;
    this.lstItems[index]['int_qty'] = null;
    this.lstItems[index]['fk_brand_id'] = null;
    this.lstItems[index]['brand_name'] = null;
    this.lstItems[index]['qtyDisabled'] = false;
    this.lstItems[index]['bln_product_disabled'] = false;
    this.lstItems[index]['str_imei'] = null;
    this.lstItems[index]['item_name'] = null;
    this.lstItems[index]['product_name'] =  item.name;
    this.lstItems[index]['intProduct'] =  item.id;
    this.lstItemsList = [];

    this.lst_imeiEntered1.splice(index, 1);
    const dctImei ={
      lst_entered_imei :[]
    }
    this.lst_imeiEntered1[index]=dctImei
    this.lstSelectedBatch.splice(index, 1);
    delete this.dctSelectedBatch[index]

    this.lstItemIdExist.splice( this.lstItems[index]['fk_item_id'])
  

  }

// imei popup start here
openimeipopup(imeipopup, int_qty, index) {  
  // console.log(this.lst_imei,this.lstItems[this.indexOfImei] ,"imeishow111");
  // console.log(this.lstItems,"1");
  this.blnBatchSaveDisable=true 
  this.blnItemHasImei = this.lstItems[index]['fk_item__imei_status'];   
  this.lst_batch = [];
  if (this.lstItems[index]['bnt_bchno'] === null) {
  this.batch = '';
  } else {
    this.batch = this.lstItems[index]['bnt_bchno'][0];
  }
  if (this.intBranchId == null) {
    this.toastr.error('Select Branch');
    return false;
  }
  this.blnImeiEntered = true;
  this.lst_imei = [];
  this.indexOfImei = index;
  if (this.lstItems[this.indexOfImei]['int_qty'] === null || this.lstItems[this.indexOfImei]['int_qty'] === undefined || this.lstItems[this.indexOfImei]['int_qty'] <=0 ) {
    this.toastr.error('Enter Quantity');
    return;
  }
  this.getImei(index);

  if (this.lstItems[this.indexOfImei]['lst_all_imei'] !== null && this.lstItems[this.indexOfImei]['lst_all_imei'] !== undefined
  && this.lstItems[this.indexOfImei]['lst_all_imei'].length === this.lstItems[this.indexOfImei]['int_qty']) {

    this.lst_imei = this.lstItems[this.indexOfImei]['lst_imei'];
    this.batch = this.lstItems[this.indexOfImei]['bnt_bchno'];
  } 

  else if(this.lstItems[this.indexOfImei]['lst_all_imei'] !== null && this.lstItems[this.indexOfImei]['lst_all_imei'] !== undefined
  && this.lstItems[this.indexOfImei]['lst_all_imei'].length != this.lstItems[this.indexOfImei]['int_qty']){
    this.lst_imei = this.lstItems[this.indexOfImei]['lst_imei'];
     
     if(this.lstItems[this.indexOfImei]['lst_all_imei'].length < int_qty){
        for (let i = 0; i < Number(int_qty); i++) {
          
      
           if(this.lstItems[this.indexOfImei]['lst_all_imei'].length <= i)            // qnty  icreased
           {          
             
            const dct_imei = {slno: (i + 1), imei: ''};
            this.lst_imei.push(dct_imei);
           }
           
        }
      }
      else if(this.lstItems[this.indexOfImei]['lst_all_imei'].length > int_qty){
        let value=this.lstItems[this.indexOfImei]['lst_all_imei'].length
        const length = this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei.length;
       
        while (value!=int_qty ){
          
            this.lst_imei.splice(value-1 ,1)   //qnty decreased
            this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei.splice(value-1, 1); 
            this.lstItems[this.indexOfImei]['lst_all_imei'].splice(value-1, 1)
            value=value-1          // last entered imei deleted 
          }
  
      }   
  }
  else {
    
    for (let i = 0; i < Number(int_qty); i++) {
      const dct_imei = {slno: (i + 1), imei: ''};
      this.lst_imei.push(dct_imei);
    }
  }
  this.modelopen = this.modalService.open(imeipopup, { centered: true, size: 'lg' ,backdrop : 'static',keyboard : false});
}

batchnoClick(index) {
  // console.log(this.selectedBatchGrn,this.lstBatchAvail,this.dctBatchnoAvail,",this.selectedBatchGrn");
  
  
  let blnBatchNoExists = false;
  this.dctBatchNoEntered = {};
  if (this.batch !== null && this.batch !== '' && this.batch !== undefined) {
  this.batch = this.batch.toString().trim();
  // let i = 0
  // for (const key in this.dctBatchnoAvail) {

    // for(let i=0;i<this.lstBatchAvail.length>0)

    if (this.dctBatchnoAvail.hasOwnProperty(this.selectedBatchGrn)) {
      // if (this.lstBatchAvail[i].batch_grn == this.selectedBatchGrn) {  // grn number change
            // this.dctBatchNoEntered[this.selectedBatchGrn] = this.batch;.
            this.dctBatchNoEntered[this.selectedBatchGrn] = this.batch;
            this.lst_batch[0] = this.batch;
          this.blnImeiEntered = true;
          blnBatchNoExists = true;
          this.blnBatchSaveDisable=false 
          // break;
      // }
    }
    // i = i+1;            // grn change
  // }
}
// console.log(blnBatchNoExists,"blnbarch");

  if (!blnBatchNoExists && this.batch !== '' && this.batch !== null && this.batch !== undefined) {
    this.toastr.error('Batch number not available for this branch');
    this.blnImeiEntered = false;
    return;
  }
}
imeiClick(imei,index,blnAction) {


  

  imei = imei.toString().trim();
  let blnImeiExists = false;
  let blnImeiChanged = false;
  this.selectedImei = imei;
   if (this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei.indexOf(imei) !== -1 && this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei.indexOf(imei) !== index) {
      this.toastr.error('Imei already exists');
      this.lst_imei[index]['imei'] = '';
      this.blnImeiEntered = false;
      return;
    }
    if (index <= this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei.length && this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei[index] !== undefined) {
     
      console.log('first');
      
      const str_popimei = this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei[index];
 
      for (const key in this.dctImeiEntered) {
        if (this.dctImeiEntered.hasOwnProperty(key)) {
          const i = this.dctImeiEntered[key].indexOf(str_popimei);
          
          if (i !== -1) {
            let intkeyImei = 0;
             intkeyImei = Number(this.getKey(imei));
             
            if (this.dctImeiEntered[key][i] === str_popimei && intkeyImei === Number(key)) {
              
              if(!blnAction){
              this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei[index] = imei;
              this.dctImeiEntered[key][i] = imei;
              blnImeiChanged = true;
              blnImeiExists = true;
              // this.blnBatchSaveDisable=false               
              this.blnImeiEntered = true;
              
              }
              else{
            
                // this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei[index] = imei;
                this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei.splice(index, 1);
                this.dctImeiEntered[key].splice(i, 1);
                blnImeiChanged = true;
                blnImeiExists = true;
                this.blnImeiEntered = true;
               
              }
              
            }
          }
        }
      }
    }
     
    if ((imei !== '') && (this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei.indexOf(imei) === -1) && (!blnImeiChanged)) {
      console.log('deecond');
      let templst =  []
     for (const key in this.dctImeiAvail) {
      if (this.dctImeiAvail.hasOwnProperty(key)) {
        if (this.dctImeiAvail[key].indexOf(imei) !== -1) {
            this.lst_imeiEntered1[this.indexOfImei]['lst_entered_imei'].push(imei)
            if (this.dctImeiEntered.hasOwnProperty(key)) {
              this.dctImeiEntered[key].push(imei);
            } else {
              this.dctImeiEntered[key] = [];
              this.dctImeiEntered[key].push(imei);
            }
            this.blnImeiEntered = true;
            // this.blnBatchSaveDisable=false             
            blnImeiExists = true;
        }
      }
    }
    }
    if (!blnImeiExists && imei !== '') {
      this.toastr.error('Imei not available for this branch');
      this.blnImeiEntered = false;
      // this.blnBatchSaveDisable=true 
      
      return;
    }

    if (imei === '') {
      this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei.splice(index, 1);
    }
    this.lstImeilist = [];

  
    

}
closeImei(imeishow) {

  this.lst_imei.forEach((element,index) => {
    if(element.imei == ''){
      this.lst_imei.splice(index,this.lst_imei.length );
    }
  });

  this.modelopen.close();
  this.batch = '';

    if(this.lstItems[this.indexOfImei]['lst_all_imei']){
      this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei = JSON.parse(JSON.stringify(this.lstItems[this.indexOfImei]['lst_all_imei']))//change
    }
    else{
      this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei = [];
    }
    this.dctImeiEntered = {};
    this.lstImeilist = [];
    this.lstImeiAvial = [];
    this.lstBatchAvail = []
  
}
saveImei() {
 
  if (this.lstItems[this.indexOfImei]['int_qty'] > this.lstItems[this.indexOfImei]['item_qty']){
    this.toastr.error('Maximum quantity of row ' + (this.indexOfImei + 1) +' is '+ this.lstItems[this.indexOfImei]['item_qty']);
    return;
  }
  if (this.batch !== '' && this.batch !== null && this.batch !== undefined) {
    this.lst_batch[0] = this.batch;
  }
  else if((this.batch == '' || this.batch == null || this.batch == undefined)&&(!this.blnItemHasImei)){
    this.toastr.error('Enter Batch number');
    return;
  }
  if (!this.blnImeiEntered) {
  return;
  }

   if ((this.lstItems[this.indexOfImei]['fk_item__imei_status'] === true)
    && (this.lstItems[this.indexOfImei]['int_qty'] !== this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei.length)) {
    this.toastr.error('Enter imei');
    return;
   }
   else {
   
     
     
    this.lstItems[this.indexOfImei]['lst_all_imei'] = this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei;

//newly added code for quanty change error start

    if(this.lstItems[this.indexOfImei]['imei']){           // check imei save done or not
      for (const key in this.dctImeiEntered) {
        if (this.lstItems[this.indexOfImei]['imei'].hasOwnProperty(key)){ //check the key is saved already

          this.lstItems[this.indexOfImei]['imei'][key].forEach(element => {       // push the entered imei corresponding to that key
            this.lstItems[this.indexOfImei]['imei'][key].push(element)
           });  
        }
        else{
          this.lstItems[this.indexOfImei]['imei'][key] = this.dctImeiEntered[key]     // if the key is not, newly entered imei saved to corresponding key
        }
      }  
    }
    else{
      this.lstItems[this.indexOfImei]['imei'] = this.dctImeiEntered;                    // for the initial save
    }


// new code end  
    if(this.lstItems[this.indexOfImei]['fk_item__imei_status']){
      this.lstItems[this.indexOfImei]['lst_imei'] = this.lst_imei;
    }
    else{
      this.lstItems[this.indexOfImei]['lst_imei'] = [];
    }
    


    if( Object.keys(this.dctBatchNoEntered).length>0 && !this.lstItems[this.indexOfImei]['fk_item__imei_status']){
      this.lstItems[this.indexOfImei]['dct_bchno'] = this.dctBatchNoEntered;
    }
    else{
      this.lstItems[this.indexOfImei]['dct_bchno'] = null;
    }

    if(this.lst_batch.length>0 && !this.lstItems[this.indexOfImei]['fk_item__imei_status'])
    {
      this.lstItems[this.indexOfImei]['bnt_bchno'] = this.lst_batch;
    }
    else{
      this.lstItems[this.indexOfImei]['bnt_bchno'] = null;
    }

    this.lstSelectedBatch[this.indexOfImei]= this.lst_batch[0]
    this.dctSelectedBatch[this.indexOfImei]= this.lst_batch[0]

    this.lstBatchAvail.splice(this.selectedBatchIndex,1)
    // this.lstItems[this.indexOfImei]['qtyDisabled'] =true
    this.modelopen.close();
    this.batch = '';
    // this.lst_imeiEntered = [];    //comment due to save validation
    this.dctImeiEntered = {};    
  }
  this.lstImeiAvial = [];
}
getKey (imei) {
  for (const key in this.dctImeiAvail) {
    if (this.dctImeiAvail.hasOwnProperty(key)) {
    if (this.dctImeiAvail[key].indexOf(imei) !== -1) {
        return key;
        }
    }
  }
}
saveData () {
  this.blnCheck=0
  
  if (this.intBranchId == null) {
    this.toastr.error('Select To Branch');
    return;
  } else if (this.datTransfer == null) {
    this.toastr.error('Select transfer date');
    return;
  } else if (this.strRemarks == '') {
    this.toastr.error('Enter remarks');
    return;
  }
  if(this.selectedBranchFrom=='ANGAMALY'){
    if(this.lstItems.length>1){
      this.toastr.error('Only one item can transfer from Angamaly');
      return false;
    }
  }
 let curQtyTot=0
  // console.log(this.lstItems ,'item');
  

  for (let index = 0; index < this.lstItems.length; index++) {
    const element = this.lstItems[index];
    curQtyTot=curQtyTot+element.int_qty

    if (element.item_name == null || element.fk_item_id == null) {
      this.toastr.error('Enter item name of row ' + (index + 1) );
      return;
    } else if (element.int_qty == null || element.int_qty == 0) {
      this.toastr.error('Enter item quantity of row ' + (index + 1) );
      return;
    }
    else if (element.int_qty > 1 && this.selectedBranchFrom=='ANGAMALY') {
      this.toastr.error('Only one quantity can transfer from Angamaly');
      return;
    }
    else if (element.flt_price == null) {
      this.toastr.error('Enter item rate of row ' + (index + 1) );
      return;
    } else if (element.fk_item__imei_status === true && (element.imei === null || element.imei === '')) {
   
      this.toastr.error('Enter item imei of row ' + (index + 1) );
      return;
    }else if(element.fk_item__imei_status === true && (element.imei) && (element.int_qty != element.lst_all_imei.length)){
      this.toastr.error('Enter item imei of row ' + (index + 1) );    
      return;
    }
    else if(element.int_qty>element.item_qty){
      this.toastr.error('Maximum quantity of row ' + (index + 1) +' is '+ element.item_qty);
      return;
    } else if ((element.bnt_bchno === null || element.bnt_bchno === '') && element.fk_item__imei_status === false) {
      this.toastr.error('Enter item batch number of row ' + (index + 1) );
      return;
    }
    else if(curQtyTot>this.intTotalQty && !this.plusCheck){
      this.toastr.error("Transfered quantity is greater than requested quantity");
      return;
    }

    
  }
  console.log(this.lstItems,"items");
  
  this.lstItems.forEach(element => {
    if(element.fk_item__imei_status){
      this.blnCheck=1
    }
  });

const datTransfer = moment(this.datTransfer).format('YYYY-MM-DD');
const dctData = {
  'intBranchId': this.intBranchId,
  'dat_transfer': datTransfer,
  'lst_details': this.lstItems,
  'vchr_remarks': this.strRemarks,
  'intBranchFromId': this.intBranchFromId
};
if (this.stockOrderNo && this.intStockRequestId) {
dctData['vchr_stkrqst_num'] = this.stockOrderNo;
dctData['pk_bint_id'] = this.intStockRequestId;
}
this.blnSaveDisable = true;
this.serviceObject
  .postData('internalstock/addstocktransfer/', dctData)
  .subscribe(
    (response) => {
      if (response.status === 1) {

        if(response.hasOwnProperty('bln_batch') && response['bln_batch']){
          Swal.fire({
            title: "Are you sure",
            text: response['message'],
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
          }).then(result => {
            if (result.value) {
              dctData['bln_batch_pass']=true
              this.serviceObject.postData('internalstock/addstocktransfer/',dctData).subscribe(
                (response) => {
                  if(response['status']==1){
                    this.toastr.success(response['message']);
                    this.clearAll();
                    localStorage.setItem('previousUrl','stocktransfer/transferredlist');
                    this.router.navigate(['stocktransfer/transferredlist']);
                  }
                  else{
                    this.blnSaveDisable = false;  
                    this.toastr.error(response['message']);
                  }
           
                },
                error => {
                  alert(error);
                }
                )
                }  
                else{
                  this.blnSaveDisable = false;  
                  
                }
              })
        }
        else if(response.hasOwnProperty('bln_imei') && response['bln_imei']){
          this.toastr.error(response['message']);
          this.blnSaveDisable = false;
          
        }
        else{
          this.toastr.success(response['message']);
          this.clearAll();
          localStorage.setItem('previousUrl','stocktransfer/transferredlist');
          this.router.navigate(['stocktransfer/transferredlist']);
        }

      } else {
        this.blnSaveDisable = false;
        // this.toastr.error('Error');
        this.toastr.error(response['message']);
        
      }
    },
    (error) => {
      this.blnSaveDisable = false;  
      this.toastr.error('Error');
      
    }
  );
}
addItem() {
  this.lstItemsList = [];
  this.lst_imeiEntered = []; //newly added 
    const dctItem = {
      item_name: null,
      bln_product_disabled:false,
      fk_item_id: null,
      product_name: null,
      qtyDisabled:false,      
      fk_product_id: null,
      brand_name:null,
      fk_brand_id:null,
      int_qty: null,
      imei: null,
      lst_imei: null,
      flt_price: null,
      flt_total: null,
      bnt_bchno: null,
      dct_bchno:null,      
      lst_all_imei: null,
      fk_item__imei_status : false,
      blnDisabled : false,
    };
    const dctImei ={
      lst_entered_imei :[]
    }
    const length = this.lstItems.length
    if(this.lstItems[length-1].fk_item_id == null){
      this.toastr.error('Enter item name of row ' + (length) )
      return false;
    }
    else  if(this.lstItems[length-1].int_qty == null){
      this.toastr.error('Enter quantity of row ' + (length) )
      return false;
    }
    else if(this.selectedBranch=='ANGAMALY') {  
      if(this.lstItems.length>1){
      this.toastr.error('Only one item can transfer from Angamaly');
      return false;
      }
    } 
    else{
    
      this.lstItems.push(dctItem);
      this.lst_imeiEntered1.push(dctImei)
      let index=0
      // this.lstItems.forEach(element => {
      //   if(this.lstItems.length-1!=index){
      //     element['qtyDisabled'] =true
      //                                                              //commented due to enabling quantity
      //   }
      //   else{
      //     element['qtyDisabled'] =false
          
      //   }
      //   index=index+1
      // });
    }
}


deleteItem(index) {
  
  this.lstItemsList = [];
  this.lst_imeiEntered1.splice(index, 1);
  this.lstSelectedBatch.splice(index, 1);
  delete this.dctSelectedBatch[index]

  this.lstItemIdExist.splice( this.lstItems[index]['fk_item_id'])
  this.lstItems.splice(index, 1);
  let intIndex=0
  // this.lstItems.forEach(element => {
  //   if(this.lstItems.length-1!=intIndex){
  //     element['qtyDisabled'] =true
  //   }
  //   else{
  //     element['qtyDisabled'] =false
      
  //   }
  //   intIndex=intIndex+1
  // });
  if (this.lstItems.length === 0) {
 
    this.lstItems = [];
    const dctItem = {
      item_name: null,
      bln_product_disabled:false,      
      fk_item_id: null,
      qtyDisabled:false,      
      product_name: null,
      fk_product_id: null,
      brand_name:null,
      fk_brand_id:null,
      int_qty: null,
      imei: null,
      lst_imei: null,
      flt_price: null,
      flt_total: null,
      bnt_bchno: null,
      dct_bchno:null,      
      lst_all_imei: null,
      fk_item__imei_status : false,
    };
    const dctImei ={
      lst_entered_imei :[]
    }
    this.lstItems.push(dctItem);
    this.lst_imeiEntered1.push(dctImei)
  }
  this.tableGrandTotalCalculation(this.lstItems);
}

clearAll() {
  this.stockOrderNo = '';
  this.intBranchId = null;
  if (this.strGroup == 'ADMIN'){
    this.datTransfer = null;
  }
  this.lstBranch = [];
  this.strRemarks = '';
  this.lstItems = [];
  this.lstItemsList = [];
  this.lst_imeiEntered1 = [] //newly added
  this.selectedBranch = '';
  const dctItem = {
      item_name: null,
      bln_product_disabled:false,      
      fk_item_id: null,
      product_name: null,
      qtyDisabled:false,      
      fk_product_id: null,
      brand_name:null,
      fk_brand_id:null,
      int_qty: null,
      imei: null,
      lst_imei: null,
      flt_price: null,
      flt_total: null,
      bnt_bchno: null,
      dct_bchno:null,      
      lst_all_imei: null,
      fk_item__imei_status : false,
  };
  const dctImei ={
    lst_entered_imei :[]
  }
  this.lstItems.push(dctItem);
  this.lst_imeiEntered1.push(dctImei);
}

rejectRequest() {
  if (this.strRemarks === '') {
    this.toastr.error('Enter remarks');
    return;
  }
  const dctData = {
    'int_id': this.intStockRequestId,
    'type': 'to',
    'remarks':this.strRemarks
  };
  this.serviceObject.postData('internalstock/cancelrequest/', dctData).subscribe(res => {
    if (res.status === 1) {
  localStorage.setItem('previousUrl','stockrequest/stockrequestlist');
      
      this.router.navigate(['stockrequest/stockrequestlist']);
    } else {
      this.toastr.error('Error occured ' );
    }
  });
}

imeiAdd(item1){
 let indexForImei;
  let imeifinish = true;
  if(item1.blnChecked == true){
    const lstimeilength = this.lst_imei.length;
     for(let item = 0; item<lstimeilength; item ++){
       if(this.lst_imei[item].imei == item1.imei){
        this.toastr.error('Imei already exists');
        return 
       }
       if(this.lst_imei[item].imei == ''){
        indexForImei=item;
         this.lst_imei[item].imei = item1.imei;
         item1.blnChecked = false;
         imeifinish = false;
         break ;
       }
     }
    if(imeifinish){
      this.toastr.error('All Imei entered');
      return 
    }
  }
  else{
    this.lst_imei.forEach((element,index )=> {
      if(element.imei === item1.imei){
       element.imei = '';
       indexForImei = index;
      }
    });
    item1.blnChecked = true;
  }
  this.imeiClick(item1.imei,indexForImei,item1.blnChecked);

}

batchAdd(item1,index){
  
  let indexForBatch;
   let batchfinish = true;
   if(item1.blnChecked == true){
     if(item1.qnty<  this.lstItems[this.indexOfImei]['int_qty']){    // new change
      this.toastr.error('Entered quantity is not available in this Batch Number');
      batchfinish = false;
     }
     else{
  
      if(this.batch == '' || this.batch == undefined){
        this.batch = item1.batch;
        item1.blnChecked = false;
        this.selectedBatchIndex=index
        batchfinish = false;
        }
     }
     if(batchfinish){
       this.toastr.error('Batch Number entered');
       return 
     }
    
      
   }
   else{
    this.batch = '';
     item1.blnChecked = true;
   }
   this.selectedAge = item1.age        //grn change
   this.selectedBatchGrn= item1.batch_grn
  this.batchnoClick('item');
 
 }
 qunatityValidation(eneteredQnty,availqnty,index,event){

  //  console.log('qnty changed');

   this.batch = '';
   this.lstItems[index]['bnt_bchno'] = null;                       // selected batch cleared when qnty change
   this.lstItems[index]['dct_bchno'] = null;
   this.lstSelectedBatch.splice(index, 1);
   delete this.dctSelectedBatch[index]

    if(this.lstItems[index]['blnDisabled']){
      if(!this.plusCheck)
      {
        if(eneteredQnty>this.lstItemsCopy[index]['int_qty']){
          this.toastr.error('Maximum quantity is ' + this.lstItemsCopy[index]['int_qty']);
          this.lstItems[index]['int_qty'] = this.lstItemsCopy[index]['int_qty'];

          this.tableGrandTotalCalculation(this.lstItems);
          return false;
    
        }
      }

    }
    if(eneteredQnty>availqnty){
      this.toastr.error('Maximum quantity is ' + availqnty);
      this.lstItems[index]['int_qty'] = null;
      this.tableGrandTotalCalculation(this.lstItems);
      return false;

    }

    this.tableGrandTotalCalculation(this.lstItems);
 }
   
 tableGrandTotalCalculation(itemAll){
  this.intTotalTableAmount = 0;
  this.intTotalTableQnty = 0;
  itemAll.forEach(element => {
    this.intTotalTableAmount += element.flt_total;            // grand total calculation in the table footer
    this.intTotalTableQnty += element.int_qty;
  });
  this.intTotalTableAmount = Number(this.intTotalTableAmount.toFixed(2));
}

disableScroll(event: any) {
  if (event.srcElement.type === "number")
      event.preventDefault();
}

ngOnDestroy() {
   
  if(this.modelopen){
    this.modelopen.close();
    }
  }

}
