import { Component, OnInit, ɵConsole } from '@angular/core';
import { ExcelService } from '../shared/excel.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers:[ExcelService]
})
export class ReportComponent implements OnInit {




  grandTotal;
  saleQtyTot;
  enqQtyTot;
  enqValTot=0;
  lstdatatoexcel=[];
  lstdattot=[];

  constructor(private excelService: ExcelService) { }

  ngOnInit() {
  }





  valueIterationExp(dctTempData,dctReportData,expJsondata){
   

    let dctTable={};
    let dctTotal={};
    let lstData=[];
    this.grandTotal=0;
    this.saleQtyTot=0;
    this.enqQtyTot=0;
    this.enqValTot=0;
    this.lstdatatoexcel=[];
    this.lstdattot=[];
  
  
    
    for(var key1 in dctTempData){
      for(var key2 in dctTempData[key1]){
        
        this.grandTotal+=dctTempData[key1][key2]['SaleValue'];
        this.saleQtyTot+=dctTempData[key1][key2]['SaleQty'];
        this.enqQtyTot+=dctTempData[key1][key2]['EnquiryQty'];
        this.enqValTot+=dctTempData[key1][key2]['EnquiryValue'];  
  
        dctTotal['Name']='TOTAL';
        dctTotal['EnquiryQty']=this.enqQtyTot;
        dctTotal['SaleQty']= this.saleQtyTot;
        dctTotal['EnquiryValue']=this.enqValTot;
        dctTotal['SaleValue']=this.grandTotal;
        dctTotal['Contrib_per']="";
        dctTotal['Conversion_per']="";
        dctTotal['ContribQty_per']="";
  
       
      }
      }
  
      let salesValue,saleQty;
      let enquiryValue,enqQty; 
      
  
      for(var key1 in dctTempData){
        for(var key2 in dctTempData[key1]){ 
          if(expJsondata['charthead']=='Staff' && expJsondata['component']!='Productivity' && expJsondata['component']!='Customer_Report'){
            dctTable['Name']=dctReportData.STAFFS[key2];
          } 
          else{
            dctTable['Name']=key2; 
          }
           
          dctTable['EnquiryQty']=dctTempData[key1][key2]['EnquiryQty'];          
          dctTable['SaleQty']=dctTempData[key1][key2]['SaleQty'];
  
          saleQty=dctTable['SaleQty'];
          if(this.saleQtyTot==0){
            dctTable['ContribQty_per']=0;
          }
          else{
          dctTable['ContribQty_per']=((saleQty/this.saleQtyTot)*100).toFixed(2);
          }
          dctTable['EnquiryValue']=dctTempData[key1][key2]['EnquiryValue'];
          dctTable['SaleValue']=dctTempData[key1][key2]['SaleValue'];
          salesValue=dctTempData[key1][key2]['SaleValue'];
          enquiryValue=dctTempData[key1][key2]['EnquiryValue'];  
          enqQty=dctTable['EnquiryQuantity'];
  
          
          if(this.grandTotal==0){
            dctTable['Contrib_per']=0;
          }
          else{
            dctTable['Contrib_per']=((salesValue/this.grandTotal)*100).toFixed(2);
          }
  
          if(enquiryValue==0){
            dctTable['Conversion_per']=0;
          }
          else{
          dctTable['Conversion_per']=((salesValue/enquiryValue)*100).toFixed(2);
          }
  
          
  
        
  
           lstData.push(dctTable);
           this.lstdatatoexcel.push(dctTable)
          //  totalData.push(dctTotal);
           dctTable={};
          //  dctTotal={};
          //  i++;
        }
        
       
      }
      
      this.lstdatatoexcel=this.sortdata(this.lstdatatoexcel,expJsondata);
      
      this.lstdatatoexcel.push(dctTotal);
      
      // console.log()
      // console.log("jsonData",expJsondata)
      // console.log(this.sort,this.sort.acftive,this.sort.direction,"Matsort")
        this.excelService.exportAsExcelFile(this.lstdatatoexcel,expJsondata);
        this.lstdatatoexcel=[]

      // console.log(this.lstdatatoexcel,"lstDatatoexcel");
  
  }

        // *************************priceband itemwise*********************
        valueIterationPriceBandItemwise(dctTempData,expJsondata){
          
      
      
          let dctTable={};
          let dctTotal={};
          let lstData=[];
      
          if(expJsondata['areain']=='Branch'){
            let lstSortData=[];
      
          for(let item of dctTempData){
            dctTotal={}
            // dctTotal['Serial_No']=i;
            dctTotal['Date']=item.dat_sale
            dctTotal['Branch']=item.vchr_branch_name;
            dctTotal['PriceRange']=item.range;
            dctTotal['Brand']=item.vchr_brand_name;
            dctTotal['Item']=item.vchr_item_name;
            dctTotal['Quantity']=item.int_qty;
            dctTotal['Value']=item.dbl_value;
      
            lstData.push(dctTotal);
          }
      
        //  lstData=this.sortdata(lstData,expJsondata);
      
        let i=1
         for(let item of lstData){
            dctTotal={}
            dctTotal['Serial_No']=i;
            dctTotal['Date']=item.Date
            dctTotal['Branch']=item.Branch;
            dctTotal['Price Range']=item.PriceRange;
            dctTotal['Brand']=item.Brand;
            dctTotal['Item']=item.Item;
            dctTotal['Quantity']=item.Quantity;
            dctTotal['Value']=item.Value;
      
            i=i+1
            lstSortData.push(dctTotal);
      
         }
      
        //  lstSortData.push(dctTotal);
         console.log("lstsortdata",lstSortData);
         
         this.excelService.exportAsPriceBandItemwise(lstSortData,expJsondata);
        }
        else if(expJsondata['areain']=='Territory'){
          let lstSortData=[];
      
      
          for(let item of dctTempData){
            dctTotal={}
            // dctTotal['Serial_No']=i;
            dctTotal['Date']=item.dat_sale
            dctTotal['Territory']=item.vchr_territory_name;
            dctTotal['PriceRange']=item.range;
            dctTotal['Brand']=item.vchr_brand_name;
            dctTotal['Item']=item.vchr_item_name;
            dctTotal['Quantity']=item.int_qty;
            dctTotal['Value']=item.dbl_value;
      
            lstData.push(dctTotal);
          }
          console.log("lstdata",lstData);
          
      
        //  lstData=this.sortdata(lstData,expJsondata);
        let i=1
         for(let item of lstData){
            dctTotal={}
            dctTotal['Serial_No']=i;
            dctTotal['Date']=item.Date
            dctTotal['Territory']=item.Territory;
            dctTotal['Price Range']=item.PriceRange;
            dctTotal['Brand']=item.Brand;
            dctTotal['Item']=item.Item;
            dctTotal['Quantity']=item.Quantity;
            dctTotal['Value']=item.Value;
      
            i=i+1
            lstSortData.push(dctTotal);
      
         }
         
      
        //  lstSortData.push(dctTotal);
         console.log("lstsortdata",lstSortData);
      
         this.excelService.exportAsPriceBandItemwise(lstSortData,expJsondata);
      
        }
        else if(expJsondata['areain']=='TerritoryandBranch'){
          let lstSortData=[];
      
          for(let item of dctTempData){
            dctTotal={}
            // dctTotal['Serial_No']=i;
            dctTotal['Date']=item.dat_sale
            dctTotal['Territory']=item.vchr_territory_name;
            dctTotal['Branch']=item.vchr_branch_name;
            dctTotal['PriceRange']=item.range;
            dctTotal['Brand']=item.vchr_brand_name;
            dctTotal['Item']=item.vchr_item_name;
            dctTotal['Quantity']=item.int_qty;
            dctTotal['Value']=item.dbl_value;
      
            lstData.push(dctTotal);
          }
      
         lstData=this.sortdata(lstData,expJsondata);
         let i=1
         for(let item of lstData){
            dctTotal={}
            dctTotal['Serial_No']=i;
            dctTotal['Date']=item.Date
            dctTotal['Territory']=item.Territory;
            dctTotal['Branch']=item.Branch;
            dctTotal['Price Range']=item.PriceRange;
            dctTotal['Brand']=item.Brand;
            dctTotal['Item']=item.Item;
            dctTotal['Quantity']=item.Quantity;
            dctTotal['Value']=item.Value;
      
            i=i+1
            lstSortData.push(dctTotal);
      
         }
      
         console.log("lstsortdata",lstSortData);
      
         this.excelService.exportAsPriceBandItemwise(lstSortData,expJsondata);
      
        }
        else if(expJsondata['areain']=='Zone'){
          let lstSortData=[];
      
          for(let item of dctTempData){
            dctTotal={}
            // dctTotal['Serial_No']=i;
            dctTotal['Date']=item.dat_sale
            dctTotal['Zone']=item.zone_name;
            dctTotal['PriceRange']=item.range;
            dctTotal['Brand']=item.vchr_brand_name;
            dctTotal['Item']=item.vchr_item_name;
            dctTotal['Quantity']=item.int_qty;
            dctTotal['Value']=item.dbl_value;
      
            lstData.push(dctTotal);
          }
      
         lstData=this.sortdata(lstData,expJsondata);
      
         let i=1
         for(let item of lstData){
            dctTotal={}
            dctTotal['Serial_No']=i;
            dctTotal['Date']=item.Date
            dctTotal['Zone']=item.Zone;
            dctTotal['PriceRange']=item.PriceRange;
            dctTotal['Brand']=item.Brand;
            dctTotal['Item']=item.Item;
            dctTotal['Quantity']=item.Quantity;
            dctTotal['Value']=item.Value;
      
            i=i+1
            lstSortData.push(dctTotal);
      
         }
         console.log("lstsortdata",lstSortData);
      
      
         this.excelService.exportAsPriceBandItemwise(lstSortData,expJsondata);
      
        }
        else if(expJsondata['areain']=='ZoneandTerritory'){
          let lstSortData=[];
      
          for(let item of dctTempData){
            dctTotal={}
            // dctTotal['Serial_No']=i;
            dctTotal['Date']=item.dat_sale
            dctTotal['Zone']=item.zone_name;
            dctTotal['Territory']=item.vchr_territory_name;
            dctTotal['PriceRange']=item.range;
            dctTotal['Brand']=item.vchr_brand_name;
            dctTotal['Item']=item.vchr_item_name;
            dctTotal['Quantity']=item.int_qty;
            dctTotal['Value']=item.dbl_value;
      
            lstData.push(dctTotal);
          }
      
         lstData=this.sortdata(lstData,expJsondata);
      
         let i=1
         for(let item of lstData){
            dctTotal={}
            dctTotal['Serial_No']=i;
            dctTotal['Date']=item.Date
            dctTotal['Zone']=item.Zone;
            dctTotal['Territory']=item.Territory;
            dctTotal['Price Range']=item.PriceRange;
            dctTotal['Brand']=item.Brand;
            dctTotal['Item']=item.Item;
            dctTotal['Quantity']=item.Quantity;
            dctTotal['Value']=item.Value;
      
            i=i+1
            lstSortData.push(dctTotal);
      
         }
        
         console.log("lstsortdata",lstSortData);
      
         this.excelService.exportAsPriceBandItemwise(lstSortData,expJsondata);
      
        }
        }
        // *************************priceband itemwise ends*********************
  



