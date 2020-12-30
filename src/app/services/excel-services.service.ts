import { PurchaseComponent } from './../purchase/purchase/purchase.component';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { } from 'date-fns/is_this_second'
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

import * as ExcelProper from "exceljs";
import * as Excel from "exceljs/dist/exceljs.js";
import { Workbook } from 'exceljs/dist/exceljs.min.js';
// import { element } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class  ExcelServicesService{
constructor(
  public datepipe: DatePipe
  ) { }


// Using exceljs



generateExcel() {
    
  //Excel Title, Header, Data
  const title = 'Car Sell Report';
  const header = ["Year", "Month", "Make", "Model", "Quantity", "Pct"]
  const data = [
    [2007, 1, "Volkswagen ", "Volkswagen Passat", 1267, 10],
    [2007, 1, "Toyota ", "Toyota Rav4", 819, 6.5],
    [2007, 1, "Toyota ", "Toyota Avensis", 787, 6.2],
    [2007, 1, "Volkswagen ", "Volkswagen Golf", 720, 5.7],
    [2007, 1, "Toyota ", "Toyota Corolla", 691, 5.4],
    [2007, 1, "Peugeot ", "Peugeot 307", 481, 3.8],
    [2008, 1, "Toyota ", "Toyota Prius", 217, 2.2],
    [2008, 1, "Skoda ", "Skoda Octavia", 216, 2.2],
    [2008, 1, "Peugeot ", "Peugeot 308", 135, 1.4],
    [2008, 2, "Ford ", "Ford Mondeo", 624, 5.9],
    [2008, 2, "Volkswagen ", "Volkswagen Passat", 551, 5.2],
    [2008, 2, "Volkswagen ", "Volkswagen Golf", 488, 4.6],
    [2008, 2, "Volvo ", "Volvo V70", 392, 3.7],
    [2008, 2, "Toyota ", "Toyota Auris", 342, 3.2],
    [2008, 2, "Volkswagen ", "Volkswagen Tiguan", 340, 3.2],
    [2008, 2, "Toyota ", "Toyota Avensis", 315, 3],
    [2008, 2, "Nissan ", "Nissan Qashqai", 272, 2.6],
    [2008, 2, "Nissan ", "Nissan X-Trail", 271, 2.6],
    [2008, 2, "Mitsubishi ", "Mitsubishi Outlander", 257, 2.4],
    [2008, 2, "Toyota ", "Toyota Rav4", 250, 2.4],
    [2008, 2, "Ford ", "Ford Focus", 235, 2.2],
    [2008, 2, "Skoda ", "Skoda Octavia", 225, 2.1],
    [2008, 2, "Toyota ", "Toyota Yaris", 222, 2.1],
    [2008, 2, "Honda ", "Honda CR-V", 219, 2.1],
    [2008, 2, "Audi ", "Audi A4", 200, 1.9],
    [2008, 2, "BMW ", "BMW 3-serie", 184, 1.7],
    [2008, 2, "Toyota ", "Toyota Prius", 165, 1.6],
    [2008, 2, "Peugeot ", "Peugeot 207", 144, 1.4]
  ];

  //Create workbook and worksheet
  let workbook: ExcelProper.Workbook = new Excel.Workbook();
  let worksheet = workbook.addWorksheet('Car Data');

  //Add Row and formatting
  let titleRow = worksheet.addRow([title]);
  titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true}
  titleRow.alignment={vertical: 'middle', horizontal:'center'}
  worksheet.addRow([]);

  // let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')])

  //Add Image
  // let logo = workbook.addImage({
    // base64: logoFile.logoBase64,
    // extension: 'png',
  // });
  // worksheet.addImage(logo, 'E1:F3');
  worksheet.mergeCells('A1:D2');

  //Blank Row 
  worksheet.addRow([]);

  //Add Header Row
  let headerRow = worksheet.addRow(header);
  
  headerRow.font = { name: 'Comic Sans MS', family: 4, size: 12, bold: true }

  // Cell Style : Fill and Border
  headerRow.eachCell((cell, number) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' },
      bgColor: { argb: 'FF0000FF' }
    }
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  })

  // Add Data and Conditional Formatting


  data.forEach(d => {
    let row = worksheet.addRow(d);
    let qty = row.getCell(5);
    let color = 'FF99FF99';
    if (+qty.value < 500) {
      color = 'FF9999'
    }
    qty.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }
    }
    row.font = { name: 'Comic Sans MS',family: 4, size: 8 }

  }
  );
  // worksheet.addRows(data);

  worksheet.getColumn(3).width = 30;
  worksheet.getColumn(4).width = 30;
  worksheet.addRow([]);

  //Footer Row
  let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
  footerRow.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFCCFFE5' }
  };
  footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

  //Merge Cells
  worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

  //Generate Excel File with given name
  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, 'CarData.xlsx');
  })
}

