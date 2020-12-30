import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserloginComponent } from './userlogin/userlogin.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { RouterModule } from '@angular/router';
import { LoginRoutes } from './login.routing';
import { NgxSpinnerModule } from "ngx-spinner";


@NgModule({
  declarations: [UserloginComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    Ng2SmartTableModule,
    RouterModule.forChild(LoginRoutes),
    NgxSpinnerModule,
  ]
})
export class LoginModule { }