  valueIterationExps(dctTempData,dctReportData,expJsondata){
  
   
    let dctTable={};
    let dctTotal={};
    let lstData=[];
    this.grandTotal=0;
    this.saleQtyTot=0;
    this.enqQtyTot=0;
    this.enqValTot=0;
    this.lstdatatoexcel=[];
    this.lstdattot=[];
  
  
    
    for(var key1 in dctTempData){
      for(var key2 in dctTempData[key1]){
        
        this.grandTotal+=dctTempData[key1][key2]['SalesValue'];
        this.saleQtyTot+=dctTempData[key1][key2]['SalesQty'];
        this.enqQtyTot+=dctTempData[key1][key2]['EnquiryQty'];
        this.enqValTot+=dctTempData[key1][key2]['EnquiryValue'];  
  

  
       
      }
      }
      dctTotal['Name']='TOTAL';
      dctTotal['EnquiryQty']=this.enqQtyTot;
      dctTotal['SaleQty']= this.saleQtyTot;
      dctTotal['EnquiryValue']=this.enqValTot;
      dctTotal['SaleValue']=this.grandTotal;
      dctTotal['Contrib_per']="";
      dctTotal['Conversion_per']="";
      dctTotal['ContribQty_per']="";
  
      let salesValue,saleQty;
      let enquiryValue,enqQty;
      
  
      for(var key1 in dctTempData){
        for(var key2 in dctTempData[key1]){ 
          if(expJsondata['charthead']=='Staff' && expJsondata['component']!='Productivity' && expJsondata['component']!='Customer_Report'){
            dctTable['Name']=dctReportData.staffs[key2];
          } 
          else{
            dctTable['Name']=key2; 
          }
           
          dctTable['EnquiryQty']=dctTempData[key1][key2]['EnquiryQty'];          
          dctTable['SaleQty']=dctTempData[key1][key2]['SalesQty'];
  
          saleQty=dctTable['SaleQty'];
          if(this.saleQtyTot==0){
            dctTable['ContribQty_per']=0;
          }
          else{
          dctTable['ContribQty_per']=((saleQty/this.saleQtyTot)*100).toFixed(2);
          }
          dctTable['EnquiryValue']=dctTempData[key1][key2]['EnquiryValue'];
          dctTable['SaleValue']=dctTempData[key1][key2]['SalesValue'];
          salesValue=dctTempData[key1][key2]['SalesValue'];
          enquiryValue=dctTempData[key1][key2]['EnquiryValue'];  
          enqQty=dctTable['EnquiryQuantity'];
  
          
          if(this.grandTotal==0){
            dctTable['Contrib_per']=0;
          }
          else{
            dctTable['Contrib_per']=((salesValue/this.grandTotal)*100).toFixed(2);
          }
  
          if(enquiryValue==0){
            dctTable['Conversion_per']=0;
          }
          else{
          dctTable['Conversion_per']=((salesValue/enquiryValue)*100).toFixed(2);
          }
  
          
  
        
  
           lstData.push(dctTable);
           this.lstdatatoexcel.push(dctTable)
          //  totalData.push(dctTotal);
           dctTable={};
          //  dctTotal={};
          //  i++;
        }
        
       
      }
      this.lstdatatoexcel=this.sortdata(this.lstdatatoexcel,expJsondata);
      
      this.lstdatatoexcel.push(dctTotal);
      
      // console.log()
      // console.log("jsonData",expJsondata)
      // console.log(this.sort,this.sort.acftive,this.sort.direction,"Matsort")
        this.excelService.exportAsExcelFile(this.lstdatatoexcel,expJsondata);
        this.lstdatatoexcel=[]

      // console.log(this.lstdatatoexcel,"lstDatatoexcel");
  
  } 

//status change report start
  valueIterations(dctTempData,expJsondata){

    let dctTable={};
    let dctTotal={};
    let lstData=[];
    let lstSortData=[];
    
    let i=1
    for(let item of dctTempData){
      dctTotal={}
      // dctTotal['Serial_No']=i;
      dctTotal['Audit_No']=item.fk_master__vchr_audit_num;
      dctTotal['Auditor']=item.fk_master__fk_created__first_name +' '+ item.fk_master__fk_created__last_name;
      dctTotal['Branch']=item.fk_master__fk_branch__vchr_name;
      dctTotal['Question']=item.fk_question__vchr_question;
      dctTotal['Initial_Grade']=item.initial;
      dctTotal['Current_Grade']=item.current;
      lstData.push(dctTotal);
      // i=i+1
    }
    
   lstData=this.sortdata(lstData,expJsondata);
   
   for(let item of lstData){
      dctTable={}
      dctTable['Serial_No']=i;
      dctTable['Audit_No']= item['Audit_No']
      dctTable['Auditor']= item['Auditor']
      dctTable['Branch']=  item['Branch']
      dctTable['Question']=item['Question']
      dctTable['Initial_Grade']= item['Initial_Grade']
      dctTable['Current_Grade']= item['Current_Grade']
      i=i+1
      lstSortData.push(dctTable);
      
   }
   this.excelService.exportAsStatusChanged(lstSortData,expJsondata);
   


  }
  //status change report start
  valueIterationsAudit(dctTempData,expJsondata){

    let dctTable={};
    let dctTotal={};
    let lstData=[];
    let lstSortData=[];
    
    let i=1
    for(let item of dctTempData){
      dctTotal={}
      // dctTotal['Serial_No']=i;
      dctTotal['Audit_No']=item.vchr_audit_num;
      dctTotal['Auditor']=item.vchr_auditor_name;
      dctTotal['Branch']=item.vchr_branch_name;
      dctTotal['Date']=item.dat_created_at;
      dctTotal['Status']=item.vchr_status;
      dctTotal['A']=item.A;
      dctTotal['B']=item.B;
      dctTotal['C']=item.C;



      lstData.push(dctTotal);
      // i=i+1
    }
    
   lstData=this.sortdata(lstData,expJsondata);
   
   for(let item of lstData){
      dctTable={}
      dctTable['Serial_No']=i;
      dctTotal['Date']=item['Date']
      dctTable['Audit_No']= item['Audit_No']
      dctTable['Auditor']= item['Auditor']
      dctTable['Branch']=  item['Branch']
      dctTable['A']=item['A'];
      dctTable['B']=item['B'];
      dctTable['C']=item['C'];
      dctTable['Status']=item['Status']
      i=i+1
      lstSortData.push(dctTable);
      
   }
   this.excelService.exportAsAudit(lstSortData,expJsondata);
   


  }
  //exchange report
  valueIterationExchange(dctTempData,expJsondata){

    let dctTable={};
    let dctTotal={};
    let lstData=[];
    let lstSortData=[];
    for(let item of dctTempData){
      dctTable={}
      dctTable['Date']=item['dat_created']
      dctTable['Enquiry_No']= item['enquiry_num']
      dctTable['Branch']= item['branch_name']
      dctTable['Brand']=  item['brand_name']
      dctTable['Item_Name']=item['item_name'];
      if(item['imei']){
        dctTable['Imei_no']=item['imei'];
      }
      else{
        dctTable['Imei_no']="---";
      }
      dctTable['Amount']=item['amount'];
      lstData.push(dctTable);
      
   }
   lstData=this.sortdata(lstData,expJsondata);
   this.excelService.exportAsExchange(lstData,expJsondata);
   
  }

