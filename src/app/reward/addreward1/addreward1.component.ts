import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { ServerService } from '../../server.service';
import { TypeaheadService } from '../../typeahead.service';
import { Router } from '@angular/router';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { FormControl } from '@angular/forms'
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';
import * as moment from 'moment'
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { Console } from 'console';


@Component({
  selector: 'app-addreward1',
  templateUrl: './addreward1.component.html',
  styleUrls: ['./addreward1.component.scss']
})
export class Addreward1Component implements OnInit {



  tabName;
  tabIndex;
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
  toDate5=null;;

  fromDate6=null;
  toDate6=null;
  fromDate7=null;
  toDate7=null;

  validationStatus=true;
  flag=false;

  areaType = '';
  areaType1 = '';
  areaType2 = '';
  areaType3 = '';
  areaType5 = '';
  areaType6 = '';
  areaType7 = '';

  item_Name;



  LstArea1 = [];
  rewardName1 = '';
  LstArea2 = [];
  rewardName2 = '';
  lstArea3 = [];
  rewardName3 = '';
  LstArea4 = [];
  rewardName4 = '';
  LstArea5 = [];
  rewardName5 = '';
  lstArea6 =[];
  rewardName6='';
  lstArea7= [];
  rewardName7='';

  blnAddValue=false;
  blnAddPrice=false;


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


  lstProducts = [];
  productId;
  productIdArr=[];
  selectedProduct='';
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

  reward1_6=null;
  reward2_6=null;
  reward3_6=null;
  reward1_7=null;
  reward2_7=null;
  reward3_7=null;
  reward4_7=null;
  reward5_7=null;

  rewardDatas={};

  map_type=null;

  lstValues = [];
  lstPriceBand=[];

  pushed_items = {};
  errorPlace = '';

  isProductActive=true;
  isBrandActive=true;
  isItemActive=true;
  isValueActive=true;
  isPriceActive=true;

  selectType7='productType';
  selectType6='productType';

  priceType='priceband';
  showReward=false;

  intMapId6=5;
  intMapId7=8;


  dctSaveDetails={
    addrewards:{},
    fromDate:null,
    toDate:null
  };
  objectKeys = Object.keys;

lstItem=[]
lstAreas = []

isTurnActive=true;
lstTurnover=[];
intMapId4 = 13;
  constructor(
    private serverService: ServerService,
    private typeaheadObject: TypeaheadService,
    public toastr: ToastrService,
    vcr: ViewContainerRef,
    public router: Router,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.map_type=0;
    this.lstTabName=this.lstProduct;
    
    this.isProductActive=true;
    this.isBrandActive=true;
    this.isItemActive=true;
    this.isValueActive=true;
    this.isPriceActive=true;


    this.action =localStorage.getItem('action');
    // console.log("action",this.action);


    if(this.action=='edit'){

      this.caption='edit';

      this.getDetails();

      this.selProduct=false;    
      this.selBrand=false;
      this.selItem=false;

      localStorage.setItem('action','save');
      
    }
    else{
      this.tabName='value';

      localStorage.setItem('action','save');
      this.caption='save';
      this.action='save';
      this.selProduct=true;  
      this.selBrand=true;
      this.selItem=true;
      this.clearFields();
    }
    // console.log("tabindex",this.tabIndex,"tabname",this.tabName);
    
  }


