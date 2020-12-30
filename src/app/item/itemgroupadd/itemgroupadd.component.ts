import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ServerService } from '../../server.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-itemgroupadd',
  templateUrl: './itemgroupadd.component.html',
  styleUrls: ['./itemgroupadd.component.css']
})
export class ItemgroupaddComponent implements OnInit {

  ngOnInit() {
  }
  source: LocalDataSource;
  data;
  strGroup: '';

  constructor(
    private serviceObject: ServerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router

    ) {
    this.source = new LocalDataSource(this.data); // create the source

  }

  addGroup() {
    if (!this.strGroup) {
      Swal.fire('Error!', 'Enter Item Group Name', 'error');

    }
    else {
      let dct_data = {}
      dct_data['vchr_item_group'] = this.strGroup
      this.serviceObject.postData('itemgroup/additemgroup/', dct_data).subscribe(
        (response) => {
          if (response.status == 1) {
            Swal.fire({
              position: "center",
              type: "success",
              text: "Data saved successfully",
              showConfirmButton: true,
            });
            this.strGroup = ''
            // this.getData();
    localStorage.setItem('previousUrl','item/itemgrouplist');
            
            this.router.navigate(['item/itemgrouplist/']);

          }
          else if (response.status == 0) {
            Swal.fire('Error!', response['reason'], 'error');
          }
        },
        (error) => {
          Swal.fire('Error!', 'error', 'error');

        });
    }

  }
  cancel() {
    this.strGroup = ''
  }

  
}
