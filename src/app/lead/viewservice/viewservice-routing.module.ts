import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AuthGuard } from 'app/shared/guard/auth.guard';
import { ViewserviceComponent } from './viewservice.component';
const routes: Routes = [{
  path: '',
  // canActivate: [AuthGuard],
  component: ViewserviceComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewserviceRoutingModule { }
