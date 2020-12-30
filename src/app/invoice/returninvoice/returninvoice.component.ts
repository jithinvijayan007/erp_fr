import { Component,ViewChild,OnInit,ElementRef ,ViewChildren, HostListener, Input} from '@angular/core';
import {NgbModal,ModalDismissReasons,NgbActiveModal,} from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { ServerService } from '../../server.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FullComponent } from 'src/app/layouts/full/full.component';


import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ChangeDetectorRef } from '@angular/core';
import { Binary } from '@angular/compiler';

@Component({
  selector: 'app-returninvoice',
  templateUrl: './returninvoice.component.html',
  styleUrls: ['./returninvoice.component.css']
})
export class ReturninvoiceComponent implements OnInit {

  constructor(
    private modalService: NgbModal,private serviceObject: ServerService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private fullObject: FullComponent,
    private cdRef:ChangeDetectorRef,
    private spinner: NgxSpinnerService,
  ) {}

  printDisable
  saveDisable=false;
  rejectInvoice(){}
  printInvoice(){}
  
  intContactNo=null
  strName:''
  strEmail;
  strStaff;
  strRemarks='';
  lstItemDetails: Array<any> = []
  lstItemLength;
  intCustId:null
  strInitRemarks=""
  salesReturn= JSON.parse(localStorage.salesReturn);
  salesReturnId= JSON.parse(localStorage.salesReturnId);
  salesReturnImei= JSON.parse(localStorage.salesReturnImei);
  blnSalesReturnAll= JSON.parse(localStorage.blnSalesReturnAll);
  blnCheckIGST=false;
  searchCity: FormControl = new FormControl();
  lstCity = []
  intCityId;
  strCity;
  selectedCity
  strPincode;
  invoiceId;
  objectKeys = Object.keys;

  intCustCityId;
  strCustCity;
  selectedCustCity
  strCustPinCode;

  searchState: FormControl = new FormControl();
  lstState = []
  intStateId;
  strState:'';
  selectedState;


  intCustStateId;
  strCustState;
  selectedCustState;
  strAddress:''
  showModalCustEdit;
  strGSTNo
  dctData={}
  

  lst_imei = []
  intIndirectDis=0
  lstIndirectDis= []
  intTotIndirectDis=0
  discoundIndex=0
  currentIndex=0
  dctReturnDetail ={}
  returnId;
  blnReturnData = false;
  dctReturn={}
  strReturnType = '1';
  lstcheckReturn=[]
  showModalReturnDetails;
  dctReturnId={}

  // Combo offer style
  lstStyle = ['flip-card-front','flip-card-front2','flip-card-front3','flip-card-front4'];
  intStyleIndex;
  image1
  image2
  image3
  vchr_image;
  hostaddress;
  url;
  dctImages={}
  public imagePath1;
  imgURL1: any;
  public imagePath2;
  imgURL2: any;
  public imagePath3;
  imgURL3: any;
  intGrandTot=0
  intDiscount=0
  intBuyBack=0
  intTotCGST=0
  intTotSGST=0
  intTotIGST=0
  intTotal=0
  intGDP = 0
  intGDEW =0
  intTotKfc = 0;
  blnReturnDetails=false
  dblAdditions = 0
  dblDeductions = 0
  @ViewChild('file1') file1: any;
  form: FormGroup;


  ngOnInit() {
    this.saveDisable=false; //enable save button
    
    if (localStorage.getItem('enquiryRequestData')) {
      localStorage.setItem('enquiryCustomerNumberStatus', '1');
    }
    this.getData();
    this.form = this.formBuilder.group({
      img1: [''],
      img2: [''],
      img3: [''],
});

  }
  getData(){
    // console.log("innnnn");
    
    this.serviceObject
        .patchData('invoice/sales_list/', {int_id:this.salesReturnId,imei:this.salesReturnImei,lst_return:this.salesReturn,blnReturnAll:this.blnSalesReturnAll})
        .subscribe(
          (res) => {
            if(res.status==1){
              this.lstItemDetails=res['data']['lstItems'];
        
              this.lstItemLength = this.lstItemDetails.length;
              this.intCustId=res['data']['intCustId']
              this.intContactNo= res['data']['intContactNo']
              this.strEmail = res['data']['strCustEmail']
              this.strStaff= res['data']['strStaffName'];
              this.strName = res['data']['strCustName']
              this.strInitRemarks =res['data']['txtRemarks']
              this.blnCheckIGST=res['data']['blnIGST']
              this.selectedCity=res['data']['strLocation']
              this.strCity=res['data']['strLocation']
              this.intCityId=res['data']['intLocation']
              this.selectedState=res['data']['strState']
              this.strState=res['data']['strState']
              this.intStateId=res['data']['intState']
              this.strGSTNo=res['data']['strGSTNo']
              this.strAddress=res['data']['txtAddress']
              this.strPincode=res['data']['intPinCode']
              this.intCustId=res['data']['intCustId']
              this.dblAdditions = res['dbl_addition']
              this.dblDeductions = res['dbl_deduction']
              this.billingDatails("other",0);
      
            }
            else{
              swal.fire('Error!',res['message'], 'error');
              this.lstItemDetails=[]
            }
          }
        );
  }