generateExcelJs(dctTemp){ //Common method for export using ExcelJS

  const title = dctTemp['title'];
  const data = dctTemp['data'];

  let nowdate=Date.now();
  let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');
  let user=localStorage.getItem("Name");
  
  //Create workbook and worksheet
  let workbook: ExcelProper.Workbook = new Excel.Workbook();
  let worksheet = workbook.addWorksheet(title);


  //Formatting title
  let titleRow = worksheet.addRow([title]);
  titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true}
  titleRow.alignment={vertical: 'middle', horizontal:'center'}
  titleRow.eachCell((cell, number) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '87CEEB' },
      bgColor: { argb: 'FFFFFF' }
    }
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  })

  worksheet.addRow([]); //insert blank row

  // worksheet.mergeCells('A1:D2');

  worksheet.addRow([]);

  //Setting filter rows

  let firstRaw =["From Date: " +dctTemp['fromDat'],"","Taken By: "+user];
  let secondRaw = ["To Date: "+dctTemp['toDat'],"","Action Date: "+mydate];

  let filterRow1 = worksheet.addRow(firstRaw);
  let filterRow2 = worksheet.addRow(secondRaw);
  filterRow1.font = { name: 'Comic Sans MS', family: 4, size: 10, bold: true}
  filterRow2.font = { name: 'Comic Sans MS', family: 4, size: 10, bold: true}

  dctTemp.filters.forEach(element => {
    let filterRow3;
    filterRow3 = worksheet.addRow(element);
    filterRow3.font = { name: 'Comic Sans MS', family: 4, size: 10, bold: true};
  });

  worksheet.addRow([]);

  //Formatting table heading 

  let headerRow = worksheet.addRow(dctTemp.header);
  
  headerRow.font = { name: 'Comic Sans MS', family: 4, size: 12, bold: true }
  headerRow.alignment={vertical: 'middle', horizontal:'center'}

  // Cell Style : Fill and Border
  headerRow.eachCell((cell, number) => {
    cell.fill = {
      type: 'pattern',                                         
      pattern: 'solid',
      fgColor: { argb: 'C0C0C0'},
    }
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  })               

  worksheet.mergeCells(1,1,2,dctTemp.header.length); //Merging for title

  //Setting table datas

  data.forEach(d => {    
    let row = worksheet.addRow(d);
    row.font = { name: 'Comic Sans MS',family: 4, size: 10 }
    // row.eachCell((cell,number)=>{
      // console.log("@@@@@@@@@@d",d);
      
      // console.log("@@@@@@@@@@@cell",cell);
      // console.log("@@@@@@@@@@@cell['_value']['model']['value'] ",cell['_value']['model']['value']);
      // console.log("@@@@@@@@@@@cell['_value']['model']['value'] is number",(2).isNumber());

      // console.log("@@@@@@@@@@number",number);
      
      
      // cell.alignment = {horizontal:'right'}

    // })
  }
  );

  if(dctTemp.footer){
    //Footer Row
    let footerRow = worksheet.addRow(dctTemp.footer);
  
    footerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'B0C4DE' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

  }

  //Merge Cells
  // worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

  //Setting column width automatically

  let firstTableRowNum=headerRow.number;
  let lastTableRowNum=firstTableRowNum+(data.length);
  
  for (let i = 0; i < dctTemp.header.length; i += 1) { 
    const column = dctTemp.header[i];
    
    let colWidth=column.length;
    
    for (let j=firstTableRowNum; j<= lastTableRowNum; j++) {

      const row = worksheet.getRow(j);
      let rowCell = row.getCell(i+1);
      let txtLen = JSON.stringify(rowCell.text).length;
     
      if(txtLen>colWidth){
        colWidth=txtLen;
      }
    }

    worksheet.getColumn(i+1).width = colWidth+2;

    }


  //Generate Excel File with given name
  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, title+'.xlsx');
  })

}

