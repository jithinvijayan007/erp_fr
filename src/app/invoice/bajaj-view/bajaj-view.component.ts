import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { range } from 'd3'
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { not } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-bajaj-view',
  templateUrl: './bajaj-view.component.html',
  styleUrls: ['./bajaj-view.component.css']
})
export class BajajViewComponent implements OnInit {
  
  bajajId;
  dctMaster = {}
  dctEnquiryDetails = {}
  enqKeys = []

  lstImeiNumbers = [];
  intItemQty = 1;
  lstImeisToCheck = [];
  blnShowPopup = false;
  intItemId;
  showModalIMEI
  saveDisable=false;

  searchStaff: FormControl = new FormControl();
  lstStaff = []
  IntStaffId;
  strStaff;
  selectedStaff;
  blnAssignStaff=false
  @ViewChild('staffId') staffId: any;

  constructor(private serviceObject: ServerService, private toastr: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.saveDisable=false; //enable save button
    
    if (localStorage.getItem('bajajListData')) {
      localStorage.setItem('bajajListStatus', '1');
      // console.log("else")
    }
    this.bajajId = localStorage.getItem('bajajId');
    this.getData()

    this.searchStaff.valueChanges
      .debounceTime(400)
      .subscribe((strData: string) => {
        if (strData === undefined || strData === null) {
          this.lstStaff = [];
        } else {
          if (strData.length >= 3) {
            this.serviceObject
              .postData('payment/expenses_typeahead/', { terms: strData })
              .subscribe(
                (response) => {
                  this.lstStaff = response['data'];
                }
              );
          }
        }
      }
      ); 


  }

  StaffChanged(item){
    this.IntStaffId = item.id;
    this.strStaff = item.name;
  }

  getData(){
    this.serviceObject.postData("invoice/bajaj_online/", {'partial_id':this.bajajId}).subscribe(response => {
      if (response.status == 1) {
        this.dctMaster = response['dct_customer']
        this.dctEnquiryDetails = response['dct_enquiry_details']
        this.enqKeys = Object.keys(this.dctEnquiryDetails)
      }

    });
  }
 

  checkClickRequest(itemId,intItemQty){
    this.lstImeiNumbers=[];
    this.blnShowPopup=true;
    this.intItemId=itemId;
    this.intItemQty=intItemQty;
    for(let i in range(this.intItemQty)){
      this.lstImeiNumbers.push({imei:null})
    }
  }

  hideModal() {
    this.blnShowPopup = false;
  }

  openIMEI(addimei,itemId, intItemQty){
    this.lstImeiNumbers = [];
    this.blnShowPopup = true;
    this.intItemId = itemId;
    this.intItemQty = intItemQty;
    for (let i in range(this.intItemQty)) {
      this.lstImeiNumbers.push({ imei: null })
    }
    this.showModalIMEI = this.modalService.open(addimei, { centered: true, size: 'lg' });
  }

  clearFields() {
    for (let item of this.lstImeiNumbers) {
      item.imei = null;
    }
  }

  OnKeyPress(item, event: any) {
  
    
    let e = <KeyboardEvent>event;
    if (item){
      if ( item.length > 14) {
        e.preventDefault();
      }
    }
  }

  saveData(){
    let bln_imei = false
    let dct_imei = {}
    
    this.enqKeys.map(item=>{
      this.dctEnquiryDetails[item].map(element=>{

        if (!element['bln_IMEI_add']){
          let lst_id = Object.keys(element['lst_imei'])
          dct_imei[lst_id[0]]=[] 
          element['lst_imei'][lst_id[0]].map(imei=>{
            if (!imei['imei']){
              bln_imei = true
              return;
            }
            else{
              dct_imei[lst_id[0]].push(imei['imei'])
            }
          })
        }
      })
    })
    
    if (bln_imei){
      Swal.fire({
        title: 'Fill every IMEI fields',
        type: 'error',
        confirmButtonText: 'OK',
        timer: 2000
      });
      return;
    }
    else if (this.selectedStaff != this.strStaff || !this.selectedStaff) {
      this.staffId.nativeElement.focus();
      this.toastr.error('Assign Staff is required', 'Error!');
      this.IntStaffId = null
      this.strStaff = ''
      return false;
    }
    else{
      let dct_data = {}
      dct_data['dct_imei'] = dct_imei
      dct_data['int_staff'] = this.IntStaffId
      dct_data['int_partial_id'] = this.dctMaster['partial_id']
      this.saveDisable=true;

      this.serviceObject.putData('invoice/bajaj_online/', dct_data).subscribe(
        result => {
          if (result.status == 1) {
            Swal.fire({
              title: 'IMEI Number Added',
              type: 'success',
              confirmButtonText: 'OK',
              timer: 2000
            });
            this.saveDisable=true;            
            this.getData();

          }
          else {
            this.saveDisable=false;
            

          }
        },
        (error) => {
          this.toastr.error(error);
          this.saveDisable=false;
          
        });
    }
  }

