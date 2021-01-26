
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit, Input, ViewChild, ViewChildren, ElementRef, HostListener } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServerService } from '../../server.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FullComponent } from '../../layouts/full/full.component';
import { NgxSpinnerService } from 'ngx-spinner';
import * as tableData from './invoice-table';
import Swal from 'sweetalert2';
import * as moment from 'moment';
// import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-ballgameinvoice',
  templateUrl: './ballgameinvoice.component.html',
  styleUrls: ['./ballgameinvoice.component.css']
})
export class BallgameinvoiceComponent implements OnInit {

  blnPayment = false

  strStaff;

  source: LocalDataSource;
  source2: LocalDataSource;

  showPartialAmt=false;
  disablePartialAmt=false;
  intPartialAmt=0;
  jobStatus;
  itemOfferId;
  itemOfferName;
  lst_offers=[];
  showOffers=false;
  disableOffer=false;
  offer_name='';
  ballgameSave=false;
  rejectDisable=false;
  offerAmt=0;
  offerAdded=false;

  @Input() OnlyNumber: boolean;
  @Input() date1:Date;
  // Menu items itemlist = [{name:'Delivery',status:false },{name:'Coupon code',status:false },{name:'Loyalty',status:false }]
  closeResult: string;

  
  constructor(
    private modalService: NgbModal,private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private fullObject: FullComponent,
    private spinner: NgxSpinnerService,
  ) {this.source2 = new LocalDataSource(tableData.data); }



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

  @ViewChildren('rateId') rateId: any;


  // settings = tableData.settings;

  nodeHost = '';
  
  settings2 = tableData.settings2;
  salesRowId= localStorage.getItem('salesRowId');
  branchName = localStorage.getItem('BranchName');
  intContactNo=null
  strName:''
  strEmail;
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
  intGrandTot=0
  intTotNoRounding;
  fltDecimalsInTot
  intRounding;
  intTotal=0
  intTax=0
  intTotCGST=0
  intTotSGST=0
  intTotIGST=0
  intReturnAmt=0

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
  lstItemDetailsCopy: Array<any> = []
  lstItemAmount: Array<any> = []
  blnShowData=2;
  intCreditCc;
  intDebitCc;

  lstBankNames=[]

  time = new Date();


  newItem= { intItemId: null,
    strItemName: '',
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
    blnService:null,
    offerId:null,
    dblCGSTPer:0,
    dblIGSTPer:0,
    dblSGSTPer:0,
    int_type:0
  }

