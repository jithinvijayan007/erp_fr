import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
// import * as XLSX from 'xlsx-style';
import { DatePipe} from "@angular/common";
import { } from 'date-fns/is_this_second'

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({ providedIn: 'root' })
export class ExcelService {

  constructor(public datepipe: DatePipe ) { }



  public exportAsExcelFile(json: any[],expjsondata): void{
    localStorage.setItem('chartexport','');
    // now: number;
    let nowdate=Date.now();
    let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');

    expjsondata['user']=localStorage.getItem("username");
    if(expjsondata['branch']==''){expjsondata['branch']='ALL'}
    if(expjsondata['staff']==''){expjsondata['staff']='ALL'}
    if(expjsondata['customer']==''){expjsondata['customer']='ALL'}
    
    let heading=expjsondata['charthead']+" Wise Report";
    let timeperiod=expjsondata['tmpdfdate']+' to '+expjsondata['tmpdtdate']
    if(expjsondata['component']=='Productivity'){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Branch:",expjsondata['branch'],["Product:"],expjsondata['product'],"","","Taken By:",expjsondata['user']],
        [["Brand:"],expjsondata['brand'],"Staff:",expjsondata['staff'],"","","Reporting Period:",[timeperiod]],
        ["","","","","","","Action Date:",mydate]

      ]);
    }
    else if(expjsondata['component']=='Customer_Report'){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Branch:",expjsondata['branch'],"Product",expjsondata['product'],"","","Taken By:",expjsondata['user']],
        ["Brand:",expjsondata['brand'],"Customer:",expjsondata['customer'],"","","Reporting Period:",[timeperiod]],
        ["","","","","","","Action Date:",mydate]
      ]);
    }
    else if(expjsondata['component']=='Branch_report'){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Branch:",expjsondata['branch'],"","","","","Taken By:",expjsondata['user']],
        ["Product:",expjsondata['product'],"","","","","Reporting Period:",[timeperiod]],
        ["Brand:",expjsondata['brand'],"","","","","Action Date:", mydate,],
        ]);
    }
    else if(expjsondata['component']=='salesZoneReport') {
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],
        ["Taken By:",expjsondata['user']],[""],
        ["Action Date:",mydate],
        ["Reporting Period:",[timeperiod]],[""]
      ]);
    }
    else if(expjsondata['component']=='Source_report'){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Source:",expjsondata['source'],"Branch:",expjsondata['branch'],"","","Taken By:",expjsondata['user']],
        ["Product:",expjsondata['product'],"Brand:",expjsondata['brand'],"","","Reporting Period:",[timeperiod]],
        ["","","","","","","Action Date:", mydate,],
        ]);
    }

else{
  var ws = XLSX.utils.aoa_to_sheet([
    [heading],[""],[""],[""],
    ["Branch:",expjsondata['branch'],"Staff:",expjsondata['staff'],"","","Taken By:",expjsondata['user']],
    ['Product:',expjsondata['product'],"Brand:",expjsondata['brand'],"","","Reporting Period:",[timeperiod]],
    ['Item:',expjsondata['item'],"","","","","Action Date:",mydate],
  ]);
}
    
    
    // console.log(new Date(),"new date:")
    let num=json.length+9;
    let ad='A'+num
  //  const wsTot: XLSX.WorkSheet=XLSX.utils.sheet_add_json(ws,jsonTot,{origin: { c:0,r:num}});
   const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});
  


    // console.log(worksheet,"ws")
     
    
    this.headerCenterStyle(ws.A1);
    this.headerCenterStyle(ws.A2);
    this.wrapAndCenterCell(worksheet.A10);
    this.wrapAndCenterCell(worksheet.B10);
    this.wrapAndCenterCell(worksheet.C10);
    this.wrapAndCenterCell(worksheet.D10);
    this.wrapAndCenterCell(worksheet.E10);
    this.wrapAndCenterCell(worksheet.F10);
    this.wrapAndCenterCell(worksheet.G10);
    this.wrapAndCenterCell(worksheet.H10);
    let n=9;
    for(let j=10;j<num;j++){
      for(let i=1;i<8;i++){
        var cellRef =XLSX.utils.encode_cell({r:j, c:i});
        this.dataCellStyle(worksheet[cellRef]);
      }
    }
    var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
    this.totalCellStyle(worksheet[totalCellRef]);

    for( let i=1;i<8;i++){
      var cellRef =XLSX.utils.encode_cell({r:num, c:i});
      this.totalRowStyle(worksheet[cellRef]);

    }


    
    var wscols = [
      {wch:15},
      {wch:20},
      {wch:12},
      {wch:17},
      {wch:12},
      {wch:12},
      {wch:15},
      {wch:20}
  ];
  var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  // worksheet["!rows"]=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:7}}];
  
  const wsrows: XLSX.RowInfo[] = [
    {hpt: 12}, // "points"
    {hpx: 16}, // "pixels"
    ,
    {hpx: 24, level:3},
    {hidden: true}, // hide row
    {hidden: false}
  ];
  // worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
  worksheet["!rows"]=wsrows
  worksheet["!cols"]= wscols;
  worksheet["!autofilter"]

 

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const opts: any = { sheetFormat: { baseColWidth: '200' }, };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);

  }


  public exportAsEnquiryExport(json: any[],expjsondata): void{
    // console.log(this.datepipe.transform(this.nowdate, 'dd-MM-yyyy,h:mm:s') ,"todays date");
    // console.log(expjsondata,"expjson data");
    // console.log(localStorage.getItem("username"),"Username");
    // now: number;
    let nowdate=Date.now();
    let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');
    // console.log(json,"Json")
    expjsondata['user']=localStorage.getItem("username");
    // console.log(expjsondata['charthead'],expjsondata['tmpdfdate'],expjsondata,"this the expjsondata arecieved at excelservice");
    if(expjsondata['branch']==''){expjsondata['branch']='ALL'}
    if(expjsondata['staff']==''){expjsondata['staff']='ALL'}
    if(expjsondata['customer']==''){expjsondata['customer']='ALL'}
    let head=expjsondata['charthead'];
    // console.log(head[0].toUpperCase()+head.substring(1), "string conversion")
    let heading=head[0].toUpperCase()+head.substring(1)+" Wise Report";
    let timeperiod=expjsondata['tmpdfdate']+' to '+expjsondata['tmpdtdate']
    if(expjsondata['component']=='Generelised'){
      let displayColumn=expjsondata['displayedcolumns'];
      for(let column in displayColumn){         
        let chartNum= Number(column)+1;   
        let num = '' ;
        num=('chart'+chartNum.toString());

        if(displayColumn[column].toLowerCase()=='branch'){
          if(expjsondata['branch']){
          expjsondata[num]=expjsondata['branch'];
          }
          else{
            expjsondata[num]='ALL';
          }
        }
        if(displayColumn[column].toLowerCase()=='staff'){          
          if(expjsondata['staff']){
          expjsondata[num]=expjsondata['staff'];
          }
          else{
            expjsondata[num]='ALL';
          }
        }
        }

      for(let it in displayColumn){
      displayColumn[it]=displayColumn[it][0].toUpperCase()+displayColumn[it].substring(1);
      // console.log(displayColumn[it],"it");
      }
      if(displayColumn.length<=3){

        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"","Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"","Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"","Action Date:",mydate]
        ]);
      }
      else if(displayColumn.length==4){
        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"","Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"","Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"","Action Date:",mydate],
        ]);
      }
      else if(displayColumn.length==5){
        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"","Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"","Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"","Action Date:",mydate],
          [displayColumn[3],expjsondata['chart4']]
        ]);
      }
      else if(displayColumn.length==6){
        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"","Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"","Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"","Action Date:",mydate],
          [displayColumn[3],expjsondata['chart4']],
          [displayColumn[4],expjsondata['chart5']]
        ]);
      }
      else if(displayColumn.length==7){
        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"","Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"","Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"","Action Date:",mydate],
          [displayColumn[3],expjsondata['chart4'],"",displayColumn[4],expjsondata['chart5']],
          [displayColumn[5],expjsondata['chart6']]
        ]);
      }
      else if(displayColumn.length==8){
        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"","Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"","Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"","Action Date:",mydate],
          [displayColumn[3],expjsondata['chart4'],"",displayColumn[4],expjsondata['chart5']],
          [displayColumn[5],expjsondata['chart6']],
          [displayColumn[6],expjsondata['chart7']]
        ]);
      }
      else if(displayColumn.length==9){
        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"","Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"","Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"","Action Date:",mydate],
          [displayColumn[3],expjsondata['chart4'],"",displayColumn[4],expjsondata['chart5']],
          [displayColumn[5],expjsondata['chart6'],"",displayColumn[6],expjsondata['chart7']],
          [displayColumn[7],expjsondata['chart8']]
        ]);
      }

        else if(displayColumn.length==9){
          var ws = XLSX.utils.aoa_to_sheet([
            [heading],[""],[""],
            [displayColumn[0],expjsondata['chart1'],"","Taken By:",expjsondata['user']],
            [displayColumn[1],expjsondata['chart2'],"","Reporting Period:",[timeperiod]],
            [displayColumn[2],expjsondata['chart3'],"","Action Date:",mydate],
            [displayColumn[3],expjsondata['chart4'],"",displayColumn[4],expjsondata['chart5']],
            [displayColumn[5],expjsondata['chart6'],"",displayColumn[6],expjsondata['chart7']],
            [displayColumn[7],expjsondata['chart8'],"",displayColumn[8],expjsondata['chart9']],
          ]);
      }
      else if(displayColumn.length==9){
        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"","Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"","Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"","Action Date:",mydate],
          [displayColumn[3],expjsondata['chart4'],"",displayColumn[4],expjsondata['chart5']],
          [displayColumn[5],expjsondata['chart6'],"",displayColumn[6],expjsondata['chart7']],
          [displayColumn[7],expjsondata['chart8'],"",displayColumn[8],expjsondata['chart9']],
          [displayColumn[9],expjsondata['chart10']]
        ]);
    }

    }
    else if(expjsondata['component']=='Productivity'){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],
        ["Branch:",expjsondata['branch'],"","Taken By:",expjsondata['user']],
        ["Staff:",expjsondata['productivity'],"","Reporting Period:",[timeperiod],],
        [["Product:"],expjsondata['product'],"",["Brand:"],expjsondata['brand']],
        ["Promoter:",expjsondata['promoter'],"","Item:",expjsondata['item']],
        ["Action Date:",mydate]
      ]);
    }
    else if(expjsondata['component']=='Customer_Report'){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Branch:",expjsondata['branch'],"","Taken By:",expjsondata['user']],
        ["Customer:",expjsondata['customer'],"","Reporting Period:",[timeperiod]],
        [["Product:"],expjsondata['product'],"","Brand:",expjsondata['brand']],
        ["Item:",expjsondata['item'],"","Action Date:", mydate]
      ]);
    }
    else if(expjsondata['component']=='Branch_Report'){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Branch:",expjsondata['branch'],"","Taken By:",expjsondata['user']],
        ["Product:",expjsondata['product'],"","Reporting Period:",[timeperiod]],
        ["Brand:",expjsondata['brand'],"","Action Date:", mydate],
        ["Item:",expjsondata['item']]
      ]);
    }
    else if(expjsondata['component']=='Product_Report'){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Branch:",expjsondata['branch'],"","Taken By:",expjsondata['user']],
        ["Staff:",expjsondata['staff'],"","Reporting Period:",[timeperiod]],
        [["Product:"],expjsondata['product'],"","Action Date:",mydate],
        ["Item:",expjsondata['item'],"",["Brand:"],expjsondata['brand']]
      ]);
    }
    else if(expjsondata['component']=='Source_Report'){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],
        [["Source:"],expjsondata['source'],"","Taken By:",expjsondata['user']],
        ["Branch:",expjsondata['branch'],"","Reporting Period:",[timeperiod]],
        [["Product:"],expjsondata['product'],"","Action Date:",mydate],
        ["Item:",expjsondata['item'],"",["Brand:"],expjsondata['brand']]
      ]);
    }
    else if(expjsondata['component']=='NewCustomer_Report'){

      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Branch:",expjsondata['branch'],"","Taken By:",expjsondata['user']],
        ["Customer:",expjsondata['customer'],"","Reporting Period:",[timeperiod]],
        ["Product:",expjsondata['product'],"","Brand:",expjsondata['brand']],
        ["Item:",expjsondata['item'],"","Action Date:",mydate]
      ]);
    }
