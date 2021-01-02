import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import {FormControl} from '@angular/forms';
// import { NIHTimelineComponent } from 'app/a2-components/ni-h-timeline/ni-h-timeline.component';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms'
import { log } from 'util';
import { MatTableDataSource } from '@angular/material/table';
import { ServerService } from 'src/app/server.service'
@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss']
})
export class HierarchyComponent implements OnInit {

  userType = localStorage.getItem('staff');
  companyId = Number( localStorage.getItem('companyId'));

  @ViewChild('idGroup') idGroup: ElementRef;

  displayedColumns = [ 'Hierarchy', 'Groups', 'Filters'];
  activeList = ['Yes', 'No'];
  
  toppings = new FormControl('');
  toppingList: Array<any> = [];
  
  department = "";
  lstDepartment = [];
  lstGroups = [];
  lstSelectedGroups = [];
  lstSelectedFilter = [];
  blnSelected = false;
  blnUpdate = false;

  ELEMENT_DATA = [];
  dataSource;
  // searchGroup: FormControl = new FormControl();
  // groupName = '';
  lstFilter = [];
  tempList=[];

  constructor(
    // private typeaheadObject: TypeaheadService,
    private servServ: ServerService,
    public toastr: ToastrService,
    vcr: ViewContainerRef,
    private fb: FormBuilder
  ) {
   
   }
//  this.toastr.setRootViewContainerRef(vcr);
  ngOnInit() {

    this.servServ.getData("department/list_departments/").subscribe(res => {
      this.lstDepartment = res['lst_department'];
      this.toppingList =  res['filter'];
      this.tempList =  res['filter'];
     });

    //  this.ELEMENT_DATA = [
    //   { level_id:1,Hierarchy:'Level 1',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
    //   { level_id:2,Hierarchy:'Level 2',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
    //   { level_id:3,Hierarchy:'Level 3',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
    //   { level_id:4,Hierarchy:'Level 4',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
    //   { level_id:5,Hierarchy:'Level 5',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
    //   { level_id:6,Hierarchy:'Level 6',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
    //   { level_id:7,Hierarchy:'Level 7',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
    //   { level_id:8,Hierarchy:'Level 8',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
    //   { level_id:9,Hierarchy:'Level 9',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
    //   { level_id:10,Hierarchy:'Level 10',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
      
      
    // ];
    this.setStructure();
    
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    
  }

  // setStructure(){
  //   this.ELEMENT_DATA = [
  //     { level_id:1,Hierarchy:'Level 1',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
  //     { level_id:2,Hierarchy:'Level 2',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
  //     { level_id:3,Hierarchy:'Level 3',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
  //     { level_id:4,Hierarchy:'Level 4',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
  //     { level_id:5,Hierarchy:'Level 5',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
  //     { level_id:6,Hierarchy:'Level 6',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
  //     { level_id:7,Hierarchy:'Level 7',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
  //     { level_id:8,Hierarchy:'Level 8',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
  //     { level_id:9,Hierarchy:'Level 9',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},
  //     // { level_id:10,Hierarchy:'Level 10',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},     
  //   ];

  
  // }
  setStructure() {
    this.tempList.forEach(element => {
      // let dctData = { level_id: element.int_level, Hierarchy: element.int_level, GroupsId: [], Groups: [], Filters: 'Yes', selectedGroups: [], selectedFilter: '', groupName: element.vchr_name, pk_bint_id: element.int_level },
    });
      // { level_id:10,Hierarchy:'Level 10',GroupsId:[], Groups: [],Filters: 'Yes',selectedGroups:[],selectedFilter:'',groupName:'',pk_bint_id : null},     
    


  }

  removeGroup(level,data){

    const index = this.ELEMENT_DATA[level]['Groups'].indexOf(data);
    const indexId = this.ELEMENT_DATA[level]['GroupsId'].indexOf(data.pk_bint_id);
    const indexFilter = this.lstFilter.indexOf(data.pk_bint_id);
    if (this.blnUpdate && level-1 >= 0){
      if(this.ELEMENT_DATA[level]['selectedFilter'] == '' && (this.ELEMENT_DATA[level-1]['selectedFilter'] || this.ELEMENT_DATA[level-1]['Groups'].length > 0)) {
      this.toastr.error('Remove Level '+(level-1)+' before '+(level), 'Error!');
      return false;
    }
  }
    if (index > -1 ) {
      this.ELEMENT_DATA[level]['Groups'].splice(index, 1);
    }
    if (indexId > -1) {
      this.ELEMENT_DATA[level]['GroupsId'].splice(index, 1);
    }
    if (indexFilter > -1) {
      this.lstFilter.splice(indexFilter, 1);
    }
    this.ELEMENT_DATA[level]['selectedGroups'] = [];
  }


  addGroup(level,data,event){
    
    if (level > 0 && this.ELEMENT_DATA[level-1]['Groups'].length == 0) {
      this.toastr.error('Please select groups of Level '+(level), 'Error!');
      this.ELEMENT_DATA[level]['groupName'] = '';
      this.idGroup.nativeElement.value = '';
      this.blnSelected = true;
      return false
    }else if(level > 0 && !this.ELEMENT_DATA[level-1]['selectedFilter']){
      this.toastr.error('Please select filter of Level '+(level), 'Error!');
      this.ELEMENT_DATA[level]['groupName'] = '';
      this.idGroup.nativeElement.value = '';
      this.blnSelected = true;
      return false
    }
    else{
      if (this.ELEMENT_DATA[level]['Groups'].filter(x =>x['pk_bint_id'] === data.pk_bint_id).length === 0) {
        this.ELEMENT_DATA[level]['Groups'].push(data);
        this.lstFilter.push(data.pk_bint_id)
      }
      if (this.ELEMENT_DATA[level]['GroupsId'].filter(x =>x === data.pk_bint_id).length === 0) {
        this.ELEMENT_DATA[level]['GroupsId'].push(data.pk_bint_id);
      }
      this.ELEMENT_DATA[level]['groupName'] = '';
      this.idGroup.nativeElement.value = '';
      this.blnSelected = true;
    }
    
  }

  searchGroup(level,term){
        
        if (term === undefined || term == null || term === '') {
        } else {
          // if (term.length > 2) {
          //   this.ELEMENT_DATA[level]['selectedGroups'] = [];
          //   let filter = {};
          //   filter['department'] = this.department;
          //   filter['groups'] = this.lstFilter;
          //   this.typeaheadObject
          //     .searchGroup(term,filter)
          //     .subscribe(
          //       (response: {
                  
          //         status: string;
          //         data: Array<{
          //           account: string;
          //           accountId: number;
          //         }>;
          //       }) => {
          //         if (response.data.toString() == 'Department Not selected') {
          //           this.toastr.error(response.data.toString(), 'Error!');
          //           return false
          //         }else{
          //           this.ELEMENT_DATA[level]['selectedGroups'].push(...response.data);
          //         if (this.blnSelected) {
          //           this.ELEMENT_DATA[level]['groupName'] = '';
          //         this.blnSelected = false; 
          //         }
          //         }
                  
          //       }
          //     );
          // }
        }
      
  }

  filterChanged(event,i){    
    this.ELEMENT_DATA[i]['selectedFilter'] = event.value;
    event.source.value=" ";
  }

  filterDeleted(index){
    
    swal.fire({
      title: 'delete',
      text: 'It will delete the filter permanantly?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(result1 => {
      if (result1.value) {
        this.ELEMENT_DATA[index]['selectedFilter'] = '';
        // this.toppingList=[];
        // this.toppingList=this.tempList;
      }
    });

    if (this.blnUpdate && index-1 >= 0){
    if(this.ELEMENT_DATA[index]['selectedFilter'] == '' && (this.ELEMENT_DATA[index-1]['selectedFilter'] || this.ELEMENT_DATA[index-1]['Groups'].length>0)) {
      this.toastr.error('Remove Level '+(index-1)+' before '+(index), 'Error!');
      return false;
    }
  }
  }

  departmentSelected(department){
    this.setStructure();

    this.servServ.getData("hierarchy/get_hierarchy/?int_department=" +Number(department)).subscribe(res => {
      if (res['status'] == 0 ) {
          if (res['data'] != 'No data') {
          
          this.blnUpdate = true;
          for (let index = 0; index < res['data'].length; index++) {
                
                if(this.ELEMENT_DATA[res['data'][index]['level_id']-1]['level_id'] == res['data'][index]['level_id']){
                  
                  this.ELEMENT_DATA[res['data'][index]['level_id']-1]['pk_bint_id']= res['data'][index]['id'];                 
                  this.ELEMENT_DATA[res['data'][index]['level_id']-1]['Groups'] = res['data'][index]['Groups'];
                  this.ELEMENT_DATA[res['data'][index]['level_id']-1]['GroupsId'] = res['data'][index]['GroupsId'];
                  this.ELEMENT_DATA[res['data'][index]['level_id']-1]['selectedFilter']= res['data'][index]['selectedFilter'];
                  
                  
                  
                }
          }
          this.lstFilter = res['filter'];
          }
          else{
            this.blnUpdate = false;
            this.toppings = new FormControl('');

            for (let index = 0; index < this.ELEMENT_DATA.length; index++) {
              this.ELEMENT_DATA[index]['GroupsId'] = [];
              this.ELEMENT_DATA[index]['Groups'] = [];
              this.ELEMENT_DATA[index]['selectedGroups'] = [];
              this.ELEMENT_DATA[index]['selectedFilter'] = '';
              this.ELEMENT_DATA[index]['pk_bint_id'] = null;
            }
          }
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

      }
      
     });

  }
  
  levelSave(){    

    let blnGropSelected = false;
    let blnDepSelected = false;
    if(!this.department){
      this.toastr.error('Department Not selected', 'Error!');
      return false
    }else{
      for(let iter = 0; iter<this.ELEMENT_DATA.length; iter++){

        if (this.ELEMENT_DATA[iter]['Groups'].length > 0) {
          blnGropSelected = true;
        }
        
        if (this.ELEMENT_DATA[iter]['Groups'].length == 0 || !this.ELEMENT_DATA[iter]['selectedFilter']) {
        
          if(iter+1!=this.ELEMENT_DATA.length){
          if(this.ELEMENT_DATA[iter+1]['Groups'].length > 0 || this.ELEMENT_DATA[iter+1]['selectedFilter']){             
               this.toastr.error('Please fill level'+(iter+1)+' correctly', 'Error!');
               return false

          }
          }
        }
        if((this.ELEMENT_DATA[iter]['Groups'].length > 0 && !this.ELEMENT_DATA[iter]['selectedFilter'])||(this.ELEMENT_DATA[iter]['Groups'].length == 0 && this.ELEMENT_DATA[iter]['selectedFilter'])){
          // blnDepSelected = true;
          this.toastr.error('Please fill level'+(iter+1)+' correctly', 'Error!');
          return false
        }
      }
    }

    if (!blnGropSelected) {
      this.toastr.error('Please select groups of any level', 'Error!');
      return false
    }
    // else if(blnDepSelected){
    //   this.toastr.error('Please fill level correctly', 'Error!');
    //   return false
    // }
    else{
      let dctData = {};
      dctData['int_department'] = Number(this.department);
      dctData['level'] = this.ELEMENT_DATA;
      dctData['update'] = this.blnUpdate;
      this.servServ.postData("hierarchy/save_hierarchy/",dctData)
      .subscribe(
        response => {
          if(response['status'] == 1){
            if (this.blnUpdate) {
              swal.fire('success','Updated successfully', 'success');
            }else{
              swal.fire('success','Created successfully', 'success');
            }
            
            this.levelCancel();
          }
        });
    }

  }
  
  levelCancel(){

    this.blnUpdate = false;
    this.department = '';
    this.toppings = new FormControl('');

    for (let index = 0; index < this.ELEMENT_DATA.length; index++) {
      this.ELEMENT_DATA[index]['GroupsId'] = [];
      this.ELEMENT_DATA[index]['Groups'] = [];
      this.ELEMENT_DATA[index]['selectedGroups'] = [];
      this.ELEMENT_DATA[index]['selectedFilter'] = '';
      this.ELEMENT_DATA[index]['pk_bint_id'] = null;
    }
    
    
}

}



