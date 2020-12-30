import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { GuestRoutingModule } from './guest-routing.module';
import { AddguestComponent } from './addguest/addguest.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule } from '@angular/material/datepicker';
import { AmazingTimePickerModule } from 'amazing-time-picker';

@NgModule({
  declarations: [AddguestComponent],
  imports: [
    CommonModule,
    GuestRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    AmazingTimePickerModule
  ]
})
export class GuestModule { }
