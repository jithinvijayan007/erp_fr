import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms'
import { CustomValidators } from 'ng2-validation'
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { IfStmt } from '@angular/compiler';
// import { NgxSpinnerService } from 'ngx-spinner';
import { count } from 'rxjs/operators';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})
export class AddemployeeComponent implements OnInit {


  public form: FormGroup;

  strFirstName='';
  strLastName='';
  strMiddleName=''
  strEmail='';
  intPhoneNumber=null;
  datDOB;
  strGender='';
  strMaritalStatus='';
  strBloodGroup='';
  // address
  strAddress='';
  strPostOffice='';
  strLandMark='';
  strPlace='';
  strDistrict='';
  intDistrictId=null;
  strState='';
  intStateId=null;
  strCountry='';
  intCountryId=null
  lstDistrictData=[];
  lstStateData=[];
  lstCountryData=[];
  intPinCode=null;
  // address.............
  strEmpCode='';
  strUserName='';
  strPassword1 = new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)]));
  strConfirmPassword1 = new FormControl('', CustomValidators.equalTo(this.strPassword1));
  lstCategory=[];
  strCategoryName='';
  intCategoryId=null;
  selectedCategory='';
  selectedCategoryId=null;
  strBranchName='';
  intBranchId=null;
  selectedBranch='';
  selectedBranchId=null;
  strDepartmentName='';
  intDepartmentId=null;
  selectedDepartment='';
  selectedDepartmentId=null;
  strGroupName='';
  // intGroupId=null;
  selectedGroup='';
  selectedGroupId=null;
  lstBranches=[];
  lstDepartment=[];
  lstGroup=[];
  datOBirth;
  datOJoin;
  strGrade='';
  strLevelOfGrade='';
  lstGrades=['D1','D3','E1','E2','E3','H2','H3','M1','M2','M3','M4','S1','S2','S3'];
  lstSalaryStructure=[];
  intSalaryStructure;
  strSalaryStructName='';
  intCostToCompany=null;
  intNetSalary=null;
  strDesignation='';
  searchBranch: FormControl = new FormControl();
  searchGroup: FormControl = new FormControl();
  dctAllowance={
    "bln_esi":true,
    "bln_pf":true,
    "bln_gratuity":true,
    "bln_wwf":true,
    "bln_tds":true
  }
  fltGrossPay = 0;
  fltCharity = 0;
  fltCTC = 0;
  fltTds = 0;
  dctSalarySplit={};
  strShiftType='0';
  strFixedShift;
  lstShiftData=[];
  selectedFixedShift='';
  selectedFixedShiftId=null;
  lstVariableShift=[];
  lstShift=[];
  datBirthStart;

  intPaymentMode=null;
  strBankName='';
  intAccountNum;
  strIfscCode='';
  intAadharNo;
  intPanNo;
  ImageSrc = '';
  ImageLocation = '';
  lstDesignationData;
  intSelectedDesignation;
  blnShowBankDetails=false;
  strFatherName;
  intEmPhNo;

  lstBrandData=[];
  lstProductData=[];
  intSelectedBrandId;
  intSelectedProductId;
  strPhysicalLocation='';
  imgPath=''

  intSelectedCompanyId=null;
  lstCompanyData=[];
  strLoginUser='';
  strCategoryCode='';
  intYear;

  intWeekOffType;
  lstLocationData=[];
  lstGroupData=[];
  lst
  lstSelectedLocation;
  intEsiNumber=null;
  intUANNumber=null;
  intWWFNumber=null;

  blnFixed = false;
  strDay = '';
  lstDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  functionConfig = {displayKey:"vchr_name",search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Select Function',searchOnKey: 'vchr_name',clearOnSelection: true  }
  lstFunction = []
  lstSalutationData = ['Mr','Ms','Mrs'];
  strSalutation='';

  strReligion = '';
  intReligionId = null;
  strSelectedReligion = '';
  lstReligionData = [];

  strEmPerson = '';
  strEmerRelattion = '';
  lstLevelData
  intNewEmpId;
  intNewEmpJobId;
  blnNewEmp = false;
  int_Level;
  intWPSGroupId =null;
  lstWPSGroupData=[]
  lstReference=[
    {
      'strRefName':'',
      'strCompName':'',
      'strRefDesig':'',
      'intRefPhone':null,
      'strRefEmail':''
    },
    {
      'strRefName':'',
      'strCompName':'',
      'strRefDesig':'',
      'intRefPhone':null,
      'strRefEmail':''
    }
  ];
  strIllnessDetails='';

  intOfficialNumber=null;
  lstFamilyDetails=[{
    strRelation:'',
    strRelativeName:'',
    strOccupation:'' ,
    isAlive:'',
    relativeDOB:null
  }]
  lstDeletedFamily=[];
  lstEduDetails = [
    {
      'blnHighest' : false,
      'strQualif' : '',
      'strCourse' : '',
      'strInstituion' : '',
      'strPlace' : '',
      'intCourseType' : null,
      'intYear' : null,
      'fltPercentage' : null,
    }
  ]
  intHighestQualif=0;
  lstDeletedEductn=[];
  lstQualifData=[
    { "value":"SSLC","name":"SSLC"},
    { "value":"HSE","name":"HSE (PLUS TWO)"},
    { "value":"Diploma","name":"Diploma"},
    { "value":"Bachelor's/Graduation","name":"Bachelor's/Graduation"},
    { "value":"Masters/Post-Graduation","name":"Masters/Post-Graduation"},
    { "value":"Others","name":"Others"}
    ]
    lstCourse=[
      "B.A",
      "B.Com",
      "B.Ed",
      "B.LiSc",
      "B.P.Ed",
      "B.Sc",
      "B.Tech",
      "B.Voc.",
      "BBA",
      "BCA",
      "BBM",
      "BHM",
      "BSW",
      "M.A",
      "M.Com",
      "M.Ed.",
      "M.Phil.",
      "M.Sc.",
      "MBA",
      "MCA",
      "MSW",
      "Other"
    ];
    lstAllCourse=[
      "B.A",
      "B.Com",
      "B.Ed",
      "B.LiSc",
      "B.P.Ed",
      "B.Sc",
      "B.Tech",
      "B.Voc.",
      "BBA",
      "BCA",
      "BBM",
      "BHM",
      "BSW",
      "M.A",
      "M.Com",
      "M.Ed.",
      "M.Phil.",
      "M.Sc.",
      "MBA",
      "MCA",
      "MSW",
      "Other"
    ];
    lstUG=[
      "B.A",
      "B.Com",
      "B.Ed",
      "B.LiSc",
      "B.P.Ed",
      "B.Sc",
      "B.Tech",
      "B.Voc.",
      "BBA",
      "BCA",
      "BBM",
      "BHM",
      "Other"
  
    ]
    lstPG=[
      "M.A",
      "M.Com",
      "M.Ed.",
      "M.Phil.",
      "M.Sc.",
      "MBA",
      "MCA",
      "MSW",
      "Other"
    ]
    lstPassoutYear=[];
    lstExpDetails = [{
      'strEmployer':'',
      'strDesig':'',
      'vchrExpDetails':''
    },
    // {
    //   'blnCurJob':false,
    //   'strEmployer':'',
    //   'strDesig':'',
    //   'fltCtc':null,
    //   'vchrExpDetails':'',
    //   'vchrRelevantExp':'',
    //   'vchrReason':'',
    //   'rolesandRespon':'',
    //   'references':'',
    //   'datFrom':null,
    //   'datTo':null,
    // }
    ]
    lstDeletedExp=[];
    totalExp='0';
    totalRelevantExp='0';
    strEmpRemarks="";

    blnShowCTCBreakup=false;
    dctRules={};

    


  constructor(
    private formBuilder: FormBuilder,
    private serverService: ServerService,
    vcr: ViewContainerRef,
    public router: Router,
    // private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {

    this.datBirthStart = new Date(1990, 0, 1);
    this.strLoginUser=localStorage.getItem("Name");
    // console.log("strLoginUser",this.strLoginUser);

    let strDepartment = localStorage.getItem('strDepartment');
    let Name =localStorage.getItem('Name')
    if (strDepartment == 'HR & ADMIN' ||  Name=='Super User'){
      this.blnShowCTCBreakup =true;
    }
    

    this.form = this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required])],
      middleName: [null],
      lastName: [null, Validators.compose([Validators.required])],
      empCode : [null, Validators.compose([Validators.required])],
      userName : [null, Validators.compose([Validators.required])],
      password1:this.strPassword1,
      confirmPassword1: this.strConfirmPassword1,
      branchName : [null, Validators.compose([Validators.required])],
      departmentName : [null, Validators.compose([Validators.required])],
      groupName : [null, Validators.compose([Validators.required])],

      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      phoneNumber: [null, Validators.compose([Validators.required])],
      dob: [null, Validators.compose([Validators.required])],
      empGender: [null, Validators.compose([Validators.required])],
      maritalStatus: [null, Validators.compose([Validators.required])],
      emergencyPhone: [null, Validators.compose([Validators.required])],
      bloodGroup : [null, Validators.compose([Validators.required])],
      pinCode : [null, Validators.compose([Validators.required])],
      districtName : [null, Validators.compose([Validators.required])],
      stateName : [null, Validators.compose([Validators.required])],

      empAddress : [null, Validators.compose([Validators.required])],
      empPostoffice : [null, Validators.compose([Validators.required])],
      empLandMark : [null, Validators.compose([Validators.required])],
      empPlace : [null, Validators.compose([Validators.required])],
      empDistrict : [null, Validators.compose([Validators.required])],
      empState : [null, Validators.compose([Validators.required])],
      empCountry : [null, Validators.compose([Validators.required])],
      empPincode :[null,Validators.compose([Validators.required])],

      doj: [null, Validators.compose([Validators.required])],
      levelOfGrade: [null, Validators.compose([Validators.required])],
      grade: [null, Validators.compose([Validators.required])],
      salaryStructure: [null, Validators.compose([Validators.required])],
      designationName: [null, Validators.compose([Validators.required])],
      allowances: [null],
      bankName:[null,Validators.compose([Validators.required])],
      accNo:[null,Validators.compose([Validators.required])],
      ifscCode:[null,Validators.compose([Validators.required])],
      aadharNo:[null,Validators.compose([Validators.required])],
      panNo:[null],
      fatherName:[null],
      emerPhNo:[null],
      productName:[null,Validators.compose([Validators.required])],
      brandName:[null,Validators.compose([Validators.required])],
      physicalLocation:[null,Validators.compose([Validators.required])],
      companyName:[null,Validators.compose([Validators.required])],
      salutationName:[null,Validators.compose([Validators.required])],
      religion:[null,Validators.compose([Validators.required])],
      emerPerson:[null,Validators.compose([Validators.required])],
      emerRelation:[null,Validators.compose([Validators.required])],
      WPSGroup:[null],
      illnessDetails:[null],
      officialNumber:[null],
      empRemarks:[null],
      


    });


    //--------------------category list dropdown-------------------//
    this.serverService.getData('category/list_category/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstCategory=response['lst_articles'];
          }  
      },
      (error) => {           
      });
    //--------------------category list dropdown ends-------------------//

     //--------------------religion list dropdown-------------------//
     this.serverService.getData('user/religion_list/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstReligionData=response['data'];
          }  
      },
      (error) => {           
      });
    //--------------------religion list dropdown ends-------------------//

    //--------------------department list dropdown ----------------//
    this.serverService.getData('department/list_departments/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstDepartment=response['lst_department'];
          }  
      },
      (error) => {   
        
      });
    //--------------------department list dropdown ends ----------------//

    //--------------------branch list typeahead -------------------//
    this.searchBranch.valueChanges
      // .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstBranches = [];
        } else {
          if (strData.length >= 1) {
            this.serverService
              .postData('branch/branch_typeahead/', { term: strData })
              .subscribe(
                (response) => {
                  this.lstBranches = response['data'];

                }
              );
          }
        }
      }
      ); 
    //--------------------branch list typeahead ends -------------------//

    //--------------------group list typeahead-------------------//
    this.searchGroup.valueChanges
      // .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstGroup = [];
        } else {
          if (strData.length >= 1) {
            this.serverService
              .postData('groups/groups_typeahead/', { term: strData })
              .subscribe(
                (response) => {
                  this.lstGroup = response['data'];

                }
              );
          }
        }
      }
      ); 
    //--------------------group typeahead ends-------------------//

    //-------------------salary structure dropdown --------------//
    this.serverService.getData('salary_struct/list/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstSalaryStructure=response['lst_salary_struct'];
          }  
        },
        (error) => {   
      });
    //-------------------salary structure dropdown -------------//

    //-------------------shift dropdown-------------------------//
    this.serverService.getData('shift_schedule/list_shift/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstShiftData=response['lst_shift_shedule'];
          }  
        },
        (error) => {   
      });
    //-------------------shift dropdown ends-------------------------//
    //-------------------designation dropdown-------------------------//
    this.serverService.getData('job_position/add_job/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstDesignationData=response['lst_job_position'];
          }  
        },
        (error) => {   
      });
    //-------------------designation dropdown ends-------------------------//

    //-------------------Brand dropdown-------------------------//
        this.serverService.getData('brands/add_brands/').subscribe(
          (response) => {
              if (response.status == 1) {
                this.lstBrandData=response['data'];
              }  
            },
            (error) => {   
          });
    //-------------------designation dropdown ends-------------------------//
        //-------------------Product dropdown-------------------------//
        this.serverService.getData('products/add_product/').subscribe(
          (response) => {
              if (response.status == 1) {
                this.lstProductData=response['data'];
              }  
            },
            (error) => {   
          });
    //-------------------designation dropdown ends-------------------------//

    //-------------------Company dropdown-------------------------//
        this.serverService.getData('company/company_typeahead/').subscribe(
          (response) => {
              if (response.status == 1) {
                this.lstCompanyData=response['data'];
              }  
            },
            (error) => {   
          });
    //-------------------Company dropdown ends-------------------------//
        //-------------------Levels dropdown-------------------------//
        this.serverService.getData('hierarchy/levels/').subscribe(
          (response) => {
              if (response.status == 1) {
                this.lstLevelData=response['data'];
              }  
            },
            (error) => {   
          });
    //-------------------Physical Location dropdown ends-------------------------//

    //-------------------Country dropdown-------------------------//
    this.serverService.getData('location/country_list/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstCountryData=response['lst_country'];
          }  
        },
        (error) => {   
      });
    //-------------------Country dropdown ends-------------------------//
    //-------------------WPSGroup dropdown-------------------------//
    this.serverService.getData('salary_process/wps_group/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstWPSGroupData=response['lstData'];
          }  
        },
        (error) => {   
      });
    //-------------------WPSGroup dropdown ends-------------------------//

    let toDate = new Date();
    let year=toDate.getFullYear();
    for (let yr = 0; yr < 30; yr++) {
      this.lstPassoutYear.push(year);
      year=year-1
    }