  billingDatails(type,index){
    this.dctData['billingdetails']=[]
    this.dctData['billingdetailsCopy']=[]
    this.intDiscount=0
    this.intBuyBack=0
    this.intTotCGST=0
    this.intTotIGST=0
    this.intTotSGST=0
    this.intGrandTot=0
    this.intTotIndirectDis=0
    this.intGDP = 0
    this.intGDEW = 0
    this.intTotal=0
    this.intTotKfc = 0;
    
    
    for(let item of this.lstItemDetails)
    {

        if(!this.blnCheckIGST){
          // item.dblRate=item.dblAmount-(item.dblCGST+item.dblSGST+item.dblDiscount+item.dblKFC);
          // item.dblRate=item.dblAmount-(item.dblCGST+item.dblSGST+item.dblKFC)+(item.dblDiscount+item.dblBuyBack);
          this.intTotSGST= this.intTotSGST+item.dblSGST
          this.intTotCGST= this.intTotCGST+item.dblCGST
          this.intTotKfc = this.intTotKfc + item.dblKFC;
        }
        else{
          // item.dblRate=item.dblAmount-(item.dblIGST+item.dblDiscount);

          // item.dblRate=item.dblAmount-(item.dblIGST)+(item.dblDiscount+item.dblBuyBack);
          this.intTotIGST= this.intTotIGST+item.dblIGST
        }
     
        this.intTotal= this.intTotal+item.dblRate
        this.intDiscount=this.intDiscount+item.dblDiscount
        this.intBuyBack=this.intBuyBack+item.dblBuyBack
        this.intTotIndirectDis=this.intTotIndirectDis+item.dblIndirectDis
        this.intGDP = item.GDP
        this.intGDEW = item.GDEW
        this.intGrandTot = this.intGrandTot + item.dblAmount + this.intGDP + this.intGDEW-(item.dblIndirectDis)
        // this.intGrandTot= this.intGrandTot+item.dblAmount

    }
    this.intGrandTot = this.intGrandTot+this.dblAdditions-this.dblDeductions


  }
  opencustomeredit(customeredit) {
    this.showModalCustEdit= this.modalService.open(customeredit, { size: 'lg' });
  }

  openReturnDetails(returnItem,index,id) {
    // this.currentIndex=index
    this.currentIndex=index
    this.returnId=id
  //to check the returned item is already exit on the table
   if(!this.lstcheckReturn.includes(this.currentIndex))
   {
      this.lstcheckReturn.push(this.currentIndex)
      this.dctReturnDetail[this.currentIndex]= {
        strRemark:'',
        image:'',
        blnDamage:false,
        imgURL:''
      }
   }

    this.showModalReturnDetails= this.modalService.open(returnItem, { size: 'sm' });
  }
  // Customer Edit

