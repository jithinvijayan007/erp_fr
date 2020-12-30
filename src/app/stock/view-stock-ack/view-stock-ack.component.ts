// import * as tableData from './../../table/smart-table/smart-data-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-stock-ack',
  templateUrl: './view-stock-ack.component.html',
  styleUrls: ['./view-stock-ack.component.css']
})
export class ViewStockAckComponent implements OnInit {
  
  intTransferId = localStorage.getItem('int_transfer_id')
  bln_all = false;
  blnSubmitAck = false;
  constructor(
    private serviceObject: ServerService,  
    // private formBuilder: FormBuilder,
    // private toastr: ToastrService,
    public router: Router,
    // private _sanitizer: DomSanitizer,
    private modalService: NgbModal
  ) { }

  source = []
  // source = [
  //           {'batch_id': ['B001','B002'],'int_transfer_details_id':1,'vchr_item_code': '141111', 'vchr_name':'iphone6S','int_qty':2,'imei':['12','65'] ,'ack':0 ,'imei_avl':[],'imei_dmg':[],'avl_all':false,'dmg_all':false,'batch_all':false},
  //           {'batch_id':[],'int_transfer_details_id':2,'vchr_item_code': '450222', 'vchr_name':'samsung','int_qty':3,'imei':['33','45','44'] ,'ack':0 ,'imei_avl':[],'imei_dmg':[],'avl_all':false,'dmg_all':false,'batch_all':false},
  //           {'batch_id':[],'int_transfer_details_id':3,'vchr_item_code': '978646', 'vchr_name':'oppo','int_qty':4,'imei':['55','66','77','99'] ,'ack':0 ,'imei_avl':[],'imei_dmg':[],'avl_all':false,'dmg_all':false,'batch_all':false},
  //           {'batch_id':[],'int_transfer_details_id':4,'vchr_item_code': '988989', 'vchr_name':'nokia','int_qty':5,'imei':['101','111','121','131','141'] ,'ack':0 ,'imei_avl':[],'imei_dmg':[],'avl_all':false,'dmg_all':false,'batch_all':false},
  //           {'batch_id':[],'int_transfer_details_id':5,'vchr_item_code': '8877887', 'vchr_name':'iphone5','int_qty':4,'imei':['161','171','181','191'] ,'ack':0 ,'imei_avl':[],'imei_dmg':[],'avl_all':false,'dmg_all':false,'batch_all':false},
  //           {'batch_id':[],'int_transfer_details_id':6,'vchr_item_code': '788888', 'vchr_name':'remdi note','int_qty':3,'imei':[] ,'ack':0 ,'imei_avl':[],'imei_dmg':[],'avl_all':false,'dmg_all':false,'batch_all':false},
  //           {'batch_id': ['B001'], 'int_transfer_details_id': 7, 'vchr_item_code': '365555', 'vchr_name': 'galaxy', 'int_qty': 1, 'imei': [], 'ack': 0, 'imei_avl': [], 'imei_dmg': [],'avl_all': false, 'dmg_all': false, 'batch_all': false}

  //          ]
  dct_imei = {}
  dct_batch = {}

  lst_imei = []
  lst_batch = []
  int_item_id;
  int_index;
  dct_current_item = {}
  popUp;

  ngOnInit() {
    
    this.blnSubmitAck = false;

    this.getListData();

    // this.source.map(item => {
    //           if (item['imei'].length > 0) {
    //             this.dct_imei[item['int_transfer_details_id']] = {}
    //             item['imei'].map(imei => {
    //               this.dct_imei[item['int_transfer_details_id']][imei] = { 'avl': false, 'dmg': false }
    //             })
    //           }
    //           if (item['batch_id'].length > 0) {
    //             this.dct_batch[item['int_transfer_details_id']] = {}
    //             item['batch_id'].map(ins_batch => {
    //               this.dct_batch[item['int_transfer_details_id']][ins_batch] = { 'batch': false ,'qty' : 0 }
    //             })
    //           }

    //           console.log('dct_batch', this.dct_batch);


    //         })
    
  }