  valueIterationsIncentives(dctTempData,total,expJsondata){
    

    let dctTable={};
    let dctTotal={};
    let lstData=[];
    let lstSortData=[];
    
    let i=1
    if(expJsondata['areain']=='Branch'){
    for(let item of dctTempData){
      dctTotal={}
      // dctTotal['Serial_No']=i;
      dctTotal['Branch']=item.strBranch;
      dctTotal['A']=item.A;
      dctTotal['B']=item.B;
      dctTotal['C']=item.C;
      dctTotal['Total_Incentive']=item.dblIncentive;
      dctTotal['Total_Point']=item.intTotalPoint;

      lstData.push(dctTotal);
    }

   lstData=this.sortdata(lstData,expJsondata);
   
   
   for(let item of lstData){
      dctTable={}
      dctTable['Serial_No']=i;
      dctTable['Branch']=  item['Branch']
      dctTable['A']=item['A'];
      dctTable['B']=item['B'];
      dctTable['C']=item['C'];
      dctTable['Total_Incentive']=item['Total_Incentive']
      dctTable['Total_Point']= item['Total_Point']

      i=i+1
      lstSortData.push(dctTable);
      
   }

   dctTable={}
   dctTable['Serial_No']='';
   dctTable['Branch']='';
   dctTable['A']='';
   dctTable['B']='';
   dctTable['C']='';
   dctTable['Total_Incentive']='';
   dctTable['Total_Point']='';
   lstSortData.push(dctTable);
   if(expJsondata['charthead']='Audit Incentive Report'){
    dctTotal={}
    dctTotal['Serial_No']="Incentive:";
    dctTotal['Branch']=total['dblAvgIncentive'];
    dctTotal['A']=''
    dctTotal['B']='';
    dctTotal['C']='Average Point:'+total['dblAvgPoints']
    dctTotal['Total_Incentive']=''
    dctTotal['Total_Point']="Total Point : "+ total['intTotalPoint']

   }
   else {
    dctTotal={}
    dctTotal['Serial_No']="Avg Incentive:";
    dctTotal['Branch']=total['dblAvgIncentive'];
    dctTotal['A']="Incentive : "+total['dblTotalIncentive']
    dctTotal['B']='';
    dctTotal['C']='Average Point:'+total['dblAvgPoints']
    dctTotal['Total_Incentive']=''
    dctTotal['Total_Point']="Total Point : "+ total['intTotalPoint']
   }
   

 
   
   lstSortData.push(dctTotal); 
   this.excelService.exportAsIncentives(lstSortData,expJsondata);
  }
  else if(expJsondata['areain']=='Territory'){
    
    for(let item of dctTempData){
      dctTotal={}
      // dctTotal['Serial_No']=i;
      dctTotal['Territory']=item.strTerritory;
      dctTotal['A']=item.A;
      dctTotal['B']=item.B;
      dctTotal['C']=item.C;
      dctTotal['Total_Incentive']=item.dblIncentive;
      dctTotal['Total_Point']=item.intTotalPoint;

      lstData.push(dctTotal);
    }
    
   lstData=this.sortdata(lstData,expJsondata);
   
   for(let item of lstData){
      dctTable={}
      dctTable['Serial_No']=i;
      dctTable['Territory']=  item['Territory']
      dctTable['A']=item['A'];
      dctTable['B']=item['B'];
      dctTable['C']=item['C'];
      dctTable['Total_Incentive']=item['Total_Incentive']
      dctTable['Total_Point']= item['Total_Point']

      i=i+1
      lstSortData.push(dctTable);
      
   }
   dctTable={}
   dctTable['Serial_No']='';
   dctTable['Territory']='';
   dctTable['A']='';
   dctTable['B']='';
   dctTable['C']='';
   dctTable['Total_Incentive']='';
   dctTable['Total_Point']='';
   lstSortData.push(dctTable); 
   
   if(expJsondata['charthead']='Audit Incentive Report'){
    dctTotal={}
    dctTotal['Serial_No']="Incentive:";
    dctTotal['Territory']=total['dblAvgIncentive'];
    dctTotal['A']=''
    dctTotal['B']='';
    dctTotal['C']='Average Point:'+total['dblAvgPoints']
    dctTotal['Total_Incentive']=''
    dctTotal['Total_Point']="Total Point : "+ total['intTotalPoint']

   }
   else {
    dctTotal={}
    dctTotal['Serial_No']="Avg Incentive:";
    dctTotal['Territory']=total['dblAvgIncentive'];
    dctTotal['A']="Incentive : "+total['dblTotalIncentive']
    dctTotal['B']='';
    dctTotal['C']='Average Point:'+total['dblAvgPoints']
    dctTotal['Total_Incentive']=''
    dctTotal['Total_Point']="Total Point : "+ total['intTotalPoint']
   }
 
   
   lstSortData.push(dctTotal); 
   this.excelService.exportAsIncentives(lstSortData,expJsondata);

  }
  else if(expJsondata['areain']=='TerritoryandBranch'){
    for(let item of dctTempData){
      dctTotal={}
      // dctTotal['Serial_No']=i;
      dctTotal['Territory']=item.strTerritory;
      dctTotal['Branch']=item.strBranch;
      dctTotal['A']=item.A;
      dctTotal['B']=item.B;
      dctTotal['C']=item.C;
      dctTotal['Total_Incentive']=item.dblIncentive;
      dctTotal['Total_Point']=item.intTotalPoint;

      lstData.push(dctTotal);
    }
    
   lstData=this.sortdata(lstData,expJsondata);
   
   for(let item of lstData){
      dctTable={}
      dctTable['Serial_No']=i;
      dctTable['Territory']=  item['Territory'];
      dctTable['Branch']=item['Branch'];
      dctTable['A']=item['A'];
      dctTable['B']=item['B'];
      dctTable['C']=item['C'];
      dctTable['Total_Incentive']=item['Total_Incentive']
      dctTable['Total_Point']= item['Total_Point']

      i=i+1
      lstSortData.push(dctTable);
      
   }

   dctTable={}
   dctTable['Serial_No']='';
   dctTable['Territory']='';
   dctTable['Branch']='';
   dctTable['A']='';
   dctTable['B']='';
   dctTable['C']='';
   dctTable['Total_Incentive']='';
   dctTable['Total_Point']='';
   lstSortData.push(dctTable); 
   if(expJsondata['charthead']=='Audit Incentive Report'){
    dctTotal={}
    dctTotal['Serial_No']="Incentive:";
    dctTotal['Territory']=total['dblAvgIncentive'];
    dctTotal['Branch']='';
    dctTotal['A']=""
    dctTotal['B']='';
    dctTotal['C']='Average Point:'+total['dblAvgPoints']
    dctTotal['Total_Incentive']=''
    dctTotal['Total_Point']="Total Point : "+ total['intTotalPoint']

   }
   else {
    dctTotal={}
    dctTotal['Serial_No']="Avg Incentive:";
    dctTotal['Territory']=total['dblAvgIncentive'];
    dctTotal['Branch']='';
    dctTotal['A']="Incentive: "+total['dblTotalIncentive']
    dctTotal['B']='';
    dctTotal['C']='Average Point:'+total['dblAvgPoints']
    dctTotal['Total_Incentive']=''
    dctTotal['Total_Point']="Total Point : "+ total['intTotalPoint']
   }
   

 
   
   lstSortData.push(dctTotal); 
   this.excelService.exportAsIncentives(lstSortData,expJsondata);

  }
  else if(expJsondata['areain']=='Zone'){
    for(let item of dctTempData){
      dctTotal={}
      // dctTotal['Serial_No']=i;
      dctTotal['Zone']=item.strZone;
      // dctTable['Branch']=  item['Branch']
      dctTotal['A']=item.A;
      dctTotal['B']=item.B;
      dctTotal['C']=item.C;
      dctTotal['Total_Incentive']=item.dblIncentive;
      dctTotal['Total_Point']=item.intTotalPoint;

      lstData.push(dctTotal);
    }
    
   lstData=this.sortdata(lstData,expJsondata);
   
   for(let item of lstData){
      dctTable={}
      dctTable['Serial_No']=i;
      dctTable['Zone']=  item['Zone']
      dctTable['A']=item['A'];
      dctTable['B']=item['B'];
      dctTable['C']=item['C'];
      dctTable['Total_Incentive']=item['Total_Incentive']
      dctTable['Total_Point']= item['Total_Point']

      i=i+1
      lstSortData.push(dctTable);
      
   }
   dctTable={}
   dctTable['Serial_No']='';
   dctTable['Zone']='';
   dctTable['A']='';
   dctTable['B']='';
   dctTable['C']='';
   dctTable['Total_Incentive']='';
   dctTable['Total_Point']='';
   lstSortData.push(dctTable);
   if(expJsondata['charthead']=='Audit Incentive Report'){
    dctTotal={}
    dctTotal['Serial_No']="Incentive:"
    dctTotal['Zone']=total['dblAvgIncentive'];
    dctTotal['A']=''
    dctTotal['B']='';
    dctTotal['C']='Average Point:'+total['dblAvgPoints']
    dctTotal['Total_Incentive']=''
    dctTotal['Total_Point']="Total Point : "+ total['intTotalPoint']

   }
   else {
    dctTotal={}
    dctTotal['Serial_No']="Avg Incentive:"
    dctTotal['Zone']=total['dblAvgIncentive'];
    dctTotal['A']="Incentive : "+total['dblTotalIncentive']
    dctTotal['B']='';
    dctTotal['C']='Average Point:'+total['dblAvgPoints']
    dctTotal['Total_Incentive']=''
    dctTotal['Total_Point']="Total Point : "+ total['intTotalPoint']
   }
   

 
   
   lstSortData.push(dctTotal); 
   this.excelService.exportAsIncentives(lstSortData,expJsondata);

  }
  else if(expJsondata['areain']=='ZoneandTerritory'){
    for(let item of dctTempData){
      dctTotal={}
      // dctTotal['Serial_No']=i;
      dctTotal['Zone']=item.strZone;
      dctTotal['Territory']=item.strTerritory;
      dctTotal['A']=item.A;
      dctTotal['B']=item.B;
      dctTotal['C']=item.C;
      dctTotal['Total_Incentive']=item.dblIncentive;
      dctTotal['Total_Point']=item.intTotalPoint;

      lstData.push(dctTotal);
    }
    
   lstData=this.sortdata(lstData,expJsondata);
   
   for(let item of lstData){
      dctTable={}
      dctTable['Serial_No']=i;
      dctTable['Zone']=item['Zone'];
      dctTable['Territory']=  item['Territory'];
      dctTable['A']=item['A'];
      dctTable['B']=item['B'];
      dctTable['C']=item['C'];
      dctTable['Total_Incentive']=item['Total_Incentive']
      dctTable['Total_Point']= item['Total_Point']

      i=i+1
      lstSortData.push(dctTable);
      
   }
   dctTable={}
   dctTable['Serial_No']='';
   dctTable['Zone']='';
   dctTable['Territory']='';
   dctTable['A']='';
   dctTable['B']='';
   dctTable['C']='';
   dctTable['Total_Incentive']='';
   dctTable['Total_Point']='';
   lstSortData.push(dctTable); 

   if(expJsondata['charthead']=='Audit Incentive Report'){
    dctTotal={}
    dctTotal['Serial_No']="Incentive:";
    dctTotal['Zone']=total['dblAvgIncentive'];
    dctTotal['Territory']='';
    dctTotal['A']=""
    dctTotal['B']='';
    dctTotal['C']='Average Point:'+total['dblAvgPoints']
    dctTotal['Total_Incentive']=''
    dctTotal['Total_Point']="Total Point : "+ total['intTotalPoint']

   }
   else {
    dctTotal={}
    dctTotal['Serial_No']="Avg Incentive:";
    dctTotal['Zone']=total['dblAvgIncentive'];
    dctTotal['Territory']='';
    dctTotal['A']="Incentive: "+total['dblTotalIncentive']
    dctTotal['B']='';
    dctTotal['C']='Average Point:'+total['dblAvgPoints']
    dctTotal['Total_Incentive']=''
    dctTotal['Total_Point']="Total Point : "+ total['intTotalPoint']
   }
   

 
   
   lstSortData.push(dctTotal); 
   this.excelService.exportAsIncentives(lstSortData,expJsondata);

  }

    else if (expJsondata['areain'] == 'Area') {

      for (let item of dctTempData) {
        dctTotal = {}
        // dctTotal['Serial_No']=i;
        dctTotal['Area'] = item.strArea;
        // dctTable['Branch']=  item['Branch']
        dctTotal['A'] = item.A;
        dctTotal['B'] = item.B;
        dctTotal['C'] = item.C;
        dctTotal['Total_Incentive'] = item.dblIncentive;
        dctTotal['Total_Point'] = item.intTotalPoint;

        lstData.push(dctTotal);
      }

      lstData = this.sortdata(lstData, expJsondata);

      for (let item of lstData) {
        dctTable = {}
        dctTable['Serial_No'] = i;
        dctTable['Area'] = item['Area']
        dctTable['A'] = item['A'];
        dctTable['B'] = item['B'];
        dctTable['C'] = item['C'];
        dctTable['Total_Incentive'] = item['Total_Incentive']
        dctTable['Total_Point'] = item['Total_Point']

        i = i + 1
        lstSortData.push(dctTable);

      }
      dctTable = {}
      dctTable['Serial_No'] = '';
      dctTable['Area'] = '';
      dctTable['A'] = '';
      dctTable['B'] = '';
      dctTable['C'] = '';
      dctTable['Total_Incentive'] = '';
      dctTable['Total_Point'] = '';
      lstSortData.push(dctTable);
      if (expJsondata['charthead'] == 'Audit Incentive Report') {
        dctTotal = {}
        dctTotal['Serial_No'] = "Incentive:"
        dctTotal['Area'] = total['dblAvgIncentive'];
        dctTotal['A'] = ''
        dctTotal['B'] = '';
        dctTotal['C'] = 'Average Point:' + total['dblAvgPoints']
        dctTotal['Total_Incentive'] = ''
        dctTotal['Total_Point'] = "Total Point : " + total['intTotalPoint']

      }
      else {
        dctTotal = {}
        dctTotal['Serial_No'] = "Avg Incentive:"
        dctTotal['Area'] = total['dblAvgIncentive'];
        dctTotal['A'] = "Incentive : " + total['dblTotalIncentive']
        dctTotal['B'] = '';
        dctTotal['C'] = 'Average Point:' + total['dblAvgPoints']
        dctTotal['Total_Incentive'] = ''
        dctTotal['Total_Point'] = "Total Point : " + total['intTotalPoint']
      }




      lstSortData.push(dctTotal);


      this.excelService.exportAsIncentives(lstSortData, expJsondata);

    }
    else if (expJsondata['areain'] == 'AreaandBranch') {
      for (let item of dctTempData) {
        dctTotal = {}
        // dctTotal['Serial_No']=i;
        dctTotal['Area'] = item.strArea;
        dctTotal['Branch'] = item.strBranch;
        dctTotal['A'] = item.A;
        dctTotal['B'] = item.B;
        dctTotal['C'] = item.C;
        dctTotal['Total_Incentive'] = item.dblIncentive;
        dctTotal['Total_Point'] = item.intTotalPoint;

        lstData.push(dctTotal);
      }

      lstData = this.sortdata(lstData, expJsondata);

      for (let item of lstData) {
        dctTable = {}
        dctTable['Serial_No'] = i;
        dctTable['Area'] = item['Area'];
        dctTable['Branch'] = item['Branch'];
        dctTable['A'] = item['A'];
        dctTable['B'] = item['B'];
        dctTable['C'] = item['C'];
        dctTable['Total_Incentive'] = item['Total_Incentive']
        dctTable['Total_Point'] = item['Total_Point']

        i = i + 1
        lstSortData.push(dctTable);

      }
      dctTable = {}
      dctTable['Serial_No'] = '';
      dctTable['Area'] = '';
      dctTable['Branch'] = '';
      dctTable['A'] = '';
      dctTable['B'] = '';
      dctTable['C'] = '';
      dctTable['Total_Incentive'] = '';
      dctTable['Total_Point'] = '';
      lstSortData.push(dctTable);

      if (expJsondata['charthead'] == 'Audit Incentive Report') {
        dctTotal = {}
        dctTotal['Serial_No'] = "Incentive:";
        dctTotal['Area'] = total['dblAvgIncentive'];
        dctTotal['Branch'] = '';
        dctTotal['A'] = ""
        dctTotal['B'] = '';
        dctTotal['C'] = 'Average Point:' + total['dblAvgPoints']
        dctTotal['Total_Incentive'] = ''
        dctTotal['Total_Point'] = "Total Point : " + total['intTotalPoint']

      }
      else {
        dctTotal = {}
        dctTotal['Serial_No'] = "Avg Incentive:";
        dctTotal['Area'] = total['dblAvgIncentive'];
        dctTotal['Branch'] = '';
        dctTotal['A'] = "Incentive: " + total['dblTotalIncentive']
        dctTotal['B'] = '';
        dctTotal['C'] = 'Average Point:' + total['dblAvgPoints']
        dctTotal['Total_Incentive'] = ''
        dctTotal['Total_Point'] = "Total Point : " + total['intTotalPoint']
      }




      lstSortData.push(dctTotal);
      this.excelService.exportAsIncentives(lstSortData, expJsondata);

    }
    // area
    else if (expJsondata['areain'] == 'State') {

      for (let item of dctTempData) {
        dctTotal = {}
        // dctTotal['Serial_No']=i;
        dctTotal['State'] = item.strState;
        // dctTable['Branch']=  item['Branch']
        dctTotal['A'] = item.A;
        dctTotal['B'] = item.B;
        dctTotal['C'] = item.C;
        dctTotal['Total_Incentive'] = item.dblIncentive;
        dctTotal['Total_Point'] = item.intTotalPoint;

        lstData.push(dctTotal);
      }

      lstData = this.sortdata(lstData, expJsondata);

      for (let item of lstData) {
        dctTable = {}
        dctTable['Serial_No'] = i;
        dctTable['State'] = item['State']
        dctTable['A'] = item['A'];
        dctTable['B'] = item['B'];
        dctTable['C'] = item['C'];
        dctTable['Total_Incentive'] = item['Total_Incentive']
        dctTable['Total_Point'] = item['Total_Point']

        i = i + 1
        lstSortData.push(dctTable);

      }
      dctTable = {}
      dctTable['Serial_No'] = '';
      dctTable['State'] = '';
      dctTable['A'] = '';
      dctTable['B'] = '';
      dctTable['C'] = '';
      dctTable['Total_Incentive'] = '';
      dctTable['Total_Point'] = '';
      lstSortData.push(dctTable);
      if (expJsondata['charthead'] == 'Audit Incentive Report') {
        dctTotal = {}
        dctTotal['Serial_No'] = "Incentive:"
        dctTotal['State'] = total['dblAvgIncentive'];
        dctTotal['A'] = ''
        dctTotal['B'] = '';
        dctTotal['C'] = 'Average Point:' + total['dblAvgPoints']
        dctTotal['Total_Incentive'] = ''
        dctTotal['Total_Point'] = "Total Point : " + total['intTotalPoint']

      }
      else {
        dctTotal = {}
        dctTotal['Serial_No'] = "Avg Incentive:"
        dctTotal['State'] = total['dblAvgIncentive'];
        dctTotal['A'] = "Incentive : " + total['dblTotalIncentive']
        dctTotal['B'] = '';
        dctTotal['C'] = 'Average Point:' + total['dblAvgPoints']
        dctTotal['Total_Incentive'] = ''
        dctTotal['Total_Point'] = "Total Point : " + total['intTotalPoint']
      }




      lstSortData.push(dctTotal);


      this.excelService.exportAsIncentives(lstSortData, expJsondata);

    }
    else if (expJsondata['areain'] == 'StateandArea') {
      for (let item of dctTempData) {
        dctTotal = {}
        // dctTotal['Serial_No']=i;
        dctTotal['State'] = item.strState;
        dctTotal['Area'] = item.strArea;
        dctTotal['A'] = item.A;
        dctTotal['B'] = item.B;
        dctTotal['C'] = item.C;
        dctTotal['Total_Incentive'] = item.dblIncentive;
        dctTotal['Total_Point'] = item.intTotalPoint;

        lstData.push(dctTotal);
      }

      lstData = this.sortdata(lstData, expJsondata);

      for (let item of lstData) {
        dctTable = {}
        dctTable['Serial_No'] = i;
        dctTable['State'] = item['State'];
        dctTable['Area'] = item['Area'];
        dctTable['A'] = item['A'];
        dctTable['B'] = item['B'];
        dctTable['C'] = item['C'];
        dctTable['Total_Incentive'] = item['Total_Incentive']
        dctTable['Total_Point'] = item['Total_Point']

        i = i + 1
        lstSortData.push(dctTable);

      }
      dctTable = {}
      dctTable['Serial_No'] = '';
      dctTable['State'] = '';
      dctTable['Area'] = '';
      dctTable['A'] = '';
      dctTable['B'] = '';
      dctTable['C'] = '';
      dctTable['Total_Incentive'] = '';
      dctTable['Total_Point'] = '';
      lstSortData.push(dctTable);

      if (expJsondata['charthead'] == 'Audit Incentive Report') {
        dctTotal = {}
        dctTotal['Serial_No'] = "Incentive:";
        dctTotal['State'] = total['dblAvgIncentive'];
        dctTotal['Area'] = '';
        dctTotal['A'] = ""
        dctTotal['B'] = '';
        dctTotal['C'] = 'Average Point:' + total['dblAvgPoints']
        dctTotal['Total_Incentive'] = ''
        dctTotal['Total_Point'] = "Total Point : " + total['intTotalPoint']

      }
      else {
        dctTotal = {}
        dctTotal['Serial_No'] = "Avg Incentive:";
        dctTotal['State'] = total['dblAvgIncentive'];
        dctTotal['Area'] = '';
        dctTotal['A'] = "Incentive: " + total['dblTotalIncentive']
        dctTotal['B'] = '';
        dctTotal['C'] = 'Average Point:' + total['dblAvgPoints']
        dctTotal['Total_Incentive'] = ''
        dctTotal['Total_Point'] = "Total Point : " + total['intTotalPoint']
      }




      lstSortData.push(dctTotal);
      this.excelService.exportAsIncentives(lstSortData, expJsondata);

    }



  }

