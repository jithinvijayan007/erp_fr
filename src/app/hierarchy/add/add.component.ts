import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/server.service'
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  
  hierarchyName
  lst_hierarchy
  strName = ""
  strCode = ""
  master_id

  constructor(private serverService: ServerService, public router: Router, public toastr: ToastrService) { }

  ngOnInit(): void {
    this.hierarchyName = localStorage.getItem('SubMenu').split(" ")[1]; 
    this.serverService.getData('hierarchy/hierarchy?hierarchy_name=' + this.hierarchyName).subscribe(res => {
      if (res.status == 1) {
        
        this.lst_hierarchy = res['data']
        
      }
      
    }, err => {
        console.log(err);
        
    })
    this.router.navigate(['hierarchy/add-location']);

  };
  onChangeGroup(item) {
    this.master_id = item.pk_bint_id
  }
  Submit_data() {
    if (this.strName == '' || this.strName == null || this.strName == 'undefined') {
      this.toastr.error('Enter the name', 'Error!');
      return false
    }
    else if (this.strCode == '' || this.strCode == null || this.strCode == 'undefined') {
      this.toastr.error('Enter the code', 'Error!');
      return false
    }
    else if (this.master_id == null || this.master_id == 0) {
      this.toastr.error('Select One', 'Error!');
      return false
    }else {
      let dct_data = {}
      dct_data['hierarchy_name'] = this.hierarchyName
      dct_data['vchr_name'] = this.strName
      dct_data['vchr_code'] = this.strCode
      dct_data['master_id'] = this.master_id
      this.serverService.postData('hierarchy/hierarchy', dct_data).subscribe(res => {
        if (res.status == 1) {
          swal.fire('Success', this.hierarchyName+' Added','success')
          this.strName = ""
          this.strCode = ""
        } else if (res.status == 0) {
          swal.fire('Error!', res['reason'], 'error');
        }
      },
        err => {
          swal.fire('Error!', 'Something went wrong!!', 'error');
        })
    
    }
  }


}
  
// }
