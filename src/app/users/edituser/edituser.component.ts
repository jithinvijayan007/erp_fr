import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CustomValidators } from 'ng2-validation';
import { debounceTime } from 'rxjs/operators';

// import { DataService } from '../../global.service';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit {

  status = false;

  userType = localStorage.getItem('staff');
  ImageSrc = '';
  ImageLocation = '';
  SelectedImage = '';
  strFilter = '';

  blnPromoter = false;

  selectedBrand = '';
  searchBrand: FormControl = new FormControl();
  brandName = '';
  brandId: number = 0;

  lstBrand = [];
  departmentSelected = '';
  groups = [];

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

  strSelectedCountry = '';
  // searchBranch: FormControl = new FormControl();
  searchCountry: FormControl = new FormControl();
  lstGroupFilter = [];

  @ViewChild('eventImg') eventImg: ElementRef;

  dataLoaded = false;
  userid = localStorage.getItem('edituserid');
  // intEditUserId = localStorage.getItem('edituserid');
  companyId = Number(localStorage.getItem('companyId'));
  intCompanyId: number = 0;
  password1 = new FormControl(
    '',
    Validators.compose([Validators.required, Validators.minLength(8)])
  );
  confirmPassword2 = new FormControl(
    '',
    CustomValidators.equalTo(this.password1)
  );

  // models for edit user
  Code = '';
  code;
  strFirstname = '';
  firstname;
  lastname = '';
  email = '';
  contactno = null;
  role;
  assignto = [];
  lstReportingto = [];
  lstReportingtoSelected = [];
  lstDepartment = [];
  lstGroup = [];
  strRoleSelected;
  strGroupSelected;
  lstDepartmentSelected = [];
  strBranchSelected = '';
  strBranch = '';
  area = '';
  targetCompleteDuration;
  enquiryTarget;
  bookingTarget;
  password = '';
  confirmPassword;
  imageflag = 0;
  reportingToList;
  public form: FormGroup;
  userdetails = [];
  showEditData = false;

  editingUserId;
  companyType = '';
  strGroupName = '';

  strBranchName = '';
  strBranchCode = '';
  strCountryName = '';
  strCountryCode = '';
  lstCountries = [];
  lstTerritory = [];
  lstZone = [];
  lstState = [];
  intAreaSelected = '';
  countryStatus = false;
  group = '';
  financeList;
  finance;
  strFinanceName = '';
  lst_company = [];
  strCompanyName = '';

  groupList;
  branches;



  strSelectedBranch;
  lstBranch = [];
  branchId: number;
  branchName = '';
  searchBranch: FormControl = new FormControl();
  branchStatus = false;
  intBranchSelected = 0;
  blnSalesCounter = false;

  // --------------------------------- //
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

  lstBranchId = [];
  lstItemGroupId = [];
  lstProductId = [];
  newUserView = []
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
  priceOptions=['MRP','MOP','DEALER PRICE','COST PRICE']



  strSelectedCompany = '';
  resignationDate;
  selectedDatasource = ['100', '104']

  constructor(
    public router: Router,
    private serviceObject: ServerService,
    private fb: FormBuilder,
    public datePipe: DatePipe,
    // private dataService: DataService
  ) { }

  ngOnInit() {

    this.form = this.fb.group({
      code: [null, Validators.compose([Validators.required])],
      fname: [null, Validators.compose([Validators.required])],
      lname: [null, Validators.compose([Validators.required])],
      email: [
        null,
        Validators.compose([CustomValidators.email])
      ],
      phone: [
        null,
        Validators.compose([
          Validators.required,
          CustomValidators.min(1000000000),
          CustomValidators.max(1000000000000),
          CustomValidators.number
        ])
      ],
      password: this.password1,
      confirmPassword: this.confirmPassword2,
      member: ['100']
    });

    this.serviceObject.getData('user/get_group_list/').subscribe(
      (data) => {

        // const result = data.json();
        if (data['status'] == 1) {

          this.lstGroup = data['data']
          // console.log('sdfsdf',this.lstGroup);


        }

      },

    );

    // dropdown for company start  

    this.serviceObject.getData('user/get_company_list/').subscribe(
      (data) => {
        // const result = data.json();
        if (data['status'] == 1) {

          this.lst_company = data['data']
          // swal.fire( 'Success', data['status'], 'success');


          // this.router.navigate(['crm/userlist']);
        } else {
          // swal.fire( 'Error', result['status'], 'error')
        }

      },
      // (error) => {  swal( 'Error', error , 'error'); }
    );

    //  company drpdown end 

    this.serviceObject.getData('user/get_brand_list/').subscribe(
      (data) => {

        // const result = data.json();
        if (data['status'] == 1) {

          this.lstBrand = data['data']
          // swal( 'Success', result['status'], 'success');


          // this.router.navigate(['crm/userlist']);
        } else {
          // swal( 'Error', result['status'], 'error')
        }

      },
      // (error) => {  swal( 'Error', error , 'error'); }
    );

    this.searchBranch.valueChanges
      .pipe(debounceTime(400))
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
        } else {
          if (strData.length > 3) {
            this.lstBranch = [];
            const type = 'branch';
            this.serviceObject
              .putData('user/get_branch_list/', { strData: strData })
              .subscribe(
                (data) => {
                  this.lstBranch = data['data'];
                }
              );
          }
        }
      });

    //branch_list
    this.funcGetUserData(this.userid);
    this.getBranchListNew();
    this.getItemGroupListNew();
    this.getProductListNew();




  }



  funcGetUserData(id) {
    this.editingUserId = id;



    // this.serviceObject.getData("user/get_user_list/?id=" + id)
    //   .subscribe(
    //     (response) => {
    //       // this.reportingToList = response;
    //       this.lstReportingto = response['data'];
    //       this.lstBranchId = response['lst_userdetailsview'][0]["lstBranchId"]

    //       this.lstItemGroupId = response['lst_userdetailsview'][0]["lstItemGroupId"]
    //       this.lstProductId = response['lst_userdetailsview'][0]["lstProductId"]
    //       console.log(this.lstBranchId, 'lstBranchId');



    //       // console.log(this.newUserView, "looot");
    //       // console.log(response['lst_userdetailsview'], "loooot 2");


    //       // console.log("gooooo", this.newUserView);

    //     },
    //     (error) => {
    //     }
    //   );



    this.serviceObject
      .getData("user/get_user_list/?id=" + id)
      .subscribe(
        data => {
          // this.newUserView = data['lst_userdetailsview'];
          this.userdetails = data['lst_userdetailsview'];
          // this.strFilter = result.filter;
          this.lstReportingto = data['data'];
          this.lstBranchId = data['lst_userdetailsview'][0]["lstBranchId"]
          if ((this.lstBranchId.length > 0) || (this.lstBranchId != null)) {
            this.lstIds = this.lstBranchId
          }
          this.lstItemGroupId = data['lst_userdetailsview'][0]["lstItemGroupId"]
          if ((this.lstItemGroupId.length > 0) || (this.lstItemGroupId != null)) {
            this.itemGroupDropDown = this.lstItemGroupId
          }
          this.lstProductId = data['lst_userdetailsview'][0]["lstProductId"]
          if ((this.lstProductId.length > 0) || (this.lstProductId != null)) {
            this.ProductDropDown = this.lstProductId
          }
          let temp_branch_type = data['lst_userdetailsview'][0]["jsn_branch_type"]
          if (temp_branch_type.length>0){
             this.blnSalesCounter = true; 
          }
          this.branchTypeOptions.forEach(element => {
            if(temp_branch_type.includes(element["id"])){
              this.lstBranchType.push(element)
            }
          });
          console.log("branch_type_ngmodel : ",this.lstBranchType);
          
          this.SelectedImage = this.serviceObject.hostAddress + 'static/' + this.userdetails[0]['vchr_profile_pic']
          this.ImageSrc = this.serviceObject.hostAddress + 'static/' + this.userdetails[0]['vchr_profile_pic']
          this.Code = this.userdetails[0].username;
          this.strFirstname = this.userdetails[0].first_name;
          this.lastname = this.userdetails[0].last_name;
          this.email = this.userdetails[0].email;
          this.contactno = this.userdetails[0].bint_phone;
          this.strGroupSelected = this.userdetails[0].fk_group_id;
          this.strSelectedBranch = this.userdetails[0].fk_branch__vchr_name;
          this.departmentSelected = this.userdetails[0].fk_department;
          this.intCompanyId = this.userdetails[0].fk_company_id;
          this.branchId = this.userdetails[0].fk_branch_id;
          this.strBranch = this.userdetails[0].fk_branch__vchr_name;
          this.dataLoaded = true;
          
          this.lstPrice= data['lst_price_per']
          // if (this.departmentSelected) {

          //   this.lstGroup = this.groups.filter(dep=>dep.department === this.departmentSelected);
          // }else{
          //   this.lstGroup = this.groups;
          // }

          if (this.strFilter === 'COUNTRY') {
            this.strCountryName = this.userdetails[0].vchr_country_name;
            this.strCountryCode = this.userdetails[0].vchr_country_code;
            this.intAreaSelected = this.userdetails[0].pk_bint_id;
            this.strSelectedCountry = this.userdetails[0].vchr_country_name;
            this.countryStatus = true;
          } else if (this.strFilter === 'STATE') {
            this.lstState = this.userdetails['groups_list'];
            this.intAreaSelected = this.userdetails[0]['int_area_id'];
            this.strGroupName = this.userdetails[0].fk_group__vchr_name;
          }
          else if (this.strFilter === 'TERRITORY') {
            this.lstTerritory = this.userdetails['groups_list'];
            this.intAreaSelected = this.userdetails[0]['int_area_id'];
            this.strGroupName = this.userdetails[0].fk_group__vchr_name;
          }
          else if (this.strFilter === 'ZONE') {
            this.lstZone = this.userdetails['groups_list'];
            this.intAreaSelected = this.userdetails[0]['int_area_id'];
            this.strGroupName = this.userdetails[0].fk_group__vchr_name;
          } else if (this.userdetails[0].fk_group__vchr_name === 'FINANCIER') {
            this.finance = this.userdetails[0].fk_financier;
            this.strBranchSelected = this.userdetails[0].fk_branch;
            this.strSelectedBranch = this.userdetails[0].fk_branch__vchr_name;
            this.strBranchName = this.userdetails[0].fk_branch__vchr_name;
            this.branchStatus = true;
            this.strGroupName = this.userdetails[0].fk_group__vchr_name;
          }
          else {
            this.strBranchSelected = this.userdetails[0].fk_branch;
            this.strSelectedBranch = this.userdetails[0].fk_branch__vchr_name;
            this.strBranchName = this.userdetails[0].fk_branch__vchr_name;
            this.branchStatus = true;
            this.strGroupName = this.userdetails[0].fk_group__vchr_name;
          }
          let datas = {};
          datas['name'] = this.strBranchName;
          datas['id'] = this.strBranchSelected;
          datas['code'] = 0;
          this.lstBranch.push(datas);


          this.intCompanyId = this.userdetails[0]['fk_company']

          if (this.userdetails[0]['fk_brand__vchr_name']) {
            this.blnPromoter = true;
            this.selectedBrand = this.userdetails[0]['fk_brand__vchr_name'];
            this.brandId = this.userdetails[0]['fk_brand_id'];
            this.brandName = this.userdetails[0]['fk_brand__vchr_name'];
          }
          

          // for (const data of this.userdetails['reportingtolist']) {
          //   this.lstReportingtoSelected.push(data.fk_int_reporting_to);
          // }
          // for (const data of this.userdetails['departmentlist']) {
          //   this.lstDepartmentSelected.push(data.fk_department_id);
          // }


console.log(this.lstPrice,"prc");

          this.dataLoaded = true;
        },
        error => {
        }
      );

  }


  populateFields() {
    const intSelectedIndex = this.lst_company.findIndex(
      elem => elem.companyname === this.strSelectedCompany
    );
    if (intSelectedIndex > -1) {
      this.strCompanyName = this.lst_company[intSelectedIndex].companyname;
      // this.strCompanyCode = this.lst_company[intSelectedIndex].code;
      this.intCompanyId = this.lst_company[intSelectedIndex].id;
      // this.getBranchList();
      // this.getDepartmentList();
      // this.getGroupList();
      this.status = true;
    } else {
      this.status = false;
      this.lst_company = [];
    }
    // this.intCompanyId =item.id;
    // this.strCompanyName = item.companyname;
    console.log('a', this.intCompanyId);
  }
  //new branch list
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
        // this.lstIds = ['100', '104']
        // console.log(this.lstBranchId, 'lstBranchId');

        // if ((this.lstBranchId.length > 0) || (this.lstBranchId != null)) {
        //   this.lstIds = this.lstBranchId
        // }
        console.log("ppppooppp", this.lstIds);


      },
    );

  }
  getItemGroupListNew() {

    let dictSamp = {}

    this.serviceObject.postData('itemgroup/listitemgroup/', dictSamp).subscribe(
      (data) => {

        if (data['status'] == 1) {

          this.itemGroupOptions = data['lst_item_group'];
        }


        console.log("ppppooppp", this.itemGroupDropDown);

      },
    );

  }


  getProductListNew() {


    this.serviceObject.getData('products/add_product/').subscribe(
      (data) => {

        // const result = data.json();
        if (data['status'] == 1) {
          // console.log("pppuuuuu", data);

          this.ProductOptions = data['data'];
          // console.log(this.ProductOptions);

        }
        console.log("lllllll", this.newUserView);
        console.log("type", typeof (this.lstProductId));


        // if ((this.lstProductId.length > 0) || (this.lstProductId != null)) {
        //   this.ProductDropDown = this.lstProductId
        // }
        console.log("ppppooppp", this.ProductDropDown);

      },
    );

  }
  // selection change function for branch type multi dropdown
  branchTypeChanged(item){
    if (this.lstBranchType.length > 0){
      this.blnSalesCounter = true;
    }
    else{
      this.blnSalesCounter = false;
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
        //   if (this.ImageLocation['size'] >= 25600 && this.ImageLocation['size'] <= 307200){
        //   this.ImageSrc = img_up.src;
        // } else {
        //   this.eventImg.nativeElement.value = null;
        //   this.ImageSrc = '';
        //   swal('Error', 'Image size between 30KB and 300KB', 'error');
        // }
      };
      img_up.src = window.URL.createObjectURL(this.ImageSrc);
      return status;
    }
  }

  onImageClick() {
    this.eventImg.nativeElement.click();


  }
  canceledit() {
    localStorage.setItem('previousUrl', 'user/listuser');

    this.router.navigate(['user/listuser']);
  }
  updateUserData() {

    console.log( this.priceOptions,this.lstPrice,"price");
    
    // console.log(priceValue,"priceValue");
    

    let validationSuccess = true;
    let errorPlace = ''
    if (!(this.ImageLocation || this.SelectedImage)) {
      validationSuccess = false;
      errorPlace = 'Fill image correctly'
    }
    if (this.ImageLocation['size'] > 102400) {
      validationSuccess = false;
      errorPlace = 'Maximum image size 100KB'
    }



    if (this.contactno == null) {
      validationSuccess = false;
      errorPlace = 'Fill contact number correctly'
    } else if (
      this.contactno.toString().length < 10 ||
      this.contactno.toString().length > 12
    ) {
      validationSuccess = false;
      errorPlace = 'contact number length between 10 and 12 digit'
    }

    if (this.email !== undefined && this.email !== null && this.email.trim() !== '') {
      const eatpos = this.email.indexOf('@');
      const edotpos = this.email.lastIndexOf('.');
      if (eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.email.length) {
        validationSuccess = false;
        errorPlace = 'Email format not correct'
      }
    }
    if (this.lastname.trim().length <= 0) {
      validationSuccess = false;
      errorPlace = 'Fill last name correctly'
    } else if (!/^[a-zA-Z\s ]*$/g.test(this.lastname)) {
      validationSuccess = false;
      errorPlace = 'Last name allow only alphabets and white space'
    }
    if (this.strFirstname == '' || this.strFirstname.trim() === '') {
      validationSuccess = false;
      errorPlace = 'Fill first name correctly'
    } else if (!/^[a-zA-Z\s ]*$/g.test(this.strFirstname)) {
      validationSuccess = false;
      errorPlace = 'First name allow only alphabets and white space'
    }
    if (this.strGroupName == 'FINANCIER') {
      if (!this.finance) {
        validationSuccess = false;
        errorPlace = 'Select a Financier'
      }
    }
    if (this.blnPromoter) {
      if (this.brandName !== undefined && this.brandName !== '' && this.selectedBrand !== this.brandName || this.brandId == 0) {
        validationSuccess = false;
        errorPlace = 'Select valid brand'
      }
    }
    if (this.strSelectedBranch != this.strBranch || this.strSelectedBranch == '' || this.strSelectedBranch == null) {
      validationSuccess = false;
      errorPlace = 'Select branch'
    }

    if (!validationSuccess) {
      if (!this.blnPromoter) {
        this.brandId = 0;
      }


      swal.fire('Error', errorPlace, 'error');
      // }
    } else {
      

      if(this.strSelectedBranch == null || this.strSelectedBranch == ''){


        validationSuccess = false;
        errorPlace ='Select branch'
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
            this.saveData();
          }
        })
        
      }

      else{
        this.saveData();
      }
    }
  }

  saveData(){
    let priceValue= {'bln_mop':false,'bln_mrp':false,'bln_dp':false,'bln_cost_price':false}

    this.priceOptions.forEach(element => {
      if(this.lstPrice.includes(element) && element=='MRP'){
        priceValue['bln_mrp']=true 
      }
      if(this.lstPrice.includes(element) && element=='MOP'){
        priceValue['bln_mop']=true 
      }
      if(this.lstPrice.includes(element) && element=='DEALER PRICE'){
        priceValue['bln_dp']=true 
      }
      if(this.lstPrice.includes(element) && element=='COST PRICE'){
        priceValue['bln_cost_price']=true 
      }
    });
    if (!this.blnPromoter) {
      this.brandId = 0;
    }
    const frmPublishedData = new FormData;
    let lstData = []
    this.lstBranchType.forEach(element => {
      lstData.push(element.id)
    });
    frmPublishedData.append('lstBranchType', lstData.toString());
    if (this.blnPromoter) {
      frmPublishedData.append('brand', this.brandId.toString());
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
 
      frmPublishedData.append('lstProductId', lstData.toString());

    }
    


    frmPublishedData.append('dctPriceList', JSON.stringify(priceValue));
    frmPublishedData.append('vchr_user_code', this.Code.trim());
    frmPublishedData.append('id', this.editingUserId);
    frmPublishedData.append('firstname', this.strFirstname);
    frmPublishedData.append('lastname', this.lastname);
    frmPublishedData.append('email', this.email);
    frmPublishedData.append('contactno', this.contactno);
    frmPublishedData.append('image', this.ImageLocation);
    frmPublishedData.append('branch_id', this.branchId.toString());
    frmPublishedData.append('group_id', this.strGroupSelected.toString());

    frmPublishedData.append('filter', this.strFilter);


    console.log(this.selectedDropDown)
    this.serviceObject.postFormData("user/updateuserdata/", frmPublishedData).subscribe(
      response => {
        const result = response;
        if (result['status'] === 1) {
          swal.fire('Success', result['message'], 'success');
          if (this.editingUserId === localStorage.getItem('userId')) {


            // this.serviceObject.postData("user/get_image/",{ user_id: localStorage.getItem('userId') }).subscribe(
            //   response => {
            //     if (response['status'] === 1) {
            //       // this.dataService.changeUserImage(this.serviceObject.hostAddress + 'static/' + response['data'][0]['vchr_profile_pic']);
            //       // this.dataService.changeUserName(this.strFirstname + ' ' + this.lastname )
            //     }
            //   },
            //   error => {}
            // );
            // this.dataService.changeUserName(this.strFirstname + ' ' + this.lastname )

          }
          localStorage.setItem('previousUrl', 'user/listuser');

          this.router.navigate(['user/listuser']);
        } else {
          swal.fire('Error', result['message'], 'error');
        }
      },
      error => {
        swal.fire('Error', error, 'error');
      }
    );
  }


  updateUserPassword() {
    let validationSuccess = true;

    if (this.password == null) {
      validationSuccess = false;
    } else if (this.password.length < 8) {
      validationSuccess = false;
    } else if (this.password !== this.confirmPassword) {
      validationSuccess = false;
    }
    if (validationSuccess) {
      const pusheditems = {};
      pusheditems['id'] = this.editingUserId;
      pusheditems['password'] = this.password;
      // this.serviceObject.updateUserPassword(pusheditems).subscribe(
      //   res => {
      //     const result = res.json();
      //     if (result['status'] === 'password changed successfully') {
      //       swal('Success', result['status'], 'success');
      //       this.router.navigate(['crm/userlist']);
      //     } else {
      //       swal('Error', result['status'], 'error');
      //     }
      //   },
      //   error => {
      //     swal('Error', error, 'error');
      //   }
      // );

      //edited

      this.serviceObject.postData("user/updateuserpassword/", pusheditems).subscribe(
        res => {
          const result = res;
          if (result['status'] === 1) {
            swal.fire('Success', 'Password updated Successfully', 'success');
            localStorage.setItem('previousUrl', 'user/listuser');

            this.router.navigate(['user/listuser']);
          } else {
            swal.fire('Error', 'error', 'error');
          }
        },
        error => {
          swal.fire('Error', error, 'error');
        }
      );
    } else {
      swal.fire('Error', 'Fill password fields correctly', 'error');
    }
  }

  onChangeBranch(item) {
    this.branchId = item.id;
    this.branchName = item.name;
  }

  BranchChanged(item) {
    console.log('v', item);

    this.branchId = item.id;
    this.strBranch = item.branchname;


  }


  onChangeGroup(obj) {
    console.log('sd', obj);

    this.strGroupSelected = obj;

    if (this.strGroupSelected == null) {
      swal.fire('Error', 'Add group', 'error');
    }
  }

  selectionChanged(item) {

    console.log(item);

    this.lstIds = [...this.lstIds, item];
    console.log(this.lstIds);
  }


}