else{
  var ws = XLSX.utils.aoa_to_sheet([
    [heading],[""],[""],[""],
    ["Taken By:",expjsondata['user']],[""],
    ["Action Date:",mydate,"","Staff:",expjsondata['staff']],
    ["Reporting Period:",[timeperiod],"","Branch:",expjsondata['branch']]
  ]);
}
    
    
    // console.log(new Date(),"new date:")
    let num=json.length+9;
    let ad='A'+num
  //  const wsTot: XLSX.WorkSheet=XLSX.utils.sheet_add_json(ws,jsonTot,{origin: { c:0,r:num}});
   const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});
  


    // console.log(worksheet,"ws")
     
    
    this.headerCenterStyle(ws.A1);
    this.headerCenterStyle(ws.A2);
    this.wrapAndCenterCell(worksheet.A10);
    this.wrapAndCenterCell(worksheet.B10);
    this.wrapAndCenterCell(worksheet.C10);
    this.wrapAndCenterCell(worksheet.D10);
    this.wrapAndCenterCell(worksheet.E10);

    for(let j=10;j<num;j++){
      for(let i=1;i<5;i++){
        var cellRef =XLSX.utils.encode_cell({r:j, c:i});
        this.dataCellStyle(worksheet[cellRef]);
      }
    }
    var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
    this.totalCellStyle(worksheet[totalCellRef]);
    for( let i=1;i<5;i++){
      var cellRef =XLSX.utils.encode_cell({r:num, c:i});
      this.totalRowStyle(worksheet[cellRef]);
    }
    
    var wscols = [
      {wch:20},
      {wch:20},
      {wch:20},
      {wch:20},
      {wch:20},
      {wch:12},
      // {wch:15},
      // {wch:15}
  ];
  var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  // worksheet["!rows"]=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:4}}];
  
  const wsrows: XLSX.RowInfo[] = [
    {hpt: 12}, // "points"
    {hpx: 16}, // "pixels"
    ,
    {hpx: 24, level:3},
    {hidden: true}, // hide row
    {hidden: false}
  ];
  // worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
  worksheet["!rows"]=wsrows
  worksheet["!cols"]= wscols;
  worksheet["!autofilter"]

 

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const opts: any = { sheetFormat: { baseColWidth: '200' }, };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);

  }



  public exportAsEnqOnlyExport(json: any[],expjsondata): void{
    
    // now: number;
    let nowdate=Date.now();
    let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');
    // console.log(this.datepipe.transform(nowdate, 'dd-MM-yyyy,h:mm:s') ,"todays date");
    // console.log(expjsondata,"expjson data");
    // console.log(localStorage.getItem("username"),"Username");
    expjsondata['user']=localStorage.getItem("username");
    // console.log(expjsondata['charthead'],expjsondata['tmpdfdate'],expjsondata,"this the expjsondata arecieved at excelservice");
    if(expjsondata['branch']==''){expjsondata['branch']='ALL'}
    if(expjsondata['staff']==''){expjsondata['staff']='ALL'}
    if(expjsondata['customer']==''){expjsondata['customer']='ALL'}
    
    let heading=expjsondata['charthead']+" Wise Report";
    let timeperiod=expjsondata['tmpdfdate']+' to '+expjsondata['tmpdtdate']
    if(expjsondata['component']=='NA_Report') {
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],
        ["Branch:",expjsondata['branch'],"Taken By:",expjsondata['user']],
        ["Product:",expjsondata['product'],"Reporting Period:",[timeperiod]],
        ["Brand:",expjsondata['brand'],"Action Date:",mydate],
        ["Item:",expjsondata['item']]
      ]);
    }
    else if(expjsondata['component']=='Productivity'){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],
        ["Taken By:",expjsondata['user']],[""],
        ["Action Date:",mydate,"","Staff:",expjsondata['staff']],
        ["Reporting Period:",[timeperiod],"","Branch:",expjsondata['branch']],
        [["Advanced Filters::"],["Product:"],expjsondata['product'],["Brand:"],expjsondata['brand']],[["Promoter:"],[expjsondata['promoter']]]
      ]);
    }
    else if(expjsondata['component']=='Customer_Report'){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],
        ["Taken By:",expjsondata['user']],[""],
        ["Action Date:", mydate,"","Customer:",expjsondata['customer']],
        ["Reporting Period:",[timeperiod],"","Branch:",expjsondata['branch']],[["Advanced Filters::"],["Product:"],expjsondata['product'],["Brand:"],expjsondata['brand']]]);
    }
    else if(expjsondata['component']=='Branch_Report'){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],
        ["Taken By:",expjsondata['user']],[""],
        ["Action Date:",mydate],
        ["Reporting Period:",[timeperiod],"","Branch:",expjsondata['branch']],[["Advanced Filters::"],["Product:"],expjsondata['product'],["Brand:"],expjsondata['brand']]]);
    }
    else if(expjsondata['component']=='Product_Report'){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],
        ["Taken By:",expjsondata['user']],[""],
        ["Action Date:",mydate,"","Staff:",expjsondata['staff']],
        ["Reporting Period:",[timeperiod],"","Branch:",expjsondata['branch']],
        [["Advanced Filters::"],["Product:"],expjsondata['product'],["Brand:"],expjsondata['brand']]
      ]);
    }
    else if(expjsondata['component']=='Source_Report'){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],
        ["Taken By:",expjsondata['user']],[""],
        ["Action Date:",mydate],
        ["Reporting Period:",[timeperiod],"","Branch:",expjsondata['branch']],
        [["Advanced Filters::"],["Product:"],expjsondata['product'],["Brand:"],expjsondata['brand']],[["Source:"],[expjsondata['source']]]
      ]);
    }
    else if(expjsondata['component']=='Generelised'){
      let displayColumn=expjsondata['displayedcolumns'];
      
      for(let column in displayColumn){         
        let chartNum= Number(column)+1;   
        let num = '' ;
        num=('chart'+chartNum.toString());

        if(displayColumn[column].toLowerCase()=='branch'){
          if(expjsondata['branch']){
          expjsondata[num]=expjsondata['branch'];
          }
          else{
            expjsondata[num]='ALL';
          }
        }
        if(displayColumn[column].toLowerCase()=='staff'){
          
          if(expjsondata['staff']){
          expjsondata[num]=expjsondata['staff'];
          }
          else{
            expjsondata[num]='ALL';
          }
        }
        }
        
      for(let it in displayColumn){
      displayColumn[it]=displayColumn[it][0].toUpperCase()+displayColumn[it].substring(1);
      // console.log(displayColumn[it],"it");
      }
      if(displayColumn.length<=3){

        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"Action Date:",mydate]
        ]);
      }
      else if(displayColumn.length==4){
        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"Action Date:",mydate],
        ]);
      }
      else if(displayColumn.length==5){
        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"Action Date:",mydate],
          [displayColumn[3],expjsondata['chart4']]
        ]);
      }
      else if(displayColumn.length==6){
        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"Action Date:",mydate],
          [displayColumn[3],expjsondata['chart4']],
          [displayColumn[4],expjsondata['chart5']]
        ]);
      }
      else if(displayColumn.length==7){
        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"Action Date:",mydate],
          [displayColumn[3],expjsondata['chart4'],displayColumn[4],expjsondata['chart5']],
          [displayColumn[5],expjsondata['chart6']]
        ]);
      }
      else if(displayColumn.length==8){
        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"Action Date:",mydate],
          [displayColumn[3],expjsondata['chart4'],displayColumn[4],expjsondata['chart5']],
          [displayColumn[5],expjsondata['chart6']],
          [displayColumn[6],expjsondata['chart7']]
        ]);
      }
      else if(displayColumn.length==9){
        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"Action Date:",mydate],
          [displayColumn[3],expjsondata['chart4'],displayColumn[4],expjsondata['chart5']],
          [displayColumn[5],expjsondata['chart6'],displayColumn[6],expjsondata['chart7']],
          [displayColumn[7],expjsondata['chart8']]
        ]);
      }

        else if(displayColumn.length==9){
          var ws = XLSX.utils.aoa_to_sheet([
            [heading],[""],[""],
            [displayColumn[0],expjsondata['chart1'],"Taken By:",expjsondata['user']],
            [displayColumn[1],expjsondata['chart2'],"Reporting Period:",[timeperiod]],
            [displayColumn[2],expjsondata['chart3'],"Action Date:",mydate],
            [displayColumn[3],expjsondata['chart4'],displayColumn[4],expjsondata['chart5']],
            [displayColumn[5],expjsondata['chart6'],displayColumn[6],expjsondata['chart7']],
            [displayColumn[7],expjsondata['chart8'],displayColumn[8],expjsondata['chart9']],
          ]);
      }
      else if(displayColumn.length==9){
        var ws = XLSX.utils.aoa_to_sheet([
          [heading],[""],[""],
          [displayColumn[0],expjsondata['chart1'],"Taken By:",expjsondata['user']],
          [displayColumn[1],expjsondata['chart2'],"Reporting Period:",[timeperiod]],
          [displayColumn[2],expjsondata['chart3'],"Action Date:",mydate],
          [displayColumn[3],expjsondata['chart4'],displayColumn[4],expjsondata['chart5']],
          [displayColumn[5],expjsondata['chart6'],displayColumn[6],expjsondata['chart7']],
          [displayColumn[7],expjsondata['chart8'],displayColumn[8],expjsondata['chart9']],
          [displayColumn[9],expjsondata['chart10']]
        ]);
    }
  }
