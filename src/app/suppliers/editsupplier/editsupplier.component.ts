import { Component, OnInit,ViewChild ,} from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment' ;
import deepDiff from 'return-deep-diff';

@Component({
  selector: 'app-editsupplier',
  templateUrl: './editsupplier.component.html',
  styleUrls: ['./editsupplier.component.css']
})
export class EditsupplierComponent implements OnInit {

  @ViewChild('idCode', { static: true }) idCode: any;
  @ViewChild('idName', { static: true }) idName: any;
  @ViewChild('idNumber')
  idNumber: any;
  @ViewChild('idEmail')
  idEmail: any;
  @ViewChild('idCondactName')
  idContactName: any;
  @ViewChild('idGst', { static: true })
  idGst: any;
  @ViewChild('idFrom', { static: true })
  idFrom: any;
  @ViewChild('idCreditDays', { static: true })
  idCreditDays: any;
  @ViewChild('idCreditLimit', { static: true })
  idCreditLimit: any;
  @ViewChild('idpoExpiryDate')
  idPOExpDays: any;
  @ViewChild('idAddress')
  idAddress: any;
  @ViewChild('idphone1')
  idphone1: any;
  @ViewChild('idPincode1')
  idPincode1: any;
  @ViewChild('idTin', { static: true })
  idTin: any;
  @ViewChild('idCst', { static: true })
  idCst: any;
  @ViewChild('idGstStatus', { static: true })
  idGstStatus: any;
  @ViewChild('idSupCat')
  idSupCat: any;
  @ViewChild('idSupClass')
  idSupClass: any;
  @ViewChild('idAccGrp', { static: true })
  idAccGrp: any;
  @ViewChild('idBankAcc', { static: true })
  idBankAcc: any;
  @ViewChild('idPanNo', { static: true })
  idPanNo: any;
  @ViewChild('idPanStatus', { static: true })
  idPanStatus: any;
  @ViewChild('idName1')
  idName1: any;
  @ViewChild('idDesig1')
  idDesig1: any;
  @ViewChild('idDepartment1')
  idDepartment1: any;
  @ViewChild('idOffice')
  idOffice: any;
  @ViewChild('idMobile1')
  idMobile1: any;
  @ViewChild('idMobile2')
  idMobile2: any;
  @ViewChild('idStates')
  idStates: any;
  
  

  public form: FormGroup;


  pageTitle: string = 'Supplier';
  stateCtrl: FormControl;
  dctSupplier = {};

  intMobile: number = null;
  strEmail = '';
  strSupplierName = '';
  strCondactName = '';
  strSuppilerFrom = '';
  intCreditDays :number = null;
  intCreditLimit : number = null;
  strGstNo = '';
  strSupplierCode = '';
  checkMobile;
  intPoExpiryDays:number =null;
  intGstNumber:number = null;
  strSupplierTaxClass = '';
  strAccGroup = '';
  strBankAccount;
  strPanNumber;
  strPanStatus;
  strName1 :string = null;
  strDesignation1 :string = '';
  strDepartment1 :string ='';
  strOffice1='';
  intMobile1 :number = null;
  intMobile2 : number = null;
  strName2:string ='';
  strDesignation2='';
  strDepartment2='';
  strOffice2='';
  intMobile3:number =null;
  intMobile4:number =null;
  dictAddress1 = {};
  dictAddress2 = {};
  dictContact = {};
  addressnum = 1;
  addressinit = 0;
  intTinNumber ;
  intCstNumber;
  strGstStatus='';
  strSupplierCategory='';
  strSelecetedSupplierCategpory =''
  bln_active='0';
  lst_category=[];
  dict_data = {};
  supplierCategoryId;
  blnActiveChange = false;
  strRemarks = '';
  lst_supplierclass=[];
  supplierTaxClassId; 
  strSupplierTaxClassName = '';
 
  strStates;
  searchStates:FormControl= new FormControl();
  selectedStates;
  intStateId
  lstStates=[];
  dctDealerData ={}
  dctComparData = {}
  strTaxmasterName = '';
  
