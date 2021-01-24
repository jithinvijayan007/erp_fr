import { log } from 'util';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ServerService } from '../../server.service'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import * as moment from 'moment';
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-editemployee',
  templateUrl: './editemployee.component.html',
  styleUrls: ['./editemployee.component.css']
})
export class EditemployeeComponent implements OnInit {

  lstEmployeeDetails=[];
  intEmployeeId=null;

  public form: FormGroup;
  public passwordForm: FormGroup;

  lstGroupData=[];
  lstLevelData=[];
  lstgroups;
  int_Level
  str_Level='';

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
  // strCurrentPassword = new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)]));
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
  intGroupId;
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
  fltCharity=0;
  fltTds = 0;
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
  fltCTC = 0;
  dctSalarySplit={};
  blnPasswordBlock=false;
  strShiftType='0';
  strFixedShift;
  lstShiftData=[];
  selectedFixedShift='';
  selectedFixedShiftId;
  lstVariableShift=[];
  lstShift=[];
  datBirthStart;

  intPaymentMode;
  strBankName;
  intAccountNum;
  strIfscCode;
  intAadharNo;
  intPanNo;
  ImageSrc;
  ImageLocation;
  lstDesignationData;
  intSelectedDesignation;
  blnShowBankDetails=false;
  blnShowImage=false;
  lstBrandData=[];
  lstProductData=[];
  intSelectedBrandId;
  intSelectedProductId = [];
  strPhysicalLocation='';
  strFatherName;
  intEmPhNo;
  lstSelectedLocation



  intSelectedCompanyId=null;
  lstCompanyData=[];
  strLoginUser='';
  strCategoryCode='';
  hostName;

  imgUrl;
  intWeekOffType;
  lstLocationData=[];
  lstSelectedLoc=[];
  intEsiNumber=null;
  intUANNumber=null;
  intWWFNumber=null;
  blnOnload=false

  blnCtcBreakup = false;

  lstSalutationData = ['Mr','Ms','Mrs'];
  strSalutation='';

  strReligion = '';
  intReligionId = null;
  strSelectedReligion = '';
  lstReligionData = [];

  strEmPerson = '';
  strEmerRelattion = '';

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