else{
  var ws = XLSX.utils.aoa_to_sheet([
    [heading],[""],[""],[""],
    ["Taken By:",expjsondata['user']],[""],
    ["Action Date:",mydate,"","Staff:",expjsondata['staff']],
    ["Reporting Period:",[timeperiod],"","Branch:",expjsondata['branch']]
  ]);
}

    
    
    // console.log(new Date(),"new date:")
    let num=json.length+9;
    // console.log(json,"this is the json data")
  //  const wsTot: XLSX.WorkSheet=XLSX.utils.sheet_add_json(ws,jsonTot,{origin: { c:0,r:num}});
   const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});
  


    // console.log(worksheet,"ws")
     
    
    this.headerCenterStyle(ws.A1);
    this.headerCenterStyle(ws.A2);
    this.wrapAndCenterCell(worksheet.A10);
    this.wrapAndCenterCell(worksheet.B10);
    this.wrapAndCenterCell(worksheet.C10);
    // this.wrapAndCenterCell(worksheet.D10);
       // this.wrapAndCenterCell(worksheet.E10);
    // this.wrapAndCenterCell(worksheet.F10);
    // this.wrapAndCenterCell(worksheet.G10);
    // this.wrapAndCenterCell(worksheet.H10);
    for(let j=10;j<num;j++){
      for(let i=1;i<3;i++){
        var cellRef =XLSX.utils.encode_cell({r:j, c:i});
        this.dataCellStyle(worksheet[cellRef]);
      }
    }
    var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
    this.totalCellStyle(worksheet[totalCellRef]);
    for( let i=1;i<2;i++){
      var cellRef =XLSX.utils.encode_cell({r:num, c:i});
      this.totalRowStyle(worksheet[cellRef]);

    }
    
    var wscols = [
      {wch:25},
      {wch:25},
      {wch:25},
      {wch:20},
      // {wch:20},
      // {wch:12},
      // {wch:15},
      // {wch:15}
  ];
  var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  // worksheet["!rows"]=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:3}}];
  
  const wsrows: XLSX.RowInfo[] = [
    {hpt: 12}, // "points"
    {hpx: 16}, // "pixels"
    ,
    {hpx: 24, level:3},
    {hidden: true}, // hide row
    {hidden: false}
  ];
  // worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
  worksheet["!rows"]=wsrows
  worksheet["!cols"]= wscols;
  worksheet["!autofilter"]

 

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const opts: any = { sheetFormat: { baseColWidth: '200' }, };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);

  }

  //  priceband itemwise report
