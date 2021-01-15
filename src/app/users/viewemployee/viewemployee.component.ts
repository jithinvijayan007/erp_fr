import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import { Router} from '@angular/router';
import * as moment from 'moment'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-viewemployee',
  templateUrl: './viewemployee.component.html',
  styleUrls: ['./viewemployee.component.css']
})
export class ViewemployeeComponent implements OnInit {
  panelOpenState = true;
  intEmployeeId=null;
  lstEmployeeDetails=[];
  datDOB;
  datDOJ;
  showModalZoom;
  hostName;
  blnProfessionExpand =false;
  lstReference=[];
  lstFamilyDetails=[];
  lstEduDetails=[];
  lstExpDetails=[];
  
  lstfunctions=[];

  dctAllowance={
    "bln_esi":true,
    "bln_pf":true,
    "bln_gratuity":true,
    "bln_wwf":true,
    "bln_tds":true
  }
  strCategoryName='';
  intCategoryId=null;
  selectedCategory='';
  selectedCategoryId=null;
  fltGrossPay = 0;
  fltCTC = 0;
  dctSalarySplit={};
  intSalaryStructure;
  strSalaryStructName='';
  intCostToCompany=null;
  intNetSalary=null;
  fltCharity=0;
  fltTds = 0;
  blnCtcBreakup = false;
  blnShowCTCBreakup = false;
  dctDocuments = {};
  str_products =[];
  constructor(
    private serverService: ServerService,
    public router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService


     ) { }

  ngOnInit() {
    let strDepartment = localStorage.getItem('strDepartment');
    let Name =localStorage.getItem('Name')
    if (strDepartment == 'HR & ADMIN' ||  Name=='Super User'){
      this.blnShowCTCBreakup =true;
    }
    this.intEmployeeId=localStorage.getItem("intEmployeeId");
    this.hostName = this.serverService.hostAddress
    this.hostName = this.hostName.slice(0, this.hostName.length - 1)
    this.viewEmployeeDetails();
  }

  viewEmployeeDetails(){
    this.lstEmployeeDetails=[];
    this.spinner.show();
    this.serverService.getData('user/adduser/?id='+this.intEmployeeId).subscribe(
      (response) => {
        this.spinner.hide();
          if (response['status'] == 1) {
            this.lstEmployeeDetails=response['lst_userdetailsview'];
            this.dctDocuments = this.lstEmployeeDetails[0]['json_documents'];
            this.lstReference=response['lstRefDetails'];
            this.datDOB=moment(this.lstEmployeeDetails[0]['dat_dob']).format('DD-MM-YYYY');
            this.datDOJ=moment(this.lstEmployeeDetails[0]['dat_doj']).format('DD-MM-YYYY');
            this.lstEduDetails=response['lstEduDetails'];
            this.lstExpDetails=response['lstExpDetails'];
            this.lstFamilyDetails=response['lstFamilyDetails'];
            // console.log(response)
            this.lstfunctions=response['lstfunctions'];
            // console.log(this.lstfunctions);

            if (this.lstfunctions.length > 0){
              
              this.str_products = this.lstfunctions.map(data => data.vchr_name)
             }

            this.strCategoryName=this.lstEmployeeDetails[0].fk_category__vchr_name;
            this.selectedCategory=this.lstEmployeeDetails[0].fk_category__vchr_name;
            this.selectedCategoryId=this.lstEmployeeDetails[0].fk_category_id;
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
            this.getSalarySplit();
           

          }  
      },
      (error) => {   
        this.spinner.hide();
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }

  BackClicked(){
    if(this.lstEmployeeDetails[0].is_active){
      this.router.navigate(['/employee/listemployee'])
    }
    else{
      this.router.navigate(['/employee/resignedlist'])
    }

    
    
  }
  openzoomimage(zoomimage) {
    this.showModalZoom= this.modalService.open(zoomimage, { size: 'lg' })
  }
  activateEmployee(){
   
    const dctData = {}
    dctData['intEmployeeId'] = this.intEmployeeId;

    this.serverService.postData('user/activate_user/',dctData).subscribe(
      (response) => {
          if (response.status == 1) {
            Swal.fire('Success!', 'Employee activated Successfully', 'success');
            this.router.navigate(["/employee/resignedlist/"]);

          }  
      },
      (error) => {   
        Swal.fire('Error!','Something went wrong!!', 'error');
        
      });


  }
  professionExpand(){
    this.blnProfessionExpand = !this.blnProfessionExpand;
    
  }

  getSalarySplit(){
  
    // if(this.blnOnload){
      this.dctSalarySplit = {}
  
      if(this.lstEmployeeDetails[0].hasOwnProperty('dct_salary_details')){
        this.dctSalarySplit=this.lstEmployeeDetails[0]['dct_salary_details'];
        

      }
      this.blnCtcBreakup = this.dctSalarySplit.hasOwnProperty('BP_DA'); //new change

      this.CTCBreakupchanged();
      // this.blnOnload=false;
    // }
    // else{
    //   let dctData = {};
    //   dctData['intCategoryId'] = this.selectedCategoryId;
    //   dctData['intSalaryStructId'] = this.intSalaryStructure;
    //   dctData['dctAllowances'] = this.dctAllowance;
    //   dctData['fltGrossPay'] = this.fltGrossPay;
    //   dctData['intEmployeeId'] = this.intEmployeeId;
    //   if (this.selectedCategory.toUpperCase() == 'EMPLOYEE' && 
    //   this.intSalaryStructure && this.fltGrossPay !=0) {
       
        
    //     this.serverService.postData('user/salarysplit/', dctData).subscribe(
    //       (response) => {
    //         if (response['status'] == 1){
    //         this.dctSalarySplit = response['data'];
    //         this.fltCTC = response['dbl_cost_to_company'];
    //         // this.blnCtcBreakup = this.dctSalarySplit.hasOwnProperty('BP_DA');    //newchange
    //         this.fltCharity = this.dctSalarySplit['Deductions']['Charity'];
    //         this.CTCBreakupchanged();
    //         }
    //         else if(response['status'] == 0){
    //           Swal.fire('Error!', response['msg'], 'error');
  
    //         }
    //       },
    //       (error) => {
    //         Swal.fire('Error!', 'error', 'error');
    
    //       });
    //   }
    // }

    
  }
  CTCBreakupchanged(){

    let tempGrossPay: number = this.fltGrossPay;
     if (Object.keys(this.dctSalarySplit).length != 0) {
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
      if(Number(this.dctSalarySplit['FixedAllowance'])){
        allowanceTot=allowanceTot+Number(this.dctSalarySplit['FixedAllowance']);
        tempGrossPay=tempGrossPay+Number(this.dctSalarySplit['FixedAllowance']);
      }
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
      this.intCostToCompany=Number(this.fltGrossPay)+Number(allowanceTot);
     }
      
  }

  ViewFile(fileName){
    window.open(this.serverService.hostAddress + 'media/' + fileName.split('/media/')[1], '_blank');
  }

}
