import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { ServerService } from 'src/app/server.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cm-request-view',
  templateUrl: './cm-request-view.component.html',
  styleUrls: ['./cm-request-view.component.css']
})
export class CmRequestViewComponent implements OnInit {

  intJobId;
  dctData = {};
  lstSpareIds = []

  modalImei;
  strUniqNo = '';

  intRadioSelected = null;

  expandContent = true;
  lstAllocatedStatus = [];
  intPurchaseStatus = 0;


  constructor(
    private serverService:ServerService,
    public toastr: ToastrService,
    public modalService: NgbModal) { }

  ngOnInit() {
    this.intJobId = parseInt(localStorage.getItem('jobId'));
    let dctData = {};
    dctData['intJobId'] = this.intJobId;
    this.serverService.putData('service/spare_request/',dctData).subscribe(res=>{
      if(res['status']==1){
        this.dctData = res['dct_data'];
        
      }
      else{
        Swal.fire('Error',res['data'],'error')
      }
    },(error=>{
      Swal.fire('Error','Server Error','error')
    }))
  }

  findDetails(data) {
    // return this.data2.filter(x => x.whoseData === data.name);
  }

  radioClicked(event,spareId){
    this.intRadioSelected = spareId;
  }

  // radioClicked(reqId,spareId){
  //   let blnCheck = false;
  //   console.log('item',reqId,spareId)
  //   this.lstSpareIds.forEach(element=>{
  //     if(element.intRequestId == reqId){
  //       element['intSpareId'] == spareId;
  //       blnCheck = true;
  //     }
  //   })
  //   if(!blnCheck){
  //     this.lstSpareIds.push({
  //       'intRequestId': reqId,
  //       'intSpareId': spareId,
  //     })
  //   }
  // }
  purchaseSpare(reqId){
    
    let dctData = {}
    if(this.intRadioSelected == null){
      this.toastr.error('Enter atleast one item', 'Error!');
      return ;
    }
    dctData['intRequestId'] = reqId;
    dctData['intSpareId'] = this.intRadioSelected;

    this.serverService.putData('service/spare_request_followup/',dctData).subscribe(res=>{
      if(res['status']==1){
        this.intPurchaseStatus = reqId;
        // this.dctData = res['dct_data'];
        Swal.fire('Success','Purchased Successfully','success')
      }
      else{
        Swal.fire('Error',res['data'],'error')
      }
    },(error=>{
      Swal.fire('Error','Server Error','error')
    }))
  }
  intReqId;
  openModal(modalName,reqId){
    this.intReqId = reqId;
    this.modalImei = this.modalService.open(modalName, { windowClass: 'imeiModalClass',centered: true});
    
  }

  assignItem(){
    let dctData = {}
    dctData['intRequestId'] = this.intReqId;
    dctData['vchrId'] = this.strUniqNo;
    this.serverService.patchData('service/spare_request_followup/',dctData).subscribe(res=>{
      if(res['status']==1){
        this.lstAllocatedStatus.push(this.intReqId);
        // this.dctData = res['dct_data'];
        Swal.fire('Success','Assigned Successfully','success');
        this.strUniqNo = '';
        this.intReqId = null;
        this.modalImei.close();
        
      }
      else{
        Swal.fire('Error',res['data'],'error')
      }
    },(error=>{
      Swal.fire('Error','Server Error','error')
    }))
  }
}