  imeiValidationFuncion(item,imei,key,index){
    let dct_item_proudct = {};
    let dct_item_imei = {};
    console.log(item,imei,key,index,'enetered');
    this.enqKeys.map(enq=>{
      this.dctEnquiryDetails[enq].map(element=>{
        dct_item_proudct[element['vchr_item_code']] = enq;
        if (dct_item_imei[element['vchr_item_code']]== null){
          dct_item_imei[element['vchr_item_code']] = []
        }
        console.log(element['vchr_item_code'])
        if (!element['bln_IMEI_add']){
          let lst_id = Object.keys(element['lst_imei'])
          element['lst_imei'][lst_id[0]].map(data=>{
            dct_item_imei[element['vchr_item_code']].push(data['imei'])
            if (data['imei'] && data['imei']==imei && element['item_enquiry_id']!=key){
              if (!(["MOBILE","SERVICE","TABLET","LAPTOP"].includes(enq))){
                console.log("token 1",dct_item_imei[element['vchr_item_code']])
                this.toastr.error('Imei already entered', 'Error!');
                item['lst_imei'][item['item_enquiry_id']][index]['imei']=null;
                return;
              }
              else{
                console.log("token 2",dct_item_imei[element['vchr_item_code']])
                if (dct_item_imei[element['vchr_item_code']]){
                  let imei_count = 0
                  if (dct_item_imei[item['vchr_item_code']]){
                    dct_item_imei[item['vchr_item_code']].forEach(value =>{
                      console.log("token 3 ",value, imei)
                      if (value == imei){
                        imei_count = imei_count + 1
                      }
                    });
                  }
                  
                  if (imei_count >= 1){
                    this.toastr.error('Imei already entered', 'Error!');
                    item['lst_imei'][item['item_enquiry_id']][index]['imei']=null;
                    dct_item_imei[element['vchr_item_code']] = dct_item_imei[element['vchr_item_code']].splice(-1)
                    console.log("token 4",dct_item_imei)
                    return;
                  }
                }
              }
            }
            
          })
        }
      })
    })
    let dct={}
    dct['pk_bint_id']= item.int_item_id;
    // dct['intCustId']= this.intCustId
    dct['strImei']=imei;
    this.saveDisable=true;            
    
    if(imei){
      
          this.serviceObject.postData('branch_stock/get_price_for_item/',dct).subscribe(res => {
      
            if (res.status == 1)
            {
              if(index !=0){
                let flag = 0
                for (let index_imei in range(index)){
                  if((item['lst_imei'][key][index]['imei'] == item['lst_imei'][key][index_imei]['imei'])){
                    if (!(["ACC BGN","ACC ZRD"].includes(dct_item_proudct[item['vchr_item_code']]))){
                      flag = 1
                      item['lst_imei'][key][index]['imei'] = null;
                    }
                  }
                }
                if (flag === 1){
                  this.toastr.error('Imei already entered', 'Error!');
                }
              }
              this.saveDisable=false;   
            }
            else if(res.status == 0)
            {
            
              this.toastr.error(res['data'], 'Error!');
              item['lst_imei'][key][index]['imei'] = null;
              this.saveDisable=true;            

            }
          },
          (error) => {
            Swal.fire('Error!','Server Error!!', 'error');
            this.saveDisable=true;            
            
           });
    }

    
  }
}
