import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import swal from 'sweetalert2';
import { id } from '@swimlane/ngx-datatable/release/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-set-tools',
  templateUrl: './set-tools.component.html',
  styleUrls: ['./set-tools.component.css']
})
export class SetToolsComponent implements OnInit {

  toolsId = localStorage.getItem('toolsEditId');
  toolData;
  blnShowData;
  lstBranch = [];
  lstContents = [];

  allChecked = false;
  lstContentsCopy=[];
  toolsEditCode=localStorage.toolsEditCode
  blnBranch=true
  toolName = '';
  intNumber
  constructor(
    private serviceObject:ServerService,
    private router :Router
  ) { }

  ngOnInit() {

   const dictData = {};
    dictData['intToolId'] = this.toolsId;
    this.serviceObject.postData('tool_settings/tool_api/',dictData).subscribe(
      (response) => {
          if (response.status == 1)
          {
            this.toolData=response['data'];
            this.intNumber=response['data']['jsn_data']
            if(this.toolData['content']){
              this.lstContents = this.toolData['content'];
            }
            else{
              
              this.lstContents = [];
            }
         
              
            this.toolName = this.toolData['vchr_tool_name'];
            // this.lstContentsCopy = JSON.parse(JSON.stringify(this.toolData['content']));
            
           
          
            this.blnShowData=true;

            // this.toolData.forEach(element => {
            // if(element.vchr_tool_code=='MYG_CARE_NUMBER'){
              
            // }
            // else{
              // }
              // });
              if(this.toolsEditCode=='MYG_CARE_NUMBER'){
                this.blnBranch=false

              }else{
                this.blnBranch=true
                this.branchListApi()
              }
              
          }  
          
          else if (response.status == 0) 
          {
           this.blnShowData=false;
         
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
      });
      

     
  }

  branchListApi(){

    this.serviceObject.getData('tool_settings/branchlist/').subscribe(
      (response) => {
          if (response.status == 1)
          {
            this.lstBranch=response['data'];

            this.lstBranch.forEach(element => {
          
              let blnbranch =false;
              for(let i = 0 ;i < this.lstContents.length ;  i ++){
               
                if(element.vchr_name != this.lstContents[i]){

         
                  //  element['blnClicked'] = false; 
                }
                else{
                  // element['blnClicked'] = true;
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

  

  }

  editTools(){


    const dictData= {}
  
    if(this.blnBranch){

      dictData['intToolId'] = this.toolsId;
      dictData['strToolName'] = this.toolData['vchr_tool_name'];
      dictData['lstBranch'] = this.lstContentsCopy;

    }   
    else{
      if((this.intNumber).toString().length<10){
        swal.fire('Error!','Invalid Mobile Number!', 'error');
        return false        
      }
      dictData['intNumber'] = this.intNumber;
      dictData['intToolId'] = this.toolsId;
      

    }

    this.serviceObject.putData('tool_settings/tool_api/',dictData).subscribe(
      (response) => {
          if (response.status == 1)
          {
           
            swal.fire( 'Success', 'Successfully Updated', 'success');
            localStorage.setItem('previousUrl','tools/list-tools');

            this.router.navigate(['tools/list-tools']);
            

            
          }  
          
          else if (response.status == 0) 
          {
            swal.fire('Error!','Something went wrong!!', 'error');

           this.blnShowData=false;
         
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
      });

  }

  isAllChecked(){
    let isAllcheck = true;
  
    
    // this.lstBranch.forEach(element => {

      
    //   if(element.blnClicked == false){
        
    //     // this.allChecked = false;
    //     return  false ;
    //   }
    //   else{ 
    //     isAllcheck = true;
    //   }
      
    // });
      
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



}
