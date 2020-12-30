import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdditemRoutingModule } from './additem-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { AdditemComponent } from './additem.component';

@NgModule({
  declarations: [AdditemComponent],
  imports: [
    CommonModule,
    AdditemRoutingModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatCheckboxModule
  ]
})
export class AdditemModule { }
