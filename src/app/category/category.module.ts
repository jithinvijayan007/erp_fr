import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCategoryComponent } from './add-category/add-category.component';
import { RouterModule } from '@angular/router';
import { CategoryRoutes } from './category.routing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Ng2SmartTableModule } from 'ng2-smart-table';


@NgModule({
  declarations: [AddCategoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    Ng2SmartTableModule,
    RouterModule.forChild(CategoryRoutes),
  ]
})
export class CategoryModule { }