public exportAsPriceBandItemwise(json: any[],expjsondata): void{
  


  let nowdate=Date.now();
  let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');

  expjsondata['user']=localStorage.getItem("username");
  if(expjsondata['branch']==''){expjsondata['branch']='ALL'}

  let heading= expjsondata['charthead'];
  let timeperiod=expjsondata['tmpdfdate']+' to '+expjsondata['tmpdtdate'];

  if (expjsondata['areain'] == 'Branch' || expjsondata['areain'] == 'Territory' || expjsondata['areain'] == 'Zone' ){
  var ws = XLSX.utils.aoa_to_sheet([
    [heading],[""],[""],[""],
    [expjsondata['filter3'],expjsondata['filtervalue'],"","","","","Action Date:",mydate],
    ["Taken By:",expjsondata['user'],"","","","","Reporting Period:",[timeperiod]],
    ["Product:",expjsondata['product'],"","","","","Brand:",expjsondata['brand']]
  ]);

let num=json.length+9;

const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});


this.headerCenterStyle(ws.A1);
this.headerCenterStyle(ws.A2);
this.wrapAndCenterCell(worksheet.A10);
this.wrapAndCenterCell(worksheet.B10);
this.wrapAndCenterCell(worksheet.C10);
this.wrapAndCenterCell(worksheet.D10);
this.wrapAndCenterCell(worksheet.E10);
this.wrapAndCenterCell(worksheet.F10);
this.wrapAndCenterCell(worksheet.G10);
this.wrapAndCenterCell(worksheet.H10);
// this.wrapAndCenterCell(worksheet.I10);

for(let j=10;j<num+1;j++){
  for(let i=0;i<8;i++){
    var cellRef =XLSX.utils.encode_cell({r:j, c:i});
    this.cellStyle(worksheet[cellRef]);
  }
}
// var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
// this.totalCellStyle(worksheet[totalCellRef]);
// for( let i=0;i<7;i++){
//   var cellRef =XLSX.utils.encode_cell({r:num, c:i});
//   this.totalRowStyle(worksheet[cellRef]);

// }

var wscols = [
  {wch:8},
  {wch:15},
  {wch:15},
  {wch:15},
  {wch:15},
  {wch:30},
  {wch:15},
  {wch:15},
  // {wch:15}
];
var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:7}}];
const wsrows: XLSX.RowInfo[] = [
{hpt: 12}, // "points"
{hpx: 16}, // "pixels"
,
{hpx: 24, level:3},
{hidden: true}, // hide row
{hidden: false}
];
// worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
worksheet["!rows"]=wsrows
worksheet["!cols"]= wscols;
worksheet["!autofilter"];
worksheet["!protect"];


const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
const opts: any = { sheetFormat: { baseColWidth: '200' }, };
// const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);

}
  else if (expjsondata['areain'] == 'TerritoryandBranch' || expjsondata['areain'] == 'ZoneandTerritory' || expjsondata['areain'] == 'AreaandBranch' || expjsondata['areain'] == 'StateandArea'){
  var ws = XLSX.utils.aoa_to_sheet([
    [heading],[""],[""],[""],
    [expjsondata['filter3'],expjsondata['filtervalue'],"","","","","","Action Date:",mydate],
    ["Taken By:",expjsondata['user'],"","","","","","Reporting Period:",[timeperiod]],
    ["Product:",expjsondata['product'],"","","","","","Brand:",expjsondata['brand']]
  ]);

let num=json.length+9;

const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});


this.headerCenterStyle(ws.A1);
this.headerCenterStyle(ws.A2);
this.wrapAndCenterCell(worksheet.A10);
this.wrapAndCenterCell(worksheet.B10);
this.wrapAndCenterCell(worksheet.C10);
this.wrapAndCenterCell(worksheet.D10);
this.wrapAndCenterCell(worksheet.E10);
this.wrapAndCenterCell(worksheet.F10);
this.wrapAndCenterCell(worksheet.G10);
this.wrapAndCenterCell(worksheet.H10);
this.wrapAndCenterCell(worksheet.I10);

for(let j=10;j<num+1;j++){
  for(let i=0;i<9;i++){
    var cellRef =XLSX.utils.encode_cell({r:j, c:i});
    this.cellStyle(worksheet[cellRef]);
  }
}
// var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
// this.totalCellStyle(worksheet[totalCellRef]);
// for( let i=0;i<8;i++){
//   var cellRef =XLSX.utils.encode_cell({r:num, c:i});
//   this.totalRowStyle(worksheet[cellRef]);

// }

var wscols = [
  {wch:8},
  {wch:15},
  {wch:15},
  {wch:15},
  {wch:15},
  {wch:15},
  {wch:25},
  {wch:15},
  {wch:15}
];
var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:8}}];
const wsrows: XLSX.RowInfo[] = [
{hpt: 12}, // "points"
{hpx: 16}, // "pixels"
,
{hpx: 24, level:3},
{hidden: true}, // hide row
{hidden: false}
];
// worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
worksheet["!rows"]=wsrows
worksheet["!cols"]= wscols;
worksheet["!autofilter"];
worksheet["!protect"];


const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
const opts: any = { sheetFormat: { baseColWidth: '200' }, };
// const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);
}

}
// priceband itemewise ends here


  public exportAsEnaAndSaleExport(json: any[],expjsondata): void{

    // now: number;
    let nowdate=Date.now();
    let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');
    // console.log(this.datepipe.transform(nowdate, 'dd-MM-yyyy,h:mm:s') ,"todays date");
    // console.log(expjsondata,"expjson data");
    // console.log(localStorage.getItem("username"),"Username");
    expjsondata['user']=localStorage.getItem("username");
    // console.log(expjsondata['charthead'],expjsondata['tmpdfdate'],expjsondata,"this the expjsondata arecieved at excelservice");
    if(expjsondata['branch']==''){expjsondata['branch']='ALL'}
    if(expjsondata['staff']==''){expjsondata['staff']='ALL'}
    if(expjsondata['customer']==''){expjsondata['customer']='ALL'}
    
    let heading=expjsondata['charthead']+" Wise Report";
    let timeperiod=expjsondata['tmpdfdate']+' to '+expjsondata['tmpdtdate']
    if(expjsondata['component']=='TerritoryReport') {
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],
        ["Taken By:",expjsondata['user']],[""],
        ["Action Date:",mydate],
        ["Reporting Period:",[timeperiod]],[""]
      ]);
    }
    else if(expjsondata['component']=='FollowupReport'){

      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],
        ["Branch:",[expjsondata['branch']],"Taken By:",expjsondata['user']],
        ["Staff:",expjsondata['staff'],"Reporting Period:",[timeperiod]],
        ["Product:",expjsondata['product'],"Action Date:",mydate],
        ["Brand:",expjsondata['brand']]
      ]);
    }

else{
  var ws = XLSX.utils.aoa_to_sheet([
    [heading],[""],[""],[""],
    ["Taken By:",expjsondata['user']],[""],
    ["Action Date:",mydate,"","Staff:",expjsondata['staff']],
    ["Reporting Period:",[timeperiod],"","Branch:",expjsondata['branch']]
  ]);
}
    
    
    // console.log(new Date(),"new date:")
    let num=json.length+9;
    // console.log(json,"this is the json data")
  //  const wsTot: XLSX.WorkSheet=XLSX.utils.sheet_add_json(ws,jsonTot,{origin: { c:0,r:num}});
   const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});
  


    // console.log(worksheet,"ws")
     
    
    this.headerCenterStyle(ws.A1);
    this.headerCenterStyle(ws.A2);
    this.wrapAndCenterCell(worksheet.A10);
    this.wrapAndCenterCell(worksheet.B10);
    this.wrapAndCenterCell(worksheet.C10);
    this.wrapAndCenterCell(worksheet.D10);
    // this.wrapAndCenterCell(worksheet.E10);
    // this.wrapAndCenterCell(worksheet.F10);
    // this.wrapAndCenterCell(worksheet.G10);
    // this.wrapAndCenterCell(worksheet.H10);
    for(let j=10;j<num;j++){
      for(let i=1;i<4;i++){
        var cellRef =XLSX.utils.encode_cell({r:j, c:i});
        this.dataCellStyle(worksheet[cellRef]);
      }
    }
    var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
    this.totalCellStyle(worksheet[totalCellRef]);
    for( let i=1;i<4;i++){
      var cellRef =XLSX.utils.encode_cell({r:num, c:i});
      this.totalRowStyle(worksheet[cellRef]);

    }
    
    var wscols = [
      {wch:25},
      {wch:25},
      {wch:25},
      {wch:20},
      // {wch:20},
      // {wch:12},
      // {wch:15},
      // {wch:15}
  ];
  var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  // worksheet["!rows"]=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:3}}];
  
  const wsrows: XLSX.RowInfo[] = [
    {hpt: 12}, // "points"
    {hpx: 16}, // "pixels"
    ,
    {hpx: 24, level:3},
    {hidden: true}, // hide row
    {hidden: false}
  ];
  // worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
  worksheet["!rows"]=wsrows
  worksheet["!cols"]= wscols;
  worksheet["!autofilter"]

 

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const opts: any = { sheetFormat: { baseColWidth: '200' }, };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);

  }
  //exchange report
  exportAsExchange(json: any[],expjsondata): void{
    let nowdate=Date.now();
    let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');
   
    expjsondata['user']=localStorage.getItem("username");
    if(expjsondata['branch']==''){expjsondata['branch']='ALL'}

    let heading= " Exchange Report";
    let timeperiod=expjsondata['tmpdfdate']+' to '+expjsondata['tmpdtdate']
  
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],
        ["Action Date:",mydate,"","",""],
        ["Reporting Period:",[timeperiod],"","",""],
        [""]
       
      ]);
   
    let num=json.length+9;
   const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});
  
