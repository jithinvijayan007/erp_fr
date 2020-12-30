import {NgbModal,ModalDismissReasons,NgbActiveModal,} from '@ng-bootstrap/ng-bootstrap';
// import * as tableData from './invoice-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit,ElementRef ,ViewChildren, HostListener, Input} from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FullComponent } from 'src/app/layouts/full/full.component';

import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ChangeDetectionStrategy } from '@angular/core';
import { element } from 'protractor';
import Swal from 'sweetalert2';
import { json } from 'd3';
import { exists } from 'fs';
// import { id } from '@swimlane/ngx-charts/release/utils';

@Component({
  selector: 'app-quotation-print',
  templateUrl: './quotation-print.component.html',
  styleUrls: ['./quotation-print.component.css']
})
export class QuotationPrintComponent implements OnInit {

  
  str_otp = ""
  str_OTP_entered = ""

  int_cust_edit: Number // 1.edit 2.can't edit 3.cofirmation 4.enter otp 0.add
  int_editcount: Number // count of save done
 
  intSalesCustId :Number
  // blnPayment = false
  strGroupName = localStorage.getItem("group_name");
  blnApproved =false
  strStaff;

  source: LocalDataSource;
  // source2: LocalDataSource;

  blnReciptCall=true

  keyEve1;
  newTime1;
  setStart1;

  keyEve2;
  newTime2;
  setStart2;

  lstAdditions=[];
  lstDeductions=[];

  lstAdditions1=[];
  lstDeductions1=[];

  additions=0;
  deductions=0;
  errCreditNo=false;
  tempGrandTot=0;
  tempReceiptTot=0;

  blnExchangeInvoice = false;
  blnCustomerAfterAdd = false;



  dctAdditions={};
  dctDeductions={};
  blnVerifyInvoice = false;
  blnExchange = false;
  strInvoiceCode = 'INV';
  strBranchCode = localStorage.getItem('BranchCode');
 
  out_of_stock=false;
  blnCustomerAdd =false;

  intExchangeSalesAmount = 0;
  blnReturn = false;

  blnStart = false;
  blnStatus = false;
  @Input() OnlyNumber: boolean;
  @Input() date1:Date;
  // Menu items itemlist = [{name:'Delivery',status:false },{name:'Coupon code',status:false },{name:'Loyalty',status:false }]
  closeResult: string;

  constructor(private modalService: NgbModal,private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private fullObject: FullComponent,
    private spinner: NgxSpinnerService,
  ){
    // this.source2 = new LocalDataSource(tableData.data); // create the source
   }

  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }


  @ViewChild('itemId', { static: true }) itemId : ElementRef;
  @ViewChildren('bbId') bbId: any;
  @ViewChildren('discId') discId: any;

  @ViewChildren('nameId') nameId: any;
  @ViewChildren('contactId') contactId: any;
  @ViewChildren('cityId') cityId: any;
  @ViewChildren('stateId') stateId: any;
  @ViewChildren('pincodeId') pincodeId: any;
  @ViewChildren('gstnoId') gstnoId: any;
  @ViewChildren('addressId') addressId: any;
  @ViewChildren('placeId') placeId: any;

  @ViewChildren('rateId') rateId: any;


  // settings = tableData.settings;

  lstDebit=[
    {
      strCardNo:null,
      intBankId:null,
      dblAmt:null,
      strEmi:'',
      strRefNo:null,
      intCcCharge:null,
      strName:''

    }
  ];


  lstCredit=[
    {
      strCardNo:null,
      intBankId:null,
      dblAmt:null,
      strScheme:'',
      strRefNo:null,
      intCcCharge:null,
      strName:''
    }
  ];

  receiptTot=0;
  tempBalance;

  nodeHost = '';
  
  intApprove =0
  
  // settings2 = tableData.settings2;
  salesRowId= localStorage.getItem('salesRowId');
  branchName = localStorage.getItem('BranchName');
  exchangeSalesId = localStorage.getItem('exchangeSalesId');
  intContactNo
  strName
  strEmail;
  intTotPoints=0;
  intTotPointsCopy=0;
  intTotAmt=0
  intRedeemAmt=0
  intRedeemPoint=0
  intOTP;
  intAmtPerPoints=0
  intTotRedeemAmt
  strInitRemarks=""
  strRemark:'';
  dctData={}
  dctCount;
  intGrandTot;
  intTotNoRounding=0;
  fltDecimalsInTot
  intRounding;
  intTotal=0
  intTax=0
  intTotCGST=0
  intTotSGST=0
  intTotIGST=0
  intReturnAmt=0
  intKfcTot = 0 ;

  dctExchangeImage={}
  intDiscount=0
  intExchange=0
  blnCheckIGST=false;
  lstItemName = []
  IntItemNameId=0;
  strItemName;
  lstFilterData=[]
  selectedItemName;
  searchItemName: FormControl = new FormControl();
  searchEmi: FormControl = new FormControl();
  searchCreditEmi: FormControl = new FormControl();
  objectKeys;
  intCustId:null
  editField: string;
  lstItemDetails: Array<any> = []
  lstItemDetailsCopy: Array<any> = []
  lstItemAmount: Array<any> = []
  blnShowData=2;
  intCreditCc;
  intDebitCc;

  lstBankNames=[]

  time = new Date();


  newItem= { intItemId: null,
    strItemName: '',
    strProduct:'',
    strBrand:'',
    dblUnitPrice:0,
    intQty:0,
    dblMarginAmount:0,
    dblMopAmount:0,    
    GST:0,       
    strImei:'',
    dblRate:0,
    dblBuyBack:0,
    dblDiscount:0,
    dblCGST:0,
    dblSGST:0,
    dblIGST:0,
    dblAmount:0,
    intQuantity:1,
    intStatus:1,
    strItemCode:0,
    // blnService:0,
    // offerId:0,
    dblCGSTPer:0,
    dblIGSTPer:0,
    dblSGSTPer:0,
    // int_type:0
  }


  strRemarks='';
  strAddress='';
  intBuyBack=0
  strGSTNo
  // strAddress:''

  showModalSerDelivery;
  showModalPoints;
  showModalCoupon;
  showModalFilter;
  showModalPayment;
  showModalCustEdit;
  // =====================
  showModalConfirmation
  showModalOtp
  // =====================
  showModalDiscount;
  showModalOffer;
  showModalReturnDetails;
  showModalExchange;

  searchCity: FormControl = new FormControl();
  lstCity = []
  intCityId;
  strCity;
  selectedCity
  strPincode;

  // customer variables

  searchCustomer: FormControl = new FormControl();
  lstCustomer = []
  intCustomerId;
  strCustomer;
  strSelectedCustomer;
  currentCustomer='';

  invoiceId;

  // searchCustCity: FormControl = new FormControl();
  // lstCustCity = []
  intCustCityId;
  strCustCity;
  selectedCustCity
  strCustPinCode;

  searchState: FormControl = new FormControl();
  lstState = []
  intStateId;
  intStateIdPrevious
  strState:'';
  selectedState;
  strStateCode = '';
  datValid

  // searchCustState: FormControl = new FormControl();
  // lstCustState = []
  intCustStateId;
  strCustState;
  selectedCustState;

  strCouponCode;
  intCouponDisc;
  blnApplied=false;
  intCouponId ;
  blnAvailStock=true
  strCustName;
  intCustContactNo;
  strCustGST;
  strCustAddress;
  strCustPlace='';
  blnCustomer;
  blnFilterItem=false;
  dct_item = {}
  index = 0

  currentProduct='';
  currentBrand='';
  currentItem='';
  currentItemCategory='';
  currentItemGroup='';

  searchProduct: FormControl = new FormControl();
  lstProduct = []
  intProductId;
  strProduct;
  selectedProduct;

  searchBrand: FormControl = new FormControl();
  lstBrand = []
  intBrandId;
  strBrand;
  selectedBrand;

  searchItem: FormControl = new FormControl();
  lstItem = []
  intItemId;
  strItem;
  selectedItem;


  searchItemCategory: FormControl = new FormControl();
  lstItemCategory = []
  intItemCategoryId;
  strItemCategory;
  selectedItemCategory;

  searchItemGroup: FormControl = new FormControl();
  lstItemGroup = []
  intItemGroupId;
  strItemGroup;
  selectedItemGroup;

  searchCustomerNo: FormControl = new FormControl();
  lstCustomerNumber = []
  selecetedCustNumber = '';




  blnCash=false; //

  blnFinance=false;
  blnCreditCard=false;
  blnDebitCard=false;
  blnPaytm=false;
  blnGooglepay=false;
  blnReceipt=false;
  blnReceiptDisable=false;

  blnPaytmMall = false;

  strFinanceName = '';
  strFinanceScheme;
  intFinanceAmt;
  intEMI;
  intDownPayment;
  intDeliveryNo;
  intCashAmt;
  intReceivedAmt=0;
  intBalanceAmt=0;
  strDebitCardNo;
  intDebitBankId;
  strDebitBankName='';
  intDebitAmt=0;
  strDebitRefNo ;
  strEmi= '';
  lstEmiOptions = [];
  strSelectedEmi = '';
  intEmiDebitId;

  strCreditCardNo;
  intCreditBankId;
  strCreditBankName='';
  intCreditAmt=0;
  strCreditRefNo;
  strEmiCredit='';
  lstEmiCreditOptions =[];
  intEmiCreditId;
  strSelectedCreditEmi = '';
  clickRowId;
  lstClickOrder=[]
  intFixedAmt;
  strReceiptNumber;
  // lstReceipt= [{'receipt_num':'rst123','amount':1452},{'receipt_num':'rst485','amount':1000}];
  lstReceipt = [];
  intReceiptTot=0;
  blnMatching=false;

  intPaytmMobileNumber:number=null;
  intPaytmAmount:number = null;
  strPaytmTransactionNum ='';
  strPaytmReferenceNum = '';

  intPaytmMallMobileNumber:number=null;
  intPaytmMallAmount:number = null;
  strPaytmMallTransactionNum ='';
  strPaytmMallReferenceNum = '';
  


