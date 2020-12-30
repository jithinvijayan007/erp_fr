// import * as tableData from './../../table/smart-table/smart-data-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, ViewChild,OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-supplierlog',
  templateUrl: './supplierlog.component.html',
  styleUrls: ['./supplierlog.component.css']
})
export class SupplierlogComponent implements OnInit {



  constructor(private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,) {
    this.source = new LocalDataSource(this.data); // create the source
      
  }
  supplierRowId= localStorage.getItem('supplierRowId');
  source: LocalDataSource;
  data;
  ngOnInit(){
    this.getData()
  }
  dctData={}

  settings = {
    hideSubHeader: true,        
    actions: {
      add: false,
      edit: false,
      delete:false,
      position: 'right'
    },
    columns: {
      dat_created: {
        title: 'Date',
        filter: false
      },
      status: {
        title: 'Status',
        filter: false
      },
      vchr_remarks: {
        title: 'Remarks',
        filter: false
      },
     
    },
  };
  getData(){
    this.serviceObject.getData('supplier/supplier_history/?id='+ this.supplierRowId).subscribe(
      (response) => {
          if (response.status == 1)
          {
            this.data=response['lstsupplierlog'];
            
            for(let item of this.data ){
              if( item['vchr_status']=="1"){
               item['status']="Active"
              }
              else if( item['vchr_status']=="2"){
                item['status']="Deactive"
              }
              item['dat_created']=moment(item['dat_created']).format('DD/MM/YYYY');
            }
            this.source= this.data
            console.log(this.data,"data");
            
          }
      });
    }


}
