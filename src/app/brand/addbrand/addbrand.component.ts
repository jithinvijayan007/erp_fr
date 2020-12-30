import { Component } from '@angular/core';
import { ServerService } from '../../server.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

// import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-addbrand',
  templateUrl: './addbrand.component.html',
  styleUrls: ['./addbrand.component.css']
})
export class AddbrandComponent {
  strBrand:'';
  constructor(private serviceObject: ServerService,
    public router: Router,

    // public toastr: ToastsManager,
  ){

  }
  addBrand()
  {
    if(!this.strBrand){
      swal.fire('Error!', 'Enter Brand Name', 'error');
      
    }
    else{
      let dct_data = {}
      dct_data['strBrand']=this.strBrand
      this.serviceObject.postData('brands/add_brands/', dct_data)   .subscribe(
        (response) => {
            if (response.status == 1) {
              swal.fire({
                position: "center", 
                type: "success",
                text: "Data saved successfully",
                showConfirmButton: true,  
              });      
             localStorage.setItem('previousUrl','brand/brandlist');
              
              this.router.navigate(['brand/brandlist']);
  
            }  
            else if (response.status == 0) {
              swal.fire('Error!', response['reason'], 'error');
  
              // this.toastr.error(response['message']);
            }
        },
        (error) => {   
          swal.fire('Error!','Something went wrong!!', 'error');
          
        });
    }
  
  }
  cancel(){
    this.strBrand=''
  }
  }
  