generateDailySalesReport(json: any[],expjsondata){

const title = 'Daily Sales Report';
const data = json;

// console.log("json",json);
// console.log("expjsondata",expjsondata);


let nowdate=Date.now();
let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');
expjsondata['user']=localStorage.getItem("Name");

//Create workbook and worksheet
let workbook: ExcelProper.Workbook = new Excel.Workbook();
let worksheet = workbook.addWorksheet('Daily Sales Report');

//Add Row and formatting
let titleRow = worksheet.addRow([title]);
titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true}
titleRow.alignment={vertical: 'middle', horizontal:'center'}
titleRow.eachCell((cell, number) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'ECECEC' },
    bgColor: { argb: 'FFFFFF' }
  }
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
})

worksheet.addRow([]);

worksheet.mergeCells('A1:D2');

worksheet.addRow([]);

let firstTableRowNum=7;




let firstRaw = ["From Date: " +expjsondata['datFrom'],"","Taken By: "+expjsondata['user']];
let secondRaw = ["To Date: "+expjsondata['datTo'],"","Action Date: "+mydate];

let filterRow1 = worksheet.addRow(firstRaw);
let filterRow2 = worksheet.addRow(secondRaw);
filterRow1.font = { name: 'Comic Sans MS', family: 4, size: 10, bold: true}
filterRow2.font = { name: 'Comic Sans MS', family: 4, size: 10, bold: true}

let filterRow3;

  if(expjsondata['staff'] && !expjsondata['customer']){
    filterRow3 = worksheet.addRow(["Staff:",expjsondata['staff'],"","",""]);
    filterRow3.font = { name: 'Comic Sans MS', family: 4, size: 10, bold: true};
    firstTableRowNum=8;
  }
  else if(!expjsondata['staff'] && expjsondata['customer']){  
    filterRow3 = worksheet.addRow(["Customer:",expjsondata['customer'],"","",""]);
    filterRow3.font = { name: 'Comic Sans MS', family: 4, size: 10, bold: true};
    firstTableRowNum=8;
  }
  else if(expjsondata['staff'] && expjsondata['customer']){  
    filterRow3 = worksheet.addRow(["Staff:",expjsondata['staff'],"","Customer:",expjsondata['customer']]);
    filterRow3.font = { name: 'Comic Sans MS', family: 4, size: 10, bold: true};
    firstTableRowNum=8;
  }

  // worksheet.mergeCells('A4:G5');  

  worksheet.addRow([]);

  let header=[];

  let lstTemp=[];
  let count=0;
  let flag=0;
  header=[];

  data.forEach(d => {    
    let lstData=[];
      for(let key in d){     
        if(flag==0){
          header.push(key)
        }
        lstData.push(d[key]);
      }
      flag=1;

      count++;
      lstTemp.push(lstData);
  }
  );
  
  //Record table's last row
  let lastRowNum = count-1;//except footer raw
  const lastTableRowNum = lastRowNum+firstTableRowNum;
 
  let headerRow = worksheet.addRow(header);
  
  headerRow.font = { name: 'Comic Sans MS', family: 4, size: 12, bold: true }

  // Cell Style : Fill and Border
  headerRow.eachCell((cell, number) => {
    cell.fill = {
      type: 'pattern',                                         
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
    }
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  })               

  // console.log("######lstTemp",lstTemp);
  
  lstTemp.forEach(d => {    
    let row = worksheet.addRow(d);
    row.font = { name: 'Comic Sans MS',family: 4, size: 8 }

  }
  );


  //Setting column width automatically
  
  for (let i = 0; i < header.length; i += 1) { 
    const column = header[i];
    
    let colWidth=column.length;
    
    // worksheet.getColumn(i+1).width = colWidth+5;

    for (let j=firstTableRowNum; j<= lastTableRowNum; j++) {

      const row = worksheet.getRow(j);
      let rowCell = row.getCell(i+1);
      let txtLen = JSON.stringify(rowCell.text).length;
     
      if(txtLen>colWidth){
        colWidth=txtLen;
      }
    }

    worksheet.getColumn(i+1).width = colWidth+5;

    }
  
  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, 'dailysalesreport.xlsx');
  })

}











