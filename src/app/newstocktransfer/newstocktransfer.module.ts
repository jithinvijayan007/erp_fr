import { NgxSpinnerModule } from "ngx-spinner";import { SelectDropDownModule } from 'ngx-select-dropdown';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewstocktransferRoutingModule } from './newstocktransfer-routing.module';
import { StocktransferComponent } from './stocktransfer/stocktransfer.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { GoodsretunlistComponent } from './goodsretunlist/goodsretunlist.component';
import { GoodsreturnviewComponent } from './goodsreturnview/goodsreturnview.component';
import { AddgoodsreturnComponent } from './addgoodsreturn/addgoodsreturn.component';

@NgModule({
  declarations: [StocktransferComponent, GoodsretunlistComponent, GoodsreturnviewComponent, AddgoodsreturnComponent],
  imports: [
    CommonModule,
    NewstocktransferRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    Ng2SmartTableModule,
    SelectDropDownModule,
    NgxSpinnerModule  ]
})
export class NewstocktransferModule { }
