import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AddproductComponent } from './addproduct/addproduct.component';
import { ProductRoutes } from './product.routing';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ListproductComponent } from './listproduct/listproduct.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [AddproductComponent, ListproductComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProductRoutes),
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    Ng2SmartTableModule,
    MatCheckboxModule,
    NgxSpinnerModule

  ]
})
export class ProductModule { }
