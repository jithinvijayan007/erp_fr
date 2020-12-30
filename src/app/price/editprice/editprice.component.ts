import { Component, OnInit,ViewChild,Inject} from '@angular/core';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import * as moment from 'moment' ;
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface DialogData {
  datePurchase: string;
  unitPrice: number;
  quantityPurchased:number;
  quantityLeft:number;
  blnNoData : true;
}

@Component({
  selector: 'app-editprice',
  templateUrl: './editprice.component.html',
  styleUrls: ['./editprice.component.css']
})
export class EditpriceComponent implements OnInit {

  priceId= localStorage.getItem('priceRowId');

  @ViewChild('idItem', { static: true }) idItem: any;
  @ViewChild('idSupAmnt', { static: true }) idSupAmnt: any;
  @ViewChild('idMRP', { static: true }) idMRP: any;
  @ViewChild('idMOP', { static: true }) idMOP: any;
  @ViewChild('idCostPrice', { static: true }) idCostPrice: any;
  @ViewChild('idEfectiveDate', { static: true }) idEfectiveDate: any;
  @ViewChild('idDealerPrice', { static: true }) idDealerPrice: any;
  @ViewChild('idMygPrice', { static: true }) idMygPrice: any;

  public form: FormGroup;
  searchItem: FormControl = new FormControl();

  datePurchase='';
  unitPrice: number;
  quantityPurchased:number;
  quantityLeft:number;

  strItem='';
  strSelectedItem = '';
  lst_item = [];
  intItemId:number=null;

  intSupplierAmount:number=null;
  intMrp:number=null;
  intMOP:number=null;
  intCostPrice:number=null;
  datEffectiveFrom='';
  blnshowHistory = false;
  dictData = [];
  int_left:number=null;
  blnNoData= true;
  intDealerAmount:number=null;
  intMygPrice :number =null;
  dict_data=[];
  constructor(
    private serverService: ServerService,
    public router: Router,
    private fb: FormBuilder,
    public toastr: ToastrService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    if (localStorage.getItem('priceRequestData')) {
      localStorage.setItem('priceItemNumberStatus', '1');
    }
    this.form = this.fb.group(
      {
        item:[null, Validators.compose([Validators.required])],
        suppamount:[null, Validators.compose([Validators.required])],
        mrp:[null, Validators.compose([Validators.required])],
        mop:[null, Validators.compose([Validators.required])],
        costprice:[null, Validators.compose([Validators.required])],
        dateffefrom:[null, Validators.compose([Validators.required])],
        dealeramount:[null, Validators.compose([Validators.required])],
        mygprice:[null, Validators.compose([Validators.required])],
      }

    );

    this.searchItem.valueChanges
    .debounceTime(400)
    .subscribe((strData: string) => {
      if (strData === undefined || strData === null) {
        this.lst_item = [];
      } else {
        if (strData.length >= 3) {
          this.serverService
            .postData('itemcategory/item_typeahead/', { term: strData })
            .subscribe(
              (response) => {
                this.lst_item = response['data'];
    
              }
            );
        }
      }
    }
    );

   this.getPriceData(this.priceId);

  }
  
  getPriceData(id){
    this.serverService.getData('pricelist/listpricelist/?id='+id).subscribe(
      (data) => {
      // const result = data.json();
      
      if (data['status'] == 1) {
  
        this.dict_data = data['list'][0];
        // console.log(this.dict_data);
        this.intMOP = this.dict_data['dbl_mop'];
        this.intSupplierAmount =this.dict_data['dbl_supp_amnt'];
        this.intMrp = this.dict_data['dbl_mrp'];
        this.intCostPrice =this.dict_data['dbl_cost_amnt'];
        this.datEffectiveFrom =this.dict_data['dat_efct_from'];
        this.intItemId =this.dict_data['fk_item_id'];
        this.strItem = this.dict_data['code_name'];
        this.strSelectedItem =this.dict_data['code_name'];
        this.intDealerAmount = this.dict_data['dbl_dealer_amt'];
        this.intMygPrice = this.dict_data['dbl_my_amt'];
        if(this.intItemId){
          this.blnshowHistory = true;
        }
       
        
       
             
    } 
   
      },
      
    );
  
    
    
  
  }



