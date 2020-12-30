import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-denomination',
  templateUrl: './denomination.component.html',
  styleUrls: ['./denomination.component.scss']
})
export class DenominationComponent implements OnInit {
  lstDisplayedColumns=['denomination','noNotes','total','action'];
  lstDenominations=[];
  dataSource;
  lstNotes=[];
  dctData={};
  showModal;
  datClosed;
  collection;
  denId;
  confirm;
  showClosed;
  makeTally=false;

  currentIndex;
  currentNote;

  jsonData;
  disableStatus=[];
  DayclosureId;
  strRemarks;
  showRequest='none';

  validationStatus=true;


  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  showSpinner=false;

  intGrandTotal = 0;


  constructor(
    private serverService: ServerService,
    vcr: ViewContainerRef,
    public router: Router
  ) { }

  ngOnInit() {
    this.disableStatus[0]=false;
    // this.getDenominations();
    this.getDatas();

  
  }
  getDatas(){
    this.serverService.getData('dayclosure/lst_dayclosure/').subscribe(
      result => {  

        if(result['status']==1){
          this.lstDenominations.push({
              count:0,
              total:0
          });  
          this.dataSource = new MatTableDataSource(
            this.lstDenominations
          );
          this.lstNotes=result['lst_dayclosure'];

          if(result['blnStatus']){
            Swal.fire({
              position: "center", 
              type: "success",
              text: "Dayclosure Already Added",
              showConfirmButton: true,  
              allowOutsideClick: false,
            }).then(result1 => {
              if (result1.value) {
                this.router.navigate(['dayclosure/listdayclosure']);              
              }
            });
          
          }
        }
        else{
            Swal.fire({
              position: "center", 
              type: "error",
              text: result['message'],
              showConfirmButton: true,  
              allowOutsideClick: false,
            });
          
        }
      });
  }

  saveDayClosure(){

    this.dctData={};
   
      this.Validatedenomination();
      if(this.validationStatus==false){
        return;
      }
      let errorMsg;

      if(this.strRemarks==null || this.strRemarks==undefined   || this.strRemarks.trim()==''){
        this.validationStatus=false;
        errorMsg='Please enter Remarks';
        this.showErrorMessage(errorMsg);
        return;
      }
  
      let grandTotal=0;
      for (var data in this.lstDenominations) {  
        
        grandTotal+=+this.lstDenominations[data]['total']; // + operator convert string to number
      }

      
      this.dctData['grandTot']=grandTotal;
      this.dctData['lstData']=this.lstDenominations;
      // this.dctData['make_tally']=this.makeTally;
      this.dctData['id']=this.DayclosureId;
      this.dctData['str_remarks']=this.strRemarks;
      this.confirm="saved";

    
      this.serverService.postData('dayclosure/lst_dayclosure/',this.dctData).subscribe(
        result => {  
  
            if(result['status'] === 1){
              Swal.fire({
                position: "center", 
                type: "success",
                text: result['message'],
                showConfirmButton: true,  
                allowOutsideClick: false,
              }).then(result1 => {
                if (result1.value) {
                  // console.log("@@@this.router.navigate");
                  
                  this.router.navigate(['dayclosure/listdayclosure']);              
                }
              });
            
            }
            else{
              Swal.fire({
                position: "center", 
                type: "error",
                text: result['message'],
                showConfirmButton: true,  
                allowOutsideClick: false,
              })
            }
        });

  
     
}

