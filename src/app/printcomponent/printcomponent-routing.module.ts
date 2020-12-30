import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintcomponentComponent } from './printcomponent.component';

const routes: Routes = [
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: 'preview',
  //       component: PrintcomponentComponent,
  //       data: {
  //         title: 'preview ',
  //         urls: [
  //           { title: 'Dashboard', url: '/dashboard' },
  //           { title: 'preview' }
  //         ]
  //       }
  //     }
  //   ]
  // },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintcomponentRoutingModule { }
