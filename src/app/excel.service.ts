import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable(
  {
    providedIn: 'root'
  }
)
export class ExcelService {
constructor() { }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }

public exportExcel(excelData){

  let  datToday = moment()
  
  const title = excelData.title;
  const header = excelData.headers
  const data = excelData.data;

  //Create a workbook with a worksheet
  let workbook = new Workbook();
  let worksheet = workbook.addWorksheet('Job Data');

  //Add Row and formatting
  worksheet.mergeCells('A1', 'F4');
  let titleRow = worksheet.getCell('A1');
  titleRow.value = title
  titleRow.font = {
    name: 'Calibri',
    size: 12,
    underline: 'single',
    bold: true,
    color: { argb: '0085A3' }
  }
  titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

  worksheet.mergeCells('A5','F5')

  worksheet.mergeCells('A6','C6')
  worksheet.mergeCells('D6','F6')
  worksheet.getCell('A6').value = 'Date'
  worksheet.getCell('D6').value = datToday.format('YYYY-MM-DD hh:mm a')

  worksheet.mergeCells('A7','C7')
  worksheet.mergeCells('D7','F7')
  worksheet.getCell('A7').value = 'Staff'
  worksheet.getCell('D7').value = localStorage.getItem('userFullName')

  worksheet.mergeCells('A8:F8');

  //Adding Header Row
  worksheet.mergeCells('A9:C9');
  worksheet.mergeCells('D9:F9');
  let headerRow = worksheet.getRow(9);
  worksheet.getCell('A9').value=header[0];
  worksheet.getCell('D9').value=header[1];

  headerRow.eachCell((cell, number) => {

    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' }
    }
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFF' },
      size: 12
    }
  })
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }

  // Adding Data with Conditional Formatting

  let rownum = 10
  data.forEach(d => {

    worksheet.mergeCells(rownum,1,rownum,3);
    worksheet.mergeCells(rownum,4,rownum,6);

    let row1=worksheet.getRow(rownum)
    row1.getCell(1).value=d[0];
    row1.getCell(4).value=d[1];

    rownum=rownum+1
  });

  worksheet.mergeCells(rownum,1,rownum,6);
  
  //Generate & Save Excel File
  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, title + '.xlsx');
  })

}

}