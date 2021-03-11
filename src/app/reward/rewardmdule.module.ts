import { Addreward1Component } from './addreward1/addreward1.component';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AddrewardComponent } from './addreward/addreward.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { RewardmduleRoutingModule } from './rewardmdule-routing.module';


@NgModule({
  declarations: [AddrewardComponent,Addreward1Component],
  imports: [
    CommonModule,
    RewardmduleRoutingModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    CdkTableModule,
    CdkTreeModule,
    MatChipsModule,
    MatInputModule
  ]
})
export class RewardmduleModule { }
