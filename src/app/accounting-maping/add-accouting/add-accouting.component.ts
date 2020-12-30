import { Component, OnInit,ViewChild} from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-accouting',
  templateUrl: './add-accouting.component.html',
  styleUrls: ['./add-accouting.component.css']
})
export class AddAccoutingComponent implements OnInit {


  @ViewChild('comapnyId') comapnyId: any;

  accountForm: FormGroup;
  strModuleName = '';
  lstBranch=[];
  selectedBranch ='';
  intBranchId;
  strBranch= '' ;

  selectedCategory = '';
  lstCategory= [];
  strCategory = '';
  intCategoryId;

  selectedChartOfAcc = '';
  lstChart = [];
  intChartId;
  strChart = '';

  searchBranch: FormControl = new FormControl();
  searchCategory: FormControl = new FormControl();
  searchChartofAccount: FormControl = new FormControl();


  constructor(
              private serviceObject: ServerService, 
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              public router: Router,
  ) { }

  ngOnInit() {

    this.accountForm = this.formBuilder.group({
      module: ['', Validators.required],
     
      });

      this.searchBranch.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstBranch = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('branch/branch_typeahead/',{term:strData})
              .subscribe(
                (response) => {
                  this.lstBranch = response['data'];
                }
              );

          }
        }
      }
      );

      this.searchCategory.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstCategory = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('accounts_map/category_typehead/',{term:strData})
              .subscribe(
                (response) => {
                  this.lstCategory = response['data'];
                }
              );

          }
        }
      }
      );

      this.searchChartofAccount.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstChart = [];
        } else {
          if (strData.length >= 1) {
            this.serviceObject
              .postData('accounts_map/chartofaccounts_typehead/',{term:strData})
              .subscribe(
                (response) => {
                  this.lstChart = response['data'];
                }
              );

          }
        }
      }
      );
  }

  BranchChanged(item){
    this.intBranchId = item.id;
    this.strBranch = item.name;
    this.selectedBranch== item.name;
  }
  CategoryChanged(item){
    // this.intCategoryId = item.id;
    this.strCategory = item.name;
    this.selectedCategory== item.name;
  }
  ChartChanged(item){
    this.intChartId = item.id;
    this.strChart = item.name;
    this.selectedChartOfAcc== item.name; 
  }
  AddAccount(){
    if(this.strModuleName == ''){
      this.toastr.error('Enter a module name', 'Error!');
      return ;
    }
    else if(this.selectedCategory == ''){
      this.toastr.error('Select Valid category', 'Error!');
      return ;
    }
    else if(this.selectedCategory != this.strCategory ){
      this.toastr.error('Select Valid category', 'Error!');
      return ;
    }
    else if(this.selectedBranch == ''){
      this.toastr.error('Select Valid branch', 'Error!');
      return ;
    }
    else if(this.selectedBranch != this.strBranch){
      this.toastr.error('Select Valid branch', 'Error!');
      return ;
    }
    else if(this.selectedChartOfAcc == ''){
      this.toastr.error('Select Valid chart of accounts', 'Error!');
      return ;
    }
    else if(this.selectedChartOfAcc != this.strChart){
      this.toastr.error('Select Valid chart of accounts', 'Error!');
      return ;
    }
    else{
     let dctData = {};

     dctData['vchr_module_name'] = this.strModuleName;
     dctData['vchr_category'] = this.strCategory;
     dctData['int_branch_id'] = this.intBranchId;
     dctData['int_chart_of_acc'] = this.intChartId;
     dctData['int_type'] = 1;


      this.serviceObject.postData('accounts_map/accounts_map/',dctData).subscribe(
        (response) => {
          if (response.status == 1) {
            swal.fire({
              position: "center",
              type: "success",
              text: "Data saved successfully",
              showConfirmButton: true,
            });
            localStorage.setItem('previousUrl','accounting/listaccouting');
            this.router.navigate(['accounting/listaccouting']);
          }
          else if (response.status == 0) {
            swal.fire('Error!', response['reason'], 'error');
          }
        },
        (error) => {
          swal.fire('Error!','Something went wrong!!', 'error');

        }
      );
    }


  }
  clearFields(){
    this.strModuleName='';
    this.selectedCategory = '';
    this.intCategoryId=null;
    this.strChart = '';
    this.intBranchId=null;
    this.strBranch = '';
    this.selectedBranch = '';
    this.intChartId = null;
    this.strChart = '';
    this.selectedChartOfAcc = ''; 

  }

}
