import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {

  orderDate;
  strBranch:null;
  strRemarks:null;

  lstItem=[];

  validationStatus;
  errorPlace;

  strSupplier:null;
  searchSupplier:FormControl= new FormControl();
  selectedSupplier;
  supplierId;

  selectedItem=[];
  itemId;
  searchItem:FormControl= new FormControl();
  lstItems=[];

  lstBranch=[];

  keyEve;
  lstSuppliers=[];
  newTime;
  setStart;

  grandTot=0;
  grandQty=0;

  constructor( 
    private serviceObject: ServerService,
    private router: Router
    ) { }

  ngOnInit() {
    let action=localStorage.getItem('action');
    console.log("action",action);
    
    // if(action=='edit'){
    //   this.getEditData();
    // }
    // else{
    this.orderDate=new Date();

    let dctItem={
      qty:0,
      itemNa:null,
      itemId:null,
      rate:0,
      totAmt:0
    };

    this.lstItem.push(dctItem);

    this.searchSupplier.valueChanges.debounceTime(100).subscribe(
      data=>{
      if (data === undefined || data === null) {
      } else {
    
        if (data.length > 1) {
          this.lstSuppliers = [];
          this.typeaheadSupplier(data);       
        } else{
          this.lstSuppliers = [];
        }
      }
    })

    // this.searchItem.valueChanges.debounceTime(100).subscribe(
    //   data=>{
    //   if (data === undefined || data === null) {
    //   } else {         
    //     if (data.length > 1) {
    //       this.lstItems = [];
    //       this.typeaheadItem(data);       
    //     } else{
    //       this.lstItems = [];
    //     }
    //   }
    // })

    this.getWarehouses();
  // }
  }

  clearFields(){
    this.strBranch=null;
    this.strSupplier=null;
    this.strRemarks=null;
    this.orderDate=new Date();
    this.lstItem=[];
    let dctItem={
      qty:0,
      itemNa:null,
      itemId:null,
      rate:0,
      totAmt:0
    };

    this.lstItem.push(dctItem);

    this.grandQty=0;
    this.grandTot=0;
  }
  
  getEditData(){
    let id={orderId:localStorage.getItem('rowId')};
    this.serviceObject.postData('purchase/list_purchase_order/',id).subscribe(
      (response) => {
          if (response.status == 1) {
          //  this.data=response['lst_purchase_order'];
          }  
          else {
            Swal.fire('Error!','error', 'error');
          }
      },
      (error) => {   
        Swal.fire('Error!','error', 'error');
        
      });
  }

  itemSearched(event,data){
    
    this.masterValidation();
    if(this.validationStatus==false){
      return;
    }
    this.newTime=event.timeStamp;
    this.keyEve=event.keyCode;  

    if (data === undefined || data === null) {
    } else {
      if (this.keyEve === 8|| this.keyEve === 38|| this.keyEve === 40|| this.keyEve === 13) {
        if (data === undefined || data === null || data === '') { 
          this.lstItems = [];  
        }
        return //return for backspace, enter key and up&down arrows.
      } 
      if (data.length > 1) {
        if((this.newTime - this.setStart)>100 || data.length==2){
        this.setStart=this.newTime;
        this.lstItems = [];
        this.typeaheadItem(data);       
        }
        else{
          return;
        }
      } else{
        this.lstItems = [];
      }
    }
  }

  removeTriggerOnBackspace(event){ // set key code and event start time
    this.newTime=event.timeStamp;
    this.keyEve=event.keyCode;   
    
    
  }

  addItem(){
    this.masterValidation();
    this.detailsValidation();
    if(this.validationStatus==false){
      return;
    }
    let dctItem={
      qty:0,
      itemNa:null,
      itemId:null,
      rate:0,
      totAmt:0

    };
    this.lstItem.push(dctItem);
  }

  typeaheadSupplier(data){

    this.serviceObject.postData('purchase/supplier_typeahead/',{term:data}).subscribe(
      (response) => {
        this.lstSuppliers.push(...response['data']);
      },
      (error) => {   
        Swal.fire('Error!','error', 'error');
        
      });
  }

  typeaheadItem(data){

    this.serviceObject.postData('purchase/item_typeahead/',{term:data}).subscribe(
      (response) => {        
        this.lstItems.push(...response['data']);
      },
      (error) => {   
        Swal.fire('Error!','error', 'error');
        
      }
      );
  }

  deleteData(indexId){

    let lstLen;
     lstLen=this.lstItem.length;
     if(!(lstLen==1)){
       this.lstItem.splice(indexId,1);
       this.calcGrandTot();

     }
     else{

      this.lstItem = [{
      qty:0,
      itemNa:null,
      itemId:null,
      rate:0,
      totAmt:0
      }]
  
    

     }
     this.selectedItem.splice(indexId,1);

    }

    saveOrder(){
       this.masterValidation();
       this.detailsValidation();

       if(this.validationStatus==true){
      let orderDat=moment(this.orderDate).format('YYYY-MM-DD');

      let dctData={};
      dctData['orderDat']=orderDat;
      dctData['intSupplier']=this.supplierId;
      dctData['branch']=this.strBranch;
      dctData['remarks']=this.strRemarks;
      dctData['grandQty']=this.grandQty;
      dctData['grandTot']=this.grandTot.toFixed(2);
      dctData['items']=this.lstItem;

      this.serviceObject.postData('purchase/save_purchase_order/', dctData).subscribe(
        (response) => {
          if(response['status']==1){
          Swal.fire({
            position: "center", 
            type: "success",
            text: "Data saved successfully",
            showConfirmButton: true,  
          }); 
          this.clearFields();
  localStorage.setItem('previousUrl','purchase/purchaseorderlist');
          
          this.router.navigate(['purchase/purchaseorderlist']);

        }
        else{
          Swal.fire('Error!',response['message']);
        }
        },
        (error) => {   
          Swal.fire('Error!','error', 'error');
          
        });
      }
    }

   

    masterValidation(){
      this.validationStatus=true;  
      // this.lstTurnover[lstLength].map_id = this.productId
  
      if(this.orderDate==null){        
       this.validationStatus = false ;
       this.errorPlace = 'Select purchase order date';
       this.showErrorMessage(this.errorPlace);
       return;
     }
     else if(this.strBranch==null){
      this.validationStatus = false ;
      this.errorPlace = 'Please select a  warehouse/head office name';
      this.showErrorMessage(this.errorPlace);
      return;
    } 
     else if(this.strSupplier==null){
       this.validationStatus = false ;
       this.errorPlace = 'Enter supplier name';
       this.showErrorMessage(this.errorPlace);
       return;
     } 
     else if(this.strSupplier!=this.selectedSupplier){
      this.validationStatus = false ;
      this.errorPlace = 'Please select a valid supplier name';
      this.showErrorMessage(this.errorPlace);
      return;
    } 
   

    }

    detailsValidation(){
      let rowNum;
      let tempItem;
      this.masterValidation();
      if(this.validationStatus==false){
        return;
      }
      let lstLength=this.lstItem.length;    
      if(lstLength==0){
      this.validationStatus = false ;
      this.errorPlace = 'Please atleast one row';
      this.showErrorMessage(this.errorPlace);
      return;
      }
      else{
        for(let index=0; index<lstLength; index++){
          rowNum=index+1;
          if(this.lstItem[index].itemNa==null || this.lstItem[index].itemNa==''){
          this.validationStatus = false ;
          this.errorPlace = 'Please fill item name of row '+rowNum;
          this.showErrorMessage(this.errorPlace);
          tempItem=null;
          return;
          }
          else if(this.lstItem[index].itemNa!=this.selectedItem[index]){
            this.validationStatus = false ;
            this.errorPlace = 'Please select a valid item name of row '+rowNum;
            this.showErrorMessage(this.errorPlace);
            return;
          }
          else{
            tempItem=this.lstItem[index].itemNa;
          }
          if(this.lstItem[index].qty==null || this.lstItem[index].qty==0){
          this.validationStatus = false ;
          this.errorPlace = 'Please fill quantity of '+tempItem;
          this.showErrorMessage(this.errorPlace);
          return;
          }
          if(this.lstItem[index].rate==null || this.lstItem[index].rate==0){
            this.validationStatus = false ;
            this.errorPlace = 'Please fill rate of '+tempItem;
            this.showErrorMessage(this.errorPlace);
            return;
            }
          // if(this.lstItem[index].price==null){
          //   this.validationStatus = false ;
          //   this.errorPlace = 'Please fill price of row '+rowNum;
          //   this.showErrorMessage(this.errorPlace);
          //   return;
          //   }
        }
      }
    }

    calcTot(index){
      this.masterValidation();

      if(this.validationStatus==false){
        this.lstItem[index].qty=0;
        this.lstItem[index].rate=0;
        return;
      }
      this.lstItem[index].totAmt=(Number(this.lstItem[index].qty)*Number(this.lstItem[index].rate)).toFixed(2);

      // console.log("this.lstItem[index].totAmt##",this.lstItem[index].totAmt);
      this.calcGrandTot();
    }

    calcGrandTot(){
      this.grandTot=0;
      this.grandQty=0;
      for (let lstIndex = 0; lstIndex < this.lstItem.length; lstIndex++) {
        // this.grandTot+=Number(this.lstItem[lstIndex].totAmt);
        
        this.grandTot=Number(this.grandTot)+Number(this.lstItem[lstIndex].totAmt);
        
        this.grandQty+=this.lstItem[lstIndex].qty;
      }
      
    }
    showErrorMessage (errorPlace) {    
      Swal.fire({
        position: "center",
        type: "warning",
        text: errorPlace,
        showConfirmButton: false,
        timer: 1900
      });
    }

    supplierChanged(supplier){
      this.selectedSupplier=this.strSupplier=supplier.name;
      this.supplierId=supplier.id
    }

    itemChanged(item,index){
      this.selectedItem[index]=item.name;
      this.lstItem[index]['itemId']=item.id;
    }

    getWarehouses(){
      this.serviceObject.getData('purchase/branch_list/').subscribe(
        (response) => {
          this.lstBranch=[];
          if(response['status']==1){
         this.lstBranch=response['lst_branch'];
        }
        else{
          // Swal.fire('Error!',response['data']);
        }
        },
        (error) => {   
          Swal.fire('Error!','error', 'error');
          
        });
    }
}
