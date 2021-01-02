import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-jobposition',
  templateUrl: './jobposition.component.html',
  styleUrls: ['./jobposition.component.css']
})
export class JobpositionComponent implements OnInit {

  intDepartmentId=null;
  lstDepartment=[];
  strDesignationName='';
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
  strDesc;
  lstDesc: string[]=[""];
  intNoticePeriod;
  descg;

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
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {


        //_______________________setting up permissions___________________________
        // this.lstPermission = JSON.parse(localStorage.getItem("permission"));    
        // this.lstPermission.forEach((item, index, array) => {
        //   if (item["NAME"] == "Designation ") {
        //     this.blnAdd = item["ADD"];
        //     this.blnView = item["VIEW"];
        //     this.blnEdit = item["EDIT"];
        //     this.blnDelete = item["DELETE"];
        //   }
        // });
        //_______________________setting up permissions___________________________
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
    
    else if(this.lstDesc.length==0){
      Swal.fire('Error!',"Enter Job Description","error");
      return false;
    }
    else if(this.intNoticePeriod<0){
      Swal.fire('Error!',"Enter valid notice period in days","error");
      return false;
    }
    dctTempData['intDepartmentId']=this.intDepartmentId;
    dctTempData['strDesignationName']=this.strDesignationName;
    dctTempData['intApplyTo']=this.strApplyTo;
    if(this.strApplyTo=='0') {
      dctTempData['lstAreaId']=this.lstSelectedStates
    }
    else if(this.strApplyTo=='2'){
      dctTempData['lstAreaId']=this.lstSelectedZones;
    }
    else if(this.strApplyTo=='1'){
      dctTempData['lstAreaId']=this.lstSelectedTerritories
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
    this.serverService.postData('job_position/add_job/',dctTempData)
    .subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status === 1) {
          Swal.fire('Job Position added successfully');
          if(this.blnView){
            this.router.navigate(["/job-position/jobpositionlist"]);
          }
          else{
            this.clearFields();
          }

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
  clearFields(){
    this.intDepartmentId=null;
    this.strDesignationName='';
    this.strApplyTo='0';
    this.lstSelectedStates=[];
    this.lstSelectedZones=[];
    this.lstSelectedTerritories=[];
    this.lstDesc=[''];
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
