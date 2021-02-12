import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from "moment"
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-shift-exemption',
  templateUrl: './shift-exemption.component.html',
  styleUrls: ['./shift-exemption.component.css']
})
export class ShiftExemptionComponent implements OnInit {
  lstDepartment=[];
  intDepartmentId=null;
  strDept;
  lstDesignationData=[];
  intDesignationId=null;
  // intDesignationEditId =null;
  strDesig=null;
  lstBranch=[];
  intBranchId=null;
  strBranch;
  searchEmployee: FormControl = new FormControl();
  lstEmployeeData=[];
  selectedEmployee='';
  selectedEmployeeId=null;
  lstEmpSelected=[];
  lstSelectedEmpId=[];
  strEmployee='';
  @ViewChild('empId',{'static':false}) empId: ElementRef;
  @ViewChild('strDropType',{'static':false}) strDropType: ElementRef 
  lstType=["Individual","Department","Designation","Branch"]
  typeConfig = {displayKey:'vchr_name',search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Select Type',searchOnKey: 'vchr_name',clearOnSelection: true  }
  deptConfig = {displayKey:'vchr_name',search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Select Department',searchOnKey: 'vchr_name',clearOnSelection: true  }
  desigConfig = {displayKey:'vchr_name',search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Select Designation',searchOnKey: 'vchr_name',clearOnSelection: true  }
  branchConfig = {displayKey:'vchr_name',search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Select Branch',searchOnKey: 'vchr_name',clearOnSelection: true  }
  excludeDayConfig = {displayKey:'vchr_name',search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Select Day',searchOnKey: 'vchr_name',clearOnSelection: true  }
  excludeDayWeekConfig = {displayKey:'name',search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Select Week',searchOnKey: 'name',clearOnSelection: true  }

  lstFilteredEmp=[];
  lstExemptEmpId=[];
  lstExemptedEmpId = [];
  lstRemoveEmpId = [];
  

  datFrom=new Date();
  datTo=null;
  strType='';
  blnAllChecked=false;
  lstSelectedDeptId=[];
  lstSelectedDesigId=[];
  lstSelectedBranchId=[];
  strExcludeType="";
  datExclude=null;
  lstExDay=[];
  lstExWeek=null;
  lstExWeek1=[];
  lstDayWeek=[
  {'name':'ALL','value':0},
  {'name':'1st Week','value':1},
  {'name':'2nd week','value':2},
  {'name':'3rd week','value':3},
  {'name':'4th week','value':4},
  {'name':'5th week','value':5},
  ];
  lstDays=[
    "SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"
  ];
  minDate= new Date();
  minToDate=(new Date().getDate()+1)

  constructor(
    private serverService: ServerService,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit() {
    //--------------------department list dropdown ----------------//
    this.serverService.getData('department/list_departments/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstDepartment=this.lstDepartment.concat(response['lst_department']);
          }  
      },
      (error) => {   
        
      });
    //--------------------department list dropdown ends ----------------// 
    

     //-------------------Branch dropdown-------------------------//
    this.serverService.getData('branch/add_branch/').subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstBranch=response['lst_branch'];
          }  
        },
        (error) => {   
      });
  //-------------------branch dropdown ends-------------------------//
    //--------------------designation list dropdown ----------------//
    this.serverService.putData('job_position/list/',{'lstDepartmentId':this.lstSelectedDeptId}).subscribe(
      (response) => {
          if (response.status == 1) {
            this.lstDesignationData[0]={fk_department__vchr_name: null,fk_department_id: null,int_area_type: null,pk_bint_id: 0,vchr_name: "ALL"}
            this.lstDesignationData=this.lstDesignationData.concat(response['lst_job_position']);
          }  
        },
        (error) => {   
      });
    //--------------------desigantion list dropdown ends ----------------// 
  
    this.searchEmployee.valueChanges
    // .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lstEmployeeData = [];
      } else {
        let dctTemp={};
          if(this.intDepartmentId){
            dctTemp['intDeptId'] = this.intDepartmentId;
          }
          if(this.intDesignationId){
            dctTemp['intDesigId']=this.intDesignationId;
          }
          if(this.intBranchId){
            dctTemp['intBranchId']=this.intBranchId;
          }
        if (strData.length >= 1) {
          dctTemp['strTerm']=strData;
          this.serverService
            .postData('attendance_fix/user_typeahead/', dctTemp)
            .subscribe(
              (response) => {
                this.lstEmployeeData = response['data'];
              }
            );
        }
      }
    }
    ); 
  }
  typeChanged(event) {
    // console.log(event,"typechanged",this.strType);
    this.lstSelectedBranchId=[];
    this.lstSelectedDeptId=[];
    this.lstSelectedDesigId=[];
    this.lstSelectedEmpId=[];
    this.strBranch=[];
    this.strDept=[];
    this.strDesig=[];
    this.strEmployee=null;
    
  }
  deptChanged(event){
    // console.log(this.strDept);
    this.lstSelectedDeptId=[];
    event.value.map((item)=>{
      this.lstSelectedDeptId.push(item.pk_bint_id.toString())
    })
    // console.log(this.lstSelectedDeptId,"selectedId");
    
    
    // this.intDepartmentId = this.strDept['pk_bint_id'];

    if(this.strType=='Individual'){
      this.lstDesignationData=[];
      this.strDesig=[];
      this.lstSelectedDesigId=[];
      this.serverService.putData('job_position/list/',{'lstDepartmentId':this.lstSelectedDeptId}).subscribe(
        (response) => {
            if (response.status == 1) {
              this.lstDesignationData[0]={fk_department__vchr_name: null,fk_department_id: null,int_area_type: null,pk_bint_id: 0,vchr_name: "ALL"}
              this.lstDesignationData=this.lstDesignationData.concat(response['lst_job_position']);
             //  if(this.intDesignationEditId){
             //    this.lstDesignationData.forEach(element => {
             //      if(element['pk_bint_id'] == this.intDesignationEditId ){
             //        this.strDesig=element; 
             //        this.intDesignationId = this.strDesig['pk_bint_id']
             //      }
             //    });
             //  }else{
                this.strDesig=this.lstDesignationData[0];
                this.intDesignationId = this.strDesig['pk_bint_id']
             //  }
             //  this.intDesignationEditId=null
            }  
          },
          (error) => {   
        });
    }
    //  this.getEmployees();
  }
  desigChanged(event){
    // console.log(event,"desig");
    this.lstSelectedDesigId=[];
    event.value.map((item)=>{
      this.lstSelectedDesigId.push(item.pk_bint_id.toString())
    })
    
    // this.intDesignationId = this.strDesig['pk_bint_id']
    // this.getEmployees();
  }
  branchChanged(event){
    // console.log(event,"branch");
    this.lstSelectedBranchId=[];
    event.value.map((item)=>{
      this.lstSelectedBranchId.push((item.pk_bint_id.toString()))
    })
    this.intBranchId = this.strBranch['pk_bint_id']
    // this.getEmployees();
  }
  addEmployee (event) {
    if (this.lstEmpSelected.filter(x => x.intId === event.intId).length === 0) {
      this.lstEmpSelected.push(event);
      this.lstSelectedEmpId.push((event.intId).toString());
    }
    this.strEmployee = '';
    this.empId.nativeElement.value = '';
    this.lstEmployeeData=[];
    
  }
  removeEmployee(value) {
    
    const index = this.lstEmpSelected.indexOf(value);
    const index2 = this.lstSelectedEmpId.indexOf((value.intId).toString());
  if (index > -1) {
    this.lstEmpSelected.splice(index, 1);
  }
  if (index2 > -1) {
    this.lstSelectedEmpId.splice(index2, 1);
  }
  this.lstEmployeeData=[];
  }
  getEmployees(){
    let dctData={};

    if(!this.datFrom){
      Swal.fire("Error!","Enter From Date","error");
      return false;
    }
    if(!this.datTo){
      Swal.fire("Error!","Enter To Date","error");
      return false;
    }

    if(this.lstSelectedDeptId.length>0){
      dctData['lstDeptId'] = this.lstSelectedDeptId;
    }
    if(this.lstSelectedDesigId.length>0){
      dctData['lstDesigId']=this.lstSelectedDesigId;
    }
    if(this.lstSelectedBranchId.length>0){
      dctData['lstBranchId']=this.lstSelectedBranchId;
    }
    if(this.lstSelectedEmpId.length!=0){
      dctData['lstEmpId']=this.lstSelectedEmpId;
    }
    dctData['strType']=this.strType;
    dctData['datFrom']=moment(this.datFrom).format('YYYY-MM-DD');
    dctData['datTo']=moment(this.datTo).format('YYYY-MM-DD');

    this.spinner.show();
    this.serverService
    .postData('shift_schedule/shift_exemption/', dctData)
    .subscribe(
      (response) => {
        this.spinner.hide();
        this.lstFilteredEmp = response['data'];
        // this.lstExemptEmpId = response['lst_exempt_id'];
        this.lstExemptedEmpId = JSON.parse(JSON.stringify(response['lst_exempt_id']))
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  setData(){
    // if((this.intDepartmentId== null || this.intDepartmentId== undefined) &&
    //   (this.intDesignationId== null || this.intDesignationId== undefined) &&
    //   (this.intBranchId== null || this.intBranchId== undefined) &&
    //   (this.lstSelectedEmpId.length ==0)){
    //     Swal.fire("Error!","Select atleast one employee","error");
    //     return false;
    // }
    if(this.lstExemptEmpId.length == 0 && this.blnAllChecked== false){
      Swal.fire("Error!","Select atleast one employee","error");
      return false;
    }
    if(this.blnAllChecked== true && (this.lstFilteredEmp.length == this.lstExemptedEmpId.length)){
      Swal.fire("Error!","Already exempted employees","error");
      return false;
    }
    let dctData={};
    if(this.lstSelectedDeptId.length>0){
      dctData['lstDeptId'] = this.lstSelectedDeptId;
    }
    if(this.lstSelectedDesigId.length>0){
      dctData['lstDesigId']=this.lstSelectedDesigId;
    }
    if(this.lstSelectedBranchId.length>0){
      dctData['lstBranchId']=this.lstSelectedBranchId;
    }
    if(this.lstSelectedEmpId.length!=0){
      dctData['lstEmpId']=this.lstSelectedEmpId;
    }
     if(this.lstRemoveEmpId.length!=0){
      dctData['lstRemoveEmpId']=this.lstRemoveEmpId;
     }
     if(!this.datFrom){
       Swal.fire("Error!","Enter From Date","error");
       return false;
     }
     dctData['datFrom']=moment(this.datFrom).format('YYYY-MM-DD');
     if(this.datTo){
       dctData['datTo']=moment(this.datTo).format('YYYY-MM-DD');
     }
    //  if(this.strExcludeType=='date' && !this.datExclude){
    //   Swal.fire("Error!","Enter Date to be Excluded","error");
    //   return false;
    // }
    if(this.blnAllChecked) {
      let lstData=[];
      this.lstFilteredEmp.map( (element) =>{
        if(!this.lstExemptedEmpId.includes(element.intId)){
          lstData.push(element.intId)
        }
      } );
      dctData['lstExemptEmpId']=lstData;

    }
    else{
      dctData['lstExemptEmpId']=this.lstExemptEmpId;
    }
    

      dctData['strType']=this.strType;
      dctData['blnAllChecked']=this.blnAllChecked;
      // dctData['strExcludeType']=this.strExcludeType;
      // dctData['strExcludeDate']=moment(this.datExclude).format('YYYY-MM-DD');
      // dctData['lstExludeDay']=this.lstExDay;
      // dctData['strExDayType']=this.lstExWeek;
      dctData['lstExemptedEmpId']=this.lstExemptedEmpId

      // console.log(dctData,"dctdata");
    
    this.spinner.show();
    this.serverService.putData('shift_schedule/shift_exemption/', dctData)
    .subscribe((response) => {

      this.spinner.hide();
      if(response['status']){
        Swal.fire("Success!","Successful","success");
        this.clearFields();
      }
      else if(response['status']==0){
        Swal.fire("Error!",response['message'],"error");
      }

      },
      (error)=>{
        this.spinner.hide();
        Swal.fire("Error!","Something went wrong!","error");
      }
    );
  }
  checkBoxChange(event,intId){
    // console.log(this.lstExemptedEmpId);
    if(event){
      if(!this.lstExemptEmpId.includes(intId)){
        this.lstExemptEmpId.push(intId);
      }
    }
    else{
      const index = this.lstExemptEmpId.indexOf(intId, 0);
        if (index > -1) {
          if(this.lstExemptedEmpId.includes(this.lstExemptEmpId[index])){
            this.lstRemoveEmpId.push(this.lstExemptEmpId[index])
          }
          
          this.lstExemptEmpId.splice(index, 1);
         }
    }
         
    // if(!event){
    //   this.lstExemptEmpId.push(intId);
    // }
    // else{
    //   const index = this.lstExemptEmpId.indexOf(intId, 0);
    //     if (index > -1) {
    //       if(this.lstExemptedEmpId.includes(this.lstExemptEmpId[index])){
    //         this.lstRemoveEmpId.push(this.lstExemptEmpId[index])
    //       }
          
    //       this.lstExemptEmpId.splice(index, 1);
    //      }
    // }
  }
  clearFields(){
    // console.log(this.strType,"strtype");

    this.intDepartmentId=null;
    this.intDesignationId=null;
    this.strDept=null;
    this.strDesig=null;
    this.lstEmpSelected=[];
    this.lstExemptEmpId=[];
    this.lstSelectedEmpId = [];
    this.lstFilteredEmp =[];
    this.intBranchId = null;
    this.strBranch = null;
    this.lstSelectedBranchId=[];
    this.lstSelectedDeptId=[];
    this.lstSelectedDesigId=[];
    this.strType='';
    this.typeConfig = {displayKey:'vchr_name',search:true , height: '200px',customComparator: ()=>{} ,placeholder:'Select Type',searchOnKey: 'vchr_name',clearOnSelection: true  }
    this.strDropType['_value']='';
    this.datFrom=new Date();
    this.datTo=null;
  }
  allBoxChecked(event) {
    // console.log(event,"allbox");
    
    if(this.blnAllChecked){
      // if(this.lstExemptedEmpId.length>0){
      //   this.blnAllChecked=false;
      //   event.source.checked=false;
      //   Swal.fire({title:"Warning",text:"Cannot Select All as there is already exempted employess",type:"warning",timer:2000});
      //   return false;
      // }
      this.lstFilteredEmp.map((data)=>{
        data.blnChecked=true;
      })
    }
    else{
      this.lstFilteredEmp.map((data)=>{
        if(!this.lstExemptedEmpId.includes(data.intId)){
          data.blnChecked=false;
        }

      })
    }
  }
  exDayChanged(event) {
    // console.log("eventday",event);
    
  }
  exWeekChanged(event) {
    // console.log("eventweek",event);
    this.lstExWeek=[]
    this.lstExWeek1.forEach(element => {
      this.lstExWeek.push((element.value.toString()))
    });
    
  }
  isAllChecked() {
    
    let blnTrue=true;
    for(let element of this.lstFilteredEmp){
      
      if(!element.blnChecked){
        blnTrue=false;
        break
      }
    }
    if(blnTrue){
      this.blnAllChecked=true
      return true;
    }
    else{
      this.blnAllChecked=false;
      return false;
    }
    
  }
}
