import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-nonsalable',
  templateUrl: './nonsalable.component.html',
  styleUrls: ['./nonsalable.component.css']
})
export class NonsalableComponent implements OnInit {

  searchItem: FormControl = new FormControl();
  searchProduct: FormControl = new FormControl();
  searchBrand: FormControl = new FormControl();
  searchBranch: FormControl = new FormControl();


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

  lstItem = []
  IntItemId;
  strItem='';
  selectedItem;
  strImei:''
 
  lstBranch=[];
  selectedBranch ='';
  intBranchId;
  strBranch= '' ;

  strRemarks = '';

  // lstSaleable = [
  //   {'imei':'Get to work','blnSaleable':true},
  //   {'imei':'Pick up groceries','blnSaleable':true},
  //   {'imei':'Go home','blnSaleable':true},
  //   {'imei':'Fall asleep','blnSaleable':true}
  // ];
  // lstNonSaleable = [
  //   {'imei':'Get to work','blnSaleable':false},
  //   {'imei':'Pick up groceries','blnSaleable':false},
  //   {'imei':'Go home','blnSaleable':false},
  //   {'imei':'Fall asleep','blnSaleable':false}
  // ];
  lstSaleable = []
  lstNonSaleable = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];
  blnShowImeis=false;
  strGroupname =''
  drop(event: CdkDragDrop<string[]>) {
    console.log(event,"event");
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
  @ViewChild('branchId') branchId: any;
  @ViewChild('itemId', { static: true }) itemId: any;

  constructor(private serviceObject: ServerService,
              private toastr: ToastrService,
              private modalService: NgbModal
              ) { 
                // this.source = new LocalDataSource(this.data);
              }

  ngOnInit() {

    this.strGroupname = localStorage.getItem("group_name")
    this.searchItem.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstItem = [];
        } else {
          if (strData.length >= 1) {
            let dctData={}
            if(this.intProductId){
              dctData['intProductId']=this.intProductId
              dctData['term']=strData
              
            }
            if(this.intBrandId){
              dctData['intBrandId']=this.intBrandId
              
            }
            this.serviceObject
              .postData('itemcategory/item_typeahead/',dctData)
              .subscribe(
                (response) => {
                  this.lstItem = response['data'];

                }
              );

          }
        }
      }
      ); 

      this.searchBranch.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstBranch = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('branch/branch_typeahead/',{term:strData})
              .subscribe(
                (response) => {
                  this.lstBranch = response['data'];
                }
              );

          }
        }
      }
      );


  this.searchProduct.valueChanges
  .debounceTime(400)
  .subscribe((strData: string) => {
    if (strData === undefined || strData === null) {
      this.lst_product = [];
    } else {
      if (strData.length >= 2) {
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
  
this.searchBrand.valueChanges
.debounceTime(400)
.subscribe((strData: string) => {
  if (strData === undefined || strData === null) {
    this.lst_brand = [];
  } else {
    if (strData.length >= 2) {
      let dctData={}
      if(this.intProductId){
        dctData['intProductId']=this.intProductId
        dctData['term']=strData
        
      }
      this.serviceObject
        .postData('brands/brands_typeahead/',dctData)
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



  ItemChanged(item) {
    this.IntItemId = item.id;
    this.strItem = item.code_name;
  }

  productChanged(item){
    this.intProductId = item.id;
    this.strProduct = item.name;
     
  }

  brandChanged(item){
    this.intBrandId = item.id;
    this.strBrand = item.name;

  }


  BranchChanged(item){
    this.intBranchId = item.id;
    this.strBranch = item.name;
    this.selectedBranch== item.name;
  }
  getListData() {

      if(this.strProduct == '' || this.strProduct != this.selectedProduct){
        this.toastr.error('Invalid Product', 'Error!');
        return;
      }

      if(this.strBrand == '' || this.strBrand != this.selectedBrand){
        this.toastr.error('Invalid Brand', 'Error!');
        return;
      }

      if(this.strItem == '' || this.strItem != this.selectedItem){
        this.toastr.error('Invalid Item', 'Error!');
        return;
      }

      if(this.strGroupname=='ADMIN'){
        if(this.selectedBranch == '' || this.selectedBranch != this.strBranch){
          this.toastr.error('Select Valid branch', 'Error!');
          return ;
        }
      }
   


    let dctData = {}
    dctData['intItemId'] = this.IntItemId
    if(this.selectedBrand){
      dctData['IntBrandId'] = this.intBrandId
    }
    if(this.selectedProduct){
      dctData['IntProductId'] = this.intProductId
    }
    dctData['strImei'] = this.strImei

    if(this.strGroupname=='ADMIN'){
      dctData['intBranchId'] = this.intBranchId

    }


    this.serviceObject.postData('branch_stock/non_saleable/', dctData).subscribe(
      (response) => {
        if (response.status == 1) {
          this.lstSaleable=response['dct_data']['lst_saleable']
          this.lstNonSaleable=response['dct_data']['lst_non_saleable']
          if(this.lstSaleable.length>0 || this.lstNonSaleable.length>0){
            this.blnShowImeis=true
          }
          else{
          Swal.fire('Warning!', 'No Stock Available', 'warning');
          this.blnShowImeis=false
            
          }

        }
        else if (response.status == 0) {
          Swal.fire('Error!', 'error', 'error');
        }
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');

      });

  }
  ok(){
    if (this.strRemarks == '') {
      this.toastr.error('Enter remarks');
      return;
    }
    let dctData={}
    dctData['lst_saleable']=this.lstSaleable
    dctData['lst_non_saleable']=this.lstNonSaleable
    dctData['intItemId']=this.IntItemId
    dctData['intBranchId']=this.intBranchId
    dctData['strRemarks']=this.strRemarks
    dctData['blnSave']=true
    
    

    this.serviceObject.postData('branch_stock/non_saleable/', dctData).subscribe(
      (response) => {
        if (response.status == 1) {
          Swal.fire('Success!', 'Successfully Saved', 'success');
          this.lstSaleable=[]
          this.lstNonSaleable=[]
          this.lstSaleable=response['dct_data']['lst_saleable']
          this.lstNonSaleable=response['dct_data']['lst_non_saleable']
          this.strImei=''
          this.blnShowImeis=true
          this.strRemarks = '';

        }
        else if (response.status == 0) {
          Swal.fire('Error!', 'error', 'error');
        }
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');

      });
    
  }
  clearFields(){
    this.intBranchId=null;
    this.strBranch = '';
    this.selectedBranch = '';
    this.lstNonSaleable=[]
    this.lstSaleable=[]

    this.strProduct='';
    this.selectedProduct = '';
    this.intProductId=null;
    
    this.strBrand='';
    this.intBrandId=null;
    this.selectedBrand='';

    this.IntItemId=null;
    this.strItem='';
    this.selectedItem='';
    this.strImei=''
    this.strRemarks = '';
    this.blnShowImeis=false

  }
}
