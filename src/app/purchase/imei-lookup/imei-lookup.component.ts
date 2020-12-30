import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-imei-lookup',
  templateUrl: './imei-lookup.component.html',
  styleUrls: ['./imei-lookup.component.css']
})
export class ImeiLookupComponent implements OnInit {

  constructor(
    private serviceObject: ServerService,
    private modalService: NgbModal,
    private toaster: ToastrService,

  ) { }
  blnSmartchoice=false
  intLookup;
  lstData=[];
  strBatch;
  strImei;
  showData;
  validationStatus;
  errorPlace;

  lstItem=[];

  dctItem={};
  lstStock=[];
  dctPurchase={};
  lstSales=[];

  showImei=false;
  showBatch=false;

  popUp;
  lst_item = []
  strItem;

  lstImeis = []

//   dctItem1 =  {'715':
//     { item:'iphone6',

//     details : [
//                 { date:'2019-20-11',
//                   branch:'chalakudy',
//                   action : 'purchase',
//                   remark : ' purchased item worth 2000'
//                 },
//                 { date:'2019-20-12',
//                   branch: 'kannur',
//                   action : 'transfer',
//                   remark : ' transfer item worth 5000'
//                 },
//                 { date : '2019-20-13',
//                   branch :'koratty',
//                   action : 'purchase',
//                   remark : ' purchased item worth 9000'
//                 },
//               ]
//   },
//   '785':
//   { item:'samsung Galaxy S10',
//     details : [
//                 { date : '2019-20-11',
//                   branch:'kodakara',
//                   action : 'purchase',
//                   remark : ' purchased item worth 500'
//                 },
//                 { date:'2019-20-12',
//                   branch: 'palarivattam',
//                   action : 'transfer',
//                   remark : ' transfer item worth 4780'
//                 },
//                 { date :'2019-20-13',
//                   branch :'saba',
//                   action : 'purchase',
//                   remark : ' purchased item worth 6000'
//                 },
//               ]
//   }
// }
dctItem1 = {}

  ngOnInit() {
    this.showData=false;
    this.intLookup=2;
    
  }

  OnEnter(event: any) {
    if (event.keyCode == 13 || event.which == 13) {
      this.getDetails()
    }
  }


  getDetails(){

    this.showImei=false;
    this.showBatch=false;

    let strNum;
    if(this.intLookup==1){
      if(!this.strBatch){
        this.validationStatus = false ;
        this.errorPlace = 'Please enter batch no.';
        this.showErrorMessage(this.errorPlace);
        return;
      }
      else if(this.strBatch.length < 3){
        this.validationStatus = false ;
        this.errorPlace = 'Please enter batch no length atleast 3';
        this.showErrorMessage(this.errorPlace);
        return;
      }
      strNum={batchNum:this.strBatch};
    }
    else if(this.intLookup==2){
      if(!this.strImei){
        this.validationStatus = false ;
        this.errorPlace = 'Please enter IMEI no.';
        this.showErrorMessage(this.errorPlace);
        return;
      }
      else if(this.strImei.length < 4 ){
        this.validationStatus = false ;
        this.errorPlace = 'Please enter IMEI length atleast 4.';
        this.showErrorMessage(this.errorPlace);
        return;
      }
      strNum={imeiNum:this.strImei,blnSmartchoice:this.blnSmartchoice};
    }
   
    this.serviceObject.postData('item_lookup/item_lookup/',strNum).subscribe(
      (response) => {
        // this.lstData=[];
        this.lstStock=[];
        this.lstSales=[];
        this.lstItem=[];

        if(response['status']==1){

          this.showData=false;

     
          



          if(this.intLookup==1){
            this.showBatch=true;
            
            this.dctItem1 = response['dct_data']
            this.lstImeis = Object.keys(this.dctItem1)

          }
          else if(this.intLookup==2){

          this.showImei=true;

            
          this.dctItem1 = response['dct_data']
         
          this.lstImeis = Object.keys(this.dctItem1)

          this.lstImeis.forEach(element => {
            this.showData=false
            if( this.dctItem1[element]['details'].length>0){
              this.showData=true
            }
          });

          this.lstImeis.forEach((element ,index)=> {
            if(this.dctItem1[element].details.length == 0){
              this.lstImeis.splice(index,1);
            }
          });

          
          
        

          }

          // this.lstStock=response['data']['lst_stock'];
          // this.dctPurchase=response['data']['purchase_details'];
          // this.lstSales=response['data']['sale_data'];
        
        // this.lstData=response['lst_enquiry'];
          // this.showData = false;
          // if (this.lstData['lst_item_details'].length>0){
          //   this.showData=true;
          // }
        }
        else{
          this.showData=false;
        }
      },
      (error) => {   
        this.showData=false;
        Swal.fire('Error!',error, 'error');
        
      });
  }

  clearText(){    
    this.strBatch=null;
    this.strImei=null;
    this.lstData = []
    this.showData = false;

    this.showImei=false;
    this.showBatch=false;
  
  }

  showErrorMessage (errorPlace) {    
    Swal.fire({
      position: "center",
      type: "warning",
      text: errorPlace,
      showConfirmButton: false,
      timer: 1900
    });
  }



  openfilteritem(filteritem,itemcode,item) {
    this.strItem = null
    this.lst_item = []
    this.strItem = item
    this.lst_item = this.lstData['dct_stock_details'][itemcode]

    this.popUp = this.modalService.open(filteritem, { size: 'lg', windowClass: 'filteritemclass' });
  }

   

}
