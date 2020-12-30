import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';
@Component({
  selector: 'app-imei-scan',
  templateUrl: './imei-scan.component.html',
  styleUrls: ['./imei-scan.component.css']
})
export class ImeiScanComponent implements OnInit {

  blnSaveDisable=false;
  intBranchId: null;
  datTransfer;
  lstBranch = [];
  lstBranchTo = [];
  strRemarks = '';
  selectedBranch = '';
  selectedRemarks = '';
  dctItemIdExist={}
  modelopen;
  lstItems = [];
  lstItemsList = [];
  searchBranch: FormControl = new FormControl();
  searchBranchFrom: FormControl = new FormControl();
  searchImei :FormControl = new FormControl();
  closeResult: string;
  lstImeiShow = [];
  // lst_imeiEntered = [];
  // lst_imeiEntered1 = [];
  indexOfImei;
  // blnImeiEntered = false;
  // batch = '';
  dctImeiAvail = {};
  lstImeiAvial = [];
  lstImeilist =[];
  dctImeiEntered = {};
  // lst_batch = [];
  dctBatchnoAvail = {};
  dctBatchNoEntered = {};
  dctAge={};
  dctAgeNew ={};
  selectedBranchFrom;
  intBranchFromId;
  blnItemHasImei = false;
  blnGetImei = false;
  // blnDisabled = false;
  // tempIndex=0
  // strBrand = '';
  // lstBrandList = [];
  lstBatchAvail = [];
  // selectedBrand ;
  // intBrandId ;
  intTotalQty=0;
  intTotalAmount = 0;

  strProduct = '';
  lstProductList = [];
  selectedProduct ;
  intProductId ;
  // selectedImei = '';
  // blnImeiAdd = true;
  strGroup = localStorage.getItem('group_name')
  branch_type = localStorage.getItem('BranchType')
  lstItemsCopy = [];

  lstSelectedBatch=[]
  // selectedBatchIndex
  // lstScannedImei=[]
  // dctScannedImei={}
  objectKeys;
  strImei =null;
  constructor(private serviceObject: ServerService,
    private toastr: ToastrService, public modalService: NgbModal, public router: Router,
    public cdref: ChangeDetectorRef, ) { }

  ngOnInit() {
    this.objectKeys = Object.keys;
    this.selectedBranchFrom = localStorage.getItem('BranchName');
    this.intBranchFromId = localStorage.getItem('BranchId');
    this.branch_type = localStorage.getItem('BranchType')
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
        // str_imei:null,
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
      };
      // const dctImei ={
      //   lst_entered_imei :[]
      // }
      this.lstItems.push(dctItem);
  
      
      // this.lst_imeiEntered1.push(dctImei);
      this.clearAll();
      this.datTransfer = new Date();

    localStorage.removeItem('stockRequestNo');

  
    this.searchBranch.valueChanges
      .debounceTime(400)
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
      .debounceTime(400)
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
      .debounceTime(400)
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
    this.lstItems[index]['int_qty'] = null;
    this.lstItems[index]['fk_brand_id'] = null;
    this.lstItems[index]['brand_name'] = null;
    this.lstItems[index]['qtyDisabled'] = false;
    // this.lstItems[index]['str_imei'] = null;
    this.lstItems[index]['item_name'] = null;
    this.lstItems[index]['product_name'] =  item.name;
    this.lstItems[index]['intProduct'] =  item.id;
    this.lstItemsList = [];