  saveCustEdit()
  {
    let checkError=false
   if(this.selectedCity){
      if (this.selectedCity != this.strCity)
      {
       this.toastr.error('Valid City Name is required', 'Error!');
       checkError=true
       this.intCityId = null
       this.strCity = ''
       this.selectedCity=''
       return false;
     }
  }
  if(this.selectedState){
      if (this.selectedState != this.strState)
      {
        this.toastr.error('Valid State Name is required', 'Error!');
        checkError=true
        this.intStateId = null
        this.strState = ''
        this.selectedState=''
        return false;
      }
   }

   if (this.strEmail){
    let errorPlace;
    const eatpos = this.strEmail.indexOf('@');
    const edotpos = this.strEmail.lastIndexOf('.');
    if ( eatpos < 1 || edotpos < eatpos + 2 || edotpos + 2 >= this.strEmail.length) {
      errorPlace = 'Email format is not correct ';
      checkError=true
      this.toastr.error(errorPlace,'Error!');
      return;
    }
   }

   if (this.strGSTNo && (this.strGSTNo).toString().length!=15) {
    this.toastr.error('Enter Valid GST No.', 'Error!');
   checkError=true;
    return false
  }
  if (this.strGSTNo && !(/^[0-9]{2}/).test(this.strGSTNo)) {
    this.toastr.error('First two digits of GST No. should be number', 'Error!');
   checkError=true;
    return false
  }

   if(!checkError){
    let dctCustomerData={}
    dctCustomerData['strEmail']=this.strEmail
    dctCustomerData['strAddress']=this.strAddress
    dctCustomerData['strCity']=this.strCity
    dctCustomerData['strState']=this.strState
    dctCustomerData['intCityId']=this.intCityId
    dctCustomerData['intStateId']=this.intStateId
    dctCustomerData['strGSTNo']=this.strGSTNo
    dctCustomerData['intCustId']=this.intCustId
    // partialInvoice Id
    dctCustomerData['intPartialId'] = this.salesReturnId

       this.serviceObject.postData('customer/edit_customer/',dctCustomerData).subscribe(res => {
         if (res.status == 1)
         {
           swal.fire({
             position: "center",
             type: "success",
             text: "Data saved successfully",
             showConfirmButton: true,
           });
           this.blnCheckIGST=res['data']['blnIGST']
           this.showModalCustEdit.close();

           this.dctData['custEditData']['strEmail']=res['data']['strCustEmail']
           this.dctData['custEditData']['strAddress']=res['data']['txtAddress']
           this.dctData['custEditData']['strState']=res['data']['strState']
           this.dctData['custEditData']['intStateId']=res['data']['intStateId']
           this.dctData['custEditData']['intCityId']=res['data']['intCityId']
           this.dctData['custEditData']['strCity']=res['data']['strLocation']
           this.dctData['custEditData']['strGSTNo']=res['data']['strGSTNo']
           this.dctData['custEditData']['intCustId'] = res['data']['intCustId']

         }
         else if (res.status == 0) {
           swal.fire('Error!',res['message'], 'error');
         }
     },
     (error) => {
       swal.fire('Error!','Server Error!!', 'error');

     });
   }

  }

  cancelCustEdit(){
    this.showModalCustEdit.close();
    if(this.dctData['custEditData']){
    this.strEmail = this.dctData['custEditData']['strEmail']
    this.strAddress = this.dctData['custEditData']['strAddress']
    this.selectedState = this.dctData['custEditData']['strState']
    this.intStateId= this.dctData['custEditData']['intStateId']
    this.intCityId= this.dctData['custEditData']['intCityId']
    this.selectedCity = this.dctData['custEditData']['strCity']
    this.strGSTNo = this.dctData['custEditData']['strGSTNo']
     }
  }
  fileManager2(fileInput) {
    fileInput.click();
  }
  returnDetailsSave(currentIndex)
  {

    if(!this.dctReturnDetail[currentIndex].strRemark){
      this.toastr.error('Remarks is mandatory', 'Error!');
    }
    else{
      let dctData={}
      this.dctImages[String(this.lstItemDetails[currentIndex]["strImei"])+'-'+String(currentIndex)]=this.form.get('img1').value
      // console.log(this.dctReturnDetail)
      
      // this.dctReturnId["return"]['blnDamage']=this.dctReturnDetail[currentIndex].blnDamage
      // this.dctReturnId["return"]['strRemarks']=this.dctReturnDetail[currentIndex].strRemark
      dctData['blnDamage']=this.dctReturnDetail[currentIndex].blnDamage
      dctData['strRemarks']=this.dctReturnDetail[currentIndex].strRemark
      this.dctReturnId[String(this.lstItemDetails[currentIndex]["strImei"])+'-'+String(currentIndex)]=dctData
      this.showModalReturnDetails.close();
      this.blnReturnDetails=true


       }
  }