  getDenominations(){

    this.makeTally=false;
    this.intGrandTotal = 0;
    this.showClosed=true;
    this.serverService.getData('dayclosure/lst_dayclosure/').subscribe(
      result => {  
        localStorage.setItem('requestHO','notsend');

        this.showRequest='none';
          this.lstDenominations.push({
              count:0,
              total:0
          });  
          this.dataSource = new MatTableDataSource(
            this.lstDenominations
          );
          this.lstNotes=result['lst_dayclosure'];

          if(result['lst_verify']){
            // console.log("result.lst_verify",result.lst_verify);
            this.DayclosureId=null;
            this.denId=result['lst_verify'][0].id;
            this.datClosed=result['lst_verify'][0].dat;
            this.collection=result['lst_verify'][0].total_amount;
            // this.showModal=true;

            Swal.fire({
              position: "center", 
              type: "success",
              text: "Date "+this.datClosed+"   Total amount "+this.collection,
              showConfirmButton: true,  
              allowOutsideClick: false,
              confirmButtonText   : "Verify",
            }).then(result1 => {
              if (result1.value) {
                this.checkVerify();
              }
            });
        

          }
          else if(result['status']==0){
            this.DayclosureId=null;

            Swal.fire({
              position: "center", 
              type: "error",
              text: "Account closed",
              allowOutsideClick: false,
              showConfirmButton: true,  
            }); 

            this.showClosed=true;
            this.showModal=false;
   

          } 
          else if(result['status']==2){
            this.lstNotes=result['dct_data']['lst_dayclosure'];

            this.makeTally=true;
            this.showClosed=false;
            this.DayclosureId=result['dct_data']['id'];
            this.strRemarks=result['dct_data']['str_remarks'];
            let amount=result['dct_data']['amount'];
            let keyword;
            this.jsonData=result['dct_data']['json_data'];
            
            let currentDat=moment(new Date()).format('YYYY-MM-DD');
            let closedDate=result['dct_data']['dat_time'];

            this.lstDenominations=[];
            this.lstDenominations=this.jsonData;

            this.lstDenominations.forEach(element => {
     
              this.intGrandTotal += element.total;               // grand total calculation 
              
            });
            this.dataSource = new MatTableDataSource(
              this.lstDenominations
            );

           
            // result['dct_data']['request_mail'] - if true already requested

            if(currentDat!=closedDate && !result['dct_data']['request_mail']){ //show request button
              this.showRequest='block';
            }
            else 
            {    
              if(result['dct_data']['int_status']==4){
                localStorage.setItem('requestHO','reject');

                this.showRequest='none';
                this.showClosed=true;
                Swal.fire({
                  position: "center", 
                  type: "error",
                  allowOutsideClick: false,
                  text: "Sorry, your request is rejected!",
                  showConfirmButton: true,  
                }); 
  
                return;
              }
              else if(currentDat!=closedDate && result['dct_data']['request_mail']){
                this.showRequest='none';
              localStorage.setItem('requestHO','send');
              this.showClosed=true;

              Swal.fire({
                position: "center", 
                type: "error",
                allowOutsideClick: false,
                text: "Amounts are not tally, waiting for HO approval",
                showConfirmButton: true,  
              }); 

              return;
            }
            }
         
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
           
          
          }
          else {
            this.DayclosureId=null;
            this.datClosed=null;
            this.collection=null;
            this.showModal=false;
            this.showClosed=false;
          } 

          
      },
      error => {
        alert(error);
      }
    );
  }

