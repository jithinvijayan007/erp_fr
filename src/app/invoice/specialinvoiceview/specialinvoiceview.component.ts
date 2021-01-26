
import {debounceTime} from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, Input, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import * as tableData from './invoice-table';
import swal from 'sweetalert2';
import { ServerService } from 'src/app/server.service';
// import { element } from '@angular/core/src/render3';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-specialinvoiceview',
  templateUrl: './specialinvoiceview.component.html',
  styleUrls: ['./specialinvoiceview.component.css']
})
export class SpecialinvoiceviewComponent implements OnInit {

  blnIGST=false;

  tempCustId;
  tempstrName;
  tempintContactNo
  tempstrEmail
  tempselectedCity;
  tempstrCity;
  tempintCityId;
  tempselectedState;
  tempstrState;
  tempintStateId;
  tempintStateIdPrevious;
  tempstrGSTNo;
  tempstrAddress;

  timeLeft: number = 60;
  interval;
  bln_timer = false;

  str_otp = ""
  str_OTP_entered = ""

  int_cust_edit: Number // 1.edit 2.can't edit 3.cofirmation 4.enter otp 0.add
  int_editcount: Number // count of save done

  intSalesCustId: Number
  // blnPayment = false
  strGroupName = localStorage.getItem("group_name");
  blnApproved = false
  strStaff;
  lstGroup = ["BRANCH MANAGER", "ASSISTANT BRANCH MANAGER", , "ASM2", "ASM3", "ASM4"]
  saveButtonStatus = true;

  previousUrl = localStorage.getItem("previousUrl");

  source: LocalDataSource;
  source2: LocalDataSource;

  blnReciptCall = true

  keyEve1;
  newTime1;
  setStart1;

  keyEve2;
  newTime2;
  setStart2;

  lstAdditions = [];
  lstDeductions = [];

  lstAdditions1 = [];
  lstDeductions1 = [];

  additions = 0;
  deductions = 0;
  errCreditNo = false;
  tempGrandTot = 0;
  tempReceiptTot = 0;

  blnExchangeInvoice = false;
  blnCustomerAfterAdd = false;
  blnCheckExchange = false



  dctAdditions = {};
  dctDeductions = {};
  blnVerifyInvoice = false;
  blnExchange = false;
  strInvoiceCode = 'I';
  strBranchCode = localStorage.getItem('BranchCode');

  out_of_stock = false;
  blnCustomerAdd = false;

