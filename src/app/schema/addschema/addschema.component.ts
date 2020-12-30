import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment' ;
import { Router } from '@angular/router';

@Component({
  selector: 'app-addschema',
  templateUrl: './addschema.component.html',
  styleUrls: ['./addschema.component.css']
})
export class AddschemaComponent implements OnInit {
  datFrom;
  datTo;
  strSchema = '';
  registerForm;
  // blnEdit=false
  // editId = localStorage.getItem('schemaId')

  constructor(
    private serviceObject: ServerService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    public router: Router,
    private formBuilder: FormBuilder) { 
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      strSchema: ['', Validators.required]
    });

    this.datFrom = new Date();
    this.datTo = new Date();
  }

  addSchema(){

    let dctData = {};
    let fromDate = moment(this.datFrom).format('YYYY-MM-DD');
    let toDate   = moment(this.datTo).format('YYYY-MM-DD');

    dctData['datFrom'] = fromDate;
    dctData['datTo'] = toDate;
    dctData['scheme'] = this.strSchema;

    if(!this.strSchema){
      // this.strSchema.nativeElement.focus();
      this.toastr.error('Scheme is required', 'Error!');

    }
    if(this.strSchema){
      this.spinnerService.show();
      
      this.serviceObject.postData('scheme/addscheme/',dctData).subscribe(
        (response) => {
            if (response.status == 1)
            { 
              this.spinnerService.hide();
              this.toastr.success('Successfully Added', 'Success!');
              this.strSchema = '';
              this.datFrom = new Date()
              this.datTo = new Date();
              this.router.navigate(['schema/listschema']);

            }  
            
            else if (response.status == 0) 
            {
              this.spinnerService.hide();
            Swal.fire('Error!',response['message'], 'error');
            }
        },
        (error) => { 
          this.spinnerService.hide();  
        Swal.fire('Error!','Something went wrong!!', 'error');
        });
      }
  }
  cancel(){
    this.strSchema = '';
this.datFrom = new Date();
    this.datTo = new Date();
  }
}
