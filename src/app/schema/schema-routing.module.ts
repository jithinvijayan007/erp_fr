import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddschemaComponent } from './addschema/addschema.component';
import { ListSchemaComponent } from './list-schema/list-schema.component';

const routes: Routes = [
  {
  path: '',
  children: [
    {
      path: 'addschema',
      component: AddschemaComponent,
      data: {
        title: 'Add Schema ',
        urls: [
          { title: 'Dashboard', url: '/dashboard' },
          { title: 'Add Schema ' }
        ]
      }
    }
  ]
},
{
  path: '',
  children: [
    {
      path: 'listschema',
      component: ListSchemaComponent,
      data: {
        title: 'Schema list ',
        urls: [
          { title: 'Dashboard', url: '/dashboard' },
          { title: 'Schema list ' }
        ]
      }
    }
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchemaRoutingModule { 

}