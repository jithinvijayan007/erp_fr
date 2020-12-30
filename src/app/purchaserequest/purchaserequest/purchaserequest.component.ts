import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import * as moment from 'moment' ;

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-purchaserequest',
  templateUrl: './purchaserequest.component.html',
  styleUrls: ['./purchaserequest.component.css']
})
export class PurchaserequestComponent implements OnInit {

  constructor(private serviceObject: ServerService,
    private toastr: ToastrService,
    private modalService: NgbModal
    ) { 
      // this.source = new LocalDataSource(this.data);
    }


  datTo                                  
  datFrom


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

  searchProduct: FormControl = new FormControl();
  searchBrand: FormControl = new FormControl();
  blnAll=false
  lstDetails=[]
  datExp;
  lstSuppliers = [];
  selectedSupplier;
  intSupplier;
  strSupplier;
  searchSupplier=new FormControl();
  supplierState=null;

  ngOnInit() {

    this.datFrom = new Date()
    this.datTo = new Date();
    this.getData();
    this.searchProduct.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lst_product = [];
      } else {
        if (strData.length >= 3) {
          this.serviceObject
            .postData('products/product_typeahead/', { term: strData })
            .subscribe(
              (response) => {
                this.lst_product = response['data'];
  
              }
            );
        }
      }
    }
  ); 
    
  this.searchSupplier.valueChanges
  .debounceTime(400)
  .subscribe((strData: string) => {
    if (strData === undefined || strData === null) {
      this.lstSuppliers = [];
    } else {
      if (strData.length >= 3) {
        this.serviceObject
          .postData('internalstock/suppliertypeahead/', { term: strData })
          .subscribe(
            (response) => {
              this.lstSuppliers = response['supplier_list'];
  
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
      this.lst_brand = [];
    } else {
      if (strData.length >= 3) {
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

  productChanged(item){
    this.intProductId = item.id;
    this.strProduct = item.name;
     
  }

  brandChanged(item){
    this.intBrandId = item.id;
    this.strBrand = item.name;

  }
  supplierChanged(item){
    this.intSupplier = item.pk_bint_id;
    this.strSupplier = item.vchr_name;

  }
  SetSelectAll(){
    if(this.blnAll){
      this.lstDetails.forEach(item=>{
        item.bln_true=true
        item.bln_check=true
      })
    }
    else{
      this.lstDetails.forEach(item=>{
        item.bln_true=false;
        item.bln_check=false}
      )
    }
    
  }

  setAll(item,i){

    if(this.lstDetails[i].bln_true){
      this.lstDetails[i].bln_check=true
    }
    else{
      this.lstDetails[i].bln_check=false
      
    }

    let blnCheck=true
    this.lstDetails.forEach(element=>{
      if(element.bln_true==false){
        blnCheck=false
      }
    })

    this.blnAll=blnCheck
  }
  getData(){

    if (this.datFrom > this.datTo){
      Swal.fire({
        position: "center",
        type: "error",
        text: "Please select correct date period",
        showConfirmButton: true,
      });
      return
    }
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

    let selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
    let selectedTo = moment(this.datTo).format('YYYY-MM-DD')
    
    let dctData={}
    dctData['productId']=this.intProductId
    dctData['brandId']=this.intBrandId
    dctData['datFrom']=selectedFrom
    dctData['datTo']=selectedTo
 
    
    this.serviceObject.postData('internalstock/purchase_request_list/', dctData).subscribe(
      (response) => {
        if (response.status == 1) {
          this.lstDetails = response['lst_data'];
          // this.setAll()
          let blnCheck=true
          this.lstDetails.forEach(element=>{
            if(element.bln_true==false){
              blnCheck=false
            }
          })
      
          this.blnAll=blnCheck
          // this.source = new LocalDataSource(this.data); // create the source
        }
        else if (response.status == 0) {
          Swal.fire('Error!', 'error', 'error');
        }
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');

      });
  }
  saveData(){

    console.log(this.lstDetails,"det");
    let curDate=new Date()
    if(this.datExp){ 
     if (this.datExp < curDate){
      Swal.fire({
        position: "center",
        type: "error",
        text: "Expected date must be today or upcoming dates",
        showConfirmButton: true,
      });
      return
    }
    }
    let selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
    let selectedTo = moment(this.datTo).format('YYYY-MM-DD')
    let dctData={}
    dctData['lstDetails']=this.lstDetails
    dctData['intVendor']=this.intSupplier
    dctData['datFrom']=selectedFrom
    if(this.datExp){

      dctData['datExpected']= moment(this.datExp).format('YYYY-MM-DD')
    }
    dctData['datTo']=selectedTo
 
    this.serviceObject.putData('internalstock/purchase_request_list/', dctData).subscribe(
      (response) => {
        if (response.status == 1) {
          Swal.fire('Success!', 'success', 'success');
          this.lstDetails=[]
          this.datExp=''
          this.datFrom=''
          this.datTo=''
          this.intProductId =null
          this.strProduct =''
          this.intBrandId =null
          this.strBrand =''
          this.intSupplier =null;
          this.strSupplier = '';
         
          // this.source = new LocalDataSource(this.data); // create the source
        }
        else if (response.status == 0) {
          Swal.fire('Error!', 'error', 'error');
        }
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');

      });
  }

}
