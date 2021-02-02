
import {debounceTime} from 'rxjs/operators';
import { Component,ViewChild,OnInit,ElementRef ,ViewChildren, HostListener, Input} from '@angular/core';
import {NgbModal,ModalDismissReasons,NgbActiveModal,} from '@ng-bootstrap/ng-bootstrap';
import * as tableData from './invoice-table';
import { LocalDataSource } from 'ng2-smart-table';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FullComponent } from 'src/app/layouts/full/full.component';


import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-jioinvoiceview',
  templateUrl: './jioinvoiceview.component.html',
  styleUrls: ['./jioinvoiceview.component.css']
})
export class JioinvoiceviewComponent implements OnInit {
  source: LocalDataSource;
  source2: LocalDataSource;
  
  closeResult: string;
   intSalesCustId: Number

  @Input() OnlyNumber: boolean;
  @Input() date1:Date;

  constructor(
    private modalService: NgbModal,private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private fullObject: FullComponent,
    private cdRef:ChangeDetectorRef,
    private spinner: NgxSpinnerService,
  ) {
    this.source2 = new LocalDataSource(tableData.data); // create the source
   }
   showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  

  @ViewChild('itemId') itemId : ElementRef;
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

  strGroupName = localStorage.getItem("group_name");

  // settings = tableData.settings;
  intAdvncPaid = 0
  nodeHost = '';
  blnPayment=false;
  blnBharathQr = false;

  intBharathQrMobileNumber:number=null;
  intBharathQrAmount:number = null;
  strBharathQrTransactionNum ='';
  strBharathQrReferenceNum = '';
  
  settings2 = tableData.settings2;
  salesRowId= localStorage.getItem('salesRowId');
  branchName = localStorage.getItem('BranchName');
  salesStatus = localStorage.getItem('salesStatus');
  intContactNo=null
  strName:''
  strEmail;
  strStaff;
  intTotPoints;
  intTotPointsCopy;
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
  intTotal=0
  intTax=0
  intTotCGST=0
  intTotSGST=0
  intTotIGST=0
  intReturnAmt=0
  intSpareTotal=0

  partialId=0
  custId=0

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
  objectKeys;
  intCustId:null
  editField: string;
  lstItemDetails: Array<any> = []
  lstSpareDetails: Array<any> = []
  blnShowData=2;
  intCreditCc;
  intDebitCc;
  lstItemLength;
  blnImei = false;
  blnService=false
  time = new Date();
  blnServiceCheck=false
  lstBankNames=[]


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


  newItem= { intItemId: null,
    strItemName: '',
    dblMarginAmount:0,    
    dblMopAmount:0,    
    strImei:'0',
    dblRate:0,
    dblBuyBack:0,
    dblDiscount:0,
    dblCGST:0,
    dblSGST:0,
    dblIGST:0,
    dblAmount:0,
    intQuantity:1,
    intStatus:1,
    strItemCode:null,
    blnService:null

  }
  strRemarks='';
  intBuyBack=0
  strGSTNo
  strAddress:''

  showModalSerDelivery;
  showModalPoints;
  showModalCoupon;
  showModalFilter;
  showModalPayment;
  showModalCustEdit;
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
  strState:'';
  selectedState;

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

  searchEmi: FormControl = new FormControl();
  searchCreditEmi: FormControl = new FormControl();

  


  blnCash=false;
  blnFinance=false;
  blnCreditCard=false;
  blnDebitCard=false;
  blnPaytm=false;
  blnGooglepay=false;
  blnReceipt=false;
  blnReceiptDisable=false;

  blnPaytmMall = false;

  strFinanceName;
  strFinanceScheme;
  intFinanceAmt;
  intEMI;
  intDownPayment;
  intDeliveryNo;
  intCashAmt;
  intReceivedAmt=0;
  intBalanceAmt=0;
  strDebitCardNo;
  strDebitBankName;
  intDebitAmt=0;
  strDebitRefNo ;
  strEmi= '';
  lstEmiOptions = [];
  strSelectedEmi = '';
  intEmiDebitId;
  strCreditCardNo;
  strCreditBankName;
  intCreditAmt=0;
  strCreditRefNo;
  strEmiCredit='';
  lstEmiCreditOptions =[];
  strSelectedCreditEmi = '';
  intEmiCreditId;
  intKfcTot = 0 ;

  clickRowId;
  lstClickOrder=[]
  intFixedAmt;
  strReceiptNumber;
  intDebitBankId=null;
  intCreditBankId=null;
  // lstReceipt= [{'receipt_num':'rst123','amount':1452},{'receipt_num':'rst485','amount':1000}];
  lstReceipt = [];
  intReceiptTot;
  blnMatching=false;
  intApprove =0
  blnApproved =false
  

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

// status variable 
blnCashStatus= false;
blnCreditStatus = false;
blnDebitStatus = false;
blnPaytmStatus = false;
blnPaytmMallStatus = false;
// status variable


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
blnExchangeInvoice = false;
blnCheckExchange=false

intKfc = 0 ;
intExchangeSalesAmount = 0;
blnStart = false;
intExtraFinanceAmt=0
blnReturn = false;

style='bordernone'
  // credit sale customer type 4
  intCustomerType;
  blnCreditSale=false;
  dblPartialAmount=0;
  dblBalanceAmount=0;
  blnMakePayment=true;
  intCreditBalance=0


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
  public imagePath1;
  imgURL1: any;
  public imagePath2;
  imgURL2: any;
  public imagePath3;
  imgURL3: any;


  keyEve1;
  newTime1;
  setStart1;

  keyEve2;
  newTime2;
  setStart2;

  int_Credit_Sale ;
  intCreditSale =false;
  

total_receipt = 0;
  
  @ViewChild('file1') file1: any;
  form: FormGroup;

  printInvoice(){
    let dctInvoiceId={invoiceId:this.invoiceId};


    this.serviceObject.postData('invoice/invoice_print/',dctInvoiceId).subscribe(
      response => {

        if(response['status']==1){

           const file_data = response['file'];
           const pdf = 'data:application/octet-stream;base64,' + file_data.substring(2, file_data.length - 1);
           const dlnk = document.createElement('a');
           dlnk.href = pdf;
           dlnk.download = response['file_name'];
           document.body.appendChild(dlnk);
           dlnk.click();
           dlnk.remove();
           swal.fire('Success!','Successfully downloaded');



          // let file=response['data']
          // let link=this.serviceObject.hostAddress+file;

          // var a = document.createElement('a');
          // document.body.appendChild(a);
          // a.href = link;
          // a.download = "report.xlsx";
          // a.click();
          // window.URL.revokeObjectURL(link);
          // a.remove();
          localStorage.setItem('previousUrl','invoice/listinvoice');

          this.router.navigate(['invoice/listinvoice']);

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
    localStorage.setItem('invoiceReceipt','')
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

    this.url = this.serviceObject['url']
    this.hostaddress = this.serviceObject.hostAddress
    this.hostaddress = this.hostaddress.slice(0, this.hostaddress.length - 1)
    this.printDisable=true; //disable print button
    this.saveDisable=false; //enable save button
    this.blnCash=false;
    this.blnFinance=false;
    this.blnCreditCard=false;
    this.blnDebitCard=false;
    this.blnPaytm=false;
    this.blnGooglepay=false;
    this.fullObject.setInvoice()
    this.objectKeys = Object.keys;
    this.dctData['details']=[]
    this.dctData['billingDetails']=[]
    this.dctData['custEditData']=[]
    this.dctData['lstDeliveryData']={}
    this.dctData['lstPaymentData']={}
    this.dctData['lstFilterData']={}

    this.form = this.formBuilder.group({
          img1: [''],
          img2: [''],
          img3: [''],
    });

    this.source = new LocalDataSource(this.dctData['details']); // create the source

    // update time 
    setInterval(() => {
      this.time = new Date();
   }, 1000);


    this.searchItemName.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstItemName = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('itemcategory/item_typeahead_api/',{term:strData})
            .subscribe(
              (response) => {
                this.lstItemName = response['data'];

              }
            );
          }
        }
      }
    );

    this.searchCity.valueChanges.pipe(
    debounceTime(400))
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

    this.searchState.valueChanges.pipe(
    debounceTime(400))
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

    this.searchItem.valueChanges.pipe(
    debounceTime(400))
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

    this.searchItemCategory.valueChanges.pipe(
    debounceTime(400))
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

    this.searchItemGroup.valueChanges.pipe(
    debounceTime(400))
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