    // this.lst_imeiEntered1.splice(index, 1);
    // const dctImei ={
    //   lst_entered_imei :[]
    // }
    // this.lst_imeiEntered1[index]=dctImei
    // this.lstSelectedBatch.splice(index, 1);
    // delete this.dctItemIdExist[this.lstItems[index]['fk_item_id']]
  

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
      postData['term'] = data;
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
  itemSelected(item, index,event) {
    if(!item.imei_status){
      this.toastr.error('Please select an item having serial number');
      this.lstItems[index]['imei_status'] = item.imei_status;
      return;
    }
    else{
      this.lstItems[index]['imei_status'] = item.imei_status;
    }
    this.lstItems[index]['imei_scanned']=false;
    let addItemStatus = false;
    addItemStatus =true;
    if(this.lstItems.length>1){
      this.lstItems.forEach(element=>{
        // if((!this.dctItemIdExist.hasOwnProperty(element.fk_item_id)) && element.fk_item_id){
        //   this.dctItemIdExist[element.fk_item_id]=0          
        // }
        if(element.fk_item_id==item.id && element.fk_item__imei_status == true){
          addItemStatus = false;
        }
      })
    }
  if(addItemStatus){
    this.lstItems[index]['fk_item_id'] = item.id;
    this.lstItems[index]['fk_item__imei_status'] = item.imei_status;
    this.lstItemsList = [];
    this.lstItems[index]['flt_price'] = item.rate;   // original code
    // this.lstItems[index]['flt_price'] = 200;   // testing purpose
    this.lstItems[index]['product_name'] = item.product_name;
    this.lstItems[index]['intProduct'] = item.product_id;
    this.lstItems[index]['fk_product_id'] = item.product_id;
    this.selectedProduct = item.product_name;
    // this.lstItems[index]['str_imei']=null
    this.lstItems[index]['avail_qty']= item.item_qty;
    this.lstItems[index]['lst_all_imei'] = null;
    this.lstItems[index]['lst_imei'] = null;
    // this.calcQty(index)   
  }
  else{
    event.source.value=null;
    this.lstItems[index]['fk_item_id'] = null;
    this.lstItems[index]['fk_item__imei_status'] = null;
    this.lstItems[index]['flt_price'] = null;
    this.lstItems[index]['item_qty'] = null;
    this.lstItems[index]['product_name'] = null;
    this.lstItems[index]['intProduct'] = null;
    // this.lstItems[index]['str_imei']=null
    this.lstItems[index]['avail_qty']= null;
    this.lstItemsList = [];
    this.selectedProduct = null;
    this.toastr.error('Only same item with different batch can add');
    return;
  }


  this.tableGrandTotalCalculation(this.lstItems);
  }
  // calcQty(index){
  //   let enteredQty=0
  //   for(let i=0;i<this.lstItems.length;i++){
  //     if(this.dctItemIdExist.hasOwnProperty((this.lstItems[index]['fk_item_id']).toString())){
  //       if(this.lstItems[i].int_qty!=null){
  //         this.dctItemIdExist[this.lstItems[index].fk_item_id]= this.lstItems[index]['avail_qty']-this.lstItems[i].int_qty;
  //       }        
  //     }
  //     else{
  //       this.lstItems[index]['item_qty'] = this.lstItems[index]['avail_qty'];
  //       this.dctItemIdExist[this.lstItems[index].fk_item_id]=this.lstItems[index]['avail_qty'];
  //     }
      
