import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { tree } from 'd3';

@Component({
  selector: 'app-caseclosure-denomination',
  templateUrl: './caseclosure-denomination.component.html',
  styleUrls: ['./caseclosure-denomination.component.css']
})
export class CaseclosureDenominationComponent implements OnInit {

  lstDisplayedColumns=['denomination','noNotes','total','action'];
  lstDenominations=[];
  dataSource;
  lstNotes=[];
  dctData={};
  blnShowModal ;
  datClosed;
  intCollection;
  intDenId;
  strConfirm;
  blnShowClosed;
  makeTally=false;

  intCurrentIndex;
  currentNote;

  jsonData;
  disableStatus=[];
  intDayclosureId;
  strRemarks;
  showRequest='none';

  strCheckVerify='';

  blnValidationStatus=true;

  blnVerify=false;
  blnSave=false;


  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  showSpinner=false;
  intGrandTotal = 0;

  bln_preload
  blnEdit=false
  constructor(
    private serverService: ServerService,
    vcr: ViewContainerRef,
    public router: Router
  ) { }

  ngOnInit() {
    this.disableStatus[0]=false;
    localStorage.setItem("caseClosureStatus","closed")
    this.getDenominations(false);
  }

  getDenominations(data){
// console.log("getdenomination");

    this.makeTally=false;

    this.blnShowClosed=true;
    this.blnVerify=false;
    this.blnSave=true;
    this.lstDenominations=[];
    if(data){
      this.serverService.getData('case_closure/case_closure_notification/?bln_preload='+this.bln_preload).subscribe(
        result => {  
            this.lstDenominations.push({
                count:0,
                total:0
            });  
            this.dataSource = new MatTableDataSource(
              this.lstDenominations
            );
            this.lstNotes=result['lst_notes'];
            this.bln_preload=result['bln_preload'];
  
           if(result['status']==0){
              this.blnVerify=false;
              this.blnShowClosed=false;
              this.blnSave=true;
            } 
            else if(result['status']==1){
              // this.lstNotes=result['dct_data']['lst_dayclosure'];
              localStorage.setItem("caseClosureStatus","open")
              this.blnVerify=true
              // this.makeTally=true;
              this.blnSave=false
              this.intDenId=result['dct_data']['int_id'];
              this.strRemarks=result['dct_data']['str_remarks'];
              // let amount=result['dct_data']['amount'];
              // // let keyword;
              this.jsonData=result['dct_data']['json_data'];
              
              // let currentDat=moment(new Date()).format('YYYY-MM-DD');
              // let closedDate=result['dct_data']['dat_time'];
  
              this.lstDenominations=[];
              this.lstDenominations=this.jsonData;
              this.intGrandTotal = 0;
              this.lstDenominations.forEach(element => {
      
                this.intGrandTotal += element.total;           //calculate grand total
                
              });
              this.dataSource = new MatTableDataSource(
                this.lstDenominations
              );  
            
            }
            else {
              this.intDayclosureId=null;
              this.datClosed=null;
              this.intCollection=null;
              // this.blnShowModal=false;
              this.blnShowClosed=false;
            } 
  
            
        },
        error => {
          alert(error);
        }
      );
    }
    else{
      this.serverService.getData('case_closure/case_closure_notification/').subscribe(
        result => {  
            this.lstDenominations.push({
                count:0,
                total:0
            });  
            this.dataSource = new MatTableDataSource(
              this.lstDenominations
            );
            this.lstNotes=result['lst_notes'];
            this.bln_preload=result['bln_preload'];
  
           if(result['status']==0){
              this.blnVerify=false;
              this.blnShowClosed=false;
              this.blnSave=true;
            } 
            else if(result['status']==1){
              // this.lstNotes=result['dct_data']['lst_dayclosure'];
              localStorage.setItem("caseClosureStatus","open")
              this.blnVerify=true
              // this.makeTally=true;
              this.blnSave=false
              this.intDenId=result['dct_data']['int_id'];
              this.strRemarks=result['dct_data']['str_remarks'];
              // let amount=result['dct_data']['amount'];
              // // let keyword;
              this.jsonData=result['dct_data']['json_data'];
              
              // let currentDat=moment(new Date()).format('YYYY-MM-DD');
              // let closedDate=result['dct_data']['dat_time'];
  
              this.lstDenominations=[];
              this.lstDenominations=this.jsonData;
              this.intGrandTotal = 0;
              this.lstDenominations.forEach(element => {
      
                this.intGrandTotal += element.total;           //calculate grand total
                
              });
              this.dataSource = new MatTableDataSource(
                this.lstDenominations
              );  
            
            }
            else {
              this.intDayclosureId=null;
              this.datClosed=null;
              this.intCollection=null;
              // this.blnShowModal=false;
              this.blnShowClosed=false;
            } 
  
            
        },
        error => {
          alert(error);
        }
      );
    }
  }

