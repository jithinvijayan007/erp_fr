import { Component, OnInit ,HostListener} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { ServerService } from '../../server.service';
import 'rxjs/add/operator/debounceTime';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-stockrequest',
  templateUrl: './stockrequest.component.html',
  styleUrls: ['./stockrequest.component.css']
})
export class StockrequestComponent implements OnInit {

  strCurrBranch = 'Test branch';
  intBranchId: null;
  datOrder;
  datExpected: null;
  timExpected: null;
  lstBranch = [];
  strRemarks = '';
  selectedBranch = '';

  lstItems = [];
  lstItemsList = [];
  searchBranch: FormControl = new FormControl();

  strBrand = '';
  lstBrandList = [];
  selectedBrand ;
  intBrandId ;

  strProduct = '';
  lstProductList = [];
  selectedProduct ;
  intProductId ;
  selectedImei = '';
  strGroup = localStorage.getItem('group_name')

  intTotalQty = 0;

  blnSaveDisable = false;

  @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
    this.disableScroll(event);
  }

  @HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: any) {
    this.disableScroll(event);
  }

  @HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: any) {
    this.disableScroll(event);
  }


 

  // input = document.getElementById("txtQty");

 

  constructor(private serviceObject: ServerService,
    private toastr: ToastrService, public router: Router, ) { }

  ngOnInit() {
    this.blnSaveDisable = false;
    this.datOrder = new Date();
    const dctItem = {
      strItem: null,
      intId: null,
      intQty: null
    };
    this.lstItems.push(dctItem);
    this.searchBranch.valueChanges
      .debounceTime(400)
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

  

    
  }
  BranchChanged (item) {
    this.intBranchId = item.pk_bint_id;
  }
  // itemSearched(data, index) {
  //   // this.lstItemsList = [];

  //   if (data === null || data === '') {
  //   this.lstItemsList = [];
  //   this.lstItems[index]['intId'] = null;
  //   }
  // if (data !== null && data.length >= 1) {
  //   this.serviceObject.postData('purchase/item_typeahead/', {term: data}).subscribe(
  //     (response) => {
  //       this.lstItemsList = response['data'];
  //     },
  //     (error) => {
  //       Swal.fire('Error!', 'error', 'error');
  //     }
  //     );
  //   }




  // }

  itemSearched(data, index) {
    this.lstItemsList = [];
    if (data === null || data === '') {
      this.lstItemsList = [];
      this.lstItems[index]['intId'] = null;
      }
    // if(this.selectedProduct == ''){
    //   this.toastr.error('Select valid product');
    //   return false;
    // }
    if(this.lstItems[index]['product_name']){
     if(this.lstItems[index]['product_name'] != this.selectedProduct){
      this.toastr.error('Select valid product');
      return false;
    }
    }

    // else if(this.selectedBrand == ''){
    //   this.toastr.error('Select valid brand')
    //   return false;
    // }

    // if(this.lstItems[index]['brand_name']){
      // if(this.lstItems[index]['brand_name'] != this.selectedBrand){
      //   this.toastr.error('Select valid brand');
      //   return false;
      // }
     
    
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
  //     // this.lstItems[index]['intId'] = null;
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
      // this.lstItems[index]['intId'] = null;
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
  // brandSelected(item,index){
  //   this.selectedBrand = item.name;
  //   this.lstItems[index]['fk_brand_id'] = item.id;
  //   this.lstItems[index]['strItem'] = null,
  //   this.lstItems[index]['intId'] = null,
  //   this.lstItems[index]['intQty'] = null
  // }
  productSelected(item,index){
    this.selectedProduct = item.name;
    this.lstItems[index]['fk_product_id'] = item.id;
    this.lstItems[index]['strItem'] = null,
    this.lstItems[index]['intId'] = null,
    this.lstItems[index]['intQty'] = null
  }

  tableGrandTotalCalculation(itemAll){
    
    
    this.intTotalQty = 0;
    itemAll.forEach(element => {
      if(this.selectedBranch=='ANGAMALY') {
        if(element.intQty>1){
          this.toastr.error('Only one quantity can requested to Angamaly');
          element.intQty=null;
          return false;
        }
      } 
    this.intTotalQty += element.intQty;  // grand total calculation in the table footer
     
    });
  }


  addItem() {
    const length = this.lstItems.length
    // console.log(this.lstItems,"list");
    
    if(this.lstItems[length-1].intId == null){
      this.toastr.error('Enter item name of row ' + (length) )
      return false;
    }
    else if(this.lstItems[length-1].intQty == null){
      this.toastr.error('Enter quantity of row ' + (length) )
      return false;
    }
    else if(this.selectedBranch=='ANGAMALY') {   
      this.toastr.error('Only one item can requested to Angamaly');
      return false;
    } 
    else{
      this.lstItemsList = [];
      // if (!(this.lstItems.length === 1 && this.lstItems[0]['strItem'] === null)) {
        const dctItem = {
          strItem: null,
          intId: null,
          intQty: null
        };
        this.lstItems.push(dctItem);
      // }
    }

  }

  deleteItem(index) {
    this.lstItemsList = [];
    this.lstItems.splice(index, 1);
    if (this.lstItems.length === 0) {
    // } else {
      this.lstItems = [];
      const dctItem = {
        strItem: null,
        intId: null,
        intQty: null
      };
      this.lstItems.push(dctItem);
    }
   
    this.tableGrandTotalCalculation(this.lstItems); 

  }

  itemSelected(item, index,event) {
    // console.log( this.lstItems,event," this.lstItems");
    
    let addItemStatus = true
    if(this.lstItems.length>1){
      this.lstItems.forEach(element=>{
        if(element.intId==item.id ){
          addItemStatus = false;
        }
      })
    }
    if(addItemStatus){
          this.lstItems[index]['intId'] = item.id;
          // this.lstItems[index]['brand_name'] = item.brand_name;
          this.lstItems[index]['product_name'] = item.product_name;
          this.lstItems[index]['intBrand'] = item.brand_id;
          this.lstItems[index]['intProduct'] = item.product_id;
          this.selectedProduct= item.product_name;
          // this.selectedBrand= item.brand_name;
          
          this.lstItemsList = [];
    }
    else{
      this.toastr.error("Same item already exist")
      this.lstItems[index]['intId'] = null;
      this.lstItems[index]['strItem'] = null;
      // this.lstItems[index]['brand_name'] = null;
      this.lstItems[index]['product_name'] =null;
      // this.lstItems[index]['intBrand'] = null;
      this.lstItems[index]['intProduct'] =null;
      event.source.value=null
      this.selectedProduct= '';
      // this.selectedBrand= '';
      this.lstItemsList = [];
    }

  }
  saveData() {
    let date=new Date()
    let today= moment(date).format('YYYY-MM-DD');
    const datExpected = moment(this.datExpected).format('YYYY-MM-DD');
    
    // console.log(today,datExpected,today>datExpected,"today>this.datExpected");
    
    if (this.intBranchId == null) {
      this.toastr.error('Select Branch');
      return;
    } else if (this.datOrder == null) {
      this.toastr.error('Select order date');
      return;
    } else if (this.datExpected == null || today>datExpected ) {
      this.toastr.error('Invalid expected date');
      return;
    }
     
    else if (this.timExpected == null) {
      this.toastr.error('Select expected time');
      return;
    } else if (this.strRemarks === '') {
      this.toastr.error('Enter remarks');
      return;
    }
    //  else {
      // this.lstItems.forEach((element, index) => {
        for (let index = 0; index < this.lstItems.length; index++) {
          const element = this.lstItems[index];
          if (element.strItem == null || element.intId == null) {
            this.toastr.error('Enter item name of row ' + (index + 1) );
            return;
          } else if (element.intQty == null) {
            this.toastr.error('Enter item quantity of row ' + (index + 1) );
            return;
          }
        }
      // });
    // }

    const datOrder = moment(this.datOrder).format('YYYY-MM-DD');
    const dct_data = {
      'fk_branch_id' : this.intBranchId,
      'dat_request' : datOrder,
      'vchr_notes' : this.strRemarks,
      'lst_details' : this.lstItems,
      'dat_expected' : datExpected,
      'tim_expected' : this.timExpected
    };
    this.blnSaveDisable = true;
    this.serviceObject.postData('internalstock/addrequest/', dct_data).subscribe(
      (response) => {
        if (response.status === 1) {
          this.toastr.success('Stock request added successfully ');
          this.clearAll();
  localStorage.setItem('previousUrl','stockrequest/requestedlist');
          
          this.router.navigate(['stockrequest/requestedlist']);
        }
        else{
          this.blnSaveDisable = false;
        }
      },
      (error) => {
        this.blnSaveDisable = false;
        Swal.fire('Error!', 'error', 'error');
      }
      );
  }
  clearAll() {
    this.intBranchId = null;
    if (this.strGroup == 'ADMIN') {
      this.datOrder = null;
    }
    this.datExpected = null;
    this.timExpected = null;
    this.lstBranch = [];
    this.strRemarks = '';
    this.lstItems = [];
    this.lstItemsList = [];
    this.selectedBranch = '';
    const dctItem = {
      strItem: null,
      intId: null,
      intQty: null
    };
    this.lstItems.push(dctItem);

    this.tableGrandTotalCalculation(this.lstItems);
  }

  disableScroll(event: any) {
    if (event.srcElement.type === "number")
        event.preventDefault();
  }
}
