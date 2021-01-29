
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-addgroup',
  templateUrl: './addgroup.component.html',
  styleUrls: ['./addgroup.component.css']
})
export class AddgroupComponent implements OnInit {

  strName= '';
  companyId = Number(localStorage.getItem("companyId"));
  userType = localStorage.getItem("staff");
  public form: FormGroup;

  searchCompany: FormControl = new FormControl();
  lstCompany = [];
  intCompanyId:number=null;
  strCompany='';
  lstPerms = [];
  blnCheckbox = true;
  blnLevelOne=true;
  blnLevelTwo =true;
  blnLevelThree =true;
  data = {}
  companyName;
  strCode;

  lstPermsKeys = []
  lst_subItem = []
  lst_menuItem =[]
  dictMenuItems = {}
  intDepartmentId=null;
  lstDepartment=[];
  lstCourse=[
    "SSLC",
    "HSE",
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
  lstDesc: string[]=[""];
  intNoticePeriod;
  strApplyTo='0';
  lstStatesData=[];
  lstZonesData=[];
  lstTerritoryData=[];
  lstSelectedStates=[];
  lstSelectedZones=[];
  lstSelectedTerritories=[];
  lstPermission=[];
  blnAdd=true;
  blnView=true;
  blnEdit=true;
  blnDelete=true;
  fltExp=null;
  intAgeFrom=null;
  intAgeTo=null;
  lstQualifications=[];



  constructor(
    private serverService: ServerService,
    public toastr: ToastrService,
    public router: Router,
    private fb: FormBuilder,
  ) { }



  ngOnInit() {
    if (!localStorage.getItem("Tokeniser")) {
    localStorage.setItem('previousUrl','/user/sign-in');
      
      this.router.navigate(["/user/sign-in"]);
    }
    this.data = { role: this.companyId };
    // console.log('comapnyId',this.data);
    
    this.serverService.postData("user_groups/get_category_list/",this.data).subscribe(res => {
      const result = res;

      if (result['status'] === 1) {
        this.lstPerms = result['data']
        this.lstPermsKeys = Object.keys(this.lstPerms)


        // this.lstPermsKeys.splice('id',1)
        // this.lstPermsKeys.splice('name',1)
        //         console.log('DATA',this.lstPerms);
        // for (let item =0;item<this.lstPerms.length;item++){

        // }

      } else {
        swal.fire("Error", result['data'], "error");
      }
    });

    this.searchCompany.valueChanges.pipe(
    debounceTime(400))
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


  }

  isAllChecked(item,i, strType){

    this.lst_subItem = Object.keys(this.lstPerms[item])
    let index = this.lst_subItem.indexOf('id')
    this.lst_subItem.splice(index,1)
    index = this.lst_subItem.indexOf('name')
    this.lst_subItem.splice(index,1)
    index = this.lst_subItem.indexOf('levelOneClicked')
    this.lst_subItem.splice(index,1)

    var blnTrue = true;
    var blnIsAllDisable = true;

      for(var temp = 0; temp < this.lst_subItem.length; temp++){



        let op = strType.split('_')[1]
        if((!this.lstPerms[item][this.lst_subItem[temp]]['bln_'+op+'_perm'])){
          blnTrue = false;
          break;
        }
        // if(!this.lstPerms[item][this.lst_subItem[temp]][op+'_disabled']){
        //   blnIsAllDisable = false;
        // }



      }


    if(blnTrue){
      return true;
    }
    else{
      return false;
    }
  }

  isAllCheckedSub(item,subItem,strType) {

    var blnTrue = true;
    var blnIsAllDisable = true;
    var blnTrueSub = true;
    var blnIsAllDisablesub =true;
    this.lst_menuItem = Object.keys(this.lstPerms[item][subItem])
    let index = this.lst_menuItem.indexOf('id')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('name')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('levelTwoClicked')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('sub_status')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('view_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_edit_perm')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_delete_perm')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_view_perm')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_download_perm')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('add_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('edit_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('delete_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('download_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_add_perm')
    this.lst_menuItem.splice(index,1)


    for (let temp = 0; temp < this.lst_menuItem.length; temp++) {
      let op = strType.split('_')[1]





      if((!this.lstPerms[item][subItem][this.lst_menuItem[temp]]['bln_'+op+'_perm'])){
        blnTrueSub = false;
        break;
      }
      // if(!this.lstPerms[item][subItem][this.lst_menuItem[temp]]['blnop+'_disabled']){
      //   blnIsAllDisablesub = false;
      // }


    }
    // console.log('bln',blnIsAllDisablesub);

    if(blnTrueSub){
      return true;
    }
    else{
      return false;
    }
  }

  
  isAllDisabled(item,i, strType){

    this.lst_subItem = Object.keys(this.lstPerms[item])
    let index = this.lst_subItem.indexOf('id')
    this.lst_subItem.splice(index,1)
    index = this.lst_subItem.indexOf('name')
    this.lst_subItem.splice(index,1)
    index = this.lst_subItem.indexOf('levelOneClicked')
    this.lst_subItem.splice(index,1)

    var blnIsAllDisable = true;

    for(var temp = 0; temp < this.lst_subItem.length; temp++){


      if((strType == 'bln_add_perm' )){
        blnIsAllDisable = false;
        break;
      }
      if((strType == 'bln_edit_perm')){
        blnIsAllDisable = false;
        break;
      }
      if((strType == 'bln_view_perm')){
        blnIsAllDisable = false;
        break;
      }
      if((strType == 'bln_delete_perm')){
        blnIsAllDisable = false;
        break;
      }
      if((strType == 'bln_download_perm')){
        blnIsAllDisable = false;
        break;
      }

    }

    if(blnIsAllDisable){
      return true;
    }
    else{
      return false;
    }
  }

  isAllDisabledSub(item,subItem,strType) {
    var blnIsAllDisablesub= true;
    // this.blnIsAllDisablesub = true;
    this.lst_menuItem = Object.keys(this.lstPerms[item][subItem])
    let index = this.lst_menuItem.indexOf('id')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('name')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('levelTwoClicked')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('sub_status')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('view_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_edit_perm')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_delete_perm')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_view_perm')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_download_perm')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('add_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('edit_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('delete_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('download_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_add_perm')
    this.lst_menuItem.splice(index,1)
    // for (let temp = 0; temp < this.lstPerms[i].sub_items.length; temp++) {
      for (let temp1 = 0; temp1 < this.lst_menuItem.length; temp1++) {


      if((strType == 'bln_add_perm' )){
        blnIsAllDisablesub = false;
        break;
      }
      if((strType == 'bln_edit_perm')){
        blnIsAllDisablesub = false;
        break;
      }
      if((strType == 'bln_view_perm')){
        blnIsAllDisablesub = false;
        break;
      }
      if((strType == 'bln_delete_perm')){
        blnIsAllDisablesub = false;
        break;
      }
      if((strType == 'bln_download_perm')){
        blnIsAllDisablesub = false;
        break;
      }
     }
    // }
    // console.log('bln2',blnIsAllDisablesub);

    if (blnIsAllDisablesub) {
      return true;
    }
    else {
      return false;
    }
  }

  mainChanged(event,item, i, strType){
    this.lst_subItem =JSON.parse(JSON.stringify(Object.keys(this.lstPerms[item])));
    let index = this.lst_subItem.indexOf('id')
    this.lst_subItem.splice(index,1)
    index = this.lst_subItem.indexOf('name')
    this.lst_subItem.splice(index,1)
    index = this.lst_subItem.indexOf('levelOneClicked')
    this.lst_subItem.splice(index,1)
    // if(this.lst_subItem.indexOf('levelOneClicked') > -1){
    //   index = this.lst_subItem.indexOf('levelOneClicked');
    //   this.lst_subItem.splice(index,1);
    // }



    for(var temp = 0; temp < this.lst_subItem.length; temp++){
      // console.log('sub',this.lst_subItem[temp]);

      this.lst_menuItem = Object.keys(this.lstPerms[item][this.lst_subItem[temp]])
      let indexmenu = this.lst_menuItem.indexOf('id')
      this.lst_menuItem.splice(indexmenu,1)
      indexmenu = this.lst_menuItem.indexOf('name')
      this.lst_menuItem.splice(indexmenu,1)
      indexmenu = this.lst_menuItem.indexOf('sub_status')
      this.lst_menuItem.splice(indexmenu,1)
      indexmenu = this.lst_menuItem.indexOf('view_disabled')
      this.lst_menuItem.splice(indexmenu,1)
      indexmenu = this.lst_menuItem.indexOf('bln_edit_perm')
      this.lst_menuItem.splice(indexmenu,1)
      indexmenu = this.lst_menuItem.indexOf('bln_delete_perm')
      this.lst_menuItem.splice(indexmenu,1)
      indexmenu = this.lst_menuItem.indexOf('bln_view_perm')
      this.lst_menuItem.splice(indexmenu,1)
      indexmenu = this.lst_menuItem.indexOf('bln_download_perm')
      this.lst_menuItem.splice(indexmenu,1)
      indexmenu = this.lst_menuItem.indexOf('add_disabled')
      this.lst_menuItem.splice(indexmenu,1)
      indexmenu = this.lst_menuItem.indexOf('edit_disabled')
      this.lst_menuItem.splice(indexmenu,1)
      indexmenu = this.lst_menuItem.indexOf('delete_disabled')
      this.lst_menuItem.splice(indexmenu,1)
      indexmenu = this.lst_menuItem.indexOf('download_disabled')
      this.lst_menuItem.splice(indexmenu,1)
      indexmenu = this.lst_menuItem.indexOf('bln_add_perm')
      this.lst_menuItem.splice(indexmenu,1)
      indexmenu = this.lst_menuItem.indexOf('levelTwoClicked')
      this.lst_menuItem.splice(indexmenu,1)




      if((strType === 'bln_add_perm') || (strType === 'bln_edit_perm') ||(strType === 'bln_view_perm') ||(strType === 'bln_delete_perm')||(strType === 'bln_download_perm')){

        this.lstPerms[item][this.lst_subItem[temp]][strType] = event.checked;
        // this.lstPerms[item][strType]= event.checked;


      }




      for (let temp2 = 0; temp2 <this.lst_menuItem.length; temp2++){



        this.lstPerms[item][this.lst_subItem[temp]][this.lst_menuItem[temp2]][strType] = event.checked;
        // console.log('data',this.lstPerms[i].sub_items[temp1].menu_items[temp2].bln_menu_add_perm);
        // console.log('add',this.lstPerms[i].sub_items[temp].menu_items[temp2].strType);

      }


    }
  }
  mainChangedSub(event,item,subItem,strType){


    this.lst_menuItem = Object.keys(this.lstPerms[item][subItem])
    let index = this.lst_menuItem.indexOf('id')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('name')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('levelTwoClicked')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('sub_status')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('view_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_edit_perm')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_delete_perm')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_view_perm')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_download_perm')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('add_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('edit_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('delete_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('download_disabled')
    this.lst_menuItem.splice(index,1)
    index = this.lst_menuItem.indexOf('bln_add_perm')
    this.lst_menuItem.splice(index,1)


    for(var temp = 0; temp < this.lst_menuItem.length; temp++){
      // console.log('second',strType,i,j,temp);




      if((strType === 'bln_add_perm') || (strType === 'bln_edit_perm') ||(strType === 'bln_view_perm') ||(strType === 'bln_delete_perm')||(strType === 'bln_download_perm')){
        this.lstPerms[item][subItem][this.lst_menuItem[temp]][strType] = event.checked;


      }

    }

  }
  menuItemChanged(event,item,subItem,menuItem,strType){
    let blnmenuAllChecked = true;
    
      if((strType ==='bln_add_perm')) {
   
      
        this.dictMenuItems[subItem].forEach(element => {
          
          if(!this.lstPerms[item][subItem][element]['bln_add_perm']){

              blnmenuAllChecked= false;
              return;
              
          }
         
        });
        
        
      }
      else if((strType ==='bln_edit_perm')){

        this.dictMenuItems[subItem].forEach(element => {
          
          if(!this.lstPerms[item][subItem][element]['bln_edit_perm']){

              blnmenuAllChecked= false;
              return;
              
          }
         
        });
       
      }
      else if((strType ==='bln_view_perm')){

        this.dictMenuItems[subItem].forEach(element => {
          
          if(!this.lstPerms[item][subItem][element]['bln_view_perm']){

              blnmenuAllChecked= false;
              return;
              
          }
         
        });
      

      }
      else if((strType ==='bln_delete_perm')){

        this.dictMenuItems[subItem].forEach(element => {
          
          if(!this.lstPerms[item][subItem][element]['bln_delete_perm']){

              blnmenuAllChecked= false;
              return;
              
          }
         
        });
      


      }
      else if((strType ==='bln_download_perm')){

        this.dictMenuItems[subItem].forEach(element => {
          
          if(!this.lstPerms[item][subItem][element]['bln_download_perm']){

              blnmenuAllChecked= false;
              return;
              
          }
         
        });
      


      }
    this.lstPerms[item][subItem][strType] = blnmenuAllChecked;
    
    
  }

  companyChanged(item){
 
    
    this.intCompanyId = item.id;
    this.strCompany = item.name;
    this.data = { role: Number(this.intCompanyId) };
    this.getPermissionList(this.data);

  }
  getPermissionList(data) {

   
    this.serverService.postData("user_groups/get_category_list/",data).subscribe(res => {
      const result = res;

      if (result.status === 1) {
        this.lstPerms = result['data']
        // for (const i of result.data) {
        //   this.lstTableData.push(i);
        // }
        // this.dataSource = new MatTableDataSource(this.lstTableData);
      } else {
        swal.fire("Error", result['data'], "error");
      }
    });
  }

  levelOneClicked(item){
  


      this.lst_subItem = Object.keys(this.lstPerms[item]);
      let index = this.lst_subItem.indexOf('id')
      this.lst_subItem.splice(index,1)
      index = this.lst_subItem.indexOf('name')
      this.lst_subItem.splice(index,1)
      index = this.lst_subItem.indexOf('levelOneClicked')
      this.lst_subItem.splice(index,1)
      this.dictMenuItems = {}
      for(var temp = 0; temp < this.lst_subItem.length; temp++){
        // console.log('sub',this.lst_subItem[temp]);

        this.lst_menuItem = Object.keys(this.lstPerms[item][this.lst_subItem[temp]])
       
        

        let indexmenu = this.lst_menuItem.indexOf('id')
        this.lst_menuItem.splice(indexmenu,1)
        indexmenu = this.lst_menuItem.indexOf('name')
        this.lst_menuItem.splice(indexmenu,1)
        indexmenu = this.lst_menuItem.indexOf('sub_status')
        this.lst_menuItem.splice(indexmenu,1)
        indexmenu = this.lst_menuItem.indexOf('view_disabled')
        this.lst_menuItem.splice(indexmenu,1)
        indexmenu = this.lst_menuItem.indexOf('bln_edit_perm')
        this.lst_menuItem.splice(indexmenu,1)
        indexmenu = this.lst_menuItem.indexOf('bln_delete_perm')
        this.lst_menuItem.splice(indexmenu,1)
        indexmenu = this.lst_menuItem.indexOf('bln_view_perm')
        this.lst_menuItem.splice(indexmenu,1)
        indexmenu = this.lst_menuItem.indexOf('bln_download_perm')
        this.lst_menuItem.splice(indexmenu,1)
        indexmenu = this.lst_menuItem.indexOf('add_disabled')
        this.lst_menuItem.splice(indexmenu,1)
        indexmenu = this.lst_menuItem.indexOf('edit_disabled')
        this.lst_menuItem.splice(indexmenu,1)
        indexmenu = this.lst_menuItem.indexOf('delete_disabled')
        this.lst_menuItem.splice(indexmenu,1)
        indexmenu = this.lst_menuItem.indexOf('download_disabled')
        this.lst_menuItem.splice(indexmenu,1)
        indexmenu = this.lst_menuItem.indexOf('bln_add_perm')
        this.lst_menuItem.splice(indexmenu,1)
        indexmenu = this.lst_menuItem.indexOf('levelTwoClicked')
        this.lst_menuItem.splice(indexmenu,1)
        this.dictMenuItems[this.lst_subItem[temp]]= this.lst_menuItem;
        

        
      }



      // if(this.lstPerms[item]['levelOneClicked'] == true){
        this.lstPerms[item]['levelOneClicked']= !this.lstPerms[item]['levelOneClicked'];
        for(let temp=0 ; temp< this.lst_subItem.length;temp++){
          if(this.lstPerms[item][this.lst_subItem[temp]]['levelTwoClicked']==true){
            this.lstPerms[item][this.lst_subItem[temp]]['levelTwoClicked']= !this.lstPerms[item][this.lst_subItem[temp]]['levelTwoClicked'];
          }
        }
      // }

      // else{
      //   this.lstPerms[item]['levelOneClicked']=this.blnLevelOne;
      // }

      // this.lst_subItem = Object.keys(this.lstPerms[item]);
      // console.log('lst_subItem',this.lst_subItem);
      // index = this.lst_subItem.indexOf('id')
      // this.lst_subItem.splice(index,1)
      // index = this.lst_subItem.indexOf('name')
      // this.lst_subItem.splice(index,1)
      // if(this.lst_subItem.indexOf('levelOneClicked') > -1){
      //   index = this.lst_subItem.indexOf('levelOneClicked');
      //   this.lst_subItem.splice(index,1);
      // }

      
  }

  levelTwoClicked(item,subItem){



        this.lstPerms[item][subItem]['levelTwoClicked'] = !this.lstPerms[item][subItem]['levelTwoClicked']

        // this.lst_subItem = Object.keys(this.lstPerms[item]);
        // let index = this.lst_subItem.indexOf('id')
        // this.lst_subItem.splice(index,1)
        // index = this.lst_subItem.indexOf('name')
        // this.lst_subItem.splice(index,1)
        // index = this.lst_subItem.indexOf('levelOneClicked')
        // this.lst_subItem.splice(index,1)
        // console.log('subItem',this.lst_subItem);


          // console.log('sub',this.lst_subItem[temp]);

          this.lst_menuItem = Object.keys(this.lstPerms[item][subItem])


          let indexmenu = this.lst_menuItem.indexOf('id')
          this.lst_menuItem.splice(indexmenu,1)
          indexmenu = this.lst_menuItem.indexOf('name')
          this.lst_menuItem.splice(indexmenu,1)
          indexmenu = this.lst_menuItem.indexOf('sub_status')
          this.lst_menuItem.splice(indexmenu,1)
          indexmenu = this.lst_menuItem.indexOf('view_disabled')
          this.lst_menuItem.splice(indexmenu,1)
          indexmenu = this.lst_menuItem.indexOf('bln_edit_perm')
          this.lst_menuItem.splice(indexmenu,1)
          indexmenu = this.lst_menuItem.indexOf('bln_delete_perm')
          this.lst_menuItem.splice(indexmenu,1)
          indexmenu = this.lst_menuItem.indexOf('bln_view_perm')
          this.lst_menuItem.splice(indexmenu,1)
          indexmenu = this.lst_menuItem.indexOf('bln_download_perm')
          this.lst_menuItem.splice(indexmenu,1)
          indexmenu = this.lst_menuItem.indexOf('add_disabled')
          this.lst_menuItem.splice(indexmenu,1)
          indexmenu = this.lst_menuItem.indexOf('edit_disabled')
          this.lst_menuItem.splice(indexmenu,1)
          indexmenu = this.lst_menuItem.indexOf('delete_disabled')
          this.lst_menuItem.splice(indexmenu,1)
          indexmenu = this.lst_menuItem.indexOf('download_disabled')
          this.lst_menuItem.splice(indexmenu,1)
          indexmenu = this.lst_menuItem.indexOf('bln_add_perm')
          this.lst_menuItem.splice(indexmenu,1)
          indexmenu = this.lst_menuItem.indexOf('levelTwoClicked')
          this.lst_menuItem.splice(indexmenu,1)

         






  }


  saveGroup() {
    // let validation = true;
    let compid = 0;
    let dctTempData={}

    if (this.intCompanyId > 0) {
      compid = this.intCompanyId;
    } else {
      compid = this.companyId;
    }

    const data = { group_name: "", group_data: [], company_id: compid };
    if (this.strName.trim() == null) {
      swal.fire("Group Name", "Enter a group name", "error");
      return false;
    } 
    else if (!/^[a-zA-Z]+[\s]*/g.test(this.strName.trim())) {
      swal.fire("Group Name", "Enter a group name", "error");
      return false;
    }
    else if(!this.strCode){
      swal.fire("Code", "Enter a group code", "error");
      return false;
    }
    else if (this.companyId === 0 ) {
      swal.fire("Company", "Select a company", "error");
      return false;
    }
    else if(!this.intDepartmentId){
      Swal.fire('Error!',"Select Department","error");
      return false;
    } 
    else if(this.lstDesc.length==0){
      Swal.fire('Error!',"Enter Job Description","error");
      return false;
    }
    else if(this.intNoticePeriod<0){
      Swal.fire('Error!',"Enter valid notice period in days","error");
      return false;
    }
    dctTempData['intDepartmentId']=this.intDepartmentId;
    let strAgeLimit;
    if (this.intAgeFrom && this.intAgeTo){
      strAgeLimit=(this.intAgeFrom).toString()+'-'+this.intAgeTo.toString();

    }
    dctTempData["fltExp"]=this.fltExp;
    dctTempData["strAgeLimit"]=strAgeLimit;
    dctTempData["lstQualifications"]=this.lstQualifications;
    dctTempData["lstDesc"]=this.lstDesc;
    dctTempData["intAgeFrom"]=this.intAgeFrom;
    dctTempData["intAgeTo"]=this.intAgeTo;
    dctTempData["intNoticePeriod"]=this.intNoticePeriod;
    dctTempData["group_code"]=this.strCode;
    dctTempData["group_name"] = this.strName.trim();
    dctTempData["group_data"] = this.lstPerms;
    dctTempData["companyName"] = compid;

    
      
    
    this.serverService.postData("user_groups/grouppadd/",dctTempData).subscribe(res => {
      if (res.status === 1) {
          swal.fire("Group Added", res['data'], "success");

      localStorage.setItem('previousUrl','/group/listgroup');
          
      this.router.navigate(["/group/listgroup"]);
      } else {
          swal.fire("Group Add Failed", res['data'], "error");
        }
      });
    
    // else {
    //   swal("Group Name", "Enter a group name", "error");
    // }
  }
  addDesc() {
    this.lstDesc.push("");
  }
  deleteDesc(index){
    let lstLen;
    lstLen=this.lstDesc.length;
    if(!(lstLen==1)){
      this.lstDesc.splice(index,1);
    }
    else{
     this.lstDesc=[];
     this.lstDesc.push("")
     }
  }
  pushToDesc(index,desc){
    this.lstDesc[index]=desc;

    
  }

}