  intExchangeSalesAmount = 0;
  blnReturn = false;
  intEnquiryType = 0;
  blnStart = false;
  blnStatus = false;
  @Input() OnlyNumber: boolean;
  @Input() date1: Date;
  // Menu items itemlist = [{name:'Delivery',status:false },{name:'Coupon code',status:false },{name:'Loyalty',status:false }]
  closeResult: string;

  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }


  @ViewChild('itemId', { static: true }) itemId: ElementRef;
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


  settings = tableData.settings;

  lstDebit = [
    {
      strCardNo: null,
      intBankId: null,
      dblAmt: null,
      strEmi: '',
      strRefNo: null,
      intCcCharge: null,
      strName: ''

    }
  ];


  lstCredit = [
    {
      strCardNo: null,
      intBankId: null,
      dblAmt: null,
      strScheme: '',
      strRefNo: null,
      intCcCharge: null,
      strName: ''
    }
  ];

  receiptTot = 0;
  tempBalance;

  nodeHost = '';

  intApprove = 0

  // settings2 = tableData.settings2;
  salesRowId = localStorage.getItem('specialSalesId');
  branchName = localStorage.getItem('BranchName');
  exchangeSalesId = localStorage.getItem('exchangeSalesId');
  intContactNo = null
  strName
  strEmail;
  intTotPoints;
  intTotPointsCopy;
  intTotAmt = 0
  intRedeemAmt = 0
  intRedeemPoint = 0
  intOTP;
  intAmtPerPoints = 0
  intTotRedeemAmt
  strInitRemarks = ""
  strRemark: '';
  dctData = {}
  dctCount;
  intGrandTot;
  intTotNoRounding;
  fltDecimalsInTot
  intRounding=0;
  intTotal = 0
  intTax = 0
  intTotCGST = 0
  intTotSGST = 0
  intTotIGST = 0
  intReturnAmt = 0
  intKfcTot = 0;

  dctExchangeImage = {}
  intDiscount = 0
  intExchange = 0
  blnCheckIGST = false;
  lstItemName = []
  IntItemNameId = 0;
  strItemName;
  lstFilterData = []
  selectedItemName;
  searchItemName: FormControl = new FormControl();
  searchEmi: FormControl = new FormControl();
  searchCreditEmi: FormControl = new FormControl();
  objectKeys;
  intCustId: null
  editField: string;
  lstItemDetails: Array<any> = []
  lstItemDetailsCopy: Array<any> = []
  lstItemAmount: Array<any> = []
  blnShowData = 2;
  intCreditCc;
  intDebitCc;

  intCreditSale = false;
  int_Credit_Sale;

  lstBankNames = []

  time = new Date();


  newItem = {
    intItemId: null,
    strItemName: '',
    imeiStatus: false,
    vchr_product_name: null,
    dblMarginAmount: null,
    dblMopAmount: 0,
    GST: 0,
    strImei: '',
    dblRate: null,
    dblBuyBack: null,
    dblDiscount: null,
    dblCGST: 0,
    dblSGST: 0,
    dblIGST: 0,
    dblAmount: 0,
    intQuantity: 1,
    intStatus: 1,
    strItemCode: null,
    blnService: null,
    offerId: null,
    dblCGSTPer: 0,
    dblIGSTPer: 0,
    dblSGSTPer: 0,
    int_type: 0
  }

 

  strRemarks = '';
  intBuyBack = 0
  strGSTNo
  strAddress: ''

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
  currentCity = ''
  // customer variables

  searchCustomer: FormControl = new FormControl();
  lstCustomer = []
  intCustomerId;
  strCustomer;
  strSelectedCustomer;
  currentCustomer = '';

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
  strState: '';
  selectedState;
  strStateCode = '';
  currentState = '';
  // searchCustState: FormControl = new FormControl();
  // lstCustState = []
  intCustStateId;
  strCustState;
  selectedCustState;

  strCouponCode;
  intCouponDisc;
  blnApplied = false;
  intCouponId;
  blnAvailStock = true
  strCustName;
  intCustContactNo;
  strCustGST;
  strCustAddress;
  strCustPlace = '';
  blnCustomer;
  blnFilterItem = false;
  dct_item = {}
  index = 0

  currentProduct = '';
  currentBrand = '';
  currentItem = '';
  currentItemCategory = '';
  currentItemGroup = '';

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


  blnCash = false; //

  blnFinance = false;
  blnCreditCard = false;
  blnDebitCard = false;
  blnPaytm = false;
  blnGooglepay = false;
  blnReceipt = false;
  blnReceiptDisable = false;

  blnPaytmMall = false;
  blnBharathQr = false;
  strFinanceName = '';
  strFinanceScheme;
  intFinanceAmt;
  intEMI;
  intDownPayment;
  intDeliveryNo;
  intCashAmt;
  intReceivedAmt = null;
  intBalanceAmt = 0;
  intBalanceAmtCopy = 0;
  strDebitCardNo;
  intDebitBankId;
  strDebitBankName = '';
  intDebitAmt = 0;
  strDebitRefNo;
  strEmi = '';
  lstEmiOptions = [];
  strSelectedEmi = '';
  intEmiDebitId;

  strCreditCardNo;
  intCreditBankId;
  strCreditBankName = '';
  intCreditAmt = 0;
  strCreditRefNo;
  strEmiCredit = '';
  lstEmiCreditOptions = [];
  intEmiCreditId;
  strSelectedCreditEmi = '';
  clickRowId;
  lstClickOrder = []
  intFixedAmt;
  strReceiptNumber;
  // lstReceipt= [{'receipt_num':'rst123','amount':1452},{'receipt_num':'rst485','amount':1000}];
  lstReceipt = [];
  intReceiptTot = 0;
  blnMatching = false;

  intPaytmMobileNumber: number = null;
  intPaytmAmount: number = null;
  strPaytmTransactionNum = '';
  strPaytmReferenceNum = '';

  intPaytmMallMobileNumber: number = null;
  intPaytmMallAmount: number = null;
  strPaytmMallTransactionNum = '';
  strPaytmMallReferenceNum = '';

  intBharathQrMobileNumber: number = null;
  intBharathQrAmount: number = null;
  strBharathQrTransactionNum = '';
  strBharathQrReferenceNum = '';



  // Sales Return
  strReturnImei = '';
  strInvoiceNo: '';
  datReturnFrom = null;
  datReturnTo = null;
  selectedReturnCustomer;
  lstReturnCustomer = [];
  selectedReturnCustomerPhno = '';
  strReturnCustomerName = ''
  selectedReturnCustomerId = '';
  lstReturnItems = [];
  lstReturnQty = [];
  showModalReturn;
  dctReturnId = {}

  blnReturnData = false;
  dctReturn = {}
  strReturnType = '1';
  lstcheckReturn = []
  intdblReceiptAmount;


  lst_imei = []
  intIndirectDis = 0
  lstIndirectDis = []
  intTotIndirectDis = 0
  discoundIndex = 0
  currentIndex = 0
  // lstReturnDetail = []
  dctReturnDetail = {}
  returnId;

  printDisable = true;
  saveDisable = false;
  dctLen;
  dctCombo = {};
  lstCombo = [];
  offerItem;
  disPerBoolean = false;
  disAmtBoolean = false;
  lstIndex = 0;
  blnShow1 = false;
  blnShow2 = false;
  blnShow3 = false;
  blnShow4 = false;
  comboShow = [];
  linkId = 0;
  linkShow = [];
  lstOfferItems = [];
  blnCombo = false;
  itemIndex;
  offerItemId;
  offerApplied = [];
  offerDis = [];
  newItemUppercase = ''
  newItemCode = ''
  // blnAvail=false


  rejectDisable = false;

  // Combo offer style
  lstStyle = ['flip-card-front', 'flip-card-front2', 'flip-card-front3', 'flip-card-front4'];
  intStyleIndex;
  image1
  image2
  image3
  vchr_image;
  hostaddress;
  url;
  dctImages = {}

  intFinanceId = null
  blnIndirectDiscount;

  intExtraFinanceAmt = 0
  lstFinanceDetails = []
  intMarginMoney = 0
  intProcessingFee = 0
  intDBDCharge = 0
  intServiceCharge = 0

  blnMakePayment = true;
  blnAmazonOrFlipkart = false;
  blnCustomerType = false;
  intCreditBalance = 0
  public imagePath1;
  imgURL1: any;
  public imagePath2;
  imgURL2: any;
  public imagePath3;
  imgURL3: any;

  @ViewChild('file1') file1: any;
  form: FormGroup;
  // credit sale customer type 4
  intCustomerType;
  blnCreditSale = false;
  dblPartialAmount = 0;
  dblBalanceAmount = 0;

  constructor(    
    private spinner: NgxSpinnerService,
    private serviceObject: ServerService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public router: Router,


    ) { 
      this.source2 = new LocalDataSource(tableData.data); // create the source

    }

  ngOnInit() {

    this.printDisable = true; //disable print button
    this.saveDisable = false; //enable save button

    if (this.lstGroup.includes(this.strGroupName)) {
      this.saveButtonStatus = false;
    }

    this.searchItemName.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstItemName = [];
      } else {
        if (strData.length >= 1) {
          let dctdata = {}
          dctdata['term'] = strData
          dctdata['blnIGST'] = this.blnCheckIGST
          this.serviceObject
            .postData('itemcategory/item_typeahead_api/', dctdata)
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
        if (strData.length >= 4) {
          this.serviceObject
            .postData('states/location_typeahead/', { term: strData })
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
            .postData('states/states_typeahead/', { term: strData })
            .subscribe(
              (response) => {
                this.lstState = response['list_states'];
              }
            );
        }
      }
    }
    );

    this.searchCustomerNo.valueChanges.pipe(
    debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstCustomerNumber = [];
      } else {
        if (strData.length >= 7) {
          const dctData = {}
          dctData['term'] = strData;
          dctData['blnCustAdd'] = true;
          this.serviceObject
            .postData('customer/add_customer_pos/', dctData)
            .subscribe(
              (response) => {
                this.lstCustomerNumber = response['data'];

              }
            );
        }
      }
    }
    );


    this.getData();
    this.getBankNames();

  }
  getData(){
    this.dctData['billingdetails'] = []
    this.dctData['billingdetailsCopy'] = []
    this.dctData['intId'] = this.salesRowId
    this.dctData['bln_approve'] = this.blnApproved
    this.dctData['int_approve'] = this.intApprove
   
    this.serviceObject.postData('special_sales/view_list/', this.dctData).subscribe(res => {

      if (res.status == 1) {
        this.lstItemDetails = res['data']['lstItems'];
console.log("######this.lstItemDetails",this.lstItemDetails);

        this.tempCustId=res['data']['intCustId'];
        this.tempstrName = res['data']['strCustName'].toUpperCase();
        this.tempintContactNo = res['data']['intContactNo'];
        this.tempstrEmail = res['data']['strCustEmail'];
        this.tempselectedCity = res['data']['strLocation'];
        this.tempstrCity = res['data']['strLocation'];
        this.tempintCityId = res['data']['intLocation'];
        this.tempselectedState = res['data']['strState'];
        this.tempstrState = res['data']['strState'];
        this.tempintStateId = res['data']['intState'];
        this.tempintStateIdPrevious = res['data']['intState'];
        this.tempstrGSTNo = res['data']['strGSTNo'];
        this.tempstrAddress = res['data']['txtAddress'];

        this.intCustId = res['data']['intCustId'];
        this.intContactNo = res['data']['intContactNo'];
        this.strEmail = res['data']['strCustEmail'];
        this.strStaff = res['data']['strStaffName'];
        this.strName = res['data']['strCustName'].toUpperCase();
        this.strInitRemarks = res['data']['txtRemarks'];

        this.blnIGST=res['data']['blnIGST'];
        this.intKfcTot=res['data']['dbl_kfc_amount'];

        this.selectedCity = res['data']['strLocation'];
        this.strCity = res['data']['strLocation'];
        this.intCityId = res['data']['intLocation'];
        this.selectedState = res['data']['strState'];
        this.strState = res['data']['strState'];
        this.intStateId = res['data']['intState'];
        this.intStateIdPrevious = res['data']['intState'];
        this.strGSTNo = res['data']['strGSTNo'];
        this.strAddress = res['data']['txtAddress'];
        this.strPincode = res['data']['intPinCode'];
        this.int_editcount = res['data']['edit_count'];
        this.intSalesCustId= res['data']['intSalesCustId'];

        if (this.int_editcount == 0) {
          this.int_cust_edit = 1;
        }
        else {
          this.int_cust_edit = 2;
        }


        this.calcRate();
        // Onload Spinner
        this.showSpinner();
      }
      else if (res.status == 0) {
        swal.fire('Error!', res['message'], 'error');
        this.lstItemDetails = []
        // this.preItemList=[];
      }
      else {
        this.lstItemDetails = []

      }
    },
      (error) => {
        swal.fire('Error!', 'Server Error!!', 'error');
      });


  }

  getBankNames() {
    this.lstBankNames = []
    this.serviceObject.getData('invoice/bank_typeahead/').subscribe(res => {

      this.lstBankNames = res['data'];
    });
  }

  calcRate(){

    this.intTotal=0;
    this.intTotCGST=0
    this.intTotSGST=0;
    this.intTotIGST=0;
    this.intGrandTot=0;
    
    
    this.lstItemDetails.forEach(element=>{

      let taxVal=1+(element.GST/100); //calculate division value
      
      element.dblRate= (element.dblMopAmount/taxVal);

      if(this.blnIGST){
        element.dblIGST=(element.dblRate*element.dblIGSTPer)/100;
        this.intTotIGST+=element.dblIGST;

      }
      else if (!this.strGSTNo) {
        taxVal=1+((element.GST+1)/100);
        element.dblRate= (element.dblMopAmount/taxVal);
        // console.log("##element.dblRate",element.dblRate);
        
        element.dblCGST = (element.dblCGSTPer * element.dblRate) / 100         // in exchange the difference of amount is taken 
        element.dblSGST = (element.dblSGSTPer * element.dblRate) / 100
        this.intTotCGST+=element.dblCGST;
        this.intTotSGST+=element.dblSGST;
        this.calcKfc()
  
      }
      else{
        element.dblCGST=(element.dblRate*element.dblCGSTPer)/100;
        element.dblSGST=(element.dblRate*element.dblSGSTPer)/100;
        
        this.intTotCGST+=element.dblCGST;
        this.intTotSGST+=element.dblSGST;
      }

      this.intTotal+=element.dblRate;

      element.dblRate=Number(element.dblRate.toFixed(2));

    });

    if(this.blnIGST){
      this.intGrandTot=this.intTotal+this.intTotIGST+this.intKfcTot;
    }
    else{
      this.intGrandTot=this.intTotal+this.intTotCGST+this.intTotSGST+this.intKfcTot;
    }
      this.intGrandTot= Math.round(this.intGrandTot);
      this.intBalanceAmt = this.intGrandTot;

  }

  calcAmt(item){
    // console.log("##item",item);
   
    // console.log("item.dblRate",item.dblRate);
    let tax=0;
    tax=(item.dblRate*item.GST)/100;
    // console.log("tax",tax);
    
    item.dblMopAmount=0;
    item.dblMopAmount=parseFloat(item.dblRate)+(tax);

    if (!this.strGSTNo) { 
      item.intKfc=parseFloat(item.dblRate)/100;
      item.dblMopAmount+=item.intKfc;
      // console.log("####item.intKfc",item.intKfc);
      
    }
    // item.dblRate=parseFloat(item.dblRate).toFixed(2);

    // item.dblMopAmount=Math.round(item.dblMopAmount);//Round to nearest value
    item.dblMopAmount=Number((item.dblMopAmount).toFixed(2));//Round to nearest value

    // console.log("item.dblMopAmount",item.dblMopAmount);

    
    
  }

  calcRoundAmt(item){
    // this.calcAmt(item);
    // item.dblMopAmount=parseFloat(item.dblMopAmount).toFixed(2);
    item.dblRate=Number(parseFloat(item.dblRate).toFixed(2));
    // console.log("@calcRoundAmt",item.dblRate);
    
    this.calcTotal();
  }

  calcTotal(){
    this.intTotal=0;
    this.intTotCGST=0
    this.intTotSGST=0;
    this.intTotIGST=0;
    this.intGrandTot=0;
    
    this.lstItemDetails.forEach(element=>{ //calc total values from edited rate 
      if(this.blnIGST){
        element.dblIGST=(element.dblRate*element.dblIGSTPer)/100;
        this.intTotIGST+=element.dblIGST;

      }
      else if (!this.strGSTNo) {        
        element.dblCGST = (element.dblCGSTPer * element.dblRate) / 100         // in exchange the difference of amount is taken 
        element.dblSGST = (element.dblSGSTPer * element.dblRate) / 100
        this.intTotCGST+=element.dblCGST;
        this.intTotSGST+=element.dblSGST;
        this.calcKfc()
  
      }
      else{
        element.dblCGST=(element.dblRate*element.dblCGSTPer)/100;
        element.dblSGST=(element.dblRate*element.dblSGSTPer)/100;
        
        this.intTotCGST+=element.dblCGST;
        this.intTotSGST+=element.dblSGST;
      }
      // console.log("######element.dblRate",element.dblRate);
      
      this.intTotal+=parseFloat(element.dblRate);
    });
    // console.log(this.intTotal,"this.intTotal");
    
    if(this.blnIGST){
      this.intGrandTot=this.intTotal+this.intTotIGST+this.intKfcTot;
    }
    else{
      this.intGrandTot=this.intTotal+this.intTotCGST+this.intTotSGST+this.intKfcTot;
    }
      this.intGrandTot= Math.round(this.intGrandTot);

      this.intBalanceAmt = this.intGrandTot;


  }

  openmakepayment(makepayment) {



    let dctReceiptData = {}
    // this.blnCash = false;
    // this.blnCreditCard = false;
    // this.blnDebitCard = false;
    // this.blnFinance = false;
    // dctReceiptData['intCustomerId']=this.intCustId;


    if (this.intContactNo == null || this.intContactNo == '' || !this.intContactNo) {
      this.toastr.error('customer mobile number is required');
      return false;
    }
    dctReceiptData['intCustomerMob'] = this.intContactNo;
    dctReceiptData['intTotalAmount'] = this.intGrandTot;
    dctReceiptData['intCustType']=this.intCustomerType;

    // console.log("befr", this.lstReceipt);

    if (this.blnReciptCall) {

      this.serviceObject.postData('invoice/receipt_list/', dctReceiptData).subscribe(res => {

        if (res.status == 1) {
          this.blnReciptCall = false
          this.blnReceipt = res['bln_receipt'];
          this.blnReceiptDisable = res['bln_receipt'];



          if (this.blnReceipt) {
            // console.log("in recipt");

            this.lstReceipt = res['lst_receipt'];

          }

          // this.intReceiptTot = res['receipt_tot'];
          this.blnMatching = res['bln_matching'];
          if (this.intApprove == 4) {
            if (this.blnReceipt && !this.blnFinance) {
              this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intReceiptTot + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount)
            }
            else if (this.blnFinance && !this.blnReceipt) {
              this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
            }
            else if (this.blnReceipt && this.blnFinance) {
              this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt - this.intReceiptTot) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
            }
            else {
              this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
            }
          } else {
            if (this.blnReceipt && !this.blnFinance) {
              this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intReceiptTot + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount)
            }
            else if (this.blnFinance && !this.blnReceipt) {
              this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
            }
            else if (this.blnReceipt && this.blnFinance) {
              this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt - this.intReceiptTot) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
            }
            else {
              this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
            }
          }

          // Onload Spinner
          this.showSpinner()

        }
        else if (res.status == 0) {
          swal.fire('Error!', 'Something went wrong!!', 'error');
          this.lstItemDetails = []
          // this.preItemList=[];
        }
      },
        (error) => {
          swal.fire('Error!', 'Server Error!!', 'error');
        });
    }
    //  console.log("aftr", this.lstReceipt);
    this.intBalanceAmtCopy=JSON.parse(JSON.stringify(this.intBalanceAmt))
    this.showModalPayment = this.modalService.open(makepayment, { size: 'lg', backdrop: 'static', keyboard: false })
    // console.log(this.intBalanceAmt,'balanceamnt');

  }

  opencustomeredit(customeredit, confirmpage, otppage, bln) {
    if (this.int_cust_edit == 1 || this.int_cust_edit == 2) {
      this.showModalCustEdit = this.modalService.open(customeredit, { size: 'lg' });
    }
    else if (this.int_cust_edit == 3) {
      this.showModalConfirmation = this.modalService.open(confirmpage, { size: 'sm', windowClass: 'otpclass' });
    }
    else if (this.int_cust_edit == 4) {
      this.showModalOtp = this.modalService.open(otppage, { size: 'sm', windowClass: 'otpclass' });
      this.startTimer()
    }
    if (bln) {
      this.blnCustomerAdd = true;
    }
    else if (!bln) {
      this.blnCustomerAdd = false;
      // this.blnCustomerAfterAdd = false;
    }


  }

  saveCustEdit() {

    let checkError = false
    if (!this.blnExchangeInvoice) {


      if (this.strName == '' || this.strName == null || this.strName == undefined) {

        this.toastr.error('Customer Name is required', 'Error!');
        checkError = true
        return false;

      }
    }



    if (this.intContactNo == null || !this.intContactNo) {
      this.toastr.error('Customer Contact Number is required', 'Error!');
      checkError = true
      return false;
    }
    if (this.blnExchangeInvoice) {
      if (this.intContactNo && this.strName == '') {
        this.toastr.error('Customer name is required', 'Error!');
        checkError = true
        return false;
      }
    }
    //  else if(this.selectedCity){
    //    console.log("this.selectedCity",this.selectedCity)
    //    console.log("this.strCity",this.strCity)
    //     if (this.selectedCity != this.strCity)
    //     {
    //      this.toastr.error('Valid City Name is required', 'Error!');
    //      checkError=true
    //      this.intCityId = null
    //      this.strCity = ''
    //      this.selectedCity=''
    //      return false;
    //    }
    // }
    else if (this.selectedCity != this.strCity || !this.selectedCity) {
      this.toastr.error('Valid City Name is required', 'Error!');
      this.intCityId = null
      this.strCity = ''
      this.selectedCity = ''
      return false;
    }
    else if (this.selectedState != this.strState || !this.selectedState) {
      this.toastr.error('Valid State Name is required', 'Error!');
      this.intStateId = null
      this.strState = ''
      this.selectedState = ''
      return false;
    }

    else if (this.strGSTNo && (this.strGSTNo).toString().length!=15) {
      this.toastr.error('Enter Valid GST No.', 'Error!');
    //  checkError1=false;
      return false
    }
    else if (this.strGSTNo && !(/^[0-9]{2}/).test(this.strGSTNo)) {
      this.toastr.error('First two digits of GST No. should be number', 'Error!');
    //  checkError1=false;
      return false
    }

    // else 



    if (this.strEmail) {
      let errorPlace;
      const eatpos = this.strEmail.indexOf('@');
      const edotpos = this.strEmail.lastIndexOf('.');
      if (eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.strEmail.length) {
        // validationSuccess = false ;
        errorPlace = 'Email format is not correct ';
        checkError = true
        // this.strEmail=null;
        // this.emailId.first.nativeElement.focus();
        this.toastr.error(errorPlace, 'Error!');
        return;
      }
    }

    if (!checkError) {
      let dctCustomerData = {}



      dctCustomerData['strName'] = this.strName
      dctCustomerData['strEmail'] = this.strEmail
      dctCustomerData['strAddress'] = this.strAddress
      dctCustomerData['strCity'] = this.strCity
      dctCustomerData['strState'] = this.strState
      dctCustomerData['intCityId'] = this.intCityId
      dctCustomerData['intStateId'] = this.intStateId
      dctCustomerData['strGSTNo'] = this.strGSTNo




      //  add customer start

      if (this.blnExchangeInvoice && this.blnCustomerAdd) {

        let checkError1 = false

        if (this.strName == '') {
          this.toastr.error('Customer name is required', 'Error!');
          checkError1 = true
          return false;
        }
        if (this.intContactNo == null || this.intContactNo == '') {

          this.toastr.error('Valid customer number is required', 'Error!');
          checkError1 = true
          return false;
        }


        else if (this.intContactNo.toString().length < 10) {
          this.toastr.error('Customer number length atleast 10', 'Error!');
          checkError1 = true
          return false;
        }
        else if (this.intContactNo.toString().length > 12) {
          this.toastr.error('Customer number length maximum 12', 'Error!');
          checkError1 = true
          return false;
        }

        if (this.strCity == '') {
          this.toastr.error('Valid City Name is required', 'Error!');
          checkError1 = true
          this.intCityId = null
          this.strCity = ''
          this.selectedCity = ''
          return false;
        }
        if (this.strCity == '') {
          this.toastr.error('Valid City Name is required', 'Error!');
          checkError1 = true
          this.intCityId = null
          this.strCity = ''
          this.selectedCity = ''
          return false;
        }
        if (this.selectedCity != this.strCity) {
          this.toastr.error('Valid City Name is required', 'Error!');
          checkError1 = true
          this.intCityId = null
          this.strCity = ''
          this.selectedCity = ''
          return false;
        }
        // }
        if (this.strState == '') {
          this.toastr.error('Valid State Name is required', 'Error!');
          checkError1 = true
          this.intStateId = null
          this.strState = ''
          this.selectedState = ''
          return false;
        }
        if (this.selectedState != this.strState) {
          this.toastr.error('Valid State Name is required', 'Error!');
          checkError1 = true
          this.intStateId = null
          this.strState = ''
          this.selectedState = ''
          return false;
        }
        //  }

        if (this.strEmail) {
          let errorPlace;
          const eatpos = this.strEmail.indexOf('@');
          const edotpos = this.strEmail.lastIndexOf('.');
          if (eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.strEmail.length) {
            // validationSuccess = false ;
            errorPlace = 'Email format is not correct ';
            checkError1 = true
            // this.strEmail=null;
            // this.emailId.first.nativeElement.focus();
            this.toastr.error(errorPlace, 'Error!');
            return;
          }
        }

        if (this.strGSTNo && (this.strGSTNo).toString().length!=15) {
          this.toastr.error('Enter Valid GST No.', 'Error!');
         checkError1=true;
          return false
        }
        if (this.strGSTNo && !(/^[0-9]{2}/).test(this.strGSTNo)) {
          this.toastr.error('First two digits of GST No. should be number', 'Error!');
         checkError1=true;
          return false
        }
        
        if (!checkError1) {

          dctCustomerData['intMob'] = this.intContactNo;
          dctCustomerData['strStateCode'] = this.strStateCode;
          dctCustomerData['strPinCode'] = this.strPincode;



          this.serviceObject.putData('customer/add_customer_pos/', dctCustomerData).subscribe(res => {
            if (res.status == 1) {


              swal.fire({
                position: "center",
                type: "success",
                text: "Data saved successfully",
                showConfirmButton: true,
              });
              // this.blnCheckIGST = res['data']['blnIGST']
              this.blnIGST = res['data']['blnIGST']

              this.showModalCustEdit.close();

              this.dctData['custEditData']['strEmail'] = res['data']['strCustEmail']
              this.dctData['custEditData']['strAddress'] = res['data']['txtAddress']
              this.dctData['custEditData']['strState'] = res['data']['strState']
              this.dctData['custEditData']['intStateId'] = res['data']['intStateId']
              this.dctData['custEditData']['intCityId'] = res['data']['intCityId']
              this.dctData['custEditData']['strCity'] = res['data']['strLocation']
              this.dctData['custEditData']['strGSTNo'] = res['data']['strGSTNo']
              this.dctData['custEditData']['intCustId'] = res['data']['intCustId']
              this.dctData['custEditData']['strName'] = res['data']['strCustName']
              this.dctData['custEditData']['intContactNo'] = res['data']['intContactNo']
              this.intSalesCustId = res['data']['intSalesCustId']
              this.intCustId = res['data']['intCustId']
              this.intCityId = res['data']['intCityId']
              this.intStateId = res['data']['intStateId']
              this.intContactNo = res['data']['intContactNo'];
              this.selecetedCustNumber = res['data']['intContactNo'];

              this.blnCustomerAdd = false;

              this.blnCustomerAfterAdd = false;





              this.calcRate();

            }
            else if (res.status == 0) {

              swal.fire('Error!', res['reason'], 'error');
            }
          },
            (error) => {
              swal.fire('Error!', 'Server Error!!', 'error');

            });

        }


      }


      //  add customer end

      //  customer edit start 

      else {
        // console.log("edit");

        //  console.log("strCity",this.strCity)
        //  console.log("strState",this.strState)      
        dctCustomerData['intCustId'] = this.intCustId
        // partialInvoice Id 
        dctCustomerData['intPartialId'] = this.salesRowId
        // dctCustomerData['intMob'] = this.intContactNo;
        // console.log(this.blnStatus)
        // console.log(strGroupName)
        if (this.blnStatus && this.strGroupName != 'ADMIN') {

          this.toastr.error('Receipt Available for this Customer So Please Contact Admin ', 'Error!');
          return false;
        }
        else {
          let strText = "Are you sure want to continue"
          if (this.blnStatus && this.strGroupName == 'ADMIN') {
            strText = "Receipt Available for this Customer Are you sure want to continue"
          }

          swal.fire({
            title: 'Are you sure?',
            text: strText,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: 'No',
            confirmButtonText: "Yes",

            //     inputValidator: (text) => {
            //       this.strRemarks = text;
            //   return !text && 'You need to write something!'
            //  },
          }).then(result => {
            if (result.value) {


              this.serviceObject.postData('customer/edit_customer/', dctCustomerData).subscribe(res => {
                if (res.status == 1) {
                

                  swal.fire({
                    position: "center",
                    type: "success",
                    text: "Data saved successfully",
                    showConfirmButton: true,
                  });
                  // this.blnCheckIGST = res['data']['blnIGST'];
                  this.blnIGST = res['data']['blnIGST']

                  this.showModalCustEdit.close();

                  this.dctData['custEditData']['strEmail'] = res['data']['strCustEmail'];
                  this.dctData['custEditData']['strAddress'] = res['data']['txtAddress'];
                  this.dctData['custEditData']['strState'] = res['data']['strState'];
                  this.dctData['custEditData']['intStateId'] = res['data']['intStateId'];
                  this.dctData['custEditData']['intCityId'] = res['data']['intLocation'];
                  this.dctData['custEditData']['strCity'] = res['data']['strLocation'];
                  this.dctData['custEditData']['strGSTNo'] = res['data']['strGSTNo'];
                  this.dctData['custEditData']['intCustId'] = res['data']['intCustId'];
                  this.dctData['custEditData']['strName'] = res['data']['strCustName'];
                  this.dctData['custEditData']['intContactNo'] = res['data']['intContactNo'];
                  this.intSalesCustId = res['data']['intSalesCustId'];
                  //  this.strCity=
                  //  this.selectedCity=
                  //  this.intCityId=this.dctData['custEditData']['intCityId']
                  //  this.strState=this.dctData['custEditData']['strState']
                  //  this.selectedState=this.dctData['custEditData']['strState']
                  //  this.intStateId= this.dctData['custEditData']['intStateId']
                  if (!this.blnExchangeInvoice) {
                    this.int_editcount = Number(this.int_editcount) + 1
                    this.int_cust_edit = 2
                  }
                  this.blnCustomerAfterAdd = false;



                  // -----------------------------------------------------------------------------------------------------------------
                  //  Only if state is changed
                  if (this.intStateId != this.intStateIdPrevious) {
                    this.intStateIdPrevious = this.intStateId


                    this.lstItemDetails.forEach(element => {
                      element.dblBuyBack = 0
                      element.dblDiscount = 0
                      if (this.blnCheckIGST) {
                        element.dblAmount = Number((element.dblRate + element.dblIGST).toFixed(2))
                      }
                      else {
                        element.dblAmount = Number((element.dblRate + element.dblCGST + element.dblSGST).toFixed(2))
                      }
                    });
                  }

                  this.calcRate();

                }
                else if (res.status == 0) {

                  //update with previous values
                  this.intCustId=this.tempCustId;
                  this.strName=this.tempstrName;
                  this.intContactNo=this.tempintContactNo
                  this.strEmail=this.tempstrEmail
                  this.selectedCity=this.tempselectedCity;
                  this.strCity=this.tempstrCity;
                  this.intCityId=this.tempintCityId;
                  this.selectedState=this.tempselectedState;
                  this.strState=this.tempstrState;
                  this.intStateId=this.tempintStateId;
                  this.intStateIdPrevious=this.tempintStateIdPrevious;
                  this.strGSTNo=this.tempstrGSTNo;
                  this.strAddress=this.tempstrAddress;

                  swal.fire('Error!', 'Something went wrong!!', 'error');
                }
              },
                (error) => {
                  this.intCustId=this.tempCustId;
                  this.strName=this.tempstrName;
                  this.intContactNo=this.tempintContactNo
                  this.strEmail=this.tempstrEmail
                  this.selectedCity=this.tempselectedCity;
                  this.strCity=this.tempstrCity;
                  this.intCityId=this.tempintCityId;
                  this.selectedState=this.tempselectedState;
                  this.strState=this.tempstrState;
                  this.intStateId=this.tempintStateId;
                  this.intStateIdPrevious=this.tempintStateIdPrevious;
                  this.strGSTNo=this.tempstrGSTNo;
                  this.strAddress=this.tempstrAddress;

                  swal.fire('Error!', 'Server Error!!', 'error');

                });

            }
          })
        }
      }

    }

  }
  
  changeNameToUppercase() {
    // this.strGSTNo = this.strGSTNo.toUpperCase();
    this.strName = this.strName.toUpperCase();
  }

  customerNumberChanged(item) {
    // this.selecetedCustNumber = item.
    this.selecetedCustNumber = item.intContactNo;
    this.strName = item.strCustName;
    this.strEmail = item.strCustEmail;
    this.selectedCity = item.strLocation;
    this.strCity = item.strLocation;
    this.intCityId = item.intCityId;
    this.selectedState = item.strState;
    this.strState = item.strState;
    this.intStateId = item.intStateId;
    this.strAddress = item.txtAddress;
    this.strGSTNo = item.strGSTNo;
    this.intSalesCustId = item.intSalesCustId;
    this.intCustId = item.intCustId;
    this.blnCustomerAdd = false


  }

  cityChanged(item) {
    this.currentCity = item.vchr_name;
    this.intCityId = item.pk_bint_id;
    this.strCity = item.vchr_name;
    this.strPincode = item.vchr_pin_code;
    this.selectedCity = item.vchr_name;
  }

  stateChanged(item) {
    this.currentState = item.vchr_name;
    this.intStateId = item.pk_bint_id;
    this.strState = item.vchr_name;
    this.strStateCode = item.vchr_code;
    this.selectedState = item.vchr_name;
  }

  changeToUppercase() {
    this.strGSTNo = this.strGSTNo.toUpperCase();
    // this.strName = this.strName.toUpperCase();
  }

  ClickToInput(confirmpage, customeredit) {

    if (this.int_editcount < 2) {
      this.int_cust_edit = 3
      this.showModalCustEdit.close()
      this.showModalConfirmation = this.modalService.open(confirmpage, { size: 'sm', windowClass: 'otpclass' });
    }
    else if (this.strGroupName != 'ADMIN') {
      this.toastr.error('Only Admin have the privilege to Edit!');
    }

  }

  cancelCustEdit() {

    //update with previos values
    this.intCustId=this.tempCustId;
    this.strName=this.tempstrName;
    this.intContactNo=this.tempintContactNo
    this.strEmail=this.tempstrEmail
    this.selectedCity=this.tempselectedCity;
    this.strCity=this.tempstrCity;
    this.intCityId=this.tempintCityId;
    this.selectedState=this.tempselectedState;
    this.strState=this.tempstrState;
    this.intStateId=this.tempintStateId;
    this.intStateIdPrevious=this.tempintStateIdPrevious;
    this.strGSTNo=this.tempstrGSTNo;
    this.strAddress=this.tempstrAddress;

    this.showModalCustEdit.close();
  }

  startTimer() {

    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
      if (this.timeLeft == 0) {
        this.bln_timer = true
      }
    }, 1000)
  }

  SendOTP(otppage, customeredit) {
    this.serviceObject
      .postData('customer/generateotp/', { 'int_sales_cust_id': this.intSalesCustId })
      .subscribe(
        (response) => {
          if (response['status'] == 1) {
            this.str_otp = response['otp']
            this.int_cust_edit = 4
            this.showModalConfirmation.close()
            this.showModalOtp = this.modalService.open(otppage, { size: 'sm', windowClass: 'otpclass' });
            this.startTimer()
          }
          else {
            this.toastr.error('Failed to send OTP');
            this.int_cust_edit = 2
            this.showModalConfirmation.close()
            this.showModalCustEdit = this.modalService.open(customeredit, { size: 'lg' });
          }
        }
      );
  }

  ReSendOTP() {
    this.serviceObject
      .postData('customer/generateotp/', { 'int_sales_cust_id': this.intSalesCustId })
      .subscribe(
        (response) => {
          if (response['status'] == 1) {
            // this.str_otp = response['otp']
            this.str_OTP_entered = null
            this.bln_timer = false
            this.timeLeft = 60
            this.startTimer()
          }
          else {
            this.toastr.error('Failed to Resend OTP');
          }
        }
      );
  }

  VerifyOTP(customeredit) {

    this.serviceObject
      .postData('customer/varifyotp/', { 'int_sales_cust_id': this.intSalesCustId, 'str_otp': this.str_OTP_entered })
      .subscribe(
        (response) => {
          if (response['status'] == 1) {
            this.int_editcount = 2
            this.int_cust_edit = 1
            this.str_OTP_entered = ""
            this.showModalOtp.close()
            this.showModalCustEdit = this.modalService.open(customeredit, { size: 'lg' });
          }
          else {
            this.toastr.error('OTP Validation Failed');
          }
        }
      );

  }

  CancelOTPSend(customeredit) {

    this.int_cust_edit = 2
    this.showModalConfirmation.close()
    this.showModalCustEdit = this.modalService.open(customeredit, { size: 'lg' });
  }



  cashChanged(event) {


    event.source._checkError = false;

    if (this.blnCash) {
      event.source.checked = true;
    }
    else {
      event.source.checked = false;

    }

    if (!this.blnCash) {
      this.intReceivedAmt = null
    }
    else {
      if (this.blnCreditCard) {

        for (let i = 0; i < this.lstCredit.length; i++) {

          if (!this.lstCredit[i]['strCardNo']) {
            swal.fire('Error!', 'Enter Credit Card ' + (i + 1) + ' No', 'error');
            event.source._checkError = true
            break;

          }
          else if (this.lstCredit[i]['strCardNo'].toString().length < 4 || this.lstCredit[i]['strCardNo'].toString().length > 4) {
            swal.fire('Error!', 'Enter 4 Digits for Credit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
          else if (!this.lstCredit[i]['intBankId']) {
            swal.fire('Error!', 'Enter Bank Name Of Credit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
          else if (!this.lstCredit[i]['dblAmt'] || this.lstCredit[i]['dblAmt'] < 0) {
            swal.fire('Error!', 'Enter Valid Credit Amount for Credit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }

          else if (!this.lstCredit[i]['strScheme']) {
            swal.fire('Error!', 'Select EMI option for Credit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
          else if (this.lstCredit[i]['strScheme'] != this.lstCredit[i]['strSelectedCreditEmi']) {
            swal.fire('Error!', 'Select Valid EMI option for Credit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
          else if (!this.lstCredit[i]['strRefNo']) {
            swal.fire('Error!', 'Enter Valid Reference No Of Credit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
        }

        if (event.source._checkError) {
          this.blnCash = false;
          event.source.checked = false;

        }

      }
      if (this.blnDebitCard) {
        for (let i = 0; i < this.lstDebit.length; i++) {
          if (!this.lstDebit[i]['strCardNo']) {
            swal.fire('Error!', 'Enter Debit Card ' + (i + 1) + ' No ', 'error');
            event.source._checkError = true
            break;

          }
          else if (this.lstDebit[i]['strCardNo'].toString().length < 4 || this.lstDebit[i]['strCardNo'].toString().length > 4) {
            swal.fire('Error!', 'Enter 4 Digits  for Debit Card ' + (i + 1), 'error');
            event.source._checkError = true;
            break;

          }
          // else if(this.strDebitCardNo.length<4){
          //   swal.fire('Error!','Enter Mininum 4 Digits ', 'error');
          //   event.source._checkError=true
          // }
          else if (!this.lstDebit[i]['intBankId']) {
            swal.fire('Error!', 'Enter Bank Name Of Debit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;
          }
          else if (!this.lstDebit[i]['dblAmt'] || this.lstDebit[i]['dblAmt'] < 0) {
            swal.fire('Error!', 'Enter Valid Debit Amount for Debit Card' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
          else if (!this.lstDebit[i]['strEmi']) {
            swal.fire('Error!', 'Select Emi Option for Debit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
          else if (this.lstDebit[i]['strEmi'] != this.lstDebit[i]['strSelectedEmi']) {
            swal.fire('Error!', 'Select Valid Emi Option for Debit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }

          else if (!this.lstDebit[i]['strRefNo']) {
            swal.fire('Error!', 'Enter Valid Reference No Of Debit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
        }
        if (event.source._checkError) {
          this.blnCash = false;
          event.source.checked = false;

        }
      }
      if (this.blnPaytm) {
        if (!this.intPaytmMobileNumber) {
          swal.fire('Error!', 'Enter Mobile Number', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!this.intPaytmAmount || this.intPaytmAmount < 0) {
          swal.fire('Error!', 'Enter Valid Amount', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!this.strPaytmTransactionNum) {
          swal.fire('Error!', 'Enter Paytm Transaction Number ', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmTransactionNum)) {
          this.blnCash = false
          event.source._checked = false
          swal.fire('Error!', 'Paytm Transaction Number  allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }
        else if (!this.strPaytmReferenceNum) {
          swal.fire('Error!', 'Enter Paytm Reference Number ', 'error');
          this.blnCash = false
          event.source._checked = false
        }
      }
      if (this.blnPaytmMall) {
        if (!this.intPaytmMallMobileNumber) {
          swal.fire('Error!', 'Enter Mobile Number', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!this.intPaytmMallAmount || this.intPaytmMallAmount < 0) {
          swal.fire('Error!', 'Enter Valid Amount', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!this.strPaytmMallTransactionNum) {
          swal.fire('Error!', 'Enter Paytm Mall Transaction Number ', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmMallTransactionNum)) {
          this.blnCash = false
          event.source._checked = false
          swal.fire('Error!', 'Paytm Mall Transaction Number  allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }
        else if (!this.strPaytmMallReferenceNum) {
          swal.fire('Error!', 'Enter Paytm Mall Reference Number ', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmMallReferenceNum)) {
          this.blnCash = false
          event.source._checked = false
          swal.fire('Error!', 'Reference Number allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }
      }
      if (this.blnBharathQr) {
        if (!this.intBharathQrMobileNumber) {
          swal.fire('Error!', 'Enter Mobile Number', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!this.intBharathQrAmount || this.intBharathQrAmount < 0) {
          swal.fire('Error!', 'Enter Valid Amount', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!this.strBharathQrTransactionNum) {
          swal.fire('Error!', 'Enter Bharath QR Transaction Number ', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!/^[a-zA-Z0-9]+$/g.test(this.strBharathQrTransactionNum)) {
          this.blnCash = false
          event.source._checked = false
          swal.fire('Error!', 'Bharath QR Transaction Number  allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }
        else if (!this.strBharathQrReferenceNum) {
          swal.fire('Error!', 'Enter Bharath QR Reference Number ', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!/^[0-9]+$/g.test(this.strBharathQrReferenceNum)) {
          this.blnCash = false
          event.source._checked = false
          swal.fire('Error!', 'Reference Number allow only numerics ', 'error');
          // -----------------------------------------------
        }
      }

    }

    this.calculateBalance()
  }


  debitCardChanged(event) {


    event.source._checkError = false;

    if (this.blnDebitCard) {
      event.source.checked = true;
    }
    else {
      this.intDebitAmt = 0;
      event.source.checked = false;

    }


    if (!this.blnDebitCard) {

      this.lstDebit = [];



      let dctDebit = {
        strCardNo: null,
        intBankId: null,
        dblAmt: null,
        strEmi: '',
        strRefNo: null,
        intCcCharge: null,
        strName: ''
      }

      this.lstDebit.push(dctDebit);

      // this.intDebitAmt=0
      // this.intDebitBankId=''
      // this.strDebitCardNo=''
      // this.strDebitRefNo=''
      // this.strEmi = '';
    }
    else {
      if (this.blnCreditCard) {

        for (let i = 0; i < this.lstCredit.length; i++) {


          if (!this.lstCredit[i]['strCardNo']) {
            swal.fire('Error!', 'Enter Credit Card ' + (i + 1) + ' No', 'error');
            event.source._checkError = true
            break;

          }
          else if (this.lstCredit[i]['strCardNo'].toString().length < 4 || this.lstCredit[i]['strCardNo'].toString().length > 4) {
            swal.fire('Error!', 'Enter 4 Digits for Credit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
          else if (!this.lstCredit[i]['intBankId']) {
            swal.fire('Error!', 'Enter Bank Name Of Credit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
          else if (!this.lstCredit[i]['dblAmt'] || this.lstCredit[i]['dblAmt'] < 0) {
            swal.fire('Error!', 'Enter Valid Credit Amount for Credit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }

          else if (!this.lstCredit[i]['strScheme']) {
            swal.fire('Error!', 'Select EMI option for Credit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
          else if (this.lstCredit[i]['strScheme'] != this.lstCredit[i]['strSelectedCreditEmi']) {
            swal.fire('Error!', 'Select Valid EMI option for Credit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
          else if (!this.lstCredit[i]['strRefNo']) {
            swal.fire('Error!', 'Enter Valid Reference No Of Credit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
        }

        if (event.source._checkError) {
          this.blnDebitCard = false;
          event.source.checked = false;

        }


        if (this.blnCash) {
          if (!this.intReceivedAmt) {
            swal.fire('Error!', 'Enter Valid Amount ', 'error');
            this.blnDebitCard = false
            event.source._checked = false

          }
        }
        if (this.blnPaytm) {
          if (!this.intPaytmMobileNumber) {
            swal.fire('Error!', 'Enter Mobile Number', 'error');
            this.blnDebitCard = false
            event.source._checked = false
          }
          else if (!this.intPaytmAmount || this.intPaytmAmount < 0) {
            swal.fire('Error!', 'Enter Valid Amount', 'error');
            this.blnDebitCard = false
            event.source._checked = false
          }
          else if (!this.strPaytmTransactionNum) {
            swal.fire('Error!', 'Enter Paytm Transaction Number ', 'error');
            this.blnDebitCard = false
            event.source._checked = false
          }
          else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmTransactionNum)) {
            this.blnDebitCard = false
            event.source._checked = false
            swal.fire('Error!', 'Paytm Transaction Number  allow only alpha numerics ', 'error');
            // -----------------------------------------------
          }
          else if (!this.strPaytmReferenceNum) {
            swal.fire('Error!', 'Enter Paytm Reference Number ', 'error');
            this.blnDebitCard = false
            event.source._checked = false
          }
          //  else if (!/^[a-zA-Z0-9]*$/g.test(this.strPaytmReferenceNum)) {
          //   this.blnDebitCard=false
          //    event.source._checked = false
          //   swal.fire('Error!','Reference Number allow only alpha numerics ', 'error');
          //   // -----------------------------------------------
          // }
        }
        if (this.blnPaytmMall) {
          if (!this.intPaytmMallMobileNumber) {
            swal.fire('Error!', 'Enter Mobile Number', 'error');
            this.blnDebitCard = false
            event.source._checked = false
          }
          else if (!this.intPaytmMallAmount || this.intPaytmMallAmount < 0) {
            swal.fire('Error!', 'Enter Valid Amount', 'error');
            this.blnDebitCard = false
            event.source._checked = false
          }
          else if (!this.strPaytmMallTransactionNum) {
            swal.fire('Error!', 'Enter Paytm Mall Transaction Number ', 'error');
            this.blnDebitCard = false
            event.source._checked = false
          }
          else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmMallTransactionNum)) {
            this.blnDebitCard = false
            event.source._checked = false
            swal.fire('Error!', 'Paytm Mall Transaction Number  allow only alpha numerics ', 'error');
            // -----------------------------------------------
          }
          else if (!this.strPaytmMallReferenceNum) {
            swal.fire('Error!', 'Enter Paytm Mall Reference Number ', 'error');
            this.blnDebitCard = false
            event.source._checked = false
          }
        }
        if (this.blnBharathQr) {
          if (!this.intBharathQrMobileNumber) {
            swal.fire('Error!', 'Enter Mobile Number', 'error');
            this.blnDebitCard = false
            event.source._checked = false
          }
          else if (!this.intBharathQrAmount || this.intBharathQrAmount < 0) {
            swal.fire('Error!', 'Enter Valid Amount', 'error');
            this.blnDebitCard = false
            event.source._checked = false
          }
          else if (!this.strBharathQrTransactionNum) {
            swal.fire('Error!', 'Enter Bharath QR Transaction Number ', 'error');
            this.blnDebitCard = false
            event.source._checked = false
          }
          else if (!/^[a-zA-Z0-9]+$/g.test(this.strBharathQrTransactionNum)) {
            this.blnDebitCard = false
            event.source._checked = false
            swal.fire('Error!', 'Bharath QR Transaction Number  allow only alpha numerics ', 'error');
            // -----------------------------------------------
          }
          else if (!this.strBharathQrReferenceNum) {
            swal.fire('Error!', 'Enter Bharath QR Reference Number ', 'error');
            this.blnDebitCard = false
            event.source._checked = false
          }
        }

      }

      this.calculateBalance()

    }
  }


  creditCardChanged(event) {

    event.source._checkError = false;

    if (this.blnCreditCard) {
      event.source.checked = true;
    }
    else {
      this.intCreditAmt = 0;
      event.source.checked = false;

    }

    if (!this.blnCreditCard) {

      this.lstCredit = [];

      let dctCredit = {
        strCardNo: null,
        intBankId: null,
        dblAmt: null,
        strScheme: '',
        strRefNo: null,
        intCcCharge: null,
        strName: ''
      }

      this.lstCredit.push(dctCredit);

      // this.intCreditAmt=0
      // this.intCreditBankId=''
      // this.strCreditCardNo=''
      // this.strCreditRefNo=''
      // this.strEmiCredit = '';
    }
    else {
      if (this.blnDebitCard) {

        for (let i = 0; i < this.lstDebit.length; i++) {
          if (!this.lstDebit[i]['strCardNo']) {
            swal.fire('Error!', 'Enter Debit Card ' + (i + 1) + ' No ', 'error');
            event.source._checkError = true
            break;

          }
          else if (this.lstDebit[i]['strCardNo'].toString().length < 4 || this.lstDebit[i]['strCardNo'].toString().length > 4) {
            swal.fire('Error!', 'Enter 4 Digits  for Debit Card ' + (i + 1), 'error');
            event.source._checkError = true;
            break;

          }
          // else if(this.strDebitCardNo.length<4){
          //   swal.fire('Error!','Enter Mininum 4 Digits ', 'error');
          //   event.source._checkError=true
          // }
          else if (!this.lstDebit[i]['intBankId']) {
            swal.fire('Error!', 'Enter Bank Name Of Debit Card ' + (i + 1), 'error');
            event.source._checkError = true
            // return false
            break;
          }

          else if (!this.lstDebit[i]['dblAmt'] || this.lstDebit[i]['dblAmt'] < 0) {
            swal.fire('Error!', 'Enter Valid Debit Amount for Debit Card' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
          else if (!this.lstDebit[i]['strEmi']) {
            swal.fire('Error!', 'Select Emi Option for Debit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
          else if (this.lstDebit[i]['strEmi'] != this.lstDebit[i]['strSelectedEmi']) {
            swal.fire('Error!', 'Select Valid Emi Option for Debit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }

          else if (!this.lstDebit[i]['strRefNo']) {
            swal.fire('Error!', 'Enter Valid Reference No Of Debit Card ' + (i + 1), 'error');
            event.source._checkError = true
            break;

          }
        }

        if (event.source._checkError) {
          this.blnCreditCard = false;
          event.source.checked = false;
        }


        if (this.blnCash) {
          if (!this.intReceivedAmt) {
            swal.fire('Error!', 'Enter Valid Amount ', 'error');
            this.blnCreditCard = false
            event.source._checked = false


          }
        }
        if (this.blnPaytm) {
          if (!this.intPaytmMobileNumber) {
            swal.fire('Error!', 'Enter Mobile Number', 'error');
            this.blnCreditCard = false
            event.source._checked = false
          }
          else if (!this.intPaytmAmount || this.intPaytmAmount < 0) {
            swal.fire('Error!', 'Enter Valid Amount ', 'error');
            this.blnCreditCard = false
            event.source._checked = false
          }
          else if (!this.strPaytmTransactionNum) {
            swal.fire('Error!', 'Enter Paytm Transaction Number ', 'error');
            this.blnCreditCard = false
            event.source._checked = false
          }
          else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmTransactionNum)) {
            this.blnCreditCard = false
            event.source._checked = false
            swal.fire('Error!', 'Paytm Transaction Number  allow only alpha numerics ', 'error');
            // -----------------------------------------------
          }
          else if (!this.strPaytmReferenceNum) {
            swal.fire('Error!', 'Enter Paytm Reference Number ', 'error');
            this.blnCreditCard = false
            event.source._checked = false
          }
          //  else if (!/^[a-zA-Z0-9]*$/g.test(this.strPaytmReferenceNum)) {
          //   this.blnCreditCard=false
          //   event.source._checked = false
          //   swal.fire('Error!','Reference Number allow only alpha numerics ', 'error');
          //   // -----------------------------------------------
          // }
        }
        if (this.blnPaytmMall) {
          if (!this.intPaytmMallMobileNumber) {
            swal.fire('Error!', 'Enter Mobile Number', 'error');
            this.blnCreditCard = false
            event.source._checked = false
          }
          else if (!this.intPaytmMallAmount || this.intPaytmMallAmount < 0) {
            swal.fire('Error!', 'Enter Valid Amount', 'error');
            this.blnCreditCard = false
            event.source._checked = false
          }
          else if (!this.strPaytmMallTransactionNum) {
            swal.fire('Error!', 'Enter Paytm Mall Transaction Number ', 'error');
            this.blnCreditCard = false
            event.source._checked = false
          }
          else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmMallTransactionNum)) {
            this.blnCreditCard = false
            event.source._checked = false
            swal.fire('Error!', 'Paytm Mall Transaction Number  allow only alpha numerics ', 'error');
            // -----------------------------------------------
          }
          else if (!this.strPaytmMallReferenceNum) {
            swal.fire('Error!', 'Enter Paytm Mall Reference Number ', 'error');
            this.blnCreditCard = false
            event.source._checked = false
          }
        }
        if (this.blnBharathQr) {
          if (!this.intBharathQrMobileNumber) {
            swal.fire('Error!', 'Enter Mobile Number', 'error');
            this.blnCreditCard = false
            event.source._checked = false
          }
          else if (!this.intBharathQrAmount || this.intBharathQrAmount < 0) {
            swal.fire('Error!', 'Enter Valid Amount', 'error');
            this.blnCreditCard = false
            event.source._checked = false
          }
          else if (!this.strBharathQrTransactionNum) {
            swal.fire('Error!', 'Enter Bharath QR Transaction Number ', 'error');
            this.blnCreditCard = false
            event.source._checked = false
          }
          else if (!/^[a-zA-Z0-9]+$/g.test(this.strBharathQrTransactionNum)) {
            this.blnCreditCard = false
            event.source._checked = false
            swal.fire('Error!', 'Bharath QR Transaction Number  allow only alpha numerics ', 'error');
            // -----------------------------------------------
          }
          else if (!this.strBharathQrReferenceNum) {
            swal.fire('Error!', 'Bharath QR Reference Number ', 'error');
            this.blnCreditCard = false
            event.source._checked = false
          }
        }

      }

      this.calculateBalance()
    }
  }

  calculateBalance() {

    if (this.blnCash) {
      if (this.intReceivedAmt < 0) {
        this.intReceivedAmt = (this.intReceivedAmt) * -1
      }
     
    }


  if (this.blnDebitCard) {
    this.intDebitAmt = 0;
    this.lstDebit.forEach(element => {              //change the  to get value if debit card payement
      // console.log(element,'element');
      this.intDebitAmt += element.dblAmt;


    });
  }
  if (this.blnCreditCard) {
    this.intCreditAmt = 0;
    this.lstCredit.forEach(element => {             //change the  to get value if credit card payement
      // console.log(element,'element');        
      this.intCreditAmt += element.dblAmt;


    });
  }
  // this.intGrandTot= this.intGrandTot.toFixed()


  // console.log(this.intCreditAmt,this.intReceivedAmt,this.intDebitAmt,this.intReceiptTot,this.intPaytmAmount,this.intPaytmMallAmount,this.intGrandTot,"ghfhf");
  if (this.intApprove == 4) {
    if (this.blnReceipt && !this.blnFinance) {
      this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intReceiptTot + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount)
    }
    else if (this.blnFinance && !this.blnReceipt) {
      this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
    }
    else if (this.blnReceipt && this.blnFinance) {

      this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt - this.intReceiptTot) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
    }
    else {
      this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
    }
  }
  else {
    if (this.blnReceipt && !this.blnFinance) {
      this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intReceiptTot + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount)
    }
    else if (this.blnFinance && !this.blnReceipt) {
      this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
    }
    else if (this.blnReceipt && this.blnFinance) {

      this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt - this.intReceiptTot) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
    } else if (this.blnCreditSale) {
      this.intBalanceAmt = (this.intGrandTot - this.dblPartialAmount) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
    }
    else {
      this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
    }
  }

  this.intBalanceAmt = Number(this.intBalanceAmt.toFixed(2))


  if (this.intBalanceAmt < 0) {

    // console.log((this.intBalanceAmt).toFixed(2),"this.intBalanceAmt2");

    this.toastr.error('Amount Exceeded', 'Error!');
  }
}


savePaymentOption(event) {
  // =========================================================

  // if(!this.strFinanceName){
  //   this.intReceivedAmt = this.intGrandTot
  // }
  // =========================================================

  let checkError = false

  if (this.blnCash) {
    if (!this.intReceivedAmt) {
      // console.log("test",this.intReceivedAmt)
      swal.fire('Error!', 'Enter Valid Amount ', 'error');
      checkError = true

    }
    // if(this.intReceivedAmt>10000){


    //   this.toastr.error('Cash Amount Limited to 10000', 'Error!');

    //   this.intReceivedAmt=0
    //   return false
    // } 
  }
  if (this.blnCreditCard) {
    this.intCreditAmt = 0;
    for (let i = 0; i < this.lstCredit.length; i++) {

      if (!this.lstCredit[i]['strCardNo']) {
        swal.fire('Error!', 'Enter Credit Card ' + (i + 1) + ' No', 'error');
        checkError = true
        break;

      }
      else if (this.lstCredit[i]['strCardNo'].toString().length < 4 || this.lstCredit[i]['strCardNo'].toString().length > 4) {
        swal.fire('Error!', 'Enter 4 Digits for Credit Card ' + (i + 1), 'error');
        checkError = true
        break;

      }
      else if (!this.lstCredit[i]['intBankId']) {
        swal.fire('Error!', 'Enter Bank Name Of Credit Card ' + (i + 1), 'error');
        checkError = true
        break;

      }
      else if (!this.lstCredit[i]['dblAmt'] || this.lstCredit[i]['dblAmt'] < 0) {
        swal.fire('Error!', 'Enter Valid Credit Amount for Credit Card ' + (i + 1), 'error');
        checkError = true
        break;

      }

      else if (!this.lstCredit[i]['strScheme']) {
        swal.fire('Error!', 'Select EMI option for Credit Card ' + (i + 1), 'error');
        checkError = true
        break;

      }
      else if (this.lstCredit[i]['strScheme'] != this.lstCredit[i]['strSelectedCreditEmi']) {
        swal.fire('Error!', 'Select Valid EMI option for Credit Card ' + (i + 1), 'error');
        checkError = true
        break;

      }
      else if (!this.lstCredit[i]['strRefNo']) {
        swal.fire('Error!', 'Enter Valid Reference No Of Credit Card ' + (i + 1), 'error');
        checkError = true
        break;

      }
      this.intCreditAmt += this.lstCredit[i]['dblAmt'];
    }
  }
  if (this.blnDebitCard) {
    this.intDebitAmt = 0;

    for (let i = 0; i < this.lstDebit.length; i++) {
      if (!this.lstDebit[i]['strCardNo']) {
        swal.fire('Error!', 'Enter Debit Card ' + (i + 1) + ' No ', 'error');
        checkError = true
        break;

      }
      else if (this.lstDebit[i]['strCardNo'].toString().length < 4 || this.lstDebit[i]['strCardNo'].toString().length > 4) {
        swal.fire('Error!', 'Enter 4 Digits  for Debit Card ' + (i + 1), 'error');
        checkError = true;
        break;

      }
      // else if(this.strDebitCardNo.length<4){
      //   swal.fire('Error!','Enter Mininum 4 Digits ', 'error');
      //   checkError=true
      // }
      else if (!this.lstDebit[i]['intBankId']) {
        swal.fire('Error!', 'Enter Bank Name Of Debit Card ' + (i + 1), 'error');
        checkError = true
        break;
      }
      else if (!this.lstDebit[i]['dblAmt'] || this.lstDebit[i]['dblAmt'] < 0) {
        swal.fire('Error!', 'Enter Valid Debit Amount for Debit Card' + (i + 1), 'error');
        checkError = true
        break;

      }
      else if (!this.lstDebit[i]['strEmi']) {
        swal.fire('Error!', 'Select Emi Option for Debit Card ' + (i + 1), 'error');
        checkError = true
        break;

      }
      else if (this.lstDebit[i]['strEmi'] != this.lstDebit[i]['strSelectedEmi']) {
        swal.fire('Error!', 'Select Valid Emi Option for Debit Card ' + (i + 1), 'error');
        checkError = true
        break;

      }

      else if (!this.lstDebit[i]['strRefNo']) {
        swal.fire('Error!', 'Enter Valid Reference No Of Debit Card ' + (i + 1), 'error');
        checkError = true
        break;

      }

      this.intDebitAmt += this.lstDebit[i]['dblAmt'];
    }
  }
  if (this.blnPaytm) {
    if (!this.intPaytmMobileNumber) {
      swal.fire('Error!', 'Mobile number is required ', 'error');
      checkError = true

    }
    else if (this.intPaytmMobileNumber.toString().length < 10 || this.intPaytmMobileNumber.toString().length > 10) {
      swal.fire('Error!', 'Invalid Mobile number', 'error');
      checkError = true;

    }
    else if (!this.intPaytmAmount || this.intPaytmAmount < 0) {
      swal.fire('Error!', 'Valid Paytm amount required ', 'error');
      checkError = true
    }
    else if (!this.strPaytmTransactionNum) {
      swal.fire('Error!', 'Paytm Transaction Number required', 'error');
      checkError = true

    }
    else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmTransactionNum)) {
      checkError = true
      swal.fire('Error!', 'Paytm Transaction Number  allow only alpha numerics ', 'error');
      // -----------------------------------------------
    }
    else if (!this.strPaytmReferenceNum) {
      swal.fire('Error!', 'Paytm Reference Number required', 'error');
      checkError = true

    }
    else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmReferenceNum)) {
      checkError = true
      swal.fire('Error!', 'Reference Number allow only alpha numerics ', 'error');
      // -----------------------------------------------
    }


  }
  if (this.blnBharathQr) {
    if (!this.intBharathQrMobileNumber) {
      // console.log("ammo1")
      swal.fire('Error!', 'Mobile number is required ', 'error');
      checkError = true

    }
    else if (this.intBharathQrMobileNumber.toString().length < 10 || this.intBharathQrMobileNumber.toString().length > 10) {
      swal.fire('Error!', 'Invalid Mobile number', 'error');
      checkError = true;

    }
    else if (!this.intBharathQrAmount || this.intBharathQrAmount < 0) {
      swal.fire('Error!', 'Valid Bharath QR amount required ', 'error');
      checkError = true
    }
    else if (!this.strBharathQrTransactionNum) {
      swal.fire('Error!', 'Bharath QR Transaction Number required', 'error');
      checkError = true

    }
    else if (!/^[a-zA-Z0-9]+$/g.test(this.strBharathQrTransactionNum)) {
      checkError = true
      swal.fire('Error!', 'Bharath QR Transaction Number  allow only alpha numerics ', 'error');
      // -----------------------------------------------
    }
    else if (!this.strBharathQrReferenceNum) {
      swal.fire('Error!', 'Bharath QR  Reference Number required', 'error');
      checkError = true

    }
    else if (!/^[a-zA-Z0-9]+$/g.test(this.strBharathQrReferenceNum)) {
      checkError = true
      swal.fire('Error!', 'Reference Number allow only alpha numerics ', 'error');
      // -----------------------------------------------
    }

  }
  if (this.blnPaytmMall) {
    if (!this.intPaytmMallMobileNumber) {
      swal.fire('Error!', 'Mobile number is required ', 'error');
      // console.log("ammo")
      checkError = true

    }
    else if (this.intPaytmMallMobileNumber.toString().length < 10 || this.intPaytmMallMobileNumber.toString().length > 10) {
      swal.fire('Error!', 'Invalid Mobile number', 'error');
      checkError = true;

    }
    else if (!this.intPaytmMallAmount || this.intPaytmMallAmount < 0) {
      swal.fire('Error!', 'Valid Paytm Mall amount required ', 'error');
      checkError = true
    }
    else if (!this.strPaytmMallTransactionNum) {
      swal.fire('Error!', 'Paytm Mall Transaction Number required', 'error');
      checkError = true

    }
    else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmMallTransactionNum)) {
      checkError = true
      swal.fire('Error!', 'Paytm Mall Transaction Number  allow only alpha numerics ', 'error');
      // -----------------------------------------------
    }
    else if (!this.strPaytmMallReferenceNum) {
      swal.fire('Error!', 'Paytm Mall  Reference Number required', 'error');
      checkError = true

    }
    else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmMallReferenceNum)) {
      checkError = true
      swal.fire('Error!', 'Reference Number allow only alpha numerics ', 'error');
      // -----------------------------------------------
    }

  }


  if (!checkError) {

    // =================================
    // if(!this.strFinanceName){
    //   this.intBalanceAmt = 0
    // }
    // =================================


    this.calculateBalance();

    if (this.intBalanceAmt <= 0) {

      this.dctData['lstPaymentData'] = {}
      this.dctData['lstPaymentData'][4] = {}

      if (this.blnReceipt) {

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


        this.dctData['lstPaymentData'][4]['strRefNo'] = lstreceiptNumbers[0];
      }


      // this.dctData['lstPaymentData']={}
      this.dctData['lstPaymentData'][1] = {}
      this.dctData['lstPaymentData'][3] = {}
      this.dctData['lstPaymentData'][2] = {}
      this.dctData['lstPaymentData'][0] = {}

      this.dctData['lstPaymentData'][5] = {}
      this.dctData['lstPaymentData'][6] = {}
      this.dctData['lstPaymentData'][7] = {}
      this.dctData['lstPaymentData'][1]['dblAmt'] = this.intReceivedAmt

      this.dctData['lstPaymentData'][3]['dblAmt'] = this.intCreditAmt
      this.dctData['lstPaymentData'][3]['intBankId'] = this.intCreditBankId;
      this.dctData['lstPaymentData'][3]['strName'] = this.strCreditBankName;
      this.dctData['lstPaymentData'][3]['strCardNo'] = this.strCreditCardNo
      this.dctData['lstPaymentData'][3]['strRefNo'] = this.strCreditRefNo
      this.dctData['lstPaymentData'][3]['strScheme'] = this.strEmiCredit; //emi option in credit card

      this.dctData['lstPaymentData'][3]['creditCard'] = this.lstCredit;

      this.dctData['lstPaymentData'][2]['debitCard'] = this.lstDebit;

      this.dctData['lstPaymentData'][2]['dblAmt'] = this.intDebitAmt
      this.dctData['lstPaymentData'][2]['intBankId'] = this.intDebitBankId
      this.dctData['lstPaymentData'][2]['strName'] = this.strDebitBankName
      this.dctData['lstPaymentData'][2]['strCardNo'] = this.strDebitCardNo
      this.dctData['lstPaymentData'][2]['strRefNo'] = this.strDebitRefNo;
      this.dctData['lstPaymentData'][2]['strScheme'] = this.strEmi;  // emi option in debit card

      this.dctData['lstPaymentData'][3]['intCcCharge'] = this.intCreditAmt
      this.dctData['lstPaymentData'][2]['intCcCharge'] = this.intDebitCc

      this.dctData['lstPaymentData'][0]['intFinanceAmt'] = this.intFinanceAmt
      this.dctData['lstPaymentData'][0]['intFinanceId'] = this.intFinanceId

      this.dctData['lstPaymentData'][0]['dblProcessingFee'] = this.intProcessingFee
      this.dctData['lstPaymentData'][0]['dblMarginFee'] = this.intMarginMoney
      this.dctData['lstPaymentData'][0]['dblServiceAmount'] = this.intServiceCharge
      this.dctData['lstPaymentData'][0]['dblDbdAmount'] = this.intDBDCharge


      this.dctData['lstPaymentData'][0]['strName'] = this.strFinanceName
      this.dctData['lstPaymentData'][0]['strScheme'] = this.strFinanceScheme
      this.dctData['lstPaymentData'][0]['dblAmt'] = this.intDownPayment
      // this.dctData['lstPaymentData'][0]['intEMI']=this.intEMI
      this.dctData['lstPaymentData'][0]['strRefNo'] = this.intDeliveryNo
      // advance payment
      this.dctData['lstPaymentData'][4]['lstReceipt'] = this.lstReceipt;
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

      // console.log(this.lstReceipt,"this.lstReceipt");

      // ======================================================
      // console.log(this.intBalanceAmt,"this.intBalanceAmt3");

      if (this.intBalanceAmt < 0) {
        this.toastr.error('Amount Exceeded', 'Error!');
      }
      else {
        this.showModalPayment.close();
      }
      // if (!this.strFinanceName) {
      //   this.showModalPayment = this.modalService.open('makepayment', { size: 'lg' })
      //   this.showModalPayment.close();
      // }
      // else{
      //   this.showModalPayment.close();
      // }
      // ======================================================

    }
    else {

      swal.fire('Error!', this.intBalanceAmt.toFixed(2) + " is Required", 'error');
    }


  }
}

cancelPaymentOption() {
  if(this.intBalanceAmtCopy!=0){
    this.intBalanceAmt=this.intBalanceAmtCopy;
    this.intBalanceAmtCopy=0;
  }
  this.intReceivedAmt=0
  // lstDebit dblAmt
  // lstCredit dblAmt
  // lstBharathQR dblAmt    
  this.intPaytmAmount = 0
  this.intPaytmMallAmount =0
  this.intReceiptTot = 0
  this.intCreditAmt=0
  this.intDebitAmt=0
  this.lstDebit = [];
  this.intBharathQrAmount=0;
  // this.total_receipt=0;


    let dctDebit = {
      strCardNo: null,
      intBankId: null,
      dblAmt: null,
      strEmi: '',
      strRefNo: null,
      intCcCharge: null,
      strName: ''
    }

    this.lstDebit.push(dctDebit);
  this.lstCredit = [];

    let dctCredit = {
      strCardNo: null,
      intBankId: null,
      dblAmt: null,
      strScheme: '',
      strRefNo: null,
      intCcCharge: null,
      strName: ''
    }

    this.lstCredit.push(dctCredit);
    

  this.intReceiptTot = 0
  if (this.blnFinance) {
    if (this.intApprove == 4) {
      this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt) + this.intExtraFinanceAmt;
    } else {
      this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt) + this.intExtraFinanceAmt;
    }
  }
  else {
    if (this.intApprove == 4) {
      this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt);
    } else {
      this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt);
    }
  }
  this.intReceiptTot = 0
  // console.log("this.intBalanceAmtafter",this.intBalanceAmt)
  this.blnReciptCall = true
  // this.intBalanceAmt = this.intGrandTot -(this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
  this.showModalPayment.close();
}


saveInvoice() {  

  // console.log("Items",this.lstItemDetails);
  // console.log("GrandTot",this.intGrandTot);
  // console.log("TOtal",this.intTotal);
  

  if (this.intBalanceAmt < 0 && this.blnMakePayment) {
    this.toastr.error('Amount Exceeded', 'Error!');
  }
  else if (this.intBalanceAmt > 0 && this.blnMakePayment) {
    swal.fire('Error!', this.intBalanceAmt.toFixed(2) + " is Required", 'error');

  }
  else {

    if (this.out_of_stock) {
      swal.fire('Error!', "Out of stock", 'error');
      return;
    }
    const form_data = new FormData;
    let error = false
   
    if (this.intContactNo == null || this.intContactNo == '' || !this.intContactNo) {
      this.toastr.error('Customer contact number is required', 'Error!');
      return false;
    }

    let strAlert = "Are you sure want to continue ?"
    if (this.blnFinance) {
      strAlert = "This is a Finance Sale, Please ensure all the entries are correct. Are you sure want to continue ?"
    }

    swal.fire({  //Confirmation before save
      title: 'Save',
      text: strAlert,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes, Save it!",
    }).then(result => {
      if (result.value) {

        if (this.lstItemDetails.length == 0) {
          this.toastr.error('Atleast One Item is required', 'Error!');
          return
        }
        else {

          if (!error) {

            if (this.intGrandTot < 0) {
              swal.fire('Error!', 'Purchase amount should be greater than return amount', 'error')
            }
            else {
              
              if (this.dctData['lstPaymentData']==undefined || this.intBalanceAmt <= 0 || !this.blnMakePayment || this.blnAmazonOrFlipkart) {

                if (!this.blnMakePayment && (this.intCreditBalance < this.intGrandTot) && !this.blnAmazonOrFlipkart) {
                  swal.fire('', 'Your Credit Balance is not enough to purchase items', 'warning');
                }
                else {
                  form_data.append('lstPaymentData', JSON.stringify(this.dctData['lstPaymentData']))
                  form_data.append('dctTableData', JSON.stringify(this.lstItemDetails))

                  form_data.append('salesRowId', this.salesRowId)

                  let dctFinance = {}
                  dctFinance['dblProcessingFee'] = this.intProcessingFee
                  dctFinance['dblMarginFee'] = this.intMarginMoney
                  dctFinance['dblServiceAmount'] = this.intServiceCharge
                  dctFinance['dblDbdAmount'] = this.intDBDCharge

                  form_data.append('strRemarks', this.strRemarks)
                  form_data.append('dctDeliveryData', JSON.stringify(this.dctData['lstDeliveryData']))
                  form_data.append('intRedeemPoint', String(this.intTotPointsCopy - this.intTotPoints))
                  form_data.append('intGrandTot', String(this.intGrandTot))
                  form_data.append('intRounding', String(this.intRounding))
                  form_data.append('intDiscount', String(this.intDiscount))
                  form_data.append('intTotSGST', String(this.intTotSGST))
                  form_data.append('intTotCGST', String(this.intTotCGST))
                  form_data.append('intTotIGST', String(this.intTotIGST))
                  form_data.append('intKfcTot', String(this.intKfcTot))
                  form_data.append('int_enquiry_type', String(this.intEnquiryType))

                  form_data.append('intBuyBack', String(this.intBuyBack))
                  form_data.append('intReturnAmt', String(this.intReturnAmt))
                  form_data.append('intIndirectDiscount', String(this.intTotIndirectDis))
                  form_data.append('dctReturnId', JSON.stringify(this.dctReturnId))
                  form_data.append('bln_matching', JSON.stringify(this.blnMatching));
                  form_data.append('dctFinDetails', JSON.stringify(dctFinance))

                  form_data.append('intSalesCustId', String(this.intSalesCustId))
                  form_data.append('json_additions', JSON.stringify(this.lstAdditions));
                  form_data.append('json_deductions', JSON.stringify(this.lstDeductions));
                  if (this.blnExchangeInvoice) {
                    form_data.append('blnExchange', String(true));
                    form_data.append('intCustId', String(this.intCustId));
                  }
                  if (this.intApprove == 4) {
                    form_data.append('dblBalanceAmount', String(this.dblBalanceAmount));
                  }
                  // form_data.append('returnImages',String(this.dctImages))

                  Object.keys(this.dctImages).forEach(element => {

                    form_data.append(element, this.dctImages[element])
                  });
                  // this.saveDisable = true;
                  // ====================================================================================
                  this.serviceObject.postData('special_sales/add_invoice/', form_data).subscribe(res => {
                    if (res.status == 1) {

                      swal.fire({
                        position: "center",
                        type: "success",
                        text: "Data saved successfully",
                        showConfirmButton: true,
                      });
                      this.printDisable = false;
                      this.saveDisable = true;
                      this.rejectDisable = true;
                      this.invoiceId = res['sales_master_id'];
                    }
                    else if (res.status == 0) {
                      swal.fire('Error!', res['message'], 'error');
                      this.saveDisable = false;
                    }
                  },
                    (error) => {
                      swal.fire('Error!', 'Server Error!!', 'error');
                      this.saveDisable = false;
                    });
                }
              
              }
              else {
                swal.fire('', 'Please Provide Payment Details', 'warning');
              }
            }
          }
          else {
            this.toastr.error('Details of returned item is required', 'Error!');
          }
        }
      };

    });
  }

}


printInvoice() {
  let dctInvoiceId = { invoiceId: this.invoiceId };

  this.printDisable = true;
  this.serviceObject.postData('invoice/invoice_print/', dctInvoiceId).subscribe(
    response => {

      if (response['status'] == 1) {

        let fileURL = response['file_url'];
        window.open(fileURL, '_blank');    
        // localStorage.setItem('previousUrl', 'invoice/listinvoice');
        this.router.navigate(['invoice/specialsaleslist'])
      }
      else {
        this.printDisable = false;
        swal.fire('Error!', response['message'], 'error');
        return false;
      }
    },
    error => {
      this.printDisable = false;
      alert(error);
    }
  );
}

itemNameChanged(item) {

  if (item.vchr_product_name == 'SIM' || item.vchr_product_name == 'RECHARGE' || item.vchr_product_name == 'CARE PLUS') {
    if (!this.blnCheckIGST) {

      this.IntItemNameId = item.strItemId;
      this.newItem.intItemId = item.strItemId;
      this.strItemName = item.strItemName;
      this.newItem.strImei = null
      this.newItem.vchr_product_name = item.vchr_product_name;
      this.newItem.imeiStatus = item.imei_status;
      this.newItem.dblRate = null;
      this.newItem.dblBuyBack = null;
      this.newItem.dblDiscount = null;
      this.newItem.dblCGST = item.dblCGST
      this.newItem.dblSGST = item.dblSGST
      this.newItem.dblIGST = 0
      this.newItem.GST = item.GST
      this.newItem.dblAmount = item.dblRate
      this.newItem.strItemCode = item.strItemCode
      this.newItem.blnService = item.blnService;
      this.newItem.dblCGSTPer = item.dblCGSTPer
      this.newItem.dblSGSTPer = item.dblSGSTPer
      this.newItem.dblIGSTPer = 0
      this.newItemUppercase = (item.strItemName).toUpperCase()
      this.newItemCode = item.strItemCode
      this.newItem.dblCGST = (this.newItem.dblAmount / ((100 + this.newItem.dblSGSTPer + this.newItem.dblCGSTPer) / 100)) * (this.newItem.dblCGSTPer / 100)
      this.newItem.dblSGST = (this.newItem.dblAmount / ((100 + this.newItem.dblSGSTPer + this.newItem.dblCGSTPer) / 100)) * (this.newItem.dblSGSTPer / 100)
      this.newItem.dblMopAmount = item.dblMopAmount
      this.newItem.dblRate = Number((this.newItem.dblAmount - (this.newItem.dblCGST + this.newItem.dblSGST) + (this.newItem.dblDiscount)).toFixed(2));
      this.newItem.dblMarginAmount = item.dblMarginAmount
      this.calcKfc()
    }
    else {
      // item.dblIGST=res['data']['dblIGST']
      // item.dblIGSTPer=res['data']['dblIGSTPer']

      // item.dblRate=res['data']['dblRate']
      // item.dblAmount = Number(((item.dblIGST + item.dblRate) - (item.dblBuyBack + item.dblDiscount)).toFixed(2))

      this.IntItemNameId = item.strItemId;
      this.newItem.intItemId = item.strItemId;
      this.strItemName = item.strItemName;
      this.newItem.strImei = null
      this.newItem.vchr_product_name = item.vchr_product_name;
      this.newItem.imeiStatus = item.imei_status;
      this.newItemUppercase = (item.strItemName).toUpperCase()
      this.newItem.dblRate = null;
      this.newItem.dblBuyBack = null;
      this.newItem.dblDiscount = null;
      this.newItem.strItemCode = item.strItemCode
      this.newItemCode = item.strItemCode
      this.newItem.blnService = item.blnService;
      this.newItem.dblIGST = item.dblIGST
      this.newItem.dblIGSTPer = item.dblIGSTPer

      this.newItem.dblAmount = item.dblRate

      this.newItem.dblIGST = (this.newItem.dblAmount / ((100 + this.newItem.dblIGSTPer) / 100)) * (this.newItem.dblIGSTPer / 100)
      this.newItem.GST = item.GST

      this.newItem.dblRate = Number((this.newItem.dblAmount - (this.newItem.dblIGST) + (this.newItem.dblDiscount)).toFixed(2));

      this.newItem.dblMopAmount = item.dblMopAmount
      this.newItem.dblMarginAmount = item.dblMarginAmount

    }

  }
  else {
    this.IntItemNameId = item.strItemId;
    this.newItem.intItemId = item.strItemId;
    this.strItemName = item.strItemName;
    this.newItem.strImei = null
    this.newItem.vchr_product_name = item.vchr_product_name;
    this.newItem.imeiStatus = item.imei_status;
    this.newItem.dblRate = null
    this.newItem.dblBuyBack = null;
    this.newItem.dblDiscount = null;
    this.newItem.dblCGST = 0
    this.newItem.dblSGST = 0
    this.newItem.dblIGST = 0
    this.newItem.dblAmount = 0
    this.newItem.strItemCode = item.strItemCode
    this.newItem.blnService = item.blnService;
    this.newItem.dblCGSTPer = 0
    this.newItem.dblSGSTPer = 0
    this.newItem.dblIGSTPer = 0
    this.newItem.dblMarginAmount = null;
    this.newItemUppercase = (item.strItemName).toUpperCase()
    this.newItemCode = item.strItemCode
  }
}


RateBlur(index: number, event) {



  if (this.lstItemDetails[index]['dblAmount'] == null || this.lstItemDetails[index]['dblAmount'] == 0) {
    this.lstItemDetails[index]['dblAmount'] = 0
    this.lstItemDetails[index]['dblRate'] = 0
    this.lstItemDetails[index]['dblDiscount'] = 0
    this.lstItemDetails[index]['dblBuyBack'] = 0
    this.lstItemDetails[index]['dblCGST'] = 0
    this.lstItemDetails[index]['dblSGST'] = 0
    this.lstItemDetails[index]['dblIGST'] = 0
  }
  else if (this.lstItemDetails[index]['intStatus'] == 2 && this.lstItemDetails[index]['dblAmount'] > 0) {

    this.lstItemDetails[index]['dblAmount'] = JSON.parse(JSON.stringify(this.lstItemDetails[index]['dblAmount'])) * -1
    this.lstItemDetails[index]['dblRate'] = JSON.parse(JSON.stringify(this.lstItemDetails[index]['dblRate'])) * -1
  }


  this.calcRate();
}

calcKfc() {

  this.intKfcTot = 0;

  this.lstItemDetails.map(element => {

    let intKfc = 0;
    let tempAmt = 0;
    let AmtWithoutTax = 0;
    let taxPer = 0;
    let taxPoint = 0;

    // if (((element.intKfc == 0) || (element.intKfc == undefined)) && element.intStatus != 2 && !this.blnCheckExchange) {

      taxPer = element.dblCGSTPer + element.dblSGSTPer + 1;

      // if (element.dblBuyBack) {
      //   tempAmt = Number(element.dblAmount + element.dblBuyBack);

      // }
      // else if (this.blnExchangeInvoice) {
      //   if (element.dblAmount > 0) {
      //     this.intExchangeSalesAmount = element.dblAmount - element.exchange_sale_amount;
      //     tempAmt = this.intExchangeSalesAmount;

      //   }
      //   else {
      //     tempAmt = 0;
      //   }

      // }

      // else {
      //   tempAmt = element.dblAmount;
      // }

      tempAmt = element.dblMopAmount;

      taxPoint = 1 + (taxPer / 100);

      AmtWithoutTax = tempAmt / taxPoint;

      // if (!this.blnCustomerType) {
        intKfc = (AmtWithoutTax) / 100;

        element.intKfc = Number(intKfc);
      // } else {
      //   element.intKfc = 0;
      // }

      // if (!this.blnExchangeInvoice && this.blnStart && element.intStatus != 2) {
      //   element.dblRate -= Number(element.intKfc);
      // }


      // if (element.intStatus != 0 && !this.blnCustomerType) {
        this.intKfcTot += Number(intKfc);
      // }

    // }
    // else if (!this.blnCheckExchange) {


    //   if (element.intStatus != 0 && element.intStatus != 2) {
    //     let intKfc = 0;


    //     if (this.blnExchangeInvoice) {
    //       if (element.dblAmount > 0) {
    //         this.intExchangeSalesAmount = element.dblAmount - element.exchange_sale_amount;
    //         tempAmt = this.intExchangeSalesAmount;
    //       }
    //       else {
    //         tempAmt = 0;
    //       }

    //       if (!this.blnCustomerType) {
    //         intKfc = (element.dblRate - element.exchange_sale_amount) / 100
    //         element.intKfc = Number(intKfc);
    //       } else {
    //         element.intKfc = 0;
    //       }
    //     }
    //     else {
    //       if (!this.blnCustomerType) {
    //         intKfc = element.dblRate / 100
    //         element.intKfc = Number(intKfc);
    //       } else {
    //         element.intKfc = 0;
    //       }
    //     }


    //     if (!this.blnCustomerType) {
    //       this.intKfcTot += Number(intKfc);
    //     }
    //   }
    // }

    if (element.intStatus == 2) {
      element.dblRate = element.dblAmount
    }
    // if (this.blnCheckExchange && !this.blnCustomerType) {
    //   this.intKfcTot += Number(element.intKfc);

    // }

  })
  this.blnStart = false;

}


focusOutImei(item, index) {

  this.out_of_stock = false;
 
  let blnImeiExists = true
  let blnCheck = true
  let dct = {}
  dct['pk_bint_id'] = item.intItemId
  dct['intCustId'] = this.intCustId
  dct['strImei'] = ''

  if (this.lst_imei.includes(item['strImei'])) {
   
    for (let i = 0; i < this.lstItemDetails.length; i++) {
      if (this.lstItemDetails[i].hasOwnProperty('blnService')) {
        if (item.blnService === false
          && this.lstItemDetails[i]['blnService'] === item.blnService
          && item['imeiStatus'] == true && this.lstItemDetails[i]['strImei'] === item['strImei'] && item['strItemCode'] != 'GDC00001' && item['strItemCode'] != 'GDC00002') {
          swal.fire('Error!', 'Already Exist', 'error');
          blnImeiExists = false;
          if (index == 'newItem') {
            this.newItem.strImei = null
            if (!this.blnCheckIGST) {
              item.dblCGST = 0
              item.dblSGST = 0
            }
            else {
              item.dblIGST = 0
            }
          }
          else {
            this.lstItemDetails[index]['strImei'] = null
            if (!this.blnCheckIGST) {
              item.dblCGST = 0
              item.dblSGST = 0
            }
            else {
              item.dblIGST = 0
            }
          }
          blnCheck = false

        }
      }
    }

  }
  if (blnImeiExists) {
    dct['strImei'] = item.strImei
    blnCheck = true
  }


  if (blnCheck && dct['strImei'] && dct['strImei'] != '0') {
    if (!item.intItemId) {
      swal.fire('Error!', 'Item Name is required', 'error');
      if (index == 'newItem') {
        this.newItem.strImei = null
      }
      else {
        this.lstItemDetails[index]['strImei'] = null
      }
      return false
    }
    else {
      dct['itemCode'] = this.newItemCode

      let blnAvail = false
      this.lstItemDetails.forEach(element => {
        if (element.strImei == this.newItem.strImei) {
          blnAvail = true
        }
      });

      dct['blnAvail'] = blnAvail
      dct['blnIGST'] = this.blnCheckIGST

      this.serviceObject.postData('branch_stock/get_price_for_item/', dct).subscribe(res => {

        if (res.status == 1) {

         if (!this.blnCheckIGST) {
           
            if (!this.blnCustomerType) {
              // item.dblCGST = res['data']['dblCGST']
              // item.dblSGST = res['data']['dblSGST']
              item.dblSGSTPer = res['data']['dblSGSTPer']
              item.dblCGSTPer = res['data']['dblCGSTPer']
              item.GST = res['data']['GST']

              item.dblAmount = res['data']['dblAmount']
              item.dblMopAmount = res['data']['dblMopAmount']

              // item.dblCGST = (item.dblAmount / ((100 + item.dblSGSTPer + item.dblCGSTPer) / 100)) * (res['data']['dblCGSTPer'] / 100)
              // item.dblSGST = (item.dblAmount / ((100 + item.dblSGSTPer + item.dblCGSTPer) / 100)) * (res['data']['dblSGSTPer'] / 100)
            }
            
         
            // item.dblRate = Number((item.dblAmount - (item.dblCGST + item.dblSGST) + (item.dblDiscount + item.dblBuyBack)).toFixed(2));

            // this.calcKfc()
          }
          else {
           
            if (!this.blnCustomerType) {
              // item.dblIGST = res['data']['dblIGST']
              item.dblIGSTPer = res['data']['dblIGSTPer']
              // item.dblIGST = (item.dblAmount / ((100 + item.dblIGSTPer) / 100)) * (res['data']['dblIGSTPer'] / 100)
              item.GST = res['data']['GST']
            }
            item.dblAmount = res['data']['dblAmount']

            // item.dblRate = Number((item.dblAmount - (item.dblIGST) + (item.dblDiscount + item.dblBuyBack)).toFixed(2));

            item.dblMopAmount = res['data']['dblMopAmount']
          
          }

          let itemRate = item.dblRate;

          this.calcRate();

        }
        else if (res.status == 0) {
          swal.fire('Error!', res['data'], 'error');
          this.out_of_stock = true;
          // if(item.hasOwnProperty('imei')){
          this.newItem.strImei = null
          // }
          // else{
          // item.strImei= 0;
          //  }
        }
      },
        (error) => {
          swal.fire('Error!', 'Server Error!!', 'error');
        });
      // }
    }

  }

}


emiSearched(event, data) { //debit card

  this.newTime1 = event.timeStamp;
  this.keyEve1 = event.keyCode;

  if (data === undefined || data === null) {
  } else {
    if (this.keyEve1 === 8 || this.keyEve1 === 38 || this.keyEve1 === 40 || this.keyEve1 === 13) {
      if (data === undefined || data === null || data === '') {
        this.lstEmiOptions = [];
      }
      return //return for backspace, enter key and up&down arrows.
    }
    if (data.length > 0) {
      if ((this.newTime1 - this.setStart1) > 100 || data.length == 1) {
        this.setStart1 = this.newTime1;
        this.lstEmiOptions = [];
        this.typeaheadEmi(data);
      }
      else {
        return;
      }
    } else {
      this.lstEmiOptions = [];
    }
  }
}

typeaheadEmi(data) { //debit
  this.serviceObject.postData('invoice/scheme_typeahead/', { term: data }).subscribe(
    (response) => {
      this.lstEmiOptions.push(...response['data']);
    },
    (error) => {
      swal.fire('Error!', error, 'error');

    }
  );
}
emiChanged(item, index) {
  this.intEmiDebitId = item.id;
  this.lstDebit[index]['strSelectedEmi'] = item.name;
  // this.strPincode= item.vchr_pin_code;
}
emiCreditChanged(item, index) {
  this.intEmiCreditId = item.id;
  this.lstCredit[index]['strSelectedCreditEmi'] = item.name;
  // this.strPincode= item.vchr_pin_code;
}

emiCreditSearched(event, data) {

  this.newTime2 = event.timeStamp;
  this.keyEve2 = event.keyCode;



  if (data === undefined || data === null) {
  } else {
    if (this.keyEve2 === 8 || this.keyEve2 === 38 || this.keyEve2 === 40 || this.keyEve2 === 13) {
      if (data === undefined || data === null || data === '') {
        this.lstEmiCreditOptions = [];
      }
      return //return for backspace, enter key and up&down arrows.
    }
    if (data.length > 0) {
      if ((this.newTime2 - this.setStart2) > 100 || data.length == 1) {
        this.setStart2 = this.newTime2;
        this.lstEmiCreditOptions = [];
        this.typeaheadCreditEmi(data);
      }
      else {
        return;
      }
    } else {
      this.lstEmiCreditOptions = [];
    }
  }
}

typeaheadCreditEmi(data) { //debit
  this.serviceObject.postData('invoice/scheme_typeahead/', { term: data }).subscribe(
    (response) => {
      this.lstEmiCreditOptions.push(...response['data']);
    },
    (error) => {
      swal.fire('Error!', error, 'error');

    }
  );
}

bharathQrChanged(event) {


  event.source._checkError = false;

  if (this.blnBharathQr) {
    event.source.checked = true;
  }
  else {
    event.source.checked = false;

  }


  if (!this.blnBharathQr) {
    this.intBharathQrMobileNumber = null;
    this.intBharathQrAmount = 0;
    this.strBharathQrTransactionNum = '';
    this.strBharathQrReferenceNum = '';

  }
  else {
    if (this.blnCreditCard) {

      for (let i = 0; i < this.lstCredit.length; i++) {

        if (!this.lstCredit[i]['strCardNo']) {
          swal.fire('Error!', 'Enter Credit Card ' + (i + 1) + ' No', 'error');
          event.source._checkError = true
          break;

        }
        else if (this.lstCredit[i]['strCardNo'].toString().length < 4 || this.lstCredit[i]['strCardNo'].toString().length > 4) {
          swal.fire('Error!', 'Enter 4 Digits for Credit Card ' + (i + 1), 'error');
          event.source._checkError = true
          break;

        }
        else if (!this.lstCredit[i]['intBankId']) {
          swal.fire('Error!', 'Enter Bank Name Of Credit Card ' + (i + 1), 'error');
          event.source._checkError = true
          break;

        }
        else if (!this.lstCredit[i]['dblAmt'] || this.lstCredit[i]['dblAmt'] < 0) {
          swal.fire('Error!', 'Enter Valid Credit Amount for Credit Card ' + (i + 1), 'error');
          event.source._checkError = true
          break;

        }

        else if (!this.lstCredit[i]['strScheme']) {
          swal.fire('Error!', 'Select EMI option for Credit Card ' + (i + 1), 'error');
          event.source._checkError = true
          break;

        }
        else if (this.lstCredit[i]['strScheme'] != this.lstCredit[i]['strSelectedCreditEmi']) {
          swal.fire('Error!', 'Select Valid EMI option for Credit Card ' + (i + 1), 'error');
          event.source._checkError = true
          break;

        }
        else if (!this.lstCredit[i]['strRefNo']) {
          swal.fire('Error!', 'Enter Valid Reference No Of Credit Card ' + (i + 1), 'error');
          event.source._checkError = true
          break;

        }
      }

      if (event.source._checkError) {
        this.blnBharathQr = false;
        event.source.checked = false;

      }

    }
    if (this.blnCash) {
      if (!this.intReceivedAmt) {
        swal.fire('Error!', 'Enter Valid Amount ', 'error');
        this.blnBharathQr = false
        event.source._checked = false

      }
    }
    if (this.blnDebitCard) {

      for (let i = 0; i < this.lstDebit.length; i++) {
        if (!this.lstDebit[i]['strCardNo']) {
          swal.fire('Error!', 'Enter Debit Card ' + (i + 1) + ' No ', 'error');
          event.source._checkError = true
          break;

        }
        else if (this.lstDebit[i]['strCardNo'].toString().length < 4 || this.lstDebit[i]['strCardNo'].toString().length > 4) {
          swal.fire('Error!', 'Enter 4 Digits  for Debit Card ' + (i + 1), 'error');
          event.source._checkError = true;
          break;

        }
        // else if(this.strDebitCardNo.length<4){
        //   swal.fire('Error!','Enter Mininum 4 Digits ', 'error');
        //   event.source._checkError=true
        // }
        else if (!this.lstDebit[i]['intBankId']) {
          swal.fire('Error!', 'Enter Bank Name Of Debit Card ' + (i + 1), 'error');
          event.source._checkError = true
          break;
        }
        else if (!this.lstDebit[i]['dblAmt'] || this.lstDebit[i]['dblAmt'] < 0) {
          swal.fire('Error!', 'Enter Valid Debit Amount for Debit Card' + (i + 1), 'error');
          event.source._checkError = true
          break;

        }
        else if (!this.lstDebit[i]['strEmi']) {
          swal.fire('Error!', 'Select Emi Option for Debit Card ' + (i + 1), 'error');
          event.source._checkError = true
          break;

        }
        else if (this.lstDebit[i]['strEmi'] != this.lstDebit[i]['strSelectedEmi']) {
          swal.fire('Error!', 'Select Valid Emi Option for Debit Card ' + (i + 1), 'error');
          event.source._checkError = true
          break;

        }

        else if (!this.lstDebit[i]['strRefNo']) {
          swal.fire('Error!', 'Enter Valid Reference No Of Debit Card ' + (i + 1), 'error');
          event.source._checkError = true
          break;

        }
      }

      if (event.source._checkError) {
        this.blnBharathQr = false;
        event.source.checked = false;

      }

    }
    if (this.blnPaytm) {
      if (!this.intPaytmMobileNumber) {
        swal.fire('Error!', 'Enter Mobile Number', 'error');
        this.blnBharathQr = false
        event.source._checked = false
      }
      else if (!this.intPaytmAmount || this.intPaytmAmount < 0) {
        swal.fire('Error!', 'Enter Valid Amount', 'error');
        this.blnBharathQr = false
        event.source._checked = false
      }
      else if (!this.strPaytmTransactionNum) {
        swal.fire('Error!', 'Enter Paytm Transaction Number ', 'error');
        this.blnBharathQr = false
        event.source._checked = false
      }
      else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmTransactionNum)) {
        this.blnBharathQr = false
        event.source._checked = false
        swal.fire('Error!', 'Paytm Transaction Number  allow only alpha numerics ', 'error');
        // -----------------------------------------------
      }
      else if (!this.strPaytmReferenceNum) {
        swal.fire('Error!', 'Enter Paytm Reference Number ', 'error');
        this.blnBharathQr = false
        event.source._checked = false
      }
      else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmReferenceNum)) {
        this.blnBharathQr = false
        event.source._checked = false
        swal.fire('Error!', 'Reference Number allow only alpha numerics ', 'error');
        // -----------------------------------------------
      }
    }

  }

  this.calculateBalance()

}

clearRow() {
  this.out_of_stock = false;
  this.newItem = {
    intItemId: null,
    strItemName: '',
    GST: 0,
    dblMarginAmount: null,
    dblMopAmount: 0,
    vchr_product_name: null,
    strImei: null,
    imeiStatus: false,
    dblRate: null,
    dblBuyBack: null,
    dblDiscount: null,
    dblCGST: 0,
    dblSGST: 0,
    dblIGST: 0,
    dblAmount: 0,
    intQuantity: 1,
    intStatus: 1,
    strItemCode: null,
    blnService: null,
    offerId: null,
    dblCGSTPer: 0,
    dblIGSTPer: 0,
    dblSGSTPer: 0,
    int_type: 0
  }
}

addNewRow() {
  // For customer type 3
  if (this.blnCustomerType) {
    if (this.newItem.GST) {
      this.newItem.GST = 0;
    }
    if (this.newItem.dblCGST) {
      this.newItem.dblCGST = 0;
    }
    if (this.newItem.dblCGSTPer) {
      this.newItem.dblCGSTPer = 0;
    }
    if (this.newItem.dblSGST) {
      this.newItem.dblSGST = 0;
    }
    if (this.newItem.dblSGSTPer) {
      this.newItem.dblSGSTPer = 0;
    }
  }
  // For customer type 3 ends---
  if (this.newItem.strItemName.toUpperCase() == 'GDP') {
    this.newItem.int_type = 1;
  }
  if (this.newItem.strItemName.toUpperCase() == 'GDEW (EXTENDED WARRANTY)') {
    this.newItem.int_type = 2;
  }

  if (!this.newItem.strItemName) {
    this.toastr.error('Item Name is required', 'Error!');
    return false;
  }
  else if ((this.newItem.strImei == "0" || !this.newItem.strImei) && this.newItem.vchr_product_name != 'SIM' && this.newItem.vchr_product_name != 'RECHARGE' && this.newItem.vchr_product_name != 'CARE PLUS') {
    this.toastr.error('Imei is required', 'Error!');
    return false;
  }
  else if (this.out_of_stock && this.newItem.vchr_product_name != 'SIM' && this.newItem.vchr_product_name != 'RECHARGE' && this.newItem.vchr_product_name != 'CARE PLUS') {
    this.toastr.error(this.newItem.strItemName + ' is out of stock', 'Error!');
    return false;
  }
 
  else {

    let blnAlreadyExist = false
    this.lstItemDetails.forEach(element => {
      if (element.strItemCode == this.newItem.strItemCode && element.strImei == this.newItem.strImei && this.newItem.imeiStatus == true) {
        blnAlreadyExist = true
      }
    });

    if (blnAlreadyExist) {
      this.toastr.error('Already Exist', 'Error!');
    }
    else {
      this.lstItemDetails.push(this.newItem);

      this.linkShow.push('none');
      this.offerDis.push(0);

      this.lst_imei.push(this.newItem['strImei']);

      this.newItem = {
        intItemId: null,
        strItemName: '',
        imeiStatus: false,
        dblMarginAmount: null,
        dblMopAmount: 0,
        strImei: '0',
        vchr_product_name: null,
        GST: 0,
        dblRate: null,
        dblBuyBack: null,
        dblDiscount: null,
        dblCGST: 0,
        dblSGST: 0,
        dblIGST: 0,
        dblAmount: 0,
        intQuantity: 1,
        intStatus: 1,
        strItemCode: null,
        blnService: null,
        offerId: null,
        dblCGSTPer: 0,
        dblIGSTPer: 0,
        dblSGSTPer: 0,
        int_type: 0
      }

      this.out_of_stock = false;

      this.blnStart = true

      this.calcRate();

      if (this.lstFilterData.length > 0) {
        if ((Object.keys(this.dct_item)).includes(String(this.lstFilterData[this.clickRowId]['intItemId']))) {
          this.dct_item[this.lstFilterData[this.clickRowId]['intItemId']] = this.dct_item[this.lstFilterData[this.clickRowId]['intItemId']] + 1
        }
        else {
          this.dct_item[this.lstFilterData[this.clickRowId]['intItemId']] = 1
        }
      }

      let lstLen = this.lstItemDetails.length;
      let tempDict = {};
      tempDict['intItemId'] = this.lstItemDetails[lstLen - 1].intItemId;
      tempDict['strItemName'] = this.lstItemDetails[lstLen - 1].strItemName;

    }
  }
}



removeRow(id) {

  // console.log("#####id",id);
  
  swal.fire({
    title: 'Are you sure?',
    text: "Removal of this item will also remove its insurance(GDP/GDEW).",
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
      

      // Removed imei of deleted item from lst_imei --starts
      let delImeiIndex = this.lst_imei.indexOf(this.lstItemDetails[id]['strImei']);
      this.lst_imei.splice(delImeiIndex, 1);
      // Removed imei of deleted item from lst_imei --ends

      let index = 0
      let lstIndex = []
      // for (let i = 0; i < this.lstItemDetails.length; i++) {

      //   if (this.lstItemDetails[id]['strImei'] == this.lstItemDetails[i]['strImei'] && id != i && this.lstItemDetails[id]['strItemCode'] != 'GDC00001' && this.lstItemDetails[id]['strItemCode'] != 'GDC00002' && this.lstItemDetails[id]['imeiStatus'] == true) {
        
      //     lstIndex.push(i)

      //   }
      // }
    
      // console.log("###lstIndex",lstIndex);
      
      // for (let index = lstIndex.length - 1; index >= 0; index--) {
      //   this.lstItemDetails.splice(lstIndex[index], 1);
      // }

      this.lstItemDetails.splice(id, 1);


      this.calcRate();
    }
  })

}

bankChanged(index, item, type) {

  if (type == 'credit') {
    this.lstCredit[index]['strName'] = item.vchr_name;
  }
  else if (type == 'debit') {
    this.lstDebit[index]['strName'] = item.vchr_name;

  }

}

}
