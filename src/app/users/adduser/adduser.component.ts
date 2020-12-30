import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { debounceTime } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { tickStep } from 'd3';
import { DatePipe } from '@angular/common';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  status = false;

  userType = localStorage.getItem('staff');
  companyId = Number(localStorage.getItem('companyId'));
  @ViewChild('eventImg', { static: true }) eventImg: ElementRef;

  constructor(
    private serviceObject: ServerService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    public DomSanitize: DomSanitizer,
    public datePipe: DatePipe,

  ) { }

  public form: FormGroup;

  searchCompany: FormControl = new FormControl();
  password1 = new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)]));
  confirmPassword2 = new FormControl('', CustomValidators.equalTo(this.password1));
  // models intialization
  code;
  firstname;
  lastname;
  email = '';
  contactno;
  reportingto = [];
  lstDepartment = [];
  lstDepartmentSelected = [];
  departmentSelected = '';
  intBranchSelected = 0;
  targetCompleteDuration;
  enquiryTarget;
  bookingTarget;
  password;
  confirmPassword;
  intSelectedCompany = 0;
  strBranchName = ''
  strBranchCode = ''
  strCountryName = ''
  strCountryCode = ''

  lstCompany = [];
  strCompanyName = '';
  strCompanyCode = '';
  strSelectedCompany = '';
  // error fields
  code_error_field = '';
  firstname_error_field = '';
  lastname_error_field = '';
  email_error_field = '';
  contactno_error_field = '';
  assignto_error_field = '';
  area_error_field = '';
  targetCompleteDuration_error_field = '';
  enquiryTarget_error_field = '';
  bookingTarget_error_field = '';
  password_error_field = '';
  confirmPassword_error_field = '';

  reportingToList;
  groupList;
  group;
  strGroupName = '';
  financeList;
  finance;
  strFinanceName = '';
  lstGroups = [];

  strSelectedBranch;
  lstBranch = [];
  branchId: number;
  branchName = '';
  searchBranch: FormControl = new FormControl();
  branchStatus = false;
  strBranch = '';

  companyType = '';

  strFilter = '';

  intCompanyId: number;

  lstGroupFilter = [];

  brandName = '';
  brandId: number = 0;
  lstBrand = [];
  lst_company = []
  ImageSrc = '';
  ImageLocation = '';
  blnPromoter = false;
  selectedBrand = '';
  resignationDate;
  strGroup = localStorage.getItem('group_name');

  // Branch Type multiselect dropdown
  branchTypeOptions = [{"name":"all sales counters","id": 1},{"name":"all ware houses","id": 3},{"name":"head office","id": 2}]
  lstBranchType = []
  branchTypeConfig = {
    displayKey: "name",
    search: true,
    height: '200px',
    placeholder: "Allocate Branch Type",
    customComparator: () => { },
    moreText: 'more',
    noResultsFound: 'No results found!',
    searchPlaceholder: 'Search',
    searchOnKey: 'name'
  }
  // -----------------------


  //multi select drop down :  
  branches;
  lstIds = []
  selectedDropDown = []
  dropdownOptions = []

  config = {
    displayKey: "vchr_name",
    search: true,
    height: '200px',
    placeholder: "Allocate Branch",
    customComparator: () => { },
    moreText: 'more',
    noResultsFound: 'No results found!',
    searchPlaceholder: 'Search',
    searchOnKey: 'vchr_name'
  }

  

  itemGroupOptions = []
  itemGroupDropDown = []
  itemGroupconfig = {
    displayKey: "vchr_item_group",
    search: true,
    height: '200px',
    placeholder: "Allocate Item Group",
    customComparator: () => { },
    moreText: 'more',
    noResultsFound: 'No results found!',
    searchPlaceholder: 'Search',
    searchOnKey: 'vchr_item_group'
  }
  priceOptions=['MRP','MOP','Dealer Price','Cost Price']
  ProductOptions = []
  ProductDropDown = []
  Productconfig = {
    displayKey: "vchr_name",
    search: true,
    height: '200px',
    placeholder: "Allocate Product",
    customComparator: () => { },
    moreText: 'more',
    noResultsFound: 'No results found!',
    searchPlaceholder: 'Search',
    searchOnKey: 'vchr_name'
  }

  priceConfig ={
    displayKey: "name",
    search: true,
    height: '200px',
    placeholder: "Price Permission",
    customComparator: () => { },
    moreText: 'more',
    noResultsFound: 'No results found!',
    searchPlaceholder: 'Search',
    searchOnKey: 'name'
  }
  lstPrice= []
  blnSalesCounter = false;
  blnUserCode = false;

  ngOnInit() {

    // dropdown for company start  
    console.log(this.blnSalesCounter,'sales_counter');
    
    this.serviceObject.getData('user/get_company_list/').subscribe(
      (data) => {
        // const result = data.json();
        if (data['status'] == 1) {

          this.lst_company = data['data']

        }

      },

    );

    //  company drpdown end 

    this.serviceObject.getData('user/get_brand_list/').subscribe(
      (data) => {

        // const result = data.json();
        if (data['status'] == 1) {

          this.lstBrand = data['data']

        }

      },

    );

    this.serviceObject.getData('user/get_group_list/').subscribe(
      (data) => {

        // const result = data.json();
        if (data['status'] == 1) {

          this.lstGroups = data['data']

        }

      },

    );



    this.searchBranch.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstBranch = [];
        } else {
          if (strData.length >= 3) {
            this.serviceObject
              .putData('user/get_branch_list/', { strData: strData })
              .subscribe(
                (response) => {
                  this.lstBranch = response['data'];

                }
              );
          }
        }
      }
      );


    this.form = this.fb.group({
      code: [null, Validators.compose([Validators.required])],
      fname: [null, Validators.compose([Validators.required])],
      lname: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([CustomValidators.email])],
      phone: [null, Validators.compose([Validators.required,
      CustomValidators.min(1000000000), CustomValidators.max(1000000000000), CustomValidators.number])],
      password: this.password1,
      confirmPassword: this.confirmPassword2
    });

    //multiselect dropdown funct call:

    this.getBranchListNew();
    this.getItemGroupListNew();
    this.getProductListNew();

  }

  addTax() {
    console.log("method");

  }


  //multselect dropdown funct def:

  getBranchListNew() {
    let Id;
    Id = "0"

    this.serviceObject.getData('branch/branchapi/?activestatus=' + Id).subscribe(
      (data) => {

        // const result = data.json();
        if (data['status'] == 1) {
          // console.log(data);

          this.branches = data['lst_branch'];

        }
        this.dropdownOptions = this.branches;
      },
    );

  }
  getItemGroupListNew() {

    let dictSamp = {}

    this.serviceObject.postData('itemgroup/listitemgroup/', dictSamp).subscribe(
      (data) => {

        // const result = data.json();
        if (data['status'] == 1) {
          // console.log(data);

          this.itemGroupOptions = data['lst_item_group'];
          // console.log(this.itemGroupOptions);

        }

      },
    );

  }

  getProductListNew() {


    this.serviceObject.getData('products/add_product/').subscribe(
      (data) => {

        // const result = data.json();
        if (data['status'] == 1) {
          console.log("pppuuuuu", data);

          this.ProductOptions = data['data'];
          // console.log(this.ProductOptions);

        }

      },
    );

  }

  branchTypeChanged(item){
    if (this.lstBranchType.length > 0){
      this.blnSalesCounter = true;
    }
    else{
      this.blnSalesCounter = false;
    }
  }

  //multi select drop down end:

  funcAddUserData() {

    // let priceValue={'MRP':false,'MOP':false,'Dealer Price':false,'Cost Price':false}
    
    // this.resignationDate = this.datePipe.transform(this.resignationDate, 'dd/MM/yyyy');


    let validationSuccess = true;
    let errorPlace = ''


    if (!(this.ImageLocation && this.ImageLocation["size"] <= 102400)) {
      validationSuccess = false;
      errorPlace = 'Image maximum size 100KB';
    }
    if (!this.ImageSrc) {
      validationSuccess = false;
      errorPlace = 'No image uploaded'
    }
    if (this.password == null) {
      validationSuccess = false;
      errorPlace = 'Fill password correctly'
    } else if (this.password.length < 8) {
      validationSuccess = false;
      errorPlace = 'Password minimum length should be 8'
    } else if (this.password !== this.confirmPassword) {
      validationSuccess = false;
      errorPlace = 'Confirm password mismatch'
    }

    if (this.contactno == null) {
      validationSuccess = false;
      errorPlace = 'Fill contact number correctly'
    } else if ((this.contactno).toString().length < 10 || (this.contactno).toString().length > 12) {
      validationSuccess = false;
      errorPlace = 'Contact number length between 10 and 12 digit'
    }
    if (this.email !== undefined && this.email !== null && this.email.trim() !== '') {
      const eatpos = this.email.indexOf('@');
      const edotpos = this.email.lastIndexOf('.');
      if (eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.email.length) {
        validationSuccess = false;
        errorPlace = 'Email format not correct'
      }
    }
    if (this.lastname == null || this.lastname.trim() === '') {
      validationSuccess = false;
      errorPlace = 'Fill last name correctly'
    }
    else if (!/^[a-zA-Z\s ]*$/g.test(this.lastname)) {
      validationSuccess = false;
      errorPlace = 'Last name allow only alphabets and white space'
    }
    if (this.firstname == null || this.firstname.trim() === '') {
      validationSuccess = false;
      errorPlace = 'Fill first name correctly'
    }
    else if (!/^[a-zA-Z\s ]*$/g.test(this.firstname)) {
      validationSuccess = false;
      errorPlace = 'First name allow only alphabets and white space'
    }
    if (this.code == null && this.blnUserCode) {
      validationSuccess = false;
      errorPlace = 'Fill code correctly';
    }

    if (this.blnPromoter) {
      if (this.brandName !== undefined && this.brandName !== '' && this.selectedBrand !== this.brandName || this.brandId == 0) {
        validationSuccess = false;
        errorPlace = 'Select valid brand'
      }
    }
    if (this.group == null) {
      validationSuccess = false;
      errorPlace = 'Select group'
    }



    // if(this.strSelectedBranch == null || this.strSelectedBranch == ''){


    //   validationSuccess = false;
    //   errorPlace ='Select branch'
    // }
    if (this.strSelectedBranch != this.strBranch || this.strSelectedBranch == '') {
      validationSuccess = false;
      errorPlace = 'Select branch'
    }

    if (validationSuccess) {
      if (!this.blnPromoter) {
        this.brandId = 0;
      }

      if (this.lstBranchType.length > 0 && this.blnSalesCounter) {

        swal.fire({
          title: 'Are you sure?',
          text: 'All the Selected type of branches can be accessed by the user.',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: "It's Okey!",
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.value) {
            this.SaveContinue();
          }
        })
        
      }

      else{
        this.SaveContinue();
      }

      
    } else {

      swal.fire('Error', errorPlace, 'error');




    }
  }

  SaveContinue(){

    let priceValue= {'bln_mop':false,'bln_mrp':false,'bln_dp':false,'bln_cost_price':false}

    this.priceOptions.forEach(element => {
      if(this.lstPrice.includes(element) && element=='MRP'){
        priceValue['bln_mrp']=true 
      }
      if(this.lstPrice.includes(element) && element=='MOP'){
        priceValue['bln_mop']=true 
      }
      if(this.lstPrice.includes(element) && element=='Dealer Price'){
        priceValue['bln_dp']=true 
      }
      if(this.lstPrice.includes(element) && element=='Cost Price'){
        priceValue['bln_cost_price']=true 
      }
    });

    const pusheditems = {};
      const frmPublishedData = new FormData;
      // let resgDate = this.resignationDate.format('DD/MM/YYYY');
      // console.log('date',resgDate);
      if (this.blnPromoter) {
        frmPublishedData.append('brand', this.brandId.toString());
      }

      //multi select dropdown :
      if (this.lstBranchType.length > 0 && this.blnSalesCounter) {

        let lstData = []
        this.lstBranchType.forEach(element => {
          lstData.push(element.id)
        });
        frmPublishedData.append('lstBranchType', lstData.toString());
      }

      if (this.lstIds.length > 0 && !this.blnSalesCounter) {

        let lstData = []
        this.lstIds.forEach(element => {
          lstData.push(element.pk_bint_id)
        });
  
        frmPublishedData.append('lstBranchId', lstData.toString());
      }

      if (this.itemGroupDropDown.length > 0) {

        let lstData = []
        this.itemGroupDropDown.forEach(element => {
          lstData.push(element.pk_bint_id)
        });
        frmPublishedData.append('lstItemGroupId', lstData.toString());
      }

      if (this.ProductDropDown.length > 0) {

        let lstData = []
        this.ProductDropDown.forEach(element => {
          lstData.push(element.pk_bint_id)
        });
        console.log("ooooqq", lstData);


        // this.dctData['lstProduct'] = lstData;
        frmPublishedData.append('lstProductId', lstData.toString());

      }
      
      // multiselect dropdown end:
      // if slected group is not admin then userode will be generated on backend 
      if (!this.blnUserCode){
        
        this.code = '';
      }
      else{
        this.code = this.code.trim()
      }
      frmPublishedData.append('dctPriceList', JSON.stringify(priceValue));
      frmPublishedData.append('vchr_user_code', this.code);
      frmPublishedData.append('firstname', this.firstname.trim());
      frmPublishedData.append('lastname', this.lastname.trim());
      frmPublishedData.append('email', this.email);
      frmPublishedData.append('contactno', this.contactno);
      frmPublishedData.append('password', this.password);
      frmPublishedData.append('group_id', this.group);
      frmPublishedData.append('image', this.ImageLocation);
      frmPublishedData.append('branch_id', this.branchId.toString());
      // frmPublishedData.append('brand', this.brandId.toString());
      // frmPublishedData.append('resigDate',this.resignationDate);
      console.log('post');

      this.serviceObject.postFormData('user/adduser/', frmPublishedData).subscribe(
        (response) => {
          // const result = response.json();
          if (response['status'] === 1) {


            swal.fire('Success', response['message'], 'success');
            localStorage.setItem('previousUrl', 'user/listuser');


            this.router.navigate(['user/listuser']);
          } else {
            swal.fire('Error', response['message'], 'error')
          }

        },
        (error) => { swal.fire('Error', error, 'error'); }
      );

  }



  onChangeGroup(obj) {

    console.log("$event : ",typeof obj);
    
    
    if (this.group == null) {
      swal.fire('Error', 'Add group', 'error');
    }
  }

  groupSelectionChange(item){

    if(item.groupname.toUpperCase() == 'ADMIN'){
      this.blnUserCode = true;
    }
    else{
      this.blnUserCode = false;
    }

  }

  

  brandChanged(item) {
    this.brandId = item.id;
    this.brandName = item.name;
  }


  onChange(event: any) {
    const imgs = event.target.files[0];
    this.ImageSrc = imgs;
    this.ImageLocation = event.target.files[0];

    status = this.checkImage();
  }

  checkImage() {
    if (this.ImageSrc) {
      const img_up = new Image;
      const img_ratio_up = 0;
      img_up.onload = () => {

      };
      img_up.src = window.URL.createObjectURL(this.ImageSrc);
      return status;
    }
  }

  onImageClick() {
    this.eventImg.nativeElement.click();
  }


  BranchChanged(item) {


    this.branchId = item.id;
    this.strBranch = item.branchname;




  }

}