// Using XLSX 


public exportAsExcelFile(json: any[], excelFileName: string): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, excelFileName);
}

//-----using json data-------------------------------------------------------
public exportAsAyttendanceExcel(json: any[],expjsondata): void{

      console.log(json,expjsondata,"json , expjsondata");
  
  localStorage.setItem('chartexport','');
  // now: number;
  let nowdate=Date.now();
  let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');

  expjsondata['user']=localStorage.getItem("Name");
  
  let heading="                                                            BRANCH STOCK REPORT";
  let timeperiod=expjsondata['date']
  
  if(expjsondata['strItem'] && !expjsondata['strBranch'] &&!expjsondata['strItemGroup']){
    // console.log("0");
    
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[''],[''],
      ["Product:",expjsondata['strProduct'],"","Taken By:",expjsondata['user']],
      ["Brand:",expjsondata['strBrand'],"","Action Date:",mydate],
      // ["Branch:",expjsondata['strBranch']],
      ['Item:',expjsondata['strItem'],"","",""],

      // ['Employee:',strEmployee]
    ]); 
  }
  else if(expjsondata['strBranch'] && !expjsondata['strItem'] && !expjsondata['strItemGroup']){
    // console.log("1");
    
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[''],[''],
      ["Product:",expjsondata['strProduct'],"","Taken By:",expjsondata['user']],
      ["Brand:",expjsondata['strBrand'],"","Action Date:",mydate],
      ["Branch:",expjsondata['strBranch'],"","",""],
      // ['Item:',expjsondata['strItem']],
      // ['Employee:',strEmployee]
    ]); 
  }

  else if(expjsondata['strBranch'] && expjsondata['strItem'] &&  !expjsondata['strItemGroup']){
    // console.log("2");
    
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[''],[''],
      ["Product:",expjsondata['strProduct'],"","Taken By:",expjsondata['user']],
      ["Brand:",expjsondata['strBrand'],"","Action Date:",mydate],
      ["Branch:",expjsondata['strBranch'],"","","",],
      ['Item:',expjsondata['strItem'],"","",""],
      // ['Employee:',strEmployee]
    ]); 
  }
  else if(!expjsondata['strBranch'] && !expjsondata['strItem'] &&  expjsondata['strItemGroup']){
    // console.log("2");
    
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[''],[''],
      ["Product:",expjsondata['strProduct'],"","Taken By:",expjsondata['user']],
      ["Brand:",expjsondata['strBrand'],"","Action Date:",mydate],
      ['Item Group:',expjsondata['strItemGroup'],"","",""],

      // ['Employee:',strEmployee]
    ]); 
  }
  else if(!expjsondata['strBranch'] && expjsondata['strItem'] &&  expjsondata['strItemGroup']){
    // console.log("2");
    
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[''],[''],
      ["Product:",expjsondata['strProduct'],"","Taken By:",expjsondata['user']],
      ["Brand:",expjsondata['strBrand'],"","Action Date:",mydate],
      ['Item:',expjsondata['strItem'],"","",""],
      ['Item Group:',expjsondata['strItemGroup'],"","",""],

      // ['Employee:',strEmployee]
    ]); 
  }
  else if(expjsondata['strBranch'] && !expjsondata['strItem'] &&  expjsondata['strItemGroup']){
    // console.log("2");
    
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[''],[''],
      ["Product:",expjsondata['strProduct'],"","Taken By:",expjsondata['user']],
      ["Brand:",expjsondata['strBrand'],"","Action Date:",mydate],
      ["Branch:",expjsondata['strBranch'],"","","",],
      ['Item Group:',expjsondata['strItemGroup'],"","",""],

      // ['Employee:',strEmployee]
    ]); 
  }
  else if(expjsondata['strBranch'] && expjsondata['strItem'] &&  expjsondata['strItemGroup']){
    // console.log("2");
    
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[''],[''],
      ["Product:",expjsondata['strProduct'],"","Taken By:",expjsondata['user']],
      ["Brand:",expjsondata['strBrand'],"","Action Date:",mydate],
      ["Branch:",expjsondata['strBranch'],"","","",],
      ['Item:',expjsondata['strItem'],"","",""],
      ['Item Group:',expjsondata['strItemGroup'],"","",""],

      // ['Employee:',strEmployee]
    ]); 
  }

  else{
    // console.log("3");
    
    var ws = XLSX.utils.aoa_to_sheet([
      [heading],[''],[''],
      ["Product:",expjsondata['strProduct'],"","Taken By:",expjsondata['user']],
      ["Brand:",expjsondata['strBrand'],"","Action Date:",mydate],
      // ["Physical Location:",locData,],
    ]);
  }

  let num=json.length+9; 
