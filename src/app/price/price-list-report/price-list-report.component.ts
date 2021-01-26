
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import * as moment from 'moment' ;
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl } from '@angular/forms';
import { HttpClient,HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-price-list-report',
  templateUrl: './price-list-report.component.html',
  styleUrls: ['./price-list-report.component.css']
})
export class PriceListReportComponent implements OnInit {
  source: LocalDataSource;
  data ;
  StrParams ;
  page =5 ;
  params = new HttpParams();
  totalPage ;
  
  searchProduct: FormControl = new FormControl();
  searchBrand: FormControl = new FormControl();
  searchItem:FormControl = new FormControl();
  strProduct='';
  selectedProduct = '';
  intProductId;
  blnProduct=false;
  lst_product = [];
  blnShowData = false;

  blnBrand=false;
  lst_brand = [];
  strBrand='';
  intBrandId;
  selectedBrand='';


  lstItem = []
  IntItemId;
  strItem;
  selectedItem;
  constructor(
    private serverService: ServerService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,

    public router: Router,
  ) { 
    // this.source = new LocalDataSource(this.data); // create the source
  }

  settings = {
    hideSubHeader: false,    
    // delete:this.dctDelete, 
    pager: { display: false },
    actions: {
      add: false,
      edit:false,
      delete:false,
     
      },
   
    columns: {

      fk_item__fk_product__vchr_name: {
        title: 'Product',
        filter:true,
        editable: false,
        
       
      },

      fk_item__fk_brand__vchr_name: {
        title: 'Brand',
        filter:true,
        editable: false,
       
      },

      vchr_item_name: {
        title: 'Item',
        filter:true,
        editable: false,
       
      },
      str_formatted_date: {
        title: 'Date Effective From',
        filter:true
      },
      
      // dbl_supp_amnt: {
      //   title: 'Supplier Amount',
      //   filter:false
      // },
      dbl_cost_amnt: {
        title: 'Cost Price',
        filter:true,
        width: '10%',
        attr:{
          class: 'alignCenter'
        }
        
      },
      dbl_dealer_amt: {
        title: 'Dealer Amount',
        filter:true
      },
      dbl_mop: {
        title: 'MOP',
        filter:true,
        width: 10
      },
      dbl_my_amt: {
        title: 'myG Price',
        filter:true
      },
      dbl_mrp: {
        title: 'MRP',
        filter:true
      },
      
     
     
     
     
     
    },
 
  }
  

  
  searchData(page){
    
    let searchParams = new HttpParams()

    // if (this.selectedProduct!==null){
    let blnSearch= true

    // }
    if ((this.selectedProduct!=this.strProduct) && this.selectedProduct){
      this.toastr.error('Please select correct product', 'Error!')
      blnSearch =false

    }

    if ((this.selectedBrand!=this.strBrand) && this.selectedBrand){
      this.toastr.error('Please select correct Brand', 'Error!')
      blnSearch =false

    }



    if (page){
      searchParams = searchParams.set('page', page.toString());
    }
    if (this.intProductId){
      searchParams = searchParams.set('pd_id', this.intProductId);
    }
    if (this.intBrandId){
      searchParams = searchParams.set('bd_id', this.intBrandId);
    }
    if (this.IntItemId){
      searchParams = searchParams.set('it_id', this.IntItemId);
    }
    if (blnSearch ==true){
    this.serverService.getDataWithParam('pricelist/pricelistdata/',searchParams).subscribe(
      (response) => {
        // console.log(response)
        this.spinnerService.hide();

          // if (response.status == 1) {
            
           this.data=response['results'];
           
           if( this.data.length>0){
            this.source = this.data;
            this.totalPage = response['total_pages']
            this.blnShowData = true

           }
           else{
            this.blnShowData = false
            this.source = null
            this.totalPage = null
           }

          //  }
}
    )
  
  }
  }

    exportData(){
      let dct_data = {}
      dct_data['IntBrandId'] = this.intBrandId
      dct_data['IntProductId'] = this.intProductId
      this.spinnerService.show()
      this.serverService.postData('pricelist/pricelistdata/',dct_data).subscribe(
        (response) => {
          this.spinnerService.hide()
          if (response['status'] ==1){
            

      var a = document.createElement('a');
              document.body.appendChild(a);
              a.href = response['export'];
              a.download = response['str_file_name'];
              a.click();
              // window.URL.revokeObjectURL(this.dctReportData);
              a.remove();
              this.toastr.success('Successfully Exported', 'Success!')

        }
        else {
          this.toastr.error('No Data', 'Error!')



        }
      
      
      }

        
        
        )




    }
    





    

  ngOnInit() {
    this.searchProduct.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (this.strProduct != strData){
        this.intProductId = null
      }
      if (strData === undefined || strData === null) {
        this.lst_product = [];
      } else {
        if (strData.length >= 2) {
          this.serverService
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
    
  this.searchBrand.valueChanges.pipe(
  debounceTime(400))
  .subscribe((strData: string) => {

    if (this.strBrand != strData){
      this.intBrandId = null
    }
    
    if (strData === undefined || strData === null) {
      this.lst_brand = [];
    } else {
      if (strData.length >= 2) {
        let dctData={}
        
          dctData['intProductId']=this.intProductId
          dctData['term']=strData
          
        this.serverService
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

  this.searchItem.valueChanges.pipe(
      debounceTime(400))
      .subscribe((strData: string) => {

        
        // if(this.strProduct == ''){
        //   this.toastr.error('Select Product', 'Error!');
        //   return;
        // }
        if(this.strProduct != this.selectedProduct){
          this.toastr.error('Invalid Product', 'Error!');
          return;
        }
        // else if(this.strBrand == ''){
        //   this.toastr.error('Select Brand', 'Error!');
        //   return;
        // }
        else if(this.strBrand != this.selectedBrand){
          this.toastr.error('Invalid Brand', 'Error!');
          return;
        }
        else if (strData === undefined || strData === null) {
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

            console.log("itetetette",dctData)
            this.serverService
              .postData('itemcategory/item_typeahead/',dctData)
              .subscribe(
                (response) => {
                  this.lstItem =JSON.parse(JSON.stringify(response['data']))
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

  ItemChanged(item) {
    this.IntItemId = item.id;
    this.strItem = item.code_name;
  }



}