  checkVerify(){
    
      this.dctData['id']=this.intDenId;
      this.dctData['check_verify']='verified';
      // this.blnShowModal =false;
      this.strConfirm="verified";
      // this.blnShowClosed=false;

    this.serverService.postData('dayclosure/lst_dayclosure/',this.dctData).subscribe(
      result => {
        if (result['status'] === 1) {
          this.clearFields();
          Swal.fire({
            position: "center", 
            type: "success",
            allowOutsideClick: false,
            text: "Data "+this.strConfirm+" successfully",
            showConfirmButton: true,  
          });         
          this.blnVerify=true;      
            
        }  
        else{
            Swal.fire({
            position: "center", 
            type: "error",
            text: result['data'],
            allowOutsideClick: false,
            showConfirmButton: true,  
          });         
        }
    },
    (error) => {  
      alert(error);
    });
  }

  showErrorMessage (errorPlace) {    
    Swal.fire({
      position: "center",
      type: "warning",
      title: errorPlace,
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 1900
    });
  }

  calcTotal(index,event){
    this.intGrandTotal = 0;
    if(event.keyCode==189||event.keyCode==187){      
      this.lstDenominations[index].count='';
      return;
    }
  let lstLen= this.lstDenominations.length-1;
  let errorMsg;
  // if(this.lstDenominations[index].note==this.currentNote && index!=this.intCurrentIndex){
    
  //   errorMsg='Please fill correctly';
  //   this.disableStatus[index]=true;
  //   this.showErrorMessage(errorMsg);
  //   return;
  // }
  if(this.lstDenominations[index].intDayclosureId==null){
    errorMsg='Please select a denomination';
    this.disableStatus[index]=true;
    this.showErrorMessage(errorMsg);
    return;
  }
  // else{
  //   this.disableStatus[index]=false;
  // }
  this.lstDenominations[index].total=0;
  this.lstDenominations[index].total=this.lstDenominations[index].count*this.lstDenominations[index].note;
  this.lstDenominations.forEach(element => {
    
    this.intGrandTotal += element.total;
    
  });
  }

  denominationChanged(note,index1){
    let errorMsg;
    // console.log("$$$this.lstDenominations",this.lstDenominations);
    this.intCurrentIndex=index1;
    this.currentNote=note;
    for (let index = 0; index < this.lstDenominations.length; index++) {

      if(this.lstDenominations[index].note==note && index!=index1){
        errorMsg="This denomination is already choosen";
        this.disableStatus[index+1]=true;
        this.showErrorMessage(errorMsg);
        this.lstDenominations.splice(index1,1);
        this.dataSource = new MatTableDataSource(
        this.lstDenominations
        );
        
        return;
      }
      else{
        this.disableStatus[index+1]=false;
      }
    }
    // let lstLen= this.lstDenominations.length-1;
    this.lstDenominations[index1].note=note; 
    this.calcTotal(index1,event);
  }
  
  addRow(){
  
    
  this.validateDenomination();
  let lstLen = this.lstDenominations.length-1;
  if(this.blnValidationStatus==false){
    return;
  }
  let errorMsg;
  
  // for (let index = 0; index < this.lstDenominations.length; index++) {
    
  // //  if(this.disableStatus[index]){
  //   if(this.lstDenominations[index].note==this.currentNote && index!=this.intCurrentIndex && index!=lstLen){
      
  //   errorMsg='Please fill correctly';
  //   this.disableStatus[index]=true;
  //   this.showErrorMessage(errorMsg);
  //   return;

  // }
  // }

  this.lstDenominations.push({
      count:0,
      total:0
  });
  this.dataSource = new MatTableDataSource(
    this.lstDenominations
  );
  }


  deleteData(indexId){
    this.disableStatus.splice(indexId,1);
    
    let lstLen;
     lstLen=this.lstDenominations.length;
     if(!(lstLen==1)){
       this.lstDenominations.splice(indexId,1);

     }
     else{
      this.lstDenominations=[];
      this.lstDenominations.push({
        count:0,
        total:0
      });  
      }
      this.intGrandTotal = 0;
      this.lstDenominations.forEach(element => {
    
        this.intGrandTotal += element.total;
        
      });
      
      this.dataSource = new MatTableDataSource(
        this.lstDenominations
      );

    }