//no of coloumn
    this.headerCenterStyle(ws.A1);
    this.headerCenterStyle(ws.A2);
    this.wrapAndCenterCell(worksheet.A10);
    this.wrapAndCenterCell(worksheet.B10);
    this.wrapAndCenterCell(worksheet.C10);
    this.wrapAndCenterCell(worksheet.D10);
    this.wrapAndCenterCell(worksheet.E10);
    this.wrapAndCenterCell(worksheet.F10);
    this.wrapAndCenterCell(worksheet.G10);
    // this.wrapAndCenterCell(worksheet.H10);
    for(let j=10;j<num+1;j++){
      for(let i=0;i<7;i++){
        var cellRef =XLSX.utils.encode_cell({r:j, c:i});
        this.cellStyle(worksheet[cellRef]);
      }
    }
   
    var wscols = [
      {wch:14},
      {wch:12},
      {wch:15},
      {wch:14},
      {wch:50},
      {wch:17},
      {wch:11},
      // {wch:15},
      // {wch:15}
  ];
  var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:7}}];
  
  const wsrows: XLSX.RowInfo[] = [
    {hpt: 12}, // "points"
    {hpx: 16}, // "pixels"
    ,
    {hpx: 24, level:3},
    {hidden: true}, // hide row
    {hidden: false}
  ];
  // worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
  worksheet["!rows"]=wsrows
  worksheet["!cols"]= wscols;
  worksheet["!autofilter"]
  worksheet["!protect"]

 

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const opts: any = { sheetFormat: { baseColWidth: '200' }, };
    const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);


  }
  // status changed report
  public exportAsStatusChanged(json: any[],expjsondata): void{

    let nowdate=Date.now();
    let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');
   
    expjsondata['user']=localStorage.getItem("username");
    if(expjsondata['branch']==''){expjsondata['branch']='ALL'}

    let heading= "Auditing Report";
    let timeperiod=expjsondata['tmpdfdate']+' to '+expjsondata['tmpdtdate']
  
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],
        ["Branch:",expjsondata['branch'],"","","","Action Date:",mydate],
        ["Taken By:",expjsondata['user'],"","","","Reporting Period:",[timeperiod]],
        [""]
       
      ]);
   
    let num=json.length+9;
   const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});
  

    this.headerCenterStyle(ws.A1);
    this.headerCenterStyle(ws.A2);
    this.wrapAndCenterCell(worksheet.A10);
    this.wrapAndCenterCell(worksheet.B10);
    this.wrapAndCenterCell(worksheet.C10);
    this.wrapAndCenterCell(worksheet.D10);
    this.wrapAndCenterCell(worksheet.E10);
    this.wrapAndCenterCell(worksheet.F10);
    this.wrapAndCenterCell(worksheet.G10);
    // this.wrapAndCenterCell(worksheet.H10);
    for(let j=10;j<num+1;j++){
      for(let i=0;i<7;i++){
        var cellRef =XLSX.utils.encode_cell({r:j, c:i});
        this.cellStyle(worksheet[cellRef]);
      }
    }
   
    var wscols = [
      {wch:8},
      {wch:12},
      {wch:15},
      {wch:15},
      {wch:40},
      {wch:13},
      {wch:13},
      // {wch:15},
      // {wch:15}
  ];
  var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:7}}];
  
  const wsrows: XLSX.RowInfo[] = [
    {hpt: 12}, // "points"
    {hpx: 16}, // "pixels"
    ,
    {hpx: 24, level:3},
    {hidden: true}, // hide row
    {hidden: false}
  ];
  // worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
  worksheet["!rows"]=wsrows
  worksheet["!cols"]= wscols;
  worksheet["!autofilter"]
  worksheet["!protect"]

 

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const opts: any = { sheetFormat: { baseColWidth: '200' }, };
    const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);

  }
  public exportAsAudit(json: any[],expjsondata): void{
    // console.log("expjsondata",expjsondata);
    

    let nowdate=Date.now();
    let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');

    expjsondata['user']=localStorage.getItem("username");
    if(expjsondata['branch']==''){expjsondata['branch']='ALL'}

    let heading= expjsondata['charthead'];
    let timeperiod=expjsondata['tmpdfdate']+' to '+expjsondata['tmpdtdate']
  
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Branch:",expjsondata['branch'],"","","","Action Date:",mydate],
        ["Taken By:",expjsondata['user'],"","","","Reporting Period:",[timeperiod]],
       
      ]);
   
    let num=json.length+9;

   const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});
       
    
    this.headerCenterStyle(ws.A1);
    this.headerCenterStyle(ws.A2);
    this.wrapAndCenterCell(worksheet.A10);
    this.wrapAndCenterCell(worksheet.B10);
    this.wrapAndCenterCell(worksheet.C10);
    this.wrapAndCenterCell(worksheet.D10);
    this.wrapAndCenterCell(worksheet.E10);
    this.wrapAndCenterCell(worksheet.F10);
    this.wrapAndCenterCell(worksheet.G10);
    this.wrapAndCenterCell(worksheet.H10);
    // this.wrapAndCenterCell(worksheet.I10);

    for(let j=10;j<num+1;j++){
      for(let i=0;i<8;i++){
        var cellRef =XLSX.utils.encode_cell({r:j, c:i});
        this.cellStyle(worksheet[cellRef]);
      }
    }
   
    var wscols = [
      {wch:8},
      {wch:12},
      {wch:20},
      {wch:20},
      {wch:15},
      {wch:15},
      {wch:15},
      {wch:15},
      // {wch:15}
  ];
  var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:7}}];
  
  const wsrows: XLSX.RowInfo[] = [
    {hpt: 12}, // "points"
    {hpx: 16}, // "pixels"
    ,
    {hpx: 24, level:3},
    {hidden: true}, // hide row
    {hidden: false}
  ];
  // worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
  worksheet["!rows"]=wsrows
  worksheet["!cols"]= wscols;
  worksheet["!autofilter"];
  worksheet["!protect"];

 

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const opts: any = { sheetFormat: { baseColWidth: '200' }, };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);

  }

  // ............................
  //Incentives Reportllllling
  public exportAsIncentives(json: any[],expjsondata): void{
    

    let nowdate=Date.now();
    let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');

    expjsondata['user']=localStorage.getItem("username");
    if(expjsondata['branch']==''){expjsondata['branch']='ALL'}

    let heading= expjsondata['charthead'];
    let timeperiod=expjsondata['tmpdfdate']+' to '+expjsondata['tmpdtdate'];

    if (expjsondata['areain'] == 'Branch' || expjsondata['areain'] == 'Territory' || expjsondata['areain'] == 'Zone' || expjsondata['areain'] == 'Area' || expjsondata['areain'] == 'State'){
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[""],[""],[""],
      [expjsondata['filter3'],expjsondata['filtervalue'],"","","","Action Date:",mydate],
      ["Taken By:",expjsondata['user'],"","","","Reporting Period:",[timeperiod]],
      ["Type:", expjsondata['strType']],
    ]);
 
  let num=json.length+9;

 const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});
     
  
  this.headerCenterStyle(ws.A1);
  this.headerCenterStyle(ws.A2);
  this.wrapAndCenterCell(worksheet.A10);
  this.wrapAndCenterCell(worksheet.B10);
  this.wrapAndCenterCell(worksheet.C10);
  this.wrapAndCenterCell(worksheet.D10);
  this.wrapAndCenterCell(worksheet.E10);
  this.wrapAndCenterCell(worksheet.F10);
  this.wrapAndCenterCell(worksheet.G10);
  // this.wrapAndCenterCell(worksheet.H10);
  // this.wrapAndCenterCell(worksheet.I10);

  for(let j=10;j<num+1;j++){
    for(let i=0;i<7;i++){
      var cellRef =XLSX.utils.encode_cell({r:j, c:i});
      this.cellStyle(worksheet[cellRef]);
    }
  }
  // var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
  // this.totalCellStyle(worksheet[totalCellRef]);
  for( let i=0;i<7;i++){
    var cellRef =XLSX.utils.encode_cell({r:num, c:i});
    this.totalRowStyle(worksheet[cellRef]);

  }
 
  var wscols = [
    {wch:15},
    {wch:18},
    {wch:18},
    {wch:18},
    {wch:18},
    {wch:18},
    {wch:20},
    // {wch:15},
    // {wch:15}
];
var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:6}}];
const wsrows: XLSX.RowInfo[] = [
  {hpt: 12}, // "points"
  {hpx: 16}, // "pixels"
  ,
  {hpx: 24, level:3},
  {hidden: true}, // hide row
  {hidden: false}
];
// worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
worksheet["!rows"]=wsrows
worksheet["!cols"]= wscols;
worksheet["!autofilter"];
worksheet["!protect"];


