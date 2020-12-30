import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoyaltycardRoutingModule } from './loyaltycard-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddloyaltycardComponent } from './addloyaltycard/addloyaltycard.component';
import { ViewloyalitypointComponent } from './viewloyalitypoint/viewloyalitypoint.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [AddloyaltycardComponent, ViewloyalitypointComponent],
  imports: [
    CommonModule,
    LoyaltycardRoutingModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatInputModule, 
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class LoyaltycardModule { }
