import { Component, OnInit } from '@angular/core';
import { ServerService } from "../../server.service";
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-editdesignation',
  templateUrl: './editdesignation.component.html',
  styleUrls: ['./editdesignation.component.css']
})
export class EditdesignationComponent implements OnInit {

  intDepartmentId = null;
  lstDepartment=[];
  strDesignationName='';
  strApplyTo='';
  lstStatesData=[];
  lstZonesData=[];
  lstTerritoryData=[];
  lstSelectedStates=[];
  lstSelectedZones=[];
  lstSelectedTerritories=[];
  intDesignationId=null;
  lstDesignationData=[]
  fltExp=null;
  intAgeFrom=null;
  intAgeTo=null;
  lstQualifications=[];
  strDesc;
  lstDesc: string[]=[""];

  intNoticePeriod;
  strCode=null;
  strName='';
  searchCompany;
  companyName;
  lstCompany = [];
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
    
    this.intDesignationId=localStorage.getItem('groupId')
    console.log("fgfhhg",this.intDesignationId);
    
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
    
            
            this.getDesignationData();
  }
  getDesignationData(){
    this.spinner.show();
    this.serverService.getData('user_groups/grouppadd/?groupId='+this.intDesignationId).subscribe(
      (response) => {
        this.spinner.hide();
          if (response.status == 1) {
            this.lstDesignationData=response['lst_job_position'];
            for(let item of this.lstDesignationData){
              if(item.pk_bint_id==(this.intDesignationId)){
                this.strCode=item['vchr_code']
                this.strName=item['vchr_name']
                // this.strDesignationName=item['vchr_name'];
                this.intDepartmentId=item['fk_department_id'];
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
  saveGroup(){    
    let dctTempData={}
    if(!this.intDepartmentId){
      Swal.fire('Error!',"Select Department","error");
      return false;
    }
    // else if(!this.strDesignationName){
    //   Swal.fire('Error!',"Fill the Designation Name field","error");
    //   return false;
    // }
   
    dctTempData['strCode']=this.strCode;
    dctTempData['strName']=this.strName;
    dctTempData['intDepartmentId']=this.intDepartmentId;
    // dctTempData['strDesignationName']=this.strDesignationName;
    // dctTempData['intApplyTo']=this.strApplyTo;
    // dctTempData['intJobId']=this.intDesignationId;
    
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
    dctTempData['groupId']=this.intDesignationId;
    dctTempData['fltExp']=this.fltExp;
    dctTempData['strAgeLimit']=strAgeLimit;
    dctTempData['lstQualifications']=this.lstQualifications;
    dctTempData['lstDesc']=this.lstDesc;
    dctTempData['intAgeFrom']=this.intAgeFrom;
    dctTempData['intAgeTo']=this.intAgeTo;
    dctTempData['intNoticePeriod']=this.intNoticePeriod;
    this.spinner.show();
    this.serverService.putData('user_groups/grouppadd/',dctTempData)
    .subscribe(
      (response) => {
        this.spinner.hide();
        if (response.status === 1) {
          Swal.fire('Designation updated successfully');
          this.router.navigate(["/group/listgroup"]);

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

    });
  }
  goBacktoList(){
    this.router.navigate(["/group/listgroup"]);
  }
  applyToChanged(){
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
