
import {debounceTime} from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbActiveModal, } from '@ng-bootstrap/ng-bootstrap';
import * as tableData from './invoice-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild, OnInit, ElementRef, ViewChildren, HostListener, Input } from '@angular/core';
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
import { log } from 'util';

@Component({
  selector: 'app-invoiceview',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoiceview.component.html',
  styleUrls: ['./invoiceview.component.css']
})
export class InvoiceviewComponent implements OnInit {


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

  constructor(private modalService: NgbModal, private serviceObject: ServerService, private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private fullObject: FullComponent,
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
  lstBharathQR = [
    {
      strName: '',
      dblAmt: null,
      strCardNo: null,
      strRefNo: null,
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

  settings2 = tableData.settings2;
  salesRowId = localStorage.getItem('salesRowId');
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
  intRounding;
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

  offerNewItem = {
    intItemId: null,
    strItemName: '',
    dblMarginAmount: 0,
    dblMopAmount: 0,
    strImei: '0',
    GST: 0,
    dblRate: 0,
    dblBuyBack: 0,
    dblDiscount: 0,
    dblDisper: 0,
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
  pntDisable = true;
  dltDissable = true;
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
  blnIndirectDiscount = false;

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
  intCustomerType=null;
  blnCreditSale = false;
  dblPartialAmount = 0;
  dblBalanceAmount = 0;
  saveDisablee = true;
  printInvoice() {
    let dctInvoiceId = { invoiceId: this.invoiceId };

    this.printDisable = true;
    this.serviceObject.postData('invoice/invoice_print/', dctInvoiceId).subscribe(
      response => {

        if (response['status'] == 1) {

          //  const file_data = response['file'];
          //  const pdf = 'data:application/octet-stream;base64,' + file_data.substring(2, file_data.length - 1);
          //  const dlnk = document.createElement('a');
          //  dlnk.href = pdf;
          //  dlnk.download = response['file_name'];
          //  document.body.appendChild(dlnk);
          //  dlnk.click();
          //  dlnk.remove();

          let fileURL = response['file_url'];
          window.open(fileURL, '_blank');

          //  swal.fire('Success!','Successfully downloaded');



          // let file=response['data']
          // let link=this.serviceObject.hostAddress+file;

          // var a = document.createElement('a');
          // document.body.appendChild(a);
          // a.href = link;
          // a.download = "report.xlsx";
          // a.click();
          // window.URL.revokeObjectURL(link);
          // a.remove();
          localStorage.setItem('previousUrl', 'invoice/listinvoice');
          this.router.navigate(['invoice/listinvoice']);

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

  ngOnInit() {
    this.blnStart = true;
    console.log(this.strGroupName);
    console.log(this.lstGroup);
    
    if (this.lstGroup.includes(this.strGroupName)) {
      console.log(this.strGroupName)
      this.saveButtonStatus = false;
    }

    if (localStorage.getItem('enquiryRequestData')) {
      localStorage.setItem('enquiryCustomerNumberStatus', '1');
    }
    if (localStorage.getItem('exchangeListData')) {
      localStorage.setItem('exchangeListStatus', '1');
    }

    this.lstDebit = [
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

    this.lstCredit = [
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


    this.out_of_stock = false;
    localStorage.setItem('invoiceReceipt', '')
    this.blnIndirectDiscount = JSON.parse(localStorage.getItem('bln_indirect_discount'));
    this.url = this.serviceObject['url']
    this.hostaddress = this.serviceObject.hostAddress
    this.hostaddress = this.hostaddress.slice(0, this.hostaddress.length - 1)
    this.printDisable = true; //disable print button
    this.saveDisable = false; //enable save button
    this.blnVerifyInvoice = false;
    this.rejectDisable = false;

    // this.blnCash=true;

    this.blnFinance = false;
    this.blnCreditCard = false;
    this.blnDebitCard = false;
    this.blnPaytm = false;
    this.blnPaytmMall = false;
    this.blnBharathQr = false;
    this.blnGooglepay = false;
    this.fullObject.setInvoice()
    this.objectKeys = Object.keys;
    this.dctData['details'] = []
    this.dctData['billingDetails'] = []
    this.dctData['custEditData'] = []
    this.dctData['lstDeliveryData'] = {}
    this.dctData['lstPaymentData'] = {}
    this.dctData['lstFilterData'] = {}

    this.form = this.formBuilder.group({
      img1: [''],
      img2: [''],
      img3: [''],
    });

    this.source = new LocalDataSource(this.dctData['details']); // create the source
    this.blnCustomerAfterAdd = true;
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
          if (strData.length >= 6) {
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

    this.searchEmi.valueChanges.pipe(
      debounceTime(400))
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstEmiOptions = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('invoice/scheme_typeahead/', { term: strData })
              .subscribe(
                (response) => {
                  this.lstEmiOptions = response['data'];

                }
              );
          }
        }
      }
      );

    this.searchCreditEmi.valueChanges.pipe(
      debounceTime(400))
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstEmiCreditOptions = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('invoice/scheme_typeahead/', { term: strData })
              .subscribe(
                (response) => {
                  this.lstEmiCreditOptions = response['data'];

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

    this.searchProduct.valueChanges.pipe(
      debounceTime(400))
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
            else {

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
                .postData('brands/brands_typeahead/', pushedItems)
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

            else {
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
                .postData('itemcategory/item_typeahead/', pushedItems)
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
            else {
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
                .postData('itemcategory/item_category_typeahead/', pushedItems)
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
            else {
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
                .postData('itemgroup/item_group_typeahead/', pushedItems)
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



    this.searchCustomer.valueChanges.pipe(
      debounceTime(400))
      .subscribe((strData: string) => {
        // if (strData === undefined || strData === null) {
        //   this.lstStaff = [];
        // } else {
        if (strData.length >= 1) {

          this.serviceObject
            .postData('reports/customer_typeahead/', { term: strData })
            .subscribe(
              (response) => {
                this.lstCustomer = response['data'];





              }
            );
        }
        // }
      }
      );

    // this.searchCustomerNo.valueChanges
    // .debounceTime(400)
    // .subscribe((strData: string) => {
    //      if (strData === undefined || strData === null) {
    //     this.lstCustomerNumber = [];
    //   } else {
    //     if (strData.length >= 4) {
    //       const dctData = {}
    //       dctData['term'] = strData;
    //       dctData['blnCustAdd'] =true;
    //       this.serviceObject
    //         .postData('customer/add_customer_pos',dctData)
    //         .subscribe(
    //           (response) => {
    //             this.lstCustomerNumber = response['data'];


    //           }
    //         );
    //       }

    //   }
    //   }
    // );


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



    this.getBankNames()

    if (this.exchangeSalesId) {
      this.getEXchangeData()
    }
    else {
      this.getData()
    }

    this.blnReturn = false;




  }


  calcKfc() {
    // console.log("in calc fn");


    this.intKfcTot = 0;
    this.intExchangeSalesAmount = 0;


    // console.log("######this.lstItemDetails",this.lstItemDetails);
    



    this.lstItemDetails.map(element => {

      let intKfc = 0;
      let tempAmt = 0;
      let AmtWithoutTax = 0;
      let taxPer = 0;
      let taxPoint = 0;

      // console.log(element.intKfc,"element.intKfc");

      if (((element.intKfc == 0) || (element.intKfc == undefined)) && element.intStatus != 2 && !this.blnCheckExchange) {
        taxPer = element.dblCGSTPer + element.dblSGSTPer + 1;
        // console.log("taxPer######",taxPer);
        // console.log("element.dblBuyBack",element.dblBuyBack);
        // console.log("element.dblAmount",element.dblAmount);


       if (this.blnExchangeInvoice) {
          if (element.dblAmount > 0) {
            this.intExchangeSalesAmount = element.dblAmount - element.exchange_sale_amount;
            // console.log(element.dblAmount , element.exchange_sale_amount);

            tempAmt = this.intExchangeSalesAmount;

          }
          else {
            tempAmt = 0;
          }

        }

        else {
          tempAmt = element.dblAmount;
        }


        taxPoint = 1 + (taxPer / 100);

        // console.log(tempAmt,taxPoint,taxPer,"tempAmt,taxPoint");

        AmtWithoutTax = tempAmt / taxPoint;



        if (!this.blnCustomerType) {
          intKfc = (AmtWithoutTax) / 100;

          element.intKfc = Number(intKfc);
        } else {
          element.intKfc = 0;
        }
        // console.log(" intKfcdsf" ,intKfc,"g",AmtWithoutTax)
        // console.log(this.blnExchangeInvoice,'exchange');


        if (!this.blnExchangeInvoice && this.blnStart && element.intStatus != 2) {
          element.dblRate -= Number(element.intKfc);
        }
        // this.blnStart = false;



        if (element.intStatus != 0 && !this.blnCustomerType) {
          this.intKfcTot += Number(intKfc);


        }


      }
      else if (!this.blnCheckExchange) {

        if (element.intStatus != 0 && element.intStatus != 2) {
          let intKfc = 0;


          if (this.blnExchangeInvoice) {
            if (element.dblAmount > 0) {
              this.intExchangeSalesAmount = element.dblAmount - element.exchange_sale_amount;
              tempAmt = this.intExchangeSalesAmount;
            }
            else {
              tempAmt = 0;
            }

            if (!this.blnCustomerType) {
              intKfc = (element.dblRate - element.exchange_sale_amount) / 100
              // console.log(" hvgyhintKfc" , element.dblRate,"",element.exchange_sale_amount)
              element.intKfc = Number(intKfc);
            } else {
              element.intKfc = 0;
            }
          }
          else {
            if (!this.blnCustomerType) {
              intKfc = element.dblRate / 100
              element.intKfc = Number(intKfc);
            } else {
              element.intKfc = 0;
            }
          }


          if (!this.blnCustomerType) {
            this.intKfcTot += Number(intKfc);
          }
          // console.log(" hvgyhintKfc" , this.intKfcTot)

        }
      }

      if (element.intStatus == 2) {
        element.dblRate = element.dblAmount
      }
      if (this.blnCheckExchange && !this.blnCustomerType) {
        this.intKfcTot += Number(element.intKfc);

      }

    })
    // console.log(this.lstItemDetails,"lstItemDetails");



    this.blnStart = false;



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
        Swal.fire('Error!', error, 'error');

      }
    );
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
        Swal.fire('Error!', error, 'error');

      }
    );
  }


  getBankNames() {
    this.lstBankNames = []
    this.serviceObject.getData('invoice/bank_typeahead/').subscribe(res => {

      this.lstBankNames = res['data'];
    });
  }



  // open modal
  opendelivery(content1) {
    this.showModalSerDelivery = this.modalService.open(content1, { centered: true, size: 'sm' });
  }
  openloyalty(content3) {
    this.showModalPoints = this.modalService.open(content3, { centered: true, size: 'sm', windowClass: 'custom-class' });
  }
  opencouponcode(content2) {
    this.showModalCoupon = this.modalService.open(content2, { centered: true, size: 'sm', windowClass: 'custom-class' });
  }
  openfilteritem(filteritem) {
    this.showModalFilter = this.modalService.open(filteritem, { size: 'lg', windowClass: 'filteritemclass' });
  }

  calcReceiptAmt(item, event) {

    // item['added']=0;

    // this.receiptTot=0;


    this.tempBalance = this.intBalanceAmt;

    if (this.tempGrandTot == 0) {
      this.tempGrandTot = this.intGrandTot;
    }


    if (item.receipt) {
      if (this.intBalanceAmt == 0) {
        Swal.fire('Already paid');
        item.receipt = false;
        event.checked = false;
        event.source.checked = false;

        return;
      }
      this.receiptTot += item.amount;
    }
    else {
      this.receiptTot -= item.amount;
      // if(this.intBalanceAmt==0){
      //   if(this.intReceiptTot>item['amount']){
      //     this.intBalanceAmt=this.intReceiptTot-item['added'];
      //   }
      //   else{
      //     this.intBalanceAmt+=item['added'];
      //   }
      //   this.intReceiptTot=this.intBalanceAmt;

      //   return;
      // }
      // else{
      //   if(this.intReceiptTot>item['amount']){
      //     this.intBalanceAmt=this.intReceiptTot-item['added'];
      //   }
      //   else{
      //     this.intBalanceAmt+=item['added'];
      //   }
      //   this.intReceiptTot=this.intBalanceAmt;

      //   return;
      // }

    }

    // this.dctData['lstPaymentData'][4]['dblAmt'] = this.receiptTot;

    // console.log("this.dctData['lstPaymentData'][4]['dblAmt']",this.dctData['lstPaymentData'][4]['dblAmt']);


    this.intReceiptTot;
    this.tempReceiptTot = 0;

    // if(this.intBalanceAmt<this.receiptTot){

    if (this.intBalanceAmt < item.amount) {

      this.tempReceiptTot = this.intBalanceAmt;
    }
    else {
      this.tempReceiptTot = this.receiptTot;
    }

    item['added'] = this.tempReceiptTot;


    this.intReceiptTot += this.tempReceiptTot;

    // console.log("this.intReceiptTot",this.intReceiptTot);

    // ====================================================/
    let count = 0
    this.intReceiptTot
    this.lstReceipt.map(items => {
      if (items.receipt) {
        count += 1
        // intReceiptTot
        // this.intReceiptTot+=items['amount']
      }
    })
    if (count == 0) {
      this.intReceiptTot = 0

    }


    // ====================================================/


    if (this.blnReceipt && !this.blnFinance) {
      // console.log("this.intGrandTot",this.intGrandTot);
      // console.log("this.intReceiptTot",this.intReceiptTot);


      this.intBalanceAmt = this.tempGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.tempReceiptTot + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount)
    }
    else if (this.blnFinance && !this.blnReceipt) {
      this.intBalanceAmt = (this.tempGrandTot - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
    }
    else if (this.blnReceipt && this.blnFinance) {

      // console.log("(this.tempGrandTot",this.tempGrandTot);
      // console.log("this.intFinanceAmt-",this.intFinanceAmt);
      // console.log("this.intReceiptTot",this.intReceiptTot);
      // console.log("this.intCreditAmt",this.intCreditAmt);
      // console.log("this.intReceivedAmt",this.intReceivedAmt);
      // console.log("this.intDebitAmt",this.intDebitAmt);

      this.intBalanceAmt = (this.tempGrandTot - this.intFinanceAmt - this.tempReceiptTot) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
    }
    else {
      this.intBalanceAmt = this.tempGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
    }

    // console.log("After this.intBalanceAmt",this.intBalanceAmt);
    // this.billingDatails("other",0);

    this.tempGrandTot = this.intBalanceAmt;


  }
  // ===========================================================================
  total_receipt = 0;

  BalanceAmountCalc() {

    // console.log("this.intReceivedAmt",this.intReceivedAmt);
    // console.log("this.intCreditAmt",this.intCreditAmt);
    // console.log("this.intDebitAmt",this.intDebitAmt);
    // console.log("BalanceAmountCalc this.total_receipt",this.total_receipt);
    // console.log("this.intPaytmAmount",this.intPaytmAmount);
    // console.log("this.intPaytmMallAmount",this.intPaytmMallAmount);
    this.intGrandTot = Number(this.intGrandTot).toFixed()
    // console.log(this.intGrandTot,"this.intGrandTot");
    this.intGrandTot = Number(this.intGrandTot).toFixed()

    if (this.intApprove == 4) {
      if (this.blnReceipt && !this.blnFinance) {
        // console.log('sadd');

        this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.total_receipt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount)
      }
      else if (this.blnFinance && !this.blnReceipt) {
        this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;

        // this.intBalanceAmt= this.intBalanceAmt+this.intExtraFinanceAmt

      }
      else if (this.blnReceipt && this.blnFinance) {
        this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt - this.total_receipt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;

        // this.intBalanceAmt= this.intBalanceAmt+this.intExtraFinanceAmt

      }
      else {
        this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
      }
    }
    else {
      if (this.blnReceipt && !this.blnFinance) {
        // console.log('sadd');

        this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.total_receipt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount)
      }
      else if (this.blnFinance && !this.blnReceipt) {
        this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;

        // this.intBalanceAmt= this.intBalanceAmt+this.intExtraFinanceAmt

      }
      else if (this.blnReceipt && this.blnFinance) {
        this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt - this.total_receipt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;

        // this.intBalanceAmt= this.intBalanceAmt+this.intExtraFinanceAmt

      }
      else {
        this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
      }
    }
    // console.log("########BALANCE",this.intBalanceAmt);

  }

  calcReceiptAmt1(item, event) {

    // console.log("item.recipt",item);

    // console.log("item.receipt",item.receipt)
    // if(item.receipt=false){
    //   item.checked=false
    // }
    // else{
    //   item.checked=true
    // }
    if (item.receipt) {


      if (this.intBalanceAmt == 0) {
        Swal.fire('Already paid');
        item.receipt = false;
        event.checked = false;
        event.source.checked = false;
        this.intBalanceAmt = 0;
        return;
      }
    }



    this.total_receipt = 0
    let receipt_total = 0
    this.intReceiptTot = 0
    this.lstReceipt.map(items => {

      if (items.receipt) {

        this.BalanceAmountCalc()

        if (this.intBalanceAmt != 0) {

          // console.log("IF");         
          // console.log("IN IF this.intBalanceAmt",this.intBalanceAmt);

          if (this.intBalanceAmt < items.amount) {

            // console.log("this.intBalanceAmt<items.amount",this.intBalanceAmt);

            items['added'] = this.intBalanceAmt

            // console.log("before receipt_total",receipt_total);

            receipt_total += items['added']
            // console.log("after receipt_total",receipt_total);


          }
          else {


            items['added'] = items.amount
            receipt_total += items['added']
          }

          // console.log("receipt_total in if",receipt_total);

        } else {
          // console.log("ELSE");          
          // console.log("IN ELSE this.intBalanceAmt",this.intBalanceAmt);

          this.BalanceAmountCalc()
          if (this.intBalanceAmt == 0) {
            Swal.fire('Already paid');
            item.receipt = false;
            event.checked = false;
            event.source.checked = false;
            this.intBalanceAmt = 0;
            return;
          }

          if (this.intBalanceAmt < items.amount) {
            items['added'] = this.intBalanceAmt
            // this.total_receipt += items['added']
            receipt_total += items['added']

            // console.log('3',receipt_total);
          }
          else {
            items['added'] = items.amount

            // this.total_receipt += items['added']
            receipt_total += items['added']
            // console.log('4',receipt_total);
          }
          // console.log("receipt_total in else",receipt_total);
          // 
        }
        // }



      } else {
        // console.log("IF"); 

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
    if (this.intBalanceAmt < 0) {
      this.intReceiptTot = this.total_receipt + this.intBalanceAmt
      this.intBalanceAmt = 0;
    }
    else {
      // console.log("ELSEdfg");
      this.intReceiptTot = this.total_receipt

    }




    // console.log("LAST this.intReceiptTot",this.intReceiptTot);
    // console.log("LAST this.intBalanceAmt",this.intBalanceAmt);


  }


  // ===========================================================================
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
  openIndirectDiscount(discount, id) {
    // this.discoundIndex=id
    this.currentIndex = id
    this.showModalDiscount = this.modalService.open(discount, { centered: true, size: 'sm', windowClass: 'custom-class' });
  }
  opensalesreturn(salesreturn) {
    this.blnReturnData = false;
    this.showModalReturn = this.modalService.open(salesreturn, { centered: true, size: 'lg' });
  }

  openReturnDetails(returnItem, index, id) {
    // this.currentIndex=index
    this.currentIndex = index
    this.returnId = id
    //to check the returned item is already exit on the table
    if (!this.lstcheckReturn.includes(this.currentIndex)) {
      this.lstcheckReturn.push(this.currentIndex)
      this.dctReturnDetail[this.currentIndex] = {
        strRemark: '',
        image: '',
        blnDamage: false,
        imgURL: ''
      }
    }

    this.showModalReturnDetails = this.modalService.open(returnItem, { size: 'sm' });
  }
  openComboOffers(id, item, comboOffer, action) {
    this.itemIndex = id;
    this.offerItemId = item.intItemId;
    this.comboShow[id] = 'none';

    this.intStyleIndex = 0;
    this.offerItem = item.strItemName;
    let dctItem = { itemId: item.intItemId };
    this.dctCombo = {};
    this.lstCombo = [];
    this.serviceObject.postData('add_combo/item_offers/', dctItem).subscribe(result => {

      if (result.status == 1) {
        let objLen = Object.keys(result['data']);

        if (objLen.length == 0) {
          this.comboShow[id] = 'none';
        }
        else {
          this.comboShow[id] = 'block';
          this.dctLen = Object.keys(result['data']);
          this.dctCombo = result['data'];
          this.lstCombo = Object.keys(this.dctCombo);
        }
      }
      else if (result.status == 0) {
        swal.fire('Error!', result['data'], 'error');

      }
    },
      (error) => {
        swal.fire('Error!', 'Server Error!!', 'error');
      });

    if (action == 'click') {
      this.showModalOffer = this.modalService.open(comboOffer, { centered: true, size: 'lg' });
    }
  }

  applyOffer(key, data) {

    this.removeAppliedOffer(this.itemIndex);

    this.lstItemDetails[this.itemIndex]['dblDiscount'] -= this.offerDis[this.itemIndex];
    this.lstItemDetails[this.itemIndex]['dblAmount'] += this.offerDis[this.itemIndex];

    this.lstItemDetails[this.itemIndex]['dblAmount'] = (this.lstItemDetails[this.itemIndex]['dblAmount']).toFixed(2)

    this.offerDis[this.itemIndex] = 0;
    if (this.offerApplied[this.itemIndex] || this.lstOfferItems.length > 0) {
      swal.fire({
        position: "center",
        type: "warning",
        text: "An offer already applied will be replaced!",
        showConfirmButton: true,
        allowOutsideClick: false,

      }).then((result) => {
        if (result.value) {
          // this.removeAppliedOffer(this.itemIndex);
        }
      });
    }
    this.hideModal();
    this.lstOfferItems = [];
    // console.log("####this.dctCombo[key][data]",this.dctCombo[key][data]);

    for (let itemQty = 0; itemQty < this.dctCombo[key][data]['int_quantity'] - 1; itemQty++) { // push number of items

      this.offerNewItem = { // push empty row
        intItemId: null,
        GST: 0,
        strItemName: '',
        dblMopAmount: 0,
        dblMarginAmount: 0,
        strImei: '0',
        dblRate: 0,
        dblBuyBack: 0,
        dblDiscount: 0,
        dblDisper: 0,
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


      this.offerNewItem['intItemId'] = this.offerItemId;
      this.offerNewItem['strItemName'] = this.offerItem;

      this.lstOfferItems.push(this.offerNewItem);

    }


    let discounts = {};

    discounts = this.dctCombo[key][data]['discount'];

    for (let dis in discounts) {
      if (discounts[dis]['discount_items']) {
        // if(discounts[dis]['int_discount_type']==1){
        for (let disItem in discounts[dis]['discount_items']) {
          let qtyVal = discounts[dis]['discount_items'][disItem]['int_quantity'];
          for (let itemQty = 0; itemQty < qtyVal; itemQty++) {
            this.offerNewItem = { // push empty row
              intItemId: null,
              GST: 0,
              strItemName: '',
              dblMopAmount: 0,
              dblMarginAmount: 0,
              strImei: '0',
              dblRate: 0,
              dblBuyBack: 0,
              dblDiscount: 0,
              dblDisper: 0,
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

            this.offerNewItem['intItemId'] = discounts[dis]['discount_items'][disItem]['fk_item_id'];
            this.offerNewItem['strItemName'] = discounts[dis]['discount_items'][disItem]['fk_item__vchr_name'];

            this.lstOfferItems.push(this.offerNewItem);

          }
          if (discounts[dis]['discount_items'][disItem]['dbl_amt']) {

            this.offerNewItem['dblDiscount'] = discounts[dis]['discount_items'][disItem]['dbl_amt'];
          }
          else {

            this.offerNewItem['dblDisper'] = discounts[dis]['discount_items'][disItem]['dbl_percent'];

          }
        }
      }
      if (discounts[dis]['int_discount_type'] == 2) {

        this.lstItemDetails[this.itemIndex]['dblDiscount'] += discounts[dis]['dbl_amt'];
        this.offerDis[this.itemIndex] = discounts[dis]['dbl_amt'];

      }
      if (discounts[dis]['int_discount_type'] == 1) {
        let disAmt = (this.lstItemDetails[this.itemIndex]['dblRate'] * discounts[dis]['dbl_percent']) / 100;
        this.lstItemDetails[this.itemIndex]['dblDiscount'] += disAmt;
        this.offerDis[this.itemIndex] = disAmt;


      }
      this.changeDiscountValue(this.itemIndex, 'editRow');
    }

    this.offerApplied[this.itemIndex] = true;
  }

  addofferRow(lstOfferItems) {

    this.linkId = this.offerItemId;

    let lstLen = this.lstItemDetails.length;

    let pushFlag = true;

    for (let key in lstOfferItems) {

      if (lstOfferItems[key].strImei == "0" || !lstOfferItems[key].strImei) {
        this.toastr.error('Please fill Imei', 'Error!');
        pushFlag = false;
        return;

        // break;
      }
      if (lstOfferItems[key].strItemName.toUpperCase() == 'GDP') {
        lstOfferItems[key].int_type = 1;
      }
      if (lstOfferItems[key].strItemName.toUpperCase() == 'GDEW (EXTENDED WARRANTY)') {
        lstOfferItems[key].int_type = 2;
      }
    }

    for (let key in lstOfferItems) {


      this.comboShow[lstLen] = 'none';
      this.linkShow[lstLen] = 'block';
      this.offerDis.push(0);




      this.lstItemDetails.push(lstOfferItems[key]);
      this.lstItemDetails[lstLen]['offerId'] = this.linkId;
      lstLen++;
      // this.lstOfferItems.splice(parseInt(key),1);
    }
    // console.log("######this.lstItemDetails",this.lstItemDetails);
    // this.lstItemDetails[this.itemIndex]['dblDiscount']-=this.offerDis[this.itemIndex];
    // this.lstItemDetails[this.itemIndex]['dblAmount']+=this.offerDis[this.itemIndex];
    // console.log(this.offerDis);

    // this.offerDis[this.itemIndex] = 0;
    // console.log(this.offerDis);

    // let temp=0;
    // this.offerDis[this.itemIndex]=JSON.parse(JSON.stringify(temp));
    // this.comboShow[lstLen]='none'; // for last raw

    if (pushFlag) {
      // this.lstItemDetails.push(...lstOfferItems);

      this.lstOfferItems = [];
    }

    this.billingDatails('other', 0);

  }

  clearofferRow() {
    this.lstItemDetails[this.itemIndex]['dblDiscount'] -= this.offerDis[this.itemIndex];
    this.lstItemDetails[this.itemIndex]['dblAmount'] += this.offerDis[this.itemIndex];

    this.lstItemDetails[this.itemIndex]['dblAmount'] = this.lstItemDetails[this.itemIndex]['dblAmount'].toFixed(2)
    // console.log(this.offerDis);

    this.offerDis[this.itemIndex] = 0;

    this.lstOfferItems = [];
    this.offerApplied[this.itemIndex] = false;


  }

  openExchangeImage(exchange, index, id) {
    this.currentIndex = index
    this.dctExchangeImage[this.currentIndex] = this.lstItemDetails[this.currentIndex]['dctImages']
    this.showModalExchange = this.modalService.open(exchange, { centered: true, size: 'lg' });
  }

  hideModal() {
    this.showModalOffer.close();
  }


  productNgModelChanged(event) {

    if (this.currentProduct != this.selectedProduct) {
      this.intProductId = null;
      this.strProduct = '';
    }
  }

  productChanged(item) {
    this.currentProduct = item.name
    this.intProductId = item.id;
    this.strProduct = item.name;
    this.selectedProduct = item.name;
  }
  brandNgModelChanged(event) {
    if (this.currentBrand != this.selectedBrand) {
      this.intBrandId = null;
      this.strBrand = '';
    }
  }
  brandChanged(item) {
    this.currentBrand = item.name;
    this.intBrandId = item.id;
    this.strBrand = item.name;
    this.selectedBrand = item.name;

  }
  itemNgModelChanged(event) {
    if (this.currentItem != this.selectedItem) {
      this.intItemId = null;
      this.strItem = '';
    }
  }
  itemChanged(item) {
    this.currentItem = item.code_name;
    this.intItemId = item.id;
    this.strItem = item.code_name;
    this.selectedItem = item.code_name;

  }

  itemCategoryNgModelChanged(event) {
    if (this.currentItemCategory != this.selectedItemCategory) {
      this.intItemCategoryId = null;
      this.strItemCategory = '';
    }
  }
  itemCategoryChanged(item) {
    this.currentItemCategory = item.name;
    this.intItemCategoryId = item.id;
    this.strItemCategory = item.name;
    this.selectedItemCategory = item.name;
  }
  itemGroupNgModelChanged(event) {
    if (this.currentItemGroup != this.selectedItemGroup) {
      this.intItemGroupId = null;
      this.strItemGroup = '';
    }
  }
  itemGroupChanged(item) {
    this.currentItemGroup = item.name;
    this.intItemGroupId = item.id;
    this.strItemGroup = item.name;
    this.selectedItemGroup = item.name;

  }



  itemNameChanged(item) {
    //  console.log(item,"item");
    //   this.IntItemNameId = item.strItemId;
    //   this.newItem.intItemId=item.strItemId;
    //   this.strItemName = item.strItemName;
    // this.newItem.strImei=null
    // this.newItem.vchr_product_name=item.vchr_product_name;
    // this.newItem.imeiStatus=item.imei_status;
    // this.newItem.dblRate=null
    // this.newItem.dblBuyBack=null
    // this.newItem.dblDiscount=null
    // this.newItem.dblCGST=0
    // this.newItem.dblSGST=0
    // this.newItem.dblIGST=0
    // this.newItem.dblAmount=0
    // this.newItem.strItemCode=item.strItemCode
    // this.newItem.blnService = item.blnService;
    // this.newItem.dblCGSTPer=0
    // this.newItem.dblSGSTPer=0
    // this.newItem.dblIGSTPer=0
    // this.newItemUppercase=(item.strItemName).toUpperCase()
    // this.newItemCode=item.strItemCode

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
        // item.dblRate=(item.dblRate).toFixed(2);

        this.newItem.dblMopAmount = item.dblMopAmount
        this.newItem.dblMarginAmount = item.dblMarginAmount

        // item.dblRate = item.dblAmount - item.dblIGST + item.dblBuyBack + item.dblDiscount

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

    // console.log(this.newItemUppercase,"fjjshfjksfk");

  }

  cityChanged(item) {
    this.currentCity = item.vchr_name;
    this.intCityId = item.pk_bint_id;
    this.strCity = item.vchr_name;
    this.strPincode = item.vchr_pin_code;
    this.selectedCity = item.vchr_name;
  }
  // cityNgModelChanged(event){
  //   console.log(this.currentCity!=this.selectedCity,this.currentCity,this.selectedCity)
  //   if(this.currentCity!=this.selectedCity){
  //     console.log("state",this.currentState!=this.selectedState,this.currentState,this.selectedState)
  //     this.strCity = '';
  //     this.intCityId = null;
  //   }
  // }
  // stateNgModelChanged(event){
  //   console.log("if")
  //   console.log(this.currentState!=this.selectedState,this.currentState,this.selectedState)
  //   if(this.currentState!=this.selectedState){
  //     this.strState = '';
  //     this.intStateId = null;
  //   }
  // }
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
  custCityChanged(item) {
    this.intCustCityId = item.pk_bint_id;
    this.strCustCity = item.vchr_name;
    this.strCustPinCode = item.vchr_pin_code;
  }

  stateChanged(item) {
    this.currentState = item.vchr_name;
    this.intStateId = item.pk_bint_id;
    this.strState = item.vchr_name;
    this.strStateCode = item.vchr_code;
    this.selectedState = item.vchr_name;
  }

  custStateChanged(item) {
    this.intCustStateId = item.pk_bint_id;
    this.strCustState = item.vchr_name;
  }

  ImeiCopy = ''
  copyImei(item) {
    this.ImeiCopy = JSON.parse(JSON.stringify(item['strImei']))
  }

  focusOutImei(item, index) {

    this.out_of_stock = false;
    // console.log(item,this.lstItemDetails);
    // console.log(this.ImeiCopy);
    // console.log("@@@@@@@@@this.offerDis[this.itemIndex]",this.offerDis[this.itemIndex]);

    // item['strImei']


    let blnImeiExists = true
    let blnCheck = true
    let dct = {}
    dct['pk_bint_id'] = item.intItemId
    dct['intCustId'] = this.intCustId
    dct['strImei'] = ''
    // ================================================================================

    // console.log('list',this.lst_imei,index);

    if (this.lst_imei.includes(item['strImei'])) {
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
      // console.log("if",item['imeiStatus'])
      for (let i = 0; i < this.lstItemDetails.length; i++) {
        if (this.lstItemDetails[i].hasOwnProperty('blnService')) {
          // console.log("if",item['imeiStatus'])
          if (item.blnService === false
            && this.lstItemDetails[i]['blnService'] === item.blnService
            && item['imeiStatus'] == true && this.lstItemDetails[i]['strImei'] === item['strImei'] && item['strItemCode'] != 'GDC00001' && item['strItemCode'] != 'GDC00002') {
            // console.log("this.lstItemDetails[i]['imei_status']",item['imei_status'],this.lstItemDetails[i])
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
              // this.preItemList[index]['strImei']='0'
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

      //  }else{

      //  }
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
          // this.preItemList[index]['strImei']='0'
        }
        return false
      }
      else {
        // if(this.newItemUppercase!='GDEW' && this.newItemUppercase!='GDP'){
        // }

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
              // item.dblCGST=res['data']['dblCGST']
              // item.dblSGST=res['data']['dblSGST']
              // item.dblSGSTPer=res['data']['dblSGSTPer']
              // item.dblCGSTPer=res['data']['dblCGSTPer']

              // item.dblRate=res['data']['dblRate']
              // item.dblAmount= Number(((item.dblCGST+item.dblSGST+item.dblRate)-(item.dblBuyBack+item.dblDiscount)).toFixed(2))

              if (!this.blnCustomerType) {
                item.dblCGST = res['data']['dblCGST']
                item.dblSGST = res['data']['dblSGST']
                item.dblSGSTPer = res['data']['dblSGSTPer']
                item.dblCGSTPer = res['data']['dblCGSTPer']
                item.GST = res['data']['GST']
                item.dblCGST = (item.dblAmount / ((100 + item.dblSGSTPer + item.dblCGSTPer) / 100)) * (res['data']['dblCGSTPer'] / 100)
                item.dblSGST = (item.dblAmount / ((100 + item.dblSGSTPer + item.dblCGSTPer) / 100)) * (res['data']['dblSGSTPer'] / 100)
              }
              item.dblAmount = res['data']['dblRate']
              item.dblMopAmount = res['data']['dblMopAmount']
              // item.dblMarginAmount=res['data']['dblMarginAmount']

              // console.log("item.dblBuyBack",item.dblBuyBack);
              // console.log("item.dblDiscount item.dblCGST item.dblSGST",item.dblDiscount,item.dblCGST,item.dblSGST);


              item.dblRate = Number((item.dblAmount - (item.dblCGST + item.dblSGST) + (item.dblDiscount + item.dblBuyBack)).toFixed(2));

              // item.dblRate=(item.dblRate).toFixed(2);


              // item.dblRate = item.dblAmount - (item.dblCGST+item.dblSGST) + item.dblBuyBack + item.dblDiscount
              this.calcKfc()
            }
            else {
              // item.dblIGST=res['data']['dblIGST']
              // item.dblIGSTPer=res['data']['dblIGSTPer']

              // item.dblRate=res['data']['dblRate']
              // item.dblAmount = Number(((item.dblIGST + item.dblRate) - (item.dblBuyBack + item.dblDiscount)).toFixed(2))

              if (!this.blnCustomerType) {
                item.dblIGST = res['data']['dblIGST']
                item.dblIGSTPer = res['data']['dblIGSTPer']
                item.dblIGST = (item.dblAmount / ((100 + item.dblIGSTPer) / 100)) * (res['data']['dblIGSTPer'] / 100)
                item.GST = res['data']['GST']
              }
              item.dblAmount = res['data']['dblRate']



              item.dblRate = Number((item.dblAmount - (item.dblIGST) + (item.dblDiscount + item.dblBuyBack)).toFixed(2));
              // item.dblRate=(item.dblRate).toFixed(2);

              item.dblMopAmount = res['data']['dblMopAmount']
              // item.dblMarginAmount=res['data']['dblMarginAmount']

              // item.dblRate = item.dblAmount - item.dblIGST + item.dblBuyBack + item.dblDiscount

            }
            item.mrp = res['data']['mrp'];
            // let itemRate=res['data']['dblRate'];
            let itemRate = item.dblRate;

            if (index == 'offerItem') {

              if (item.dblDisper != 0) { // If discount percentage                

                item.dblDiscount = ((itemRate * item.dblDisper) / 100) + this.offerDis[this.itemIndex];

              }

            }


            this.billingDatails("other", 0);

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


  getData() {

    this.dctData['billingdetails'] = []
    this.dctData['billingdetailsCopy'] = []
    this.dctData['intId'] = this.salesRowId
    this.dctData['bln_approve'] = this.blnApproved
    this.dctData['int_approve'] = this.intApprove
    // this.dctData['exchangeImage']={}
    // if(this.exchangeSalesId){
    //   this.dctData['exchangeSalesId'] = this.exchangeSalesId;
    // }
    this.serviceObject.postData('invoice/sales_list/', this.dctData).subscribe(res => {

      if (res.status == 1) {
        this.blnStatus = res['data']['bln_status']
        this.lstItemDetails = res['data']['lstItems'];
        this.intApprove = res['data']['int_approve']
        this.blnApproved = res['data']['bln_approve']
        this.intCustomerType = res['data']['int_cust_type'];
        this.dblPartialAmount = res['data']['dblPartialAmount']
        this.dblBalanceAmount = res['data']['dblBalanceAmount'];
        if (res['data']['int_credit_sale']) {
          this.int_Credit_Sale = res['data']['int_credit_sale'];
          if (res['data']['int_credit_sale'] == 1) {
            this.blnCreditSale = true;
            this.intCreditSale = true;

          }

        }



        this.lstItemDetails.forEach(element => {


          if (element.dblBuyBack == 0) {
            element.dblBuyBack = null;
          }
          if (element.dblDiscount === 0) {
            element.dblDiscount = null;
          }
          if (element.dblMarginAmount === 0) {
            element.dblMarginAmount = null;
          }

        });




        if (res['data']['int_cust_type'] == 3) {


          this.blnCustomerType = true;
          this.lstItemDetails.forEach(element => {
            if (element.GST) {
              element.GST = 0;
            }
            if (element.dblCGST) {
              element.dblCGST = 0;
            }
            if (element.dblCGSTPer) {
              element.dblCGSTPer = 0;
            }
            if (element.dblSGST) {
              element.dblSGST = 0;
            }
            if (element.dblSGSTPer) {
              element.dblSGSTPer = 0;
            }

          });
        }
        if (res['data']['int_cust_type'] == 1 || res['data']['int_cust_type'] == 2) {
          this.blnMakePayment = false
          this.intCreditBalance = res['data']['dbl_credit_balance']
        }
        else {
          this.blnMakePayment = true
        }
        if (res['data']['int_enquiry_type'] == 2 || res['data']['int_enquiry_type'] == 3) {
          this.blnAmazonOrFlipkart = true;
        }
        this.lstItemDetailsCopy = JSON.parse(JSON.stringify(res['data']['lstItems']));

        if (res['data']['admin_tools']['ADDITION']) {
          this.lstAdditions = res['data']['admin_tools']['ADDITION'];

        }
        else {
          this.lstAdditions = [];
        }
        if (res['data']['admin_tools']['DEDUCTION']) {
          this.lstDeductions = res['data']['admin_tools']['DEDUCTION'];

        }
        else {
          this.lstDeductions = [];
        }
        this.selectedReturnCustomerId = res['data']['intCustId'];
        this.intFinanceId = res['data']['int_fin_id'];
        // if(res['data']['dbl_kfc_amount']){
        //   this.intKfc = res['data']['dbl_kfc_amount'].toFixed(2);
        // }


        this.lstItemDetails.forEach(element => {
          if (element.intStatus == 2) {
            this.blnExchange = true;
            this.saveDisable = true
            return;
          }
        });


        // if(this.lstAdditions){
        // this.lstAdditions.map(element=>{
        //   this.dctAdditions={}
        //   this.dctAdditions['name']=element;
        //   this.dctAdditions['value'] = 0;
        //   this.lstAdditions1.push(this.dctAdditions);

        // })
        // }

        // if(this.lstDeductions){

        // this.lstDeductions.map(element=>{        
        //   this.dctDeductions={}
        //   this.dctDeductions['name']=element;
        //   this.dctDeductions['value'] = 0;
        //   this.lstDeductions1.push(this.dctDeductions);

        // })
        // }

        // this.lstDeductions.map(element=>{
        //   this.dctDeductions={};
        //   this.dctDeductions['name']=element;
        //   this.dctDeductions['value']=null;

        //   this.lstDeductions1.push(this.dctDeductions);
        // })


        // this.preItemList=res['data']['lstItems'];
        // console.log("#########preItemList getData",this.preItemList);






        this.intCustId = res['data']['intCustId']
        this.intContactNo = res['data']['intContactNo']
        this.strEmail = res['data']['strCustEmail']
        this.strStaff = res['data']['strStaffName'];
        this.strName = res['data']['strCustName'].toUpperCase()
        this.strInitRemarks = res['data']['txtRemarks']
        if (!this.blnCustomerType) {
          this.blnCheckIGST = res['data']['blnIGST']
        }
        this.selectedCity = res['data']['strLocation']
        this.strCity = res['data']['strLocation']
        this.intCityId = res['data']['intLocation']
        this.selectedState = res['data']['strState']
        this.strState = res['data']['strState']
        this.intStateId = res['data']['intState']
        // -------------------------------------------------
        this.intStateIdPrevious = res['data']['intState']
        // -------------------------------------------------
        this.strGSTNo = res['data']['strGSTNo']
        this.strAddress = res['data']['txtAddress']
        this.strPincode = res['data']['intPinCode']
        this.intAmtPerPoints = res['data']['intAmtPerPoints']
        this.intTotPoints = res['data']['intLoyaltyPoint']
        this.intTotAmt = this.intAmtPerPoints * this.intTotPoints
        this.intTotPointsCopy = res['data']['intLoyaltyPoint']

        this.intSalesCustId = res['data']['intSalesCustId']
        this.lstFinanceDetails = res['data']['lst_fin_data']
        this.intEnquiryType = res['data']['int_enquiry_type']
        this.lstFinanceDetails.forEach(element => {
          if (element.name == 'Margin money') {
            this.intMarginMoney = element.value
          }

          if (element.name == 'Processing fee') {
            this.intProcessingFee = element.value
          }

          if (element.name == 'Service charge') {
            this.intServiceCharge = element.value
          }

          if (element.name == 'DBD charge') {
            this.intDBDCharge = element.value
          }
        });


        // ------------------------------------------------
        this.int_editcount = res['data']['edit_count']
        if (this.int_editcount == 0) {
          this.int_cust_edit = 1
        }
        else (
          this.int_cust_edit = 2
        )
        // this. int_cust_edit= 1  //cancelled

        // ------------------------------------------------



        if (res['data'].hasOwnProperty('vchrFinanceName')) {
          // ===============================
          // this.blnPayment = true
          // ===============================
          this.dctData['lstPaymentData'][0] = {}
          this.blnFinance = true
          this.intDownPayment = res['data']['dblDownPayment']
          this.intEMI = res['data']['dblEMI']
          this.intFinanceAmt = res['data']['dblFinanceAmt']
          this.intDeliveryNo = res['data']['vchrFinOrdrNum']
          this.strFinanceName = res['data']['vchrFinanceName']
          this.intExtraFinanceAmt = res['data']['dbl_total_fin_amount'] //Down payment+ processing fee + service charge + DBD charge 

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
          if (res['data']['vchrFinanceSchema']) {
            this.strFinanceScheme = res['data']['vchrFinanceSchema']
          }
          else {
            this.strFinanceScheme = "---"
          }
        }



        //
        let id = 0;
        this.lstItemDetails.map(element => {

          // calculate rate
          this.lstItemAmount[element.intItemId] = Number(element.dblAmount.toFixed(2))

          if (this.blnCheckIGST) {
            // element.dblAmount= element.dblRate+ element.dblIGST-element.dblBuyBack-element.dblDiscount
            element.dblRate = element.dblAmount - element.dblIGST + element.dblBuyBack + element.dblDiscount

          }
          else {
            // element.dblAmount= element.dblRate+ element.dblCGST+ element.dblSGST-element.dblBuyBack-element.dblDiscount
            element.dblRate = element.dblAmount - (element.dblCGST + element.dblSGST) + element.dblBuyBack + element.dblDiscount

          }


          this.lst_imei.push(element['strImei'])
          //set combo offer icon
          let tempDict = {};
          tempDict['intItemId'] = element['intItemId'];
          tempDict['strItemName'] = element['strItemName'];
          this.comboShow.push('none');
          this.linkShow.push('none');
          this.offerDis.push(0);

          this.openComboOffers(id, tempDict, 'comboOffer', 'show');
          id++;

        })




        this.dctData['custEditData']['strEmail'] = res['data']['strCustEmail']
        this.dctData['custEditData']['strAddress'] = res['data']['txtAddress']
        this.dctData['custEditData']['strState'] = res['data']['strState']
        this.dctData['custEditData']['intStateId'] = res['data']['intState']
        this.dctData['custEditData']['intCityId'] = res['data']['intLocation']
        this.dctData['custEditData']['strCity'] = res['data']['strLocation']
        this.dctData['custEditData']['strGSTNo'] = res['data']['strGSTNo']
        this.dctData['custEditData']['strName'] = res['data']['strCustName']; //

        this.billingDatails("other", 0);

        // navigate to jio invoice view
        // this.lstItemDetails.map(element=>{
        //   if(element.intStatus == 3 || element.intStatus == 4){
        //     this.router.navigate(['invoice/jioinvoiceview']);
        //   }

        // })

        // Onload Spinner
        this.showSpinner()

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

  getEXchangeData() {

    this.dctData['billingdetails'] = []
    this.dctData['billingdetailsCopy'] = []

    const dictData = {}

    dictData['intId'] = this.exchangeSalesId;


    this.serviceObject.postData('exchange_sales/exchange_sales/', dictData).subscribe(res => {

      if (res.status == 1) {
        this.lstItemDetails = res['data']['lstItems'];

        this.blnExchangeInvoice = res['data']['bln_exchange'];

        this.blnCheckExchange = res['data']['bln_exchange'];

        this.lstItemDetailsCopy = JSON.parse(JSON.stringify(res['data']['lstItems']));

        if (res['data']['admin_tools']['ADDITION']) {
          this.lstAdditions = res['data']['admin_tools']['ADDITION'];

        }
        else {
          this.lstAdditions = [];
        }
        if (res['data']['admin_tools']['DEDUCTION']) {
          this.lstDeductions = res['data']['admin_tools']['DEDUCTION'];

        }
        else {
          this.lstDeductions = [];
        }
        this.selectedReturnCustomerId = res['data']['intCustId'];
        this.intFinanceId = res['data']['int_fin_id'];
        // if(res['data']['dbl_kfc_amount']){
        //   this.intKfc = res['data']['dbl_kfc_amount'].toFixed(2);
        // }


        this.lstItemDetails.forEach(element => {
          if (element.intStatus == 2) {
            this.blnExchange = true;
            this.saveDisable = true
            return;
          }
        });



        // if(this.lstAdditions){
        // this.lstAdditions.map(element=>{
        //   this.dctAdditions={}
        //   this.dctAdditions['name']=element;
        //   this.dctAdditions['value'] = 0;
        //   this.lstAdditions1.push(this.dctAdditions);

        // })
        // }

        // if(this.lstDeductions){

        // this.lstDeductions.map(element=>{        
        //   this.dctDeductions={}
        //   this.dctDeductions['name']=element;
        //   this.dctDeductions['value'] = 0;
        //   this.lstDeductions1.push(this.dctDeductions);

        // })
        // }

        // this.lstDeductions.map(element=>{
        //   this.dctDeductions={};
        //   this.dctDeductions['name']=element;
        //   this.dctDeductions['value']=null;

        //   this.lstDeductions1.push(this.dctDeductions);
        // })


        // this.preItemList=res['data']['lstItems'];
        // console.log("#########preItemList getData",this.preItemList);

        this.intCustId = res['data']['intCustId']
        this.intContactNo = res['data']['intContactNo']
        this.strEmail = res['data']['strCustEmail']
        this.strStaff = res['data']['strStaffName'];
        this.strName = res['data']['strCustName'].toUpperCase()
        this.strInitRemarks = res['data']['txtRemarks']
        this.blnCheckIGST = res['data']['blnIGST']
        this.selectedCity = res['data']['strLocation']
        this.strCity = res['data']['strLocation']
        this.intCityId = res['data']['intLocation']
        this.selectedState = res['data']['strState']
        this.strState = res['data']['strState']
        this.intStateId = res['data']['intState']
        // -------------------------------------------------
        this.intStateIdPrevious = res['data']['intState']
        // -------------------------------------------------
        this.strGSTNo = res['data']['strGSTNo']
        this.strAddress = res['data']['txtAddress']
        this.strPincode = res['data']['intPinCode']
        this.intAmtPerPoints = res['data']['intAmtPerPoints']
        this.intTotPoints = res['data']['intLoyaltyPoint']
        this.intTotAmt = this.intAmtPerPoints * this.intTotPoints
        this.intTotPointsCopy = res['data']['intLoyaltyPoint']

        this.intSalesCustId = res['data']['intSalesCustId']
     
        // ------------------------------------------------
        this.int_editcount = res['data']['edit_count']
        if (this.int_editcount == 0) {
          this.int_cust_edit = 1
        }
        else (
          this.int_cust_edit = 2
        )
        // this. int_cust_edit= 1  //cancelled

        // ------------------------------------------------



        if (res['data'].hasOwnProperty('vchrFinanceName')) {
          // ===============================
          // this.blnPayment = true
          // ===============================

          this.blnFinance = true
          this.intDownPayment = res['data']['dblDownPayment']
          this.intEMI = res['data']['dblEMI']
          this.intFinanceAmt = res['data']['dblFinanceAmt']
          this.intDeliveryNo = res['data']['vchrFinOrdrNum']
          this.strFinanceName = res['data']['vchrFinanceName']
          if (res['data']['vchrFinanceSchema']) {
            this.strFinanceScheme = res['data']['vchrFinanceSchema']
          }
          else {
            this.strFinanceScheme = "---"
          }
        }





        //
        let id = 0;
        this.lstItemDetails.map(element => {

          // calculate rate
          this.lstItemAmount[element.intItemId] = Number(element.dblAmount.toFixed(2))

          if (this.blnCheckIGST) {
            // element.dblAmount= element.dblRate+ element.dblIGST-element.dblBuyBack-element.dblDiscount
            element.dblRate = element.dblAmount - element.dblIGST + element.dblBuyBack + element.dblDiscount

          }
          else {
            // element.dblAmount= element.dblRate+ element.dblCGST+ element.dblSGST-element.dblBuyBack-element.dblDiscount
            element.dblRate = element.dblAmount - (element.dblCGST + element.dblSGST) + element.dblBuyBack + element.dblDiscount

          }


          this.lst_imei.push(element['strImei'])
          //set combo offer icon
          let tempDict = {};
          tempDict['intItemId'] = element['intItemId'];
          tempDict['strItemName'] = element['strItemName'];
          this.comboShow.push('none');
          this.linkShow.push('none');
          this.offerDis.push(0);

          this.openComboOffers(id, tempDict, 'comboOffer', 'show');
          id++;

        })







        this.dctData['custEditData']['strEmail'] = res['data']['strCustEmail']
        this.dctData['custEditData']['strAddress'] = res['data']['txtAddress']
        this.dctData['custEditData']['strState'] = res['data']['strState']
        this.dctData['custEditData']['intStateId'] = res['data']['intState']
        this.dctData['custEditData']['intCityId'] = res['data']['intLocation']
        this.dctData['custEditData']['strCity'] = res['data']['strLocation']
        this.dctData['custEditData']['strGSTNo'] = res['data']['strGSTNo']
        this.dctData['custEditData']['strName'] = res['data']['strCustName']; //

        this.billingDatails("other", 0);

        // navigate to jio invoice view
        // this.lstItemDetails.map(element=>{
        //   if(element.intStatus == 3 || element.intStatus == 4){
        //     this.router.navigate(['invoice/jioinvoiceview']);
        //   }

        // })

        // Onload Spinner
        this.showSpinner()

      }
      else if (res.status == 0) {
        swal.fire('Error!', res['message'], 'error');
        this.lstItemDetails = []
        // this.preItemList=[];
      }
    },
      (error) => {
        swal.fire('Error!', 'Server Error!!', 'error');
      });

  }






  billingDatails(type, index) {


    if (!this.blnCheckIGST && (this.strGSTNo == "" || this.strGSTNo == null)) {
      if (!this.blnReturn) {
        this.calcKfc();
      }


      // console.log(this.lstItemDetails,"lstItemDetails");

      // }

    }
    else {
      if (this.intKfcTot > 0) {


        this.lstItemDetails.map(element => {
          if (element.intStatus != 2) {
            element.dblRate += element.intKfc;
          }
          element.intKfc = 0;
          //this code is comment for the issue in tax while editing customer or item

          // if(element.GST){
          //   element.GST = 0;
          // }
          // if(element.dblCGST){
          //   element.dblCGST = 0;
          // }                                                 
          // if(element.dblCGSTPer){
          //   element.dblCGSTPer = 0;
          // }  
          // if(element.dblSGST){
          //   element.dblSGST = 0;
          // }  
          // if(element.dblSGSTPer){
          //   element.dblSGSTPer = 0;
          // }   

        })


      }

      this.intKfcTot = 0;

    }

    this.dctData['billingdetails'] = []
    this.dctData['billingdetailsCopy'] = []
    this.intDiscount = 0
    this.intBuyBack = 0
    this.intTax = 0
    this.intTotCGST = 0
    this.intTotIGST = 0
    // this.intKfc = 0;
    this.intTotSGST = 0
    this.intReturnAmt = 0
    this.intTotal = 0
    this.intGrandTot = 0
    this.intTotIndirectDis = 0
    this.intRounding = 0
    this.intExchange = 0

    let indexOfList = 0
    for (let item of this.lstItemDetails) {

      let kfcVal = 0;

      if (item.intKfc) {
        kfcVal = item.intKfc;
        // console.log("item.intKfc",item.intKfc)
      }
      else {
        kfcVal = 0;
      }



      // if(item.intStatus==2){
      //   this.dctData['exchangeImage']=
      // }
      if (item.intStatus == 0) {
        this.intReturnAmt = this.intReturnAmt + item.dblAmount
      }
      else {
        this.dctCount = {}
        this.dctCount['dis'] = item.dblBuyBack + item.dblDiscount

        if (this.blnCheckExchange) {
          if (!this.blnCheckIGST) {

            item.dblAmount = Number((item.dblMopAmount + item.dblMarginAmount - (item.dblDiscount + item.dblBuyBack)).toFixed(2))
            // item.dblAmount = Number((item.dblMopAmount + item.dblMarginAmount -(item.dblDiscount)).toFixed(2))

            // console.log(  item.dblAmount,item.dblRate,'amount0');

            this.calculateExchangeRate(indexOfList, false)
            this.dctCount['tax'] = item.dblCGST + item.dblSGST
            this.intTotSGST = this.intTotSGST + item.dblSGST
            this.intTotCGST = this.intTotCGST + item.dblCGST

          }
          else {
            item.dblAmount = Number((item.dblMopAmount + item.dblMarginAmount - (item.dblDiscount + item.dblBuyBack)).toFixed(2))
            // item.dblAmount = Number((item.dblMopAmount + item.dblMarginAmount - (item.dblDiscount)).toFixed(2))

            //  console.log(  item.dblAmount,item.dblRate,'amount1');

            this.calculateExchangeRate(indexOfList, true)

            this.dctCount['tax'] = item.dblIGST
            this.intTotIGST = this.intTotIGST + item.dblIGST
          }
        }
        else {
          if (!this.blnCheckIGST) {

            item.dblAmount = Number((item.dblMopAmount + item.dblMarginAmount - (item.dblDiscount + item.dblBuyBack)).toFixed(2))
            // item.dblAmount = Number((item.dblMopAmount + item.dblMarginAmount -(item.dblDiscount)).toFixed(2))

            // console.log(  item.dblAmount,item.dblRate,'amount0');

            this.calculateRate(indexOfList, false)

            this.dctCount['tax'] = item.dblCGST + item.dblSGST
            this.intTotSGST = this.intTotSGST + item.dblSGST
            this.intTotCGST = this.intTotCGST + item.dblCGST

          }
          else {
            item.dblAmount = Number((item.dblMopAmount + item.dblMarginAmount - (item.dblDiscount + item.dblBuyBack)).toFixed(2))
            // item.dblAmount = Number((item.dblMopAmount + item.dblMarginAmount - (item.dblDiscount)).toFixed(2))

            //  console.log(  item.dblAmount,item.dblRate,'amount1');

            this.calculateRate(indexOfList, true)

            this.dctCount['tax'] = item.dblIGST
            this.intTotIGST = this.intTotIGST + item.dblIGST
          }
        }

        // console.log(item.dblRate,item,"item.dblRate");


        this.dctCount['amt'] = item.dblRate
        this.dctCount['rate'] = item.dblRate
        this.dctCount['name'] = (item.strItemName).slice(0, 15) + '...';
        // this.dctCount['qty']= item.intQuantity
        this.dctCount['qty'] = 1
        this.dctCount['id'] = item.intItemId
        this.dctCount['status'] = item.intStatus
        this.dctData['billingdetails'].push(this.dctCount)

        if (this.intKfcTot >= 0 && item.intStatus != 0 && item.intStatus != 2) {
          this.intTotal = this.intTotal + item.dblRate;
        }

        this.intDiscount = this.intDiscount + item.dblDiscount
        this.intBuyBack = this.intBuyBack + item.dblBuyBack
      }

      if (item.intStatus == 2) {
        this.intExchange += item.dblAmount
      }
      indexOfList++

    }





    if (this.lstIndirectDis.length > 0) {
      this.lstIndirectDis.forEach(item => {
        this.intTotIndirectDis = Number(this.intTotIndirectDis) + Number(item)
      })
    }

    if (this.fltDecimalsInTot >= .50) {
      this.intRounding = (1 - this.fltDecimalsInTot).toFixed(2);
    } else if (this.fltDecimalsInTot < .50 || this.fltDecimalsInTot === 0) {
      this.intRounding = (-this.fltDecimalsInTot).toFixed(2)
    }

    this.intGrandTot = Math.round(this.intGrandTot); //to fixed change

    if (type == "edit") {
      let kfcVal = 0;
      if (this.lstItemDetails[index].intKfc) {
        kfcVal = this.lstItemDetails[index].intKfc;
      }
      else {
        kfcVal = 0;
      }

      if (this.blnCheckExchange) {
        if (this.blnCheckIGST) {
          // this.lstItemDetails[index].dblAmount = Number((this.lstItemDetails[index].dblMopAmount + this.lstItemDetails[index].dblMarginAmount - this.lstItemDetails[index].dblDiscount).toFixed(2))
          this.lstItemDetails[index].dblAmount = Number((this.lstItemDetails[index].dblMopAmount + this.lstItemDetails[index].dblMarginAmount - this.lstItemDetails[index].dblBuyBack - this.lstItemDetails[index].dblDiscount).toFixed(2))

          // console.log( this.lstItemDetails[index].dblAmount, this.lstItemDetails[index].dblRate,'amount');
          this.calculateExchangeRate(index, true)
        }
        else {
          this.lstItemDetails[index].dblAmount = Number((this.lstItemDetails[index].dblMopAmount + this.lstItemDetails[index].dblMarginAmount - this.lstItemDetails[index].dblBuyBack - this.lstItemDetails[index].dblDiscount).toFixed(2))
          // this.lstItemDetails[index].dblAmount = Number((this.lstItemDetails[index].dblMopAmount + this.lstItemDetails[index].dblMarginAmount - this.lstItemDetails[index].dblDiscount).toFixed(2))


          this.calculateExchangeRate(index, false)

        }
      }
      else {

        if (this.blnCheckIGST) {
          this.lstItemDetails[index].dblAmount = Number((this.lstItemDetails[index].dblMopAmount + this.lstItemDetails[index].dblMarginAmount - this.lstItemDetails[index].dblBuyBack - this.lstItemDetails[index].dblDiscount).toFixed(2))

          // this.lstItemDetails[index].dblAmount = Number((this.lstItemDetails[index].dblMopAmount + this.lstItemDetails[index].dblMarginAmount -  this.lstItemDetails[index].dblDiscount).toFixed(2))
          this.calculateRate(index, true)
        }
        else {
          this.lstItemDetails[index].dblAmount = Number((this.lstItemDetails[index].dblMopAmount + this.lstItemDetails[index].dblMarginAmount - this.lstItemDetails[index].dblBuyBack - this.lstItemDetails[index].dblDiscount).toFixed(2))
          // this.lstItemDetails[index].dblAmount = Number((this.lstItemDetails[index].dblMopAmount + this.lstItemDetails[index].dblMarginAmount  - this.lstItemDetails[index].dblDiscount).toFixed(2))

          // console.log("else")

          this.calculateRate(index, false)
        }
      }

// Margin amt checking for MRP       
    //  console.log("@@@@@@@this.lstItemDetails[index].vchr_product_name",this.lstItemDetails[index].vchr_product_name);
    //  console.log("this.lstItemDetails[index].dblAmount",this.lstItemDetails[index].dblAmount);
    //  console.log("this.lstItemDetails[index]['mrp']",this.lstItemDetails[index]['mrp']);
     
     
    //   if((this.lstItemDetails[index].dblAmount>this.lstItemDetails[index]['mrp'])&&(this.lstItemDetails[index].vchr_product_name!='SERVICE'&&this.lstItemDetails[index].vchr_product_name!='RECHARGE'&&this.lstItemDetails[index].vchr_product_name!='SIM'&&this.lstItemDetails[index].vchr_product_name!='SMART CHOICE')){
    //     this.toastr.error('Amount '+this.lstItemDetails[index].dblAmount+' exceeded MRP '+this.lstItemDetails[index]['mrp'], 'Error!');
    //     this.lstItemDetails[index].dblAmount-=this.lstItemDetails[index].dblMarginAmount;
    //     this.lstItemDetails[index].dblMarginAmount = 0;
    //   }
// ends Margin amt checking for MRP

    }

    else if (type == "editNew") {
      // console.log("editnew");


      let kfcVal = 0;

      if (this.newItem['intKfc']) {
        kfcVal = this.newItem['intKfc'];
      }
      else {
        kfcVal = 0;
      }

      if (this.blnCheckIGST) {
        this.newItem.dblAmount = Number((this.newItem.dblMopAmount + this.newItem.dblMarginAmount - this.newItem.dblBuyBack - this.newItem.dblDiscount).toFixed(2))

        // this.newItem.dblAmount = Number((this.newItem.dblMopAmount + this.newItem.dblMarginAmount - this.newItem.dblDiscount).toFixed(2))
        this.calculateRate(index, true)

      }
      else {
        this.newItem.dblAmount = Number((this.newItem.dblMopAmount + this.newItem.dblMarginAmount - this.newItem.dblBuyBack - this.newItem.dblDiscount).toFixed(2))

        //  this.newItem.dblAmount = Number((this.newItem.dblMopAmount  + this.newItem.dblMarginAmount  - this.newItem.dblDiscount).toFixed(2))
        this.calculateRate(index, false)

      }


      // Margin amt checking for MRP       
     
      if((this.newItem.dblAmount>this.newItem['mrp'])&&(this.newItem.vchr_product_name!='SERVICE'&&this.newItem.vchr_product_name!='RECHARGE'&&this.newItem.vchr_product_name!='SIM'&&this.newItem.vchr_product_name!='SMART CHOICE')){
        this.toastr.error('Amount '+this.newItem.dblAmount+' exceeded MRP '+this.newItem['mrp'], 'Error!');
        this.newItem.dblAmount-=this.newItem.dblMarginAmount;
        this.newItem.dblMarginAmount = 0;
      }
// ends Margin amt checking for MRP
    }
    // console.log("this.intGrandTot#########",this.intGrandTot,  this.intTotSGST , this.intTotCGST , this.intTotIGST,this.intTotal, this.intDiscount,this.intBuyBack,this.intReturnAmt,this.intCouponDisc,this.intTotIndirectDis);



    if (this.blnFinance) {
      if (this.intApprove == 3 || this.intApprove == 4) {
        this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt) + this.intExtraFinanceAmt;
      } else {
        this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt) + this.intExtraFinanceAmt;
      }
    }
    else {
      if (this.intApprove == 3 || this.intApprove == 4) {
        this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt);
      } else {
        this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt);
      }
    }


    if (this.intCouponDisc > 0) {
      this.intGrandTot = (this.intTotal + this.intTotSGST + this.intTotCGST + this.intTotIGST) - (this.intReturnAmt + this.intCouponDisc + this.intTotIndirectDis)

    }
    else {
      this.intGrandTot = (this.intTotal + this.intTotSGST + this.intTotCGST + this.intTotIGST) - (this.intReturnAmt + this.intTotIndirectDis)
      // console.log("this.intGrandTot#########",this.intGrandTot,  this.intTotSGST , this.intTotCGST , this.intTotIGST,this.intTotal, this.intDiscount,this.intBuyBack,this.intReturnAmt,this.intCouponDisc,this.intTotIndirectDis);


    }
    this.intExchange = (this.intExchange) * -1
    this.intGrandTot = this.intGrandTot - this.intExchange

    // this.intGrandTot= this.intGrandTot-this.intExchange
    // console.log(  this.intGrandTot,"  this.intGrandTot",this.intExchange);


    this.intGrandTot = Number(this.intGrandTot) + Number(this.additions) + Number(this.intKfcTot);
    // this.intGrandTot=Number(this.intGrandTot)+Number(this.additions);
    this.intGrandTot = Number(this.intGrandTot) - Number(this.deductions);
    // this.intGrandTot=Number(this.intGrandTot)+Number(this.intExtraFinanceAmt);
    // console.log("this.intGrandTot$$$$$$$$$$$$",this.intGrandTot);

    this.intTotNoRounding = this.intGrandTot.toFixed(2);

    this.fltDecimalsInTot = this.intTotNoRounding - Math.floor(this.intTotNoRounding); //to fixed change

    // console.log();
    // console.log(  this.intGrandTot,"  this.intGrandTot 2");


    // let asd = []

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
      if (item.status != 2) {
        if (!asd.includes(item['id'])) {
          asd.push(item['id'])
          dct_dup[item['id']] = {}
          dct_dup[item['id']]['name'] = JSON.parse(JSON.stringify(item['name']))
          dct_dup[item['id']]['amt'] = JSON.parse(JSON.stringify(item['amt']))
          dct_dup[item['id']]['qty'] = JSON.parse(JSON.stringify(item['qty']))
        } else {
          dct_dup[item['id']]['amt'] = JSON.parse(JSON.stringify(dct_dup[item['id']]['amt'])) + JSON.parse(JSON.stringify(item['amt']))
          dct_dup[item['id']]['qty'] += 1
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
    if (this.intApprove == 3) {
      this.intBalanceAmt = this.dblPartialAmount;
    }
  }
  calculateRate(index, check) {
    // console.log("rate",index);

    // let index=0
    // this.lstItemDetails.forEach(element => {
    if (check) {
      this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount']) * 100) / (100 + this.lstItemDetails[index]['dblIGSTPer'])
      this.lstItemDetails[index]['dblIGST'] = (this.lstItemDetails[index]['dblIGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
    }
    else if (!this.strGSTNo) {
      this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'] + 1)
      this.lstItemDetails[index]['dblCGST'] = (this.lstItemDetails[index]['dblCGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100         // in exchange the difference of amount is taken 
      this.lstItemDetails[index]['dblSGST'] = (this.lstItemDetails[index]['dblSGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
      this.calcKfc()

    }
    else {
      this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'])

      this.lstItemDetails[index]['dblCGST'] = (this.lstItemDetails[index]['dblCGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100         // in exchange the difference of amount is taken 
      this.lstItemDetails[index]['dblSGST'] = (this.lstItemDetails[index]['dblSGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
    }
    // console.log("@@@@@@@Rate",this.lstItemDetails[index]['dblRate']);
    // this.calcKfc()

    // });
    // console.log(this.lstItemDetails[index]['dblCGST'], this.lstItemDetails[index]['dblSGST'], this.lstItemDetails[index]['dblIGST'],"lstItemDetails");

  }
  calculateExchangeRate(index, check) {

    // console.log(this.blnCheckExchange,"cher");

    let rate = 0

    if (check) {
      rate = ((this.lstItemDetails[index]['dblMarginAmount'] - this.lstItemDetails[index]['dblBuyBack'] - this.lstItemDetails[index]['dblDiscount']) * 100) / (100 + this.lstItemDetails[index]['dblIGSTPer'])
      // rate = ((this.lstItemDetails[index]['dblMarginAmount']-this.lstItemDetails[index]['dblDiscount']) * 100) / (100 + this.lstItemDetails[index]['dblIGSTPer'])

      this.lstItemDetails[index]['dblRate'] = this.lstItemDetails[index]['dblMopAmount'] + rate
      this.lstItemDetails[index]['dblIGST'] = (this.lstItemDetails[index]['dblIGSTPer'] * rate) / 100
    }
    else if (!this.strGSTNo) {
      // rate = ((this.lstItemDetails[index]['dblMarginAmount']-this.lstItemDetails[index]['dblDiscount']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer']+1)

      rate = ((this.lstItemDetails[index]['dblMarginAmount'] - this.lstItemDetails[index]['dblBuyBack'] - this.lstItemDetails[index]['dblDiscount']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'] + 1)
      this.lstItemDetails[index]['dblRate'] = this.lstItemDetails[index]['dblMopAmount'] + rate
      this.lstItemDetails[index]['dblCGST'] = (this.lstItemDetails[index]['dblCGSTPer'] * rate) / 100         // in exchange the difference of amount is taken 
      this.lstItemDetails[index]['dblSGST'] = (this.lstItemDetails[index]['dblSGSTPer'] * rate) / 100
      this.lstItemDetails[index]['intKfc'] = (rate) / 100
      this.calcKfc()


    }
    else {
      rate = ((this.lstItemDetails[index]['dblMarginAmount'] - this.lstItemDetails[index]['dblBuyBack'] - this.lstItemDetails[index]['dblDiscount']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'])

      // rate= ((this.lstItemDetails[index]['dblMarginAmount']-this.lstItemDetails[index]['dblDiscount']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'])            
      this.lstItemDetails[index]['dblRate'] = this.lstItemDetails[index]['dblMopAmount'] + rate
      this.lstItemDetails[index]['dblCGST'] = (this.lstItemDetails[index]['dblCGSTPer'] * rate) / 100         // in exchange the difference of amount is taken 
      this.lstItemDetails[index]['dblSGST'] = (this.lstItemDetails[index]['dblSGSTPer'] * rate) / 100
    }
    // console.log("list",this.lstItemDetails);


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


  updateList(id: number, property: string, event: any) {

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
    // else if(){

    // }
    else {
      // console.log("this.lstItemDetails",this.lstItemDetails)

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
        // this.preItemList.push(this.newItem);




        this.linkShow.push('none');
        this.offerDis.push(0);

        this.lst_imei.push(this.newItem['strImei'])

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

        this.comboShow.push('none');
        this.blnStart = true
        this.billingDatails("other", 0);
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

        this.openComboOffers(lstLen - 1, tempDict, 'comboOffer', 'show');
      }

    }

    //  console.log("##this.lstItemDetails",this.lstItemDetails);

  }

  removeAppliedOffer(itemId) {

    if (this.lstItemDetails[this.itemIndex]['dblDiscount'] > 0) {

      this.lstItemDetails[this.itemIndex]['dblDiscount'] -= this.offerDis[this.itemIndex];
      this.lstItemDetails[this.itemIndex]['dblAmount'] += this.offerDis[this.itemIndex];

      this.lstItemDetails[this.itemIndex]['dblAmount'] = Number((this.lstItemDetails[this.itemIndex]['dblAmount']).toFixed(2))
    }

    this.offerDis[this.itemIndex] = 0;

    let offerValue = this.offerItemId;

    let tempLst = [];

    for (let data in this.lstItemDetails) {
      if (this.lstItemDetails[data]['offerId'] == offerValue) {
        tempLst.push(data);
      }
    }

    tempLst.map(element => {
      const i = this.lstItemDetails.indexOf(element);

      this.lstIndirectDis.splice(i, 1);
      this.lstItemDetails.splice(i, 1);
      this.linkShow.splice(i, 1);
      this.offerDis.push(0);
      this.billingDatails("other", 0);

    })
    // tempLst.map(element=>{ 
    //   console.log("@@@tempLst.map element",element);

    //    this.lstIndirectDis.splice(1,parseInt(element));
    //    this.lstItemDetails.splice(1,parseInt(element));    
    //    this.linkShow.splice(1,parseInt(element));  
    //    this.offerDis.push(0);

    //    this.billingDatails("other",0);
    // })

  }

  removeRow(id) {
    // console.log(this.lstItemDetails,"lstItemDetails");
    // console.log(  this.lstIndirectDis,"lstIndirectDis");

    let offerValue;


    offerValue = this.lstItemDetails[id]['offerId'];
    // console.log("this.linkShow[id]####",this.linkShow[id]);

    if (this.linkShow[id] == 'block') {


      swal.fire({
        title: 'Are you sure?',
        text: "Items added on offer will be deleted!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.lstItemDetails[this.itemIndex]['dblDiscount'] -= this.offerDis[this.itemIndex];
          this.lstItemDetails[this.itemIndex]['dblAmount'] += this.offerDis[this.itemIndex];
          this.lstItemDetails[this.itemIndex]['dblAmount'] = Number((this.lstItemDetails[this.itemIndex]['dblAmount']).toFixed(2))

          this.offerDis[this.itemIndex] = 0;
          swal.fire(
            'Deleted!',
            "Data Deleted successfully",
            'success'
          )
          let tempLst = [];

          for (let data in this.lstItemDetails) {

            if (this.lstItemDetails[data]['offerId'] == offerValue) {
              tempLst.push(this.lstItemDetails[data]);
              //  this.lstItemDetails.splice(parseInt(data),1);       
              // console.log('deleted' ,data);

            }
          }


          tempLst.map(element => {
            const i = this.lstItemDetails.indexOf(element);

            this.lstIndirectDis.splice(i, 1);
            this.lstItemDetails.splice(i, 1);
            this.linkShow.splice(i, 1);
            this.offerDis.splice(i, 1);
            this.billingDatails("other", 0);
          })
          this.offerApplied[this.itemIndex] = false;
        }
      })
      this.changeDiscountValue(this.itemIndex, 'editRow');
      return;
    }

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
        // console.log("dfsg",this.lstItemDetails)
        if ((Object.keys(this.dct_item)).includes(String(this.lstItemDetails[id]['intItemId']))) {
          this.dct_item[this.lstItemDetails[id]['intItemId']] = this.dct_item[this.lstItemDetails[id]['intItemId']] - 1
        }
        // Removed imei of deleted item from lst_imei --starts
        let delImeiIndex = this.lst_imei.indexOf(this.lstItemDetails[id]['strImei']);
        this.lst_imei.splice(delImeiIndex, 1);
        // Removed imei of deleted item from lst_imei --ends

        let index = 0
        let lstIndex = []
        for (let i = 0; i < this.lstItemDetails.length; i++) {
          // console.log("loop3");

          if (this.lstItemDetails[id]['strImei'] == this.lstItemDetails[i]['strImei'] && id != i && this.lstItemDetails[id]['strItemCode'] != 'GDC00001' && this.lstItemDetails[id]['strItemCode'] != 'GDC00002' && this.lstItemDetails[id]['imeiStatus'] == true) {
            // this.lstItemDetails.splice(i, 1);
            // console.log("loop1");

            lstIndex.push(i)

          }
        }
        // lstIndex.forEach(((element) =>{
        // console.log()
        for (let index = lstIndex.length - 1; index >= 0; index--) {
          // console.log("loop2",lstIndex,index);

          this.lstItemDetails.splice(lstIndex[index], 1);
        }

        // }))


        // if(lstIndex.length>0)
        // {


        //   lstIndex.forEach(element => {
        //     this.lstItemDetails.splice(element, 1);
        //   });
        // }
        // else{
        //   this.lstItemDetails.splice(id, 1);

        // }

        // this.lstItemDetails.splice(id, 1);
        // this.lstItemDetails.forEach(element => {
        // console.log(element['strImei'],"element['strImei']");

        // if(this.lstItemDetails[id]['strImei']==element['strImei'] && id!=index){
        //   console.log("in imei ",element);

        //   this.lstItemDetails.splice(index, 1);
        //   // this.lstIndirectDis.splice(index, 1);

        // }

        //   index=index+1
        // });
        this.lstItemDetails.splice(id, 1);

        this.lstIndirectDis.splice(id, 1);

        // this.preItemList.splice(id, 1);
        this.billingDatails("other", 0);
      }
    })

  }

  changeValue(index: number, property: string, event: any, item) {
  }

  changeDiscountValue(index: number, item) {
    // this.editField = event.target.textContent;

    // console.log("EEEEEEEEthis.lstItemDetails[index].dblDiscount",this.lstItemDetails[index].dblDiscount);
    // console.log("RRRRRRRthis.lstItemDetails[index].dblRate-this.lstItemDetails[index].dblBuyBack",this.lstItemDetails[index].dblRate-this.lstItemDetails[index].dblBuyBack);
    console.log("this.lstItemDetails[index].dblDiscount", this.lstItemDetails[index].dblDiscount, "g", Number(this.lstItemDetails[index].dblDiscount))

    console.log(this.lstItemDetails[index].dblBuyBack, this.lstItemDetails[index].dblRate, this.lstItemDetails[index].dblAmount, this.lstItemDetails[index].dblDiscount, "dis");

    if (item == "editRow") {
      if (this.lstItemDetails[index].dblDiscount < 0) {

        this.toastr.error('Enter valid Amount', 'Error!');
        this.lstItemDetails[index].dblDiscount = null;
        // this.preItemList[index].dblDiscount=0
        this.billingDatails("edit", index);
        // swal('key', 'Invalid Estimated Amount', 'error');
      }
      if (this.lstItemDetails[index].dblDiscount > (this.lstItemDetails[index].dblMopAmount - this.lstItemDetails[index].dblBuyBack + this.lstItemDetails[index].dblMarginAmount) && !this.blnCheckExchange) {
        this.toastr.error('Invalid Discount', 'Error!');
        this.lstItemDetails[index].dblDiscount = null;
        // this.preItemList[index].dblDiscount=0
        this.billingDatails("edit", index);
        // this.bbId.first.nativeElement.focus();
      }
      else if (this.lstItemDetails[index].dblDiscount > (this.lstItemDetails[index].dblMarginAmount - this.lstItemDetails[index].dblBuyBack) && this.blnCheckExchange) {
        this.toastr.error('Invalid Discount', 'Error!');
        this.lstItemDetails[index].dblDiscount = null
        // this.preItemList[index].dblDiscount=0
        this.billingDatails("edit", index);
        // this.bbId.first.nativeElement.focus();
      }
      else {
        // console.log("this.lstItemDetails[index].dblDiscount",this.lstItemDetails[index].dblDiscount,"g",Number(this.lstItemDetails[index].dblDiscount))

        // this.bbId.first.nativeElement.focus();
        this.billingDatails("edit", index);
      }
    }
    else if (item == "newItem") {
      // console.log("newItem");
      if (this.newItem.dblDiscount < 0) {

        this.toastr.error('Enter valid Amount', 'Error!');
        this.lstItemDetails[index].dblDiscount = null
        this.newItem.dblDiscount = null
        this.billingDatails("editNew", 0);
        // this.preItemList[index].dblDiscount=0
        // this.billingDatails("edit",index);
        // swal('key', 'Invalid Estimated Amount', 'error');
      }
      if (this.newItem.dblDiscount > (this.newItem.dblMopAmount - this.newItem.dblBuyBack + this.lstItemDetails[index].dblMarginAmount) && !this.blnCheckExchange) {
        this.toastr.error('Invalid Discount', 'Error!');
        this.newItem.dblDiscount = null
        this.billingDatails("editNew", 0);
        // this.bbId.first.nativeElement.focus();
      }
      else if (this.newItem.dblDiscount > (this.newItem.dblMarginAmount - this.newItem.dblBuyBack) && this.blnCheckExchange) {
        this.toastr.error('Invalid Discount', 'Error!');
        this.newItem.dblDiscount = null
        this.billingDatails("editNew", 0);
        // this.bbId.first.nativeElement.focus();
      }
      else {
        this.billingDatails("editNew", 0);
      }
    }
  }
  changeBBValue(index: number, property: string, event: any, item) {

    // this.editField = event.target.textContent;
    // console.log(this.lstItemDetails[index].dblBuyBack,this.lstItemDetails[index].dblRate,this.lstItemDetails[index].dblAmount,this.lstItemDetails[index].dblDiscount,"buy back");

    if (item == "editRow") {
      if (this.lstItemDetails[index].dblBuyBack < 0) {

        this.toastr.error('Enter valid Amount', 'Error!');
        this.lstItemDetails[index].dblBuyBack = null
        // this.preItemList[index].dblDiscount=0
        this.billingDatails("edit", index);
        // swal('key', 'Invalid Estimated Amount', 'error');
      }
      if (this.lstItemDetails[index].dblBuyBack > (this.lstItemDetails[index].dblMopAmount - this.lstItemDetails[index].dblDiscount + this.lstItemDetails[index].dblMarginAmount) && !this.blnCheckExchange) {
        // console.log(this.lstItemDetails[index].dblBuyBack,this.lstItemDetails[index].dblRate,this.lstItemDetails[index].dblDiscount,"buy back");

        this.toastr.error('Invalid Buy Back ', 'Error!');
        this.lstItemDetails[index].dblBuyBack = null
        // this.preItemList[index].dblBuyBack=0

        this.billingDatails("edit", index);
        // this.discId.first.nativeElement.focus();
      }
      else if (this.lstItemDetails[index].dblBuyBack > (this.lstItemDetails[index].dblMarginAmount - this.lstItemDetails[index].dblDiscount) && this.blnCheckExchange) {
        this.toastr.error('Invalid Buy Back ', 'Error!');
        this.lstItemDetails[index].dblBuyBack = null
        // this.preItemList[index].dblBuyBack=0

        this.billingDatails("edit", index);
      }
      else {
        // this.discId.first.nativeElement.focus();
        this.billingDatails("edit", index);
      }
    }
    else if (item == "newItem") {
      if (this.newItem.dblBuyBack < 0) {

        this.toastr.error('Enter valid Amount', 'Error!');
        this.newItem.dblBuyBack = null
        // this.preItemList[index].dblDiscount=0
        this.billingDatails("edit", index);
        // swal('key', 'Invalid Estimated Amount', 'error');
      }
      if (this.newItem.dblBuyBack > (this.newItem.dblMopAmount - this.newItem.dblDiscount + this.lstItemDetails[index].dblMarginAmount) && !this.blnCheckExchange) {
        this.toastr.error('Invalid Buy Back', 'Error!');
        this.newItem.dblBuyBack = null
        this.billingDatails("editNew", 0);
        // this.discId.first.nativeElement.focus();
      }
      else if (this.newItem.dblBuyBack > (this.newItem.dblMarginAmount - this.newItem.dblDiscount) && this.blnCheckExchange) {
        this.toastr.error('Invalid Buy Back', 'Error!');
        this.newItem.dblBuyBack = null
        this.billingDatails("editNew", 0);
        // this.discId.first.nativeElement.focus();
      }
      else {
        this.billingDatails("editNew", 0);
      }
    }
    // console.log(this.lstItemDetails[index],"this.lstItemDetails[index]");
  }

  changeMarginValue(index: number, item) {
    // this.editField = event.target.textContent;

    // console.log("EEEEEEEEthis.lstItemDetails[index].dblDiscount",this.lstItemDetails[index].dblDiscount);
    // console.log("RRRRRRRthis.lstItemDetails[index].dblRate-this.lstItemDetails[index].dblBuyBack",this.lstItemDetails[index].dblRate-this.lstItemDetails[index].dblBuyBack);
    // Margin amt checking for MRP
    let dblMarginAddedAmt=Number((this.lstItemDetails[index].dblMopAmount + this.lstItemDetails[index].dblMarginAmount - this.lstItemDetails[index].dblBuyBack - this.lstItemDetails[index].dblDiscount).toFixed(2));
    if((dblMarginAddedAmt>this.lstItemDetails[index]['mrp'])&&(this.lstItemDetails[index].vchr_product_name!='SERVICE'&&this.lstItemDetails[index].vchr_product_name!='RECHARGE'&&this.lstItemDetails[index].vchr_product_name!='SIM'&&this.lstItemDetails[index].vchr_product_name!='SMART CHOICE')){
      this.toastr.error('Amount '+dblMarginAddedAmt+' exceeded MRP '+this.lstItemDetails[index]['mrp'], 'Error!');
      this.lstItemDetails[index].dblMarginAmount = 0;
      return;
    }
  // Margin amt checking for MRP
    if (item == "editRow") {
      if (this.lstItemDetails[index].dblMarginAmount < 0) {
        this.toastr.error('Invalid Margin Amount', 'Error!');
        this.lstItemDetails[index].dblMarginAmount = 0
        // this.preItemList[index].dblDiscount=0
        this.billingDatails("edit", index);
        // this.bbId.first.nativeElement.focus();
      }
      else {
        // this.bbId.first.nativeElement.focus();
        
        this.billingDatails("edit", index);
      }
    }
    else if (item == "newItem") {
      if (this.newItem.dblMarginAmount < 0) {
        this.toastr.error('Invalid Margin Amount', 'Error!');
        this.newItem.dblDiscount = null
        this.billingDatails("editNew", 0);
        // this.bbId.first.nativeElement.focus();
      }
      else {
        this.billingDatails("editNew", 0);
      }
    }
  }
  OnEnter(id: number, property: string, event: any) {
    // console.log("onenter",this.lstItemDetails[id]);
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
    if (event.keyCode == 13 || event.which == 13) {
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
      // this.preItemList[index][property] = 0
      this.billingDatails("edit", index)
      this.toastr.error('Invalindex Amount');
      return false;
    }
  }

  addDeductChanged() {

    this.additions = 0, this.deductions = 0;

    this.billingDatails("other", 0);



    this.lstAdditions.map(element => {
      if (element['value'] == "") {
        element['value'] = 0;
      }
      this.additions += Number(element['value']);
    })


    this.lstDeductions.map(element => {
      if (element['value'] == "") {
        element['value'] = 0;
      }
      this.deductions += Number(element['value']);

    })

    // console.log("this.additions",this.additions);
    // console.log("this.deductions",this.deductions);

    this.intTotNoRounding = Number(this.intTotNoRounding) + Number(this.additions);
    this.intTotNoRounding = Number(this.intTotNoRounding) - Number(this.deductions);

    this.intGrandTot = Number(this.intGrandTot) + Number(this.additions);
    this.intGrandTot = Number(this.intGrandTot) - Number(this.deductions);

    // console.log("this.intTotNoRounding",this.intTotNoRounding);
    // console.log("this.intGrandTot",this.intGrandTot);

    this.billingDatails("other", 0);

  }
  makeApprove() {
    if (!this.blnCreditSale) {
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
          this.serviceObject.patchData('invoice/add_invoice/', { 'approveId': this.salesRowId }).subscribe(res => {
            if (res.status == 1) {

              swal.fire({
                position: "center",
                type: "success",
                text: "Request Approved Successfully",
                showConfirmButton: true,
              });
              this.blnApproved = res['bln_approve'];
              // this.intApprove=res['int_approve'];
              this.router.navigate(['invoice/saleslist']);
            }
            else if (res.status == 0) {
              swal.fire('Error!', res['message'], 'error');
              // this.lstItemDetails=[]
            }
          },
            (error) => {
              swal.fire('Error!', 'Server Error!!', 'error');
            });

        }
      })

    }
    else {
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
          this.serviceObject.patchData('invoice/add_invoice/', { 'approveId': this.salesRowId, 'intCreditSale': 2 }).subscribe(res => {
            if (res.status == 1) {

              swal.fire({
                position: "center",
                type: "success",
                text: "Request Approved Successfully",
                showConfirmButton: true,
              });
              this.blnApproved = res['bln_approve'];
              // this.intApprove=res['int_approve'];
              this.router.navigate(['invoice/saleslist']);
            }
            else if (res.status == 0) {
              swal.fire('Error!', res['message'], 'error');
              // this.lstItemDetails=[]
            }
          },
            (error) => {
              swal.fire('Error!', 'Server Error!!', 'error');
            });

        }
        else {
          console.log('reject')

          this.serviceObject.patchData('invoice/add_invoice/', { 'approveId': this.salesRowId, 'intCreditSale': 3 }).subscribe(res => {
            if (res.status == 1) {

              swal.fire({
                position: "center",
                type: "success",
                text: "Credit sale rejected and invoice approved",
                showConfirmButton: true,
              });
              this.blnApproved = res['bln_approve'];
              // this.intApprove=res['int_approve'];
              this.router.navigate(['invoice/saleslist']);
            }
            else if (res.status == 0) {
              swal.fire('Error!', res['message'], 'error');
              // this.lstItemDetails=[]
            }
          },
            (error) => {
              swal.fire('Error!', 'Server Error!!', 'error');
            });

        }
      })



    }


  }
  makeRequest() {
    console.log(this.blnCreditSale);

    if (!this.blnCreditSale) {
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
          form_data.append('partial_id', this.salesRowId)
          form_data.append('lstItems', JSON.stringify(this.lstItemDetails))
          form_data.append('dblTotalAmount', this.intGrandTot)
          form_data.append('strRemarks', this.strRemarks)
          this.serviceObject.patchData('invoice/add_invoice/', form_data).subscribe(res => {
            if (res.status == 1) {

              swal.fire({
                position: "center",
                type: "success",
                text: "Request Submitted Successfully",
                showConfirmButton: true,
              });
              this.intApprove = res['int_approve'];
              this.router.navigate(['invoice/saleslist']);
              // this.router.navigate(['invoice/listinvoice']);
            }
            else if (res.status == 0) {
              swal.fire('Error!', res['message'], 'error');
              // this.lstItemDetails=[]
            }
          },
            (error) => {
              swal.fire('Error!', 'Server Error!!', 'error');
            });

        }
      })

    }
    else {
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
          form_data.append('partial_id', this.salesRowId)
          form_data.append('lstItems', JSON.stringify(this.lstItemDetails))
          form_data.append('dblTotalAmount', this.intGrandTot)
          form_data.append('strRemarks', this.strRemarks)

          ///
          form_data.append('dblPartialAmount', String(this.dblPartialAmount));
          form_data.append('dblBalanceAmount', String(this.intBalanceAmt));
          form_data.append('blnCreditSale', 'true');

          this.serviceObject.patchData('invoice/add_invoice/', form_data).subscribe(res => {
            if (res.status == 1) {

              swal.fire({
                position: "center",
                type: "success",
                text: "Request Submitted Successfully",
                showConfirmButton: true,
              });
              this.intApprove = res['int_approve'];
              this.router.navigate(['invoice/saleslist']);
              // this.router.navigate(['invoice/listinvoice']);
            }
            else if (res.status == 0) {
              swal.fire('Error!', res['message'], 'error');
              // this.lstItemDetails=[]
            }
          },
            (error) => {
              swal.fire('Error!', 'Server Error!!', 'error');
            });

        }
      })

    }


  }

  saveInvoice() {
    console.log(this.dctData['lstPaymentData'], "makepay", this.intApprove, 'intApprove', this.blnMakePayment, 'blnMakePayment', this.intGrandTot, 'intGrandTot');

    if (this.intBalanceAmt < 0 && this.blnMakePayment && !this.blnAmazonOrFlipkart) {
      this.toastr.error('Amount Exceeded', 'Error!');
    }
    else if (this.intBalanceAmt > 0 && this.blnMakePayment && !this.blnAmazonOrFlipkart) {
      swal.fire('Error!', this.intBalanceAmt.toFixed(2) + " is Required", 'error');

    }
    else {

      // =================Payment Change===========================================
      // if (!this.strFinanceName){
      //   this.blnCash = true;
      //   this.savePaymentOption('event')
      // }
      // =================Payment Change===========================================

      // console.log("lstAdditions1",this.lstAdditions1);
      // console.log("lstDeductions1",this.lstDeductions1);

      // return;

      if (this.out_of_stock) {
        swal.fire('Error!', "Out of stock", 'error');
        return;
      }
      const form_data = new FormData;
      let error = false
      if (this.blnExchange) {


        if (this.saveDisable) {
          this.toastr.error('Exchange item to be verified', 'Error!');
          return false;
        }

      }
      if (this.intContactNo == null || this.intContactNo == '' || !this.intContactNo) {
        this.toastr.error('Customer contact number is required', 'Error!');
        return false;
      }
      if(this.lstItemDetails.length == 1 && this.lstItemDetails[0]['intStatus'] == 2){
               this.toastr.error('Atleast One more Item is required with Smartchoice item', 'Error!');
              return;
              }     
      let strAlert = "Are you sure want to continue ?"
      if (this.blnFinance) {
        strAlert = "This is a Finance Sale, Please ensure all the entries are correct. Are you sure want to continue ?"
      }


      // console.log("Items",this.lstItemDetails);
      // console.log("this.intKfcTot",this.intKfcTot);



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

          // console.log(this.lstItemDetails,"lstItemDetails");

          if (this.lstItemDetails.length == 0) {
            this.toastr.error('Atleast One Item is required', 'Error!');
            return
          }
          else {

            this.lstItemDetails.forEach(element => {
              if (element.intStatus == 0) {
                if (!(Object.keys(this.dctReturnId)).includes(String(element.intItemId))) {
                  error = true
                  return
                }
              }
            });

            let dctInvoice = {}

            if (!error) {

              if (this.intGrandTot < 0) {
                swal.fire('Error!', 'Purchase amount should be greater than return amount', 'error')
              }
              else {

                if (this.objectKeys(this.dctData['lstPaymentData']).length > 0 || this.intBalanceAmt <= 0 || !this.blnMakePayment || this.blnAmazonOrFlipkart) {

                  if (!this.blnMakePayment && (this.intCreditBalance < this.intGrandTot) && !this.blnAmazonOrFlipkart) {
                    swal.fire('', 'Your Credit Balance is not enough to purchase items', 'warning');
                  }
                  else {
                    form_data.append('lstPaymentData', JSON.stringify(this.dctData['lstPaymentData']))
                    form_data.append('dctTableData', JSON.stringify(this.lstItemDetails))

                    form_data.append('salesRowId', this.salesRowId)

                    // if(this.intFinanceId){
                    // form_data.append('intFinanceId',this.intFinanceId)
                    // }

                    if (this.intCouponId) {
                      form_data.append('intCouponId', this.intCouponId)
                      form_data.append('intCouponDisc', this.intCouponDisc)
                    }
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
                    this.saveDisable = true;
                    console.log(form_data, "form_data");
                    // ====================================================================================
                    this.serviceObject.postData('invoice/add_invoice/', form_data).subscribe(res => {
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
                        // this.router.navigate(['invoice/listinvoice']);
                      }
                      else if (res.status == 0) {
                        swal.fire('Error!', res['message'], 'error');
                        // this.lstItemDetails=[]
                        this.saveDisable = false;
                      }
                    },
                      (error) => {
                        swal.fire('Error!', 'Server Error!!', 'error');
                        this.saveDisable = false;
                      });
                  }
                  // else{

                  // }

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

  @HostListener('keydown', ['$event']) onKeyDown(event) {

    let e = <KeyboardEvent>event;
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
  changeToUppercase() {
    this.strGSTNo = this.strGSTNo.toUpperCase();
    // this.strName = this.strName.toUpperCase();
  }
  changeNameToUppercase() {
    // this.strGSTNo = this.strGSTNo.toUpperCase();
    this.strName = this.strName.toUpperCase();
  }
  saveCustEdit() {

    console.log("sf")
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
        console.log("add");


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
              this.blnCheckIGST = res['data']['blnIGST']
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
              this.intCustomerType=res['data']['int_cust_type'];
              this.blnCustomerAdd = false;

              this.blnCustomerAfterAdd = false;





              this.billingDatails("other", 0);

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
        console.log("edit");

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
                  //  if(this.strGSTNo==""&&!this.blnCheckIGST){
                  //   this.calcKfc();
                  //  }

                  swal.fire({
                    position: "center",
                    type: "success",
                    text: "Data saved successfully",
                    showConfirmButton: true,
                  });
                  this.blnCheckIGST = res['data']['blnIGST']
                  this.showModalCustEdit.close();

                  this.dctData['custEditData']['strEmail'] = res['data']['strCustEmail']
                  this.dctData['custEditData']['strAddress'] = res['data']['txtAddress']
                  this.dctData['custEditData']['strState'] = res['data']['strState']
                  this.dctData['custEditData']['intStateId'] = res['data']['intStateId']
                  this.dctData['custEditData']['intCityId'] = res['data']['intLocation']
                  this.dctData['custEditData']['strCity'] = res['data']['strLocation']
                  this.dctData['custEditData']['strGSTNo'] = res['data']['strGSTNo']
                  this.dctData['custEditData']['intCustId'] = res['data']['intCustId']
                  this.dctData['custEditData']['strName'] = res['data']['strCustName']
                  this.dctData['custEditData']['intContactNo'] = res['data']['intContactNo'];
                  this.intSalesCustId = res['data']['intSalesCustId']
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
                    // console.log('hi',this.lstItemDetails);
                  }

                  // -----------------------------------------------------------------------------------------------------------------

                  //  this.lstItemDetails.forEach(element => {
                  //   element.dblBuyBack =0
                  //   element.dblDiscount=0

                  //   element.dblAmount = Number((this.lstItemAmount[element.intItemId]).toFixed(2))

                  //   //  if (element.intStatus != 2){

                  //      if(this.blnCheckIGST){

                  //        // element.dblAmount= element.dblRate+ element.dblIGST-element.dblBuyBack-element.dblDiscount
                  //        element.dblRate = element.dblAmount - element.dblIGST + element.dblBuyBack + element.dblDiscount
                  //        element.dblAmount = Number((element.dblRate + element.dblIGST - (element.dblDiscount + element.dblBuyBack)).toFixed(2))

                  //      }
                  //      else{

                  //        // element.dblAmount= element.dblRate+ element.dblCGST+ element.dblSGST-element.dblBuyBack-element.dblDiscount
                  //        element.dblRate = element.dblAmount - (element.dblCGST + element.dblSGST) + element.dblBuyBack + element.dblDiscount
                  //        element.dblAmount = Number(( element.dblRate + element.dblCGST + element.dblSGST - (element.dblDiscount + element.dblBuyBack)).toFixed(2))

                  //      }
                  //   //  }

                  //  });

                  this.billingDatails("other", 0);

                }
                else if (res.status == 0) {
                  // console.log(this.blnStatus)
                  swal.fire('Error!', 'Something went wrong!!', 'error');
                }
              },
                (error) => {
                  swal.fire('Error!', 'Server Error!!', 'error');

                });

            }
          })
        }
      }

    }

  }

  cancelCustEdit() {
    this.showModalCustEdit.close();
    // console.log(this.dctData['custEditData'],'edit');

    // if(this.dctData['custEditData']){
    // this.strEmail = this.dctData['custEditData']['strEmail']
    // this.strAddress = this.dctData['custEditData']['strAddress']
    // this.selectedState = this.dctData['custEditData']['strState']
    // this.intStateId= this.dctData['custEditData']['intStateId']
    // this.intCityId= this.dctData['custEditData']['intCityId']
    // this.selectedCity = this.dctData['custEditData']['strCity']
    // this.strGSTNo = this.dctData['custEditData']['strGSTNo']
    // this.strName = this.dctData['custEditData']['strName']; ///
    // if(this.blnExchangeInvoice){
    //   this.intContactNo = this.dctData['custEditData']['intContactNo']; //
    // }

    //  }
  }
  cancelCustAdd() {
    this.showModalCustEdit.close();

  }
  saveCustDetails() {
    this.showModalCustEdit.close();

  }
  applyCouponCode() {
    let dctDetails = {}
    dctDetails['strCode'] = this.strCouponCode
    dctDetails['intId'] = this.salesRowId
    dctDetails['lstItemDetails'] = this.lstItemDetails
    //  dctDetails['intTax']=this.intTax
    dctDetails['intTotSGST'] = this.intTotSGST
    dctDetails['intTotCGST'] = this.intTotCGST
    dctDetails['intTotIGST'] = this.intTotIGST
    dctDetails['intTotal'] = this.intTotal
    dctDetails['intDiscount'] = this.intDiscount
    dctDetails['intBuyBack'] = this.intBuyBack

    if (this.strCouponCode) {
      this.serviceObject.postData('invoice/apply_coupon/', dctDetails).subscribe(res => {
        if (res.status == 1) {
          swal.fire({
            position: "center",
            type: "success",
            text: "Coupon Applied successfully",
            showConfirmButton: true,
          });

          this.intCouponDisc = res['data']['dblDisc']
          this.intCouponId = res['data']['intCouponId']
          this.billingDatails("other", 0)
          this.showModalCoupon.close();
          this.blnApplied = true
        }
        else if (res.status == 0) {
          swal.fire('Error!', res['message'], 'error');
        }
      },
        (error) => {
          swal.fire('Error!', 'Server Error!!', 'error');

        });

    }

  }

  cancelCouponCode() {
    this.blnApplied = false
    this.strCouponCode = ''
    this.intCouponDisc = 0
    this.intCouponId = null
    this.billingDatails("other", 0)
  }

  selectSameCust() {
    if (this.blnCustomer) {
      this.strCustName = this.strName
      this.intCustContactNo = this.intContactNo
      this.strCustCity = this.selectedCity
      this.selectedCustCity = this.selectedCity
      this.intCustCityId = this.intCityId
      this.intCustStateId = this.intStateId
      this.strCustState = this.selectedState
      this.selectedCustState = this.selectedState
      this.strCustGST = this.strGSTNo
      this.strCustAddress = this.strAddress
      this.strCustPinCode = this.strPincode
    }
    else {
      this.strCustName = ''
      this.intCustContactNo = ''
      this.strCustCity = ''
      this.strCustState = ''
      this.strCustGST = ''
      this.strCustAddress = ''
      this.strCustPinCode = ''
      this.strCustPlace = ''
      this.selectedCustCity = ''
      this.selectedCustState = ''
      this.intCustCityId = null
      this.intCustStateId = null
    }
  }

  saveDelivery() {

    if (!this.strCustName) {
      // this.nameId.first.nativeElement.focus();
      this.toastr.error('Name is required', 'Error!');
      return false;
    }
    else if (!this.intCustContactNo) {
      //  this.contactId.first.nativeElement.focus();
      this.toastr.error('Contact No is required', 'Error!');
      return false;
    }
    else if (this.selectedCustCity != this.strCustCity || !this.selectedCustCity) {
      this.toastr.error('Valid City Name is required', 'Error!');
      this.intCustCityId = null
      this.strCustCity = ''
      this.selectedCustCity = ''
      return false;
    }
    else if (this.selectedCustState != this.strCustState || !this.selectedCustState) {
      this.toastr.error('Valid State Name is required', 'Error!');
      this.intCustStateId = null
      this.strCustState = ''
      this.selectedCustState = ''
      return false;
    }
    // else if (!this.strCustGST)
    // {
    // //  this.gstnoId.first.nativeElement.focus();
    //  this.toastr.error('GST No is required', 'Error!');
    //  return false;
    // }
    else if (!this.strCustAddress) {
      //  this.addressId.first.nativeElement.focus();
      this.toastr.error('Address is required', 'Error!');
      return false;
    }
    else if (!this.strCustPinCode) {
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
    else {
      this.dctData['lstDeliveryData']['strCustName'] = this.strCustName
      this.dctData['lstDeliveryData']['intCustContactNo'] = this.intCustContactNo
      this.dctData['lstDeliveryData']['strCustCity'] = this.selectedCustCity
      this.dctData['lstDeliveryData']['intCustCityId'] = this.intCustCityId
      this.dctData['lstDeliveryData']['strCustState'] = this.selectedCustState
      this.dctData['lstDeliveryData']['intCustStateId'] = this.intCustStateId
      this.dctData['lstDeliveryData']['strCustGST'] = this.strCustGST
      this.dctData['lstDeliveryData']['strCustAddress'] = this.strCustAddress
      this.dctData['lstDeliveryData']['strCustPinCode'] = this.strCustPinCode
      this.dctData['lstDeliveryData']['strCustPlace'] = this.strCustPlace
      this.dctData['lstDeliveryData']['blnCustomer'] = this.blnCustomer

      this.strCustName = this.dctData['lstDeliveryData']['strCustName']
      this.intCustContactNo = this.dctData['lstDeliveryData']['intCustContactNo']
      this.selectedCustCity = this.dctData['lstDeliveryData']['strCustCity']
      this.intCustCityId = this.dctData['lstDeliveryData']['intCustCityId']
      this.selectedCustState = this.dctData['lstDeliveryData']['strCustState']
      this.intCustStateId = this.dctData['lstDeliveryData']['intCustStateId']
      this.strCustGST = this.dctData['lstDeliveryData']['strCustGST']
      this.strCustAddress = this.dctData['lstDeliveryData']['strCustAddress']
      this.strCustPinCode = this.dctData['lstDeliveryData']['strCustPinCode']
      this.strCustPlace = this.dctData['lstDeliveryData']['strCustPlace']
      this.blnCustomer = this.dctData['lstDeliveryData']['blnCustomer']
      this.showModalSerDelivery.close();

    }

  }
  cancelDelivery() {
    this.strCustName = ''
    this.intCustContactNo = ''
    this.strCustCity = ''
    this.selectedCustCity = ''
    this.selectedCustState = ''
    this.intCustCityId = null
    this.intCustStateId = null
    this.strCustState = ''
    this.strCustGST = ''
    this.strCustAddress = ''
    this.strCustPinCode = ''
    this.strCustPlace = ''
    this.blnCustomer = false
    this.showModalSerDelivery.close();
  }

  searchFilter() {
    this.dctData['lstFilterData'] = {}

    if (this.selectedBrand) {
      if (this.selectedBrand != this.strBrand || !this.selectedBrand) {
        this.intBrandId = null
        this.strBrand = ''
        this.selectedBrand = ''
        this.toastr.error('Valid Brand Name is required', 'Error!');
        return false;
      }
    }
    if (this.selectedItem) {
      if (this.selectedItem != this.strItem || !this.selectedItem) {
        this.toastr.error('Valid Item Name is required', 'Error!');
        this.intItemId = null
        this.strItem = ''
        this.selectedItem = ''
        return false;
      }
    }
    if (this.selectedItemCategory) {
      if (this.selectedItemCategory != this.strItemCategory || !this.selectedItemCategory) {
        this.toastr.error('Valid Item Category Name is required', 'Error!');
        this.intItemCategoryId = null
        this.strItemCategory = ''
        this.selectedItemCategory = ''
        return false;
      }
    }
    if (this.selectedItemGroup) {
      if (this.selectedItemGroup != this.strItemGroup || !this.selectedItemGroup) {
        this.toastr.error('Valid Item Group Name is required', 'Error!');
        this.intItemGroupId = null
        this.strItemGroup = ''
        this.selectedItemGroup = ''
        return false;
      }
    }

    if (this.selectedProduct != this.strProduct || !this.selectedProduct) {

      // this.nameId.first.nativeElement.focus();
      this.toastr.error('Product is required', 'Error!');
      this.intProductId = null
      this.strProduct = ''
      this.selectedProduct = ''
      return false;
    }
    else {

      this.dctData['lstFilterData']['intProductId'] = this.intProductId

      if (this.strBrand) {
        this.dctData['lstFilterData']['intBrandId'] = this.intBrandId
      }
      if (this.strItem) {
        this.dctData['lstFilterData']['intItemId'] = this.intItemId
      }
      if (this.strItemCategory) {
        this.dctData['lstFilterData']['intItemCategoryId'] = this.intItemCategoryId
      }
      if (this.strItemGroup) {
        this.dctData['lstFilterData']['intItemGroupId'] = this.intItemGroupId
      }


      this.dctData['lstFilterData']['blnAvailStock'] = this.blnAvailStock
      this.serviceObject.postData('invoice/item_filter/', this.dctData['lstFilterData']).subscribe(res => {
        if (res.status == 1) {
          this.lstFilterData = res['data']


          if (this.lstFilterData.length > 0) {
            this.blnShowData = 0;
          }
          else {
            this.blnShowData = 1;
          }

          this.index = 0
          this.lstFilterData.map(item => {
            this.index = this.index + 1
            if ((Object.keys(this.dct_item)).includes(String(item['intItemId']))) {
              this.lstFilterData[this.index - 1]['intQuantity'] = Number(this.lstFilterData[this.index - 1]['intQuantity']) - Number(this.dct_item[item['intItemId']])
            }
          })

        }
        else if (res.status == 0) {
          swal.fire('Error!', res['message'], 'error');
          this.lstFilterData = []
        }
      },
        (error) => {
          swal.fire('Error!', 'Server Error!!', 'error');
          this.lstFilterData = []

        });
    }
  }

  clickRow(i) {

    if (this.lstFilterData[i]['intQuantity'] > 0) {
      this.clickRowId = i
      // if ((Object.keys(this.dct_item)).includes(String(this.lstFilterData[i]['intItemId'])))
      //   {
      //     this.dct_item[this.lstFilterData[i]['intItemId']] =  this.dct_item[this.lstFilterData[i]['intItemId']] + 1
      //   }
      // else{
      //   this.dct_item[this.lstFilterData[i]['intItemId']] = 1
      // }


      this.newItem.strItemName = this.lstFilterData[i]['strItemName']
      this.newItem.dblRate = this.lstFilterData[i]['dblPrice']
      this.newItem.intItemId = this.lstFilterData[i]['intItemId']
      this.newItem.strItemCode = this.lstFilterData[i]['strItemCode']

      this.blnFilterItem = true
      this.blnShowData = 2;

      this.intBrandId = null
      this.strBrand = ''
      this.selectedBrand = ''
      this.intItemId = null
      this.strItem = ''
      this.selectedItem = ''
      this.intItemCategoryId = null
      this.strItemCategory = ''
      this.selectedItemCategory = ''
      this.intItemGroupId = null
      this.strItemGroup = ''
      this.selectedItemGroup = ''
      this.intProductId = null
      this.strProduct = ''
      this.selectedProduct = ''

      this.showModalFilter.close()
    }
    else {
      swal.fire('Error!', 'Out of Stock', 'error');

    }
  }
  changePoints(event) {
    if (this.intRedeemPoint > this.intTotPoints) {
      this.intRedeemPoint = 0
      this.toastr.error('Invalid Points', 'Error!');
    }
    this.intRedeemAmt = this.intRedeemPoint * this.intAmtPerPoints

  }
  sendOTP() {
    let test = false
    if (test) {
      this.serviceObject.postData('loyaltycard/otp_varification/', { intCustId: this.intCustId }).subscribe(res => {
        if (res.status == 1) {


        }
        else if (res.status == 0) {
          swal.fire('Error!', res['message'], 'error');
        }
      },
        (error) => {
          swal.fire('Error!', 'Server Error!!', 'error');

        });
    }
    else {
      let dct_data = {}
      dct_data['mobile'] = this.intContactNo;
      dct_data['points'] = this.intTotPoints;
      this.serviceObject.postData('paytm_api/validate_cust_point/', dct_data).subscribe(res => {
        if (res.status == 1) {
          console.log('success');

        }
        else {
          console.log('failed');
        }
      },
        err => {
          console.log('error');
        })
    }
    
  }
  redeemPoints() {
    if (!this.intRedeemPoint) {
      this.toastr.error('Enter Redeem Points', 'Error!');
      return false;
    }

  if (!this.intOTP) {
    this.toastr.error('Enter OTP', 'Error!');
    return false;
  }
  else {
    let paytm = true
    if (paytm) {
      console.log(this.salesRowId);

      let dctPushData = { otp: this.intOTP, point: this.intTotPoints, mobile: this.intContactNo, partial_bill_no: this.salesRowId }
      this.serviceObject.postData("paytm_api/redeem_loyalty_point/", dctPushData).subscribe(res => { },
        err => {

        }
      );
    }
    else {

      let dctPushData = {}
      dctPushData = { intOTP: this.intOTP, intCustId: this.intCustId, intRedeemPoint: this.intRedeemPoint }

      this.serviceObject.putData('loyaltycard/otp_varification/', dctPushData).subscribe(res => {
        if (res.status == 1) {
          this.intTotPoints = this.intTotPoints - this.intRedeemPoint
          this.intTotRedeemAmt = (this.intTotPointsCopy - this.intTotPoints) * this.intAmtPerPoints
          this.intGrandTot = this.intGrandTot - this.intTotRedeemAmt

          this.intRedeemPoint = 0
          this.intRedeemAmt = 0
          this.intOTP = 0
          this.showModalPoints.close()
        }
        else if (res.status == 0) {
          swal.fire('Error!', res['message'], 'error');
        }
      },
        (error) => {
          swal.fire('Error!', 'Server Error!!', 'error');

        });
    }
  }
  }

  //payment

  calculateBalance() {
    // console.log(this.intReceivedAmt)
    // negative value converted into positive in cash
    // console.log("intReceivedAmt",this.intReceivedAmt)
    // this.intGrandTot=this.intGrandTot.toFixed()
    if (this.blnCash) {
      if (this.intReceivedAmt < 0) {
        this.intReceivedAmt = (this.intReceivedAmt) * -1
      }
      // if (this.intReceivedAmt ==null) {
      // this.toastr.error('Invalid Amount!!', 'Error!');
      //   this.intReceivedAmt = 0
      // }
    }
    // if(this.intReceivedAmt>10000){


    //   this.toastr.error('Cash Amount Limited to 10000', 'Error!');
    //   this.intReceivedAmt=0
    //   this.intReceivedAmt=Number(this.intReceivedAmt)
    //   console.log("this.intReceivedAmt",this.intReceivedAmt)
    //   return false

    // } 


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
    if (this.blnBharathQr) {
      this.intBharathQrAmount = 0;
      this.lstBharathQR.forEach(element => {             //change the  to get value if credit card payement
        // console.log(element,'element');        
        this.intBharathQrAmount += element.dblAmt;

        
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
        this.intBharathQrAmount = 0
        this.lstBharathQR.forEach(element => {
          console.log(element);
          
        
        if (!element['strName']) {
          swal.fire('Error!', 'Enter Mobile Number', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!element['dblAmt'] || element['dblAmt'] < 0) {
          swal.fire('Error!', 'Enter Valid Amount', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!element['strCardNo']) {
          swal.fire('Error!', 'Enter Bharath QR Transaction Number ', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!/^[a-zA-Z0-9]+$/g.test(element['strCardNo'])) {
          this.blnCash = false
          event.source._checked = false
          swal.fire('Error!', 'Bharath QR Transaction Number  allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }
        else if (!element['strRefNo']) {
          swal.fire('Error!', 'Enter Bharath QR Reference Number ', 'error');
          this.blnCash = false
          event.source._checked = false
        }
        else if (!/^[0-9]+$/g.test(element['strRefNo'])) {
          this.blnCash = false
          event.source._checked = false
          swal.fire('Error!', 'Reference Number allow only numerics ', 'error');
          // -----------------------------------------------
        }
        this.intBharathQrAmount += element['dblAmt'];
      });
    }
    }

    this.calculateBalance()
  }

  // setCheckbox(){
  //   this.blnCreditCard=false;
  //   console.log("setCheckbox this.blnCreditCard ",this.blnCreditCard);

  // }

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
        if (this.blnBharathQr) 
    {
      this.intBalanceAmt = 0;
      this.lstBharathQR.forEach(element => {
      console.log(element);
      
    
    if (!element['strName']) {
        // console.log("ammo1")
        swal.fire('Error!', 'Mobile number is required ', 'error');
        this.blnCreditCard = false
        event.source._checked = false

      }
      else if (!element['dblAmt'] || element['dblAmt'] < 0) {
        swal.fire('Error!', 'Valid Bharath QR amount required ', 'error');
        this.blnCreditCard = false
            event.source._checked = false
      }
      else if (!element['strCardNo']) {
        swal.fire('Error!', 'Bharath QR Transaction Number required', 'error');
        this.blnCreditCard = false
            event.source._checked = false
      }
      else if (!/^[a-zA-Z0-9]+$/g.test(element['strCardNo'])) {
        this.blnCreditCard = false
        event.source._checked = false
        swal.fire('Error!', 'Bharath QR Transaction Number  allow only alpha numerics ', 'error');
        // -----------------------------------------------
      }
      else if (!element['strCardNo']) {
        swal.fire('Error!', 'Bharath QR  Reference Number required', 'error');
        this.blnCreditCard = false
          event.source._checked = false
      }
      this.intBharathQrAmount += element['dblAmt'];
    });
    }
      }

      this.calculateBalance()
    }
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
        if (this.blnBharathQr) 
    {
      this.intBharathQrAmount = 0;
      this.lstBharathQR.forEach(element => {
      console.log(element);
      
    
    if (!element['strName']) {
        // console.log("ammo1")
        swal.fire('Error!', 'Mobile number is required ', 'error');
        this.blnDebitCard = false
        event.source._checked = false

      }
      else if (!element['dblAmt'] || element['dblAmt'] < 0) {
        swal.fire('Error!', 'Valid Bharath QR amount required ', 'error');
        this.blnDebitCard = false
            event.source._checked = false
      }
      else if (!element['strCardNo']) {
        swal.fire('Error!', 'Bharath QR Transaction Number required', 'error');
        this.blnDebitCard = false
            event.source._checked = false
      }
      else if (!/^[a-zA-Z0-9]+$/g.test(element['strCardNo'])) {
        this.blnDebitCard = false
            event.source._checked = false
        swal.fire('Error!', 'Bharath QR Transaction Number  allow only alpha numerics ', 'error');
        // -----------------------------------------------
      }
      else if (!element['strCardNo']) {
        swal.fire('Error!', 'Bharath QR  Reference Number required', 'error');
        this.blnDebitCard = false
            event.source._checked = false
      }
      this.intBharathQrAmount += element['dblAmt'];
    });
    }

      }

      this.calculateBalance()

    }
  }
  receiptChanged(event) {
    // console.log('receiptn',event);

    if (!this.blnReceipt) {
      // this.intDebitAmt=0
      this.strReceiptNumber = ''
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
          if (this.intApprove == 4) {
            if (this.blnFinance) {
              this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
            }
            else if (this.blnReceipt) {
              this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intReceiptTot + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
            }
            else if (this.blnFinance && this.blnReceipt) {
              this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt - this.intReceiptTot) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
            }
            else {
              this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
            }
          } else {
            if (this.blnFinance) {
              this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
            }
            else if (this.blnReceipt) {
              this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intReceiptTot + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
            }
            else if (this.blnFinance && this.blnReceipt) {
              this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt - this.intReceiptTot) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
            }
            else {
              this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
            }
          }

        }
        else {

          this.intReceiptTot = 0;
          this.total_receipt = 0;

          this.lstReceipt.map(items => {
            items.receipt = false;

          })
          if (this.intApprove == 4) {
            if (this.blnFinance) {
              this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
            }
            else if (this.blnReceipt) {
              this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intReceiptTot + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
            }
            else if (this.blnFinance && this.blnReceipt) {
              this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt - this.intReceiptTot) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
            }
            else {
              this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
            }
          } else {
            if (this.blnFinance) {
              this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
            }
            else if (this.blnReceipt) {
              this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intReceiptTot + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
            }
            else if (this.blnFinance && this.blnReceipt) {
              this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt - this.intReceiptTot) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
            }
            else {
              this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
            }
          }
        }
      })

    }
    else {
      if (this.intApprove == 4) {
        if (this.blnFinance) {
          this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
        }
        else if (this.blnReceipt) {
          this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intReceiptTot + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
        }
        else if (this.blnFinance && this.blnReceipt) {
          this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt - this.intReceiptTot) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
        }
        else {
          this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
        }
      } else {
        if (this.blnFinance) {
          this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
        }
        else if (this.blnReceipt) {
          this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intReceiptTot + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
        }
        else if (this.blnFinance && this.blnReceipt) {
          this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt - this.intReceiptTot) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount) + this.intExtraFinanceAmt;
        }
        else {
          this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt + this.intPaytmAmount + this.intPaytmMallAmount + this.intBharathQrAmount);
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
  paytmChanged(event) {

    event.source._checkError = false;

    if (this.blnPaytm) {
      event.source.checked = true;
    }
    else {
      event.source.checked = false;

    }


    if (!this.blnPaytm) {
      this.intPaytmMobileNumber = null;
      this.intPaytmAmount = 0;
      this.strPaytmTransactionNum = '';
      this.strPaytmReferenceNum = '';

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
          this.blnPaytm = false;
          event.source.checked = false;

        }
      }
      if (this.blnCash) {
        if (!this.intReceivedAmt) {
          swal.fire('Error!', 'Enter Valid Amount ', 'error');
          this.blnPaytm = false
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
          this.blnPaytm = false;
          event.source.checked = false;

        }
      }

      if (this.blnPaytmMall) {
        if (!this.intPaytmMallMobileNumber) {
          swal.fire('Error!', 'Enter Mobile Number', 'error');
          this.blnPaytm = false
          event.source._checked = false
        }
        else if (!this.intPaytmMallAmount || this.intPaytmMallAmount < 0) {
          swal.fire('Error!', 'Enter Valid Amount', 'error');
          this.blnPaytm = false
          event.source._checked = false
        }
        else if (!this.strPaytmMallTransactionNum) {
          swal.fire('Error!', 'Enter Paytm Mall Transaction Number ', 'error');
          this.blnPaytm = false
          event.source._checked = false
        }
        else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmMallTransactionNum)) {
          this.blnPaytm = false
          event.source._checked = false
          swal.fire('Error!', 'Paytm Mall Transaction Number  allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }
        else if (!this.strPaytmMallReferenceNum) {
          swal.fire('Error!', 'Enter Paytm Mall Reference Number ', 'error');
          this.blnPaytm = false
          event.source._checked = false
        }
      }
      if (this.blnBharathQr) {
        if (!this.intBharathQrMobileNumber) {
          swal.fire('Error!', 'Enter Mobile Number', 'error');
          this.blnPaytm = false
          event.source._checked = false
        }
        else if (!this.intBharathQrAmount || this.intBharathQrAmount < 0) {
          swal.fire('Error!', 'Enter Valid Amount', 'error');
          this.blnPaytm = false
          event.source._checked = false
        }
        else if (!this.strBharathQrTransactionNum) {
          swal.fire('Error!', 'Enter Paytm Mall Transaction Number ', 'error');
          this.blnPaytm = false
          event.source._checked = false
        }
        else if (!/^[a-zA-Z0-9]+$/g.test(this.strBharathQrTransactionNum)) {
          this.blnPaytm = false
          event.source._checked = false
          swal.fire('Error!', 'Paytm Mall Transaction Number  allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }
        else if (!this.strBharathQrReferenceNum) {
          swal.fire('Error!', 'Enter Paytm Mall Reference Number ', 'error');
          this.blnPaytm = false
          event.source._checked = false
        }
      }


    }

    this.calculateBalance()

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

      console.log("#######lstBharathQR",this.lstBharathQR);
      
      this.intBharathQrMobileNumber = null;
      this.intBharathQrAmount = 0;
      this.strBharathQrTransactionNum = '';
      this.strBharathQrReferenceNum = '';
      this.lstBharathQR=[
        {
          strName: '',
          dblAmt: null,
          strCardNo: null,
          strRefNo: null,
        }
      ];

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
  paytmMallChanged(event) {


    event.source._checkError = false;

    if (this.blnPaytmMall) {
      event.source.checked = true;
    }
    else {
      event.source.checked = false;

    }


    if (!this.blnPaytmMall) {
      this.intPaytmMallMobileNumber = null;
      this.intPaytmMallAmount = 0;
      this.strPaytmMallTransactionNum = '';
      this.strPaytmMallReferenceNum = '';

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
          this.blnPaytmMall = false;
          event.source.checked = false;

        }

      }
      if (this.blnCash) {
        if (!this.intReceivedAmt) {
          swal.fire('Error!', 'Enter Valid Amount ', 'error');
          this.blnPaytmMall = false
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
          this.blnPaytmMall = false;
          event.source.checked = false;

        }

      }
      if (this.blnPaytm) {
        if (!this.intPaytmMobileNumber) {
          swal.fire('Error!', 'Enter Mobile Number', 'error');
          this.blnPaytmMall = false
          event.source._checked = false
        }
        else if (!this.intPaytmAmount || this.intPaytmAmount < 0) {
          swal.fire('Error!', 'Enter Valid Amount', 'error');
          this.blnPaytmMall = false
          event.source._checked = false
        }
        else if (!this.strPaytmTransactionNum) {
          swal.fire('Error!', 'Enter Paytm Transaction Number ', 'error');
          this.blnPaytmMall = false
          event.source._checked = false
        }
        else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmTransactionNum)) {
          this.blnPaytmMall = false
          event.source._checked = false
          swal.fire('Error!', 'Paytm Transaction Number  allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }
        else if (!this.strPaytmReferenceNum) {
          swal.fire('Error!', 'Enter Paytm Reference Number ', 'error');
          this.blnPaytmMall = false
          event.source._checked = false
        }
        else if (!/^[a-zA-Z0-9]+$/g.test(this.strPaytmReferenceNum)) {
          this.blnPaytmMall = false
          event.source._checked = false
          swal.fire('Error!', 'Reference Number allow only alpha numerics ', 'error');
          // -----------------------------------------------
        }
      }

    }

    this.calculateBalance()

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
    if (this.blnBharathQr) 
    {
      this.intBharathQrAmount = 0
      this.lstBharathQR.forEach(element => {
      console.log(element);
      
    
    if (!element['strName']) {
        // console.log("ammo1")
        swal.fire('Error!', 'Mobile number is required ', 'error');
        checkError = true

      }
      else if (element['strName'].toString().length < 10 || element['strName'].toString().length > 10) {
        swal.fire('Error!', 'Invalid Mobile number', 'error');
        checkError = true;

      }
      else if (!element['dblAmt'] || element['dblAmt'] < 0) {
        swal.fire('Error!', 'Valid Bharath QR amount required ', 'error');
        checkError = true
      }
      else if (!element['strCardNo']) {
        swal.fire('Error!', 'Bharath QR Transaction Number required', 'error');
        checkError = true

      }
      else if (!/^[a-zA-Z0-9]+$/g.test(element['strCardNo'])) {
        checkError = true
        swal.fire('Error!', 'Bharath QR Transaction Number  allow only alpha numerics ', 'error');
        // -----------------------------------------------
      }
      else if (!element['strCardNo']) {
        swal.fire('Error!', 'Bharath QR  Reference Number required', 'error');
        checkError = true

      }
      else if (!/^[a-zA-Z0-9]+$/g.test(element['strCardNo'])) {
        checkError = true
        swal.fire('Error!', 'Reference Number allow only alpha numerics ', 'error');
        // -----------------------------------------------
      }
      this.intBharathQrAmount += element['dblAmt'];
    });
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
        this.dctData['lstPaymentData'][7]['BharathQR'] = this.lstBharathQR;

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
    this.total_receipt=0;


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
      this.lstBharathQR=[];
      let dctCreditQR = {
        strName: '',
        dblAmt: null,
        strCardNo: null,
        strRefNo: null,
    }

    this.lstBharathQR.push(dctCreditQR);

    this.intReceiptTot = 0
    // if (this.blnFinance) {
    //   if (this.intApprove == 4) {
    //     this.intBalanceAmt = (this.dblPartialAmount - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt) + this.intExtraFinanceAmt;
    //   } else {
    //     this.intBalanceAmt = (this.intGrandTot - this.intFinanceAmt) - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt) + this.intExtraFinanceAmt;
    //   }
    // }
    // else {
    //   if (this.intApprove == 4) {
    //     this.intBalanceAmt = this.dblPartialAmount - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt);
    //   } else {
    //     this.intBalanceAmt = this.intGrandTot - (this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt);
    //   }
    // }
    this.intReceiptTot = 0
    // console.log("this.intBalanceAmtafter",this.intBalanceAmt)
    this.blnReciptCall = true
    // this.intBalanceAmt = this.intGrandTot -(this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
    this.showModalPayment.close();
  }
  //  Sales Return
  customerChanged(event) {
    if (event === undefined || event === null) {
      this.lstReturnCustomer = [];
    } else {
      if (event.length >= 7) {
        this.serviceObject
          .postData('salesreturn/get_details_customer/', { str_search: event })
          .subscribe(
            (response) => {
              this.lstReturnCustomer = response['customer_list'];
            }
          );
      }
    }
  }
  radioChange() {
    this.blnReturnData = true;
    this.lstReturnItems = [];
    this.lstReturnQty = [];
    this.strReturnImei = ''
    this.strInvoiceNo = ''
    this.datReturnFrom = null
    this.datReturnTo = null
    this.selectedReturnCustomer = ''
    this.selectedReturnCustomer = ''
  }
  CustomerClicked(item) {
    this.selectedReturnCustomerId = item.pk_bint_id;
    this.selectedReturnCustomerPhno = item.int_mobile;
    this.strReturnCustomerName = item.vchr_name;

  }
  getInvoice() {
    this.blnReturnData = true;
    this.lstReturnItems = [];
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

    if (this.strReturnType === '2' && (this.selectedReturnCustomerId === '' || this.selectedReturnCustomer != this.strReturnCustomerName)) {
      this.toastr.error('Valid customer is required ');
      this.selectedReturnCustomerId = null
      this.selectedReturnCustomer = ''
      this.strReturnCustomerName = ''
      return;
    }
    if (this.strReturnImei !== '') {
      dct_data['imei'] = this.strReturnImei;
    }
    if (this.strInvoiceNo !== '') {
      dct_data['invoiceNo'] = this.strInvoiceCode + '-' + this.strBranchCode.toUpperCase() + '-' + this.strInvoiceNo;
    }
    if (this.datReturnFrom !== null && this.datReturnTo !== null) {
      const datReturnFrom = moment(this.datReturnFrom).format('YYYY-MM-DD');
      const datReturnTo = moment(this.datReturnTo).format('YYYY-MM-DD');
      dct_data['datFrom'] = datReturnFrom;
      dct_data['datTo'] = datReturnTo;
    }
    // if (this.selectedReturnCustomerId !== '') {
    dct_data['int_customer'] = this.selectedReturnCustomerId;
    // }
    // console.log(dct_data,'data');

    this.serviceObject
      .postData('salesreturn/get_details/', dct_data)
      .subscribe(
        (response) => {
          if (response.status == 1) {
            this.lstReturnItems = response['data'];
            this.lstReturnQty = response['data_qty'];
          }
          else if (response.status == 0) {
            this.toastr.error(response['message'], 'Error!');

            this.lstReturnItems = []
          }
        }
      );
  }

  returnItem(item) {

    // console.log(item,'item');

    let blnExist = false


    let returnItem = {
      intItemId: item.item_id,
      strItemName: item.item,
      dblMopAmount: 0,
      GST: item.GST,
      dblMarginAmount: 0,
      strImei: item.imei,
      dblRate: item.dbl_amount,
      dblBuyBack: item.dbl_buy_back,
      dblDiscount: item.dbl_discount,
      dblCGST: 0,
      dblSGST: 0,
      dblIGST: 0,
      dblAmount: item.dbl_selling_price,
      intQuantity: this.lstReturnQty[item.int_id],
      intStatus: 0,
      salesDetailId: item.int_id,
      strItemCode: item.item_code,
      intInvoiceNo: item.enquiry_num,
      intMasterId: item.int_master_id,
      dblCGSTPer: item.dblCGSTPer,
      dblIGSTPer: item.dblIGSTPer,
      dblSGSTPer: item.dblSGSTPer,
    }



    if (item.tax.hasOwnProperty('dblCGST')) {
      returnItem['dblCGST'] = item.tax.dblCGST;
    }
    if (item.tax.hasOwnProperty('dblSGST')) {
      returnItem['dblSGST'] = item.tax.dblSGST;
    }
    if (item.tax.hasOwnProperty('dblIGST')) {
      returnItem['dblIGST'] = item.tax.dblIGST;
    }
    if (item.tax.hasOwnProperty('dblKFC')) {
      returnItem['intKfc'] = item.tax.dblKFC;         //newly added for return invoice
      returnItem['dblKFC'] = item.tax.dblKFC;
    }

    this.lstItemDetails.forEach(element => {
      if (element.intStatus == 0) {
        if (returnItem.strImei) {
          if (element.strImei == returnItem.strImei && element.strItemCode == returnItem.strItemCode && element.salesDetailId == returnItem.salesDetailId) {
            // console.log("dgfs",element.salesDetailId,"df",returnItem.salesDetailId)
            this.toastr.error('Return item already exist', 'Error!');
            blnExist = true
          }
        }
        else {
          if (element.salesDetailId == returnItem.salesDetailId) {
            // console.log("in  if(element.salesDetailId==returnItem.salesDetailId)");

            if (this.dctReturn[returnItem.salesDetailId] >= returnItem.intQuantity) {
              this.toastr.error('Return item already exist', 'Error!');
              blnExist = true
            }

          }
        }
      }
    });

    if (!blnExist) {
      if (!this.dctReturn.hasOwnProperty(returnItem.salesDetailId)) {
        this.dctReturn[returnItem.salesDetailId] = 1
      }
      else {
        this.dctReturn[returnItem.salesDetailId] = this.dctReturn[returnItem.salesDetailId] + 1
      }
      this.blnReturn = true;
      this.lstItemDetails.push(returnItem);
      // this.preItemList.push(returnItem);



      this.linkShow.push('none');
      this.offerDis.push(0);

      this.lstReturnItems = []
      this.strReturnImei = '';
      this.datReturnFrom = null;
      this.datReturnTo = null;
      // this.selectedReturnCustomer= '';
      this.lstReturnCustomer = [];
      // this.selectedReturnCustomerPhno = '';
      // this.strReturnCustomerName = '';
      // this.selectedReturnCustomerId = '';
      this.strInvoiceNo = ''


      this.billingDatails("other", 0);
      // if(this.intGrandTot<0)
      // {
      //   swal.fire('Error!','Purchase amount should be greater than return amount','error')
      // }

      this.showModalReturn.close();
    }
    else {

      this.lstReturnItems = []
      this.strReturnImei = '';
      this.strInvoiceNo = ''
      this.datReturnFrom = null;
      this.datReturnTo = null;
      // this.selectedReturnCustomer= '';
      this.lstReturnCustomer = [];
      // this.selectedReturnCustomerPhno = '';
      // this.strReturnCustomerName = '';
      // this.selectedReturnCustomerId = '';
      this.showModalReturn.close();

    }

    this.blnReturn = false;
  }
  indirectDiscount(index) {
    // console.log (this.lstIndirectDis[index]);

    // console.log(this.lstIndirectDis[index],this.lstItemDetails[index].dblAmount,"amt,item amt");

    if (this.lstIndirectDis[index] >= this.lstItemDetails[index].dblAmount) {
      this.toastr.error('Indirect discount amount should be less than item amount', 'Error!');
    }
    else {

      this.intTotIndirectDis = 0
      this.billingDatails("other", 0);
      this.lstItemDetails[index]['dblIndirectDis'] = Number(this.lstIndirectDis[index]);
      // this.preItemList[index]['dblIndirectDis']=Number(this.lstIndirectDis[index]);
      this.showModalDiscount.close();
    }
  }


  Preview1(files, event, index) {
    this.dctReturnDetail[this.currentIndex]['message'] = ''
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
          this.imgURL1 = reader.result;
          this.dctReturnDetail[this.currentIndex]['message'] = files[0]['name']
          // console.log( this.dctReturnDetail[this.currentIndex]," this.dctReturnDetail[this.currentIndex]");

        }
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          this.image1 = file
          this.form.get('img1').setValue(file);
          this.dctReturnDetail[this.currentIndex].image = this.form.get('img1').value


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
  returnDetailsSave(currentIndex) {

    if (this.dctReturnDetail[currentIndex].blnDamage && !this.dctReturnDetail[currentIndex].image) {
      this.toastr.error('Image is required', 'Error!');
    }
    else if (!this.dctReturnDetail[currentIndex].strRemark) {
      this.toastr.error('Remarks is mandatory', 'Error!');
    }
    else {

      this.dctImages[Number(this.returnId)] = this.form.get('img1').value
      this.dctReturnId[Number(this.returnId)] = {}
      this.dctReturnId[Number(this.returnId)]['blnDamage'] = this.dctReturnDetail[currentIndex].blnDamage
      this.dctReturnId[Number(this.returnId)]['strRemarks'] = this.dctReturnDetail[currentIndex].strRemark
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
  openreceiptview(item) {
    // console.log('a',item)
    localStorage.setItem('receiptId', item.pk_bint_id);
    localStorage.setItem('invoiceReceipt', item.vchr_receipt_num)
    localStorage.setItem('previousUrl', 'receipt/viewreceipt');

    this.router.navigate(['receipt/viewreceipt']);
    this.showModalPayment.close();
  }


  setClass() {

    if (this.lstIndex == 0) {
      this.lstIndex = 1;
      // this.blnShow1=true;
      // this.blnShow2=false;
      // this.blnShow3=false;
      // this.blnShow4=false;

    }
    else if (this.lstIndex == 1) {
      this.lstIndex = 2;
      // this.blnShow1=false;
      // this.blnShow2=true;
      // this.blnShow3=false;
      // this.blnShow4=false;
    }
    else if (this.lstIndex == 2) {
      this.lstIndex = 3;
      // this.blnShow1=false;
      // this.blnShow2=false;
      // this.blnShow3=true;
      // this.blnShow4=false;
    }
    else if (this.lstIndex == 3) {
      this.lstIndex = 0;
      // this.blnShow1=false;
      // this.blnShow2=false;
      // this.blnShow3=false;
      // this.blnShow4=true;
    }
  }
  bankChanged(index, item, type) {

    if (type == 'credit') {
      this.lstCredit[index]['strName'] = item.vchr_name;
    }
    else if (type == 'debit') {
      this.lstDebit[index]['strName'] = item.vchr_name;

    }

  }
  rejectInvoice() {

    console.log("thisss 7893");
    
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reject it!'
    }).then((result) => {

      if (result.value) {
        Swal.fire({
          // title: "Remarks",
          text: "Please enter the remarks",
          input: 'text',
          // showCancelButton: true
        }).then((result) => {

          if (result.value) {


            this.serviceObject.putData('invoice/add_invoice/', { intPartialId: this.salesRowId, strRemark: result.value }).subscribe(res => {
              if (res.status == 1) {
                Swal.fire(
                  'Rejected!',
                  'Invoice has been Rejected.',
                  'success'
                )
                localStorage.setItem('previousUrl', 'invoice/saleslist');

                this.router.navigate(['invoice/saleslist']);

              }
              else if (res.status == 0) {
                swal.fire('Error!', res['message'], 'error');
              }
            },
              (error) => {
                swal.fire('Error!', 'Server Error!!', 'error');

              });
          }
          else {
            this.toastr.warning('Must enter Remarks.', 'Warning!');
          }

        });
      }

    })


    // this.serviceObject.putData('invoice/add_invoice/',{intPartialId:this.salesRowId}).subscribe(res => {
    //   if (res.status == 1)
    //   {
    //     swal.fire('Success!',res['message'], 'success');
    //     this.router.navigate(['invoice/saleslist']);

    //   }
    //   else if (res.status == 0) {
    //     swal.fire('Error!',res['message'], 'error');
    //     }
    //   },
    //   (error) => {
    //     swal.fire('Error!','Server Error!!', 'error');

    //   });

  }


  RateClick(index: number, event) {

  }

  RateKeypress(index: number, event) {



    // this.lstItemDetails[index]['dblDiscount'] = 0
    // this.lstItemDetails[index]['dblBuyBack'] = 0

    // on Enter Button Press
    if (event.keyCode == 13 || event.which == 13) {
      // console.log(this.lstItemDetails[index],event,'item')
      if (this.lstItemDetails[index]['dblAmount'] == null || this.lstItemDetails[index]['dblAmount'] == 0) {
        this.lstItemDetails[index]['dblAmount'] = 0
        this.lstItemDetails[index]['dblRate'] = 0
        this.lstItemDetails[index]['dblDiscount'] = 0
        this.lstItemDetails[index]['dblBuyBack'] = 0
        this.lstItemDetails[index]['dblCGST'] = 0
        this.lstItemDetails[index]['dblSGST'] = 0
        this.lstItemDetails[index]['dblIGST'] = 0
      }


      this.billingDatails("other", 0);
      event.target.blur()
    }
    else {

      if (![48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 46].includes(event.keyCode)) {
        return false
      }
      // if (this.lstItemDetails[index]['dblAmount'] == null) {
      //   this.lstItemDetails[index]['dblAmount'] = 0
      //   return false
      // }
      else if (Number(this.lstItemDetails[index]['dblAmount']) > 100000 || String(this.lstItemDetails[index]['dblAmount']).length > 10) {
        event.preventDefault();
      }




      // if (!this.blnCheckIGST) {

      //    this.intExchangeSalesAmount = 0;
      //    if(this.lstItemDetails[index]['dblAmount'] !=0){
      //     this.intExchangeSalesAmount =   this.lstItemDetails[index]['dblAmount'] - this.lstItemDetails[index]['exchange_sale_amount'] ;
      //    }
      //    else{
      //      this.intExchangeSalesAmount = 0;
      //    }


      //    if(this.blnExchangeInvoice){
      //     this.lstItemDetails[index]['dblRate'] = ((this.intExchangeSalesAmount  + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'])
      //     this.lstItemDetails[index]['dblCGST'] = (this.lstItemDetails[index]['dblCGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
      //     this.lstItemDetails[index]['dblSGST'] = (this.lstItemDetails[index]['dblSGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
      //     this.lstItemDetails[index]['dblRate'] =  this.lstItemDetails[index]['dblRate'] + this.lstItemDetails[index]['exchange_sale_amount'];
      //    }
      //    else{
      //     this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount'] + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'])

      //     //  dblCGST = ( CGSTPercentage * dblRate ) / 100

      //     // console.log( this.lstItemDetails[index]['dblRate'],'dblrate');


      //     this.lstItemDetails[index]['dblCGST'] = (this.lstItemDetails[index]['dblCGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
      //     this.lstItemDetails[index]['dblSGST'] = (this.lstItemDetails[index]['dblSGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
      //    }



      //   // }

      // }
      // else {

      //   this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount'] + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblIGSTPer'])
      //   this.lstItemDetails[index]['dblIGST'] = (this.lstItemDetails[index]['dblIGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100

      // }
      // this.billingDatails("other", 0);
    }


  }

  RateKeyup(index: number, event) {








    if (this.lstItemDetails[index]['dblAmount'] == null || this.lstItemDetails[index]['dblAmount'] == 0) {

      this.lstItemDetails[index]['dblAmount'] = 0
      this.lstItemDetails[index]['dblRate'] = 0
      this.lstItemDetails[index]['dblCGST'] = 0
      this.lstItemDetails[index]['dblSGST'] = 0
      this.lstItemDetails[index]['dblIGST'] = 0
      // this.billingDatails("other", 0);
      // return false
    }
    // else if (this.lstItemDetails[index]['dblAmount'] == 0){

    // }



    if (this.lstItemDetails[index]['dblAmount'] > this.lstItemDetails[index]['exchange_sale_amount']) {
      this.intExchangeSalesAmount = this.lstItemDetails[index]['dblAmount'] - this.lstItemDetails[index]['exchange_sale_amount'];
    }
    else {
      this.intExchangeSalesAmount = 0;
    }





    let lenList = String(this.lstItemDetails[index]['dblAmount']).split('\.').length
    if (lenList > 2) {
      this.rateId.nativeElement.focus();
      this.lstItemDetails[index]['dblAmount'] = 0
      this.toastr.error('Invalid Amount', 'Error!');

      return false;
    }
    else {
      if (String(this.lstItemDetails[index]['dblAmount']).split('\.')[1] == "") {
        return false
      }
    }

    if (!this.blnCheckIGST) {

      //  dblRate =   (  ( dblAmount + dblDiscount + dblBuyBack ) * 100  )  /  ( 100 + dblCGSTPer + dblCGSTPer )




      //  dblCGST = ( CGSTPercentage * dblRate ) / 100
      if (this.blnExchangeInvoice) {

        if (this.strGSTNo) {
          this.lstItemDetails[index]['dblRate'] = ((this.intExchangeSalesAmount + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'])
        }
        else {

          this.lstItemDetails[index]['dblRate'] = ((this.intExchangeSalesAmount + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'] + 1)
        }

        this.lstItemDetails[index]['dblCGST'] = (this.lstItemDetails[index]['dblCGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100         // in exchange the difference of amount is taken 
        this.lstItemDetails[index]['dblSGST'] = (this.lstItemDetails[index]['dblSGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
        this.lstItemDetails[index]['dblRate'] = this.lstItemDetails[index]['dblRate'] + this.lstItemDetails[index]['exchange_sale_amount'] // add excahnge amount to the dbl amount


      }
      else {

        if (this.strGSTNo) {
          this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount'] + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'])
        }
        else {
          this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount'] + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'] + 1)
        }

        this.lstItemDetails[index]['dblCGST'] = (this.lstItemDetails[index]['dblCGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
        this.lstItemDetails[index]['dblSGST'] = (this.lstItemDetails[index]['dblSGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
      }

    }
    else {

      if (this.blnExchangeInvoice) {
        // if(this.strGSTNo){
        this.lstItemDetails[index]['dblRate'] = ((this.intExchangeSalesAmount + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblIGSTPer'])
        // }
        // else{
        // this.lstItemDetails[index]['dblRate'] = ((this.intExchangeSalesAmount + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblIGSTPer']+1)
        // 
        // }
        this.lstItemDetails[index]['dblIGST'] = (this.lstItemDetails[index]['dblIGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
        this.lstItemDetails[index]['dblRate'] = this.lstItemDetails[index]['dblRate'] + this.lstItemDetails[index]['exchange_sale_amount'];

      }
      else {

        // if(this.strGSTNo){
        this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount'] + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblIGSTPer'])
        // }
        // else{
        // this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount'] + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblIGSTPer']+1)

        // }

        this.lstItemDetails[index]['dblIGST'] = (this.lstItemDetails[index]['dblIGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
      }






    }
    //for discount issue in grand total
    //  this.billingDatails("other", 0);
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


    this.billingDatails("other", 0);
  }

  EnterRate(index: number, event) {




    if (this.lstItemDetails[index]['intStatus'] == 2 && this.lstItemDetails[index]['dblAmount'] > 0) {
      let amount = this.lstItemDetails[index]['dblAmount'] * -1

      this.lstItemDetails[index]['dblAmount'] = amount
      this.lstItemDetails[index]['dblRate'] = amount

    }
  }
  verifyInvoice() {
    // ============================================================================
    this.lstItemDetails[this.currentIndex]['blnVerified'] = true
    let count_exchange = 0
    let count_varified = 0
    this.lstItemDetails.map(item => {
      if (item.intStatus == 2) {
        count_exchange += 1
        if (item.blnVerified) {
          count_varified += 1
        }
      }
    })
    if (count_exchange == count_varified) {
      this.blnVerifyInvoice = true;
      this.saveDisable = false
    }



    // ============================================================================

    // if(this.blnVerifyInvoice == false){
    //   this.blnVerifyInvoice = true;

    //   Swal.fire(
    //     'Verified!',
    //     'Item Verified.',
    //     'success'
    //   )

    // }
    // else{
    //   this.toastr.error('Already verified', 'Error!');
    // }



  }

  addDebit() {

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

  closeDebit(index) {

    if (!this.lstDebit[index]['strCardNo'] && !this.lstDebit[index]['intBankId'] && !this.lstDebit[index]['dblAmt'] && !this.lstDebit[index]['strEmi'] && !this.lstDebit[index]['strRefNo'] && !this.lstDebit[index]['intCcCharge'] && !this.lstDebit[index]['strName']) {
      this.lstDebit.splice(index, 1);
    }
    else {

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
          this.lstDebit.splice(index, 1);

          swal.fire(
            'Deleted!',
            "Data Deleted successfully",
            'success'
          )
        }
      }
      )

    }

  }



  addCredit() {





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
  addBharathQR() {





    let dctCredit = {
        strName: '',
        dblAmt: null,
        strCardNo: null,
        strRefNo: null,
    }

    this.lstBharathQR.push(dctCredit);
  }

  closeCredit(index) {

    if (!this.lstCredit[index]['strCardNo'] && !this.lstCredit[index]['intBankId'] && !this.lstCredit[index]['dblAmt'] && !this.lstCredit[index]['strScheme'] && !this.lstCredit[index]['strRefNo'] && !this.lstCredit[index]['intCcCharge'] && !this.lstCredit[index]['strName']) {

      this.lstCredit.splice(index, 1);
    }
    else {


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
          this.lstCredit.splice(index, 1);

          swal.fire(
            'Deleted!',
            "Data Deleted successfully",
            'success'
          )
        }
      }
      )

    }

  }
  closeBharathQR(index) {

    if (!this.lstBharathQR[index]['strName'] && !this.lstBharathQR[index]['dblAmt'] && !this.lstBharathQR[index]['strCardNo'] && !this.lstBharathQR[index]['strRefNo'] ) {

      this.lstBharathQR.splice(index, 1);
    }
    else {


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
          this.lstBharathQR.splice(index, 1);

          swal.fire(
            'Deleted!',
            "Data Deleted successfully",
            'success'
          )
        }
      }
      )

    }
    this.calculateBalance();

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



    // if(this.str_OTP_entered == this.str_otp){
    //   this.int_editcount = 2
    //   this.int_cust_edit = 1
    //   this.str_OTP_entered = ""
    //   this.showModalOtp.close()
    //   this.showModalCustEdit = this.modalService.open(customeredit, { size: 'lg' });
    // }
    // else{
    //   this.toastr.error('OTP Validation Failed');
    // }
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
  CancelOTPSend(customeredit) {

    this.int_cust_edit = 2
    this.showModalConfirmation.close()
    this.showModalCustEdit = this.modalService.open(customeredit, { size: 'lg' });
  }

  timeLeft: number = 60;
  interval;
  bln_timer = false

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

  customerNgModelChanged(event) {
    if (this.currentCustomer != this.strSelectedCustomer) {
      this.intCustomerId = null;
      this.strCustomer = '';
    }
  }
  customerChangeds(item) {
    this.currentCustomer = item.name;
    this.intCustomerId = item.id;
    this.strCustomer = item.name;
    this.strSelectedCustomer = item.name;

    this.intSalesCustId = item.id;
    this.intContactNo = item.phone;



  }
  customerNumberModelChange(event) {
    if (this.intContactNo != this.selecetedCustNumber) {
      this.intContactNo = null;
      // this.strCustomer = '';
    }


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
   this.intCustomerType=item['int_cust_type'];

  }

  creditSaleChanged() {
    this.blnCreditSale != this.blnCreditSale;
  }
  creditSaleRequest() {
    if (this.intBalanceAmt == 0) {
      this.toastr.error('No balance amount', 'Error!');
      return;
    }
    if (this.intBalanceAmt < 0 && this.blnMakePayment && !this.blnAmazonOrFlipkart) {
      this.toastr.error('Amount Exceeded', 'Error!');
      return;
    }
    if (this.lstItemDetails.length == 0) {
      this.toastr.error('Atleast One Item is required', 'Error!');
      return
    }
    // if (this.dblPartialAmount <= 0) {
    //   this.toastr.error('Partial amount is required', 'Error!');
    //   return
    // }
    let strAlert = "Are you sure want to continue ?"
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
        const form_data = new FormData;
        form_data.append('partial_id', this.salesRowId)
        form_data.append('lstItems', JSON.stringify(this.lstItemDetails))
        form_data.append('dblTotalAmount', this.intGrandTot)
        form_data.append('strRemarks', this.strRemarks)
        form_data.append('dblPartialAmount', String(this.dblPartialAmount));
        form_data.append('dblBalanceAmount', String(this.intBalanceAmt));
        this.serviceObject.postData('invoice/credit_settlement/', form_data).subscribe(res => {
          if (res.status == 1) {
            swal.fire({
              position: "center",
              type: "success",
              text: "Request Submitted Successfully",
              showConfirmButton: true,
            });
            this.intApprove = res['int_approve'];
            this.router.navigate(['invoice/saleslist']);
          }
          else if (res.status == 0) {
            swal.fire('Error!', res['message'], 'error');
          }
        },
          (error) => {
            swal.fire('Error!', 'Server Error!!', 'error');
          });
      };
    });
  }
  creditsaleapprove(intApproveReject) {
    let dctData = {};
    let str_message = '';
    if (intApproveReject == 0) {
      dctData['rejectId'] = this.salesRowId;
      str_message = 'Rejected';
    }
    if (intApproveReject == 1) {
      dctData['approveId'] = this.salesRowId;
      str_message = "Request Approved Successfully";
    }
    this.serviceObject.postData('invoice/credit_settlement/', dctData).subscribe(res => {
      if (res.status == 1) {
        swal.fire({
          position: "center",
          type: "success",
          text: str_message,
          showConfirmButton: true,
        });
        this.router.navigate(['invoice/creditapprovallist']);
      }
      else if (res.status == 0) {
        swal.fire('Error!', res['message'], 'error');
      }
    },
      (error) => {
        swal.fire('Error!', 'Server Error!!', 'error');
      });

  }

}