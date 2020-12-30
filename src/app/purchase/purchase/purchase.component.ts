import { Component, OnInit, HostListener } from '@angular/core';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// export enum KEY_CODE {
//   TAB = 9
// }

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
 
  lstNum=[];
  payBefore;
  lastDate;
  strRemarks='';

  strBranch=null;
  lstBranch=[];
  blnIgst=false;
  blnImeiExistValidation = true;

  strCurrentBranch = localStorage.getItem('BranchName');
  intCurrentBranchId = localStorage.getItem('BranchId');

  purDate;
  strOrderNo='';

  strBillNo='';
  billDate;

  searchBranch: FormControl = new FormControl();
  searchItem: FormControl = new FormControl();
  
  intBranchId: null;
  lstBranches = [];
  selectedBranch = '';

  strBatchNo='';

  disTot=[];
  // cgstTot=[];
  // sgstTot=[];
  // sgst=[];
  // cgst=[];
  blnAddImei;
  branchState;

  tempCgst=[];
  tempSgst=[];
  tempIgst=[];

  preQty=[];

  tempTotal=[];
  grossAmt=0;
  grossQty=0;
  additions=0;
  deductions=0;
  netAmt=0;
  roundOff="+0";
  // batch;
  intDamage;
  blnAddBtn;

  readAllow=false;
  showPayBefore=false;

  lstItem=[];
  
  selectedItem=[];

  lstImei=[];
  templstImei=[];

  imeiStat=true;

  intBillAmount;
  imgBillSrc;
  // imgBillSrc = '';
  ImageLocation;

  // lstSerial=[];
  // templstSerial=[];

  lstSuppliers = [];
  selectedSupplier;
  supplierId;
  strSupplier;
  searchSupplier=new FormControl();
  supplierState=null;

  searchPurOrder=new FormControl();
  // @ViewChild('searchPurOrder') searchPurOrder: any;

  errorPlace;
  validationStatus;

  currentIndex;

  keyEve;
  newTime;
  setStart;

  lstItems=[];
  blnItemHasImei=false
  indexOfImei
  strImei =null;
  

  paymentType:Number;
  showModal;
  lstImeiShow = [];
  batchNoShow=''
  
  @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
    this.disableScroll(event);
  }

  @HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: any) {
    this.disableScroll(event);
  }

  @HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: any) {
    this.disableScroll(event);
  }


  constructor(
    private serviceObject:ServerService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router
    ) { }

    // @HostListener('window:keyup', ['$event'])
    // keyEvent(event: KeyboardEvent) {
    //   console.log("###",event.keyCode);
    //   if(this.blnAddImei){
    //     if(event.keyCode === KEY_CODE.TAB) { // if tab key

    //     }
    //   }
  
    // }

  ngOnInit() {
    this.strCurrentBranch= this.strCurrentBranch.replace(/\w\S*/g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
  console.log(this.strCurrentBranch,this.intCurrentBranchId,"branch");
  
    this.lstItem = [{
      item_name:null,
      int_qty:0,
      free:0,
      rate:0,
      disPer:0,
      lst_all_imei:[],  
      vchr_batch_no:null, 
      imei_status:false,  
      disPerUnit:0,
      disAmt:0,
      cgst:0,
      sgst:0,
      totAmt:0,
      lstImei:[],
      // batchNo:0
    }]; 
    this.paymentType=1;
    this.disTot[0]=0;
    this.intDamage=0;

    this.blnAddImei=false;
    this.blnAddBtn=false;
    // this.cgst[0]=0;
    // this.cgstTot[0]=0;
    // this.sgstTot[0]=0;
    // this.sgst[0]=0;
    // this.cgst[0]=0;

    this.tempTotal[0]=0;

    this.tempCgst[0]=0;
    this.tempSgst[0]=0;
    this.tempIgst[0]=0;
    // this.templstImei[0]={
    //   imei:[],
    //   batch:null

    // }
    this.searchBranch.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        
        if (strData === undefined || strData === null || strData ==='') {          
          this.lstBranches = [];
          this.intBranchId=null;
        } else {
          if (strData.length >= 2) {
            this.serviceObject
            .putData('user/get_branch_list/', { strData: strData })
            .subscribe(
              (response) => {
               let list = response['data'];
                list.forEach((element, index) => {
                  
                  if((element.branchname).toUpperCase()==(this.strCurrentBranch).toUpperCase()){
                    list.splice(index, 1)
                  }
                });
                this.lstBranches=list

              }
            );

          }
        }
      }
      );
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
    this.searchItem.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      
      if (strData === undefined || strData === null || strData ==='') {          
        this.lstItems = [];
        // this.intBranchId=null;
      } else {
        if (strData.length >= 2) {
          this.serviceObject
          .postData('purchase/item_typeahead/', { term: strData })
          .subscribe(
            (response) => {
              // this.lstItems = response['data'];
            this.lstItems.push(...response['data']);
              

            }
          );

        }
      }
    }
    );

    this.lstItem=[];
    this.getWarehouses();
    this.readAllow=false;
    this.showPayBefore=false;
    this.purDate=new Date();  
    this.billDate=new Date();    
  
    this.getPurchaseOrderNum();
    let dctItem={
      item_name:null,
      int_qty:0,
      free:0,
      rate:0,
      disPer:0,
      disPerUnit:0,
      lst_all_imei:[],
      imei_status:false,
      disAmt:0,
      cgst:0,
      vchr_batch_no:null,
      sgst:0,
      igst:0,
      totAmt:0,
      lstImei:[],
      // batchNo:0
    }
    this.lstItem.push(dctItem);
    this.templstImei[0]={
      imei:[],
      imeiStatus:true,
      damageNum:0
      // batch:null
    }
    // this.templstSerial[0]={
    //   serial:[],
    //   batch:null
    // }
  }
  BranchChanged (item) {
    this.intBranchId = item.id;
  }
  clearFields(){
    // this.cgst[0]=0;
    // this.cgstTot[0]=0;
    // this.sgstTot[0]=0;
    // this.sgst[0]=0;
    // this.cgst[0]=0;
    this.disTot[0]=0;
    this.tempTotal[0]=0;

    this.tempCgst[0]=0;
    this.tempSgst[0]=0;
    this.tempIgst[0]=0;

    this.grossQty=0;
    this.grossAmt=0;
    this.roundOff='+0';
    this.additions=0;
    this.deductions=0;
    this.netAmt=0;
    this.strOrderNo='';
    this.purDate=new Date();    
    this.billDate=new Date();
    this.strBillNo=null;
    this.intBillAmount=null;
    this.strSupplier=null;
    this.selectedSupplier=null;
    this.supplierId=null;
    this.paymentType=1;
    this.strRemarks=null;
    this.strBranch=null;

    // this.batch=null;
    this.intDamage=null;
    this.templstImei[0]={
      imei:[],
      imeiStatus:true,
      damageNum:0
      // batch:null
    }
    this.lstImei=[];

    this.lstItem=[];
    this.getWarehouses();
    this.readAllow=false;
    this.showPayBefore=false;
    this.getPurchaseOrderNum();
    let dctItem={
      item_name:null,
      int_qty:0,
      free:0,
      rate:0,
      disPer:0,
      lst_all_imei:[],   
      vchr_batch_no:null,
      imei_status:false,         
      disPerUnit:0,
      disAmt:0,
      cgst:0,
      sgst:0,
      igst:0,
      totAmt:0,
      lstImei:[],
      // batchNo:0
    }
    this.lstItem.push(dctItem);

    this.blnAddBtn=false;
  }

  typeaheadSupplier(data){
    
    this.serviceObject.postData('purchase/supplier_typeahead/',{term:data}).subscribe(
      (response) => {
        this.lstSuppliers.push(...response['data']);
        
        if(this.strOrderNo!=null && this.strOrderNo!=''){
          
          this.supplierState=this.lstSuppliers[0]['supplier_states_id'];
          this.setTaxes(this.branchState);

          for (let itemIndex = 0; itemIndex < this.lstItem.length; itemIndex++) { // initialize calculation temporary variables
            this.calcTotalUsingRate(itemIndex,"eve");
          }

        }
      },
      (error) => {   
        Swal.fire('Error!',error, 'error');
        
      });
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
        Swal.fire('Error!',error, 'error');
        
      });
  }

  getPurchaseOrderNum(){
      this.serviceObject.getData('purchase/list_order_num/').subscribe(
      (response) => {
          if (response.status == 1) {
           this.lstNum=response['lst_po_num'];
          }  
          else {
            Swal.fire('Error!','error', 'error');
          }
      },
      (error) => {   
        Swal.fire('Error!',error, 'error');
        
      });
  }

  checkBatchNum(){
    this.validationStatus=true;
    // if(!this.imeiStat){
      if(this.strBatchNo==null || this.strBatchNo==''){
       this.validationStatus = false ;
       this.errorPlace = 'Batch no. does not leave as empty';
       this.showErrorMessage(this.errorPlace);
       return;
      }
    let dctBatch={itemId:this.lstItem[this.currentIndex]['item_id'],batchNo:this.strBatchNo};
    this.serviceObject.postData('purchase/batch_unique_check/',dctBatch).subscribe(
      (response) => {
          if (response.status == 1) {
            // let tempLen=this.templstImei[this.currentIndex]['imei'].length;

            // for(let serialNum = 0; serialNum<tempLen; serialNum++){
            //   this.templstImei[this.currentIndex]['imei'][serialNum]['imei']=serialNum+1;
            // }
            this.validationStatus = true ;
            
            
          }  
          else {
            Swal.fire('BatchNo. '+this.strBatchNo+'already exist','error', 'error');
            this.validationStatus = false ;
          }
      },
      (error) => {   
        Swal.fire('Error!',error, 'error');
        this.validationStatus = false ;
        
      });
  // }
}

  disableShow(){
    if(this.selectedSupplier==null){
       this.validationStatus = false ;
       this.errorPlace = 'Please enter supplier name';
       this.paymentType=1;
       this.showErrorMessage(this.errorPlace);
       return;
    }
    else{
      this.validationStatus = true ;
    }
    if(this.paymentType==2){
      this.showPayBefore=true;
    }
    if(this.paymentType==1){
      this.showPayBefore=false;
    }

   this.calcLastDat();
  }

  calcLastDat(){   
    // let tempDat= new Date(this.purDate);
    // let calcDat=tempDat.setDate(this.purDate.getDate() + parseInt(this.payBefore));
   
    let tempDat= new Date(this.billDate);
    let calcDat=tempDat.setDate(this.billDate.getDate() + parseInt(this.payBefore));
   
    this.lastDate=moment(calcDat).format('DD-MM-YYYY');
     
  }
  validateFree(i){
    this.validationStatus=true;
    this.masterValidation();
    if(this.validationStatus==false){
      
      this.lstItem[i]['free']=0;
      
      return;
    }
  }

  calcTotalUsingRate(i,event){
    // console.log("qwertyyuiokghj",i);
    
    this.validationStatus=true;
    if(this.strOrderNo==null || this.strOrderNo==''){
     this.masterValidation();
    }
    if(this.validationStatus==false){
      this.lstItem[i]['int_qty']=0;
      this.lstItem[i]['rate']=0;
      return;
    }
    
    if(this.lstItem[i]['int_qty']==null && event.keyCode!=8){ //keycode=8 backspace to avoid -ve sign (validation)
      this.errorPlace = 'Invalid quantity';
      this.showErrorMessage(this.errorPlace);
      this.lstItem[i]['int_qty']=0;
      return;
    }
    if(this.lstItem[i]['rate']==null && event.keyCode!=8){
      this.errorPlace = 'Invalid rate';
      this.showErrorMessage(this.errorPlace);
      this.lstItem[i]['rate']=0;
      return;
    }
    // if(event.keyCode==189 || event.keyCode==187 || event.keyCode==69){
    //   this.validationStatus = false ;
    //   this.errorPlace = 'Invalid quantity';
    //   this.showErrorMessage(this.errorPlace);
    
    //   this.lstItem[i]['int_qty']=null;
    //   this.lstItem[i]['int_qty']=0;
    //   return;
    // }
    
    this.lstItem[i]['totAmt']=(Number(this.lstItem[i]['int_qty'])*Number(this.lstItem[i]['rate'])).toFixed(2);
    
    this.tempTotal[i]=Number(this.lstItem[i]['totAmt']);
  
    this.tempCgst[i]=(this.lstItem[i]['totAmt']*this.lstItem[i]['cgst'])/100;
    this.tempSgst[i]=(this.lstItem[i]['totAmt']*this.lstItem[i]['sgst'])/100;
    this.tempIgst[i]=(this.lstItem[i]['totAmt']*this.lstItem[i]['igst'])/100;
    
    if(this.blnIgst){
      
      this.lstItem[i]['totAmt']=Number(this.lstItem[i]['totAmt'])+Number(this.tempIgst[i]);      
    }
    else{
      
      this.lstItem[i]['totAmt']=Number(this.lstItem[i]['totAmt'])+Number(this.tempCgst[i])+Number(this.tempSgst[i]);            
    }

    this.lstItem[i]['totAmt']=(Number(this.lstItem[i]['totAmt'])-Number(this.lstItem[i]['disAmt'])).toFixed(2);

    this.calcGrandTotal();

  }

  // calcTotalUsingCgst(i){ //using input change
  //   if(this.cgst[i]!=0){
     
  //     this.lstItem[i]['totAmt']-=this.cgst[i];tempTotal   
  //   }
  //   else if(this.sgstTot[i]==0 || this.sgstTot[i]==null){
      
  //     if(this.disTot[i]!=0){
        
  //     this.lstItem[i]['totAmt']=this.disTot[i];
  //     }
  //   }
  //   else{
      
  //     this.lstItem[i]['totAmt']=this.sgstTot[i];
  //   }
  //   this.cgst[i]=(this.tempTotal[i]*this.lstItem[i]['cgst'])/100;
      
  //   this.lstItem[i]['totAmt']=(Number(this.lstItem[i]['totAmt'])+Number(this.cgst[i]));   
         
  //   this.lstItem[i]['totAmt'].toFixed(2);
  //   this.cgstTot[i]=this.lstItem[i]['totAmt'];
    
  //   this.calcGrandTotal();
  // }

  // calcTotalUsingSgst(i){  //using input change
  //   if(this.sgst[i]!=0){
  //   this.lstItem[i]['totAmt']-=this.sgst[i];
  //   }
  //  else if(this.cgstTot[i]==0 || this.cgstTot[i]==null){
  //     if(this.disTot[i]!=0){
  //     this.lstItem[i]['totAmt']=this.disTot[i];
  //     }
  //   }
  //   else{
  //     this.lstItem[i]['totAmt']=this.cgstTot[i];
  //   }

  //   this.sgst[i]=(this.tempTotal[i]*this.lstItem[i]['sgst'])/100;
  //   this.lstItem[i]['totAmt']=(Number(this.lstItem[i]['totAmt'])+Number(this.sgst[i])).toFixed(2);

  //   this.sgstTot[i]=Number(this.lstItem[i]['totAmt']);
  //   this.calcGrandTotal();
  // }

  calcTotalUsingDisper(i){
    this.validationStatus=true;
      this.masterValidation();
      if(this.validationStatus==false){
        this.lstItem[i]['disPer']=0;
        return;
      }
        //calc using discount percentage

      this.lstItem[i]['totAmt']=Number(this.tempTotal[i]);  
      
      // this.lstItem[i]['disAmt']=(Number(this.lstItem[i]['totAmt']*this.lstItem[i]['disPer'])/100).toFixed(2);
      this.lstItem[i]['disAmt']=(Number(this.tempTotal[i]*this.lstItem[i]['disPer'])/100).toFixed(2);


      this.lstItem[i]['disPerUnit']=(Number(this.lstItem[i]['disAmt']/this.lstItem[i]['int_qty'])).toFixed(2);    
      

      if(this.blnIgst){
        this.lstItem[i]['totAmt']=Number(this.lstItem[i]['totAmt'])+Number(this.tempIgst[i]);      
      }
      else{
        this.lstItem[i]['totAmt']=Number(this.lstItem[i]['totAmt'])+Number(this.tempCgst[i])+Number(this.tempSgst[i]);            
      }
  
      this.lstItem[i]['totAmt']=(Number(this.lstItem[i]['totAmt'])-Number(this.lstItem[i]['disAmt'])).toFixed(2);
  

      // this.lstItem[i]['totAmt']=(this.lstItem[i]['totAmt']-Number(this.lstItem[i]['disAmt'])).toFixed(2);

      this.disTot[i]=Number(this.lstItem[i]['totAmt']);

      this.calcGrandTotal();
  }

  setZero(i){

    if(this.lstItem[i]['disPer']==null || isNaN(this.lstItem[i]['disPer'])){
      this.lstItem[i]['disPer']=0;
    }
    if(this.lstItem[i]['disPerUnit']==null || isNaN(this.lstItem[i]['disPerUnit'])){
      this.lstItem[i]['disPerUnit']=0;
    }
    if(this.lstItem[i]['disAmt']==null || isNaN(this.lstItem[i]['disAmt'])){
      this.lstItem[i]['disAmt']=0;
    }
    if(this.lstItem[i]['free']==null || isNaN(this.lstItem[i]['free'])){
      this.lstItem[i]['free']=0;
    }
    if(this.lstItem[i]['rate']==null || isNaN(this.lstItem[i]['rate'])){
      this.lstItem[i]['rate']=0;
    }
  }

  calcTotalUsingDisPerUnit(i){
    this.validationStatus=true;

      //calc using discount per unit
      this.masterValidation();
      if(this.validationStatus==false){
        this.lstItem[i]['disPerUnit']=0;
        return;
      }
      this.lstItem[i]['totAmt']=Number(this.tempTotal[i]);

      // this.lstItem[i]['disAmt']=Math.floor(this.lstItem[i]['int_qty']*this.lstItem[i]['disPerUnit']);
      // this.lstItem[i]['disPer']=Math.floor((this.lstItem[i]['disAmt']*100)/this.lstItem[i]['totAmt']);
      // this.lstItem[i]['totAmt']=Math.floor(this.lstItem[i]['totAmt']-this.lstItem[i]['disAmt']);
      this.lstItem[i]['disAmt']=(Number(this.lstItem[i]['int_qty']*this.lstItem[i]['disPerUnit'])).toFixed(2);
      // this.lstItem[i]['disPer']=(Number(this.lstItem[i]['disAmt']*100)/this.lstItem[i]['totAmt']).toFixed(2);
      this.lstItem[i]['disPer']=(Number(this.lstItem[i]['disAmt']*100)/this.tempTotal[i]).toFixed(2);

      if(this.blnIgst){
        this.lstItem[i]['totAmt']=Number(this.lstItem[i]['totAmt'])+Number(this.tempIgst[i]);      
      }
      else{
        this.lstItem[i]['totAmt']=Number(this.lstItem[i]['totAmt'])+Number(this.tempCgst[i])+Number(this.tempSgst[i]);            
      }
  
      this.lstItem[i]['totAmt']=(Number(this.lstItem[i]['totAmt'])-Number(this.lstItem[i]['disAmt'])).toFixed(2);
  

      // this.lstItem[i]['totAmt']=(this.lstItem[i]['totAmt']-Number(this.lstItem[i]['disAmt'])).toFixed(2);
      
      this.disTot[i]=this.lstItem[i]['totAmt'];
      this.calcGrandTotal();

  }

  calcTotalUsingDisAmt(i){
      this.validationStatus=true;

      this.masterValidation();
      if(this.validationStatus==false){
        this.lstItem[i]['disAmt']=0;
        return;
      }
  //calc using discount amount
      this.lstItem[i]['totAmt']=this.tempTotal[i];

      // this.lstItem[i]['disPer']=Math.floor((this.lstItem[i]['disAmt']*100)/this.lstItem[i]['totAmt']);
      // this.lstItem[i]['disPerUnit']=Math.floor(this.lstItem[i]['disAmt']/this.lstItem[i]['int_qty']);
      // this.lstItem[i]['totAmt']=Math.floor(this.lstItem[i]['totAmt']-this.lstItem[i]['disAmt']);

      // this.lstItem[i]['disPer']=(Number(this.lstItem[i]['disAmt']*100)/Number(this.lstItem[i]['totAmt'])).toFixed(2);
      this.lstItem[i]['disPer']=(Number(this.lstItem[i]['disAmt']*100)/Number(this.tempTotal[i])).toFixed(2);

      this.lstItem[i]['disPerUnit']=(Number(this.lstItem[i]['disAmt'])/Number(this.lstItem[i]['int_qty'])).toFixed(2);

      if(this.blnIgst){
        this.lstItem[i]['totAmt']=Number(this.lstItem[i]['totAmt'])+Number(this.tempIgst[i]);      
      }
      else{
        this.lstItem[i]['totAmt']=Number(this.lstItem[i]['totAmt'])+Number(this.tempCgst[i])+Number(this.tempSgst[i]);            
      }
  
      this.lstItem[i]['totAmt']=(Number(this.lstItem[i]['totAmt'])-Number(this.lstItem[i]['disAmt'])).toFixed(2);
  

      // this.lstItem[i]['totAmt']=(Number(this.lstItem[i]['totAmt'])-Number(this.lstItem[i]['disAmt'])).toFixed(2);

      this.disTot[i]=Number(this.lstItem[i]['totAmt']);
      this.calcGrandTotal();

  }

  calcGrandTotal(){
    let lstLen=this.lstItem.length;
    this.grossAmt=0;
    this.grossQty=0;
    for (let index = 0; index < lstLen; index++) {
      this.grossAmt+=Number(this.lstItem[index]['totAmt']);
      this.grossQty+=Number(this.lstItem[index]['int_qty']);
    }
    // console.log("");
    
    // console.log("this.grossAmt##",this.grossAmt);
    // this.grossAmt=this.grossAmt.toFixed(2);
    this.calcNet();
  }

  calcNet(){
    this.netAmt=0;
    this.netAmt=Number(this.grossAmt)+Number(this.additions);
    this.netAmt-=this.deductions;
    // console.log("##this.roundOff",this.roundOff);
    let temp=parseFloat(this.roundOff);
    // console.log("temp",temp);

    if(!isNaN(temp)){
      // console.log("temp!=NaN");
      
    this.netAmt+=temp;
    }
    // console.log("##this.netAmt",this.netAmt);
    
  }

  savePurchase(){    
    
console.log("@SAVE",this.lstItem);

      // this.validationStatus=true;
      this.masterValidation();
      this.detailsValidation();
      // console.log("##this.validationStatus",this.validationStatus);
      
      if(this.validationStatus==false){
      // this.showErrorMessage(this.errorPlace);        
        return;
      }
      let purDat=moment(this.purDate).format('YYYY-MM-DD');
      let lasDat=moment(this.lastDate).format('YYYY-MM-DD');
      let billDat=moment(this.billDate).format('YYYY-MM-DD');
   
      // console.log("$##lasDat",lasDat);
      // console.log("%^%%this.lastDate",this.lastDate);
      
      
      let dctData={};

      if(this.paymentType==1){
        // console.log("this.paymentType==1");
        
        dctData['payBefore']=null;
        
      }
      else if(this.paymentType==2){
        // console.log("this.paymentType==2");
        
        dctData['payBefore']=lasDat;
      }
      // console.log("dctData['lastDate']",dctData['lastDate']);


      const frmPublishedData = new FormData;
      frmPublishedData.append('purDat',purDat);
      frmPublishedData.append('billDat',billDat);
      frmPublishedData.append('billNo',this.strBillNo);
      frmPublishedData.append('intSupplier',this.supplierId);
      frmPublishedData.append('intBranch',this.intBranchId);
      frmPublishedData.append('remarks',this.strRemarks);
      frmPublishedData.append('orderId',this.strOrderNo);
      frmPublishedData.append('paymentType',String(this.paymentType));
      frmPublishedData.append('blnIgst',String(this.blnIgst));
      frmPublishedData.append('batchNo',this.strBatchNo);
      frmPublishedData.append('items', JSON.stringify(this.lstItem));
      frmPublishedData.append('grossAmt',String(this.grossAmt));
      frmPublishedData.append('grossQty',String(this.grossQty));
      frmPublishedData.append('fltAddition',String(this.additions));
      frmPublishedData.append('fltDeduction',String(this.deductions));
      frmPublishedData.append('roundOff',this.roundOff);
      frmPublishedData.append('netAmt',String(this.netAmt));
      frmPublishedData.append('billAmount',this.intBillAmount);
      frmPublishedData.append('billImage',this.ImageLocation);
      frmPublishedData.append('vchr_branch_code',this.intBranchId);


      

      dctData['purDat']=purDat;
      dctData['billDat']=billDat;
      dctData['billNo']=this.strBillNo;
      dctData['intSupplier']=this.supplierId;
      dctData['intBranch']=this.intBranchId;
      dctData['remarks']=this.strRemarks;
      dctData['orderId']=this.strOrderNo;
      dctData['paymentType']=this.paymentType;
      // dctData['payBefore']=lasDat;
      dctData['blnIgst']=this.blnIgst;
      dctData['batchNo']=this.strBatchNo;
      dctData['items']=this.lstItem;
      dctData['grossAmt']=this.grossAmt;
      dctData['grossQty']=this.grossQty;
      dctData['fltAddition']=this.additions;
      dctData['fltDeduction']=this.deductions;
      dctData['roundOff']=this.roundOff;
      dctData['netAmt']=this.netAmt;
      dctData['billAmount']=this.intBillAmount;

      

      this.serviceObject.postFormData('purchase/purchase_api/', frmPublishedData).subscribe(
        (response) => {
          // console.log("###response",response);
          
          if(response['status']==1){
         

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
                  // dctData['bln_batch_pass']=true
                  frmPublishedData.append('bln_batch_pass','true');
                  this.serviceObject.postData('purchase/purchase_api/',frmPublishedData).subscribe(
                    (response) => {
                      if(response['status']==1){
                        this.toastr.success(response['message']);
                        localStorage.setItem('previousUrl','purchase/purchaselist');
                        this.router.navigate(['purchase/purchaselist']);
                      }
                      else{
                        // this.blnSaveDisable = false;  
                        this.toastr.error(response['message']);
                      }
              
                    },
                    error => {
                      alert(error);
                    }
                    )
                    }  
                    // else{
                    //   // this.blnSaveDisable = false;  
                      
                    // }
                  })
            }
            else if(response.hasOwnProperty('bln_imei') && response['bln_imei']){
              this.toastr.error(response['message']);
              // this.blnSaveDisable = false;
              
            }
            else{
              this.clearFields();
              Swal.fire({
                position: "center", 
                type: "success",
                text: "Data saved successfully",
                showConfirmButton: true,  
              }); 
              localStorage.setItem('previousUrl','purchase/purchaselist');
              this.router.navigate(['purchase/purchaselist']);
            }
        }
        else{
          Swal.fire('Error!',response['message']);
        }
        },
        (error) => {   
          Swal.fire('Error!',error, 'error');
          
        });
  }

  addImeiTest(content1,index){
    // let tempQty=this.lstItem[index]['int_qty']+this.lstItem[index]['free'];
    this.showModal=this.modalService.open(content1, { centered: true, size: 'lg' });

    // for (let imeiIndex = 0; imeiIndex < tempQty; imeiIndex++) {
    //   let dctImei={
    //     imei:null
    //   }
    //   this.lstImei.push(dctImei);
    //   // this.lstImei[imeiIndex]=[];
    // }
    // this.batch=null;
  }

  setImeiList(index){
    
    let tempQty=this.lstItem[index]['int_qty']+this.lstItem[index]['free'];
    let imeiIndex;
    if(tempQty>this.lstImei.length){
      imeiIndex=this.lstImei.length-1;  
    }
    else{
      imeiIndex=0;
    }
    for (index = imeiIndex; index < tempQty; index++) {
      let dctImei={
        imei:null
      }
      this.lstImei.push(dctImei);
    }
    
  }

  getOrderDetails(){    
    if(this.strOrderNo==null || this.strOrderNo==''){
      this.blnAddBtn=false;
      this.readAllow=false;
      return;
    }
    let num={purOrderNum:this.strOrderNo}
      this.serviceObject.postData('purchase/list_order_num/',num).subscribe(
      (response) => {
          if (response.status == 1) {
            
            this.readAllow=true;


            // console.log("##this.readAllow",this.readAllow);
            this.supplierId=response['data']['supplier_id'];
            this.strSupplier=this.selectedSupplier=response['data']['supplier_name'];
            // this.branchId=response['data']['branch_id'];
            this.strBranch=response['data']['branch_id'];
            this.payBefore=response['data']['int_credit_days'];
            this.strBatchNo=response['data']['batch_num'];
            this.branchState=response['data']['branch_state_id'];
            // this.lstItem.splice(0,1);
            this.lstItem=[];
            this.lstItem.push(...response['data']['lst_item_details']);
            for (let itemIndex = 0; itemIndex < this.lstItem.length; itemIndex++) { // initialize calculation temporary variables
              this.disTot[itemIndex]=0;
              this.selectedItem.push(response['data']['lst_item_details'][itemIndex]['item_name']);

              // this.cgst[itemIndex]=0;
              // this.cgstTot[itemIndex]=0;
              // this.sgstTot[itemIndex]=0;
              // this.sgst[itemIndex]=0;
              // this.cgst[itemIndex]=0;
              this.preQty[itemIndex]=this.lstItem[itemIndex]['int_qty'];
              this.tempCgst[itemIndex]=0;
              this.tempSgst[itemIndex]=0;
              this.tempIgst[itemIndex]=0;
              this.tempTotal[itemIndex]=0;
              this.templstImei[itemIndex]={
                imei:[],
                imeiStatus:response['data']['lst_item_details'][itemIndex]['imei_status'],
                damageNum:0
                // batch:null
              }
              // this.templstSerial[itemIndex]={
              //   serial:[],
              //   batch:null
              // }
              this.calcTotalUsingRate(itemIndex,"fdf");
            }
                        
            this.blnAddBtn=true;
            
          }  
          else if(response.status == 2){
            Swal.fire('Error!',response['message'], 'error');
            this.blnAddBtn=false;
            this.strOrderNo='';
            this.readAllow=false;
          }
          else {
            this.blnAddBtn=false;
            this.readAllow=false;
            this.strOrderNo='';
            Swal.fire('Error!',response['message'], 'error');
          }
      },
      (error) => {   
        this.blnAddBtn=false;
        this.readAllow=false;
        this.strOrderNo='';
        Swal.fire('Error!',error, 'error');
        
      });
  }

  checkQty(index){
    this.validationStatus=true;
    if(this.strOrderNo!=null || this.strOrderNo!=''){

      if(this.lstItem[index]['int_qty']>this.preQty[index]){ // if entered qty is greater than ordered qty
        this.validationStatus=false;
        this.errorPlace = 'Please enter a quantity which was ordered for '+this.lstItem[index]['item_name'];
        this.showErrorMessage(this.errorPlace);
        return;
      }
    }
  }

  setTaxes(fk_states_id){

    if(this.strBranch==null || this.strBranch==''){
      return;
    }
    // this.blnIgst=false;
    
    if(this.selectedSupplier==null || this.selectedSupplier==''){
      this.validationStatus = false ;
      this.errorPlace = 'Please enter a valid supplier name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    
    if(this.supplierState==fk_states_id){      
      this.blnIgst=false;
    }
    else{      
      this.blnIgst=true;
    }

  }

  // addImei(imeipopup,index){
  //   this.lstImeiShow = [];
    
  //   this.validationStatus=true;
  //   if(this.blnAddBtn){
  //     this.checkQty(index);
  //   }
  //   if(this.validationStatus==false){
  //     return;
  //   }
  //   this.masterValidation();
  //   if(this.validationStatus==false){
  //     return;
  //   }
  //   //Imei number adding
  //   this.blnAddImei=true;
  //   this.lstImei=[];
  //   this.currentIndex=index;
   
  //   let tempQty=this.lstItem[index]['int_qty']+this.lstItem[index]['free'];

  //   if(tempQty==0){
  //     this.errorPlace="Please enter quantity of item "+this.lstItem[index]['item_name']
  //     this.showErrorMessage(this.errorPlace);
  //     return;
  //   }
        
  //   // this.showModal=this.modalService.open(content1, { centered: true, windowClass: 'addimeipopup',backdrop : 'static' });
  //   this.showModal = this.modalService.open(imeipopup, { centered: true, size: 'sm' ,backdrop : 'static',keyboard : false});
       
  //   this.imeiStat=this.templstImei[this.currentIndex]['imeiStatus'];
  //   this.intDamage=null;   
    
  //   if(this.imeiStat){
  //     if(this.templstImei[this.currentIndex]['imei'].length>0 && this.templstImei[this.currentIndex]['imei'][0]['imei']!=null){
  //       // console.log("###this.templstImei[this.currentIndex]['imei']",this.templstImei[this.currentIndex]['imei']);
        
  //       this.lstImei=this.templstImei[this.currentIndex]['imei']; //pushed to array variable which shown in modal
  //       this.lstItem[this.currentIndex]['lstImei']=[];
  //       this.lstItem[this.currentIndex]['lstImei'].push(...this.lstImei); //pushed to variable that pass to backend
        
  //       this.intDamage=this.templstImei[this.currentIndex]['damageNum'];
  //       // console.log("###this.templstImei[this.currentIndex]['imei']",this.templstImei[this.currentIndex]['imei'].length);
  //       // console.log("###tempQty",tempQty);
  //       let lenTemp=this.templstImei[this.currentIndex]['imei'].length;
  //       if(tempQty<lenTemp){
  //         this.errorPlace="Current quantity is less than previous quantity";
  //         this.showErrorMessage(this.errorPlace);
  //         this.intDamage=null;
  //         this.lstImei=[];  //refresh imei list
  //         for (let imeiIndex = 0; imeiIndex < tempQty; imeiIndex++) {
  //           let dctImei={
  //             imei:null,
  //             damagedItem:false
  //           }
  //           this.lstImei.push(dctImei);
  //           this.templstImei[this.currentIndex]['imei'].push(dctImei);
  //         }
  //       }
  //       else{
  //       for (let imeiIndex = lenTemp; imeiIndex < tempQty; imeiIndex++) {
  //         // console.log("@@",imeiIndex);
          
  //         let dctImei={
  //           imei:null,
  //           damagedItem:false
  //         }
  //         // this.lstImei.push(dctImei);
  //         this.templstImei[this.currentIndex]['imei'].push(dctImei);
  //       }
  //       }     

  //     }
  //     else{            
  //     this.intDamage=null;     
  //     this.lstImei=[];
  //     for (let imeiIndex = 0; imeiIndex < tempQty; imeiIndex++) {
  //       let dctImei={
  //         imei:null,
  //         damagedItem:false
  //       }
  //       this.lstImei.push(dctImei);
  //       this.templstImei[this.currentIndex]['imei'].push(dctImei);
  //     }
  //     }
  //   }
  //   else{
  //     this.intDamage=this.templstImei[this.currentIndex]['damageNum'];
  //   }
  // }
  openimeipopup(imeipopup,index) {
    this.indexOfImei=index
    // console.log(this.indexOfImei,"imeiiiii");
    
    
    this.blnItemHasImei = this.lstItem[index].imei_status;   
    // this.lst_batch = [];
    // if (this.lstItems[index]['bnt_bchno'] === null) {
    // this.batch = '';
    // } else {
    //   this.batch = this.lstItems[index]['bnt_bchno'][0];
    // }
    // if (this.intBranchId == null) {
    //   this.toastr.error('Select Branch');
    //   return false;
    // }
    // if (this.lstItems[index].fk_item_id  == null) {
    //   this.toastr.error('Select Item');
    //   return false; 
    // }
    // this.blnImeiEntered = true;
    this.lstImeiShow = [];
    // this.indexOfImei = index;
  
    
    // this.getImei(index);
    if(this.lstItem[index]['lst_all_imei'] == null || this.lstItem[index]['lst_all_imei'].length == 0){
      this.lstItem[index]['lst_all_imei']=[];
    }else{
      this.lstImeiShow = JSON.parse(JSON.stringify(this.lstItem[index]['lst_all_imei']));;
    }
    
    this.showModal = this.modalService.open(imeipopup, { centered: true, size: 'sm' ,backdrop : 'static',keyboard : false});
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

  imeiSearched(){
    // console.log("this.strImei######",this.strImei);
    
   

    if(this.strImei !=null){
      this.strImei = this.strImei.toString().trim();
      if(this.strImei== ""){      // when using backspace or space
        this.errorPlace='Invalid IMEI'
        this.showErrorMessage(this.errorPlace);
        this.strImei=null;
        this.validationStatus = false ;        
        return
      }
      if(this.lstItem[this.indexOfImei]['lst_all_imei'] !== null && this.lstItem[this.indexOfImei]['lst_all_imei'].includes(this.strImei.toString())){
        // this.toastr.error('Imei already exists' );
        this.errorPlace='Imei already exists'
        this.showErrorMessage(this.errorPlace);
        this.validationStatus = false ;        
        this.strImei=null;
        return;
      }
        
      else if(this.indexOfImei != 0 && this.lstItem[this.indexOfImei-1]['lst_all_imei'].includes(this.strImei)){
        this.toastr.error('Imei already exists in item ' + (this.indexOfImei) );
        this.strImei=null;
        return;
      }
      else{
        this.imeiExistsValidation(this.strImei,this.indexOfImei);
        
      }
      // if(this.lstImeiAvial.includes(this.strImei)){
        // this.lstImeiShow.push(this.strImei);
        // this.lstItem[this.indexOfImei]['lst_all_imei'].push(this.strImei);
        // this.lstItem[this.indexOfImei].int_qty = this.lstImeiShow.length;
        // this.lstItem[this.indexOfImei]['flt_total'] = this.lstItem[this.indexOfImei]['int_qty'] * this.lstItem[this.indexOfImei]['flt_price'];
        // this.strImei=null;

    }
    else if(this.strImei ==null){
      this.errorPlace='Invalid IMEI'
      this.showErrorMessage(this.errorPlace);
      this.strImei=null;
      this.validationStatus = false ;        
      return
    }
    // console.log(  this.lstItem,this.lstImeiShow,"  this.lstItem");
    
  }
  saveImei(){

    // console.log("#######3 this.lstItem", this.lstItem);
    
    if(this.blnItemHasImei){
      if(this.lstImeiShow.length==0){
        // this.toastr.error('Enter imei' );
        this.errorPlace='Enter imei'
        this.showErrorMessage(this.errorPlace);
        
        
        return;
      }else{
        this.showModal.close();
        this.calcTotalUsingRate(this.indexOfImei,"fdf");
          
      }
    }
    else{
      if(!this.lstItem[this.indexOfImei].vchr_batch_no){
        // this.toastr.error('Enter Batch No' );
        this.errorPlace='Enter Batch No'
        this.showErrorMessage(this.errorPlace);
        
        return;
      }
      else{
        let index=0
        for(let item of this.lstItem){

          if(item.item_id == this.lstItem[this.indexOfImei].item_id && index!=this.indexOfImei){
            if(item.vchr_batch_no==this.lstItem[this.indexOfImei].vchr_batch_no){
              this.toastr.error('Batch No is already exist' );
              this.lstItem[this.indexOfImei].vchr_batch_no=null
              // this.validationStatus = false ;
              // this.errorPlace='Batch No is already exist'
              // this.showErrorMessage(this.errorPlace);
              
              return
            }

          }
          index++
        }
        // this.lstItem[this.indexOfImei]['vchr_batch_no'] =this.strBatchNo 
        // this.lstItem[this.indexOfImei].int_qty=1  
        this.showModal.close();
        this.calcTotalUsingRate(this.indexOfImei,"fdf");
        
        
      }
    }
    
  }

  removeImei(strImeiSelected){
    if(this.lstImeiShow.includes(strImeiSelected)){
      this.lstImeiShow.splice(this.lstImeiShow.indexOf(strImeiSelected),1);
      this.lstItem[this.indexOfImei]['lst_all_imei'].splice(this.lstItem[this.indexOfImei]['lst_all_imei'].indexOf(strImeiSelected),1);
      this.lstItem[this.indexOfImei].int_qty = this.lstImeiShow.length;
      this.lstItem[this.indexOfImei]['flt_total'] = this.lstItem[this.indexOfImei]['int_qty'] * this.lstItem[this.indexOfImei]['flt_price'];
      
      // this.tableGrandTotalCalculation(this.lstItems);   // table footer grand total calculation

      // this.setImei(false,strImeiSelected);
    }
  }
closeImei(imeishow) {
    this.lstImeiShow = [];
    this.strImei=null

    this.showModal.close();
    this.indexOfImei=null;
  }
  // saveImei(){
  //   let tempQty=this.lstItem[this.currentIndex]['int_qty']+this.lstItem[this.currentIndex]['free'];

  //   this.validationStatus=true;
  //   if(this.intDamage==null){
  //     this.lstItem[this.currentIndex]['damageNum']=0;
  //     this.intDamage=0;
  //   }
  //   else{
  //     this.lstItem[this.currentIndex]['damageNum']=this.intDamage;
  //   }

  //   this.templstImei[this.currentIndex]['damageNum']=this.intDamage;


  //   if(this.strBatchNo==null || this.strBatchNo==''){
  //     this.errorPlace="Please enter batch number"
  //     this.showErrorMessage(this.errorPlace);
  //     return;
  //   }
  //   this.checkBatchNum();
    
  //   if(this.intDamage>tempQty){
  //     this.errorPlace="Invalid damaged item count";
  //     this.intDamage==null;
  //     this.validationStatus=false;
  //     this.showErrorMessage(this.errorPlace);
  //     return;
  //   }
  //   if(this.validationStatus==false){
  //     return;
  //   }
    
  //         if(this.imeiStat){
  //         let chkLst=[];
  //         let ImeiCount=this.lstImei.length;
                
  //         let countDamage=0;
  //         for (let imeiCount = 0; imeiCount < ImeiCount; imeiCount++) {
            
  //           if(this.lstImei[imeiCount].imei==null || this.lstImei[imeiCount].imei==""){
  //             this.validationStatus = false ;
  //             this.errorPlace = 'Please fill all IMEI numbers of '+this.lstItem[this.currentIndex].item_name;
  //             this.showErrorMessage(this.errorPlace);
  //             return;
  //           }
  //           if(this.lstImei[imeiCount].damagedItem==true){
  //             countDamage++;
  //           }
            
  //           if(chkLst.includes(this.lstImei[imeiCount].imei)){              
  //             this.validationStatus = false ;
  //             this.errorPlace = 'Duplicated IMEI numbers';
  //             this.showErrorMessage(this.errorPlace);
  //             return;
  //           }
  //           else{
  //             chkLst.push(this.lstImei[imeiCount].imei);
  //           }
    
  //         }

         

  //         if(countDamage!=this.intDamage){
  //           this.validationStatus = false ;
  //           this.errorPlace = 'Damaged item count not equal to ticked count';
  //           this.showErrorMessage(this.errorPlace);
  //           return;
  //         }

  //         this.lstItem[this.currentIndex]['lstImei']=[];
  //         this.lstItem[this.currentIndex]['lstImei'].push(...this.lstImei);
         
  //         // this.lstItem[this.currentIndex]['batchNo']=this.batch;
      
  //         this.templstImei[this.currentIndex]['imei']=[];
  //         this.templstImei[this.currentIndex]['imei']=this.lstImei;
          
  //         // this.templstImei[this.currentIndex]['batch']=this.batch;
  //         }

          
          
  //         this.hideModal();
  // }

  hideModal(){
    // this.popupState='cancel';
    this.blnAddImei=false;

    this.showModal.close();
    
  }
  

  itemSearched(event,data){
    this.validationStatus=true;

    this.masterValidation();
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
        // this.typeaheadItem(data);    
        this.serviceObject.postData('purchase/item_typeahead/',{term:data}).subscribe(
          (response) => {        
            this.lstItems.push(...response['data']);
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
        this.lstItems = [];
      }
    }
  }

  removeTriggerOnBackspace(event){ // set key code and event start time
    this.newTime=event.timeStamp;
    this.keyEve=event.keyCode;      
  }


  // typeaheadItem(data){
    // this.serviceObject.postData('purchase/item_typeahead/',{term:data}).subscribe(
    //   (response) => {        
    //     this.lstItems.push(...response['data']);
    //   },
    //   (error) => {   
    //     Swal.fire('Error!',error, 'error');
        
    //   }
    //   );
  // }

  supplierChanged(supplier){
    this.selectedSupplier=this.strSupplier=supplier.name;
    this.supplierState=supplier.supplier_states_id;
    
    this.supplierId=supplier.id;
    this.payBefore=supplier.credit_days;
    // let tempBatch=supplier.batchNum;
    this.strBatchNo=supplier['batch_num'];
  }

  itemChanged(item,index,event){  
    this.indexOfImei=index
    let checkExist=false

    for (let indexItem = 0; indexItem < this.lstItem.length; indexItem++) {
      // console.log("in",indexItem,index,this.lstItem[indexItem]['item_id'],item.id, item.imei_status );
      if(this.lstItem[indexItem]['item_id']==item.id && item.imei_status){
        if(indexItem!=index){ //if in the same raw
          
        this.errorPlace=item.name+" already added";
        this.validationStatus = false ;        
        event.source.value=null;
        this.lstItem[index]['item_name']=null
        this.lstItem[index]['item_id']=null
        // console.log(this.lstItem,"list");
        checkExist=true
        this.showErrorMessage(this.errorPlace);
        return;
        }
      }
    }
    if(!checkExist){

      this.selectedItem[index]=item.name;
      this.lstItem[index]['item_id']=item.id;
      this.templstImei[index]['imeiStatus']=item.imei_status;
      
      this.lstItem[index]['cgst']=item.jsn_tax['CGST'];
      this.lstItem[index]['sgst']=item.jsn_tax['SGST'];
      this.lstItem[index]['igst']=item.jsn_tax['IGST'];
      this.lstItem[index]['imei_status']=item.imei_status
    this.blnItemHasImei = this.lstItem[index].imei_status;   
      
  
      this.lstItems=[];
    }
    // console.log(this.lstItem,"list");
    // console.log(this.blnItemHasImei,"imei");
    
  }

  deleteData(indexId){

    let lstLen;
     lstLen=this.lstItem.length;
     if(!(lstLen==1)){
        if(this.blnAddBtn){ // when using PO number
          Swal.fire({
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
              this.lstItem.splice(indexId,1);

              this.templstImei.splice(indexId,1);
              this.lstImei.splice(indexId,1);
              this.selectedItem.splice(indexId,1);
            };
      
          });
        }
        else{
          this.lstItem.splice(indexId,1);

          this.templstImei.splice(indexId,1);
          this.lstImei.splice(indexId,1);
          this.selectedItem.splice(indexId,1);
        }

     }
     else{
        if(this.blnAddBtn){
          this.errorPlace = 'Could not delete';
          this.showErrorMessage(this.errorPlace);
          return;
        }
        if(!this.blnAddBtn) {
        this.lstItem = [{
          item_name:null,
          int_qty:0,
          free:0,
          rate:0,
          disPer:0,
          lst_all_imei:[],  
          vchr_batch_no:null, 
          imei_status:false,  
          disPerUnit:0,
          disAmt:0,
          cgst:0,
          sgst:0,
          totAmt:0,
          lstImei:[],
          // batchNo:0
        }];    

        this.disTot[0]=0;
        this.tempCgst[0]=0;
        this.tempSgst[0]=0;
        this.tempIgst[0]=0;

        this.tempTotal[0]=0;
        this.templstImei.splice(indexId,1);
        this.selectedItem.splice(indexId,1);
        this.templstImei[0]={
          imei:[],
          imeiStatus:true,
          damageNum:0
          // batch:null
        }
      }
     }
     this.calcGrandTotal();
    }

    addItem(){
      this.validationStatus=true;

      // this.masterValidation();
      this.blnAddImei=false;

      this.detailsValidation();
      if(this.validationStatus==false){
        return;
      }

      let dctItem={
        item_name:null,
        int_qty:0,
        free:0,
        lst_all_imei:[],   
        vchr_batch_no:null,
        imei_status:false,  
        rate:0,
        disPer:0,
        disPerUnit:0,
        disAmt:0,
        cgst:0,
        sgst:0,
        totAmt:0,
        lstImei:[],
        // batchNo:0
      }
     
      this.lstItem.push(dctItem);

      let lstLen=this.lstItem.length-1; // initialize temporary variables
      this.disTot[lstLen]=0;

      // this.cgst[lstLen]=0;
      // this.cgstTot[lstLen]=0;
      // this.sgstTot[lstLen]=0;
      // this.sgst[lstLen]=0;
      // this.cgst[lstLen]=0;
      this.tempCgst[lstLen]=0;
      this.tempSgst[lstLen]=0;
      this.tempIgst[lstLen]=0;

      this.tempTotal[lstLen]=0;
      // this.templstImei[lstLen]['imei']=[];
      // this.templstImei[lstLen]['batch']=null;

    this.templstImei[lstLen]={
      imei:[],
      imeiStatus:true,
      damageNum:0
      // batch:null
    }
  

    }

    masterValidation(){

     if(this.purDate==null){        
       this.validationStatus = false ;
       this.errorPlace = 'Select purchase date';
       this.showErrorMessage(this.errorPlace);
       return;
     }
     else if(this.intBranchId==null){
      this.validationStatus = false ;
      this.errorPlace = 'Enter branch name';
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
      this.errorPlace = 'Please fill a valid supplier name';
      this.showErrorMessage(this.errorPlace);
      return;
    } 

    else if(this.strBillNo==null || this.strBillNo==''){
      this.validationStatus = false ;
      this.errorPlace = 'Please enter bill number';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if(this.intBillAmount==null || this.intBillAmount==''){
      this.validationStatus=false;
      this.errorPlace = 'Please enter bill amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    // else if(!this.imgBillSrc){
    //   this.validationStatus=false;
    //   this.errorPlace = 'Please add a bill image';
    //   this.showErrorMessage(this.errorPlace);
    //   return;
    // }
    else if(this.imgBillSrc  && this.imgBillSrc.size >100000){
      this.validationStatus=false;
      this.errorPlace = 'Image size sholud be less than 100Kb';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if(this.billDate==null){
      this.validationStatus = false ;
      this.errorPlace = 'Please enter bill date';
      this.showErrorMessage(this.errorPlace);
      return;
    } 

    }

    detailsValidation(){
      
      this.validationStatus=true;

      let rowNum;
      this.masterValidation();
      if(this.validationStatus==false){
        return;
      }
      let lstLength=this.lstItem.length;    
      if(lstLength==0){
      this.validationStatus = false ;
      this.errorPlace = 'Please fill atleast one row';
      this.showErrorMessage(this.errorPlace);
      return;
      }
      else{
        for(let index=0; index<lstLength; index++){
          
          let ImeiCount=Number(this.lstItem[index].int_qty)+Number(this.lstItem[index].free);
          // console.log("####this.lstItem[index].lstImei.length",this.lstItem[index].lstImei.length);
          // console.log("####ImeiCount",ImeiCount);
          
          rowNum=index+1;
          
          if(this.lstItem[index].item_name==null){
          this.validationStatus = false ;
          this.errorPlace = 'Please fill item name of row '+rowNum;
          this.showErrorMessage(this.errorPlace);
          return;
          }
          else if(this.lstItem[index].int_qty==0 || !this.lstItem[index].int_qty){
            this.validationStatus = false ;
            this.errorPlace = 'Please fill quantity of row '+rowNum;
            this.showErrorMessage(this.errorPlace);
            return;
          }
          else if(this.lstItem[index].item_name!=this.selectedItem[index]){
            this.validationStatus = false ;
            this.errorPlace = 'Please select a valid item name of row '+rowNum;
            this.showErrorMessage(this.errorPlace);
            return;
          }
          else if(this.lstItem[index].lst_all_imei.length==0 && this.lstItem[index].imei_status ){
          this.validationStatus = false ;
          this.errorPlace = 'Please enter of IMEI numbers of '+this.lstItem[index].item_name;
          this.showErrorMessage(this.errorPlace);
          return;
          }
          else if((!this.lstItem[index].vchr_batch_no || this.lstItem[index].vchr_batch_no==null )&& !this.lstItem[index].imei_status){
            
            this.validationStatus = false ;
            this.errorPlace = 'Please enter of Batch numbers of '+this.lstItem[index].item_name;
            this.showErrorMessage(this.errorPlace);
            return;
            }
           
          else if(this.lstItem[index].rate==0){
          this.validationStatus = false ;
          this.errorPlace = 'Please fill rate of '+this.lstItem[index].item_name;
          this.showErrorMessage(this.errorPlace);
          return;
          }


          if(!this.lstItem[index].hasOwnProperty('damageNum')){
            this.lstItem[index]['damageNum']=0;
            
          }
          if(this.blnAddBtn){
            if(this.lstItem[index]['int_qty']>this.preQty[index]){ // if entered qty is greater than ordered qty
              this.validationStatus = false ;
              this.errorPlace = 'Please enter a quantity which was ordered for '+this.lstItem[index]['item_name'];
              this.showErrorMessage(this.errorPlace);
              return;
            }
          }


        }
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

    onChange(event: any) {
      
      const imgs = event.target.files[0];
      this.imgBillSrc = imgs;
      this.ImageLocation = event.target.files[0];
      
      status = this.checkImage();
      // console.log("image",this.ImageLocation);
      
    }
    
    checkImage() {
      if (this.imgBillSrc) {
        const img_up = new Image;
        const  img_ratio_up = 0;
        img_up.onload = () => {
         
        };
          img_up.src = window.URL.createObjectURL(this.imgBillSrc);
          return status;
      }
    }
    
    // onImageClick() {
    //   this.eventImg.nativeElement.click();
    // }
    disableScroll(event: any) {
      if (event.srcElement.type === "number")
          event.preventDefault();
    }

    imeiExistsValidation(imei,index){              // imei validation for already exit imei 


      this.serviceObject.putData('purchase/purchase_api/', {'imei':imei}).subscribe(
        (response) => {
          
          this.blnImeiExistValidation = true;
          if(response['status']==1){
           
            // this.blnImeiExistValidation =false;
          // if(!this.blnImeiExistValidation){
          //push imei into model   
          
          this.lstImeiShow.push(this.strImei);           
          this.lstItem[this.indexOfImei]['lst_all_imei'].push(this.strImei);
          this.lstItem[this.indexOfImei].int_qty = this.lstImeiShow.length;
          this.lstItem[this.indexOfImei]['flt_total'] = this.lstItem[this.indexOfImei]['int_qty'] * this.lstItem[this.indexOfImei]['flt_price'];
          this.strImei=null;

        // }
  
        }
        else{
          // this.blnImeiExistValidation = true;
          this.toastr.error(response['message']);
          this.strImei = '';
          
         
        }
        },
        (error) => {   
          Swal.fire('Error!',error, 'error');
          
        });
      

    }

}
