
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { id } from '@swimlane/ngx-datatable/release/utils';
import { log } from 'util';

@Component({
  selector: 'app-editgroup',
  templateUrl: './editgroup.component.html',
  styleUrls: ['./editgroup.component.css']
})
export class EditgroupComponent implements OnInit {

  // strName= '';
  // companyId = Number(localStorage.getItem("companyId"));
  // userType = localStorage.getItem("staff");
  // public form: FormGroup;
  
  // searchCompany: FormControl = new FormControl();
  // lstCompany = [];
  // intCompanyId:number=null;
  // strCompany='';
  // lstPerms = {};
  // data = {};
  // dctPerms={};
  // dctPermsCopy={};
  // lstPermKeys=[]
  // blnCheckbox = true;
  // blnLevelOne=true;
  // blnLevelTwo =true;
  // blnLevelThree =true;
  // lstSubItem=[];
  // lstMenuItem=[];
  // groupId: any;
  // constructor(
  //   private serverService: ServerService,
  //   public toastr: ToastrService,
  //   public router: Router,
  //   private fb: FormBuilder,
  // ) { }

  // ngOnInit() {
  //   this.groupId = localStorage.getItem("groupId");
  //   this.data = { operation: "load", group_id: this.groupId };
  //   if (this.userType === "superuser") {
  //     this.data["role"] = this.userType;
  //   } else {
  //     this.data['company_id'] = this.companyId;
  //   }

  //   this.searchCompany.valueChanges
  //   .debounceTime(400)
  //   .subscribe((strData: string) => {
  //     if (strData === undefined || strData === null) {
  //       this.lstCompany = [];
  //     } else {
        
  //       if (strData.length >= 3) {
  //         this.serverService
  //           .postData('company/company_typeahead/', { term: strData })
  //           .subscribe(
  //             (response) => {
  //               this.lstCompany = response['data'];
  
  //             }
  //           );
  //       }
  //     }
  //   }
  //  );

  //  this.serverService.postData("user_groups/groupedit/",this.data).subscribe(res => {
  //   const result = res;
  //   if (result['status'] === 0) {
  //     this.strName = result['group'];
  //     // this.department = result.int_department;
  //     // this.strSelectedCompany =
  //     //   result.company.code + " - " + result.company.name;
  //     // this.intCompanyId = result[company.id;
  //     this.lstPerms = result['perms'];
  //     this.dctPerms=result['perms'];
  //     this.dctPermsCopy=result['perms'];
  //     this.lstPermKeys = Object.keys(this.dctPerms)

      
  //   } else {
  //     swal.fire("Error", result['data'], "error");
  //   }
  // });

  // }

  // isAllChecked(i, strType){
  //   var blnTrue = true;
  //   var blnIsAllDisable = true;
  //   // let lst_subItem = this.dctPerms[i]['data']

  //   // console.log("isallChecked,i",i,"strType",strType);
    

  //     // for(var temp = 0; temp < this.lstSubItem.length; temp++){
      
  //     //   let op = strType.split('_')[1]
  //     //   if((!this.lstPerms[i].sub_items[temp]['sub_status'] && !this.lstPerms[i].sub_items[temp]['sub_status'])){
  //     //     blnTrue = false;
  //     //     break;
  //     //   }
        
  //     //   let op = strType.split('_')[1]
  //     //   if((!this.lstSubItem[temp][op+'_disabled'] && !this.lstSubItem[temp]['bln_'+op+'_perm'])){
  //     //     blnTrue = false;
  //     //     break;
  //     //   }
  //     //   if(!this.lstSubItem[temp][op+'_disabled']){
  //     //     blnIsAllDisable = false;
  //     //   }


      
  //     // }

  //     for(let temp in this.dctPerms[i]['data']){
  //       for(let temp2 in this.dctPerms[i]['data'][temp]['items'] ){
  //     //     let op = strType.split('_')[1]
  //     //     if((!lst_subItem[temp]['items'][key][op+'_disabled'] && !lst_subItem[temp]['items'][key]['bln_'+op+'_perm'])){
  //     //       blnTrue = false;
  //     //       break;
  //     //     }
  //     //     if(!lst_subItem[temp]['items'][key][op+'_disabled']){
  //     //       blnIsAllDisable = false;
  //     //     }


  //     if((strType == 'bln_add_perm' && !this.dctPerms[i]['data'][temp]['items'][temp2]['bln_add_perm'])){
  //       blnTrue = false;
  //       break;
  //     }
  //     if((strType == 'bln_edit_perm' && !this.dctPerms[i]['data'][temp]['items'][temp2]['bln_edit_perm'])){
  //       blnTrue = false;
  //       break;
  //     }
  //     if((strType == 'bln_view_perm' && !this.dctPerms[i]['data'][temp]['items'][temp2]['bln_view_perm'])){
  //       blnTrue = false;
  //       break;
  //     }
  //     if((strType == 'bln_delete_perm' && !this.dctPerms[i]['data'][temp]['items'][temp2]['bln_delete_perm'])){
  //       blnTrue = false;
  //       break;
  //     }
  //       }
  //     }



   

  //   if(blnTrue){
  //     return true;
  //   }
  //   else{
  //     return false;
  //   }
  // }

  // isAllCheckedSub(i,j,strType) {
  //   // console.log('j',j);

  //   var blnTrueSub = true;
  //   var blnIsAllDisablesub =true;
  //   let lst_subItem=this.dctPerms[i]['data'];
  //   let lst_menuItem=this.dctPerms[i]['data'][j]['items']
  //   // for (let temp = 0; temp < this.lstSubItem.length; temp++) {
  //   //   let op = strType.split('_')[1]
     
  //    for(let temp2 in lst_menuItem){
    
  //     // let op = strType.split('_')[1]
      
  //     // if((!lst_menuItem[temp2][op+'_disabled'] && !lst_menuItem[temp2]['bln_'+op+'_perm'])){
  //     //   console.log("lstmenuitemtemp2",lst_menuItem[temp2]);
        
  //     //   blnTrueSub = false;
  //     //   break;
  //     // }
  //     // if(!lst_menuItem[temp2][op+'_disabled']){
  //     //   blnIsAllDisablesub = false;
  //     // }

  //     if((strType == 'bln_add_perm' && !this.dctPerms[i]['data'][j]['items'][temp2]['bln_add_perm'])){
  //       blnTrueSub = false;
  //       break;
  //     }
  //     if((strType == 'bln_edit_perm' && !this.dctPerms[i]['data'][j]['items'][temp2]['bln_edit_perm'])){
  //       blnTrueSub = false;
  //       break;
  //     }
  //     if((strType == 'bln_view_perm' && !this.dctPerms[i]['data'][j]['items'][temp2]['bln_view_perm'])){
  //       blnTrueSub = false;
  //       break;
  //     }
  //     if((strType == 'bln_delete_perm' && !this.dctPerms[i]['data'][j]['items'][temp2]['bln_delete_perm'])){
  //       blnTrueSub = false;
  //       break;
  //     }

  //   //  }
  //   }

  //   if(blnTrueSub){
  //     this.dctPerms[i]['data'][j][strType]=true
  //     return true;
  //   }
  //   else{
  //     this.dctPerms[i]['data'][j][strType]=false
  //     return false;
  //   }
  // }

  // isAllDisabled(i, strType){
  //   var blnIsAllDisable = true;

  //   let lst_subItem = this.dctPerms[i]['data']
  //   // let index = this.lst_subItem.indexOf('id')
  //   // this.lst_subItem.splice(index,1)
  //   // index = this.lst_subItem.indexOf('name')
  //   // this.lst_subItem.splice(index,1)
  //   // index = this.lst_subItem.indexOf('levelOneClicked')
  //   // this.lst_subItem.splice(index,1)

  //   for(let key in lst_subItem){

      
  //     for(let item in this.dctPerms[i]['data'][key]['items']){

  //       if((strType == 'bln_add_perm' && !this.dctPerms[i]['data'][key]['items'][item]['add_disabled'])){
  //         blnIsAllDisable = false;
  //         break;
  //       }
  //       if((strType == 'bln_edit_perm' && !this.dctPerms[i]['data'][key]['items'][item]['edit_disabled'])){
  //         blnIsAllDisable = false;
  //         break;
  //       }
  //       if((strType == 'bln_view_perm' && !this.dctPerms[i]['data'][key]['items'][item]['view_disabled'])){
  //         blnIsAllDisable = false;
  //         break;
  //       }
  //       if((strType == 'bln_delete_perm' && !this.dctPerms[i]['data'][key]['items'][item]['delete_disabled'])){
  //         blnIsAllDisable = false;
  //         break;
  //       }
  
  //     }

  //   }

  //   if(blnIsAllDisable){
  //     return true;
  //   }
  //   else{
  //     return false;
  //   }
  // }

  // isAllDisabledSub(i,j, strType) {
  //   var blnIsAllDisablesub= true;
  //   // this.blnIsAllDisablesub = true;
  //   let lst_menuItem=this.dctPerms[i]['data'][j]['items']
    
