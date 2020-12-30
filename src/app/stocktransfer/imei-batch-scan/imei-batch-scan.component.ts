import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-imei-batch-scan',
  templateUrl: './imei-batch-scan.component.html',
  styleUrls: ['./imei-batch-scan.component.css']
})
export class ImeiBatchScanComponent implements OnInit {

  blnSaveDisable=false;
  intBranchId: null;
  datTransfer;
  lstBranch = [];
  lstBranchTo = [];
  strRemarks = '';
  selectedBranch = '';
  strBranch='';
  selectedRemarks = '';
  dctItemIdExist={}
  modelopen;
  lstItems = [];
  lstItemsList = [];
  searchBranch: FormControl = new FormControl();
  searchBranchFrom: FormControl = new FormControl();
  closeResult: string;
  lstImeiShow = [];
  indexOfImei;
  dctImeiAvail = {};
  // lstImeiAvial = [];
  lstImeilist =[];
  dctImeiEntered = {};
  dctBatchnoAvail = {};
  dctBatchNoEntered = {};
  dctAge={};
  dctAgeNew ={};
  selectedBranchFrom;
  intBranchFromId;
  blnItemHasImei = false;
  blnGetImei = false;
  lstBatchAvail = [];
  intTotalQty=0;
  intTotalAmount = 0;

  strProduct = '';
  lstProductList = [];
  selectedProduct ;
  intProductId ;
  strGroup = localStorage.getItem('group_name')
  branch_type = localStorage.getItem('BranchType')
  lstItemsCopy = [];

  lstSelectedBatch=[]
  objectKeys;
  strImei =null;
  strImeiSelected =null;
  intIndexOfNewRow=null;
  constructor(private serviceObject: ServerService,
    private toastr: ToastrService, public modalService: NgbModal, public router: Router,
    public cdref: ChangeDetectorRef, ) { }

