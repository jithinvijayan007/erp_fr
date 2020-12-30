import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-purchase-voucher',
  templateUrl: './purchase-voucher.component.html',
  styleUrls: ['./purchase-voucher.component.css']
})
export class PurchaseVoucherComponent implements OnInit {

  intMasterId;
  dctPurchaseData = {};
  dctItemdata = {}
  lstItemImei=[];
  strRemarks='';
  intBillNum;
  intBillDat;
  intTotAmount;
  strSupplierName;
  strGrnNumber;
  intBillAmount;
  imgBillSrc='';
  hostname;
  showModalZoom;
  

  registerForm: FormGroup;


  @ViewChild('billNumber', { static: true }) billNumber: any;
  @ViewChild('billDate', { static: true }) billDate: any;
  @ViewChild('totalAmount', { static: true }) totalAmount: any;
  @ViewChild('remarks', { static: true }) remarks
  constructor(
    private serviceObject: ServerService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    public router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {

    this.hostname = this.serviceObject.hostAddress
    this.hostname = this.hostname.slice(0, this.hostname.length - 1)
    this.viewData();

    this.registerForm = this.formBuilder.group({
      billNumber: ['', Validators.required],
      billDate: ['', Validators.required],
      totalAmount: ['', Validators.required],
      remarks: [''],
      });
  }


  viewData () {
    this.intMasterId = localStorage.getItem('intMasterId');
    this.serviceObject.postData('purchase/purchase_list/', {'intMasterId': this.intMasterId}).subscribe(res => {
    if (res.status == 1) {

      this.dctPurchaseData = res['dct_purchase'];
      
      this.dctItemdata=this.dctPurchaseData['lst_item'];
      this.intBillDat=null;
      this.intBillNum=this.dctPurchaseData['bill_no'];
      this.strRemarks='';
      this.intTotAmount=this.dctPurchaseData['dbl_bill_amount'];
      this.strSupplierName =this.dctPurchaseData['supplier_name'];
      this.strGrnNumber =this.dctPurchaseData['purchase_num'];
      this.imgBillSrc=this.dctPurchaseData['vchr_bill_image']

      
  
      // console.log("item data",this.dctItemdata);

      this.dctPurchaseData['dat_po'] = moment(this.dctPurchaseData['dat_po']).format('DD-MM-YYYY');
      this.dctPurchaseData['dat_po_expiry'] = moment(this.dctPurchaseData['dat_po_expiry']).format('DD-MM-YYYY');
    } else {
      this.toastr.error('Error occured ' );
    }
  });
}
saveVoucher(){

let dctTempData= {}

if(!this.intBillNum){
  this.billNumber.nativeElement.focus();
  this.toastr.error('Bill Number is required', 'Error!');
  return false;
}
else if(!this.intBillDat){
  this.billDate.nativeElement.focus();
  this.toastr.error('Bill Date is required', 'Error!');
  return false;
}
else if(!this.intTotAmount){
  this.totalAmount.nativeElement.focus();
  this.toastr.error('Amount is required', 'Error!');
  return false;
}
dctTempData['intMasterId']=this.intMasterId;
dctTempData['strRemarks']=this.strRemarks;;
dctTempData['intSupllierId']=this.dctPurchaseData['supplier_id'];
dctTempData['dbl_amount']=this.intTotAmount;
dctTempData['billDat']=this.intBillDat;
dctTempData['billNo']=this.intBillNum;

this.serviceObject.postData('purchase/purchase_voucher/',dctTempData).subscribe(res => {
  if (res.status == 1) {
    swal.fire({
      position: "center", 
      type: "success",
      text: "Purchase bill Generated",
      showConfirmButton: true,  
    });    
  localStorage.setItem('previousUrl','purchase/purchaselist');
    
    this.router.navigate(['purchase/purchaselist']);
  } else {
    this.toastr.error('Error occured ' );
  }
});
}
goBack(){
  localStorage.removeItem('intMasterId');
  localStorage.setItem('previousUrl','purchase/purchaselist');
  
  this.router.navigate(['purchase/purchaselist']);
  
}
// Zoom image modal

openzoomimage(zoomimage) {
  this.showModalZoom= this.modalService.open(zoomimage, { size: 'lg' })
}

}