  //   for (let temp1 = 0; temp1 < lst_menuItem.length; temp1++) {
  //     // for (let temp1 = 0; temp1 < this.lstMenuItem.length; temp1++) {
        
       
  //     if((strType == 'bln_add_perm' && !lst_menuItem[temp1]['add_disabled'])){
  //       blnIsAllDisablesub = false;
  //       break;
  //     }
  //     if((strType == 'bln_edit_perm' && !lst_menuItem[temp1]['edit_disabled'])){
  //       blnIsAllDisablesub = false;
  //       break;
  //     }
  //     if((strType == 'bln_view_perm' && !lst_menuItem[temp1]['view_disabled'])){
  //       blnIsAllDisablesub = false;
  //       break;
  //     }
  //     if((strType == 'bln_delete_perm' && !lst_menuItem[temp1]['delete_disabled'])){
  //       blnIsAllDisablesub = false;
  //       break;
  //     }
  //   //  }
  //   }
  //   if (blnIsAllDisablesub) {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }

  // mainChanged(event, i, strType){
   
    
  //   for(let temp in this.dctPerms[i]['data']){


  //     if((strType === 'bln_add_perm' && !this.dctPerms[i]['data'][temp]['add_disabled']) ||
  //        (strType === 'bln_edit_perm' && !this.dctPerms[i]['data'][temp]['edit_disabled']) ||
  //        (strType === 'bln_view_perm' && !this.dctPerms[i]['data'][temp]['view_disabled']) ||
  //        (strType === 'bln_delete_perm' && !this.dctPerms[i]['data'][temp]['delete_disabled'])){
  //       this.dctPerms[i]['data'][temp][strType] = event.checked;
  //       this.dctPerms[i][strType]= event.checked;
  //     }
  //     for (let temp2 in this.dctPerms[i]['data'][temp]['items']){

  //       this.dctPerms[i]['data'][temp]['items'][temp2][strType] = event.checked;
  //       // console.log('data',this.lstPerms[i].sub_items[temp1].menu_items[temp2].bln_menu_add_perm);
  //       // console.log('add',this.lstPerms[i].sub_items[temp].menu_items[temp2].strType);
        
  //     }

  //   }
  //   console.log("dctperms main",this.dctPerms);
    
  // }
  // mainChangedSub(event, i,j, strType){
  //     // console.log('second',strType,i,j,temp);
      
  //     for (let temp in this.dctPerms[i]['data'][j]['items']){


  //     if((strType === 'bln_add_perm' && !this.dctPerms[i]['data'][j]['items'][temp]['add_disabled']) || 
  //        (strType === 'bln_edit_perm' && !this.dctPerms[i]['data'][j]['items'][temp]['edit_disabled']) ||
  //        (strType === 'bln_view_perm' && !this.dctPerms[i]['data'][j]['items'][temp]['view_disabled']) ||
  //        (strType === 'bln_delete_perm' && !this.dctPerms[i]['data'][j]['items'][temp]['delete_disabled'])){
  //       this.dctPerms[i]['data'][j]['items'][temp][strType] = event.checked;
  //     }

  //   }
  //   console.log("dctperms sub",this.dctPerms);
    

  // }
  // menuItemChanged(event,i,j,subItem,strType){
  //   let blnmenuAllChecked = true;
  //   for (let temp2 in this.dctPerms[i]['data'][j]['items']){
  //     if((strType ==='bln_add_perm' && !this.dctPerms[i]['data'][j]['items'][temp2]['bln_add_perm'])){
  //       blnmenuAllChecked= false;
  //       break;
  //     }
  //     else if((strType ==='bln_edit_perm' && !this.dctPerms[i]['data'][j]['items'][temp2]['edit_disabled'])){
  //       blnmenuAllChecked= false;
  //       break;
  //     }
  //     else if((strType ==='bln_view_perm' && !this.dctPerms[i]['data'][j]['items'][temp2]['view_disabled'])){
  //       blnmenuAllChecked= false;
  //       break;
  //     }
  //     else if((strType ==='bln_delete_perm' && !this.dctPerms[i]['data'][j]['items'][temp2]['delete_disabled'])){
  //       blnmenuAllChecked= false;
  //       break;
  //     }
  //     else{
  //       blnmenuAllChecked =true;
  //     }
      

  //   }
  //   // console.log('bln',blnmenuAllChecked);
    