//  const wsTot: XLSX.WorkSheet=XLSX.utils.sheet_add_json(ws,jsonTot,{origin: { c:0,r:num}});
 const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});   //json data showing after 9 th row
  
  this.headerCenterStyle(ws.A1);  //header
  this.headerCenterStyle(ws.A2);
  this.wrapAndCenterCell(worksheet.A10);
  this.wrapAndCenterCell(worksheet.B10);
  this.wrapAndCenterCell(worksheet.C10);
  this.wrapAndCenterCell(worksheet.D10);
  this.wrapAndCenterCell(worksheet.E10);
  let n=9;
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


  //set colounm width
  var wscols = [
    {wch:8},
    // {wch:35},
    {wch:17},
    {wch:25},
    {wch:15},
    {wch:15},
    // {wch:20}
];
var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:4}]
// worksheet["!rows"]=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:4}}]; //merged 1 and 2 cell for header

const wsrows: XLSX.RowInfo[] = [
  {hpt: 12}, // "points"
  {hpx: 16}, // "pixels"
  {hpx: 16, level:3},
  // {hidden: false}, // hide row
  // {hidden: false},
  {hpx: 16}, // "pixels"
  {hpx: 16}, // "pixels"
  {hpx: 16}, // "pixels"
  {hpx: 16}, // "pixels"
  {hpx: 16}, // "pixels"
  {hpx: 16}, // "pixels"
  {hpx: 24, level:3},


];
// worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
worksheet["!rows"]=wsrows
worksheet["!cols"]= wscols;
worksheet["!autofilter"]



  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const opts: any = { sheetFormat: { baseColWidth: '200' }, };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  // const excelBuffer: any = XLSXStyle.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  this.saveAsExcelFile(excelBuffer,'BranchStock');

}
//---------------------------------------------------------------------------


//-----using json data-------------------------------------------------------
public exportDailySalesReportExcel(json: any[],expjsondata): void{

  console.log(json,expjsondata,"json , expjsondata");

localStorage.setItem('chartexport','');
// now: number;
let nowdate=Date.now();
let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');

expjsondata['user']=localStorage.getItem("Name");

let heading="                                                            DAILY SALES REPORT";
let timeperiod=expjsondata['date']

if(expjsondata['staff'] && !expjsondata['customer']){
// console.log("0");

var ws = XLSX.utils.aoa_to_sheet([
  [heading],[''],[''],
  ["From Date:",expjsondata['datFrom'],"","Taken By:",expjsondata['user']],
  ["To Date:",expjsondata['datTo'],"","Action Date:",mydate],
  ["Staff:",expjsondata['staff'],"","",""],
  // ['Item:',expjsondata['strItem'],"","",""],
  // ['Employee:',strEmployee]
]); 
}
else if(!expjsondata['staff'] && expjsondata['customer']){
// console.log("1");

var ws = XLSX.utils.aoa_to_sheet([
  [heading],[''],[''],
  ["From Date:",expjsondata['datFrom'],"","Taken By:",expjsondata['user']],
  ["To Date:",expjsondata['datTo'],"","Action Date:",mydate],
  ["Customer:",expjsondata['customer'],"","",""],
  // ['Item:',expjsondata['strItem']],
  // ['Employee:',strEmployee]
]); 
}
else if(!expjsondata['staff'] && !expjsondata['customer']){
// console.log("2");

var ws = XLSX.utils.aoa_to_sheet([
  [heading],[''],[''],
  ["From Date:",expjsondata['datFrom'],"","Taken By:",expjsondata['user']],
  ["To Date:",expjsondata['datTo'],"","Action Date:",mydate],
  // ["Staff:",expjsondata['staff'],"","Customer:",expjsondata['customer']],
  // ['Employee:',strEmployee]
]); 
}

else{
// console.log("3");

var ws = XLSX.utils.aoa_to_sheet([
  [heading],[''],[''],
  ["From Date:",expjsondata['datFrom'],"","Taken By:",expjsondata['user']],
  ["To Date:",expjsondata['datTo'],"","Action Date:",mydate],
  ["Staff:",expjsondata['staff'],"","Customer:",expjsondata['customer']],
  // ['Employee:',strEmployee]
]); 
}

let num=json.length+11; 
//  const wsTot: XLSX.WorkSheet=XLSX.utils.sheet_add_json(ws,jsonTot,{origin: { c:0,r:num}});
const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});   //json data showing after 9 th row

