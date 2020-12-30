import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemlistRoutingModule } from './itemlist-routing.module';
import { ItemlistComponent } from './itemlist.component';
import { RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgbdDatepickerBasicComponent } from '../../component/datepicker/datepicker.component';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [ItemlistComponent],
  imports: [
    CommonModule,
    ItemlistRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2SmartTableModule,
    NgbModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    NgxSpinnerModule    // MatNativeDateModule,
  ]
})
export class ItemlistModule { }