  supplierId= localStorage.getItem('supplierRowId');

  constructor(
    private serverService: ServerService,
    public router: Router,
    private fb: FormBuilder,
    public toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.blnActiveChange = false;

    this.form = this.fb.group(
      {
        code: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10)])],
        name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
        condactName: [null, Validators.compose([Validators.required])],
        gstNo: [null],
        email1: [null, Validators.compose([Validators.required, CustomValidators.email])],
        email2: [null, Validators.compose([Validators.required, CustomValidators.email])], 
        range: [null, Validators.compose([Validators.required, CustomValidators.range([1000000000, 99999999999999])])],
        supplierFrom: [null, Validators.compose([Validators.required])],
        creditDays :  [null, Validators.compose([Validators.required])],
        creditLimit : [null, Validators.compose([Validators.required])],
        poExpiryDays : [null, Validators.compose([Validators.required])],
        address1 :  [null, Validators.compose([Validators.required])],
        address2 :  [null, Validators.compose([Validators.required])],
        phonenumber1 :  [null, Validators.compose([Validators.required])],
        phonenumber2 :  [null, Validators.compose([Validators.required])],
        pincode1 :  [null, Validators.compose([Validators.required])],
        pincode2 :  [null, Validators.compose([Validators.required])],
        tinNumber:  [null, Validators.compose([Validators.required])],
        CstNumber : [null, Validators.compose([Validators.required])],
        GstNumber : [null, Validators.compose([Validators.required])],
        GstStatus : [null, Validators.compose([Validators.required])],
        suppCat :   [null, Validators.compose([Validators.required])],
        suppClass : [null, Validators.compose([Validators.required])],
        accGrp :[null, Validators.compose([Validators.required])], 
        bankaccount : [null, Validators.compose([Validators.required])],
        panNumber: [null, Validators.compose([Validators.required])],
        panStatus : [null, Validators.compose([Validators.required])],
        name1 : [null, Validators.compose([Validators.required])],
        desig1:[null, Validators.compose([Validators.required])],
        department1:[null, Validators.compose([Validators.required])],
        office1 :[null, Validators.compose([Validators.required])], 
        mobile1 : [null, Validators.compose([Validators.required])],
        mobile2 : [null, Validators.compose([Validators.required])],
        name2 :[null, Validators.compose([Validators.required])],
        desig2 :[null, Validators.compose([Validators.required])],
        department2:[null, Validators.compose([Validators.required])],
        office2:[null, Validators.compose([Validators.required])],
        mobile3:[null, Validators.compose([Validators.required])],
        mobile4:[null, Validators.compose([Validators.required])],
    });

    this.dictAddress1['lstaddress'] =[{
        bln_primary:false,
        strAddress:'',
        strEmail:'',
        intPhone:null,
        strPinCode:'',
        strStates:'',
        bln_status:true

    }]
    
    this.dictContact['lstcontact']= [
      {
        strName:'',
        strDesignation:'',
        strDepartment:'',
        strOffice:'',
        intMobile1:'',
        intMobile2:'',
        bln_status:true
      }
    ]
   this.getSuppliersData(this.supplierId)
  
   this.listSupplierCategory()
   this.listSupplierTaxClass()
   this.typeaheadStates() 

   
  

  }

  clearSupplierFields(){
    this.form.reset();
    this.strSupplierName = '';
    this.intMobile = null
    this.strEmail = '';
    this.strCondactName = '';
    this.strGstNo = '';
  }
  addAddress(){
    this.dictAddress1['lstaddress'].push(
      {
        bln_primary:false,
        strAddress:'',
        strEmail:'',
        intPhone:null,
        strPinCode:'',
        strStates:'',
        bln_status:true
      }
    )
      
    // this.dictAddress1['lstaddressCopy'].push(
    //   {
    //     strAddress:'',
    //     strEmail:'',
    //     intPhone:null,
    //     strPinCode:'',
    //     strStates:'',
    //     bln_status:true
    //   }
    // )

    
  }
  closeTab(index){
    // this.dictAddress1['lstaddressCopy'][index]['bln_status']=false;
    this.dictAddress1['lstaddress'].splice(index,1);
    
  }

  addContact(){
this.dictContact['lstcontact'].push(
  {
    strName:'',
    strDesignation:'',
    strDepartment:'',
    strOffice:'',
    intMobile1:'',
    intMobile2:'',
    bln_status:true
  }
)
  }

  closeContactTab(index){
    // this.dictAddress1['lstcontactCopy'][index]['bln_status']=false;
    this.dictContact['lstcontact'].splice(index,1);
    
  }


  editSupplier(){
    // console.log('p',this.dictAddress1['lstaddress'][0]['strAddress']);
    
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    let validationSuccess = true;
    
    if(this.strSupplierCode.toString()==''){

      validationSuccess = false ;
      this.toastr.error('Please enter valid code','Error!');
      this.idCode.nativeElement.focus();
      return false;
    }
    if(this.strSupplierName.toString()==''){

      validationSuccess = false ;
      this.toastr.error('Please enter valid name','Error!');
      this.idName.nativeElement.focus();
      return false;
    }
    if((this.strSuppilerFrom.toString()).trim() === '' ){

      validationSuccess = false ;
      this.toastr.error('Please enter valid date from','Error!');
      this.idFrom.nativeElement.focus();
      return false;
    }
    if(this.intCreditDays==null){

      validationSuccess = false ;
      this.toastr.error('Please enter Credit days','Error!');
      this.idCreditDays.nativeElement.focus();
      return false;
    }
    if(this.intCreditLimit==null){

      validationSuccess = false ;
      this.toastr.error('Please enter Credit limit','Error!');
      this.idCreditLimit.nativeElement.focus();
      return false;
    }
    if(this.intPoExpiryDays==null){

      validationSuccess = false ;
      this.toastr.error('Please enter PO Expiry days','Error!');
      this.idPOExpDays.nativeElement.focus();
      return false;
    }

    let mainAddrCount=0;
    for (let item=0;item < this.dictAddress1['lstaddress'].length;item++){
      // console.log('p',this.dictAddress1['lstaddress'][item]['strAddress']);
      
      if(!this.dictAddress1['lstaddress'][item]['strAddress']){
        validationSuccess = false ;
        this.toastr.error('Please enter address'+'#'+(item+1),'Error!');
        this.idAddress.nativeElement.focus();
        return false;
      }
      if(this.dictAddress1['lstaddress'][item]['bln_primary']){
        mainAddrCount++;
      }
      if(!this.dictAddress1['lstaddress'][item]['strEmail']){
        validationSuccess = false ;
        this.toastr.error('Please enter email of address '+'#'+(item+1),'Error!');
        // this.idEmail.nativeElement.focus();
        return false;
      }
      
      if ( this.dictAddress1['lstaddress'][item]['strEmail'] != null && this.dictAddress1['lstaddress'][item]['strEmail'] != ''){
        let errorPlace;
        const eatpos = this.dictAddress1['lstaddress'][item]['strEmail'].indexOf('@');
        const edotpos = this.dictAddress1['lstaddress'][item]['strEmail'].lastIndexOf('.');
        if ( eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.dictAddress1['lstaddress'][item]['strEmail'].length) {
          validationSuccess = false ;
          errorPlace = 'Email format not correct of address '+'#'+(item+1);
          // this.dictAddress1['lstaddress'][item]['strEmail']=null;
          // this.idEmail.nativeElement.focus();
          this.toastr.error(errorPlace,'Error!');
          return;
        }
      }




      
      if(!this.dictAddress1['lstaddress'][item]['intPhone'] || this.dictAddress1['lstaddress'][item]['intPhone'].toString().length < 10 || (this.dictAddress1['lstaddress'][item]['intPhone'].toString().length > 12)){
        validationSuccess = false ;
        this.toastr.error('Please enter valid phone number of address '+'#'+(item+1),'Error!');
        this.idphone1.nativeElement.focus();
        return false;
      }
      if(!this.dictAddress1['lstaddress'][item]['strPinCode']){
        validationSuccess = false ;
        this.toastr.error('Please enter pin code of address '+'#'+(item+1),'Error!');
        this.idPincode1.nativeElement.focus();
        return false;
      }
      if(!this.dictAddress1['lstaddress'][item]['strStates']){
        validationSuccess = false ;
        this.toastr.error('Please enter state of address #'+(item+1),'Error!');
        this.idStates.nativeElement.focus();
        return false;
      }

    }

    if(mainAddrCount==0){
      validationSuccess = false ;
      this.toastr.error('Please select a main address','Error!');
      return false;
    }
    else if(mainAddrCount>1){
      validationSuccess = false ;
      this.toastr.error('Only one main address needs to select','Error!');
      return false;
    }
    
    if(!this.intTinNumber){
      validationSuccess = false ;
      this.toastr.error('Please enter TIN no','Error!');
      this.idTin.nativeElement.focus();
      return false;
    }
    if(!this.intCstNumber){
      validationSuccess = false ;
      this.toastr.error('Please enter CST number','Error!');
      this.idCst.nativeElement.focus();
      return false;
    }
    if(!this.intGstNumber){
      validationSuccess = false ;
      this.toastr.error('Please enter GSTIN','Error!');
      this.idGst.nativeElement.focus();
      return false;
    }
    if(!this.strGstStatus){
      validationSuccess = false ;
      this.toastr.error('Please enter GST status','Error!');
      this.idGstStatus.nativeElement.focus();
      return false;
    }

    
    if(!this.strSupplierCategory){
  
      
      validationSuccess = false ;
      this.toastr.error('Please enter supplier category','Error!');
      // this.idSupCat.nativeElement.focus();
      return false;
    }
    if(!this.strSupplierTaxClass){
      validationSuccess = false ;
      this.toastr.error('Please enter supplier tax class','Error!');
      // this.idSupClass.nativeElement.focus();
      return false;
    }
    if(!this.strAccGroup){
      validationSuccess = false ;
      this.toastr.error('Please enter account group','Error!');
      this.idAccGrp.nativeElement.focus();
      return false;
    }
    if(!this.strBankAccount){
      validationSuccess = false ;
      this.toastr.error('Please enter bank account','Error!');
      this.idBankAcc.nativeElement.focus();
      return false;
    }
    if(!this.strPanNumber){
      validationSuccess = false ;
      this.toastr.error('Please enter PAN number','Error!');
      this.idPanNo.nativeElement.focus();
      return false;
    }
    if(!this.strPanStatus){
      validationSuccess = false ;
      this.toastr.error('Please enter PAN status','Error!');
      this.idPanStatus.nativeElement.focus();
      return false;
    }
   
    for (let item=0;item < this.dictContact['lstcontact'].length;item++){
      if(!this.dictContact['lstcontact'][item]['strName']){
        validationSuccess = false ;
        this.toastr.error('Please enter contact name of contact person #'+(item+1),'Error!');
        this.idName1.nativeElement.focus();
        return false;
      }
      if(!this.dictContact['lstcontact'][item]['strDesignation']){
        validationSuccess = false ;
        this.toastr.error('Please enter contact designation of contact person #'+(item+1),'Error!');
        this.idDesig1.nativeElement.focus();
        return false;
      }
      if(!this.dictContact['lstcontact'][item]['strDepartment']){
        validationSuccess = false ;
        this.toastr.error('Please enter department of contact person #'+(item+1),'Error!');
        this.idDepartment1.nativeElement.focus();
        return false;
      }
      if(!this.dictContact['lstcontact'][item]['strOffice']){
        validationSuccess = false ;
        this.toastr.error('Please enter office of contact person #'+(item+1),'Error!');
        this.idOffice.nativeElement.focus();
        return false;
      }
      if(!this.dictContact['lstcontact'][item]['intMobile1'] || this.dictContact['lstcontact'][item]['intMobile1'].toString().length < 10 || this.dictContact['lstcontact'][item]['intMobile1'].toString().length > 12  ){
        validationSuccess = false ;
        this.toastr.error('Please enter valid mobile number1 of contact person #'+(item+1),'Error!');
        this.idMobile1.nativeElement.focus();
        return false;
      }
      if(!this.dictContact['lstcontact'][item]['intMobile2'] || this.dictContact['lstcontact'][item]['intMobile2'].toString().length < 10 || this.dictContact['lstcontact'][item]['intMobile2'].toString().length > 12){
        validationSuccess = false ;
        this.toastr.error('Please enter valid mobile number2 of contact person #'+(item+1),'Error!');
        this.idMobile2.nativeElement.focus();
        return false;
      }
    }
   
   
   

    if(validationSuccess) {
    // this.dctSupplier = {};
    // let formdata = new FormData;
    // this.name = this.toTitleCase(this.name);
    // formdata.append('vchr_name',this.name);
    // formdata.append('vchr_phone',this.mobile.toString());
    // formdata.append('vchr_email',this.email);

    let pusheditems = {}
    console.log(this.dctDealerData,'data');
    // comaprison data
    this.dctComparData['bint_credit_limit']=this.intCreditLimit;
    this.dctComparData['dat_from']=moment(this.strSuppilerFrom).format('YYYY-MM-DD');
    this.dctComparData['fk_category_id']=this.strSupplierCategory;
    this.dctComparData['fk_tax_class_id']=this.strSupplierTaxClass;
    this.dctComparData['int_credit_days']=this.intCreditDays;
    this.dctComparData['int_po_expiry_days']=this.intPoExpiryDays;
    this.dctComparData['is_act_del']=this.bln_active;
    this.dctComparData['supplier_name']=this.strSupplierName;

    this.dctComparData['vchr_account_group']=this.strAccGroup;
    this.dctComparData['vchr_bank_account']=this.strBankAccount;
    this.dctComparData['vchr_category_name']=this.supplierCategoryId;
    this.dctComparData['vchr_code']=this.strSupplierCode;
    this.dctComparData['vchr_cst_no']=this.intCstNumber;
    this.dctComparData['vchr_gstin']=this.intGstNumber;
    this.dctComparData['vchr_gstin_status']=this.strGstStatus;
    this.dctComparData['vchr_pan_no']=this.strPanNumber;
    this.dctComparData['vchr_pan_status']=this.strPanStatus;
    this.dctComparData['vchr_tax_master_name']=this.strTaxmasterName
    this.dctComparData['vchr_tin_no']=this.intTinNumber;
    this.dctComparData['lst_address']=this.dictAddress1['lstaddress'];
    this.dctComparData['lst_contact']=this.dictContact['lstcontact'];
    console.log(this.dctComparData,'compareData');
    
    pusheditems['edited']=deepDiff(this.dctDealerData['data'], this.dctComparData, true);
    
    if(this.blnActiveChange){
        swal.fire({
          title: 'Deactivate',
          input: 'text',
          text: "Are you sure want to deactivate ?" ,
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: 'Cancel',
          confirmButtonText: "Yes, Deactivate this supplier!",
          inputPlaceholder: 'Enter Reason!',
          inputValidator: (text) => {
            this.strRemarks = text;
        return !text && 'You need to write something!'
       },
        }).then(result => {
          if (result.value) {
          // event.confirm.resolve();
    
         
          
          pusheditems['remarks'] =  this.strRemarks;
          pusheditems['pk_bint_id']= this.supplierId;
           
    if (this.intCreditDays){
      pusheditems['intCreditDays'] = this.intCreditDays;
    }
    if (this.intCreditLimit){
      pusheditems['int_credit_limit'] = this.intCreditLimit;
    }
   
    pusheditems['vchr_supplier_code'] = this.strSupplierCode;
    pusheditems['vchr_supplier_name'] = this.strSupplierName;
    pusheditems['int_supplierFrom']   = moment(this.strSuppilerFrom).format('DD-MM-YYYY');


    pusheditems['int_poexpiry_days'] = this.intPoExpiryDays;
    pusheditems['address1'] = this.dictAddress1['lstaddress'];
    pusheditems['contact_person'] = this.dictContact['lstcontact'];
    pusheditems['intTinNumber'] =this.intTinNumber;
    pusheditems['intCstNumber'] =this.intCstNumber;
    pusheditems['intGstNumber'] =this.intGstNumber;
    pusheditems['strGstStatus'] =this.strGstStatus;
    pusheditems['strSupplierCategory'] =this.strSupplierCategory;
    pusheditems['strSupplierTaxClass'] =this.strSupplierTaxClass;
    pusheditems['strAccGroup'] =this.strAccGroup;
    pusheditems['strBankAccount'] =this.strBankAccount;
    pusheditems['strPanNumber'] =this.strPanNumber;
    pusheditems['strPanStatus'] =this.strPanStatus;
    pusheditems['blnactive'] = this.bln_active;
   
    // console.log('epost');
    
    
    this.serverService.postData('supplier/update_supplier/',pusheditems).subscribe(
      (response) => {
      const result = response;
      if (result['status'] === 1) {
      swal.fire( 'Success', 'Successfully Updated', 'success');
      // this.clearSupplierFields();
  localStorage.setItem('previousUrl','supplier/listsupplier');
      
      this.router.navigate(['supplier/listsupplier']);
    } else {
      this.toastr.error(result['reason'],'Error!');
    }
      },
      (error) => { if(error.status == 401){
  localStorage.setItem('previousUrl','/user/sign-in');
        
        this.router.navigate(['/user/sign-in']);} }
    );
         
        
  
       };
    
        });

     

      
    }

    else{

    
    if (this.intCreditDays){
      pusheditems['intCreditDays'] = this.intCreditDays;
    }
    if (this.intCreditLimit){
      pusheditems['int_credit_limit'] = this.intCreditLimit;
    }
    
    pusheditems['pk_bint_id']= this.supplierId;
    pusheditems['vchr_supplier_code'] = this.strSupplierCode;
    pusheditems['vchr_supplier_name'] = this.strSupplierName;
    pusheditems['int_supplierFrom']   =  moment(this.strSuppilerFrom).format('DD-MM-YYYY');


    pusheditems['int_poexpiry_days'] = this.intPoExpiryDays;
    pusheditems['address1'] = this.dictAddress1['lstaddress'];
    pusheditems['contact_person'] = this.dictContact['lstcontact'];
    pusheditems['intTinNumber'] =this.intTinNumber;
    pusheditems['intCstNumber'] =this.intCstNumber;
    pusheditems['intGstNumber'] =this.intGstNumber;
    pusheditems['strGstStatus'] =this.strGstStatus;
    pusheditems['strSupplierCategory'] =this.strSupplierCategory;
    pusheditems['strSupplierTaxClass'] =this.strSupplierTaxClass;
    pusheditems['strAccGroup'] =this.strAccGroup;
    pusheditems['strBankAccount'] =this.strBankAccount;
    pusheditems['strPanNumber'] =this.strPanNumber;
    pusheditems['strPanStatus'] =this.strPanStatus;
    pusheditems['blnactive'] = this.bln_active;
    
    // console.log('npost');
    console.log('data1',pusheditems);
    
    this.serverService.postData('supplier/update_supplier/',pusheditems).subscribe(
      (response) => {
      const result = response;
      if (result['status'] === 1) {
      swal.fire( 'Success', 'Successfully updated', 'success');
      // this.clearSupplierFields();
  localStorage.setItem('previousUrl','supplier/listsupplier');
      
      this.router.navigate(['supplier/listsupplier']);
    } else {
      this.toastr.error(result['reason'],'Error!');
    }
      },
      (error) => { if(error.status == 401){
  localStorage.setItem('previousUrl','/user/sign-in');
        
        this.router.navigate(['/user/sign-in']);} }
    );
  
    }

    
    
    

   

  }
  else{

      this.toastr.error('Fill required fields correctly','Error!');
  }

} 