  blnFixed = false;
  strDay = '';
  lstDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

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
    private serverService: ServerService,
    private formBuilder: FormBuilder,
    public router: Router,
    private spinner: NgxSpinnerService,


  ) { }

  ngOnInit() {
   
    
    
    this.datBirthStart = new Date(1990, 0, 1);
    this.strLoginUser=localStorage.getItem("Name");
    this.hostName = this.serverService.hostAddress
    this.hostName = this.hostName.slice(0, this.hostName.length - 1)
    this.blnOnload=true;
    this.intEmployeeId=localStorage.getItem('intEmployeeEditId');
    console.log("Iddd",this.intEmployeeId);

    let strDepartment = localStorage.getItem('strDepartment');
    let Name =localStorage.getItem('Name')
    if (strDepartment == 'HR & ADMIN' ||  Name=='Super User'){
      this.blnShowCTCBreakup =true;
    }

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
            this.lstReligionData=response['lst_religion'];
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
                  .postData('groups/grouppadd/', { term: strData })
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
        this.serverService.getData('products/product_typeahead/').subscribe(
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

    

    //-------------------Physical Location dropdown-------------------------//
    
        // this.serverService.getData('location/list_loc/').subscribe(
        //   (response) => {
        //       if (response.status == 1) {
        //         this.lstLocationData=response['lst_loc'];
        //       }  
        //     },
        //     (error) => {   
        //   });
    //-------------------Physical Location dropdown ends-------------------------//



    //------------------- Group dropdown-------------------------//
    this.serverService.getData('user_groups/grouplist/').subscribe(
      (response) => {
          if (response['status'] == 1) {
            this.lstgroups=response['data'];
            // this.intGroupId = this.lstEmployeeDetails[0]['fk_group_id'];
            // console.log(this.intGroupId);
            // console.log('this.intGroupId');

            

          }  
        },
        (error) => {   
      });
//------------------- Group dropdown ends-------------------------//



 //------------------- Level dropdown-------------------------//
 this.serverService.getData('hierarchy/levels/').subscribe(
  (response) => {
      if (response.status == 1) {
        this.lstLevelData=response['data'];
        
      }  
    },
    (error) => {   
  });
//------------------- Level dropdown ends-------------------------//



 //-------------------Level Group dropdown-------------------------//
 this.serverService.getData('hierarchy/get_groups/').subscribe(
  (response) => {
      if (response.status == 1) {
        this.lstGroupData=response['data'];
      }  
    },
    (error) => {   
  });
//-------------------Level Group dropdown ends-------------------------//



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
    
    this.form = this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required])],
      middleName: [null],
      lastName: [null, Validators.compose([Validators.required])],
      empCode : [null, Validators.compose([Validators.required])],
      userName : [null, Validators.compose([Validators.required])],
      password1:this.strPassword1,
      confirmPassword1: this.strConfirmPassword1,
      // currentPassword:this.strCurrentPassword,
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
    let toDate = new Date();
    let year=toDate.getFullYear();
    for (let yr = 0; yr < 30; yr++) {
      this.lstPassoutYear.push(year);
      year=year-1
    }
    this.getEmployeeDetails()
  }

  levelChanged(){
    console.log(this.lstLevelData,'this.lstLevelData')
    let level_type = ""
    this.lstLevelData.forEach(element => {
      if(element.pk_bint_id == this.int_Level){
        level_type = element.vchr_name
      }
    });
  
    this.serverService.getData('hierarchy/levels?hierarchy_name='+level_type).subscribe(
      (response) => {
          if (response.status == 1) {
          
            this.lstLocationData=response['data'];
            console.log('lstdata : ',this.lstLocationData);
            
          }  
        },
        (error) => {   
      });


      let dict_level = {
        hierarchy_name:level_type,
        dep_id:this.intDepartmentId
      }
      this.serverService.postData('hierarchy/get_groups/',dict_level).subscribe(
        (response) => {
          if (response.status == 1) {
            console.log(response['data'],'dgsdhgsfhdfh')
              this.lstGroupData=response['data'][level_type];
            }  
          },
          (error) => {   
        });
    
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

  getEmployeeDetails(){

    this.lstEmployeeDetails=[];
    this.spinner.show();
    this.serverService.getData('user/adduser/?id='+this.intEmployeeId).subscribe(
      (response) => {
        this.spinner.hide();
          
          if (response['status'] == 1) {
          
            
            this.lstEmployeeDetails=response['lst_userdetailsview'];
            
            if(response['lstRefDetails'].length==2){
              this.lstReference=response['lstRefDetails'];
            }
            else if(response['lstRefDetails'].length==1){
              this.lstReference[0]=response['lstRefDetails'][0]
            }
            if(response['lstEduDetails'].length!=0){
              this.lstEduDetails=response['lstEduDetails'];
            }
            if(response['lstExpDetails'].length!=0){
              this.lstExpDetails=response['lstExpDetails'];
            }
            if(response['lstFamilyDetails']!=0){
              this.lstFamilyDetails=response['lstFamilyDetails'];
            }
            if((response['lstfunctions']).length > 0){
              let data = []
              data = response['lstfunctions'];
              this.intSelectedProductId = data.map(data => data.pk_bint_id);
              console.log(this.intSelectedProductId);
              
            }
      
            this.strFirstName=this.lstEmployeeDetails[0].first_name;
            this.strLastName=this.lstEmployeeDetails[0].last_name;
            this.intCategoryId=this.lstEmployeeDetails[0].fk_category_id;
            this.strCategoryName=this.lstEmployeeDetails[0].fk_category__vchr_name;
            this.selectedCategory=this.lstEmployeeDetails[0].fk_category__vchr_name;
            this.selectedCategoryId=this.lstEmployeeDetails[0].fk_category_id;
            this.strEmpCode=this.lstEmployeeDetails[0].vchr_employee_code;
            this.strUserName=this.lstEmployeeDetails[0].username;
            this.strBranchName=this.lstEmployeeDetails[0].fk_branch__vchr_name;
            this.intBranchId=this.lstEmployeeDetails[0].fk_branch_id;
            this.selectedBranchId=this.lstEmployeeDetails[0].fk_branch_id;
            this.selectedBranch=this.lstEmployeeDetails[0].fk_branch__vchr_name;
            this.strDepartmentName=this.lstEmployeeDetails[0].fk_department__vchr_name;
            this.selectedDepartment=this.lstEmployeeDetails[0].fk_department__vchr_name;
            this.intDepartmentId=this.lstEmployeeDetails[0].fk_department_id;
            this.selectedDepartmentId=this.lstEmployeeDetails[0].fk_department_id;
            this.strGroupName=this.lstEmployeeDetails[0].fk_group__vchr_name;
            this.selectedGroup=this.lstEmployeeDetails[0].fk_group__vchr_name;
            this.intGroupId=this.lstEmployeeDetails[0].fk_group_id;
            // console.log(this.intGroupId);
            
            this.selectedGroupId=[this.lstEmployeeDetails[0]['fk_group_id']];
            console.log(this.selectedGroupId);
            
            this.datOBirth=this.lstEmployeeDetails[0].dat_dob;
            this.strGender=this.lstEmployeeDetails[0].vchr_gender;
            this.intPhoneNumber=this.lstEmployeeDetails[0].bint_phone;
            this.strEmail=this.lstEmployeeDetails[0].vchr_email;
            this.lstSelectedLocation = this.lstEmployeeDetails[0].fk_hierarchy_data_id;
            this.strAddress=this.lstEmployeeDetails[0].vchr_address;
            this.strPostOffice=this.lstEmployeeDetails[0].vchr_po;
            this.strLandMark=this.lstEmployeeDetails[0].vchr_land_mark;
            this.strPlace=this.lstEmployeeDetails[0].vchr_place;
            this.intDistrictId=this.lstEmployeeDetails[0].fk_dist_id;
            this.intStateId=this.lstEmployeeDetails[0].fk_dist__fk_state_id
            this.intCountryId=this.lstEmployeeDetails[0].fk_dist__fk_state__fk_country_id
            this.intPinCode=this.lstEmployeeDetails[0].int_pincode;

            this.str_Level=this.lstEmployeeDetails[0].vchr_name;
            console.log(this.str_Level);
            

            this.strDesignation=this.lstEmployeeDetails[0].fk_desig__vchr_name;
            this.intSelectedDesignation=this.lstEmployeeDetails[0].fk_desig_id
            this.datOJoin=this.lstEmployeeDetails[0].dat_doj;
            this.strLevelOfGrade=this.lstEmployeeDetails[0].vchr_grade;
            this.strGrade=this.lstEmployeeDetails[0].vchr_level;
            this.strSalutation = this.lstEmployeeDetails[0].vchr_salutation;
            this.strReligion = this.lstEmployeeDetails[0].fk_religion__vchr_name;
            this.intReligionId = this.lstEmployeeDetails[0].fk_religion_id;
            this.strMaritalStatus = this.lstEmployeeDetails[0].vchr_marital_status;
            this.strEmPerson = this.lstEmployeeDetails[0].vchr_emergency_person;
            this.strEmerRelattion = this.lstEmployeeDetails[0].vchr_emergency_relation;
            this.strBloodGroup = this.lstEmployeeDetails[0].vchr_blood_group;
            this.int_Level = this.lstEmployeeDetails[0].fk_hierarchy_data__fk_hierarchy_id;
            if(this.selectedCategory.toUpperCase() == 'EMPLOYEE'){
              this.intSalaryStructure=this.lstEmployeeDetails[0].fk_salary_struct_id;
            }
            if (this.lstEmployeeDetails[0].hasOwnProperty('dct_salary_details')){
              if(this.lstEmployeeDetails[0].dct_salary_details['Deductions']){
                this.fltCharity = this.lstEmployeeDetails[0].dct_salary_details['Deductions'].Charity;
                this.fltTds = this.lstEmployeeDetails[0].dct_salary_details['Deductions'].TDS;
              }
            }
            this.strSalaryStructName=this.lstEmployeeDetails[0].fk_salary_struct__vchr_name;
            if(this.lstEmployeeDetails[0].hasOwnProperty('json_allowance') && this.lstEmployeeDetails[0].json_allowance!= null){
              this.dctAllowance.bln_esi=this.lstEmployeeDetails[0].json_allowance.bln_esi;
              this.dctAllowance.bln_pf=this.lstEmployeeDetails[0].json_allowance.bln_pf;
              this.dctAllowance.bln_gratuity=this.lstEmployeeDetails[0].json_allowance.bln_gratuity;
              this.dctAllowance.bln_wwf=this.lstEmployeeDetails[0].json_allowance.bln_wwf;
              this.dctAllowance.bln_tds=this.lstEmployeeDetails[0].json_allowance.bln_tds;
            }
            

            if(this.selectedCategory.toUpperCase() == 'EMPLOYEE'){
              this.fltGrossPay=this.lstEmployeeDetails[0].dbl_gross;
            }
            this.strBankName=this.lstEmployeeDetails[0].vchr_bank_name;
            this.intAccountNum=this.lstEmployeeDetails[0].vchr_acc_no;
            this.strIfscCode=this.lstEmployeeDetails[0].vchr_ifsc;
            this.intPanNo=this.lstEmployeeDetails[0].vchr_pan_no;
            this.strFatherName=this.lstEmployeeDetails[0].vchr_father_name;
            this.intEmPhNo=this.lstEmployeeDetails[0].bint_emergency_phno;
            this.intAadharNo=this.lstEmployeeDetails[0].vchr_aadhar_no;
            this.ImageLocation=this.lstEmployeeDetails[0].vchr_img;
            this.ImageSrc=this.lstEmployeeDetails[0].vchr_img;
            this.strPhysicalLocation=this.lstEmployeeDetails[0].vchr_physical_loc;
            // this.intSelectedProductId=this.lstEmployeeDetails[0].fk_product_id;
            this.intSelectedBrandId=this.lstEmployeeDetails[0].fk_brand_id;
            if(this.lstEmployeeDetails[0].int_weekoff_type != null){
              this.intWeekOffType=this.lstEmployeeDetails[0].int_weekoff_type.toString();
            }
           
            this.lstSelectedLoc=this.lstEmployeeDetails[0].json_physical_loc;
            

            if(this.intWeekOffType=='0'){
              this.strDay = this.lstEmployeeDetails[0].vchr_weekoff_day
              this.blnFixed = true;      
            }

            if(this.lstEmployeeDetails[0].vchr_esi_no !=null){
              this.intEsiNumber=Number(this.lstEmployeeDetails[0].vchr_esi_no);
            }
            if(this.lstEmployeeDetails[0].vchr_uan_no!=null){
              this.intUANNumber=Number(this.lstEmployeeDetails[0].vchr_uan_no);
            }
            if(this.lstEmployeeDetails[0].vchr_wwf_no!=null){
              this.intWWFNumber=Number(this.lstEmployeeDetails[0].vchr_wwf_no);
            }            
            if(this.lstEmployeeDetails[0].int_payment==1 || this.lstEmployeeDetails[0].int_payment==0){
              this.intPaymentMode=this.lstEmployeeDetails[0].int_payment.toString();
            }
            if(this.lstEmployeeDetails[0].int_shift_type){
              this.strShiftType=this.lstEmployeeDetails[0].int_shift_type.toString();
            }

            if(this.lstEmployeeDetails[0].int_shift_type==0){
              this.strFixedShift=this.lstEmployeeDetails[0]['lst_shift_shedule'][0].pk_bint_id;
              this.selectedFixedShift=this.lstEmployeeDetails[0]['lst_shift_shedule'][0].vchr_shift_name;
              this.selectedFixedShiftId=this.lstEmployeeDetails[0]['lst_shift_shedule'][0].pk_bint_id
            }
            else if(this.lstEmployeeDetails[0].int_shift_type==1){
              for(let item of this.lstEmployeeDetails[0]['lst_shift_shedule']){
                this.lstShift.push(item.pk_bint_id)
              }
              // this.lstShift=this.lstEmployeeDetails[0]['json_shift'].lstShift;
              
            }
            if(this.lstEmployeeDetails[0].fk_company_id){
              this.intSelectedCompanyId=this.lstEmployeeDetails[0].fk_company_id
            }
            if(this.lstEmployeeDetails[0].vchr_middle_name){
              this.strMiddleName=this.lstEmployeeDetails[0].vchr_middle_name;

            }
            this.intWPSGroupId=this.lstEmployeeDetails[0].fk_wps_id;
            this.strIllnessDetails=this.lstEmployeeDetails[0].vchr_disease;
            if(this.selectedCategory.toUpperCase()=='EMPLOYEE'){
              // this.getSalarySplit();
              // this.dctSalarySplit=this.lstEmployeeDetails[0]['lst_salary_details'][0];
              // console.log("dctSalarySplit",this.dctSalarySplit);
              
            }
            this.intOfficialNumber=this.lstEmployeeDetails[0].int_official_num;
            this.strEmpRemarks=this.lstEmployeeDetails[0].vchr_emp_remark;
     
            // this.countryChanged(this.intCountryId);
            // this.stateChanged(this.intStateId);

                   }  
      },
      (error) => {   
        this.spinner.hide();
        Swal.fire('Error!','Something went wrong!!', 'error');
        
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
  categoryChanged(item){
      this.selectedCategory=item.vchr_name;
      this.selectedCategoryId=item.pk_bint_id;
      this.strCategoryCode=item.vchr_code;
   
    
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
  fixedShiftChanged(item){
    this.selectedFixedShift=item.vchr_name;
    this.selectedFixedShiftId=item.pk_bint_id;
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
    
    
  }
  
  getSalarySplit(){
  
    if(this.blnOnload){
      this.dctSalarySplit = {}
  
      if(this.lstEmployeeDetails[0].hasOwnProperty('dct_salary_details')){
        this.dctSalarySplit=this.lstEmployeeDetails[0]['dct_salary_details'];

      }
      // console.log(this.dctSalarySplit,'salarysplit');
      this.blnCtcBreakup = this.dctSalarySplit.hasOwnProperty('BP_DA'); //new change

      this.CTCBreakupchanged();
      this.blnOnload=false;
    }
    else{
      let dctData = {};
      dctData['intCategoryId'] = this.selectedCategoryId;
      dctData['intSalaryStructId'] = this.intSalaryStructure;
      dctData['dctAllowances'] = this.dctAllowance;
      dctData['fltGrossPay'] = this.fltGrossPay;
      dctData['intEmployeeId'] = this.intEmployeeId;
      if (this.selectedCategory.toUpperCase() == 'EMPLOYEE' && 
      this.intSalaryStructure && this.fltGrossPay !=0) {
       
        
        this.serverService.postData('user/salarysplit/', dctData).subscribe(
          (response) => {
            if (response['status'] == 1){
            this.dctSalarySplit = response['data'];
            this.fltCTC = response['dbl_cost_to_company'];
            this.dctRules = response['json_rules'];
            // this.blnCtcBreakup = this.dctSalarySplit.hasOwnProperty('BP_DA');    //newchange
            this.fltCharity = this.dctSalarySplit['Deductions']['Charity'];
            this.CTCBreakupchanged();
            }
            else if(response['status'] == 0){
              Swal.fire('Error!', response['msg'], 'error');
  
            }
          },
          (error) => {
            Swal.fire('Error!', 'error', 'error');
    
          });
      }
    }

    
  }

  saveData(){
    // alert(this.intGroupId)
    let dctTempData={}
    console.log("intReligionId",this.intSelectedProductId);
    // console.log("strSalutation",this.strSalutation);
    
    

     
    if(this.strSalutation == '' || this.strSalutation=='null' || this.strSalutation==null){
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
    else if ( this.strUserName == null || this.strUserName.trim() === '') {
      Swal.fire('Error!', 'Enter User Name', 'error');
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
      Swal.fire('Error!', 'Enter Valid branch ', 'error');
      return false
    }
    else if(!this.intDepartmentId){
      Swal.fire('Error!', 'Select department', 'error');
      return false
    }
    // commented for o2force
    // if(!this.intSelectedDesignation){
      
    //   Swal.fire('Error!', 'Select Employee Designation', 'error');
    //   return false
    // }
    if(!this.datOJoin){      
      Swal.fire('Error!', 'Select Date of join', 'error');
      return false
    }
        // commented for o2force
    // else if(!this.strLevelOfGrade){
    //   Swal.fire('Error!', 'Select level of grade', 'error');
    //   return false;
    // }
    // else if(!this.strGrade){
    //   Swal.fire('Error!', 'Select grade', 'error');
    //   return false;
    // }
    else if((this.intSalaryStructure==undefined || this.intSalaryStructure==null || this.intSalaryStructure=='') && (this.selectedCategory.toUpperCase()=='EMPLOYEE')) {
      Swal.fire('Error!', 'Select salary structure', 'error');
      return false;
    }
    // else if(this.lstSelectedLoc.length==0){
    //   Swal.fire('Error!', 'Select Physical Location', 'error');
    //   return false;
    // }
    // else if(!this.strGroupName){
    //   Swal.fire('Error!', 'Enter group', 'error');
    //   return false
    // }
    // else if(this.strGroupName!=this.selectedGroup){
    //   Swal.fire('Error!', 'Enter valid group', 'error');
    //   return false
    // }
    else if(!this.datOBirth){
      Swal.fire('Error!', 'Select Date of Birth', 'error');
      return false
    }
    else if(!this.strGender){
      Swal.fire('Error!', 'Select gender', 'error');
      return false
    }
    else if(this.strReligion == '' ){
      Swal.fire('Error!', 'Select religion', 'error');
      return false;
    }
    else if(this.intReligionId==null) {
      Swal.fire('Error!', 'Select religion', 'error');
      return false;
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
    else if(!this.intPanNo){
      Swal.fire('Error!', 'Enter PAN', 'error');
      return false;
    }
    else if(!this.strFatherName){
      Swal.fire('Error!', "Enter Father's Name", 'error');
      return false;
    }
    else if(this.strEmPerson == ''){
      Swal.fire('Error!', " Enter Emergency Conatct Person", 'error');
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
      return false
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

    else if(!this.strShiftType){
      Swal.fire('Error!', 'Select Shift Type', 'error');
      return false;
    }
    else if(this.intPaymentMode==undefined || this.intPaymentMode==null || this.intPaymentMode==''){
      Swal.fire('Error!', 'Select Payment Mode', 'error');
      return false;
    }
    if(this.intPaymentMode=='1' && !this.strBankName){
      Swal.fire('Error!', 'Enter Bank', 'error');
      return false;
    }
    else if(this.intPaymentMode=='1' && !this.strIfscCode){
      Swal.fire('Error!', 'Enter IFSC Code', 'error');
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
    if(!this.intWeekOffType){
      Swal.fire('Error!', 'Select Week Off Type', 'error');
      return false;
    }
    if(this.blnFixed && !this.strDay){
      Swal.fire('Error!', 'Select Week Off Day', 'error');
      return false;
    }
    else if(!this.ImageLocation){
      Swal.fire('Error!', 'Add User Image', 'error');
      return false;
    }
     else if ((this.fltGrossPay === 0 || this.fltGrossPay === null || this.fltGrossPay === undefined) && (this.selectedCategory.toUpperCase()=='EMPLOYEE')){
      Swal.fire('Error!', 'Enter Gross pay', 'error');
      return false;
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
    if(this.selectedCategory.toUpperCase()== 'EMPLOYEE' && this.strSalaryStructName=='Slab-0'){
      let grossTot=this.dctSalarySplit['BP_DA']+this.dctSalarySplit['HRA']+this.dctSalarySplit['CCA']+this.dctSalarySplit['WA']+this.dctSalarySplit['SA'];
      if(this.fltGrossPay!=grossTot){
        Swal.fire("Error!","Sum of fixed allowances should be equal to gross pay");
        return false;
      }
    }


    dctTempData['strFirstName']=this.strFirstName;
    dctTempData['strLastName']=this.strLastName;
    dctTempData['strMiddleName']=this.strMiddleName;
    dctTempData['intCategoryId']=this.selectedCategoryId;
    dctTempData['strCategoryName']=this.selectedCategory
    dctTempData['strUserName']=this.strUserName;
    dctTempData['datDob']=moment(this.datOBirth).format('YYYY-MM-DD')
    dctTempData['datJoin']=moment(this.datOJoin).format('YYYY-MM-DD')
    dctTempData['strGender']=this.strGender;
    dctTempData['intGroupId']=this.intGroupId;
    dctTempData['intDptId']=this.intDepartmentId;
    dctTempData['intBranchId']=this.selectedBranchId;
    dctTempData['intSalaryStructId']=this.intSalaryStructure;
    dctTempData['strLevelofGrade']=this.strLevelOfGrade;
    dctTempData['strGrade']=this.strGrade;
    dctTempData['strEmail']=this.strEmail;
    dctTempData['intPhoneNumber']=this.intPhoneNumber;
    dctTempData['strDesignation']=this.strDesignation;
    dctTempData['dctAllowances']=this.dctAllowance;
    dctTempData['dblGrossPay']=this.fltGrossPay;
    dctTempData['intId']=this.intEmployeeId;
    dctTempData['intShiftType']=this.strShiftType;
    dctTempData['jsonShiftId']=dctShiftData;
    dctTempData['intproduct']=this.intSelectedProductId;
    dctTempData['inbrand']=this.intSelectedBrandId;

    dctTempData['str_Level']=this.str_Level;


    
    const frmPublishedData = new FormData;
    
    frmPublishedData.append('str_Level',this.str_Level);

    frmPublishedData.append('intId',this.intEmployeeId);
    frmPublishedData.append('strFirstName',this.strFirstName);
    frmPublishedData.append('strLastName',this.strLastName);
    frmPublishedData.append('intCategoryId',this.selectedCategoryId);
    frmPublishedData.append('strCategoryName',this.selectedCategory)
    frmPublishedData.append('strCategoryCode',this.strCategoryCode);
    frmPublishedData.append('strUserName',this.strUserName);
    frmPublishedData.append('datDob',moment(this.datOBirth).format('YYYY-MM-DD'))
    frmPublishedData.append('datJoin',moment(this.datOJoin).format('YYYY-MM-DD'))
    frmPublishedData.append('strGender',this.strGender);
    // frmPublishedData.append('intGroupId',this.selectedGroupId);
    frmPublishedData.append('intDptId',this.intDepartmentId);
    frmPublishedData.append('intBranchId',this.selectedBranchId);
    frmPublishedData.append('strLevelofGrade',this.strLevelOfGrade);
    frmPublishedData.append('strGrade',this.strGrade);
    frmPublishedData.append('strEmail',this.strEmail);
    frmPublishedData.append('intGroupId',this.intGroupId);

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
    if(this.selectedCategory.toUpperCase()=='EMPLOYEE'){
      frmPublishedData.append('dblGrossPay',this.fltGrossPay.toString());
      frmPublishedData.append('intSalaryStructId',this.intSalaryStructure);
      frmPublishedData.append('strSalaryStructName',this.strSalaryStructName);
      if(this.strSalaryStructName=='Slab-0'){
        frmPublishedData.append('dctSalarySplit',JSON.stringify(this.dctSalarySplit))
      }
      frmPublishedData.append('dblCharity',this.fltCharity.toString());
      frmPublishedData.append('dblTds',this.fltTds.toString());
    }
    frmPublishedData.append('intShiftType',this.strShiftType);
    frmPublishedData.append('jsonShiftId',JSON.stringify(dctShiftData));
    frmPublishedData.append('intPaymentMode',this.intPaymentMode);
    frmPublishedData.append('intPanNo',this.intPanNo);
    frmPublishedData.append('strFatherName',this.strFatherName);
    frmPublishedData.append('intEmPhNo',this.intEmPhNo);
    frmPublishedData.append('intAadharNo',this.intAadharNo);
    frmPublishedData.append('imgSrc',this.ImageSrc);
    frmPublishedData.append('strPhysicalLoc',this.strPhysicalLocation);
    frmPublishedData.append('intWeekOffType',this.intWeekOffType);
    // frmPublishedData.append('lstLoc',JSON.stringify(this.lstSelectedLoc));
    if(this.intEsiNumber!=undefined && this.intEsiNumber !=null){
      frmPublishedData.append('strEsiNo',this.intEsiNumber);
    }
    if(this.intUANNumber!=undefined && this.intUANNumber !=null){
      frmPublishedData.append('strUanNo',this.intUANNumber);
    }
    if(this.intWWFNumber!=undefined && this.intWWFNumber !=null){
      frmPublishedData.append('strWwfNo',this.intWWFNumber);
    }
    frmPublishedData.append('lstReference',JSON.stringify(this.lstReference));
    if(this.intWPSGroupId){
      frmPublishedData.append('intWpsId',this.intWPSGroupId);
    }
    frmPublishedData.append('strIllnessDetails',this.strIllnessDetails)
    if(this.intSelectedBrandId!=undefined && this.intSelectedBrandId !=null ) {
      frmPublishedData.append('intBrandId',this.intSelectedBrandId);
    }
    if(this.intSelectedProductId!=undefined && this.intSelectedProductId!=null){
      frmPublishedData.append('intProductId',JSON.stringify(this.intSelectedProductId));
    }
    if(this.strLoginUser=='Super User'){
      frmPublishedData.append('intCompanyId',this.intSelectedCompanyId)
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
    frmPublishedData.append('lstExpDetails',JSON.stringify(this.lstExpDetails));
    frmPublishedData.append('lstDeletedEductn',JSON.stringify(this.lstDeletedEductn));
    frmPublishedData.append('lstDeletedExp',JSON.stringify(this.lstDeletedExp));
    frmPublishedData.append('lstDeletedFamily',JSON.stringify(this.lstDeletedFamily));
    
    

    this.spinner.show();
    this.serverService.putData('user/adduser/', frmPublishedData).subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status == 1) {
          Swal.fire('Success!', 'Employee Updated successfully', 'success');
          this.router.navigate(['/user/listuser'])


        }
        else if (response.status == 0) {
          Swal.fire('Error!', response['message'], 'error');
        }
        else{
          Swal.fire('Error!', 'error', 'error');
        }
      },
      (error) => {
        Swal.fire('Error!', 'error', 'error');
        this.spinner.hide();
      });
    
  }
  backToList(){
    this.router.navigate(["/user/listuser"]);

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
    this.intGroupId;
    this.selectedGroup='';
    this.selectedGroupId=null;
    this.datOBirth=null;
    this.datOJoin=null;
    this.strGrade='';
    this.strLevelOfGrade='';
    this.intSalaryStructure=null;
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
    this.strDay = '';
    this.blnFixed =false;

    this.str_Level = '';

  }

  savePassWord(){
    let dctData={}
    // dctData['strCurrentPassword']=this.strCurrentPassword;
    dctData['strNewPassword']=this.strPassword1;
    dctData['intId']=this.intEmployeeId;
    dctData['strUserName']=this.strUserName;
    // if(!this.strCurrentPassword){
    //   Swal.fire('Error!', 'Enter Current Password', 'error');
    //   return false;
    // }
     if(!this.strPassword1){
      Swal.fire('Error!', 'Enter New Password', 'error');
      return false;
    }
    else if(this.strPassword1!=this.strConfirmPassword1){
      Swal.fire('Error!', 'Passwords does not match', 'error');
      return false;
    }
    this.spinner.show();
    this.serverService.postData('user/update_password/', dctData).subscribe(
      (response) => {
        this.spinner.hide();
        if (response['status'] == 1){
          Swal.fire('Success!', 'Password changed successfully', 'success');
          this.router.navigate(['/user/listuser'])
          this.strPassword1 = new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)]));
          this.strConfirmPassword1 = new FormControl('', CustomValidators.equalTo(this.strPassword1));

        }
        else if(response['status'] == 0){
          Swal.fire('Error!', response['message'], 'error');

        }
      },
      (error) => {
        this.spinner.hide();
        Swal.fire('Error!', 'error', 'error');

      });

  }

  onChange(event: any) {
    const imgs = event.target.files[0];
    this.ImageSrc = imgs;
    this.ImageLocation = event.target.files[0];
    this.blnShowImage=true;
    
    
    status = this.checkImage();

              // for preview...............
              var reader = new FileReader();
              reader.readAsDataURL(imgs);
              reader.onload = () => {
                this.imgUrl = reader.result;
              }
              //...........................  

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
    this.intAccountNum;
    this.strIfscCode;
    this.strBankName
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
    // console.log(salStruct);
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
     if (Object.keys(this.dctSalarySplit).length != 0) {
      // let allowanceTot:number=Number(this.dctSalarySplit['Allowances']['ESI'])+Number(this.dctSalarySplit['Allowances']['Gratuity'])+Number(this.dctSalarySplit['Allowances']['PF'])+Number(this.dctSalarySplit['Allowances']['WWF']);
      let tempGrossPay: number = this.fltGrossPay;
      let allowanceTot:number=0;
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
      // if(Number(this.dctSalarySplit['VariablePay'])){
      //   allowanceTot=allowanceTot+Number(this.dctSalarySplit['VariablePay']);
      //   tempGrossPay=tempGrossPay+Number(this.dctSalarySplit['VariablePay']);
      // }

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
      
  }
  religionChanged(item){
    this.intReligionId = item.intId;
 
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
     this.lstDeletedEductn.push(this.lstEduDetails[index]['intEduId']);
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
     this.lstDeletedExp.push(this.lstExpDetails[index]['intExpId']);
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
