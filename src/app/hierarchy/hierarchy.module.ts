import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HierarchyRoutingModule } from './hierarchy-routing.module';
import { AddComponent } from './add/add.component';
import { SingleSelectDropDownComponent } from './single-select-drop-down/single-select-drop-down.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HierarchyComponent } from './hierarchy/hierarchy.component'
// import { SnotifyService } from 'ng-snotify';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CardModule } from '../card.module';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    AddComponent,
    HierarchyComponent],
  imports: [
    CommonModule,
    HierarchyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    CardModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatRadioModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatPaginatorModule

  ],
  // providers: [
  //   TesteventService
  // ]
})
export class HierarchyModule { }
