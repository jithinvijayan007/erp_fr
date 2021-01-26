import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import * as moment from 'moment' ;
import { matTooltipAnimations } from '@angular/material/tooltip';

@Component({
  selector: 'app-set-add-deduct',
  templateUrl: './set-add-deduct.component.html',
  styleUrls: ['./set-add-deduct.component.css']
})
export class SetAddDeductComponent implements OnInit {

  blnAddAddition = 'true';
 dictData = {};

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  // filteredCharges: Observable<string[]>;
  filteredCharges = [];
  ccCharges: string[] = [];
  allFruits: string[] = ['bggg','gjhgj'];

  lstName = ['ADDITION','DEDUCTION']


  strAddition='';
  data;
  blnShow=true;
  disable=false;
  strName='';
  intId;
  validationStatus=true;
  strCcCharge ='';




  lstItem = []
  IntItemId;
  strItem='';
  selectedItem=[];
  itemSelected=[];

  lstBranch = []
  lstContentsCopy=[];
  lstContents = [];
  blnBranch = false;
  datFrom;
  datTo;
  selectedDateFrom='';
  selectedDateTo = '';

  searchCharge: FormControl = new FormControl();

  @ViewChild('itemId') itemId: ElementRef;
  @ViewChild('fruitInput', { static: true }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;

  constructor(
    private serviceObject: ServerService,  
    public router: Router,
    private toastr: ToastrService,



  ) { 
    // this.filteredCharges = this.fruitCtrl.valueChanges.pipe(
    //   startWith(null),
    //   map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }

  ngOnInit() {
    this.blnAddAddition = localStorage.getItem('blnAddAddition');
    
    this.datFrom = new Date()
    this.datTo = new Date();
//////////////////////////////////////////

if(this.blnAddAddition == 'true'){
  this.dictData = {};
  this.dictData['intToolId'] = null;
 

}
else{
  this.dictData = {};
  this.dictData['intToolId'] = localStorage.getItem('addDectId');
}


this.serviceObject.postData('tool_settings/tool_api/',this.dictData).subscribe(
  (response) => {
      if (response.status == 1)
      {
        // this.toolData=response['data'];
    
        
        if(response['data']['additions']){
          this.ccCharges= response['data']['additions'];
        }
          
         if(response['data']['dat_from'] == null){
          this.datFrom = new Date()
          this.datTo = new Date();
         }
         else{
          this.datFrom = response['data']['dat_from'];
          this.datTo = response['data']['dat_to'];
        
         }
         if(this.blnAddAddition == 'true'){
          this.datFrom = new Date()
          this.datTo = new Date();
         }
       

        if(response['data']['content']){
          this.lstContents = response['data']['content'];
         
        }
        else{
          
          this.lstContents = [];
        }
     
          
        // this.toolName = this.toolData['vchr_tool_name'];
        // this.lstContentsCopy = JSON.parse(JSON.stringify(this.toolData['content']));
        
       
      
          // this.blnShowData=true;
        
      //  this.branchListApi()
    
        
      }  
      
      else if (response.status == 0) 
      {
      //  this.blnShowData=false;
     
      }
  },
  (error) => {   
   swal.fire('Error!','Something went wrong!!', 'error');
  });
  




////////////////////////////////////////







    if(localStorage.getItem('action')=='view'){
      this.disable=true;
    }
    this.getData();


    this.searchCharge.valueChanges
      .pipe(debounceTime(400))
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        // this.filteredCharges = [];
        // filteredCharges: Observable<string[]>;
        // this.filteredCharges = [];
      } else {
        if (strData.length >= 1) {
          this.serviceObject
            .postData('accounts_map/additions_typeahead/', { term: strData })
            .subscribe(
              (response) => {
                this.filteredCharges = response['data'];
                // this.filteredCharges = [{name:'dfdjhfd',id:1},{name:'dfdhjgfd',id:78}]

              }
            );

        }
      }
    }
    ); 

  }

  getData(){
    if(this.blnAddAddition == 'true'){
      this.intId = null;
    }
    else{
      this.intId=localStorage.getItem('addDectId');
    }
    
    this.serviceObject.postData('tool_settings/add_deduct/',{intToolId:this.intId}).subscribe(
      (response) => {
          if (response.status == 1)
          {
            this.strAddition='';
            this.data=response['data'];
     
             if(this.data.length != 0 ){
              this.strName= this.data[0]['vchr_tool_name'];
            
              let strData=this.data[0]['jsn_data'];
             }
         
            
             
            
          
            
            // let strLen=strData.length;
            // let i=0;
            
            // strData.map(element=>{
            //   i++;
            //   if(i==strLen){
            //   this.strAddition+=element
            //   }
            //   else{
            //     this.strAddition+=element+','
            //   }
            // })
            this.branchData();
          }  
          
          else if (response.status == 0) 
          {
          //  this.blnShow=false;
           Swal.fire('Error!',response['reason'], 'error');
          }
      },
      (error) => {   
       Swal.fire('Error!','Something went wrong!!', 'error');
      });

  }

  checkValidations(){

    this.validationStatus=true;
    if ( !/^[a-zA-Z\s ]*$/g.test(this.strName)) {
      this.validationStatus = false ;
        Swal.fire('Error!','Only alphabets and white spaces are allowed for name','error');
      }
    else if ( !/^[a-zA-Z\s, ]*$/g.test(this.strAddition)) {
      this.validationStatus = false ;
        Swal.fire('Error!','Only alphabets,white spaces and commas are allowed','error');
    }

    for (let index = 0; index < this.strAddition.length; index++) {
      if(this.strAddition[index]==','){
        if(index==this.strAddition.length-1){
          this.validationStatus = false ;
          Swal.fire('Error!','Invalid string','error');
        }
        else if(this.strAddition[index+1]==','){
          this.validationStatus = false ;
          Swal.fire('Error!','Invalid string, please seperate strings by single commas','error');
        }
        
      }
      
    }
    if(this.ccCharges.length == 0){
      this.validationStatus = false ;
      Swal.fire('Error!','Invalid Additions','error');
    }
    if (this.datFrom > this.datTo || (!this.datFrom) || (!this.datTo) )  {
  
      swal.fire({
        position: "center",
        type: "error",
        text: "Please select correct date period",
        showConfirmButton: true,
      });
      this.validationStatus = false ;
    }
    if(this.lstContentsCopy.length == 0){
      this.validationStatus = false ;
      Swal.fire('Error!','Branch is not selected','error');

    }


  

  }

  branchData(){
    this.serviceObject.getData('tool_settings/branchlist/').subscribe(
      (response) => {
          if (response.status == 1)
          {
            this.lstBranch=response['data'];
            this.blnBranch = true;

            this.lstBranch.forEach(element => {
          
              let blnbranch =false;
              for(let i = 0 ;i < this.lstContents.length ;  i ++){
               
                if(element.vchr_name != this.lstContents[i]){

         
                  //  element['blnClicked'] = false; 
                }
                else{
            //       // element['blnClicked'] = true;
                  blnbranch = true;
                  this.lstContentsCopy.push(element.pk_bint_id);
                  break;
                }
               
              }
              if(blnbranch == true){
                element['blnClicked'] = true;

            }
            else{
              element['blnClicked'] = false;
            } 
           
                      
              
            }); 

          }  
          
          else if (response.status == 0) 
          {
        
         
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
      });
  }

  saveData(){

    this.checkValidations();
    this.selectedDateFrom = moment(this.datFrom).format('YYYY-MM-DD')
    this.selectedDateTo = moment(this.datTo).format('YYYY-MM-DD')

    if(this.validationStatus){
    let dctData={};
    dctData['strToolName']=this.strName;
    dctData['intToolId']=this.intId;
    dctData['strValues']=this.strAddition;
    dctData['Additions'] = this.ccCharges
    dctData['Branches'] = this.lstContentsCopy;
    dctData['dateFrom'] = this.selectedDateFrom;
    dctData['dateTo'] = this.selectedDateTo;
    if(this.blnAddAddition == 'true'){
      dctData['blnUpdate'] = false;

    }
    else{
      dctData['blnUpdate'] = true;
    }
   


    this.serviceObject.putData('tool_settings/add_deduct/',dctData).subscribe(
      (response) => {
          if (response.status == 1)
          {
            Swal.fire( 'Success', 'Data saved successfully', 'success');
  localStorage.setItem('previousUrl','tools/list-tools');
            
            this.router.navigate(['tools/list-tools']);

            
          }  
          
          else if (response.status == 0) 
          {
            Swal.fire('Error!',response['reason'], 'error');

          }
      },
      (error) => {   
       Swal.fire('Error!','Something went wrong!!', 'error');
      });
    }
  }

  viewList(){    
  localStorage.setItem('previousUrl','tools/list-tools');
    
    this.router.navigate(['tools/list-tools']);

  }


  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.ccCharges.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.searchCharge.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.ccCharges.indexOf(fruit);

    if (index >= 0) {
      this.ccCharges.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    

    if(this.ccCharges.includes(event.option.viewValue)){
      this.toastr.error('already selected ');
      this.fruitInput.nativeElement.value = '';
      return;
    }
  
    this.ccCharges.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.searchCharge.setValue(null);
    this.filteredCharges = [];
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }


  isAllChecked(){
    let isAllcheck = true;

      
    for(let temp = 0 ; temp < this.lstBranch.length; temp++){

      
      if (!this.lstBranch[temp].blnClicked) {
        isAllcheck = false;
        break;
      }
     }

    if(isAllcheck == true){
      return true;
    }
    else{
      return false;
    }

    
  }
  mainChecked(event){

    if(event.checked == true){
      this.lstContentsCopy = [];
      this.lstBranch.forEach(element => {
        element.blnClicked = true;
      
        this.lstContentsCopy.push( element.pk_bint_id);
        
      });
     
    }
    else{
      this.lstBranch.forEach(element => {
        element.blnClicked = false;
        
      });
     this.lstContentsCopy =[];
    }

  }


  subChanged(event,data){
   
  
    
   
    if(event.checked == true){
      this.lstContentsCopy.push(data);

    }
    else{
      const index: number = this.lstContentsCopy.indexOf(data);
      if (index !== -1) {
        this.lstContentsCopy.splice(index, 1);
    }
    // this.allChecked = false;
    this.isAllChecked()  
    }
   
    // console.log(this.lstContentsCopy,'contents')
  

  }

  

}