  validateDenomination(){
   this.blnValidationStatus=true;
   let errorMsg;
    for (var data in this.lstDenominations) {
      let rawNum=Number(data)+1;
      if(this.lstDenominations[data]['intDayclosureId']==null){
        this.blnValidationStatus=false;
        errorMsg='Please select a denomination of raw '+rawNum;
        this.showErrorMessage(errorMsg);
        return;
      }
      if(this.lstDenominations[data]['count']==0){
        this.blnValidationStatus=false;
        errorMsg='Please enter no. of notes of raw '+rawNum;
        this.showErrorMessage(errorMsg);
        return;
      }
    }
  }

  saveDetails(){
    this.dctData={};
    // if(this.blnShowModal ){
    //   this.dctData['id']=this.intDenId;
    //   this.dctData['check_verify']='verified';
    //   this.blnShowModal =false;
    //   this.strConfirm="verified";
    //   this.blnShowClosed=false;

    // }
    // else{
      this.blnShowClosed=false;
      this.validateDenomination();
      if(this.blnValidationStatus==false){
        return;
      }
      let errorMsg;
    //   for (let index = 0; index < this.lstDenominations.length; index++) {
    //   if(this.disableStatus[index]==true){
    //     errorMsg='Please fill correctly';
    //     this.disableStatus[index]=true;
    //     this.showErrorMessage(errorMsg);
    //     return;
    //   }
    // }
      let grandTotal=0;
      for (var data in this.lstDenominations) {  
        // if(this.disableStatus[data]==true){
        // errorMsg='Please fill correctly';
        // this.disableStatus[data]=true;
        // this.showErrorMessage(errorMsg);
        // return;
        // }
        
        grandTotal+=+this.lstDenominations[data]['total']; // + operator convert string to number
      }
 
      

      this.dctData['grandTot']=grandTotal;
      this.dctData['lstData']=this.lstDenominations;
      // this.dctData['make_tally']=this.makeTally;
      this.dctData['id']=this.intDayclosureId;
      this.dctData['str_remarks']=this.strRemarks;
      this.strConfirm="saved";

    // }
    this.serverService.postData('case_closure/add_case_closure/',this.dctData).subscribe(
      result => {
        if (result['status'] === 1) {
          this.showRequest='none';
          this.intDayclosureId=null;
          this.clearFields();
          Swal.fire({
            position: "center", 
            type: "success",
            text: "Data saved successfully",
            allowOutsideClick: false,
            showConfirmButton: true,  
          }).then(result1 => {
            if (result1.value) {
              localStorage.setItem("caseClosureStatus","open")
              this.blnShowClosed=false;      
              this.getDenominations(true);
            }
          });   

           this.router.navigate(['/caseclosure/cashclosure-list/'])

        }
        else if(result['status'] == 2){
          let amount=result['dct_data']['amount'];
          let keyword;


          if(amount>0){
            keyword='short';
           
          }
          else{
            keyword='excess';
          }


          Swal.fire({
            position: "center", 
            type: "error",
            allowOutsideClick: false,
            text: "Amounts are not tally ₹"+Math.abs(amount)+" "+keyword+" found, please check sales reports",
            showConfirmButton: true,  
          });
          // this.blnSave = false;
          // this.blnVerify = true;
          // this.blnShowClosed = false;
          this.getDenominations(true);


        }  
        else if(result['status'] === 0)  //not_tally
        {     
          Swal.fire({
            position: "center", 
            type: "error",
            allowOutsideClick: false,
            text: result['data'],
            showConfirmButton: true,  
          }); 
            
              this.getDenominations(true);
              this.intGrandTotal = 0;

              this.router.navigate(['/caseclosure/cashclosure-list/'])
        }
    },
    (error) => {  
      alert(error);
    });
    }
  
    clearFields(){
      
      this.strRemarks=null;
      this.lstDenominations=[];
      this.intGrandTotal = 0;
      this.lstDenominations.push({
        count:0,
        total:0
      });  
      // this.lstNotes=[];
      this.dctData={};

      this.dataSource = new MatTableDataSource(
        this.lstDenominations
      );
      // this.getDenominations();      
    }
    

