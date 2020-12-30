import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Master Modules',
    icon: 'mdi mdi-dots-horizontal',
    class: 'nav-small-cap',
    extralink: true,
    submenu: []
  },
  {
    path: '',
    title: 'COMPANY',
    icon: 'mdi mdi-home-map-marker',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
      path: '/company/addcompany',
      title: 'Add Company',
      icon: 'mdi mdi-plus-outline',
      class: '',
      extralink: false,
      submenu: []
    },
    {
      path: '/companypermissions/companypermissions',
      title: 'Company Permissions',
      icon: 'mdi mdi-lock-outline',
      class: '',
      extralink: false,
      submenu: []
    }
  ]
  },
  {
    path: '',
    title: 'USER',
    icon: 'mdi mdi-face',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/user/adduser',
        title: 'Add user',
        icon: 'mdi mdi-vector-difference-ba',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/user/listuser',
        title: 'User list',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
      // {
      //   path: '/group/addgroup',
      //   title: 'Add User Group',
      //   icon: 'mdi mdi mdi-plus-outline',
      //   class: '',
      //   extralink: false,
      //   submenu: []
      // }
    ]
  },
  {
    path: '',
    title: 'BRAND',
    icon: 'mdi mdi-tag-plus',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      // {
      //   path: '/brand/addbrand',
      //   title: 'Add brand',
      //   icon: 'mdi mdi-plus-outline',
      //   class: '',
      //   extralink: false,
      //   submenu: []
      // },
      {
        path: '/brand/brandlist',
        title: 'Add brand',
        icon: 'mdi mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },

  {
    path: '',
    title: 'PRODUCT',
    icon: 'mdi mdi-cart-plus',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/product/addproduct',
        title: 'Add Product',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/product/productlist',
        title: 'Product List',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
      // {
      //   path: '/product/editproduct',
      //   title: 'Product List',
      //   icon: 'mdi mdi-format-list-bulleted',
      //   class: '',
      //   extralink: false,
      //   submenu: []
      // },
    ]
  },
  {
    path: '',
    title: 'BRANCH',
    icon: 'mdi mdi-source-branch',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/branch/addbranch',
        title: 'Add branch',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/branch/branchlist',
        title: 'Branch list',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      }
    ]
  },
  {
    path: '',
    title: 'GROUP',
    icon: 'mdi mdi-account-multiple-outline',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/group/addgroup',
        title: 'Add Group',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/group/listgroup',
        title: 'Group list',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
      // {
      //   path: '/group/listgroup',
      //   title: 'Group list',
      //   icon: 'mdi mdi-format-list-bulleted',
      //   class: '',
      //   extralink: false,
      //   submenu: []
      // },
    ]
  },
  {
    path: '',
    title: 'CATEGORY',
    icon: 'mdi mdi-buffer',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
      path: '/category/addcategory',
      title: 'Add Category',
      icon: 'mdi mdi-plus-outline',
      class: '',
      extralink: false,
      submenu: []
    }, ]
  },
  {
    path: '',
    title: 'STOCK REQUEST',
    icon: 'mdi mdi-package-variant',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/stockrequest/stockrequest',
        title: 'Add Request',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/stockrequest/stockrequestlist',
        title: 'List Request',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/stockrequest/requestedlist',
        title: 'List Requested',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },
  {
    path: '',
    title: 'STOCK TRANSFER',
    icon: 'mdi mdi-group',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/stocktransfer/stocktransfer',
        title: 'Add Stock Transfer',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/stocktransfer/transferlist',
        title: 'List transfer',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/stocktransfer/transferredlist',
        title: 'List transferred',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },
  {
    path: '',
    title: 'ITEM',
    icon: 'mdi mdi-clipboard',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/item/additem',
        title: 'Add Item',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/item/itemlist',
        title: 'List Item',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/item/additemcategory',
        title: 'Add Item Category',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/item/itemcategorylist',
        title: 'Item Category List',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/item/additemgroup',
        title: 'Add Group',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/item/itemgrouplist',
        title: 'Item Group List',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },

    ]
  },
  {
    path: '',
    title: 'SUPPLIER',
    icon: 'mdi mdi-account-network',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/supplier/addsupplier',
        title: 'Add supplier',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/supplier/listsupplier',
        title: 'Supplier list',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      }
    ]
  },
  {
    path: '',
    title: 'INVOICE',
    icon: 'mdi mdi-file-check',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
      path: '/invoice/saleslist',
      title: 'Sales Order List',
      icon: 'mdi mdi-format-list-bulleted',
      class: '',
      extralink: false,
      submenu: []
    },
    {
      path: '/invoice/listinvoice',
      title: 'Invoice List',
      icon: 'mdi mdi-format-list-bulleted',
      class: '',
      extralink: false,
      submenu: []
    },
  ]
  },
  {
    path: '',
    title: 'SALES RETURN',
    icon: 'mdi mdi-file-check',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
      path: '/salesreturn/listsales',
      title: 'Sales Return List',
      icon: 'mdi mdi-format-list-bulleted',
      class: '',
      extralink: false,
      submenu: []
    },
   
  ]
  },
  {
    path: '',
    title: 'DEALER',
    icon: 'mdi mdi-account-switch',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/dealer/adddealer',
        title: 'Add Dealer',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/dealer/dealerlist',
        title: 'Dealer List',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },
  {
    path: '',
    title: 'COUPON',
    icon: 'mdi mdi-ticket',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/coupon/addcoupon',
        title: 'Add Coupon',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/coupon/listcoupon',
        title: 'Coupon List',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },
  {
    path: '',
    title: 'PRICE',
    icon: 'mdi mdi-coin',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/price/addprice',
        title: 'Add Price',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/price/listprice',
        title: 'Price List',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },
  // {
  //   path: '',
  //   title: 'Dashboards',
  //   icon: 'mdi mdi-view-dashboard',
  //   class: 'has-arrow',
  //   extralink: false,
  //   submenu: [
  //     {
  //       path: '/dashboard/classic',
  //       title: 'Classic',
  //       icon: 'mdi mdi-adjust',
  //       class: '',
  //       extralink: false,
  //       submenu: []
  //     },
  //     {
  //       path: '/dashboard/analytical',
  //       title: 'Analytical',
  //       icon: 'mdi mdi-adjust',
  //       class: '',
  //       extralink: false,
  //       submenu: []
  //     },
  //     {
  //       path: '/dashboard/modern',
  //       title: 'Modern',
  //       icon: 'mdi mdi-adjust',
  //       class: '',
  //       extralink: false,
  //       submenu: []
  //     }
  //   ]
  // },
  {
    path: '',
    title: 'PURCHASE',
    icon: 'mdi mdi-cart-outline',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/purchase/purchaseorder',
        title: 'Purchase order',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/purchase/purchaseorderlist',
        title: 'Purchase order list',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/purchase/purchase',
        title: 'Add GRN',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/purchase/purchaselist',
        title: 'GRN List',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/purchase/imeilookup',
        title: 'IMEI Lookup',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },
  {
    path: '',
    title: 'STOCK',
    icon: 'mdi mdi-widgets',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/stock/list_stock',
        title: 'List Stock',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/stock/list_branch_stock',
        title: 'List Branch Stock',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },
  {
    path: '',
    title: 'LOYALTY CARD',
    icon: 'mdi mdi-cart-outline',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/loyaltycard/addloyaltycard',
        title: 'Add Loyalty Card',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
   },
   {
    path: '',
    title: 'DAY CLOSURE ',
    icon: 'mdi mdi-cart-outline',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/dayclosure/dayclosure',
        title: 'Day Closure',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
   },
   {
    path: '',
    title: 'RECEIPT',
    icon: 'mdi mdi-cart-plus',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/receipt/addreceipt',
        title: 'Add Receipt',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/receipt/listreceipt',
        title: 'Receipt List',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },


    ]
  },
  {
    path: '',
    title: 'PAYMENT',
    icon: 'mdi mdi-cart-plus',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/payment/addpayment',
        title: 'Add Payment',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/payment/listpayment',
        title: 'Payment List',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },


    ]
  },
  {
    path: '',
    title: 'CUSTOMER',
    icon: 'mdi mdi-cart-plus',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/customer/editcustomer',
        title: 'Edit Customer',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/customer/history',
        title: 'History',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },
  {
    path: '',
    title: 'DAILY SALES REPORT',
    icon: 'mdi mdi-cart-plus',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/salesreport/dailysalesreport',
        title: 'Daily Sales Report',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },
  {
    path: '',
    title: 'PURCHASE REQUEST',
    icon: 'mdi mdi-widgets',
    class: 'has-arrow',
    extralink: false,
    submenu: [{
        path: '/purchaserequest/request',
        title: 'Purchase Request',
        icon: 'mdi mdi-plus-outline',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },
];