this.headerCenterStyle(ws.A1);  //header
this.headerCenterStyle(ws.A2);
// this.wrapAndCenterCell(worksheet.A10);
// this.wrapAndCenterCell(worksheet.B10);
// this.wrapAndCenterCell(worksheet.C10);
// this.wrapAndCenterCell(worksheet.D10);
// this.wrapAndCenterCell(worksheet.E10);
// this.wrapAndCenterCell(worksheet.E10);
// this.wrapAndCenterCell(worksheet.E10);

let n=10;
// for(let j=11;j<num;j++){
// for(let i=1;i<5;i++){
//   var cellRef =XLSX.utils.encode_cell({r:j, c:i});
//   this.dataCellStyle(worksheet[cellRef]);
// }
// }
// var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
// this.totalCellStyle(worksheet[totalCellRef]);

// for( let i=1;i<5;i++){
// var cellRef =XLSX.utils.encode_cell({r:num, c:i});
// this.totalRowStyle(worksheet[cellRef]);

// }


//set colounm width
var wscols = [
{wch:10},
{wch:13},
{wch:25},
{wch:17},
{wch:25},
{wch:15},
{wch:15},
{wch:15},
{wch:15},
{wch:20},
{wch:20}

];
var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:4}]
// worksheet["!rows"]=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:4}}]; //merged 1 and 2 cell for header

const wsrows: XLSX.RowInfo[] = [
{hpt: 12}, // "points"
{hpx: 16}, // "pixels"
{hpx: 16, level:3},
// {hidden: false}, // hide row
// {hidden: false},
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 24, level:3},


];
// worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
worksheet["!rows"]=wsrows
worksheet["!cols"]= wscols;
worksheet["!autofilter"]



const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
const opts: any = { sheetFormat: { baseColWidth: '200' }, };
const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
// const excelBuffer: any = XLSXStyle.write(workbook, { bookType: 'xlsx', type: 'buffer' });
this.saveAsExcelFile(excelBuffer,'BranchStockReport');

}


//purchase report excel start


