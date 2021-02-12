import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { PrintcomponentComponent } from './printcomponent/printcomponent.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/login/userlogin', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: './dashboards/dashboard.module#DashboardModule' },
      { path: 'starter', loadChildren: './starter/starter.module#StarterModule' },
      { path: 'icons', loadChildren: './icons/icons.module#IconsModule' },
      { path: 'forms', loadChildren: './form/forms.module#FormModule' },
      { path: 'company', loadChildren: './company/company.module#CompanyModule' },
      { path: 'brand', loadChildren: './brand/brand.module#BrandModule' },
      { path: 'category', loadChildren: './category/category.module#CategoryModule' },
      { path: 'stocktransfer', loadChildren: './stocktransfer/stocktransfer.module#StocktransferModule' },
      { path: 'stockrequest', loadChildren: './stockrequest/stockrequest.module#StockrequestModule' },
      { path: 'branch', loadChildren: './branch/branch.module#BranchModule' },
      { path: 'product', loadChildren: './product/product.module#ProductModule' },
      { path: 'user', loadChildren: './users/users.module#UsersModule' },
      { path: 'item', loadChildren: './item/item.module#ItemModule' },
      { path: 'dealer', loadChildren: './dealer/dealer.module#DealerModule' },
      { path: 'supplier', loadChildren: './suppliers/suppliers.module#SuppliersModule' },
      { path: 'item', loadChildren: './item/item.module#ItemModule' },
      { path: 'invoice', loadChildren: './invoice/invoice.module#InvoiceModule' },
      { path: 'purchase', loadChildren: './purchase/purchase.module#PurchaseModule' },
      { path: 'stock', loadChildren: './stock/stock.module#StockModule' },
      { path: 'coupon', loadChildren: './coupon/coupon.module#CouponModule' },
      { path: 'price', loadChildren: './price/price.module#PriceModule' },
      { path: 'loyaltycard', loadChildren: './loyaltycard/loyaltycard.module#LoyaltycardModule' },
      { path: 'companypermissions', loadChildren: './company-permissions/company-permissions.module#CompanyPermissionsModule' },
      { path: 'dayclosure', loadChildren: './dayclosure/dayclosure.module#DayclosureModule' },
      { path: 'group', loadChildren: './group/group.module#GroupModule' },
      { path: 'receipt', loadChildren: './receipt/receipt.module#ReceiptModule' },
      { path: 'payment', loadChildren: './payment/payment.module#PaymentModule' },
      { path: 'salesreturn', loadChildren: './sales-return/sales-return.module#SalesReturnModule' },
      { path: 'customer', loadChildren: './customer/customer.module#CustomerModule' },
      { path: 'salesreport', loadChildren: './daily-sales-report/daily-sales-report.module#DailySalesReportModule' },
      { path: 'caseclosure', loadChildren: './caseclosure/caseclosure.module#CaseclosureModule' },
      { path: 'guest', loadChildren: './guest/guest.module#GuestModule' },
      { path: 'tools', loadChildren: './tools/tools.module#ToolsModule' },
      { path: 'accounting', loadChildren: './accounting-maping/accounting-maping.module#AccountingMapingModule' },
      { path: 'report', loadChildren: './stock-age-report/stock-age-report.module#StockAgeReportModule' },
      { path: 'purchaserequest', loadChildren: './purchaserequest/purchaserequest.module#PurchaserequestModule' },
      { path: 'report', loadChildren: './report/report.module#ReportModule' },
      { path: 'ledger', loadChildren: './ledger/ledger.module#LedgerModule' },
      { path: 'journal', loadChildren: './journal/journal.module#JournalModule' },
      { path: 'schema', loadChildren: './schema/schema.module#SchemaModule' },
      { path: 'transfer', loadChildren: './newstocktransfer/newstocktransfer.module#NewstocktransferModule' },
      { path: 'usertrack', loadChildren: './user-track/user-track.module#UserTrackModule' },
      { path: 'service-main', loadChildren: './services-main/services-main.module#ServicesMainModule' },
      { path: 'spare-request', loadChildren: './spare-request/spare-request.module#SpareRequestModule' },
      { path: 'job-position', loadChildren: './jobposition/jobposition.module#JobpositionModule' },
      { path: 'hierarchy', loadChildren: './hierarchy/hierarchy.module#HierarchyModule' },
      { path: 'department', loadChildren: './department/department.module#DepartmentModule' },
      { path: 'group-permission', loadChildren: './group-permission/group-permission.module#GroupModule' },
      { path: 'enquiry', loadChildren: './lead-mobile/lead-mobile.module#LeadMobileModule' },
      { path: 'lead', loadChildren: './lead/lead.module#LeadModule' }, 
      { path: 'attendance', loadChildren: './attendance/attendance.module#AttendanceModule' },
      { path: 'attendancereports', loadChildren: './attendancereports/attendancereports.module#AttendancereportsModule' }, 



    ]
  },

  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  {
    path: '', component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren:
          './authentication/authentication.module#AuthenticationModule'
      }
    ]
  },
  {
    path: 'print',
    component: PrintcomponentComponent
  },
  {
    path: '**',
    redirectTo: '/authentication/404'
  },

];
