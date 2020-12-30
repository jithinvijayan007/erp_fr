import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-accouting',
  templateUrl: './list-accouting.component.html',
  styleUrls: ['./list-accouting.component.css']
})
export class ListAccoutingComponent implements OnInit {

  blnShowData = false;

  displayedColumns = ['moduleName','category','branch', 'chartofacc','action'];
  dataSource;

  data;

  constructor(
    private serviceObject: ServerService, 
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
  ) { }

  ngOnInit() {

    this.getData()
  }

  getData()
  {
    
    this.serviceObject.getData('accounts_map/accounts_map/').subscribe(
      (response) => {
          if (response.status == 1)
          {
            this.data = response['lst_account_map'];
            this.dataSource=this.data
            this.blnShowData = true;
          }  
          else if (response.status == 0) 
          {
           swal.fire('Error!','Something went wrong!!', 'error');
           this.data=[];

           if(this.data.length>0){
             this.blnShowData=true;
            }
            else{
             this.blnShowData=false;
            }
          }
      },
      (error) => {   
       swal.fire('Error!','Something went wrong!!', 'error');
      });
  }
  onEdit(id)
  {
    localStorage.setItem('accountId',id);
    localStorage.setItem('previousUrl','accounting/editaccounting');
    this.router.navigate(['accounting/editaccounting']);
  }
  onDelete(id){

    swal.fire({
      title: "Confirm",
      text: "Do you want to delete the Account?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then(result1 => {
      if (result1.value) {
       let p = {}
        p['intAccountId'] = id;
        p['blnDelete'] = true;
        this.serviceObject.putData('accounts_map/accounts_map/',p).subscribe(result => {
          // const result = res.json();
          if (result.status === 1) {
            swal.fire("Account Deleted", result['data'], "success");
            this.getData();
          } else {
            swal.fire("Account Delete", result['data'], "error");
            this.getData();
          }
        });


      }
    });

  }

}