  offerNewItem= { 
    intItemId: null,
    strItemName: '',
    strImei:'0',
    dblRate:0,
    dblBuyBack:0,
    dblDiscount:0,
    dblDisper:0,
    dblCGST:0,
    dblSGST:0,
    dblIGST:0,
    dblAmount:0,
    intQuantity:1,
    intStatus:1,
    strItemCode:null,
    blnService:null,
    offerId:null,
    dblCGSTPer:0,
    dblIGSTPer:0,
    dblSGSTPer:0,
    int_type:0
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
  partialId;

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

  intCustomerType;

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
  strCreditCardNo;
  intCreditBankId;
  strCreditBankName='';
  intCreditAmt=0;
  strCreditRefNo;
  clickRowId;
  lstClickOrder=[]
  intFixedAmt;
  strReceiptNumber;
  // lstReceipt= [{'receipt_num':'rst123','amount':1452},{'receipt_num':'rst485','amount':1000}];
  lstReceipt = [];
  intReceiptTot;
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
           Swal.fire('Success!','Successfully downloaded');



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
          Swal.fire('Error!',response['message'], 'error');
          return false;
        }


      },
      error => {
        alert(error);
      }
    );

  }

  
  ngOnInit() {

    this.disableOffer=false;
    this.disablePartialAmt=false;

    
    localStorage.setItem('invoiceReceipt','')
    this.url = this.serviceObject.url
    this.hostaddress = this.serviceObject.hostAddress
    this.hostaddress = this.hostaddress.slice(0, this.hostaddress.length - 1)
    this.printDisable=true; //disable print button
    this.saveDisable=false; //enable save button

    this.showPartialAmt=false;
    this.ballgameSave=false;
    this.disablePartialAmt=true;

    this.blnCash=true;

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
    this.lstBankNames=[]
    this.serviceObject.getData('invoice/bank_typeahead/').subscribe(res => {
      
      this.lstBankNames = res['data'];
    });
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
    dctReceiptData['intCustType']=this.intCustomerType;

    this.serviceObject.postData('invoice/receipt_list/',dctReceiptData).subscribe(res => {

      if (res.status == 1)
      {
      this.blnReceipt = res['bln_receipt'];
      this.blnReceiptDisable = res['bln_receipt'];
      this.lstReceipt = res['lst_receipt'];
      this.intReceiptTot = res['receipt_tot'];
      this.blnMatching = res['bln_matching'];
      if(this.blnReceipt && !this.blnFinance ){
        this.intBalanceAmt = this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount)
      }
      else if(this.blnFinance && !this.blnReceipt){
        this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
      }
      else if(this.blnReceipt && this.blnFinance){
        this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
      }
      else{
          this.intBalanceAmt = this.intGrandTot-(this.intCreditAmt + this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
      }

      if(!this.disablePartialAmt){
        this.intBalanceAmt = this.intPartialAmt;
      }
      // Onload Spinner
       this.showSpinner()

      }
      else if (res.status == 0) {
        Swal.fire('Error!','Something went wrong!!', 'error');
        this.lstItemDetails=[]
        // this.preItemList=[];
       }
   },
   (error) => {
    Swal.fire('Error!','Server Error!!', 'error');
   });

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
  openComboOffers(id,item,comboOffer,action) {
    this.itemIndex=id;
    this.offerItemId=item.intItemId;
    this.comboShow[id]='none';

    this.intStyleIndex = 0;
    this.offerItem=item.strItemName;
    let dctItem={itemId:item.intItemId};
    this.dctCombo={};
    this.lstCombo=[];
    this.serviceObject.postData('add_combo/item_offers/',dctItem).subscribe(result => {

      if (result.status == 1)
      {
        let objLen=Object.keys(result['data']);

        if(objLen.length==0){
          this.comboShow[id]='none';
        }
        else{
        this.comboShow[id]='block';
        this.dctLen=Object.keys(result['data']);
        this.dctCombo=result['data'];
        this.lstCombo=Object.keys(this.dctCombo);
        }
      }
      else if(result.status == 0)
      {
        Swal.fire('Error!',result['data'], 'error');

      }
    },
    (error) => {
      Swal.fire('Error!','Server Error!!', 'error');
     });

     if(action=='click'){
     this.showModalOffer= this.modalService.open(comboOffer, { centered: true, size: 'lg'});
     }
  }

  applyOffer(key,data){

    this.removeAppliedOffer(this.itemIndex);   

    this.lstItemDetails[this.itemIndex]['dblDiscount']-=this.offerDis[this.itemIndex];
    this.lstItemDetails[this.itemIndex]['dblAmount']+=this.offerDis[this.itemIndex];

    this.lstItemDetails[this.itemIndex]['dblAmount'] = (this.lstItemDetails[this.itemIndex]['dblAmount']).toFixed(2)
    
    this.offerDis[this.itemIndex] = 0;
    if(this.offerApplied[this.itemIndex] || this.lstOfferItems.length>0){
      Swal.fire({
        position: "center",
        type: "warning",
        text: "An offer already applied will be replaced!",
        showConfirmButton: true,
        allowOutsideClick: false,

      }).then((result)=>{
        if(result.value){
          // this.removeAppliedOffer(this.itemIndex);
        }
      });
    }
    this.hideModal();    
    this.lstOfferItems=[];
    // console.log("####this.dctCombo[key][data]",this.dctCombo[key][data]);
    
    for(let itemQty=0;itemQty<this.dctCombo[key][data]['int_quantity']-1;itemQty++){ // push number of items

      this.offerNewItem= { // push empty row
        intItemId: null,
        strItemName: '',
        strImei:'0',
        dblRate:0,
        dblBuyBack:0,
        dblDiscount:0,
        dblDisper:0,
        dblCGST:0,
        dblSGST:0,
        dblIGST:0,
        dblAmount:0,
        intQuantity:1,
        intStatus:1,
        strItemCode:null,
        blnService:null,
        offerId:null,
        dblCGSTPer:0,
        dblIGSTPer:0,
        dblSGSTPer:0,
        int_type:0
      }

     
      this.offerNewItem['intItemId']=this.offerItemId;
      this.offerNewItem['strItemName']=this.offerItem;

      this.lstOfferItems.push(this.offerNewItem);

    }


    let discounts={};
    
    discounts=this.dctCombo[key][data]['discount'];
    
    for (let dis in discounts) {
      if(discounts[dis]['discount_items'])  {        
        // if(discounts[dis]['int_discount_type']==1){
        for (let disItem in discounts[dis]['discount_items']) {
          let qtyVal=discounts[dis]['discount_items'][disItem]['int_quantity'];
          for(let itemQty=0;itemQty<qtyVal;itemQty++){
            this.offerNewItem= { // push empty row
              intItemId: null,
              strItemName: '',
              strImei:'0',
              dblRate:0,
              dblBuyBack:0,
              dblDiscount:0,
              dblDisper:0,
              dblCGST:0,
              dblSGST:0,
              dblIGST:0,
              dblAmount:0,
              intQuantity:1,
              intStatus:1,
              strItemCode:null,
              blnService:null,
              offerId:null,
              dblCGSTPer:0,
              dblIGSTPer:0,
              dblSGSTPer:0,
              int_type:0
            }
                  
          this.offerNewItem['intItemId']=discounts[dis]['discount_items'][disItem]['fk_item_id'];
          this.offerNewItem['strItemName']=discounts[dis]['discount_items'][disItem]['fk_item__vchr_name'];
         
          this.lstOfferItems.push(this.offerNewItem);
     
        }
         if(discounts[dis]['discount_items'][disItem]['dbl_amt']){
            
            this.offerNewItem['dblDiscount']=discounts[dis]['discount_items'][disItem]['dbl_amt'];
          }
          else{
            
            this.offerNewItem['dblDisper']=discounts[dis]['discount_items'][disItem]['dbl_percent'];
            
          }
      }
      }
        if(discounts[dis]['int_discount_type']==2){
      
          this.lstItemDetails[this.itemIndex]['dblDiscount']+=discounts[dis]['dbl_amt'];
          this.offerDis[this.itemIndex]=discounts[dis]['dbl_amt'];

        }
        if(discounts[dis]['int_discount_type']==1){           
          let disAmt=(this.lstItemDetails[this.itemIndex]['dblRate']*discounts[dis]['dbl_percent'])/100;
          this.lstItemDetails[this.itemIndex]['dblDiscount']+=disAmt;
          this.offerDis[this.itemIndex]=disAmt;


        }
        this.changeDiscountValue(this.itemIndex,'editRow');
    }

    this.offerApplied[this.itemIndex]=true;
  }

  addofferRow(lstOfferItems){
    
    this.linkId=this.offerItemId;

    let lstLen=this.lstItemDetails.length;
    
    let pushFlag=true;

    for(let key in lstOfferItems){     
      
      if(lstOfferItems[key].strImei == "0" || !lstOfferItems[key].strImei){
      this.toastr.error('Please fill Imei', 'Error!');
      pushFlag=false;
      return;

      break;
       }
       if(lstOfferItems[key].strItemName.toUpperCase() == 'GDP') {
        lstOfferItems[key].int_type = 1;
       } 
        if (lstOfferItems[key].strItemName.toUpperCase() == 'GDEW (EXTENDED WARRANTY)'){
          lstOfferItems[key].int_type = 2;
       }
      }

    for(let key in lstOfferItems){
      
     
      this.comboShow[lstLen]='none';
      this.linkShow[lstLen]='block';
      this.offerDis.push(0);

    


      this.lstItemDetails.push(lstOfferItems[key]);
      this.lstItemDetails[lstLen]['offerId']=this.linkId;
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

    if(pushFlag){
      // this.lstItemDetails.push(...lstOfferItems);

      this.lstOfferItems=[];
    }
   
    this.billingDatails('other',0);
   
  }

  clearofferRow(){
    this.lstItemDetails[this.itemIndex]['dblDiscount']-=this.offerDis[this.itemIndex];
    this.lstItemDetails[this.itemIndex]['dblAmount']+=this.offerDis[this.itemIndex];

    this.lstItemDetails[this.itemIndex]['dblAmount'] = this.lstItemDetails[this.itemIndex]['dblAmount'].toFixed(2)
    // console.log(this.offerDis);
    
    this.offerDis[this.itemIndex] = 0;

    this.lstOfferItems=[];
    this.offerApplied[this.itemIndex]=false;


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
    this.newItem.dblRate=0
    this.newItem.dblBuyBack=0
    this.newItem.dblDiscount=0
    this.newItem.dblCGST=0
    this.newItem.dblSGST=0
    this.newItem.dblIGST=0
    this.newItem.dblAmount=0
    this.newItem.strItemCode=item.strItemCode
    this.newItem.blnService = item.blnService;
    this.newItem.dblCGSTPer=0
    this.newItem.dblSGSTPer=0
    this.newItem.dblIGSTPer=0

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
// console.log("@@@@@@@@@this.offerDis[this.itemIndex]",this.offerDis[this.itemIndex]);

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
                  Swal.fire('Error!','Already Exist', 'error');
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
                        // this.preItemList[index]['strImei']='0'
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
        Swal.fire('Error!','Item Name is required', 'error');
        if(index=='newItem')
        {
          this.newItem.strImei='0'
        }
        else{
          this.lstItemDetails[index]['strImei']='0'
          // this.preItemList[index]['strImei']='0'
        }
        return false
      }
      else{
        this.serviceObject.postData('branch_stock/get_price_for_item/',dct).subscribe(res => {

          if (res.status == 1)
          {

            let itemRate=res['data']['dblRate'];
            if(index=='offerItem'){

              if(item.dblDisper!=0){ // If discount percentage                
                
                item.dblDiscount=((itemRate*item.dblDisper)/100)+this.offerDis[this.itemIndex];
                
              }
              
            }

            if(!this.blnCheckIGST)
            {
              item.dblCGST=res['data']['dblCGST']
              item.dblSGST=res['data']['dblSGST']
              item.dblSGSTPer=res['data']['dblSGSTPer']
              item.dblCGSTPer=res['data']['dblCGSTPer']
              
              item.dblRate=res['data']['dblRate']
              item.dblAmount= Number(((item.dblCGST+item.dblSGST+item.dblRate)-(item.dblBuyBack+item.dblDiscount)).toFixed(2))
              // item.dblRate = item.dblAmount - (item.dblCGST+item.dblSGST) + item.dblBuyBack + item.dblDiscount
              
            }
            else{
              item.dblIGST=res['data']['dblIGST']
              item.dblIGSTPer=res['data']['dblIGSTPer']
              
              item.dblRate=res['data']['dblRate']
              item.dblAmount = Number(((item.dblIGST + item.dblRate) - (item.dblBuyBack + item.dblDiscount)).toFixed(2))
              // item.dblRate = item.dblAmount - item.dblIGST + item.dblBuyBack + item.dblDiscount
              
            }
            this.billingDatails("other",0);

          }
          else if(res.status == 0)
          {
            Swal.fire('Error!',res['data'], 'error');
            // if(item.hasOwnProperty('imei')){
            //   item.imei=''
            // }
            // else{
              // item.strImei= 0;
          //  }
          }
        },
        (error) => {
          Swal.fire('Error!','Server Error!!', 'error');
         });
      }

    }
  }


  offerChanged($event){  
    this.offerAmt=0;    
    // console.log("$event",$event);
      
    this.itemOfferId=$event.value;
    this.lst_offers.map(element=>{
      
      if(element['offerId']==this.itemOfferId){        
         this.itemOfferName=element['offerName'];

         if((element['bln_item']==true)&&(element['offerId']==this.itemOfferId)){           
           this.offerAmt=(this.lstItemDetails[0]['dblRate']*element['offer'])/100;
          
         }
      }
    })
    
    
    this.intBalanceAmt=this.intGrandTot-this.intPartialAmt;
    

    this.intBalanceAmt=this.intBalanceAmt-this.offerAmt;

    

  }

  getData(){   
     
    this.dctData['billingdetails']=[]
    this.dctData['billingdetailsCopy']=[]
    this. dctData['intId']=this.salesRowId
    // this.dctData['exchangeImage']={}
    this.serviceObject.postData('invoice/sales_list/',this.dctData).subscribe(res => {

      if (res.status == 1)
      {
      this.lstItemDetails = res['data']['lstItems'];
      this.lstItemDetailsCopy = JSON.parse(JSON.stringify(res['data']['lstItems']));
      // this.preItemList=res['data']['lstItems'];
      // console.log("#########preItemList getData",this.preItemList);
   
      this.intCustId=res['data']['intCustId']
      this.intContactNo= res['data']['intContactNo']
      this.strEmail = res['data']['strCustEmail']
      this.strStaff= res['data']['strStaffName'];
      this.strName = res['data']['strCustName'].toUpperCase()
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
      this.intTotPoints=res['data']['intLoyaltyPoint']
      this.intTotAmt= this.intAmtPerPoints * this.intTotPoints
      this.intTotPointsCopy=res['data']['intLoyaltyPoint']
      this.intCustomerType = res['data']['int_cust_type'];

 

      if(res['data'].hasOwnProperty('vchrFinanceName'))
      {
        // ===============================
        this.blnPayment = true
        // ===============================

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
      let id=0;
      this.lstItemDetails.map(element=>{

        // calculate rate
        this.lstItemAmount[element.intItemId]=Number(element.dblAmount.toFixed(2)) 

        if(this.blnCheckIGST){
          // element.dblAmount= element.dblRate+ element.dblIGST-element.dblBuyBack-element.dblDiscount
          element.dblRate = element.dblAmount - element.dblIGST + element.dblBuyBack + element.dblDiscount
          
        }
        else{
          // element.dblAmount= element.dblRate+ element.dblCGST+ element.dblSGST-element.dblBuyBack-element.dblDiscount
          element.dblRate = element.dblAmount - (element.dblCGST + element.dblSGST) + element.dblBuyBack + element.dblDiscount
          
        }


        this.lst_imei.push(element['strImei'])
        //set combo offer icon
        let tempDict={};
        tempDict['intItemId']=element['intItemId'];
        tempDict['strItemName']=element['strItemName'];
        this.comboShow.push('none');
        this.linkShow.push('none');
        this.offerDis.push(0);

        this.openComboOffers(id,tempDict,'comboOffer','show');
        id++;
      
      })




      this.dctData['custEditData']['strEmail']=res['data']['strCustEmail']
      this.dctData['custEditData']['strAddress']=res['data']['txtAddress']
      this.dctData['custEditData']['strState']=res['data']['strState']
      this.dctData['custEditData']['intStateId']=res['data']['intState']
      this.dctData['custEditData']['intCityId']=res['data']['intLocation']
      this.dctData['custEditData']['strCity']=res['data']['strLocation']
      this.dctData['custEditData']['strGSTNo']=res['data']['strGSTNo']

      this.billingDatails("other",0);


           // ******Partial Amt**********
           let groupName=localStorage.getItem('group_name');

        
           if(res['data'].hasOwnProperty('job_status')){
   
             this.jobStatus=res['data']['job_status'];
   
             if((res['data']['job_status']==7)&&(groupName=='BRANCH MANAGER'||groupName=='ASSISTANT BRANCH MANAGER'||groupName=='ASM2'||groupName=='ASM3'||groupName=='FLOOR MANAGER1'||groupName=='FLOOR MANAGER2'||groupName=='FLOOR MANAGER3')){
               this.showPartialAmt=true;
               this.ballgameSave=true;
               this.disablePartialAmt=false;
               this.partialId=res['data']['partial_id'];
               this.rejectDisable=true;

               // this.blnPayment = true;
             }
             else if((res['data']['job_status']==7)&&(groupName=='BALL GAME ADMIN')){
              this.saveDisable=true;
              this.rejectDisable=true;
              this.ballgameSave=true;
              this.showPartialAmt=true;
              this.disablePartialAmt=true;
             }
             else if((res['data']['job_status']==8)&&(groupName=='BRANCH MANAGER'||groupName=='ASSISTANT BRANCH MANAGER'||groupName=='ASM2'||groupName=='ASM3'||groupName=='FLOOR MANAGER1'||groupName=='FLOOR MANAGER2'||groupName=='FLOOR MANAGER3')){
               this.rejectDisable=true;
               this.showPartialAmt=true;
               this.disablePartialAmt=true;
               this.ballgameSave=true;
               this.saveDisable=true;
               this.intPartialAmt=res['data']['partialAmount'];
               this.partialId=res['data']['partial_id'];

               this.intBalanceAmt-=this.intPartialAmt;
   
               
             }
             else if(res['data']['job_status']==8&&(groupName=='BALL GAME ADMIN')){
               this.rejectDisable=true;
               this.showPartialAmt=true;
               this.ballgameSave=true;
               this.partialId=res['data']['partial_id'];
   
               this.disablePartialAmt=true;
               this.intPartialAmt=res['data']['partialAmount'];
               this.partialId=res['data']['partial_id'];
               this.showOffers=true;
               this.lst_offers=res['data']['lst_offers'];    
   
               this.intBalanceAmt-=this.intPartialAmt;
   
   
             }
             else if(res['data']['job_status']==9&&(groupName=='BRANCH MANAGER'||groupName=='ASSISTANT BRANCH MANAGER'||groupName=='ASM2'||groupName=='ASM3'||groupName=='FLOOR MANAGER1'||groupName=='FLOOR MANAGER2'||groupName=='FLOOR MANAGER3'||groupName=='BALL GAME ADMIN')){
   
               this.showPartialAmt=true;
               this.ballgameSave=false;
               // this.blnPayment = true;
               this.showOffers=true;
               this.partialId=res['data']['partial_id'];
               this.disablePartialAmt=true;
               this.intPartialAmt=res['data']['partialAmount'];
               this.lst_offers=res['data']['lst_offers'];     
               this.disableOffer=true;
               this.offer_name=res['data']['offerId'];
               this.offerAdded=true;
               this.offerAmt=res['data']['offerAmt'];
               this.intBalanceAmt=this.intGrandTot-this.intPartialAmt;
               this.intBalanceAmt=this.intBalanceAmt-this.offerAmt;
               this.intBalanceAmt=Number(this.intBalanceAmt.toFixed(2));
               if(groupName=='BALL GAME ADMIN'){
                 this.saveDisable=true;
                 this.rejectDisable=true;
               }
             
             }
           }
   
          
         // ******End Partial Amt**********


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
        Swal.fire('Error!',res['message'], 'error');
        this.lstItemDetails=[]
        // this.preItemList=[];
       }
   },
   (error) => {
    Swal.fire('Error!','Server Error!!', 'error');
   });

  }

  billingDatails(type,index){
    this.dctData['billingdetails']=[]
    this.dctData['billingdetailsCopy']=[]
    this.intDiscount=0
    this.intBuyBack=0
    this.intTax=0
    this.intTotCGST=0
    this.intTotIGST=0
    this.intTotSGST=0
    this.intReturnAmt=0
    this.intTotal=0
    this.intGrandTot=0
    this.intTotIndirectDis=0
    this.intRounding = 0

    for(let item of this.lstItemDetails)
    {

      // if(item.intStatus==2){
      //   this.dctData['exchangeImage']=
      // }
      if(item.intStatus==0){
        this.intReturnAmt=this.intReturnAmt+item.dblAmount
      }
      else{
        this.dctCount ={}
        this.dctCount['amt']= item.dblRate
        this.dctCount['dis']=item.dblBuyBack+item.dblDiscount

        if(!this.blnCheckIGST){

          item.dblAmount = Number((item.dblRate +item.dblCGST+item.dblSGST-(item.dblDiscount+item.dblBuyBack)).toFixed(2))

          this.dctCount['tax']=item.dblCGST+item.dblSGST
          this.intTotSGST= this.intTotSGST+item.dblSGST
          this.intTotCGST= this.intTotCGST+item.dblCGST

        }
        else{
          item.dblAmount = Number((item.dblRate + item.dblIGST - (item.dblDiscount + item.dblBuyBack)).toFixed(2))
          
          this.dctCount['tax']=item.dblIGST
          this.intTotIGST= this.intTotIGST+item.dblIGST
        }
        this.dctCount['rate']=item.dblRate
        this.dctCount['name']= (item.strItemName).slice(0, 15) + '...';
        // this.dctCount['qty']= item.intQuantity
        this.dctCount['qty']= 1
        this.dctCount['id']= item.intItemId
        this.dctData['billingdetails'].push(this.dctCount)
        this.intTotal= this.intTotal+item.dblRate

        this.intDiscount=this.intDiscount+item.dblDiscount
        this.intBuyBack=this.intBuyBack+item.dblBuyBack
      }

    }
    if(this.lstIndirectDis.length>0){
      this.lstIndirectDis.forEach(item=>{
        this.intTotIndirectDis=Number(this.intTotIndirectDis)+Number(item)
      })
    }


    if(this.intCouponDisc>0){
      this.intGrandTot= (this.intTotal +  this.intTotSGST + this.intTotCGST + this.intTotIGST )- (this.intDiscount+this.intBuyBack+this.intReturnAmt+this.intCouponDisc+this.intTotIndirectDis)

    }
    else{
      this.intGrandTot= (this.intTotal + this.intTotSGST + this.intTotCGST + this.intTotIGST)- (this.intDiscount+this.intBuyBack+this.intReturnAmt+this.intTotIndirectDis)

    }

    this.intTotNoRounding = this.intGrandTot.toFixed(2);
    this.fltDecimalsInTot = this.intTotNoRounding - Math.floor(this.intTotNoRounding);

    if (this.fltDecimalsInTot >= .50) {
      this.intRounding = (1 - this.fltDecimalsInTot).toFixed(2);
    } else if ( this.fltDecimalsInTot < .50 || this.fltDecimalsInTot === 0){
      this.intRounding = (-this.fltDecimalsInTot).toFixed(2)
    }

    this.intGrandTot = Math.round(this.intGrandTot);
   if(type=="edit"){
          if(this.blnCheckIGST){
            this.lstItemDetails[index].dblAmount = Number((this.lstItemDetails[index].dblRate + this.lstItemDetails[index].dblIGST - this.lstItemDetails[index].dblBuyBack - this.lstItemDetails[index].dblDiscount).toFixed(2))
            // this.preItemList[index].dblAmount=this.lstItemDetails[index].dblAmount
          }
          else{
            this.lstItemDetails[index].dblAmount = Number((this.lstItemDetails[index].dblRate + this.lstItemDetails[index].dblCGST + this.lstItemDetails[index].dblSGST - this.lstItemDetails[index].dblBuyBack - this.lstItemDetails[index].dblDiscount).toFixed(2))
            // this.preItemList[index].dblAmount=this.lstItemDetails[index].dblAmount
          }

        }

        else if(type=="editNew"){
          if(this.blnCheckIGST){
            this.newItem.dblAmount = Number((this.newItem.dblRate + this.newItem.dblIGST - this.newItem.dblBuyBack - this.newItem.dblDiscount).toFixed(2))
            }
            else{
            this.newItem.dblAmount = Number((this.newItem.dblRate + this.newItem.dblCGST + this.newItem.dblSGST - this.newItem.dblBuyBack - this.newItem.dblDiscount).toFixed(2))

            }
        }



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
    
    if(this.blnFinance){
      this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt);

    }
    else{
      this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt);
    }

  }

