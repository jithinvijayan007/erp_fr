
import {debounceTime} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addgoodsreturn',
  templateUrl: './addgoodsreturn.component.html',
  styleUrls: ['./addgoodsreturn.component.css']
})
export class AddgoodsreturnComponent implements OnInit {

  keyEve;
  newTime;
  setStart;

  strMedium='1';

  strMediumNo;
  lstCourierName=[];
  intCourierName;
  lstVehicleNo=[];
  strVehicleNo;
  strCourierPhNo;
  intCouPackets;

  strBusNo;
  strBusName;
  strBusPhNo;
  intBusPackets;

  strTransName;
  strTransPhNo;
  intTransPackets;
  strTransVehicleNo;

  slStatus=false;
  batchStatus=false;

  showModal;
  lstImei=[];
  lstImeiData=[];
  lstTabImei=[];
  strImei;
  itemIndex=0;

  imeiStatus=false;

  showModalBatch;
  lstBatch=[];
  lstBatchData=[];
  lstTabBatch=[];
  strBatch;
  itemIndexBatch=0;
  intTot=[];

  intTotalQty=0;
  intTotalAmount=0;

  intTotalQtyBatch=0;
  intTotalAmountBatch=0;

  lstBranch=[];
  selectedBranch ='';
  intBranchId;
  strBranch= '' ;
  searchBranch: FormControl = new FormControl();
  fromBranch = localStorage.getItem('BranchName');

  transferDate=null;
  strRemarks='';

  lstProducts = [];
  lstItems = [];

  lstItem=[
    {
    product_name:null,
    product_id:null,
    item_name:null,
    item_id:null,
    int_qty:0,
    rate:0,
    total:0,
    lstItemImei:[],
    bln_imei:true
    }
  ];

  lstItemBatch=[
    {
    product_name:null,
    product_id:null,
    item_name:null,
    item_id:null,
    int_qty:0,
    rate:0,
    total:0,
    lstItemTabBatch:[],
    bln_imei:false
    }
  ];

  blnTransfer=false;

  saveDisable=false;


  constructor( 
    private serviceObject:ServerService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router
    ) { }

