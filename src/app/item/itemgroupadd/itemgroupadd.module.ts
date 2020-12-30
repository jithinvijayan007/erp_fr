import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemgroupaddRoutingModule } from './itemgroupadd-routing.module';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ItemgroupaddComponent } from './itemgroupadd.component';

@NgModule({
  declarations: [ItemgroupaddComponent],
  imports: [
    CommonModule,
    ItemgroupaddRoutingModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    Ng2SmartTableModule,
  ]
})
export class ItemgroupaddModule { }
