import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import {NgbModal,ModalDismissReasons,NgbActiveModal,} from '@ng-bootstrap/ng-bootstrap';
import { log } from 'util';

@Component({
  selector: 'app-transferview',
  templateUrl: './transferview.component.html',
  styleUrls: ['./transferview.component.css']
})
export class TransferviewComponent implements OnInit {
  intPackets;
  strMediumPhNo = '';
  strMediumName = '';
  strMediumNo = '';
  strMedium = '1';
  transferType;
  dctMasterData = {};
  dctTransferData = {};
  data = [];
  intId;
  // lstImei=['3234324','654438'];
  lstImei=[{
    imei:null,
    status:null
  }];
  // displayedColumns = ['slno', 'fk_item__vchr_name', 'int_qty','action'];
  displayedColumns =[]
  dataSource;
  transpCost;
  showModalImei;
  lstItems;
  varColor='blue';
  lstAvailableImei = []
  blnImeiSave = false;
  intItemIndex = null;
  blnTranfered = localStorage.getItem('blnTrasfered');
  lstCourierName=[]
  intCourierName=null

  lstVehicleNo=[]
  strVehicleNo=''

  blnAcknowledgeDisable = false;
  blnPartialAcknowledgeDisable = false
  blnDirectTransfer = false
  blnSaveDisable = false;
  blnEway= false;

  constructor(private modalService: NgbModal,private serviceObject: ServerService,
    public toastr: ToastrService,
    public router: Router,
   ) { }

  ngOnInit() {
    this.blnAcknowledgeDisable =false;
    this.blnSaveDisable = false;
    this.blnPartialAcknowledgeDisable = false;

    if (localStorage.getItem('stockTransferredData')) {
      localStorage.setItem('stockTransferredStatus', '1');
    }
    if (localStorage.getItem('stockTransferData')) {
      localStorage.setItem('stockTransferStatus', '1');
    }
    this.listData();
  }
  viewData(content,index) {
    this.blnImeiSave = false;
    this.intItemIndex = index;

    this.lstImei=[];
    this.lstAvailableImei = [];

    this.lstImei.push(...this.lstItems[index]['imei']);

  //   this.lstImei=[{
  //     imei:"45879",
  //     status:"missing"
  //   },
  //   {
  //     imei:"45815",
  //     status:"available"
  //   },
  //   {
  //     imei:"15462",
  //     status:"missing"
  //   },
  //   {
  //     imei:"45876",
  //     status:"available"
  //   },
  //   {
  //     imei:"4567",
  //     status:"available"
  //   },
  //   {
  //     imei:"15258",
  //     status:"missing"
  //   },
  // ];




    this.showModalImei= this.modalService.open(content, { centered: true, size: 'lg' });

  }
listData () {
  this.intId = localStorage.getItem('stockTransferId');
  this.transferType = localStorage.getItem('stockTransferType');

  localStorage.removeItem('stockTransferType');
  localStorage.removeItem('stockTransferId');
  this.serviceObject.postData('internalstock/transferview/', {'int_id': this.intId, 'type': this.transferType}).subscribe(res => {
    if (res.status === 1) {
      res['details_data'].forEach((element, index) => {
        element['slno'] = index + 1;
      });
      this.lstCourierName= res['courier_name']
      this.dctMasterData = res['request_data'][0];
      this.blnDirectTransfer =res['request_data'][0]['bln_direct_transfer']

      // if(this.dctMasterData['status']=="ACKNOWLEDGED" || this.dctMasterData['status']=="BILLED")
      // {
      //   this.displayedColumns = ['slno', 'fk_item__vchr_name', 'int_qty','action']
      // }
      // else{
      //   this.displayedColumns = ['slno', 'fk_item__vchr_name', 'int_qty'];
      // }
      this.displayedColumns = ['slno', 'fk_item__vchr_name', 'int_qty','action']
      this.dataSource = res['details_data'];
      this.lstItems=res['details_data'];
      this.dctTransferData = res['transfer_details'][0];
      this.dctMasterData['dat_transfer'] = moment(this.dctMasterData['dat_transfer']).format('DD-MM-YYYY');

    } else {
      this.toastr.error('Error occured ' );
    }
  });
}
goBack() {


  if (this.transferType === 'to') {
  localStorage.setItem('previousUrl','stocktransfer/transferlist');

    this.router.navigate(['stocktransfer/transferlist']);
  } else {
  localStorage.setItem('previousUrl','stocktransfer/transferredlist');

    this.router.navigate(['stocktransfer/transferredlist']);
  }
}
saveData() {
  // if (this.strMedium === '1' && this.strMediumNo === '') {
  //   this.toastr.error('Enter Courier number ' );
  //   return;
  // }
  if (this.strMedium === '1' && !this.intCourierName) {
    this.toastr.error('Select Courier name ' );
    return;
  }
  if (this.strMedium === '1' && ( this.strVehicleNo === '' || !this.strVehicleNo) ) {
    this.toastr.error('Select vehicle number ' );
    return;
  }
  if (this.strMedium === '1' && (this.strMediumPhNo === '' || this.strMediumPhNo === null)) {
    this.toastr.error('Enter contact number ' );
    return;
  }

  if(this.strMedium === '1' && this.strMediumPhNo){


    if(this.strMediumPhNo.toString().length > 10 || this.strMediumPhNo.toString().length < 10){
      this.toastr.error('Contact number is not valid');
      return;
    }

  }
  if (this.strMedium === '2' && this.strMediumNo === '') {
    this.toastr.error('Enter bus number ' );
    return;
  }
  if (this.strMedium === '2' && this.strMediumName === '') {
    this.toastr.error('Enter contact name ' );
    return;
  }
  if (this.strMedium === '2' && (this.strMediumPhNo === '' || this.strMediumPhNo === null)) {
    this.toastr.error('Enter contact number ' );
    return;
  }
  if(this.strMedium ==='2' && this.strMediumPhNo){
    if(this.strMediumPhNo.toString().length >10 || this.strMediumPhNo.toString().length <10 ){
      this.toastr.error('Contact number is not valid');
      return;
    }

  }
  if (this.strMedium === '3' && this.strMediumName === '') {
    this.toastr.error('Enter contact name' );
    return;
  }
  // if (this.strMedium === '3' && this.blnEway && this.strVehicleNo === '' || !this.strVehicleNo ) {
  //   this.toastr.error('Enter Vehicle number  ' );
  //   return;
  // }
  if (this.strMedium === '3' && (this.strMediumPhNo === '' || this.strMediumPhNo === null)) {
    this.toastr.error('Enter contact number  ' );
    return;
  }

  if(this.strMedium ==='3' && this.strMediumPhNo){
    if(this.strMediumPhNo.toString().length >10 || this.strMediumPhNo.toString().length <10 || this.strMediumPhNo === ''){
      this.toastr.error('Contact number is not valid');
      return;
    }

  }
  if (!this.intPackets) {
    this.toastr.error('Enter number of packets ' );
    return;
  }
  // if (!this.transpCost) {
  //   this.toastr.error('Enter transportaion Cost ' );
  //   return;
  // }
  const dctData = {
    'int_id': this.intId,
    // 'type': this.transferType,
    'intMedium': this.strMedium,
    'strMediumNo': this.strMediumNo,
    'strMediumName' : this.strMediumName,
    'strMediumPhNo' : this.strMediumPhNo,
    'intPackets' : this.intPackets,
    'int_courier_id': this.intCourierName,
    'str_vehicle': this.strVehicleNo,
    // 'dblExpense' : this.transpCost
  };
  this.blnSaveDisable = true;
  this.serviceObject.postData('internalstock/transfersave/', dctData).subscribe(res => {
    if (res.status === 1) {
      this.toastr.success('Transfer details saved successfully ');
      this.goBack();
    } else {
      this.blnSaveDisable = false;
      this.toastr.error('Error occured ' );
    }
  });

}
rejectData() {
  let int_packets = 0;
  Swal.fire({
    title: 'Enter number of packets received',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'OK',
    showLoaderOnConfirm: true,
    // preConfirm: (login) => {
    //   return fetch(`//api.github.com/users/${login}`)
    //     .then(response => {
    //       if (!response.ok) {
    //         throw new Error(response.statusText)
    //       }
    //       return response.json()
    //     })
    //     .catch(error => {
    //       Swal.showValidationMessage(
    //         `Request failed: ${error}`
    //       )
    //     })
    // },
    // allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.value) {
      int_packets = result.value;
      // console.log(result.value, int_packets,this.dctTransferData['int_packet_no']);
      // console.log(typeof(result.value), typeof(int_packets),typeof(this.dctTransferData['int_packet_no']));
      let dctData = {};
      if ( Number(int_packets) === this.dctTransferData['int_packet_no']) {
         dctData = {
          'int_id': this.intId,
          'int_packets': int_packets,
          'bln_acknowledge': true,



        };
      } else {
         dctData = {
          'int_id': this.intId,
          'int_packets': int_packets,
          'bln_acknowledge': false,

        };
      }
      this.blnPartialAcknowledgeDisable = true;

          this.serviceObject.postData('internalstock/acknowledgesave/', dctData).subscribe(res => {
            if (res.status === 1) {
              this.toastr.success('successfull ');
              this.goBack();
            } else {
              this.blnPartialAcknowledgeDisable = false;
              this.toastr.error('Error occured ' );
            }
          });
    }
  });
}

