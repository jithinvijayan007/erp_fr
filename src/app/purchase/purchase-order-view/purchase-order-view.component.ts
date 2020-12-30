import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-purchase-order-view',
  templateUrl: './purchase-order-view.component.html',
  styleUrls: ['./purchase-order-view.component.css']
})
export class PurchaseOrderViewComponent implements OnInit {

  dctMasterData = {};
  data = [];
  intMasterId;
  displayedColumns = ['slno', 'fk_item__vchr_name','rate', 'int_qty','amount'];
  dataSource;
  
  constructor(
    private serviceObject: ServerService,
    public toastr: ToastrService,
    public router: Router,) {

     }
  ngOnInit() {
    this.listData();
  }
  listData () {
    this.intMasterId = localStorage.getItem('intMasterId');
    this.serviceObject.postData('purchase/list_purchase_order/', {'intMasterId': this.intMasterId}).subscribe(res => {
    if (res.status == 1) {

      this.dctMasterData = res['data'];
      this.dctMasterData['lst_item_details'].forEach((element, index) => {
        element['slno'] = index + 1;
      });
      
      this.dataSource=this.dctMasterData['lst_item_details']

    } else {
      this.toastr.error('Error occured ' );
    }
  });
}

goBack() {
  localStorage.removeItem('intMasterId');
  localStorage.setItem('previousUrl','purchase/purchaseorderlist');
  
  this.router.navigate(['purchase/purchaseorderlist']);
}

}