  //    }
  // }
  addItem() {
    this.lstItemsList = [];
    // this.lst_imeiEntered = []; //newly added 
      const dctItem = {
        item_name: null,
        imei_scanned:false,
        avail_qty:null,
        imei_disabled:false,
        // str_imei:null,
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
      };
      // const dctImei ={
      //   lst_entered_imei :[]
      // }
      const length = this.lstItems.length
      if(this.lstItems[length-1].fk_item_id == null){
        this.toastr.error('Enter item name of row ' + (length) )
        return false;
      }
      else  if(this.lstItems[length-1].int_qty == null){
        this.toastr.error('Enter quantity of row ' + (length) )
        return false;
      }
      else if(this.selectedBranchFrom=='ANGAMALY'){
        this.toastr.error('Only one item can transfer from Angamaly');
        return false;
      }
      else{
        this.lstItems.push(dctItem);
      }
  
  
  }
  deleteItem(index,item) {
    this.lstItemsList = [];
    // this.lst_imeiEntered1.splice(index, 1);
    // this.lstSelectedBatch.splice(index, 1);
  
    // delete this.dctItemIdExist[this.lstItems[index]['fk_item_id']]
    delete this.dctImeiEntered[this.lstItems[index]['fk_item_id']]
  
    this.lstItems.splice(index, 1);
    
    if (this.lstItems.length === 0) {
      this.dctImeiEntered = {};
      // this.dctItemIdExist={};
      this.lstItems = [];
      const dctItem = {
        item_name: null,
        imei_scanned:false,
        imei_disabled:false,
        // str_imei:null,
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
      };
      // const dctImei ={
      //   lst_entered_imei :[]
      // }
      this.lstItems.push(dctItem);
      // this.lst_imeiEntered1.push(dctImei)
    }

    this.tableGrandTotalCalculation(this.lstItems);  // table grand total calculation
    
  }
  openimeipopup(imeipopup,index) {
    this.blnItemHasImei = this.lstItems[index]['fk_item__imei_status'];   
    // this.lst_batch = [];
    // if (this.lstItems[index]['bnt_bchno'] === null) {
    // this.batch = '';
    // } else {
    //   this.batch = this.lstItems[index]['bnt_bchno'][0];
    // }
    if (this.intBranchId == null) {
      this.toastr.error('Select Branch');
      return false;
    }
    if (this.lstItems[index].fk_item_id  == null) {
      this.toastr.error('Select Item');
      return false;
    }
    // this.blnImeiEntered = true;
    this.lstImeiShow = [];
    this.indexOfImei = index;
  
    
    this.getImei(index);
    if(this.lstItems[index]['lst_all_imei'] == null || this.lstItems[index]['lst_all_imei'].length == 0){
      this.lstItems[index]['lst_all_imei']=[];
    }else{
      this.lstImeiShow = JSON.parse(JSON.stringify(this.lstItems[index]['lst_all_imei']));;
    }
    
    this.modelopen = this.modalService.open(imeipopup, { centered: true, size: 'sm' ,backdrop : 'static',keyboard : false});
  }  
  getImei(index) {
    
    // this.blnGetImei = false;
     if (this.lstItems[index]['fk_item_id'] == null) {
      this.toastr.error('Enter item name of row ' + (index + 1) );
      return;
    }
    const dct_data = {
      fk_item_id: this.lstItems[index]['fk_item_id'],
    };
    if (this.intBranchId) {
      dct_data['fk_branch_id'] = this.intBranchId;
    }
    // this.lstBatchAvail = [];
    this.lstImeiAvial = [];

    this.serviceObject.postData('internalstock/getimei/', dct_data).subscribe(
      (response) => {
          // this.blnGetImei = true;
          this.dctImeiAvail = response['dct_imei'];  
          this.dctBatchnoAvail = response['dct_batch'];
          this.dctAge = response['dct_age'];
          for(let key in this.dctImeiAvail){
            this.dctImeiAvail[key].forEach(element => {
              this.lstImeiAvial.push(element)
            });
          }
          
          for(let key in this.dctBatchnoAvail){
            this.dctBatchnoAvail[key].forEach(element => {
              if(!this.lstSelectedBatch.includes(element)){
                this.lstBatchAvail.push(element)
              }
            });
          }

        
              
           // for(let index = 0 ; index< this.lstImeiAvial.length ; index++){
          //   this.lstImeiAvial[index] = {'imei':this.lstImeiAvial[index],'blnChecked':true}
          // }

          for(let index = 0 ; index< this.lstBatchAvail.length ; index++){
            if(this.dctAge.hasOwnProperty(this.lstBatchAvail[index])){
          this.lstBatchAvail[index] = {'strBatch':this.lstBatchAvail[index],'availQty':this.dctAge[this.lstBatchAvail[index]]['int_qty'],'intQty':0}
            }
          }         
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');
      }
      );
  
  }
  imeiSearched(){
    if(this.strImei !=null){
      this.strImei = this.strImei.trim();
      if(this.lstItems[this.indexOfImei]['lst_all_imei'] !== null && this.lstItems[this.indexOfImei]['lst_all_imei'].includes(this.strImei)){
        this.toastr.error('Imei already exists' );
        this.strImei=null;
        return;
      }
      if(this.lstImeiAvial.includes(this.strImei)){
        this.lstImeiShow.push(this.strImei);
        this.lstItems[this.indexOfImei]['lst_all_imei'].push(this.strImei);
        this.lstItems[this.indexOfImei].int_qty = this.lstImeiShow.length;
        this.lstItems[this.indexOfImei]['flt_total'] = this.lstItems[this.indexOfImei]['int_qty'] * this.lstItems[this.indexOfImei]['flt_price'];

        this.tableGrandTotalCalculation(this.lstItems);   // table footer grand total calculation

        this.setImei(true,this.strImei);
      }else{
        this.toastr.error('Imei not found' );
        this.strImei=null;
        return;
      }
    }
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
 
  setImei(blnAdd,strImeiSelected){
    if(blnAdd){
    if(!this.dctImeiEntered.hasOwnProperty(this.lstItems[this.indexOfImei]['fk_item_id'])){
      this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']]={};
    }
    for (const key in this.dctImeiAvail) {
      if (this.dctImeiAvail.hasOwnProperty(key)) {
        if (this.dctImeiAvail[key].indexOf(strImeiSelected) !== -1) {
            if (this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']].hasOwnProperty(key)) {
              if(!this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key].includes(strImeiSelected)){
              this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key].push(strImeiSelected);
              this.strImei=null;
              }else{
                this.toastr.error('Imei already exists' );
                this.strImei=null;
                return;
              }
            } else {
              this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key] = [];
              this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key].push(strImeiSelected);
              this.strImei=null;
            }
        }
      }
    }
  }
  else{
    if(this.dctImeiEntered.hasOwnProperty(this.lstItems[this.indexOfImei]['fk_item_id'])){
      for (const key in this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']]) {
        if (this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']].hasOwnProperty(key)) {
          const i = this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key].indexOf(strImeiSelected);
            if (i !== -1 &&this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key][i] === strImeiSelected) {
              this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key].splice(i, 1);
          }
        }
      }
    }
  }
  }
  removeImei(strImeiSelected){
    if(this.lstImeiShow.includes(strImeiSelected)){
      this.lstImeiShow.splice(this.lstImeiShow.indexOf(strImeiSelected),1);
      this.lstItems[this.indexOfImei]['lst_all_imei'].splice(this.lstItems[this.indexOfImei]['lst_all_imei'].indexOf(strImeiSelected),1);
      this.lstItems[this.indexOfImei].int_qty = this.lstImeiShow.length;
      this.lstItems[this.indexOfImei]['flt_total'] = this.lstItems[this.indexOfImei]['int_qty'] * this.lstItems[this.indexOfImei]['flt_price'];
      
      this.tableGrandTotalCalculation(this.lstItems);   // table footer grand total calculation

      this.setImei(false,strImeiSelected);
    }
  }
  saveImei(){
    this.lstItems[this.indexOfImei]['imei'] = this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']];
    let intImeiQty = 0;
    if(this.lstItems[this.indexOfImei]['imei'] != null){
      for (const key in this.lstItems[this.indexOfImei]['imei']) {
        if (this.lstItems[this.indexOfImei]['imei'].hasOwnProperty(key)) {
          intImeiQty +=this.lstItems[this.indexOfImei]['imei'][key].length;
        }
        }
      } 
      if(intImeiQty!=this.lstItems[this.indexOfImei]['int_qty']){
        this.toastr.error('Enter imei' );
        return;
      }else{
        // this.calcQty(this.indexOfImei);
        this.modelopen.close();
        this.indexOfImei=null;    
      }
  }