// ---- AddEmployee from applicant list

this.intNewEmpId = localStorage.getItem('intNewEmpId');
this.intNewEmpJobId = localStorage.getItem('intNewEmpJobId');
localStorage.removeItem('intNewEmpId');
localStorage.removeItem('intNewEmpJobId');
    if (this.intNewEmpId && this.intNewEmpJobId){
      this.getEnteredDetails();
    }
//  ---- AddEmployee from applicant list ends


 }

 countryChanged(intCountryId) {  // state dropdown list
  
  // this.lstStateData=[];
  // this.lstDistrictData=[];
  // this.intStateId=null;
  // this.intDistrictId=null;
  if(this.intCountryId){
    this.serverService.postData('location/state_list/',{'intCountryId':intCountryId}).subscribe(
      (response) => {
          if (response.status == 1) {
            console.log(response);
            
            this.lstStateData=response['lst_state'];
          }  
        },
        (error) => {   
      });
  }

 }

 stateChanged(intStateId) { // district dropdown
  // this.lstDistrictData=[];
  // this.intDistrictId=null;
  
  if(this.intStateId) {
    this.serverService.postData('location/district_list/',{'intStateId':intStateId}).subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstDistrictData=response['lst_district'];
          }  
        },
        (error) => {   
      });
  }


 }

 categoryChanged(item){

      this.selectedCategory=item.vchr_name;
      this.selectedCategoryId=item.pk_bint_id;
      this.strCategoryCode=item.vchr_code;


    
    
  }
  fixedShiftChanged(item){
    this.selectedFixedShift=item.vchr_name;
    this.selectedFixedShiftId=item.pk_bint_id;
  }


  variableShiftChanged(event)
  {
    this. lstVariableShift=[]
     for(let item of event)
     {
       this.lstShiftData.forEach(element => {
         if((element.vchr_name==item) ) {
           if(this.lstVariableShift.includes(item)){
           }
           else{
            this.lstVariableShift.push(element.pk_bint_id)
           }
         }
       });
     }

     
     
  
  }
  levelChanged(event){
    let level_type = ""
    this.lstLevelData.forEach(element => {
      if(element.pk_bint_id == this.int_Level){
        level_type = element.vchr_name
      }
    });
  
    this.serverService.getData('hierarchy/hierarchy?hierarchy_name='+level_type).subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstLocationData=response['data'];
          }  
        },
        (error) => {   
      });
      let dict_level = {
        hierarchy_name:level_type,
        dep_id:this.intDepartmentId
      }
      this.serverService.postData('hierarchy/groups/',dict_level).subscribe(
        (response) => {
            if (response.status == 1) {
              this.lstGroupData=response['data'];
            }  
          },
          (error) => {   
        });
    
  }
  branchChanged(item){
    
    this.selectedBranch=item.name;
    this.selectedBranchId=item.id;

  }
  branchChange(){
    if(this.selectedBranch!=this.strBranchName){
      this.selectedBranch='';
      this.selectedBranchId=null;
    }
  }
  saveData(){
    if (this.lstFunction){
      var lstSelectedFunction
      lstSelectedFunction = this.lstFunction.map(x => x.pk_bint_id)
    }
console.log(this.lstFunction);

    let dctTempData={}
    // console.log("aadharnumber",this.intAadharNo.length);
    // console.log("intPanNo",this.intPanNo.length);
    console.log("formcontorl",this.form);
    console.log("official contactnumber",this.intOfficialNumber);
    console.log("lstFamilyDetails0",this.lstFamilyDetails);
    console.log("this.lstEduDetails",this.lstEduDetails);
    console.log("lstExpDetails",this.lstExpDetails);
    
    
      if(this.strSalutation == ''){
      Swal.fire('Error!', 'Salutation required ', 'error');
      return false
    }
      

    if ( this.strFirstName == null || this.strFirstName.trim() === '') {
      Swal.fire('Error!', 'Enter First Name', 'error');
      return false
    }
     else if ( !/^[a-zA-Z\s ]*$/g.test(this.strFirstName)) {
      Swal.fire('Error!', 'First name allow only alphabets and white space', 'error');
      return false
    }
    else if(this.strLastName == null || this.strLastName.trim() === ''){
      Swal.fire('Error!', 'Enter Last Name', 'error');
      return false
    }
    else if ( !/^[a-zA-Z\s ]*$/g.test(this.strLastName)) {
      Swal.fire('Error!', 'Last name allow only alphabets and white space', 'error');
      return false
    }
    else if(!this.intCategoryId){
      Swal.fire('Error!', 'Select Employee Category', 'error');
      return false
    }
    // else if ( this.strUserName == null || this.strUserName.trim() === '') {
    //   Swal.fire('Error!', 'Enter User Name', 'error');
    //   return false
    // }
    else if (!this.strPassword1) {
      Swal.fire('Error!', 'Enter password', 'error');
      return false
    } 
     else if (this.strPassword1 !== this.strConfirmPassword1) {
      Swal.fire('Error!', 'Confirm password mismatch', 'error');
      return false
    }
    if(this.strLoginUser=='Super User' && (this.intSelectedCompanyId==null || this.intSelectedCompanyId==undefined)){
      Swal.fire('Error!', 'Select Company', 'error');
      return false
    }
    else if (!this.strBranchName) {
      Swal.fire('Error!', 'Enter Branch', 'error');
      return false
    }
    else if(this.strBranchName!= this.selectedBranch){
      Swal.fire('Error!', 'Enter branch correctly', 'error');
      return false
    }
    else if(!this.intDepartmentId){
      Swal.fire('Error!', 'Select Department', 'error');
      return false
    }
    else if(!this.intSelectedDesignation){
      Swal.fire('Error!', 'Select Employee Designation', 'error');
      return false;
    }
    else if(!this.datOJoin){      
      Swal.fire('Error!', 'Select Date of join', 'error');
      return false
    }

    else if(!this.strLevelOfGrade){
      Swal.fire('Error!', 'Select Level of grade', 'error');
      return false;
    }
    else if(!this.strGrade){
      Swal.fire('Error!', 'Select Grade', 'error');
      return false;
    }
    else if((this.intSalaryStructure==undefined || this.intSalaryStructure==null || this.intSalaryStructure=='') && (this.selectedCategory.toUpperCase()=='EMPLOYEE')){
      Swal.fire('Error!', 'Select Salary structure', 'error');
      return false;
    }
    else if(this.lstSelectedLocation == null){
      Swal.fire('Error!', 'Select Physical Location', 'error');
      return false;
    }




    // else if(!this.strGroupName){
    //   Swal.fire('Error!', 'Enter group', 'error');
    //   return false
    // }
    // else if(this.strGroupName!=this.selectedGroup){
    //   Swal.fire('Error!', 'Enter valid group', 'error');
    //   return false
    // }
    else if(!this.datOBirth
      ){
      Swal.fire('Error!', 'Select Date of Birth', 'error');
      return false
    }
    else if(!this.strGender){
      Swal.fire('Error!', 'Select gender', 'error');
      return false
    }
    else if(this.strReligion == ''){
      Swal.fire('Error!', 'Select religion', 'error');
      return false
    }
    else if(this.strMaritalStatus == ''){
      Swal.fire('Error!', 'Select Marital Status', 'error');
      return false
    }
    else if (this.intPhoneNumber == null) {
      Swal.fire('Error!', 'Enter Contact Number', 'error');
      return false;
    } else if ( (this.intPhoneNumber).toString().length < 10 || (this.intPhoneNumber).toString().length > 12) {
      Swal.fire('Error!', 'Contact number length between 10 and 12 digit', 'error');
      return false;
    }
    else if(!this.strEmail){
      Swal.fire('Error!', 'Enter email', 'error');
      return false
    }
    else if (this.strEmail !== undefined && this.strEmail !== null && this.strEmail.trim() !== '') {      
      const eatpos = this.strEmail.indexOf('@');
      const edotpos = this.strEmail.lastIndexOf('.');
      if ( eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.strEmail.length) {
        Swal.fire('Error!', 'Email format not correct', 'error');
        return false
      }
    }

    // if(this.strDesignation=='' || this.strDesignation== undefined || this.strDesignation==null){
    //   Swal.fire('Error!', 'Enter Designation', 'error');
    //   return false;
    // }


    if(!this.intAadharNo){
      Swal.fire('Error!', 'Enter Aadhaar Number', 'error');
      return false;
    }
    else if(!this.strGrade){
      Swal.fire('Error!', 'Select grade', 'error');
      return false;
    }
    else if(!this.intPanNo){
      Swal.fire('Error!', 'Enter PAN', 'error');
      return false;
    }
    else if(!this.strFatherName){
      Swal.fire('Error!', "Enter Father's Name", 'error');
      return false;
    }
    else if(this.strEmPerson == ''){
      Swal.fire('Error!', " Enter Emergency Contact Person", 'error');
      return false;
    }
    else if(this.strEmerRelattion == ''){
      Swal.fire('Error!', " Select Relation with employee", 'error');
      return false;
    }
    else if(!this.intEmPhNo){
      Swal.fire('Error!', 'Enter Emergency Contact No.', 'error');
      return false;
    }
    else if ( (this.intEmPhNo).toString().length < 10 || (this.intEmPhNo).toString().length > 12) {
      Swal.fire('Error!', 'Contact number length between 10 and 12 digit', 'error');
      return false;
    }
    else if(this.strBloodGroup == ''){
      Swal.fire('Error!', 'Select Blood Group ', 'error');
      return false;
    }
    else if(!this.strAddress){
      Swal.fire('Error!', 'Enter Address', 'error');
      return false;
    }
    else if(!this.strPostOffice) {
      Swal.fire("Error!","Enter Post Office","error");
      return false;
    }
    else if(!this.strLandMark) {
      Swal.fire("Error!","Enter Landmark","error");
      return false;
    }
    else if(!this.strPlace) {
      Swal.fire("Error!","Enter Place","error");
      return false;
    }
    else if(!this.intCountryId) {
      Swal.fire("Error!","Select Country","error");
      return false;
    }
    else if(!this.intStateId) {
      Swal.fire("Error!","Enter State","error");
      return false
    }
    else if(!this.intDistrictId) {
      Swal.fire("Error!","Select District","error");
      return false;
    }
    else if(!this.intPinCode){
      Swal.fire("Error!","Enter Pin Code","error");
      return false;
    }

    else if(!this.intPaymentMode){
      Swal.fire('Error!', 'Select Payment Mode', 'error');
      return false;
    }
    else if(this.intPaymentMode=='1' && !this.strBankName){
      Swal.fire('Error!', 'Enter Bank', 'error');
      return false;
    }

    else if(this.intPaymentMode=='1' && !this.intAccountNum){
      Swal.fire('Error!', 'Enter Account Number', 'error');
      return false;
    }
    else if(this.intPaymentMode=='1' && this.intAccountNum.length<4){
      Swal.fire('Error!', 'Enter Valid Account Number', 'error');
      return false;
    }
    else if(this.intPaymentMode=='1' && !this.strIfscCode){
      Swal.fire('Error!', 'Enter IFSC Code', 'error');
      return false;
    }
    // if(this.intYear == null){
    //   Swal.fire('Error!', 'Enter Passing Year', 'error');
    //   return false;
    // }
   
    



    // else if(!this.intSelectedProductId){
    //   Swal.fire('Error!', 'Select Product', 'error');
    //   return false;
    // }
    // else if(!this.intSelectedBrandId){
    //   Swal.fire('Error!', 'Select Brand', 'error');
    //   return false;
    // }
    let highCount=0
    this.lstEduDetails.forEach(element => {
      if(element.blnHighest) {
        highCount=highCount+1;
      }
    });
    if(highCount>1){
      Swal.fire('Error!', 'Select exactly one Highest Education', 'error');
      return false;
    }
    if(this.intOfficialNumber){
      if ( (this.intOfficialNumber).toString().length < 10 || (this.intOfficialNumber).toString().length > 12) {
        Swal.fire('Error!', 'Contact number length between 10 and 12 digit', 'error');
        return false;
      }
    }



    let dctShiftData={}
    if(this.strShiftType=='0'){
      if(!this.selectedFixedShiftId){
        Swal.fire('Error!', 'Select Shift', 'error');
        return false;
      }
      else {
        let lstData=[];
        lstData.push(this.selectedFixedShiftId)
        dctShiftData['lstShift']=lstData;
      }

    }
    else if(this.strShiftType=='1'){
      if(this.lstShift.length==0){
        Swal.fire('Error!', 'Select Shift', 'error');
        return false;
      }
      else{
        dctShiftData['lstShift']=this.lstShift;
      }
    }
     if(!this.intWeekOffType){
      Swal.fire('Error!', 'Select Week Off Type', 'error');
      return false;
    }
    if(this.blnFixed && !this.strDay){
      Swal.fire('Error!', 'Select Week Off Day', 'error');
      return false;
    }

    if(!this.ImageLocation){
      Swal.fire('Error!', 'Add User Image', 'error');
      return false;
    }
     else if ((this.fltGrossPay === 0 || this.fltGrossPay === null || this.fltGrossPay === undefined) && (this.selectedCategory.toUpperCase()=='EMPLOYEE')) {
      Swal.fire('Error!', 'Enter Gross pay', 'error');
      return false;
    }
    if(this.selectedCategory.toUpperCase()== 'EMPLOYEE' && this.strSalaryStructName=='Slab-0'){
      let grossTot=this.dctSalarySplit['BP_DA']+this.dctSalarySplit['HRA']+this.dctSalarySplit['CCA']+this.dctSalarySplit['WA']+this.dctSalarySplit['SA'];
      if(this.fltGrossPay!=grossTot){
        Swal.fire("Error!","Sum of fixed allowances should be equal to gross pay");
        return false;
      }
    }
    if(this.fltCharity){
      this.dctSalarySplit
      
    }

    dctTempData['blnNewEmp'] = this.blnNewEmp;
    dctTempData['intNewEmpId'] = this.intNewEmpId;
    dctTempData['intNewEmpJobId'] = this.intNewEmpJobId;
    dctTempData['strFirstName']=this.strFirstName;
    dctTempData['strLastName']=this.strLastName;
    dctTempData['strMiddleName']=this.strMiddleName;
    dctTempData['intCategoryId']=this.selectedCategoryId;
    dctTempData['strCategoryName']=this.selectedCategory
    // dctTempData['strUserName']=this.strUserName;
    dctTempData['strPassword']=this.strPassword1;
    dctTempData['datDob']=moment(this.datOBirth).format('YYYY-MM-DD')
    dctTempData['datJoin']=moment(this.datOJoin).format('YYYY-MM-DD')
    dctTempData['strGender']=this.strGender;
    // dctTempData['intGroupId']=this.selectedGroupId;
    dctTempData['intDptId']=this.intDepartmentId;
    dctTempData['intBranchId']=this.selectedBranchId;
    dctTempData['intSalaryStructId']=this.intSalaryStructure;
    dctTempData['strLevelofGrade']=this.strLevelOfGrade;
    dctTempData['strGrade']=this.strGrade;
    dctTempData['strEmail']=this.strEmail;
    dctTempData['intPhoneNumber']=this.intPhoneNumber;
    dctTempData['intDesigId']=this.intSelectedDesignation;
    dctTempData['dctAllowances']=this.dctAllowance;
    dctTempData['dblGrossPay']=this.fltGrossPay;
    dctTempData['dblCharity']=this.fltCharity;
    dctTempData['dblTds']=this.fltTds;
    dctTempData['intShiftType']=this.strShiftType;
    dctTempData['jsonShiftId']=dctShiftData;
    dctTempData['intPaymentMode']=this.intPaymentMode;
    dctTempData['strBankName']=this.strBankName;
    dctTempData['intAccountNum']=this.intAccountNum;
    dctTempData['strIfscCode']=this.strIfscCode;
    dctTempData['intPanNo']=this.intPanNo;
    dctTempData['intAadharNo']=this.intAadharNo;
    dctTempData['strFatherName']=this.strFatherName;
    dctTempData['intEmPhNo']=this.intEmPhNo;

    const frmPublishedData = new FormData;

    frmPublishedData.append('blnNewEmp',this.blnNewEmp.toString());
    frmPublishedData.append('intNewEmpId',this.intNewEmpId);
    frmPublishedData.append('intNewEmpJobId',this.intNewEmpJobId);
    frmPublishedData.append('strFirstName',this.strFirstName);
    frmPublishedData.append('strLastName',this.strLastName);
    frmPublishedData.append('intCategoryId',this.selectedCategoryId);
    frmPublishedData.append('strCategoryName',this.selectedCategory);
    frmPublishedData.append('strCategoryCode',this.strCategoryCode);
    // frmPublishedData.append('strUserName',this.strUserName);
    frmPublishedData.append('strPassword',this.strPassword1.toString());
    frmPublishedData.append('datDob',moment(this.datOBirth).format('YYYY-MM-DD'))
    frmPublishedData.append('datJoin',moment(this.datOJoin).format('YYYY-MM-DD'))
    frmPublishedData.append('strGender',this.strGender);
    // frmPublishedData.append('intGroupId',this.selectedGroupId);
    frmPublishedData.append('intDptId',this.intDepartmentId);
    frmPublishedData.append('intBranchId',this.selectedBranchId);
    frmPublishedData.append('strLevelofGrade',this.strLevelOfGrade);
    frmPublishedData.append('strGrade',this.strGrade);
    frmPublishedData.append('strEmail',this.strEmail);
    frmPublishedData.append('strAddress',this.strAddress);
    frmPublishedData.append('strPo',this.strPostOffice);
    frmPublishedData.append('strLandMark',this.strLandMark);
    frmPublishedData.append('strPlace',this.strPlace);
    frmPublishedData.append('intDistId',this.intDistrictId);
    frmPublishedData.append('intStateId',this.intStateId);
    frmPublishedData.append('intCountryId',this.intCountryId);
    frmPublishedData.append('intPincode',this.intPinCode)
    frmPublishedData.append('intPhoneNumber',this.intPhoneNumber);
    frmPublishedData.append('intDesigId',this.intSelectedDesignation);
    frmPublishedData.append('dctAllowances',JSON.stringify(this.dctAllowance));
    frmPublishedData.append('strSalutation',this.strSalutation);
    frmPublishedData.append('intReligionId',this.intReligionId.toString());
    frmPublishedData.append('strMaritalStatus',this.strMaritalStatus);
    frmPublishedData.append('strBloodGroup',this.strBloodGroup);
    frmPublishedData.append('strEmerPerson',this.strEmPerson);
    frmPublishedData.append('strEmerRelation',this.strEmerRelattion);
  

    if(this.selectedCategory.toUpperCase()== 'EMPLOYEE'){
      frmPublishedData.append('dblGrossPay',this.fltGrossPay.toString());
      frmPublishedData.append('intSalaryStructId',this.intSalaryStructure);
      frmPublishedData.append('strSalaryStructName',this.strSalaryStructName)
      if(this.strSalaryStructName=='Slab-0'){
        frmPublishedData.append('dctSalarySplit',JSON.stringify(this.dctSalarySplit))
      }

    }
    frmPublishedData.append('dblCharity',this.fltCharity.toString());
    frmPublishedData.append('dblTds',this.fltTds.toString());
    frmPublishedData.append('intShiftType',this.strShiftType);
    frmPublishedData.append('jsonShiftId',JSON.stringify(dctShiftData));
    frmPublishedData.append('intPaymentMode',this.intPaymentMode);
    frmPublishedData.append('intPanNo',this.intPanNo);
    frmPublishedData.append('intAadharNo',this.intAadharNo);
    frmPublishedData.append('imgSrc',this.ImageSrc);
    frmPublishedData.append('strPhysicalLoc',this.strPhysicalLocation);
    frmPublishedData.append('intWeekOffType',this.intWeekOffType);
    frmPublishedData.append('lstLoc',this.lstSelectedLocation);
    frmPublishedData.append('strFatherName',this.strFatherName);
    frmPublishedData.append('intEmPhNo',this.intEmPhNo);
    frmPublishedData.append('lstReference',JSON.stringify(this.lstReference));

    if(this.intWPSGroupId){
      frmPublishedData.append('intWpsId',this.intWPSGroupId);
    }
    frmPublishedData.append('strIllnessDetails',this.strIllnessDetails)
    
    if(this.intEsiNumber!=undefined && this.intEsiNumber!=null){
      frmPublishedData.append('strEsiNo',this.intEsiNumber);
    }
    if(this.intUANNumber!=undefined && this.intUANNumber!=null){
      frmPublishedData.append('strUanNo',this.intUANNumber);
    }
    if(this.intWWFNumber!=undefined && this.intWWFNumber!=null){
      frmPublishedData.append('strWwfNo',this.intWWFNumber);
    }
    if(this.strLoginUser=='Super User'){
      frmPublishedData.append('intCompanyId',this.intSelectedCompanyId)
    }
    if(this.intSelectedBrandId!=undefined && this.intSelectedBrandId !=null ) {
      frmPublishedData.append('intBrandId',this.intSelectedBrandId);
    }
    if(lstSelectedFunction!=undefined && lstSelectedFunction !=null){
      frmPublishedData.append('intProductId',lstSelectedFunction);
    }
    if(this.intPaymentMode=='1'){
      frmPublishedData.append('strBankName',this.strBankName);
      frmPublishedData.append('intAccountNum',this.intAccountNum);
      frmPublishedData.append('strIfscCode',this.strIfscCode);
    }
    if(this.strMiddleName){
      frmPublishedData.append('strMiddleName',this.strMiddleName);
    }
    if(this.blnFixed){
      frmPublishedData.append('strDay',this.strDay);
    }
    if(this.intOfficialNumber) {
      frmPublishedData.append('intOfficialNumber',this.intOfficialNumber);
    }
    if(this.strEmpRemarks) {
      frmPublishedData.append('strEmpRemarks',this.strEmpRemarks)
    }
    frmPublishedData.append('lstFamilyDetails',JSON.stringify(this.lstFamilyDetails));
    frmPublishedData.append('lstEduDetails',JSON.stringify(this.lstEduDetails));
    frmPublishedData.append('lstExpDetails',JSON.stringify(this.lstExpDetails))
    

    

    // this.spinner.show();
    this.serverService.postData('user/adduser/', frmPublishedData).subscribe(
      (response) => {
        // this.spinner.hide();
        if (response.status == 1) {
          Swal.fire('Success!', 'Employee added successfully', 'success');
          this.router.navigate(["/employee/listemployee"]);
          

        }
        else if (response.status == 0) {
          Swal.fire('Error!', response['message'], 'error');
        }
        else{
          Swal.fire('Error!', 'error', 'error');
        }
      },
      (error) => {
        // this.spinner.hide();
        Swal.fire('Error!', 'error', 'error');
      });
    
  }
  groupChanged(item){
    this.selectedGroup=item.name;
    this.selectedGroupId=item.id;

  }
  groupChange(){
    if(this.selectedGroup!=this.strGroupName){
      this.selectedGroup='';
      this.selectedGroupId=null;
    }
  }
  departmentChanged(){
    // console.log("departmentid",this.intDepartmentId);
    
    
  }

  getSalarySplit(){
    let dctData = {};
    dctData['intCategoryId'] = this.selectedCategoryId;
    dctData['intSalaryStructId'] = this.intSalaryStructure;
    dctData['dctAllowances'] = this.dctAllowance;
    dctData['fltGrossPay'] = this.fltGrossPay;
    if (this.selectedCategory.toUpperCase() == 'EMPLOYEE' && 
    this.intSalaryStructure && this.fltGrossPay !=0) {
     
      
      this.serverService.postData('user/salarysplit/', dctData).subscribe(
        (response) => {
          if (response['status'] == 1){
          this.dctSalarySplit = response['data'];
          this.fltCTC = response['dbl_cost_to_company'];
          this.dctRules = response['json_rules'];
          this.intCostToCompany=this.fltCTC;
          this.CTCBreakupchanged();
          }
        },
        (error) => {
          Swal.fire('Error!', 'error', 'error');
  
        });
    }
    else{
      if(this.selectedCategory.toUpperCase() == 'EMPLOYEE'){
        this.fltGrossPay=0;
      }
    }
    
  }
  clearFields(){

    this.strFirstName='';
    this.strLastName='';
    this.strEmail='';
    this.intPhoneNumber=null;
    this.datDOB=null;
    this.strGender='';
    this.strMaritalStatus='';
    this.strBloodGroup='';
    this.intPinCode=null;
    this.strDistrict='';
    this.strState='';
    this.strAddress='';
    this.strEmpCode='';
    this.strUserName='';
    this.strPassword1 = new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)]));
    this.strConfirmPassword1 = new FormControl('', CustomValidators.equalTo(this.strPassword1));
    this.strCategoryName='';
    this.intCategoryId=null;
    this.selectedCategory='';
    this.selectedCategoryId=null;
    this.strBranchName='';
    this.intBranchId=null;
    this.selectedBranch='';
    this.selectedBranchId=null;
    this.strDepartmentName='';
    this.intDepartmentId=null;
    this.selectedDepartment='';
    this.selectedDepartmentId=null;
    this.strGroupName='';
    // this.intGroupId=null;
    this.selectedGroup='';
    this.selectedGroupId=null;
    this.datOBirth=null;
    this.datOJoin=null;
    this.strGrade='';
    this.strLevelOfGrade='';
    this.intSalaryStructure=null;
    this.strSalaryStructName='';
    this.intNetSalary=null;
    this.intCostToCompany=null;
    this.strDesignation='';
    this.dctAllowance={
      "bln_esi":true,
      "bln_pf":true,
      "bln_gratuity":true,
      "bln_wwf":true,
      "bln_tds":true
    }
    this.fltGrossPay = 0;
    this.fltCTC = 0;
    this.dctSalarySplit={};
    this.strShiftType='';
    this.strFixedShift=null;
    this.lstVariableShift=[];
    this.lstShift=[];
    this.selectedFixedShift='';
    this.selectedFixedShiftId=null;

    this.intPaymentMode=null;
    this.strBankName='';
    this.intAccountNum;
    this.strIfscCode='';
    this.intAadharNo;
    this.intPanNo;
    this.ImageSrc = '';
    this.ImageLocation = '';
    this.lstDesignationData;
    this.blnShowBankDetails=false;
    this.strFatherName='';
    this.intEmPhNo=null;

    this.intSelectedBrandId;
    this.intSelectedProductId;
    this.strPhysicalLocation='';
    this.imgPath=''
  
    this.intSelectedCompanyId=null;
    // this.strLoginUser='';
    this.strMiddleName='';
    this.intPanNo=null;
    this.intAccountNum=null;
    this.intSelectedProductId=null;
    this.intSelectedBrandId=null;
    this.intSelectedDesignation=null;
    this.intAadharNo=null;
    this.intWeekOffType='';
    this.strPostOffice='';
    this.strLandMark='';
    this.strPlace='';
    this.strDistrict='';
    this.intDistrictId=null;
    this.strState='';
    this.intStateId=null;
    this.strCountry='';
    this.intCountryId=null
    this.lstDistrictData=[];
    this.lstStateData=[];
    this.intPinCode=null;
    this.intEsiNumber=null;
    this.intUANNumber=null;
    this.intWWFNumber=null;
    this.strDay = '';
    this.blnFixed = false;

    this.strSalutation = '';
    this.strReligion = '';
    this.intReligionId = null;
    this.strMaritalStatus = '';
    this.strEmPerson = '';
    this.strEmerRelattion = '';
    this.strBloodGroup = '';
    
    this.lstSelectedLocation;
    this.intWPSGroupId=null;
    this.intOfficialNumber=null;
    this.strEmpRemarks='';
    this.strIllnessDetails='';
    this.lstExpDetails=[];
    this.lstExpDetails.push({
      strEmployer:null,
      strDesig:'',
      vchrExpDetails:'',
    });
    this.lstFamilyDetails=[];
    this.lstFamilyDetails.push({
     strRelation:'',
     strRelativeName:'',
     strOccupation:'' ,
     isAlive:'',
     relativeDOB:null
    });
    this.lstEduDetails=[];
    this.lstEduDetails.push({
      'blnHighest' : false,
      'strQualif' : '',
      'strCourse' : '',
      'strInstituion' : '',
      'strPlace' : '',
      'intCourseType' : null,
      'intYear' : null,
      'fltPercentage' : null,
    });
    this.lstReference=[
      {
        'strRefName':'',
        'strCompName':'',
        'strRefDesig':'',
        'intRefPhone':null,
        'strRefEmail':''
      },
      {
        'strRefName':'',
        'strCompName':'',
        'strRefDesig':'',
        'intRefPhone':null,
        'strRefEmail':''
      }
    ];


  }

  onChange(event: any) {
    const imgs = event.target.files[0];
    this.ImageSrc = imgs;
    this.ImageLocation = event.target.files[0];
    // console.log("Imgsrc",this.ImageSrc['name']);
    

    if(this.ImageSrc){
      
    }
    
    status = this.checkImage();
  }
  
  checkImage() {
    if (this.ImageSrc) {
      const img_up = new Image;
      const  img_ratio_up = 0;
      img_up.onload = () => {
       
      };
        img_up.src = window.URL.createObjectURL(this.ImageSrc);
        return status;
    }
  }
  paymentModeClicked(){
    if(this.intPaymentMode=='1'){
      this.blnShowBankDetails=true;
    }
    else if(this.intPaymentMode=='0'){
      this.blnShowBankDetails=false;
    }
    this.intAccountNum=null;
    this.strIfscCode='';
    this.strBankName=''
  }

  fileManager2(fileInput) {
    fileInput.click();
  }

  changeWeekofftype(){
    if(this.intWeekOffType == 0){
      this.blnFixed = true;
    }
    else{
      this.blnFixed = false;
    }
  }
  salaryStructureChanged(salStruct) {
    console.log(salStruct);
    this.strSalaryStructName=salStruct.vchr_name;
  }
  CTCBreakupchanged(){

    // if(this.selectedCategory.toUpperCase()== 'EMPLOYEE' && this.strSalaryStructName=='Slab-0'){
    //   let grossTot=this.dctSalarySplit['BP_DA']+this.dctSalarySplit['HRA']+this.dctSalarySplit['CCA']+this.dctSalarySplit['WA']+this.dctSalarySplit['SA'];
    //   if(this.fltGrossPay!=grossTot){
    //     Swal.fire("Error!","Sum of fixed allowances should be equal to gross pay");
    //     return false;
    //   }
    // }
      // let allowanceTot:number=Number(this.dctSalarySplit['Allowances']['ESI'])+Number(this.dctSalarySplit['Allowances']['Gratuity'])+Number(this.dctSalarySplit['Allowances']['PF'])+Number(this.dctSalarySplit['Allowances']['WWF']);
      // let deductionsTot:number=Number(this.dctSalarySplit['Deductions']['ESI'])+Number(this.dctSalarySplit['Deductions']['PF'])+Number(this.dctSalarySplit['Deductions']['SalaryAdvance'])+this.dctSalarySplit['Deductions']['WWF']+this.fltCharity;
    let tempGrossPay: number = this.fltGrossPay;      
      let allowanceTot:number=0
      if(Number(this.dctSalarySplit['Allowances']['ESI'])){
        allowanceTot=allowanceTot+Number(this.dctSalarySplit['Allowances']['ESI'])
      }
      if(Number(this.dctSalarySplit['Allowances']['Gratuity'])){
        allowanceTot=allowanceTot+Number(this.dctSalarySplit['Allowances']['Gratuity'])
      }
      if(Number(this.dctSalarySplit['Allowances']['PF'])){
        allowanceTot=allowanceTot+Number(this.dctSalarySplit['Allowances']['PF'])
      }
      if(Number(this.dctSalarySplit['Allowances']['WWF'])){
        allowanceTot=allowanceTot+Number(this.dctSalarySplit['Allowances']['WWF'])
      }
      if(Number(this.dctSalarySplit['VariablePay'])){
        allowanceTot=allowanceTot+Number(this.dctSalarySplit['VariablePay']);
        tempGrossPay=tempGrossPay+Number(this.dctSalarySplit['VariablePay']);
      }
      // let deductionsTot:number=Number(this.dctSalarySplit['Deductions']['ESI'])+Number(this.dctSalarySplit['Deductions']['PF'])+Number(this.dctSalarySplit['Deductions']['SalaryAdvance'])+Number(this.dctSalarySplit['Deductions']['WWF'])+Number(this.fltCharity);
      let deductionsTot:number=0;
      if(Number(this.dctSalarySplit['Deductions']['ESI'])){
        deductionsTot=deductionsTot+Number(this.dctSalarySplit['Deductions']['ESI'])
      }
      if(Number(this.dctSalarySplit['Deductions']['PF'])){
        deductionsTot=deductionsTot+Number(this.dctSalarySplit['Deductions']['PF']);
      }
      if(Number(this.dctSalarySplit['Deductions']['SalaryAdvance'])) {
        deductionsTot=deductionsTot+Number(this.dctSalarySplit['Deductions']['SalaryAdvance'])
      }
      if(Number(this.dctSalarySplit['Deductions']['WWF'])) {
        deductionsTot=deductionsTot+Number(this.dctSalarySplit['Deductions']['WWF'])
      }
      if(Number(this.fltCharity)){
        deductionsTot=deductionsTot+Number(this.fltCharity)
      }
      if(this.dctAllowance['bln_tds']){  
        if(Number(this.fltTds)){
          deductionsTot=deductionsTot+Number(this.fltTds)
        }
      }
      else{
        this.fltTds = 0;
      }
      
      this.intNetSalary=Number(tempGrossPay)-Number(deductionsTot);
      this.intCostToCompany=Number(tempGrossPay)+Number(allowanceTot);
  }
  religionChanged(item){
   this.intReligionId = item.intId;

  }

  getEnteredDetails(){
    this.serverService.postData('applicant_details/joinedlist/', {intId:this.intNewEmpId,intNewEmpJobId:this.intNewEmpJobId}).subscribe(
      (response) => {
        if(response.status === 1){
          this.blnNewEmp = true;        
          let dctEmpData = response['data']
          this.intCountryId=dctEmpData.fk_country_id
          
          this.strFirstName = dctEmpData.vchr_name;
          this.datOBirth = dctEmpData.dat_dob;
          this.strGender = dctEmpData.vchr_gender;
          this.intPhoneNumber = dctEmpData.bint_mobile1;
          this.strEmail = dctEmpData.vchr_email2;
          this.strAddress = dctEmpData.vchr_house;
          this.strPostOffice = dctEmpData.vchr_city;
          this.strLandMark = dctEmpData.vchr_street;
          this.intDistrictId = dctEmpData.fk_district_id;
          this.intPinCode = dctEmpData.dbl_pincode;
          this.strMaritalStatus =   dctEmpData.vchr_martial_status;
          this.intAadharNo = dctEmpData.vchr_aadhar_no;
  
          this.strBranchName = dctEmpData.branch_name;
          this.intBranchId = dctEmpData.fk_branch_id;
          this.selectedBranchId = dctEmpData.fk_branch_id;
          this.selectedBranch=dctEmpData.branch_name;
  
          this.strDepartmentName = dctEmpData.dept_name;
          this.selectedDepartment = dctEmpData.dept_name;
          this.intDepartmentId = dctEmpData.fk_department_id;
          this.selectedDepartmentId = dctEmpData.fk_department_id;
          this.strDesignation = dctEmpData.desig_name;
          this.intSelectedDesignation = dctEmpData.fk_designation_id
          this.intSalaryStructure=dctEmpData.fk_salary_struct_id;
          this.strSalaryStructName=dctEmpData.slab_name;
          this.dctSalarySplit = dctEmpData.dctSalarySplit;
          this.lstCategory.forEach(element => {
            if(element.vchr_name == 'Employee'){
              this.intCategoryId=element.pk_bint_id;
              this.strCategoryName=element.vchr_name;
              this.selectedCategory=element.vchr_name;
            }
          });
          this.fltGrossPay=dctEmpData.dbl_gross;
            this.intStateId=dctEmpData.fk_state_id
            this.intDistrictId=dctEmpData.fk_district_id;
        }
        else{
          Swal.fire('Error!', response['message'], 'error');

        }


      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');

      });
  }
  addFamilyDetails( ) {
    let dctTemp={
      strRelation:'',
      strRelativeName:'',
      strOccupation:'' ,
      isAlive:'',
      relativeDOB:null
    };
    this.lstFamilyDetails.push(dctTemp);
  }

  deleteFamily(index) {
    this.lstDeletedFamily.push(this.lstFamilyDetails[index]['intFamilyId']);
    let lstLen;
    lstLen=this.lstFamilyDetails.length;
    if(!(lstLen==1)){
      this.lstFamilyDetails.splice(index,1);

    }
    else{
     this.lstFamilyDetails=[];
     this.lstFamilyDetails.push({
      strRelation:'',
      strRelativeName:'',
      strOccupation:'' ,
      isAlive:'',
      relativeDOB:null
     });  
     }
  }
  highestQualifChanged(event){
    if(event){
      this.intHighestQualif=this.intHighestQualif+1;
    }
    else{
      this.intHighestQualif=this.intHighestQualif-1;
    }
  }
  addQualifications() {
    let dctEdudata={
      'blnHighest' : false,
      'strQualif' : '',
      'strCourse' : '',
      'strInstituion' : '',
      'strPlace' : '',
      'intCourseType' : null,
      'intYear' : null,
      'fltPercentage' : null,
    }
    this.lstEduDetails.push(dctEdudata);
  }
  deleteQualifications(index) {

    
    let lstLen;
     lstLen=this.lstEduDetails.length;
     this.lstDeletedEductn.push(this.lstEduDetails[index]['pk_bint_id']);
     if(this.lstEduDetails[index]['blnHighest']==true){
       this.intHighestQualif=this.intHighestQualif-1;
     }
     if(!(lstLen==1)){
       this.lstEduDetails.splice(index,1);

     }
     else{
      this.lstEduDetails=[];
      this.lstEduDetails.push({
        'blnHighest' : false,
        'strQualif' : '',
        'strCourse' : '',
        'strInstituion' : '',
        'strPlace' : '',
        'intCourseType' : null,
        'intYear' : null,
        'fltPercentage' : null,
      });  
      }
  }
  qualificationChanged(index,item) {
    if(item=='Diploma' ||item =='SSLC' || item=='HSE'){
      this.lstEduDetails[index]['strCourse'] = ''
      this.lstEduDetails[index]['strEduCourse']='Other'
    }

    if(item == "Bachelor's/Graduation"){
      this.lstCourse=this.lstUG;
    }
    else if(item == "Masters/Post-Graduation") {
      this.lstCourse=this.lstPG;
    }
    else{
      this.lstCourse=this.lstAllCourse;
    }
  }

  courseChanged(index,item) {
    if(item!='Other'){
      this.lstEduDetails[index]['strCourse']=item
    }
    else{
      this.lstEduDetails[index]['strCourse']=''
          // console.log("this.lstEduDetailscourseChanged',',',',",this.lstEduDetails);    
    }
  }
  addExperience() {
    let dctExpDetails={
      strEmployer:null,
      strDesig:'',
      vchrExpDetails:'',
    }
    this.lstExpDetails.push(dctExpDetails)
  }


  deleteExperience(index) {
    let lstLen;
     lstLen=this.lstExpDetails.length;
     this.lstDeletedExp.push(this.lstExpDetails[index]['pk_bint_id']);
     if(!(lstLen==1)){
       this.lstExpDetails.splice(index,1);

     }
     else{
      this.lstExpDetails=[];
      this.lstExpDetails.push({
        strEmployer:null,
        strDesig:'',
        vchrExpDetails:'',
      });  
      }
  }
  expChanged() {
    let totExp=0;
    let totYr=0;
    let totMonth=0;
    
    for(let exp of this.lstExpDetails) {
      if(exp.vchrExpDetails){
        if(exp.vchrExpDetails.toString().split('.')[0]){
          totYr=totYr+Number(exp.vchrExpDetails.toString().split('.')[0]);
        }
        if(exp.vchrExpDetails.toString().split('.')[1]){
          totMonth=totMonth+Number(exp.vchrExpDetails.toString().split('.')[1]);
        }
      }

      
    }
    if(totMonth>11){

      totYr=totYr+Math.floor(totMonth/12);
      totMonth=(totMonth%12)

    }

    this.totalExp=totYr.toString()+'.'+totMonth;

    

  }
  // relevantExpChanged() {
  //   let totRelYr=0;
  //   let totRelMonth=0;
  //   for(let exp of this.lstExpDetails) {
  //     if(exp.vchrRelevantExp){
  //       if(exp.vchrRelevantExp.toString().split('.')[0]){
  //         totRelYr=totRelYr+Number(exp.vchrRelevantExp.toString().split('.')[0]);
  //       }
  //       if(exp.vchrRelevantExp.toString().split('.')[1]){
  //         totRelMonth=totRelMonth+Number(exp.vchrRelevantExp.toString().split('.')[1]);
  //       }
  //     }
      
  //   }
  //   if(totRelMonth>11){

  //     totRelYr=totRelYr+Math.floor(totRelMonth/12);
  //     totRelMonth=(totRelMonth%12)

  //   }

  //   this.totalRelevantExp=totRelYr.toString()+'.'+totRelMonth;    
  // }
  // exDateFromChanged(exjob) {
  //   exjob['datFrom']=moment(exjob['datFrom']).format('YYYY-MM-DD');
  // }
  // exDateToChanged(exjob) {
  //   exjob['datTo']=moment(exjob['datTo']).format('YYYY-MM-DD');
  // }
  relatvDOBChanged(fam) {
    fam['relativeDOB']=moment(fam['relativeDOB']).format('YYYY-MM-DD');
  }

  changeAmount(){
    if (this.dctAllowance.bln_wwf == true){
      if(this.dctRules.hasOwnProperty('Deductions') && this.dctRules['Deductions'].hasOwnProperty('WWF')){
        this.dctSalarySplit['Deductions']['WWF'] = this.dctRules['Deductions']['WWF'];
      }
      if(this.dctRules.hasOwnProperty('Allowances') && this.dctRules['Allowances'].hasOwnProperty('WWF')){      
      this.dctSalarySplit['Allowances']['WWF'] = this.dctRules['Allowances']['WWF'];
      }
    }
  
    if (this.dctAllowance.bln_pf == true){
      if (this.fltGrossPay-this.dctSalarySplit['HRA'] >15000){
        if(this.dctRules.hasOwnProperty('Deductions') && this.dctRules['Deductions'].hasOwnProperty('PF')){
        this.dctSalarySplit['Deductions']['PF'] = Math.round((15000)*((this.dctRules['Deductions']['PF'])/100))
        }
        if(this.dctRules.hasOwnProperty('Allowances') && this.dctRules['Allowances'].hasOwnProperty('PF')){        
        this.dctSalarySplit['Allowances']['PF'] = Math.round((15000)*((this.dctRules['Allowances']['PF'])/100))
        }
      }
      else{
        if(this.dctRules.hasOwnProperty('Deductions') && this.dctRules['Deductions'].hasOwnProperty('PF')){        
        this.dctSalarySplit['Deductions']['PF'] = Math.round((this.fltGrossPay-this.dctSalarySplit['HRA'])*((this.dctRules['Deductions']['PF'])/100))
        }
        if(this.dctRules.hasOwnProperty('Allowances') && this.dctRules['Allowances'].hasOwnProperty('PF')){                
        this.dctSalarySplit['Allowances']['PF'] = Math.round((this.fltGrossPay-this.dctSalarySplit['HRA'])*((this.dctRules['Allowances']['PF'])/100))  
        }
      }
     
    }
    if (this.dctAllowance.bln_esi == true && this.fltGrossPay-this.dctSalarySplit['WA'] <21000){
      if(this.dctRules.hasOwnProperty('Deductions') && this.dctRules['Deductions'].hasOwnProperty('ESI')){              
      this.dctSalarySplit['Deductions']['ESI'] = Math.round((this.fltGrossPay-this.dctSalarySplit['WA'])*((this.dctRules['Deductions']['ESI'])/100))
      }
      if(this.dctRules.hasOwnProperty('Allowances') && this.dctRules['Allowances'].hasOwnProperty('ESI')){                      
      this.dctSalarySplit['Allowances']['ESI'] = Math.round((this.fltGrossPay-this.dctSalarySplit['WA'])*((this.dctRules['Allowances']['ESI'])/100))
      }
  
    }
    
if (this.dctSalarySplit['Allowances']['ESI'] == 0.0 && this.dctSalarySplit['Deductions']['ESI'] == 0.0 && this.dctAllowance.bln_esi == true && this.dctRules['WA'] && this.dctRules['WA'].toUpperCase() != 'FALSE'){
  this.dctSalarySplit['WA'] = Math.round(this.fltGrossPay*(parseFloat(this.dctRules['WA'].split('-')[0])/100))

}
if (this.dctAllowance.bln_gratuity == true && this.dctRules['Allowances']['Gratuity'].toUpperCase() != 'FALSE'){
  this.dctSalarySplit['Allowances']['Gratuity'] = Math.round(this.dctSalarySplit['BP_DA']/26*15/12)
}
let dblFixedComp = Number(this.dctSalarySplit['BP_DA'])+Number(this.dctSalarySplit['HRA'])+Number(this.dctSalarySplit['CCA'])+Number(this.dctSalarySplit['WA']);
  if(dblFixedComp != this.fltGrossPay && dblFixedComp<this.fltGrossPay){
    this.dctSalarySplit['SA']=this.fltGrossPay-dblFixedComp;
  }else{
    this.dctSalarySplit['SA']=0;
  }            
                        
                       }
  
}
