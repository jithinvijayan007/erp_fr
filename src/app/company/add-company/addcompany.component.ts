import { Component, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-company',
  templateUrl: './addcompany.component.html',
  styleUrls: ['./addcompany.component.css']
  
})
export class AddCompanyComponent {

  strName = '';
  intContact ;
  strGST ;
  strEmail = '';
  strAddress = '';
  imgLogo;
  imgprintLogo;
  vchr_logo;
  vchr_print_logo;
  int_status = 0
  bln_edit = false
  bln_update;
  int_company ;
  hostaddress;
  protocol;
  hostname;
  port;

  public imagePath;
  imgURL: any;
  public message: string;

  form: FormGroup;
  registerForm: FormGroup;

  @ViewChild('comapnyId') comapnyId: any;
  @ViewChild('contactId') contactId: any;
  @ViewChild('emailId') emailId: any;
  @ViewChild('gstId') gstId: any;
  @ViewChild('addressId') addressId: any;
  @ViewChild('file1') file1: any;
  @ViewChild('file2') file2: any;
  
  constructor(private serviceObject: ServerService, 
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              public router: Router,
            ){
    
  }
  ngOnInit(){
    
    
    this.hostaddress = this.serviceObject.hostAddress
    this.hostaddress = this.hostaddress.slice(0, this.hostaddress.length - 1)
    
    this.bln_update = 0
    this.getdata()
    this.form = this.formBuilder.group({
      print_logo: [''],
      logo: [''],
    });

    this.registerForm = this.formBuilder.group({
      company: ['', Validators.required],
      contact: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      gst: ['', Validators.required],
      });

  }
  
  // get f() { return this.registerForm.controls; }
  
