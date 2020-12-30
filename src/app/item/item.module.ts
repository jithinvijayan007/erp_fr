import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ItemRoutingModule } from './item-routing.module';
import {ItemRoutes} from './item-routing.module'
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {AdditemcategoryComponent} from '././additemcategory/additemcategory.component';
import { ItemgroupaddComponent } from './itemgroupadd/itemgroupadd.component';
import { AdditemComponent } from './additem/additem.component';
import { ItemlistComponent } from './itemlist/itemlist.component';
import { ItemgrouplistComponent } from './itemgrouplist/itemgrouplist.component'
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [ItemgrouplistComponent],
  imports: [
    CommonModule,
    ItemRoutingModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    RouterModule.forChild(ItemRoutes),
    Ng2SmartTableModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    NgxSpinnerModule  ]
})
export class ItemModule { }