  // auditing day report

  valueIterationAudit(dctTempData,expJsondata,total){
    

    let dctTable={};
    let dctTotal={};
    let lstData=[];
    let totalData=[];

    for(let item in dctTempData){
      dctTotal={}
      dctTotal['Date']= dctTempData[item]['date'];
      dctTotal['Audit']= item;
      dctTotal['Auditor']= dctTempData[item]['auditor'];
      dctTotal['Branch']= dctTempData[item]['branch'];
      if(dctTempData[item]['A']){
        dctTotal['A']= dctTempData[item]['A']['point'];
      }
      else{
        dctTotal['A']= 0;
      }
      if('B' in dctTempData[item]){
        dctTotal['B']= dctTempData[item]['B']['point'];
      }
      else{
        dctTotal['B']= 0;
      }
      if('C' in dctTempData[item]){
        dctTotal['C']= dctTempData[item]['C']['point'];
      }
      else{
        dctTotal['C']= 0;
      }
      // dctTotal['B']= dctTempData[item]['B']['point'];
      // dctTotal['C']= dctTempData[item]['C']['point'];
      dctTotal['Total']= dctTempData[item]['total'];
      lstData.push(dctTotal);
      
    }

    dctTotal={}
    dctTotal['Date']=''
    dctTotal['Audit']=''
    dctTotal['Auditor']=''
    dctTotal['Branch']=''
    dctTotal['A']= ''
    dctTotal['B']=''
    dctTotal['C']= ''
    dctTotal['Total']=''
    lstData.push(dctTotal); 
    
    dctTotal={}
    dctTotal['Date']="Average : ("+total['total']+"/"+ total['normal_count'] +")="+total['avarege']
    dctTotal['Audit']=''
    dctTotal['Auditor']="Quick Audit : "+total['quick_count']
    dctTotal['Branch']=''
    dctTotal['A']= "Normal Audit : "+ total['normal_count']
    dctTotal['B']=''
    dctTotal['C']= "Total Point : "+total['total']
    dctTotal['Total']=''

    lstData.push(dctTotal); 
    this.excelService.exportAsAuditDayReport(lstData,expJsondata,total);


  }
  valueIterationBranchAudit(lstData,expJsondata){
    
    let dctTable={};
    let lstXlsxData=[];
    for(let item in lstData){
      dctTable={}
      dctTable['Branch']=lstData[item].Branch;
      dctTable['Total Audits']=lstData[item].total;
      dctTable['Closed Audits']=lstData[item].closed;
      dctTable['Pending Audits']=lstData[item].opend;
      lstXlsxData.push(dctTable)
      


    }
    this.excelService.exportAsBranchAudit(lstXlsxData,expJsondata);

    

  }


  valueIterationEnqRpt(dctTempData,dctReportData,expJsondata){
   
    
        let dctTable={};
        let dctTotal={};
        let lstData=[];
        let totalData=[];
        // this.grandTotal=0;
        // this.saleQtyTot=0;
        this.enqQtyTot=0;
        this.enqValTot=0;
    
        for(var key1 in dctTempData){
          for(var key2 in dctTempData[key1]){
            
            // this.grandTotal+=dctTempData[key1][key2]['SaleValue'];
            // this.saleQtyTot+=dctTempData[key1][key2]['SaleQty'];
            this.enqQtyTot+=dctTempData[key1][key2]['EnquiryQty'];
            this.enqValTot+=dctTempData[key1][key2]['EnquiryValue'];
            
            
           
          }
          }
          dctTotal['Name']='TOTAL'
          dctTotal['EnquiryQty']=this.enqQtyTot;
          dctTotal['EnquiryValue']=this.enqValTot;
          dctTotal['ContribQty_per']="";
          dctTotal['Contrib_per']="";
    
          let salesValue,saleQty;
          let enquiryValue,enqQty;
    
          for(var key1 in dctTempData){
            for(var key2 in dctTempData[key1]){ 
              if(expJsondata['charthead']=='Staff'){
                dctTable['Name']=dctReportData.staffs[key2];
              } 
              else{
                dctTable['Name']=key2; 
              }
               
              dctTable['EnquiryQty']=dctTempData[key1][key2]['EnquiryQty'];          
              // dctTable['SaleQty']=dctTempData[key1][key2]['SaleQty'];
              enqQty=dctTable['EnquiryQty'];
              if(enqQty==0){
                dctTable['ContribQty_per']=0;
              }
              else{
              dctTable['ContribQty_per']=((enqQty/this.enqQtyTot)*100).toFixed(2);
              }
              dctTable['EnquiryValue']=dctTempData[key1][key2]['EnquiryValue'];
              // dctTable['SaleValue']=dctTempData[key1][key2]['SaleValue'];
              // salesValue=dctTempData[key1][key2]['SaleValue'];
              enquiryValue=dctTempData[key1][key2]['EnquiryValue'];  
          
    
              if(enquiryValue==0){
                dctTable['Contrib_per']=0;
              }
              else{
              dctTable['Contrib_per']=((enquiryValue/this.enqValTot)*100).toFixed(2);
              }
             
               lstData.push(dctTable);
               dctTable={};
            }
           
          }
          lstData=this.sortdata(lstData,expJsondata);
          lstData.push(dctTotal); 

          
          this.excelService.exportAsEnquiryExport(lstData,expJsondata);
      }
    



    valueIterationEnqOnly(dctTempData,dctReportData,expJsondata){
       
    let dctTable={};
    let dctTotal={};
    let lstData=[];
    let totalData=[];
    this.grandTotal=0;
    this.saleQtyTot=0;
    this.enqQtyTot=0;
    this.enqValTot=0;
  
    for(var data in dctTempData){
      for(var key in dctTempData[data]){

        this.enqQtyTot+=dctTempData[data][key];
        
      }
      }
      dctTotal['Name']='TOTAL'
      dctTotal['EnquiryQty']=this.enqQtyTot;
      dctTotal['ContribQty_per']='';
  
      let salesValue,saleQty;
      let enquiryValue,enqQty;
  
      for(var data in dctTempData){
        for(var key in dctTempData[data]){ 
          // if(this.chartHead=='Staff'){
          //   dctTable['Name']=this.dctReportData.staffs[key2];
          // } 
          // else{
            dctTable['Name']=key; 
          // }
           
          dctTable['EnquiryQty']=dctTempData[data][key];          

          enqQty=dctTable['EnquiryQty'];

          if(enqQty==0){
            dctTable['ContribQty_per']=0;
          }
          else{
          dctTable['ContribQty_per']=((enqQty/this.enqQtyTot)*100).toFixed(2);
          }
  
          
          
           lstData.push(dctTable);
           dctTable={};
        }
       
       
      }
      this.lstdatatoexcel=this.sortdata(lstData,expJsondata);
      this.lstdatatoexcel.push(dctTotal)
      this.excelService.exportAsEnqOnlyExport(this.lstdatatoexcel,expJsondata);
    }
    valueIterationEnqAndSale(dctTempData,dctReportData,expJsondata){

    let dctTable={};
    let dctTotal={};
    let lstData=[];
    this.grandTotal=0;
    this.saleQtyTot=0;
    this.enqQtyTot=0;
    this.enqValTot=0;
  
    for(var data in dctTempData){
      for(var key in dctTempData[data]){
        
        // this.grandTotal+=dctTempData[key1][key2]['EnquiryValue'];
        this.saleQtyTot+=dctTempData[data][key]['Sale'];
        this.enqQtyTot+=dctTempData[data][key]['Enquiry'];
        // this.enqValTot+=dctTempData[key1][key2]['EnquiryValue'];  
        // console.log(dctTempData[data]['Sale'],"dctTempData[data]['Sale'];")       
      }
      }
      dctTotal['Name']='TOTAL'
      dctTotal['EnquiryQty']=this.enqQtyTot;
      dctTotal['SaleQty']=this.saleQtyTot;
      dctTotal['ContribQty_per']='';
  
      let salesValue,saleQty;
      let enquiryValue,enqQty;
  
      for(var data in dctTempData){
        for(var key in dctTempData[data]){ 
          // if(this.chartHead=='Staff'){
          //   dctTable['Name']=this.dctReportData.staffs[key2];
          // } 
          // else{
            dctTable['Name']=key; 
          // }
           
          dctTable['EnquiryQty']=dctTempData[data][key]['Enquiry'];          
          dctTable['SaleQty']=dctTempData[data][key]['Sale'];
          saleQty=dctTable['SaleQty'];
          enqQty=dctTable['EnquiryQty'];
  
          if(enqQty==0){
            dctTable['ContribQty_per']=0;
          }
          else{
          dctTable['ContribQty_per']=((enqQty/this.enqQtyTot)*100).toFixed(2);
          }
  
          
          
           lstData.push(dctTable);
           dctTable={};
        }
       
       
      }
      this.lstdatatoexcel=this.sortdata(lstData,expJsondata);
      this.lstdatatoexcel.push(dctTotal)
      this.excelService.exportAsEnaAndSaleExport(this.lstdatatoexcel,expJsondata);
    }
    