  checkVerify(){
    
      this.dctData['id']=this.denId;
      this.dctData['check_verify']='verified';
      // this.showModal=false;
      this.confirm="verified";
      // this.showClosed=false;

    this.serverService.postData('dayclosure/lst_dayclosure/',this.dctData).subscribe(
      result => {
        if (result['status'] === 1) {
          this.clearFields();
          Swal.fire({
            position: "center", 
            type: "success",
            allowOutsideClick: false,
            text: "Data "+this.confirm+" successfully",
            showConfirmButton: true,  
          
          })


          ;         
          this.showClosed=false;      
            
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
  // if(this.lstDenominations[index].note==this.currentNote && index!=this.currentIndex){
    
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
    this.currentIndex=index1;
    this.currentNote=note;
    for (let index = 0; index < this.lstDenominations.length; index++) {

      if(this.lstDenominations[index].note==note && index!=index1){
        errorMsg="This denomination already choosen";
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
  this.Validatedenomination();
  let lstLen = this.lstDenominations.length-1;
  if(this.validationStatus==false){
    return;
  }
  let errorMsg;
  
  // for (let index = 0; index < this.lstDenominations.length; index++) {
    
  // //  if(this.disableStatus[index]){
  //   if(this.lstDenominations[index].note==this.currentNote && index!=this.currentIndex && index!=lstLen){
      
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
    this.intGrandTotal = 0;
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
      this.lstDenominations.forEach(element => {
        this.intGrandTotal += element.total;
        
      });

      this.dataSource = new MatTableDataSource(
        this.lstDenominations
      );
   
    }

  Validatedenomination(){
   this.validationStatus=true;
   let errorMsg;
    for (var data in this.lstDenominations) {
      let rawNum=Number(data)+1;
      if(this.lstDenominations[data]['intDayclosureId']==null){
        this.validationStatus=false;
        errorMsg='Please select a denomination of raw '+rawNum;
        this.showErrorMessage(errorMsg);
        return;
      }
      if(this.lstDenominations[data]['count']==0){
        this.validationStatus=false;
        errorMsg='Please enter no. of notes of raw '+rawNum;
        this.showErrorMessage(errorMsg);
        return;
      }
    }
  }

  saveDetails(){
    this.dctData={};
    // if(this.showModal){
    //   this.dctData['id']=this.denId;
    //   this.dctData['check_verify']='verified';
    //   this.showModal=false;
    //   this.confirm="verified";
    //   this.showClosed=false;

    // }
    // else{
      this.showClosed=false;
      this.Validatedenomination();
      if(this.validationStatus==false){
        return;
      }
      let errorMsg;

      if(this.strRemarks==null || this.strRemarks==undefined   || this.strRemarks.trim()==''){
        this.validationStatus=false;
        errorMsg='Please enter Remarks';
        this.showErrorMessage(errorMsg);
        return;
      }
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
      this.dctData['make_tally']=this.makeTally;
      this.dctData['id']=this.DayclosureId;
      this.dctData['str_remarks']=this.strRemarks;
      this.confirm="saved";

    // }
    this.serverService.postData('dayclosure/lst_dayclosure/',this.dctData).subscribe(
      result => {
        if (result['status'] === 1) {
          this.showRequest='none';
          this.DayclosureId=null;
          this.clearFields();
          Swal.fire({
            position: "center", 
            type: "success",
            text: "Data "+this.confirm+" successfully",
            allowOutsideClick: false,
            showConfirmButton: true,  
          }).then(result1 => {
            if (result1.value) {
              this.showClosed=false;      
              this.makeTally=false; 
          

            }
          });   

          

        }  
        else if(result['status'] === 0)  //not_tally
        {
          // let amount=result['amount'];
          // let keyword;
          // this.jsonData=result['json_data'];
          // this.DayclosureId=result['id'];
          
          // if(amount>0){
          //   keyword='short';
           
          // }
          // else{
          //   keyword='excess';
          // }

          // Swal.fire({
          //   position: "center", 
          //   type: "error",
          //   text: "Amounts are not tally ₹"+Math.abs(amount)+" "+keyword+" found, please check sales reports",
          //   showConfirmButton: true,  
          // }).then(result1 => {
          //   if (result1.value) {
             
              this.getDenominations();
          //   }
          // });  
         
          // this.lstDenominations=[];
          // this.lstDenominations=this.jsonData;
          // this.dataSource = new MatTableDataSource(
          //   this.lstDenominations
          // );
          // this.toastr.error(result['data']);
        }
    },
    (error) => {  
      alert(error);
    });
    }
  
    clearFields(){
      
      this.strRemarks=null;
      this.lstDenominations=[];
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
      this.intGrandTotal = 0;      
    }
    
    requestHO(){
      this.showSpinner=true;
      let dctId={id:this.DayclosureId};
      this.serverService.postData('dayclosure/request_mail/',dctId).subscribe(
        result => {          
          if (result['status'] === 1) {
            this.showSpinner=false;
            Swal.fire({
              position: "center", 
              type: "success",
              allowOutsideClick: false,
              text: "Request send successfully, please contact your HO",
              showConfirmButton: true,  
            });         
            localStorage.setItem('requestHO','send');
            this.showClosed=true;
            this.getDenominations();
          } 
          else{
            this.showSpinner=false;
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
        this.showSpinner=false;
        alert(error);
      });

    }
  
}