// Sales Return
strReturnImei = '';
strInvoiceNo:'';
datReturnFrom = null;
datReturnTo = null;
selectedReturnCustomer;
lstReturnCustomer = [];
selectedReturnCustomerPhno = '';
strReturnCustomerName=''
selectedReturnCustomerId = '';
lstReturnItems = [];
lstReturnQty = [];
showModalReturn;
dctReturnId={}

blnReturnData = false;
dctReturn={}
strReturnType = '1';
lstcheckReturn=[]
intdblReceiptAmount ;


lst_imei = []
intIndirectDis=0
lstIndirectDis= []
intTotIndirectDis=0
discoundIndex=0
currentIndex=0
// lstReturnDetail = []
dctReturnDetail ={}
returnId;

printDisable=true;
saveDisable=false;
dctLen;
dctCombo={};
lstCombo=[];
offerItem;
disPerBoolean=false;
disAmtBoolean=false;
lstIndex=0;
blnShow1=false;
blnShow2=false;
blnShow3=false;
blnShow4=false;
comboShow=[];
linkId=0;
linkShow=[];
lstOfferItems=[];
blnCombo=false;
itemIndex;
offerItemId;
offerApplied=[];
offerDis=[];
newItemUppercase=''
newItemCode=''
// blnAvail=false


rejectDisable = false;

// Combo offer style
lstStyle = ['flip-card-front','flip-card-front2','flip-card-front3','flip-card-front4'];
intStyleIndex;
image1
image2
image3
vchr_image;
hostaddress;
url;
dctImages={}

intFinanceId=null
blnIndirectDiscount;

intExtraFinanceAmt=0
lstFinanceDetails=[]
intMarginMoney=0
intProcessingFee=0
intDBDCharge=0
intServiceCharge=0
staffName
staffStateId
staffState
quotationId