const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
const opts: any = { sheetFormat: { baseColWidth: '200' }, };
// const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);

  }
    else if (expjsondata['areain'] == 'TerritoryandBranch' || expjsondata['areain'] == 'ZoneandTerritory' || expjsondata['areain'] == 'AreaandBranch' || expjsondata['areain'] == 'StateandArea'){
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[""],[""],[""],
      [expjsondata['filter3'],expjsondata['filtervalue'],"","","","","Action Date:",mydate],
      ["Taken By:",expjsondata['user'],"","","","","Reporting Period:",[timeperiod]],
      ["Type:", expjsondata['strType']],
    ]);
 
  let num=json.length+9;

 const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});
     
  
  this.headerCenterStyle(ws.A1);
  this.headerCenterStyle(ws.A2);
  this.wrapAndCenterCell(worksheet.A10);
  this.wrapAndCenterCell(worksheet.B10);
  this.wrapAndCenterCell(worksheet.C10);
  this.wrapAndCenterCell(worksheet.D10);
  this.wrapAndCenterCell(worksheet.E10);
  this.wrapAndCenterCell(worksheet.F10);
  this.wrapAndCenterCell(worksheet.G10);
  this.wrapAndCenterCell(worksheet.H10);
  // this.wrapAndCenterCell(worksheet.I10);

  for(let j=10;j<num+1;j++){
    for(let i=0;i<8;i++){
      var cellRef =XLSX.utils.encode_cell({r:j, c:i});
      this.cellStyle(worksheet[cellRef]);
    }
  }
  // var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
  // this.totalCellStyle(worksheet[totalCellRef]);
  for( let i=0;i<8;i++){
    var cellRef =XLSX.utils.encode_cell({r:num, c:i});
    this.totalRowStyle(worksheet[cellRef]);

  }
 
  var wscols = [
    {wch:15},
    {wch:20},
    {wch:15},
    {wch:18},
    {wch:18},
    {wch:18},
    {wch:20},
    {wch:20},
    // {wch:15}
];
var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:7}}];
const wsrows: XLSX.RowInfo[] = [
  {hpt: 12}, // "points"
  {hpx: 16}, // "pixels"
  ,
  {hpx: 24, level:3},
  {hidden: true}, // hide row
  {hidden: false}
];
// worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
worksheet["!rows"]=wsrows
worksheet["!cols"]= wscols;
worksheet["!autofilter"];
worksheet["!protect"];


const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
const opts: any = { sheetFormat: { baseColWidth: '200' }, };
// const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);
  }

  


 



  }



  // ...............................

// audit day report

exportAsAuditDayReport(json: any[],expjsondata,total): void{

  let nowdate=Date.now();
  let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');

  expjsondata['user']=localStorage.getItem("username");
    // if(expjsondata['branch']==''){expjsondata['branch']='ALL'}

    let heading=expjsondata['charthead'];
    let timeperiod=expjsondata['tmpdfdate']+' to '+expjsondata['tmpdtdate']
  if(expjsondata['charthead']=="Audit Incentive Detail Report"){
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[""],[""],[""],
      ["Taken By:",expjsondata['user'],"",""],
      ["Action Date:",mydate],
      ["Reporting Period:",[timeperiod]]
     
    ]);
  }
  else {
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[""],[""],[""],
      ["Branch:",expjsondata['branch'],"","","","Action Date:",mydate],
      ["Staff:",expjsondata['staff'],"","","","Reporting Period:",[timeperiod]],
      ["Taken By:",expjsondata['user'],"",""],
    
     
    ]);
  }

   
    let num=json.length+9;
   const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});
  

    this.headerCenterStyle(ws.A1);
    this.headerCenterStyle(ws.A2);
    this.wrapAndCenterCell(worksheet.A10);
    this.wrapAndCenterCell(worksheet.B10);
    this.wrapAndCenterCell(worksheet.C10);
    this.wrapAndCenterCell(worksheet.D10);
    this.wrapAndCenterCell(worksheet.E10);
    this.wrapAndCenterCell(worksheet.F10);
    this.wrapAndCenterCell(worksheet.G10);
    this.wrapAndCenterCell(worksheet.H10);
    for(let j=10;j<num+1;j++){
      for(let i=0;i<8;i++){
        var cellRef =XLSX.utils.encode_cell({r:j, c:i});
        this.cellStyle(worksheet[cellRef]);
      }
    }
    var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
    this.totalCellStyle(worksheet[totalCellRef]);
    for( let i=1;i<8;i++){
      var cellRef =XLSX.utils.encode_cell({r:num, c:i});
      this.totalRowStyle(worksheet[cellRef]);

    }
   
    var wscols = [
      {wch:15},
      {wch:10},
      {wch:20},
      {wch:15},
      {wch:15},
      {wch:15},
      {wch:15},
      {wch:15},
      // {wch:15}
  ];
  var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:8}}];
  
  const wsrows: XLSX.RowInfo[] = [
    {hpt: 12}, // "points"
    {hpx: 16}, // "pixels"
    {hpx: 24, level:3},
    {hidden: true}, // hide row
    {hidden: false}
  ];
  // worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
  worksheet["!rows"]=wsrows
  worksheet["!cols"]= wscols;
  worksheet["!autofilter"]

 

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const opts: any = { sheetFormat: { baseColWidth: '200' }, };
    const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);



}
//*******************staff rewards ****************************/
exportAsStaffReward(json: any[],expjsondata): void{
  

  let nowdate=Date.now();
  let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');

  expjsondata['user']=localStorage.getItem("username");
    // if(expjsondata['branch']==''){expjsondata['branch']='ALL'}

    let heading=expjsondata['charthead'];
    let timeperiod=expjsondata['tmpdfdate']+' to '+expjsondata['tmpdtdate']
  if(expjsondata['charthead']=="Staff Reward Details"){
    if(expjsondata['area']=="Branch"){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Taken By:",expjsondata['user'],"","Area:",expjsondata['area']],
        ["Action Date:",mydate,"","Branch:",expjsondata['areaName']],
        ["Reporting Period:",[timeperiod],"","Staff:",expjsondata['staff']]
   
      ]);

    }
    else if(expjsondata['area']=="Territory" || expjsondata['area']=="Zone"){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Taken By:",expjsondata['user'],"","Area:",expjsondata['area']],
        ["Action Date:",mydate,"", expjsondata['area'],expjsondata['areaName']],
        ["Reporting Period:",[timeperiod]]
   
      ]);
    }
    else{
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Taken By:",expjsondata['user'],"","Area:",expjsondata['area']],
        ["Action Date:",mydate],
        ["Reporting Period:",[timeperiod]]
  
      ]);
    }

  }
  else if(expjsondata['charthead']=="Staff Reward Summary"){
    if(expjsondata['area']=="Branch Staff"){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Taken By:",expjsondata['user'],"","Area:",expjsondata['area']],
        ["Action Date:",mydate,"","Branch:",expjsondata['areaName']],
        ["Reporting Period:",[timeperiod]]
   
      ]);

    }
    else if(expjsondata['area']=="Territory" || expjsondata['area']=="Zone"){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Taken By:",expjsondata['user'],"","Area:",expjsondata['area']],
        ["Action Date:",mydate,"", expjsondata['area'],expjsondata['areaName']],
        ["Reporting Period:",[timeperiod]]
   
      ]);
    }
    else{
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Taken By:",expjsondata['user'],"","Area:",expjsondata['area']],
        ["Action Date:",mydate],
        ["Reporting Period:",[timeperiod]]
  
      ]);
    }

  }

   else {
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[""],[""],[""],
      ["Taken By:",expjsondata['user'],"","Area:",expjsondata['area']],
      ["Action Date:",mydate],
      ["Reporting Period:",[timeperiod]]

    ]);
  }


    let num=json.length+9;
   const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});


    this.headerCenterStyle(ws.A1);
    this.headerCenterStyle(ws.A2);
    this.wrapAndCenterCell(worksheet.A10);
    this.wrapAndCenterCell(worksheet.B10);
    this.wrapAndCenterCell(worksheet.C10);
    this.wrapAndCenterCell(worksheet.D10);
    this.wrapAndCenterCell(worksheet.E10);
    // this.wrapAndCenterCell(worksheet.F10);
    // this.wrapAndCenterCell(worksheet.G10);
    // this.wrapAndCenterCell(worksheet.H10);
    for(let j=10;j<num+1;j++){
      for(let i=0;i<5;i++){
        var cellRef =XLSX.utils.encode_cell({r:j, c:i});
        this.cellStyle(worksheet[cellRef]);
      }
    }
    var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
    this.totalCellStyle(worksheet[totalCellRef]);
    for( let i=1;i<5;i++){
      var cellRef =XLSX.utils.encode_cell({r:num, c:i});
      this.totalRowStyle(worksheet[cellRef]);

    }

    var wscols = [
      {wch:20},
      {wch:15},
      {wch:20},
      {wch:15},
      {wch:15},
      // {wch:15},
      // {wch:15},
      // {wch:15},
      // {wch:15}
  ];
  var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:4}}];

  const wsrows: XLSX.RowInfo[] = [
    {hpt: 12}, // "points"
    {hpx: 16}, // "pixels"
    {hpx: 24, level:3},
    {hidden: true}, // hide row
    {hidden: false}
  ];
  // worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
  worksheet["!rows"]=wsrows
  worksheet["!cols"]= wscols;
  worksheet["!autofilter"]



    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const opts: any = { sheetFormat: { baseColWidth: '200' }, };
    const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);



}

