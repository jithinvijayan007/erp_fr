import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ServerService } from '../server.service';
import { CustomValidators } from 'ng2-validation';
import { log } from 'util';

@Component({
  selector: 'app-company-permissions',
  templateUrl: './company-permissions.component.html',
  styleUrls: ['./company-permissions.component.css']
})
export class CompanyPermissionsComponent implements OnInit {

  // @ViewChild('idCompany') idCompany: any;

  // @ViewChild('eventImg') eventImg: ElementRef;

  public form: FormGroup;

  companyName='';

  searchCompany: FormControl = new FormControl();
  searchBranch: FormControl = new FormControl();
  lstCompany = [];
  intCompanyId:number=null;
  strCompany='';

  lstPerms = [];
  lstPermsCopy = [];
  lstPermsSow = [];
  blnAdminGroup = false;
  blnAddAdminGroup = false;
  blnAddAdminUser = false;

  blnAdminUser = false;

  blnIsAllDisable = false;
  blnTrue=false;

  blnIsAllDisablesub = true;
  blnTrueSub=false;
  blnArrowLevelOne = true;
  blnArrowLevelTwo = true;
  blnArrowLevelThree = false;

  code='';
  firstname='';
  lastname='';
  contactno:number=null;
  password='';
  confirmPassword='';
  strSelectedBranch='';
  lstBranch=[];
  branchId:number = null;
  strBranch = '';

  ImageSrc = '';
  ImageLocation = '';