  getListData(){
    // localStorage.setItem('int_transfer_id','')
    this.serviceObject.getData('branch_stock/list_stock_transfer/?int_transfer_id='+ this.intTransferId).subscribe(
      (response) => {
          if (response.status == 1) {

            let lst_data = response['data']
            
            this.source = []

            // lst_data.map(item=>{
            //   item['imei'] = item['jsn_imei']['imei']
            //   item['int_transfer_details_id'] = item['fk_item_id']
            //   item['vchr_item_code'] = item['fk_item_id__vchr_item_code']
            //   item['vchr_name'] = item['fk_item_id__vchr_name']
            //   item['ack'] = 0
            //   item['imei_avl'] = []
            //   item['imei_dmg'] = []
            //   item['avl_all'] = false
            //   item['dmg_all'] = false
            //   item['batch_all'] = false
            //   item['batch_id'] = item['jsn_batch_no']['batch']
            //   this.source.push(item)
            // })

            this.source = lst_data

            this.source.map(item => {
              if (item['imei'].length > 0) {
                this.dct_imei[item['int_transfer_details_id']] = {}
                item['imei'].map(imei => {
                  this.dct_imei[item['int_transfer_details_id']][imei] = { 'avl': false, 'dmg': false }
                })
              }
              if (item['batch_id'].length > 0) {
                this.dct_batch[item['int_transfer_details_id']] = {}
                item['batch_id'].map(ins_batch => {
                  this.dct_batch[item['int_transfer_details_id']][ins_batch] = { 'batch': false ,'qty' : item.int_qty, 'availQty': item.int_qty}
                })
               
                
              }

            })

          }  
          else if (response.status == 0) {
            swal.fire('Error!','error', 'error');
          }
      },
      (error) => {   
        swal.fire('Error!','error', 'error');
        
      });
  }
  
  
  cancel(){
  localStorage.setItem('previousUrl','stock/list_stock/');
    
    this.router.navigate(['stock/list_stock/']);
  
  }

  openfilteritem(filteritem, item,index) {
    
    this.int_item_id = item['int_transfer_details_id']
    this.dct_current_item = item
    this.int_index = index
    
    this.lst_imei = []
    this.lst_imei = item['imei']
    
    this.lst_batch = []
    this.lst_batch = item['batch_id']
    
    this.popUp = this.modalService.open(filteritem, { size: 'lg', windowClass: 'filteritemclass' });
  }


  // Set Check box values neither avalable or damaged 
  setImei(item,type){
    // type: 1)availabe ,0)Damaged
    if (type == 1){
      if (this.dct_imei[this.int_item_id][item]['avl']){
        this.dct_imei[this.int_item_id][item]['dmg'] = false 
      }



    }else{
      if (this.dct_imei[this.int_item_id][item]['dmg']) {
        this.dct_imei[this.int_item_id][item]['avl'] = false
      }
    }

   
    let aval_count = 0
    let damage_count = 0
    this.lst_imei.map(data => {
      if (this.dct_imei[this.int_item_id][data]['avl']){
        aval_count += 1
      }
      if (this.dct_imei[this.int_item_id][data]['dmg']){
        damage_count+=1
      }
    })
    if (this.lst_imei.length == aval_count){
      this.dct_current_item['avl_all'] = true
      this.dct_current_item['dmg_all'] = false
    }
    else if (this.lst_imei.length == damage_count){
      this.dct_current_item['dmg_all'] = true
      this.dct_current_item['avl_all'] = false
    }
    else{
      this.dct_current_item['dmg_all'] = false
      this.dct_current_item['avl_all'] = false
    }
  }

  itemAcknowledge(){


     //for imei check
     let blnImeiCheckAlert = false;

     
     this.lst_imei.forEach(element => {
       if(this.dct_imei[this.int_item_id][element]['avl'] == false){
         blnImeiCheckAlert = true;
         return false;
       }
     
     });
 
     if(blnImeiCheckAlert){
       Swal.fire('Some IMEIs are missing');
     }

    // Alert if batch is checked and quantity is null

    let batch_validation = true;
    let batchAllValidation = true;
    this.lst_batch.map(data => {
      if(!this.dct_batch[this.int_item_id][data]['batch']){
        batchAllValidation = false;
        return false;
      }
      if (this.dct_batch[this.int_item_id][data]['batch'] && (this.dct_batch[this.int_item_id][data]['qty'] == 0 || this.dct_batch[this.int_item_id][data]['qty'] == null || this.dct_batch[this.int_item_id][data]['availQty']<this.dct_batch[this.int_item_id][data]['qty'])){
        batch_validation = false;
      }
      
    })
    if(!batchAllValidation){
      Swal.fire('Error!', 'Some batch are still unchecked', 'error');
      this.source[this.int_index]['ack'] = 0
    }
    else{
      if (batch_validation ){
        console.log("i n",blnImeiCheckAlert,batch_validation);
        
        if(!blnImeiCheckAlert){
          this.source[this.int_index]['ack'] = 1
          this.popUp.close()
        }
      }
      else{
        Swal.fire('Error!', 'Enter Valid Quantity in Checked Batch', 'error');
      }
    }
   

   

  
    
  }