  getDetails(){
    let id = {id: localStorage.getItem('rewardId')};
    this.serverService.postData('rewards_app/reward_list/',id).subscribe(
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
     
     
        if(this.rewardDatas['category']=='Product Value Wise'){

           this.tabIndex=0;
           this.tabName='value';
           this.isValueActive=true;
           this.isItemActive=false;
           this.isProductActive=false;
           this.isPriceActive=false;
           this.isBrandActive=false;
           this.isTurnActive = false;
           
          //  this.lstValues=this.rewardDatas['items'];
     
           this.fromDate6=this.rewardDatas['from_date'];
           this.toDate6=this.rewardDatas['to_date'];
     
           this.areaType6=this.areaType;
           this.intMapId6=this.rewardDatas['map_type'];
           this.selectType6='productType'
           this.getAreas();
           this.lstArea6=areaLst;
           this.rewardName6=this.rewardDatas['reward_name'];
         
           this.reward1_6=this.rewardDatas['slab1_percentage'];
           this.reward2_6=this.rewardDatas['slab2_percentage'];
           this.reward3_6=this.rewardDatas['slab3_percentage'];
           this.selProduct=true;
           this.lstValues=[];
           
           for (let index = 0; index < this.rewardDatas['items'].length; index++) {

            this.lstValues.push({
              strTypeName : this.rewardDatas['items'][index].product_name,
              map_id : this.rewardDatas['items'][index].map_id,      
              // fromAmt:this.rewardDatas['items'][index].value_from,
              // toAmt:this.rewardDatas['items'][index].value_to,
              slab1_percentage:this.rewardDatas['items'][index].slab1_percentage,
              slab1_amount:this.rewardDatas['items'][index].slab1_amount,
              slab2_percentage:this.rewardDatas['items'][index].slab2_percentage,
              slab2_amount:this.rewardDatas['items'][index].slab2_amount,
              slab3_percentage:this.rewardDatas['items'][index].slab3_percentage,
              slab3_amount:this.rewardDatas['items'][index].slab3_amount,
              reward_mop:this.rewardDatas['items'][index].mop_sale,
              reward_to:this.rewardDatas['items'][index].assign_id,
              map_type:this.rewardDatas['items'][index].map_type
            })
            
            this.selectedProduct=this.rewardDatas['items'][index].product_name;
        
            
           }
           
           }
           else if(this.rewardDatas['category']=='Brand Value Wise'){
            this.tabIndex=0;
            this.tabName='value';
            this.isValueActive=true;
            this.isItemActive=false;
            this.isProductActive=false;
            this.isPriceActive=false;
            this.isBrandActive=false;
            this.isTurnActive = false;
            
           //  this.lstValues=this.rewardDatas['items'];
      
            this.fromDate6=this.rewardDatas['from_date'];
            this.toDate6=this.rewardDatas['to_date'];
      
            this.intMapId6=this.rewardDatas['map_type'];
            this.selectType6='brandType'
            this.areaType6=this.areaType;
            this.getAreas();
            this.lstArea6=areaLst;
            this.rewardName6=this.rewardDatas['reward_name'];
          
            this.reward1_6=this.rewardDatas['slab1_percentage'];
            this.reward2_6=this.rewardDatas['slab2_percentage'];
            this.reward3_6=this.rewardDatas['slab3_percentage'];
            this.selProduct=true;
            this.lstValues=[];
            
            for (let index = 0; index < this.rewardDatas['items'].length; index++) {
 
             this.lstValues.push({
               strTypeName : this.rewardDatas['items'][index].brand_name,
               map_id : this.rewardDatas['items'][index].map_id,      
               // fromAmt:this.rewardDatas['items'][index].value_from,
               // toAmt:this.rewardDatas['items'][index].value_to,
               slab1_percentage:this.rewardDatas['items'][index].slab1_percentage,
               slab1_amount:this.rewardDatas['items'][index].slab1_amount,
               slab2_percentage:this.rewardDatas['items'][index].slab2_percentage,
               slab2_amount:this.rewardDatas['items'][index].slab2_amount,
               slab3_percentage:this.rewardDatas['items'][index].slab3_percentage,
               slab3_amount:this.rewardDatas['items'][index].slab3_amount,
               reward_mop:this.rewardDatas['items'][index].mop_sale,
               reward_to:this.rewardDatas['items'][index].assign_id,
               map_type:this.rewardDatas['items'][index].map_type
             })

             this.selectedBrand=this.rewardDatas['items'][index].brand_name;
         
         
             
            }

           }
           else if(this.rewardDatas['category']=='Item Value Wise'){
            this.tabIndex=0;
            this.tabName='value';
            this.isValueActive=true;
            this.isItemActive=false;
            this.isProductActive=false;
            this.isPriceActive=false;
            this.isBrandActive=false;
            this.isTurnActive = false;
            
           //  this.lstValues=this.rewardDatas['items'];
      
            this.fromDate6=this.rewardDatas['from_date'];
            this.toDate6=this.rewardDatas['to_date'];

            this.intMapId6=this.rewardDatas['map_type'];
            this.selectType6='itemType'
      
            this.areaType6=this.areaType;
            this.getAreas();
            this.lstArea6=areaLst;
            this.rewardName6=this.rewardDatas['reward_name'];
          
            this.reward1_6=this.rewardDatas['slab1_percentage'];
            this.reward2_6=this.rewardDatas['slab2_percentage'];
            this.reward3_6=this.rewardDatas['slab3_percentage'];
            this.selProduct=true;
            this.lstValues=[];
            
            for (let index = 0; index < this.rewardDatas['items'].length; index++) {
 
             this.lstValues.push({
               strTypeName : this.rewardDatas['items'][index].item_name,
               map_id : this.rewardDatas['items'][index].map_id,      
               // fromAmt:this.rewardDatas['items'][index].value_from,
               // toAmt:this.rewardDatas['items'][index].value_to,
               slab1_percentage:this.rewardDatas['items'][index].slab1_percentage,
               slab1_amount:this.rewardDatas['items'][index].slab1_amount,
               slab2_percentage:this.rewardDatas['items'][index].slab2_percentage,
               slab2_amount:this.rewardDatas['items'][index].slab2_amount,
               slab3_percentage:this.rewardDatas['items'][index].slab3_percentage,
               slab3_amount:this.rewardDatas['items'][index].slab3_amount,
               reward_mop:this.rewardDatas['items'][index].mop_sale,
               reward_to:this.rewardDatas['items'][index].assign_id,
               map_type:this.rewardDatas['items'][index].map_type
             })
         
             this.selectedItem=this.rewardDatas['items'][index].item_name;

             
            }

           }
           else if(this.rewardDatas['category']=='Product Price Band' || this.rewardDatas['category']=='Product Price Band Growth' || this.rewardDatas['category']=='Brand Price Band Growth'){
           this.lstArea7=[];
           this.tabIndex=1;
           this.tabName='priceband';
           this.isPriceActive=true;
           this.isValueActive=false;
           this.isItemActive=false;
           this.isProductActive=false;
           this.isBrandActive=false;
           this.isTurnActive = false;

           this.fromDate7=this.rewardDatas['from_date'];
           this.toDate7=this.rewardDatas['to_date'];
           this.intMapId7=this.rewardDatas['map_type'];
           this.selectType7='productType'
     
           this.areaType7=this.areaType;
           this.getAreas();
           this.lstArea7=areaLst;
           this.rewardName7=this.rewardDatas['reward_name'];

           if(this.rewardDatas['map_type']==10 || this.rewardDatas['map_type']==11){
            this.showReward=true; 
            this.priceType='pricebandgrowth';
            this.reward1_7=this.rewardDatas['slab1_percentage'];
            this.reward2_7=this.rewardDatas['slab2_percentage'];
            this.reward3_7=this.rewardDatas['slab3_percentage'];
            this.reward4_7=this.rewardDatas['slab4_percentage'];
            this.reward5_7=this.rewardDatas['slab5_percentage'];

           
            
            if(this.rewardDatas['map_type']==10){
              this.selectType7='productType';
            }
            else{
              this.selectType7='brandType';
            }

           }
           if(this.rewardDatas['map_type']==8 || this.rewardDatas['map_type']==9){
            this.showReward=false; 
            this.priceType='priceband';
            if(this.rewardDatas['map_type']==8){
              this.selectType7='productType';
            }
            else{
              this.selectType7='brandType';
            }

           }
         
           this.reward1_7=this.rewardDatas['slab1_percentage'];
           this.reward2_7=this.rewardDatas['slab2_percentage'];
           this.reward3_7=this.rewardDatas['slab3_percentage'];
           this.reward4_7=this.rewardDatas['slab4_percentage'];
           this.reward5_7=this.rewardDatas['slab5_percentage'];
           this.selProduct=true;
           this.lstValues=[];
           
           for (let index = 0; index < this.rewardDatas['items'].length; index++) {
             let type;
             if((this.rewardDatas['map_type']==10) || (this.rewardDatas['map_type']==8)){
              type=this.rewardDatas['items'][index].product_name;
              this.selectedProduct=this.rewardDatas['items'][index].product_name;

             }
             else{
              type=this.rewardDatas['items'][index].brand_name;
              this.selectedBrand=this.rewardDatas['items'][index].brand_name;

             }

            this.lstPriceBand.push({
              strTypeName : type,
              map_id : this.rewardDatas['items'][index].map_id,      
              fromAmt:this.rewardDatas['items'][index].value_from,
              toAmt:this.rewardDatas['items'][index].value_to,
              slab1_percentage:this.rewardDatas['items'][index].slab1_percentage,
              slab1_amount:this.rewardDatas['items'][index].slab1_amount,
              slab2_percentage:this.rewardDatas['items'][index].slab2_percentage,
              slab2_amount:this.rewardDatas['items'][index].slab2_amount,
              slab3_percentage:this.rewardDatas['items'][index].slab3_percentage,
              slab3_amount:this.rewardDatas['items'][index].slab3_amount,
              slab4_percentage:this.rewardDatas['items'][index].slab4_percentage,
              slab4_amount:this.rewardDatas['items'][index].slab4_amount,
              slab5_percentage:this.rewardDatas['items'][index].slab5_percentage,
              slab5_amount:this.rewardDatas['items'][index].slab5_amount,
              reward_mop:this.rewardDatas['items'][index].mop_sale,
              reward_to:this.rewardDatas['items'][index].assign_id
            })
        
                    
          }
           }
           else if(this.rewardDatas['category']=='Brand Price Band'){
            this.lstArea7=[];
            this.tabIndex=1;
            this.tabName='priceband';
            this.isPriceActive=true;
            this.isValueActive=false;
            this.isItemActive=false;
            this.isProductActive=false;
            this.isBrandActive=false;
            this.isTurnActive = false;
 
            this.fromDate7=this.rewardDatas['from_date'];
            this.toDate7=this.rewardDatas['to_date'];
            this.intMapId7=this.rewardDatas['map_type'];
            this.selectType7='brandType'
      
            this.areaType7=this.areaType;
            this.getAreas();
            this.lstArea7=areaLst;
            this.rewardName7=this.rewardDatas['reward_name'];
          
            this.reward1_7=this.rewardDatas['slab1_percentage'];
            this.reward2_7=this.rewardDatas['slab2_percentage'];
            this.reward3_7=this.rewardDatas['slab3_percentage'];
            this.reward4_7=this.rewardDatas['slab4_percentage'];
            this.reward5_7=this.rewardDatas['slab5_percentage'];
            this.selProduct=true;
            this.lstValues=[];
            
            for (let index = 0; index < this.rewardDatas['items'].length; index++) {
 
             this.lstValues.push({
               strTypeName : this.rewardDatas['items'][index].brand_name,
               map_id : this.rewardDatas['items'][index].map_id,      
               fromAmt:this.rewardDatas['items'][index].value_from,
               toAmt:this.rewardDatas['items'][index].value_to,
               slab1_percentage:this.rewardDatas['items'][index].slab1_percentage,
               slab1_amount:this.rewardDatas['items'][index].slab1_amount,
               slab2_percentage:this.rewardDatas['items'][index].slab2_percentage,
               slab2_amount:this.rewardDatas['items'][index].slab2_amount,
               slab3_percentage:this.rewardDatas['items'][index].slab3_percentage,
               slab3_amount:this.rewardDatas['items'][index].slab3_amount,
               slab4_percentage:this.rewardDatas['items'][index].slab4_percentage,
               slab4_amount:this.rewardDatas['items'][index].slab4_amount,
               slab5_percentage:this.rewardDatas['items'][index].slab5_percentage,
               slab5_amount:this.rewardDatas['items'][index].slab5_amount,
               reward_mop:this.rewardDatas['items'][index].mop_sale,
               reward_to:this.rewardDatas['items'][index].assign_id,
              //  map_type:this.rewardDatas['items'][index].map_type
             })
         
             this.selectedBrand=this.rewardDatas['items'][index].brand_name;
                     
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
            this.intMapId4=this.rewardDatas['map_type'];

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

    this.blnAddPrice=false;
    this.blnAddValue=false;

    this.fromDate1=null;
    this.fromDate2=null;
    this.fromDate3=null;
    this.fromDate4=null;
    this.fromDate5=null;

    this.fromDate6=null;
    this.fromDate7=null;
    this.toDate6=null;
    this.toDate7=null;

    this.toDate1=null;
    this.toDate2=null;
    this.toDate3=null;
    this.toDate4=null;
    this.toDate5=null;

    this.reward1_6=null;
    this.reward2_6=null;
    this.reward3_6=null;
    this.reward1_7=null;
    this.reward2_7=null;
    this.reward3_7=null;
    this.reward4_7=null;
    this.reward5_7=null;

    

    this.areaType = '';
    this.areaType1 = '';
    this.areaType2 = '';
    this.areaType6 = '';
    this.areaType5 = '';
    this.areaType6 ='';
    this.areaType7='';

    this.rewardName1 = '';
    this.rewardName2 = '';
    this.rewardName3 = '';
    this.rewardName4 = '';
    this.rewardName5 = '';
    this.rewardName6='';
    this.rewardName7='';

    this.branch_name='';
    this.selBranch=false;

    this.lstBranchs=[];

    this.LstArea1=[];
    this.LstArea2=[];
    this.lstArea6=[];
    this.LstArea4=[];
    this.LstArea5=[];
   

    this.lstValues=[{
      strTypeName : '',
      map_id : 0,      
      slab1_percentage:0,
      slab1_amount:0,
      slab2_percentage:null,
      slab2_amount:null,
      slab3_percentage:null,
      slab3_amount:null,
      reward_mop:true,
      reward_to:0,
      map_type:5
    }]




    this.lstPriceBand=[{
      strTypeName : '',
      fromAmt:0,
      toAmt:0,
      slab1_percentage:0,
      slab1_amount:0,
      slab2_percentage:null,
      slab2_amount:null,
      slab3_percentage:null,
      slab3_amount:null,
      slab4_percentage:null,
      slab4_amount:null,
      slab5_percentage:null,
      slab5_amount:null,
      reward_mop:false,
      reward_to:0,
      map_type: 8,  //product map_type
      map_id:0
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
      reward_to:0,
      map_type: 13,
    }]
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
              reward_to:0,
              map_type: 13,
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
              reward_to:0,
              map_type: 13,
            })
        }

      }
    }
    turnoverValidation(){

      this.validationStatus=true;

      let lstLength=this.lstTurnover.length-1;

      // this.lstTurnover[lstLength].map_id = this.productId

      if(this.fromDate4==null){
       this.validationStatus = false ;
       this.errorPlace = 'Select from date';
       this.showErrorMessage(this.errorPlace);
       return;
     }
     else if(this.toDate4==null){
       this.validationStatus = false ;
       this.errorPlace = 'Select to date';
       this.showErrorMessage(this.errorPlace);
       return;
     }
     else if(this.toDate4<this.fromDate4){
      this.validationStatus = false ;
      this.errorPlace = 'To date must be greater than from date';
      this.showErrorMessage(this.errorPlace);
      return;
    }
     else if (((this.selectedBranch=='' || this.selectedBranch== null)
     &&(!this.selBranch))||this.branch_name=='' || this.branch_name== null) {

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
    else if (this.reward2_4 == '' || this.reward2_4 == null) {
      this.validationStatus = false ;
      this.errorPlace = 'Reward2 is empty';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (this.reward3_4 == '' || this.reward3_4 == null) {
      this.validationStatus = false ;
      this.errorPlace = 'Reward3 is empty';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if((this.reward1_4!=''||this.reward1_4!=null)&&(this.reward1_4<100)){
      this.validationStatus = false ;
      this.errorPlace = 'Reward1 % must be greater than 100';
      this.showErrorMessage(this.errorPlace);
      return;
     }
     else if((this.reward2_4!=''||this.reward2_4!=null)&&(this.reward2_4<100)){
       this.validationStatus = false ;
       this.errorPlace = 'Reward2 % must be greater than 100';
       this.showErrorMessage(this.errorPlace);
       return;
     }
     else if((this.reward3_4!=''||this.reward3_4!=null)&&(this.reward3_4<100)){
       this.validationStatus = false ;
       this.errorPlace = 'Reward3 % must be greater than 100';
       this.showErrorMessage(this.errorPlace);
       return;
     }

    else if(this.reward2_4<this.reward1_4 || this.reward2_4==this.reward1_4){
      this.validationStatus =false;
      this.errorPlace ='Reward1 % must be lesser than Reward2 %';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    // else if((this.reward3_4!=''||this.reward3_4!=null)&&(this.reward3_4>100||this.reward3_4<0)){
    //   this.validationStatus = false ;
    //   this.errorPlace = 'Reward3 % must be between 1 & 100';
    //   this.showErrorMessage(this.errorPlace);
    //   return;
    // }
  
    // else if((this.reward3_4!=''||this.reward3_4!=null)&&(this.reward3_4>100||this.reward3_4<0)){
    //   this.validationStatus = false ;
    //   this.errorPlace = 'Reward3 % must be between 1 & 100';
    //   this.showErrorMessage(this.errorPlace);
    //   return;
    // }
    else if(this.reward3_4<this.reward2_4 || this.reward3_4==this.reward2_4){
      this.validationStatus =false;
      this.errorPlace ='Reward2 % must be lesser than Reward3 %';
      this.showErrorMessage(this.errorPlace);
      return;
    }
  // ==========================================================================================================================
    //  else if (this.lstTurnover[lstLength].fromAmt < 0) {
    //   this.validationStatus=false;
    //   this.errorPlace = 'Enter a valid from Amount';
    //   this.showErrorMessage(this.errorPlace);
    //   return;
    // }
      else if (this.lstTurnover[lstLength].toAmt <= 0) {
        this.validationStatus=false;
        this.errorPlace = 'Enter a valid to Amount';
        this.showErrorMessage(this.errorPlace);
        return;
      }
      // else if (this.lstTurnover[lstLength].toAmt < this.lstTurnover[lstLength].fromAmt) {
      //   this.validationStatus=false;
      //   this.errorPlace = 'To Amount must be greater than from amount';
      //   this.showErrorMessage(this.errorPlace);
      //   return;
      // }
      else if (this.lstTurnover[lstLength].reward_to==0){
        this.validationStatus=false;
        this.errorPlace = 'Choose assign to';
        this.showErrorMessage(this.errorPlace);
        return;
      }
      // else if (this.lstTurnover[lstLength].slab1_percentage <= 0&&this.lstTurnover[lstLength].slab1_amount <= 0) {
      //   this.validationStatus=false;
      //   this.errorPlace = 'Enter valid reward1 percentage or reward1 amount';
      //   this.showErrorMessage(this.errorPlace);
      //   return;
      // }
      else if(!(this.reward2_4==null||this.reward2_4=='')){
        for (let index = 0; index < this.lstTurnover.length; index++) {
        let rawNo=index+1;

        if((this.lstTurnover[index].slab2_percentage==null&&
          this.lstTurnover[index].slab2_amount==null)||
          (this.lstTurnover[index].slab2_percentage==''&&
          this.lstTurnover[index].slab2_amount=='')||
          (this.lstTurnover[index].slab2_percentage<=0&&
            this.lstTurnover[index].slab2_amount<=0)||
            (this.lstTurnover[index].slab2_percentage>100)){
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
        if((this.lstTurnover[index].slab3_percentage==null
          &&this.lstTurnover[index].slab3_amount==null)||(this.lstTurnover[index].slab3_percentage==''
          &&this.lstTurnover[index].slab3_amount=='')||(this.lstTurnover[index].slab3_percentage<=0
            &&this.lstTurnover[index].slab3_amount<=0)||(this.lstTurnover[index].slab3_percentage>100)){
          this.validationStatus=false;
          this.errorPlace = 'Enter valid reward3 percentage or reward3 amount of raw '+rawNo;
          this.showErrorMessage(this.errorPlace);
          return;
        }
      }
      }

      // else if (lstLength > 0 && this.lstTurnover[lstLength].fromAmt != this.lstTurnover[0].fromAmt) {
      //   this.validationStatus=false;
      //   this.errorPlace = 'Enter a valid from Amount';
      //   this.showErrorMessage(this.errorPlace);
      //   return;
      // }
      // else if (lstLength > 0 && this.lstTurnover[lstLength].toAmt != this.lstTurnover[0].toAmt) {
      //   this.validationStatus=false;
      //   this.errorPlace = 'Enter a valid to Amount';
      //   this.showErrorMessage(this.errorPlace);
      //   return;
      // }
      else if (lstLength > 0 && this.lstTurnover[lstLength].reward_mop != this.lstTurnover[0].reward_mop) {
        this.validationStatus=false;
        this.errorPlace = 'MOP doesnt match';
        this.showErrorMessage(this.errorPlace);
        return;
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
  BranchChanged(branch) {


    this.branchId=branch.id;
    this.LstArea4 = []
    this.LstArea4.push(branch.id);

    this.selectedBranch = this.branch_name = branch.name;

  }
  setTabName(event){
    this.map_type=event.index;
    
    // this.clearFields();

    if(event.index==0){
      this.lstProducts = [];
      this.tabName='value';
      this.lstTabName=this.lstValues;      
    } 
    else if(event.index==1){
      this.lstBrands = [];
      this.tabName='priceband';
      this.lstTabName=this.lstPriceBand;
      // this.map_type++;
    }
    else if(event.index==2){
      this.tabName='turnover';
      this.lstTabName=this.lstTurnover;
    //   this.lstProducts = [];
    //   this.lstItems = [];
    //   this.tabName='item';
    //   this.lstTabName=this.lstItem;
    //   // this.map_type++;
    // } else if(event.index==3){
    //   this.lstProducts = [];
    //   this.tabName='value';
    //   // this.map_type++;
    //   this.lstTabName=this.lstValues;
    // } else if(event.index==4){
    //   this.tabName='turnover';
    //   this.lstTabName=this.lstPriceBand;
    //   // this.map_type++;
    } 
  }

  setMapType(){


    this.lstValues=[{
      strTypeName : '',
      map_id : 0,      
      slab1_percentage:0,
      slab1_amount:0,
      slab2_percentage:null,
      slab2_amount:null,
      slab3_percentage:null,
      slab3_amount:null,
      reward_mop:true,
      reward_to:0,
      map_type:5
    }]




    this.lstPriceBand=[{
      strTypeName : '',
      fromAmt:0,
      toAmt:0,
      slab1_percentage:0,
      slab1_amount:0,
      slab2_percentage:null,
      slab2_amount:null,
      slab3_percentage:null,
      slab3_amount:null,
      slab4_percentage:null,
      slab4_amount:null,
      slab5_percentage:null,
      slab5_amount:null,
      reward_mop:false,
      reward_to:0,
      map_type: 8,  //product map_type
      map_id:0
    }]


    let lstLength6=this.lstValues.length-1;
    let lstLength7=this.lstPriceBand.length-1;
    
    if(this.tabName=='value') {
      if(this.selectType6=='productType'){ this.intMapId6=5 }
      if(this.selectType6=='brandType'){ this.intMapId6=6}
      if(this.selectType6=='itemType'){ this.intMapId6=7}
      this.selectedProduct='';
      this.selectedBrand='';
      this.selectedItem='';
      this.lstValues[lstLength6].map_type=this.intMapId6;
      
    }
    else if(this.tabName=='priceband'){
      if(this.selectType7=='productType'){ this.intMapId7=8 }
      if(this.selectType7=='brandType'){ this.intMapId7=9 }  
      this.selectedProduct='';
      this.selectedBrand='';
      this.lstPriceBand[lstLength7].map_type=this.intMapId7
    }
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
      this.lstArea6=[];
      dctArea['area_type'] = this.areaType6;
      this.areaType=this.areaType6;
    }
    else if(this.tabName=='priceband'){
      this.lstArea7=[];
      dctArea['area_type']=this.areaType7;
      this.areaType=this.areaType7

    }

   
    this.serverService.postData("staff_rewards/area_search/",dctArea)
        .subscribe(
          (response) => {
              if (response['status'] == 1) {
                this.lstAreas = response['data']
              }  
              else {
                // this.toastr.error(response['reason']);
                // this.toastr.error('Error!',response['reason']);
              }
          },
          (error) => {   
          });
  }


  ProductChanged(product,index) {
    

    
    
    if(this.tabName=='value'){
      this.lstValues[index]['map_id']=null;
      this.lstValues[index]['strTypeName']='';
    }
    else if(this.tabName=='priceband'){
      this.lstPriceBand[index]['map_id']=null;
      this.lstPriceBand[index]['strTypeName']=''

    }


    this.productId=product.id;
    this.selectedProduct = product.name;

    if(this.tabName=='priceband'){

      let lstLength=this.lstProduct.length-1;
   
      
      this.lstPriceBand[index].map_id = this.productId
  
    }

    if(this.tabName=='value'){
      let lstLength=this.lstValues.length-1;
      this.lstValues[index].map_id = this.productId
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

productSearched(data,event){        

  if (event.keyCode === 8|| event.keyCode === 38|| event.keyCode === 40|| event.keyCode === 13) {
    if (data === undefined || data === null || data === '') {

      let lstLen=this.lstValues.length-1;
      this.itemId=0;
      // this.lstValues[lstLen].map_id='';
      // this.lstValues[lstLen].item_name='';
      // this.lstItems=[];
      // this.lstProducts = [];
      // this.lstValues=[];
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
BrandChanged(brand,index) {    
    
  this.brandId=brand.id;
  this.selectedBrand = brand.name;

  if(this.tabName=='value'){
    this.lstValues[index].map_id = this.brandId;
  }
  else if(this.tabName=='priceband') {
    this.lstPriceBand[index].map_id=this.brandId;
  }

    // let lstLength=this.lstBrand.length-1;
    // this.lstBrand[index].map_id = this.brandId

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
    // pushedItems['productId'] = 0;

    if (data === undefined || data === null) {
    } else {
      if (data.length > 1) {
        this.lstItems = [];
        this.typeaheadObject
          .searchItem(data)
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

ItemChanged(item,index) {
    
  let lstLen=this.lstItem.length-1;
  this.itemId=item.id;
  // this.lstValues[index]['map_id']=this.itemId;
  this.itemIdArr.push(item.id);
  this.selectedItem = item.name;

  if(this.tabName=='value'){
    this.lstValues[index].map_id=this.itemId;
  }
  else if(this.tabName=='priceband'){
    this.lstPriceBand[index].map_id=this.itemId;
  }
}

saveDetails(){
  
  this.validationStatus=true;    


 

   if(this.tabName=='value'){      

  this.valueValidation();

   if(this.validationStatus){

    this.pushed_items = {};

    // for (let index = 0; index < this.lstValues.length; index++) {
    //   // this.lstItem[index]['id']=this.productIdArr[index];
    //   this.lstValues[index]['map_id']=this.branchIdArr[index];
    // }
     
    this.pushed_items['addrewards'] = this.lstValues;
    
    let dateFrom = moment(this.fromDate6).format('DD/MM/YYYY');
    let dateTo = moment(this.toDate6).format('DD/MM/YYYY');

    this.pushed_items['fromDate'] = dateFrom;
    this.pushed_items['toDate'] = dateTo;
    this.pushed_items['areaType'] = this.areaType6;
    this.pushed_items['LstArea'] = this.lstArea6;
    this.pushed_items['rewardName'] = this.rewardName6;
  
    this.pushed_items['reward1'] = this.reward1_6;
    this.pushed_items['reward2'] = this.reward2_6;
    this.pushed_items['reward3'] = this.reward3_6;
    // this.pushed_items['map_type'] = this.map_type;
    
    this.pushed_items['map_type']=Number(this.intMapId6)
    
   }



  }
  else if(this.tabName=='priceband'){      

    this.priceBandValidation();
     if(this.validationStatus){
  
      this.pushed_items = {};
  
      // for (let index = 0; index < this.lstValues.length; index++) {
      //   // this.lstItem[index]['id']=this.productIdArr[index];
      //   this.lstValues[index]['map_id']=this.branchIdArr[index];
      // }
       
      this.pushed_items['addrewards'] = this.lstPriceBand;
      
      let dateFrom = moment(this.fromDate7).format('DD/MM/YYYY');
      let dateTo = moment(this.toDate7).format('DD/MM/YYYY');
  
      this.pushed_items['fromDate'] = dateFrom;
      this.pushed_items['toDate'] = dateTo;
      this.pushed_items['areaType'] = this.areaType7;
      this.pushed_items['LstArea'] = this.lstArea7;
      this.pushed_items['rewardName'] = this.rewardName7;
    
      this.pushed_items['reward1'] = this.reward1_7;
      this.pushed_items['reward2'] = this.reward2_7;
      this.pushed_items['reward3'] = this.reward3_7;
      this.pushed_items['reward4'] = this.reward4_7;
      this.pushed_items['reward5'] = this.reward5_7;


      // this.pushed_items['map_type'] = this.map_type;
      this.pushed_items['map_type']=this.intMapId7
  
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
       this.pushed_items['areaType'] = 'BRANCH';
       this.pushed_items['LstArea'] = this.LstArea4;
       this.pushed_items['rewardName'] = this.rewardName4;
     
       this.pushed_items['reward1'] = this.reward1_4;
       this.pushed_items['reward2'] = this.reward2_4;
       this.pushed_items['reward3'] = this.reward3_4;
       this.pushed_items['map_type'] = 13;
 
      }
  
 
 
     }

    
  if(this.validationStatus==true){

   if(this.caption=='save'){

    this.serverService.postData("rewards_app/add_reward/",this.pushed_items)
    .subscribe(
      (response) => {
          if (response['status'] == 1) {

            this.clearFields();

            swal.fire({
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
              this.router.navigate(["/crm/reward1list"]); 
            }else{
              this.router.navigate(["/crm/reward1list"]); 
            }

            

          }  
          else {
            // this.toastr.error(response['status']);
            // this.toastr.error('Error!',response['reason']);
          }
      },
      (error) => {   
      });

   }

   else if(this.caption=='edit'){
     

    this.pushed_items['id']=localStorage.getItem('rewardId');

    this.serverService.postData("rewards_app/add_reward/",this.pushed_items)
    .subscribe(
      (response) => {
          if (response['status'] == 1) {

            this.clearFields();

            swal.fire({
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
              this.isPriceActive=true;
          
              this.router.navigate(["/crm/reward1list"]); 

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
addValue(){


  this.validationStatus=true;
  this.lstProducts=[];
  
this.valueValidation();
this.blnAddValue=true;


  let lstLength=this.lstValues.length-1;

   if(this.validationStatus){ 
     
    if(this.caption=='save'){
      if(this.selectType6=='productType'){
        this.lstValues[lstLength].map_id = this.productId;
      }
      else if(this.selectType6=='brandType'){
        this.lstValues[lstLength].map_id = this.brandId;
      }
      else if(this.selectType6=='itemType'){
        this.lstValues[lstLength].map_id = this.itemId;
      }
      this.lstValues[lstLength].map_type =this.intMapId6;
    }
    if (this.lstValues.length > 0) {
      this.lstValues.push(
        {
          strTypeName : this.lstValues[0]['strTypeName'],
          map_id : this.lstValues[0]['map_id'],      
          slab1_percentage:0,
          slab1_amount:0,
          slab2_percentage:null,
          slab2_amount:null,
          slab3_percentage:null,
          slab3_amount:null,
          reward_mop:this.lstValues[0]['reward_mop'],
          reward_to:0,
          map_type:this.intMapId6
        })
    }
    else{
      this.lstValues.push(
        {
          strTypeName : '',
          map_id : 0,      
          slab1_percentage:0,
          slab1_amount:0,
          slab2_percentage:null,
          slab2_amount:null,
          slab3_percentage:null,
          slab3_amount:null,
          reward_mop:true,
          reward_to:0,
          map_type:null
        })
    }
    
  }

}

addPriceBand(){

  this.priceBandValidation();
  this.blnAddPrice=true;

  let lstLength=this.lstPriceBand.length-1;

  if(this.validationStatus){ 
    
   if(this.caption=='save'){

    if(this.selectType7=='productType'){
      this.lstPriceBand[lstLength].map_id = this.productId;
    }
    else if(this.selectType7=='brandType'){
      this.lstPriceBand[lstLength].map_id = this.brandId;
    }
    this.lstPriceBand[lstLength].map_type =this.intMapId7;
   }
   if (this.lstPriceBand.length > 0) {
     this.lstPriceBand.push(
       {
         strTypeName : this.lstPriceBand[0]['strTypeName'],
         map_id : this.lstPriceBand[0]['map_id'],      
         fromAmt:this.lstPriceBand[0]['fromAmt'],
         toAmt:this.lstPriceBand[0]['toAmt'],
         slab1_percentage:0,
         slab1_amount:0,
         slab2_percentage:null,
         slab2_amount:null,
         slab3_percentage:null,
         slab3_amount:null,
         slab4_percentage:null,
         slab4_amount:null,
         slab5_percentage:null,
         slab5_amount:null,
         reward_mop:this.lstPriceBand[0]['reward_mop'],
         reward_to:0,
         map_type:0
         
       })
   }
   else{
     this.lstPriceBand.push(
       {
         strTypeName : '',
         map_id : 0,      
         fromAmt:0,
         toAmt:0,
         slab1_percentage:0,
         slab1_amount:0,
         slab2_percentage:null,
         slab2_amount:null,
         slab3_percentage:null,
         slab3_amount:null,
         slab4_percentage:null,
         slab4_amount:null,
         slab5_percentage:null,
         slab5_amount:null,
         reward_mop:false,
         reward_to:0,
         map_type:null
       })
   }
   
 }

}
valueValidation(){
  
    

  let fromDate
  let toDate
  fromDate = this.datepipe.transform(this.fromDate6,'yyyy-MM-dd')
  toDate = this.datepipe.transform(this.toDate6,'yyyy-MM-dd')
  this.validationStatus = true ;

  // let lstLength=this.lstValues.length-1;


  // if(this.caption=='save'){
  //   this.lstValues[lstLength].map_id = this.productId;
  // }
  
// console.log("lstvalues",this.lstValues);

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
 } else if (this.lstArea6.length == 0) {
   this.validationStatus = false ;
   this.errorPlace = 'Select at least one Area';
   this.showErrorMessage(this.errorPlace);
   return;
 } else if (this.rewardName6 == '' || this.rewardName6 == null) {
   this.validationStatus = false ;
   this.errorPlace = 'Reward name is empty';
   this.showErrorMessage(this.errorPlace);
   return;
 }
 else if (this.reward1_6 == ''|| this.reward1_6 == null) {
   this.validationStatus = false ;
   this.errorPlace = 'Reward1 is empty';
   this.showErrorMessage(this.errorPlace);
   return;
 }
 else if((this.reward1_6!=''||this.reward1_6!=null)&&(this.reward1_6>100||this.reward1_6<0)){
   this.validationStatus = false ;
   this.errorPlace = 'Reward1 % must be between 1 & 100';
   this.showErrorMessage(this.errorPlace);
   return;
  }
  else if((this.reward2_6!=''||this.reward2_6!=null)&&(this.reward2_6>100||this.reward2_6<0)){
    this.validationStatus = false ;
    this.errorPlace = 'Reward2 % must be between 1 & 100';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if(this.reward1_6<this.reward2_6 || this.reward1_6==this.reward2_6){
    this.validationStatus =false;
    this.errorPlace ='Reward2 % must be lesser than Reward1 %';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if(this.reward2_6==null&&this.reward3_6!=null){
    this.validationStatus = false ;
    this.errorPlace = 'Enter valid Reward2 %';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if((this.reward3_6!=''||this.reward3_6!=null)&&(this.reward3_6>100||this.reward3_6<0)){
    this.validationStatus = false ;
    this.errorPlace = 'Reward3 % must be between 1 & 100';
    this.showErrorMessage(this.errorPlace);
    return;
  }

  else if((this.reward2_6<this.reward3_6 || this.reward2_6==this.reward3_6)&&(this.reward2_6!=null)){
    this.validationStatus =false;
    this.errorPlace ='Reward3 % must be lesser than Reward2 %';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if(!this.selectType6){
    this.validationStatus=false;
    this.errorPlace = 'Select a Type';
    this.showErrorMessage(this.errorPlace);
    return;
  }

  for(let lstLength in this.lstValues){
    // console.log("lstlength",lstLength);
    
    if((this.lstValues[lstLength].strTypeName==''||this.lstValues[lstLength].strTypeName==null)&&this.intMapId6==5){
      this.validationStatus=false;
      this.errorPlace = 'Please fill Product Name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    if((this.lstValues[lstLength].strTypeName==''||this.lstValues[lstLength].strTypeName==null) && this.intMapId6==6){
      this.validationStatus=false;
      this.errorPlace = 'Please fill Brand Name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if((this.lstValues[lstLength].strTypeName==''||this.lstValues[lstLength].strTypeName==null) && this.intMapId6==7){
      this.validationStatus=false;
      this.errorPlace = 'Please fill Item Name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (((this.lstValues[lstLength].strTypeName !=this.selectedProduct)&&(this.intMapId6==5))){
      this.validationStatus=false;
      this.errorPlace = 'Please provide correct product name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (((this.lstValues[lstLength].strTypeName !=this.selectedBrand)&&(this.intMapId6==6))){
      this.validationStatus=false;
      this.errorPlace = 'Please provide correct brand name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (((this.lstValues[lstLength].strTypeName !=this.selectedItem)&&(this.intMapId6==7))){
      this.validationStatus=false;
      this.errorPlace = 'Please provide correct item name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    // else if (this.lstValues[lstLength].fromAmt < 0) {
    //   this.validationStatus=false;
    //   this.errorPlace = 'Enter a valid from Amount';
    //   this.showErrorMessage(this.errorPlace);
    //   return;
    // }
  
    // else if (this.lstValues[lstLength].toAmt <= 0) {
    //   this.validationStatus=false;
    //   this.errorPlace = 'Enter a valid to Amount';
    //   this.showErrorMessage(this.errorPlace);
    //   return;
    // }
    // else if (this.lstValues[lstLength].toAmt < this.lstValues[lstLength].fromAmt) {
    //   this.validationStatus=false;
    //   this.errorPlace = 'To Amount must be greater than from amount';
    //   this.showErrorMessage(this.errorPlace);
    //   return;
    // }
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
    else if(!(this.reward2_6==null||this.reward2_6=='')){
  
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
   else if(this.reward2_6==null||this.reward2_6==''){
  
    for (let index = 0; index < this.lstValues.length; index++) {
    let rawNo=index+1;
    
     if(!((this.lstValues[index].slab2_percentage==null&&this.lstValues[index].slab2_amount==null)||(this.lstValues[index].slab2_percentage==''&&this.lstValues[index].slab2_amount=='')||(this.lstValues[index].slab2_percentage<=0&&this.lstValues[index].slab2_amount<=0)||(this.lstValues[index].slab2_percentage>100))){
     this.validationStatus=false;
     this.errorPlace = 'Enter valid reward2 percentage';
     this.showErrorMessage(this.errorPlace);
     return;
     }
    }

  
 }
  if(!(this.reward3_6==null||this.reward3_6=='')){
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
   else if(this.reward3_6==null||this.reward3_6==''){
    for (let index = 0; index < this.lstValues.length; index++) {
      let rawNo=index+1;
  
     if(!((this.lstValues[index].slab3_percentage==null&&this.lstValues[index].slab3_amount==null)||(this.lstValues[index].slab3_percentage==''&&this.lstValues[index].slab3_amount=='')||(this.lstValues[index].slab3_percentage<=0&&this.lstValues[index].slab3_amount<=0)||(this.lstValues[index].slab3_percentage>100))){
       this.validationStatus=false;
       this.errorPlace = 'Enter valid reward3 percentage';
       this.showErrorMessage(this.errorPlace);
       return;
     }
    }
   }
    else if ((this.lstValues[lstLength].strTypeName != this.lstValues[0].strTypeName || this.lstValues[lstLength].map_id != this.lstValues[0].map_id)) {
      this.validationStatus=false;
      this.errorPlace = 'Type name does not match';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    // else if (lstLength > 0 && this.lstValues[lstLength].fromAmt != this.lstValues[0].fromAmt) {
    //   this.validationStatus=false;
    //   this.errorPlace = 'Enter a valid from Amount';
    //   this.showErrorMessage(this.errorPlace);
    //   return;
    // }
    // else if (lstLength > 0 && this.lstValues[lstLength].toAmt != this.lstValues[0].toAmt) {
    //   this.validationStatus=false;
    //   this.errorPlace = 'Enter a valid to Amount';
    //   this.showErrorMessage(this.errorPlace);
    //   return;
    // }
    else if (this.lstValues[lstLength].reward_mop != this.lstValues[0].reward_mop) {
      this.validationStatus=false;
      this.errorPlace = 'MOP does not match';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if(this.lstValues.length > 0){
      for(let index=0; index<this.lstValues.length; index++){
        
        if (index!=Number(lstLength)) {
          
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


}

showRewards(){
  if(this.priceType=='pricebandgrowth'){
    if(this.selectType7=='productType'){ this.intMapId7=10 }
    if(this.selectType7=='brandType'){ this.intMapId7=11 }  
    this.showReward=true;
  }
  else{
    this.showReward=false;

  }
}


priceBandValidation(){
  
    

  let fromDate
  let toDate
  fromDate = this.datepipe.transform(this.fromDate7,'yyyy-MM-dd')
  toDate = this.datepipe.transform(this.toDate7,'yyyy-MM-dd')
  this.validationStatus = true ;

  let lstLength=this.lstPriceBand.length-1;


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
 } else if (this.lstArea7.length == 0) {
   this.validationStatus = false ;
   this.errorPlace = 'Select at least one Area';
   this.showErrorMessage(this.errorPlace);
   return;
 } else if (this.rewardName7 == '' || this.rewardName7 == null) {
   this.validationStatus = false ;
   this.errorPlace = 'Reward name is empty';
   this.showErrorMessage(this.errorPlace);
   return;
 }
 else if ((this.reward1_7 == ''|| this.reward1_7 == null)&&(this.priceType=='pricebandgrowth')) {
   this.validationStatus = false ;
   this.errorPlace = 'Enter valid reward1%';
   this.showErrorMessage(this.errorPlace);
   return;
 }
 else if((this.reward1_7!=''||this.reward1_7!=null)&&(this.reward1_7>100||this.reward1_7<0)){
   this.validationStatus = false ;
   this.errorPlace = 'Reward1 % must be between 1 & 100';
   this.showErrorMessage(this.errorPlace);
   return;
  }
  else if((this.reward2_7!=''||this.reward2_7!=null)&&(this.reward2_7>100||this.reward2_7<0)){
    this.validationStatus = false ;
    this.errorPlace = 'Reward2 % must be between 1 & 100';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if((this.reward1_7 >= this.reward2_7)&&(this.reward2_7!=''&&this.reward2_7!=null)){
    this.validationStatus =false;
    this.errorPlace ='Reward2 % must be greater than Reward1 %';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if((this.reward3_7!=''||this.reward3_7!=null)&&(this.reward3_7>100||this.reward3_7<0)){
    this.validationStatus = false ;
    this.errorPlace = 'Reward3 % must be between 1 & 100';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if((this.reward2_7>=this.reward3_7)&&(this.reward3_7!=''&&this.reward3_7!=null)){
    this.validationStatus =false;
    this.errorPlace ='Reward3 % must be greater than Reward2 %';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if((this.reward4_7!=''||this.reward4_7!=null)&&(this.reward4_7>100||this.reward4_7<0)){
    this.validationStatus = false ;
    this.errorPlace = 'Reward4 % must be between 1 & 100';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if((this.reward3_7 >=this.reward4_7)&&(this.reward4_7!=''&&this.reward4_7!=null)){
    this.validationStatus =false;
    this.errorPlace ='Reward4 % must be greater than Reward3 %';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if((this.reward5_7!=''||this.reward5_7!=null)&&(this.reward5_7>100||this.reward5_7<0)){
    this.validationStatus = false ;
    this.errorPlace = 'Reward5 % must be between 1 & 100';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if((this.reward4_7>=this.reward5_7)&&(this.reward5_7!=''&&this.reward5_7!=null)){
    this.validationStatus =false;
    this.errorPlace ='Reward5 % must be greater than Reward4 %';
    this.showErrorMessage(this.errorPlace);
    return;
  }
  else if(!this.selectType7){
    this.validationStatus=false;
    this.errorPlace = 'Select a Type';
    this.showErrorMessage(this.errorPlace);
    return;
  }

  for(let lstLength in this.lstPriceBand){
    if((this.lstPriceBand[lstLength].strTypeName==''||this.lstPriceBand[lstLength].strTypeName==null) && (this.intMapId7==8||this.intMapId7==10)){
      this.validationStatus=false;
      this.errorPlace = 'Please Select Product Name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if((this.lstPriceBand[lstLength].strTypeName==''||this.lstPriceBand[lstLength].strTypeName==null) && (this.intMapId7==9||this.intMapId7==11)){
      this.validationStatus=false;
      this.errorPlace = 'Please Select Brand Name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (((this.lstPriceBand[lstLength].strTypeName !=this.selectedProduct)&&(this.intMapId7==8||this.intMapId7==10))){
      this.validationStatus=false;
      this.errorPlace = 'Please enter valid product name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (((this.lstPriceBand[lstLength].strTypeName !=this.selectedBrand)&&(this.intMapId7==9||this.intMapId7==11))){
      this.validationStatus=false;
      this.errorPlace = 'Please enter valid brand name';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    // else if (((this.lstValues[lstLength].strTypeName !=this.selectedItem)&&(this.intMapId6==7))){
    //   this.validationStatus=false;
    //   this.errorPlace = 'Please fill item name';
    //   this.showErrorMessage(this.errorPlace);
    //   return;
    // }
    else if (this.lstPriceBand[lstLength].fromAmt < 0) {
      this.validationStatus=false;
      this.errorPlace = 'Enter a valid from Amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
  
    else if (this.lstPriceBand[lstLength].toAmt <= 0) {
      this.validationStatus=false;
      this.errorPlace = 'Enter a valid to Amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (this.lstPriceBand[lstLength].toAmt < this.lstPriceBand[lstLength].fromAmt) {
      this.validationStatus=false;
      this.errorPlace = 'To Amount must be greater than from amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (this.lstPriceBand[lstLength].reward_to==0){
     this.validationStatus=false;
      this.errorPlace = 'Choose assign to';
      this.showErrorMessage(this.errorPlace);
      return; 
    }
    else if (this.lstPriceBand[lstLength].slab1_percentage == 0&&this.lstPriceBand[lstLength].slab1_amount == 0) {
      
      this.validationStatus=false;
      this.errorPlace = 'Please fill reward1 percentage or reward1 amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if(!(this.reward2_7==null||this.reward2_7=='')){
  
      for (let index = 0; index < this.lstPriceBand.length; index++) {
      let rawNo=index+1;
      
       if((this.lstPriceBand[index].slab2_percentage==null&&this.lstPriceBand[index].slab2_amount==null)||(this.lstPriceBand[index].slab2_percentage==''
       &&this.lstPriceBand[index].slab2_amount=='')||(this.lstPriceBand[index].slab2_percentage<=0&&this.lstPriceBand[index].slab2_amount<=0)||(this.lstPriceBand[index].slab2_percentage>100)){
       this.validationStatus=false;
       this.errorPlace = 'Enter valid reward2 percentage or reward2 amount of row '+rawNo;
       this.showErrorMessage(this.errorPlace);
       return;
       }
      }
  
    
   }
   else if(this.reward2_7==null||this.reward2_7==''){
     
    for (let index = 0; index < this.lstPriceBand.length; index++) {
      let rawNo=index+1;
      
       if((this.lstPriceBand[index].slab2_percentage!=null||this.lstPriceBand[index].slab2_amount!=null)&&(this.lstPriceBand[index].slab2_percentage!=''
       ||this.lstPriceBand[index].slab2_amount!='')){
       this.validationStatus=false;
       this.errorPlace = 'Enter valid reward2%';
       this.showErrorMessage(this.errorPlace);
       return;
       }
      }
   }

  if(!(this.reward3_7==null||this.reward3_7=='')){
    for (let index = 0; index < this.lstPriceBand.length; index++) {
      let rawNo=index+1;
  
     if((this.lstPriceBand[index].slab3_percentage==null&&this.lstPriceBand[index].slab3_amount==null)||(this.lstPriceBand[index].slab3_percentage==''
     &&this.lstPriceBand[index].slab3_amount=='')||(this.lstPriceBand[index].slab3_percentage<=0&&this.lstPriceBand[index].slab3_amount<=0)||(this.lstPriceBand[index].slab3_percentage>100)){
       this.validationStatus=false;
       this.errorPlace = 'Enter valid reward3 percentage or reward3 amount of row '+rawNo;
       this.showErrorMessage(this.errorPlace);
       return;
     }
    }
   }
   else{
    for (let index = 0; index < this.lstPriceBand.length; index++) {
      let rawNo=index+1;
  
     if((this.lstPriceBand[index].slab3_percentage!=null||this.lstPriceBand[index].slab3_amount!=null)&&(this.lstPriceBand[index].slab3_percentage!=''
     ||this.lstPriceBand[index].slab3_amount!='')){
       this.validationStatus=false;
       this.errorPlace = 'Enter valid reward3%';
       this.showErrorMessage(this.errorPlace);
       return;
     }
    }
   }

   if(!(this.reward4_7==null||this.reward4_7=='')){
    for (let index = 0; index < this.lstPriceBand.length; index++) {
      let rawNo=index+1;
  
     if((this.lstPriceBand[index].slab4_percentage==null&&this.lstPriceBand[index].slab4_amount==null)||(this.lstPriceBand[index].slab4_percentage==''
     &&this.lstPriceBand[index].slab4_amount=='')||(this.lstPriceBand[index].slab4_percentage<=0&&this.lstPriceBand[index].slab4_amount<=0)||(this.lstPriceBand[index].slab4_percentage>100)){
       this.validationStatus=false;
       this.errorPlace = 'Enter valid reward4 percentage or reward4 amount of row '+rawNo;
       this.showErrorMessage(this.errorPlace);
       return;
     }
    }
   }
   else{
    for (let index = 0; index < this.lstPriceBand.length; index++) {
      let rawNo=index+1;
  
     if((this.lstPriceBand[index].slab4_percentage!=null||this.lstPriceBand[index].slab4_amount!=null)&&(this.lstPriceBand[index].slab4_percentage!=''
     ||this.lstPriceBand[index].slab4_amount!='')){
       this.validationStatus=false;
       this.errorPlace = 'Enter valid reward4%';
       this.showErrorMessage(this.errorPlace);
       return;
     }
    }
   }

   if(!(this.reward5_7==null||this.reward5_7=='')){
    for (let index = 0; index < this.lstPriceBand.length; index++) {
      let rawNo=index+1;
  
     if((this.lstPriceBand[index].slab5_percentage==null&&this.lstPriceBand[index].slab5_amount==null)||(this.lstPriceBand[index].slab5_percentage==''
     &&this.lstPriceBand[index].slab5_amount=='')||(this.lstPriceBand[index].slab5_percentage<=0&&this.lstPriceBand[index].slab5_amount<=0)||(this.lstPriceBand[index].slab5_percentage>100)){
       this.validationStatus=false;
       this.errorPlace = 'Enter valid reward5 percentage or reward5 amount of row '+rawNo;
       this.showErrorMessage(this.errorPlace);
       return;
     }
    }
   }
   else if(this.reward5_7!=null||this.reward5_7!=''){
    for (let index = 0; index < this.lstPriceBand.length; index++) {
      let rawNo=index+1;
  
     if((this.lstPriceBand[index].slab5_percentage!=null||this.lstPriceBand[index].slab5_amount!=null)&&(this.lstPriceBand[index].slab5_percentage!=''
     ||this.lstPriceBand[index].slab5_amount!='')){
       this.validationStatus=false;
       this.errorPlace = 'Enter valid reward5%';
       this.showErrorMessage(this.errorPlace);
       return;
     }
    }
   }
    else if (Number(lstLength) > 0 && (this.lstPriceBand[lstLength].strTypeName != this.lstPriceBand[0].strTypeName || this.lstPriceBand[lstLength].map_id != this.lstPriceBand[0].map_id)) {
      this.validationStatus=false;
      this.errorPlace = 'Type name does not match';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (Number(lstLength) > 0 && this.lstPriceBand[lstLength].fromAmt != this.lstPriceBand[0].fromAmt) {
      this.validationStatus=false;
      this.errorPlace = 'Enter a valid from Amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (Number(lstLength) > 0 && this.lstPriceBand[lstLength].toAmt != this.lstPriceBand[0].toAmt) {
      this.validationStatus=false;
      this.errorPlace = 'Enter a valid to Amount';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if (Number(lstLength) > 0 && this.lstPriceBand[lstLength].reward_mop != this.lstPriceBand[0].reward_mop) {
      this.validationStatus=false;
      this.errorPlace = 'MOP does not match';
      this.showErrorMessage(this.errorPlace);
      return;
    }
    else if(Number(lstLength) > 0){
      for(let index=0; index<this.lstPriceBand.length; index++){
        
        if (index!=Number(lstLength)) {
          
          if (this.lstPriceBand[index]['reward_to'] == this.lstPriceBand[lstLength].reward_to) {
            this.validationStatus=false;
            this.errorPlace = 'Choose valid assign to';
            this.showErrorMessage(this.errorPlace);
            return; 
          }
          }
          
          if (this.lstPriceBand[index]['reward_to'] == 1) {
            if (this.lstPriceBand[lstLength].reward_to == 3) {
              this.validationStatus=false;
            this.errorPlace = 'Choose valid assign to';
            this.showErrorMessage(this.errorPlace);
            return; 
            }
        }
      }
    }

  }

}
showErrorMessage (errorPlace) {    
  swal.fire({
    position: "center",
    type: "warning",
    title: errorPlace,
    showConfirmButton: false,
    timer: 1900
  });
}

deleteData(indexId){

  let lstLen;
 if(this.tabName=='value'){
    lstLen=this.lstValues.length;
    if(!(lstLen==1)){
    this.lstValues.splice(indexId,1);
    }
    else{

      this.lstValues=[{
        strTypeName : '',
        map_id : 0,      
        // fromAmt:0,
        // toAmt:0,
        slab1_percentage:0,
        slab1_amount:0,
        slab2_percentage:null,
        slab2_amount:null,
        slab3_percentage:null,
        slab3_amount:null,
        reward_mop:false,
        reward_to:0,
        map_type:0
      }]
  
    }
    this.blnAddValue=false;
  }
  else if(this.tabName=='priceband'){
    lstLen=this.lstPriceBand.length;
    if(!(lstLen==1)){
    this.lstPriceBand.splice(indexId,1);
    }
    else{

      this.lstPriceBand=[{
        strTypeName:'',
        fromAmt:0,
        toAmt:0,
        slab1_percentage:0,
        slab1_amount:0,
        slab2_percentage:null,
        slab2_amount:null,
        slab3_percentage:null,
        slab3_amount:null,
        slab4_percentage:null,
        slab4_amount:null,
        slab5_percentage:null,
        slab5_amount:null,
        reward_mop:false,
        reward_to:0,
        map_type:0
      }]
    }
    this.blnAddPrice=false;
  }
}

}
