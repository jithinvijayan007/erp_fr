import { Component, OnInit,ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { ServerService } from '../../server.service';
import { ToastrModule } from 'ngx-toastr';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { TypeaheadService } from '../../typeahead.service';
import {  FormControl } from '@angular/forms';
import { Router } from '@angular/router';
// import { forEach } from '@angular/router/src/utils/collection';
import { DatePipe } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';



@Component({
  selector: 'app-addreward',
  templateUrl: './addreward.component.html',
  styleUrls: ['./addreward.component.scss']
})
export class AddrewardComponent implements OnInit {
  @ViewChild('productElement') productElement: ElementRef;

  lstProductData=[
    {
      product_id : 0,      
      product_name:null,
      fromQty:0,
      tillQty:0,
      reward_per:0,
      reward_amt:0,
      reward_mop:false,
      reward_to:0
    }
  ];

  itemIteration=0;


  tabName;
  tabIndex=0;
  lstTabName=[];

  action='';
  caption='';

  fromDate1=null;
  toDate1=null;
  fromDate2=null;
  toDate2=null;
  fromDate3=null;
  toDate3=null;
  fromDate4=null;
  toDate4=null;
  fromDate5=null;
  toDate5=null;

  validationStatus=true;
  flag=false;

  areaType = '';
  areaType1 = '';
  areaType2 = '';
  areaType3 = '';
  areaType5 = '';

  item_Name;

  LstArea1 = [];
  rewardName1 = '';
  LstArea2 = [];
  rewardName2 = '';
  LstArea3 = [];
  rewardName3 = '';
  LstArea4 = [];
  rewardName4 = '';
  LstArea5 = [];
  rewardName5 = '';

  selBranch=false;

  searchItem: FormControl = new FormControl();
  lstItems = [];
  itemId;
  itemIdArr=[];
  selectedItem;
  itemName;
  lstProduct = []
  dctProduct = {}
  selItem=false;

  lstBrand=[];


  searchProduct: FormControl = new FormControl();
  lstProducts = [];
  productId;
  productIdArr=[];
  selectedProduct;
  productName;
  selProduct=false;

  searchBrand: FormControl = new FormControl();
  lstBrands = [];
  brandId;
  brandIdArr=[];
  selectedBrand;
  brandName;
  selBrand=false;

  searchBranch: FormControl = new FormControl();
  lstBranchs = [];
  branchId;
  branchIdArr=[];
  selectedBranch;
  branchName;
  branch_name='';

  reward1_3=null;
  reward2_3=null;
  reward3_3=null;
  reward1_4=null;
  reward2_4=null;
  reward3_4=null;

  rewardDatas={};

  map_type=null;

  lstValues = [];
  lstTurnover=[];

  pushed_items = {};
  errorPlace = '';

  isProductActive=true;
  isBrandActive=true;
  isItemActive=true;
  isValueActive=true;
  isTurnActive=true;

  dctSaveDetails={
    addrewards:{},
    fromDate:null,
    toDate:null
  };
  objectKeys = Object.keys;

lstItem=[]
lstAreas = []
  constructor(
    private serverService: ServerService,
    private typeaheadObject: TypeaheadService,
    public toastr: ToastrModule,
    vcr: ViewContainerRef,
    public router: Router,
    private datepipe: DatePipe

  ) { 
    // this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {  

    this.searchItem.valueChanges
    .pipe(debounceTime(400))
    .subscribe((data: string) => {
      const pushedItems = {};
      pushedItems['term'] = data;
      pushedItems['productId'] = this.productId;
    

      if (data === undefined || data === null) {
        // this.lstItems=[];
      } else {
        if (data.length > 2) {
          this.lstItems = [];
          this.typeaheadObject
            .searchItemByProduct(pushedItems)
            .subscribe(
            (response: {
              status: string;
              data: Array<{
               
              }>;
            }) => {
              this.lstItems.push(...response.data);

            }
            );
        }
      }
    });

    this.searchProduct.valueChanges
    .pipe(debounceTime(400))
    .subscribe((data: string) => {
     

      if (data === undefined || data === null || data === '') {
        let lstLen=this.lstItem.length-1;
        this.itemId=0;
        this.lstItem[lstLen].map_id='';
        this.lstItem[lstLen].item_name='';
        this.lstItems=[];
        this.lstProducts = [];
        } else {
        if (data.length > 2) {
          this.lstProducts = [];
          this.typeaheadObject
            .searchProductByGDP(data)
            .subscribe(
            (response: {
              status: string;
              data: Array<{
               
              }>;
            }) => {
              this.lstProducts.push(...response.data);

            }
            );
        }
      }
    });


    this.searchBrand.valueChanges
    .pipe(debounceTime(400))
    .subscribe((data: string) => {
     
      this.lstBrands = [];
    
      if (data === undefined || data === null || data === '') {
        
        this.lstBrands = [];
  
      } else {
        if (data.length > 1) {
          this.lstBrands = [];
          this.typeaheadObject
            .search_brand(data)
            .subscribe(
            (response: {
              data;
            }) => {
              this.lstBrands.push(...response.data);
          }
        );
      } else{
        this.lstBrands = [];
      }
    }
    });

    this.searchBranch.valueChanges
    .pipe(debounceTime(400))
    .subscribe((data: string) => {
     
      if (data === undefined || data === null) {
      } else {
        if (data.length > 1) {
          this.lstBranchs = [];
          this.typeaheadObject
            .searchBranch(data)
            .subscribe(
            (response: {
            
              data;
            }) => {
      
              
              this.lstBranchs.push(...response.data);            
          }
        );
      } else{
        this.lstBranchs = [];
      }
    }
    });

    this.map_type=0;
    this.tabName='product';
    this.lstTabName=this.lstProduct;
    
    this.isProductActive=true;
    this.isBrandActive=true;
    this.isItemActive=true;
    this.isValueActive=true;
    this.isTurnActive=true;

    this.action =localStorage.getItem('action');


    if(this.action=='edit'){

      this.caption='edit';

      this.getDetails();

      this.selProduct=false;    
      this.selBrand=false;
      this.selItem=false;

      localStorage.setItem('action','save');
      
    }
    else{
      localStorage.setItem('action','save');
      this.caption='save';
      this.action='save';
      this.selProduct=true;  
      this.selBrand=true;
      this.selItem=true;
      this.clearFields();
    }
    
  }

  getDetails(){

    let id = {id: localStorage.getItem('rewardId')};
    this.serverService.postData('staff_rewards/rewards_list/',id).subscribe(
      (response) => { 

            this.rewardDatas = response['data'];

            let areaLst=[];
            if(this.rewardDatas['branch'].length!=0){              

              this.areaType='branch';
              if(this.rewardDatas['category']=='TurnOver Wise'){
                areaLst=this.rewardDatas['branch'];
              }
              else{
                areaLst=this.rewardDatas['branch_id'];
              }
              
            }
            if(this.rewardDatas['territory'].length!=0){
     
             this.areaType='territory';
             areaLst=this.rewardDatas['territory_id'];
            }
            if(this.rewardDatas['zone'].length!=0){
     
             this.areaType='zone';
             areaLst=this.rewardDatas['zone_id'];
            } 
     
     
           if(this.rewardDatas['category']=='Product Wise'){

           this.tabIndex=0;
           this.tabName='product';
           this.isProductActive=true;
           this.isBrandActive=false;
           this.isItemActive=false;
           this.isValueActive=false;
           this.isTurnActive=false;

           this.lstProduct=[];

           for (let index = 0; index < this.rewardDatas['items'].length; index++) {
           
            this.lstProduct.push(
              {
                map_id : this.rewardDatas['items'][index].map_id,
                product_name: this.rewardDatas['items'][index].product_name,
                fromQty:this.rewardDatas['items'][index].quantity_from,
                tillQty:this.rewardDatas['items'][index].quantity_to,
                slab1_percentage:this.rewardDatas['items'][index].slab1_percentage,
                slab1_amount:this.rewardDatas['items'][index].slab1_amount,
                reward_mop:this.rewardDatas['items'][index].mop_sale,
                reward_to:this.rewardDatas['items'][index].assign_id
              })

           }     
     
           this.fromDate1=this.rewardDatas['from_date'];
           
           this.toDate1=this.rewardDatas['to_date'];  
           this.areaType1=this.areaType;
           this.getAreas();
           this.LstArea1=areaLst;
           
           this.selProduct=true;
           this.rewardName1=this.rewardDatas['reward_name'];
     
           }
           else if(this.rewardDatas['category']=='Brand Wise'){

            this.tabIndex=1;
            this.tabName='brand';
            this.isBrandActive=true;
            this.isProductActive=false;
            this.isItemActive=false;
            this.isValueActive=false;
            this.isTurnActive=false;
 
            this.lstBrand=[];
 
            for (let index = 0; index < this.rewardDatas['items'].length; index++) {
            
             this.lstBrand.push(
               {
                 map_id : this.rewardDatas['items'][index].map_id,
                 brand_name: this.rewardDatas['items'][index].brand_name,
                 fromQty:this.rewardDatas['items'][index].quantity_from,
                 tillQty:this.rewardDatas['items'][index].quantity_to,
                 slab1_percentage:this.rewardDatas['items'][index].slab1_percentage,
                 slab1_amount:this.rewardDatas['items'][index].slab1_amount,
                 reward_mop:this.rewardDatas['items'][index].mop_sale,
                 reward_to:this.rewardDatas['items'][index].assign_id
               })
            }     
      
            this.fromDate5=this.rewardDatas['from_date'];
            this.toDate5=this.rewardDatas['to_date'];  
            this.areaType5=this.areaType;
            this.getAreas();
            this.LstArea5=areaLst;
            
            this.selBrand=true;
            this.rewardName5=this.rewardDatas['reward_name'];
      
            }
           else if(this.rewardDatas['category']=='Item Wise'){
     
           this.tabIndex=2;
           this.tabName='item';
           this.isItemActive=true;
           this.isProductActive=false;
           this.isValueActive=false;
           this.isTurnActive=false;
           this.isBrandActive=false;       
           
           this.fromDate2=this.rewardDatas['from_date'];
           this.toDate2=this.rewardDatas['to_date'];  
           this.areaType2=this.areaType;
           this.getAreas();
           this.LstArea2=areaLst;
           this.rewardName2=this.rewardDatas['reward_name'];

           this.selProduct=true;
           this.selItem=true;
          //  this.lstItem=this.rewardDatas['items'];

          for (let index = 0; index < this.rewardDatas['items'].length; index++) {

            this.lstItem.push({
              fromQty:this.rewardDatas['items'][index].quantity_from,
              tillQty:this.rewardDatas['items'][index].quantity_to,
              product_name:this.rewardDatas['items'][index].product_name ,
              item_name:this.rewardDatas['items'][index].item_name,
              map_id:this.rewardDatas['items'][index].map_id,
              slab1_percentage:this.rewardDatas['items'][index].slab1_percentage,
              slab1_amount:this.rewardDatas['items'][index].slab1_amount,
              reward_mop:this.rewardDatas['items'][index].mop_sale,
              reward_to:this.rewardDatas['items'][index].assign_id
              });
            
          }          
                
           }
           else if(this.rewardDatas['category']=='Value Wise'){

           this.tabIndex=3;
           this.tabName='value';
           this.isValueActive=true;
           this.isItemActive=false;
           this.isProductActive=false;
           this.isTurnActive=false;
           this.isBrandActive=false;
           
          //  this.lstValues=this.rewardDatas['items'];
     
           this.fromDate3=this.rewardDatas['from_date'];
           this.toDate3=this.rewardDatas['to_date'];
     
           this.areaType3=this.areaType;
           this.getAreas();
           this.LstArea3=areaLst;
           this.rewardName3=this.rewardDatas['reward_name'];
         
           this.reward1_3=this.rewardDatas['slab1_percentage'];
           this.reward2_3=this.rewardDatas['slab2_percentage'];
           this.reward3_3=this.rewardDatas['slab3_percentage'];
           this.selProduct=true;
           this.lstValues=[];
           
           for (let index = 0; index < this.rewardDatas['items'].length; index++) {

            this.lstValues.push({
              product_name : this.rewardDatas['items'][index].product_name,
              map_id : this.rewardDatas['items'][index].map_id,      
              fromAmt:this.rewardDatas['items'][index].value_from,
              toAmt:this.rewardDatas['items'][index].value_to,
              slab1_percentage:this.rewardDatas['items'][index].slab1_percentage,
              slab1_amount:this.rewardDatas['items'][index].slab1_amount,
              slab2_percentage:this.rewardDatas['items'][index].slab2_percentage,
              slab2_amount:this.rewardDatas['items'][index].slab2_amount,
              slab3_percentage:this.rewardDatas['items'][index].slab3_percentage,
              slab3_amount:this.rewardDatas['items'][index].slab3_amount,
              reward_mop:this.rewardDatas['items'][index].mop_sale,
              reward_to:this.rewardDatas['items'][index].assign_id
            })
        
        
            
           }
           
           }
           else if(this.rewardDatas['category']=='TurnOver Wise'){
           this.LstArea4=[];
           this.tabIndex=4;
           this.tabName='turnover';
           this.isTurnActive=true;
           this.isValueActive=false;
           this.isItemActive=false;
           this.isProductActive=false;
           this.isBrandActive=false;

           this.selBranch=true;
     
           this.fromDate4=this.rewardDatas['from_date'];
           this.toDate4=this.rewardDatas['to_date'];
           this.branch_name=areaLst[0];
           this.LstArea4=this.rewardDatas['branch_id'];
           this.rewardName4=this.rewardDatas['reward_name'];
         
           this.reward1_4=this.rewardDatas['slab1_percentage'];
           this.reward2_4=this.rewardDatas['slab2_percentage'];
           this.reward3_4=this.rewardDatas['slab3_percentage'];


          for (let index = 0; index < this.rewardDatas['items'].length; index++) {

            this.lstTurnover.push({
              fromAmt:this.rewardDatas['items'][index].value_from,
              toAmt:this.rewardDatas['items'][index].value_to,
              slab1_percentage:this.rewardDatas['items'][index].slab1_percentage,
              slab1_amount:this.rewardDatas['items'][index].slab1_amount,
              slab2_percentage:this.rewardDatas['items'][index].slab2_percentage,
              slab2_amount:this.rewardDatas['items'][index].slab2_amount,
              slab3_percentage:this.rewardDatas['items'][index].slab3_percentage,
              slab3_amount:this.rewardDatas['items'][index].slab3_amount,
              reward_mop:this.rewardDatas['items'][index].mop_sale,
              reward_to:this.rewardDatas['items'][index].assign_id
            })
          }          

           }
            
      });
  }

  clearFields(){
    this.areaType='';
    this.itemName='';
    this.productId=0;
    this.itemId=0;
    this.brandId=0;

    this.fromDate1=null;
    this.fromDate2=null;
    this.fromDate3=null;
    this.fromDate4=null;
    this.fromDate5=null;

    this.toDate1=null;
    this.toDate2=null;
    this.toDate3=null;
    this.toDate4=null;
    this.toDate5=null;

    this.reward1_3=null;
    this.reward2_3=null;
    this.reward3_3=null;
    this.reward1_4=null;
    this.reward2_4=null;
    this.reward3_4=null;

    this.areaType = '';
    this.areaType1 = '';
    this.areaType2 = '';
    this.areaType3 = '';
    this.areaType5 = '';

    this.rewardName1 = '';
    this.rewardName2 = '';
    this.rewardName3 = '';
    this.rewardName4 = '';
    this.rewardName5 = '';

    this.branch_name='';
    this.selBranch=false;

    this.lstBranchs=[];

    this.LstArea1=[];
    this.LstArea2=[];
    this.LstArea3=[];
    this.LstArea4=[];
    this.LstArea5=[];

    this.lstProduct = [{
      map_id : 0,      
      product_name:null,
      fromQty:0,
      tillQty:0,
      slab1_percentage:0,
      slab1_amount:0,
      reward_mop:false,
      reward_to:0
    }]

    this.lstItem=[{
      fromQty:0,
      tillQty:0,
      product_name:null,
      item_name:null,
      map_id:null,
      slab1_percentage:0,
      slab1_amount:0,
      reward_mop:false,
      reward_to:0
      }];
    

    this.lstValues=[{
      product_name : '',
      map_id : 0,      
      fromAmt:0,
      toAmt:0,
      slab1_percentage:0,
      slab1_amount:0,
      slab2_percentage:null,
      slab2_amount:null,
      slab3_percentage:null,
      slab3_amount:null,
      reward_mop:false,
      reward_to:0
    }]


    this.lstTurnover=[{
      fromAmt:0,
      toAmt:0,
      slab1_percentage:0,
      slab1_amount:0,
      slab2_percentage:null,
      slab2_amount:null,
      slab3_percentage:null,
      slab3_amount:null,
      reward_mop:false,
      reward_to:0
    }]

    this.lstBrand = [{
      map_id : 0,      
      brand_name:null,
      fromQty:0,
      tillQty:0,
      slab1_percentage:0,
      slab1_amount:0,
      reward_mop:false,
      reward_to:0
    }]

  }
  getAreas(){
   
    this.areaType='';
    let dctArea = {}
    if(this.tabName=='product'){
      this.LstArea1=[];
      dctArea['area_type'] = this.areaType1;
      this.areaType=this.areaType1;
      
    }
    else if(this.tabName=='brand'){
      this.LstArea5=[];
      dctArea['area_type'] = this.areaType5;
      this.areaType=this.areaType5;
    }
    else if(this.tabName=='item'){
      this.LstArea2=[];
      dctArea['area_type'] = this.areaType2;
      this.areaType=this.areaType2;
    }
    else if(this.tabName=='value'){
      this.LstArea3=[];
      dctArea['area_type'] = this.areaType3;
      this.areaType=this.areaType3;
    }

   
    this.serverService.postData("staff_rewards/area_search/",dctArea)
        .subscribe(
          (response) => {
              if (response['status'] == 1) {
                this.lstAreas = response['data']
              }  
              else {
                // this.toastr.error(response['reason']);
              }
          },
          (error) => {   
          });
  }

  checkProduct(index){    

    if(this.productId==0){

      this.validationStatus = false ;
      this.errorPlace = 'Enter a valid product name';
      this.lstItem[index]['item_name']=undefined;

      this.showErrorMessage(this.errorPlace);
      return;
    }
  }

  addProduct(){
    
    this.validationStatus=true;
    this.lstProducts=[];
  this.productValidation();

  let lstLength=this.lstProduct.length-1;

    if(this.validationStatus){
      // if(this.caption=='save'){
          this.lstProduct[lstLength].map_id = this.productId;

      // }
      
      if (this.lstProduct.length > 0) {
        this.lstProduct.push(
          {
            map_id : this.lstProduct[0]['map_id'],
            product_name:this.lstProduct[0]['product_name'],
            fromQty:this.lstProduct[0]['fromQty'],
            tillQty:this.lstProduct[0]['tillQty'],
            slab1_percentage:0,
            slab1_amount:0,
            reward_mop:this.lstProduct[0]['reward_mop'],
            reward_to:0
          })
      }
      else{
        this.lstProduct.push(
          {
            map_id : 0,
            product_name:null,
            fromQty:0,
            tillQty:0,
            slab1_percentage:0,
            slab1_amount:0,
            reward_mop:false,
            reward_to:0
          })
      }
      
    }
  }


  addBrand(){
    
    this.validationStatus=true;
    this.lstBrands=[];

  this.brandValidation();

  let lstLength=this.lstBrand.length-1;

    if(this.validationStatus){
      if(this.caption=='save'){
          this.lstBrand[lstLength].map_id = this.brandId;

      }

      if (this.lstBrand.length > 0) {
        this.lstBrand.push(
          {
            map_id : this.lstBrand[0]['map_id'],
            brand_name:this.lstBrand[0]['brand_name'],
            fromQty:this.lstBrand[0]['fromQty'],
            tillQty:this.lstBrand[0]['tillQty'],
            slab1_percentage:0,
            slab1_amount:0,
            reward_mop:this.lstBrand[0]['reward_mop'],
            reward_to:0
          })
      }
      else{
        this.lstBrand.push(
          {
            map_id : 0,
            brand_name:null,
            fromQty:0,
            tillQty:0,
            slab1_percentage:0,
            slab1_amount:0,
            reward_mop:false,
            reward_to:0
          })
      }
      
    }
  }


  addTurnover(){

    this.validationStatus=true;
    this.lstProducts=[];

    this.turnoverValidation();
  
       if(this.validationStatus){ 
         
        // this.lstTurnover[lstLength].product_id = this.productId;
        if (this.lstTurnover.length > 0) {
          this.lstTurnover.push(
            {
              fromAmt:this.lstTurnover[0]['fromAmt'],
              toAmt:this.lstTurnover[0]['toAmt'],
              slab1_percentage:0,
              slab1_amount:0,
              slab2_percentage:null,
              slab2_amount:null,
              slab3_percentage:null,
              slab3_amount:null,
              reward_mop:this.lstTurnover[0]['reward_mop'],
              reward_to:0
            })
        }else{
          this.lstTurnover.push(
            {
              fromAmt:0,
              toAmt:0,
              slab1_percentage:0,
              slab1_amount:0,
              slab2_percentage:null,
              slab2_amount:null,
              slab3_percentage:null,
              slab3_amount:null,
              reward_mop:false,
              reward_to:0
            })
        }
        
      }
    }

  addValue(){

    this.validationStatus=true;
    this.lstProducts=[];

this.valueValidation();

    let lstLength=this.lstValues.length-1;

     if(this.validationStatus){ 
       
      if(this.caption=='save'){

        this.lstValues[lstLength].map_id = this.productId;
 
      }
      if (this.lstValues.length > 0) {
        this.lstValues.push(
          {
            product_name : this.lstValues[0]['product_name'],
            map_id : this.lstValues[0]['map_id'],      
            fromAmt:this.lstValues[0]['fromAmt'],
            toAmt:this.lstValues[0]['toAmt'],
            slab1_percentage:0,
            slab1_amount:0,
            slab2_percentage:null,
            slab2_amount:null,
            slab3_percentage:null,
            slab3_amount:null,
            reward_mop:this.lstValues[0]['reward_mop'],
            reward_to:0
          })
      }
      else{
        this.lstValues.push(
          {
            product_name : '',
            map_id : 0,      
            fromAmt:0,
            toAmt:0,
            slab1_percentage:0,
            slab1_amount:0,
            slab2_percentage:null,
            slab2_amount:null,
            slab3_percentage:null,
            slab3_amount:null,
            reward_mop:false,
            reward_to:0
          })
      }
      
    }
  }

  itemSearched(data,event){


    if (event.keyCode === 8|| event.keyCode === 38|| event.keyCode === 40|| event.keyCode === 13) {
      if (data === undefined || data === null || data === '') {
      
        this.lstItems = [];
  
      }
      return //return for backspace, enter key and up&down arrows.
  } 
      const pushedItems = {};
      pushedItems['term'] = data;
      pushedItems['productId'] = this.productId;

      if (data === undefined || data === null) {
      } else {
        if (data.length > 1) {
          this.lstItems = [];
          this.typeaheadObject
            .searchItemByProduct(pushedItems)
            .subscribe(
            (response: {
            
              data;
            }) => {
              this.lstItems.push(...response.data);

            }
            );
        } else{
          this.lstItems = [];
        }
      }
  }
  productSearched(data,event){        

    if (event.keyCode === 8|| event.keyCode === 38|| event.keyCode === 40|| event.keyCode === 13) {
      if (data === undefined || data === null || data === '') {
      
        let lstLen=this.lstItem.length-1;
        this.itemId=0;
        this.lstItem[lstLen].map_id='';
        this.lstItem[lstLen].item_name='';
        this.lstItems=[];
        this.lstProducts = [];
  
      }
      return //return for backspace, enter key and up&down arrows.
  } 
  
      if (data === undefined || data === null) {
      } 
      else {
        if (data.length > 1) {
          this.lstProducts = [];
          this.typeaheadObject
            .searchProductByGDP(data)
            .subscribe(
            (response: {
              data;
            }) => {
              this.lstProducts.push(...response.data);
          }
        );
      } else{
        this.lstProducts = [];
      }
    }
  }

  brandSearched(data,event){    


    if (event.keyCode === 8|| event.keyCode === 38|| event.keyCode === 40|| event.keyCode === 13) {
      if (data === undefined || data === null || data === '') {
      
        this.lstBrands = [];
  
      }
      return //return for backspace, enter key and up&down arrows.
  } 
  
    if (data === undefined || data === null || data === '') {
      
      this.lstBrands = [];

    } else {
      if (data.length > 1) {
        this.lstBrands = [];
        this.typeaheadObject
          .search_brand(data)
          .subscribe(
          (response: {
            data;
          }) => {
            this.lstBrands.push(...response.data);
        }
      );
    } else{
      this.lstBrands = [];
    }
  }
}

  branchSearched(data){
    if (data === undefined || data === null) {
    } else {
      if (data.length > 1) {
        this.lstBranchs = [];
        this.typeaheadObject
          .searchBranch(data)
          .subscribe(
          (response: {
          
            data;
          }) => {
    
            
            this.lstBranchs.push(...response.data);            
        }
      );
    } else{
      this.lstBranchs = [];
    }
  }
}

  addItem(){    
    this.validationStatus=true;
    this.lstProducts=[];
    this.lstItems=[];

    this.itemValidation();

    if(this.validationStatus){
    {
      if (this.lstItem.length > 0) {
        this.lstItem.push({
          fromQty:this.lstItem[0]['fromQty'],
          tillQty:this.lstItem[0]['tillQty'],
          product_name:this.lstItem[0]['product_name'],
          map_id:this.lstItem[0]['map_id'],
          slab1_percentage:0,
          slab1_amount:0,
          reward_to:0,
          reward_mop:this.lstItem[0]['reward_mop'],
          item_name:this.lstItem[0]['item_name']
          });
      }else{
        this.lstItem.push({
          fromQty:0,
          tillQty:0,
          product_name:null,
          map_id:null,
          slab1_percentage:0,
          slab1_amount:0,
          reward_mop:false,
          reward_to:0
          });
      }
      
    } 
  }
  
}
  setTabName(event){
    this.map_type=event.index;
    // this.clearFields();

    if(event.index==0){
      this.lstProducts = [];
      this.tabName='product';
      this.lstTabName=this.lstProduct;      
    } 
    else if(event.index==1){
      this.lstBrands = [];
      this.tabName='brand';
      this.lstTabName=this.lstBrand;
      // this.map_type++;
    }
    else if(event.index==2){
      this.lstProducts = [];
      this.lstItems = [];
      this.tabName='item';
      this.lstTabName=this.lstItem;
      // this.map_type++;
    } else if(event.index==3){
      this.lstProducts = [];
      this.tabName='value';
      // this.map_type++;
      this.lstTabName=this.lstValues;
    } else if(event.index==4){
      this.tabName='turnover';
      this.lstTabName=this.lstTurnover;
      // this.map_type++;
    } 
  }
  ItemChanged(item,index) {
    
    let lstLen=this.lstItem.length-1;
    this.itemId=item.id;
    this.lstItem[index]['map_id']=this.itemId;
    this.itemIdArr.push(item.id);
    this.selectedItem = item.name;
    console.log("item", this.lstItem)
  }
  ProductChanged(product,index) {    

    this.lstItem[index]['map_id']=null;
    this.lstItem[index]['item_name']=''
    this.productId=product.id;
    this.selectedProduct = product.name;

    if(this.tabName=='product'){

      let lstLength=this.lstProduct.length-1;
   
      
      this.lstProduct[index].map_id = this.productId
  
    }

    if(this.tabName=='value'){

      let lstLength=this.lstValues.length-1;
      this.lstValues[index].map_id = this.productId
  
    }
    
  }
  BrandChanged(brand,index) {    
    
    this.brandId=brand.id;
    this.selectedBrand = brand.name;

      let lstLength=this.lstBrand.length-1;
      this.lstBrand[index].map_id = this.brandId
 
  }
  BranchChanged(branch) {
    
    
    this.branchId=branch.id;
    this.LstArea4 = []    
    this.LstArea4.push(branch.id);  
      
    this.selectedBranch = this.branch_name = branch.name;

  }
  showErrorMessage (errorPlace) {    
    Swal.fire({
      position: "center",
      type: "warning",
      title: errorPlace,
      showConfirmButton: false,
      timer: 1900
    });
  }

  // validationsFunc(){
  //   this.errorPlace='';    
  
  //  this.validationStatus=true;
   
  //     if(this.fromDate==null){        
  //       this.validationStatus = false ;
  //       this.errorPlace = 'Select from date';
  //       this.showErrorMessage(this.errorPlace);
  //       return;
  //     }
  //     else if(this.toDate==null){
  //       this.validationStatus = false ;
  //       this.errorPlace = 'Select to date';
  //       this.showErrorMessage(this.errorPlace);
  //       return;
  //     } else if (this.areaType == '') {
  //       this.validationStatus = false ;
  //       this.errorPlace = 'Select Area';
  //       this.showErrorMessage(this.errorPlace);
  //       return;
  //     } else if (this.LstArea.length == 0) {
  //       this.validationStatus = false ;
  //       this.errorPlace = 'Select at least one Area';
  //       this.showErrorMessage(this.errorPlace);
  //       return;
  //     } else if (this.rewardName == '') {
  //       this.validationStatus = false ;
  //       this.errorPlace = 'Reward name is empty';
  //       this.showErrorMessage(this.errorPlace);
  //       return;
  //     }

  //     if(this.tabName=='value'||this.tabName=='turnover'){

  //       if(this.reward1==null){
  //       this.validationStatus = false ;
  //       this.errorPlace = 'Reward1 is empty';
  //       this.showErrorMessage(this.errorPlace);
  //       return;

  //       }
  //       // else{
  //       //   this.pushed_items['reward1'] = this.reward1;
  //       // }
  //     }

      
     
     
    

  // }

  itemValidation(){


    let fromDate
    let toDate
    fromDate = this.datepipe.transform(this.fromDate2,'yyyy-MM-dd')
    toDate = this.datepipe.transform(this.toDate2,'yyyy-MM-dd')

    this.validationStatus = true ;

    let productTempId=0;
    productTempId=this.productId;

    let lstLength=this.lstItem.length-1;
    if(fromDate==null){        
      this.validationStatus = false ;
      this.errorPlace = 'Select from date';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if(toDate==null){
      this.validationStatus = false ;
      this.errorPlace = 'Select to date';
      this.showErrorMessage(this.errorPlace);
      return;
    } 
    else if(toDate<fromDate){
      
      this.validationStatus = false ;
      this.errorPlace = 'To date must be greater than from date';
      this.showErrorMessage(this.errorPlace);
      return;
    } 
    else if (this.areaType == '') {
      this.validationStatus = false ;
      this.errorPlace = 'Select Area';
      this.showErrorMessage(this.errorPlace);
      return;
    } else if (this.LstArea2.length == 0) {
      this.validationStatus = false ;
      this.errorPlace = 'Select at least one Area';
      this.showErrorMessage(this.errorPlace);
      return;
    } else if (this.rewardName2 == '') {
      this.validationStatus = false ;
      this.errorPlace = 'Reward name is empty';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    
    else if ((this.lstItem[lstLength].map_id == 0)||(productTempId==0)||((this.selectedProduct!=this.lstItem[lstLength].product_name)&&(!this.selProduct))) {
      
      this.validationStatus=false;
      this.errorPlace = 'Please fill valid product name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if ((this.lstItem[lstLength].map_id== null||this.lstItem[lstLength].map_id== '')||((this.selectedItem!=this.lstItem[lstLength].item_name)&&(!this.selItem))) {
      this.validationStatus=false;
      this.errorPlace = 'Please fill item name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (this.lstItem[lstLength].tillQty == 0) {
      this.validationStatus=false;
      this.errorPlace = 'Enter a valid till Quantity';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (this.lstItem[lstLength].tillQty <this.lstItem[lstLength].fromQty) {
      this.validationStatus=false;
      this.errorPlace = 'Till Quantity must be greater than from Quantity';
      this.showErrorMessage(this.errorPlace);
      return;
    }
   
    else if ((this.lstItem[lstLength].slab1_percentage <= 0&&this.lstItem[lstLength].slab1_amount <= 0)||(this.lstItem[lstLength].slab1_percentage >100)) {
      this.validationStatus=false;
      this.errorPlace = 'Enter valid reward percentage or reward amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (this.lstItem[lstLength].reward_to==0){
      this.validationStatus=false;
      this.errorPlace = 'Choose assign to';
      this.showErrorMessage(this.errorPlace);
      return; 
    }
    else if (lstLength > 0 && (this.lstItem[lstLength].map_id != this.lstItem[0].map_id || this.lstItem[lstLength].product_name != this.lstItem[0].product_name)) {
      this.validationStatus=false;
      this.errorPlace = 'Please fill valid product name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (lstLength > 0 && (this.lstItem[lstLength].map_id != this.lstItem[0].map_id || this.lstItem[lstLength].item_name != this.lstItem[0].item_name)) {
      this.validationStatus=false;
      this.errorPlace = 'Please fill valid item name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (lstLength > 0 && this.lstItem[lstLength].tillQty != this.lstItem[0].tillQty) {
      this.validationStatus=false;
      this.errorPlace = 'Enter a valid till Quantity';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (lstLength > 0 && this.lstItem[lstLength].fromQty != this.lstItem[0].fromQty) {
      this.validationStatus=false;
      this.errorPlace = 'Enter a valid from Quantity';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (lstLength > 0 && this.lstItem[lstLength].reward_mop != this.lstItem[0].reward_mop ) {
      this.validationStatus=false;
      this.errorPlace = 'MOP doesnt match';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if(lstLength > 0){
    for(let index=0; index<this.lstItem.length; index++){
      
      if (index!=lstLength) {
        
        if (this.lstItem[index]['reward_to'] == this.lstItem[lstLength].reward_to) {
          this.validationStatus=false;
          this.errorPlace = 'Choose valid assign to';
          this.showErrorMessage(this.errorPlace);
          return; 
        }
        }
        
        if (this.lstItem[index]['reward_to'] == 1) {
          if (this.lstItem[lstLength].reward_to == 3) {
            this.validationStatus=false;
          this.errorPlace = 'Choose valid assign to';
          this.showErrorMessage(this.errorPlace);
          return; 
          }
      }
    }
  }
  }

  productValidation(){

    let fromDate
    let toDate
    fromDate = this.datepipe.transform(this.fromDate1,'yyyy-MM-dd')
    toDate = this.datepipe.transform(this.toDate1,'yyyy-MM-dd')
    

    let lstLength=this.lstProduct.length-1;
  this.validationStatus = true ;

  if(fromDate==null){        
    this.validationStatus = false ;
    this.errorPlace = 'Select from date';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if(toDate==null){
    this.validationStatus = false ;
    this.errorPlace = 'Select to date';
    this.showErrorMessage(this.errorPlace);
    return;
  } 
  else if(toDate<fromDate){
    
    this.validationStatus = false ;
    this.errorPlace = 'To date must be greater than from date';
    this.showErrorMessage(this.errorPlace);
    return;
  } 
  // if(this.fromDate1==null){        
  //   this.validationStatus = false ;
  //   this.errorPlace = 'Select from date';
  //   this.showErrorMessage(this.errorPlace);
  //   return;
  // }
  // else if(this.toDate1==null){
  //   this.validationStatus = false ;
  //   this.errorPlace = 'Select to date';
  //   this.showErrorMessage(this.errorPlace);
  //   return;
  // } 
  // else if(this.toDate1<this.fromDate1){
    
  //   this.validationStatus = false ;
  //   this.errorPlace = 'To date must be greater than from date';
  //   this.showErrorMessage(this.errorPlace);
  //   return;
  // } 
  else if (this.areaType == '') {
    this.validationStatus = false ;
    this.errorPlace = 'Select Area';
    this.showErrorMessage(this.errorPlace);
    return;
  } else if (this.LstArea1.length == 0) {
    this.validationStatus = false ;
    this.errorPlace = 'Select at least one Area';
    this.showErrorMessage(this.errorPlace);
    return;
  } else if (this.rewardName1 == '') {
    this.validationStatus = false ;
    this.errorPlace = 'Reward name is empty';
    this.showErrorMessage(this.errorPlace);
    return;
  }

  else if ((this.lstProduct[lstLength].map_id == 0)||((this.lstProduct[lstLength].product_name!=this.selectedProduct)&&(!this.selProduct))) {
    this.validationStatus=false;
    this.errorPlace = 'Please fill valid product name';
    this.showErrorMessage(this.errorPlace);
    return;
  }

  else if (this.lstProduct[lstLength].tillQty == 0) {
    this.validationStatus=false;
    this.errorPlace = 'Enter a valid till Quantity';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if (this.lstProduct[lstLength].tillQty <this.lstProduct[lstLength].fromQty) {
    this.validationStatus=false;
    this.errorPlace = 'Till Quantity must be greater than from Quantity';
    this.showErrorMessage(this.errorPlace);
    return;
  }

 
  else if ((this.lstProduct[lstLength].slab1_percentage <= 0&&this.lstProduct[lstLength].slab1_amount <= 0)||(this.lstProduct[lstLength].slab1_percentage >100)) {
    this.validationStatus=false;
    this.errorPlace = 'Enter valid reward percentage or reward amount';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if (this.lstProduct[lstLength].reward_to==0){
    this.validationStatus=false;
    this.errorPlace = 'Choose assign to';
    this.showErrorMessage(this.errorPlace);
    return; 
  }else if (lstLength > 0 && (this.lstProduct[lstLength].product_name!=this.lstProduct[0].product_name || this.lstProduct[lstLength].map_id != this.lstProduct[0].map_id)) {
    
    this.validationStatus=false;
    this.errorPlace = 'Please fill valid product name';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if (lstLength > 0 && this.lstProduct[lstLength].tillQty != this.lstProduct[0].tillQty) {
    this.validationStatus=false;
    this.errorPlace = 'Enter a valid till Quantity';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if (lstLength > 0 && this.lstProduct[lstLength].fromQty != this.lstProduct[0].fromQty) {
    this.validationStatus=false;
    this.errorPlace = 'Enter a valid from Quantity';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if (lstLength > 0 && this.lstProduct[lstLength].reward_mop != this.lstProduct[0].reward_mop ) {
    this.validationStatus=false;
    this.errorPlace = 'MOP doesnt match';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if (lstLength > 0) {
    for(let index=0; index<this.lstProduct.length; index++){
      
      if (index!=lstLength) {
        
        if (this.lstProduct[index]['reward_to'] == this.lstProduct[lstLength].reward_to) {
          this.validationStatus=false;
          this.errorPlace = 'Choose valid assign to';
          this.showErrorMessage(this.errorPlace);
          return; 
        }
        }
        
        if (this.lstProduct[index]['reward_to'] == 1) {
          if (this.lstProduct[lstLength].reward_to == 3) {
            this.validationStatus=false;
          this.errorPlace = 'Choose valid assign to';
          this.showErrorMessage(this.errorPlace);
          return; 
          }
      }
    }
  }
  // else if(lstLength > 0 && this.lstProduct[0].reward_to == 1 && this.lstProduct[lstLength].reward_to == 3){
  //   this.validationStatus=false;
  //   this.errorPlace = 'Choose valid assign to';
  //   this.showErrorMessage(this.errorPlace);
  //   return; 
  // }
}

brandValidation(){


  let fromDate
  let toDate
  fromDate = this.datepipe.transform(this.fromDate5,'yyyy-MM-dd')
  toDate = this.datepipe.transform(this.toDate5,'yyyy-MM-dd')
  let lstLength=this.lstBrand.length-1;

 
this.validationStatus = true ;
if(fromDate==null){        
  this.validationStatus = false ;
  this.errorPlace = 'Select from date';
  this.showErrorMessage(this.errorPlace);
  return;
}
else if(toDate==null){
  this.validationStatus = false ;
  this.errorPlace = 'Select to date';
  this.showErrorMessage(this.errorPlace);
  return;
} 
else if(toDate<fromDate){
  
  this.validationStatus = false ;
  this.errorPlace = 'To date must be greater than from date';
  this.showErrorMessage(this.errorPlace);
  return;
} 
else if (this.areaType == '') {
  this.validationStatus = false ;
  this.errorPlace = 'Select Area';
  this.showErrorMessage(this.errorPlace);
  return;
} else if (this.LstArea5.length == 0) {
  this.validationStatus = false ;
  this.errorPlace = 'Select at least one Area';
  this.showErrorMessage(this.errorPlace);
  return;
} else if (this.rewardName5 == '') {
  this.validationStatus = false ;
  this.errorPlace = 'Reward name is empty';
  this.showErrorMessage(this.errorPlace);
  return;
}
else if ((this.lstBrand[lstLength].map_id == 0)||((this.lstBrand[lstLength].brand_name!=this.selectedBrand)&&(!this.selBrand))) {

  this.validationStatus=false;
  this.errorPlace = 'Please fill valid brand name';
  this.showErrorMessage(this.errorPlace);
  return;
}

else if (this.lstBrand[lstLength].tillQty == 0) {
  this.validationStatus=false;
  this.errorPlace = 'Enter a valid till Quantity';
  this.showErrorMessage(this.errorPlace);
  return;
}
else if (this.lstBrand[lstLength].tillQty <this.lstBrand[lstLength].fromQty) {
  this.validationStatus=false;
  this.errorPlace = 'Till Quantity must be greater than from Quantity';
  this.showErrorMessage(this.errorPlace);
  return;
}


else if ((this.lstBrand[lstLength].slab1_percentage <= 0&&this.lstBrand[lstLength].slab1_amount <= 0)||(this.lstBrand[lstLength].slab1_percentage >100)) {
  this.validationStatus=false;
  this.errorPlace = 'Enter valid reward percentage or reward amount';
  this.showErrorMessage(this.errorPlace);
  return;
}
else if (this.lstBrand[lstLength].reward_to==0){
  this.validationStatus=false;
  this.errorPlace = 'Choose assign to';
  this.showErrorMessage(this.errorPlace);
  return; 
}
else if (lstLength > 0 && (this.lstBrand[lstLength].map_id != this.lstBrand[0].map_id || this.lstBrand[lstLength].brand_name != this.lstBrand[0].brand_name)) {
  this.validationStatus=false;
  this.errorPlace = 'Please fill valid brand name';
  this.showErrorMessage(this.errorPlace);
  return; 
}
else if (lstLength > 0 && this.lstBrand[lstLength].tillQty != this.lstBrand[0].tillQty) {
  this.validationStatus=false;
  this.errorPlace = 'Enter a valid till Quantity';
  this.showErrorMessage(this.errorPlace);
  return;
}
else if (lstLength > 0 && this.lstBrand[lstLength].fromQty != this.lstBrand[0].fromQty) {
  this.validationStatus=false;
  this.errorPlace = 'Enter a valid from Quantity';
  this.showErrorMessage(this.errorPlace);
  return;
}
else if (lstLength > 0 && this.lstBrand[lstLength].reward_mop != this.lstBrand[0].reward_mop) {
  this.validationStatus=false;
  this.errorPlace = 'MOP doesnt match';
  this.showErrorMessage(this.errorPlace);
  return;
}
else if(lstLength > 0){
  for(let index=0; index<this.lstBrand.length; index++){
    
    if (index!=lstLength) {
      
      if (this.lstBrand[index]['reward_to'] == this.lstBrand[lstLength].reward_to) {
        this.validationStatus=false;
        this.errorPlace = 'Choose valid assign to';
        this.showErrorMessage(this.errorPlace);
        return; 
      }
      }
      
      if (this.lstBrand[index]['reward_to'] == 1) {
        if (this.lstBrand[lstLength].reward_to == 3) {
          this.validationStatus=false;
        this.errorPlace = 'Choose valid assign to';
        this.showErrorMessage(this.errorPlace);
        return; 
        }
    }
  }
}
}

  valueValidation(){
    

    let fromDate
    let toDate
    fromDate = this.datepipe.transform(this.fromDate3,'yyyy-MM-dd')
    toDate = this.datepipe.transform(this.toDate3,'yyyy-MM-dd')
    this.validationStatus = true ;

    let lstLength=this.lstValues.length-1;
  
    // if(this.caption=='save'){
    //   this.lstValues[lstLength].map_id = this.productId;
    // }
    

    if(fromDate==null){        
      this.validationStatus = false ;
      this.errorPlace = 'Select from date';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if(toDate==null){
      this.validationStatus = false ;
      this.errorPlace = 'Select to date';
      this.showErrorMessage(this.errorPlace);
      return;
    } 
    else if(toDate<fromDate){
      
      this.validationStatus = false ;
      this.errorPlace = 'To date must be greater than from date';
      this.showErrorMessage(this.errorPlace);
      return;
    } 
   else if (this.areaType == '' || this.areaType == null) {
     this.validationStatus = false ;
     this.errorPlace = 'Select Area';
     this.showErrorMessage(this.errorPlace);
     return;
   } else if (this.LstArea3.length == 0) {
     this.validationStatus = false ;
     this.errorPlace = 'Select at least one Area';
     this.showErrorMessage(this.errorPlace);
     return;
   } else if (this.rewardName3 == '' || this.rewardName3 == null) {
     this.validationStatus = false ;
     this.errorPlace = 'Reward name is empty';
     this.showErrorMessage(this.errorPlace);
     return;
   }
   else if (this.reward1_3 == ''|| this.reward1_3 == null) {
     this.validationStatus = false ;
     this.errorPlace = 'Reward1 is empty';
     this.showErrorMessage(this.errorPlace);
     return;
   }
   else if((this.reward1_3!=''||this.reward1_3!=null)&&(this.reward1_3>100||this.reward1_3<0)){
     this.validationStatus = false ;
     this.errorPlace = 'Reward1 % must be between 1 & 100';
     this.showErrorMessage(this.errorPlace);
     return;
    }
    else if((this.reward2_3!=''||this.reward2_3!=null)&&(this.reward2_3>100||this.reward2_3<0)){
      this.validationStatus = false ;
      this.errorPlace = 'Reward2 % must be between 1 & 100';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if((this.reward3_3!=''||this.reward3_3!=null)&&(this.reward3_3>100||this.reward3_3<0)){
      this.validationStatus = false ;
      this.errorPlace = 'Reward3 % must be between 1 & 100';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (((this.lstValues[lstLength].product_name !=this.selectedProduct)&&(!this.selProduct))||(this.lstValues[lstLength].map_id==0)){
      this.validationStatus=false;
      this.errorPlace = 'Please fill product name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (this.lstValues[lstLength].fromAmt < 0) {
      this.validationStatus=false;
      this.errorPlace = 'Enter a valid from Amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
  
    else if (this.lstValues[lstLength].toAmt <= 0) {
      this.validationStatus=false;
      this.errorPlace = 'Enter a valid to Amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (this.lstValues[lstLength].toAmt < this.lstValues[lstLength].fromAmt) {
      this.validationStatus=false;
      this.errorPlace = 'To Amount must be greater than from amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (this.lstValues[lstLength].reward_to==0){
     this.validationStatus=false;
      this.errorPlace = 'Choose assign to';
      this.showErrorMessage(this.errorPlace);
      return; 
    }
    else if (this.lstValues[lstLength].slab1_percentage == 0&&this.lstValues[lstLength].slab1_amount == 0) {
      
      this.validationStatus=false;
      this.errorPlace = 'Please fill reward1 percentage or reward1 amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if(!(this.reward2_3==null||this.reward2_3=='')){

      for (let index = 0; index < this.lstValues.length; index++) {
      let rawNo=index+1;
      
       if((this.lstValues[index].slab2_percentage==null&&this.lstValues[index].slab2_amount==null)||(this.lstValues[index].slab2_percentage==''&&this.lstValues[index].slab2_amount=='')||(this.lstValues[index].slab2_percentage<=0&&this.lstValues[index].slab2_amount<=0)||(this.lstValues[index].slab2_percentage>100)){
       this.validationStatus=false;
       this.errorPlace = 'Enter valid reward2 percentage or reward2 amount of row '+rawNo;
       this.showErrorMessage(this.errorPlace);
       return;
       }
      }

    
   }
  if(!(this.reward3_3==null||this.reward3_3=='')){
    for (let index = 0; index < this.lstValues.length; index++) {
      let rawNo=index+1;

     if((this.lstValues[index].slab3_percentage==null&&this.lstValues[index].slab3_amount==null)||(this.lstValues[index].slab3_percentage==''&&this.lstValues[index].slab3_amount=='')||(this.lstValues[index].slab3_percentage<=0&&this.lstValues[index].slab3_amount<=0)||(this.lstValues[index].slab3_percentage>100)){
       this.validationStatus=false;
       this.errorPlace = 'Enter valid reward3 percentage or reward3 amount of row '+rawNo;
       this.showErrorMessage(this.errorPlace);
       return;
     }
    }
   }
    else if (lstLength > 0 && (this.lstValues[lstLength].product_name != this.lstValues[0].product_name || this.lstValues[lstLength].map_id != this.lstValues[0].map_id)) {
      this.validationStatus=false;
      this.errorPlace = 'Please fill product name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (lstLength > 0 && this.lstValues[lstLength].fromAmt != this.lstValues[0].fromAmt) {
      this.validationStatus=false;
      this.errorPlace = 'Enter a valid from Amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (lstLength > 0 && this.lstValues[lstLength].toAmt != this.lstValues[0].toAmt) {
      this.validationStatus=false;
      this.errorPlace = 'Enter a valid to Amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (lstLength > 0 && this.lstValues[lstLength].reward_mop != this.lstValues[0].reward_mop) {
      this.validationStatus=false;
      this.errorPlace = 'MOP doesnt match';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if(lstLength > 0){
      for(let index=0; index<this.lstValues.length; index++){
        
        if (index!=lstLength) {
          
          if (this.lstValues[index]['reward_to'] == this.lstValues[lstLength].reward_to) {
            this.validationStatus=false;
            this.errorPlace = 'Choose valid assign to';
            this.showErrorMessage(this.errorPlace);
            return; 
          }
          }
          
          if (this.lstValues[index]['reward_to'] == 1) {
            if (this.lstValues[lstLength].reward_to == 3) {
              this.validationStatus=false;
            this.errorPlace = 'Choose valid assign to';
            this.showErrorMessage(this.errorPlace);
            return; 
            }
        }
      }
    }
  }

  deleteData(indexId){

    let lstLen;
    if(this.tabName=='product'){
     lstLen=this.lstProduct.length;
     if(!(lstLen==1)){
       this.lstProduct.splice(indexId,1);
     }
     else{

      this.lstProduct = [{
        map_id : 0,      
        product_name:null,
        fromQty:0,
        tillQty:0,
        slab1_percentage:0,
        slab1_amount:0,
        reward_mop:false,
        reward_to:0
      }]
  
    

     }
      
    }
    else if(this.tabName=='brand'){
      lstLen=this.lstBrand.length;
      if(!(lstLen==1)){
        this.lstBrand.splice(indexId,1);
      }
      else{
 
       this.lstBrand = [{
         map_id : 0,      
         brand_name:null,
         fromQty:0,
         tillQty:0,
         slab1_percentage:0,
         slab1_amount:0,
         reward_mop:false,
         reward_to:0
       }]
   
     
 
      }
       
     }
    else if(this.tabName=='item'){
      lstLen=this.lstItem.length;
     if(!(lstLen==1)){
      this.lstItem.splice(indexId,1);
     }
     else{

      this.lstItem=[{
        fromQty:0,
        tillQty:0,
        product_name:null,
        map_id:null,
        slab1_percentage:0,
        slab1_amount:0,
        reward_to:0
        }];
      
     }
    }
    else if(this.tabName=='value'){
      lstLen=this.lstValues.length;
      if(!(lstLen==1)){
      this.lstValues.splice(indexId,1);
      }
      else{

        this.lstValues=[{
          product_name : '',
          map_id : 0,      
          fromAmt:0,
          toAmt:0,
          slab1_percentage:0,
          slab1_amount:0,
          slab2_percentage:null,
          slab2_amount:null,
          slab3_percentage:null,
          slab3_amount:null,
          reward_mop:false,
          reward_to:0
        }]
    
      }
    }
    else if(this.tabName=='turnover'){
      lstLen=this.lstTurnover.length;
      if(!(lstLen==1)){
      this.lstTurnover.splice(indexId,1);
      }
      else{

        this.lstTurnover=[{
          fromAmt:0,
          toAmt:0,
          slab1_percentage:0,
          slab1_amount:0,
          slab2_percentage:null,
          slab2_amount:null,
          slab3_percentage:null,
          slab3_amount:null,
          reward_mop:false,
          reward_to:0
        }]
      }
    }
  }

  turnoverValidation(){


    let fromDate
    let toDate
    fromDate = this.datepipe.transform(this.fromDate4,'yyyy-MM-dd')
    toDate = this.datepipe.transform(this.toDate4,'yyyy-MM-dd')
    this.validationStatus=true;

    let lstLength=this.lstTurnover.length-1;    
  
    // this.lstTurnover[lstLength].map_id = this.productId

    if(fromDate==null){        
      this.validationStatus = false ;
      this.errorPlace = 'Select from date';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if(toDate==null){
      this.validationStatus = false ;
      this.errorPlace = 'Select to date';
      this.showErrorMessage(this.errorPlace);
      return;
    } 
    else if(toDate<fromDate){
      
      this.validationStatus = false ;
      this.errorPlace = 'To date must be greater than from date';
      this.showErrorMessage(this.errorPlace);
      return;
    } 
   else if (((this.selectedBranch=='' || this.selectedBranch== null)&&(!this.selBranch))||this.branch_name=='' || this.branch_name== null) {
    
     this.validationStatus = false ;
     this.errorPlace = 'Select branchname';
     this.showErrorMessage(this.errorPlace);
     return;
   } 
   else if ((this.selectedBranch!=this.branch_name)&&(!this.selBranch)) {
    this.validationStatus = false ;
    this.errorPlace = 'Select valid branchname';
    this.showErrorMessage(this.errorPlace);
    return;
  } 
   else if (this.rewardName4 == '' || this.rewardName4 == null) {
     this.validationStatus = false ;
     this.errorPlace = 'Reward name is empty';
     this.showErrorMessage(this.errorPlace);
     return;
   }
   else if (this.reward1_4 == '' || this.reward1_4 == null) {
    this.validationStatus = false ;
    this.errorPlace = 'Reward1 is empty';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if((this.reward1_4!=''||this.reward1_4!=null)&&(this.reward1_4>100||this.reward1_4<0)){
    this.validationStatus = false ;
    this.errorPlace = 'Reward1 % must be between 1 & 100';
    this.showErrorMessage(this.errorPlace);
    return;
   }
   else if((this.reward2_4!=''||this.reward2_4!=null)&&(this.reward2_4>100||this.reward2_4<0)){
     this.validationStatus = false ;
     this.errorPlace = 'Reward2 % must be between 1 & 100';
     this.showErrorMessage(this.errorPlace);
     return;
   }
   else if((this.reward3_4!=''||this.reward3_4!=null)&&(this.reward3_4>100||this.reward3_4<0)){
     this.validationStatus = false ;
     this.errorPlace = 'Reward3 % must be between 1 & 100';
     this.showErrorMessage(this.errorPlace);
     return;
   }
   else if (this.lstTurnover[lstLength].fromAmt < 0) {
    this.validationStatus=false;
    this.errorPlace = 'Enter a valid from Amount';
    this.showErrorMessage(this.errorPlace);
    return;
  }
    else if (this.lstTurnover[lstLength].toAmt <= 0) {
      this.validationStatus=false;
      this.errorPlace = 'Enter a valid to Amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (this.lstTurnover[lstLength].toAmt < this.lstTurnover[lstLength].fromAmt) {
      this.validationStatus=false;
      this.errorPlace = 'To Amount must be greater than from amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (this.lstTurnover[lstLength].reward_to==0){
      this.validationStatus=false;
      this.errorPlace = 'Choose assign to';
      this.showErrorMessage(this.errorPlace);
      return; 
    }
    else if (this.lstTurnover[lstLength].slab1_percentage <= 0&&this.lstTurnover[lstLength].slab1_amount <= 0) {
      this.validationStatus=false;
      this.errorPlace = 'Enter valid reward1 percentage or reward1 amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if(!(this.reward2_4==null||this.reward2_4=='')){
      for (let index = 0; index < this.lstTurnover.length; index++) {
      let rawNo=index+1;
      
      if((this.lstTurnover[index].slab2_percentage==null&&this.lstTurnover[index].slab2_amount==null)||(this.lstTurnover[index].slab2_percentage==''&&this.lstTurnover[index].slab2_amount=='')||(this.lstTurnover[index].slab2_percentage<=0&&this.lstTurnover[index].slab2_amount<=0)||(this.lstTurnover[index].slab2_percentage>100)){
        this.validationStatus=false;
        this.errorPlace = 'Enter valid reward2 percentage or reward2 amount of raw '+rawNo;
        this.showErrorMessage(this.errorPlace);
        return;
      }
    }
  }

  if(!(this.reward3_4==null||this.reward3_4=='')){  
    for (let index = 0; index < this.lstTurnover.length; index++) {
      let rawNo=index+1;    
      if((this.lstTurnover[index].slab3_percentage==null&&this.lstTurnover[index].slab3_amount==null)||(this.lstTurnover[index].slab3_percentage==''&&this.lstTurnover[index].slab3_amount=='')||(this.lstTurnover[index].slab3_percentage<=0&&this.lstTurnover[index].slab3_amount<=0)||(this.lstTurnover[index].slab3_percentage>100)){
        this.validationStatus=false;
        this.errorPlace = 'Enter valid reward3 percentage or reward3 amount of raw '+rawNo;
        this.showErrorMessage(this.errorPlace);
        return;
      }
    }
    }
   
    else if (lstLength > 0 && this.lstTurnover[lstLength].fromAmt != this.lstTurnover[0].fromAmt) {
      this.validationStatus=false;
      this.errorPlace = 'Enter a valid from Amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }


    else if (lstLength > 0 && this.lstTurnover[lstLength].toAmt != this.lstTurnover[0].toAmt) {
      this.validationStatus=false;
      this.errorPlace = 'Enter a valid to Amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (lstLength > 0 && this.lstTurnover[lstLength].reward_mop != this.lstTurnover[0].reward_mop) {
      this.validationStatus=false;
      this.errorPlace = 'MOP doesnt match';
      this.showErrorMessage(this.errorPlace);
      return;
    }
  }

  saveDetails(){
    this.validationStatus=true;    

    if(this.tabName=='product'){
      this.validationStatus = true ;

      this.productValidation();

    if(this.validationStatus){
      this.pushed_items = {};      

      this.pushed_items['addrewards'] = this.lstProduct;
      let dateFrom = moment(this.fromDate1).format('DD/MM/YYYY');
      let dateTo = moment(this.toDate1).format('DD/MM/YYYY');

      this.pushed_items['fromDate'] = dateFrom;
      this.pushed_items['toDate'] = dateTo;
      this.pushed_items['areaType'] = this.areaType;
      this.pushed_items['LstArea'] = this.LstArea1;
      this.pushed_items['rewardName'] = this.rewardName1;
    
      // this.pushed_items['reward1'] = this.reward1_1;
      // this.pushed_items['reward2'] = this.reward2_1;
      // this.pushed_items['reward3'] = this.reward3_1;
      this.pushed_items['map_type'] = this.map_type;
    }

    }
   
    else if(this.tabName=='brand'){
      this.validationStatus = true ;

      this.brandValidation();

    if(this.validationStatus){
      this.pushed_items = {};      

      this.pushed_items['addrewards'] = this.lstBrand;
      let dateFrom = moment(this.fromDate5).format('DD/MM/YYYY');
      let dateTo = moment(this.toDate5).format('DD/MM/YYYY');

      this.pushed_items['fromDate'] = dateFrom;
      this.pushed_items['toDate'] = dateTo;
      this.pushed_items['areaType'] = this.areaType;
      this.pushed_items['LstArea'] = this.LstArea5;
      this.pushed_items['rewardName'] = this.rewardName5;
    
      this.pushed_items['map_type'] = this.map_type;
    }

    }
   
   

    else if(this.tabName=='item'){
      this.validationStatus = true ;
    
      let lstLength=this.lstItem.length-1;

      this.itemValidation();
      if(this.validationStatus==true){
        this.pushed_items = {};
        if(this.caption=='save'){
          for (let index = 0; index < this.lstItem.length; index++) {
                    // this.lstItem[index]['id']=this.productIdArr[index];
                    this.lstItem[index]['map_id']=this.itemIdArr[index];
                  }
        }
        
        this.pushed_items['addrewards'] = this.lstItem;

      let dateFrom = moment(this.fromDate2).format('DD/MM/YYYY');
      let dateTo = moment(this.toDate2).format('DD/MM/YYYY');

      this.pushed_items['fromDate'] = dateFrom;
      this.pushed_items['toDate'] = dateTo;
      this.pushed_items['areaType'] = this.areaType;
      this.pushed_items['LstArea'] = this.LstArea2;
      this.pushed_items['rewardName'] = this.rewardName2;
    
      // this.pushed_items['reward1'] = this.reward1_2;
      // this.pushed_items['reward2'] = this.reward2_2;
      // this.pushed_items['reward3'] = this.reward3_2;
      this.pushed_items['map_type'] = this.map_type;

      }
    }

    else if(this.tabName=='value'){      

    this.valueValidation();
 
     if(this.validationStatus){

      this.pushed_items = {};

      // for (let index = 0; index < this.lstValues.length; index++) {
      //   // this.lstItem[index]['id']=this.productIdArr[index];
      //   this.lstValues[index]['map_id']=this.branchIdArr[index];
      // }
       
      this.pushed_items['addrewards'] = this.lstValues;
      
      let dateFrom = moment(this.fromDate3).format('DD/MM/YYYY');
      let dateTo = moment(this.toDate3).format('DD/MM/YYYY');

      this.pushed_items['fromDate'] = dateFrom;
      this.pushed_items['toDate'] = dateTo;
      this.pushed_items['areaType'] = this.areaType3;
      this.pushed_items['LstArea'] = this.LstArea3;
      this.pushed_items['rewardName'] = this.rewardName3;
    
      this.pushed_items['reward1'] = this.reward1_3;
      this.pushed_items['reward2'] = this.reward2_3;
      this.pushed_items['reward3'] = this.reward3_3;
      this.pushed_items['map_type'] = this.map_type;

     }
 


    }

    else if(this.tabName=='turnover'){

      this.turnoverValidation();
  
      if(this.validationStatus){

        this.pushed_items = {};

        this.pushed_items['addrewards'] = this.lstTurnover;
 
       let dateFrom = moment(this.fromDate4).format('DD/MM/YYYY');
       let dateTo = moment(this.toDate4).format('DD/MM/YYYY');
 
       this.pushed_items['fromDate'] = dateFrom;
       this.pushed_items['toDate'] = dateTo;
      //  this.pushed_items['areaType'] = this.areaType;
       this.pushed_items['LstArea'] = this.LstArea4;
       this.pushed_items['rewardName'] = this.rewardName4;
     
       this.pushed_items['reward1'] = this.reward1_4;
       this.pushed_items['reward2'] = this.reward2_4;
       this.pushed_items['reward3'] = this.reward3_4;
       this.pushed_items['map_type'] = this.map_type;
 
      }
  
 
 
     }
 


      
    if(this.validationStatus==true){

     if(this.caption=='save'){

      this.serverService.postData("staff_rewards/add_reward/",this.pushed_items)
      .subscribe(
        (response) => {
            if (response['status'] == 1) {

              this.clearFields();

              Swal.fire({
                position: "center", 
                type: "success",
                text: "Data saved successfully",
                showConfirmButton: true,  
              });          

              if(this.action=='edit'){

                this.caption='save';
                this.action='save';
                localStorage.setItem("action",'save');

                this.clearFields();
                this.router.navigate(["/crm/rewardlist"]); 
              }else{
                this.router.navigate(["/crm/rewardlist"]); 
              }

              

            }  
            else {
              // this.toastr.error(response['reason']);
            }
        },
        (error) => {   
        });

     }

     else if(this.caption=='edit'){
       

      this.pushed_items['id']=localStorage.getItem('rewardId');

      this.serverService.postData("staff_rewards/add_reward/",this.pushed_items)
      .subscribe(
        (response) => {
            if (response['status'] == 1) {

              this.clearFields();

              Swal.fire({
                position: "center", 
                type: "success",
                text: "Data updated successfully",
                showConfirmButton: true,  
              });          


                this.caption='save';
                this.action='save';
                localStorage.setItem("action",'save');

                this.clearFields();

                this.isProductActive=true;
                this.isBrandActive=true;
                this.isItemActive=true;
                this.isValueActive=true;
                this.isTurnActive=true;
            
                this.router.navigate(["/crm/rewardlist"]); 

            }  
            else {
              // this.toastr.error(response['reason']);
            }
        },
        (error) => {   
        });
     }
      

      }  

  }
}