    valueIterationSaleEnq(dctTempData,dctReportData,expJsondata) {

    let dctTable={};
    let dctTotal={};
    let lstData=[];
    let totalData=[];
    this.grandTotal=0;
    this.saleQtyTot=0;
    this.enqQtyTot=0;
    this.enqValTot=0;
  
    for(var data in dctTempData){
      for(var key in dctTempData[data]){
        
        // this.grandTotal+=dctTempData[key1][key2]['EnquiryValue'];
        this.saleQtyTot+=dctTempData[data][key]['Sale'];
        // this.enqQtyTot+=dctTempData[data];
        this.enqQtyTot+=dctTempData[data][key]['Enquiry'];
        // this.enqValTot+=dctTempData[key1][key2]['EnquiryValue'];
        // console.log(dctTempData[data],dctTempData[data][key],"elements");
        
       
      }
      }
      dctTotal['EnquiryQty']=this.enqQtyTot;
      dctTotal['Name']='TOTAL';
      dctTotal['ContribQty_per']='';
      dctTotal['SaleQty']=this.saleQtyTot;
  
      let salesValue,saleQty;
      let enquiryValue,enqQty;
  
      for(var data in dctTempData){
        for(var key in dctTempData[data]){ 
          // if(this.chartHead=='Staff'){
          //   dctTable['Name']=this.dctReportData.staffs[key2];
          // } 
          // else{
            dctTable['Name']=key; 
          // }
           
          dctTable['EnquiryQty']=dctTempData[data][key]['Enquiry'];
          dctTable['SaleQty']=dctTempData[data][key]['Sale'];
          enqQty=dctTable['EnquiryQty'];
          saleQty=dctTable['SaleQty'];

          if(enqQty==0){
            dctTable['ContribQty_per']=0;
          }
          else{
          dctTable['ContribQty_per']=((enqQty/this.enqQtyTot)*100).toFixed(2);
          }
  
          
          
           lstData.push(dctTable);
           dctTable={};
        }
       
       
      }
      this.lstdatatoexcel=this.sortdata(lstData,expJsondata);
      this.lstdatatoexcel.push(dctTotal)
      this.excelService.exportAsEnqOnlyExport(this.lstdatatoexcel,expJsondata);
    }
    valueIterationSaleEnqF(dctTempData,dctReportData,expJsondata) {

      let dctTable={};
      let dctTotal={};
      let lstData=[];
      let totalData=[];
      this.grandTotal=0;
      this.saleQtyTot=0;
      this.enqQtyTot=0;
      this.enqValTot=0;
    
      for(var data in dctTempData){
        for(var key in dctTempData[data]){
          
          // this.grandTotal+=dctTempData[key1][key2]['EnquiryValue'];
          this.saleQtyTot+=dctTempData[data][key]['Sale'];
          // this.enqQtyTot+=dctTempData[data];
          this.enqQtyTot+=dctTempData[data][key]['Enquiry'];
          // this.enqValTot+=dctTempData[key1][key2]['EnquiryValue'];
          // console.log(dctTempData[data],dctTempData[data][key],"elements");
          
         
        }
        }
        dctTotal['EnquiryQty']=this.enqQtyTot;
        dctTotal['Name']='TOTAL';
        dctTotal['ContribQty_per']='';
        dctTotal['SaleQty']=this.saleQtyTot;
    
        let salesValue,saleQty;
        let enquiryValue,enqQty;
    
        for(var data in dctTempData){
          for(var key in dctTempData[data]){ 
            // if(this.chartHead=='Staff'){
            //   dctTable['Name']=this.dctReportData.staffs[key2];
            // } 
            // else{
              dctTable['Name']=key; 
            // }
             
            dctTable['EnquiryQty']=dctTempData[data][key]['Enquiry'];
            dctTable['SaleQty']=dctTempData[data][key]['Sale'];
            enqQty=dctTable['EnquiryQty'];
            saleQty=dctTable['SaleQty'];
  
            if(enqQty==0){
              dctTable['ContribQty_per']=0;
            }
            else{
            dctTable['ContribQty_per']=((enqQty/this.enqQtyTot)*100).toFixed(2);
            }
    
            
            
             lstData.push(dctTable);
             dctTable={};
          }
         
         
        }
        this.lstdatatoexcel=this.sortdata(lstData,expJsondata);
        this.lstdatatoexcel.push(dctTotal)
        this.excelService.exportAsEnaAndSaleExport(this.lstdatatoexcel,expJsondata);
      }

    valueIterationGeneralised(dctTempData,dctReportData,expJsondata){
    
      let headKey=expJsondata['switch_change']; // Heading either quantity or value or profit
     
      // console.log(dctTempData,"dctTempdata");
      // console.log(expJsondata['type'],"type at report");
      // console.log(expJsondata,"expjsondata")
      let dctTable={};
      let dctTotal={};
      let lstData=[];
      let totalData=[];
      this.grandTotal=0;
      this.saleQtyTot=0;
      this.enqQtyTot=0;
      this.enqValTot=0;
      if (expJsondata['type'] == 'grouped_bar') {
        for(var key1 in dctTempData){
          for(var key2 in dctTempData[key1]){  
            this.grandTotal+=dctTempData[key1][key2]['Value2'];
            this.saleQtyTot+=dctTempData[key1][key2]['Value2'];
            this.enqQtyTot+=dctTempData[key1][key2]['Value1'];
            this.enqValTot+=dctTempData[key1][key2]['Value1'];  
          }
        }
        if(expJsondata['strHead']=='Discount'){
          dctTotal['Discount']=this.enqQtyTot;
        }
        else{
          dctTotal['Enquiry']=this.enqQtyTot;
        }
        dctTotal['Sale']=this.saleQtyTot;
        dctTotal['Name']='TOTAL';
        dctTotal['Contrib_per']='';
        dctTotal['Conversion_per']='';
        // dctTotal['saleValTot']=this.grandTotal;
        // dctTotal['enqValTot']=this.enqValTot;
        let salesValue,saleQty;
        let enquiryValue,enqQty;
        for(var key1 in dctTempData){
          for(var key2 in dctTempData[key1]){ 
            if(expJsondata['charthead']=='Staff'){
              dctTable['Name']=dctReportData.staffs[key2];
            }else{
              dctTable['Name']=key2; 
            }
            if(expJsondata['strHead']=='Discount'){
              dctTable['Discount']=dctTempData[key1][key2]['Value1']
            }
            else{
              dctTable['Enquiry']=dctTempData[key1][key2]['Value1'];
            }
            dctTable['Sale']=dctTempData[key1][key2]['Value2'];
            // dctTable['Enquiry']=dctTempData[key1][key2]['Value1'];
            // dctTable['SaleValue']=dctTempData[key1][key2]['Value2'];
            salesValue=dctTempData[key1][key2]['Value2'];
            enquiryValue=dctTempData[key1][key2]['Value1'];  
            saleQty=dctTable['Sale'];
            enqQty=dctTable['Enquiry'];
            if(this.grandTotal==0){
              dctTable['Contrib_per']=0;
            } else{
              dctTable['Contrib_per']=((salesValue/this.grandTotal)*100).toFixed(2);
            }
            if(enquiryValue==0){
              dctTable['Conversion_per']=0;
            } else{
              dctTable['Conversion_per']=((salesValue/enquiryValue)*100).toFixed(2);
            }
            // if(this.saleQtyTot==0){
            //   dctTable['ContribQty_per']=0;
            // } else{
            //   dctTable['ContribQty_per']=((saleQty/this.saleQtyTot)*100).toFixed(2);
            // }     
            lstData.push(dctTable);
            dctTable={};
            }
            // this.dataSource1= new MatTableDataSource(lstData);
            // this.PaginationSort(this.dataSource1);
          }
          this.lstdatatoexcel=this.sortdata(lstData,expJsondata);
          this.lstdatatoexcel.push(dctTotal);

        } else if (expJsondata['type'] == 'bar') {
          for(var key1 in dctTempData){
            for(var key2 in dctTempData[key1]){
              this.grandTotal+=dctTempData[key1][key2]['Value1'];
              this.enqQtyTot+=dctTempData[key1][key2]['Value1'];
              this.enqValTot+=dctTempData[key1][key2]['Value1'];  
            }
          }
          if(headKey=='Qty'){
            dctTotal['Qty']=this.enqQtyTot;
          }
          else if(headKey=='Value'){
            dctTotal['Value']=this.enqQtyTot;
          }
          else if(headKey=='Profit') {
            dctTotal['Profit']=this.enqQtyTot;
          }
          dctTotal['Name']='TOTAL';

          // dctTotal['enqValTot']=this.enqValTot;
          let enquiryValue,enqQty;
          for(var key1 in dctTempData){
            for(var key2 in dctTempData[key1]){ 
              if(expJsondata['charthead']=='Staff'){
                dctTable['Name']=dctReportData.staffs[key2];
              }else{
                dctTable['Name']=key2; 
              }
              if(headKey=='Qty'){
                dctTable['Qty']=dctTempData[key1][key2]['Value1'];
              }
              else if(headKey=='Value'){
                dctTable['Value']=dctTempData[key1][key2]['Value1'];
              }
              else if(headKey == 'Profit') {
                dctTable['Profit']=dctTempData[key1][key2]['Value1'];
              }
              enquiryValue=dctTempData[key1][key2]['Value1'];
              enqQty=dctTable['Enquiry'];
              if(this.grandTotal==0){
                dctTable['Contrib_per']=0;
              } else{
                dctTable['Contrib_per']=((enquiryValue/this.grandTotal)*100).toFixed(2);
              }    
              lstData.push(dctTable);
              dctTable={};
              }
              // this.dataSource2= new MatTableDataSource(lstData);
              // this.PaginationSort(this.dataSource2);
            }
            this.lstdatatoexcel=this.sortdata(lstData,expJsondata);
            this.lstdatatoexcel.push(dctTotal);
            this.excelService.exportAsEnqOnlyExport(this.lstdatatoexcel,expJsondata);
            return
          } else if (expJsondata['type'] == 'pie') {

          for(var key1 in dctTempData){
              this.grandTotal+=dctTempData[key1]['Value1'];             
              this.enqQtyTot+=dctTempData[key1]['Value1'];
              this.enqValTot+=dctTempData[key1]['Value1'];  
          }
          if(headKey=='Qty'){
          dctTotal['Qty']=this.enqQtyTot;
          }
          else if(headKey=='Value'){
            dctTotal['Value']=this.enqQtyTot;

          }
          dctTotal['Name']='TOTAL';
          dctTotal['Contrib_per']='';
          // dctTotal['enqValTot']=this.enqValTot;     
          let enquiryValue,enqQty;    
          for(var key1 in dctTempData){
            for(var key2 in dctTempData[key1]){
              if(expJsondata['charthead']=='Staff'){
                dctTable['Name']=dctReportData.staffs[key2];
              }else{
                dctTable['Name']=key1; 
              }       
              // dctTable['Enquiry']=dctTempData[key1]['Value1'];
              if(headKey=='Qty'){
                dctTable['Qty']=dctTempData[key1]['Value1'];  
              }
              else if(headKey=='Value'){
                dctTable['Value']=dctTempData[key1]['Value1'];  
              }

              enquiryValue=dctTempData[key1]['Value1'];  
              // enqQty=dctTable['Enquiry'];
              if(this.grandTotal==0){
                dctTable['Contrib_per']=0;
              } else{
                dctTable['Contrib_per']=((enquiryValue/this.grandTotal)*100).toFixed(2);
              }  
            }
            
            lstData.push(dctTable);
            dctTable={};
            }
            this.lstdatatoexcel=this.sortdata(lstData,expJsondata);
            this.lstdatatoexcel.push(dctTotal);
            this.excelService.exportAsEnqOnlyExport(this.lstdatatoexcel,expJsondata);
            return

          }
          
        this.excelService.exportAsEnquiryExport(this.lstdatatoexcel,expJsondata)
    }