  Preview1(files, event,index) {
    this.dctReturnDetail[this.currentIndex]['message']=''
    if (files.length === 0)
      return;
    this.image1 = files
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.dctReturnDetail[this.currentIndex]['message'] = "Only images are supported.";
      return;
    }


    const img_files = event.target.files;
    const file = img_files[0];
    this.image1 = file;

    if (this.image1) {

      const img_up = new Image;
      let img_ratio_up = 0;
      img_up.onload = () => {
        const width_up = img_up.width;
        const height_up = img_up.height;

        img_ratio_up = width_up / height_up;
        img_ratio_up = Math.floor(img_ratio_up * 10) / 10;

          // for preview
          var reader = new FileReader();
          this.imagePath1 = files;
          reader.readAsDataURL(files[0]);
          reader.onload = () => {
            this.dctReturnDetail[this.currentIndex].imgURL = reader.result;
            this.imgURL1=reader.result;
            this.dctReturnDetail[this.currentIndex]['message']=files[0]['name']

          }
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.image1 = file
            this.form.get('img1').setValue(file);
            this.dctReturnDetail[this.currentIndex].image= this.form.get('img1').value


          }

      };
      img_up.src = window.URL.createObjectURL(this.image1);
      // return status

    }

  }
  saveInvoice()
  {

    const form_data = new FormData;
    
    let error=false
    swal.fire({  //Confirmation before save
      title: 'Save',
      text: "Are sure to sure want to continue ?" ,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes, Save it!",
      }).then(result => {
      if (result.value) {
        let count=0
        this.lstItemDetails.forEach(element=>{
          if(element.strItemCode!='GDC00001' && element.strItemCode!='GDC00002')
        {
          count=count+1
        }
      })
      // console.log("count",count)
      // console.log("dct",this.dctReturnId)
      // console.log("len",this.objectKeys(this.dctReturnId).length)
      if (count !=this.objectKeys(this.dctReturnId).length){
        this.blnReturnDetails=false
      }
        if(!this.blnReturnDetails){
          swal.fire('Error!','Details of returned item is required','error')
        }
        else{
          
          
          // console.log("this.dctReturnId",this.dctReturnId)
          form_data.append('lstItemDetails',JSON.stringify(this.lstItemDetails))
          form_data.append('salesReturnId',JSON.stringify(this.salesReturnId))
          form_data.append('dctReturnId',JSON.stringify(this.dctReturnId))
          form_data.append('intGrandTot',String(this.intGrandTot))
          form_data.append('intDiscount',String(this.intDiscount))
          form_data.append('intTotSGST',String(this.intTotSGST))
          form_data.append('intTotCGST',String(this.intTotCGST))
          form_data.append('intTotIGST',String(this.intTotIGST))
          form_data.append('intBuyBack',String(this.intBuyBack))
          form_data.append('intCustId',String(this.intCustId))
          form_data.append('strRemarks',this.strRemarks)
          form_data.append('intTotKFC',String(this.intTotKfc))
          form_data.append('blnSalesReturnAll',this.blnSalesReturnAll)
          
          // form_data.append('return', inary(this.dctImages))
          // console.log("dfgdsg",this.dctImages)
          Object.keys(this.dctImages).forEach(element => {
            // console.log("dfg",this.dctImages[element])
            // console.log("dfgdsg",element)
            form_data.append(element,this.dctImages[element])
          });
          this.saveDisable=true;

          this.serviceObject.postData('invoice/return_item_invoice/',form_data).subscribe(res => {
            if (res.status == 1)
            {
              swal.fire({
                position: "center",
                type: "success",
                text: "Data saved successfully",
                showConfirmButton: true,
              });
              this.saveDisable=true;
              
      localStorage.setItem('previousUrl','invoice/salesreturnlist');
              
             this.router.navigate(['invoice/salesreturnlist']);
   
            }
            else if (res.status == 0) {
              if(res.hasOwnProperty('blnStock')){
                swal.fire('Error!',res['message'], 'error');
              }
              else{
                swal.fire('Error!',res['message'], 'error');
                this.saveDisable=false;
              }
              
            }
            else if (res.status == 4) {
                swal.fire('Error!',res['message'], 'error');
                this.saveDisable=false;
              }
        },
        (error) => {
          swal.fire('Error!','Server Error!!', 'error');
          this.saveDisable=false;
          
   
        });
        }
       };

      });

  }
}