  AddCompany(){
    if (!this.strName) {
      this.comapnyId.nativeElement.focus();
      this.toastr.error('Company Name is required', 'Error!');
      return false;
    } else if (!this.strGST){
      this.gstId.nativeElement.focus();
      this.toastr.error('GSTIN NO is required', 'Error!');
      return false;
    } else if (!this.intContact){
      this.contactId.nativeElement.focus();
      this.toastr.error('Contact No required', 'Error!');
      return false;
    } else if (!this.strEmail){
      this.emailId.nativeElement.focus();
      this.toastr.error('Email is required', 'Error!');
      return false;
    } else if (!this.strAddress || this.strAddress.length < 5){
      this.addressId.nativeElement.focus();
      this.toastr.error('Company Address is required', 'Error!');
      return false;
    } else if (!this.form.get('logo').value && this.int_status == 0){
      this.file1.nativeElement.focus();
      this.toastr.error('Logo is required', 'Error!');
      return false;
    } else if (!this.form.get('print_logo').value && this.int_status == 0){
      this.file2.nativeElement.focus();
      this.toastr.error('Print Logo is required', 'Error!');
      return false;
    }else{
        const form_data = new FormData;

        if (this.intContact) {
          if (+(this.intContact) > 1000000000 && +(this.intContact) < 1000000000000) {
            form_data.append('vchr_phone', String(this.intContact).trim());
          }
          else {
            this.contactId.nativeElement.focus();
            this.toastr.error('Contact No is invalid', 'Error!');
            return false;
          }
        }
        if (this.strEmail) {
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(this.strEmail)) {
            form_data.append('vchr_mail', String(this.strEmail).trim());
            } else {
              this.emailId.nativeElement.focus();
              this.toastr.error('Email is invalid', 'Error!');
              return false;
            }
        }
        
        
        form_data.append('vchr_update', this.bln_update)
        form_data.append('pk_bint_id', this.int_company)
        form_data.append('vchr_name', this.strName)
        form_data.append('vchr_gstin', this.strGST)
        form_data.append('vchr_address', this.strAddress)


        // form_data.append('vchr_logo', this.imgLogo)
        form_data.append('vchr_logo', this.form.get('logo').value)
        // form_data.append('vchr_print_logo', this.imgprintLogo)
        form_data.append('vchr_print_logo', this.form.get('print_logo').value)
        
        
        this.serviceObject.addCompany('company/registration/',form_data).subscribe(
          (response) => {
            if (response.status == 1) {
              swal.fire({
                position: "center",
                type: "success",
                text: "Data saved successfully",
                showConfirmButton: true,
              });
              this.getdata()
              this.bln_update = 1
            }
            else if (response.status == 0) {
              swal.fire('Error!', response['reason'], 'error');
            }
          },
          (error) => {
            swal.fire('Error!','Something went wrong!!', 'error');

          }
        );
      }
    }

  previewLogo(event){

      const logo = event.target.files;
      const file = logo[0];
      this.imgLogo = file;

      if (this.imgLogo) {
        const img_up = new Image;
        let img_ratio_up = 0;
        img_up.onload = () => {
          const width_up = img_up.width;
          const height_up = img_up.height;

          img_ratio_up = width_up / height_up;
          img_ratio_up = Math.floor(img_ratio_up * 10) / 10;

          if (img_ratio_up >= 4 && img_ratio_up <= 4.5) {
            if (event.target.files.length > 0) {
              const file = event.target.files[0];
              this.imgLogo = file
              this.form.get('logo').setValue(file);
            }
          } else {
            $('.error1').fadeIn(400).delay(3000).fadeOut(400);
            this.file1.nativeElement.value = null;
            // this.imgLogo = null;
            swal.fire("Error", 'Logo ratio must be 4:1', "error");
            this.file1.nativeElement.value = "";
            this.form.get('logo').setValue('')

          }
        };
        img_up.src = window.URL.createObjectURL(this.imgLogo);
      }


    }

  previewPrint(files, event, filename){
      if (files.length === 0)
      return;
      this.imgprintLogo = files
      var mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
      }

      const img_files = event.target.files;
      const file = img_files[0];
      this.imgprintLogo = file;

    if (this.imgprintLogo) {
      
        const img_up = new Image;
        let img_ratio_up = 0;
        img_up.onload = () => {
          const width_up = img_up.width;
          const height_up = img_up.height;

          img_ratio_up = width_up / height_up;
          img_ratio_up = Math.floor(img_ratio_up * 10) / 10;

          if (img_ratio_up >= 4 && img_ratio_up <= 4.5) {
            
            // for preview 
            var reader = new FileReader();
            this.imagePath = files;
            reader.readAsDataURL(files[0]);
            reader.onload = () => {
              this.imgURL = reader.result;
            }
            if (event.target.files.length > 0) {
              const file = event.target.files[0];
              this.imgprintLogo = file
              this.form.get('print_logo').setValue(file);
            }
            
          } else {
            $('.error1').fadeIn(400).delay(3000).fadeOut(400);
            this.file2.nativeElement.value = null;
            // this.imgprintLogo = null;
            swal.fire("Error", 'Print Logo ratio must be 4:1', "error");
            this.file2.nativeElement.value = "";
            this.imgURL = null
            this.form.get('print_logo').setValue('')
          }
        };
      img_up.src = window.URL.createObjectURL(this.imgprintLogo);
        // return status
      }
      
  }

  ClearData(){
    Swal.fire({
      title: 'Cancel',
      text: "Are you sure want to Cancel ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes, Cancel it!",
    }).then(result => {
      if (result.value) {

        this.form.reset();
        
        this.strName = '';
        this.intContact = '';
        this.strGST = '';
        this.strEmail = '';
        this.strAddress = '';
        this.form.get('logo').setValue('')
        this.form.get('print_logo').setValue('')
        this.imgURL = ''
        this.imgLogo = null;
        this.imgprintLogo = null;
        this.file1.nativeElement.value = null
        this.file2.nativeElement.value = null
      };

    });

  }

getdata(){

  this.serviceObject.getData('company/registration/').subscribe(
    (response) => {
      if (response.status == 1) {
        if (response['data'][0]){
          this.strName = response['data'][0]['vchr_name']
          this.intContact = response['data'][0]['vchr_phone']
          this.strGST = response['data'][0]['vchr_gstin']
          this.strEmail = response['data'][0]['vchr_mail']
          this.strAddress = response['data'][0]['vchr_address']
          this.int_company = response['data'][0]['pk_bint_id']
  
          this.vchr_logo = response['data'][0]['vchr_logo']
          this.vchr_print_logo = response['data'][0]['vchr_print_logo']
  
          // 
          this.int_status = 1
          this.bln_edit = false
          this.bln_update = 1
        }else{
          this.int_status = 0
          this.bln_edit = true
          this.bln_update = 0
        }
        
        // this.strName =  response.data['']
      }
      else if (response.status == 0) {
        swal.fire('Error!', response['reason'], 'error');
      }
    },
    (error) => {
      swal.fire('Error!','Something went wrong!!', 'error');

    }
  );

}

  EditFunc(){
    this.bln_edit = true
    this.int_status = 2
    this.bln_update = 1
  }
  CancelEdit(){
    this.bln_edit = false
  }
}