  OnBatchChange(item){
    // Set quantity 0 if batch is not selected 
    // if (!this.dct_batch[this.int_item_id][item]['batch']){
    //   this.dct_batch[this.int_item_id][item]['qty'] = 0
    // }

     let batch_count = 0
    this.lst_batch.map(data => {
      if (this.dct_batch[this.int_item_id][data]['batch']){
        batch_count += 1
      }
     
    })
    if (this.lst_batch.length == batch_count){
      this.dct_current_item['batch_all'] = true
    }
    else{
      this.dct_current_item['batch_all'] = false
    }
  }

  changeQuantity(item,i){
    if(this.dct_batch[this.int_item_id][item]['availQty']<this.dct_batch[this.int_item_id][item]['qty']){
      Swal.fire('Error!', 'Invalid Quantity', 'error');
      this.dct_batch[this.int_item_id][item]['qty']=0
    }
  }

  // To select All Check Fields ,  param(type):-   1)available  2)damaged  3)batch
  SetSelectAll(type){
    
    // if clicks available all button
    if (type == 1) {
      if (this.dct_current_item['avl_all']){
        this.source[this.int_index]['avl_all'] = true
        this.source[this.int_index]['dmg_all'] = false
        
        this.lst_imei.map(data=>{
          this.dct_imei[this.int_item_id][data]['avl'] = true
          this.dct_imei[this.int_item_id][data]['dmg'] = false
        })
      }
      else{
        this.source[this.int_index]['avl_all'] = false
        this.lst_imei.map(data => {
          this.dct_imei[this.int_item_id][data]['avl'] = false
        })
      }
    }
    // if clicks damage all button
    else if (type == 2) {
      if (this.dct_current_item['dmg_all']){
        this.source[this.int_index]['dmg_all'] = true
        this.source[this.int_index]['avl_all'] = false
        
        this.lst_imei.map(data=>{   
          this.dct_imei[this.int_item_id][data]['dmg'] = true
          this.dct_imei[this.int_item_id][data]['avl'] = false
        })
      }
      else{
        this.source[this.int_index]['dmg_all'] = false
        this.lst_imei.map(data => {
          this.dct_imei[this.int_item_id][data]['dmg'] = false
        })
      }
    }
    // if clicks batch all button
    else{
      if (this.dct_current_item['batch_all']) {
        this.source[this.int_index]['batch_all'] = true

        this.lst_batch.map(data => {
          this.dct_batch[this.int_item_id][data]['batch'] = true
        })
      }
      else {
        this.source[this.int_index]['batch_all'] = false
        this.lst_batch.map(data => {
          this.dct_batch[this.int_item_id][data]['batch'] = false
        })
      }
    }
  }

  SaveData(){
    let validation = true
    this.source.map(item => {
      if(item['ack'] == 0){
        validation = false
        Swal.fire('Error!', 'Acknowledge All Items', 'error');
        // Swal.fire('Error!', item['vchr_item_code']+' : '+item['vchr_name']+' Not Acknowledged', 'error');
        return false
      }

    })
    if (validation){
      this.blnSubmitAck =true;
      let dct_ack_item = {}
      dct_ack_item['lst_data'] = this.source
      dct_ack_item['dct_imei_data'] = this.dct_imei
      dct_ack_item['dct_batch_data'] = this.dct_batch
      dct_ack_item['int_transfer_id'] = this.intTransferId

      this.serviceObject.postData('branch_stock/add_branchstock/', dct_ack_item).subscribe(
        (response) => {
          if (response.status == 1) {
            swal.fire({
              position: "center",
              type: "success",
              text: "Acknowledged successfully",
              showConfirmButton: true,
            });
  localStorage.setItem('previousUrl','stock/list_stock/');
            
            this.router.navigate(['stock/list_stock/']);
          }
          else if (response.status == 0) {
            swal.fire('Error!', response['message'], 'error');
            this.blnSubmitAck = false;
          }
        },
        (error) => {
          this.blnSubmitAck = false;
          swal.fire('Error!', 'error', 'error');
  
        });
    }

  }

  backButton(){
  localStorage.setItem('previousUrl','stock/list_stock/');
    
    this.router.navigate(['stock/list_stock/']);
  }

  ngOnDestroy() {
   
    if(this.popUp){
      this.popUp.close();
      }
    }


}