  //   this.dctPerms[i]['data'][j][strType] = blnmenuAllChecked;
  //   console.log("dctperms submenu",this.dctPerms);
    
  // }

  // companyChanged(item){
    
  //   this.intCompanyId = item.id;
  //   this.strCompany = item.name;
  //   this.data = { role: Number(this.intCompanyId) };
  //   this.getPermissionList(this.data);

  // }
  // getPermissionList(data) {
   

  //   this.serverService.postData("groups/get_category_list/",data).subscribe(res => {
  //     const result = res;

  //     if (result.status === 0) {
  //       this.lstPerms = result['data']
  //       // for (const i of result.data) {
  //       //   this.lstTableData.push(i);
  //       // }
  //       // this.dataSource = new MatTableDataSource(this.lstTableData);
  //     } else {
  //       swal.fire("Error", result['data'], "error");
  //     }
  //   });
  // }

  //   levelOneClicked(item,i){
  //     console.log("item",item);
  //     console.log("lstsubItem",this.dctPerms[i]['data']);
  //     this.lstSubItem=[];
      
  
  //     if(this.dctPerms[i]['levelOneClicked']){
  //       this.lstSubItem=[]

  //       this.dctPerms[i]['levelOneClicked'] = !this.dctPerms[i]['levelOneClicked'];

  //     }
     
  //     else{
  //       this.lstSubItem=this.dctPerms[i]['data'];
  //       this.dctPerms[i]['levelOneClicked']=this.blnLevelOne;
  //     }
    
  
  //   }

  //   levelTwoClicked(subItem,i,j){
  //     console.log("lstperms",this.dctPerms[i]['data'][j]);
      
  //     console.log("subItem",subItem,i,j);
      
  //     this.lstMenuItem=[];

  //     for(let temp=0 ; temp< this.dctPerms[i].data.length;temp++){
  //       if(this.dctPerms[i].data[temp].levelTwoClicked){
  //         this.dctPerms[i].data[temp].levelTwoClicked = !this.dctPerms[i].data[temp].levelTwoClicked;
  //       }
  //     }
      

  //     if(this.dctPerms[i]['data'][j]['levelTwoClicked']){
  //       this.dctPerms[i]['data'][j]['levelTwoClicked'] = !this.dctPerms[i]['data'][j]['levelTwoClicked'];
  //       this.lstMenuItem=[];

  //     }
  
  //     else{
  //       this.dctPerms[i]['data'][j]['levelTwoClicked']=this.blnLevelTwo;
  //       this.lstMenuItem=this.dctPerms[i]['data'][j]['items']

  //     }
  //     console.log("lstmenu",this.lstMenuItem);
      
  
    
      
  //   }


  
  // editGroup() {
  //   let validation = true;
  //   let compid = 0;
  //   if (this.intCompanyId > 0) {
  //     compid = this.intCompanyId;
  //   } else {
  //     compid = this.companyId;
  //   }
  //   const data = {
  //     operation: "edit",
  //     group_name: "",
  //     group_data: {},
  //     group_id: "",
  //     company_id: compid
  //   };
  //   if (this.strName.trim() == null) {
  //     swal.fire("Group Name", "Enter a group name", "error");
  //     validation = false;
  //   } else if (!/^[a-zA-Z]+[\s]*/g.test(this.strName.trim())) {
  //     swal.fire("Group Name", "Enter a group name", "error");
  //     validation = false;
  //   }
  //   // else if(!this.department){
  //   //   swal.fire("Department", "Select valid department", "error");
  //   //   validation = false;
  //   // }
  //   if (this.companyId === 0 ) {
  //     swal.fire("Company", "Select a company", "error");
  //     return false;
  //   }
    
  //   if (validation === true) {
  //     data["group_name"] = this.strName;
  //     // data["department"] = this.department;
  //     data["group_data"] = this.dctPerms;
  //     data["group_id"] = this.groupId;
     
  //     console.log('postdata',data);
      
  //     this.serverService.postData("user_groups/groupedit/",data).subscribe(res => {
  //       if (res.status === 0) {
  //         swal.fire("Group Added", res['data'], "success");
  //         this.router.navigate(["/group/listgroup"]);
  //       } else {
  //         swal.fire("Group Add Failed", res['data'], "error");
  //       }
  //     });
  //   } 
  // }

  // new code start

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
  groupId: any;
  intGroupId;

  constructor(
    private serverService: ServerService,
    public toastr: ToastrService,
    public router: Router,
    private fb: FormBuilder,
  ) { }



