export let settings = {
    columns: {
      itemname: {
        title: 'Item Name',
        filter: false
      },
      imei: {
        title: 'IMEI',
        filter: false
      },
      rate: {
        title: 'Rate',
        filter: false
      },
      buyback: {
        title: 'BB',
        filter: false
      },  
      discount: {
        title: 'Discount',
        filter: false
      },
      cgst: {
        title: 'CGST',
        filter: false
      },
      sgst: {
        title: 'SGST',
        filter: false
      },
      amount: {
        title: 'Amt',
        filter: false
      }
    },
    actions: {
      add: true,
      position: 'right',
      custom: [
        {
          name: 'duplicate',
          title: '<i class="icon-search text-info"></i> ',
        },
      ],
      },
      add:{
        createButtonContent: '<i class="ti-save text-success m-r-10"></i>',
        cancelButtonContent: '<i class="icon-close text-danger m-r-10"></i>',
        // searchButtonContent: '<i class="icon-search text-info"></i>',
        // custom: [{ name: 'ourCustomAction', title: '<i class="icon-add></i>' }],
      },
    edit: {
      editButtonContent: '<i class="ti-pencil text-info m-r-10"></i>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>',
      position: 'right'
    },
    delete: {
      deleteButtonContent: '<i class="ti-trash text-danger m-r-10"></i>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>',
      position: 'right'
    }
  };
  export let settings2 = {
    columns: {
      itemname: {
        title: 'Item Name',
        filter: false
      },
      imei: {
        title: 'IMEI',
        filter: false
      },
      rate: {
        title: 'Rate',
        filter: false
      },
      buyback: {
        title: 'BB',
        filter: false
      },
      discount: {
        title: 'Discount',
        filter: false
      },
      cgst: {
        title: 'CGST',
        filter: false
      },
      sgst: {
        title: 'SGST',
        filter: false
      },
      amount: {
        title: 'Amt',
        filter: false
      }
    },
    actions: {
      add: false,
      position: 'right'
      },
    edit: {
      editButtonContent: '<i class="ti-pencil text-info m-r-10"></i>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>',
      position: 'right'
    },
    delete: {
      deleteButtonContent: '<i class="ti-trash text-danger m-r-10"></i>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>',
      position: 'right'
    }
  };
  export let data = [
    {
      itemname: 'GALAXY A7(6) 4G LTE GOLD:SAMSUNG:MOBILES',
      imei: 4254541345342,
      rate: 32500.00,
      buyback: 0.00,
      discount: 0.00,
      cgst: 0.00,
      sgst: 0.00,
      amount: 32500.00
    },
    {
      itemname: 'GALAXY A7(6) SAMSUNG:HEADSETS',
      imei: 878731312135,
      rate: 2500.00,
      buyback: 0.00,
      discount: 0.00,    
      cgst: 0.00,
      sgst: 0.00,
      amount: 2500.00
    },
  ];
  