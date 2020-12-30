import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment' ;
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.css']
})
export class ItemlistComponent implements OnInit {
  source;
  data = [];

  searchProduct: FormControl = new FormControl();
  searchBrand: FormControl = new FormControl();
  searchItem: FormControl = new FormControl();
  searchCategory: FormControl = new FormControl();
  searchGroup: FormControl = new FormControl();

  lstProduct = []
  IntProductId;
  strProduct;
  selectedProduct;

  lstBrand = []
  IntBrandId;
  strBrand;
  selectedBrand;

  lstItem = []
  IntItemId;
  strItem;
  selectedItem;

  lstCategory = []
  IntCategoryId;
  strCategory;
  selectedCategory;

  lstGroup = []
  IntGroupId;
  strGroup;
  selectedGroup;

  datTo ;
  datFrom; 

  selectedFrom;
  selectedTo;

  lstPermission=JSON.parse(localStorage.group_permissions)
  lstCustom=[]
  dctDelete={}


  @ViewChild('productId', { static: true }) productId: any;
  @ViewChild('brandId', { static: true }) brandId: any;
  @ViewChild('itemId', { static: true }) itemId: any;
  @ViewChild('categoryId', { static: true }) categoryId: any;
  @ViewChild('groupId', { static: true }) groupId: any;
  constructor(
              private serviceObject: ServerService,
              public router: Router,
              private spinnerService: NgxSpinnerService,

              private toastr: ToastrService,
              ){
                  this.source = new LocalDataSource(this.data);
               }

               
  ngOnInit() { 
    let dct_perms= {'ADD':false,'VIEW':false,'EDIT':false,'DELETE':false}

    this.lstPermission.forEach(item=> {
      if (item["NAME"] == "List Item") {
        dct_perms.ADD = item["ADD"];
        dct_perms.EDIT= item["EDIT"];
        dct_perms.DELETE = item["DELETE"];
        dct_perms.VIEW = item["VIEW"]
      }
    });
    
    if(dct_perms.EDIT==true ){
      this.lstCustom= [
        { name: 'ourCustomAction', title: '<i class="ti-pencil text-info m-r-10"></i>' },
      ]
    }
    else{
      this.lstCustom= [
        // { name: 'ourCustomAction', title: '<i class="ti-pencil text-info m-r-10"></i>' },
       
      ]
    }

    if(dct_perms.DELETE==true){
      this.dctDelete= {
        confirmDelete: true,
        deleteButtonContent: '<i class="ti-trash text-danger m-r-10"></i>',
        saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
        cancelButtonContent: '<i class="ti-close text-danger"></i>',
        position: 'right'
      }
      this.settings.delete=this.dctDelete
    }
    else{
      this.settings.actions['delete']=false
    }
    
    this.settings.actions.custom = this.lstCustom
    let ToDate = new Date()
    let FromDate = new Date(ToDate.getFullYear(), ToDate.getMonth(), 1);
    this.datTo = ToDate
    this.datFrom = FromDate

    this.searchProduct.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstProduct = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('products/product_typeahead/', { term: strData })
              .subscribe(
                (response) => {
                  this.lstProduct = response['data'];

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
          this.lstBrand = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('brands/brands_typeahead/', { term: strData })
              .subscribe(
                (response) => {
                  this.lstBrand = response['data'];

                }
              );

          }
        }
      }
    ); 

    this.searchItem.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstItem = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('itemcategory/item_typeahead/', { term: strData })
              .subscribe(
                (response) => {
                  this.lstItem = response['data'];

                }
              );

          }
        }
      }
    );  
    
    this.searchCategory.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstCategory = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('itemcategory/item_category_typeahead/', { term: strData })
              .subscribe(
                (response) => {
                  this.lstCategory = response['data'];

                }
              );

          }
        }
      }
    );  

    this.searchGroup.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstGroup = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('itemgroup/item_group_typeahead/', { term: strData })
              .subscribe(
                (response) => {
                  this.lstGroup = response['data'];
                }
              );

          }
        }
      }
    );  

    this.getListData();
  }

  ProductChanged(item) {
    this.IntProductId = item.id;
    this.strProduct = item.name;
  }

  BrandChanged(item) {
    this.IntBrandId = item.id;
    this.strBrand = item.name;
  }

  ItemChanged(item) {
    this.IntItemId = item.id;
    this.strItem = item.code_name;
  }

  CategoryChanged(item) {
    this.IntCategoryId = item.id;
    this.strCategory = item.name;
  }

  GroupChanged(item) {
    this.IntGroupId = item.id;
    this.strGroup = item.name;
  }

  getListData(){
     
    let dctData = {}
    this.selectedFrom = moment(this.datFrom).format('YYYY-MM-DD')
    this.selectedTo = moment(this.datTo).format('YYYY-MM-DD')
    
    if (this.datFrom > this.datTo) {

      Swal.fire({
        position: "center",
        type: "error",
        text: "Please select correct date period",
        showConfirmButton: true,
      });
      return false;
    }

    if (this.selectedProduct != this.strProduct) {
      this.IntProductId = null
      this.strProduct = ''
      if (this.selectedProduct){
        this.toastr.error('Invalid Product', 'Error!');
        this.productId.nativeElement.focus();
        return false;
        // this.selectedProduct = ''
      }
    }
  // datFrom: NgbDateStruct;
    if (this.selectedBrand != this.strBrand) {
      this.IntBrandId = null
      this.strBrand = ''
      if (this.selectedBrand) {
        this.toastr.error('Invalid Brand', 'Error!');
        this.brandId.nativeElement.focus();
        return false;
        // this.selectedBrand = ''
      }
    } 
    if (this.selectedItem != this.strItem) {
      this.IntItemId = null
      this.strItem = ''
      if (this.selectedItem) {
        this.toastr.error('Invalid Item', 'Error!');
        this.itemId.nativeElement.focus();
        return false;
        // this.selectedBrand = ''
      }
      this.selectedItem = ''
    } 
    if (this.selectedCategory != this.strCategory) {
      this.IntCategoryId = null
      this.strCategory = ''
      if (this.selectedCategory) {
        this.toastr.error('Invalid Category', 'Error!');
        this.categoryId.nativeElement.focus();
        return false;
        // this.selectedCategory = ''
      }
    } 
    if (this.selectedGroup != this.strGroup) {
      this.IntGroupId = null
      this.strGroup = ''
      if (this.selectedGroup) {
        this.toastr.error('Invalid Group', 'Error!');
        this.groupId.nativeElement.focus();
        return false;
        // this.selectedGroup = ''
      }
    }

    dctData['datFrom'] = this.selectedFrom
    dctData['datTo'] = this.selectedTo
    dctData['IntProductId'] = this.IntProductId
    dctData['IntBrandId'] = this.IntBrandId
    dctData['IntItemId'] = this.IntItemId
    dctData['IntCategoryId'] = this.IntCategoryId
    dctData['IntGroupId'] = this.IntGroupId
    this.spinnerService.show();

    this.serviceObject.postData('itemcategory/list_item/', dctData).subscribe(
      (response) => {
        this.spinnerService.hide();

        if (response.status == 1) {
          this.data = response['data'];
          this.source = new LocalDataSource(this.data); // create the source
        }
        else if (response.status == 0) {
          Swal.fire('Error!', 'error', 'error');
        }
      },
      (error) => {
        this.spinnerService.hide();

        Swal.fire('Error!', 'error', 'error');

      });
  }

  settings = {
    hideSubHeader: true,  
    delete:this.dctDelete,
    
    actions: {
      add: false,
      edit: false,
      custom: this.lstCustom,
      position: 'right'
    },
    columns: {
      vchr_item_code: {
        title: 'Item Code ',
        filter: false
      },
      vchr_name: {
        title: 'Item Name ',
        filter: false
      },
      fk_product__vchr_name: {
        title: 'Product',
        filter: false
      },
      fk_brand__vchr_name: {
        title: 'Brand',
        filter: false
      },
      fk_item_category__vchr_item_category: {
        title: 'Item Category ',
        filter: false
      },
      fk_item_group__vchr_item_group: {
        title: 'Item group',
        filter: false
      },
      dbl_supplier_cost: {
        title: 'Supplier Cost',
         filter: false,
         type:'html',
         valuePrepareFunction: function(value){
          return '<div class="text-right"> ' + value + ' </div>'
         }
      },
      dbl_dealer_cost: {
        title: 'Dealer Cost',
         filter: false,
         type:'html',
         valuePrepareFunction: function(value){
          return '<div class="text-right"> ' + value + ' </div>'
         }
      },
      dbl_mop: {
        title: 'MOP',
        filter: false,
        type:'html',
        valuePrepareFunction: function(value){
         return '<div class="text-right"> ' + value + ' </div>'
        }
      },
      dbl_mrp: {
        title: 'MRP',
        filter: false,
        type:'html',
         valuePrepareFunction: function(value){
          return '<div class="text-right"> ' + value + ' </div>'
         }
      },
    },
  };

  

  onDeleteConfirm(event) {
    let dctData = {}
    dctData['pk_bint_id'] = event.data['pk_bint_id']

    Swal.fire({
      title: 'Delete',
      text: "Are you sure want to delete ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes, Delete it!",
    }).then(result => {
      if (result.value) {
        this.serviceObject.patchData('itemcategory/add_item/', dctData).subscribe(
          (response) => {
            if (response.status == 1) {

              Swal.fire({
                position: "center",
                type: "success",
                text: "Data Deleted successfully",
                showConfirmButton: true,
              });
              this.getListData();
            }
            else if (response.status == 0) {
              Swal.fire('Error!', 'error', 'error');
            }
          },
          (error) => {
            Swal.fire('Error!', 'error', 'error');
          });
      };

    });
  }

  onEdit(event) {
    
    localStorage.setItem('itemId', event.data.pk_bint_id);
    localStorage.setItem('previousUrl','item/additem');
    
    this.router.navigate(['item/additem/']);
  }
}
