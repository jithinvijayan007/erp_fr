import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddrewardComponent } from './addreward/addreward.component';
import { Addreward1Component } from './addreward1/addreward1.component';
// import { Reward1ListComponent } from './reward1-list/reward1-list.component';

// import { Reward1ViewComponent } from './reward1-view/reward1-view.component';
// import { RewardlistComponent } from './rewardlist/rewardlist.component';
// import { RewardpaymentComponent } from './rewardpayment/rewardpayment.component';
// import { StaffdetailsComponent } from './staffdetails/staffdetails.component';
// import { StaffrewardsComponent } from './staffrewards/staffrewards.component';
// import { ViewrewardComponent } from './viewreward/viewreward.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'addreward',
        component: AddrewardComponent,
        data: {
          title: 'Add Reward',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'add reward' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'addreward1',
        component: Addreward1Component,
        data: {
          title: 'Add Reward1',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'add reward1' }
          ]
        }
      }
    ]
  },
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: 'rewardlist1',
  //       component: Reward1ListComponent,
  //       data: {
  //         title: 'Reward1 List',
  //         urls: [
  //           { title: 'Dashboard', url: '/dashboard' },
  //           { title: 'Reward1 List' }
  //         ]
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: 'reward1view',
  //       component: Reward1ViewComponent,
  //       data: {
  //         title: 'Reward1 View',
  //         urls: [
  //           { title: 'Dashboard', url: '/dashboard' },
  //           { title: 'Reward1 View' }
  //         ]
  //       }
  //     }
  //   ]
  // },
  // // {
  // //   path: '',
  // //   children: [
  // //     {
  // //       path: 'rewardlist',
  // //       component: RewardlistComponent,
  // //       data: {
  // //         title: 'Reward List',
  // //         urls: [
  // //           { title: 'Dashboard', url: '/dashboard' },
  // //           { title: 'Reward List' }
  // //         ]
  // //       }
  // //     }
  // //   ]
  // // },
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: 'rewardpayment',
  //       component: RewardpaymentComponent,
  //       data: {
  //         title: 'Reward Payment',
  //         urls: [
  //           { title: 'Dashboard', url: '/dashboard' },
  //           { title: 'Reward Payment' }
  //         ]
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: 'staffdetails',
  //       component: StaffdetailsComponent,
  //       data: {
  //         title: 'Staff Details',
  //         urls: [
  //           { title: 'Dashboard', url: '/dashboard' },
  //           { title: 'Staff Details' }
  //         ]
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: 'staffreward',
  //       component: StaffrewardsComponent,
  //       data: {
  //         title: 'Staff Reward',
  //         urls: [
  //           { title: 'Dashboard', url: '/dashboard' },
  //           { title: 'Staff Reward' }
  //         ]
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: 'product-profit-report',
  //       component: ViewrewardComponent,
  //       data: {
  //         title: 'product profit report',
  //         urls: [
  //           { title: 'Dashboard', url: '/dashboard' },
  //           { title: 'product profit report' }

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
export class RewardmduleRoutingModule { }
