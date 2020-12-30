import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-salesview',
  templateUrl: './salesview.component.html',
  styleUrls: ['./salesview.component.css']
})
export class SalesviewComponent implements OnInit {

  invoiceNo=localStorage.getItem('invoiceNo')
  invoiceId = localStorage.getItem('invoiceId')

  data=[]
  dctMaster={}
  dctDetails=[]
  dictReturnDetails =[];
  blnShowData=false;
  hostname = '';
  dctPostData ={'strInvoiceNo':this.invoiceNo,'intSalesMasterId':this.invoiceId}
  constructor(private serviceObject: ServerService,
    private toastr: ToastrService,
    public router: Router,) { }

  ngOnInit() {
    this.hostname = this.serviceObject.hostAddress
    this.hostname = this.hostname.slice(0, this.hostname.length - 1)
    this.getData()
  }

  getData(){

    this.serviceObject.postData('salesreturn/sales_return_view/',this.dctPostData).subscribe(
      (response) => {
          if (response.status == 1)
          {
            this.dctDetails=response['other_items'];
            this.dictReturnDetails = response['lst_retuned_items'];
            this.dctMaster=response['lst_master_details']['0'];
            this.dctMaster['staff_name']=this.dctMaster['fk_staff__first_name'] +' '+this.dctMaster['fk_staff__last_name']
            if(this.dctMaster['vchr_remarks']){
              this.dctMaster['blnRemark']= true;
            }
            this.dctDetails.forEach(element => {
              element.json_imei= element.json_imei.toString();
              if(element.dbl_amount<0){
                   element.dbl_amount=(element.dbl_amount)*-1;
                   element.dbl_selling_price=(element.dbl_selling_price)*-1;
              }
           
            });
            this.dictReturnDetails.forEach(element => {
              element.jsn_imei= element.jsn_imei.toString();
              
           
            });
            
           
            

            // this.dictReturnDetails.forEach(element => {
            //   element.json_imei= element.json_imei.replace(/,\s*$/, "")
           
            // });
            
          }  
          else if (response.status == 0) 
          {
           swal.fire('Error!','Something went wrong!!', 'error');
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
      });
   }

}
