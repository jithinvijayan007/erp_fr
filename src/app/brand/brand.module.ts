import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { BrandRoutes } from './brand.routing';

import { AddbrandComponent } from './addbrand/addbrand.component';
import { BrandlistComponent } from './brandlist/brandlist.component';

import { Ng2SmartTableModule } from 'ng2-smart-table';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    RouterModule.forChild(BrandRoutes),  
    Ng2SmartTableModule,   
    NgxSpinnerModule

  ],
  declarations: [
    AddbrandComponent,
    BrandlistComponent
  ]
})
export class BrandModule {}
