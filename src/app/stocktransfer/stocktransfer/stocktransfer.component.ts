import { Component, OnInit,ChangeDetectorRef,HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { IfStmt } from '@angular/compiler';
import { Agent } from 'http';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-stocktransfer',
  templateUrl: './stocktransfer.component.html',
  styleUrls: ['./stocktransfer.component.css']
})
export class StocktransferComponent implements OnInit {
  blnSaveDisable=false;
  intBranchId: null;
  datTransfer;
  lstBranch = [];
  lstBranchTo = [];
  strRemarks = '';
  selectedBranch = '';
  selectedRemarks = '';
  // blnCheck=false
  stockOrderNo = '';
  dctItemIdExist={}
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
  // blnIsISRNo = false;
  batch = '';
  dctImeiAvail = {};
  lstImeiAvial = [];
  lstImeilist =[];
  dctImeiEntered = {};
  lst_batch = [];
  dctBatchnoAvail = {};
  dctBatchNoEntered = {};
  dctAge={};
  dctAgeNew ={};
  lstAgeKeys = [];
  lstAge = [];
  selectedBranchFrom;
  intBranchFromId;
  blnItemHasImei = false;
  blnGetImei = false;
  blnDisabled = false;
  tempIndex=0
  // plusCheck = true; 
  strBrand = '';
  lstBrandList = [];
  lstBatchAvail = [];
  selectedBrand ;
  intBrandId ;
  
  intTotalQty=0;
  intTotalAmount = 0;

  strProduct = '';
  lstProductList = [];
  selectedProduct ;
  intProductId ;
  selectedImei = '';
  blnImeiAdd = true;
  strGroup = localStorage.getItem('group_name')
  branch_type = localStorage.getItem('BranchType')
  lstItemsCopy = [];

  lstSelectedBatch=[]
  dctSelectedBatch={}
  selectedBatchIndex
  lstScannedImei=[]
  dctScannedImei={}
  objectKeys;

  selectedAge = '';
  selectedBatchGrn = '';
  blnBatchSaveDisable=true
  

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
    this.objectKeys = Object.keys;
    this.selectedBranchFrom = localStorage.getItem('BranchName');
    this.intBranchFromId = localStorage.getItem('BranchId');
    if (localStorage.getItem('stockRequestData')) {
      localStorage.setItem('stockRequestStatus', '1');
    }
      const dctItem = {
        item_name: null,
        imei_scanned:false,
        avail_qty:null,
        imei_disabled:false,
        qtyDisabled:false,      
        fk_item_id: null,
        str_imei:null,
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
        lst_all_imei: null,
        fk_item__imei_status : false,
        disableQty:false

      };
      const dctImei ={
        lst_entered_imei :[]
      }
      this.lstItems.push(dctItem);
  
      
      this.lst_imeiEntered1.push(dctImei);
      this.clearAll();
      this.datTransfer = new Date();
      // this.stockOrderNo = localStorage.getItem('stockRequestNo');
  
    this.branch_type = localStorage.getItem('BranchType')
    localStorage.removeItem('stockRequestNo');
   

    //  if (this.branch_type=='1') {
    //   this.plusCheck=false;
    //  }

      // if (this.stockOrderNo) {
      // console.log(this.branch_type);
      // this.blnDisabled = true;
      // if (this.branch_type=='1') {  
      //  this.plusCheck=false;
      // }
      //   this.getDocData();
      // }