  ngOnInit() {
    this.objectKeys = Object.keys;
    
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
    this.selectedBranchFrom = localStorage.getItem('BranchName');
    this.intBranchFromId = localStorage.getItem('BranchId');
    this.branch_type = localStorage.getItem('BranchType')
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
    

  }
  BranchChanged (item) {
    this.intBranchId = item.pk_bint_id;
    this.strBranch = item.vchr_name;
  }
  
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
        this.intIndexOfNewRow=this.lstItems.length-1;
      }
  
  
  }
  deleteItem(index) {
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
      this.toastr.error('Enter Valid Imei');
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
    // this.lstImeiAvial = [];

    this.serviceObject.postData('internalstock/getimei/', dct_data).subscribe(
      (response) => {
          // this.blnGetImei = true;
          this.dctImeiAvail = response['dct_imei'];
          this.dctBatchnoAvail = response['dct_batch'];
          this.dctAge = response['dct_age'];
          // for(let key in this.dctImeiAvail){
          //   this.dctImeiAvail[key].forEach(element => {
          //     this.lstImeiAvial.push(element)
          //   });
          // }
          
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
    // if(this.strImei !=null){
    //   this.strImei = this.strImei.trim();
    //   if(this.lstItems[this.indexOfImei]['lst_all_imei'] !== null && this.lstItems[this.indexOfImei]['lst_all_imei'].includes(this.strImei)){
    //     this.toastr.error('Imei already exists' );
    //     this.strImei=null;
    //     return;
    //   }
    //   if(this.lstImeiAvial.includes(this.strImei)){
    //     this.lstImeiShow.push(this.strImei);
    //     this.lstItems[this.indexOfImei]['lst_all_imei'].push(this.strImei);
    //     this.lstItems[this.indexOfImei].int_qty = this.lstImeiShow.length;
    //     this.lstItems[this.indexOfImei]['flt_total'] = this.lstItems[this.indexOfImei]['int_qty'] * this.lstItems[this.indexOfImei]['flt_price'];

    //     this.tableGrandTotalCalculation(this.lstItems);   // table footer grand total calculation

    //     this.setImei(true,this.strImei);
    //   }else{
    //     this.toastr.error('Imei not found' );
    //     this.strImei=null;
    //     return;
    //   }
    // }

  if (this.intBranchId == null) {
    this.toastr.error('Select Branch');
    return false;
  }
  else if(this.strImei){
      this.strImei = this.strImei.trim();
      let words = this.strImei.split(' ');
    for (let index = 0; index < words.length; index++) {
      let strCurrentImei = words[index];
      strCurrentImei =strCurrentImei.trim();
      if(strCurrentImei != ''){
        this.blnSaveDisable =  true;
     this.serviceObject
     .postData('internalstock/imei_batch_scan/', {strImei:strCurrentImei,fk_branch_id:this.intBranchId})
     .subscribe(
       (response) => {
  
        if(response.status==1)
        {
          this.blnSaveDisable = false;
          let dctResData = response['data'];
          this.dctImeiAvail = response['dct_imei'];
          this.dctBatchnoAvail = response['dct_batch'];
          this.dctAge = response['dct_age'];
          
          for(let key in this.dctBatchnoAvail){
            this.dctBatchnoAvail[key].forEach(element => {
              if(!this.lstSelectedBatch.includes(element)){
                this.lstBatchAvail.push(element)
              }
            });
          }

          for(let index_btch = 0 ; index_btch< this.lstBatchAvail.length ; index_btch++){
            if(this.dctAge.hasOwnProperty(this.lstBatchAvail[index_btch])){
          this.lstBatchAvail[index_btch] = {'strBatch':this.lstBatchAvail[index_btch],'availQty':this.dctAge[this.lstBatchAvail[index_btch]]['int_qty'],'intQty':0}
            }
          }     
          if(this.lstItems.length==1 &&  this.lstItems[0]['fk_item_id']==null){
          this.indexOfImei = 0;
          
            this.lstItems[0]['fk_item_id'] = dctResData.fk_item_id;          
            this.lstItems[0]['imei_status'] = dctResData.imei_status;
            this.lstItems[0]['fk_item__imei_status'] = dctResData.imei_status;
            this.lstItems[0]['flt_price'] = dctResData.dbl_mop;   
            this.lstItems[0]['product_name'] = dctResData.fk_product__vchr_name;
            this.lstItems[0]['intProduct'] = dctResData.fk_product_id;
            this.lstItems[0]['fk_product_id'] = dctResData.fk_product_id;
            this.lstItems[0]['item_name'] = dctResData.vchr_item_name;
            this.lstItems[0]['avail_qty']= dctResData.int_Qty;
            this.lstItems[0]['int_qty']= 1;
            this.lstItems[0]['lst_all_imei'] = [];
            this.lstItems[0]['lst_imei'] = null;
            this.lstItems[0]['lst_all_imei'].push(strCurrentImei);
            this.lstItems[0]['flt_total'] = this.lstItems[0]['int_qty'] * this.lstItems[0]['flt_price'];  
          
          }else{
            let blnItemExists=false;
          for (let i = 0; i < this.lstItems.length; i++) {
            const element = this.lstItems[i];
            if(element['fk_item_id']==dctResData['fk_item_id']){
              this.indexOfImei = i;
              if(this.lstItems[this.indexOfImei]['lst_all_imei'].includes(strCurrentImei)){
                this.toastr.error('Imei already exists');
                return false;
              }else{
              element['int_qty'] += 1;
              element['lst_all_imei'].push(strCurrentImei);
              element['flt_total'] = element['int_qty'] * element['flt_price'];
              blnItemExists=true;
              break;
              }
              }
          }
          if(!blnItemExists){
            this.addItem();
            this.indexOfImei = this.intIndexOfNewRow;
            this.lstItems[this.intIndexOfNewRow]['imei_status'] = dctResData.imei_status;
            this.lstItems[this.intIndexOfNewRow]['fk_item_id'] = dctResData.fk_item_id;
            this.lstItems[this.intIndexOfNewRow]['fk_item__imei_status'] = dctResData.imei_status;
            this.lstItems[this.intIndexOfNewRow]['flt_price'] = dctResData.dbl_mop;   
            this.lstItems[this.intIndexOfNewRow]['product_name'] = dctResData.fk_product__vchr_name;
            this.lstItems[this.intIndexOfNewRow]['intProduct'] = dctResData.fk_product_id;
            this.lstItems[this.intIndexOfNewRow]['fk_product_id'] = dctResData.fk_product_id;
            this.lstItems[this.intIndexOfNewRow]['item_name'] = dctResData.vchr_item_name;
            this.lstItems[this.intIndexOfNewRow]['avail_qty']= dctResData.int_Qty;
            this.lstItems[this.intIndexOfNewRow]['int_qty']= 1;
            this.lstItems[this.intIndexOfNewRow]['lst_all_imei'] = [];
            this.lstItems[this.intIndexOfNewRow]['lst_imei'] = null;
            this.lstItems[this.intIndexOfNewRow]['lst_all_imei'].push(strCurrentImei);
            this.lstItems[this.intIndexOfNewRow]['flt_total'] = this.lstItems[this.intIndexOfNewRow]['int_qty'] * this.lstItems[this.intIndexOfNewRow]['flt_price'];
            
          }
         
        }
        
        
        this.setImei(true,strCurrentImei);
        // this.strImei=null;
        
        this.tableGrandTotalCalculation(this.lstItems);
        this.indexOfImei = null
      }
        else{
          this.blnSaveDisable = false;
        this.toastr.error(response['data']);
        // this.strImei=null
        }
       },
       (error) => {
        this.blnSaveDisable = false;
        Swal.fire('Error!', 'error', 'error');
      }
     );
    }
    }
    this.strImei =null;
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
              // this.strImei=null;
              }else{
                this.toastr.error('Imei already exists' );
                this.strImei=null;
                return;
              }
            } else {
              this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key] = [];
              this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key].push(strImeiSelected);
              // this.strImei=null;
            }
        }
      }
    }
    this.lstItems[this.indexOfImei]['imei'] = this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']];
  }
  else{
    if(this.dctImeiEntered.hasOwnProperty(this.lstItems[this.indexOfImei]['fk_item_id'])){
      for (const key in this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']]) {
        if (this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']].hasOwnProperty(key)) {
          const i = this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key].indexOf(strImeiSelected);
            if (i !== -1 &&this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key][i] === strImeiSelected) {
              this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key].splice(i, 1);
              if(this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key].length==0){
                delete this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']][key];
              }
          }
        }
      }
    }
    this.lstItems[this.indexOfImei]['imei'] = this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']];
  }
  if(this.lstItems[this.indexOfImei]['lst_all_imei'].length ==0){
    this.deleteItem(this.indexOfImei)
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
  // saveImei(){
  //   this.lstItems[this.indexOfImei]['imei'] = this.dctImeiEntered[this.lstItems[this.indexOfImei]['fk_item_id']];
  //   let intImeiQty = 0;
  //   if(this.lstItems[this.indexOfImei]['imei'] != null){
  //     for (const key in this.lstItems[this.indexOfImei]['imei']) {
  //       if (this.lstItems[this.indexOfImei]['imei'].hasOwnProperty(key)) {
  //         intImeiQty +=this.lstItems[this.indexOfImei]['imei'][key].length;
  //       }
  //       }
  //     } 
  //     if(intImeiQty!=this.lstItems[this.indexOfImei]['int_qty']){
  //       this.toastr.error('Enter imei' );
  //       return;
  //     }else{
  //       // this.calcQty(this.indexOfImei);
  //       this.modelopen.close();
  //       this.indexOfImei=null;    
  //     }
  // }
closeImei(imeishow) {
    this.lstImeiShow = [];
    // this.lstImeiAvial = []; 
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
 this.dctImeiEntered = {};
  }
  saveData () {
    if (this.intBranchId == null || this.strBranch!=this.selectedBranch) {
      this.toastr.error('Select To Branch');
      return;
    } else if (this.datTransfer == null) {
      this.toastr.error('Select transfer date');
      return;
    } else if (this.strRemarks == '') {
      this.toastr.error('Enter remarks');
      return;
    }
    else if (this.lstItems.length == 1 &&  this.lstItems[0]['fk_item_id']==null) {
      this.toastr.error('Enter Imei atleast for one item!');
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
      
      // if(!element.imei_status){
      //   this.toastr.error('Please select an item of row '+(index+1) +' having serial number');
      //   return;
      // }
      
      // else if (element.item_name == null || element.fk_item_id == null) {
      //   this.toastr.error('Enter item name of row ' + (index + 1) );
      //   return;
      // } else if (element.int_qty == null || element.int_qty == 0) {
      //   this.toastr.error('Enter item quantity of row ' + (index + 1) );
      //   return;
      // } else if (element.flt_price == null) {
      //   this.toastr.error('Enter item rate of row ' + (index + 1) );
      //   return;
      // }
        if ((element.fk_item__imei_status === true ) && (element.imei === null || element.imei === '' || element.imei == undefined || element.imei=={})) {
        this.toastr.error('Enter item imei of row ' + (index + 1) );
        return;
      }
       if(element.fk_item__imei_status === true && (element.lst_all_imei.length != element.int_qty || element.int_qty != intImeiQty)){
        this.toastr.error("Quantity and number of imei's entered are not equal of row " + (index + 1) );
        return;
      }
       else if(element.int_qty>element.avail_qty){    // item_qnty changed to avail_enty 
        this.toastr.error('Maximum quantity of row ' + (index + 1) +' is '+ element.avail_qty);
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