  itemChanged(item){
    this.blnshowHistory = true;
    this.intItemId = item.id;
    this.strSelectedItem = item.code_name;

  }
  savePrice(){
    let pushed_data ={}
    let validationSuccess = true;
    this.datEffectiveFrom = moment(this.datEffectiveFrom).format('YYYY-MM-DD')
    if(this.strItem != this.strSelectedItem || this.strItem == ''){
      validationSuccess =false
      this.toastr.error('Please enter Item','Error!');
      this.idItem.nativeElement.focus();
      return false;
    }
    else if(this.intSupplierAmount == null){
      validationSuccess =false
      this.toastr.error('Please enter Supplier Amount','Error!');
      this.idSupAmnt.nativeElement.focus();
      return false;
    }
    else if(this.intMrp == null){
      validationSuccess =false
      this.toastr.error('Please enter MRP','Error!');
      this.idMRP.nativeElement.focus();
      return false;
    }
    else if(this.intMOP == null){
      validationSuccess =false
      this.toastr.error('Please enter MOP','Error!');
      this.idMOP.nativeElement.focus();
      return false;
    }
    else if(this.intCostPrice == null){
      validationSuccess =false
      this.toastr.error('Please enter cost price','Error!');
      this.idCostPrice.nativeElement.focus();
      return false;
    }
    else if(this.datEffectiveFrom == 'Invalid date'){
      validationSuccess =false
      this.toastr.error('Please enter Effective date from','Error!');
      this.idEfectiveDate.nativeElement.focus();
      return false;
    }
    else if(this.intDealerAmount == null){
      validationSuccess =false
      this.toastr.error('Please enter Dealer Amount','Error!');
      this.idDealerPrice.nativeElement.focus();
      return false;
    }
    else if(this.intMygPrice == null){
      validationSuccess =false
      this.toastr.error('Please enter myG price','Error!');
      this.idMygPrice.nativeElement.focus();
      return false;
    }
    
    else if(validationSuccess){

      
      pushed_data['fk_item'] =this.intItemId;
      pushed_data['int_supplier_amount'] =this.intSupplierAmount;
      pushed_data['int_MOP'] =this.intMOP;
      pushed_data['int_MRP'] =this.intMrp;
      pushed_data['int_cost_price'] =this.intCostPrice;
      pushed_data['date_effective_from'] =this.datEffectiveFrom;
      pushed_data['pk_bint_id'] = this.priceId;
      pushed_data['int_dealer_amount'] =this.intDealerAmount;
      pushed_data['int_myg_amount'] =this.intMygPrice;
     
      
      
      console.log(pushed_data);
      this.serverService.postData('pricelist/editpricelist/',pushed_data).subscribe(
        (response) => {
        const result = response;
        if (result['status'] === 1) {
        swal.fire( 'Success', 'Successfully updated', 'success');
        // this.clearSupplierFields();
    localStorage.setItem('previousUrl','price/listprice');
        
        this.router.navigate(['price/listprice']);
      } else {
        this.toastr.error(result['reason'],'Error!');
      }
        },
        (error) => { if(error.status == 401){
    localStorage.setItem('previousUrl','/user/sign-in');
          
          this.router.navigate(['/user/sign-in']);} }
      );
  
  
    }

  }

  openDialog(): void {
    this.blnNoData = true;

   let dialog_data = {};

   dialog_data['fk_item_id']= this.intItemId;


   this.serverService.postData('pricelist/historypricelist/ ',dialog_data).subscribe(
     (response) => {
     const result = response;
     if (result['status'] === 1) {
     this.dictData = result['list'];
     if(this.dictData.length == 0){
       this.blnNoData = false;
     }
     console.log('sss',this.blnNoData);

     this.asd()

   } else {
     this.toastr.error(result['reason'],'Error!');
   }
     },
     (error) => {  }
   );




 }

asd(){

 const dialogRef = this.dialog.open(HistoryDialog1, {

   width: '500px',
   // data: {datePurchase: this.datePurchase, quantityLeft: this.quantityLeft,quantityPurchased:this.quantityPurchased,
   // unitprice:this.unitPrice}
   data:{dictData:this.dictData,blnNoData:this.blnNoData}


 });



 dialogRef.afterClosed().subscribe(result => {
   console.log('The dialog was closed');
   // this.animal = result;
 });
}

}

@Component({
  selector: 'history-dialog',
  templateUrl: 'history-dialog.html',
})
export class HistoryDialog1 {

  constructor(
    public dialogRef: MatDialogRef<HistoryDialog1>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {


    this.dialogRef.close();
  }

}
