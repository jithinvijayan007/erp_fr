import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewsupplier',
  templateUrl: './viewsupplier.component.html',
  styleUrls: ['./viewsupplier.component.css']
})
export class ViewsupplierComponent implements OnInit {
  dataLoaded=true;
  supplierId= localStorage.getItem('supplierRowId');
  supplierDetails= [];
  dctPerms = {add:false, edit:false, view:false, delete:false};

  pageTitle: string = 'Supplier';

  constructor(
    private serviceObject: ServerService,
    public router: Router
  ) { }

  ngOnInit() {
    this.getSupplierData(this.supplierId)
  }

  getSupplierData(id){
    
    this.serviceObject.getData('supplier/get_suplier_by_id/?id='+id).subscribe(
      result => {
        if (result['status']== 1){
          this.supplierDetails = result['lst_userdetailsview'][id]
        }
        
        this.dataLoaded = true;

      }, (error ) => { if(error.status == 401){
  localStorage.setItem('previousUrl','/user/sign-in');
        
        this.router.navigate(['/user/sign-in']);} }  );
    }

}