    this.getBankNames()
    this.getData()
  }
  getBankNames(){
    this.lstBankNames=[];
    this.serviceObject.getData('invoice/bank_typeahead/').subscribe(res => {
      
      this.lstBankNames = res['data'];
    });
  }
  bankChanged(item,type){
    
    if(type=='credit'){
      this.strCreditBankName=item.vchr_name;
    }
    else if(type=='debit'){
      this.strDebitBankName=item.vchr_name;

    }
  }

   // open modal
   opendelivery(content1) {
    this.showModalSerDelivery= this.modalService.open(content1, { centered: true, size: 'sm' });
  }
  openloyalty(content3) {
    this.showModalPoints= this.modalService.open(content3, { centered: true, size: 'sm', windowClass: 'custom-class' });
  }
  opencouponcode(content2) {
    this.showModalCoupon= this.modalService.open(content2, { centered: true, size: 'sm', windowClass: 'custom-class' });
  }
  openfilteritem(filteritem) {
    this.showModalFilter= this.modalService.open(filteritem, { size: 'lg', windowClass: 'filteritemclass' });
  }
  openmakepayment(makepayment) {
    let dctReceiptData = {}
    // this.blnCash = false;
    // this.blnCreditCard = false;
    // this.blnDebitCard = false;
    // this.blnFinance = false;
    // dctReceiptData['intCustomerId']=this.intCustId;
    dctReceiptData['intCustomerMob']=this.intContactNo;
    dctReceiptData['intTotalAmount']=this.intGrandTot;
    dctReceiptData['partial_id']=this.partialId;
    dctReceiptData['intCustId']=this.intCustId;
    dctReceiptData['intCustType']=this.intCustomerType;

    if(this.salesStatus == '3'){
      dctReceiptData['blnService']=true;
      this.serviceObject.postData('invoice/receipt_list/',dctReceiptData).subscribe(res => {

        if (res.status == 1)
        {
        this.blnReceipt = res['bln_receipt'];
        this.blnReceiptDisable = res['bln_receipt'];
        this.lstReceipt = res['lst_receipt'];
        this.lstReceipt.forEach(element => {
          element['receipt'] = true;
          
        });
        this.intReceiptTot = res['receipt_tot'];
        this.blnMatching = res['bln_matching'];
        if (this.intApprove == 4){
          if(this.blnReceipt && !this.blnFinance ){
            this.intBalanceAmt = this.dblPartialAmount-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)
          }
          else if(this.blnFinance && !this.blnReceipt){        
            this.intBalanceAmt=(this.dblPartialAmount-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
          }
          else if(this.blnReceipt && this.blnFinance){
            this.intBalanceAmt=(this.dblPartialAmount-this.intFinanceAmt-this.intReceiptTot)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
          }
          else{        
              this.intBalanceAmt = this.dblPartialAmount-(this.intCreditAmt + this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
          }
        } 
        else{
          if(this.blnReceipt && !this.blnFinance ){
            this.intBalanceAmt = this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)
          }
          else if(this.blnFinance && !this.blnReceipt){        
            this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
          }
          else if(this.blnReceipt && this.blnFinance){
            this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
          }
          else{        
              this.intBalanceAmt = this.intGrandTot-(this.intCreditAmt + this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
          }
        }

        // if(this.blnReceipt && !this.blnFinance ){
        //   this.intBalanceAmt = this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)
        // }
        // else if(this.blnFinance && !this.blnReceipt){
        //   this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
        // }
        // else if(this.blnReceipt && this.blnFinance){
        //   this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
        // }
        // else{
        //     this.intBalanceAmt = this.intGrandTot-(this.intCreditAmt + this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
        // }
  
        // Onload Spinner
         this.showSpinner()
      
         
        }
        else if (res.status == 0) {
          swal.fire('Error!','Something went wrong!!', 'error');
          this.lstItemDetails=[]
         }
     },
     (error) => {
      swal.fire('Error!','Server Error!!', 'error');
     });
    }
   

    this.showModalPayment= this.modalService.open(makepayment, { size: 'lg' })
  }
  opencustomeredit(customeredit) {
    this.showModalCustEdit= this.modalService.open(customeredit, { size: 'lg' });
  }
  openIndirectDiscount(discount,id) {
    // this.discoundIndex=id
    this.currentIndex=id
    this.showModalDiscount= this.modalService.open(discount, { centered: true, size: 'sm', windowClass: 'custom-class' });
  }
  opensalesreturn(salesreturn) {
    this.blnReturnData = false;
    this.showModalReturn= this.modalService.open(salesreturn, { centered: true, size: 'lg'});
  }

  openReturnDetails(returnItem,index,id) {
    // this.currentIndex=index
    this.currentIndex=index
    this.returnId=id
  //to check the returned item is already exit on the table
   if(!this.lstcheckReturn.includes(this.currentIndex))
   {
      this.lstcheckReturn.push(this.currentIndex)
      this.dctReturnDetail[this.currentIndex]= {
        strRemark:'',
        image:'',
        blnDamage:false,
        imgURL:''
      }
   }

    this.showModalReturnDetails= this.modalService.open(returnItem, { size: 'sm' });
  }
  openComboOffers(item,comboOffer) {
    this.intStyleIndex = 0;
    this.offerItem=item.strItemName;
    let dctItem={itemId:item.intItemId};
    this.dctCombo={};
    this.lstCombo=[];
    this.serviceObject.postData('add_combo/item_offers/',dctItem).subscribe(result => {

      if (result.status == 1)
      {
        this.dctLen=Object.keys(result['data']);
        this.dctCombo=result['data'];
        this.lstCombo=Object.keys(this.dctCombo);

      }
      else if(result.status == 0)
      {
        swal.fire('Error!',result['data'], 'error');

      }
    },
    (error) => {
      swal.fire('Error!','Server Error!!', 'error');
     });

    this.showModalOffer= this.modalService.open(comboOffer, { centered: true, size: 'lg'});
  }
  openExchangeImage(exchange,index,id) {
    this.currentIndex=index
    this.dctExchangeImage[this.currentIndex]=this.lstItemDetails[this.currentIndex]['dctImages']
    this.showModalExchange= this.modalService.open(exchange, { centered: true, size: 'lg'});
  }

  hideModal(){
    this.showModalOffer.close();
  }

 
  productNgModelChanged(event){
    if(this.currentProduct!=this.selectedProduct){
      this.intProductId = null;
        this.strProduct = '';
    }
  }

  productChanged(item)
   {
    this.currentProduct= item.name
    this.intProductId = item.id;
    this.strProduct = item.name;
    this.selectedProduct = item.name;


  }
   brandNgModelChanged(event){
    if(this.currentBrand!=this.selectedBrand){
      this.intBrandId = null;
      this.strBrand = '';
    }
  }
  brandChanged(item)
   {
      this.currentBrand = item.name;
      this.intBrandId = item.id;
      this.strBrand = item.name;
      this.selectedBrand = item.name;
      
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



  itemNameChanged(item)
   {
    this.IntItemNameId = item.strItemId;
    this.newItem.intItemId=item.strItemId;
    this.strItemName = item.strItemName;
    this.newItem.strImei="0"
    this.newItem.dblBuyBack=0
    this.newItem.dblDiscount=0
    this.newItem.dblCGST=0
    this.newItem.dblSGST=0
    this.newItem.dblIGST=0
    this.newItem.dblAmount=0
    this.newItem.strItemCode=item.strItemCode
    this.newItem.blnService = item.blnService;


  }

  cityChanged(item)
   {
    this.intCityId = item.pk_bint_id;
    this.strCity = item.vchr_name;
    this.strPincode= item.vchr_pin_code;
  }
  custCityChanged(item)
   {
    this.intCustCityId = item.pk_bint_id;
    this.strCustCity = item.vchr_name;
    this.strCustPinCode= item.vchr_pin_code;
  }

  stateChanged(item)
   {
    this.intStateId = item.pk_bint_id;
    this.strState = item.vchr_name;
  }

  custStateChanged(item)
   {
    this.intCustStateId = item.pk_bint_id;
    this.strCustState = item.vchr_name;
  }

  ImeiCopy = ''
  copyImei(item){
    this.ImeiCopy = JSON.parse(JSON.stringify(item['strImei']))
  }

  focusOutImei(item,index){
// console.log(item,this.lstItemDetails);
// console.log(this.ImeiCopy);

    // item['strImei']


    let blnImeiExists = true
    let blnCheck=true
    let dct={}
    dct['pk_bint_id']= item.intItemId
    dct['intCustId']= this.intCustId
    dct['strImei']=''
    // ================================================================================

        // console.log('list',this.lst_imei,index);

        if (this.lst_imei.includes(item['strImei'])){
          // console.log('first',this.lst_imei,item['strImei']);
          // if (this.lst_imei.includes(this.ImeiCopy)){
          //   let idx ;
          //   idx = this.lst_imei.indexOf(this.ImeiCopy,1)
          //   this.lst_imei.splice(idx,idx)
          // }

          // if(this.ImeiCopy != item.strImei){
            // console.log('asdff',this.ImeiCopy , item.strImei,index);
            //  if (this.lst_imei.includes(this.ImeiCopy)){
            //    let idx ;
            //    idx = this.lst_imei.indexOf(this.ImeiCopy,1)
            //    this.lst_imei.splice(idx,1)
            //  }
            for (let i = 0; i < this.lstItemDetails.length; i++) {
              if (this.lstItemDetails[i].hasOwnProperty('blnService')) {
                if(item.blnService === false
                 && this.lstItemDetails[i]['blnService'] === item.blnService
                 && this.lstItemDetails[i]['strImei']=== item['strImei']) {
                  swal.fire('Error!','Already Exist', 'error');
                  blnImeiExists = false;
                  if(index=='newItem'){
                    this.newItem.strImei='0'
                    if(!this.blnCheckIGST)
                    {
                      item.dblCGST=0
                      item.dblSGST=0
                    }
                    else{
                      item.dblIGST=0
                    }
                  }
                  else{
                        this.lstItemDetails[index]['strImei']='0'

                        if(!this.blnCheckIGST)
                        {
                          item.dblCGST=0
                          item.dblSGST=0
                        }
                        else{
                          item.dblIGST=0
                        }
                      }
                  blnCheck=false

                }

              }

            }

            //  }else{

            //  }
        }
        if(blnImeiExists) {
          dct['strImei']=item.strImei
          blnCheck=true
        }


    if(blnCheck && dct['strImei'] && dct['strImei']!='0')
    {
      if(!item.intItemId){
        swal.fire('Error!','Item Name is required', 'error');
        if(index=='newItem')
        {
          this.newItem.strImei='0'
        }
        else{
          this.lstItemDetails[index]['strImei']='0'
        }
        return false
      }
      else{
        this.serviceObject.postData('branch_stock/get_price_for_item/',dct).subscribe(res => {

          if (res.status == 1)
          {
            if(!this.blnCheckIGST)
            {
              item.dblCGST=res['data']['dblCGST']
              item.dblSGST=res['data']['dblSGST']
              item.dblRate=res['data']['dblRate']
              item.dblAmount=(item.dblCGST+item.dblSGST+item.dblRate)-(item.dblBuyBack+item.dblDiscount)
            }
            else{
              item.dblIGST=res['data']['dblIGST']
              item.dblRate=res['data']['dblRate']
              item.dblAmount=(item.dblIGST+item.dblRate)-(item.dblBuyBack+item.dblDiscount)
            }
            this.billingDatails("other",0);

          }
          else if(res.status == 0)
          {
            swal.fire('Error!',res['data'], 'error');
            // if(item.hasOwnProperty('imei')){
            //   item.imei=''
            // }
            // else{
              // item.strImei= 0;
          //  }
          }
        },
        (error) => {
          swal.fire('Error!','Server Error!!', 'error');
         });
      }

    }
  }


  getData(){
    this.dctData['billingdetails']=[]
    this.dctData['billingdetailsCopy']=[]
    this. dctData['intId']=this.salesRowId
    this. dctData['bln_approve']=this.blnApproved
    this. dctData['int_approve']=this.intApprove
    // this.dctData['exchangeImage']={}
    this.serviceObject.postData('invoice/sales_list/',this.dctData).subscribe(res => {

      if (res.status == 1)
      {
      this.dblPartialAmount = res['data']['dblPartialAmount']      
      this.dblBalanceAmount = res['data']['dblBalanceAmount'];
      if(res['data']['int_credit_sale']){
        console.log("credit");
        
        this.int_Credit_Sale = res['data']['int_credit_sale'];

        if(res['data']['int_credit_sale'] == 1){
          this.blnCreditSale = true;          
          this.intCreditSale = true;
         
        }

      }   
      this.lstItemDetails=res['data']['lstItems'];
      this.lstSpareDetails=res['data']['lst_spare'];
      this.intApprove = res['data']['int_approve']
      this.blnApproved = res['data']['bln_approve']
      this.lstItemLength = this.lstItemDetails.length;
      this.intCustId=res['data']['intCustId']
      this.intContactNo= res['data']['intContactNo']
      this.strEmail = res['data']['strCustEmail']
      this.strStaff= res['data']['strStaffName'];
      this.strName = res['data']['strCustName']
      this.strInitRemarks =res['data']['txtRemarks']
      this.blnCheckIGST=res['data']['blnIGST']
      this.selectedCity=res['data']['strLocation']
      this.strCity=res['data']['strLocation']
      this.intCityId=res['data']['intLocation']
      this.selectedState=res['data']['strState']
      this.strState=res['data']['strState']
      this.intStateId=res['data']['intState']
      this.strGSTNo=res['data']['strGSTNo']
      this.strAddress=res['data']['txtAddress']
      this.strPincode=res['data']['intPinCode']
      this.intAmtPerPoints=res['data']['intAmtPerPoints']
      this.intCustomerType = res['data']['int_cust_type'];

      this.partialId=res['data']['partial_id']
      this.intCustId=res['data']['intCustId']

      this.intTotPoints=res['data']['intLoyaltyPoint']
      this.intTotAmt= this.intAmtPerPoints * this.intTotPoints
      this.intTotPointsCopy=res['data']['intLoyaltyPoint']
      this.intKfc = res['data']['dbl_kfc_amount'].toFixed(2);
      if(res['data']['int_cust_type']==1 || res['data']['int_cust_type']==2)
      {
        this.blnMakePayment=false
        this.intCreditBalance=res['data']['dbl_credit_balance']
      }
      else
      {
        this.blnMakePayment=true
      }
      
      // console.log('l',this.lstItemLength);
      this.intSalesCustId = res['data']['intSalesCustId']

      if(res['data']['sales_status']==3){
        this.blnService=true
      }
      
      if(this.lstSpareDetails.length>0 && res['data']['int_status']==3){
        this.intSpareTotal=res['data']['dbl_total_spare']
      }
      this.intAdvncPaid = res['data']['dbl_advc_paid']
      
      if(res['data'].sales_status==3){

        this.blnPayment = true
        this.blnServiceCheck= true
      }
      if(res['data'].hasOwnProperty('vchrFinanceName'))
      {
        
        this.blnPayment = true
        this.blnFinance=true
        this.intDownPayment=res['data']['dblDownPayment']
        this.intEMI=res['data']['dblEMI']
        this.intFinanceAmt=res['data']['dblFinanceAmt']
        this.intDeliveryNo=res['data']['vchrFinOrdrNum']
        this.strFinanceName=res['data']['vchrFinanceName']
        if(res['data']['vchrFinanceSchema'])
        {
          this.strFinanceScheme=res['data']['vchrFinanceSchema']
        }
        else{
          this.strFinanceScheme="---"
        }
      }
      //

      this.lstItemDetails.map(element=>{
        this.lst_imei.push(element['strImei'])
      })

      this.dctData['custEditData']['strEmail']=res['data']['strCustEmail']
      this.dctData['custEditData']['strAddress']=res['data']['txtAddress']
      this.dctData['custEditData']['strState']=res['data']['strState']
      this.dctData['custEditData']['intStateId']=res['data']['intState']
      this.dctData['custEditData']['intCityId']=res['data']['intLocation']
      this.dctData['custEditData']['strCity']=res['data']['strLocation']
      this.dctData['custEditData']['strGSTNo']=res['data']['strGSTNo']
   // ====================================================================
        this.dctData['custEditData']['intCustId'] = res['data']['intCustId']
        this.intSalesCustId=res['data']['intSalesCustId']
  
    // ====================================================================
      this.billingDatails("other",0);

      // Onload Spinner
       this.showSpinner()

      }
      else if (res.status == 0) {
        swal.fire('Error!',res['message'], 'error');
        this.lstItemDetails=[]
       }
   },
   (error) => {
    swal.fire('Error!','Server Error!!', 'error');
   });

  }



  calcKfc(){
    // console.log("in calc fn");
    
    
    this.intKfcTot=0;
    this.intExchangeSalesAmount = 0;
    
 
    

    
  

    this.lstItemDetails.map(element=>{

      let intKfc=0;
      let tempAmt=0;
      let AmtWithoutTax=0;
      let taxPer=0;
      let taxPoint=0;
      
      // console.log(element.intKfc,"element.intKfc");
      
      if(((element.intKfc==0)||(element.intKfc==undefined)) && element.intStatus!=2 && !this.blnCheckExchange)
      {
        
        taxPer=element.dblCGSTPer+element.dblSGSTPer+1;
        // console.log("taxPer######",taxPer);
        // console.log("element.dblBuyBack",element.dblBuyBack);
        // console.log("element.dblAmount",element.dblAmount);
       
        // if(element.dblBuyBack){
        //   tempAmt=Number(element.dblAmount+element.dblBuyBack);
         
        // }
        // else 
        
        if(this.blnExchangeInvoice){
          if(element.dblAmount > 0){
            this.intExchangeSalesAmount = element.dblAmount - element.exchange_sale_amount;
            console.log(element.dblAmount , element.exchange_sale_amount);
            
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
    
        console.log(tempAmt,taxPoint,taxPer,"tempAmt,taxPoint");
        
        AmtWithoutTax=tempAmt/taxPoint;
       
        


        intKfc=(AmtWithoutTax)/100;

        element.intKfc=Number(intKfc);
        console.log(" intKfcdsf" ,intKfc,"g",AmtWithoutTax)
        console.log(this.blnExchangeInvoice,'exchange');
        
        
        if(!this.blnExchangeInvoice && this.blnStart && element.intStatus!=2){
          element.dblRate-=Number(element.intKfc);
        }
        // this.blnStart = false;
      
       

        if (element.intStatus!=0){
          this.intKfcTot+=Number(intKfc);
         
          
        }
        

      }
      else if(!this.blnCheckExchange){
       
        
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
            console.log(" hvgyhintKfc" , element.dblRate,"",element.exchange_sale_amount)
            element.intKfc=Number(intKfc);
            
          }
          else{
            intKfc = element.dblRate/100
            element.intKfc=Number(intKfc);
            
          }

         
          
          this.intKfcTot+=Number(intKfc);
          console.log(" hvgyhintKfc" , this.intKfcTot)
          
        }
      }

      if( element.intStatus == 2){
        element.dblRate=element.dblAmount
      }
      if(this.blnCheckExchange){
        this.intKfcTot+=Number(element.intKfc);
        
      }


    })
console.log(this.lstItemDetails,"lstItemDetails");


 
        this.blnStart = false;

        

  }

  billingDatails(type,index){
   

    if(!this.blnCheckIGST&&(this.strGSTNo==""||this.strGSTNo==null)){
      
      // console.log("if(!this.blnCheckIGST&&this.strGSTNo",this.blnCheckIGST,this.strGSTNo);
      
      // if(!this.blnExchangeInvoice){             //blnexchange kfc note consider
      
      if(!this.blnReturn){
        this.calcKfc();
      }
      
                                              
      console.log(this.lstItemDetails,"lstItemDetails");
      
    // }

    }
    else{
// 
// console.log("elseeee");

   
      

      if(this.intKfcTot>0 ){
      
        
        this.lstItemDetails.map(element=>{

          // let intKfc=0;
          // intKfc=(element.dblRate)/100;
          // element.intKfc=intKfc;
          if(element.intStatus!=2){
            element.dblRate+=element.intKfc;
          }
          element.intKfc=0;
          // console.log("intKfc",intKfc);
          // this.intKfcTot+=intKfc;
    
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

 
    // if(this.intKfcTot>0){

    //   this.intTotal=0;
      
    //   this.lstItemDetails.map(element=>{

    //     if (element.intStatus != 0){
    //       this.intTotal+=element.dblRate;
    //     }
    //     console.log( this.intTotal,"org");
        
    //     // let intKfc=0;
    //     // intKfc=(element.dblRate)/100;
    //     // element.intKfc=intKfc;
    //     // element.dblRate-=element.intKfc;

    //     // console.log("element.dblAmount",element.dblAmount);
    //     // this.intKfcTot+=intKfc;
  
    //   })

      
    // }


   

    
    let indexOfList=0
    for(let item of this.lstItemDetails)
    {

      let kfcVal=0;

      if(item.intKfc){
        kfcVal=item.intKfc;
        // console.log("item.intKfc",item.intKfc)
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

            item.dblAmount = Number((item.dblMopAmount + item.dblMarginAmount -(item.dblDiscount+item.dblBuyBack)).toFixed(2))
            console.log(  item.dblAmount,item.dblRate,'amount0');
           
            this.calculateRate(indexOfList,false)

            this.dctCount['tax']=item.dblCGST+item.dblSGST
            this.intTotSGST= this.intTotSGST+item.dblSGST
            this.intTotCGST= this.intTotCGST+item.dblCGST
  
          } 
          else{
            item.dblAmount = Number((item.dblMopAmount + item.dblMarginAmount - (item.dblDiscount + item.dblBuyBack)).toFixed(2))
           console.log(  item.dblAmount,item.dblRate,'amount1');
           
            this.calculateRate(indexOfList,true)
            
            this.dctCount['tax']=item.dblIGST
            this.intTotIGST= this.intTotIGST+item.dblIGST
          }

        
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

   if(type=="edit"){
     let kfcVal=0;
     if(this.lstItemDetails[index].intKfc){
      kfcVal=this.lstItemDetails[index].intKfc;
     }
     else{
      kfcVal=0;
     }
      

        if(this.blnCheckIGST){
          this.lstItemDetails[index].dblAmount = Number((this.lstItemDetails[index].dblMopAmount + this.lstItemDetails[index].dblMarginAmount - this.lstItemDetails[index].dblBuyBack - this.lstItemDetails[index].dblDiscount).toFixed(2))
          this.calculateRate(index,true)
        }
        else{
          this.lstItemDetails[index].dblAmount = Number((this.lstItemDetails[index].dblMopAmount + this.lstItemDetails[index].dblMarginAmount - this.lstItemDetails[index].dblBuyBack - this.lstItemDetails[index].dblDiscount).toFixed(2))
          // console.log("else")
        
          this.calculateRate(index,false)
        }
      // }

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
            this.newItem.dblAmount = Number((this.newItem.dblMopAmount + this.newItem.dblMarginAmount - this.newItem.dblBuyBack - this.newItem.dblDiscount).toFixed(2))
            this.calculateRate(index,true)
           
          }
            else{
            this.newItem.dblAmount = Number((this.newItem.dblMopAmount  + this.newItem.dblMarginAmount - this.newItem.dblBuyBack - this.newItem.dblDiscount).toFixed(2))
            this.calculateRate(index,false)

            }
        }
        // console.log("this.intGrandTot#########",this.intGrandTot,  this.intTotSGST , this.intTotCGST , this.intTotIGST,this.intTotal, this.intDiscount,this.intBuyBack,this.intReturnAmt,this.intCouponDisc,this.intTotIndirectDis);

    
        // if(this.blnFinance){
        //   this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt)+this.intExtraFinanceAmt;
    
        // }
        // else{
        //   this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt);
        // }
    
        if(this.blnFinance){
          if(this.intApprove ==3 || this.intApprove == 4){
          this.intBalanceAmt=(this.dblPartialAmount-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt)+this.intExtraFinanceAmt;            
          }else{
          this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt)+this.intExtraFinanceAmt;
          }
        }
        else{
          if(this.intApprove ==3 || this.intApprove == 4){
          this.intBalanceAmt=this.dblPartialAmount-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt);
        }else{
          this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt);          
        }
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
 
        
        this.intGrandTot=Number(this.intGrandTot)+Number(this.intKfcTot);

    this.dctData['billingdetailsCopy'] = {}

    // let dct_dup = {}
    // console.log('billingdetails', this.dctData['billingdetails']);
    // this.dctData['billingdetails'].map(item=>{
      
    //   if (!asd.includes(item['id']))
    //   {
    //     asd.push(item['id'])
        
    //     console.log('item',item);
    //     console.log('item1',item['name']);
    //     this.dctData['billingdetailsCopy'][item['id']]['name'] = JSON.parse(JSON.stringify(this.dctData['billingdetails'][item['id']]['name']))
    //     console.log('item2',item['name']);
    //     this.dctData['billingdetailsCopy'][item['id']]['amt'] = JSON.parse(JSON.stringify(this.dctData['billingdetails'][item['id']]['amt']))
    //     this.dctData['billingdetailsCopy'][item['id']]['qty'] = JSON.parse(JSON.stringify(this.dctData['billingdetails'][item['id']]['rate']))
        
    //   }
    //   else{
    //     console.log('2',item['id'], item);
    //     this.dctData['billingdetailsCopy'][item['id']]['amt'] = JSON.parse(JSON.stringify(this.dctData['billingdetailsCopy'][item['id']]['amt'])) + JSON.parse(JSON.stringify(this.dctData['billingdetails'][item['id']]['rate']))
    //     this.dctData['billingdetailsCopy'][item['id']]['qty'] = this.dctData['billingdetailsCopy'][item['id']]['qty'] + 1
    //     console.log('3',item['id'], item);
    //   }
    // })
    // console.log('billingdetailsCopy', this.dctData['billingdetailsCopy']);
// ======================================================================================

    let asd = []
    let dct_dup = {}
    this.dctData['billingdetails'].map(item => {
      if(item.status!=2){
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
      }
      // else{
      //   this.intExchange+=item['amt']
      // }

    })
    // this.intExchange=(this.intExchange)*-1
    // this.intGrandTot=this.intGrandTot-this.intExchange
    // console.log(this.intExchange,"intExchange");
    
    this.dctData['billingdetailsCopy'] = dct_dup

// ======================================================================================
    // console.log('billingdetailsCopy', this.dctData['billingdetailsCopy']);
    // this.dctData['billingdetails'].map(item=>{
    //   if (!asd.includes(item['id']))
    //   {
    //     asd.push(item['id'])
    //     this.dctData['billingdetailsCopy'][item['id']] = item

    //   }
    //   else{
    //     this.dctData['billingdetailsCopy'][item['id']]['amt'] = JSON.parse(JSON.stringify(this.dctData['billingdetailsCopy'][item['id']]['amt'])) + JSON.parse(JSON.stringify(this.dctData['billingdetailsCopy'][item['id']]['rate']))
    //     this.dctData['billingdetailsCopy'][item['id']]['qty'] = this.dctData['billingdetailsCopy'][item['id']]['qty'] + 1
    //   }
    // })
    // console.log('billingdetails', this.dctData['billingdetails']);
    this.BalanceAmountCalc()   

    if(this.intApprove==3)
    {
      this.intBalanceAmt=this.dblPartialAmount;
    }
    
    

  }
  calculateRate(index,check){
    // console.log("rate",index);
    
    // let index=0
    // this.lstItemDetails.forEach(element => {
       
          if(check){
            this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount']) * 100) / (100 + this.lstItemDetails[index]['dblIGSTPer'])
            this.lstItemDetails[index]['dblIGST'] = (this.lstItemDetails[index]['dblIGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100            
          }
          else if(!this.strGSTNo) {
            this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer']+1)
            this.lstItemDetails[index]['dblCGST'] = (this.lstItemDetails[index]['dblCGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100         // in exchange the difference of amount is taken 
            this.lstItemDetails[index]['dblSGST'] = (this.lstItemDetails[index]['dblSGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
            this.calcKfc()
          
          }
          else{
            this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'])            
            this.lstItemDetails[index]['dblCGST'] = (this.lstItemDetails[index]['dblCGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100         // in exchange the difference of amount is taken 
            this.lstItemDetails[index]['dblSGST'] = (this.lstItemDetails[index]['dblSGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
          }
      
    // });
    // console.log(this.lstItemDetails[index]['dblCGST'], this.lstItemDetails[index]['dblSGST'], this.lstItemDetails[index]['dblIGST'],"lstItemDetails");
    
  }


clearRow(){
  this.newItem= { intItemId: null,
    strItemName: '',
    dblMopAmount:0,
    dblMarginAmount:0,
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

    strItemCode:null,
    blnService :null,
  }
}


  updateList(id: number, property: string, event: any) {

  }
  addNewRow(action,id){
   
    
    
    if(action=='add'){
      
      this.blnImei = true;
      // console.log('data',this.lstItemDetails);
     
      this.newItem = JSON.parse(JSON.stringify(this.lstItemDetails[this.lstItemLength-1]))
      this.lstItemDetails.push(this.newItem);
      this.lstItemLength = this.lstItemDetails.length;
      if(((id+2)==this.lstItemLength)&&(this.blnImei)){
        this.style='border'
      }
      this.lstItemDetails[this.lstItemLength-1]['strImei']= '';
      
    
    
     
      
      this.newItem= { intItemId: null,
        strItemName: '',
        dblMopAmount:0,   
        dblMarginAmount:0,             
        strImei:'0',
        dblRate:0,
        dblBuyBack:0,
        dblDiscount:0,
        dblCGST:0,
        dblSGST:0,
        dblIGST:0,
        dblAmount:0,
        intQuantity:1,
        intStatus:1,
        strItemCode:null,
        blnService:null
      }


      this.billingDatails("other",0);
    }
    else if(action== 'save'){
      
      
      if(this.lstItemDetails[this.lstItemLength-1]['strImei'] == "0" || !this.lstItemDetails[this.lstItemLength-1]['strImei']){
        this.toastr.error('Imei is required', 'Error!');
        return false;
      }
      this.blnImei = false;
      if((!this.blnImei)){
        this.style='bordernone'
      }
      this.newItem = JSON.parse(JSON.stringify(this.lstItemDetails[this.lstItemLength-1]))
    
       this.lst_imei.push( this.newItem['strImei']);
      //  console.log('newItem',this.newItem);
       
    }
    // if(!this.newItem.strItemName){
    //   this.toastr.error('Item Name is required', 'Error!');
    //   return false;
    // }
    //  if(this.newItem.strImei == "0" || !this.newItem.strImei){
    //   this.toastr.error('Imei is required', 'Error!');
    //   return false;
    // }
    // else
    // {
     
    // if(this.lstFilterData.length>0){
    //   if ((Object.keys(this.dct_item)).includes(String(this.lstFilterData[this.clickRowId]['intItemId'])))
    //   {
    //     this.dct_item[this.lstFilterData[ this.clickRowId]['intItemId']] =  this.dct_item[this.lstFilterData[ this.clickRowId]['intItemId']] + 1
    //   }
    //   else{
    //     this.dct_item[this.lstFilterData[ this.clickRowId]['intItemId']] = 1
    //   }
    // }


  //  }
    // console.log('action',(id+1) , this.lstItemLength ,this.blnImei);

  }

  removeRow(id) {
    swal.fire({
      title: 'Are you sure?',
      text: "Are you sure want to delete ?",
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

      if ((Object.keys(this.dct_item)).includes(String(this.lstItemDetails[id]['intItemId'])))
      {
        this.dct_item[this.lstItemDetails[id]['intItemId']] =  this.dct_item[this.lstItemDetails[id]['intItemId']] - 1
      }
      // Removed imei of deleted item from lst_imei --starts
      let delImeiIndex = this.lst_imei.indexOf(this.lstItemDetails[id]['strImei']);
      this.lst_imei.splice(delImeiIndex,1);
      // Removed imei of deleted item from lst_imei --ends

    this.lstIndirectDis.splice(id, 1);
    this.lstItemDetails.splice(id, 1);
    if(id==this.lstItemLength-1){
      this.blnImei = false;
    }
   else{
    this.blnImei = true;
   }
    this.lstItemLength = this.lstItemLength -1;
    
    this.billingDatails("other",0);
      }
    })

  }

  changeValue(index: number, property: string, event: any,item){
  }

  changeDiscountValue(index: number, property: string, event: any,item) {
    // this.editField = event.target.textContent;
    // console.log('index',index);
    
    if(item=="editRow"){
      if(this.lstItemDetails[index].dblDiscount>(this.lstItemDetails[index].dblRate-this.lstItemDetails[index].dblBuyBack))
      {
        this.toastr.error('Invalid Discount', 'Error!');
        this.lstItemDetails[index].dblDiscount=0
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

  OnEnter(id: number, property: string, event: any) {

    let e = <KeyboardEvent>event;
    if (Number(this.lstItemDetails[id][property]) > 1000000) {
      e.preventDefault();
    }
    if (Number(this.lstItemDetails[id][property]) != 0 && !Number(this.lstItemDetails[id][property])
    ) {
      event.view.focus()
      this.toastr.error('Invalid Amount');
      // swal('key', 'Invalid Estimated Amount', 'error');
      return false;
    }
    if (event.keyCode == 13 || event.which == 13){
      event.target.blur()
    }
    // console.log("onenter",this.lstItemDetails[id]);
  }

  OnBlur(index: number, property: string, event: any) {
    if (Number(this.lstItemDetails[index][property]) != 0 &&
      !Number(this.lstItemDetails[index][property])
    ) {
      event.view.frames.focus()
      this.lstItemDetails[index][property] = 0
     this.billingDatails("edit",index)
      this.toastr.error('Invalindex Amount');
      return false;
    }
  }

  saveInvoice()
  {
    console.log("pyment",this.dctData);
    

    if (!this.strFinanceName){
      this.blnCash = true;
      this.savePaymentOption('event')
    }
    
    const form_data = new FormData;
    let error=false

    swal.fire({  //Confirmation before save
      title: 'Save',
      text: "Are sure to sure want to continue ?" ,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes, Save it!",
    }).then(result => {
      if (result.value) {


          if(!this.lstItemDetails){
            this.toastr.error('Atleast One Item is required', 'Error!');
            return
          }
          else{

            this.lstItemDetails.forEach(element =>{
              if(element.intStatus==0)
              {
                if (!(Object.keys(this.dctReturnId)).includes(String(element.intItemId)))
                {
                error=true
                return
                }
              }
              if(element.strImei=='' && element.intStatus == 4){
                // this.toastr.error('Item imei number is required', 'Error!');
                error=true;
                return
              }
            });


            let dctInvoice={}

          if(!error)
          {
            console.log("1 else");

            if(this.intGrandTot<0)
            {
              swal.fire('Error!','Purchase amount should be greater than return amount','error')
            }
            else{
              console.log("2 else");
              
              if(this.objectKeys(this.dctData['lstPaymentData']).length>0 || this.intBalanceAmt<=0)
              {
                console.log("3 else");
                if( !this.blnMakePayment && (this.intCreditBalance<this.intGrandTot))
                {
                  swal.fire('','Your Credit Balance is not enough to purchase items', 'warning');
                }
                else
                {
                // dctInvoice['lstPaymentData']=this.dctData['lstPaymentData']
                // dctInvoice['dctTableData']=this.lstItemDetails
                // dctInvoice['salesRowId']=this.salesRowId
                // dctInvoice['strRemarks']=this.strRemarks
                // dctInvoice['intCouponId']=this.intCouponId
                // dctInvoice['intCouponDisc']=this.intCouponDisc
                // dctInvoice['dctDeliveryData']=this.dctData['lstDeliveryData']
  
                // dctInvoice['intRedeemPoint']=this.intTotPointsCopy-this.intTotPoints
                // dctInvoice['intGrandTot']=this.intGrandTot
                // dctInvoice['intDiscount']=this.intDiscount
                // // dctInvoice['intTax']=this.intTax
                // dctInvoice['intTotSGST']=this.intTotSGST
                // dctInvoice['intTotCGST']=this.intTotCGST
                // dctInvoice['intTotIGST']=this.intTotIGST
                // dctInvoice['intBuyBack']=this.intBuyBack
                // dctInvoice['intCouponDisc']=this.intCouponDisc
                // dctInvoice['intReturnAmt']=this.intReturnAmt
                // dctInvoice['intIndirectDiscount']=this.intTotIndirectDis
                // dctInvoice['returnImages']=this.dctImages
  
                form_data.append('intSalesCustId', String(this.intSalesCustId))
                form_data.append('lstPaymentData',JSON.stringify(this.dctData['lstPaymentData']))
                form_data.append('dctTableData',JSON.stringify(this.lstItemDetails))
                form_data.append('salesRowId',this.salesRowId)
                form_data.append('strRemarks',this.strRemarks)
                if(this.intCouponId){
                  form_data.append('intCouponId',this.intCouponId)
                  form_data.append('intCouponDisc',this.intCouponDisc)
                }
                form_data.append('dctDeliveryData',JSON.stringify(this.dctData['lstDeliveryData']))
                form_data.append('intRedeemPoint',String(this.intTotPointsCopy-this.intTotPoints))
                form_data.append('intGrandTot',String(this.intGrandTot))
                form_data.append('intDiscount',String(this.intDiscount))
                form_data.append('intTotSGST',String(this.intTotSGST))
                form_data.append('intTotCGST',String(this.intTotCGST))
                form_data.append('intTotIGST',String(this.intTotIGST))
                form_data.append('intBuyBack',String(this.intBuyBack))
                form_data.append('intReturnAmt',String(this.intReturnAmt))
                form_data.append('intIndirectDiscount',String(this.intTotIndirectDis))
                form_data.append('dctReturnId',JSON.stringify(this.dctReturnId))
                form_data.append('bln_matching',JSON.stringify(this.blnMatching));
  
                // form_data.append('returnImages',String(this.dctImages))
  
                Object.keys(this.dctImages).forEach(element => {
  
                  form_data.append(element,this.dctImages[element])
                });
  
                // console.log(this.dctImages,"dctInvoice");
                let saveInvoiceUrl;
                
                
                  if(this.lstItemDetails[0]['intStatus'] == 4){
                    saveInvoiceUrl = 'invoice/add_invoice_jio/'
                  }
                  else{
                    saveInvoiceUrl = 'invoice/add_invoice/'
                  }
                  this.saveDisable=true;                 
                  this.serviceObject.postData(saveInvoiceUrl,form_data).subscribe(res => {
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
                      this.invoiceId=res['sales_master_id'];
                      console.log(this.blnService,"this.blnService");
                      
                      if(this.blnService){
                       localStorage.setItem('previousUrl','invoice/servicelist');
                        
                           this.router.navigate(['invoice/servicelist'])
                      }
                      else{
          localStorage.setItem('previousUrl','invoice/listinvoice');
                        
                        this.router.navigate(['invoice/listinvoice']);
                      }
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
              else{
                swal.fire('Error!','Please Provide Payment Details', 'error');
              }
            }
          }
          else{
            this.toastr.error('Imei of item is required', 'Error!');
          }
        }
  };

});

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

  // Customer Edit

  saveCustEdit()
  {
    let checkError=false
    if(this.strName=='' || this.strName==null || this.strName==undefined){
          
      this.toastr.error('Customer Name is required', 'Error!');
      checkError=true
      return false;
    
      }

      if(this.intContactNo == null || !this.intContactNo){
        this.toastr.error('Customer Contact Number is required', 'Error!');
        checkError=true
        return false;
      }

   if(this.selectedCity){
      if (this.selectedCity != this.strCity)
      {
       this.toastr.error('Valid City Name is required', 'Error!');
       checkError=true
       this.intCityId = null
       this.strCity = ''
       this.selectedCity=''
       return false;
     }
  }
  if(this.selectedState){
      if (this.selectedState != this.strState)
      {
        this.toastr.error('Valid State Name is required', 'Error!');
        checkError=true
        this.intStateId = null
        this.strState = ''
        this.selectedState=''
        return false;
      }
   }

   if (this.strEmail){
    let errorPlace;
    const eatpos = this.strEmail.indexOf('@');
    const edotpos = this.strEmail.lastIndexOf('.');
    if ( eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.strEmail.length) {
      // validationSuccess = false ;
      errorPlace = 'Email format is not correct ';
      checkError=true
      // this.strEmail=null;
      // this.emailId.first.nativeElement.focus();
      this.toastr.error(errorPlace,'Error!');
      return;
    }
   }

   if (this.strGSTNo && (this.strGSTNo).toString().length!=15) {
    this.toastr.error('Enter Valid GST No.', 'Error!');
   checkError=true;
    return false
  }
  if (this.strGSTNo && !(/^[0-9]{2}/).test(this.strGSTNo)) {
    this.toastr.error('First two digits of GST No. should be number', 'Error!');
   checkError=true;
    return false
  }

   if(!checkError){
    let dctCustomerData={}
    dctCustomerData['strName']=this.strName
    dctCustomerData['strEmail']=this.strEmail
    dctCustomerData['strAddress']=this.strAddress
    dctCustomerData['strCity']=this.strCity
    dctCustomerData['strState']=this.strState
    dctCustomerData['intCityId']=this.intCityId
    dctCustomerData['intStateId']=this.intStateId
    dctCustomerData['strGSTNo']=this.strGSTNo
    dctCustomerData['intCustId']=this.intCustId
    dctCustomerData['intMob'] = this.intContactNo;
    
    // partialInvoice Id
    dctCustomerData['intPartialId'] = this.salesRowId


    // dctCustomerData['strName']=this.strName
    // dctCustomerData['strEmail']=this.strEmail
    // dctCustomerData['strAddress']=this.strAddress
    // dctCustomerData['strCity']=this.strCity
    // dctCustomerData['strState']=this.strState
    // dctCustomerData['intCityId']=this.intCityId
    // dctCustomerData['intStateId']=this.intStateId
    // dctCustomerData['strGSTNo']=this.strGSTNo
    // dctCustomerData['intMob'] = this.intContactNo;
   
    // dctCustomerData['strPinCode'] = this.strPincode;
      

       this.serviceObject.postData('customer/edit_customer/',dctCustomerData).subscribe(res => {
         if (res.status == 1)
         {
           swal.fire({
             position: "center",
             type: "success",
             text: "Data saved successfully",
             showConfirmButton: true,
           });
           this.blnCheckIGST=res['data']['blnIGST']
           this.showModalCustEdit.close();

           this.dctData['custEditData']['strEmail']=res['data']['strCustEmail']
           this.dctData['custEditData']['strAddress']=res['data']['txtAddress']
           this.dctData['custEditData']['strState']=res['data']['strState']
           this.dctData['custEditData']['intStateId']=res['data']['intStateId']
           this.dctData['custEditData']['intCityId']=res['data']['intCityId']
           this.dctData['custEditData']['strCity']=res['data']['strLocation']
           this.dctData['custEditData']['strGSTNo']=res['data']['strGSTNo']
           this.dctData['custEditData']['intCustId'] = res['data']['intCustId']
           this.intSalesCustId = res['data']['intSalesCustId']
           this.billingDatails("other",0);

         }
         else if (res.status == 0) {
           swal.fire('Error!','Something went wrong!!', 'error');
         }
     },
     (error) => {
       swal.fire('Error!','Server Error!!', 'error');

     });
   }

  }

  cancelCustEdit(){
    this.showModalCustEdit.close();
    if(this.dctData['custEditData']){
    this.strEmail = this.dctData['custEditData']['strEmail']
    this.strAddress = this.dctData['custEditData']['strAddress']
    this.selectedState = this.dctData['custEditData']['strState']
    this.intStateId= this.dctData['custEditData']['intStateId']
    this.intCityId= this.dctData['custEditData']['intCityId']
    this.selectedCity = this.dctData['custEditData']['strCity']
    this.strGSTNo = this.dctData['custEditData']['strGSTNo']
     }
  }

  applyCouponCode()
  {
   let dctDetails={}
   dctDetails['strCode']=this.strCouponCode
   dctDetails['intId']=this.salesRowId
   dctDetails['lstItemDetails']=this.lstItemDetails
  //  dctDetails['intTax']=this.intTax
   dctDetails['intTotSGST']=this.intTotSGST
   dctDetails['intTotCGST']=this.intTotCGST
   dctDetails['intTotIGST']=this.intTotIGST
   dctDetails['intTotal']=this.intTotal
   dctDetails['intDiscount']=this.intDiscount
   dctDetails['intBuyBack']=this.intBuyBack

    if(this.strCouponCode){
      this.serviceObject.postData('invoice/apply_coupon/',dctDetails).subscribe(res => {
        if (res.status == 1)
        {
          swal.fire({
            position: "center",
            type: "success",
            text: "Coupon Applied successfully",
            showConfirmButton: true,
          });

          this.intCouponDisc=res['data']['dblDisc']
          this.intCouponId=res['data']['intCouponId']
          this.billingDatails("other",0)
          this.showModalCoupon.close();
          this.blnApplied=true
        }
        else if (res.status == 0) {
          swal.fire('Error!',res['message'], 'error');
        }
    },
    (error) => {
      swal.fire('Error!','Server Error!!', 'error');

    });

    }

  }

  cancelCouponCode(){
    this.blnApplied=false
    this.strCouponCode=''
    this.intCouponDisc=0
    this.intCouponId=null
    this.billingDatails("other",0)
  }

  selectSameCust()
  {
      if(this.blnCustomer){
        this.strCustName=this.strName
        this.intCustContactNo=this.intContactNo
        this.strCustCity=this.selectedCity
        this.selectedCustCity=this.selectedCity
        this.intCustCityId=this.intCityId
        this.intCustStateId=this.intStateId
        this.strCustState=this.selectedState
        this.selectedCustState=this.selectedState
        this.strCustGST=this.strGSTNo
        this.strCustAddress=this.strAddress
        this.strCustPinCode=this.strPincode
      }
      else{
        this.strCustName=''
        this.intCustContactNo=''
        this.strCustCity=''
        this.strCustState=''
        this.strCustGST=''
        this.strCustAddress=''
        this.strCustPinCode=''
        this.strCustPlace=''
        this.selectedCustCity=''
        this.selectedCustState=''
        this.intCustCityId=null
        this.intCustStateId=null
      }
  }

  saveDelivery(){

    if (!this.strCustName)
     {
      // this.nameId.first.nativeElement.focus();
      this.toastr.error('Name is required', 'Error!');
      return false;
    }
    else if (!this.intCustContactNo)
    {
    //  this.contactId.first.nativeElement.focus();
     this.toastr.error('Contact No is required', 'Error!');
     return false;
    }
    else if (this.selectedCustCity != this.strCustCity|| !this.selectedCustCity)
     {
      this.toastr.error('Valid City Name is required', 'Error!');
      this.intCustCityId = null
      this.strCustCity = ''
      this.selectedCustCity=''
      return false;
    }
    else if (this.selectedCustState != this.strCustState|| !this.selectedCustState)
     {
      this.toastr.error('Valid State Name is required', 'Error!');
      this.intCustStateId = null
      this.strCustState = ''
      this.selectedCustState=''
      return false;
    }
    // else if (!this.strCustGST)
    // {
    // //  this.gstnoId.first.nativeElement.focus();
    //  this.toastr.error('GST No is required', 'Error!');
    //  return false;
    // }
    else if (!this.strCustAddress)
    {
    //  this.addressId.first.nativeElement.focus();
     this.toastr.error('Address is required', 'Error!');
     return false;
    }
    else if (!this.strCustPinCode)
    {
    //  this.pincodeId.first.nativeElement.focus();
     this.toastr.error('Pincode is required', 'Error!');
     return false;
    }
    // else if (!this.strCustPlace)
    // {
    // //  this.placeId.first.nativeElement.focus();
    //  this.toastr.error('Near by place is required', 'Error!');
    //  return false;
    // }
    else
    {
      this.dctData['lstDeliveryData']['strCustName']= this.strCustName
      this.dctData['lstDeliveryData']['intCustContactNo']= this.intCustContactNo
      this.dctData['lstDeliveryData']['strCustCity']=this.selectedCustCity
      this.dctData['lstDeliveryData']['intCustCityId']= this.intCustCityId
      this.dctData['lstDeliveryData']['strCustState']= this.selectedCustState
      this.dctData['lstDeliveryData']['intCustStateId']= this.intCustStateId
      this.dctData['lstDeliveryData']['strCustGST']= this.strCustGST
      this.dctData['lstDeliveryData']['strCustAddress']= this.strCustAddress
      this.dctData['lstDeliveryData']['strCustPinCode']= this.strCustPinCode
      this.dctData['lstDeliveryData']['strCustPlace']=this.strCustPlace
      this.dctData['lstDeliveryData']['blnCustomer']= this.blnCustomer

      this.strCustName=this.dctData['lstDeliveryData']['strCustName']
      this.intCustContactNo=this.dctData['lstDeliveryData']['intCustContactNo']
      this.selectedCustCity=this.dctData['lstDeliveryData']['strCustCity']
      this.intCustCityId=this.dctData['lstDeliveryData']['intCustCityId']
      this.selectedCustState=this.dctData['lstDeliveryData']['strCustState']
      this.intCustStateId=this.dctData['lstDeliveryData']['intCustStateId']
      this.strCustGST=this.dctData['lstDeliveryData']['strCustGST']
      this.strCustAddress=this.dctData['lstDeliveryData']['strCustAddress']
      this.strCustPinCode=this.dctData['lstDeliveryData']['strCustPinCode']
      this.strCustPlace= this.dctData['lstDeliveryData']['strCustPlace']
      this.blnCustomer= this.dctData['lstDeliveryData']['blnCustomer']
      this.showModalSerDelivery.close();

    }

  }
  cancelDelivery(){
    this.strCustName=''
    this.intCustContactNo=''
    this.strCustCity=''
    this.selectedCustCity=''
    this.selectedCustState=''
    this.intCustCityId=null
    this.intCustStateId=null
    this.strCustState=''
    this.strCustGST=''
    this.strCustAddress=''
    this.strCustPinCode=''
    this.strCustPlace=''
    this.blnCustomer=false
    this.showModalSerDelivery.close();
  }

  searchFilter(){
    this.dctData['lstFilterData']={}

   if(this.strBrand){
      if (this.selectedBrand != this.strBrand|| !this.selectedBrand)
        {
        this.intBrandId = null
        this.strBrand = ''
        this.selectedBrand=''
        this.toastr.error('Valid Brand Name is required', 'Error!');
        return false;
        }
   }
  if(this.strItem){
    if (this.selectedItem != this.strItem|| !this.selectedItem)
      {
      this.toastr.error('Valid Item Name is required', 'Error!');
      this.intItemId = null
      this.strItem = ''
      this.selectedItem=''
      return false;
      }
   }
  if(this.strItemCategory){
    if (this.selectedItemCategory != this.strItemCategory|| !this.selectedItemCategory)
      {
      this.toastr.error('Valid Item Category Name is required', 'Error!');
      this.intItemCategoryId = null
      this.strItemCategory = ''
      this.selectedItemCategory=''
      return false;
      }
   }
  if(this.strItemGroup){
    if (this.selectedItemGroup != this.strItemGroup|| !this.selectedItemGroup)
      {
      this.toastr.error('Valid Item Group Name is required', 'Error!');
      this.intItemGroupId = null
      this.strItemGroup = ''
      this.selectedItemGroup=''
      return false;
      }
   }

   if (this.selectedProduct  != this.strProduct|| !this.selectedProduct)
   {

    // this.nameId.first.nativeElement.focus();
    this.toastr.error('Product is required', 'Error!');
    this.intProductId=null
    this.strProduct=''
    this.selectedProduct=''
    return false;
   }
   else{

    this.dctData['lstFilterData']['intProductId']=this.intProductId

    if(this.strBrand)
    {
      this.dctData['lstFilterData']['intBrandId']=this.intBrandId
    }
    if(this.strItem)
    {
      this.dctData['lstFilterData']['intItemId']=this.intItemId
    }
    if(this.strItemCategory)
    {
      this.dctData['lstFilterData']['intItemCategoryId']=this.intItemCategoryId
    }
    if(this.strItemGroup)
    {
      this.dctData['lstFilterData']['intItemGroupId']=this.intItemGroupId
    }


    this.dctData['lstFilterData']['blnAvailStock']=this.blnAvailStock
    this.serviceObject.postData('invoice/item_filter/',this.dctData['lstFilterData']).subscribe(res => {
      if (res.status == 1)
      {
       this.lstFilterData= res['data']


       if(this.lstFilterData.length>0){
         this.blnShowData=0;
       }
       else{
        this.blnShowData=1;
       }

       this.index = 0
       this.lstFilterData.map(item=>{
        this.index = this.index+1
        if ((Object.keys(this.dct_item)).includes(String(item['intItemId'])))
        {
         this.lstFilterData[this.index-1]['intQuantity'] = Number(this.lstFilterData[this.index-1]['intQuantity']) - Number(this.dct_item[item['intItemId']])
        }
      })

      }
      else if (res.status == 0) {
        swal.fire('Error!',res['message'], 'error');
        this.lstFilterData=[]
      }
  },
  (error) => {
    swal.fire('Error!','Server Error!!', 'error');
    this.lstFilterData=[]

  });
   }
 }

 clickRow(i){

   if(this.lstFilterData[i]['intQuantity']>0){
    this.clickRowId=i
    // if ((Object.keys(this.dct_item)).includes(String(this.lstFilterData[i]['intItemId'])))
    //   {
    //     this.dct_item[this.lstFilterData[i]['intItemId']] =  this.dct_item[this.lstFilterData[i]['intItemId']] + 1
    //   }
    // else{
    //   this.dct_item[this.lstFilterData[i]['intItemId']] = 1
    // }


    this.newItem.strItemName=this.lstFilterData[i]['strItemName']
    this.newItem.dblRate=this.lstFilterData[i]['dblPrice']
    this.newItem.intItemId=this.lstFilterData[i]['intItemId']
    this.newItem.strItemCode=this.lstFilterData[i]['strItemCode']
    this.blnFilterItem=true
    this.blnShowData=2;

    this.intBrandId = null
    this.strBrand = ''
    this.selectedBrand=''
    this.intItemId = null
    this.strItem = ''
    this.selectedItem=''
    this.intItemCategoryId = null
    this.strItemCategory = ''
    this.selectedItemCategory=''
    this.intItemGroupId = null
    this.strItemGroup = ''
    this.selectedItemGroup=''
    this.intProductId = null
    this.strProduct = ''
    this.selectedProduct=''

    this.showModalFilter.close()
   }
  else{
    swal.fire('Error!','Out of Stock', 'error');

  }
 }
 changePoints(event)
 {
    if(this.intRedeemPoint>this.intTotPoints){
      this.intRedeemPoint=0
      this.toastr.error('Invalid Points', 'Error!');
    }
    this.intRedeemAmt=this.intRedeemPoint*this.intAmtPerPoints

 }
 sendOTP(){
  this.serviceObject.postData('loyaltycard/otp_varification/',{intCustId:this.intCustId}).subscribe(res => {
    if (res.status == 1)
    {


    }
    else if (res.status == 0) {
      swal.fire('Error!',res['message'], 'error');
      }
    },
    (error) => {
      swal.fire('Error!','Server Error!!', 'error');

    });
 }
 redeemPoints(){
    if(!this.intRedeemPoint){
      this.toastr.error('Enter Redeem Points', 'Error!');
      return false;
    }

    if(!this.intOTP){
      this.toastr.error('Enter OTP', 'Error!');
      return false;
    }
    else
    {
      let dctPushData={}
      dctPushData= {intOTP:this.intOTP,intCustId:this.intCustId,intRedeemPoint:this.intRedeemPoint}

      this.serviceObject.putData('loyaltycard/otp_varification/',dctPushData).subscribe(res => {
        if (res.status == 1)
        {
         this.intTotPoints=  this.intTotPoints-this.intRedeemPoint
         this.intTotRedeemAmt=(this.intTotPointsCopy-this.intTotPoints)*this.intAmtPerPoints
         this.intGrandTot=  this.intGrandTot-this.intTotRedeemAmt

         this.intRedeemPoint=0
         this.intRedeemAmt=0
         this.intOTP=0
         this.showModalPoints.close()
        }
        else if (res.status == 0) {
          swal.fire('Error!',res['message'], 'error');
          }
        },
        (error) => {
          swal.fire('Error!','Server Error!!', 'error');

        });
    }
  }

  // //payment

  // calculateBalance()
  // {
  //     // negative value converted into positive in cash
  //     if(this.blnCash){
  //       if(this.intReceivedAmt<0){
  //         this.intReceivedAmt = (this.intReceivedAmt)*-1
  //       }
  //     }
  //     if(this.blnFinance){
  //       this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
  //     }
  //     else if(this.blnReceipt){
  //       this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount);
  //     }
  //     else if(this.blnFinance && this.blnReceipt){
  //       this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
  //     }
  //     else{
  //       this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
  //     }
  
    
  //   if(this.intBalanceAmt<0){
     
      
  //     this.toastr.error('Amount Exceeded', 'Error!');
  //   }
  // }

  // cashChanged(event)
  // {
  //   if(!this.blnCash){
  //     this.intReceivedAmt=0
  //     this.blnCreditStatus = false;
  //     this.blnDebitStatus = false;
  //     this.blnPaytmStatus = false;
  //     this.blnPaytmMallStatus = false;
  //   }
  //   else
  //   {  
  //     this.blnCreditStatus = true;
  //     this.blnDebitStatus = true;
  //     this.blnPaytmStatus = true;
  //     this.blnPaytmMallStatus = true;
  //      if(this.blnCreditCard)
  //      {
  //         if(!this.strCreditCardNo){
  //           swal.fire('Error!','Enter Credit Card No ', 'error');
  //           this.blnCash=false
  //           event.source._checked = false
  //         }
  //         else if(!this.intCreditBankId){
  //           swal.fire('Error!','Enter Bank Name Of Credit Card ', 'error');
  //           this.blnCash=false
  //           event.source._checked = false
  //         }
  //         else if(!this.intCreditAmt){
  //           swal.fire('Error!','Enter Credit Amount ', 'error');
  //           this.blnCash=false
  //           event.source._checked = false
  //         }
  //         else if(!this.strEmiCredit){
  //           swal.fire('Error!','Select EMI option ', 'error');
  //           this.blnCash=false
  //           event.source._checked = false
  //         }
  //         else if(!this.strCreditRefNo){
  //           swal.fire('Error!','Enter Reference No Of Credit Card', 'error');
  //           this.blnCash=false
  //           event.source._checked = false
  //         }
  //     }
  //     if(this.blnDebitCard)
  //     {
  //         if(!this.strDebitCardNo){
  //           swal.fire('Error!','Enter Debit Card No ', 'error');
  //           this.blnCash=false
  //            event.source._checked = false

  //         }
  //         else if(!this.intDebitBankId){
  //           swal.fire('Error!','Enter Bank Name Of Debit Card ', 'error');
  //           this.blnCash=false
  //           event.source._checked = false
  //           return false
  //         }
  //         else if(!this.intDebitAmt){
  //           swal.fire('Error!','Enter Debit Amount ', 'error');
  //           this.blnCash=false
  //           event.source._checked = false
  //         }
  //         else if(!this.strEmi){
  //           swal.fire('Error!','Select Emi Option', 'error');
  //           this.blnCash=false
  //           event.source._checked = false
  //         }
  //         else if(!this.strDebitRefNo){
  //           swal.fire('Error!','Enter Reference No Of Debit Card', 'error');
  //           this.blnCash=false
  //           event.source._checked = false
  //         }
  //     }
  //     if(this.blnPaytm)
  //     {
  //          if(!this.intPaytmMobileNumber){
  //           swal.fire('Error!','Enter Mobile Number', 'error');
  //           this.blnCash=false
  //            event.source._checked = false
  //          }
  //          else if(!this.intPaytmAmount){
  //           swal.fire('Error!','Enter Amount', 'error');
  //           this.blnCash=false
  //            event.source._checked = false
  //          }
  //          else if(!this.strPaytmTransactionNum){
  //           swal.fire('Error!','Enter Paytm Transaction Number ', 'error');
  //           this.blnCash=false
  //            event.source._checked = false
  //          }
  //          else if(!this.strPaytmReferenceNum){
  //           swal.fire('Error!','Enter Paytm Reference Number ', 'error');
  //           this.blnCreditCard=false
  //            event.source._checked = false
  //          }
  //     }

  //   }

  //   this.calculateBalance()
  // }

  // creditCardChanged(event)
  // {
  //   if(!this.blnCreditCard){
  //     this.intCreditAmt=0
  //     this.strCreditBankName=''
  //     this.intCreditBankId=null;
  //     this.strCreditCardNo=''
  //     this.strCreditRefNo=''
  //     this.blnCashStatus = false;
  //     this.blnDebitStatus = false;
  //     this.blnPaytmStatus = false;
  //     this.blnPaytmMallStatus = false;
  //     this.strEmiCredit = '';
  //   }
  //   else{
  //     this.blnCashStatus = true;
  //     this.blnDebitStatus = true;
  //     this.blnPaytmStatus = true;
  //     this.blnPaytmMallStatus = true;
  //       if(this.blnDebitCard){
  //         if(!this.strDebitCardNo){
  //           swal.fire('Error!','Enter Debit Card No ', 'error');
  //           this.blnCreditCard=false
  //           event.source._checked = false

  //         }
  //         else if(!this.intDebitBankId){
  //           swal.fire('Error!','Enter Bank Name Of Debit Card ', 'error');
  //           this.blnCreditCard=false
  //           event.source._checked = false

  //           return false
  //         }
  //         else if(!this.intDebitAmt){
  //           swal.fire('Error!','Enter Debit Amount ', 'error');
  //           this.blnCreditCard=false
  //           event.source._checked = false
  //         }
  //         else if(!this.strEmi){
  //           swal.fire('Error!','Select Emi Option ', 'error');
  //           this.blnCreditCard=false
  //           event.source._checked = false
  //         }
  //         else if(!this.strDebitRefNo){
  //           swal.fire('Error!','Enter Reference No Of Debit Card', 'error');
  //           this.blnCreditCard=false
  //           event.source._checked = false
  //         }
  //       }
  //       if(this.blnCash){
  //         if(!this.intReceivedAmt){
  //           swal.fire('Error!','Enter Received Amt ', 'error');
  //           this.blnCreditCard=false
  //           event.source._checked = false

  //         }
  //       }
  //       if(this.blnPaytm)
  //       {
  //            if(!this.intPaytmMobileNumber){
  //             swal.fire('Error!','Enter Mobile Number', 'error');
  //             this.blnCreditCard=false
  //              event.source._checked = false
  //            }
  //            else if(!this.intPaytmAmount){
  //             swal.fire('Error!','Enter Amount ', 'error');
  //             this.blnCreditCard=false
  //              event.source._checked = false
  //            }
  //            else if(!this.strPaytmTransactionNum){
  //             swal.fire('Error!','Enter Paytm Transaction Number ', 'error');
  //             this.blnCreditCard=false
  //              event.source._checked = false
  //            }
  //            else if(!this.strPaytmReferenceNum){
  //             swal.fire('Error!','Enter Paytm Reference Number ', 'error');
  //             this.blnCreditCard=false
  //              event.source._checked = false
  //            }
  //       }
  //   }

  //   this.calculateBalance()
  // }

  // debitCardChanged(event)
  // {
  //   if(!this.blnDebitCard){
  //     this.intDebitAmt=0
  //     this.strDebitBankName=''
  //     this.intDebitBankId=null;
  //     this.strDebitCardNo=''
  //     this.strDebitRefNo='';
  //     this.intCreditBankId=null;
  //     this.blnCashStatus = false;
  //     this.blnCreditStatus = false;
  //     this.blnPaytmStatus = false;
  //     this.blnPaytmMallStatus = false;
  //     this.strEmi = '';
  //   }
  //   else{
  //     this.blnCashStatus = true;
  //     this.blnCreditStatus = true;
  //     this.blnPaytmStatus = true;
  //     this.blnPaytmMallStatus = true;
  //       if(this.blnCreditCard){
  //         if(!this.strCreditCardNo){
  //           swal.fire('Error!','Enter Credit Card No ', 'error');
  //           this.blnDebitCard=false
  //           event.source._checked = false

  //         }
  //         else if(!this.intCreditBankId){
  //           swal.fire('Error!','Enter Bank Name Of Credit Card ', 'error');
  //           this.blnDebitCard=false
  //           event.source._checked = false
  //         }
  //         else if(!this.intCreditAmt){
  //           swal.fire('Error!','Enter Credit Amount ', 'error');
  //           this.blnDebitCard=false
  //           event.source._checked = false
  //         }
  //         else if(!this.strEmiCredit){
  //           swal.fire('Error!','Select EMI option', 'error');
  //           this.blnDebitCard=false
  //           event.source._checked = false
  //         }
  //         else if(!this.strCreditRefNo){
  //           swal.fire('Error!','Enter Reference No Of Credit Card', 'error');
  //           this.blnDebitCard=false
  //           event.source._checked = false
  //         }
  //       }
  //       if(this.blnCash){
  //         if(!this.intReceivedAmt){
  //           swal.fire('Error!','Enter Received Amt ', 'error');
  //           this.blnDebitCard=false
  //           event.source._checked = false

  //         }
  //       }
  //       if(this.blnPaytm)
  //       {
  //            if(!this.intPaytmMobileNumber){
  //             swal.fire('Error!','Enter Mobile Number', 'error');
  //             this.blnDebitCard=false
  //              event.source._checked = false
  //            }
  //            else if(!this.intPaytmAmount){
  //             swal.fire('Error!','Enter Amount', 'error');
  //             this.blnDebitCard=false
  //              event.source._checked = false
  //            }
  //            else if(!this.strPaytmTransactionNum){
  //             swal.fire('Error!','Enter Paytm Transaction Number ', 'error');
  //             this.blnDebitCard=false
  //              event.source._checked = false
  //            }
  //            else if(!this.strPaytmReferenceNum){
  //             swal.fire('Error!','Enter Paytm Reference Number ', 'error');
  //             this.blnDebitCard=false
  //              event.source._checked = false
  //            }
  //       }
       
  //   }

  //   this.calculateBalance()

  // }
  // receiptChanged(event){
  //   // console.log('receiptn',event);

  //   if(!this.blnReceipt){
  //     // this.intDebitAmt=0
  //     this.strReceiptNumber=''
  //     swal.fire({
  //       title: 'Alert!',
  //       text: "Advance amount available!",
  //       type: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'OK!'
  //     }).then((result) => {
  //       if (!result.value) {
  //         this.blnReceipt = true;
  //         if(this.blnFinance){
  //           this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
  //         }
  //         else if(this.blnReceipt){
  //           this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount);
  //         }
  //         else if(this.blnFinance && this.blnReceipt){
  //           this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
  //         }
  //         else{
  //           this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
  //         }
  //       }
  //       else{
  //         if(this.blnFinance){
  //           this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
  //         }
  //         else if(this.blnReceipt){
  //           this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount);
  //         }
  //         else if(this.blnFinance && this.blnReceipt){
  //           this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
  //         }
  //         else{
  //           this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
  //         }
  //       }
  //     })

  //   }
  //   else{
  //     if(this.blnFinance){
  //       this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
  //     }
  //     else if(this.blnReceipt){
  //       this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount);
  //     }
  //     else if(this.blnFinance && this.blnReceipt){
  //       this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
  //     }
  //     else{
  //       this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
  //     }
  //       // if(this.blnCreditCard){
  //       //   if(!this.strCreditCardNo){
  //       //     swal.fire('Error!','Enter Credit Card No ', 'error');
  //       //     this.blnReceipt=false
  //       //     event.source._checked = false

  //       //   }
  //       //   else if(!this.strCreditBankName){
  //       //     swal.fire('Error!','Enter Bank Name Of Credit Card ', 'error');
  //       //     this.blnReceipt=false
  //       //     event.source._checked = false
  //       //   }
  //       //   else if(!this.intCreditAmt){
  //       //     swal.fire('Error!','Enter Credit Amount ', 'error');
  //       //     this.blnReceipt=false
  //       //     event.source._checked = false
  //       //   }
  //       //   else if(!this.strCreditRefNo){
  //       //     swal.fire('Error!','Enter Reference No Of Credit Card', 'error');
  //       //     this.blnReceipt=false
  //       //     event.source._checked = false
  //       //   }
  //       // }
  //       // if(this.blnCash){
  //       //   // if(!this.intReceivedAmt){
  //       //   //   swal.fire('Error!','Enter Received Amt ', 'error');
  //       //   //   this.blnReceipt=false
  //       //   //   event.source._checked = false

  //       //   // }
  //       //      swal.fire('Error!','Enter Received Amt ', 'error');
  //       //      this.blnReceipt=false;
  //       //     event.source._checked = false;
  //       // }
  //       // if(this.blnDebitCard){
  //       //   if(!this.strDebitCardNo){
  //       //     swal.fire('Error!','Enter Debit Card No ', 'error');
  //       //     this.blnReceipt=false
  //       //     event.source._checked = false

  //       //   }
  //       //   else if(!this.strDebitBankName){
  //       //     swal.fire('Error!','Enter Bank Name Of Debit Card ', 'error');
  //       //     this.blnReceipt=false
  //       //     event.source._checked = false


  //       //   }
  //       //   else if(!this.intDebitAmt){
  //       //     swal.fire('Error!','Enter Debit Amount ', 'error');
  //       //     this.blnReceipt=false
  //       //     event.source._checked = false
  //       //   }
  //       //   else if(!this.strDebitRefNo){
  //       //     swal.fire('Error!','Enter Reference No Of Debit Card', 'error');
  //       //     this.blnReceipt=false
  //       //     event.source._checked = false
  //       //   }
  //       // }

  //   }



  // }
  // paytmChanged(event)
  // {
  //   if(!this.blnPaytm){
  //     this.intPaytmMobileNumber=null;
  //     this.intPaytmAmount=0;
  //     this.strPaytmTransactionNum = '';
  //     this.strPaytmReferenceNum = '';
  //     this.blnCashStatus = false;
  //     this.blnCreditStatus = false;
  //     this.blnDebitStatus = false;
  //     this.blnPaytmMallStatus = false;
  
  //   }
  //   else{
  //     this.blnCashStatus = true;
  //     this.blnCreditStatus = true;
  //     this.blnDebitStatus = true;
  //     this.blnPaytmMallStatus = true;
  //       if(this.blnCreditCard){
  //         if(!this.strCreditCardNo){
  //           swal.fire('Error!','Enter Credit Card No ', 'error');
  //           this.blnPaytm=false
  //           event.source._checked = false

  //         }
  //         else if(!this.intCreditBankId){
  //           swal.fire('Error!','Enter Bank Name Of Credit Card ', 'error');
  //           this.blnPaytm=false
  //           event.source._checked = false
  //         }
  //         else if(!this.intCreditAmt){
  //           swal.fire('Error!','Enter Credit Amount ', 'error');
  //           this.blnPaytm=false
  //           event.source._checked = false
  //         }
  //         else if(!this.strCreditRefNo){
  //           swal.fire('Error!','Enter Reference No Of Credit Card', 'error');
  //           this.blnPaytm=false
  //           event.source._checked = false
  //         }
  //       }
  //       if(this.blnCash){
  //         if(!this.intReceivedAmt){
  //           swal.fire('Error!','Enter Received Amt ', 'error');
  //           this.blnPaytm=false
  //           event.source._checked = false

  //         }
  //       }
  //       if(this.blnDebitCard)
  //       {
  //           if(!this.strDebitCardNo){
  //             swal.fire('Error!','Enter Debit Card No ', 'error');
  //             this.blnPaytm=false
  //              event.source._checked = false
  
  //           }
  //           else if(!this.intDebitBankId){
  //             swal.fire('Error!','Enter Bank Name Of Debit Card ', 'error');
  //             this.blnPaytm=false
  //             event.source._checked = false
  //             return false
  //           }
  //           else if(!this.intDebitAmt){
  //             swal.fire('Error!','Enter Debit Amount ', 'error');
  //             this.blnPaytm=false
  //             event.source._checked = false
  //           }
  //           else if(!this.strDebitRefNo){
  //             swal.fire('Error!','Enter Reference No Of Debit Card', 'error');
  //             this.blnPaytm=false
  //             event.source._checked = false
  //           }
  //       }
       
  //   }

  //   this.calculateBalance()

  // }
  // paytmMallChanged(event)
  // {
  //   if(!this.blnPaytmMall){
  //     this.intPaytmMallMobileNumber=null;
  //     this.intPaytmMallAmount=0;
  //     this.strPaytmMallTransactionNum = '';
  //     this.strPaytmMallReferenceNum = '';
  //     this.blnCashStatus = false;
  //     this.blnCreditStatus = false;
  //     this.blnDebitStatus = false;
  //     this.blnPaytmStatus= false;

  //   }
  //   else{
  //     this.blnCashStatus = true;
  //     this.blnCreditStatus = true;
  //     this.blnDebitStatus = true;
  //     this.blnPaytmStatus= true;
  //       if(this.blnCreditCard){
  //         if(!this.strCreditCardNo){
  //           swal.fire('Error!','Enter Credit Card No ', 'error');
  //           this.blnPaytmMall=false
  //           event.source._checked = false

  //         }
  //         else if(!this.strCreditBankName){
  //           swal.fire('Error!','Enter Bank Name Of Credit Card ', 'error');
  //           this.blnPaytmMall=false
  //           event.source._checked = false
  //         }
  //         else if(!this.intCreditAmt){
  //           swal.fire('Error!','Enter Credit Amount ', 'error');
  //           this.blnPaytmMall=false
  //           event.source._checked = false
  //         }
  //         else if(!this.strCreditRefNo){
  //           swal.fire('Error!','Enter Reference No Of Credit Card', 'error');
  //           this.blnPaytmMall=false
  //           event.source._checked = false
  //         }
  //       }
  //       if(this.blnCash){
  //         if(!this.intReceivedAmt){
  //           swal.fire('Error!','Enter Received Amt ', 'error');
  //           this.blnPaytmMall=false
  //           event.source._checked = false

  //         }
  //       }
  //       if(this.blnDebitCard)
  //       {
  //           if(!this.strDebitCardNo){
  //             swal.fire('Error!','Enter Debit Card No ', 'error');
  //             this.blnPaytmMall=false
  //              event.source._checked = false

  //           }
  //           else if(!this.strDebitBankName){
  //             swal.fire('Error!','Enter Bank Name Of Debit Card ', 'error');
  //             this.blnPaytmMall=false
  //             event.source._checked = false
  //             return false
  //           }
  //           else if(!this.intDebitAmt){
  //             swal.fire('Error!','Enter Debit Amount ', 'error');
  //             this.blnPaytmMall=false
  //             event.source._checked = false
  //           }
  //           else if(!this.strDebitRefNo){
  //             swal.fire('Error!','Enter Reference No Of Debit Card', 'error');
  //             this.blnPaytmMall=false
  //             event.source._checked = false
  //           }
  //       }
  //       if(this.blnPaytm)
  //       {
  //            if(!this.intPaytmMobileNumber){
  //             swal.fire('Error!','Enter Mobile Number', 'error');
  //             this.blnPaytmMall=false
  //              event.source._checked = false
  //            }
  //            else if(!this.intPaytmAmount){
  //             swal.fire('Error!','Enter Amount', 'error');
  //             this.blnPaytmMall=false
  //              event.source._checked = false
  //            }
  //            else if(!this.strPaytmTransactionNum){
  //             swal.fire('Error!','Enter Paytm Transaction Number ', 'error');
  //             this.blnPaytmMall=false
  //              event.source._checked = false
  //            }
  //            else if(!this.strPaytmReferenceNum){
  //             swal.fire('Error!','Enter Paytm Reference Number ', 'error');
  //             this.blnPaytmMall=false
  //              event.source._checked = false
  //            }
  //       }

  //   }

  //   this.calculateBalance()

  // }

  // savePaymentOption(event)
  // {    

      
  //   if(!this.strFinanceName && !this.blnServiceCheck){
  //     this.intReceivedAmt = this.intGrandTot
  //   }
  //   console.log("1");

  //   let checkError=false

  //   if(this.blnCash){
  //     if(!this.intReceivedAmt){
  //       swal.fire('Error!','Enter Received Amt ', 'error');
  //       checkError=true

  //     }
  //   }
  //   if(this.blnCreditCard)
  //      {
  //         if(!this.strCreditCardNo){
  //           swal.fire('Error!','Enter Credit Card No ', 'error');
  //           checkError=true
  //         }
  //         else if(this.strCreditCardNo.length<4){
  //           swal.fire('Error!','Enter Mininum 4 Digits ', 'error');
  //           checkError=true
  //         }
  //         else if(!this.intCreditBankId){
  //           swal.fire('Error!','Enter Bank Name Of Credit Card ', 'error');
  //           checkError=true
  //         }
  //         else if(!this.intCreditAmt){
  //           swal.fire('Error!','Enter Credit Amount ', 'error');
  //           checkError=true
  //         }
  //         else if(!this.strEmiCredit){
  //           swal.fire('Error!','Select EMI option ', 'error');
  //           checkError=true
  //         }
  //         else if(this.strEmiCredit != this.strSelectedCreditEmi ){
  //           swal.fire('Error!','Select Valid EMI option ', 'error');
  //           checkError=true
  //         }
  //         else if(!this.strCreditRefNo){
  //           swal.fire('Error!','Enter Reference No Of Credit Card', 'error');
  //           checkError=true
  //         }
  //     }
  //     if(this.blnDebitCard)
  //     {
  //         if(!this.strDebitCardNo){
  //           swal.fire('Error!','Enter Debit Card No ', 'error');
  //           checkError=true

  //         }
  //         else if(this.strDebitCardNo.length<4){
  //           swal.fire('Error!','Enter Mininum 4 Digits ', 'error');
  //           checkError=true
  //         }
  //         else if(!this.intDebitBankId){
  //           swal.fire('Error!','Enter Bank Name Of Debit Card ', 'error');
  //           checkError=true
  //           return false
  //         }
  //         else if(!this.intDebitAmt){
  //           swal.fire('Error!','Enter Debit Amount ', 'error');
  //           checkError=true
  //         }calculateBalance
  //         else if(!this.strEmi){
  //           swal.fire('Error!','Select Emi Option ', 'error');
  //           checkError=true
  //         }
  //         else if(this.strEmi != this.strSelectedEmi){
  //           swal.fire('Error!','Select Valid Emi Option ', 'error');
  //           checkError=true
  //         }
  //         else if(!this.strDebitRefNo){
  //           swal.fire('Error!','Enter Reference No Of Debit Card', 'error');
  //           checkError=true
  //         }
  //     }
  //     if(this.blnPaytm)
  //     {
  //         if(!this.intPaytmMobileNumber){
  //           swal.fire('Error!','Mobile number is required ', 'error');
  //           checkError=true

  //         }
  //         else if(this.intPaytmMobileNumber.toString().length < 10 || this.intPaytmMobileNumber.toString().length >15 ){
  //          swal.fire('Error!','Invalid Mobile number','error');
  //          checkError = true;

  //         }
  //         else if(!this.intPaytmAmount){
  //           swal.fire('Error!','Paytm amount required ', 'error');
  //           checkError=true
  //         }
  //         else if(!this.strPaytmTransactionNum){
  //           swal.fire('Error!','Paytm Transaction Number required', 'error');
  //           checkError=true
          
  //         }
  //         else if(!this.strPaytmReferenceNum){
  //           swal.fire('Error!','Paytm Reference Number required', 'error');
  //           checkError=true
          
  //         }
          
          
  //     }
  //     if(!checkError){


  //       if(!this.strFinanceName  && !this.blnServiceCheck){
  //         this.intBalanceAmt = 0
  //       }

  //       console.log("2");
        

  //       if(this.intBalanceAmt<=0){

  //         this.dctData['lstPaymentData']={}
  //         this.dctData['lstPaymentData'][4]={}
  //         if(this.blnReceipt){

            
  //           if(this.intGrandTot<this.intReceiptTot){
  //             this.dctData['lstPaymentData'][4]['dblAmt'] = this.intGrandTot;
  //           }
  //           else{
  //             this.dctData['lstPaymentData'][4]['dblAmt'] = this.intReceiptTot;
  //           }
            
  //           let lstreceiptNumbers = []
  //           this.lstReceipt.forEach(element => {
             
              
  //             lstreceiptNumbers.push(element.vchr_receipt_num)
              
           
  //           });
  //           lstreceiptNumbers[0] = lstreceiptNumbers.toString();
            
            
  //           this.dctData['lstPaymentData'][4]['strRefNo'] =lstreceiptNumbers[0];
  //         }
  //         console.log("3");

         
  //         this.dctData['lstPaymentData'][1]={}
  //         this.dctData['lstPaymentData'][3]={}
  //         this.dctData['lstPaymentData'][2]={}
  //         this.dctData['lstPaymentData'][0]={}
  //         this.dctData['lstPaymentData'][5]={}
  //         this.dctData['lstPaymentData'][6]={}

  //         this.dctData['lstPaymentData'][1]['dblAmt']=this.intReceivedAmt
  //         this.dctData['lstPaymentData'][3]['dblAmt']=this.intCreditAmt
  //         this.dctData['lstPaymentData'][3]['strName']=this.strCreditBankName
  //         this.dctData['lstPaymentData'][3]['intBankId']=this.intCreditBankId
  //         this.dctData['lstPaymentData'][3]['strCardNo']=this.strCreditCardNo
  //         this.dctData['lstPaymentData'][3]['strRefNo']=this.strCreditRefNo
  //         this.dctData['lstPaymentData'][3]['strEmiOption']=this.strEmiCredit; //emi option in credit card
  //         this.dctData['lstPaymentData'][2]['dblAmt']=this.intDebitAmt
  //         this.dctData['lstPaymentData'][2]['strName']=this.strDebitBankName
  //         this.dctData['lstPaymentData'][2]['intBankId']=this.intDebitBankId
  //         this.dctData['lstPaymentData'][2]['strCardNo']=this.strDebitCardNo
  //         this.dctData['lstPaymentData'][2]['strRefNo']=this.strDebitRefNo;
  //         this.dctData['lstPaymentData'][2]['strEmiOption']=this.strEmi;  // emi option in debit card
  //         this.dctData['lstPaymentData'][3]['intCcCharge']=this.intCreditAmt
  //         this.dctData['lstPaymentData'][2]['intCcCharge']=this.intDebitCc

  //         this.dctData['lstPaymentData'][0]['intFinanceAmt']=this.intFinanceAmt
  //         this.dctData['lstPaymentData'][0]['strName']=this.strFinanceName
  //         this.dctData['lstPaymentData'][0]['strScheme']=this.strFinanceScheme
  //         this.dctData['lstPaymentData'][0]['dblAmt']=this.intDownPayment
  //         // this.dctData['lstPaymentData'][0]['intEMI']=this.intEMI
  //         this.dctData['lstPaymentData'][0]['strRefNo']=this.intDeliveryNo
  //         this.dctData['lstPaymentData'][4]['lstReceipt']= this.lstReceipt;
  //         this.dctData['lstPaymentData'][4]['bln_receipt'] = this.blnReceipt;
  //         this.dctData['lstPaymentData'][4]['bln_matching'] = this.blnMatching;
  //         // paytmdata
  //         this.dctData['lstPaymentData'][5]['strName'] = this.intPaytmMobileNumber;
  //         this.dctData['lstPaymentData'][5]['dblAmt'] = this.intPaytmAmount;
  //         this.dctData['lstPaymentData'][5]['strCardNo'] = this.strPaytmTransactionNum;
  //         this.dctData['lstPaymentData'][5]['strRefNo'] = this.strPaytmReferenceNum;

  //          // paytm Mall data
  //          this.dctData['lstPaymentData'][6]['strName'] = this.intPaytmMallMobileNumber;
  //          this.dctData['lstPaymentData'][6]['dblAmt'] = this.intPaytmMallAmount;
  //          this.dctData['lstPaymentData'][6]['strCardNo'] = this.strPaytmMallTransactionNum;
  //          this.dctData['lstPaymentData'][6]['strRefNo'] = this.strPaytmMallReferenceNum;       

  //          if (this.strFinanceName){
  //           this.showModalPayment.close();
  //         }
  //         if (this.blnServiceCheck) {
  //           this.showModalPayment.close();
  //         }
  //         console.log("dfksjd",this.dctData);
          
  //       }
  //       else{
  //         swal.fire('Error!',this.intBalanceAmt.toFixed(2)+" is Required", 'error');
  //       }


  //     }
  // }
  cancelPaymentOption()
  {
    // this.intBalanceAmt = this.intGrandTot -(this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt);
    if(this.blnFinance){
      if(this.intApprove == 4){
        this.intBalanceAmt=(this.dblPartialAmount-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt)+this.intExtraFinanceAmt;
      }else{
      this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt)+this.intExtraFinanceAmt;
      }
    }
    else{
      if(this.intApprove == 4){
      this.intBalanceAmt=this.dblPartialAmount-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt);
    }else{
      this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt);
    }      
    }
    this.showModalPayment.close();
  }
//  Sales Return
customerChanged(event) {
  if (event === undefined || event === null) {
  this.lstReturnCustomer = [];
  } else {
  if (event.length >= 7) {
    this.serviceObject
      .postData('salesreturn/get_details_customer/', {str_search: event})
      .subscribe(
        (response) => {
          this.lstReturnCustomer = response['customer_list'];
        }
      );
  }
  }
}
  radioChange(){
    this.blnReturnData = true;
    this.lstReturnItems =[];
    this.lstReturnQty = [];
    this.strReturnImei=''
    this.strInvoiceNo =''
    this.datReturnFrom=null
    this.datReturnTo=null
    this.selectedReturnCustomer=''
    this.selectedReturnCustomer= ''
  }
  CustomerClicked(item) {
  this.selectedReturnCustomerId = item.pk_bint_id;
  this.selectedReturnCustomerPhno = item.int_mobile;
  this.strReturnCustomerName = item.vchr_name;

  }
  getInvoice() {
  this.blnReturnData = true;
  this.lstReturnItems =[];
  this.lstReturnQty = [];
  const dct_data = {};

  if (this.strReturnImei === '' && this.strReturnType === '1') {
    this.toastr.error('Enter imei ');
    return;
  }
  if (this.strInvoiceNo === '' && this.strReturnType === '3') {
    this.toastr.error('Enter invoice No ');
    return;
  }

  if (this.strReturnType === '2' && (this.selectedReturnCustomerId === '' || this.selectedReturnCustomer!= this.strReturnCustomerName)) {
    this.toastr.error('Valid customer is required ');
    this.selectedReturnCustomerId = null
    this.selectedReturnCustomer = ''
    this.strReturnCustomerName=''
    return;
  }
  if (this.strReturnImei !== '') {
    dct_data['imei'] = this.strReturnImei;
  }
  if (this.strInvoiceNo !== '') {
    dct_data['invoiceNo'] = this.strInvoiceNo;
  }
  if (this.datReturnFrom !== null && this.datReturnTo !== null) {
    const datReturnFrom = moment(this.datReturnFrom).format('YYYY-MM-DD');
    const datReturnTo = moment(this.datReturnTo).format('YYYY-MM-DD');
    dct_data['datFrom'] = datReturnFrom;
    dct_data['datTo'] = datReturnTo;
  }
  if (this.selectedReturnCustomerId !== '') {
    dct_data['int_customer'] = this.selectedReturnCustomerId;
  }
  this.serviceObject
        .postData('salesreturn/get_details/', dct_data)
        .subscribe(
          (response) => {
            if(response.status==1){
              this.lstReturnItems = response['data'];
              this.lstReturnQty = response['data_qty'];
            }
            else{
              this.lstReturnItems =[]
            }
          }
        );
  }

  returnItem(item) {

// console.log(item,'item');

  let blnExist=false


    let returnItem = { intItemId: item.item_id,
      strItemName: item.item,
       dblMopAmount:0,      
      strImei: item.imei,
      dblRate: item.dbl_amount,
      dblBuyBack: item.dbl_buy_back,
      dblDiscount: item.dbl_discount,
      dblCGST:0,
      dblSGST:0,
      dblIGST:0,
      dblAmount: item.dbl_selling_price,
      intQuantity: this.lstReturnQty[item.int_id] ,
      intStatus:0,
      salesDetailId:item.int_id,
      strItemCode:item.item_code,
      intInvoiceNo:item.enquiry_num,
      intMasterId:item.int_master_id,


    }



    if (item.tax.hasOwnProperty('dblCGST')) {
      returnItem['dblCGST']=item.tax.dblCGST;
    }
    if (item.tax.hasOwnProperty('dblSGST')) {
      returnItem['dblSGST']=item.tax.dblSGST;
    }
    if (item.tax.hasOwnProperty('dblIGST')) {
      returnItem['dblIGST']=item.tax.dblIGST;
    }

    this.lstItemDetails.forEach(element =>
      {
        if(element.intStatus==0)
        {
          if(returnItem.strImei)
          {
            if(element.strImei==returnItem.strImei)
            {
              this.toastr.error('Return item already exist', 'Error!');
              blnExist=true
            }
          }
          else
          {
            if(element.salesDetailId==returnItem.salesDetailId)
            {
              // console.log("in  if(element.salesDetailId==returnItem.salesDetailId)");

              if(this.dctReturn[returnItem.salesDetailId]>=returnItem.intQuantity )
              {
                this.toastr.error('Return item already exist', 'Error!');
                blnExist=true
              }
            }
          }
        }
      });

      if(!blnExist){
        if(!this.dctReturn.hasOwnProperty(returnItem.salesDetailId)){
          this.dctReturn[returnItem.salesDetailId]=1
        }
        else{
          this.dctReturn[returnItem.salesDetailId]= this.dctReturn[returnItem.salesDetailId]+1
        }
        this.lstItemDetails.push(returnItem);
        this.lstReturnItems=[]
        this.strReturnImei = '';
        this.datReturnFrom = null;
        this.datReturnTo = null;
        this.selectedReturnCustomer= '';
        this.lstReturnCustomer = [];
        this.selectedReturnCustomerPhno = '';
        this.strReturnCustomerName = '';
        this.selectedReturnCustomerId = '';
        this.strInvoiceNo=''
        this.billingDatails("other",0);
        // if(this.intGrandTot<0)
        // {
        //   swal.fire('Error!','Purchase amount should be greater than return amount','error')
        // }
        this.showModalReturn.close();
      }
      else{
        this.lstReturnItems=[]
        this.strReturnImei = '';
        this.datReturnFrom = null;
        this.datReturnTo = null;
        this.selectedReturnCustomer= '';
        this.lstReturnCustomer = [];
        this.selectedReturnCustomerPhno = '';
        this.strReturnCustomerName = '';
        this.selectedReturnCustomerId = '';
        this.showModalReturn.close();

      }


  }
  indirectDiscount(index){
    // console.log (this.lstIndirectDis[index]);

    // console.log(this.lstIndirectDis[index],this.lstItemDetails[index].dblAmount,"amt,item amt");

    if(this.lstIndirectDis[index]>=this.lstItemDetails[index].dblAmount){
      this.toastr.error('Indirect discount amount should be less than item amount', 'Error!');
    }
    else{

      this.intTotIndirectDis=0
      this.billingDatails("other",0);
      this.lstItemDetails[index]['dblIndirectDis']=Number(this.lstIndirectDis[index])
      this.showModalDiscount.close();
    }
  }


  Preview1(files, event,index) {
    this.dctReturnDetail[this.currentIndex]['message']=''
    if (files.length === 0)
      return;
    this.image1 = files
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.dctReturnDetail[this.currentIndex]['message'] = "Only images are supported.";
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

        // if (img_ratio_up >= 1 && img_ratio_up <= 10) {

          // for preview
          var reader = new FileReader();
          this.imagePath1 = files;
          reader.readAsDataURL(files[0]);
          reader.onload = () => {
            this.dctReturnDetail[this.currentIndex].imgURL = reader.result;
            this.imgURL1=reader.result;
            this.dctReturnDetail[this.currentIndex]['message']=files[0]['name']
            // console.log( this.dctReturnDetail[this.currentIndex]," this.dctReturnDetail[this.currentIndex]");

          }
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.image1 = file
            this.form.get('img1').setValue(file);
            this.dctReturnDetail[this.currentIndex].image= this.form.get('img1').value


          }

        // } else {
        //   $('.error1').fadeIn(400).delay(3000).fadeOut(400);
        //   this.file1.nativeElement.value = null;
        //   Swal.fire("Error", 'Print Logo ratio must be 4:1', "error");
        //   this.file1.nativeElement.value = "";
        //   this.imgURL1 = null
        //   this.form.get('img1').setValue('')
        // }
      };
      img_up.src = window.URL.createObjectURL(this.image1);
      // return status

    }

  }
  returnDetailsSave(currentIndex)
  {

    if(this.dctReturnDetail[currentIndex].blnDamage && !this.dctReturnDetail[currentIndex].image){
      this.toastr.error('Image is required', 'Error!');
    }
    else if(!this.dctReturnDetail[currentIndex].strRemark){
      this.toastr.error('Remarks is mandatory', 'Error!');
    }
    else{

      this.dctImages[Number(this.returnId)]=this.form.get('img1').value
      this.dctReturnId[Number(this.returnId)]={}
      this.dctReturnId[Number(this.returnId)]['blnDamage']=this.dctReturnDetail[currentIndex].blnDamage
      this.dctReturnId[Number(this.returnId)]['strRemarks']=this.dctReturnDetail[currentIndex].strRemark
      this.showModalReturnDetails.close();

     // this.lstItemDetails[currentIndex]['returnDetails']=this.dctReturnDetail[currentIndex]
     // this.lstItemDetails[currentIndex]['returnDetails']={}
     // this.lstItemDetails[currentIndex]['image']=this.form.get('img1').value
     // this.lstItemDetails[currentIndex]['blnDamage']=this.dctReturnDetail[currentIndex].blnDamage
     // this.lstItemDetails[currentIndex]['strRemarks']=this.dctReturnDetail[currentIndex].strRemark
     // }
     // console.log("list",this.lstItemDetails[currentIndex])

       }
  }



  fileManager2(fileInput) {
    fileInput.click();
  }
  openreceiptview(item){
    // console.log('a',item)
    localStorage.setItem('receiptId',item.pk_bint_id);
    localStorage.setItem('invoiceReceipt',item.vchr_receipt_num)
    localStorage.setItem('previousUrl','receipt/viewreceipt');
    
    this.router.navigate(['receipt/viewreceipt']);
    this.showModalPayment.close();
  }


  setClass(){
    
    if(this.lstIndex==0){
      this.lstIndex=1;
      // this.blnShow1=true;
      // this.blnShow2=false;
      // this.blnShow3=false;
      // this.blnShow4=false;

    }
    else if(this.lstIndex==1){
      this.lstIndex=2;
      // this.blnShow1=false;
      // this.blnShow2=true;
      // this.blnShow3=false;
      // this.blnShow4=false;
    }
    else if(this.lstIndex==2){
      this.lstIndex=3;
      // this.blnShow1=false;
      // this.blnShow2=false;
      // this.blnShow3=true;
      // this.blnShow4=false;
    }
    else if(this.lstIndex==3){
      this.lstIndex=0;
      // this.blnShow1=false;
      // this.blnShow2=false;
      // this.blnShow3=false;
      // this.blnShow4=true;
    }
  }
  rejectInvoice(){
    this.serviceObject.putData('invoice/add_invoice/',{intPartialId:this.salesRowId,'blnService':true}).subscribe(res => {
      if (res.status == 1)
      {
        swal.fire('Success!',res['message'], 'success');
  
      }
      else if (res.status == 0) {
        swal.fire('Error!',res['message'], 'error');
        }
      },
      (error) => {
        swal.fire('Error!','Server Error!!', 'error');
  
      });

  }
  emiChanged(item,index)
  {
   this.intEmiDebitId = item.id;
   
  //  this.strSelectedEmi = item.name;
  this.lstDebit[index]['strSelectedEmi'] = item.name;

   // this.strPincode= item.vchr_pin_code;
 }
 emiCreditChanged(item,index)
 {
  this.intEmiCreditId = item.id;
  // this.strSelectedCreditEmi = item.name;
  this.lstCredit[index]['strSelectedCreditEmi'] = item.name;

  // this.strPincode= item.vchr_pin_code;
}

savePaymentOption(event)
{    
  // =========================================================
  
  // if(!this.strFinanceName){
  //   this.intReceivedAmt = this.intGrandTot
  // }
  // =========================================================
  
  let checkError=false
  
  if(this.blnCash){
    if(!this.intReceivedAmt){
      swal.fire('Error!','Enter Valid Amount ', 'error');
      checkError=true

    }
  }
  if(this.blnCreditCard)
     {
       this.intCreditAmt=0;
      for(let i=0;i<this.lstCredit.length;i++){

        if(!this.lstCredit[i]['strCardNo']){
          swal.fire('Error!','Enter Credit Card '+(i+1)+' No', 'error');
          checkError=true
          break;

        }
        else if(this.lstCredit[i]['strCardNo'].toString().length < 4 || this.lstCredit[i]['strCardNo'].toString().length >4 ){
          swal.fire('Error!','Enter 4 Digits for Credit Card '+(i+1),'error');
          checkError=true
          break;

         }
        else if(!this.lstCredit[i]['intBankId']){
          swal.fire('Error!','Enter Bank Name Of Credit Card '+(i+1), 'error');
          checkError=true
          break;

        }
        else if(!this.lstCredit[i]['dblAmt'] || this.lstCredit[i]['dblAmt']<0){
          swal.fire('Error!','Enter Valid Credit Amount for Credit Card '+(i+1), 'error');
          checkError=true
          break;

        }

        else if(!this.lstCredit[i]['strScheme']){
          swal.fire('Error!','Select EMI option for Credit Card '+(i+1), 'error');
          checkError=true
          break;

        }
        else if(this.lstCredit[i]['strScheme'] != this.lstCredit[i]['strSelectedCreditEmi'] ){
          swal.fire('Error!','Select Valid EMI option for Credit Card '+(i+1), 'error');
          checkError=true
          break;

        }
        else if(!this.lstCredit[i]['strRefNo']){
          swal.fire('Error!','Enter Valid Reference No Of Credit Card '+(i+1), 'error');
          checkError=true
          break;

        }
        this.intCreditAmt+=this.lstCredit[i]['dblAmt'];
      }
    }
    if(this.blnDebitCard)
    {
      this.intDebitAmt=0;

      for(let i=0;i<this.lstDebit.length;i++){
        if(!this.lstDebit[i]['strCardNo']){
          swal.fire('Error!','Enter Debit Card '+(i+1)+' No ', 'error');
          checkError=true
          break;

        }
        else if(this.lstDebit[i]['strCardNo'].toString().length < 4 || this.lstDebit[i]['strCardNo'].toString().length >4 ){
          swal.fire('Error!','Enter 4 Digits  for Debit Card '+(i+1),'error');
          checkError = true;
          break;

         }
        // else if(this.strDebitCardNo.length<4){
        //   swal.fire('Error!','Enter Mininum 4 Digits ', 'error');
        //   checkError=true
        // }
        else if(!this.lstDebit[i]['intBankId']){
          swal.fire('Error!','Enter Bank Name Of Debit Card '+(i+1), 'error');
          checkError=true
          break;
        }
        else if(!this.lstDebit[i]['dblAmt'] || this.lstDebit[i]['dblAmt'] <0){
          swal.fire('Error!','Enter Valid Debit Amount for Debit Card'+(i+1), 'error');
          checkError=true
          break;

        }
        else if(!this.lstDebit[i]['strEmi']){
          swal.fire('Error!','Select Emi Option for Debit Card '+(i+1), 'error');
          checkError=true
          break;

        }
        else if(this.lstDebit[i]['strEmi'] != this.lstDebit[i]['strSelectedEmi']){            
          swal.fire('Error!','Select Valid Emi Option for Debit Card '+(i+1), 'error');
          checkError=true
          break;

        }
        
        else if(!this.lstDebit[i]['strRefNo']){
          swal.fire('Error!','Enter Valid Reference No Of Debit Card '+(i+1), 'error');
          checkError=true
          break;

        }

        this.intDebitAmt+=this.lstDebit[i]['dblAmt'];
      }
    }
    if(this.blnPaytm)
    {
        if(!this.intPaytmMobileNumber){
          swal.fire('Error!','Mobile number is required ', 'error');
          checkError=true

        }                                                                                        
        else if(this.intPaytmMobileNumber.toString().length < 10 || this.intPaytmMobileNumber.toString().length >10 ){
         swal.fire('Error!','Invalid Mobile number','error');
         checkError = true;

        }
        else if(!this.intPaytmAmount  || this.intPaytmAmount<0){
          swal.fire('Error!','Valid Paytm amount required ', 'error');
          checkError=true
        }
        else if(!this.strPaytmTransactionNum){
          swal.fire('Error!','Paytm Transaction Number required', 'error');
          checkError=true

        }
        else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmTransactionNum)) {
          checkError=true
          swal.fire('Error!','Paytm Transaction Number  allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }
        else if(!this.strPaytmReferenceNum){
          swal.fire('Error!','Paytm Reference Number required', 'error');
          checkError=true

        }
        else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmReferenceNum)) {
          checkError=true
          swal.fire('Error!','Reference Number allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }


    }
    if(this.blnBharathQr)
    {
        if(!this.intBharathQrMobileNumber){
          // console.log("ammo1")
          swal.fire('Error!','Mobile number is required ', 'error');
          checkError=true

        }
        else if(this.intBharathQrMobileNumber.toString().length < 10 || this.intBharathQrMobileNumber.toString().length >10 ){
         swal.fire('Error!','Invalid Mobile number','error');
         checkError = true;

        }
        else if(!this.intBharathQrAmount || this.intBharathQrAmount<0 ){
          swal.fire('Error!','Valid Bharath QR amount required ', 'error');
          checkError=true
        }
        else if(!this.strBharathQrTransactionNum){
          swal.fire('Error!','Bharath QR Transaction Number required', 'error');
          checkError=true

        }
        else if (!/^[a-zA-Z0-9]+$/g.test(this.strBharathQrTransactionNum)) {
          checkError=true
          swal.fire('Error!','Bharath QR Transaction Number  allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }
        else if(!this.strBharathQrReferenceNum){
          swal.fire('Error!','Bharath QR  Reference Number required', 'error');
          checkError=true

        }
        else if (!/^[a-zA-Z0-9]+$/g.test(this.strBharathQrReferenceNum)) {
          checkError=true
          swal.fire('Error!','Reference Number allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }

    }
    if(this.blnPaytmMall)
    {
        if(!this.intPaytmMallMobileNumber){
          swal.fire('Error!','Mobile number is required ', 'error');
          checkError=true

        }
        else if(this.intPaytmMallMobileNumber.toString().length < 10 || this.intPaytmMallMobileNumber.toString().length >10 ){
         swal.fire('Error!','Invalid Mobile number','error');
         checkError = true;

        }
        else if(!this.intPaytmMallAmount || this.intPaytmMallAmount<0 ){
          swal.fire('Error!','Valid Paytm Mall amount required ', 'error');
          checkError=true
        }
        else if(!this.strPaytmMallTransactionNum){
          swal.fire('Error!','Paytm Mall Transaction Number required', 'error');
          checkError=true

        }
        else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmMallTransactionNum)) {
          checkError=true
          swal.fire('Error!','Paytm Mall Transaction Number  allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }
        else if(!this.strPaytmMallReferenceNum){
          swal.fire('Error!','Paytm Mall  Reference Number required', 'error');
          checkError=true

        }
        else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmMallReferenceNum)) {
          checkError=true
          swal.fire('Error!','Reference Number allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }

    }

    
    if(!checkError){
      
      // =================================
      // if(!this.strFinanceName){
      //   this.intBalanceAmt = 0
      // }
      // =================================
              

      this.calculateBalance();
      
      if(this.intBalanceAmt<=0){
        this.dctData['lstPaymentData']={}
        this.dctData['lstPaymentData'][4]={}
        
        
        if(this.blnReceipt){
          
          // if(this.intGrandTot<this.intReceiptTot){       //old
          //   this.dctData['lstPaymentData'][4]['dblAmt'] = this.intGrandTot;
          // }
          // else{
          //   this.dctData['lstPaymentData'][4]['dblAmt'] = this.intReceiptTot;
          // }
          // console.log("this.intReceiptTot",this.intReceiptTot);
          
          // if(this.intBalanceAmt==0){
            this.dctData['lstPaymentData'][4]['dblAmt'] = this.intReceiptTot;
          // }

          // console.log("this.dctData['lstPaymentData'][4]['dblAmt']",this.dctData['lstPaymentData'][4]['dblAmt']);
          

          
          let lstreceiptNumbers = []
          this.lstReceipt.forEach(element => {
           
            
            lstreceiptNumbers.push(element.vchr_receipt_num)
            
         
          });
          lstreceiptNumbers[0] = lstreceiptNumbers.toString();
          
          
          this.dctData['lstPaymentData'][4]['strRefNo'] =lstreceiptNumbers[0];
        }

       
        this.dctData['lstPaymentData'][1]={}
        this.dctData['lstPaymentData'][3]={}
        this.dctData['lstPaymentData'][2]={}
        this.dctData['lstPaymentData'][0]={}
      
        this.dctData['lstPaymentData'][5]={}
        this.dctData['lstPaymentData'][6]={}
        this.dctData['lstPaymentData'][7]={}

        this.dctData['lstPaymentData'][1]['dblAmt']=this.intReceivedAmt

        this.dctData['lstPaymentData'][3]['dblAmt']=this.intCreditAmt
        this.dctData['lstPaymentData'][3]['intBankId']=this.intCreditBankId;
        this.dctData['lstPaymentData'][3]['strName']=this.strCreditBankName;
        this.dctData['lstPaymentData'][3]['strCardNo']=this.strCreditCardNo
        this.dctData['lstPaymentData'][3]['strRefNo']=this.strCreditRefNo
        this.dctData['lstPaymentData'][3]['strScheme']=this.strEmiCredit; //emi option in credit card

        this.dctData['lstPaymentData'][3]['creditCard']=this.lstCredit;

        this.dctData['lstPaymentData'][2]['debitCard']=this.lstDebit;

        this.dctData['lstPaymentData'][2]['dblAmt']=this.intDebitAmt
        this.dctData['lstPaymentData'][2]['intBankId']=this.intDebitBankId
        this.dctData['lstPaymentData'][2]['strName']=this.strDebitBankName
        this.dctData['lstPaymentData'][2]['strCardNo']=this.strDebitCardNo
        this.dctData['lstPaymentData'][2]['strRefNo']=this.strDebitRefNo;
        this.dctData['lstPaymentData'][2]['strScheme']=this.strEmi;  // emi option in debit card

        this.dctData['lstPaymentData'][3]['intCcCharge']=this.intCreditAmt
        this.dctData['lstPaymentData'][2]['intCcCharge']=this.intDebitCc

        this.dctData['lstPaymentData'][0]['intFinanceAmt']=this.intFinanceAmt
        this.dctData['lstPaymentData'][0]['intFinanceId']=null

        this.dctData['lstPaymentData'][0]['strName']=this.strFinanceName
        this.dctData['lstPaymentData'][0]['strScheme']=this.strFinanceScheme
        this.dctData['lstPaymentData'][0]['dblAmt']=this.intDownPayment
        // this.dctData['lstPaymentData'][0]['intEMI']=this.intEMI
        this.dctData['lstPaymentData'][0]['strRefNo']=this.intDeliveryNo
        // advance payment
        this.dctData['lstPaymentData'][4]['lstReceipt']= this.lstReceipt;
        this.dctData['lstPaymentData'][4]['bln_receipt'] = this.blnReceipt;
        this.dctData['lstPaymentData'][4]['bln_matching'] = this.blnMatching;
      
        // paytmdata
        this.dctData['lstPaymentData'][5]['strName'] = this.intPaytmMobileNumber;
        this.dctData['lstPaymentData'][5]['dblAmt'] = this.intPaytmAmount;
        this.dctData['lstPaymentData'][5]['strCardNo'] = this.strPaytmTransactionNum;
        this.dctData['lstPaymentData'][5]['strRefNo'] = this.strPaytmReferenceNum;
        // paytm Mall data
        this.dctData['lstPaymentData'][6]['strName'] = this.intPaytmMallMobileNumber;
        this.dctData['lstPaymentData'][6]['dblAmt'] = this.intPaytmMallAmount;
        this.dctData['lstPaymentData'][6]['strCardNo'] = this.strPaytmMallTransactionNum;
        this.dctData['lstPaymentData'][6]['strRefNo'] = this.strPaytmMallReferenceNum;
        // BharathQr data
        this.dctData['lstPaymentData'][7]['strName'] = this.intBharathQrMobileNumber;
        this.dctData['lstPaymentData'][7]['dblAmt'] = this.intBharathQrAmount;
        this.dctData['lstPaymentData'][7]['strCardNo'] = this.strBharathQrTransactionNum;
        this.dctData['lstPaymentData'][7]['strRefNo'] = this.strBharathQrReferenceNum;
        // ======================================================
        this.showModalPayment.close();
        // if (!this.strFinanceName) {
        //   this.showModalPayment = this.modalService.open('makepayment', { size: 'lg' })
        //   this.showModalPayment.close();
        // }
        // else{
        //   this.showModalPayment.close();
        // }
        // ======================================================
        
      }
      else{
        
        swal.fire('Error!',this.intBalanceAmt.toFixed(2)+" is Required", 'error');
      }


    }
}
emiSearched(event,data){ //debit card
   
  this.newTime1=event.timeStamp;
  this.keyEve1=event.keyCode;  
  
  if (data === undefined || data === null) {
  } else {
    if (this.keyEve1 === 8|| this.keyEve1 === 38|| this.keyEve1 === 40|| this.keyEve1 === 13) {
      if (data === undefined || data === null || data === '') { 
        this.lstEmiOptions = [];  
      }
      return //return for backspace, enter key and up&down arrows.
    } 
    if (data.length > 1) {
      if((this.newTime1 - this.setStart1)>100 || data.length==2){
      this.setStart1=this.newTime1;
      this.lstEmiOptions = [];
      this.typeaheadEmi(data);       
      }
      else{
        return;
      }
    } else{
      this.lstEmiOptions = [];
    }
  }
}


typeaheadEmi(data){ //debit
  this.serviceObject.postData('invoice/scheme_typeahead/',{term:data}).subscribe(
    (response) => {        
      this.lstEmiOptions.push(...response['data']);
    },
    (error) => {   
      swal.fire('Error!',error, 'error');
      
    }
    );
}

emiCreditSearched(event,data){
 
  this.newTime2=event.timeStamp;
  this.keyEve2=event.keyCode;  
  
  if (data === undefined || data === null) {
  } else {
    if (this.keyEve2 === 8|| this.keyEve2 === 38|| this.keyEve2 === 40|| this.keyEve2 === 13) {
      if (data === undefined || data === null || data === '') { 
        this.lstEmiCreditOptions = [];  
      }
      return //return for backspace, enter key and up&down arrows.
    } 
    if (data.length > 1) {
      if((this.newTime2 - this.setStart2)>100 || data.length==2){
      this.setStart2=this.newTime2;
      this.lstEmiCreditOptions = [];
      this.typeaheadCreditEmi(data);       
      }
      else{
        return;
      }
    } else{
      this.lstEmiCreditOptions = [];
    }
  }
}

typeaheadCreditEmi(data){ //debit
  this.serviceObject.postData('invoice/scheme_typeahead/',{term:data}).subscribe(
    (response) => {        
      this.lstEmiCreditOptions.push(...response['data']);
    },
    (error) => {   
      swal.fire('Error!',error, 'error');
      
    }
    );
}

 //payment

 calculateBalance()
 {
   // negative value converted into positive in cash

   if(this.blnCash)
   {
     if(this.intReceivedAmt<0){
       this.intReceivedAmt = (this.intReceivedAmt)*-1
     }
     // if (this.intReceivedAmt ==null) {
     // this.toastr.error('Invalid Amount!!', 'Error!');
     //   this.intReceivedAmt = 0
     // }
   }


   // if(this.blnFinance){
   //   this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
   // }
   // else if(this.blnReceipt){
   //   this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount);
   // }
   // else if(this.blnFinance && this.blnReceipt){
   //   this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
   // }
   // else{
   //   this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
   // }

   // console.log("calculateBalance this.intReceiptTot",this.intReceiptTot);

   // console.log("calculateBalance this.intBalanceAmt",this.intBalanceAmt);

   // console.log("calculateBalance this.intGrandTo",this.intGrandTot);

   if(this.blnDebitCard){
     this.intDebitAmt = 0;
     this.lstDebit.forEach(element => {              //change the  to get value if debit card payement
       // console.log(element,'element');
       this.intDebitAmt += element.dblAmt;
       
       
     });
   }
   if(this.blnCreditCard){
     this.intCreditAmt = 0;
     this.lstCredit.forEach(element => {             //change the  to get value if credit card payement
       // console.log(element,'element');        
       this.intCreditAmt += element.dblAmt;
       
       
     });
   }
   
   
   
  if(this.intApprove==4){
    if(this.blnReceipt && !this.blnFinance ){    
      this.intBalanceAmt=this.dblPartialAmount-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)
    }
    else if(this.blnFinance && !this.blnReceipt){      
      this.intBalanceAmt=(this.dblPartialAmount-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
    }
    else if(this.blnReceipt && this.blnFinance){

      this.intBalanceAmt=(this.dblPartialAmount-this.intFinanceAmt-this.intReceiptTot)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
    }
    else{      
        this.intBalanceAmt=this.dblPartialAmount-(this.intCreditAmt + this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
    }
  }
  else{
  if(this.blnReceipt && !this.blnFinance ){    
    this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)
  }
  else if(this.blnFinance && !this.blnReceipt){      
    this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
  }
  else if(this.blnReceipt && this.blnFinance){

    this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
  }else if(this.blnCreditSale){
    this.intBalanceAmt=(this.intGrandTot-this.dblPartialAmount)-(this.intCreditAmt + this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
  }
  else{      
      this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt + this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
  }
}

   this.intBalanceAmt=Number(this.intBalanceAmt.toFixed(2))

   if(this.intBalanceAmt<0){


     this.toastr.error('Amount Exceeded', 'Error!');
   }    
 }

 cashChanged(event)
 {


   event.source._checkError=false;

   if(this.blnCash){
   event.source.checked=true;
   }
   else{
     event.source.checked=false;

   }

   if(!this.blnCash){
     this.intReceivedAmt=0
   }
   else
   {
      if(this.blnCreditCard)
      {

       for(let i=0;i<this.lstCredit.length;i++){

         if(!this.lstCredit[i]['strCardNo']){
           swal.fire('Error!','Enter Credit Card '+(i+1)+' No', 'error');
           event.source._checkError=true
           break;

         }
         else if(this.lstCredit[i]['strCardNo'].toString().length < 4 || this.lstCredit[i]['strCardNo'].toString().length >4 ){
           swal.fire('Error!','Enter 4 Digits for Credit Card '+(i+1),'error');
           event.source._checkError=true
           break;

          }
         else if(!this.lstCredit[i]['intBankId']){
           swal.fire('Error!','Enter Bank Name Of Credit Card '+(i+1), 'error');
           event.source._checkError=true
           break;

         }
         else if(!this.lstCredit[i]['dblAmt'] || this.lstCredit[i]['dblAmt']<0){
           swal.fire('Error!','Enter Valid Credit Amount for Credit Card '+(i+1), 'error');
           event.source._checkError=true
           break;

         }

         else if(!this.lstCredit[i]['strScheme']){
           swal.fire('Error!','Select EMI option for Credit Card '+(i+1), 'error');
           event.source._checkError=true
           break;

         }
         else if(this.lstCredit[i]['strScheme'] != this.lstCredit[i]['strSelectedCreditEmi'] ){
           swal.fire('Error!','Select Valid EMI option for Credit Card '+(i+1), 'error');
           event.source._checkError=true
           break;

         }
         else if(!this.lstCredit[i]['strRefNo']){
           swal.fire('Error!','Enter Valid Reference No Of Credit Card '+(i+1), 'error');
           event.source._checkError=true
           break;

         }
       }

       if(event.source._checkError){
         this.blnCash=false;
         event.source.checked=false;

       }

     }
     if(this.blnDebitCard)
     {
       for(let i=0;i<this.lstDebit.length;i++){
         if(!this.lstDebit[i]['strCardNo']){
           swal.fire('Error!','Enter Debit Card '+(i+1)+' No ', 'error');
           event.source._checkError=true
           break;

         }
         else if(this.lstDebit[i]['strCardNo'].toString().length < 4 || this.lstDebit[i]['strCardNo'].toString().length >4 ){
           swal.fire('Error!','Enter 4 Digits  for Debit Card '+(i+1),'error');
           event.source._checkError = true;
           break;

          }
         // else if(this.strDebitCardNo.length<4){
         //   swal.fire('Error!','Enter Mininum 4 Digits ', 'error');
         //   event.source._checkError=true
         // }
         else if(!this.lstDebit[i]['intBankId']){
           swal.fire('Error!','Enter Bank Name Of Debit Card '+(i+1), 'error');
           event.source._checkError=true
           break;
         }
         else if(!this.lstDebit[i]['dblAmt'] || this.lstDebit[i]['dblAmt'] <0){
           swal.fire('Error!','Enter Valid Debit Amount for Debit Card'+(i+1), 'error');
           event.source._checkError=true
           break;

         }
         else if(!this.lstDebit[i]['strEmi']){
           swal.fire('Error!','Select Emi Option for Debit Card '+(i+1), 'error');
           event.source._checkError=true
           break;

         }
         else if(this.lstDebit[i]['strEmi'] != this.lstDebit[i]['strSelectedEmi']){            
           swal.fire('Error!','Select Valid Emi Option for Debit Card '+(i+1), 'error');
           event.source._checkError=true
           break;

         }
         
         else if(!this.lstDebit[i]['strRefNo']){
           swal.fire('Error!','Enter Valid Reference No Of Debit Card '+(i+1), 'error');
           event.source._checkError=true
           break;

         }
       }
       if(event.source._checkError){
         this.blnCash=false;
         event.source.checked=false;

       }
     }
     if(this.blnPaytm)
     {
          if(!this.intPaytmMobileNumber){
           swal.fire('Error!','Enter Mobile Number', 'error');
           this.blnCash=false
            event.source._checked = false
          }
          else if(!this.intPaytmAmount  || this.intPaytmAmount<0){
           swal.fire('Error!','Enter Valid Amount', 'error');
           this.blnCash=false
            event.source._checked = false
          }
          else if(!this.strPaytmTransactionNum){
           swal.fire('Error!','Enter Paytm Transaction Number ', 'error');
           this.blnCash=false
            event.source._checked = false
          }
          else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmTransactionNum)) {
           this.blnCash=false
            event.source._checked = false
           swal.fire('Error!','Paytm Transaction Number  allow only alpha numerics ', 'error');
           // -----------------------------------------------
 //payment
         }
          else if(!this.strPaytmReferenceNum){
           swal.fire('Error!','Enter Paytm Reference Number ', 'error');
           this.blnCash=false
            event.source._checked = false
          }
     }
     if(this.blnPaytmMall)
     {
          if(!this.intPaytmMallMobileNumber){
           swal.fire('Error!','Enter Mobile Number', 'error');
           this.blnCash=false
            event.source._checked = false
          }
          else if(!this.intPaytmMallAmount || this.intPaytmMallAmount<0 ){
           swal.fire('Error!','Enter Valid Amount', 'error');
           this.blnCash=false
            event.source._checked = false
          }
          else if(!this.strPaytmMallTransactionNum){
           swal.fire('Error!','Enter Paytm Mall Transaction Number ', 'error');
           this.blnCash=false
            event.source._checked = false
          }
          else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmMallTransactionNum)) {
           this.blnCash=false
           event.source._checked = false
           swal.fire('Error!','Paytm Mall Transaction Number  allow only alpha numerics ', 'error');
           // -----------------------------------------------
         }
          else if(!this.strPaytmMallReferenceNum){
           swal.fire('Error!','Enter Paytm Mall Reference Number ', 'error');
           this.blnCash=false
            event.source._checked = false
          }
          else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmMallReferenceNum)) {
           this.blnCash=false
           event.source._checked = false
           swal.fire('Error!','Reference Number allow only alpha numerics ', 'error');
           // -----------------------------------------------
         }
     }
     if(this.blnBharathQr)
     {
          if(!this.intBharathQrMobileNumber){
           swal.fire('Error!','Enter Mobile Number', 'error');
           this.blnCash=false
            event.source._checked = false
          }
          else if(!this.intBharathQrAmount || this.intBharathQrAmount<0 ){
           swal.fire('Error!','Enter Valid Amount', 'error');
           this.blnCash=false
            event.source._checked = false
          }
          else if(!this.strBharathQrTransactionNum){
           swal.fire('Error!','Enter Bharath QR Transaction Number ', 'error');
           this.blnCash=false
            event.source._checked = false
          }
          else if (!/^[a-zA-Z0-9]+$/g.test(this.strBharathQrTransactionNum)) {
           this.blnCash=false
           event.source._checked = false
           swal.fire('Error!','Bharath QR Transaction Number  allow only alpha numerics ', 'error');
           // -----------------------------------------------
         }
          else if(!this.strBharathQrReferenceNum){
           swal.fire('Error!','Enter Bharath QR Reference Number ', 'error');
           this.blnCash=false
            event.source._checked = false
          }
          else if (!/^[0-9]+$/g.test(this.strBharathQrReferenceNum)) {
           this.blnCash=false
           event.source._checked = false
           swal.fire('Error!','Reference Number allow only numerics ', 'error');
           // -----------------------------------------------
         }
     }

   }

   this.calculateBalance()
 }

 // setCheckbox(){
 //   this.blnCreditCard=false;
 //   console.log("setCheckbox this.blnCreditCard ",this.blnCreditCard);

 // }

 creditCardChanged(event)
 {

   event.source._checkError=false;

   if(this.blnCreditCard){
   event.source.checked=true;
   }
   else{
     this.intCreditAmt=0;
     event.source.checked=false;

   }
   
   if(!this.blnCreditCard){

     this.lstCredit=[];

     let dctCredit={
         strCardNo:null,
         intBankId:null,
         dblAmt:null,
         strScheme:'',
         strRefNo:null,
         intCcCharge:null,
         strName:''
     }

     this.lstCredit.push(dctCredit);

     // this.intCreditAmt=0
     // this.intCreditBankId=''
     // this.strCreditCardNo=''
     // this.strCreditRefNo=''
     // this.strEmiCredit = '';
   }
   else{
       if(this.blnDebitCard){

         for(let i=0;i<this.lstDebit.length;i++){
           if(!this.lstDebit[i]['strCardNo']){
             swal.fire('Error!','Enter Debit Card '+(i+1)+' No ', 'error');
             event.source._checkError=true
             break;
 
           }
           else if(this.lstDebit[i]['strCardNo'].toString().length < 4 || this.lstDebit[i]['strCardNo'].toString().length >4 ){
             swal.fire('Error!','Enter 4 Digits  for Debit Card '+(i+1),'error');
             event.source._checkError = true;
             break;
 
            }
           // else if(this.strDebitCardNo.length<4){
           //   swal.fire('Error!','Enter Mininum 4 Digits ', 'error');
           //   event.source._checkError=true
           // }
           else if(!this.lstDebit[i]['intBankId']){
             swal.fire('Error!','Enter Bank Name Of Debit Card '+(i+1), 'error');
             event.source._checkError=true
             // return false
             break;
           }
           
           else if(!this.lstDebit[i]['dblAmt'] || this.lstDebit[i]['dblAmt'] <0){
             swal.fire('Error!','Enter Valid Debit Amount for Debit Card'+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(!this.lstDebit[i]['strEmi']){
             swal.fire('Error!','Select Emi Option for Debit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(this.lstDebit[i]['strEmi'] != this.lstDebit[i]['strSelectedEmi']){            
             swal.fire('Error!','Select Valid Emi Option for Debit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           
           else if(!this.lstDebit[i]['strRefNo']){
             swal.fire('Error!','Enter Valid Reference No Of Debit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
         }
         
       if(event.source._checkError){
         this.blnCreditCard=false;
         event.source.checked=false;
       }

       
       if(this.blnCash){
         if(!this.intReceivedAmt){
           swal.fire('Error!','Enter Valid Amount ', 'error');
           this.blnCreditCard=false
           event.source._checked = false
           

         }
       }
       if(this.blnPaytm)
       {
            if(!this.intPaytmMobileNumber){
             swal.fire('Error!','Enter Mobile Number', 'error');
             this.blnCreditCard=false
              event.source._checked = false
            }
            else if(!this.intPaytmAmount || this.intPaytmAmount<0){
             swal.fire('Error!','Enter Valid Amount ', 'error');
             this.blnCreditCard=false
              event.source._checked = false
            }
            else if(!this.strPaytmTransactionNum){
             swal.fire('Error!','Enter Paytm Transaction Number ', 'error');
             this.blnCreditCard=false
              event.source._checked = false
            }
            else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmTransactionNum)) {
             this.blnCreditCard=false
              event.source._checked = false
             swal.fire('Error!','Paytm Transaction Number  allow only alpha numerics ', 'error');
             // -----------------------------------------------
           }
            else if(!this.strPaytmReferenceNum){
             swal.fire('Error!','Enter Paytm Reference Number ', 'error');
             this.blnCreditCard=false
              event.source._checked = false
            }
           //  else if (!/^[a-zA-Z0-9]*$/g.test(this.strPaytmReferenceNum)) {
           //   this.blnCreditCard=false
           //   event.source._checked = false
           //   swal.fire('Error!','Reference Number allow only alpha numerics ', 'error');
           //   // -----------------------------------------------
           // }
       }
       if(this.blnPaytmMall)
     {
          if(!this.intPaytmMallMobileNumber){
           swal.fire('Error!','Enter Mobile Number', 'error');
           this.blnCreditCard=false
            event.source._checked = false
          }
          else if(!this.intPaytmMallAmount || this.intPaytmMallAmount<0 ){
           swal.fire('Error!','Enter Valid Amount', 'error');
           this.blnCreditCard=false
            event.source._checked = false
          }
          else if(!this.strPaytmMallTransactionNum){
           swal.fire('Error!','Enter Paytm Mall Transaction Number ', 'error');
           this.blnCreditCard=false
            event.source._checked = false
          }
          else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmMallTransactionNum)) {
           this.blnCreditCard=false
           event.source._checked = false
           swal.fire('Error!','Paytm Mall Transaction Number  allow only alpha numerics ', 'error');
           // -----------------------------------------------
         }
          else if(!this.strPaytmMallReferenceNum){
           swal.fire('Error!','Enter Paytm Mall Reference Number ', 'error');
           this.blnCreditCard=false
            event.source._checked = false
          }
     }
     if(this.blnBharathQr)
     {
          if(!this.intBharathQrMobileNumber){
           swal.fire('Error!','Enter Mobile Number', 'error');
           this.blnCreditCard=false
            event.source._checked = false
          }
          else if(!this.intBharathQrAmount || this.intBharathQrAmount<0 ){
           swal.fire('Error!','Enter Valid Amount', 'error');
           this.blnCreditCard=false
            event.source._checked = false
          }
          else if(!this.strBharathQrTransactionNum){
           swal.fire('Error!','Enter Bharath QR Transaction Number ', 'error');
           this.blnCreditCard=false
            event.source._checked = false
          }
          else if (!/^[a-zA-Z0-9]+$/g.test(this.strBharathQrTransactionNum)) {
           this.blnCreditCard=false
           event.source._checked = false
           swal.fire('Error!','Bharath QR Transaction Number  allow only alpha numerics ', 'error');
           // -----------------------------------------------
         }
          else if(!this.strBharathQrReferenceNum){
           swal.fire('Error!','Bharath QR Reference Number ', 'error');
           this.blnCreditCard=false
            event.source._checked = false
          }
     }
   }

   this.calculateBalance()
 }
}

 debitCardChanged(event)
 {    


   event.source._checkError=false;

   if(this.blnDebitCard){
   event.source.checked=true;
   }
   else{
     this.intDebitAmt=0;
     event.source.checked=false;

   }


   if(!this.blnDebitCard){

     this.lstDebit=[];

   

     let dctDebit={
       strCardNo:null,
       intBankId:null,
       dblAmt:null,
       strEmi:'',
       strRefNo:null,
       intCcCharge:null,
       strName:''
     }

     this.lstDebit.push(dctDebit);
     
     // this.intDebitAmt=0
     // this.intDebitBankId=''
     // this.strDebitCardNo=''
     // this.strDebitRefNo=''
     // this.strEmi = '';
   }
   else{
       if(this.blnCreditCard){

         for(let i=0;i<this.lstCredit.length;i++){


           if(!this.lstCredit[i]['strCardNo']){
             swal.fire('Error!','Enter Credit Card '+(i+1)+' No', 'error');
             event.source._checkError=true
             break;
 
           }
           else if(this.lstCredit[i]['strCardNo'].toString().length < 4 || this.lstCredit[i]['strCardNo'].toString().length >4 ){
             swal.fire('Error!','Enter 4 Digits for Credit Card '+(i+1),'error');
             event.source._checkError=true
             break;
 
            }
           else if(!this.lstCredit[i]['intBankId']){
             swal.fire('Error!','Enter Bank Name Of Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(!this.lstCredit[i]['dblAmt'] || this.lstCredit[i]['dblAmt']<0){
             swal.fire('Error!','Enter Valid Credit Amount for Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
 
           else if(!this.lstCredit[i]['strScheme']){
             swal.fire('Error!','Select EMI option for Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(this.lstCredit[i]['strScheme'] != this.lstCredit[i]['strSelectedCreditEmi'] ){
             swal.fire('Error!','Select Valid EMI option for Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(!this.lstCredit[i]['strRefNo']){
             swal.fire('Error!','Enter Valid Reference No Of Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
         }

       if(event.source._checkError){
         this.blnDebitCard=false;
         event.source.checked=false;

       }

       
       if(this.blnCash){
         if(!this.intReceivedAmt){
           swal.fire('Error!','Enter Valid Amount ', 'error');
           this.blnDebitCard=false
           event.source._checked = false

         }
       }
       if(this.blnPaytm)
       {
            if(!this.intPaytmMobileNumber){
             swal.fire('Error!','Enter Mobile Number', 'error');
             this.blnDebitCard=false
              event.source._checked = false
            }
            else if(!this.intPaytmAmount || this.intPaytmAmount<0){
             swal.fire('Error!','Enter Valid Amount', 'error');
             this.blnDebitCard=false
              event.source._checked = false
            }
            else if(!this.strPaytmTransactionNum){
             swal.fire('Error!','Enter Paytm Transaction Number ', 'error');
             this.blnDebitCard=false
              event.source._checked = false
            }
            else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmTransactionNum)) {
             this.blnDebitCard=false
             event.source._checked = false
             swal.fire('Error!','Paytm Transaction Number  allow only alpha numerics ', 'error');
             // -----------------------------------------------
           }
            else if(!this.strPaytmReferenceNum){
             swal.fire('Error!','Enter Paytm Reference Number ', 'error');
             this.blnDebitCard=false
              event.source._checked = false
            }
           //  else if (!/^[a-zA-Z0-9]*$/g.test(this.strPaytmReferenceNum)) {
           //   this.blnDebitCard=false
           //    event.source._checked = false
           //   swal.fire('Error!','Reference Number allow only alpha numerics ', 'error');
           //   // -----------------------------------------------
           // }
       }
       if(this.blnPaytmMall)
       {
            if(!this.intPaytmMallMobileNumber){
             swal.fire('Error!','Enter Mobile Number', 'error');
             this.blnDebitCard=false
              event.source._checked = false
            }
            else if(!this.intPaytmMallAmount || this.intPaytmMallAmount<0 ){
             swal.fire('Error!','Enter Valid Amount', 'error');
             this.blnDebitCard=false
              event.source._checked = false
            }
            else if(!this.strPaytmMallTransactionNum){
             swal.fire('Error!','Enter Paytm Mall Transaction Number ', 'error');
             this.blnDebitCard=false
              event.source._checked = false
            }
            else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmMallTransactionNum)) {
             this.blnDebitCard=false
             event.source._checked = false
             swal.fire('Error!','Paytm Mall Transaction Number  allow only alpha numerics ', 'error');
             // -----------------------------------------------
           }
            else if(!this.strPaytmMallReferenceNum){
             swal.fire('Error!','Enter Paytm Mall Reference Number ', 'error');
             this.blnDebitCard=false
              event.source._checked = false
            }
       }
       if(this.blnBharathQr)
       {
            if(!this.intBharathQrMobileNumber){
             swal.fire('Error!','Enter Mobile Number', 'error');
             this.blnDebitCard=false
              event.source._checked = false
            }
            else if(!this.intBharathQrAmount || this.intBharathQrAmount<0 ){
             swal.fire('Error!','Enter Valid Amount', 'error');
             this.blnDebitCard=false
              event.source._checked = false
            }
            else if(!this.strBharathQrTransactionNum){
             swal.fire('Error!','Enter Bharath QR Transaction Number ', 'error');
             this.blnDebitCard=false
              event.source._checked = false
            }
            else if (!/^[a-zA-Z0-9]+$/g.test(this.strBharathQrTransactionNum)) {
             this.blnDebitCard=false
             event.source._checked = false
             swal.fire('Error!','Bharath QR Transaction Number  allow only alpha numerics ', 'error');
             // -----------------------------------------------
           }
            else if(!this.strBharathQrReferenceNum){
             swal.fire('Error!','Enter Bharath QR Reference Number ', 'error');
             this.blnDebitCard=false
              event.source._checked = false
            }
       }

   }

   this.calculateBalance()

 }
}
 receiptChanged(event){
   // console.log('receiptn',event);

   if(!this.blnReceipt){
     // this.intDebitAmt=0
     this.strReceiptNumber=''
     swal.fire({
       title: 'Alert!',
       text: "Advance amount available!",
       type: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'OK!'
     }).then((result) => {
       if (!result.value) {
         
       
         
         this.blnReceipt = true;
        //  if(this.blnFinance){
        //    this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
        //  }
        //  else if(this.blnReceipt){
        //    this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
        //  }
        //  else if(this.blnFinance && this.blnReceipt){
        //    this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
        //  }
        //  else{
        //    this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
        //  }
        if(this.intApprove==4){
          if(this.blnFinance){
            this.intBalanceAmt=(this.dblPartialAmount-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
          }
          else if(this.blnReceipt){
            this.intBalanceAmt=this.dblPartialAmount-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
          }
          else if(this.blnFinance && this.blnReceipt){
            this.intBalanceAmt=(this.dblPartialAmount-this.intFinanceAmt-this.intReceiptTot)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
          }
          else{
            this.intBalanceAmt=this.dblPartialAmount-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
          }
        } else{
          if(this.blnFinance){
            this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
          }
          else if(this.blnReceipt){
            this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
          }
          else if(this.blnFinance && this.blnReceipt){
            this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
          }
          else{
            this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
          }
        }
       }
       else{
         
         this.intReceiptTot=0;
         this.total_receipt=0;

         this.lstReceipt.map(items=>{
           items.receipt=false;

         })

         if(this.intApprove==4){
          if(this.blnFinance){
            this.intBalanceAmt=(this.dblPartialAmount-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
          }
          else if(this.blnReceipt){
            this.intBalanceAmt=this.dblPartialAmount-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
          }
          else if(this.blnFinance && this.blnReceipt){
            this.intBalanceAmt=(this.dblPartialAmount-this.intFinanceAmt-this.intReceiptTot)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
          }
          else{
            this.intBalanceAmt=this.dblPartialAmount-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
          }
        }else{
          if(this.blnFinance){
            this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
          }
          else if(this.blnReceipt){
            this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
          }
          else if(this.blnFinance && this.blnReceipt){
            this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
          }
          else{
            this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
          }
        }
       }
     })

   }
   else{
    //  if(this.blnFinance){
    //    this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
    //  }
    //  else if(this.blnReceipt){
    //    this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
    //  }
    //  else if(this.blnFinance && this.blnReceipt){
    //    this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
    //  }
    //  else{
    //    this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
    //  }
    if(this.intApprove==4){
      if(this.blnFinance){
        this.intBalanceAmt=(this.dblPartialAmount-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
      }
      else if(this.blnReceipt){
        this.intBalanceAmt=this.dblPartialAmount-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
      }
      else if(this.blnFinance && this.blnReceipt){
        this.intBalanceAmt=(this.dblPartialAmount-this.intFinanceAmt-this.intReceiptTot)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
      }
      else{
        this.intBalanceAmt=this.dblPartialAmount-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
      }
    }else{
      if(this.blnFinance){
        this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
      }
      else if(this.blnReceipt){
        this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
      }
      else if(this.blnFinance && this.blnReceipt){
        this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
      }
      else{
        this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
      }
    }
       // if(this.blnCreditCard){
       //   if(!this.strCreditCardNo){
       //     swal.fire('Error!','Enter Credit Card No ', 'error');
       //     this.blnReceipt=false
       //     event.source._checked = false

       //   }
       //   else if(!this.intCreditBankId){
       //     swal.fire('Error!','Enter Bank Name Of Credit Card ', 'error');
       //     this.blnReceipt=false
       //     event.source._checked = false
       //   }
       //   else if(!this.intCreditAmt){
       //     swal.fire('Error!','Enter Credit Amount ', 'error');
       //     this.blnReceipt=false
       //     event.source._checked = false
       //   }
       //   else if(!this.strCreditRefNo){
       //     swal.fire('Error!','Enter Reference No Of Credit Card', 'error');
       //     this.blnReceipt=false
       //     event.source._checked = false
       //   }
       // }
       // if(this.blnCash){
       //   // if(!this.intReceivedAmt){
       //   //   swal.fire('Error!','Enter Received Amt ', 'error');
       //   //   this.blnReceipt=false
       //   //   event.source._checked = false

       //   // }
       //      swal.fire('Error!','Enter Received Amt ', 'error');
       //      this.blnReceipt=false;
       //     event.source._checked = false;
       // }
       // if(this.blnDebitCard){
       //   if(!this.strDebitCardNo){
       //     swal.fire('Error!','Enter Debit Card No ', 'error');
       //     this.blnReceipt=false
       //     event.source._checked = false

       //   }
       //   else if(!this.intDebitBankId){
       //     swal.fire('Error!','Enter Bank Name Of Debit Card ', 'error');
       //     this.blnReceipt=false
       //     event.source._checked = false


       //   }
       //   else if(!this.intDebitAmt){
       //     swal.fire('Error!','Enter Debit Amount ', 'error');
       //     this.blnReceipt=false
       //     event.source._checked = false
       //   }
       //   else if(!this.strDebitRefNo){
       //     swal.fire('Error!','Enter Reference No Of Debit Card', 'error');
       //     this.blnReceipt=false
       //     event.source._checked = false
       //   }
       // }

   }




 }
 paytmChanged(event)
 {

   event.source._checkError=false;

   if(this.blnPaytm){
   event.source.checked=true;
   }
   else{
     event.source.checked=false;

   }


   if(!this.blnPaytm){
     this.intPaytmMobileNumber=null;
     this.intPaytmAmount=0;
     this.strPaytmTransactionNum = '';
     this.strPaytmReferenceNum = '';

   }
   else{
       if(this.blnCreditCard){
     
         for(let i=0;i<this.lstCredit.length;i++){

           if(!this.lstCredit[i]['strCardNo']){
             swal.fire('Error!','Enter Credit Card '+(i+1)+' No', 'error');
             event.source._checkError=true
             break;
 
           }
           else if(this.lstCredit[i]['strCardNo'].toString().length < 4 || this.lstCredit[i]['strCardNo'].toString().length >4 ){
             swal.fire('Error!','Enter 4 Digits for Credit Card '+(i+1),'error');
             event.source._checkError=true
             break;
 
            }
           else if(!this.lstCredit[i]['intBankId']){
             swal.fire('Error!','Enter Bank Name Of Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(!this.lstCredit[i]['dblAmt'] || this.lstCredit[i]['dblAmt']<0){
             swal.fire('Error!','Enter Valid Credit Amount for Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
 
           else if(!this.lstCredit[i]['strScheme']){
             swal.fire('Error!','Select EMI option for Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(this.lstCredit[i]['strScheme'] != this.lstCredit[i]['strSelectedCreditEmi'] ){
             swal.fire('Error!','Select Valid EMI option for Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(!this.lstCredit[i]['strRefNo']){
             swal.fire('Error!','Enter Valid Reference No Of Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
         }

         if(event.source._checkError){
           this.blnPaytm=false;
           event.source.checked=false;

         }
       }
       if(this.blnCash){
         if(!this.intReceivedAmt){
           swal.fire('Error!','Enter Valid Amount ', 'error');
           this.blnPaytm=false
           event.source._checked = false

         }
       }
       if(this.blnDebitCard)
       {
          
         for(let i=0;i<this.lstDebit.length;i++){
           if(!this.lstDebit[i]['strCardNo']){
             swal.fire('Error!','Enter Debit Card '+(i+1)+' No ', 'error');
             event.source._checkError=true
             break;
 
           }
           else if(this.lstDebit[i]['strCardNo'].toString().length < 4 || this.lstDebit[i]['strCardNo'].toString().length >4 ){
             swal.fire('Error!','Enter 4 Digits  for Debit Card '+(i+1),'error');
             event.source._checkError = true;
             break;
 
            }
           // else if(this.strDebitCardNo.length<4){
           //   swal.fire('Error!','Enter Mininum 4 Digits ', 'error');
           //   event.source._checkError=true
           // }
           else if(!this.lstDebit[i]['intBankId']){
             swal.fire('Error!','Enter Bank Name Of Debit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
           }
           else if(!this.lstDebit[i]['dblAmt'] || this.lstDebit[i]['dblAmt'] <0){
             swal.fire('Error!','Enter Valid Debit Amount for Debit Card'+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(!this.lstDebit[i]['strEmi']){
             swal.fire('Error!','Select Emi Option for Debit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(this.lstDebit[i]['strEmi'] != this.lstDebit[i]['strSelectedEmi']){            
             swal.fire('Error!','Select Valid Emi Option for Debit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           
           else if(!this.lstDebit[i]['strRefNo']){
             swal.fire('Error!','Enter Valid Reference No Of Debit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
         }
         if(event.source._checkError){
           this.blnPaytm=false;
           event.source.checked=false;

         }
       }

       if(this.blnPaytmMall)
       {
            if(!this.intPaytmMallMobileNumber){
             swal.fire('Error!','Enter Mobile Number', 'error');
             this.blnPaytm=false
              event.source._checked = false
            }
            else if(!this.intPaytmMallAmount || this.intPaytmMallAmount<0 ){
             swal.fire('Error!','Enter Valid Amount', 'error');
             this.blnPaytm=false
              event.source._checked = false
            }
            else if(!this.strPaytmMallTransactionNum){
             swal.fire('Error!','Enter Paytm Mall Transaction Number ', 'error');
             this.blnPaytm=false
              event.source._checked = false
            }
            else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmMallTransactionNum)) {
             this.blnPaytm=false
             event.source._checked = false
             swal.fire('Error!','Paytm Mall Transaction Number  allow only alpha numerics ', 'error');
             // -----------------------------------------------
           }
            else if(!this.strPaytmMallReferenceNum){
             swal.fire('Error!','Enter Paytm Mall Reference Number ', 'error');
             this.blnPaytm=false
              event.source._checked = false
            }
       }
       if(this.blnBharathQr)
        {
             if(!this.intBharathQrMobileNumber){
              swal.fire('Error!','Enter Mobile Number', 'error');
              this.blnPaytm=false
               event.source._checked = false
             }
             else if(!this.intBharathQrAmount || this.intBharathQrAmount<0 ){
              swal.fire('Error!','Enter Valid Amount', 'error');
              this.blnPaytm=false
               event.source._checked = false
             }
             else if(!this.strBharathQrTransactionNum){
              swal.fire('Error!','Enter Paytm Mall Transaction Number ', 'error');
              this.blnPaytm=false
               event.source._checked = false
             }
             else if (!/^[a-zA-Z0-9]+$/g.test(this.strBharathQrTransactionNum)) {
              this.blnPaytm=false
              event.source._checked = false
              swal.fire('Error!','Paytm Mall Transaction Number  allow only alpha numerics ', 'error');
              // -----------------------------------------------
            }
             else if(!this.strBharathQrReferenceNum){
              swal.fire('Error!','Enter Paytm Mall Reference Number ', 'error');
              this.blnPaytm=false
               event.source._checked = false
             }
        }
       

   }

   this.calculateBalance()

 }

 paytmMallChanged(event)
 {


   event.source._checkError=false;

   if(this.blnPaytmMall){
   event.source.checked=true;
   }
   else{
     event.source.checked=false;

   }


   if(!this.blnPaytmMall){
     this.intPaytmMallMobileNumber=null;
     this.intPaytmMallAmount=0;
     this.strPaytmMallTransactionNum = '';
     this.strPaytmMallReferenceNum = '';

   }
   else{
       if(this.blnCreditCard){
      
         for(let i=0;i<this.lstCredit.length;i++){

           if(!this.lstCredit[i]['strCardNo']){
             swal.fire('Error!','Enter Credit Card '+(i+1)+' No', 'error');
             event.source._checkError=true
             break;
 
           }
           else if(this.lstCredit[i]['strCardNo'].toString().length < 4 || this.lstCredit[i]['strCardNo'].toString().length >4 ){
             swal.fire('Error!','Enter 4 Digits for Credit Card '+(i+1),'error');
             event.source._checkError=true
             break;
 
            }
           else if(!this.lstCredit[i]['intBankId']){
             swal.fire('Error!','Enter Bank Name Of Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(!this.lstCredit[i]['dblAmt'] || this.lstCredit[i]['dblAmt']<0){
             swal.fire('Error!','Enter Valid Credit Amount for Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
 
           else if(!this.lstCredit[i]['strScheme']){
             swal.fire('Error!','Select EMI option for Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(this.lstCredit[i]['strScheme'] != this.lstCredit[i]['strSelectedCreditEmi'] ){
             swal.fire('Error!','Select Valid EMI option for Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(!this.lstCredit[i]['strRefNo']){
             swal.fire('Error!','Enter Valid Reference No Of Credit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
       }

       if(event.source._checkError){
         this.blnPaytmMall=false;
         event.source.checked=false;

       }

       }
       if(this.blnCash){
         if(!this.intReceivedAmt){
           swal.fire('Error!','Enter Valid Amount ', 'error');
           this.blnPaytmMall=false
           event.source._checked = false

         }
       }
       if(this.blnDebitCard)
       {
          
         for(let i=0;i<this.lstDebit.length;i++){
           if(!this.lstDebit[i]['strCardNo']){
             swal.fire('Error!','Enter Debit Card '+(i+1)+' No ', 'error');
             event.source._checkError=true
             break;
 
           }
           else if(this.lstDebit[i]['strCardNo'].toString().length < 4 || this.lstDebit[i]['strCardNo'].toString().length >4 ){
             swal.fire('Error!','Enter 4 Digits  for Debit Card '+(i+1),'error');
             event.source._checkError = true;
             break;
 
            }
           // else if(this.strDebitCardNo.length<4){
           //   swal.fire('Error!','Enter Mininum 4 Digits ', 'error');
           //   event.source._checkError=true
           // }
           else if(!this.lstDebit[i]['intBankId']){
             swal.fire('Error!','Enter Bank Name Of Debit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
           }
           else if(!this.lstDebit[i]['dblAmt'] || this.lstDebit[i]['dblAmt'] <0){
             swal.fire('Error!','Enter Valid Debit Amount for Debit Card'+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(!this.lstDebit[i]['strEmi']){
             swal.fire('Error!','Select Emi Option for Debit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           else if(this.lstDebit[i]['strEmi'] != this.lstDebit[i]['strSelectedEmi']){            
             swal.fire('Error!','Select Valid Emi Option for Debit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
           
           else if(!this.lstDebit[i]['strRefNo']){
             swal.fire('Error!','Enter Valid Reference No Of Debit Card '+(i+1), 'error');
             event.source._checkError=true
             break;
 
           }
         }

         if(event.source._checkError){
           this.blnPaytmMall=false;
           event.source.checked=false;

         }

       }
       if(this.blnPaytm)
       {
            if(!this.intPaytmMobileNumber){
             swal.fire('Error!','Enter Mobile Number', 'error');
             this.blnPaytmMall=false
              event.source._checked = false
            }
            else if(!this.intPaytmAmount  || this.intPaytmAmount<0){
             swal.fire('Error!','Enter Valid Amount', 'error');
             this.blnPaytmMall=false
              event.source._checked = false
            }
            else if(!this.strPaytmTransactionNum){
             swal.fire('Error!','Enter Paytm Transaction Number ', 'error');
             this.blnPaytmMall=false
              event.source._checked = false
            }
            else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmTransactionNum)) {
             this.blnPaytmMall=false
             event.source._checked = false
             swal.fire('Error!','Paytm Transaction Number  allow only alpha numerics ', 'error');
             // -----------------------------------------------
           }
            else if(!this.strPaytmReferenceNum){
             swal.fire('Error!','Enter Paytm Reference Number ', 'error');
             this.blnPaytmMall=false
              event.source._checked = false
            }
            else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmReferenceNum)) {
             this.blnPaytmMall=false
             event.source._checked = false
             swal.fire('Error!','Reference Number allow only alpha numerics ', 'error');
             // -----------------------------------------------
           }
       }

   }

   this.calculateBalance()

 }


 addDebit(){

  let dctDebit= {
      strCardNo:null,
      intBankId:null,
      dblAmt:null,
      strEmi:'',
      strRefNo:null,
      intCcCharge:null,
      strName:''
  }

  this.lstDebit.push(dctDebit);    

}

closeDebit(index){

  if(!this.lstDebit[index]['strCardNo'] && !this.lstDebit[index]['intBankId'] && !this.lstDebit[index]['dblAmt'] && !this.lstDebit[index]['strEmi'] && !this.lstDebit[index]['strRefNo'] && !this.lstDebit[index]['intCcCharge'] && !this.lstDebit[index]['strName']){      
    this.lstDebit.splice(index,1);
  }
  else{

      swal.fire({
        title: 'Are you sure?',
        text: "Are you sure want to delete ?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.lstDebit.splice(index,1);

          swal.fire(
            'Deleted!',
            "Data Deleted successfully",
            'success'
          )}}
      )

    }  
  
}
  


addCredit(){





  let dctCredit= {
    strCardNo:null,
    intBankId:null,
    dblAmt:null,
    strScheme:'',
    strRefNo:null,
    intCcCharge:null,
    strName:''
  }

  this.lstCredit.push(dctCredit);
}

closeCredit(index){

  if(!this.lstCredit[index]['strCardNo'] && !this.lstCredit[index]['intBankId'] && !this.lstCredit[index]['dblAmt'] && !this.lstCredit[index]['strScheme'] && !this.lstCredit[index]['strRefNo'] && !this.lstCredit[index]['intCcCharge'] && !this.lstCredit[index]['strName']){

  this.lstCredit.splice(index,1);
  }
  else{


    swal.fire({
      title: 'Are you sure?',
      text: "Are you sure want to delete ?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.lstCredit.splice(index,1);

        swal.fire(
          'Deleted!',
          "Data Deleted successfully",
          'success'
        )}}
    )

  }
  
}

calcReceiptAmt1(item,event){  

  // console.log("this.intBalanceAmt",item);
  
// 

if (item.receipt){

  if(this.intBalanceAmt==0){
    swal.fire('Already paid');
    item.receipt=false;
    event.checked=false;
    event.source.checked=false;
    this.intBalanceAmt=0;    
    return;
  }
}
  


  this.total_receipt = 0
  let receipt_total = 0
  this.intReceiptTot = 0
    this.lstReceipt.map(items=>{
      
      if (items.receipt){
      
        this.BalanceAmountCalc()

          if (this.intBalanceAmt !=0 ){
          // console.log("IF");         
          // console.log("IN IF this.intBalanceAmt",this.intBalanceAmt);
          
              if (this.intBalanceAmt<items.amount){
                // console.log("this.intBalanceAmt<items.amount",this.intBalanceAmt);
                
                items['added'] = this.intBalanceAmt
                
                // console.log("before receipt_total",receipt_total);

                receipt_total += items['added']
                // console.log("after receipt_total",receipt_total);

                
              }
              else{
                items['added'] = items.amount
                receipt_total += items['added']
              }

              // console.log("receipt_total in if",receipt_total);
              
          }else{
            // console.log("ELSE");          
            // console.log("IN ELSE this.intBalanceAmt",this.intBalanceAmt);
            
            this.BalanceAmountCalc()            
            if(this.intBalanceAmt==0){
              swal.fire('Already paid');
              item.receipt=false;
              event.checked=false;
              event.source.checked=false;
              this.intBalanceAmt=0;
              return;
            }

            if (this.intBalanceAmt<items.amount){
              items['added'] = this.intBalanceAmt
              // this.total_receipt += items['added']
              receipt_total += items['added']
              // console.log('3',receipt_total);
            }
            else{
              items['added'] = items.amount
              // this.total_receipt += items['added']
              receipt_total += items['added']
              // console.log('4',receipt_total);
            }
            // console.log("receipt_total in else",receipt_total);
// 
          }
        // }



      }else{
        items['added'] = 0
        // this.BalanceAmountCalc()

        // console.log("this.intReceiptTot#####",this.intReceiptTot);
        
      }
      // console.log('asd',items)
    })
      
    // console.log('receipt_total',receipt_total);
    
    // this.intBalanceAmt = 0 
    this.total_receipt = receipt_total
    this.BalanceAmountCalc()
    if(this.intBalanceAmt<0){
      this.intReceiptTot = this.total_receipt+this.intBalanceAmt
      this.intBalanceAmt=0;
    }
    else{
      this.intReceiptTot = this.total_receipt

    }


  

    // console.log("LAST this.intReceiptTot",this.intReceiptTot);
    // console.log("LAST this.intBalanceAmt",this.intBalanceAmt);
    
    
  }

BalanceAmountCalc(){
  
  // console.log("this.intReceivedAmt",this.intReceivedAmt);
  // console.log("this.intCreditAmt",this.intCreditAmt);
  // console.log("this.intDebitAmt",this.intDebitAmt);
  // console.log("BalanceAmountCalc this.total_receipt",this.total_receipt);
  // console.log("this.intPaytmAmount",this.intPaytmAmount);
  // console.log("this.intPaytmMallAmount",this.intPaytmMallAmount);
  this.intGrandTot= Number(this.intGrandTot).toFixed()
  // console.log(this.intGrandTot,"this.intGrandTot");
  this.intGrandTot= Number(this.intGrandTot).toFixed()
 
  if(this.intApprove==4){
    if(this.blnReceipt && !this.blnFinance ){  
      // console.log('sadd');
      
      this.intBalanceAmt = this.dblPartialAmount-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.total_receipt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)
    }
    else if(this.blnFinance && !this.blnReceipt){      
      this.intBalanceAmt=(this.dblPartialAmount-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
     
      // this.intBalanceAmt= this.intBalanceAmt+this.intExtraFinanceAmt
      
    }
    else if(this.blnReceipt && this.blnFinance){
      this.intBalanceAmt=(this.dblPartialAmount-this.intFinanceAmt-this.total_receipt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
    
      // this.intBalanceAmt= this.intBalanceAmt+this.intExtraFinanceAmt
    
    }
    else{      
        this.intBalanceAmt = this.dblPartialAmount-(this.intCreditAmt + this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
    }
  }
 else{
  if(this.blnReceipt && !this.blnFinance ){  
    // console.log('sadd');
    
    this.intBalanceAmt = this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.total_receipt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)
  }
  else if(this.blnFinance && !this.blnReceipt){      
    this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
   
    // this.intBalanceAmt= this.intBalanceAmt+this.intExtraFinanceAmt
    
  }
  else if(this.blnReceipt && this.blnFinance){
    this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.total_receipt)-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount)+this.intExtraFinanceAmt;
  
    // this.intBalanceAmt= this.intBalanceAmt+this.intExtraFinanceAmt
  
  }
  else{      
      this.intBalanceAmt = this.intGrandTot-(this.intCreditAmt + this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount+this.intBharathQrAmount);
  }
}
  // console.log("########BALANCE",this.intBalanceAmt);
  
}
bharathQrChanged(event)
  {
    console.log("kfjdfjslkjf");
    

    event.source._checkError=false;

    if(this.blnBharathQr){
    event.source.checked=true;
    }
    else{
      event.source.checked=false;

    }


    if(!this.blnBharathQr){
      this.intBharathQrMobileNumber=null;
      this.intBharathQrAmount=0;
      this.strBharathQrTransactionNum = '';
      this.strBharathQrReferenceNum = '';

    }
    else{
        if(this.blnCreditCard){
       
          for(let i=0;i<this.lstCredit.length;i++){

            if(!this.lstCredit[i]['strCardNo']){
              swal.fire('Error!','Enter Credit Card '+(i+1)+' No', 'error');
              event.source._checkError=true
              break;
  
            }
            else if(this.lstCredit[i]['strCardNo'].toString().length < 4 || this.lstCredit[i]['strCardNo'].toString().length >4 ){
              swal.fire('Error!','Enter 4 Digits for Credit Card '+(i+1),'error');
              event.source._checkError=true
              break;
  
             }
            else if(!this.lstCredit[i]['intBankId']){
              swal.fire('Error!','Enter Bank Name Of Credit Card '+(i+1), 'error');
              event.source._checkError=true
              break;
  
            }
            else if(!this.lstCredit[i]['dblAmt'] || this.lstCredit[i]['dblAmt']<0){
              swal.fire('Error!','Enter Valid Credit Amount for Credit Card '+(i+1), 'error');
              event.source._checkError=true
              break;
  
            }
  
            else if(!this.lstCredit[i]['strScheme']){
              swal.fire('Error!','Select EMI option for Credit Card '+(i+1), 'error');
              event.source._checkError=true
              break;
  
            }
            else if(this.lstCredit[i]['strScheme'] != this.lstCredit[i]['strSelectedCreditEmi'] ){
              swal.fire('Error!','Select Valid EMI option for Credit Card '+(i+1), 'error');
              event.source._checkError=true
              break;
  
            }
            else if(!this.lstCredit[i]['strRefNo']){
              swal.fire('Error!','Enter Valid Reference No Of Credit Card '+(i+1), 'error');
              event.source._checkError=true
              break;
  
            }
        }

        if(event.source._checkError){
          this.blnBharathQr=false;
          event.source.checked=false;

        }

        }
        if(this.blnCash){
          if(!this.intReceivedAmt){
            swal.fire('Error!','Enter Valid Amount ', 'error');
            this.blnBharathQr=false
            event.source._checked = false

          }
        }
        if(this.blnDebitCard)
        {
           
          for(let i=0;i<this.lstDebit.length;i++){
            if(!this.lstDebit[i]['strCardNo']){
              swal.fire('Error!','Enter Debit Card '+(i+1)+' No ', 'error');
              event.source._checkError=true
              break;
  
            }
            else if(this.lstDebit[i]['strCardNo'].toString().length < 4 || this.lstDebit[i]['strCardNo'].toString().length >4 ){
              swal.fire('Error!','Enter 4 Digits  for Debit Card '+(i+1),'error');
              event.source._checkError = true;
              break;
  
             }
            // else if(this.strDebitCardNo.length<4){
            //   swal.fire('Error!','Enter Mininum 4 Digits ', 'error');
            //   event.source._checkError=true
            // }
            else if(!this.lstDebit[i]['intBankId']){
              swal.fire('Error!','Enter Bank Name Of Debit Card '+(i+1), 'error');
              event.source._checkError=true
              break;
            }
            else if(!this.lstDebit[i]['dblAmt'] || this.lstDebit[i]['dblAmt'] <0){
              swal.fire('Error!','Enter Valid Debit Amount for Debit Card'+(i+1), 'error');
              event.source._checkError=true
              break;
  
            }
            else if(!this.lstDebit[i]['strEmi']){
              swal.fire('Error!','Select Emi Option for Debit Card '+(i+1), 'error');
              event.source._checkError=true
              break;
  
            }
            else if(this.lstDebit[i]['strEmi'] != this.lstDebit[i]['strSelectedEmi']){            
              swal.fire('Error!','Select Valid Emi Option for Debit Card '+(i+1), 'error');
              event.source._checkError=true
              break;
  
            }
            
            else if(!this.lstDebit[i]['strRefNo']){
              swal.fire('Error!','Enter Valid Reference No Of Debit Card '+(i+1), 'error');
              event.source._checkError=true
              break;
  
            }
          }

          if(event.source._checkError){
            this.blnBharathQr=false;
            event.source.checked=false;

          }

        }
        if(this.blnPaytm)
        {
             if(!this.intPaytmMobileNumber){
              swal.fire('Error!','Enter Mobile Number', 'error');
              this.blnBharathQr=false
               event.source._checked = false
             }
             else if(!this.intPaytmAmount  || this.intPaytmAmount<0){
              swal.fire('Error!','Enter Valid Amount', 'error');
              this.blnBharathQr=false
               event.source._checked = false
             }
             else if(!this.strPaytmTransactionNum){
              swal.fire('Error!','Enter Paytm Transaction Number ', 'error');
              this.blnBharathQr=false
               event.source._checked = false
             }
             else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmTransactionNum)) {
              this.blnBharathQr=false
              event.source._checked = false
              swal.fire('Error!','Paytm Transaction Number  allow only alpha numerics ', 'error');
              // -----------------------------------------------
            }
             else if(!this.strPaytmReferenceNum){
              swal.fire('Error!','Enter Paytm Reference Number ', 'error');
              this.blnBharathQr=false
               event.source._checked = false
             }
             else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmReferenceNum)) {
              this.blnBharathQr=false
              event.source._checked = false
              swal.fire('Error!','Reference Number allow only alpha numerics ', 'error');
              // -----------------------------------------------
            }
        }

    }

    this.calculateBalance()

  }

creditSaleChanged(){
  this.blnCreditSale != this.blnCreditSale;  
}
creditSaleRequest(){
  if(this.intBalanceAmt == 0){
    this.toastr.error('No balance amount', 'Error!');
    return;
  }
  if(this.intBalanceAmt<0 && this.blnMakePayment){
    this.toastr.error('Amount Exceeded', 'Error!');
    return;
  }
  if(this.intBalanceAmt<0 && this.blnMakePayment){
    this.toastr.error('Amount Exceeded', 'Error!');
    return;
  }
  if(this.dblPartialAmount<=0 || this.dblPartialAmount<this.intAdvncPaid){
    this.toastr.error('Partial amount should be greater than advance amount', 'Error!');
    return
  }
  
  let strAlert = "Are you sure want to continue ?"
  swal.fire({  //Confirmation before save
    title: 'Save',
    text: strAlert ,
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: 'Cancel',
    confirmButtonText: "Yes, Save it!",
  }).then(result => {
    if (result.value) {
        const form_data = new FormData;
        form_data.append('partial_id',this.salesRowId)
        form_data.append('lstItems',JSON.stringify(this.lstItemDetails))
        form_data.append('dblTotalAmount',this.intGrandTot)
        form_data.append('strRemarks',this.strRemarks)
        form_data.append('dblPartialAmount',String(this.dblPartialAmount));
        form_data.append('dblBalanceAmount',String(this.intBalanceAmt));
        form_data.append('dbl_advc_paid',String( this.intAdvncPaid));
        form_data.append('bln_service',String(true));
        
        
        this.serviceObject.postData('invoice/credit_settlement/',form_data).subscribe(res => {
          if (res.status == 1)
          {
            swal.fire({
              position: "center",
              type: "success",
              text: "Request Submitted Successfully",
              showConfirmButton: true,
            });
            this.intApprove=res['int_approve'];
            this.router.navigate(['invoice/saleslist']);
          }
          else if (res.status == 0) {
            swal.fire('Error!',res['message'], 'error');
          }
      },
      (error) => {
        swal.fire('Error!','Server Error!!', 'error');
      });
    };   
  });
}
creditsaleapprove(intApproveReject){
  let dctData = {  };
  let str_message = '';
if (intApproveReject == 0){
  dctData['rejectId'] = this.salesRowId;
  str_message = 'Rejected';
}
if (intApproveReject == 1){
  dctData['approveId'] = this.salesRowId;
  str_message = "Request Approved Successfully";
}
  this.serviceObject.postData('invoice/credit_settlement/',dctData).subscribe(res => {
    if (res.status == 1)
    {
      swal.fire({
        position: "center",
        type: "success",
        text: str_message,
        showConfirmButton: true,
      });
      this.router.navigate(['invoice/creditapprovallist']);
    }
    else if (res.status == 0) {
      swal.fire('Error!',res['message'], 'error');
    }
},
(error) => {
  swal.fire('Error!','Server Error!!', 'error');
});

}
 makeApprove(){
    if(!this.blnCreditSale){
      swal.fire({  //Confirmation before save
        title: 'Approve',
        text: "Amount is greater than 200000 Approve to invoice it?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: 'Cancel',
        confirmButtonText: "Yes, Approve it!",
      }).then(result => {
        if (result.value) {
          // const form_data = new FormData;
          // form_data.append('partial_id',this.salesRowId)
          this.serviceObject.patchData('invoice/add_invoice/',{'approveId':this.salesRowId}).subscribe(res => {
            if (res.status == 1)
            {
  
              swal.fire({
                position: "center",
                type: "success",
                text: "Request Approved Successfully",
                showConfirmButton: true,
              });
              this.blnApproved=res['bln_approve'];
              // this.intApprove=res['int_approve'];
              this.router.navigate(['invoice/saleslist']);
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
      })

    }
    else{
      swal.fire({  //Confirmation before save
        title: 'Approve',
        text: "Credit sale requested and amount is greater than 200000, Approve to invoice it, Reject to invoice but reject credit sale ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: 'Reject',
        confirmButtonText: "Yes, Approve it!",
      }).then(result => {
        if (result.value) {
          // const form_data = new FormData;
          // form_data.append('partial_id',this.salesRowId)
          this.serviceObject.patchData('invoice/add_invoice/',{'approveId':this.salesRowId,'intCreditSale':2}).subscribe(res => {
            if (res.status == 1)
            {
  
              swal.fire({
                position: "center",
                type: "success",
                text: "Request Approved Successfully",
                showConfirmButton: true,
              });
              this.blnApproved=res['bln_approve'];
              // this.intApprove=res['int_approve'];
              this.router.navigate(['invoice/saleslist']);
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
        else{
          console.log('reject')

          this.serviceObject.patchData('invoice/add_invoice/',{'approveId':this.salesRowId,'intCreditSale':3}).subscribe(res => {
            if (res.status == 1)
            {
  
              swal.fire({
                position: "center",
                type: "success",
                text: "Credit sale rejected and invoice approved",
                showConfirmButton: true,
              });
              this.blnApproved=res['bln_approve'];
              // this.intApprove=res['int_approve'];
              this.router.navigate(['invoice/saleslist']);
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
      })
      


    }

   
  }
  makeRequest(){
    
    if(!this.blnCreditSale){
      swal.fire({  //Confirmation before save
        title: 'Request',
        text: "Amount is greater than 200000 So Request Admin to invoice it?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: 'Cancel',
        confirmButtonText: "Yes, Request it!",
      }).then(result => {
        if (result.value) {
          const form_data = new FormData;
          form_data.append('partial_id',this.salesRowId)
          form_data.append('lstItems',JSON.stringify(this.lstItemDetails))
          form_data.append('dblTotalAmount',this.intGrandTot)
          form_data.append('strRemarks',this.strRemarks)       
          this.serviceObject.patchData('invoice/add_invoice/',form_data).subscribe(res => {
            if (res.status == 1)
            {
  
              swal.fire({
                position: "center",
                type: "success",
                text: "Request Submitted Successfully",
                showConfirmButton: true,
              });
              this.intApprove=res['int_approve'];
              this.router.navigate(['invoice/saleslist']);
              // this.router.navigate(['invoice/listinvoice']);
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
      })

    }
    else{
      swal.fire({  //Confirmation before save
        title: 'Request',
        text: "Credit Sale requested and amount is greater than 200000 ,so Request Admin to invoice it?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: 'Cancel',
        confirmButtonText: "Yes, Request it!",
      }).then(result => {
        if (result.value) {
          const form_data = new FormData;
          form_data.append('partial_id',this.salesRowId)
          form_data.append('lstItems',JSON.stringify(this.lstItemDetails))
          form_data.append('dblTotalAmount',this.intGrandTot)
          form_data.append('strRemarks',this.strRemarks)  
          
          ///
          form_data.append('dblPartialAmount',String(this.dblPartialAmount));
          form_data.append('dblBalanceAmount',String(this.intBalanceAmt));
          form_data.append('blnCreditSale','true');

            this.serviceObject.patchData('invoice/add_invoice/',form_data).subscribe(res => {
            if (res.status == 1)
            {
  
              swal.fire({
                position: "center",
                type: "success",
                text: "Request Submitted Successfully",
                showConfirmButton: true,
              });
              this.intApprove=res['int_approve'];
              this.router.navigate(['invoice/saleslist']);
              // this.router.navigate(['invoice/listinvoice']);
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
      })

    }

  
  }

}