    caseVerify(data){

      let dctTempData={}  

      if(this.strCheckVerify=='modified'){
        if(!this.strRemarks){
          let errorMsg;
          errorMsg='Fill the Remarks';
          this.showErrorMessage(errorMsg);
          return;
        }

        dctTempData['str_remarks']=this.strRemarks;
        dctTempData['check_verify']='modified';
      }
      else{
        dctTempData['check_verify']=data;
        
      }
      dctTempData['lstData']=this.lstDenominations;
      let grandTotal=0;
      for (var item in this.lstDenominations) {  
      
        grandTotal+=+this.lstDenominations[item]['total']; 
      }
      dctTempData['grandTot']=grandTotal;
      dctTempData['id']=this.intDenId;
      dctTempData['bln_preload']=this.bln_preload;
      // dctTempData['blnEdit']=this.blnEdit;

      if(!this.blnEdit){
        dctTempData['check_verify']='verified';
      }

      if(this.strCheckVerify=='modified'){
        // Swal.fire({
        //   position: "center", 
        //   type: "success",
        //   text: "Are you sure to confirm",
        //   showConfirmButton: true,  
        //   allowOutsideClick: false,
        //   confirmButtonText   : "Verify",
        // }).then(result1 => {
        //   if (result1.value) {
        //     // this.();
        //   }
        //   else{
        //     return
        //   }
        // });
        //  if(response.hasOwnProperty('data')){
          Swal.fire({
            title: 'Alert!',
            text: 'You sure to confirm?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK!'
          }).then((result) => {
            if (result.value) {
              
              // this.blnCheck = false;
              // this.caseVerify(data)
              this.serverService.postData('case_closure/add_case_closure/',dctTempData).subscribe(
                result => {
                  if (result['status'] === 1) {
                    this.clearFields();
                    Swal.fire({
                      position: "center", 
                      type: "success",
                      allowOutsideClick: false,
                      text: "Data confirmed successfully",
                      showConfirmButton: true,
                    });         
                    this.blnShowClosed=false;
                    this.blnEdit=false
                    localStorage.setItem("caseClosureStatus","closed")
                    this.router.navigate(['/caseclosure/cashclosure-list/'])
                      
                  }  
                  else if(result['status'] == 2){
                    let amount=result['dct_data']['amount'];
                    let keyword;
          
          
                    if(amount>0){
                      keyword='short';
                     
                    }
                    else{
                      keyword='excess';
                    }
                    this.blnEdit=false
          
          
                    Swal.fire({
                      position: "center", 
                      type: "error",
                      allowOutsideClick: false,
                      text: "Amounts are not tally ₹"+Math.abs(amount)+" "+keyword+" found, please check sales reports",
                      showConfirmButton: true,  
                    });
                    // this.blnSave = false;
                    // this.blnVerify = true;
                    // this.blnShowClosed = false;
                    this.getDenominations(true);
          
          
                  }  
                  else{
                      Swal.fire({
                      position: "center", 
                      type: "error",
                      text: result['data'],
                      allowOutsideClick: false,
                      showConfirmButton: true,  
                    });         
                  }
                  // this.getDenominations();
                  // this.router.navigate(['/caseclosure/cashclosure-list/'])
              },
              (error) => {  
                alert(error);
              });

             
            }
            else{
              
            //  this.blnCheck=true;
            }
          })
        // }


      }
      else{
        this.serverService.postData('case_closure/add_case_closure/',dctTempData).subscribe(
          result => {
            if (result['status'] === 1) {
              this.clearFields();
              Swal.fire({
                position: "center", 
                type: "success",
                allowOutsideClick: false,
                text: "Data confirmed successfully",
                showConfirmButton: true,
              });      
              this.blnEdit=false
                 
              this.blnShowClosed=false;
              this.router.navigate(['/caseclosure/cashclosure-list/']) 
                
            }  
            else if(result['status'] == 2){
              let amount=result['dct_data']['amount'];
              let keyword;
    
    
              if(amount>0){
                keyword='short';
               
              }
              else{
                keyword='excess';
              }
    
              this.blnEdit=false
    
              Swal.fire({
                position: "center", 
                type: "error",
                allowOutsideClick: false,
                text: "Amounts are not tally ₹"+Math.abs(amount)+" "+keyword+" found, please check sales reports",
                showConfirmButton: true,  
              });
              // this.blnSave = false;
              // this.blnVerify = true;
              // this.blnShowClosed = false;
              this.getDenominations(true);
    
    
            }  
            else{
                Swal.fire({
                position: "center", 
                type: "error",
                text: result['data'],
                allowOutsideClick: false,
                showConfirmButton: true,  
              });         
            }
        },
        (error) => {  
          alert(error);
        });
        // this.getDenominations();

      }


      // dctTempData['id']=this.intDayclosureId;
      // this.blnShowModal =false;
      // this.strConfirm="verified";
      // this.blnShowClosed=false;

      // console.log("strverify",this.strCheckVerify);
      // this.getDenominations()
      

  }
  caseDeny(data){
    this.strCheckVerify=data;
    this.blnShowClosed=false;
    this.blnSave=false;
    this.blnEdit=true

  }
}