  password1 = new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)]));
  confirmPassword2 = new FormControl('', CustomValidators.equalTo(this.password1));
  
  validationSuccess = true;
  errorPlace = '';
  blnLevelOne = true;
  blnLevelTwo =true;
  blnLevelThree =true;
  blnSubItem = false;


  constructor(
    private serverService: ServerService,
    public router: Router,
    private fb: FormBuilder,
    public toastr: ToastrService,
  ) { }

  ngOnInit() {
     
    this.form = this.fb.group({
      code: [null, Validators.compose([Validators.required])],
      fname: [null, Validators.compose([Validators.required])],
      lname: [null, Validators.compose([Validators.required])],
      // email: [null, Validators.compose([CustomValidators.email])],
      phone: [null, Validators.compose([Validators.required,
      CustomValidators.min(1000000000), CustomValidators.max(1000000000000), CustomValidators.number])],
      password: this.password1,
      confirmPassword: this.confirmPassword2
    });

    this.searchCompany.valueChanges
  .debounceTime(400)
  .subscribe((strData: string) => {
    if (strData === undefined || strData === null) {
      this.lstCompany = [];
    } else {
      
      if (strData.length >= 3) {
        this.serverService
          .postData('company/company_typeahead/', { term: strData })
          .subscribe(
            (response) => {
              this.lstCompany = response['data'];

            }
          );
      }
    }
  }
); 


this.searchBranch.valueChanges
.debounceTime(400)
.subscribe((strData: string) => {
  if (strData === undefined || strData === null) {
    this.lstBranch = [];
  } else {
    if (strData.length >= 3) {
      this.serverService
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

  }


  companyChanged(item){
    
    this.intCompanyId = item.id;
    this.strCompany = item.name;
    const pusheditems = {};
    pusheditems['int_company_id']= this.intCompanyId;

    this.serverService.postData("company_permissions/list/", pusheditems).subscribe(res => {
      const result = res;
      if (result['status'] === 1) {
        this.blnLevelOne=true;
        this.blnLevelTwo = true;
        this.blnLevelThree = true;
        this.lstPerms = result['data'];
   
        this.lstPermsCopy = JSON.parse(JSON.stringify(result['data']));
        // this.lstPermsSow = JSON.parse(JSON.stringify(result['data']));
        this.blnAddAdminGroup = result['bln_add_admin_group'];
        this.blnAddAdminUser = result['bln_add_admin_user'];
        for(let i =0;i<this.lstPerms.length;i++){
          for(let j =0;j<this.lstPerms[i]['sub_items'].length;j++){
            this.blnSubItem =false;
            for(let k = 0;k<this.lstPerms[i]['sub_items'][j]['menu_items'].length;k++){
              // console.log(this.lstPerms[i]['sub_items'][j]['menu_items'][k]);
              
             if(!this.lstPerms[i]['sub_items'][j]['menu_items'][k]['bln_menu_add_perm']){
              this.blnSubItem = true;
              break;
             }
            
              
            }
             if(this.blnSubItem){
              this.lstPerms[i]['sub_items'][j]['sub_status'] = false;
             }
             else{
              this.lstPerms[i]['sub_items'][j]['sub_status'] = true;
             }
            
             
          }
        }
      
      } else {
        this.toastr.error(result['data'], 'Error!');
      }
    });

  }

  checkAdminGroup() {
    if(!this.blnAdminGroup) {
      this.blnAdminUser = false;
    }
  }

  BranchChanged(item){

 
    this.branchId = item.id;
    this.strBranch = item.branchname;

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
      const  img_ratio_up = 0;
      img_up.onload = () => {
       
      };
        img_up.src = window.URL.createObjectURL(this.ImageSrc);
        return status;
    }
  }

  isAllDisabled(i, strType) {
    this.blnIsAllDisable = true;
    // console.log(i,'i');
    
    
    for (let temp = 0; temp < this.lstPerms[i].sub_items.length; temp++) {

      if ((strType == 'sub_status')) {
        this.blnIsAllDisable = false;
        break;
      }
    }

    if (this.blnIsAllDisable) {
      return true;
    }
    else {
      return false;
    }
  }

  isAllDisabledSub(i,j, strType) {
    this.blnIsAllDisable = true;
    this.blnIsAllDisablesub = true;
    
    // for (let temp = 0; temp < this.lstPerms[i].sub_items.length; temp++) {
      for (let temp1 = 0; temp1 < this.lstPerms[i].sub_items[j].menu_items.length; temp1++) {
        
      if ((strType == 'bln_menu_add_perm') && (this.lstPerms[i].sub_items[j].menu_items[temp1]['bln_menu_add_perm']==true)) {
       
        
        this.blnIsAllDisablesub = false;
        break;
      }
     }
    // }
    if (this.blnIsAllDisablesub) {
      this.lstPerms[i].sub_items[j]['sub_status'] = false;
      return true;
    }
    else {
      this.lstPerms[i].sub_items[j]['sub_status'] = true;
      return false;
    }
  }
  isAllCheckedSub(i,j,strType) {
    // console.log('j',j);
    this.blnTrue = true;
    this.blnIsAllDisable = true;
    this.blnTrueSub = true;
    this.blnIsAllDisablesub =true;
    // for (let temp = 0; temp < this.lstPerms[i].sub_items.length; temp++) {
      // let op = strType.split('_')[1]
     
     for(let temp2 = 0 ; temp2 < this.lstPerms[i].sub_items[j].menu_items.length; temp2++){

      
      if (!this.lstPerms[i].sub_items[j].menu_items[temp2]['bln_menu_add_perm']) {
        this.blnTrueSub = false;
        break;
      }
     }
    // }

    if (this.blnTrueSub) {
     
      // this.lstPerms[i].sub_items[j]['sub_status'] = true;
      return true;
    }
    else {
      // this.lstPerms[i].sub_items[j]['sub_status'] = false;
      return false;
    }
  }

  isAllChecked(i, strType) {
    this.blnTrue = true;
    this.blnIsAllDisable = true;
    for (let temp = 0; temp < this.lstPerms[i].sub_items.length; temp++) {
      // let op = strType.split('_')[1]
     
      
      if (!this.lstPerms[i].sub_items[temp]['sub_status']) {
        this.blnTrue = false;
        break;
      }
    }

    if (this.blnTrue) {
      return true;
    }
    else {
      return false;
    }
  }


 
 


  mainChanged(event, i, strType) {
   
    
    for (let temp = 0; temp < this.lstPerms[i].sub_items.length; temp++) {
      for(let temp1 = 0;temp1 < this.lstPerms[i].sub_items.length; temp1++){
      if (strType === 'sub_status') {
        this.lstPerms[i].sub_items[temp][strType] = event.checked;
        this.lstPerms[i].main_status = event.checked;
      }
      for (let temp2 = 0; temp2 < this.lstPerms[i].sub_items[temp1].menu_items.length; temp2++){

        this.lstPerms[i].sub_items[temp1].menu_items[temp2].bln_menu_add_perm = event.checked;
        // console.log('data',this.lstPerms[i].sub_items[temp1].menu_items[temp2].bln_menu_add_perm);
        
      }
      
    }
   }
  }
  mainChangedSub(event, i, j,strType) {
   

   
    
    
    
    
    // for (let temp = 0; temp < this.lstPerms[i].sub_items.length; temp++) {
      for (let temp2 = 0; temp2 < this.lstPerms[i].sub_items[j].menu_items.length; temp2++){

      if (strType === 'bln_menu_add_perm') {
     
        
        // this.lstPerms[i].sub_items[temp].menu_items[temp2][strType] = event.checked;
        this.lstPerms[i].sub_items[j].menu_items[temp2]['bln_menu_add_perm'] = event.checked;
      }
     }
    // }
  }
  menuSubItemChecked(i,j,blnMenuSub,blnmenu){

     let blnMenuCheckbox = true;
      

      if ( blnMenuSub || (blnmenu == true) ){
        // this.lstPerms[i].sub_items[temp].menu_items[temp2][strType] = event.checked;
        for (let temp2 = 0; temp2 < this.lstPerms[i].sub_items[j].menu_items.length; temp2++){
          this.lstPerms[i].sub_items[j].menu_items[temp2].bln_menu_add_perm = true;

        }
       
        return true;
      }
      else {
        for (let temp2 = 0; temp2 < this.lstPerms[i].sub_items[j].menu_items.length; temp2++){
          this.lstPerms[i].sub_items[j].menu_items[temp2].bln_menu_add_perm = false;
        }
        return false;
      }
     
  }
  
  menuItemChanged(event,i,j,subItem){
 
    
    let blnmenuAllChecked = true;
    // console.log('j',this.lstPerms[i].sub_items[j].sub_status);
    
    for (let temp2 = 0; temp2 < this.lstPerms[i].sub_items[j].menu_items.length; temp2++){
      if(! this.lstPerms[i].sub_items[j].menu_items[temp2].bln_menu_add_perm){
        blnmenuAllChecked= false;
        break;
      }
      else{
        blnmenuAllChecked =true;
      }
      

    }
    // console.log('k',j,blnmenuAllChecked);
    
    this.lstPerms[i].sub_items[j].sub_status = blnmenuAllChecked;
    // console.log('menua', this.lstPerms[i].sub_items[j].sub_status);
    
  }
  levelOneClicked(item){
    // this.blnArrowLevelOne = !this.blnArrowLevelOne;
    if(item['levelOneClicked']){
      
     
      item['levelOneClicked'] = !item['levelOneClicked'];
      item['blnArrowLevelOne'] = !item['blnArrowLevelOne'];
      for(let temp=0 ; temp< item.sub_items.length;temp++){
        if(item.sub_items[temp].levelTwoClicked){
          item.sub_items[temp].levelTwoClicked = !item.sub_items[temp].levelTwoClicked;
          item.sub_items[temp].blnArrowLevelTwo = !item.sub_items[temp].blnArrowLevelTwo;
        }
      }
    
    }
   
    else{
     
      console.log('not levelclicked');
      
    
      item['levelOneClicked']=this.blnLevelOne;
      item['blnArrowLevelOne'] =this.blnArrowLevelOne;
    
    }
  

  }
  levelTwoClicked(subItem){
    // this.blnArrowLevelTwo = !this.blnArrowLevelTwo;
    if(subItem['levelTwoClicked']){
      subItem['levelTwoClicked'] = !subItem['levelTwoClicked'];
      subItem['blnArrowLevelTwo'] = !subItem['blnArrowLevelTwo'];
    }

    else{
      subItem['levelTwoClicked']=this.blnLevelTwo;
      subItem['blnArrowLevelTwo']=this.blnArrowLevelTwo;
    }

  
    
  }
  levelThreeClicked(){
    this.blnLevelThree =  !this.blnLevelThree;
  }




  

  savePermission() {
    
    this.validationSuccess = true;
    this.errorPlace = '';
    
    if (this.blnAdminUser) {

      // const eatpos = this.email.indexOf('@');
      // const edotpos = this.email.lastIndexOf('.');
      
      if (this.password === null || this.password.trim() === '') {
        this.validationSuccess = false;
        this.errorPlace = 'Fill password correctly';
      } else if (this.password.length < 8) {
        this.validationSuccess = false;
        this.errorPlace = 'Password length is less than 8';
      } else if (this.password !== this.confirmPassword) {
        this.validationSuccess = false;
        this.errorPlace = 'Confirm password mismatch';
      }
      if (this.contactno === null || this.contactno === undefined) {
        this.validationSuccess = false;
        this.errorPlace = 'Fill contact number correctly';
      } else if ((this.contactno).toString().length < 10 || (this.contactno).toString().length > 12) {
        this.validationSuccess = false;
        this.errorPlace = 'Contact number length between 10 and 12 digit';
      }

      if(this.strSelectedBranch != this.strBranch || this.strSelectedBranch == ''){
        this.validationSuccess = false;
        this.errorPlace ='Select branch';
      }
      
      if (this.lastname === null || this.lastname.trim() === '') {
        this.validationSuccess = false;
        this.errorPlace = 'Fill last name correctly';
      } else if (!/^[a-zA-Z\s ]*$/g.test(this.lastname)) {
        this.validationSuccess = false;
        this.errorPlace = 'Last name allow only alphabets and white space';
      }
      if (this.firstname === null || this.firstname.trim() === '') {
        this.validationSuccess = false;
        this.errorPlace = 'Fill first name correctly';
      } else if (!/^[a-zA-Z\s ]*$/g.test(this.firstname)) {
        this.validationSuccess = false;
        this.errorPlace = 'First name allow only alphabets and white space';
      }
      if (this.code.trim() === '') {
        this.validationSuccess = false;
        this.errorPlace = 'Fill code correctly';
      } else if (!/^[a-zA-Z0-9-]*$/g.test(this.code)) {
        this.validationSuccess = false;
        this.errorPlace = 'Code allow only alpha numerics and \'-\'';
      }
      if (!(this.ImageLocation && this.ImageLocation["size"] <= 102400)) {
        this.validationSuccess = false;
        this.errorPlace = 'Image maximum size 100KB';
      }
      if (!this.ImageSrc) {
        this.validationSuccess = false;
        this.errorPlace = 'No image uploaded'
      }

    } 
    if (this.blnAdminUser && !this.validationSuccess) {
      this.toastr.error(this.errorPlace, 'Error!');
    } else {
      const frmPublishedData = new FormData;
      const pusheditems = {};
      frmPublishedData.append('int_company_id',this.intCompanyId.toString());
      frmPublishedData.append('lst_per',JSON.stringify(this.lstPerms));
      frmPublishedData.append('lst_perms_copy',JSON.stringify(this.lstPermsCopy));
      frmPublishedData.append('bln_add_admin_group',this.blnAdminGroup.toString());
      frmPublishedData.append('bln_add_admin_user',this.blnAdminUser.toString());


      if (this.blnAdminUser && this.validationSuccess) {
        
        
        frmPublishedData.append('vchr_user_code', this.code.trim());
        frmPublishedData.append('firstname', this.firstname.trim());
        frmPublishedData.append('lastname', this.lastname.trim());
        frmPublishedData.append('contactno', this.contactno.toString());
        frmPublishedData.append('password', this.password);
        frmPublishedData.append('image', this.ImageLocation);
        frmPublishedData.append('branch_id',this.branchId.toString());
      }


      this.serverService.postData("company_permissions/save/", frmPublishedData).subscribe(res => {
        if (res['status'] === 1) {
          this.toastr.success('Saved successfully', 'Success!');
          this.lstPerms = [];
          this.lstPermsCopy = [];
          this.companyName = '';
          this.intCompanyId = 0;
          this.strCompany = '';

          this.code = '';
          this.firstname = '';
          this.lastname = '';
          this.contactno = undefined;
          this.password = '';
          this.confirmPassword = '';
          this.blnAdminUser = false;
        } else if (res['status'] === 1 && res['data'] === "User code already exists") {
          this.toastr.error('User cannot be created since user code already exists', 'Error!');
        } else if (res['status'] === 1 && res['data'] === "'NoneType' object is not subscriptable") {
          this.toastr.error('Branch not created', 'Error!');
        } else {
          this.toastr.error(res['data'], 'Error!');
        }
      }); 
    }   
    
  }
  

}
