// import * as tableData from './../../table/smart-table/smart-data-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-additemcategory',
  templateUrl: './additemcategory.component.html',
  styleUrls: ['./additemcategory.component.css']
})
export class AdditemcategoryComponent implements OnInit {

  dctData={}
  strCategory:''
  tabCount;
  intTaxId;
  // dctData['lstSpecification']=["front cam", "water proof"]
  
  curIndex;
  blnStatus

  strHSN = '';
  strSAC = '';

  @ViewChild('idCategory', { static: true }) idCategory: any;
  @ViewChild('idHSN', { static: true }) idHSN: any;
  @ViewChild('idSAC', { static: true }) idSAC: any;

  ngOnInit(){
    // this.dctData['lstTaxMaster']=['asdd','qwerty','asdfg','zxcv']
    // this.dctData['lstSpec']=['ghj','ert','gfj','loi']

    this.tabCount=0
    this.dctData['lstTaxSelect']=[{
      strTax:'',
      intTaxId:null,
      intPerc:null
    }]
    this.dctData['tax']=[]
    this.dctData['lstSpecSelect']=[]
    this.blnStatus=true
    this.getData()
  }
  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,) {
      
     }
     getData(){
      this.serviceObject.getData('itemcategory/get_item_category/').subscribe(
        (response) => {
            if (response.status == 1) {
             this.dctData['lstTaxMaster']=response['ins_tax'];
             this.dctData['lstSpec']=response['ins_specification'];
            }  
        },
        (error) => {   
          swal.fire('Error!','Something went wrong!!', 'error');
          
        });
        
     } 

     taxChange(event){
      this.blnStatus=true
       
      this.dctData['lstTaxSelect'].forEach(element => {
        if(element.strTax==event && element.intTaxId)
        {
          this.blnStatus=false
          return false
        }
        else{
          this.dctData['lstTaxMaster'].forEach(element => {
            if(element.vchr_name==event){
              this.intTaxId=element.pk_bint_id
            }
          });
          
        }
      });

    
       
     }

    //  taxClick(index){
    //   this.curIndex=index
    //  }

     specChange(event)
     {
       
       this.dctData['lstSpecSelect']=[]
       
        for(let item of event)
        {
          this.dctData['lstSpec'].forEach(element => {
            if(element.vchr_name==item){
              this.dctData['lstSpecSelect'].push(element.pk_bint_id)
            }
          });
        
        }
        
     
     }
 
     addTax(index)
     {

       if(!this.blnStatus){
        swal.fire('Error!','Already Selected', 'error');
        return false
       }
       else if(!this.dctData['lstTaxSelect'][index]['intPerc']){
        swal.fire('Error!','Enter Percentage', 'error');
        return false
       }
       else{
        this.tabCount=this.tabCount+1
        //  this.dctData['lstTaxMasterCopy'].splice(this.curIndex,1)
           this.dctData['lstTaxSelect'].push({
            'strTax':'',
            'intTaxId':null,
            'intPerc':null
           })
           this.dctData['lstTaxSelect'][index]['intTaxId']=this.intTaxId
           this.dctData['tax'].push(this.dctData['lstTaxSelect'][index])
    
       }
       
     }

    closeTab(index)
    {
      
      this.dctData['tax'].splice(index,1);
      this.dctData['lstTaxSelect'].splice(index,1);
      this.tabCount=this.tabCount-1
    }
    addCategory(){
      if(!this.strCategory){
        // swal.fire('Error!', 'Enter Category Name', 'error');
        this.idCategory.nativeElement.focus();
        this.toastr.error('Enter Category Name', 'Error!');
        return false;
      }
      else if (!this.strHSN && !this.strSAC) {
        // this.idHSN.nativeElement.focus();
        this.toastr.error('Enter HSN/SAC code', 'Error!');
        return false;
      // }else if(!this.strSAC) {
      //   this.idSAC.nativeElement.focus();
      //   this.toastr.error('Enter valid SAC code', 'Error!');
      //   return false;
      }
      else{
        
        let dctPushData={}
        let data={}

        dctPushData['lstTax']=[]
        dctPushData['lstSpec']=[]
        
        this.dctData['tax'].forEach(element => {
          data[element.intTaxId]=parseInt(element.intPerc);
          dctPushData['lstTax'].push(data)
          data={}
        });
        dctPushData['lstSpec']=this.dctData['lstSpecSelect']
        dctPushData['strName']=this.strCategory
        dctPushData['vchr_hsn_code'] = this.strHSN
        dctPushData['vchr_sac_code'] = this.strSAC
        
        

        this.serviceObject.postData('itemcategory/add_category/',dctPushData).subscribe(
          (response) => {
              if (response.status == 1) {
                swal.fire({
                  position: "center", 
                  type: "success",
                  text: "Data saved successfully",
                  showConfirmButton: true,  
                });  
    localStorage.setItem('previousUrl','item/itemcategorylist');
                   
              this.router.navigate(['item/itemcategorylist']);
                

              }  
              else if(response.status == 0){
                swal.fire({
                  position: "center", 
                  type: "error",
                  text:"Item category already exists",
                  showConfirmButton: true,  
                });  
              }
          },
          (error) => {   
          
          swal.fire('Error!','Something went wrong!!', 'error');
            
          });

        
        
      }
    }
    cancel(){
      this.strCategory=''
      this.strHSN = '';
      this.strSAC = '';
      this.blnStatus=true
      this.dctData['lstTaxSelect']=[{
        strTax:'',
        intTaxId:null,
        intPerc:null
      }]
      this.intTaxId=null
      this.dctData['lstSpecSelect']=[]
      this.tabCount=0
      this.dctData['tax']=[]
      this.dctData['lstSpecification']=[]
    }
}
