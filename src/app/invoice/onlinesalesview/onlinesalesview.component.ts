
import {debounceTime} from 'rxjs/operators';
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalDataSource } from 'ng2-smart-table';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ViewChildren, ElementRef, Input } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
// import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-onlinesalesview',
  templateUrl: './onlinesalesview.component.html',
  styleUrls: ['./onlinesalesview.component.css']
})
export class OnlinesalesviewComponent implements OnInit {


  blnIGST=false;
  imeiStatus=true;
  
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


  @ViewChild('itemId') itemId: ElementRef;
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
  salesRowId = localStorage.getItem('onlineSalesId');
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
  showModalConfirmation
  showModalOtp

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

  searchCustomer: FormControl = new FormControl();
  lstCustomer = []
  intCustomerId;
  strCustomer;
  strSelectedCustomer;
  currentCustomer = '';

  invoiceId;

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

  data;
  strAPIReferenceNum;
  blnEcomAPIAmountPaid=false;
  intBalanceAmtCopy = 0;

  constructor(    
    private spinner: NgxSpinnerService,
    private serviceObject: ServerService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public router: Router,


    ) { 
      // this.source2 = new LocalDataSource(tableData.data); // create the source

    }

  ngOnInit() {

    this.printDisable = true; //disable print button
    this.saveDisable = false; //enable save button

    if (this.lstGroup.includes(this.strGroupName)) {
      this.saveButtonStatus = false;
    }

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
   
    this.serviceObject.postData('invoice/sales_list/', this.dctData).subscribe(res => {

      if (res.status == 1) {
        this.lstItemDetails = res['data']['lstItems'];

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
        this.strAPIReferenceNum=res['data']['vchr_reference_num'];
        if (this.int_editcount == 0) {
          this.int_cust_edit = 1;
        }
        else {
          this.int_cust_edit = 2;
        }


        this.calcRate();
        if(this.strAPIReferenceNum){
          this.typeaheadEmi('None');          
          this.blnEcomAPIAmountPaid=true;
        }
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
      
      element.dblRate= (element.dblAmount/taxVal);

      if(this.blnIGST){
        element.dblIGST=(element.dblRate*element.dblIGSTPer)/100;
        this.intTotIGST+=element.dblIGST;

      }
      else if (!this.strGSTNo) {
        taxVal=1+((element.GST+1)/100);
        element.dblRate= (element.dblAmount/taxVal);
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
          if(this.blnEcomAPIAmountPaid){
            this.addDebitCardDetails();
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
    this.intBalanceAmtCopy=JSON.parse(JSON.stringify(this.intBalanceAmt))
    //  console.log("aftr", this.lstReceipt);
    
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
        errorPlace = 'Email format is not correct ';
        checkError = true
     
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
              this.blnIGST = res['data']['blnIGST']

              this.showModalCustEdit.close();
              this.dctData['custEditData']={};

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
         
        dctCustomerData['intCustId'] = this.intCustId
        // partialInvoice Id 
        dctCustomerData['intPartialId'] = this.salesRowId
       
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
                  this.blnIGST = res['data']['blnIGST']

                  this.showModalCustEdit.close();
                  this.dctData['custEditData']={};

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
    this.strName = this.strName.toUpperCase();
  }

  customerNumberChanged(item) {
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
      this.intDebitAmt += element.dblAmt;


    });
  }
  if (this.blnCreditCard) {
    this.intCreditAmt = 0;
    this.lstCredit.forEach(element => {             //change the  to get value if credit card payement
      this.intCreditAmt += element.dblAmt;


    });
  }
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


    this.toastr.error('Amount Exceeded', 'Error!');
  }
}


savePaymentOption(event) {
  
  let checkError = false

  if (this.blnCash) {
    if (!this.intReceivedAmt) {
      swal.fire('Error!', 'Enter Valid Amount ', 'error');
      checkError = true

    }
  
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

 
    this.calculateBalance();

    if (this.intBalanceAmt <= 0) {

      this.dctData['lstPaymentData'] = {}
      this.dctData['lstPaymentData'][4] = {}

      if (this.blnReceipt) {

        this.dctData['lstPaymentData'][4]['dblAmt'] = this.intReceiptTot;
     

        let lstreceiptNumbers = []
        this.lstReceipt.forEach(element => {


          lstreceiptNumbers.push(element.vchr_receipt_num)


        });
        lstreceiptNumbers[0] = lstreceiptNumbers.toString();


        this.dctData['lstPaymentData'][4]['strRefNo'] = lstreceiptNumbers[0];
      }


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

      if (this.intBalanceAmt < 0) {
        this.toastr.error('Amount Exceeded', 'Error!');
      }
      else {
        this.showModalPayment.close();
      }
   
    }
    else {

      swal.fire('Error!', this.intBalanceAmt.toFixed(2) + " is Required", 'error');
    }


  }
}

cancelPaymentOption() {
  console.log(this.intBalanceAmt,this.intBalanceAmtCopy);
  
  if(this.intBalanceAmtCopy!=0){
    this.intBalanceAmt=this.intBalanceAmtCopy;
    this.intBalanceAmtCopy=0;
  }
  
  this.intReceivedAmt=0  
  this.intPaytmAmount = 0
  this.intPaytmMallAmount =0
  this.intReceiptTot = 0
  this.intCreditAmt=0
  this.intDebitAmt=0
  this.lstDebit = [];
  this.intBharathQrAmount=0;


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
  this.showModalPayment.close();
}


saveInvoice() {  


  for(let i=0;i<this.lstItemDetails.length;i++){
    this.checkingIMEI(i);
    if(!this.imeiStatus){
      return;
    }
  }

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

                  Object.keys(this.dctImages).forEach(element => {

                    form_data.append(element, this.dctImages[element])
                  });
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

      taxPer = element.dblCGSTPer + element.dblSGSTPer + 1;

      tempAmt = element.dblAmount;

      taxPoint = 1 + (taxPer / 100);

      AmtWithoutTax = tempAmt / taxPoint;

        intKfc = (AmtWithoutTax) / 100;

        element.intKfc = Number(intKfc);

        this.intKfcTot += Number(intKfc);


    if (element.intStatus == 2) {
      element.dblRate = element.dblAmount
    }

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

              this.lstItemDetails[index]['strImei'] = null
            if (!this.blnCheckIGST) {
              item.dblCGST = 0
              item.dblSGST = 0
            }
            else {
              item.dblIGST = 0
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

bankChanged(index, item, type) {

  if (type == 'credit') {
    this.lstCredit[index]['strName'] = item.vchr_name;
  }
  else if (type == 'debit') {
    this.lstDebit[index]['strName'] = item.vchr_name;

  }

}

checkingIMEI(index){

  let batchCount = 0
  if (this.lstItemDetails[index]['imeiStatus'] == false){
    this.lstItemDetails.forEach(element=>{
      if(element['strImei'] == this.lstItemDetails[index]['strImei']){
        batchCount++
      }
    })
  }



  this.imeiStatus=true;

  if(this.lstItemDetails[index]['strImei']=='' || this.lstItemDetails[index]['strImei']==null){
    this.toastr.error("Error","Enter IMEI ");
    this.lstItemDetails[index]['strImei']='';
    this.imeiStatus=false;
    return;
  }
  // else if(this.lstItemDetails[index]['strImei'].toString().length!=15){        
  //   this.toastr.error("Error","Please enter 15 characters IMEI number");
  //   this.imeiStatus=false;
  //   return;
  // }
  else{
    let count=0;
    console.log("testtt",this.lstItemDetails)
    this.lstItemDetails.forEach(element=>{
      if(element.strImei==this.lstItemDetails[index]['strImei'] && element.imeiStatus == true){
        count++;
      }
    })
    if(count>=2){
      this.toastr.error("Error","Duplicated IMEI numbers");
      this.lstItemDetails[index]['strImei'] = null

      this.imeiStatus=false;
      return;
    }
  }

  let dctData={
    pk_bint_id:this.lstItemDetails[index]['intItemId'],
    strItemCode:this.lstItemDetails[index]['strItemCode'],
    strImei:this.lstItemDetails[index]['strImei'],
    blnImeiStatus :this.lstItemDetails[index]['imeiStatus'],
    branchCode:this.strBranchCode,
  };
  if (this.lstItemDetails[index]['imeiStatus'] == false){
    dctData['batchCount'] = batchCount
  }

  this.serviceObject.postData('enquiry/ecom_stock_check/', dctData).subscribe(res => {

    if (res.status == 1) {
     this.imeiStatus=true;
    }
    else if (res.status == 0) {
      this.imeiStatus=false;      
      swal.fire('Error!', this.lstItemDetails[index]['strImei']+' is out of stock', 'error');
      this.lstItemDetails[index]['strImei'] = null
      
    }
  },
    (error) => {
      this.imeiStatus=false;
      swal.fire('Error!', 'Server Error!!', 'error');
    });
}

   // Only AlphaNumeric
   keyPressAlphaNumeric(event) {

    // console.log("######3",event);
    
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  addDebitCardDetails(){
    this.blnDebitCard=true;
    let intBankId;
    let strBankName;
    let intEmiID;
    let strEmiName;
    this.lstBankNames.forEach(element => {
      if(element.vchr_name=='MYG ECOMMERCE BANK'){
        intBankId=element.pk_bint_id;
        strBankName=element.vchr_name;
      }
    });
    this.lstEmiOptions.forEach(element => {
      if(element.name=='None'){
        intEmiID=element.id;
        strEmiName=element.name;
      }
    });
      this.lstDebit = [];
      let dctDebit = {
        strCardNo: "0000",
        intBankId: intBankId,
        dblAmt: this.intBalanceAmt,
        strEmi: strEmiName,
        strRefNo: this.strAPIReferenceNum,
        intCcCharge: null,
        strName: strBankName,
        strSelectedEmi:  strEmiName
      }
    this.intEmiDebitId = intEmiID;
      this.lstDebit.push(dctDebit);
      this.calculateBalance();
  }

}