    this.searchBranch.valueChanges
      .pipe(debounceTime(400))
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null || strData ==='') {
          this.lstBranchTo = [];
          this.intBranchId=null;

        } else {
          if (strData.length >= 2) {
            this.serviceObject
              .postData('internalstock/get_details/', {str_search: strData,blnStockTransfer:true})
              .subscribe(
                (response) => {
                  this.lstBranchTo = response['branch_list'];
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
   

    if (data !== null && data.length >= 2) {
      const postData = {}
      this.lstImeilist = [];
      this.lstImeiAvial = [];
      this.lstBatchAvail = []
      this.batch= '';
      this.lstItems[index]['int_qty'] = 0;
      this.lstItems[index]['dct_bchno'] = null;
      this.lstItems[index]['bnt_bchno'] = null;
      this.lstItems[index]['lst_imei'] =[];

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
    let lstAllBatchNo=[]
    let lstSelectedAllBatchNo=[]

    this.serviceObject.postData('internalstock/getimei/', dct_data).subscribe(
      (response) => {
          this.blnGetImei = true;

                        this.dctImeiAvail = response['dct_imei'];  
                        // console.log(this.dctImeiAvail, this.blnGetImei,'this.dctImeiAvail');
                        
                        this.dctBatchnoAvail = response['dct_batch'];
                        this.dctAge = response['dct_batch_age'];

                        this.lstAgeKeys = Object.keys(this.dctAge)

                        for(let key in this.dctImeiAvail){
                       
                          this.dctImeiAvail[key].forEach(element => {
                            this.lstImeiAvial.push(element)
                            
                          });
                        }
                       
                  
                        

                        // for(let key in this.dctBatchnoAvail){
                        // console.log(this.dctSelectedBatch,index,"alex");
                          
                        //   this.dctBatchnoAvail[key].forEach(element => {
                        //     // console.log(element,  this.dctBatchnoAvail,"element");
                        //     if(Object.keys(this.dctSelectedBatch).length>0)
                        //     {
                        //       Object.keys(this.dctSelectedBatch).forEach(selectedKey=>{
                                
                        //         if( this.dctSelectedBatch[selectedKey]!=element){
                        //           console.log(selectedKey,"selectedKey");
                        //             selectedStatus
                        //           }
                        //       })
                        //     }
                        //     else{
                        //       this.lstBatchAvail.push(element)
                        //     }
                        //     // if(this.dctSelectedBatch[index]!=element){
                        //     // }
                           
                           
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
                     this.lstImeiAvial[index] = {'imei':this.lstImeiAvial[index],'blnChecked':true,'age':this.dctAge[this.lstAgeKeys[index]].int_age,'qnty':this.dctAge[this.lstAgeKeys[index]].int_qty}
                   }


                  //  for(let index = 0 ; index< this.lstImeiAvial.length ; index++){
                  //   for(let ageIndex =index+1 ;ageIndex <= this.lstAgeKeys.length ; ageIndex ++){

                      
                  //     if(this.lstImeiAvial[index]==this.dctAge[this.lstAgeKeys[ageIndex-1]]['batch']){
                  //       this.lstImeiAvial[index] = {'imei':this.lstImeiAvial[index],'blnChecked':true,'age':this.dctAge[this.lstAgeKeys[ageIndex-1]].int_age,'qnty':this.dctAge[this.lstAgeKeys[ageIndex-1]].int_qty};
                  //       break;
                  //     }
                  //   }
                  // }

                  //  console.log(this.lstBatchAvail,this.dctAge,"lstBatchAvail");
                   


                   for(let index = 0 ; index< this.lstBatchAvail.length ; index++){
                    for(let ageIndex =index+1 ;ageIndex <= this.lstAgeKeys.length ; ageIndex ++){
                      // console.log(this.lstAgeKeys[ageIndex-1],ageIndex-1,this.lstAgeKeys,"grn");
                      
                      
                      if(this.lstBatchAvail[index]==this.dctAge[this.lstAgeKeys[ageIndex-1]]['batch']){
                        this.lstBatchAvail[index] = {'batch':this.lstBatchAvail[index],'blnChecked':true,'age':this.dctAge[this.lstAgeKeys[ageIndex-1]].int_age,'qnty':this.dctAge[this.lstAgeKeys[ageIndex-1]].int_qty,'batch_grn':this.lstAgeKeys[ageIndex-1]};
                        break;
                      }
                    }
                  }

                  // for(let index = 0 ; index< this.lstBatchAvail.length ; index++){
                  //   for(let ageIndex = 0;ageIndex < this.lstAgeKeys.length ; ageIndex ++){
                  //     console.log(this.dctBatchnoAvail[this.lstAgeKeys[ageIndex]],'ggg');
                      
                  //     if(this.dctBatchnoAvail[this.lstAgeKeys[ageIndex]].includes(this.lstBatchAvail[index])){
                  //       this.lstBatchAvail[index] = {'batch':this.lstBatchAvail[index],'blnChecked':true,'key':this.lstAgeKeys[ageIndex]};
                  //       break;
                  //     }
                  //   }

               
                  // }
                
                 
                   
                        
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');
      }
      );
  
  }
  itemSelected(item, index,event) {
    const postData = {}
    this.lstImeilist = [];
    this.lstImeiAvial = [];
    this.lstBatchAvail = []
    this.batch= '';
      this.lstItems[index]['int_qty'] = 0;
    this.lstItems[index]['dct_bchno'] = null;
    this.lstItems[index]['bnt_bchno'] = null;
    this.lstItems[index]['lst_imei'] =[];
    this.lstItems[index]['flt_total'] = null;
    // console.log("event",event);
    if(item.imei_status){
      this.lstItems[index]['item_name'] = null;
      this.lstItems[index]['imei_status'] = item.imei_status;
      this.toastr.error('Please select an item not having serial number');
      return;
    }
    else{
      this.lstItems[index]['imei_status'] = item.imei_status;
    }
    this.lstItems[index]['imei_scanned']=false;
  let addItemStatus = false;

  addItemStatus =true;
  // this.dctItemIdExist={}

  if(this.lstItems.length>1){
    this.lstItems.forEach(element=>{
      if(!this.objectKeys(this.dctItemIdExist).includes(element.fk_item_id) && element.fk_item_id){
        if(!this.dctItemIdExist.hasOwnProperty(element.fk_item_id)){
        this.dctItemIdExist[element.fk_item_id]=0          
        }
      }
      if(element.fk_item_id==item.id && element.fk_item__imei_status == true){
        addItemStatus = false;
      }
    })
  }
  if(addItemStatus){
    this.lstItems[index]['fk_item_id'] = item.id;
    this.lstItems[index]['fk_item__imei_status'] = item.imei_status;
    this.lstItemsList = [];
    this.lstItems[index]['flt_price'] = item.rate;  //original code
    // this.lstItems[index]['flt_price'] = 200;  // testing purpose
    // this.lstItems[index]['brand_name'] = item.brand_name;
    this.lstItems[index]['product_name'] = item.product_name;
    // this.lstItems[index]['intBrand'] = item.brand_id;
    this.lstItems[index]['intProduct'] = item.product_id;
    this.selectedProduct = item.product_name;
    this.lstItems[index]['str_imei']=null
    this.lstItems[index]['avail_qty']= item.item_qty;
    this.lstItems[index]['lst_all_imei'] = null;
    this.lstItems[index]['lst_imei'] = null;
    // this.selectedBrand = item.brand_id;
    // console.log(this.lstItems,"list");

  //  for(let i=0;i<this.lstItems.length;i++){
  
  //   if(this.lstItemIdExist.includes(item.id)  && this.lstItems[i].fk_item_id===item.id){
  //     this.lstItems[index]['item_qty'] = this.lstItems[i].item_qty-this.lstItems[i].int_qty;
  //     break
  //   }
  //   else{
  //     this.lstItems[index]['item_qty'] = item.item_qty;
  //   }
  //  }
    this.calcQty(index)
  }
  else{
    event.source.value=null;
    this.lstItems[index]['fk_item_id'] = null;
    this.lstItems[index]['fk_item__imei_status'] = null;
    this.lstItems[index]['flt_price'] = null;
    this.lstItems[index]['item_qty'] = null;
    // this.lstItems[index]['brand_name'] =null;
    this.lstItems[index]['product_name'] = null;
    // this.lstItems[index]['intBrand'] = null;
    this.lstItems[index]['intProduct'] = null;
    this.lstItems[index]['str_imei']=null
    this.lstItems[index]['avail_qty']= null;
    
    this.lstItemsList = [];
    this.selectedProduct = null;
    // this.selectedBrand = null;

    this.toastr.error('Only same item with different batch can add');
    return
  }
// }

  }

  tableGrandTotalCalculation(itemAll){
    this.intTotalAmount = 0;
    this.intTotalQty = 0;
    itemAll.forEach(element => {
      this.intTotalAmount += element.flt_total;            // grand total calculation in the table footer
      this.intTotalQty += element.int_qty;
    });

    this.intTotalAmount = Number(this.intTotalAmount.toFixed(2));
  }

  calcQty(index){
    
    let enteredQty=0
    for(let i=0;i<this.lstItems.length;i++){
      if(this.objectKeys(this.dctItemIdExist).includes((this.lstItems[index]['fk_item_id']).toString())  && this.lstItems[i].fk_item_id=== this.lstItems[index]['fk_item_id']){
        if(this.lstItems[i].int_qty!=null){
          enteredQty=enteredQty+this.lstItems[i].int_qty;
        }        
      }
      else{
        this.lstItems[index]['item_qty'] = this.lstItems[index]['avail_qty'];
        this.dctItemIdExist[this.lstItems[index].fk_item_id]=this.lstItems[index]['avail_qty'];
      }
      
      this.dctItemIdExist[this.lstItems[index].fk_item_id]= this.lstItems[index]['avail_qty']-enteredQty;
      // this.lstItems[index]['item_qty'] =this.dctItemIdExist[this.lstItems[index].fk_item_id]

     }

  }
  
  productSelected(item,index){
    this.selectedProduct = item.name;
    this.lstItems[index]['fk_product_id'] = item.id;

    this.lstItems[index]['fk_item_id'] = null;
    this.lstItems[index]['fk_item__imei_status'] = null;
    this.lstItems[index]['flt_price'] = null;
    this.lstItems[index]['item_qty'] = null;
    this.lstItems[index]['avail_qty']=null
    
    this.lstItems[index]['lst_all_imei'] = null;
    this.lstItems[index]['bnt_bchno'] = null;
    this.lstItems[index]['flt_total'] = null;
    this.lstItems[index]['flt_price'] = null;
    this.lstItems[index]['lst_imei'] = null;
    this.lstItems[index]['imei'] = null;
    this.lstItems[index]['fk_brand_id'] = null;
    this.lstItems[index]['brand_name'] = null;
    this.lstItems[index]['disableQty'] = false;
    this.lstItems[index]['int_qty'] = null;
    // }
    console.log( this.lstItems[index]['disableQty'],"disableQty2");
    
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

    // this.lstItemIdExist.splice( this.lstItems[index]['fk_item_id'])
    delete this.dctItemIdExist[this.lstItems[index]['fk_item_id']]
  

  }

// imei popup start here
openimeipopup(imeipopup, int_qty, index) { 
  console.log("qwertyuio",int_qty,this.selectedBranchFrom,Number(int_qty)>1);
  
  if(this.selectedBranchFrom=="ANGAMALY" && int_qty>1){
    this.toastr.error('Only one quantity can transfer');
  }
  else{

    this.blnBatchSaveDisable=true 
    console.log(this.lstSelectedBatch,this.dctSelectedBatch,'this.lstSelectedBatch')
    
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
imeiClick(imei,index) {

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
    if(!this.dctImeiEntered.hasOwnProperty(this.lstItems[this.indexOfImei]['fk_item_id'])){
      this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']]={};
    }
    if (index <= this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei.length) {
     
      const str_popimei = this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei[index];
      
      for (const key in this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']]) {
        if (this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']].hasOwnProperty(key)) {
          const i = this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key].indexOf(str_popimei);
          if (i !== -1) {
            let intkeyImei = 0;
             intkeyImei = Number(this.getKey(imei));
            if (this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key][i] === str_popimei && intkeyImei === Number(key)) {
              this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei[index] = imei;
              this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key][i] = imei;
              blnImeiChanged = true;
              blnImeiExists = true;
              this.blnImeiEntered = true;
            }
          }
        }
      }
    
    }
    if ((imei !== '') && (this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei.indexOf(imei) === -1) && (!blnImeiChanged)) {


      let templst =  []
     for (const key in this.dctImeiAvail) {
      if (this.dctImeiAvail.hasOwnProperty(key)) {
        if (this.dctImeiAvail[key].indexOf(imei) !== -1) {
            this.lst_imeiEntered1[this.indexOfImei]['lst_entered_imei'].push(imei)
            if (this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']].hasOwnProperty(key)) {
              this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key].push(imei);
            } else {
              this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key] = [];
              this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key].push(imei);
            }
            this.blnImeiEntered = true;
            blnImeiExists = true;
        }
      }
    }
    }
    if (!blnImeiExists && imei !== '') {
      this.toastr.error('Imei not available for this branch');
      this.blnImeiEntered = false;
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
    // this.dctImeiEntered = {};
    this.lstImeilist = [];
    this.lstImeiAvial = [];
    this.lstBatchAvail = []
  
}
saveImei() {
 
  // if (this.lstItems[this.indexOfImei]['int_qty'] > this.lstItems[this.indexOfImei]['item_qty']){
  //   this.toastr.error('Maximum quantity of row ' + (this.indexOfImei + 1) +' is '+ this.lstItems[this.indexOfImei]['item_qty']);
  //   return;
  // }
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
    this.lstItems[this.indexOfImei]['imei'] = this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']];
  
    if( this.lstItems[this.indexOfImei].fk_item__imei_status){
      this.lstItems[this.indexOfImei]['lst_imei'] = this.lst_imei;
      this.lstItems[this.indexOfImei]['dct_bchno'] = null;
      this.lstItems[this.indexOfImei]['bnt_bchno'] = null;
    }
    else{
      this.lstItems[this.indexOfImei]['lst_imei'] =[];
      this.lstItems[this.indexOfImei]['dct_bchno'] = this.dctBatchNoEntered;
      this.lstItems[this.indexOfImei]['bnt_bchno'] = this.lst_batch;
    }

    // this.lstItems[this.indexOfImei]['lst_imei'] = this.lst_imei;
    // this.lstItems[this.indexOfImei]['dct_bchno'] = this.dctBatchNoEntered;
    // this.lstItems[this.indexOfImei]['bnt_bchno'] = this.lst_batch;

    
    

    this.lstSelectedBatch[this.indexOfImei]= this.lst_batch[0]
    this.dctSelectedBatch[this.indexOfImei]= this.lst_batch[0]
    // console.log(this.lstSelectedBatch,this.dctSelectedBatch,this.indexOfImei,"hfghh");
    
    this.lstBatchAvail.splice(this.selectedBatchIndex,1)
    // if(this.lstItems.length-1!=this.indexOfImei){
    //   this.lstItems[this.indexOfImei]['qtyDisabled'] =true
    // }
    this.modelopen.close();
    this.batch = '';
    // this.lst_imeiEntered = [];    //comment due to save validation
    // this.dctImeiEntered = {};
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
 let curQtyTot=0
  for (let index = 0; index < this.lstItems.length; index++) {
    const element = this.lstItems[index];
    element['imei']=null;
    curQtyTot=curQtyTot+element.int_qty
    element['flt_total'] = element['int_qty'] * element['flt_price'];
  
    
    if(element.imei_status){
      this.toastr.error('Please select an item of row '+ (index+1) + ' not having serial number'); //check selected item is imei or batch 
      return;
    }
    else if (element.item_name == null || element.fk_item_id == null) {
      this.toastr.error('Enter item name of row ' + (index + 1) );
      return;
    } else if (element.int_qty == null || element.int_qty == 0) {
      this.toastr.error('Enter item quantity of row ' + (index + 1) );
      return;
    } else if (element.flt_price == null) {
      this.toastr.error('Enter item rate of row ' + (index + 1) );
      return;
    } else if ((element.fk_item__imei_status === true || element.imei_scanned === true) && (element.imei === null || element.imei === '')) {
   
      this.toastr.error('Enter item imei of row ' + (index + 1) );
      return;
    }
    else if(element.fk_item__imei_status === true && element.lst_all_imei.length != element.int_qty){
      this.toastr.error("Quantity and number of imei's entered are not equal of row " + (index + 1) );
      return;
    }
     else if(element.int_qty>element.item_qty){
      this.toastr.error('Maximum quantity of row ' + (index + 1) +' is '+ element.item_qty);
      return;
    } else if ((element.bnt_bchno === null || element.bnt_bchno === '') && element.fk_item__imei_status === false && !element.imei_scanned) {
      this.toastr.error('Enter item batch number of row ' + (index + 1) );
      return;
    }
    // else if(curQtyTot>this.intTotalQty && this.blnDisabled){
    //   this.toastr.error("Transfered quantity is greater than requested quantity");
    //   return;
    // }
  }

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
// console.log(dctData,"save");

this.serviceObject
  .postData('internalstock/addstocktransfer/', dctData)
  .subscribe(
    (response) => {
      if (response.status === 1) {
        if(!response['bln_batch']){
          this.toastr.success(response['message']);
          this.clearAll();
          localStorage.setItem('previousUrl','stocktransfer/transferredlist');
          this.router.navigate(['stocktransfer/transferredlist']);
        }
        else{
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
      } else {
        if(response.hasOwnProperty('message')){
          this.blnSaveDisable = false;  
          this.toastr.error(response['message']);
        }else{
        this.blnSaveDisable = false;  
        this.toastr.error('Error');
        }
      }
    },
      (error) => {
        this.blnSaveDisable = false;  
        this.toastr.error('Error');
      }
  );
}

// getTotal(i) {
//   this.lstItems[i]['flt_total'] = this.lstItems[i]['int_qty'] * this.lstItems[i]['flt_price'];
// }

addItem() {
  this.lstItemsList = [];
  this.lst_imeiEntered = []; //newly added 
    const dctItem = {
      item_name: null,
      imei_scanned:false,
      avail_qty:null,
      imei_disabled:false,
      str_imei:null,
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
      lst_all_imei: null,
      fk_item__imei_status : false,
      blnDisabled : false,
      disableQty:false
    };
    const dctImei ={
      lst_entered_imei :[]
    }
    const length = this.lstItems.length
    if(this.lstItems[length-1].fk_item_id == null){
      // this.toastr.error('Select Current Item')
      this.toastr.error('Enter item name of row ' + (length) )
      return false;
    }
    else  if(this.lstItems[length-1].int_qty == null){
      // this.toastr.error('Select Current Item')
      this.toastr.error('Enter quantity of row ' + (length) )
      return false;
    }
    else if(this.selectedBranchFrom=='ANGAMALY'){
      this.toastr.error('Only one item can transfer from Angamaly');
      return false;
    }
    else{
    
      this.lstItems.push(dctItem);
      this.lst_imeiEntered1.push(dctImei)
      let index=0
      this.lstItems.forEach(element => {
        if(this.lstItems.length-1!=index){
          // element['qtyDisabled'] =true
          element['imei_disabled'] =true
        }
        else{
          // element['qtyDisabled'] =false
          element['imei_disabled'] =false
          
          
        }
        index=index+1
      });
    }


}

deleteItem(index,item) {
  console.log(index,this.lstSelectedBatch);
  
  this.lstItemsList = [];
  this.lst_imeiEntered1.splice(index, 1);
  this.lstSelectedBatch.splice(index, 1);
  delete this.dctSelectedBatch[index]

  // let cnt=0
  // this.lstItems.forEach(element => {
  //   if(element.fk_item_id==this.lstItems[index]['fk_item_id']){
  //     cnt=cnt+1
  //   }
  // });
  // console.log(cnt,this.dctItemIdExist,"cnt");
  // if(cnt==1){
    delete this.dctItemIdExist[this.lstItems[index]['fk_item_id']]
    delete this.dctImeiEntered[this.lstItems[index]['fk_item_id']]
  // }
  // else{
  //   this.dctItemIdExist[this.lstItems[index]['fk_item_id']]= this.dctItemIdExist[this.lstItems[index]['fk_item_id']]-1
  // }

  this.lstItems.splice(index, 1);
  let intIndex=0
  this.lstItems.forEach(element => {
    if(this.lstItems.length-1!=intIndex){
      // element['qtyDisabled'] =true
      element['imei_disabled'] =true
      
    }
    else{
      // element['qtyDisabled'] =false
      element['imei_disabled'] =false
      
      
    }
    intIndex=intIndex+1
  });
  
  if (this.lstItems.length === 0) {
    this.dctImeiEntered = {};
    this.dctItemIdExist={};
    this.lstItems = [];
    const dctItem = {
      item_name: null,
      imei_scanned:false,
      imei_disabled:false,
      str_imei:null,
      avail_qty:null,
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
      lst_all_imei: null,
      fk_item__imei_status : false,
      disableQty:false

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
  // this.blnIsISRNo = false;
  this.stockOrderNo = '';
  this.intBranchId = null;
  if (this.strGroup == 'ADMIN'){
    this.datTransfer = null;
  }
  this.lstBranch = [];
  this.lstBranchTo = [];
  this.strRemarks = '';
  this.lstItems = [];
  this.lstItemsList = [];
  this.lst_imeiEntered1 = [] //newly added
  this.selectedBranch = '';
  const dctItem = {
      item_name: null,
      imei_scanned:false,
      avail_qty:null,
      imei_disabled:false,
      fk_item_id: null,
      str_imei:null,
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
      lst_all_imei: null,
      fk_item__imei_status : false,
      disableQty:false

  };
  const dctImei ={
    lst_entered_imei :[]
  }
  this.lstItems.push(dctItem);
  this.lst_imeiEntered1.push(dctImei);

  this.intTotalAmount = 0;
  this.intTotalQty = 0;
}


imeiAdd(item1)
{
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
  this.imeiClick(item1.imei,indexForImei);

}

batchAdd(item1,index){
  // console.log(item1,index,"hkjrethekjthk");
  
  let indexForBatch;
   let batchfinish = true;
   if(item1.blnChecked == true){
     if(item1.qnty <  this.lstItems[this.indexOfImei]['int_qty']){            //changed item 
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
   this.selectedAge = item1.age           //grn cahnge
   this.selectedBatchGrn= item1.batch_grn
  this.batchnoClick('item');
 
 }
 qunatityValidation(eneteredQnty,availqnty,index,event){
  this.lstItems[index]['imei_disabled']=true;
  //  console.log(eneteredQnty,availqnty,"qty11111");

  // //  if(this.objectKeys(this.dctItemIdExist).length==0){
  //    console.log("if");
     
     
  //   if(eneteredQnty>availqnty){
  //     this.toastr.error('Maximum quantity is ' + availqnty);
  //     this.lstItems[index]['int_qty'] = null;
  //     event=null
  //     // this.calcQty(index)
  //     // return false;

  //   }
  //    if(eneteredQnty<=availqnty){
  //     this.calcQty(index)
  //    }

  //  }
  this.batch = '';
 this.lstItems[index]['bnt_bchno'] = null;                       // selected batch cleared when qnty change
 this.lstItems[index]['dct_bchno'] = {};
 this.lstSelectedBatch.splice(index, 1);
 delete this.dctSelectedBatch[index]


  if(this.objectKeys(this.dctItemIdExist).length>0){
     if(this.lstItems[index].int_qty>this.lstItems[index].avail_qty){
       this.lstItems[index]['int_qty'] = null;
       event=null
       this.calcQty(index)      
       this.toastr.error('Maximum quantity is ' + this.dctItemIdExist[this.lstItems[index].fk_item_id]);
       return false;
 
     }
     if(this.lstItems[index].int_qty<=this.lstItems[index].avail_qty){
      this.calcQty(index)
      this.tableGrandTotalCalculation(this.lstItems);
     }
   }
 }

 imeiSearched(index,event){

   let lstId=[]
  //  let id
   this.indexOfImei = index;
   
  // this.blnItemHasImei = this.lstItems[index]['fk_item__imei_status'];   
  this.lst_batch = [];

  // if (this.lstItems[index]['bnt_bchno'] === null) {
  // this.batch = '';
  // }
  // else {
  //   this.batch = this.lstItems[index]['bnt_bchno'][0];
  // }

  this.blnImeiEntered = true;
  this.lst_imei = [];
  this.indexOfImei = index;


  if (this.intBranchId == null) {
    this.toastr.error('Select Branch');
    return false;
  }
  else if(this.lstItems[index]['str_imei']){

     this.serviceObject
     .postData('purchase/imei_scan/', {strImei:this.lstItems[index]['str_imei']})
     .subscribe(
       (response) => {
  
        if(response.status==1)
        {
          this.lstItems[index]['fk_item__imei_status'] = response['data']['imei_status']
          this.lstItems[index]['fk_item_id'] = response['data']['fk_item_id']

          // console.log(this.lstItems[index]['fk_item__imei_status'],this.objectKeys(this.dctItemIdExist),this.dctItemIdExist,response['data']['fk_item_id'],"this.lstItems[index]['fk_item__imei_status'],this.lstItems.includes(response['data']['fk_item_id'].toString())");
          
          // console.log(this.lst_imeiEntered,this.lst_imeiEntered1,"imei");
          let checkExist=false
          if(!this.lstItems[index]['fk_item__imei_status'] && this.objectKeys(this.dctItemIdExist).includes((response['data']['fk_item_id']).toString())){
            for(let i=0;i<this.lstItems.length;i++)
            {
              if(this.lstItems[i]['fk_item_id']==response['data']['fk_item_id'])
              {
                
                if(this.lstItems[i]['bnt_bchno'].includes(((this.lstItems[index]['str_imei']).toString()))){
                  // if(this.dctItemIdExist[response['data']['fk_item_id']]>0)
                  // {
                    this.lstItems[i]['int_qty']=this.lstItems[i]['int_qty']+1
                    this.lstItems[index]['str_imei']=null
                    this.calcQty(i)
                    checkExist=true
                  // }
                  // else{
                  //   this.toastr.error('Out of stock');
                  //   this.lstItems[index]['str_imei']=null
                    
                  // }
                }               

              }

            }
            
            if(checkExist){

              this.lstItems[index]['fk_item_id'] = response['data']['fk_item_id']
              // id= response['data']['fk_item_id'].toString()
              // lstId=this.objectKeys(this.dctScannedImei)
              // console.log(lstId,response['data']['fk_item_id'],lstId.includes(id),"objectKeys");
              
              // if(!lstId.includes(id))
              // {
      
                this.lstItems[index]['imei_scanned']=true
          
    
    
                this.blnItemHasImei = this.lstItems[index]['fk_item__imei_status'];   
                
                this.lstItems[index]['flt_price'] = response['data']['dbl_mop']
                this.lstItems[index]['product_name'] = response['data']['fk_product__vchr_name']
                this.lstItems[index]['intProduct'] = response['data']['fk_product_id']
                this.lstItems[index]['item_name']=response['data']['vchr_item_name']
                this.selectedProduct = response['data']['fk_product__vchr_name']
                this.lstItems[index]['int_qty']=1
                this.lstItems[index].item_qty=response['data']['int_Qty']
                this.lstItems[index]['avail_qty']=response['data']['int_Qty']
                
                this.calcQty(index)
        
                // let dctData={}
                // dctData['value']=this.lstItems[index]['str_imei']
                // dctData['qty']=1
                // dctData['availQty']=response['data']['int_Qty']
                // this.dctScannedImei[response['data']['fk_item_id']]=dctData
                let item
                if(this.lstItems[index]['fk_item__imei_status'])
                {
                item={imei:this.lstItems[index]['str_imei'],blnChecked:true}
                }
                else{
                 item={batch:this.lstItems[index]['str_imei'],blnChecked:true}
                }
                // console.log(this.lstItems,this.dctItemIdExist,"list");
                
                this.checkFunction(index,item,this.lstItems[index]['fk_item__imei_status'],false)
                this.addItem()
    
            }
          }
          else if(this.lstItems[index]['fk_item__imei_status'] && this.objectKeys(this.dctItemIdExist).includes((response['data']['fk_item_id']).toString())){
            for(let i=0;i<this.lstItems.length;i++)
            {
              if(this.lstItems[i]['fk_item_id']==response['data']['fk_item_id'])
              {
                
                if(this.lst_imeiEntered1[i].lst_entered_imei.includes(this.lstItems[index]['str_imei'])){
                  this.toastr.error('Already selected');
                  this.lstItems[index]['str_imei']=null
                  break
                  
                }
                else{
                  // if(this.dctItemIdExist[response['data']['fk_item_id']]>0)
                  // {
                    this.lstItems[i]['imei_scanned']=true;
                    if(this.lstItems[i]['int_qty']>0 && (this.lstItems[i]['lst_all_imei']==null || this.lstItems[i]['imei']==null || this.lstItems[i]['lst_all_imei'].length!=this.lstItems[i]['int_qty'])){
                      this.calcQty(i)
                      let item={imei:this.lstItems[index]['str_imei'],blnChecked:true}
                      this.lstItems[index]['imei_scanned']=true
                      this.blnItemHasImei = this.lstItems[index]['fk_item__imei_status'];  
                      
                      this.checkFunction(i,item,this.lstItems[index]['fk_item__imei_status'],true)
                      // this.addItem()
                      this.lstItems[index]['str_imei']=null
                      break
                    }else{
                      this.lstItems[i]['int_qty']=this.lstItems[i]['int_qty']+1
                      this.calcQty(i)
                      let item={imei:this.lstItems[index]['str_imei'],blnChecked:true}

                    this.lstItems[index]['imei_scanned']=true
                    this.blnItemHasImei = this.lstItems[index]['fk_item__imei_status'];  
                    
                    this.checkFunction(i,item,this.lstItems[index]['fk_item__imei_status'],true)
                    // this.addItem()
                    this.lstItems[index]['str_imei']=null
                    break
                    }
                  // }
                  // else{
                  //   this.toastr.error('Out of stock');
                  // }
                }
              }
            }
          }
          else{


            this.lstItems[index]['fk_item_id'] = response['data']['fk_item_id']
            // id= response['data']['fk_item_id'].toString()
            // lstId=this.objectKeys(this.dctScannedImei)
            // console.log(lstId,response['data']['fk_item_id'],lstId.includes(id),"objectKeys");
            
            // if(!lstId.includes(id))
            // {
    
              this.lstItems[index]['imei_scanned']=true
        
  
  
              this.blnItemHasImei = this.lstItems[index]['fk_item__imei_status'];   
              
              this.lstItems[index]['flt_price'] = response['data']['dbl_mop']
              this.lstItems[index]['product_name'] = response['data']['fk_product__vchr_name']
              this.lstItems[index]['intProduct'] = response['data']['fk_product_id']
              this.lstItems[index]['item_name']=response['data']['vchr_item_name']
              this.selectedProduct = response['data']['fk_product__vchr_name']
              this.lstItems[index]['int_qty']=1
              this.lstItems[index].item_qty=response['data']['int_Qty']
              this.lstItems[index]['avail_qty']=response['data']['int_Qty']
              
              this.calcQty(index)
      
              // let dctData={}
              // dctData['value']=this.lstItems[index]['str_imei']
              // dctData['qty']=1
              // dctData['availQty']=response['data']['int_Qty']
              // this.dctScannedImei[response['data']['fk_item_id']]=dctData
              let item
              if(this.lstItems[index]['fk_item__imei_status'])
              {
              item={imei:this.lstItems[index]['str_imei'],blnChecked:true}
              }
              else{
               item={batch:this.lstItems[index]['str_imei'],blnChecked:true}
              }
              // console.log(this.lstItems,this.dctItemIdExist,"list");
              
              this.checkFunction(index,item,this.lstItems[index]['fk_item__imei_status'],false)
              this.addItem()
  
          }

          // }
          // else if(lstId.includes(id)){
          //   // console.log(this.dctScannedImei[response['data']['fk_item_id']]['availQty'],this.dctScannedImei[response['data']['fk_item_id']]['qty'],"qty");
            
          //   if(this.dctScannedImei[response['data']['fk_item_id']]['availQty']>this.dctScannedImei[response['data']['fk_item_id']]['qty']){
          //   this.dctScannedImei[response['data']['fk_item_id']]['qty']=this.dctScannedImei[response['data']['fk_item_id']]['qty']+1
          //   // this.lstItems[index].int_qty= this.dctScannedImei[response['data']['fk_item_id']]['qty']
          //   this.lstItems.forEach((element,indexOfList )=> {
          //     // console.log(indexOfList,index,"indexOfList,index");
              
          //     if(element.str_imei==this.lstItems[index]['str_imei']){
          //       this.lstItems[indexOfList].int_qty= this.dctScannedImei[response['data']['fk_item_id']]['qty']
          //     }
          //   });
          //   this.lstItems[index]['str_imei']=null
          //   this.lstItems[index]['int_qty']=null
            
          //   }
          //   else if(this.dctScannedImei[response['data']['fk_item_id']]['availQty']=this.dctScannedImei[response['data']['fk_item_id']]['qty']){
          //     this.toastr.error('Out of stock ');
          //     this.lstItems[index]['str_imei']=null
          //   }
          //   else{
          //     this.toastr.error('Out of stock ');
          //     this.lstItems[index]['str_imei']=null

          //   }
          // }
          // console.log( this.dctScannedImei," this.dctScannedImei");
          
          
        }
        else{
        this.toastr.error(response['data']);
        this.lstItems[index]['str_imei']=null
        }
       },
       (error) => {
        Swal.fire('Error!', 'error', 'error');
      }
     );
   }

   
 }
 checkFunction(index,item,blnImei,alreadyExist){
   
  this.blnGetImei = false;
  if(!alreadyExist){
    if (this.lstItems[index]['fk_item_id'] == null) {
     this.toastr.error('Enter item name of row ' + (index + 1) );
     return;
    } 
    else if (this.lstItems[index]['int_qty'] === null || this.lstItems[index]['int_qty'] === undefined) {
      this.toastr.error('Enter item quantity of row ' + (index + 1) );
      return;
    }
  }
  else{
    this.indexOfImei=index
    for (let i = 0; i < Number(this.lstItems[index].int_qty); i++) {
      const dct_imei = {slno: (i + 1), imei: ''};
      this.lst_imei.push(dct_imei);
    }
  }

 const dct_data = {
   fk_item_id: this.lstItems[index]['fk_item_id'],
 };
 if (this.intBranchId) {
   dct_data['fk_branch_id'] = this.intBranchId;
 }

 this.lstBatchAvail = [];
 this.lstImeiAvial = [];

 this.serviceObject.postData('internalstock/getimei/', dct_data).subscribe(
   (response) => {
       this.blnGetImei = true;

                     this.dctImeiAvail = response['dct_imei'];  
                     
                     this.dctBatchnoAvail = response['dct_batch'];
                     this.dctAge = response['dct_age'];

                     for(let key in this.dctImeiAvail){
                    
                       this.dctImeiAvail[key].forEach(element => {
                         this.lstImeiAvial.push(element)
                         
                       });
                     }
                     for(let key in this.dctBatchnoAvail){
                    
                      //  this.dctBatchnoAvail[key].forEach(element => {
                      //    if(!this.lstSelectedBatch.includes(element)){
                      //      this.lstBatchAvail.push(element)
                      //    }
                         
                      //  });
                      this.dctBatchnoAvail[key].forEach(element => {
                        console.log(element,  this.dctBatchnoAvail,"element");
                        if(Object.keys(this.dctSelectedBatch).length>0){
                          Object.keys(this.dctSelectedBatch).forEach(selectedKey=>{
                            console.log(selectedKey,"selectedKey");
                            
                            if( this.dctSelectedBatch[selectedKey]!=element){
                                this.lstBatchAvail.push(element)
                              }
                          })
                        }
                        else{
                          this.lstBatchAvail.push(element)
                        }
                        // if(this.dctSelectedBatch[index]!=element){
                        // }
                       

                        
                      });
                     }

                     // if(this.lstBatchAvail.length==0 && !this.lstItems[index]['fk_item__imei_status']){
                     //     this.lstItems[index]['item_qty'] = 0;
                     //     this.lstItems[index]['int_qty'] = 0;
                         

                     //   }
                       
                for(let index = 0 ; index< this.lstImeiAvial.length ; index++){
                  this.lstImeiAvial[index] = {'imei':this.lstImeiAvial[index],'blnChecked':true}
                }

                for(let index = 0 ; index< this.lstBatchAvail.length ; index++){
                 this.lstBatchAvail[index] = {'batch':this.lstBatchAvail[index],'blnChecked':true}
                }
                 
                if (this.lstItems[this.indexOfImei]['lst_all_imei'] !== null && this.lstItems[this.indexOfImei]['lst_all_imei'] !== undefined
                && this.lstItems[this.indexOfImei]['lst_all_imei'].length === this.lstItems[this.indexOfImei]['int_qty']) {
  
                  this.lst_imei = this.lstItems[this.indexOfImei]['lst_imei'];
                  this.batch = this.lstItems[this.indexOfImei]['bnt_bchno'];
                } 
  
                else if(this.lstItems[this.indexOfImei]['lst_all_imei'] !== null && this.lstItems[this.indexOfImei]['lst_all_imei'] !== undefined
                && this.lstItems[this.indexOfImei]['lst_all_imei'].length != this.lstItems[this.indexOfImei]['int_qty']){
                  this.lst_imei = this.lstItems[this.indexOfImei]['lst_imei'];
                  
                  if(this.lstItems[this.indexOfImei]['lst_all_imei'].length < this.lstItems[index]['int_qty']){
                      for (let i = 0; i < Number(this.lstItems[index]['int_qty']); i++) {
                        
                    
                        if(this.lstItems[this.indexOfImei]['lst_all_imei'].length <= i)            // qnty  icreased
                        {          
                          
                          const dct_imei = {slno: (i + 1), imei: ''};
                          this.lst_imei.push(dct_imei);
                        }
                        
                      }
                    }
                    else if(this.lstItems[this.indexOfImei]['lst_all_imei'].length > this.lstItems[index]['int_qty']){
                      let value=this.lstItems[this.indexOfImei]['lst_all_imei'].length
                      const length = this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei.length;
                    
                      while (value!=this.lstItems[index]['int_qty'] ){
                        
                          this.lst_imei.splice(value-1 ,1)   //qnty decreased
                          this.lst_imeiEntered1[this.indexOfImei].lst_entered_imei.splice(value-1, 1); 
                          this.lstItems[this.indexOfImei]['lst_all_imei'].splice(value-1, 1)
                          value=value-1          // last entered imei deleted 
                        }
                
                    }   
                }
                else {
                  
                  for (let i = 0; i < Number(this.lstItems[index]['int_qty']); i++) {
                    const dct_imei = {slno: (i + 1), imei: ''};
                    this.lst_imei.push(dct_imei);
                  }
                }

          if(blnImei){
            
            this.imeiAdd(item)
          }
          else{
            this.batchAdd(item,index)
          }
          
          // this.saveImei()
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
            this.lstItems[this.indexOfImei]['imei'] = this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']];
            this.lstItems[this.indexOfImei]['flt_total'] = this.lstItems[this.indexOfImei]['int_qty'] * this.lstItems[this.indexOfImei]['flt_price'];
            this.lstItems[this.indexOfImei]['lst_imei'] = this.lst_imei;
            this.lstItems[this.indexOfImei]['dct_bchno'] = this.dctBatchNoEntered;
            this.lstItems[this.indexOfImei]['bnt_bchno'] = this.lst_batch;
        
            this.lstSelectedBatch[this.indexOfImei]= this.lst_batch[0]
            this.dctSelectedBatch[this.indexOfImei]= this.lst_batch[0]
            this.lstBatchAvail.splice(this.selectedBatchIndex,1)
            // if(this.lstItems.length-1!=this.indexOfImei){
            //   this.lstItems[this.indexOfImei]['qtyDisabled'] =true
            // }
            // this.modelopen.close();
            this.batch = '';
            // this.lst_imeiEntered = [];    //comment due to save validation
            // this.dctImeiEntered = {};
          }
          this.lstImeiAvial = [];
          
              
                
                     
   },
   (error) => {
     Swal.fire('Error!', 'error', 'error');
   }
   );
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
