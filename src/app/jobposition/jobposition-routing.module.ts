import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobpositionComponent } from './jobposition/jobposition.component';
// import { JobpositionlistComponent } from './jobpositionlist/jobpositionlist.component'
// import { JobpositioneditComponent } from './jobpositionedit/jobpositionedit.component';
// import { AuthGuard } from "../auth.guard";
const routes: Routes = [
  {
    path: '',
    children: [
      // {
      //   path: 'jobposition',
      //   // canActivate: [AuthGuard],
      //   component: TestOneComponent,
      // },
      {
        path: 'jobposition',
        // canActivate: [AuthGuard],
        component: JobpositionComponent,
      },
      // {
      //   path: 'jobpositionlist',
      //   // canActivate: [AuthGuard],
      //   component: JobpositionlistComponent,
      // },
      // {
      //   path: 'jobpositionedit',
      //   // canActivate: [AuthGuard],
      //   component: JobpositioneditComponent,
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobpositionRoutingModule { }
