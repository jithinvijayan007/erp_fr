
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';


import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
// import { locateHostElement } from '@angular/core/src/render3/instructions';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})
export class AdditemComponent implements OnInit {

  searchProduct: FormControl = new FormControl();
  searchBrand: FormControl = new FormControl();
  searchItemGroup: FormControl = new FormControl();

  bln_sale = "True"
  bln_imei = "True"

  lstProduct = []
  IntProductId;
  strProduct;
  selectedProduct
  intSales;

  lstBrand = []
  IntBrandId;
  strBrand;
  selectedBrand;

  lstGroup = []
  IntGroupId
  strGroup
  selectedGroup

  lstCategory = []
  lstSpec = []
  specList =[]

  IntCategoryId
  strCategory

  strPrefix
  strCode
  strItem


  intSupplierCost=null
  intDealerCost=null
  mop=null
  mrp=null
  intReorderlevel
  check;

  blnEdit =false
  intItemId = localStorage.getItem('itemId')

  pk_bint_id = 0;

  form: FormGroup;
  message

  image1
  image2
  image3

  public imagePath1;
  imgURL1: any;
  public imagePath2;
  imgURL2: any;
  public imagePath3;
  imgURL3: any;

  spec: any;

  dctSpec:any;

  lst_data = {}

  hostaddress;
  vchr_image;

  @ViewChild('productId', { static: true }) productId: any;
  @ViewChild('brandId', { static: true }) brandId: any;
  @ViewChild('prefixId', { static: true }) prefixId: any;
  @ViewChild('codeId', { static: true }) codeId: any;
  @ViewChild('itemId', { static: true }) itemId: any;
  @ViewChild('categoryId', { static: true }) categoryId: any;
  @ViewChild('groupId', { static: true }) groupId: any;
  @ViewChild('suppliercostId', { static: true }) suppliercostId: any;
  @ViewChild('dealercostId', { static: true }) dealercostId: any;
  @ViewChild('mopId', { static: true }) mopId: any;
  @ViewChild('mrpId', { static: true }) mrpId: any;
  @ViewChild('reorderId', { static: true }) reorderId: any;
  @ViewChild('specId') specId: any;

  @ViewChild('file1', { static: true }) file1: any;
  // @ViewChild('file2') file2: any;
  // @ViewChild('file3') file3: any;


  constructor(private serviceObject: ServerService,
              private toastr: ToastrService,
              private formBuilder: FormBuilder,
              public router: Router
             ) { }

  ngOnInit() {

    this.hostaddress = this.serviceObject.hostAddress
    this.hostaddress = this.hostaddress.slice(0, this.hostaddress.length - 1)

    this.getData()

    if (this.intItemId) {
      this.blnEdit = true;
      this.getDataById();
    }

    this.form = this.formBuilder.group({
          img1: [''],
          img2: [''],
          img3: [''],
    });

    this.searchProduct.valueChanges.pipe(
      debounceTime(400))
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstProduct = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('products/product_typeahead/',{term:strData})
              .subscribe(
                (response) => {
                  this.lstProduct = response['data'];
                }
              );

          }
        }
      }
      );

    this.searchBrand.valueChanges.pipe(
      debounceTime(400))
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

    this.searchItemGroup.valueChanges.pipe(
      debounceTime(400))
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

  }

  ProductChanged(item) {

    this.IntProductId = item.id;
    this.strProduct = item.name;
    this.intSales = item.int_sales;
  }

  BrandChanged(item) {

    this.IntBrandId = item.id;
    this.strBrand = item.name;
  }


  CategoryChanged(item){
    this.IntCategoryId = item.pk_bint_id;
    this.getspec()
  }
  getspec(){
     this.serviceObject
      .postData('itemcategory/get_itemspec/', { 'int_category': this.IntCategoryId})
      .subscribe(
        (response) => {
          this.lstSpec = response['specification'];
          this.dctSpec = {}
          this.lstSpec.map(item=>{
            this.dctSpec[item.pk_bint_id] = ''
          })

          if (this.intItemId){
            this.dctSpec = {}
            this.lstSpec.map(item => {
              this.dctSpec[item.pk_bint_id] = this.lst_data['json_specification_id'][item.pk_bint_id]
            })
          }
        }
      );
  }

  GroupChanged(item){
    this.IntGroupId = item.id;
    this.strGroup = item.name;
  }

  getData(){

    this.serviceObject
      .getData('itemcategory/get_itemspec/')
      .subscribe(
        (response) => {
          this.lstCategory = response['item_category'];
          this.lstGroup = response['item_group'];
          this.lstSpec = response['specification'];
        }
      );
  }
  AddItem(){
    let validation = true
    if (this.selectedProduct != this.strProduct || !this.selectedProduct){
      
      this.productId.nativeElement.focus();
      this.toastr.error('Product is required', 'Error!');
      this.IntProductId = null
      this.strProduct = ''
      return false;
    } else if (this.selectedBrand != this.strBrand || !this.selectedBrand) {
      this.brandId.nativeElement.focus();
      this.IntBrandId = null
      this.strBrand = ''
      this.toastr.error('Brand is required', 'Error!');
      return false;
    } else if (!this.strCode) {
      this.codeId.nativeElement.focus();
      this.toastr.error('Item Code is required', 'Error!');
      return false;
    } else if (!this.strItem) {
      this.itemId.nativeElement.focus();
      this.toastr.error('Item Name is required', 'Error!');
      return false;
    } else if (!this.IntCategoryId) {
      this.toastr.error('Category is required', 'Error!');
      return false;
    } else if (this.selectedGroup != this.strGroup || !this.selectedGroup) {
      this.toastr.error('Group is required', 'Error!');
      return false;
    }
    else if(this.intSales == 1 || this.intSales == 0)   
        {
          validation = false
          if (!this.intSupplierCost) {
            this.suppliercostId.nativeElement.focus();
            this.toastr.error('Supplier Cost is required', 'Error!');
            return false;
          } else if (!this.intDealerCost) {
            this.dealercostId.nativeElement.focus();
            this.toastr.error('Dealer Cost is required', 'Error!');
            return false;
          } else if (!this.mop) {
            this.mopId.nativeElement.focus();
            this.toastr.error('MOP is required', 'Error!');
            return false;

          } else if (!this.mrp) {
            this.mrpId.nativeElement.focus();
            this.toastr.error('MRP is required', 'Error!');
            return false;
        } 
        else{
          validation = true
        }
    }
    if (!validation){
      // console.log('hgfgyhjfghj');
      return false
      
    }
    
    else if (!this.intReorderlevel) {
      this.reorderId.nativeElement.focus();
      this.toastr.error('Reorder Level is required', 'Error!');
      return false;
    // } else if (!Object.keys(this.dctSpec)) {
    //   this.toastr.error('Specifications required', 'Error!');
    //   return false;
    }
    // else if (!this.form.get('img1').value && !this.blnEdit) {
    //   this.toastr.error('Image required', 'Error!'); commented for o2force
    //   return false;
    // }
    else {

      let bln_validation = false
      Object.keys(this.dctSpec).map(item=>{
        if (!this.dctSpec[item]){
          bln_validation = true
        }
      })

      if (bln_validation) {
        this.toastr.error('All Specifications required', 'Error!');
        return false;
      }


      const form_data = new FormData;

      let dctData = {}
      dctData['bln_sales'] = true
      if (this.bln_sale == 'False'){
        dctData['bln_sales'] = false
      }
      dctData['imei_status'] = true
      if (this.bln_imei == 'False'){
        dctData['imei_status'] = false
      }

      form_data.append('pk_bint_id', String(this.pk_bint_id))
      form_data.append('product_id', this.IntProductId)
      form_data.append('brand_id', this.IntBrandId)
      form_data.append('vchr_prefix', this.strPrefix)
      form_data.append('vchr_item_code', this.strCode)
      form_data.append('vchr_item_name', this.strItem)
      form_data.append('item_category_id', this.IntCategoryId)
      form_data.append('item_group_id',this.IntGroupId)
     
      if (this.intSupplierCost){form_data.append('dbl_supplier_cost', this.intSupplierCost)}
      if (this.intDealerCost){form_data.append('dbl_dealer_cost', this.intDealerCost)}
      if (this.mop){form_data.append('dbl_mop', this.mop)}
      if (this.mrp){form_data.append('dbl_mrp', this.mrp)}
      
      form_data.append('int_reorder_level', this.intReorderlevel)
      form_data.append('int_specification_id', JSON.stringify(this.dctSpec))
      form_data.append('bln_sales', this.bln_sale)
      form_data.append('imei_status', this.bln_imei)
      form_data.append('image1', this.form.get('img1').value)
      // form_data.append('image2', this.form.get('img2').value)
      // form_data.append('image3', this.form.get('img3').value)



      this.serviceObject
        .addCompany('itemcategory/add_item/', form_data)
        .subscribe(
        (response) => {
          if (response.status == 1) {
            Swal.fire({
              position: "center",
              type: "success",
              text: "Data saved successfully",
              showConfirmButton: true,
            });
    localStorage.setItem('previousUrl','item/itemlist/');
            
            this.router.navigate(['item/itemlist/'])
          }
          else if (response.status == 0) {
            Swal.fire('Error!', response['reason'], 'error');
          }
        },
        (error) => {
          Swal.fire('Error!','Something went wrong!!', 'error');


        }
      );

    }
  }

  ClearData(){


    Swal.fire({
      title: 'Cancel',
      text: "Are you sure want to Cancel ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes, Cancel it!",
    }).then(result => {
      if (result.value) {

        this.IntProductId = null
        this.IntBrandId = null
        this.strPrefix = null
        this.strCode = null
        this.strItem = null
        this.IntCategoryId = null
        this.IntGroupId = null
        this.intSupplierCost = null
        this.intDealerCost = null
        this.mop = null
        this.mrp = null
        this.intReorderlevel = null
        this.strProduct = null
        this.strBrand = null
        this.strCategory = null
        this.strGroup = null
        this.selectedProduct = null
        this.selectedBrand = null
        this.selectedGroup = null
        this.imagePath1 = null
        this.imgURL1 = null
        this.lstSpec = []
        this.file1.nativeElement.value = null
      };

    });




  }

  getDataById(){
    localStorage.setItem('itemId','');
    this.serviceObject.getData('itemcategory/add_item/?pk_bint_id=' + this.intItemId).subscribe(
      (response) => {
        if (response.status == 1) {
          this.lst_data = response['data']

          this.IntProductId = this.lst_data['fk_product_id']
          this.IntBrandId = this.lst_data['fk_brand_id']
          this.strPrefix = this.lst_data['vchr_prefix']
          this.strCode = this.lst_data['vchr_item_code']
          this.strItem = this.lst_data['vchr_name']
          this.IntCategoryId = this.lst_data['fk_item_category_id']
          this.IntGroupId = this.lst_data['fk_item_group_id']
          this.intSupplierCost = this.lst_data['dbl_supplier_cost']
          this.intDealerCost = this.lst_data['dbl_dealer_cost']
          this.mop = this.lst_data['dbl_mop']
          this.mrp = this.lst_data['dbl_mrp']
          this.intReorderlevel = this.lst_data['int_reorder_level']
          this.strProduct = this.lst_data['fk_product__vchr_name']
          this.strBrand = this.lst_data['fk_brand__vchr_name']
          this.strCategory = this.lst_data['fk_item_category__vchr_item_category']
          this.strGroup = this.lst_data['fk_item_group__vchr_item_group']
          this.selectedProduct = this.lst_data['fk_product__vchr_name']
          this.selectedBrand = this.lst_data['fk_brand__vchr_name']
          this.selectedGroup = this.lst_data['fk_item_group__vchr_item_group']
          this.specList = this.lst_data['spec_name']
          this.pk_bint_id = this.lst_data['pk_bint_id']
          this.dctSpec = this.lst_data['json_specification_id']
          this.vchr_image = this.lst_data['image1']
          if (this.lst_data['sale_status'] == false) {
            this.bln_sale= 'False'
          }
          this.bln_imei = this.lst_data['imei_status'];
          // if (this.lst_data['imei_status'] == false) {
          //   this.bln_imei = 'False'
          // }
          this.getspec()
        }
        else if (response.status == 0) {
          Swal.fire('Error!', 'error', 'error');
        }
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');

      });
  }
  CancelUpdate(){
    localStorage.setItem('previousUrl','item/itemlist/');
    
    this.router.navigate(['item/itemlist/'])

  }


  Preview1(files, event) {
    if (files.length === 0)
      return;
    this.image1 = files
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    const img_files = event.target.files;
    const file = img_files[0];
    this.image1 = file;

    if (this.image1) {

      const img_up = new Image;
      let img_ratio_up = 0;
      img_up.onload = () => {
        const width_up = img_up.width;
        const height_up = img_up.height;

        img_ratio_up = width_up / height_up;
        img_ratio_up = Math.floor(img_ratio_up * 10) / 10;

        if (img_ratio_up >= 1 && img_ratio_up <= 10) {

          // for preview
          var reader = new FileReader();
          this.imagePath1 = files;
          reader.readAsDataURL(files[0]);
          reader.onload = () => {
            this.imgURL1 = reader.result;
          }
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.image1 = file
            this.form.get('img1').setValue(file);
          }

        } else {
          $('.error1').fadeIn(400).delay(3000).fadeOut(400);
          this.file1.nativeElement.value = null;
          Swal.fire("Error", 'Print Logo ratio must be 4:1', "error");
          this.file1.nativeElement.value = "";
          this.imgURL1 = null
          this.form.get('img1').setValue('')
        }
      };
      img_up.src = window.URL.createObjectURL(this.image1);
      // return status
    }

  }

}