clearRow(){
  this.newItem= { intItemId: null,
    strItemName: '',
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
    offerId:null,
    dblCGSTPer:0,
    dblIGSTPer:0,
    dblSGSTPer:0,
    int_type:0
  }
}


  updateList(id: number, property: string, event: any) {

  }
  addNewRow(){
    if(this.newItem.strItemName.toUpperCase() == 'GDP') {
      this.newItem.int_type = 1;
     } 
      if (this.newItem.strItemName.toUpperCase() == 'GDEW (EXTENDED WARRANTY)'){
      this.newItem.int_type = 2;
     }
    
     if(!this.newItem.strItemName){
      this.toastr.error('Item Name is required', 'Error!');
      return false;
    }
    else if(this.newItem.strImei == "0" || !this.newItem.strImei){
      this.toastr.error('Imei is required', 'Error!');
      return false;
    }
    else
    {
      
      this.lstItemDetails.push(this.newItem);
      // this.preItemList.push(this.newItem);
      
      this.linkShow.push('none');
      this.offerDis.push(0);

      this.lst_imei.push( this.newItem['strImei'])

      this.newItem= { intItemId: null,
        strItemName: '',
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
        blnService:null,
        offerId:null,
        dblCGSTPer:0,
        dblIGSTPer:0,
        dblSGSTPer:0,
        int_type:0
      }

      this.comboShow.push('none');
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

    this.openComboOffers(lstLen-1,tempDict,'comboOffer','show');

   }

  //  console.log("##this.lstItemDetails",this.lstItemDetails);
   
  }

  removeAppliedOffer(itemId){

    if(this.lstItemDetails[this.itemIndex]['dblDiscount']>0){
      
    this.lstItemDetails[this.itemIndex]['dblDiscount']-=this.offerDis[this.itemIndex];
    this.lstItemDetails[this.itemIndex]['dblAmount']+=this.offerDis[this.itemIndex];

      this.lstItemDetails[this.itemIndex]['dblAmount'] = Number((this.lstItemDetails[this.itemIndex]['dblAmount']).toFixed(2))
    }
    
    this.offerDis[this.itemIndex] = 0;

    let offerValue=this.offerItemId;

    let tempLst=[];
    
    for(let data in this.lstItemDetails){          
      if(this.lstItemDetails[data]['offerId']==offerValue){        
        tempLst.push(data);
      }
    }

    tempLst.map(element=>{  
      const i = this.lstItemDetails.indexOf(element);

      this.lstIndirectDis.splice(i,1);
      this.lstItemDetails.splice(i,1);    
      this.linkShow.splice(i,1);  
      this.offerDis.push(0);
      this.billingDatails("other",0);

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
    let offerValue;

   
    offerValue=this.lstItemDetails[id]['offerId'];        
    // console.log("this.linkShow[id]####",this.linkShow[id]);
    
    if(this.linkShow[id]=='block'){      

      Swal.fire({
        title: 'Are you sure?',
        text: "Items added on offer will be deleted!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.lstItemDetails[this.itemIndex]['dblDiscount']-=this.offerDis[this.itemIndex];
          this.lstItemDetails[this.itemIndex]['dblAmount']+=this.offerDis[this.itemIndex];
          this.lstItemDetails[this.itemIndex]['dblAmount'] = Number((this.lstItemDetails[this.itemIndex]['dblAmount']).toFixed(2))
          
          this.offerDis[this.itemIndex] = 0;
          Swal.fire(
            'Deleted!',
            "Data Deleted successfully",
            'success'
          )
        let tempLst=[];
        
        for(let data in this.lstItemDetails){
                    
          if(this.lstItemDetails[data]['offerId']==offerValue){
            tempLst.push(this.lstItemDetails[data]);
          //  this.lstItemDetails.splice(parseInt(data),1);       
        // console.log('deleted' ,data);
            
          }
        }

        
        tempLst.map(element=>{  
           const i = this.lstItemDetails.indexOf(element);

           this.lstIndirectDis.splice(i,1);        
           this.lstItemDetails.splice(i,1);       
           this.linkShow.splice(i,1);       
           this.offerDis.splice(i,1);
           this.billingDatails("other",0);
        })
        this.offerApplied[this.itemIndex]=false;
        }
      })
      this.changeDiscountValue(this.itemIndex,'editRow');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure want to delete ?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
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
      // this.preItemList.splice(id, 1);
      this.billingDatails("other",0);
      }
    })

  }

  changeValue(index: number, property: string, event: any,item){
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

  OnEnter(id: number, property: string, event: any) {

    let e = <KeyboardEvent>event;
    if (Number(this.lstItemDetails[id][property]) > 1000000) {
      e.preventDefault();
    }
    if (Number(this.lstItemDetails[id][property]) != 0 && !Number(this.lstItemDetails[id][property])
    ) {
      event.view.focus()
      this.toastr.error('Invalid Amount');
      // Swal('key', 'Invalid Estimated Amount', 'error');
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
      // this.preItemList[index][property] = 0
     this.billingDatails("edit",index)
      this.toastr.error('Invalindex Amount');
      return false;
    }
  }

  calcBalance(){
   
    this.intBalanceAmt=this.intGrandTot-this.intPartialAmt;
  }

  saveBallgame(){

    if(this.intPartialAmt==0&&!this.disablePartialAmt){
      Swal.fire('Error',"Enter partial amount");
      return false;
    }
    else if((this.itemOfferId==null||this.itemOfferId==" ")&&this.showOffers){
      Swal.fire('Error',"Please select offer");
      return false;
    }

    // console.log("this.dctData['lstPaymentData']",this.dctData['lstPaymentData']);
    // console.log("this.intBalanceAmt",this.intBalanceAmt);
    
    

    // if(this.objectKeys(this.dctData['lstPaymentData']).length>0 || this.intBalanceAmt<=0)
    // {
      
    let dctOffer={};
    dctOffer['partial_amt']=this.intPartialAmt;
    dctOffer['offerId']=this.itemOfferId;
    dctOffer['offerName']=this.itemOfferName;
    dctOffer['offerAmt']=this.offerAmt;
    dctOffer['job_status']=this.jobStatus;
    dctOffer['partial_id']=this.partialId;



    this.serviceObject.postData('invoice/add_amount_offer_api/',dctOffer).subscribe(res => {
      if (res.status == 1)
      {

        Swal.fire({
          position: "center",
          type: "success",
          text: "Data saved successfully",
          showConfirmButton: true,
        });
    localStorage.setItem('previousUrl','invoice/offerlist');
     
        this.router.navigate(['invoice/offerlist']);
      }
      else if (res.status == 0) {
        Swal.fire('Error!',res['message'], 'error');
        // this.lstItemDetails=[]
      }
      },
      (error) => {
        Swal.fire('Error!','Server Error!!', 'error');
      });
    // }
    // else{
    //   Swal.fire('Error!','Please Provide Payment Details', 'error');

    // }

  }

  saveInvoice()
  {
// =================Payment Change===========================================
    if (!this.strFinanceName){
      this.blnCash = true;
      this.savePaymentOption('event')
    }
// =================Payment Change===========================================
    

    const form_data = new FormData;
    let error=false

    Swal.fire({  //Confirmation before save
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
            });


            let dctInvoice={}

          if(!error)
          {

            if(this.intGrandTot<0)
            {
              Swal.fire('Error!','Purchase amount should be greater than return amount','error')
            }
            else{

              if(this.objectKeys(this.dctData['lstPaymentData']).length>0 || this.intBalanceAmt<=0)
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


                // *******ballgame details ************
                form_data.append('partial_amt',JSON.stringify(this.intPartialAmt))
                // form_data.append('offerId',this.itemOfferId)
                // form_data.append('offerName',this.itemOfferName)
                form_data.append('offerAmt',JSON.stringify(this.offerAmt))
                form_data.append('job_status',this.jobStatus)
                form_data.append('partial_id',this.partialId)

                // *******end ballgame details ************



                
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
                form_data.append('intRounding',String(this.intRounding))
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
// ====================================================================================
                  this.serviceObject.postData('invoice/add_invoice/',form_data).subscribe(res => {
                    if (res.status == 1)
                    {

                      Swal.fire({
                        position: "center",
                        type: "success",
                        text: "Data saved successfully",
                        showConfirmButton: true,
                      });
                      this.printDisable=false;
                      this.saveDisable=true;
                      this.invoiceId=res['sales_master_id'];
    localStorage.setItem('previousUrl','invoice/listinvoice');
                      
                      this.router.navigate(['invoice/listinvoice']);
                    }
                    else if (res.status == 0) {
                      Swal.fire('Error!',res['message'], 'error');
                      // this.lstItemDetails=[]
                    }
                },
                (error) => {
                  Swal.fire('Error!','Server Error!!', 'error');
                });
              }
              else{
                Swal.fire('Error!','Please Provide Payment Details', 'error');
              }
            }
          }
          else{
            this.toastr.error('Details of returned item is required', 'Error!');
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
    checkError=false;
    return false
  }
  if (this.strGSTNo && !(/^[0-9]{2}/).test(this.strGSTNo)) {
    this.toastr.error('First two digits of GST No. should be number', 'Error!');
    checkError=false;
    return false
  }

   if(!checkError){
    let dctCustomerData={}
    dctCustomerData['strEmail']=this.strEmail
    dctCustomerData['strAddress']=this.strAddress
    dctCustomerData['strCity']=this.strCity
    dctCustomerData['strState']=this.strState
    dctCustomerData['intCityId']=this.intCityId
    dctCustomerData['intStateId']=this.intStateId
    dctCustomerData['strGSTNo']=this.strGSTNo
    dctCustomerData['intCustId']=this.intCustId

       this.serviceObject.postData('customer/edit_customer/',dctCustomerData).subscribe(res => {
         if (res.status == 1)
         {
           Swal.fire({
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

           this.lstItemDetails.forEach(element => {
            element.dblBuyBack =0
            element.dblDiscount=0
            element.dblAmount = Number((this.lstItemAmount[element.intItemId]).toFixed(2))

            if(this.blnCheckIGST){
              
              // element.dblAmount= element.dblRate+ element.dblIGST-element.dblBuyBack-element.dblDiscount
              element.dblRate = element.dblAmount - element.dblIGST + element.dblBuyBack + element.dblDiscount
              element.dblAmount = Number((element.dblRate + element.dblIGST - (element.dblDiscount + element.dblBuyBack)).toFixed(2))
              
            }
            else{
              
              // element.dblAmount= element.dblRate+ element.dblCGST+ element.dblSGST-element.dblBuyBack-element.dblDiscount
              element.dblRate = element.dblAmount - (element.dblCGST + element.dblSGST) + element.dblBuyBack + element.dblDiscount
              element.dblAmount = Number(( element.dblRate + element.dblCGST + element.dblSGST - (element.dblDiscount + element.dblBuyBack)).toFixed(2))
              
            }
           });

           this.billingDatails("other",0);

         }
         else if (res.status == 0) {
           Swal.fire('Error!','Something went wrong!!', 'error');
         }
     },
     (error) => {
       Swal.fire('Error!','Server Error!!', 'error');

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
          Swal.fire({
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
          Swal.fire('Error!',res['message'], 'error');
        }
    },
    (error) => {
      Swal.fire('Error!','Server Error!!', 'error');

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

   if(this.selectedBrand){
      if (this.selectedBrand != this.strBrand|| !this.selectedBrand)
        {
        this.intBrandId = null
        this.strBrand = ''
        this.selectedBrand=''
        this.toastr.error('Valid Brand Name is required', 'Error!');
        return false;
        }
   }
  if(this.selectedItem){
    if (this.selectedItem != this.strItem|| !this.selectedItem)
      {
      this.toastr.error('Valid Item Name is required', 'Error!');
      this.intItemId = null
      this.strItem = ''
      this.selectedItem=''
      return false;
      }
   }
  if(this.selectedItemCategory){
    if (this.selectedItemCategory != this.strItemCategory|| !this.selectedItemCategory)
      {
      this.toastr.error('Valid Item Category Name is required', 'Error!');
      this.intItemCategoryId = null
      this.strItemCategory = ''
      this.selectedItemCategory=''
      return false;
      }
   }
  if(this.selectedItemGroup){
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
        Swal.fire('Error!',res['message'], 'error');
        this.lstFilterData=[]
      }
  },
  (error) => {
    Swal.fire('Error!','Server Error!!', 'error');
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
    Swal.fire('Error!','Out of Stock', 'error');

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
      Swal.fire('Error!',res['message'], 'error');
      }
    },
    (error) => {
      Swal.fire('Error!','Server Error!!', 'error');

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
          Swal.fire('Error!',res['message'], 'error');
          }
        },
        (error) => {
          Swal.fire('Error!','Server Error!!', 'error');

        });
    }
  }

  //payment

  calculateBalance()
  {
    // negative value converted into positive in cash
    if(this.blnCash){
      if(this.intReceivedAmt<0){
        this.intReceivedAmt = (this.intReceivedAmt)*-1
      }
    }
    if(this.blnFinance){
      this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
    }
    else if(this.blnReceipt){
      this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount);
    }
    else if(this.blnFinance && this.blnReceipt){
      this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
    }
    else{
      this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
    }
    


    if(!this.disablePartialAmt){
      this.intBalanceAmt = this.intPartialAmt;
    }


    if(this.intBalanceAmt<0){


      this.toastr.error('Amount Exceeded', 'Error!');
    }
  }

  cashChanged(event)
  {
    if(!this.blnCash){
      this.intReceivedAmt=0
    }
    else
    {
       if(this.blnCreditCard)
       {
          if(!this.strCreditCardNo){
            Swal.fire('Error!','Enter Credit Card No ', 'error');
            this.blnCash=false
            event.source._checked = false
          }
          else if(!this.intCreditBankId){
            Swal.fire('Error!','Enter Bank Name Of Credit Card ', 'error');
            this.blnCash=false
            event.source._checked = false
          }
          else if(!this.intCreditAmt){
            Swal.fire('Error!','Enter Credit Amount ', 'error');
            this.blnCash=false
            event.source._checked = false
          }
          else if(!this.strCreditRefNo){
            Swal.fire('Error!','Enter Reference No Of Credit Card', 'error');
            this.blnCash=false
            event.source._checked = false
          }
      }
      if(this.blnDebitCard)
      {
          if(!this.strDebitCardNo){
            Swal.fire('Error!','Enter Debit Card No ', 'error');
            this.blnCash=false
             event.source._checked = false

          }
          else if(!this.intDebitBankId){
            Swal.fire('Error!','Enter Bank Name Of Debit Card ', 'error');
            this.blnCash=false
            event.source._checked = false
            return false
          }
          else if(!this.intDebitAmt){
            Swal.fire('Error!','Enter Debit Amount ', 'error');
            this.blnCash=false
            event.source._checked = false
          }
          else if(!this.strDebitRefNo){
            Swal.fire('Error!','Enter Reference No Of Debit Card', 'error');
            this.blnCash=false
            event.source._checked = false
          }
      }
      if(this.blnPaytm)
      {
           if(!this.intPaytmMobileNumber){
            Swal.fire('Error!','Enter Mobile Number', 'error');
            this.blnCash=false
             event.source._checked = false
           }
           else if(!this.intPaytmAmount){
            Swal.fire('Error!','Enter Amount', 'error');
            this.blnCash=false
             event.source._checked = false
           }
           else if(!this.strPaytmTransactionNum){
            Swal.fire('Error!','Enter Paytm Transaction Number ', 'error');
            this.blnCash=false
             event.source._checked = false
           }
           else if(!this.strPaytmReferenceNum){
            Swal.fire('Error!','Enter Paytm Reference Number ', 'error');
            this.blnCash=false
             event.source._checked = false
           }
      }
      if(this.blnPaytmMall)
      {
           if(!this.intPaytmMallMobileNumber){
            Swal.fire('Error!','Enter Mobile Number', 'error');
            this.blnCash=false
             event.source._checked = false
           }
           else if(!this.intPaytmMallAmount){
            Swal.fire('Error!','Enter Amount', 'error');
            this.blnCash=false
             event.source._checked = false
           }
           else if(!this.strPaytmMallTransactionNum){
            Swal.fire('Error!','Enter Paytm Mall Transaction Number ', 'error');
            this.blnCash=false
             event.source._checked = false
           }
           else if(!this.strPaytmMallReferenceNum){
            Swal.fire('Error!','Enter Paytm Mall Reference Number ', 'error');
            this.blnCash=false
             event.source._checked = false
           }
      }

    }

    this.calculateBalance()
  }

  creditCardChanged(event)
  {
    if(!this.blnCreditCard){
      this.intCreditAmt=0
      this.intCreditBankId=''
      this.strCreditCardNo=''
      this.strCreditRefNo=''
    }
    else{
        if(this.blnDebitCard){
          if(!this.strDebitCardNo){
            Swal.fire('Error!','Enter Debit Card No ', 'error');
            this.blnCreditCard=false
            event.source._checked = false

          }
          else if(!this.intDebitBankId){
            Swal.fire('Error!','Enter Bank Name Of Debit Card ', 'error');
            this.blnCreditCard=false
            event.source._checked = false

            return false
          }
          else if(!this.intDebitAmt){
            Swal.fire('Error!','Enter Debit Amount ', 'error');
            this.blnCreditCard=false
            event.source._checked = false
          }
          else if(!this.strDebitRefNo){
            Swal.fire('Error!','Enter Reference No Of Debit Card', 'error');
            this.blnCreditCard=false
            event.source._checked = false
          }
        }
        if(this.blnCash){
          if(!this.intReceivedAmt){
            Swal.fire('Error!','Enter Received Amt ', 'error');
            this.blnCreditCard=false
            event.source._checked = false

          }
        }
        if(this.blnPaytm)
        {
             if(!this.intPaytmMobileNumber){
              Swal.fire('Error!','Enter Mobile Number', 'error');
              this.blnCreditCard=false
               event.source._checked = false
             }
             else if(!this.intPaytmAmount){
              Swal.fire('Error!','Enter Amount ', 'error');
              this.blnCreditCard=false
               event.source._checked = false
             }
             else if(!this.strPaytmTransactionNum){
              Swal.fire('Error!','Enter Paytm Transaction Number ', 'error');
              this.blnCreditCard=false
               event.source._checked = false
             }
             else if(!this.strPaytmReferenceNum){
              Swal.fire('Error!','Enter Paytm Reference Number ', 'error');
              this.blnCreditCard=false
               event.source._checked = false
             }
        }
        if(this.blnPaytmMall)
      {
           if(!this.intPaytmMallMobileNumber){
            Swal.fire('Error!','Enter Mobile Number', 'error');
            this.blnCreditCard=false
             event.source._checked = false
           }
           else if(!this.intPaytmMallAmount){
            Swal.fire('Error!','Enter Amount', 'error');
            this.blnCreditCard=false
             event.source._checked = false
           }
           else if(!this.strPaytmMallTransactionNum){
            Swal.fire('Error!','Enter Paytm Mall Transaction Number ', 'error');
            this.blnCreditCard=false
             event.source._checked = false
           }
           else if(!this.strPaytmMallReferenceNum){
            Swal.fire('Error!','Enter Paytm Mall Reference Number ', 'error');
            this.blnCreditCard=false
             event.source._checked = false
           }
      }
    }

    this.calculateBalance()
  }

  debitCardChanged(event)
  {
    if(!this.blnDebitCard){
      this.intDebitAmt=0
      this.intDebitBankId=''
      this.strDebitCardNo=''
      this.strDebitRefNo=''
    }
    else{
        if(this.blnCreditCard){
          if(!this.strCreditCardNo){
            Swal.fire('Error!','Enter Credit Card No ', 'error');
            this.blnDebitCard=false
            event.source._checked = false

          }
          else if(!this.intCreditBankId){
            Swal.fire('Error!','Enter Bank Name Of Credit Card ', 'error');
            this.blnDebitCard=false
            event.source._checked = false
          }
          else if(!this.intCreditAmt){
            Swal.fire('Error!','Enter Credit Amount ', 'error');
            this.blnDebitCard=false
            event.source._checked = false
          }
          else if(!this.strCreditRefNo){
            Swal.fire('Error!','Enter Reference No Of Credit Card', 'error');
            this.blnDebitCard=false
            event.source._checked = false
          }
        }
        if(this.blnCash){
          if(!this.intReceivedAmt){
            Swal.fire('Error!','Enter Received Amt ', 'error');
            this.blnDebitCard=false
            event.source._checked = false

          }
        }
        if(this.blnPaytm)
        {
             if(!this.intPaytmMobileNumber){
              Swal.fire('Error!','Enter Mobile Number', 'error');
              this.blnDebitCard=false
               event.source._checked = false
             }
             else if(!this.intPaytmAmount){
              Swal.fire('Error!','Enter Amount', 'error');
              this.blnDebitCard=false
               event.source._checked = false
             }
             else if(!this.strPaytmTransactionNum){
              Swal.fire('Error!','Enter Paytm Transaction Number ', 'error');
              this.blnDebitCard=false
               event.source._checked = false
             }
             else if(!this.strPaytmReferenceNum){
              Swal.fire('Error!','Enter Paytm Reference Number ', 'error');
              this.blnDebitCard=false
               event.source._checked = false
             }
        }
        if(this.blnPaytmMall)
        {
             if(!this.intPaytmMallMobileNumber){
              Swal.fire('Error!','Enter Mobile Number', 'error');
              this.blnDebitCard=false
               event.source._checked = false
             }
             else if(!this.intPaytmMallAmount){
              Swal.fire('Error!','Enter Amount', 'error');
              this.blnDebitCard=false
               event.source._checked = false
             }
             else if(!this.strPaytmMallTransactionNum){
              Swal.fire('Error!','Enter Paytm Mall Transaction Number ', 'error');
              this.blnDebitCard=false
               event.source._checked = false
             }
             else if(!this.strPaytmMallReferenceNum){
              Swal.fire('Error!','Enter Paytm Mall Reference Number ', 'error');
              this.blnDebitCard=false
               event.source._checked = false
             }
        }

    }

    this.calculateBalance()

  }
  receiptChanged(event){
    // console.log('receiptn',event);

    if(!this.blnReceipt){
      // this.intDebitAmt=0
      this.strReceiptNumber=''
      Swal.fire({
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
          if(this.blnFinance){
            this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
          }
          else if(this.blnReceipt){
            this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount);
          }
          else if(this.blnFinance && this.blnReceipt){
            this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
          }
          else{
            this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
          }
        }
        else{
          
          if(this.blnFinance){
            this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
          }
          else if(this.blnReceipt){
            this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount);
          }
          else if(this.blnFinance && this.blnReceipt){
            this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
          }
          else{
            this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
          }
        }
      })

    }
    else{
      if(this.blnFinance){
        this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
      }
      else if(this.blnReceipt){
        this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intReceiptTot+this.intPaytmAmount+this.intPaytmMallAmount);
      }
      else if(this.blnFinance && this.blnReceipt){
        this.intBalanceAmt=(this.intGrandTot-this.intFinanceAmt-this.intReceiptTot)+this.intDownPayment-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
      }
      else{
        this.intBalanceAmt=this.intGrandTot-(this.intCreditAmt+this.intReceivedAmt+this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
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
    if(!this.blnPaytm){
      this.intPaytmMobileNumber=null;
      this.intPaytmAmount=0;
      this.strPaytmTransactionNum = '';
      this.strPaytmReferenceNum = '';

    }
    else{
        if(this.blnCreditCard){
          if(!this.strCreditCardNo){
            Swal.fire('Error!','Enter Credit Card No ', 'error');
            this.blnPaytm=false
            event.source._checked = false

          }
          else if(!this.intCreditBankId){
            Swal.fire('Error!','Enter Bank Name Of Credit Card ', 'error');
            this.blnPaytm=false
            event.source._checked = false
          }
          else if(!this.intCreditAmt){
            Swal.fire('Error!','Enter Credit Amount ', 'error');
            this.blnPaytm=false
            event.source._checked = false
          }
          else if(!this.strCreditRefNo){
            Swal.fire('Error!','Enter Reference No Of Credit Card', 'error');
            this.blnPaytm=false
            event.source._checked = false
          }
        }
        if(this.blnCash){
          if(!this.intReceivedAmt){
            Swal.fire('Error!','Enter Received Amt ', 'error');
            this.blnPaytm=false
            event.source._checked = false

          }
        }
        if(this.blnDebitCard)
        {
            if(!this.strDebitCardNo){
              Swal.fire('Error!','Enter Debit Card No ', 'error');
              this.blnPaytm=false
               event.source._checked = false

            }
            else if(!this.intDebitBankId){
              Swal.fire('Error!','Enter Bank Name Of Debit Card ', 'error');
              this.blnPaytm=false
              event.source._checked = false
              return false
            }
            else if(!this.intDebitAmt){
              Swal.fire('Error!','Enter Debit Amount ', 'error');
              this.blnPaytm=false
              event.source._checked = false
            }
            else if(!this.strDebitRefNo){
              Swal.fire('Error!','Enter Reference No Of Debit Card', 'error');
              this.blnPaytm=false
              event.source._checked = false
            }
        }

        if(this.blnPaytmMall)
        {
             if(!this.intPaytmMallMobileNumber){
              Swal.fire('Error!','Enter Mobile Number', 'error');
              this.blnPaytm=false
               event.source._checked = false
             }
             else if(!this.intPaytmMallAmount){
              Swal.fire('Error!','Enter Amount', 'error');
              this.blnPaytm=false
               event.source._checked = false
             }
             else if(!this.strPaytmMallTransactionNum){
              Swal.fire('Error!','Enter Paytm Mall Transaction Number ', 'error');
              this.blnPaytm=false
               event.source._checked = false
             }
             else if(!this.strPaytmMallReferenceNum){
              Swal.fire('Error!','Enter Paytm Mall Reference Number ', 'error');
              this.blnPaytm=false
               event.source._checked = false
             }
        }
        

    }

    this.calculateBalance()

  }

  paytmMallChanged(event)
  {
    if(!this.blnPaytmMall){
      this.intPaytmMallMobileNumber=null;
      this.intPaytmMallAmount=0;
      this.strPaytmMallTransactionNum = '';
      this.strPaytmMallReferenceNum = '';

    }
    else{
        if(this.blnCreditCard){
          if(!this.strCreditCardNo){
            Swal.fire('Error!','Enter Credit Card No ', 'error');
            this.blnPaytmMall=false
            event.source._checked = false

          }
          else if(!this.strCreditBankName){
            Swal.fire('Error!','Enter Bank Name Of Credit Card ', 'error');
            this.blnPaytmMall=false
            event.source._checked = false
          }
          else if(!this.intCreditAmt){
            Swal.fire('Error!','Enter Credit Amount ', 'error');
            this.blnPaytmMall=false
            event.source._checked = false
          }
          else if(!this.strCreditRefNo){
            Swal.fire('Error!','Enter Reference No Of Credit Card', 'error');
            this.blnPaytmMall=false
            event.source._checked = false
          }
        }
        if(this.blnCash){
          if(!this.intReceivedAmt){
            Swal.fire('Error!','Enter Received Amt ', 'error');
            this.blnPaytmMall=false
            event.source._checked = false

          }
        }
        if(this.blnDebitCard)
        {
            if(!this.strDebitCardNo){
              Swal.fire('Error!','Enter Debit Card No ', 'error');
              this.blnPaytmMall=false
               event.source._checked = false

            }
            else if(!this.strDebitBankName){
              Swal.fire('Error!','Enter Bank Name Of Debit Card ', 'error');
              this.blnPaytmMall=false
              event.source._checked = false
              return false
            }
            else if(!this.intDebitAmt){
              Swal.fire('Error!','Enter Debit Amount ', 'error');
              this.blnPaytmMall=false
              event.source._checked = false
            }
            else if(!this.strDebitRefNo){
              Swal.fire('Error!','Enter Reference No Of Debit Card', 'error');
              this.blnPaytmMall=false
              event.source._checked = false
            }
        }
        if(this.blnPaytm)
        {
             if(!this.intPaytmMobileNumber){
              Swal.fire('Error!','Enter Mobile Number', 'error');
              this.blnPaytmMall=false
               event.source._checked = false
             }
             else if(!this.intPaytmAmount){
              Swal.fire('Error!','Enter Amount', 'error');
              this.blnPaytmMall=false
               event.source._checked = false
             }
             else if(!this.strPaytmTransactionNum){
              Swal.fire('Error!','Enter Paytm Transaction Number ', 'error');
              this.blnPaytmMall=false
               event.source._checked = false
             }
             else if(!this.strPaytmReferenceNum){
              Swal.fire('Error!','Enter Paytm Reference Number ', 'error');
              this.blnPaytmMall=false
               event.source._checked = false
             }
        }

    }

    this.calculateBalance()

  }



  savePaymentOption(event)
  {
    // =========================================================
    
    if(!this.strFinanceName){
      this.intReceivedAmt = this.intGrandTot
    }
    // =========================================================
    
    let checkError=false
    
    if(this.blnCash){
      if(!this.intReceivedAmt){
        Swal.fire('Error!','Enter Received Amt ', 'error');
        checkError=true

      }
    }
    if(this.blnCreditCard)
       {
          if(!this.strCreditCardNo){
            Swal.fire('Error!','Enter Credit Card No ', 'error');
            checkError=true
          }
          else if(this.strCreditCardNo.length<4){
            Swal.fire('Error!','Enter Mininum 4 Digits ', 'error');
            checkError=true
          }
          else if(!this.intCreditBankId){
            Swal.fire('Error!','Enter Bank Name Of Credit Card ', 'error');
            checkError=true
          }
          else if(!this.intCreditAmt){
            Swal.fire('Error!','Enter Credit Amount ', 'error');
            checkError=true
          }
          else if(!this.strCreditRefNo){
            Swal.fire('Error!','Enter Reference No Of Credit Card', 'error');
            checkError=true
          }
      }
      if(this.blnDebitCard)
      {
          if(!this.strDebitCardNo){
            Swal.fire('Error!','Enter Debit Card No ', 'error');
            checkError=true

          }
          else if(this.strDebitCardNo.length<4){
            Swal.fire('Error!','Enter Mininum 4 Digits ', 'error');
            checkError=true
          }
          else if(!this.intDebitBankId){
            Swal.fire('Error!','Enter Bank Name Of Debit Card ', 'error');
            checkError=true
            return false
          }
          else if(!this.intDebitAmt){
            Swal.fire('Error!','Enter Debit Amount ', 'error');
            checkError=true
          }
          else if(!this.strDebitRefNo){
            Swal.fire('Error!','Enter Reference No Of Debit Card', 'error');
            checkError=true
          }
      }
      if(this.blnPaytm)
      {
          if(!this.intPaytmMobileNumber){
            Swal.fire('Error!','Mobile number is required ', 'error');
            checkError=true

          }
          else if(this.intPaytmMobileNumber.toString().length < 10 || this.intPaytmMobileNumber.toString().length >10 ){
           Swal.fire('Error!','Invalid Mobile number','error');
           checkError = true;

          }
          else if(!this.intPaytmAmount){
            Swal.fire('Error!','Paytm amount required ', 'error');
            checkError=true
          }
          else if(!this.strPaytmTransactionNum){
            Swal.fire('Error!','Paytm Transaction Number required', 'error');
            checkError=true

          }
          else if(!this.strPaytmReferenceNum){
            Swal.fire('Error!','Paytm Reference Number required', 'error');
            checkError=true

          }


      }
      if(this.blnPaytmMall)
      {
          if(!this.intPaytmMallMobileNumber){
            Swal.fire('Error!','Mobile number is required ', 'error');
            checkError=true

          }
          else if(this.intPaytmMallMobileNumber.toString().length < 10 || this.intPaytmMallMobileNumber.toString().length >10 ){
           Swal.fire('Error!','Invalid Mobile number','error');
           checkError = true;

          }
          else if(!this.intPaytmMallAmount){
            Swal.fire('Error!','Paytm Mall amount required ', 'error');
            checkError=true
          }
          else if(!this.strPaytmMallTransactionNum){
            Swal.fire('Error!','Paytm Mall Transaction Number required', 'error');
            checkError=true

          }
          else if(!this.strPaytmMallReferenceNum){
            Swal.fire('Error!','Paytm Mall  Reference Number required', 'error');
            checkError=true

          }


      }
      if(!checkError){
        
        // =================================
        if(!this.strFinanceName){
          this.intBalanceAmt = 0
        }
        // =================================
        
        if(this.intBalanceAmt<=0){
          this.dctData['lstPaymentData']={}
          this.dctData['lstPaymentData'][4]={}
          
          
          if(this.blnReceipt){
            
            if(this.intGrandTot<this.intReceiptTot){
              this.dctData['lstPaymentData'][4]['dblAmt'] = this.intGrandTot;
            }
            else{
              this.dctData['lstPaymentData'][4]['dblAmt'] = this.intReceiptTot;
            }
            
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

          this.dctData['lstPaymentData'][1]['dblAmt']=this.intReceivedAmt
          this.dctData['lstPaymentData'][3]['dblAmt']=this.intCreditAmt
          this.dctData['lstPaymentData'][3]['intBankId']=this.intCreditBankId;
          this.dctData['lstPaymentData'][3]['strName']=this.strCreditBankName;
          this.dctData['lstPaymentData'][3]['strCardNo']=this.strCreditCardNo
          this.dctData['lstPaymentData'][3]['strRefNo']=this.strCreditRefNo
          this.dctData['lstPaymentData'][2]['dblAmt']=this.intDebitAmt
          this.dctData['lstPaymentData'][2]['intBankId']=this.intDebitBankId
          this.dctData['lstPaymentData'][2]['strName']=this.strDebitBankName
          this.dctData['lstPaymentData'][2]['strCardNo']=this.strDebitCardNo
          this.dctData['lstPaymentData'][2]['strRefNo']=this.strDebitRefNo;
          this.dctData['lstPaymentData'][3]['intCcCharge']=this.intCreditAmt
          this.dctData['lstPaymentData'][2]['intCcCharge']=this.intDebitCc

          this.dctData['lstPaymentData'][0]['intFinanceAmt']=this.intFinanceAmt
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

          // ======================================================
          if (!this.strFinanceName) {
            this.showModalPayment = this.modalService.open('makepayment', { size: 'lg' })
            this.showModalPayment.close();
          }
          else{
            this.showModalPayment.close();
          }
          // ======================================================
          
        }
        else{
          
          Swal.fire('Error!',this.intBalanceAmt.toFixed(2)+" is Required", 'error');
        }


      }
  }
  cancelPaymentOption()
  {
    this.intBalanceAmt = this.intGrandTot -(this.intCreditAmt + this.intReceivedAmt + this.intDebitAmt+this.intPaytmAmount+this.intPaytmMallAmount);
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
      dblCGSTPer:item.dblCGSTPer,
      dblIGSTPer:item.dblIGSTPer,
      dblSGSTPer:item.dblSGSTPer,
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
        // this.preItemList.push(returnItem);
        this.linkShow.push('none');
        this.offerDis.push(0);

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
        //   Swal.fire('Error!','Purchase amount should be greater than return amount','error')
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
      this.lstItemDetails[index]['dblIndirectDis']=Number(this.lstIndirectDis[index]);
      // this.preItemList[index]['dblIndirectDis']=Number(this.lstIndirectDis[index]);
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
    else if (!this.dctReturnDetail[currentIndex].strRemark){
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
  bankChanged(item,type){
    
    if(type=='credit'){
      this.strCreditBankName=item.vchr_name;
    }
    else if(type=='debit'){
      this.strDebitBankName=item.vchr_name;

    }

  }
  rejectInvoice(){


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
        
        this.serviceObject.putData('invoice/add_invoice/',{intPartialId:this.salesRowId}).subscribe(res => {
          if (res.status == 1)
          {
            // swal.fire('Success!',res['message'], 'success');
  
            Swal.fire(
                  'Rejected!',
                  'Invoice has been Rejected.',
                  'success'
                )
                localStorage.setItem('previousUrl','invoice/saleslist');
  
            this.router.navigate(['invoice/saleslist']);
      
          }
          else if (res.status == 0) {
            Swal.fire('Error!',res['message'], 'error');
            }
          },
          (error) => {
            Swal.fire('Error!','Server Error!!', 'error');
      
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


  RateClick(index: number, event){

  }

  RateKeypress(index: number, event) {

    // on Enter Button Press
    if (event.keyCode == 13 || event.which == 13) {
      
      if (this.lstItemDetails[index]['dblAmount'] == null || this.lstItemDetails[index]['dblAmount'] == 0 ){
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
          else if (Number(this.lstItemDetails[index]['dblAmount']) > 1000000 || String(this.lstItemDetails[index]['dblAmount']).length > 11) {
            event.preventDefault();
          }




          if (!this.blnCheckIGST) {

            //  dblRate =   (  ( dblAmount + dblDiscount + dblBuyBack ) * 100  )  /  ( 100 + dblCGSTPer + dblCGSTPer )

            this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount'] + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'])

            //  dblCGST = ( CGSTPercentage * dblRate ) / 100

            this.lstItemDetails[index]['dblCGST'] = (this.lstItemDetails[index]['dblCGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
            this.lstItemDetails[index]['dblSGST'] = (this.lstItemDetails[index]['dblSGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100


          }
          else {

            this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount'] + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblIGSTPer'])
            this.lstItemDetails[index]['dblIGST'] = (this.lstItemDetails[index]['dblIGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100

          }
          // this.billingDatails("other", 0);
        }


  }

  RateKeyup(index: number, event){

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

    if (!this.blnCheckIGST ) {

      //  dblRate =   (  ( dblAmount + dblDiscount + dblBuyBack ) * 100  )  /  ( 100 + dblCGSTPer + dblCGSTPer )

      this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount'] + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblCGSTPer'] + this.lstItemDetails[index]['dblSGSTPer'])

      //  dblCGST = ( CGSTPercentage * dblRate ) / 100

      this.lstItemDetails[index]['dblCGST'] = (this.lstItemDetails[index]['dblCGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
      this.lstItemDetails[index]['dblSGST'] = (this.lstItemDetails[index]['dblSGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
    }
    else {
      this.lstItemDetails[index]['dblRate'] = ((this.lstItemDetails[index]['dblAmount'] + this.lstItemDetails[index]['dblDiscount'] + this.lstItemDetails[index]['dblBuyBack']) * 100) / (100 + this.lstItemDetails[index]['dblIGSTPer'])
      this.lstItemDetails[index]['dblIGST'] = (this.lstItemDetails[index]['dblIGSTPer'] * this.lstItemDetails[index]['dblRate']) / 100
      
      // this.billingDatails("other", 0);
    }
  }

  RateBlur(index: number,event){
    
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

  EnterRate(index: number, event){
     if (this.lstItemDetails[index]['intStatus'] == 2 && this.lstItemDetails[index]['dblAmount'] > 0) {
      let amount = this.lstItemDetails[index]['dblAmount'] * -1

      this.lstItemDetails[index]['dblAmount'] = amount
      this.lstItemDetails[index]['dblRate'] = amount
     
    }
  }


  
}