getSuppliersData(id){
  this.serverService.getData('supplier/get_suplier_by_id/?id='+id).subscribe(
    (data) => {
    // const result = data.json();
    
    if (data['status'] == 1) {

      this.dict_data = data['lst_userdetailsview'][id]
      this.dctDealerData['data'] = JSON.parse(JSON.stringify(data['lst_userdetailsview'][id]))
      
      if (this.dict_data['int_credit_days']){
        this.intCreditDays = this.dict_data['int_credit_days'];
    
        
      }
      if (this.dict_data['bint_credit_limit']){
        this.intCreditLimit = this.dict_data['bint_credit_limit'];
      }
      this.strSupplierName = this.dict_data['supplier_name'];
      this.strSupplierCode = this.dict_data['vchr_code'];
      this.strSuppilerFrom = this.dict_data['dat_from'];
      this.intPoExpiryDays =  this.dict_data['int_po_expiry_days'];
      this.dictAddress1['lstaddress'] = this.dict_data['lst_address'];
      // this.dictAddress1['lstaddressCopy']=this.dictAddress1['lstaddress']
      this.dictContact['lstcontact']  = this.dict_data['lst_contact'];
      // this.dictContact['lstcontactCopy']  = JSON.parse(JSON.stringify(this.dictContact['lstcontact']))
      this.intTinNumber = this.dict_data['vchr_tin_no'];
      this.intCstNumber =  this.dict_data['vchr_cst_no'];
      this.intGstNumber =   this.dict_data['vchr_gstin'];
      this.strGstStatus =   this.dict_data['vchr_gstin_status'];
      this.strSupplierCategory =  this.dict_data['fk_category_id'];;
      this.strSupplierTaxClass =  this.dict_data['fk_tax_class_id'];
      this.supplierCategoryId= this.dict_data['vchr_category_name'];
      this.supplierTaxClassId= this.dict_data['fk_tax_class_id'];
      this.strAccGroup =  this.dict_data['vchr_account_group'];
      this.strBankAccount =  this.dict_data['vchr_bank_account'];
      this.strPanNumber =  this.dict_data['vchr_pan_no'];
      this.strPanStatus =  this.dict_data['vchr_pan_status'];
      this.bln_active =  this.dict_data['is_act_del'].toString();
      this.strTaxmasterName = this.dict_data['vchr_tax_master_name'];
      // this.strStates =  this.dict_data['vchr_states_name'];
      // this.intStateId=this.dict_data['fk_states_id'];      
  } 
 
    },
    
  );

  
  

}

