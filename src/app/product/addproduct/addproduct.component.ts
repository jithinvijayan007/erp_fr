import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import { log } from 'util';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {

  strName = '';
  categorySelected = '';
  // strHSN = '';
  // strSAC = '';
  lstCategory = [];
  type = 'SALE';
  blnService= false;
  blnSales= false;
  lst_sale=[];
  blnEdit = false;
  editId = localStorage.getItem('productId')

  @ViewChild('idName', { static: true }) idName: any;
  // @ViewChild('idHSN') idHSN: any;
  // @ViewChild('idSAC') idSAC: any;

  constructor(
    private serviceObject: ServerService,
    private toastr: ToastrService,
    public router: Router,
  ) { }

  ngOnInit() {
    if (this.editId) {
      this.blnEdit = true;
      this.getDataById();
    }
    
    this.getCategoryData();
  }


  getCategoryData(){
    this.serviceObject.getData('products/get_category/').subscribe(res => {
      
      this.lstCategory = res['category'];
    });
  }

  getDataById(){
    localStorage.setItem('productId','');
    this.serviceObject.getData('products/add_product/?product_id='+this.editId).subscribe(
      (response) => {
          if (response.status == 1) {
          this.strName = response['data'][0]['vchr_name'];
          this.categorySelected = response['data'][0]['fk_category_id'];
          // this.strHSN = response['data'][0]['vchr_hsn_code'];
          // this.strSAC = response['data'][0]['vchr_sac_code'];
          // this.type = response['data'][0]['bln_sales'];
          // console.log(response['data'][0]['json_sales'])
          if (response['data'][0]['json_sales']){
            if(response['data'][0]['json_sales'].indexOf('Sales') !== -1) {this.blnSales= true}
            if(response['data'][0]['json_sales'].indexOf('Service') !== -1) {this.blnService= true}
          }
            // if (response['data'][0]['bln_sales']) {
            //   this.type = 'SALE';
            // }else{
            //   this.type ='SERVICE';
            // }
            
          }  
          else if (response.status == 0) {
           swal.fire('Error!','Something went wrong!!', 'error');
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
        
      });
  }

  AddProduct(){
    if (!this.strName || (!/^[a-zA-Z ]+$/.test(this.strName))) {
      this.idName.nativeElement.focus();
      this.toastr.error('Enter valid product name', 'Error!');
      return false;
    }else if(!this.categorySelected){
      this.toastr.error('Select valid category', 'Error!');
      return false;
    // }else if(!this.strHSN){
    //   this.idHSN.nativeElement.focus();
    //   this.toastr.error('Enter valid HSN code', 'Error!');
    //   return false;
    // }else if(!this.strSAC){
    //   this.idSAC.nativeElement.focus();
    //   this.toastr.error('Enter valid SAC code', 'Error!');
    //   return false;
    }
    else if(!this.blnSales && !this.blnService){
      this.toastr.error('Select Product Type', 'Error!');
      return false;
    }
    
    else{
      let dctData = {}
      dctData['vchr_name'] = this.strName.trim();
      dctData['fk_category_id'] = Number(this.categorySelected);
      // dctData['vchr_hsn_code'] = this.strHSN;
      // dctData['vchr_sac_code'] = this.strSAC;
      // if (this.type == 'SALE') {
      //   dctData['bln_sales'] = true;
      // }else{
      //   dctData['bln_sales'] = false;
      // }
      // console.log(this.blnSales,this.blnService)
      this.lst_sale=[];
      if (this.blnSales) {this.lst_sale.push("Sales")}
      if (this.blnService) {this.lst_sale.push("Service")}
      dctData['json_sales'] = this.lst_sale;
      if (!this.blnEdit) {
        this.serviceObject.postData('products/add_product/', dctData).subscribe(
          (response) => {
              if (response.status == 1) {
                swal.fire({
                  position: "center", 
                  type: "success",
                  text: "Data saved successfully",
                  showConfirmButton: true,  
                });      
    localStorage.setItem('previousUrl','product/productlist');
                
                this.router.navigate(['product/productlist']);
    
              }  
              else {
                swal.fire('Error!', response['reason'], 'error');
    
              }
          },
          (error) => {   
           swal.fire('Error!','Something went wrong!!', 'error');
            
          });
      }else{
        dctData['product_id'] = this.editId;
        this.serviceObject.putData('products/add_product/', dctData).subscribe(
          (response) => {
              if (response.status == 1) {
                swal.fire({
                  position: "center", 
                  type: "success",
                  text: "Data saved successfully",
                  showConfirmButton: true,  
                });      
    localStorage.setItem('previousUrl','product/productlist');
                
                this.router.navigate(['product/productlist']);
    
              }  
              else {
                swal.fire('Error!', response['reason'], 'error');
                
              }
          },
          (error) => {   
           swal.fire('Error!','Something went wrong!!', 'error');
          
          });
      }
      
    }
  }


  clearFields(){
    localStorage.setItem('previousUrl','product/productlist');
    
    this.router.navigate(['product/productlist']);
  }
}
