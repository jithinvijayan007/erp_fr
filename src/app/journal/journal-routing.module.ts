import { AddJournalComponent } from './add-journal/add-journal.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListJournalComponent } from './list-journal/list-journal.component';
import { ViewJournalComponent } from './view-journal/view-journal.component';

const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'addjournal',
        component: AddJournalComponent,
        data: {
          title: 'Add Journal',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Add Journal' }
          ]
        }
      }]
    },
    {
      path: '',
      // canActivate: [AuthGuard],
      children: [
        {
          path: 'listjournal',
          component: ListJournalComponent,
          data: {
            title: 'List Journal',
            urls: [
              { title: 'Dashboard', url: '/dashboard' },
              { title: 'List Journal' }
            ]
          }
        }]
      },
      {
        path: '',
        // canActivate: [AuthGuard],
        children: [
          {
            path: 'viewjournal',
            component: ViewJournalComponent,
            data: {
              title: 'View Journal',
              urls: [
                { title: 'Dashboard', url: '/dashboard' },
                { title: 'View Journal' }
              ]
            }
          }]
        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalRoutingModule { }
