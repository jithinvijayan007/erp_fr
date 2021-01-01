import { Component, OnInit } from '@angular/core';
import { ServerService } from "../../server.service";
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-jobpositionedit',
  templateUrl: './jobpositionedit.component.html',
  styleUrls: ['./jobpositionedit.component.css']
})
export class JobpositioneditComponent implements OnInit {

  intDepartmentId=null;
  lstDepartment=[];
  strDesignationName='';
  strApplyTo='';
  lstStatesData=[];
  lstZonesData=[];
  lstTerritoryData=[];
  lstSelectedStates=[];
  lstSelectedZones=[];
  lstSelectedTerritories=[];
  intJobPositionId=null;
  lstJobPositionData=[]
  fltExp=null;
  intAgeFrom=null;
  intAgeTo=null;
  lstQualifications=[];
  strDesc;
  lstDesc: string[]=[""];

  intNoticePeriod;


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
  
  constructor(
    private serverService: ServerService,
    public router: Router,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit() {
    
    this.intJobPositionId=localStorage.getItem('intJobId')
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
    
            
            this.getJobPositionData();
  }
  getJobPositionData(){
    this.spinner.show();
    this.serverService.getData('job_position/add_job/?id='+this.intJobPositionId).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstJobPositionData=response['lst_job_position'];
            for(let item of this.lstJobPositionData){
              if(item.pk_bint_id==(this.intJobPositionId)){
                this.strDesignationName=item['vchr_name'];
                if(item['int_area_type']!=null){
                  this.strApplyTo=(item['int_area_type'].toString());
                }
                this.intDepartmentId=item['fk_department_id'];
                if(item['int_area_type']==0){
                  this.lstSelectedStates=item['json_area_id']
                } else if(item['int_area_type']==1){
                  this.lstSelectedTerritories=item['json_area_id'];
                } else if(item['int_area_type']==2){
                  this.lstSelectedZones=item['json_area_id']
                }
                this.fltExp=item['dbl_experience'];
                this.intAgeFrom=item['int_age_from'];
                this.intAgeTo=item['int_age_to'];
                this.lstQualifications=item['json_qualification'];
                if(item['json_desc']){
                  this.lstDesc=item['json_desc'];
                }
                this.intNoticePeriod = item['int_notice_period']

              }
            }
          }  
      },
      (error) => { 
        this.spinner.hide();  
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }
  savePosition(){    
    let dctTempData={}
    if(!this.intDepartmentId){
      Swal.fire('Error!',"Select Department","error");
      return false;
    }
    else if(!this.strDesignationName){
      Swal.fire('Error!',"Fill the Designation Name field","error");
      return false;
    }
   
    
    dctTempData['intDepartmentId']=this.intDepartmentId;
    dctTempData['strDesignationName']=this.strDesignationName;
    dctTempData['intApplyTo']=this.strApplyTo;
    dctTempData['intJobId']=this.intJobPositionId;
    if(this.strApplyTo=='0') {
      dctTempData['lstAreaId']=this.lstSelectedStates
    }
    else if(this.strApplyTo=='2'){
      dctTempData['lstAreaId']=this.lstSelectedZones;
    }
    else if(this.strApplyTo=='1'){
      dctTempData['lstAreaId']=this.lstSelectedTerritories
    }
    if(this.lstDesc.length==0){
      Swal.fire('Error!',"Enter Job Description","error");
      return false;
    }
     if(this.intNoticePeriod<0){
      Swal.fire('Error!',"Enter valid notice period in days","error");
      return false;
    }
    let strAgeLimit;
    if (this.intAgeFrom && this.intAgeTo){
      strAgeLimit=(this.intAgeFrom).toString()+'-'+this.intAgeTo.toString();

    }
    dctTempData['fltExp']=this.fltExp;
    dctTempData['strAgeLimit']=strAgeLimit;
    dctTempData['lstQualifications']=this.lstQualifications;
    dctTempData['lstDesc']=this.lstDesc;
    dctTempData['intAgeFrom']=this.intAgeFrom;
    dctTempData['intAgeTo']=this.intAgeTo;
    dctTempData['intNoticePeriod']=this.intNoticePeriod;
    this.spinner.show();
    this.serverService.putData('job_position/add_job/',dctTempData)
    .subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status === 1) {
          Swal.fire('Designation added successfully');
          this.router.navigate(["/job-position/jobpositionlist"]);

        } else if (response.status === 0) {
          if(response.hasOwnProperty('reason')){
            Swal.fire(response['reason']);
          }
          else if(response.hasOwnProperty('message')){ 
            Swal.fire(response['message']);
          }
        }

      },
    (error) => {
      this.spinner.hide();
      // console.log('response');

    });
  }
  goBacktoList(){
    this.router.navigate(["/job-position/jobpositionlist"]);
  }
  applyToChanged(){
    // console.log("applyToChanged",this.strApplyTo);
    this.lstSelectedStates=[];
    this.lstSelectedTerritories=[];
    this.lstSelectedZones=[];
    
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