      sortdata(lstdatatoexcel,expJsondata){
                    // dynamic sorting
                    let sortchange=expJsondata['sortname'];
                    if(sortchange=="EnquiryQty" && expJsondata['component']=='Generelised'){
                      if(expJsondata['sortdirection']=="asc"){
                        lstdatatoexcel = lstdatatoexcel.sort((a,b)=> {return a.Enquiry < b.Enquiry ? -1 : 1;});
                      }
                      else{

                        // if (reverse) {

                        //   data_dict.sort((n1, n2) => {return n1[1]["Enquiry"] < n2[1]["Enquiry"] ? -1 : 1;});

                        // } else {
                        //   data_dict.sort(
                        //     (n1, n2) => {
                        //       return n1[1]["Enquiry"] > n2[1]["Enquiry"] ? -1 : 1;
                        //     }
                        //   );
                        // }


                        // console.log("lstdatatoexcel",lstdatatoexcel);
                        
                        lstdatatoexcel = lstdatatoexcel.sort( (a,b) => { return a.Enquiry > b.Enquiry ? 1 : -1; });
                        // console.log("#####",lstdatatoexcel);
  
                      }
                      
                      // this.expJsondata['sortedby']='EnquiryQty';
                    } 
                    if(sortchange=='EnquiryQty' && expJsondata['component']!='Generelised'){
                      if(expJsondata['sortdirection']=="asc"){
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.EnquiryQty-b.EnquiryQty})
                      }
                      else{
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.EnquiryQty-a.EnquiryQty});
                      }
                      
                      // this.expJsondata['sortedby']='EnquiryQty';
                    }

                    else if(sortchange=='SaleQty' && expJsondata['component']=='Generelised'){
                      if(expJsondata['sortdirection']=="asc"){
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Sale-b.Sale});
                      }
                      else{
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Sale-a.Sale});
                      }
                      // this.expJsondata['sortedby']='SaleQty';
                    }
                    else if(sortchange=='SaleQty' && expJsondata['component']!='Generelised'){
                      if(expJsondata['sortdirection']=="asc"){
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.SaleQty-b.SaleQty});
                      }
                      else{
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.SaleQty-a.SaleQty});
                      }
                      // this.expJsondata['sortedby']='SaleQty';
                    }
                    else if(sortchange=='ContribQty_per' && expJsondata['component']=='Generelised'){
                      if(expJsondata['sortdirection']=="asc"){
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Contrib_per-b.Contrib_per});
                      }
                      else{
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Contrib_per-a.Contrib_per});
                      }
                      // this.expJsondata['sortedby']='ContribQty_per';
                    }
                    else if(sortchange=='ContribQty_per' && expJsondata['component']!='Generelised'){
                      if(expJsondata['sortdirection']=="asc"){
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.ContribQty_per-b.ContribQty_per});
                      }
                      else{
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.ContribQty_per-a.ContribQty_per});
                      }
                      // this.expJsondata['sortedby']='ContribQty_per';
                    }
                    else if(sortchange=='EnquiryValue'){
                      if(expJsondata['sortdirection']=="asc"){
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.EnquiryValue-b.EnquiryValue});
                      }
                      else
                      {
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.EnquiryValue-a.EnquiryValue});
                      }
                      // this.expJsondata['sortedby']='EnquiryValue';
                    }
                    else if(sortchange=='Contrib_per'){
                      if(expJsondata['sortdirection']=="asc"){
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Contrib_per-b.Contrib_per});
                      }
                      else {
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Contrib_per-a.Contrib_per});
                      }
        
                    }
                    else if(sortchange=='Conversion_per' && expJsondata['component']=='Generelised'){
                      if(expJsondata['sortdirection']=="asc"){
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Conversion_per-b.Conversion_per});
                      }
                      else {
                        // this.lstdatatoexcel = this.lstdatatoexcel.sort(function(a,b){return b.Conversion_per-a.Conversion_per});
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Conversion_per-a.Conversion_per});                      }
                      // this.expJsondata['sortedby']='Conversion_per';
                    }
                    else if(sortchange=='Conversion_per' && expJsondata['component']!='Generelised'){
                      if(expJsondata['sortdirection']=="asc"){
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Conversion_per-b.Conversion_per});
                      }
                      else {
                        // this.lstdatatoexcel = this.lstdatatoexcel.sort(function(a,b){return b.Conversion_per-a.Conversion_per});
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Conversion_per-a.Conversion_per});                      }
                      // this.expJsondata['sortedby']='Conversion_per';
                    }
                    else if(sortchange=='ContribValue_per'){
                      if(expJsondata['sortdirection']=="asc"){
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.ContribValue_per-b.ContribValue_per});
                      }
                      else {
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.ContribValue_per-a.ContribValue_per});
                      }

                    }
                    else if(sortchange=='Name'){
                      if(expJsondata['sortdirection']=="asc"){
                        // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
                        lstdatatoexcel.sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);
                      }
                      else {
                        // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Name-a.Name});
                        lstdatatoexcel.sort((a, b) => a.Name > b.Name ? -1 : a.Name < b.Name ? 1 : 0);
                      }
                    }