public exportPurchaseReportExcel(json: any[],expjsondata): void{

  // console.log(json,expjsondata,"json , expjsondata");

localStorage.setItem('chartexport','');
// now: number;
let nowdate=Date.now();
let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');

expjsondata['user']=localStorage.getItem("Name");

let heading="                                                            PURCHASE REPORT";
let timeperiod=expjsondata['date']

if(expjsondata['staff'] && !expjsondata['customer']){
// console.log("0");

var ws = XLSX.utils.aoa_to_sheet([
  [heading],[''],[''],
  ["From Date:",expjsondata['datFrom'],"","Taken By:",expjsondata['user']],
  ["To Date:",expjsondata['datTo'],"","Action Date:",mydate],
  ["Staff:",expjsondata['staff'],"","",""],
  // ['Item:',expjsondata['strItem'],"","",""],
  // ['Employee:',strEmployee]
]); 
}
else if(!expjsondata['staff'] && expjsondata['customer']){
// console.log("1");

var ws = XLSX.utils.aoa_to_sheet([
  [heading],[''],[''],
  ["From Date:",expjsondata['datFrom'],"","Taken By:",expjsondata['user']],
  ["To Date:",expjsondata['datTo'],"","Action Date:",mydate],
  ["Vendor:",expjsondata['customer'],"","",""],
  // ['Item:',expjsondata['strItem']],
  // ['Employee:',strEmployee]
]); 
}
else if(!expjsondata['staff'] && !expjsondata['customer']){
// console.log("2");

var ws = XLSX.utils.aoa_to_sheet([
  [heading],[''],[''],
  ["From Date:",expjsondata['datFrom'],"","Taken By:",expjsondata['user']],
  ["To Date:",expjsondata['datTo'],"","Action Date:",mydate],
  // ["Staff:",expjsondata['staff'],"","Customer:",expjsondata['customer']],
  // ['Employee:',strEmployee]
]); 
}

else{
// console.log("3");

var ws = XLSX.utils.aoa_to_sheet([
  [heading],[''],[''],
  ["From Date:",expjsondata['datFrom'],"","Taken By:",expjsondata['user']],
  ["To Date:",expjsondata['datTo'],"","Action Date:",mydate],
  ["Staff:",expjsondata['staff'],"","Vendor:",expjsondata['customer']],
  // ['Employee:',strEmployee]
]); 
}

let num=json.length+11; 
//  const wsTot: XLSX.WorkSheet=XLSX.utils.sheet_add_json(ws,jsonTot,{origin: { c:0,r:num}});
const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});   //json data showing after 9 th row

this.headerCenterStyle(ws.A1);  //header
this.headerCenterStyle(ws.A2);
// this.wrapAndCenterCell(worksheet.A10);
// this.wrapAndCenterCell(worksheet.B10);
// this.wrapAndCenterCell(worksheet.C10);
// this.wrapAndCenterCell(worksheet.D10);
// this.wrapAndCenterCell(worksheet.E10);
// this.wrapAndCenterCell(worksheet.E10);
// this.wrapAndCenterCell(worksheet.E10);

let n=10;
// for(let j=11;j<num;j++){
// for(let i=1;i<5;i++){
//   var cellRef =XLSX.utils.encode_cell({r:j, c:i});
//   this.dataCellStyle(worksheet[cellRef]);
// }
// }
// var totalCellRef=XLSX.utils.encode_cell({r:num, c:0})
// this.totalCellStyle(worksheet[totalCellRef]);

// for( let i=1;i<5;i++){
// var cellRef =XLSX.utils.encode_cell({r:num, c:i});
// this.totalRowStyle(worksheet[cellRef]);

// }


//set colounm width
var wscols = [
{wch:10},
{wch:15},
{wch:26},
{wch:17},
{wch:25},
{wch:15},
{wch:15},
{wch:15},
{wch:15},
{wch:20},
{wch:20}

];
var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:4}]
// worksheet["!rows"]=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:4}}]; //merged 1 and 2 cell for header

const wsrows: XLSX.RowInfo[] = [
{hpt: 12}, // "points"
{hpx: 16}, // "pixels"
{hpx: 16, level:3},
// {hidden: false}, // hide row
// {hidden: false},
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 24, level:3},


];
// worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
worksheet["!rows"]=wsrows
worksheet["!cols"]= wscols;
worksheet["!autofilter"]



const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
const opts: any = { sheetFormat: { baseColWidth: '200' }, };
const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
// const excelBuffer: any = XLSXStyle.write(workbook, { bookType: 'xlsx', type: 'buffer' });
this.saveAsExcelFile(excelBuffer,'PurchaseReport');

}


//purchase report excel end