exportAsStaffReward4(json: any[],expjsondata): void{


  let nowdate=Date.now();
  let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');

  expjsondata['user']=localStorage.getItem("username");
    // if(expjsondata['branch']==''){expjsondata['branch']='ALL'}

    let heading=expjsondata['charthead'];
    let timeperiod=expjsondata['tmpdfdate']+' to '+expjsondata['tmpdtdate']
  if(expjsondata['charthead']=="Staff Reward Details"){
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[""],[""],
      ["Taken By:",expjsondata['user']],
      ["Action Date:",mydate],
      ["Reporting Period:",[timeperiod]],
      ["Area:",expjsondata['area']],

    ]);
  }
  // else if(expjsondata['charthead']=="Staff Reward Summary"){
  //   var ws = XLSX.utils.aoa_to_sheet([
  //     [heading],[""],[""],
  //     ["Taken By:",expjsondata['user'],"Area:",expjsondata['area']],
  //     ["Action Date:",mydate,],
  //     ["Reporting Period:",[timeperiod]],
  //     // ["Area:",expjsondata['area']],

  //   ]);
  // }
  else if(expjsondata['charthead']=="Staff Reward Summary"){
    if(expjsondata['area']=="Branch Staff"){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Taken By:",expjsondata['user'],"Area:",expjsondata['area']],
        ["Action Date:",mydate,"Branch:",expjsondata['areaName']],
        ["Reporting Period:",[timeperiod]]
   
      ]);

    }
    else if(expjsondata['area']=="Territory" || expjsondata['area']=="Zone"){
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Taken By:",expjsondata['user'],"Area:",expjsondata['area']],
        ["Action Date:",mydate, expjsondata['area'],expjsondata['areaName']],
        ["Reporting Period:",[timeperiod]]
   
      ]);
    }
    else{
      var ws = XLSX.utils.aoa_to_sheet([
        [heading],[""],[""],[""],
        ["Taken By:",expjsondata['user'],"Area:",expjsondata['area']],
        ["Action Date:",mydate],
        ["Reporting Period:",[timeperiod]]
  
      ]);
    }

  }
  else  {
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[""],[""],[""],
      ["Branch:",expjsondata['branch'],"","Action Date:",mydate],
      ["Staff:",expjsondata['staff'],"","Reporting Period:",[timeperiod]],
      ["Taken By:",expjsondata['user'],""],
    ]);
  }


    let num=json.length+9;
   const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});


    this.headerCenterStyle(ws.A1);
    this.headerCenterStyle(ws.A2);
    this.wrapAndCenterCell(worksheet.A10);
    this.wrapAndCenterCell(worksheet.B10);
    this.wrapAndCenterCell(worksheet.C10);
    this.wrapAndCenterCell(worksheet.D10);
    // this.wrapAndCenterCell(worksheet.E10);
    // this.wrapAndCenterCell(worksheet.F10);
    // this.wrapAndCenterCell(worksheet.G10);
    // this.wrapAndCenterCell(worksheet.H10);
    for(let j=10;j<num+1;j++){
      for(let i=0;i<4;i++){
        var cellRef =XLSX.utils.encode_cell({r:j, c:i});
        this.cellStyle(worksheet[cellRef]);
      }
    }
    var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
    this.totalCellStyle(worksheet[totalCellRef]);
    for( let i=1;i<4;i++){
      var cellRef =XLSX.utils.encode_cell({r:num, c:i});
      this.totalRowStyle(worksheet[cellRef]);

    }

    var wscols = [
      {wch:15},
      {wch:20},
      {wch:20},
      {wch:15},
      // {wch:15},
      // {wch:15},
      // {wch:15},
      // {wch:15},
      // {wch:15}
  ];
  var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:3}}];

  const wsrows: XLSX.RowInfo[] = [
    {hpt: 12}, // "points"
    {hpx: 16}, // "pixels"
    {hpx: 24, level:3},
    {hidden: true}, // hide row
    {hidden: false}
  ];
  // worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
  worksheet["!rows"]=wsrows
  worksheet["!cols"]= wscols;
  worksheet["!autofilter"]



    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const opts: any = { sheetFormat: { baseColWidth: '200' }, };
    const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);



}
//*******************staff rewards  ends****************************/
exportAsBranchAudit(json: any[],expjsondata): void{


  let nowdate=Date.now();
  let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');

  expjsondata['user']=localStorage.getItem("username");
    // if(expjsondata['branch']==''){expjsondata['branch']='ALL'}

    let heading=expjsondata['charthead'];
    let timeperiod=expjsondata['tmpdfdate']+' to '+expjsondata['tmpdtdate']
  if(expjsondata['charthead']=="Branch Audit Report"){
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[""],[""],
      ["Taken By:",expjsondata['user']],
      ["Action Date:",mydate],
      ["Reporting Period:",[timeperiod]],
      ["Branch:",expjsondata['branch']]
     
    ]);
  }
  else {
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[""],[""],[""],
      ["Branch:",expjsondata['branch'],"Action Date:",mydate],
      ["Taken By:",expjsondata['user'],"Reporting Period:",[timeperiod]],
    
     
    ]);
  }

   
    let num=json.length+9;
   const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});
  

    this.headerCenterStyle(ws.A1);
    this.headerCenterStyle(ws.A2);
    this.wrapAndCenterCell(worksheet.A10);
    this.wrapAndCenterCell(worksheet.B10);
    this.wrapAndCenterCell(worksheet.C10);
    this.wrapAndCenterCell(worksheet.D10);
    // this.wrapAndCenterCell(worksheet.E10);
    // this.wrapAndCenterCell(worksheet.F10);
    // this.wrapAndCenterCell(worksheet.G10);
    // this.wrapAndCenterCell(worksheet.H10);
    for(let j=10;j<num+1;j++){
      for(let i=0;i<4;i++){
        var cellRef =XLSX.utils.encode_cell({r:j, c:i});
        this.cellStyle(worksheet[cellRef]);
      }
    }
    // var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
    // this.totalCellStyle(worksheet[totalCellRef]);
    // for( let i=1;i<4;i++){
    //   var cellRef =XLSX.utils.encode_cell({r:num, c:i});
    //   this.totalRowStyle(worksheet[cellRef]);

    // }
   
    var wscols = [
      {wch:15},
      {wch:20},
      {wch:20},
      {wch:20},
      // {wch:15},
      // {wch:15},
      // {wch:15},
      // {wch:15},
      // {wch:15}
  ];
  var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:3}}];
  
  const wsrows: XLSX.RowInfo[] = [
    {hpt: 12}, // "points"
    {hpx: 16}, // "pixels"
    {hpx: 24, level:3},
    {hidden: true}, // hide row
    {hidden: false}
  ];
  // worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
  worksheet["!rows"]=wsrows
  worksheet["!cols"]= wscols;
  worksheet["!autofilter"]

 

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const opts: any = { sheetFormat: { baseColWidth: '200' }, };
    const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);



}
exportAsPriceRange(json: any[],expjsondata): void{


  let nowdate=Date.now();
  let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');

  expjsondata['user']=localStorage.getItem("username");
    // if(expjsondata['branch']==''){expjsondata['branch']='ALL'}

    let heading=expjsondata['charthead'];
    let timeperiod=expjsondata['tmpdfdate']+' to '+expjsondata['tmpdtdate']
  if(expjsondata['charthead']=="Audit Branch Report"){
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[""],[""],
      ["Taken By:",expjsondata['user']],
      ["Action Date:",mydate],
      ["Reporting Period:",[timeperiod]],
      ["Branch:",expjsondata['branch']]
     
    ]);
  }
  else {
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[""],[""],[""],
      ["Branch:",expjsondata['branch'],"Action Date:",mydate],
      ["Taken By:",expjsondata['user'],"Reporting Period:",[timeperiod]],
    
     
    ]);
  }

   
    let num=json.length+9;
   const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});
  

    this.headerCenterStyle(ws.A1);
    this.headerCenterStyle(ws.A2);
    this.wrapAndCenterCell(worksheet.A10);
    this.wrapAndCenterCell(worksheet.B10);
    this.wrapAndCenterCell(worksheet.C10);
    // this.wrapAndCenterCell(worksheet.D10);
    // this.wrapAndCenterCell(worksheet.E10);
    // this.wrapAndCenterCell(worksheet.F10);
    // this.wrapAndCenterCell(worksheet.G10);
    // this.wrapAndCenterCell(worksheet.H10);
    for(let j=10;j<num+1;j++){
      for(let i=0;i<3;i++){
        var cellRef =XLSX.utils.encode_cell({r:j, c:i});
        this.cellStyle(worksheet[cellRef]);
      }
    }
    // var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
    // this.totalCellStyle(worksheet[totalCellRef]);
    // for( let i=1;i<4;i++){
    //   var cellRef =XLSX.utils.encode_cell({r:num, c:i});
    //   this.totalRowStyle(worksheet[cellRef]);

    // }
   
    var wscols = [
      {wch:15},
      {wch:10},
      {wch:20},
      // {wch:15},
      // {wch:15},
      // {wch:15},
      // {wch:15},
      // {wch:15},
      // {wch:15}
  ];
  var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
  ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:2}}];
  
  const wsrows: XLSX.RowInfo[] = [
    {hpt: 12}, // "points"
    {hpx: 16}, // "pixels"
    {hpx: 24, level:3},
    {hidden: true}, // hide row
    {hidden: false}
  ];
  // worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
  worksheet["!rows"]=wsrows
  worksheet["!cols"]= wscols;
  worksheet["!autofilter"]

 

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const opts: any = { sheetFormat: { baseColWidth: '200' }, };
    const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer,expjsondata['charthead']);



}



  private wrapAndCenterCell(cell: XLSX.CellObject) {
    const wrapAndCenterCellStyle = { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' },
    font: {sz: 11, bold: true }

  };
    this.setCellStyle(cell, wrapAndCenterCellStyle);
    
}

