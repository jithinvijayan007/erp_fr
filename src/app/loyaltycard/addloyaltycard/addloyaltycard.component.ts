import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { ServerService } from '../../server.service';

@Component({
  selector: 'app-addloyaltycard',
  templateUrl: './addloyaltycard.component.html',
  styleUrls: ['./addloyaltycard.component.scss']
})
export class AddloyaltycardComponent implements OnInit {
 
  loyaltyListJsonData = [];
  lstLength=0;
  cardNames =[];
  cardNa;
  cardId =[];
  priceFromMin=[];
  priceToMax=[];
  displayedColumns = ["name","priceRange","loyPercentage","minRedeemDays", "action"];
  dataSource = new MatTableDataSource(this.loyaltyListJsonData);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  btnUpdate=false;
  validationSuccess=true;
  editingId;
  name: '';
  priceFrom;
  priceTo;
  loyPercentage:null;
  minPurchaseAmt:null;
  minRedeemDays:null;
  minRedeemPoints:null;
  condition;
  loyaltyCardDetails=[];
  public form: FormGroup;
  constructor(private serviceObject: ServerService,
              public router: Router,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.getLoyaltyCardList();
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      priceFrom: [null, Validators.compose([Validators.required])],
      priceTo: [null, Validators.compose([Validators.required])],
      loyPercentage: [null, Validators.compose([Validators.required])], 
      minPurchaseAmt: [null, Validators.compose([Validators.required])],
      minRedeemDays: [null, Validators.compose([Validators.required])],
      minRedeemPoints: [null, Validators.compose([Validators.required])]
    });
  }

  getLoyaltyCardList(){
    let min=0;
    this.cardId=[];
    this.cardNames=[];
    this.priceFromMin=[];
    this.priceToMax=[];

    this.serviceObject
      .getData("loyaltycard/loyalty_card/") //get full data from loyalty card table
      .subscribe(
       response => {    
          this.loyaltyListJsonData = response['data'];  
          
          this.lstLength=this.loyaltyListJsonData.length;
          // console.log("###this.lstLength",this.lstLength);
                    
          response['data'].forEach(element => { //push card names to an array
            this.cardId.push(element.pk_bint_id);
          });     
          response['data'].forEach(element => { //push card names to an array
            this.cardNames.push(element.vchr_card_name);
          });  
          response['data'].forEach(element => { //get minimum price-from range      
              this.priceFromMin.push(element.int_price_range_from);                    
          });   
          response['data'].forEach(element => { //get maximum price-to range       
              this.priceToMax.push(element.int_price_range_to);          
          });
          
          this.dataSource = new MatTableDataSource(
          this.loyaltyListJsonData
          );
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.firstPage();
      this.dataSource.sort = this.sort;      
        },
        error => {}
      );
  }
  clearForm(){
    this.form.reset();
    this.btnUpdate=false;
  }

  checkCardName(){ //check duplicate card name in client side when lost focus    
     
    this.validationSuccess = true; 
    for (let i=0; i<this.cardNames.length;i++) {  
      if(this.cardId[i]!=this.editingId){}
      if(this.cardNames[i].toLowerCase() == this.name.toLowerCase()){
        this.validationSuccess = false;      
      }
    }
  
   
    if(!this.validationSuccess){
     
      this.form.markAsDirty();
      swal.fire('Error', 'Card name already exist', 'error');
      //this.form.reset();
      this.name='';
      
    }
  }
  checkPriceRange(){
      
  
    this.validationSuccess = true;  
for(let i=0;i<this.priceFromMin.length;i++){  //checking price-from value if already exist in th given ranges
  if(this.cardId[i]!=this.editingId){
  if(this.priceFromMin[i]<=this.priceFrom && this.priceToMax[i]>=this.priceFrom){   
    this.validationSuccess = false;      
  }
  }
}
    
    if(!this.validationSuccess){
     
      this.form.markAsDirty();
      swal.fire('Error', 'Price from range already exist', 'error');
      this.priceFrom='';
      this.priceFrom.focus;
    }
  }

  checkPriceRangeTo(){  //checking price-to value if already exist in th given ranges
    this.validationSuccess = true; 
    if(this.priceTo<this.priceFrom){
      this.validationSuccess = false;      
    }
    else{
     
      for(let i=0;i<this.priceFromMin.length;i++){
        if(this.cardId[i]!=this.editingId){
        if(this.priceFromMin[i]<=this.priceTo && this.priceToMax[i]>=this.priceTo){   
          this.validationSuccess = false;      
        }
      }
    }      
    }
      
      
    if(!this.validationSuccess){
     
      this.form.markAsDirty();
      swal.fire('Error', 'Invalid price-to range ', 'error');
      this.priceTo='';
      this.priceTo.focus
      //this.form.reset();
    }
  }


  addLoyaltyCard(){  //save form details
   
    const error_list = [];
    if (this.name.trim() == '') {
      this.validationSuccess = false;
      error_list.push('Name');
    } else if (!/^[a-zA-Z][a-zA-Z+&0-9]+[\s]*$/g.test(this.name.trim())) {
      this.validationSuccess = false;
      error_list.push('Name');
    }
   
   
    else if (this.priceFrom == null) {
      this.validationSuccess = false;
      error_list.push('price range from');
    }
    else if (this.priceTo == null) {
      this.validationSuccess = false;
      error_list.push('price to');
    }
    else if (this.loyPercentage== null) {
      this.validationSuccess = false;
      error_list.push('loyalty percentage');
    }
    else if (this.minPurchaseAmt == null) {
      this.validationSuccess = false;
      error_list.push('min purchase amount');
    }
    else if (this.minRedeemDays == null) {
      this.validationSuccess = false;
      error_list.push('min redeem days ');
    }
    else if (this.minRedeemPoints == null) {
      this.validationSuccess = false;
      error_list.push('min redeem point ');
    }
    
    if (this.validationSuccess) {
      const pusheditems = {};   
      pusheditems['loyalty_card_name'] = this.name.trim();
      pusheditems['price_range_from'] = this.priceFrom;
      pusheditems['price_range_to'] = this.priceTo;
      pusheditems['loyalty_percentage'] = this.loyPercentage;
      pusheditems['min_purchase_amount'] = this.minPurchaseAmt;
      pusheditems['min_redeem_days'] = this.minRedeemDays;
      pusheditems['min_redeem_point'] = this.minRedeemPoints;
      this.serviceObject.postData('loyaltycard/loyalty_card/',pusheditems).subscribe(res => {
        const result = res;
        if (result['status'] === 1) {
          swal.fire('Success', 'Loyalty card added', 'success');
        this.getLoyaltyCardList();
       
        this.form.reset();
        } else {
          swal.fire('Error', result['reason'], 'error');
        }
      }, error => {
        swal.fire('Error', error, 'error');
      });
    } else {
      const errormessage = error_list.join(' , ');
      this.form.markAsDirty();
      swal.fire('Error', 'Fill ' + errormessage + ' fields correctly', 'error');
    }
  }

  editLoyaltyCard(id,name,priceFrom,priceTo,loyPercentage,minPurchaseAmt,minRedeemDays,minRedeemPoints) {   //get selected row details
    this.cardNa = name;
    this.btnUpdate= true;
    this.condition=false;
    this.editingId = id;
        this.name = name;
        this.priceFrom = priceFrom;
        this.priceTo = priceTo;
        this.loyPercentage = loyPercentage;
        this.minPurchaseAmt = minPurchaseAmt;       
        this.minRedeemDays =  minRedeemDays;   
        this.minRedeemPoints = minRedeemPoints;      
  
  }  

  updateLoyaltyCard(){
   
    const error_list = [];

    if (this.name.trim() == '') {
      this.validationSuccess = false;
      error_list.push('Name');
    } else if (!/^[a-zA-Z ]+[\s]*$/g.test(this.name.trim())) {
      this.validationSuccess = false;
      error_list.push('Name');
    }
    
    if (this.validationSuccess) {
      const pusheditems = {};   
      pusheditems['loyalty_card_id'] = this.editingId;
      pusheditems['loyalty_card_name'] = this.name.trim();
      pusheditems['card_name'] = this.cardNa;
      pusheditems['price_range_from'] = this.priceFrom;
      pusheditems['price_range_to'] = this.priceTo;
      pusheditems['loyalty_percentage'] = this.loyPercentage;
      pusheditems['min_purchase_amount'] = this.minPurchaseAmt;
      pusheditems['min_redeem_days'] = this.minRedeemDays;
      pusheditems['min_redeem_point'] = this.minRedeemPoints;
      this.serviceObject.putData('loyaltycard/loyalty_card/',pusheditems).subscribe(res => {
        const result = res;
        if (result['status'] === 1) {
          swal.fire('Success', 'Loyalty card updated', 'success');
        this.getLoyaltyCardList();
        this.btnUpdate= false;
        this.form.reset();
        } else {
          swal.fire('Error', result['reason'], 'error');
        }
      }, error => {
        swal.fire('Error', error, 'error');
      });
    } else {
      const errormessage = error_list.join(' , ');
      this.form.markAsDirty();
      swal.fire('Error', 'Fill ' + errormessage + ' fields correctly', 'error');
    }

  }

  deleteLoyaltyCard(pk_bint_id,cardname){
    swal.fire({
      title: 'delete',
      text: 'Do you want to delete the loyalty card?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(result1 => {
      if (result1.value) {
        const pusheditems = {};
        pusheditems['loyalty_card_id'] = pk_bint_id;
        pusheditems['card_name'] = cardname;
        this.serviceObject.postData('loyaltycard/loyalty_card_delete/',pusheditems).subscribe(
          result => {
            // const result = res.json();
            if (result['status'] !== 1) {
              swal.fire('', 'Error', 'error');
            } else {
              swal.fire('Deleted!', 'Successfully Deleted', 'success');
              this.getLoyaltyCardList();
            }
          },
          error => {
            swal.fire('Error', error, 'error');
          }
        );
      }
    });
  }

}