public exportAsCahBookExcel(json: any[],expjsondata): void{

  console.log(json,expjsondata,"json , expjsondata");

localStorage.setItem('chartexport','');
// now: number;
let nowdate=Date.now();
let mydate=this.datepipe.transform(nowdate, 'dd-MM-yyyy, h:mm:s a');

expjsondata['user']=localStorage.getItem("Name");

let heading="                                                                   CASH BOOK";
let timeperiod=expjsondata['date']

if(expjsondata['strBranch']){
//   // console.log("0");

var ws = XLSX.utils.aoa_to_sheet([
  [heading],[''],[''],
  ["From Date:",expjsondata['datFrom'],"","Taken By:",expjsondata['user']],
  ["To Date:",expjsondata['datTo'],"","Action Date:",mydate],
  ["Branch:",expjsondata['strBranch']],

]); 
}
// else if(expjsondata['strBranch'] && !expjsondata['strItem']){
//   // console.log("1");

//   var ws = XLSX.utils.aoa_to_sheet([
//     [heading],[''],[''],
//     ["Product:",expjsondata['strProduct'],"","Taken By:",expjsondata['user']],
//     ["Brand:",expjsondata['strBrand'],"","Action Date:",mydate],
//     ["Branch:",expjsondata['strBranch'],"","",""],
//     // ['Item:',expjsondata['strItem']],
//     // ['Employee:',strEmployee]
//   ]); 
// }
// else if(expjsondata['strBranch'] && expjsondata['strItem']){
//   // console.log("2");

//   var ws = XLSX.utils.aoa_to_sheet([
//     [heading],[''],[''],
//     ["Product:",expjsondata['strProduct'],"","Taken By:",expjsondata['user']],
//     ["Brand:",expjsondata['strBrand'],"","Action Date:",mydate],
//     ["Branch:",expjsondata['strBranch'],"","","",],
//     ['Item:',expjsondata['strItem'],"","",""],
//     // ['Employee:',strEmployee]
//   ]); 
// }

else{
// console.log("3");

var ws = XLSX.utils.aoa_to_sheet([
  [heading],[''],[''],
  ["From Date:",expjsondata['datFrom'],"","Taken By:",expjsondata['user']],
  ["To Date:",expjsondata['datTo'],"","Action Date:",mydate],
  // ["Physical Location:",locData,],
]);
}

let num=json.length+9; 
//  const wsTot: XLSX.WorkSheet=XLSX.utils.sheet_add_json(ws,jsonTot,{origin: { c:0,r:num}});
const worksheet: XLSX.WorkSheet= XLSX.utils.sheet_add_json(ws,json,{origin:9});   //json data showing after 9 th row

this.headerCenterStyle(ws.A1);  //header
this.headerCenterStyle(ws.A2);
this.wrapAndCenterCell(worksheet.A10);
this.wrapAndCenterCell(worksheet.B10);
this.wrapAndCenterCell(worksheet.C10);
this.wrapAndCenterCell(worksheet.D10);
// this.wrapAndCenterCell(worksheet.E10);
let n=9;
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


//set colounm width
var wscols = [
{wch:8},
{wch:35},
{wch:10},
{wch:10},
// {wch:25},
// {wch:15},
// {wch:15},
// {wch:20}
];
var row_style=[{hpt:10},{hpt:4},{hpt:4},{hpt:4}]
// worksheet["!rows"]=[{hpt:10},{hpt:4},{hpt:4},{hpt:5}]
ws["!merges"]=[{s:{r:0,c:0},e:{r:1,c:4}}]; //merged 1 and 2 cell for header

const wsrows: XLSX.RowInfo[] = [
{hpt: 12}, // "points"
{hpx: 16}, // "pixels"
{hpx: 16, level:3},
// {hidden: false}, // hide row
// {hidden: false},
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 16}, // "pixels"
{hpx: 24, level:3},


];
// worksheet["!merges"]=[{s:{r:6,c:0},e:{r:6,c:7}}];
worksheet["!rows"]=wsrows
worksheet["!cols"]= wscols;
worksheet["!autofilter"]



const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
const opts: any = { sheetFormat: { baseColWidth: '200' }, };
const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
// const excelBuffer: any = XLSXStyle.write(workbook, { bookType: 'xlsx', type: 'buffer' });
this.saveAsExcelFile(excelBuffer,'CashBook');

}


//---------------------------------styling methods--------------------------------
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
//---------------------------------styling methods--------------------------------




private saveAsExcelFile(buffer: any, fileName: string): void {
   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
   FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
}
}
