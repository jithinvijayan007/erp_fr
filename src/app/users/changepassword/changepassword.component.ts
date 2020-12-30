import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2'

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  passwordContent = {existing_pass: '', new_pass: '', confirm_pass: ''}
  previousPage = localStorage.getItem('previousUrl')

  constructor(
    private router: Router,
    private serverService: ServerService
  ) { }

  ngOnInit() {
  }

  updateUserPassword() {
    // alert('test')
    if(this.passwordContent['existing_pass'].length === 0) {
      swal.fire({
        type: 'error',
        showConfirmButton: false,
        timer: 2000,
        title: 'error',
        text: 'Please enter the current password'
      });
      return false
    }
    if(this.passwordContent['existing_pass'] === this.passwordContent['new_pass'] ) {
      swal.fire({
        type: 'error',
        showConfirmButton: false,
        timer: 2000,
        title: 'error',
        text: 'Please enter different password'
      });
      return false
    }
    if(this.passwordContent['new_pass'].length < 8) {
      swal.fire({
        type: 'error',
        showConfirmButton: false,
        timer: 2000,
        title: 'error',
        text: 'Password strength is too short'
      });
      return false
    }
    if(this.passwordContent['new_pass'] !== this.passwordContent['confirm_pass']) {
      swal.fire({
        type: 'error',
        showConfirmButton: false,
        timer: 2000,
        title: 'error',
        text: 'New password and confirm password does not match'
      });
      return false;
    } else {
      let data = {
        userName:localStorage.getItem('username'),
        oldPassword:this.passwordContent['existing_pass'],
        newPassword:this.passwordContent['new_pass']
      }
     
      this.serverService.postData("user/change_passward/",data).subscribe(
        (response) => {

          if (response['status'] === 1) {
            swal.fire({
              type: 'success',
              showConfirmButton: false,
              timer: 2000,
              title: 'Success',
              text: response['message']
            });
            localStorage.setItem('previousUrl',this.previousPage);
            
            this.router.navigate([this.previousPage])
          }
          if(response['status'] == 0) {
            swal.fire({
              type: 'error',
              showConfirmButton: false,
              timer: 2000,
              title: 'Failed',
              text: response['message']
            });
          }
        },
        (error) => {
          swal.fire({
            type: 'error',
            showConfirmButton: false,
            timer: 2000,
            title: 'Failed',
            text: error['message']
          });
        }
      );


    }

  }
  canceledit() {
    localStorage.setItem('previousUrl',this.previousPage);
    
    this.router.navigate([this.previousPage])
  }

}