  ngOnInit() {
  
    // if (!localStorage.getItem("Tokeniser")) {
    //   this.router.navigate(["/user/sign-in"]);
    // }
     this.groupId = localStorage.getItem("groupId");
    this.data = { operation: "load", group_id: this.groupId };
    if (this.userType === "superuser") {
      this.data["role"] = this.userType;
    } else {
      this.data['company_id'] = this.companyId;
    }
    
    
    this.serverService.postData("user_groups/groupedit/",this.data).subscribe(res => {
      const result = res;

      if (result['status'] === 1) {
        this.lstPerms = result['data']
        this.lstPermsKeys = Object.keys(this.lstPerms)
        this.strName = result['dct_group']['vchr_name'];
        this.intGroupId = result['dct_group']['pk_bint_id'];
        this.strCode = result['dct_group']['vchr_code'];


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
      // else{
      //   blnmenuAllChecked =true;
      // }




    this.lstPerms[item][subItem][strType] = blnmenuAllChecked;
    
    
  }

  companyChanged(item){
  
    
    this.intCompanyId = item.id;
    this.strCompany = item.name;
    this.data = { role: Number(this.intCompanyId) };
    this.getPermissionList(this.data);

  }
  getPermissionList(data) {

    
    this.serverService.postData("groups/get_category_list/",data).subscribe(res => {
      const result = res;

      if (result.status === 0) {
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
        console.log("menuitem",this.lst_menuItem);
        

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


  // saveGroup() {
  //   let validation = true;
  //   let compid = 0;
  //   if (this.intCompanyId > 0) {
  //     compid = this.intCompanyId;
  //   } else {
  //     compid = this.companyId;
  //   }
  //   const data = { group_name: "", group_data: [], company_id: compid };
  //   if (this.strName.trim() == null) {
  //     swal.fire("Group Name", "Enter a group name", "error");
  //     validation = false;
  //   } else if (!/^[a-zA-Z]+[\s]*/g.test(this.strName.trim())) {
  //     swal.fire("Group Name", "Enter a group name", "error");
  //     validation = false;
  //   }
  //   else if(!this.strCode){
  //     swal.fire("Code", "Enter a group code", "error");
  //     validation = false;
  //   }
  //   if (this.companyId === 0 ) {
  //     swal.fire("Company", "Select a company", "error");
  //     return false;
  //   }

  //   if (validation === true) {
  //     data["group_code"]=this.strCode;
  //     data["group_name"] = this.strName.trim();
  //     // data["department"] = this.department;
  //     data["group_data"] = this.lstPerms;

  //     // console.log('postdata',data);

  //     this.serverService.postData("user_groups/grouppadd/",data).subscribe(res => {
  //       if (res.status === 1) {
  //         swal.fire("Group Added", res['data'], "success");
  //         this.router.navigate(["/group/listgroup"]);
  //       } else {
  //         swal.fire("Group Add Failed", res['data'], "error");
  //       }
  //     });
  //   }
  //   // else {
  //   //   swal("Group Name", "Enter a group name", "error");
  //   // }
  // }


    editGroup() {
    let validation = true;
    let compid = 0;
    if (this.intCompanyId > 0) {
      compid = this.intCompanyId;
    } else {
      compid = this.companyId;
    }
    const data = {
      operation: "edit",
      group_name: "",
      group_data: {},
      group_id: "",
      company_id: compid
    };
    if (this.strName.trim() == '') {
      swal.fire("Group Name", "Enter a group name", "error");
      validation = false;
    } else if (!/^[a-zA-Z]+[\s]*/g.test(this.strName.trim())) {
    
      swal.fire("Group Name", "Enter a group name", "error");
      validation = false;
    }
    if(this.strCode == ''){
      swal.fire("Group Code", "Enter a group code", "error");
      validation = false;
    }
  
    if (this.companyId== 0) {
      swal.fire("Company", "Select a company", "error");
      return false;
    }
    
    if (validation === true) {
      data["group_name"] = this.strName;
      // data["department"] = this.department;
      data["group_data"] = this.lstPerms;
      data["group_id"] = this.groupId;
      data["group_code"] = this.strCode;
      data["company_id"] = compid;

      // data[]
    
      
      this.serverService.postData("user_groups/groupedit/",data).subscribe(res => {
        if (res.status == 1) {
          swal.fire("Group Edited", res['data'], "success");
    localStorage.setItem('previousUrl','/group/listgroup');
          
          this.router.navigate(["/group/listgroup"]);
        } else {
          swal.fire("Group Edit Failed", res['data'], "error");
        }
      });
    } 
  }

}
