import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-purchaselist-view',
  templateUrl: './purchaselist-view.component.html',
  styleUrls: ['./purchaselist-view.component.css']
})
export class PurchaselistViewComponent implements OnInit {
  dctPurchaseData = {};
  dctItemdata = {}
  lstItemImei=[];
  lstImeiDamaged=[];
  data = [];
  intMasterId;
  displayedColumns = ['slno','fk_item__vchr_name','int_qty','int_free','unit_price','discount_percent','discount_per_unit','total_discount','cgst','sgst','total_amount'];
  dataSource;
  blnApproved=false;
  intQtyTot;
  intBatchNum;
  showModal;
  showRejectModal;
  strRejectReason='';;
  intTotAmount;
  blnTrue=true;
  blnFalse=false;
  intDamaged;
  lstKeys=[];
  imgBillSrc='';
  selectedItem={}
  showModalZoom;
  hostname
  constructor(
    private serviceObject: ServerService,
    public toastr: ToastrService,
    public router: Router,
    private modalService: NgbModal
    ) {

     }
  ngOnInit() {
    if (localStorage.getItem('enquiryRequestData')) {
      console.log('data');
      
      localStorage.setItem('enquiryCustomerNumberStatus', '1');
    }

    this.hostname = this.serviceObject.hostAddress
    this.hostname = this.hostname.slice(0, this.hostname.length - 1)
    this.viewData();
  }
  viewData () {
    this.intQtyTot=0;
    this.intTotAmount=0;
    this.intMasterId = localStorage.getItem('intMasterId');
    this.serviceObject.postData('purchase/purchase_list/', {'intMasterId': this.intMasterId}).subscribe(res => {
    if (res.status == 1) {

      this.dctPurchaseData = res['dct_purchase'];
      this.dctPurchaseData['lst_item'].forEach((element, index) => {
        element['slno'] = index + 1;
        this.intQtyTot=this.intQtyTot+element['int_qty'];
        this.intTotAmount=this.intTotAmount+element['total_amount'];
      });

      
      this.dataSource=this.dctPurchaseData['lst_item'];

      this.dctItemdata=this.dctPurchaseData['lst_item'];
      this.lstKeys=Object.keys(this.dctItemdata)

      // if(this.dctPurchaseData['branch_state_id'] == this.dctPurchaseData['supplier_state_id']){

      //   this.displayedColumns = ['slno', 'fk_item__vchr_name','int_qty','int_free','unit_price','discount_percent','discount_per_unit','total_discount','cgst','sgst','total_amount','actions'];
      // }
      // else{
      //   this.displayedColumns = ['slno', 'fk_item__vchr_name','int_qty','int_free','unit_price','discount_percent','discount_per_unit','total_discount','igst','total_amount','actions'];
      // }

      
      this.lstItemImei=this.dctPurchaseData['lst_item']['imei'];
      this.lstImeiDamaged=this.dctPurchaseData['lst_item']['imei_damaged'];
  


      this.dctPurchaseData['dat_po'] = moment(this.dctPurchaseData['dat_po']).format('DD-MM-YYYY');
      this.dctPurchaseData['dat_po_expiry'] = moment(this.dctPurchaseData['dat_po_expiry']).format('DD-MM-YYYY');
      this.imgBillSrc=this.dctPurchaseData['vchr_bill_image']
    } else {
      this.toastr.error('Error occured ' );
    }
  });
}
approveData(){
  let dctTempData={};
  this.blnApproved=true
  dctTempData['blnApproved']=this.blnApproved;
  dctTempData['intMasterId']=this.intMasterId;
  this.serviceObject.patchData('purchase/purchase_list/',dctTempData).subscribe(res => {
    if (res.status == 1) {
      swal.fire({
        position: "center", 
        type: "success",
        text: "Purchase  Approved",
        showConfirmButton: true,  
      });    
  localStorage.setItem('previousUrl','purchase/purchaselist');
      
      this.router.navigate(['purchase/purchaselist']);
    } else {
      this.toastr.error('Error occured ' );
    }
  });
}

goBack() {
  localStorage.removeItem('intMasterId');
  localStorage.setItem('previousUrl','purchase/purchaselist');
  
  this.router.navigate(['purchase/purchaselist']);
}
showImei(showImeiList,index,i){
console.log(index,i,"index,i");
  this.selectedItem=index

  
  this.lstItemImei=index['imei'];
  this.lstImeiDamaged=index['imei_damaged'];
  this.intBatchNum=index['batch_num'];
  this.showModal=this.modalService.open(showImeiList, { centered: true, size: 'sm' });

    
}
showDamaged(showDamagedList,index){
  this.intDamaged=index['int_damage']
  this.intBatchNum=index['batch_num'];
    this.showModal=this.modalService.open(showDamagedList, { centered: true, size: 'sm' });
    
}
rejectItemPopup(rejectPopup){
  this.showModal=this.modalService.open(rejectPopup, { centered: true, size: 'sm' });
}
hideModal(){
  this.showModal.close();
  // this.showRejectModal.close();
}
rejectPurchase(){
  this.blnApproved=false;
  let dctTempData={
    blnApprove:false,
    intMasterId:null,
    strReason: ''
  };
  dctTempData['blnApproved']=this.blnApproved;
  dctTempData['intMasterId']=this.intMasterId;
  dctTempData['strReason']=this.strRejectReason;
  
  this.serviceObject.patchData('purchase/purchase_list/',dctTempData).subscribe(res => {
    if (res.status == 1) {
      swal.fire({
        position: "center", 
        type: "success",
        text: "Purchase  Rejected",
        showConfirmButton: true,  
      });   
  localStorage.setItem('previousUrl','purchase/purchaselist');
       
      this.router.navigate(['purchase/purchaselist']);
      this.hideModal();
    } else {
      this.toastr.error('Error occured ' );
    }
  });
}
initiateVoucher(){
  
  localStorage.setItem('intMasterId', this.intMasterId);
  localStorage.setItem('previousUrl','purchase/purchasevoucher');
  
  this.router.navigate(['purchase/purchasevoucher']);
}

// Zoom image modal

openzoomimage(zoomimage) {
  this.showModalZoom= this.modalService.open(zoomimage, { size: 'lg' })
}

}