closeImei(imeishow) {
    this.lstImeiShow = [];
    this.lstImeiAvial = []; 
    // this.calcQty(this.indexOfImei);
    this.modelopen.close();
    this.indexOfImei=null;
  }
clearAll(){
 this.intBranchId = null;
 if (this.strGroup == 'ADMIN'){
   this.datTransfer = null;
 }
 this.lstBranch = [];
 this.lstBranchTo = [];
 this.strRemarks = '';
 this.lstItems = [];
 this.lstItemsList = [];
 this.selectedBranch = '';
 const dctItem = {
     item_name: null,
     imei_scanned:false,
     avail_qty:null,
     imei_disabled:false,
     fk_item_id: null,
    //  str_imei:null,
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
 };
 this.lstItems.push(dctItem);
 this.intTotalAmount = 0;
 this.intTotalQty = 0;

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
    for (let index = 0; index < this.lstItems.length; index++) {
      const element = this.lstItems[index];
      let intImeiQty = 0;
      if(element.imei != null){
      for (const key in element.imei) {
        if (element.imei.hasOwnProperty(key)) {
          intImeiQty +=element.imei[key].length;
        }
        }
      }
      // console.log(element,'save');
      
      if(!element.imei_status){
        this.toastr.error('Please select an item of row '+(index+1) +' having serial number');
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
      else if(element.fk_item__imei_status === true && (element.lst_all_imei.length != element.int_qty || element.int_qty != intImeiQty)){
        this.toastr.error("Quantity and number of imei's entered are not equal of row " + (index + 1) );
        return;
      }
       else if(element.int_qty>element.avail_qty){    // item_qnty changed to avail_enty 
        this.toastr.error('Maximum quantity of row ' + (index + 1) +' is '+ element.item_qty);
        return;
      } else if ((element.bnt_bchno === null || element.bnt_bchno === '') && element.fk_item__imei_status === false && !element.imei_scanned) {
        this.toastr.error('Enter item batch number of row ' + (index + 1) );
        return;
      }
      if(element.bnt_bchno != null){
        element.bnt_bchno = null;                  //if batch contain empty list clear to null
      }
    }
  
  const datTransfer = moment(this.datTransfer).format('YYYY-MM-DD');
  const dctData = {
    'intBranchId': this.intBranchId,
    'dat_transfer': datTransfer,
    'lst_details': this.lstItems,
    'vchr_remarks': this.strRemarks,
    'intBranchFromId': this.intBranchFromId
  };
  
  this.blnSaveDisable = true;  
  this.serviceObject
    .postData('internalstock/addstocktransfer/', dctData)
    .subscribe(
      (response) => {
           
        if (response.status === 1) {
          this.toastr.success(response['message']);
          this.clearAll();
          localStorage.setItem('previousUrl','stocktransfer/transferredlist');
          this.router.navigate(['stocktransfer/transferredlist']);
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
  checkBatchQty(item,index){
    if(item.intQty>item.availQty){
      this.toastr.error('Maximum quantity of this batch is '+item.availQty);
      this.lstBatchAvail[index].intQty=0;
      return;
    }else{
      this.dctBatchNoEntered = {};
      // if (this.batch !== null && this.batch !== '' && this.batch !== undefined) {
      // this.batch = this.batch.toString().trim();
      // for (const key in this.dctBatchnoAvail) {
    
      //   if (this.dctBatchnoAvail.hasOwnProperty(key)) {
      //     if (this.dctBatchnoAvail[key].includes(item.strBatch)) {
      //           this.dctBatchNoEntered[key] = this.batch;
      //           // this.lst_batch[0] = this.batch;
      //         // this.blnImeiEntered = true;
      //         // blnBatchNoExists = true;
      //         break;
      //     }
      //   }
      // }
    // }
    }
  }
  ngOnDestroy() {
   
    if(this.modelopen){
      this.modelopen.close();
      }
    }
    
  
}