blnMakePayment=true
intCreditBalance=0
  public imagePath1;
  imgURL1: any;
  public imagePath2;
  imgURL2: any;
  public imagePath3;
  imgURL3: any;

  @ViewChild('file1') file1: any;
  form: FormGroup;

  printInvoice(){
    // let id={quotationId:this.quotationId};


    this.serviceObject.postData('quotation/print/',{id:this.quotationId}).subscribe(
      response => {

        if(response['status']==1){
          let fileURL = response['file_url'];
          window.open(fileURL, '_blank');
          localStorage.setItem('previousUrl','invoice/quotationlist');
          // this.router.navigate(['invoice/listinvoice']);
          this.router.navigate(['invoice/quotationlist']);
          

        }
        else {
          swal.fire('Error!',response['message'], 'error');
          return false;
        }


      },
      error => {
        alert(error);
      }
    );

  }

  ngOnInit() {
    this.blnStart = true;

    if (localStorage.getItem('enquiryRequestData')) {
      localStorage.setItem('enquiryCustomerNumberStatus', '1');
    }
    if (localStorage.getItem('exchangeListData')) {
      localStorage.setItem('exchangeListStatus', '1');
    }

    this.lstDebit=[
      {
        strCardNo:null,
        intBankId:null,
        dblAmt:null,
        strEmi:'',
        strRefNo:null,
        intCcCharge:null,
        strName:''
      }
    ];

    this.lstCredit=[
      {
        strCardNo:null,
        intBankId:null,
        dblAmt:null,
        strScheme:'',
        strRefNo:null,
        intCcCharge:null,
        strName:''
      }
    ];


    this.out_of_stock=false;
    localStorage.setItem('invoiceReceipt','')
    this.blnIndirectDiscount = JSON.parse(localStorage.getItem('bln_indirect_discount'));
    this.url = this.serviceObject.url
    this.hostaddress = this.serviceObject.hostAddress
    this.hostaddress = this.hostaddress.slice(0, this.hostaddress.length - 1)
    this.printDisable=true; //disable print button
    this.saveDisable=false; //enable save button
    this.blnVerifyInvoice = false;
    this.rejectDisable = false;

    let dctDict={
      GST: 0,
      dblBuyBack: 0,
      dblCGST: 0,
      dblCGSTPer: 0,
      dblDiscount: 0,
      dblMarginAmount: 0,
      dblMopAmount: 0,
      dblRate: 0,
      dblSGST:0,
      dblSGSTPer:0,
      intItemId:0,
      intQuantity: 0,
      intStatus: 0,
      itemEnqId:0,
      strImei: "",
      strItemCode: "",
      strItemName: "",
      dblUnitPrice:0,      
      intQty:0,
      dblAmount: 0,
      
    } 

    this.dctData['billingdetails']=[]
    this.dctData['billingdetailsCopy']=[]
    this.blnFinance=false;
    this.blnCreditCard=false;
    this.blnDebitCard=false;
    this.blnPaytm=false;
    this.blnPaytmMall = false;
    this.blnGooglepay=false;
    this.fullObject.setInvoice()
    this.objectKeys = Object.keys;
    this.dctData['details']=[]
    this.dctData['billingDetails']=[]
    this.dctData['custEditData']=[]
    this.dctData['lstDeliveryData']={}
    this.dctData['lstPaymentData']={}
    this.dctData['lstFilterData']={}
    this.intGrandTot=0
    this.datValid= new Date()
    this.form = this.formBuilder.group({
          img1: [''],
          img2: [''],
          img3: [''],
    });

    this.source = new LocalDataSource(this.dctData['details']); // create the source
    this.blnCustomerAfterAdd =true;
    // update time
    setInterval(() => {
      this.time = new Date();
   }, 1000);


    this.searchItemName.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstItemName = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('quotation/item_tax_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstItemName = response['lst_item'];

              }
            );
          }
        }
      }
    );

    this.searchEmi.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstEmiOptions = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('invoice/scheme_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstEmiOptions = response['data'];

              }
            );
          }
        }
      }
    );

    this.searchCreditEmi.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstEmiCreditOptions = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('invoice/scheme_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstEmiCreditOptions = response['data'];

              }
            );
          }
        }
      }
    );

    this.searchCity.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCity = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('states/location_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstCity = response['list_states'];
              }
            );
          }
        }
      }
    );

    this.searchState.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstState = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('states/states_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstState = response['list_states'];
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

    this.searchBrand.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstBrand = [];
      } else {
        if (strData.length >= 1) {
          if (!this.strProduct) {
          this.toastr.error('Product Name is required', 'Error!');
          }
          else{

            const pushedItems = {};
            if (this.strItem) {
            pushedItems['item_id'] = this.intItemId

            }
            if (this.strItemCategory) {
              pushedItems['itemCategory_id'] = this.intItemCategoryId

           }
           if (this.strItemGroup) {
            pushedItems['itemGroup_id'] = this.intItemGroupId

            }
            pushedItems['term'] = strData
            pushedItems['product_id'] = this.intProductId
            this.serviceObject
            .postData('brands/brands_typeahead/',pushedItems)
            .subscribe(
              (response) => {
                this.lstBrand = response['data'];
              }
            );
          }
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
          if (!this.strProduct) {
          this.toastr.error('Product Name is required', 'Error!');
          }

          else{
            const pushedItems = {};
            if (this.strBrand) {
              pushedItems['brand_id'] = this.intBrandId

              }
              if (this.strItemCategory) {
                pushedItems['itemCategory_id'] = this.intItemCategoryId

             }
             if (this.strItemGroup) {
              pushedItems['itemGroup_id'] = this.intItemGroupId

              }
            pushedItems['term'] = strData
            pushedItems['product_id'] = this.intProductId
            this.serviceObject
            .postData('itemcategory/item_typeahead/',pushedItems)
            .subscribe(
              (response) => {
                this.lstItem = response['data'];
              }
            );
          }
          }
        }
      }
    );

    this.searchItemCategory.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstItemCategory = [];
      } else {
        if (strData.length >= 1) {
          if (!this.strProduct) {
          this.toastr.error('Product Name is required', 'Error!');
          }
          else{
            const pushedItems = {};
            if (this.strBrand) {
              pushedItems['brand_id'] = this.intBrandId

              }
              if (this.strItem) {
                pushedItems['item_id'] = this.intItemId

             }
             if (this.strItemGroup) {
              pushedItems['itemGroup_id'] = this.intItemGroupId

              }
            pushedItems['term'] = strData
            pushedItems['product_id'] = this.intProductId
            this.serviceObject
            .postData('itemcategory/item_category_typeahead/',pushedItems)
            .subscribe(
              (response) => {
                this.lstItemCategory = response['data'];
              }
            );
          }
          }
        }
      }
    );

    this.searchItemGroup.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstItemGroup = [];
      } else {
        if (strData.length >= 1) {
          if (!this.strProduct) {
          this.toastr.error('Product Name is required', 'Error!');
          }
          else{
            const pushedItems = {};
            if (this.strBrand) {
              pushedItems['brand_id'] = this.intBrandId

              }
              if (this.strItem) {
                pushedItems['item_id'] = this.intItemId

             }
             if (this.strItemCategory) {
              pushedItems['itemCategory_id'] = this.intItemCategoryId

              }
            pushedItems['term'] = strData
            pushedItems['product_id'] = this.intProductId
            this.serviceObject
            .postData('itemgroup/item_group_typeahead/',pushedItems)
            .subscribe(
              (response) => {
                this.lstItemGroup = response['data'];
              }
            );
          }
          }
        }
      }
    );
    


    this.searchCustomer.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
        if (strData.length >= 1) {
          
          this.serviceObject
            .postData('reports/customer_typeahead/',{term:strData})
            .subscribe(
              (response) => {
                this.lstCustomer = response['data'];
             
              


                
              }
            );
          }
        // }
      }
    );
    this.searchCustomerNo.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCustomerNumber = [];
      } else {
        if (strData.length >= 1) {
          const dctData = {}
          dctData['term'] = strData;
          dctData['blnCustAdd'] =true;
          this.serviceObject
            .postData('customer/add_customer_pos/',dctData)
            .subscribe(
              (response) => {
                this.lstCustomerNumber = response['data'];
                 
              }
            );
          }
        }
      }
    );

    this.blnReturn =false;
    this.getStaffDetails();
   

  }
  getStaffDetails(){

    this.serviceObject
    .getData('quotation/add/')
    .subscribe(
      (response) => {
        this.staffStateId=response['dct_data']['int_state_id']
        this.staffState=response['dct_data']['vchr_state_name']
        
      }
    );
    
  }

  itemNameChanged(event) {
    if (event === undefined || event === null) {
    this.lstCustomer = [];
    } else {
    if (event.length >= 2) {

      this.serviceObject
        .postData('quotation/item_tax_typeahead/', {term:event})
        .subscribe(
          (response) => {
            this.lstItemName = response['lst_item'];
          }
        );
    }
    }
  }

  stateChanged(item)
   {
    this.intStateId = item.pk_bint_id;
    this.strState = item.vchr_name;
    this.strStateCode = item.vchr_code;
  }

  custStateChanged(item)
   {
    this.intCustStateId = item.pk_bint_id;
    this.strCustState = item.vchr_name;
    console.log(this.strCustState , this.staffState,"state");
    
    if( this.strCustState == this.staffState){
      this.blnCheckIGST=false
    }
    else{
      this.blnCheckIGST=true
    }
    console.log(this.blnCheckIGST,"check");
    
    this.billingDatails('other',0)
  }

  calcKfc(){
    this.intKfcTot=0;
    this.intExchangeSalesAmount = 0;

    this.lstItemDetails.map(element=>{

      let intKfc=0;
      let tempAmt=0;
      let AmtWithoutTax=0;
      let taxPer=0;
      let taxPoint=0;
      
      // console.log(element.intKfc,"element.intKfc");
      
      if(((element.intKfc==0)||(element.intKfc==undefined)) && element.intStatus!=2)
      {
        
        taxPer=element.dblCGSTPer+element.dblSGSTPer+1;
        // console.log("taxPer######",taxPer);
        // console.log("element.dblBuyBack",element.dblBuyBack);
        // console.log("element.dblAmount",element.dblAmount);
       
        if(element.dblBuyBack){
          tempAmt=Number(element.dblAmount+element.dblBuyBack);
        }
        else if(this.blnExchangeInvoice){
          if(element.dblAmount > 0){
            this.intExchangeSalesAmount = element.dblAmount - element.exchange_sale_amount;
            tempAmt=this.intExchangeSalesAmount;
            
          }
          else{
            tempAmt = 0;
          }
        
        }
        else{
          tempAmt=element.dblAmount;
        }
        taxPoint=1+(taxPer/100);
        AmtWithoutTax=tempAmt/taxPoint;
        intKfc=(AmtWithoutTax)/100;
        element.intKfc=Number(intKfc);
        // console.log(this.blnExchangeInvoice,'exchange');
        
        if(!this.blnExchangeInvoice && this.blnStart && element.intStatus!=2){
          element.dblRate-=Number(element.intKfc);
        }
        // this.blnStart = false;
        if (element.intStatus!=0){
          this.intKfcTot+=Number(intKfc);
        }

      }
      else{
       
        
        if (element.intStatus != 0 && element.intStatus != 2 ) {
          let intKfc = 0 ;
          if(this.blnExchangeInvoice){
            if(element.dblAmount > 0){
              this.intExchangeSalesAmount = element.dblAmount - element.exchange_sale_amount;
              tempAmt=this.intExchangeSalesAmount;
            }
            else{
              tempAmt = 0;
            }
            intKfc = (element.dblRate-element.exchange_sale_amount)/100
            element.intKfc=Number(intKfc);
          }
          else{
            intKfc = element.dblRate/100
            element.intKfc=Number(intKfc);
          }
          this.intKfcTot+=Number(intKfc);
        }
      }
      if( element.intStatus == 2){
        element.dblRate=element.dblAmount
      }
    })
        this.blnStart = false;
  }



  itemNgModelChanged(event){
    if(this.currentItem!=this.selectedItem){
      this.intItemId = null;
      this.strItem = '';
    }
  }
  itemChanged(item)
   {
      this.currentItem= item.code_name;
      this.intItemId = item.id;
      this.strItem = item.code_name;
      this.selectedItem = item.code_name;
      // this.selectedProduct=item.strProductName
      // this.selectedBrand=item.strBrandName
      

  }

  itemCategoryNgModelChanged(event){
    if(this.currentItemCategory!=this.selectedItemCategory){
      this.intItemCategoryId = null;
      this.strItemCategory = '';
    }
  }
  itemCategoryChanged(item)
  {
    this.currentItemCategory= item.name;
    this.intItemCategoryId = item.id;
    this.strItemCategory= item.name;
    this.selectedItemCategory= item.name;
  }
  itemGroupNgModelChanged(event){
    if(this.currentItemGroup!=this.selectedItemGroup){
      this.intItemGroupId = null;
      this.strItemGroup = '';
    }
  }
  itemGroupChanged(item)
    {
        this.currentItemGroup= item.name;
        this.intItemGroupId = item.id;
        this.strItemGroup= item.name;
        this.selectedItemGroup= item.name;

  }



 itemNameSelected(item)
   {
    //  console.log(item,"item");
     
   this.newItem.intQty=0
    
    this.serviceObject.postData('quotation/item_tax_typeahead/',{'intItemId':item.strItemId}).subscribe(res => {
      if (res.status == 1)
      {
          this.newItem.dblIGST=res['lst_item']['dblIGST']
          this.newItem.dblCGST=res['lst_item']['dblCGST']
          this.newItem.dblSGST=res['lst_item']['dblSGST']
          this.newItem.dblIGSTPer=res['lst_item']['dblIGSTPer']
          this.newItem.dblSGSTPer=res['lst_item']['dblSGSTPer']
          this.newItem.dblCGSTPer=res['lst_item']['dblCGSTPer']
          this.newItem.dblAmount=res['lst_item']['dblMopAmount']
          this.newItem.strItemCode=res['lst_item']['strItemCode']
          this.newItem.intItemId=res['lst_item']['pk_bint_id']
          this.newItem.strProduct=res['lst_item']['fk_product__vchr_name']
          this.newItem.strBrand=res['lst_item']['fk_brand__vchr_name']
          


          this.newItem.dblIGST = ( this.newItem.dblAmount/((100+ this.newItem.dblIGSTPer)/100))*(res['lst_item']['dblIGSTPer']/100)
          this.newItem.GST=res['lst_item']['GST']
          this.newItem.dblCGST = (this.newItem.dblAmount/((100+ this.newItem.dblSGSTPer+ this.newItem.dblCGSTPer)/100))*(res['lst_item']['dblCGSTPer']/100)
          this.newItem.dblSGST = (this.newItem.dblAmount/((100+ this.newItem.dblSGSTPer+ this.newItem.dblCGSTPer)/100))*(res['lst_item']['dblSGSTPer']/100)
          this.newItem.dblRate= Number(( this.newItem.dblAmount-( this.newItem.dblIGST)+( this.newItem.dblBuyBack+ this.newItem.dblDiscount)).toFixed(2));
          this.newItem.dblUnitPrice= Number(( this.newItem.dblAmount-( this.newItem.dblIGST)+( this.newItem.dblBuyBack+ this.newItem.dblDiscount)).toFixed(2));

          //  this.newItem.dblRate=( this.newItem.dblRate).toFixed(2);

         this.newItem.dblMopAmount=res['lst_item']['dblMopAmount']
      }
      else if (res.status == 0) {
        swal.fire('Error!',res['message'], 'error');
        // this.lstItemDetails=[]
      }
  },
  (error) => {
    swal.fire('Error!','Server Error!!', 'error');
  });

    
   

  }


  billingDatails(type,index){
 

   console.log(this.strGSTNo,this.blnCheckIGST,"strGSTNo");

    if(!this.blnCheckIGST&&(this.strGSTNo==""||this.strGSTNo==null)){
      if(!this.blnReturn){
        this.calcKfc();
      }
    }
    else{
      if(this.intKfcTot>0 ){
        this.lstItemDetails.map(element=>{
          if(element.intStatus!=2){
            element.dblRate+=element.intKfc;
          }
          element.intKfc=0;
        })
        
      }
      this.intKfcTot=0;
    }

    this.dctData['billingdetails']=[]
    this.dctData['billingdetailsCopy']=[]
    this.intDiscount=0
    this.intBuyBack=0
    this.intTax=0
    this.intTotCGST=0
    this.intTotIGST=0
    // this.intKfc = 0;
    this.intTotSGST=0
    this.intReturnAmt=0
    this.intTotal=0
    this.intGrandTot=0
    this.intTotIndirectDis=0
    this.intRounding = 0
  
    let indexOfList=0
    for(let item of this.lstItemDetails)
    {
      let kfcVal=0;
      if(item.intKfc){
        kfcVal=item.intKfc;
      }
      else{
        kfcVal=0;
      }

      if(item.intStatus==0){
        this.intReturnAmt=this.intReturnAmt+item.dblAmount
      }
      else{
        this.dctCount ={}
        this.dctCount['dis']=item.dblBuyBack+item.dblDiscount

        if(!this.blnCheckIGST){

          item.dblAmount = Number(((item.dblMopAmount * item.intQty) + item.dblMarginAmount -(item.dblDiscount+item.dblBuyBack)).toFixed(2))
          // console.log(  item.dblAmount,item.dblRate,'amount0');
         
          this.calculateRate(indexOfList,false,type)
          this.dctCount['tax']=item.dblCGST+item.dblSGST
          this.intTotSGST= this.intTotSGST+item.dblSGST
          this.intTotCGST= this.intTotCGST+item.dblCGST

        } 
        else{
          item.dblAmount = Number(((item.dblMopAmount * item.intQty) + item.dblMarginAmount - (item.dblDiscount + item.dblBuyBack)).toFixed(2))
        //  console.log(  item.dblAmount,item.dblRate,'amount1');
         
          this.calculateRate(indexOfList,true,type)
          
          this.dctCount['tax']=item.dblIGST
          this.intTotIGST= this.intTotIGST+item.dblIGST
        }
        // console.log(item.dblRate,"item.dblRate");
        
        this.dctCount['amt']= item.dblRate
        this.dctCount['rate']=item.dblRate
        this.dctCount['name']= (item.strItemName).slice(0, 15) + '...';
        // this.dctCount['qty']= item.intQuantity
        this.dctCount['qty']= 1
        this.dctCount['id']= item.intItemId
        this.dctCount['status']= item.intStatus
        this.dctData['billingdetails'].push(this.dctCount)

        if (this.intKfcTot >= 0 && item.intStatus != 0  && item.intStatus != 2){
          
        this.intTotal= this.intTotal+item.dblRate;
        }
        
        
        this.intDiscount=this.intDiscount+item.dblDiscount
        this.intBuyBack=this.intBuyBack+item.dblBuyBack
      }
      if(item.intStatus==2){
        this.intExchange=item.dblAmount
      }
      indexOfList++
    }

    if(this.lstIndirectDis.length>0){
      this.lstIndirectDis.forEach(item=>{
        this.intTotIndirectDis=Number(this.intTotIndirectDis)+Number(item)
      })
    }

    this.intGrandTot = Math.round(this.intGrandTot); //to fixed change
    // this.intGrandTot = this.intGrandTot.toFixed(2);

   if(type=="edit"){
     let kfcVal=0;
     if(this.lstItemDetails[index].intKfc){
      kfcVal=this.lstItemDetails[index].intKfc;
     }
     else{
      kfcVal=0;
     }
    //  console.log(kfcVal,"kfcVal");
     
          if(this.blnCheckIGST){
            this.lstItemDetails[index].dblAmount = Number(((this.lstItemDetails[index].dblMopAmount * this.lstItemDetails[index].intQty) + this.lstItemDetails[index].dblMarginAmount - this.lstItemDetails[index].dblBuyBack - this.lstItemDetails[index].dblDiscount).toFixed(2))
            // console.log( this.lstItemDetails[index].dblAmount, this.lstItemDetails[index].dblRate,'amount');
            // console.log( this.lstItemDetails,'amount5453');
        
            this.calculateRate(index,true,type)
            
            // this.preItemList[index].dblAmount=this.lstItemDetails[index].dblAmount
          }
          else{
            this.lstItemDetails[index].dblAmount = Number(((this.lstItemDetails[index].dblMopAmount * this.lstItemDetails[index].intQty) + this.lstItemDetails[index].dblMarginAmount - this.lstItemDetails[index].dblBuyBack - this.lstItemDetails[index].dblDiscount).toFixed(2))
        //  console.log( this.lstItemDetails[index].dblAmount, this.lstItemDetails[index].dblRate,'amount');
          
            this.calculateRate(index,false,type)
           
            // this.preItemList[index].dblAmount=this.lstItemDetails[index].dblAmount
          }

        }

        else if(type=="editNew"){
          // console.log("editnew");
          

          let kfcVal=0;

          if(this.newItem['intKfc']){
            kfcVal=this.newItem['intKfc'];
          }
          else{
              kfcVal=0;
          }

          if(this.blnCheckIGST){
            this.newItem.dblAmount = Number(((this.newItem.dblMopAmount * this.newItem.intQty) + this.newItem.dblMarginAmount - this.newItem.dblBuyBack - this.newItem.dblDiscount).toFixed(2))
          //  console.log( this.newItem.dblAmount,"dblAmount");
           
            this.calculateRate(index,true,type)
           
          }
            else{
            this.newItem.dblAmount = Number(((this.newItem.dblMopAmount * this.newItem.intQty)  + this.newItem.dblMarginAmount - this.newItem.dblBuyBack - this.newItem.dblDiscount).toFixed(2)) 
            // console.log( this.newItem.dblAmount,"dblAmount");
           
            this.calculateRate(index,false,type)

            }
        }
        // console.log("this.intGrandTot#########",this.intGrandTot,  this.intTotSGST , this.intTotCGST , this.intTotIGST,this.intTotal, this.intDiscount,this.intBuyBack,this.intReturnAmt,this.intCouponDisc,this.intTotIndirectDis);

    
        if(this.blnFinance){
          this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt);
    
        }
        else{
          this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt);
        }
    
   
        if(this.intCouponDisc>0){
          this.intGrandTot= (this.intTotal +  this.intTotSGST + this.intTotCGST + this.intTotIGST )- (this.intReturnAmt+this.intCouponDisc+this.intTotIndirectDis)
    
        }
        else{
          this.intGrandTot= (this.intTotal + this.intTotSGST + this.intTotCGST + this.intTotIGST)- (this.intReturnAmt+this.intTotIndirectDis)
        // console.log("this.intGrandTot#########",this.intGrandTot,  this.intTotSGST , this.intTotCGST , this.intTotIGST,this.intTotal, this.intDiscount,this.intBuyBack,this.intReturnAmt,this.intCouponDisc,this.intTotIndirectDis);
          
          
        } 
        this.intExchange=(this.intExchange)*-1
        this.intGrandTot=this.intGrandTot-this.intExchange
        
        // this.intGrandTot= this.intGrandTot-this.intExchange
        // console.log(  this.intGrandTot,"  this.intGrandTot");
        
        
        this.intGrandTot=Number(this.intGrandTot)+Number(this.additions)+Number(this.intKfcTot);
          // this.intGrandTot=Number(this.intGrandTot)+Number(this.additions);
        this.intGrandTot=Number(this.intGrandTot)-Number(this.deductions);
        this.intGrandTot=Number(this.intGrandTot)+Number(this.intExtraFinanceAmt);
        // console.log("this.intGrandTot$$$$$$$$$$$$",this.intGrandTot);
        
        this.intTotNoRounding = this.intGrandTot.toFixed(2); 
        
        this.fltDecimalsInTot = this.intTotNoRounding - Math.floor(this.intTotNoRounding); //to fixed change

    
    this.dctData['billingdetailsCopy'] = {}
    let asd = []
    let dct_dup = {}
    this.dctData['billingdetails'].map(item => {
      // if(item.status!=2){
        if (!asd.includes(item['id'])){
          asd.push(item['id'])
          dct_dup[item['id']] = {}
          dct_dup[item['id']]['name'] = JSON.parse(JSON.stringify(item['name']))
          dct_dup[item['id']]['amt'] = JSON.parse(JSON.stringify(item['amt']))
          dct_dup[item['id']]['qty'] = JSON.parse(JSON.stringify(item['qty']))
        }else{
          dct_dup[item['id']]['amt'] = JSON.parse(JSON.stringify(dct_dup[item['id']]['amt'])) + JSON.parse(JSON.stringify(item['amt']))
          dct_dup[item['id']]['qty'] +=1 
        }

    })

    this.dctData['billingdetailsCopy'] = dct_dup

    
    

  }
  calculateRate(index,check,type){
    // console.log("rate",index);
    
    // let index=0
    // this.lstItemDetails.forEach(element => {
      //  console.log(this.strGSTNo, this.lstItemDetails,"yhgfgthfgh");
      if(type=='editNew'){
        let amount = Number((this.newItem.dblMopAmount + this.newItem.dblMarginAmount -(this.newItem.dblDiscount+this.newItem.dblBuyBack)).toFixed(2))
        if(check){
          this.newItem['dblUnitPrice'] =(amount * 100) / (100 + this.newItem['dblIGSTPer'])
          // console.log( this.newItem['dblUnitPrice'],"dblUnitPrice");
          
          this.newItem['dblRate'] = ((this.newItem['dblAmount']) * 100) / (100 + this.newItem['dblIGSTPer'])
          this.newItem['dblIGST'] = (this.newItem['dblIGSTPer'] * this.newItem['dblRate']) / 100            
          this.newItem['dblRate']=Number(this.newItem['dblRate'].toFixed(2));
        }
        else if(!this.strGSTNo) {
         
          // console.log(this.newItem['dblAmount'], this.newItem['dblCGSTPer'], this.newItem['dblSGSTPer'],"000000");
          this.newItem['dblUnitPrice'] =(amount  * 100) / (100 + this.newItem['dblCGSTPer'] + this.newItem['dblSGSTPer']+1)          
          // console.log( this.newItem['dblUnitPrice'],"dblUnitPrice");
        
          this.newItem['dblRate'] = ((this.newItem['dblAmount']) * 100) / (100 + this.newItem['dblCGSTPer'] + this.newItem['dblSGSTPer']+1)
          this.newItem['dblCGST'] = (this.newItem['dblCGSTPer'] * this.newItem['dblRate']) / 100         // in exchange the difference of amount is taken 
          this.newItem['dblSGST'] = (this.newItem['dblSGSTPer'] * this.newItem['dblRate']) / 100
          this.newItem['dblRate']=Number(this.newItem['dblRate'].toFixed(2));
          this.calcKfc()
        
        }
        else{
          this.newItem['dblUnitPrice'] =(amount* 100) / (100 + this.newItem['dblCGSTPer'] + this.newItem['dblSGSTPer'])            
          // console.log( this.newItem['dblUnitPrice'],"dblUnitPrice");
          
          this.newItem['dblRate'] = ((this.newItem['dblAmount']) * 100) / (100 + this.newItem['dblCGSTPer'] + this.newItem['dblSGSTPer'])            
          this.newItem['dblCGST'] = (this.newItem['dblCGSTPer'] * this.newItem['dblRate']) / 100         // in exchange the difference of amount is taken 
          this.newItem['dblSGST'] = (this.newItem['dblSGSTPer'] * this.newItem['dblRate']) / 100
          this.newItem['dblRate']=Number(this.newItem['dblRate'].toFixed(2));
        }
      }
      else{
        let amount = Number((this.lstItemDetails[index].dblMopAmount + this.lstItemDetails[index].dblMarginAmount -(this.lstItemDetails[index].dblDiscount+this.lstItemDetails[index].dblBuyBack)).toFixed(2))        
        if(check){
             this.lstItemDetails[index]['dblUnitPrice'] =(amount * 100) / (100 + this.lstItemDetails[index]['dblIGSTPer'])
          // console.log( this.lstItemDetails[index]['dblUnitPrice'],"dblUnitPrice");
             
             this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount']) * 100) / (100 + this.lstItemDetails[index]['dblIGSTPer'])
             this.lstItemDetails[index]['dblIGST'] = (this.lstItemDetails[index]['dblIGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100            
             this.lstItemDetails[index]['dblRate']=Number(this.lstItemDetails[index]['dblRate'].toFixed(2));
            }
           else if(!this.strGSTNo) {
            
            //  console.log(this.lstItemDetails[index]['dblAmount'], this.lstItemDetails[index]['dblCGSTPer'], this.lstItemDetails[index]['dblSGSTPer'],"000000");
             this.lstItemDetails[index]['dblUnitPrice'] =(amount  * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer']+1)          
          // console.log( this.lstItemDetails[index]['dblUnitPrice'],"dblUnitPrice");
            
             this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer']+1)
             this.lstItemDetails[index]['dblCGST'] = (this.lstItemDetails[index]['dblCGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100         // in exchange the difference of amount is taken 
             this.lstItemDetails[index]['dblSGST'] = (this.lstItemDetails[index]['dblSGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
             this.lstItemDetails[index]['dblRate']=Number(this.lstItemDetails[index]['dblRate'].toFixed(2));
             this.calcKfc()
           
           }
           else{
             this.lstItemDetails[index]['dblUnitPrice'] =(amount* 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'])            
          // console.log( this.lstItemDetails[index]['dblUnitPrice'],"dblUnitPrice");
            
             this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'])            
             this.lstItemDetails[index]['dblCGST'] = (this.lstItemDetails[index]['dblCGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100         // in exchange the difference of amount is taken 
             this.lstItemDetails[index]['dblSGST'] = (this.lstItemDetails[index]['dblSGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
             this.lstItemDetails[index]['dblRate']=Number(this.lstItemDetails[index]['dblRate'].toFixed(2));
            }
      }
      
  }
clearRow(){
  this.out_of_stock=false;
  this.newItem= { intItemId: null,
    strItemName: '',
    strProduct:'',
    strBrand:'',
    intQty:0,
    dblUnitPrice:0,    
    GST:0,
    dblMarginAmount:0, 
    dblMopAmount:0,   
    strImei:'',
    dblRate:0,
    dblBuyBack:0,
    dblDiscount:0,
    dblCGST:0,
    dblSGST:0,
    dblIGST:0,
    dblAmount:0,
    intQuantity:1,
    intStatus:1,
    strItemCode:0,
    // blnService :0,
    // offerId:0,
    dblCGSTPer:0,
    dblIGSTPer:0,
    dblSGSTPer:0,
    // int_type:0
  }
}

  addNewRow(){
    
console.log( this.newItem," this.newItem");

    
     if(!this.newItem.strItemName){
      this.toastr.error('Item Name is required', 'Error!');
      return false;
    }
    else if(!this.newItem.intQty){
      this.toastr.error('Quantity is required', 'Error!');
      return false;
    }

    else
    {
     let blnAlreadyExist = false
      this.lstItemDetails.forEach(element => {
       if(element.strItemCode===this.newItem.strItemCode){
        blnAlreadyExist=true
       }
      });

      if(blnAlreadyExist){
        this.toastr.error('Already Exist', 'Error!');
      }
      else{
        this.lstItemDetails.push(this.newItem);
        this.newItem= { intItemId: null,
          strItemName: '',
          strProduct:'',
          strBrand:'',
          dblUnitPrice:0,          
          intQty:0,
          dblMarginAmount:0,
          dblMopAmount:0,            
          strImei:'',
          GST:0,          
          dblRate:0,
          dblBuyBack:0,
          dblDiscount:0,
          dblCGST:0,
          dblSGST:0,
          dblIGST:0,
          dblAmount:0,
          intQuantity:1,
          intStatus:1,
          strItemCode:0,
          // blnService:0,
          // offerId:0,
          dblCGSTPer:0,
          dblIGSTPer:0,
          dblSGSTPer:0,
          // int_type:0
        }
  
        this.out_of_stock=false;
  
        this.comboShow.push('none');
        this.blnStart=true
        this.billingDatails("other",0);
      if(this.lstFilterData.length>0){
        if ((Object.keys(this.dct_item)).includes(String(this.lstFilterData[this.clickRowId]['intItemId'])))
        {
          this.dct_item[this.lstFilterData[ this.clickRowId]['intItemId']] =  this.dct_item[this.lstFilterData[ this.clickRowId]['intItemId']] + 1
        }
        else{
          this.dct_item[this.lstFilterData[ this.clickRowId]['intItemId']] = 1
        }
      }
  
  
      let lstLen=this.lstItemDetails.length;
      let tempDict={};
      tempDict['intItemId']=this.lstItemDetails[lstLen-1].intItemId;
      tempDict['strItemName']=this.lstItemDetails[lstLen-1].strItemName;
  
      // this.openComboOffers(lstLen-1,tempDict,'comboOffer','show');
      }

   }

  //  console.log("##this.lstItemDetails",this.lstItemDetails);
   
  }

  removeRow(id) {
    swal.fire({
      title: 'Are you sure?',
      text: "Are you sure want to delete ( Removal of this item wiil be effect insurence also ) ?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        swal.fire(
          'Deleted!',
          "Data Deleted successfully",
          'success'
        )

      this.lstItemDetails.splice(id, 1);
      this.billingDatails("other",0);
      }
    })

  }

  changeQtyValue(index: number,item) {
    // console.log("qty change");
    

    if(item=="editRow" && this.lstItemDetails[index].intQty<0){
      // console.log("1");
      
      // if(this.lstItemDetails[index].intQty<0){
        this.toastr.error('Invalid Quantity', 'Error!');
        this.lstItemDetails[index].intQty=0
        return false
      // }
    }
    else if(item=="newItem" && this.newItem.intQty<0){
      this.toastr.error('Invalid Quantity', 'Error!');
      this.newItem.intQty=0
      return false
    }
    else
    {      
      
      
      if(item=="editRow")
      {
          // console.log(this.lstItemDetails[index].dblAmount,this.lstItemDetails[index].dblUnitPrice,this.lstItemDetails[index].intQty,"dblAmount,dblUnitPrice,intQty");
          // this.lstItemDetails[index].dblAmount=  this.lstItemDetails[index].dblAmount * this.lstItemDetails[index].intQty
          // console.log( this.lstItemDetails[index].dblAmount,"dblAmount");
         
          this.billingDatails("edit",index);
      }
      else if(item=="newItem")
      {
          // console.log(this.newItem.dblAmount,this.newItem.dblUnitPrice,this.newItem.intQty,"dblAmount,dblUnitPrice,intQty");
          // this.newItem.dblAmount=  this.newItem.dblAmount * this.newItem.intQty
          // console.log(  this.newItem.dblAmount,"dblAmount");
          
          this.billingDatails("editNew",0);
      }
    }
  }


  changeDiscountValue(index: number,item) {
    // this.editField = event.target.textContent;

    // console.log("EEEEEEEEthis.lstItemDetails[index].dblDiscount",this.lstItemDetails[index].dblDiscount);
    // console.log("RRRRRRRthis.lstItemDetails[index].dblRate-this.lstItemDetails[index].dblBuyBack",this.lstItemDetails[index].dblRate-this.lstItemDetails[index].dblBuyBack);
    
    
    if(item=="editRow"){
      if(this.lstItemDetails[index].dblDiscount>(this.lstItemDetails[index].dblRate-this.lstItemDetails[index].dblBuyBack))
      {
        this.toastr.error('Invalid Discount', 'Error!');
        this.lstItemDetails[index].dblDiscount=0
        // this.preItemList[index].dblDiscount=0
        this.billingDatails("edit",index);
        // this.bbId.first.nativeElement.focus();
      }
      else{
        // this.bbId.first.nativeElement.focus();
        this.billingDatails("edit",index);
      }
    }
    else if(item=="newItem")
    {
// console.log("newItem");

      if(this.newItem.dblDiscount>(this.newItem.dblRate-this.newItem.dblBuyBack)){
        this.toastr.error('Invalid Discount', 'Error!');
        this.newItem.dblDiscount=0
        this.billingDatails("editNew",0);
        // this.bbId.first.nativeElement.focus();
      }
      else{
        this.billingDatails("editNew",0);
      }
    }
  }
  changeBBValue(index: number, property: string, event: any,item){

    // this.editField = event.target.textContent;
    if(item=="editRow")
    {
      if(this.lstItemDetails[index].dblBuyBack>(this.lstItemDetails[index].dblRate-this.lstItemDetails[index].dblDiscount))
      {
        this.toastr.error('Invalid Buy Back ', 'Error!');
        this.lstItemDetails[index].dblBuyBack=0
        // this.preItemList[index].dblBuyBack=0
        
        this.billingDatails("edit",index);
        // this.discId.first.nativeElement.focus();
      }
      else{
        // this.discId.first.nativeElement.focus();
        this.billingDatails("edit",index);
        }
      }
    else if(item=="newItem")
    {
      if(this.newItem.dblBuyBack>(this.newItem.dblRate-this.newItem.dblDiscount)){
        this.toastr.error('Invalid Buy Back', 'Error!');
        this.newItem.dblBuyBack=0
        this.billingDatails("editNew",0);
        // this.discId.first.nativeElement.focus();
      }
      else{
       this.billingDatails("editNew",0);
      }
    }
    // console.log(this.lstItemDetails[index],"this.lstItemDetails[index]");
  }

  changeMarginValue(index: number,item) {
   
    if(item=="editRow"){
      if(this.lstItemDetails[index].dblMarginAmount<0)
      {
        this.toastr.error('Invalid Margin Amount', 'Error!');
        this.lstItemDetails[index].dblMarginAmount=0
        this.billingDatails("edit",index);
      }
      else{
        this.billingDatails("edit",index);
      }
    }
    else if(item=="newItem")
    {
      if(this.newItem.dblMarginAmount<0){
        this.toastr.error('Invalid Margin Amount', 'Error!');
        this.newItem.dblMarginAmount=0
        this.billingDatails("editNew",0);
      }
      else{
        this.billingDatails("editNew",0);
      }
    }
  }
  OnEnter(id: number, property: string, event: any) {

    let e = <KeyboardEvent>event;
    if (Number(this.lstItemDetails[id][property]) > 1000000) {
      e.preventDefault();
    }
    if (Number(this.lstItemDetails[id][property]) != 0 && !Number(this.lstItemDetails[id][property])
    ) {
      event.view.focus()
      this.toastr.error('Invalid Amount');
      return false;
    }
    if (event.keyCode == 13 || event.which == 13){
      event.target.blur()
    }
  }

  OnBlur(index: number, property: string, event: any) {
    if (Number(this.lstItemDetails[index][property]) != 0 &&
      !Number(this.lstItemDetails[index][property])
    ) {
      event.view.frames.focus()
      this.lstItemDetails[index][property] = 0
      // this.preItemList[index][property] = 0
     this.billingDatails("edit",index)
      this.toastr.error('Invalindex Amount');
      return false;
    }
  }

  


  @HostListener('keydown', ['$event']) onKeyDown(event) {

  let e = <KeyboardEvent> event;
  if (this.OnlyNumber) {
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode == 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode == 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode == 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
      }
    }
}
saveQuotation(){
let now=new Date()
console.log("this.strEmail",this.strEmail)
let today = moment(now).format('YYYY-MM-DD');
let datValidTill= moment(this.datValid).format('YYYY-MM-DD');
let checkerror=false

  if(!this.intContactNo){
    this.toastr.error('Invalid Mobile Number!','Error!');
  }
  else if((this.intContactNo).toString().length<10){
    this.toastr.error('Invalid Mobile Number!','Error!');
    return false        
  }
  else if(!this.strName){
      this.toastr.error('Enter customer name!','Error!');
    return false        
  }
 
  else if(this.strEmail!=undefined){
    const eatpos = this.strEmail.indexOf('@');
    const edotpos = this.strEmail.lastIndexOf('.');
    if ( eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.strEmail.length) {
      // validationSuccess = false ;
   
      // this.strEmail=null;
      // this.emailId.first.nativeElement.focus();
      checkerror=true
      }}
  if(checkerror){
      this.toastr.error('Email format is not correct ','Error!');
          return false}
  else if (this.selectedCustState != this.strCustState|| !this.selectedCustState)
  {
    this.toastr.error('Valid State Name is required', 'Error!');
    this.intCustStateId = null
    this.strCustState = ''
    this.selectedCustState=''
    return false;
  }
  else if (datValidTill < today) {
    
    this.toastr.error('Invalid Valid till  date', 'Error!');
    return false;
  }
  else if(this.lstItemDetails.length==0){
    this.toastr.error('Select atleast one item', 'Error!');
    return false;

  }
  
  
  else{
    let dictData={}


  dictData['intBuyBack']=this.intBuyBack
  // dictData['lstItemDetails']=this.lstItemDetails
  dictData['datValidTill']=datValidTill
  dictData['strName']=this.strName
  dictData['intContactNo']=this.intContactNo
  dictData['strCustState']=this.strCustState
  dictData['strAddress']=this.strAddress
  dictData['strRemarks']=this.strRemarks
  dictData['strEmail']=this.strEmail
  dictData['strGSTNo']=this.strGSTNo
  dictData['intCustStateId']=this.intCustStateId
  
  // dictData['intKfcTot']=this.intKfcTot
  // dictData['intTotCGST']=this.intTotCGST
  // dictData['intTotSGST']=this.intTotSGST
  // dictData['intTotIGST']=this.intTotIGST
  // dictData['blnCheckIGST']=this.blnCheckIGST
  // dictData['intGrandTot']=this.intGrandTot
  // dictData['intDiscount']=this.intDiscount

   dictData['dct_item_data']={'intKfcTot':this.intKfcTot,'intTotCGST':this.intTotCGST,'intTotSGST':this.intTotSGST,'intTotIGST':this.intTotIGST,
  'blnCheckIGST':this.blnCheckIGST,'intGrandTot':this.intGrandTot,'intDiscount':this.intDiscount,'lstItemDetails':this.lstItemDetails}

  this.saveDisable=true;
    console.log("sucess");
    this.serviceObject
    .postData('quotation/add/',dictData)
    .subscribe(
      (res) => {
      
        if (res.status == 1)
        {

          swal.fire({
            position: "center",
            type: "success",
            text: "Data saved successfully",
            showConfirmButton: true,
          });
          this.printDisable=false;
          this.saveDisable=true;
          this.quotationId=res['intId']

          
        }
        else if (res.status == 0) {
          swal.fire('Error!',res['message'], 'error');
          this.saveDisable=false;
          
          // this.lstItemDetails=[]
        }

      },
      (error) => {
        swal.fire('Error!','Server Error!!', 'error');
        this.saveDisable=false;
        
      });
    
  }



}
 
}
