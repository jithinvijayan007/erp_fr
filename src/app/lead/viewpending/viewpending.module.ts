import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewpendingRoutingModule } from './viewpending-routing.module';
import { ViewpendingComponent } from './viewpending.component';
import { CardModule } from 'src/app/card.module';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms/forms';
import { DateAdapter } from '@angular/material/core';

@NgModule({
  imports: [
    CardModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ViewpendingRoutingModule,
  ],
  declarations: [
    ViewpendingComponent
  ]
})
export class ViewpendingModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('en-in'); // DD/MM/YYYY
  }
 }