ackData() {
  this.blnAcknowledgeDisable =true;
  const dctData = {
    'int_id': this.intId,
    'bln_acknowledge': true
  };
    this.serviceObject.postData('internalstock/acknowledgesave/', dctData).subscribe(res => {
      if (res.status === 1) {
        this.toastr.success('successfull ');
        this.goBack();
      } else {
        this.toastr.error('Error occured ' );
        this.blnAcknowledgeDisable = false;
      }
    });
}
imeiAvailable(item,event){


 if(event.checked){
   this.lstAvailableImei.push(item.imei);
   this.blnImeiSave = true;
 }
 else{
  const index = this.lstAvailableImei.indexOf(item.imei, 0);
  if (index > -1) {
     this.lstAvailableImei.splice(index, 1);
  }
  if(this.lstAvailableImei.length == 0){
    this.blnImeiSave =false;
  }

 }
 console.log(this.lstAvailableImei,'eee');


}
imeiSave(){
  const dctData  = {}
  dctData['availableImei'] = this.lstAvailableImei;
  dctData['transferNum'] = this.dctMasterData['vchr_stktransfer_num'];


  dctData['itemId'] = this.lstItems[this.intItemIndex]['fk_item_id'];

  this.blnImeiSave = true;

  this.serviceObject.postData('branch_stock/item_restore/', dctData).subscribe(res => {
    if (res.status === 1) {
      this.toastr.success('successfull ');
      this.showModalImei.close();
      this.goBack();
    } else {
      this.blnImeiSave = false;
      this.toastr.error('Error occured ' );
    }
  });

}

ngOnDestroy() {

  if(this.showModalImei){
    this.showModalImei.close();
    }
  }
  corierNameChange(){

  this.serviceObject.postData('internalstock/courier_vehicle_typehead/',{'courier_id':this.intCourierName}).subscribe(res => {
    if (res.status === 1) {
      this.lstVehicleNo=res['vehicle']
    } else {
      this.toastr.error('Error occured ' );
    }
  });
  }
}
