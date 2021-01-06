import { Component, OnInit,ViewChild ,} from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { log } from 'util';
import * as moment from 'moment' ;

@Component({
  selector: 'app-addsupplier',
  templateUrl: './addsupplier.component.html',
  styleUrls: ['./addsupplier.component.css']
})
export class AddsupplierComponent implements OnInit {
  
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
  strSuppilerFrom =new Date();
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
  bln_active='0';
  lst_category=[];
  supplierCategoryId;
  lst_supplierclass=[];
  supplierTaxClassId; 
  strSupplierTaxClassName = '';
 
  strStates;
  searchStates:FormControl= new FormControl();
  selectedStates;
  intStateId
  lstStates=[];

  constructor(
    private serverService: ServerService,
    public router: Router,
    private fb: FormBuilder,
    public toastr: ToastrService,
  ) { }

  ngOnInit() {

    this.strSuppilerFrom=new Date();

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
        strMainAddr:false,
        strAddress:'',
        strEmail:'',
        intPhone:null,
        strPinCode:'',
        strStates:'',
    }]
    
    this.dictContact['lstcontact']= [
      {
        strName:'',
        strDesignation:'',
        strDepartment:'',
        strOffice:'',
        intMobile1:'',
        intMobile2:''
      }
    ]
    
   this.listSupplierCategory()
   this.listSupplierTaxClass()
   this.typeaheadStates() 

  //  this.searchStates.valueChanges.debounceTime(100).subscribe(
  //   data=>{
  //   if (data === undefined || data === null) {
  //   } else {
  
  //     if (data.length > 1) {
  //       this.lstStates = [];
  //       this.typeaheadStates(data)      
  //     } else{
  //       this.lstStates = [];
  //     }
  //   }
  // })
  
  

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
        strMainAddr:false,
        strAddress:'',
        strEmail:'',
        intPhone:null,
        strPinCode:'',
        strStates:''
      }
    )
  }
  closeTab(index){
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
    intMobile2:''
  }
)
  }

  closeContactTab(index){
    this.dictContact['lstcontact'].splice(index,1);
    
  }
  
  typeaheadStates(){

    this.serverService.getData('states/states_typeahead/').subscribe(
      (response) => {
        this.lstStates=response['list_states'];
      },
      (error) => {   
       swal.fire('Error!','error', 'error');
        
      });
     
  }

  addNewSupplier(){
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
    if(this.strSuppilerFrom.toString()==''){

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
        this.toastr.error('Please enter address of address'+'#'+(item+1),'Error!');
        this.idAddress.nativeElement.focus();
        return false;
      }
      if(this.dictAddress1['lstaddress'][item]['strMainAddr']){
        mainAddrCount++;
      }
      if(!this.dictAddress1['lstaddress'][item]['strEmail']){
        validationSuccess = false ;
        this.toastr.error('Please enter email of address'+'#'+(item+1),'Error!');
        // this.idEmail.nativeElement.focus();
        return false;
      }

      if ( this.dictAddress1['lstaddress'][item]['strEmail'] != null || this.dictAddress1['lstaddress'][item]['strEmail'] != ''){
        let errorPlace;
        const eatpos = this.dictAddress1['lstaddress'][item]['strEmail'].indexOf('@');
        const edotpos = this.dictAddress1['lstaddress'][item]['strEmail'].lastIndexOf('.');
        if ( eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.dictAddress1['lstaddress'][item]['strEmail'].length) {
          validationSuccess = false ;
          errorPlace = 'Email format not correct of address' +'#'+(item+1);
          // this.dictAddress1['lstaddress'][item]['strEmail']=null;
          this.idEmail.nativeElement.focus();
          this.toastr.error(errorPlace,'Error!');
          return;
        }
      }
    //  if (this.txtEmail != null && this.txtEmail != undefined) {
    //        dctAudit['strEmail']=this.txtEmail.replace(/\s/g, "");
    //   } else{
    //     dctAudit['strEmail']=this.txtEmail;
    //   }






      if(!this.dictAddress1['lstaddress'][item]['intPhone'] ){
        validationSuccess = false ;
        this.toastr.error('Please enter valid phone number address'+'#'+(item+1),'Error!');
        this.idphone1.nativeElement.focus();
        return false;
      }else if(this.dictAddress1['lstaddress'][item]['intPhone'].toString().length < 10 || (this.dictAddress1['lstaddress'][item]['intPhone'].toString().length > 12)){
        validationSuccess = false ;
        this.toastr.error('Contact number length between 10 and 12 digit of address'+'#'+(item+1),'Error!');
        this.idphone1.nativeElement.focus();
        return false;
      }
      if(!this.dictAddress1['lstaddress'][item]['strPinCode']){
        validationSuccess = false ;
        this.toastr.error('Please enter pin code of address'+'#'+(item+1),'Error!');
        this.idPincode1.nativeElement.focus();
        return false;
      }
      if(!this.dictAddress1['lstaddress'][item]['strStates']){
        validationSuccess = false ;
        this.toastr.error('Please enter state of address'+'#'+(item+1),'Error!');
        // this.idStates.nativeElement.focus();
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
      this.idSupCat.nativeElement.focus();
      return false;
    }
    if(!this.strSupplierTaxClass){
      validationSuccess = false ;
      this.toastr.error('Please enter supplier tax class','Error!');
      this.idSupClass.nativeElement.focus();
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
      if(!this.dictContact['lstcontact'][item]['intMobile1'] || this.dictContact['lstcontact'][item]['intMobile1'].toString().length < 10 || this.dictContact['lstcontact'][item]['intMobile1'].toString().length > 12 ){
        validationSuccess = false ;
        this.toastr.error('Please enter valid mobile number1 of contact person #'+(item+1),'Error!');
        this.idMobile1.nativeElement.focus();
        return false;
      }
      if(!this.dictContact['lstcontact'][item]['intMobile2'] || this.dictContact['lstcontact'][item]['intMobile2'].toString().length < 10 || this.dictContact['lstcontact'][item]['intMobile2'].toString().length > 12 ){
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




    this.serverService.postData('supplier/add_supplier/',pusheditems).subscribe(
      (response) => {
      const result = response;
      if (result['status'] === 1) {
      swal.fire( 'Success', 'Successfully added', 'success');
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
  else{

      this.toastr.error('Fill required fields correctly','Error!');
  }

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
  this.supplierCategoryId = item.id;
  this.strSupplierCategory = item.name;


}
supplierTaxClassChanged(item){
  this.supplierTaxClassId = item.id;
  this.strSupplierTaxClassName = item.name;


}

stateChanged(state,item){
  this.intStateId=state.pk_bint_id
  item['fk_states']= this.intStateId
  this.selectedStates=state.vchr_name
}

}
