import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HierarchyRoutingModule } from './hierarchy-routing.module';
import { AddComponent } from './add/add.component';
import { SingleSelectDropDownComponent } from './single-select-drop-down/single-select-drop-down.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AddComponent],
  imports: [
    CommonModule,
    HierarchyRoutingModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
  ],
})
export class HierarchyModule { }