  ngOnInit() {
    this.searchBranch.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null || strData ==='') {
        this.lstBranch = [];
        this.intBranchId=null;

      } else {
        if (strData.length >= 2) {
          this.serviceObject
            .postData('internalstock/get_details/', {str_search: strData,blnStockTransfer:true})
            .subscribe(
              (response) => {
                this.lstBranch = response['branch_list'];
              }
            );

        }
      }
    }
    );
    this.transferDate=new Date();

  }


  BranchChanged(item){
    this.intBranchId = item.pk_bint_id;
    this.strBranch = item.vchr_name;
    this.selectedBranch= item.vchr_name;
  }


  productSearched(event,data,index,type){  
    
    if(type=='imei'){
      this.lstItem[index]['item_id']=null;
      this.lstItem[index]['item_name']=null;
      this.lstItem[index]['int_qty']=0;
      this.lstItem[index]['rate']=0;
      this.lstItem[index]['total']=0;
      this.lstItem[index]['lstItemImei']=[];
    }
    else{
      this.lstItemBatch[index]['item_id']=null;
      this.lstItemBatch[index]['item_name']=null;
      this.lstItemBatch[index]['int_qty']=0;
      this.lstItemBatch[index]['rate']=0;
      this.lstItemBatch[index]['total']=0;
      this.lstItemBatch[index]['lstItemTabBatch']=[];
    }

    this.newTime=event.timeStamp;
    this.keyEve=event.keyCode;  
    
    if (data === undefined || data === null) {
    } else {
      if (this.keyEve === 8|| this.keyEve === 38|| this.keyEve === 40|| this.keyEve === 13) {
        if (data === undefined || data === null || data === '') { 
          this.lstProducts = [];  
        }
        return //return when use backspace, enter key and up&down arrows.
      } 
      if (data.length > 1) {
        if((this.newTime - this.setStart)>100 || data.length==2){
        this.setStart=this.newTime;
        this.lstProducts = [];

        this.serviceObject.postData('products/product_typeahead/',{term: data}).subscribe(
          (response) => {        
            this.lstProducts.push(...response['data']);
          },
          (error) => {   
            Swal.fire('Error!',error, 'error');
            
          }
          );   
        }
        else{
          return;
        }
      } else{
        this.lstProducts = [];
      }
    }  
  }
  productChanged(product,i){
    // console.log("product",product);
    
    this.lstItem[i]['product_id']=product.id;
    this.lstItem[i]['product_name']=product.name;

  }

  productChangedBatch(product,i){
    // console.log("product",product);
    
    this.lstItemBatch[i]['product_id']=product.id;
    this.lstItemBatch[i]['product_name']=product.name;

  }

  itemSearched(data, i) {
    this.lstItems = [];
    if (data === null || data === '') {
      this.lstItem[i]['product_name']=null; //clear row 
      this.lstItem[i]['product_id']=null;
      this.lstItem[i]['item_id']=null;
      this.lstItem[i]['int_qty']=0;
      this.lstItem[i]['rate']=0;
      this.lstItem[i]['total']=0;
      this.lstItem[i]['lstItemImei']=[];

      this.calcTotal();
      this.lstItems = []; 

      }

      const postData = {};

      if(this.lstItem[i]['product_name']){
        postData['term'] = data;
        postData['intProduct'] = this.lstItem[i]['product_id'];
      }
      else{
        postData['term'] = data;
      }

      if (data !== null && data.length >= 2) {
      
      this.serviceObject.postData('purchase/item_typeahead/', postData).subscribe(
        (response) => {
          this.lstItems = response['data'];
        },
        (error) => {
          Swal.fire('Error!', 'error', 'error');
        }
        );
      }
  }

  // itemSearched(event,data,i){
  //   this.lstItems = [];
  //   this.newTime=event.timeStamp;
  //   this.keyEve=event.keyCode;  

      
  //   if (data === undefined || data === null || data === '') {

  //     this.lstItem[i]['product_name']=null; //clear row 
  //     this.lstItem[i]['product_id']=null;
  //     this.lstItem[i]['item_id']=null;
  //     this.lstItem[i]['int_qty']=0;
  //     this.lstItem[i]['rate']=0;
  //     this.lstItem[i]['total']=0;
  //     this.lstItem[i]['lstItemImei']=[];

  //     this.calcTotal();
  //     this.lstItems = []; 
  //   } else {
      
  //     if (this.keyEve === 8|| this.keyEve === 38|| this.keyEve === 40|| this.keyEve === 13) {
        
  //       if (data === undefined || data === null || data === '') {           
  //         this.lstItems = [];  

  //       }
  //       return //return when use backspace, enter key and up&down arrows.
  //     } 
  //     if (data.length > 1) {
       
  //       // if((this.newTime - this.setStart)>100 && data.length>=2){
  //       //   this.setStart=this.newTime;
  //       // }
  //       if((this.newTime - this.setStart)>100 || data.length>=2){
  //       // console.log("@@@@if((this.newTime - this.setStart)>100 || data.length>=2)");

  //       this.setStart=this.newTime;
  //       this.lstItems = [];

  //       let postData={};
          
  //       if(this.lstItem[i]['product_name']){
  //         postData['term'] = data;
  //         postData['intProduct'] = this.lstItem[i]['product_id'];
  //       }
  //       else{
  //         postData['term'] = data;
  //       }
  //       this.lstItems = [];

  //       // this.typeaheadItem(data);    
  //       this.serviceObject.postData('purchase/item_typeahead/',postData).subscribe(
  //         (response) => {   
  //           // if(this.lstItems.includes(response['data'])) {
  //             this.lstItems.push(...response['data']);

  //           // }
  //         },
  //         (error) => {   
  //           Swal.fire('Error!',error, 'error');
            
  //         }
  //         );   
  //       }
  //       else{
  //         return;
  //       }
  //     } else{
  //       this.lstItems = [];
  //     }
  //   }

  // }

  itemSearchedBatch(data, i) {

    this.lstItems = [];
    if (data === null || data === '') {
     
      this.lstItemBatch[i]['product_name']=null; //clear row 
      this.lstItemBatch[i]['product_id']=null;
      this.lstItemBatch[i]['item_id']=null;
      this.lstItemBatch[i]['int_qty']=0;
      this.lstItemBatch[i]['rate']=0;
      this.lstItemBatch[i]['total']=0;
      this.lstItemBatch[i]['lstItemTabBatch']=[];

      this.calcTotalBatch();
      this.lstItems = []; 

      }

     let postData={};
              
    if(this.lstItemBatch[i]['product_name']){
      postData['term'] = data;
      postData['intProduct'] = this.lstItemBatch[i]['product_id'];
    }
    else{
      postData['term'] = data;
    }

      if (data !== null && data.length >= 2) {
      
      this.serviceObject.postData('purchase/item_typeahead/', postData).subscribe(
        (response) => {
          this.lstItems = response['data'];
        },
        (error) => {
          Swal.fire('Error!', 'error', 'error');
        }
        );
      }
  }

  // itemSearchedBatch(event,data,i){
  //   // console.log("itemSearched");
    
  //       this.newTime=event.timeStamp;
  //       this.keyEve=event.keyCode;  
        
  //       if (data === undefined || data === null || data === '') {
    
  //         this.lstItemBatch[i]['product_name']=null; //clear row 
  //         this.lstItemBatch[i]['product_id']=null;
  //         this.lstItemBatch[i]['item_id']=null;
  //         this.lstItemBatch[i]['int_qty']=0;
  //         this.lstItemBatch[i]['rate']=0;
  //         this.lstItemBatch[i]['total']=0;
  //         this.lstItemBatch[i]['lstItemTabBatch']=[];
    
  //         this.calcTotalBatch();
  //         this.lstItems = []; 
  //       } else {
  //         if (this.keyEve === 8|| this.keyEve === 38|| this.keyEve === 40|| this.keyEve === 13) {
            
  //           if (data === undefined || data === null || data === '') {           
  //             this.lstItems = [];  
    
  //           }
  //           return //return when use backspace, enter key and up&down arrows.
  //         } 
  //         if (data.length > 1) {
  //           if((this.newTime - this.setStart)>100 || data.length>=2){
  //           this.setStart=this.newTime;
  //           this.lstItems = [];
    
  //           let postData={};
              
  //           if(this.lstItemBatch[i]['product_name']){
  //             postData['term'] = data;
  //             postData['intProduct'] = this.lstItemBatch[i]['product_id'];
  //           }
  //           else{
  //             postData['term'] = data;
  //           }
    
  //           // this.typeaheadItem(data);    
  //           this.serviceObject.postData('purchase/item_typeahead/',postData).subscribe(
  //             (response) => {        
  //               this.lstItems.push(...response['data']);
  //             },
  //             (error) => {   
  //               Swal.fire('Error!',error, 'error');
                
  //             }
  //             );   
  //           }
  //           else{
  //             return;
  //           }
  //         } else{
  //           this.lstItems = [];
  //         }
  //       }
    
  //     }

  itemChanged(item,i,event){     

    this.imeiStatus = item.imei_status;
    this.lstItem[i]['item_id']=item.id;
    this.lstItem[i]['item_name']=item.name;
    this.lstItem[i]['rate']=item.rate;
    this.lstItem[i]['product_id']=item.product_id;
    this.lstItem[i]['product_name']=item.product_name;

    if(!this.imeiStatus){
      this.toastr.error("Error","Please select an item having IMEI number");
      this.lstItem.splice(i,1);
      if(this.lstItem.length==0){
        this.lstItem=[
          {
          product_name:null,
          product_id:null,
          item_name:null,
          item_id:null,
          int_qty:0,
          rate:0,
          total:0,
          lstItemImei:[],
          bln_imei:true
          }
      ];
      }
      return;
    }

    this.lstItems=[];
   
  }

  itemChangedBatch(item,i,event){  

    // console.log("###item",item);
    
    this.imeiStatus = item.imei_status;
    this.lstItemBatch[i]['item_id']=item.id;
    this.lstItemBatch[i]['item_name']=item.name;
    this.lstItemBatch[i]['rate']=item.rate;
    this.lstItemBatch[i]['product_id']=item.product_id;
    this.lstItemBatch[i]['product_name']=item.product_name;

    if(this.imeiStatus){
      this.toastr.error("Error","Please select an item having Batch number");

      this.lstItemBatch.splice(i,1);
      if(this.lstItemBatch.length==0){
        this.lstItemBatch=[
          {
          product_name:null,
          product_id:null,
          item_name:null,
          item_id:null,
          int_qty:0,
          rate:0,
          total:0,
          lstItemTabBatch:[],
          bln_imei:false
          }
      ];
      }

      return;
    }

    this.lstItems=[];

  }

  openImei(imeipopup,index) {
    // _____________
    // if(this.lstTabImei.length>0){ //to avoid auto updation of arrays
    //   this.lstTabImei=this.lstItem[index]['lstItemImei'];
    // }
    
    // this.showModal = this.modalService.open(imeipopup, { centered: true, size: 'sm' ,backdrop : 'static',keyboard : false});
    // return;
    // __________________
    let count=0;

    this.lstItem.forEach(element=>{ // checking duplication of item
      if(element.item_id==this.lstItem[index].item_id){
        count++;
      
      }
    });

    if(count>1){
      this.toastr.error("Error","Item already entered");
      this.lstItem.splice(index,1);
      return;
    }

    let itemStatus=false;
    this.lstImei=[];
    this.itemIndex=index;

    itemStatus=this.checkItem();//validation for item row


    if(itemStatus){

      this.serviceObject.postData('goods_return/imei_list/ ', {'intItem':this.lstItem[index]['item_id']}).subscribe(
        (response) => {
          
          if(response['status']==1){
           if(response['data'][0]['lst_imei_data'].length>0 && this.lstItem[index]['bln_imei']){
             
            this.showModal = this.modalService.open(imeipopup, { centered: true, size: 'sm' ,backdrop : 'static',keyboard : false});
            this.lstImei=response['data'][0]['lst_imei'];
            this.lstImeiData=response['data'][0]['lst_imei_data'];
            if(this.lstItem[index]['lstItemImei'].length>0||this.lstTabImei.length>0){ //to avoid auto updation of arrays
            this.lstTabImei=this.lstItem[index]['lstItemImei'];
            }
           }
           else{
            this.toastr.error("Error","IMEI not available for this item");
           }
  
          }
          else{
            this.toastr.error(response['message']);            
          }
        },
        (error) => {   
          Swal.fire('Error!',error, 'error');  
        });

    }

    
  }


  openBatch(batchpopup,index) {

    this.itemIndexBatch=index;
    // console.log("@@@@@@@this.intTot[index]",this.intTot[index]);
    // console.log(this.itemIndexBatch,"##########itemIndexBatch",index);
    
    
    if(this.intTot[index]==undefined){
      this.intTot[index]=0;
    }

    let count=0;

    this.lstItemBatch.forEach(element=>{ // checking duplication of item
      if(element.item_id==this.lstItemBatch[index].item_id){
        count++;
      }
    });

    if(count>1){
      this.toastr.error("Error","Item already entered");
      this.lstItemBatch.splice(index,1);
      return;
    }
   
    let itemStatus=false;
    this.lstBatch=[];

    itemStatus=this.checkItemBatch();//validation for item row

    this.lstTabBatch=[];

    if(itemStatus){

      this.serviceObject.postData('goods_return/batch_list/ ', {'intItem':this.lstItemBatch[index]['item_id']}).subscribe(
        (response) => {
          
          if(response['status']==1){
            // console.log("############this.lstItemBatch[index]['lstItemTabBatch']",this.lstItemBatch[index]['lstItemTabBatch']);
            // console.log("@@@this.lstTabBatch",this.lstTabBatch);
            
           if(response['data']['lst_batch_data'].length>0 && !this.lstItemBatch[index]['bln_imei']){
             
            this.showModalBatch = this.modalService.open(batchpopup, { centered: true, size: 'lg' ,backdrop : 'static',keyboard : false});
            this.lstBatch=response['data']['lst_batch'];

            if(this.lstItemBatch[index]['lstItemTabBatch'].length>0){ //to avoid auto updation of arrays
              this.lstTabBatch=this.lstItemBatch[index]['lstItemTabBatch'];
            }
            else{
              this.lstTabBatch=response['data']['lst_batch_data'];
            }

           }
           else{
            this.toastr.error("Error","Batch not available for this item");
           }
  
          }
          else{
            this.toastr.error(response['message']);            
          }
        },
        (error) => {   
          Swal.fire('Error!',error, 'error');  
        });

    }

    
  }

  closeImei() {
    this.lstTabImei=[];
    this.strImei=null;
    this.showModal.close();  
    this.lstItem[this.itemIndex]['int_qty']=this.lstItem[this.itemIndex]['lstItemImei'].length;
    this.lstItem[this.itemIndex]['total'] = this.lstItem[this.itemIndex]['int_qty'] * this.lstItem[this.itemIndex]['rate']
    this.calcTotal();
  }

  closeBatch() {
    this.lstTabBatch=[];
    this.strBatch=null;
    this.showModalBatch.close();  
    // this.lstItemBatch[this.itemIndexBatch]['int_qty']=this.lstItemBatch[this.itemIndexBatch]['lstItemTabBatch'].length;
    this.lstItemBatch[this.itemIndexBatch]['total'] = this.lstItemBatch[this.itemIndexBatch]['int_qty'] * this.lstItemBatch[this.itemIndexBatch]['rate']
    this.calcTotalBatch();

    // console.log("@closeBatch ",this.itemIndexBatch);
    
  }

  calcTotal(){
    this.intTotalQty=0;
    this.intTotalAmount=0;

    this.lstItem.forEach(element=>{
      this.intTotalQty+=element.int_qty;
      this.intTotalAmount+=element.total;
    })
  }

  calcTotalBatch(){
    this.intTotalQtyBatch=0;
    this.intTotalAmountBatch=0;

    this.lstItemBatch.forEach(element=>{
      this.intTotalQtyBatch+=element.int_qty;
      this.intTotalAmountBatch+=element.total;
    })
  }

  calcTotQty(){
    this.intTot[this.itemIndexBatch]=0;
    this.lstTabBatch.forEach(element=>{
      this.intTot[this.itemIndexBatch]+=element.transfer_qty;
    });

    this.lstItemBatch[this.itemIndexBatch]['int_qty']=this.intTot[this.itemIndexBatch];
    this.lstItemBatch[this.itemIndexBatch]['total'] = this.lstItemBatch[this.itemIndexBatch]['int_qty'] * this.lstItemBatch[this.itemIndexBatch]['rate']

  }

   // Only AlphaNumeric
   keyPressAlphaNumeric(event) {

    // console.log("######3",event);
    
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  imeiEntered(){
    // console.log(this.lstImei,"this.lstImei");
    // console.log("this.strImei",this.strImei);
    // console.log("####this.lstTabImei.length",this.lstTabImei.length);
    // console.log("this.fromBranch",this.fromBranch.toLowerCase());
    
    let returnStatus=false;
    
  //  console.log("this.strImei",this.strImei);

   if(this.strImei==null){
    this.toastr.error("Error","Invalid IMEI");
    returnStatus=true;
    return;
   }
   else{
    this.strImei = this.strImei.toString().trim();
   }


    if(this.strImei==""){        
      this.toastr.error("Error","Invalid IMEI");
      returnStatus=true;
      return;
    }
    // else if(this.strImei.toString().length!=15){        
    //   this.toastr.error("Error","Please enter 15 characters IMEI number");
    //   returnStatus=true;
    //   return;
    // }

    else if(!this.lstImei.includes(this.strImei.toString())){//Check available imei numbers from backend
      this.toastr.error("Error","This IMEI No. not available");
      returnStatus=true;
      return;
    }
    else if(this.lstTabImei.length==1 && this.fromBranch=='ANGAMALY'){ //already one item entered
      this.toastr.error("Error","Only one quantity can transfer from Angamaly");
      returnStatus=true;
      return;
    }
    else{
      this.lstTabImei.forEach(element=>{
        if(element.imei==this.strImei){//If entered IMEI exist in table view
          this.toastr.error("Error","Already entered");
          this.strImei=null;
          returnStatus=true;
          return;
        }
      })
    }

    if(returnStatus){
      return false;
    }
  

    
    this.lstImeiData.forEach(element=>{//Push to table view
      element.imei.forEach(element1 => {
        if(element1==this.strImei.toString()){
          let tempDct={
            imei:element1,
            imei_age:element.imei_age,
            grn_id:element.id
          }
          this.lstTabImei.push(tempDct);
        }
      });
    })
    // this.lstTabImei.push(this.strImei); //Push to table view
    this.strImei=null;

  }

  saveImei(){
    
    if(this.strImei!=null){ //If IMEI not pushed to table view
     let returnStatus = this.imeiEntered(); // IMEI validation
     if(!returnStatus){
       return;
     }
    }
    if(this.lstTabImei.length>0){ //to avoid auto updation of arrays
      this.lstTabImei.forEach(element=>{
        if(!this.lstItem[this.itemIndex]['lstItemImei'].includes(element)){ // Avoid duplication when push to main table list or lstItem
          this.lstItem[this.itemIndex]['lstItemImei'].push(element);
        }
      });
      this.showModal.close();
    }
    else{
      this.toastr.error("Error","Please enter IMEI numbers");
      return;
    }
    this.lstTabImei=[];
    this.lstItem[this.itemIndex]['int_qty']=this.lstItem[this.itemIndex]['lstItemImei'].length;
    this.lstItem[this.itemIndex]['total'] = this.lstItem[this.itemIndex]['int_qty'] * this.lstItem[this.itemIndex]['rate']

    this.calcTotal();

  }

  checkQty(){
    let returnStatus=true;

    this.lstTabBatch.forEach(element=>{
      
      if(element.qty<element.transfer_qty){        
        this.toastr.error("Error","Please enter valid qty for batch "+element.batch);
        returnStatus=false;
      }
    });

    if(this.intTot[this.itemIndexBatch]==0){
      this.toastr.error("Error","Qty not entered");
      returnStatus=false;
    }
    else if(this.intTot[this.itemIndexBatch]>1 && this.fromBranch=='ANGAMALY'){
      this.toastr.error("Error","Only one quantity can transfer from Angamaly");
      returnStatus=false;
    }


    if(returnStatus==false){
      return false;
    }
    else{
      return true;
    }
  }

  saveBatch(){

    let qtyStatus=true;
    qtyStatus=this.checkQty();
    
    if(qtyStatus==false){ // return when validation status become false
      return;
    }
   else{
     if(this.lstTabBatch.length>0){ //to avoid auto updation of arrays
      this.lstItemBatch[this.itemIndexBatch]['lstItemTabBatch']=[];
       this.lstTabBatch.forEach(element=>{
         if(!this.lstItemBatch[this.itemIndexBatch]['lstItemTabBatch'].includes(element)){ // Avoid duplication when push to main table list or lstItem
           this.lstItemBatch[this.itemIndexBatch]['lstItemTabBatch'].push(element);
           this.lstItemBatch[this.itemIndexBatch]['lstItemTabBatch']['grn_id']=element.id;
         }
       });
       this.showModalBatch.close();
     }
     
     this.lstTabBatch=[];
   
     
     this.calcTotalBatch();

    //  console.log("@saveBatch ",this.itemIndexBatch);
    //  console.log("@@@@@@this.lstItemBatch",this.lstItemBatch);
     

   }

  }
  removeImei(i){
    this.lstTabImei.splice(i,1);
    // console.log("this.lstItem@removeImei",this.lstItem);
    
    this.lstItem[this.itemIndex]['int_qty']=this.lstItem[this.itemIndex]['lstItemImei'].length;
    this.lstItem[this.itemIndex]['total'] = this.lstItem[this.itemIndex]['int_qty'] * this.lstItem[this.itemIndex]['rate']

    this.calcTotal();

  }

  checkItem(){ //IMEI
    // this.itemIndex=this.lstItem.length-1; // to get last row index

    if(this.lstItem[this.itemIndex]['product_name']&&(this.lstItem[this.itemIndex]['product_name']!=null && this.lstItem[this.itemIndex]['product_id']==null)){
      this.toastr.error("Please enter valid product name");
      return false;
    }
    else if(this.lstItem[this.itemIndex]['item_name']!=null && this.lstItem[this.itemIndex]['item_id']==null){
      this.toastr.error("Error","Please enter valid item name");
      return false;
    }
    else if(this.lstItem[this.itemIndex]['item_id']==null){
      this.toastr.error("Error","Please enter valid item name");
      return false;
    }
    else if(this.fromBranch.toUpperCase()=='ANGAMALY' && this.lstItem[this.itemIndex]['lstItemImei'].length>0){
      this.toastr.error("Error","Only one item can transfer from Angamaly branch");
      return false;
    }
    else{
      return true;
    }

  }

  checkItemBatch(){ //Batch
    
    // this.itemIndexBatch=this.lstItemBatch.length-1; // to get last row index

    if(this.lstItemBatch[this.itemIndexBatch]['product_name']&&(this.lstItemBatch[this.itemIndexBatch]['product_name']!=null && this.lstItemBatch[this.itemIndexBatch]['product_id']==null)){
      this.toastr.error("Error","Please enter valid product name");
      return false;
    }
    else if(this.lstItemBatch[this.itemIndexBatch]['item_name']!=null && this.lstItemBatch[this.itemIndexBatch]['item_id']==null){
      this.toastr.error("Error","Please enter valid item name");
      return false;
    }
    else if(this.lstItemBatch[this.itemIndexBatch]['item_id']==null){
      this.toastr.error("Error","Please enter valid item name");
      return false;
    }
    else if(this.fromBranch=='Angamaly'){
      this.toastr.error("Error","Only one item can transfer from Angamaly branch");
      return false;
    }
    else{
      return true;
    }

  }


  deleteItem(index){
    this.lstItem.splice(index,1);
    if(this.lstItem.length==0){//if only one row exist
      this.lstItem=[
        {
        product_name:null,
        product_id:null,
        item_name:null,
        item_id:null,
        int_qty:0,
        rate:0,
        total:0,
        lstItemImei:[],
        bln_imei:true
        }
    ];
    }
    this.calcTotal();
  }

  deleteItemBatch(index){
    this.lstItemBatch.splice(index,1);
    if(this.lstItemBatch.length==0){//if only one row exist
      this.lstItemBatch=[
        {
        product_name:null,
        product_id:null,
        item_name:null,
        item_id:null,
        int_qty:0,
        rate:0,
        total:0,
        lstItemTabBatch:[],
        bln_imei:false
        }
    ];
    }
    this.calcTotalBatch();
  }

  masterValidation(){

   
    if(this.strRemarks==null || this.strRemarks==''){
      this.toastr.error("Error","Please fill Remarks");
      return false;
    }
    else{
      return true;
    }

    
  }

  addItem(){

    let masterStatus=this.masterValidation();
    if(!masterStatus){
      return;
    }
    this.itemIndex=this.lstItem.length-1; // to get last row index

    let returnStatus=this.checkItem();//checking last row in item table


    if(returnStatus){
      if(this.lstItem[this.itemIndex]['lstItemImei'].length==0){
        returnStatus=false;
        this.toastr.error("Error","Please fill IMEI details");
        return;
      }
      else{
        let dctItem=  {
          product_name:null,
          product_id:null,
          item_name:null,
          item_id:null,
          int_qty:0,
          rate:0,
          total:0,
          lstItemImei:[],
          bln_imei:true
          };
          this.lstItem.push(dctItem);
      }
    }
  

  }

  addItemBatch(){

    let masterStatus=this.masterValidation();
    if(!masterStatus){
      return;
    }


    this.itemIndexBatch=this.lstItemBatch.length-1; // to get last row index
    let returnStatus=this.checkItemBatch();//checking last row in item table

    if(returnStatus){
      if(this.lstItemBatch[this.itemIndexBatch]['lstItemTabBatch'].length==0){
        returnStatus=false;
        this.toastr.error("Error","Please fill Batch details");
        return;
      }
      else{
        let dctItem=  {
          product_name:null,
          product_id:null,
          item_name:null,
          item_id:null,
          int_qty:0,
          rate:0,
          total:0,
          lstItemTabBatch:[],
          bln_imei:false
          };
          this.lstItemBatch.push(dctItem);
      }
    }

  }

  sampleValidation(){

      var users = [{
        name: 'John',
        email: 'johnson@mail.com',
        age: 25,
      },
      {
          name: 'Tom',
          email: 'tom@mail.com',
          age: 35,
      },
      {
          name: 'John',
          email: 'johnson@mail.com',
          age: 25,
      }];

      // console.log("#######users",users);
      

    const status = users.some(user => {
      // console.log("user",user);
      
    let counter  = 0;
    for (const iterator of users) {
      // console.log("iterator",iterator);
      
      if (iterator.name === user.name && iterator.email === user.email && iterator.age === user.age) {
        counter += 1;
      }
    }
    return counter > 1;
  });

  // console.log("status",status);
  

}


// getCourierNames(){

//   this.serviceObject.getData('stock_transfer/courier_data/').subscribe(res => {
//     if (res.status === 1) {
   
//       this.lstCourierName= res['courier_name']
//     } else {
//       this.toastr.error('Error occured ' );
//     }
//   });

// }

// courierNameChange(){

//   this.serviceObject.postData('stock_transfer/courier_vehicle/',{'courier_id':this.intCourierName}).subscribe(res => {
//     if (res.status === 1) {
//       this.lstVehicleNo=res['vehicle']
//     } else {
//       this.toastr.error('Error occured ' );
//     }
//   });
//   }

  validateSerialNo(){
    
    this.slStatus=true;

    
    for(let i=0;i<this.lstItem.length;i++){ 
      
      if((this.lstItem[i].product_name!=null && this.lstItem[i].product_name!='')&&this.lstItem[i].product_id==null){
        
        this.toastr.error("Error","Please enter valid product name for row "+(i+1)+" in Serial No.");
        this.slStatus=false;
        return;
      }
      else if((this.lstItem[i].item_id==null) && (this.lstItem[i].item_name!=null && this.lstItem[i].item_name!='')){

        this.toastr.error("Error","Please enter valid item name for row "+(i+1)+" in Serial No.");
        this.slStatus=false;

        return;
      }
      else if((this.lstItem[i].item_id==null && (this.lstItem[i].item_name==null || this.lstItem[i].item_name==''))&&(this.lstItem.length!=1)){
        this.toastr.error("Error","Please enter valid item name for row "+(i+1)+" in Serial No.");
        this.slStatus=false;

        return;
      }
      else if(this.lstItem[i].item_id!=null && this.lstItem[i].int_qty==0){        
        this.toastr.error("Error","Please fill IMEI numbers for row "+(i+1));
        this.slStatus=false;

        return;
      }
    
        let itemCount=0;
        for(let j=0;j<this.lstItem.length;j++){
          if(this.lstItem[j].item_id==this.lstItem[i].item_id){
            itemCount++;
          }
        }
        if(itemCount>1){          
          this.toastr.error("Error","Item "+this.lstItem[i].item_name+" repeated");
          this.slStatus=false;

          return; 
        }
     
        let returnStatus=true;
        for(let k=0;k<this.lstItem[i].lstItemImei.length;k++){
          let imeiCount=0;
          for(let c=0;c<this.lstItem[i].lstItemImei.length;c++){
            if(this.lstItem[i].lstItemImei[k]==this.lstItem[i].lstItemImei[c]){
              imeiCount++;
            }
          }
          if(imeiCount>1){
            
            returnStatus=false;
            break;
          }
       
        // }
        }

      if(!returnStatus){
        this.toastr.error("Error","IMEI duplicated for Item "+this.lstItem[i].item_name);
        this.slStatus=false;
        return;
      }
     


    }

  }

  validateBatch(){
      
    this.batchStatus=true;

    for(let i=0;i<this.lstItemBatch.length;i++){ 

      if((this.lstItemBatch[i].product_name!=null && this.lstItemBatch[i].product_name!='')&&this.lstItemBatch[i].product_id==null){
        this.toastr.error("Error","Please enter valid product name for row "+(i+1)+" in Batch");
        this.batchStatus=false;
        return ;
      }
      else if(this.lstItemBatch[i].item_id==null && (this.lstItemBatch[i].item_name!=null && this.lstItemBatch[i].item_name!='')){
        this.toastr.error("Error","Please enter valid item name for row "+(i+1)+" in Batch");
        this.batchStatus=false;

        return;
      }
      else if((this.lstItemBatch[i].item_id==null && (this.lstItemBatch[i].item_name==null || this.lstItemBatch[i].item_name==''))&&(this.lstItemBatch.length!=1)){
        this.toastr.error("Error","Please enter valid item name for row "+(i+1)+" in Batch");
        this.batchStatus=false;

        return;
      }
      else if(this.lstItemBatch[i].item_id!=null && this.lstItemBatch[i].int_qty==0){
        this.toastr.error("Error","Qty not entered for item "+this.lstItemBatch[i].item_name+" in Batch");
        this.batchStatus=false;

        return;
      }
    
      let itemCount=0;
      for(let j=0;j<this.lstItemBatch.length;j++){
        if(this.lstItemBatch[j].item_id==this.lstItemBatch[i].item_id){
          itemCount++;
        }
      }
      if(itemCount>1){
        
        this.toastr.error("Error","Item "+this.lstItemBatch[i].item_name+" repeated");
        this.batchStatus=false;

        return; 
      }
    
      // else{

      let returnStatus=true;

        for(let k=0;k<this.lstItemBatch[i].lstItemTabBatch.length;k++){
        
          if(this.lstItemBatch[i].lstItemTabBatch['transfer_qty']>this.lstItemBatch[i].lstItemTabBatch['qty']){
            this.toastr.error("Error","Please enter valid qty for item "+this.lstItemBatch[i].item_name+" of batch number "+this.lstItemBatch[i].lstItemTabBatch['batch']);
            returnStatus=false;
            break;
            // return false; 
          }  
        }
        if(!returnStatus){
          this.batchStatus=false;
          return;
        }
       

      // }

    }

  }

  saveTransfer(){

    this.saveDisable=true;//disable save button

    let dctData={};

    let masterStatus=true;
    masterStatus=this.masterValidation(); // Validation for master row
    if(!masterStatus){     
      this.saveDisable=false; 
      return;
    }

    this.validateSerialNo(); //Validation for Serial No    
    
    if(!this.slStatus){
      this.saveDisable=false; 
      return;
    }

    this.validateBatch(); //Validation for Batch
    if(!this.batchStatus){
      this.saveDisable=false; 
      return;
    }
 
    
    if(this.lstItem[0]['item_id']==null && this.lstItemBatch[0]['item_id']==null){//checking for either details
      this.toastr.error("Error","Please enter Serial No or Batch details");
      this.saveDisable=false; 

      return false; 
    }
    // else if(this.fromBranch=='Angamaly'){ // one item from angamaly branch
    //   if(this.lstItem[0]['item_id']!=null && this.lstItemBatch[0]['item_id']!=null){
    //     this.toastr.error("Error","Only one item can transfer from Angamaly");
    //     this.saveDisable=false; 

    //     return false; 
    //   }
    //   else if(this.lstItem[0]['item_id']!=null){ //IMEI
    //     if(this.lstItem[0]['int_qty']!=1){
    //       this.toastr.error("Error","Only one quantity can transfer from Angamaly");
    //       this.saveDisable=false; 

    //       return false;
    //     }
    //   }
    //   else if(this.lstItemBatch[0]['item_id']!=null){ //batch
    //     if(this.lstItemBatch[0]['int_qty']!=1){
    //       this.toastr.error("Error","Only one quantity can transfer from Angamaly");
    //       this.saveDisable=false; 

    //       return false;
    //     }
    //   }
    // }


    dctData['fromBranch']=this.fromBranch;
    dctData['transferDate']=this.transferDate;
    dctData['remarks']=this.strRemarks;
    dctData['totQty']=(this.intTotalQtyBatch+this.intTotalQty);


    let lst_items=[];

    if(this.lstItem[0].item_id!=null){
      this.lstItem.forEach(element=>{
        lst_items.push(element);
      });
    }

    if(this.lstItemBatch[0].item_id!=null){
      this.lstItemBatch.forEach(element=>{
          lst_items.push(element);
      });
    }
    dctData['lst_items']=lst_items;



    // Transportation Details
    // if(this.blnTransfer){

    //   if(this.strMedium=='1'){ //Courier
  
    //     if(this.intCourierName==undefined||this.intCourierName==null){
    //       this.toastr.error("Error","Please select courier name");
    //       this.saveDisable=false; 

    //       return false; 
    //     }
    //     else if(this.strVehicleNo==undefined||this.strVehicleNo==null){
    //       this.toastr.error("Error","Please select vehicle no.");
    //       this.saveDisable=false; 

    //       return false; 
    //     }
    //     else if(this.strCourierPhNo==undefined||this.strCourierPhNo==null||this.strCourierPhNo==''){
    //       this.toastr.error("Error","Please enter contact no.");
    //       this.saveDisable=false; 

    //       return false; 
    //     }
    //     else if(this.strCourierPhNo.toString().length > 10 || this.strCourierPhNo.toString().length < 10){
    //       this.toastr.error('Contact number is not valid');
    //       this.saveDisable=false; 

    //       return;
    //     }
    //     else if(this.intCouPackets==undefined||this.intCouPackets==null||this.intCouPackets==''){
    //       this.toastr.error("Error","Please enter No. of packets");
    //       this.saveDisable=false; 

    //       return false; 
    //     }
    //     else{
    //       dctData['transportType']=this.strMedium;
    //       dctData['strMediumNo']=this.strMediumNo;
    //       dctData['intCourierId']=this.intCourierName;
    //       dctData['strVehicleNo']=this.strVehicleNo;
    //       dctData['strMediumPhNo']=this.strCourierPhNo;
    //       dctData['intPackets']=this.intCouPackets;
    //     }
    //   }
    //   else if(this.strMedium=='2'){ //Bus
  
    //     if(this.strBusNo==undefined||this.strBusNo==null){
    //       this.toastr.error("Error","Please enter Bus No.");
    //       this.saveDisable=false; 

    //       return false; 
    //     }
    //     else if(this.strBusName==undefined||this.strBusName==null||this.strBusName==''){
    //       this.toastr.error("Error","Please enter contact name");
    //       this.saveDisable=false; 

    //       return false; 
    //     }
    //     else if(this.strBusPhNo==undefined||this.strBusPhNo==null||this.strBusPhNo==''){
    //       this.toastr.error("Error","Please enter contact no.");
    //       this.saveDisable=false; 

    //       return false; 
    //     }
    //     else if(this.strBusPhNo.toString().length > 10 || this.strBusPhNo.toString().length < 10){
    //       this.toastr.error('Contact number is not valid');
    //       this.saveDisable=false; 

    //       return;
    //     }
    //     else if(this.intBusPackets==undefined||this.intBusPackets==null||this.intBusPackets==''){
    //       this.toastr.error("Error","Please enter No. of packets");
    //       this.saveDisable=false; 

    //       return false; 
    //     }
    //     else{
    //       dctData['transportType']=this.strMedium;
    //       dctData['strMediumNo']=this.strBusNo;
    //       dctData['strMediumName']=this.strBusName;
    //       dctData['strMediumPhNo']=this.strBusPhNo;
    //       dctData['intPackets']=this.intBusPackets;
    //     }
    //   }
    //   else if(this.strMedium=='3'){ //Direct
  
    //     if(this.strTransName==undefined||this.strTransName==null||this.strTransName==''){
    //       this.toastr.error("Error","Please enter contact name");
    //       this.saveDisable=false; 

    //       return false; 
    //     }
    //     else if(this.strTransPhNo==undefined||this.strTransPhNo==null||this.strTransPhNo==''){
    //       this.toastr.error("Error","Please enter contact no.");
    //       this.saveDisable=false; 

    //       return false; 
    //     }
    //     else if(this.strTransPhNo.toString().length > 10 || this.strTransPhNo.toString().length < 10){
    //       this.toastr.error('Contact number is not valid');
    //       this.saveDisable=false; 

    //       return;
    //     }
    //     else if(this.intTransPackets==undefined||this.intTransPackets==null||this.intTransPackets==''){
    //       this.toastr.error("Error","Please enter No. of packets");
    //       this.saveDisable=false; 

    //       return false; 
    //     }
    //     else{
    //       dctData['transportType']=this.strMedium;
    //       dctData['strMediumName']=this.strTransName;
    //       dctData['strMediumPhNo']=this.strTransPhNo;
    //       dctData['intPackets']=this.intTransPackets;
    //       dctData['strVehicleNo']=this.strTransVehicleNo;
    //     }
    //   }
    // }

    // dctData['bln_transfer']=this.blnTransfer;

    // console.log("dctData",dctData);
    
    this.serviceObject.postData('goods_return/goods_return_save/ ',dctData).subscribe(
      (response) => {
        
        if(response['status']==1){
         Swal.fire('Success','Data saved successfully','success');
        //  this.cancelTransfer();
        this.saveDisable=true;
        this.router.navigate(['transfer/goodsreturnlist']);
        }
        else{
          this.saveDisable=false; 

          Swal.fire('Error',response['message'],'error');

        }
      },
      (error) => {   
        this.saveDisable=false; 

        Swal.fire('Error!',error, 'error');  
    });

  }

  cancelTransfer(){

  
  this.slStatus=false;
  this.batchStatus=false;
  
  this.saveDisable=false; 

  this.lstImei=[];
  this.lstImeiData=[];
  this.lstTabImei=[];
  this.strImei;
  this.itemIndex=0;

  this.imeiStatus=false;

  this.lstBatch=[];
  this.lstBatchData=[];
  this.lstTabBatch=[];
  this.strBatch;
  this.itemIndexBatch=0;
  this.intTot=[];

  this.intTotalQty=0;
  this.intTotalAmount=0;

  this.intTotalQtyBatch=0;
  this.intTotalAmountBatch=0;

  this.strRemarks='';

  this.lstProducts = [];
  this.lstItems = [];

  this.lstItem=[];
  this.lstItemBatch=[];

  this.lstItem=[
    {
    product_name:null,
    product_id:null,
    item_name:null,
    item_id:null,
    int_qty:0,
    rate:0,
    total:0,
    lstItemImei:[],
    bln_imei:true
    }
  ];

  this.lstItemBatch=[
    {
    product_name:null,
    product_id:null,
    item_name:null,
    item_id:null,
    int_qty:0,
    rate:0,
    total:0,
    lstItemTabBatch:[],
    bln_imei:false
    }
  ];

  //Transportation Details

  this.blnTransfer=false;

  this.strMedium='1';

  this.strMediumNo=null;
  this.intCourierName=null;
  this.strVehicleNo=null;
  this.strCourierPhNo=null;
  this.intCouPackets=null;

  this.strBusNo=null;
  this.strBusName=null;
  this.strBusPhNo=null;
  this.intBusPackets=null;

  this.strTransName=null;
  this.strTransPhNo=null;
  this.intTransPackets=null;
  this.strTransVehicleNo=null;

  }


}