listSupplierCategory(){
  this.serverService.getData('supplier/get_category_list/').subscribe(
    (data) => {
    // const result = data.json();
    if (data['status'] == 1) {

      this.lst_category = data['data']
    
  } 

    },
   
  );
}

listSupplierTaxClass(){
  this.serverService.getData('supplier/get_tax_class_list/').subscribe(
    (data) => {
    // const result = data.json();
    if (data['status'] == 1) {

      this.lst_supplierclass = data['data']
    
  } 

    },
   
  );
}

supplierCategoryChanged(item){
  this.supplierCategoryId = item.categoryname;
  this.strSupplierCategory = item.id;
 
}

supplierTaxClassChanged(item){
  this.supplierTaxClassId = item.id;
  this.strSupplierTaxClassName = item.name;


}

blnChange(){
  this.blnActiveChange = true;
  // console.log('change',this.blnActiveChange);
}

   
typeaheadStates(){

  this.serverService.getData('states/states_typehead/').subscribe(
    (response) => {
      this.lstStates=response['list_states'];
    },
    (error) => {   
     swal.fire('Error!','error', 'error');
      
    });

}


stateChanged(state,item){
  this.intStateId=state.pk_bint_id
  // console.log('state',this.intStateId);
  
  item['fk_states']= this.intStateId;
  this.selectedStates=state.vchr_name
}

}