//status change report
                    else if(sortchange=="fk_master__vchr_audit_num"){
                      if(expJsondata['sortdirection']=="asc"){
                        // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
                        lstdatatoexcel.sort((a, b) => a.Audit_No < b.Audit_No ? -1 : a.Audit_No > b.Audit_No ? 1 : 0);
                      }
                      else {
                        // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Audit_No-a.Audit_No});
                        lstdatatoexcel.sort((a, b) => a.Audit_No > b.Audit_No ? -1 : a.Audit_No < b.Audit_No ? 1 : 0);
                      }
                    }

                    else if(sortchange=='fk_master__fk_created__first_name'){
                      if(expJsondata['sortdirection']=="asc"){
                        // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
                        lstdatatoexcel.sort((a, b) => a.Auditor < b.Auditor ? -1 : a.Auditor > b.Auditor ? 1 : 0);
                      }
                      else {
                        // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Auditor-a.Auditor});
                        lstdatatoexcel.sort((a, b) => a.Auditor > b.Auditor ? -1 : a.Auditor < b.Auditor ? 1 : 0);
                      }
                    }

                    else if(sortchange=='fk_master__fk_branch__vchr_name'){
                      if(expJsondata['sortdirection']=="asc"){
                        // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
                        lstdatatoexcel.sort((a, b) => a.Branch < b.Branch ? -1 : a.Branch > b.Branch ? 1 : 0);
                      }
                      else {
                        // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Branch-a.Branch});
                        lstdatatoexcel.sort((a, b) => a.Branch > b.Branch ? -1 : a.Branch < b.Branch ? 1 : 0);
                      }
                    }
                    else if(sortchange=='fk_question__vchr_question'){
                      if(expJsondata['sortdirection']=="asc"){
                        // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
                        lstdatatoexcel.sort((a, b) => a.Question < b.Question ? -1 : a.Question > b.Question ? 1 : 0);
                      }
                      else {
                        // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Question-a.Question});
                        lstdatatoexcel.sort((a, b) => a.Question > b.Question ? -1 : a.Question < b.Question ? 1 : 0);
                      }
                    }
                    else if(sortchange=='initial'){
                      if(expJsondata['sortdirection']=="asc"){
                        // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
                        lstdatatoexcel.sort((a, b) => a.Initial_Grade < b.Initial_Grade ? -1 : a.Initial_Grade > b.Initial_Grade ? 1 : 0);
                      }
                      else {
                        // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Initial_Grade-a.Initial_Grade});
                        lstdatatoexcel.sort((a, b) => a.Initial_Grade > b.Initial_Grade ? -1 : a.Initial_Grade < b.Initial_Grade ? 1 : 0);
                      }
                    }
                    else if(sortchange=='current'){
                      if(expJsondata['sortdirection']=="asc"){
                        // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
                        lstdatatoexcel.sort((a, b) => a.Current_Grade < b.Current_Grade ? -1 : a.Current_Grade > b.Current_Grade ? 1 : 0);
                      }
                      else {
                        // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Current_Grade-a.Current_Grade});
                        lstdatatoexcel.sort((a, b) => a.Current_Grade > b.Current_Grade ? -1 : a.Current_Grade < b.Current_Grade ? 1 : 0);
                      }
                    }



  // ......................................... 
  //exchange report
  else if(sortchange=="dat_created"){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.Date < b.Date ? -1 : a.Date > b.Date ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Question-a.Question});
      lstdatatoexcel.sort((a, b) => a.Date > b.Date ? -1 : a.Date < b.Date ? 1 : 0);
    }
  }
  else if(sortchange=="enquiry_num"){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.Enquiry_No < b.Enquiry_No ? -1 : a.Enquiry_No > b.Enquiry_No ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Enquiry_No-a.Enquiry_No});
      lstdatatoexcel.sort((a, b) => a.Enquiry_No > b.Enquiry_No ? -1 : a.Enquiry_No < b.Enquiry_No ? 1 : 0);
    }
  }
  else if(sortchange=='branch_name'){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.Branch < b.Branch ? -1 : a.Branch > b.Branch ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Branch-a.Branch});
      lstdatatoexcel.sort((a, b) => a.Branch > b.Branch ? -1 : a.Branch < b.Branch ? 1 : 0);
    }
  }
  else if(sortchange=='brand_name'){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.Brand < b.Brand ? -1 : a.Brand > b.Brand ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Brand-a.Brand});
      lstdatatoexcel.sort((a, b) => a.Brand > b.Brand ? -1 : a.Brand < b.Brand ? 1 : 0);
    }
  }
  else if(sortchange=='item_name'){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.Item_Name < b.Item_Name ? -1 : a.Item_Name > b.Item_Name ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Item_Name-a.Item_Name});
      lstdatatoexcel.sort((a, b) => a.Item_Name > b.Item_Name ? -1 : a.Item_Name < b.Item_Name ? 1 : 0);
    }
  }
  else if(sortchange=='imei'){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.Imei_no < b.Imei_no ? -1 : a.Imei_no > b.Imei_no ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Imei_no-a.Imei_no});
      lstdatatoexcel.sort((a, b) => a.Imei_no > b.Imei_no ? -1 : a.Imei_no < b.Imei_no ? 1 : 0);
    }
  }
  else if(sortchange=='amount'){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.Amount < b.Amount ? -1 : a.Amount > b.Amount ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Amount-a.Amount});
      lstdatatoexcel.sort((a, b) => a.Amount > b.Amount ? -1 : a.Amount < b.Amount ? 1 : 0);
    }
  }
  // ......................................... 

  //audir reports
  else if(sortchange=="vchr_audit_num"){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.Audit_No < b.Audit_No ? -1 : a.Audit_No > b.Audit_No ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Audit_No-a.Audit_No});
      lstdatatoexcel.sort((a, b) => a.Audit_No > b.Audit_No ? -1 : a.Audit_No < b.Audit_No ? 1 : 0);
    }
  }

  else if(sortchange=="vchr_auditor_name"){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.Auditor < b.Auditor ? -1 : a.Auditor > b.Auditor ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Auditor-a.Auditor});
      lstdatatoexcel.sort((a, b) => a.Auditor > b.Auditor ? -1 : a.Auditor < b.Auditor ? 1 : 0);
    }
  }

  else if(sortchange=="vchr_branch_name"){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.Branch < b.Branch ? -1 : a.Branch > b.Branch ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Branch-a.Branch});
      lstdatatoexcel.sort((a, b) => a.Branch > b.Branch ? -1 : a.Branch < b.Branch ? 1 : 0);
    }
  }
  else if(sortchange=="dat_created_at"){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.Date < b.Date ? -1 : a.Date > b.Date ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Question-a.Question});
      lstdatatoexcel.sort((a, b) => a.Date > b.Date ? -1 : a.Date < b.Date ? 1 : 0);
    }
  }
  else if(sortchange=='vchr_status'){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.Status < b.Status ? -1 : a.Status > b.Status ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Initial_Grade-a.Initial_Grade});
      lstdatatoexcel.sort((a, b) => a.Status > b.Status ? -1 : a.Status < b.Status ? 1 : 0);
    }
  }
  else if(sortchange=='A'){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.A < b.A ? -1 : a.A > b.A ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Current_Grade-a.Current_Grade});
      lstdatatoexcel.sort((a, b) => a.A > b.A ? -1 : a.A < b.A ? 1 : 0);
    }
  }
  else if(sortchange=='B'){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.B < b.B ? -1 : a.B > b.B ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Current_Grade-a.Current_Grade});
      lstdatatoexcel.sort((a, b) => a.B > b.B ? -1 : a.B < b.B ? 1 : 0);
    }
  }
  else if(sortchange=='C'){
    if(expJsondata['sortdirection']=="asc"){
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.Name-b.Name});
      lstdatatoexcel.sort((a, b) => a.C < b.C ? -1 : a.C > b.C ? 1 : 0);
    }
    else {
      // lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return b.Current_Grade-a.Current_Grade});
      lstdatatoexcel.sort((a, b) => a.C > b.C ? -1 : a.C < b.C ? 1 : 0);
    }
  }
  //..........................................

                    else{
                      if(expJsondata['sortdirection']=="asc"){
                        lstdatatoexcel = lstdatatoexcel.sort(function(a,b){return a.SaleValue-b.SaleValue});
                      }
                      else{
                        // this.lstdatatoexcel = this.lstdatatoexcel.sort(function(a,b){return b.SaleValue-a.SaleValue});
                        lstdatatoexcel=lstdatatoexcel.sort((a, b) => b.SaleValue < a.SaleValue ? -1 : 1);
                      }
                      // this.expJsondata['sortedby']='SaleValue';
                    }
                    return lstdatatoexcel;
      }

      //Comparison report
  valueIterationCompReport(dctCompEx){
    // console.log("dctCompEx",dctCompEx);
    let headCol2=dctCompEx.lstComp[0].str_name;
    let headCol3=dctCompEx.lstComp[1].str_name;
    headCol2=headCol2.replace(/\w\S*/g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
    );

    headCol3=headCol3.replace(/\w\S*/g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
    );
// console.log("headCol2",headCol2);
// console.log("headCol3",headCol3);


    let dctTemp={};
    let lstTemp=[];
    let keys=Object.keys(dctCompEx.lstComp[0])
    
    for (let index =0; index < dctCompEx.lstHead.length; index++) {
      for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        
         dctTemp={};

          if(dctCompEx.compType!='Auditor' && (keys[keyIndex]=='normal_audit_count')&&(dctCompEx.lstHead[index]['headKey']=='normal_audit_count')){
                  // console.log("keys[index]",keys[index]);
                  continue;
          }

          else if(dctCompEx.compType=='Auditor' && (keys[keyIndex]=='internal_audit_count')&&(dctCompEx.lstHead[index]['headKey']=='internal_audit_count')){
                  // console.log("keys[index]",keys[index]);
                  continue;
          }
          else if(dctCompEx.compType=='Auditor' && (keys[keyIndex]=='external_audit_count')&&(dctCompEx.lstHead[index]['headKey']=='external_audit_count')){
            // console.log("keys[index]",keys[index]);
    
            continue;
          }
          else if(dctCompEx.compType=='Auditor'&& dctCompEx.compType=='Department' && (keys[keyIndex]=='quick_audit_count')&&(dctCompEx.lstHead[index]['headKey']=='quick_audit_count')){
            // console.log("keys[index]",keys[index]);
            continue;
          }
          else if(dctCompEx.compType!='Auditor' && (keys[keyIndex]=='dept_audit_count')&&(dctCompEx.lstHead[index]['headKey']=='dept_audit_count')){
            // console.log("keys[index]",keys[index]);
            continue;
          }
          else if(dctCompEx.compType=='Auditor' && (keys[keyIndex]=='average_incentives')&&(dctCompEx.lstHead[index]['headKey']=='average_incentives')){
            // console.log("keys[index]",keys[index]);
            continue;
          }
          else if(keys[keyIndex]==dctCompEx.lstHead[index]['headKey']){
      
            // console.log("dctCompEx.lstHead[index]",dctCompEx.lstHead[index]);
            // console.log("dctCompEx.lstComp[0][keys[index]]",dctCompEx.lstComp[0][keys[index]]);
            // console.log("dctCompEx.lstComp[1][keys[index]]",dctCompEx.lstComp[1][keys[index]]);         
            dctTemp['']=dctCompEx.lstHead[index]['head'];
            dctTemp[headCol2]=dctCompEx.lstComp[0][keys[keyIndex]];
            dctTemp[headCol3]=dctCompEx.lstComp[1][keys[keyIndex]];
            // console.log("###dctTemp",dctTemp);            
            lstTemp.push(dctTemp);    
          }
          else{
            continue;
          }
        }     
            
        // else if(keys[index]=='answer_sum_A'||keys[index]=='answer_sum_B'||keys[index]=='answer_sum_C'||keys[index]=='auditor_id'||keys[index]=='average_point'||keys[index]=='average_point_denominator'||keys[index]=='high_priority_code_A'||keys[index]=='high_priority_code_B'||keys[index]=='high_priority_code_C'||keys[index]=='low_priority_code_A'||keys[index]=='low_priority_code_B'||keys[index]=='low_priority_code_C'||keys[index]=='answer_count_B'||keys[index]=='answer_count_C'){
        //   console.log("keys[index]",keys[index]);
          
        //   continue;
        // }
      
        
      }
    // console.log("####",lstTemp);
    this.excelService.exportAsCompReport(lstTemp,dctCompEx);
  }

}