private headerCenterStyle(cel:XLSX.CellObject){
  const headerStyle={ alignment: {wrapText:true,vertical:'center',horizontal:'center'},
  border:{ top: { style: 'thick'}, bottom: { style: 'thick'}, left: { style: 'thick'},right: {style:'thick'}},
font:{sz:17, bold:true}}
this.setCellStyle(cel,headerStyle)
}

private totalRowStyle(cel:XLSX.CellObject){
  const totStyle={ font: {sz: 11, bold: true },
  alignment:{wrapText:true,vertical:'center',horizontal:'center'}};
  this.setCellStyle(cel,totStyle)
}

private dataCellStyle(cel:XLSX.CellObject){
  const dataStyle={ alignment:{wrapText:true,vertical:'center',horizontal:'right'}}
  this,this.setCellStyle(cel,dataStyle);
}

private totalCellStyle(cel:XLSX.CellObject){
  const totStyle={ font: {sz: 11, bold: true },alignment:{wrapText:true,vertical:'center',horizontal:'right'}};
  
  this.setCellStyle(cel,totStyle)
}

private cellStyle(cel:XLSX.CellObject){
  const dataStyle={ alignment:{wrapText:true,vertical:'center',horizontal:'center'}}
  this,this.setCellStyle(cel,dataStyle);
}

  private setCellStyle(cell: XLSX.CellObject, style: {}) {
    cell.s = style;
  }

  private saveAsExcelFile(array: any, fileName: string): void {
    localStorage.setItem('chartexport','true')
    const data: Blob = new Blob([array], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
    
 }

  //comparison report
  public exportAsCompReport(lstTemp,dctCompEx){
    let nowdate=Date.now();
    let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');
    let heading= dctCompEx['chartHead'];
    let timeperiod=dctCompEx['datFrom']+' to '+dctCompEx['datTo'];
    let compType=dctCompEx['compType'];
    let compType1=dctCompEx.lstComp[0]['str_name'].replace(/\w\S*/g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});
    let compType2=dctCompEx.lstComp[1]['str_name'].replace(/\w\S*/g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});

    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[""],[""],[""],
      [compType+":",compType1+" & "+compType2,],
      ["Reporting Period:",[timeperiod]],  
      ["Action Date:",mydate]
    ]);

    let num=lstTemp.length+9;

    const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,lstTemp,{origin:9});

    this.headerCenterStyle(ws.A1);
    this.headerCenterStyle(ws.A2);
    this.wrapAndCenterCell(worksheet.A10);
    this.wrapAndCenterCell(worksheet.B10);
    this.wrapAndCenterCell(worksheet.C10);

    for(let j=10;j<num+1;j++){
      for(let i=1;i<3;i++){
        var cellRef =XLSX.utils.encode_cell({r:j, c:i});
        this.cellStyle(worksheet[cellRef]);
      }
    }

    for(let i=10;i<num+1;i++){
      var cellRef =XLSX.utils.encode_cell({r:i, c:0});
      this.wrapAndCenterCell(worksheet[cellRef]);
    }

  

    var wscols = [
      {wch:20},
      {wch:50},
      {wch:50},
  ];
  ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:2}}];


  const wsrows: XLSX.RowInfo[] = [
    {hpt: 12}, // "points"
    {hpx: 16}, // "pixels"
    ,
    {hpx: 24, level:3},
    {hidden: true}, // hide row
    {hidden: false}
  ];
  // worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
  worksheet["!rows"]=wsrows
  worksheet["!cols"]= wscols;

  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const opts: any = { sheetFormat: { baseColWidth: '200' }, };
  const excelBuffer: any = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer,heading);


  }

}

